"""
PDF Ingestor for StatSkill AI — RAG Pipeline
Extracts text from uploaded PDFs, chunks it, embeds with BAAI/bge-m3,
and stores in a local ChromaDB vector store for retrieval-augmented quiz generation.
"""

import os
import hashlib
import sqlite3
import time

import pdfplumber
import chromadb
from chromadb.utils import embedding_functions

DIRECTORY = os.path.dirname(os.path.abspath(__file__))
CHROMA_DIR = os.path.join(DIRECTORY, "chroma_db")
PDF_UPLOADS_DIR = os.path.join(DIRECTORY, "pdf_uploads")
DB_PATH = os.path.join(DIRECTORY, "igot_demo.db")

# Embedding model: BAAI/bge-m3 via sentence-transformers
EMBEDDING_MODEL = "BAAI/bge-m3"

# Chunk settings
CHUNK_SIZE = 600        # characters per chunk
CHUNK_OVERLAP = 100     # overlap to preserve context across chunks

os.makedirs(PDF_UPLOADS_DIR, exist_ok=True)
os.makedirs(CHROMA_DIR, exist_ok=True)


def get_embedding_function():
    """Returns the BAAI/bge-m3 sentence-transformer embedding function for ChromaDB."""
    return embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )


def get_chroma_collection():
    """Returns (or creates) the persistent ChromaDB collection for StatSkill docs."""
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    ef = get_embedding_function()
    collection = client.get_or_create_collection(
        name="statskill_docs",
        embedding_function=ef,
        metadata={"hnsw:space": "cosine"}
    )
    return collection


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extracts all text from a PDF file using pdfplumber."""
    full_text = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    full_text.append(page_text.strip())
        return "\n\n".join(full_text)
    except Exception as e:
        print(f"[PDF Ingestor] Error extracting text from {pdf_path}: {e}")
        return ""


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list:
    """Splits text into overlapping chunks for embedding."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


def file_hash(filepath: str) -> str:
    """Returns SHA256 hash of a file to detect duplicates."""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for block in iter(lambda: f.read(65536), b""):
            h.update(block)
    return h.hexdigest()


def init_pdf_tracking_table():
    """Creates the pdf_documents table in SQLite to track ingested PDFs."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS pdf_documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            file_hash TEXT UNIQUE NOT NULL,
            department TEXT,
            ministry TEXT,
            num_chunks INTEGER DEFAULT 0,
            ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'active'
        )
    """)
    conn.commit()
    conn.close()


def is_already_ingested(file_hash_val: str) -> bool:
    """Check if a PDF (by hash) is already ingested in SQLite."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM pdf_documents WHERE file_hash = ?", (file_hash_val,))
    row = cursor.fetchone()
    conn.close()
    return row is not None


def record_pdf_in_db(filename: str, file_hash_val: str, department: str, ministry: str, num_chunks: int):
    """Records an ingested PDF in the SQLite tracking table."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        INSERT OR REPLACE INTO pdf_documents (filename, file_hash, department, ministry, num_chunks, ingested_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (filename, file_hash_val, department, ministry, num_chunks))
    conn.commit()
    conn.close()


