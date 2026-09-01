/**
 * Competency Assessment Wizard Component
 * Multi-step interactive self & knowledge evaluation benchmarking current capabilities and generating an AI profile.
 */

let currentAssessmentStep = 1;
let assessmentResponses = {
    selfRatings: {
        "Sampling": 4,
        "Survey Design": 4,
        "Python": 2,
        "AI/ML": 1,
        "Data Visualization": 2,
        "National Accounts": 3,
        "Cybersecurity": 2,
        "Ethics": 4
    },
    knowledgeAnswers: {}
};

function renderCompetencyAssessment(state) {
    const user = state.user || MOCK_DATA.currentUser;

    return `
    <div class="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Assessment Card Wrapper -->
        <div class="stat-card p-6 sm:p-10 space-y-8 bg-white rounded-3xl border border-slate-200 shadow-md">
            <!-- Header & Stepper -->
            <div class="space-y-4 border-b border-slate-100 pb-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <span class="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase">
                            Official Cadre Assessment
                        </span>
                        <h1 class="text-2xl font-black text-navy-900 mt-2" style="color: #0B2545;">
                            Competency & Skill-Gap Assessment
                        </h1>
                    </div>
                    <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                        Step <span id="currentStepNumber">${currentAssessmentStep}</span> of 6
                    </span>
                </div>

                <!-- Step Progress Bar -->
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div id="assessmentProgressBar" class="bg-navy-900 h-full rounded-full transition-all duration-300" style="width: ${(currentAssessmentStep / 6) * 100}%; background: #0B2545;"></div>
                </div>

                <!-- Stepper Badges -->
                <div class="grid grid-cols-6 gap-1 text-center text-[10px] font-bold text-slate-400">
                    <span class="${currentAssessmentStep >= 1 ? 'text-navy-900 font-black' : ''}">1. Role</span>
                    <span class="${currentAssessmentStep >= 2 ? 'text-navy-900 font-black' : ''}">2. Self Rate</span>
                    <span class="${currentAssessmentStep >= 3 ? 'text-navy-900 font-black' : ''}">3. Methods</span>
                    <span class="${currentAssessmentStep >= 4 ? 'text-navy-900 font-black' : ''}">4. Technical</span>
                    <span class="${currentAssessmentStep >= 5 ? 'text-navy-900 font-black' : ''}">5. Governance</span>
                    <span class="${currentAssessmentStep >= 6 ? 'text-emerald-700 font-black' : ''}">6. AI Profile</span>
                </div>
            </div>

            <!-- Dynamic Step Content -->
            <div id="assessmentStepContainer">
                ${getAssessmentStepHTML(currentAssessmentStep, user, state)}
            </div>

            <!-- Navigation Controls -->
            <div class="flex items-center justify-between pt-6 border-t border-slate-100">
                <button onclick="prevAssessmentStep()" id="prevStepBtn" class="btn btn-secondary text-xs py-2 px-5 ${currentAssessmentStep === 1 ? 'invisible' : ''}">
                    <i class="fa-solid fa-arrow-left"></i> Previous
                </button>

                <div class="flex items-center gap-3">
                    ${currentAssessmentStep < 6 ? `
                        <button onclick="nextAssessmentStep()" class="btn btn-primary text-xs py-2 px-6">
                            Next Step <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    ` : `
                        <button onclick="finalizeAssessment()" class="btn btn-saffron text-xs py-2.5 px-6 shadow-md shadow-orange-600/30">
                            <i class="fa-solid fa-check-double"></i> Save Profile & View Learning Path
                        </button>
                    `}
                </div>
            </div>
        </div>
    </div>
    `;
}

