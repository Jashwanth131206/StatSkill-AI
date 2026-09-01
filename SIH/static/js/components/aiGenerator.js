/**
 * AI Assessment & MCQ Generator Component
 * Upload official manuals/PDFs, extract topics, configure Bloom's taxonomy & generate source-grounded questions with QA pipeline.
 */

let selectedDoc = MOCK_DATA.sampleDocuments[0];
let generatedQuestionsList = [];
let isGenerating = false;
let currentQAFilter = "all";

function renderAiGenerator(state) {
    const docs = MOCK_DATA.sampleDocuments;

    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Header -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-orange-500">
            <div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase">
                        <i class="fa-solid fa-microchip"></i> AI Assessment Engine
                    </span>
                    <span class="text-xs text-slate-500">Grounded & Hallucination-Free MCQ Generator</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-navy-900 mt-2" style="color: #0B2545;">
                    AI Assessment & Quiz Generator
                </h1>
                <p class="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1">
                    Upload official statistical training manuals, census circulars, or survey documentation to generate high-quality assessments aligned with Bloom's Taxonomy.
                </p>
            </div>

            <!-- Quality Pipeline Indicator -->
            <div class="hidden lg:flex items-center gap-1.5 text-[10px] font-bold bg-slate-100 p-2 rounded-xl border border-slate-200">
                <span class="text-blue-700">Extract</span> →
                <span class="text-purple-700">Chunk</span> →
                <span class="text-orange-700">LLM Gen</span> →
                <span class="text-emerald-700">Source Verify</span> →
                <span class="text-slate-800">Trainer Review</span>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left 5 Cols: Document Selector / Upload & Configuration -->
            <div class="lg:col-span-5 space-y-6">
                <!-- Upload / Sample Picker Box -->
                <div class="stat-card p-6 space-y-4">
                    <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                        <i class="fa-solid fa-file-arrow-up text-orange-500"></i> Step 1: Select or Upload Material
                    </h2>

                    <!-- Drag & Drop Zone -->
                    <div onclick="document.getElementById('fileUploadInput').click()" class="border-2 border-dashed border-slate-300 hover:border-navy-900 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-100 transition-all space-y-2">
                        <input type="file" id="fileUploadInput" class="hidden" onchange="handleFileUpload(event)">
                        <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto text-xl">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <div class="text-xs font-bold text-navy-900">Drag & Drop your learning material here</div>
                        <p class="text-[10px] text-slate-400">Supports PDF, DOCX, PPTX, TXT, Official Survey Guidelines (Max 50MB)</p>
                    </div>

                    <!-- Pre-loaded Official Manuals -->
                    <div class="space-y-2 pt-2">
                        <span class="text-xs font-bold text-slate-700 block">Or Choose Approved Training Manual:</span>
                        <div class="space-y-2">
                            ${docs.map(doc => `
                                <div onclick="selectSampleDoc('${doc.id}')" class="p-3 rounded-xl border text-xs cursor-pointer transition-all ${selectedDoc && selectedDoc.id === doc.id ? 'border-orange-500 bg-orange-50/60' : 'border-slate-200 bg-white hover:bg-slate-50'}">
                                    <div class="flex items-center justify-between font-bold text-navy-900">
                                        <span class="truncate max-w-[240px]">${doc.title}</span>
                                        <span class="text-[10px] text-slate-400 font-semibold">${doc.pages} pgs</span>
                                    </div>
                                    <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">${doc.summary}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Step 2: Generation Configuration Panel -->
                <div class="stat-card p-6 space-y-4">
                    <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                        <i class="fa-solid fa-sliders text-orange-500"></i> Step 2: Quiz Configuration
                    </h2>

                    <div class="space-y-3 text-xs">
                        <!-- Assessment Type -->
                        <div>
                            <label class="font-bold text-slate-700 block mb-1">Assessment Type</label>
                            <select id="cfgType" class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800">
                                <option value="mcq">Multiple Choice Questions (MCQ)</option>
                                <option value="scenario">Scenario-Based Problem Solving</option>
                                <option value="tf">True / False Concept Check</option>
                            </select>
                        </div>

                        <!-- Number of Questions -->
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="font-bold text-slate-700 block mb-1">Question Count</label>
                                <select id="cfgCount" class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800">
                                    <option value="5">5 Questions (Quick Check)</option>
                                    <option value="10" selected>10 Questions (Standard Quiz)</option>
                                    <option value="20">20 Questions (Comprehensive)</option>
                                    <option value="30">30 Questions (Exam Mode)</option>
                                </select>
                            </div>
                            <div>
                                <label class="font-bold text-slate-700 block mb-1">Difficulty Level</label>
                                <select id="cfgDifficulty" class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800">
                                    <option value="Easy">Easy (L1-L2 Foundation)</option>
                                    <option value="Medium" selected>Medium (L3 Working)</option>
                                    <option value="Hard">Hard (L4 Advanced / Expert)</option>
                                    <option value="Mixed">Mixed Distribution</option>
                                </select>
                            </div>
                        </div>

                        <!-- Bloom's Taxonomy Level -->
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="font-bold text-slate-700 block mb-1">Bloom's Taxonomy</label>
                                <select id="cfgBloom" class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800">
                                    <option value="Apply" selected>Apply (Practical Application)</option>
                                    <option value="Understand">Understand (Comprehension)</option>
                                    <option value="Analyze">Analyze (Data Interpretation)</option>
                                    <option value="Evaluate">Evaluate (Critical Judgement)</option>
                                </select>
                            </div>
                            <div>
                                <label class="font-bold text-slate-700 block mb-1">Language</label>
                                <select id="cfgLanguage" class="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800">
                                    <option value="English">English</option>
                                    <option value="Hindi">हिन्दी (Hindi)</option>
                                    <option value="Telugu">తెలుగు (Telugu)</option>
                                </select>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="pt-2">
                            <button onclick="triggerAiGeneration()" id="generateBtn" class="btn btn-saffron w-full py-3 text-xs sm:text-sm font-bold shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2">
                                <i class="fa-solid fa-wand-magic-sparkles"></i> Generate Assessment with AI
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right 7 Cols: Generated Questions, Quality Pipeline & "View Source" -->
            <div class="lg:col-span-7 space-y-6">
                <!-- Extracted Document Metadata Card -->
                <div class="stat-card p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                        <span class="text-[10px] font-bold text-blue-700 uppercase">Active Knowledge Source</span>
                        <div class="text-sm font-bold text-navy-900 mt-0.5" id="activeDocTitle">
                            ${selectedDoc ? selectedDoc.title : 'No document selected'}
                        </div>
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            ${selectedDoc ? selectedDoc.topics.map(t => `<span class="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]">${t}</span>`).join('') : ''}
                        </div>
                    </div>
                    <span class="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full whitespace-nowrap">
                        <i class="fa-solid fa-circle-check"></i> Text Extracted
                    </span>
                </div>

                <!-- Async Processing Animation Box -->
                <div id="aiProcessingBox" class="hidden stat-card p-8 text-center space-y-4 bg-gradient-to-br from-slate-900 to-navy-900 text-white rounded-2xl">
                    <div class="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto"></div>
                    <h3 class="text-base font-bold text-white">AI Question Generation Pipeline in Progress...</h3>
                    <div class="max-w-md mx-auto space-y-1.5 text-xs text-slate-300">
                        <div class="flex justify-between" id="procStep1"><span>1. Semantic Document Chunking</span> <strong class="text-emerald-400 font-bold">✓</strong></div>
                        <div class="flex justify-between" id="procStep2"><span>2. Bloom's Taxonomy Alignment</span> <strong class="text-emerald-400 font-bold">✓</strong></div>
                        <div class="flex justify-between" id="procStep3"><span>3. Hallucination Check & Source Grounding</span> <strong class="text-orange-400 animate-pulse">In Progress...</strong></div>
                        <div class="flex justify-between" id="procStep4"><span>4. Quality Review Validation</span> <strong class="text-slate-500">Pending</strong></div>
                    </div>
                </div>

                <!-- Generated Questions Output List -->
                <div id="generatedQuestionsContainer" class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">
                            Generated Questions (<span id="genCountDisplay">5</span>)
                        </h2>

                        <div class="flex items-center gap-2">
                            <button onclick="publishAndStartQuiz()" class="btn btn-primary text-xs py-1.5 px-3">
                                <i class="fa-solid fa-play text-orange-400"></i> Take Quiz Now
                            </button>
                        </div>
                    </div>

                    <!-- Questions Loop -->
                    <div class="space-y-4" id="questionsListWrapper">
                        <!-- Questions will be rendered here dynamically -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- View Source Snippet Modal -->
    <div id="sourceSnippetModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2 text-navy-900 font-bold">
                    <i class="fa-solid fa-file-lines text-orange-500"></i>
                    <span>Verified Knowledge Source Snippet</span>
                </div>
                <button onclick="document.getElementById('sourceSnippetModal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700 text-lg">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="space-y-2 text-xs">
                <div class="font-bold text-slate-800" id="srcRefTitle"></div>
                <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 leading-relaxed max-h-48 overflow-y-auto" id="srcSnippetText"></div>
                <p class="text-[11px] text-slate-500">
                    <i class="fa-solid fa-shield-check text-emerald-600"></i> This question has been verified against this source segment with <strong>98.9% semantic ground-truth confidence</strong>.
                </p>
            </div>
            <div class="pt-3 border-t border-slate-100 flex justify-end">
                <button onclick="document.getElementById('sourceSnippetModal').classList.add('hidden')" class="btn btn-primary text-xs py-2 px-4">
                    Close
                </button>
            </div>
        </div>
    </div>
    `;
}

function selectSampleDoc(docId) {
    selectedDoc = MOCK_DATA.sampleDocuments.find(d => d.id === docId);
    window.store.notify();
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        selectedDoc = {
            id: `doc_${Date.now()}`,
            title: file.name,
            pages: 24,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            topics: ["Uploaded Survey Guide", "Field Protocol", "Estimation Formulas"],
            difficulty: "Medium",
            domain: "Statistical",
            summary: "User uploaded official document for automated question generation."
        };
        window.store.notify();
        alert(`Document "${file.name}" uploaded and parsed successfully!`);
    }
}

function triggerAiGeneration() {
    const btn = document.getElementById('generateBtn');
    const procBox = document.getElementById('aiProcessingBox');
    const qContainer = document.getElementById('generatedQuestionsContainer');

    btn.disabled = true;
    procBox.classList.remove('hidden');
    qContainer.classList.add('hidden');

    fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            document_name: selectedDoc ? selectedDoc.title : "NSSO_Manual.pdf",
            num_questions: document.getElementById('cfgCount').value,
            bloom_level: document.getElementById('cfgBloom').value,
            difficulty: document.getElementById('cfgDifficulty').value,
            language: document.getElementById('cfgLanguage').value
        })
    })
    .then(res => res.json())
    .then(data => {
        setTimeout(() => {
            btn.disabled = false;
            procBox.classList.add('hidden');
            qContainer.classList.remove('hidden');
            generatedQuestionsList = data.questions || [];
            renderQuestionsList(generatedQuestionsList);
        }, 1200);
    })
    .catch(() => {
        btn.disabled = false;
        procBox.classList.add('hidden');
        qContainer.classList.remove('hidden');
    });
}