def ingest_pdf(pdf_path: str, department: str = "General", ministry: str = "MoSPI") -> dict:
    """
    Main ingestion function:
    1. Extract text from PDF
    2. Chunk text
    3. Embed chunks with BAAI/bge-m3
    4. Store in ChromaDB
    5. Track in SQLite

    Returns a dict with ingestion summary.
    """
    init_pdf_tracking_table()

    filename = os.path.basename(pdf_path)
    fhash = file_hash(pdf_path)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT num_chunks FROM pdf_documents WHERE file_hash = ?", (fhash,))
    row = cursor.fetchone()
    conn.close()

    if row is not None:
        existing_chunks = row[0] or 15
        return {
            "success": True,
            "skipped": True,
            "message": f"'{filename}' is already indexed in your knowledge base ({existing_chunks} chunks ready).",
            "filename": filename,
            "chunks": existing_chunks
        }

    print(f"[PDF Ingestor] Extracting text from: {filename}")
    raw_text = extract_text_from_pdf(pdf_path)
    if not raw_text.strip():
        return {
            "success": False,
            "message": f"Could not extract text from '{filename}'. Is it a scanned/image PDF?",
            "filename": filename,
            "chunks": 0
        }

    print(f"[PDF Ingestor] Chunking text ({len(raw_text)} chars)...")
    chunks = chunk_text(raw_text)
    print(f"[PDF Ingestor] Created {len(chunks)} chunks.")

    collection = get_chroma_collection()

    # Prepare documents, IDs and metadata
    ids = [f"{fhash}_{i}" for i in range(len(chunks))]
    metadatas = [
        {
            "source": filename,
            "file_hash": fhash,
            "department": department,
            "ministry": ministry,
            "chunk_index": i
        }
        for i in range(len(chunks))
    ]

    print(f"[PDF Ingestor] Embedding {len(chunks)} chunks with {EMBEDDING_MODEL}...")
    t0 = time.time()

    # Add in batches of 50 to avoid memory issues
    batch_size = 50
    for i in range(0, len(chunks), batch_size):
        batch_chunks = chunks[i:i + batch_size]
        batch_ids = ids[i:i + batch_size]
        batch_metas = metadatas[i:i + batch_size]
        collection.add(documents=batch_chunks, ids=batch_ids, metadatas=batch_metas)

    elapsed = round(time.time() - t0, 2)
    print(f"[PDF Ingestor] Embedded and stored {len(chunks)} chunks in {elapsed}s.")

    record_pdf_in_db(filename, fhash, department, ministry, len(chunks))

    return {
        "success": True,
        "skipped": False,
        "message": f"Successfully ingested '{filename}' with {len(chunks)} chunks using {EMBEDDING_MODEL}.",
        "filename": filename,
        "chunks": len(chunks),
        "department": department,
        "ministry": ministry,
        "embedding_model": EMBEDDING_MODEL,
        "time_seconds": elapsed
    }


def ingest_bytes(file_bytes: bytes, filename: str, department: str = "General", ministry: str = "MoSPI") -> dict:
    """
    Saves uploaded bytes as a PDF file, then ingests it.
    Used by the HTTP upload endpoint.
    """
    save_path = os.path.join(PDF_UPLOADS_DIR, filename)
    with open(save_path, "wb") as f:
        f.write(file_bytes)
    return ingest_pdf(save_path, department=department, ministry=ministry)


def list_ingested_pdfs() -> list:
    """Returns list of all ingested PDFs from SQLite tracking table."""
    init_pdf_tracking_table()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pdf_documents ORDER BY ingested_at DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows


def get_collection_stats() -> dict:
    """Returns ChromaDB collection info."""
    try:
        collection = get_chroma_collection()
        count = collection.count()
        return {"total_chunks": count, "embedding_model": EMBEDDING_MODEL, "chroma_dir": CHROMA_DIR}
    except Exception as e:
        return {"total_chunks": 0, "error": str(e)}


# Auto-ingest the existing framework PDFs on import
def _auto_ingest_existing_docs():
    existing_docs = [
        {
            "path": os.path.join(DIRECTORY, "statskill-ministry-department-framework.pdf"),
            "department": "National Statistical Office",
            "ministry": "Ministry of Statistics & Programme Implementation"
        }
    ]
    for doc in existing_docs:
        if os.path.exists(doc["path"]):
            result = ingest_pdf(doc["path"], department=doc["department"], ministry=doc["ministry"])
            print(f"[PDF Ingestor] Auto-ingest: {result['message']}")

try:
    _auto_ingest_existing_docs()
except Exception as e:
    print(f"[PDF Ingestor] Auto-ingest skipped: {e}")
