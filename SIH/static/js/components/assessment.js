/**
 * Competency Assessment Wizard Component — Block 1: Digital Competency Profile
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
    const user = state.user || (window.MOCK_DATA && window.MOCK_DATA.currentUser) || {};

    return `
    <div class="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Assessment Card Wrapper -->
        <div class="stat-card p-6 sm:p-10 space-y-8 bg-white rounded-3xl border border-slate-200 shadow-md">
            <!-- Header & Stepper -->
            <div class="space-y-4 border-b border-slate-100 pb-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase">
                                Block 1 — Official Cadre Assessment
                            </span>
                            <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                MoSPI Digital Competency
                            </span>
                        </div>
                        <h1 class="text-2xl font-black text-navy-900 mt-2 font-sans" style="color: #0B2545;">
                            Digital Competency & Skill-Gap Assessment
                        </h1>
                    </div>
                    <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                        Step <span id="currentStepNumber">${currentAssessmentStep}</span> of 6
                    </span>
                </div>

                <!-- Step Progress Bar -->
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div id="assessmentProgressBar" class="bg-navy-900 h-full rounded-full transition-all duration-300" style="width: ${(currentAssessmentStep / 6) * 100}%; background: #0B2545;"></div>
                </div>

                <!-- Stepper Badges -->
                <div class="grid grid-cols-6 gap-1 text-center text-[10px] font-bold text-slate-400">
                    <span class="${currentAssessmentStep >= 1 ? 'text-navy-900 font-black' : ''}">1. Learner Profile</span>
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
                            ${currentAssessmentStep === 1 ? 'Save Profile & Proceed to Assessment →' : 'Next Step <i class="fa-solid fa-arrow-right"></i>'}
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
        const desig = (typeof user.designation === 'object' && user.designation)
            ? (user.designation.title || user.designation.name || 'Senior Statistical Officer (SSO)')
            : (String(user.designation || user.role || '').trim() === '[object Object]' || !(user.designation || user.role) ? 'Senior Statistical Officer (SSO)' : String(user.designation || user.role));
        const exp = user.experienceYears || user.experience_years || 4;
        const degree = user.degree || "M.Sc. Statistics";
        const spec = user.specialization || "Survey Methodology & Mathematical Statistics";
        const domains = user.statisticalDomains || user.statistical_domains || "Survey Design, Sampling, National Accounts, Price Statistics";
        const tools = user.technicalQualifications || user.technical_qualifications || "Python, R, SPSS, Stata, SQL, PowerBI, Excel";
        const prevRoles = user.previousRoles || user.previous_roles || "Statistical Investigator, Junior Statistical Officer";
        const training = user.trainingProgrammes || user.training_programmes || "NSSTA Greater Noida (Survey Methodology), iGOT Karmayogi (Data Analytics)";
        const assignment = user.currentAssignment || user.current_assignment || "Survey Design & Data Processing Division, PLFS & Consumer Expenditure";
        const location = user.location || "Sankhyiki Bhawan, New Delhi";

        return `
        <div class="space-y-6">
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                <div class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow">
                    <i class="fa-solid fa-user-gear"></i>
                </div>
                <div class="text-xs space-y-1">
                    <span class="font-extrabold text-blue-900 text-sm">Block 1 — Comprehensive Learner Profile</span>
                    <p class="text-slate-600 leading-relaxed">
                        To calibrate personalized AI assessment questions and benchmarked iGOT pathways, please confirm your professional assignment, qualifications, and statistical experience.
                    </p>
                </div>
            </div>

            <!-- 1. Personal & Professional Assignment -->
            <div class="space-y-3">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <i class="fa-solid fa-building-columns text-orange-500"></i> 1. Professional & Assignment Details
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Official Name</label>
                        <input type="text" id="prof_name" value="${user.name || ''}" disabled class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Government Employee ID / PEN</label>
                        <input type="text" id="prof_empId" value="${user.employeeId || 'ISS/2026/84920'}" disabled class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Ministry / Administration</label>
                        <input type="text" id="prof_ministry" value="${user.ministry || 'Ministry of Statistics & Programme Implementation'}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Department / Division</label>
                        <input type="text" id="prof_dept" value="${user.department || 'National Statistical Office (NSO - SDRD)'}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Current Job Role / Designation</label>
                        <input type="text" id="prof_desig" value="${desig}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Posting Office & Location</label>
                        <input type="text" id="prof_location" value="${location}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600" placeholder="e.g. Sankhyiki Bhawan, New Delhi">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Current Survey & Statistical Assignment <span class="text-red-500">*</span></label>
                        <input type="text" id="prof_assignment" value="${assignment}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600" placeholder="e.g. Periodic Labour Force Survey (PLFS) & Consumer Expenditure">
                    </div>
                </div>
            </div>

            <!-- 2. Educational & Technical Qualifications -->
            <div class="space-y-3 pt-2">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <i class="fa-solid fa-graduation-cap text-orange-500"></i> 2. Educational & Technical Qualifications
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Highest Degree <span class="text-red-500">*</span></label>
                        <select id="prof_degree" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600">
                            <option value="M.Sc. Statistics" ${degree.includes('M.Sc. Stat') ? 'selected' : ''}>M.Sc. Statistics</option>
                            <option value="M.A. Economics / Econometrics" ${degree.includes('Econ') ? 'selected' : ''}>M.A. Economics / Econometrics</option>
                            <option value="B.Tech / B.E. (Computer Science / Data Science)" ${degree.includes('Tech') ? 'selected' : ''}>B.Tech / B.E. (Data Science / IT)</option>
                            <option value="Ph.D. Statistics / Economics" ${degree.includes('Ph.D') ? 'selected' : ''}>Ph.D. Statistics / Economics</option>
                            <option value="B.Sc. Mathematics / Statistics" ${degree.includes('B.Sc') ? 'selected' : ''}>B.Sc. Mathematics / Statistics</option>
                            <option value="MCA / Master in Data Analytics" ${degree.includes('MCA') ? 'selected' : ''}>MCA / Master in Data Analytics</option>
                        </select>
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Specialization Area</label>
                        <input type="text" id="prof_spec" value="${spec}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600" placeholder="e.g. Sampling, Macroeconomics, Data Science">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Statistical & Data Science Tools Known</label>
                        <input type="text" id="prof_tools" value="${tools}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600" placeholder="e.g. Python, R, SPSS, Stata, SQL, PowerBI, Excel">
                        <div class="flex flex-wrap gap-1.5 pt-1.5">
                            ${['Python', 'R', 'SPSS', 'Stata', 'SQL', 'Power BI', 'Advanced Excel', 'GIS / QGIS'].map(t => `
                                <button type="button" onclick="toggleToolBadge('${t}')" class="text-[11px] font-bold px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 transition-all cursor-pointer">
                                    + ${t}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. Experience & Statistical Domains -->
            <div class="space-y-3 pt-2">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <i class="fa-solid fa-briefcase text-orange-500"></i> 3. Experience & Statistical Domains
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Years of Experience in Official Statistics <span class="text-red-500">*</span></label>
                        <select id="prof_exp" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600">
                            <option value="1.5" ${exp < 2 ? 'selected' : ''}>0 - 2 Years (Junior / Induction Level)</option>
                            <option value="4.0" ${exp >= 2 && exp < 6 ? 'selected' : ''}>3 - 5 Years (Mid-Level Practitioner)</option>
                            <option value="8.0" ${exp >= 6 && exp < 12 ? 'selected' : ''}>6 - 10 Years (Senior Cadre Specialist)</option>
                            <option value="15.0" ${exp >= 12 ? 'selected' : ''}>10+ Years (Leadership / Directorate Level)</option>
                        </select>
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Previous Cadres / Roles</label>
                        <input type="text" id="prof_prevRoles" value="${prevRoles}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600" placeholder="e.g. Statistical Investigator, Junior Statistical Officer">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Statistical Domains Worked In</label>
                        <input type="text" id="prof_domains" value="${domains}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600" placeholder="e.g. Survey Design, Sampling, National Accounts, Price Statistics">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Key Surveys / Projects Handled</label>
                        <input type="text" id="prof_projects" value="${user.projectsHandled || user.projects_handled || 'Periodic Labour Force Survey (PLFS), Consumer Expenditure Survey (CES), Annual Survey of Industries (ASI)'}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600">
                    </div>
                </div>
            </div>

            <!-- 4. Prior Training History -->
            <div class="space-y-3 pt-2">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <i class="fa-solid fa-award text-orange-500"></i> 4. Training History & Academies Attended
                </h3>
                <div class="space-y-2 text-xs">
                    <label class="font-bold text-slate-700 block">Training Programmes / Academies Attended</label>
                    <input type="text" id="prof_training" value="${training}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600" placeholder="e.g. NSSTA Greater Noida, Indian Statistical Institute (ISI), iGOT Karmayogi">
                </div>
            </div>
        </div>
        `;
    } else if (step === 2) {
        return `
        <div class="space-y-4">
            <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">Step 2 — Core Statistical Competencies Self-Rating</h2>
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
            <p class="text-xs text-slate-600">Answer this calibration question on official survey sampling and multiplier weights.</p>

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
            <h2 class="text-lg font-bold text-navy-900" style="color: #0B2545;">Step 5 — Data Governance & Privacy Compliance (DPDP Act)</h2>
            <p class="text-xs text-slate-600">Confirm your operational understanding of official microdata governance.</p>

            <div class="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3 text-xs">
                <span class="font-bold text-navy-900 block">
                    Q: Under the DPDP Act 2023 and official statistical microdata dissemination standards, what technique is mandatory to prevent re-identification of respondent households?
                </span>
                <div class="space-y-2">
                    <label class="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="govQ1" checked class="accent-orange-600">
                        <span>Anonymization via k-anonymity, top-coding outlier income fields, and suppressing micro-geographic identifiers.</span>
                    </label>
                    <label class="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="govQ1" class="accent-orange-600">
                        <span>Only encrypting the database file with a password before public website upload.</span>
                    </label>
                </div>
            </div>
        </div>
        `;
    } else {
        return `
        <div class="space-y-6 text-center">
            <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-md">
                <i class="fa-solid fa-chart-radar"></i>
            </div>
            <div>
                <h2 class="text-xl font-black text-navy-900" style="color: #0B2545;">AI Digital Competency Assessment Complete!</h2>
                <p class="text-xs text-slate-600 max-w-md mx-auto mt-1">
                    Your personalized competency radar has been updated with calibrated benchmark gaps and aligned with iGOT Karmayogi learning pathways.
                </p>
            </div>

            <div class="grid grid-cols-3 gap-3 max-w-lg mx-auto text-xs">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span class="text-slate-500 block text-[10px]">Competency Score</span>
                    <span class="text-2xl font-black text-navy-900">74%</span>
                    <span class="text-[10px] text-emerald-600 font-bold block mt-0.5">↑ +6% Gain</span>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span class="text-slate-500 block text-[10px]">Primary Gap</span>
                    <span class="text-base font-black text-orange-600">AI / ML (L1→L3)</span>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span class="text-slate-500 block text-[10px]">Recommended</span>
                    <span class="text-base font-black text-blue-600">3 iGOT Courses</span>
                </div>
            </div>
        </div>
        `;
    }
}

window.toggleToolBadge = function(tool) {
    const toolsInput = document.getElementById('prof_tools');
    if (!toolsInput) return;
    let list = toolsInput.value.split(',').map(s => s.trim()).filter(Boolean);
    if (!list.includes(tool)) {
        list.push(tool);
        toolsInput.value = list.join(', ');
    }
};

window.updateSelfRating = function(key, val) {
    assessmentResponses.selfRatings[key] = parseInt(val);
    const label = document.getElementById(`rate_val_${key}`);
    if (label) label.textContent = `Level ${val} / 5`;
};

window.nextAssessmentStep = function() {
    if (currentAssessmentStep === 1) {
        // Save Block 1 Profile Details to Backend & Store
        const nameEl = document.getElementById('prof_name');
        const minEl = document.getElementById('prof_ministry');
        const deptEl = document.getElementById('prof_dept');
        const desigEl = document.getElementById('prof_desig');
        const locEl = document.getElementById('prof_location');
        const assignEl = document.getElementById('prof_assignment');
        const degEl = document.getElementById('prof_degree');
        const specEl = document.getElementById('prof_spec');
        const toolsEl = document.getElementById('prof_tools');
        const expEl = document.getElementById('prof_exp');
        const prevRolesEl = document.getElementById('prof_prevRoles');
        const domsEl = document.getElementById('prof_domains');
        const projEl = document.getElementById('prof_projects');
        const trainEl = document.getElementById('prof_training');

        const activeUser = (window.store && window.store.state && window.store.state.user) || {};
        const updatedProfile = {
            email: activeUser.email || 'ananya.sharma@nic.in',
            mobile: activeUser.mobile || '',
            name: nameEl ? nameEl.value : activeUser.name,
            ministry: minEl ? minEl.value : activeUser.ministry,
            department: deptEl ? deptEl.value : activeUser.department,
            designation: desigEl ? desigEl.value : activeUser.designation,
            role: desigEl ? desigEl.value : activeUser.role,
            location: locEl ? locEl.value : (activeUser.location || 'Sankhyiki Bhawan, New Delhi'),
            currentAssignment: assignEl ? assignEl.value : (activeUser.currentAssignment || 'PLFS'),
            degree: degEl ? degEl.value : 'M.Sc. Statistics',
            specialization: specEl ? specEl.value : 'Survey Methodology',
            technicalQualifications: toolsEl ? toolsEl.value : 'Python, R, SQL, PowerBI, Excel',
            experienceYears: expEl ? parseFloat(expEl.value) : 4.0,
            previousRoles: prevRolesEl ? prevRolesEl.value : 'Statistical Officer',
            statisticalDomains: domsEl ? domsEl.value : 'Survey Design, Sampling, National Accounts',
            projectsHandled: projEl ? projEl.value : 'PLFS, Consumer Expenditure',
            trainingProgrammes: trainEl ? trainEl.value : 'NSSTA, iGOT Karmayogi',
            profileCompleted: true
        };

        // Sync with store
        if (window.store) {
            window.store.state.user = Object.assign({}, window.store.state.user, updatedProfile);
            window.store.state.currentUser = window.store.state.user;
        }

        // Post to backend
        fetch('/api/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProfile)
        }).catch(err => console.log('Profile sync notice:', err));
    }

    if (currentAssessmentStep < 6) {
        currentAssessmentStep++;
        if (window.store) window.store.notify();
    }
};

window.prevAssessmentStep = function() {
    if (currentAssessmentStep > 1) {
        currentAssessmentStep--;
        if (window.store) window.store.notify();
    }
};

window.finalizeAssessment = function() {
    fetch('/api/assessments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: 86, responses: assessmentResponses })
    })
    .then(res => res.json())
    .then(data => {
        if (window.store) {
            window.store.state.overallScore = data.new_overall_score || 74;
            if (window.store.state.user) window.store.state.user.overallScore = data.new_overall_score || 74;
            currentAssessmentStep = 1;
            window.store.navigate('learning-path');
        }
    })
    .catch(() => {
        if (window.store) {
            currentAssessmentStep = 1;
            window.store.navigate('learning-path');
        }
    });
};

window.renderCompetencyAssessment = renderCompetencyAssessment;