function getAssessmentStepHTML(step, user, state) {
    if (step === 1) {
        return `
        <div class="space-y-4">
            <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">Step 1 — Role & Professional Background</h2>
            <p class="text-xs text-slate-600">Please confirm your current designation and primary statistical assignments.</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                    <label class="font-bold text-slate-700 block mb-1">Official Name</label>
                    <input type="text" value="${user.name}" disabled class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                </div>
                <div>
                    <label class="font-bold text-slate-700 block mb-1">Employee ID / PEN</label>
                    <input type="text" value="${user.employeeId}" disabled class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                </div>
                <div>
                    <label class="font-bold text-slate-700 block mb-1">Department / Division</label>
                    <input type="text" value="${user.department}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:border-navy-900">
                </div>
                <div>
                    <label class="font-bold text-slate-700 block mb-1">Current Job Role</label>
                    <input type="text" value="${user.designation}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:border-navy-900">
                </div>
                <div class="sm:col-span-2">
                    <label class="font-bold text-slate-700 block mb-1">Current Survey & Analytical Assignment</label>
                    <textarea rows="2" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:border-navy-900">${user.currentAssignment}</textarea>
                </div>
            </div>
        </div>
        `;
    } else if (step === 2) {
        return `
        <div class="space-y-4">
            <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">Step 2 — Core Statistical Self-Assessment</h2>
            <p class="text-xs text-slate-600">Rate your current independent execution capability on a 1 (Awareness) to 5 (Expert) scale.</p>

            <div class="space-y-4 text-xs">
                ${[
                    { key: "Survey Design", label: "Survey Design & Questionnaire Formulation", curr: assessmentResponses.selfRatings["Survey Design"] },
                    { key: "Sampling", label: "Multi-Stage Probability Sampling & Weighting", curr: assessmentResponses.selfRatings["Sampling"] },
                    { key: "National Accounts", label: "National Accounts (SNA 2008) & GVA Compilation", curr: assessmentResponses.selfRatings["National Accounts"] }
                ].map(item => `
                    <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="font-bold text-navy-900">${item.label}</span>
                            <span class="text-xs font-bold text-orange-600" id="rate_val_${item.key}">Level ${item.curr} / 5</span>
                        </div>
                        <input type="range" min="1" max="5" value="${item.curr}" oninput="updateSelfRating('${item.key}', this.value)" class="w-full accent-orange-600 cursor-pointer">
                        <div class="flex justify-between text-[10px] text-slate-400">
                            <span>1. Awareness</span>
                            <span>2. Foundation</span>
                            <span>3. Working</span>
                            <span>4. Advanced</span>
                            <span>5. Expert</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    } else if (step === 3) {
        return `
        <div class="space-y-4">
            <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">Step 3 — Applied Methodology Evaluation</h2>
            <p class="text-xs text-slate-600">Answer this quick calibration question on official survey design.</p>

            <div class="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3 text-xs">
                <span class="font-bold text-navy-900 block">
                    Q: In the Periodic Labour Force Survey (PLFS), why are First Stage Units (Census Villages / UFS Blocks) selected with Probability Proportional to Size with Replacement (PPSWR)?
                </span>
                <div class="space-y-2">
                    <label class="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="methodQ1" checked class="accent-orange-600">
                        <span>To ensure larger population clusters have higher selection probability, minimizing variance of national totals.</span>
                    </label>
                    <label class="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="methodQ1" class="accent-orange-600">
                        <span>To ensure all villages have an strictly identical probability of selection regardless of size.</span>
                    </label>
                    <label class="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="methodQ1" class="accent-orange-600">
                        <span>To eliminate the requirement for listing households inside the selected village.</span>
                    </label>
                </div>
            </div>
        </div>
        `;
    } else if (step === 4) {
        return `
        <div class="space-y-4">
            <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">Step 4 — Technical & Data Science Proficiency</h2>
            <p class="text-xs text-slate-600">Rate your current capability with modern data engineering and programming tools.</p>

            <div class="space-y-4 text-xs">
                ${[
                    { key: "Python", label: "Python Programming (Pandas, NumPy, Multiplier Aggregations)", curr: assessmentResponses.selfRatings["Python"] },
                    { key: "AI/ML", label: "Machine Learning & AI (Imputation, NLP, Anomaly Detection)", curr: assessmentResponses.selfRatings["AI/ML"] },
                    { key: "Data Visualization", label: "Data Visualization (Power BI, Seaborn, Interactive Dashboards)", curr: assessmentResponses.selfRatings["Data Visualization"] }
                ].map(item => `
                    <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="font-bold text-navy-900">${item.label}</span>
                            <span class="text-xs font-bold text-orange-600" id="rate_val_${item.key}">Level ${item.curr} / 5</span>
                        </div>
                        <input type="range" min="1" max="5" value="${item.curr}" oninput="updateSelfRating('${item.key}', this.value)" class="w-full accent-orange-600 cursor-pointer">
                        <div class="flex justify-between text-[10px] text-slate-400">
                            <span>1. Awareness</span>
                            <span>2. Foundation</span>
                            <span>3. Working</span>
                            <span>4. Advanced</span>
                            <span>5. Expert</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    } else if (step === 5) {
        return `
        <div class="space-y-4">
            <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">Step 5 — Digital Governance & Ethics</h2>
            <p class="text-xs text-slate-600">Assess knowledge of DPDP compliance, data security, and official statistical integrity.</p>

            <div class="space-y-4 text-xs">
                ${[
                    { key: "Cybersecurity", label: "Cybersecurity & CERT-In Government Guidelines", curr: assessmentResponses.selfRatings["Cybersecurity"] },
                    { key: "Ethics", label: "UN Fundamental Principles of Official Statistics & Ethics", curr: assessmentResponses.selfRatings["Ethics"] }
                ].map(item => `
                    <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="font-bold text-navy-900">${item.label}</span>
                            <span class="text-xs font-bold text-orange-600" id="rate_val_${item.key}">Level ${item.curr} / 5</span>
                        </div>
                        <input type="range" min="1" max="5" value="${item.curr}" oninput="updateSelfRating('${item.key}', this.value)" class="w-full accent-orange-600 cursor-pointer">
                        <div class="flex justify-between text-[10px] text-slate-400">
                            <span>1. Awareness</span>
                            <span>2. Foundation</span>
                            <span>3. Working</span>
                            <span>4. Advanced</span>
                            <span>5. Expert</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    } else if (step === 6) {
        return `
        <div class="space-y-6">
            <div class="text-center space-y-2">
                <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mx-auto">
                    <i class="fa-solid fa-check"></i>
                </div>
                <h2 class="text-2xl font-black text-navy-900" style="color: #0B2545;">
                    Your AI Competency Profile Generated
                </h2>
                <p class="text-xs text-slate-600">
                    Calculated against MoSPI National Training Framework 2026.
                </p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <span class="text-xs font-bold text-blue-700 uppercase">Statistical</span>
                    <div class="text-2xl font-black text-blue-900 mt-1">74%</div>
                    <span class="text-[10px] text-emerald-600 font-bold">Strong</span>
                </div>
                <div class="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                    <span class="text-xs font-bold text-orange-700 uppercase">Technical</span>
                    <div class="text-2xl font-black text-orange-900 mt-1">58%</div>
                    <span class="text-[10px] text-red-600 font-bold">Gap Detected</span>
                </div>
                <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <span class="text-xs font-bold text-amber-700 uppercase">Governance</span>
                    <div class="text-2xl font-black text-amber-900 mt-1">62%</div>
                    <span class="text-[10px] text-amber-700 font-bold">Moderate</span>
                </div>
                <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                    <span class="text-xs font-bold text-purple-700 uppercase">Managerial</span>
                    <div class="text-2xl font-black text-purple-900 mt-1">81%</div>
                    <span class="text-[10px] text-emerald-600 font-bold">Proficient</span>
                </div>
            </div>

            <div class="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs space-y-2">
                <div class="flex items-center gap-2 font-bold text-emerald-900">
                    <i class="fa-solid fa-sparkles text-emerald-600"></i> Overall Competency Score: 69% (↑ +1% from baseline)
                </div>
                <p class="text-emerald-800 text-[11px]">
                    Top priority learning activities have been generated in your <strong>AI Learning Advisor</strong> to bridge the 2-level gaps in Python and AI/ML.
                </p>
            </div>
        </div>
        `;
    }
}

function updateSelfRating(key, value) {
    assessmentResponses.selfRatings[key] = parseInt(value);
    const badge = document.getElementById(`rate_val_${key}`);
    if (badge) badge.innerText = `Level ${value} / 5`;
}

function nextAssessmentStep() {
    if (currentAssessmentStep < 6) {
        currentAssessmentStep++;
        window.store.notify();
    }
}

function prevAssessmentStep() {
    if (currentAssessmentStep > 1) {
        currentAssessmentStep--;
        window.store.notify();
    }
}

function finalizeAssessment() {
    currentAssessmentStep = 1;
    window.store.navigate('recommendations');
}

window.renderCompetencyAssessment = renderCompetencyAssessment;
window.updateSelfRating = updateSelfRating;
window.nextAssessmentStep = nextAssessmentStep;
window.prevAssessmentStep = prevAssessmentStep;
window.finalizeAssessment = finalizeAssessment;