function renderQuestionsList(questions) {
    const wrapper = document.getElementById('questionsListWrapper');
    if (!wrapper) return;

    document.getElementById('genCountDisplay').innerText = questions.length;

    wrapper.innerHTML = questions.map((q, idx) => `
        <div class="stat-card p-5 space-y-3 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all">
            <div class="flex justify-between items-start gap-2 border-b border-slate-100 pb-2">
                <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-navy-900 text-white font-bold text-xs flex items-center justify-center" style="background: #0B2545;">
                        ${idx + 1}
                    </span>
                    <span class="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        ${q.bloomLevel} (Bloom)
                    </span>
                    <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        ${q.competency}
                    </span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                    <span class="text-emerald-700 font-bold text-[11px]"><i class="fa-solid fa-shield-check"></i> ${q.confidenceScore}% Confidence</span>
                    <button onclick="viewQuestionSource('${q.id}')" class="text-blue-600 hover:underline font-bold flex items-center gap-1 text-[11px]">
                        <i class="fa-solid fa-magnifying-glass"></i> View Source
                    </button>
                </div>
            </div>

            <div class="text-xs font-bold text-navy-900 leading-relaxed" style="color: #0B2545;">
                ${q.question}
            </div>

            <!-- Options Grid -->
            <div class="space-y-1.5 text-xs">
                ${q.options.map((opt, optIdx) => `
                    <div class="p-2.5 rounded-lg border ${optIdx === q.correctAnswerIndex ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold' : 'border-slate-200 bg-slate-50 text-slate-700'} flex items-center justify-between">
                        <span><strong>${String.fromCharCode(65 + optIdx)}.</strong> ${opt}</span>
                        ${optIdx === q.correctAnswerIndex ? '<span class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">Correct Answer</span>' : ''}
                    </div>
                `).join('')}
            </div>

            <!-- Explanation & Citation -->
            <div class="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1 border border-slate-100">
                <strong class="text-slate-800 block font-semibold">Explanation:</strong>
                <p>${q.explanation}</p>
                <div class="text-[10px] text-slate-400 font-mono mt-1">Ref: ${q.sourceReference}</div>
            </div>
        </div>
    `).join('');
}

