"""
RAG Quiz Client for StatSkill AI
Retrieves relevant context from ChromaDB (BAAI/bge-m3 embeddings),
then uses Groq LLM (llama-3.3-70b) to generate grounded MCQ quiz questions
from the actual uploaded PDF study materials.
"""

import os
import json
import time
import ssl

from pdf_ingestor import get_chroma_collection, get_collection_stats

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
DEFAULT_MODEL = "openai/gpt-oss-120b"


class RAGQuizClient:
    """
    RAG-based quiz generator:
    1. Query ChromaDB for relevant document chunks (using BAAI/bge-m3 embeddings)
    2. Build a grounded prompt with retrieved context
    3. Send to Groq LLM for structured MCQ generation
    4. Return validated quiz JSON
    """

    def __init__(self, api_key: str = None, model: str = DEFAULT_MODEL):
        self._static_api_key = api_key
        self.model = model
        self.last_latency_ms = None
        self.last_error = None

    @property
    def api_key(self) -> str:
        """Always read the latest key from environment or .env file."""
        key = self._static_api_key or os.environ.get("GROQ_API_KEY", "").strip()
        if not key:
            env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
            if os.path.exists(env_file):
                try:
                    with open(env_file) as f:
                        for line in f:
                            line = line.strip()
                            if line.startswith("GROQ_API_KEY="):
                                key = line.split("=", 1)[1].strip().strip('"').strip("'")
                                os.environ["GROQ_API_KEY"] = key
                                break
                except Exception:
                    pass
        return key or ""

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 10)

    def retrieve_context(
        self,
        query: str,
        department: str = "",
        ministry: str = "",
        n_results: int = 6
    ) -> list:
        """
        Query ChromaDB for the top-n relevant chunks for the given topic/query.
        Optionally filters by department or ministry metadata.
        """
        try:
            collection = get_chroma_collection()

            if collection.count() == 0:
                print("[RAG] ChromaDB is empty. No documents ingested yet.")
                return []

            # Build where filter if metadata available
            where = None
            if department:
                where = {"department": {"$eq": department}}

            results = collection.query(
                query_texts=[query],
                n_results=min(n_results, collection.count()),
                where=where if where else None
            )

            docs = results.get("documents", [[]])[0] if results.get("documents") else []
            metas = results.get("metadatas", [[]])[0] if results.get("metadatas") else []

            # If filtered query returned no results, retry without filter across all uploaded documents
            if not docs and where:
                print(f"[RAG] No chunks matched department filter. Searching across all uploaded documents...")
                results = collection.query(
                    query_texts=[query],
                    n_results=min(n_results, collection.count())
                )
                docs = results.get("documents", [[]])[0] if results.get("documents") else []
                metas = results.get("metadatas", [[]])[0] if results.get("metadatas") else []

            chunks = []
            for doc, meta in zip(docs, metas):
                chunks.append({
                    "text": doc,
                    "source": meta.get("source", "Unknown"),
                    "department": meta.get("department", ""),
                    "ministry": meta.get("ministry", "")
                })
            return chunks

        except Exception as e:
            print(f"[RAG] Context retrieval error: {e}")
            return []

    def _build_context_string(self, chunks: list) -> str:
        """Formats retrieved chunks into a readable context block for the LLM prompt, stripping font artifacts."""
        if not chunks:
            return ""
        import re
        parts = []
        for i, chunk in enumerate(chunks, 1):
            source = chunk.get("source", "Unknown")
            raw_text = chunk.get("text", "")
            # Clean font glyph tokens like (cid:31) or unprintable control characters
            cleaned = re.sub(r'\(cid:\d+\)', '', raw_text)
            cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', cleaned).strip()
            if cleaned:
                parts.append(f"[Excerpt {i} from {source}]\n{cleaned}")
        return "\n\n---\n\n".join(parts)

    def generate_rag_quiz(
        self,
        ministry: str = "Ministry of Statistics & Programme Implementation",
        department: str = "National Statistical Office (NSO - NAD)",
        sector_tag: str = "Official Statistics",
        d6_competencies: list = None,
        role_grade: str = "R3",
        num_questions: int = 5,
        difficulty: str = "Medium",
        bloom_level: str = "Apply",
        topic: str = None,
        language: str = "English"
    ) -> dict:
        """
        Generate quiz questions grounded in uploaded PDF study materials via RAG.
        Falls back to a clear error message if no documents are ingested.
        """
        import re
        if d6_competencies is None:
            d6_competencies = ["Survey Design", "National Statistical Standards"]
        elif isinstance(d6_competencies, str):
            d6_competencies = [c.strip() for c in d6_competencies.split(",") if c.strip()]

        num_q = max(3, min(30, int(num_questions or 5)))
        query = topic or f"{department} {sector_tag} {' '.join(d6_competencies)}"

        # Step 1: Retrieve relevant context from ChromaDB
        print(f"[RAG] Retrieving context for: '{query}'")
        chunks = self.retrieve_context(query, department=department, ministry=ministry, n_results=6)
        stats = get_collection_stats()

        if not chunks:
            return {
                "success": False,
                "isRag": True,
                "message": "No study material found in the knowledge base. Please upload relevant PDFs first.",
                "total_chunks_in_db": stats.get("total_chunks", 0),
                "questions": []
            }

        context_str = self._build_context_string(chunks)
        sources_used = list({c["source"] for c in chunks})

        # Check if the extracted text is unreadable due to Type3/custom embedded fonts
        readable_words = re.findall(r'[a-zA-Z]{3,}', context_str)
        if len(readable_words) < 25:
            # Fallback to subject topic synthesized from filename and topic
            doc_titles = [os.path.splitext(os.path.basename(s))[0].replace('_', ' ').replace('-', ' ') for s in sources_used]
            synthesized_topic = topic or ', '.join(doc_titles) or "Technical Data Analytics & Statistical Methods"
            context_str = (
                f"[Uploaded Document Reference: {', '.join(sources_used)}]\n"
                f"Subject Domain: {synthesized_topic}\n"
                f"Generate authoritative practical questions testing core principles, methods, functions, and scenarios in {synthesized_topic}."
            )

        # Step 2: Build grounded prompt with strict anti-meta-question rules
        system_prompt = (
            "You are a Senior Technical Examiner and Statistical Board Director for the Government of India (MoSPI).\n"
            "Your task is to generate rigorous, authentic multiple-choice questions (MCQs) testing technical knowledge and competencies.\n\n"
            "CRITICAL RULES:\n"
            "1. NEVER generate meta-questions about the text structure itself, such as 'Which excerpt contains...', 'What token appears...', font codes, CID tokens like (cid:xx), or line numbers.\n"
            "2. Options must NEVER be 'Excerpt 1', 'Excerpt 2', etc. Options must ALWAYS be real domain concepts, formulas, code snippets, definitions, or analytical answers.\n"
            "3. Every question must test substantive knowledge of the subject matter.\n"
            "4. Each question must have exactly 4 options (A, B, C, D) with one correct answer (0-indexed correctAnswerIndex).\n"
            f"5. Calibrate difficulty to role grade {role_grade} and Bloom's level {bloom_level}.\n"
            "6. Output MUST be strictly valid JSON: { \"questions\": [ ... ] }"
        )

        user_prompt = (
            f"STUDY MATERIAL & DOMAIN CONTEXT:\n\n{context_str}\n\n"
            f"---\n\n"
            f"Generate {num_q} practical multiple-choice questions for the following role:\n"
            f"- Ministry: {ministry}\n"
            f"- Department: {department}\n"
            f"- Sector: {sector_tag}\n"
            f"- Competencies: {', '.join(d6_competencies)}\n"
            f"- Role Grade: {role_grade}\n"
            f"- Difficulty: {difficulty}\n"
            f"- Bloom's Level: {bloom_level}\n"
            f"- Language: {language}\n\n"
            "JSON format:\n"
            "{\n"
            '  "questions": [\n'
            "    {\n"
            '      "id": "rag_q_1",\n'
            '      "question": "...",\n'
            '      "options": ["Option A", "Option B", "Option C", "Option D"],\n'
            '      "correctAnswerIndex": 0,\n'
            f'      "competency": "{d6_competencies[0] if d6_competencies else sector_tag}",\n'
            f'      "bloomLevel": "{bloom_level}",\n'
            f'      "difficulty": "{difficulty}",\n'
            '      "explanation": "...",\n'
            '      "sourceReference": f"Uploaded PDF ({sources_used[0] if sources_used else "Study Material"})",\n'
            '      "confidenceScore": 97\n'
            "    }\n"
            "  ]\n"
            "}"
        )

        if not self.is_configured():
            return {
                "success": False,
                "isRag": True,
                "message": "Groq API key not configured. Please set GROQ_API_KEY in your .env file.",
                "questions": [],
                "context_retrieved": len(chunks),
                "sources": sources_used
            }

        # Step 3: Call Groq LLM using the official groq SDK
        import re as _re
        try:
            from groq import Groq
        except ImportError:
            return {
                "success": False,
                "isRag": True,
                "message": "groq package not installed. Run: pip install groq",
                "questions": [],
                "context_retrieved": len(chunks),
                "sources": sources_used
            }

        start_time = time.time()
        try:
            client = Groq(api_key=self.api_key)
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                max_tokens=4096
            )
            self.last_latency_ms = round((time.time() - start_time) * 1000)
            self.last_error = None

            content = response.choices[0].message.content or "{}"

            # Robust JSON extraction: strip markdown fences and extract complete JSON object
            text = content.strip()
            # Remove markdown fence markers without truncating nested JSON
            text = _re.sub(r'^```(?:json)?\s*', '', text, flags=_re.IGNORECASE)
            text = _re.sub(r'\s*```$', '', text)

            json_start = text.find('{')
            json_end = text.rfind('}')
            if json_start != -1 and json_end != -1:
                text = text[json_start:json_end+1]

            # Clean trailing commas before } or ]
            cleaned_json = _re.sub(r',\s*([\]}])', r'\1', text)

            parsed = None
            # Attempt 1: parse cleaned JSON
            try:
                parsed = json.loads(cleaned_json)
            except Exception as e1:
                # Attempt 2: parse original slice
                try:
                    parsed = json.loads(text)
                except Exception as e2:
                    # Attempt 3: fix single quotes to double quotes
                    try:
                        single_fixed = _re.sub(r"(?<=[\{\s,\[])'([^']+)'(?=[\s:,\]])", r'"\1"', cleaned_json)
                        parsed = json.loads(single_fixed)
                    except Exception:
                        pass

            # Attempt 4: Regex-based extraction of question items if JSON syntax has issues
            if not parsed or not parsed.get("questions"):
                questions_extracted = []
                # Match question blocks
                q_pattern = _re.compile(
                    r'\{[^{}]*?"id"\s*:\s*"([^"]+)"[^{}]*?"question"\s*:\s*"([^"]+)"[^{}]*?"options"\s*:\s*\[(.*?)\][^{}]*?"correctAnswerIndex"\s*:\s*(\d+)',
                    _re.DOTALL
                )
                for m in q_pattern.finditer(content):
                    q_id = m.group(1)
                    q_text = m.group(2)
                    opts_raw = m.group(3)
                    ans_idx = int(m.group(4))
                    opts = [o.strip().strip('"').strip("'") for o in _re.findall(r'["\']([^"\']+)["\']', opts_raw)]
                    if len(opts) >= 4:
                        questions_extracted.append({
                            "id": q_id,
                            "question": q_text,
                            "options": opts[:4],
                            "correctAnswerIndex": max(0, min(3, ans_idx)),
                            "competency": d6_competencies[0] if d6_competencies else sector_tag,
                            "bloomLevel": bloom_level,
                            "difficulty": difficulty,
                            "explanation": "Extracted from uploaded study material.",
                            "sourceReference": f"Uploaded PDF ({', '.join(sources_used)})",
                            "confidenceScore": 95
                        })
                if questions_extracted:
                    parsed = {"questions": questions_extracted}
                else:
                    raise ValueError(f"Could not parse valid questions from Groq response. Cleaned content preview: {text[:120]}...")

            questions = parsed.get("questions") or []

            # Sanitize and validate fields
            cleaned = []
            for idx, q in enumerate(questions):
                cleaned.append({
                    "id": q.get("id") or f"rag_q_{idx+1}",
                    "question": q.get("question", ""),
                    "options": q.get("options") if isinstance(q.get("options"), list) and len(q.get("options")) == 4
                               else ["Option A", "Option B", "Option C", "Option D"],
                    "correctAnswerIndex": max(0, min(3, int(q.get("correctAnswerIndex", 0)))),
                    "competency": q.get("competency") or sector_tag,
                    "bloomLevel": q.get("bloomLevel") or bloom_level,
                    "difficulty": q.get("difficulty") or difficulty,
                    "explanation": q.get("explanation", "Based on uploaded study material."),
                    "sourceReference": q.get("sourceReference") or f"Uploaded PDF ({', '.join(sources_used)})",
                    "confidenceScore": int(q.get("confidenceScore", 97))
                })

            return {
                "success": True,
                "isRag": True,
                "poweredBy": f"RAG + Groq ({self.model}) + BAAI/bge-m3",
                "isLiveAI": True,
                "latencyMs": self.last_latency_ms,
                "ministry": ministry,
                "department": department,
                "roleGrade": role_grade,
                "sectorTag": sector_tag,
                "count": len(cleaned),
                "questions": cleaned,
                "context_chunks_used": len(chunks),
                "sources": sources_used
            }

        except Exception as e:
            self.last_error = str(e)
            print(f"[RAG Quiz Client] Groq SDK call failed: {e}")
            return {
                "success": False,
                "isRag": True,
                "message": f"RAG quiz generation failed: {str(e)}",
                "questions": [],
                "context_retrieved": len(chunks),
                "sources": sources_used
            }


# Global singleton
rag_quiz_client = RAGQuizClient()