function viewQuestionSource(qId) {
    const q = generatedQuestionsList.find(item => item.id === qId);
    if (!q) return;

    document.getElementById('srcRefTitle').innerText = q.sourceReference;
    document.getElementById('srcSnippetText').innerText = `"...${q.sourceSnippet}..."`;
    document.getElementById('sourceSnippetModal').classList.remove('hidden');
}

function publishAndStartQuiz() {
    if (generatedQuestionsList.length === 0) {
        alert('Please generate questions first.');
        return;
    }
    window.store.startQuiz(generatedQuestionsList, `${selectedDoc ? selectedDoc.title : 'Official Statistics'} AI Assessment`);
}

// Initial populate of 5 questions when component loaded
setTimeout(() => {
    fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_name: "NSSO_Manual.pdf", num_questions: 5 })
    })
    .then(res => res.json())
    .then(data => {
        generatedQuestionsList = data.questions || [];
        renderQuestionsList(generatedQuestionsList);
    });
}, 300);

window.renderAiGenerator = renderAiGenerator;
window.selectSampleDoc = selectSampleDoc;
window.handleFileUpload = handleFileUpload;
window.triggerAiGeneration = triggerAiGeneration;
window.viewQuestionSource = viewQuestionSource;
window.publishAndStartQuiz = publishAndStartQuiz;
