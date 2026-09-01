/**
 * User Profile Component — Block 1: Official Digital Competency Profile
 * Comprehensive profile displaying Personal/Professional, Educational, Experience, and Training records.
 */

function renderUserProfile(state) {
    const user = state.user || (window.MOCK_DATA && window.MOCK_DATA.currentUser) || {};
    const defaultAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
    const avatar = user.avatar || defaultAvatar;
    const name = user.name || "Statistical Officer";
    const cadre = user.cadre || (user.employeeId && user.employeeId.startsWith('ISS') ? 'Indian Statistical Service (ISS)' : 'Subordinate Statistical Service (SSS)');
    const designation = (typeof user.designation === 'object' && user.designation)
        ? (user.designation.title || user.designation.name || 'Senior Statistical Officer (SSO)')
        : (String(user.designation || user.role || '').trim() === '[object Object]' || !(user.designation || user.role) ? 'Senior Statistical Officer (SSO)' : String(user.designation || user.role));
    const ministry = user.ministry || 'Ministry of Statistics & Programme Implementation (MoSPI)';
    const department = user.department || 'National Statistical Office (NSO - SDRD)';
    const employeeId = user.employeeId || 'ISS/2026/84920';
    const location = user.location || 'Sankhyiki Bhawan, New Delhi';
    const email = user.email || 'ananya.sharma@nic.in';
    const mobile = user.mobile ? `+91 ${user.mobile}` : '+91 9876543210';
    const overallScore = user.overallScore || state.overallScore || 68;
    const exp = user.experienceYears || user.experience_years || 4.0;
    const degree = user.degree || "M.Sc. Statistics";
    const spec = user.specialization || "Survey Methodology & Mathematical Statistics";
    const assignment = user.currentAssignment || user.current_assignment || "Periodic Labour Force Survey (PLFS) & Price Statistics Compilation";
    const prevRoles = user.previousRoles || user.previous_roles || "Junior Statistical Officer, Statistical Investigator";
    const domains = user.statisticalDomains || user.statistical_domains || "Survey Design, Sampling, National Accounts, Price Statistics";
    const projects = user.projectsHandled || user.projects_handled || "Periodic Labour Force Survey (PLFS), Consumer Expenditure Survey (CES), Annual Survey of Industries (ASI)";
    const tools = user.technicalQualifications || user.technical_qualifications || "Python, R, SPSS, Stata, SQL, PowerBI, Excel";
    const training = user.trainingProgrammes || user.training_programmes || "NSSTA Greater Noida (Survey Methodology), iGOT Karmayogi (Data Analytics)";

    const toolList = typeof tools === 'string' ? tools.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(tools) ? tools : ['Python', 'R', 'SPSS', 'SQL']);
    const domainList = typeof domains === 'string' ? domains.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(domains) ? domains : ['Survey Design', 'Sampling']);

    const certs = user.certifications || [
        { title: "National Statistical Methodology Specialist", issuer: "NSSTA / MoSPI", year: 2025 },
        { title: "Official Data Systems & Analytics", issuer: "iGOT Karmayogi", year: 2026 },
        { title: "DPDP Act 2023 Microdata Privacy Compliance", issuer: "Digital India / MoSPI", year: 2026 }
    ];

    return `
    <div class="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Top Profile Banner Card -->
        <div class="stat-card p-6 sm:p-8 bg-white border border-slate-200 shadow-md rounded-3xl flex flex-col md:flex-row items-center gap-6 border-t-4 border-orange-500">
            <img src="${avatar}" alt="${name}" class="w-24 h-24 rounded-2xl border-2 border-orange-500 object-cover shadow-lg">
            
            <div class="space-y-2 text-center md:text-left flex-1">
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <h1 class="text-2xl font-black text-navy-900" style="color: #0B2545;">${name}</h1>
                    <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-0.5 rounded-full border border-blue-200">
                        ${cadre}
                    </span>
                    <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <i class="fa-solid fa-circle-check"></i> Profile Active (Block 1)
                    </span>
                </div>
                <p class="text-xs sm:text-sm font-semibold text-slate-600">${designation} • ${department}</p>
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 pt-1">
                    <span><i class="fa-solid fa-id-badge text-orange-500"></i> ${employeeId}</span>
                    <span><i class="fa-solid fa-location-dot text-orange-500"></i> ${location}</span>
                    <span><i class="fa-solid fa-envelope text-orange-500"></i> ${email}</span>
                    <span><i class="fa-solid fa-phone text-orange-500"></i> ${mobile}</span>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center min-w-[140px]">
                    <span class="text-[10px] font-bold text-slate-500 uppercase block">Competency Score</span>
                    <span class="text-3xl font-black text-navy-900" style="color: #0B2545;">${overallScore}%</span>
                    <span class="text-[10px] text-emerald-600 font-bold block mt-0.5">↑ 8% Benchmark Gain</span>
                </div>
                <button onclick="openEditProfileModal()" class="btn btn-secondary text-xs py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 shadow-sm flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-pen-to-square text-orange-600"></i> Edit Profile
                </button>
            </div>
        </div>

        <!-- 4 Grid Sections: Complete Block 1 Digital Competency Profile -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- Block 1.1: Personal / Professional Information -->
            <div class="stat-card p-6 space-y-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                    <i class="fa-solid fa-building-columns text-orange-500"></i> 1. Personal & Professional Assignment
                </h2>

                <div class="space-y-3 text-xs">
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-blue-700 uppercase">Ministry / Administration</span>
                        <div class="font-bold text-slate-800">${ministry}</div>
                        <div class="text-slate-500">${department}</div>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-emerald-700 uppercase">Current Job Role & Cadre</span>
                        <div class="font-bold text-slate-800">${designation}</div>
                        <div class="text-slate-500">Cadre: ${cadre} (${employeeId})</div>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-orange-700 uppercase">Current Survey / Analytical Assignment</span>
                        <div class="font-bold text-slate-800">${assignment}</div>
                        <div class="text-slate-500"><i class="fa-solid fa-location-dot"></i> Posting: ${location}</div>
                    </div>
                </div>
            </div>

            <!-- Block 1.2: Educational & Technical Qualifications -->
            <div class="stat-card p-6 space-y-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                    <i class="fa-solid fa-graduation-cap text-orange-500"></i> 2. Educational & Technical Qualifications
                </h2>

                <div class="space-y-3 text-xs">
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-blue-700 uppercase">Academic Degree & Specialization</span>
                        <div class="font-bold text-slate-800">${degree}</div>
                        <div class="text-slate-500">Specialization: ${spec}</div>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                        <span class="text-[10px] font-bold text-purple-700 uppercase">Technical Qualifications & Software Tools</span>
                        <div class="flex flex-wrap gap-1.5 pt-1">
                            ${toolList.map(t => `<span class="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-purple-200">${t}</span>`).join('')}
                        </div>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-emerald-700 uppercase">Statistical Computing Competency</span>
                        <div class="text-slate-700 font-medium">Equipped for official survey microdata processing, multi-stage sampling weights, and tabulation.</div>
                    </div>
                </div>
            </div>

            <!-- Block 1.3: Experience & Statistical Domains -->
            <div class="stat-card p-6 space-y-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                    <i class="fa-solid fa-briefcase text-orange-500"></i> 3. Experience & Statistical Domains
                </h2>

                <div class="space-y-3 text-xs">
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-emerald-700 uppercase">Service Experience</span>
                        <div class="font-bold text-slate-800">${exp} Years in Official Statistical System</div>
                        <div class="text-slate-500">Previous Positions: ${prevRoles}</div>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                        <span class="text-[10px] font-bold text-blue-700 uppercase">Statistical Domains Worked In</span>
                        <div class="flex flex-wrap gap-1.5 pt-1">
                            ${domainList.map(d => `<span class="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-blue-200">${d}</span>`).join('')}
                        </div>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-orange-700 uppercase">Key Projects / Surveys Handled</span>
                        <div class="font-bold text-slate-800">${projects}</div>
                    </div>
                </div>
            </div>

            <!-- Block 1.4: Training History & Continuous Learning -->
            <div class="stat-card p-6 space-y-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                    <i class="fa-solid fa-award text-orange-500"></i> 4. Training History & Certifications
                </h2>

                <div class="space-y-3 text-xs">
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-blue-700 uppercase">Training Academies Attended</span>
                        <div class="font-bold text-slate-800">${training}</div>
                        <div class="text-slate-500"><i class="fa-solid fa-clock"></i> Total Verified Training Hours: ${user.learningHours || 42.5} hrs</div>
                    </div>

                    <div class="space-y-2 pt-1">
                        <span class="text-[10px] font-bold text-slate-500 uppercase block">Verified Certifications:</span>
                        ${certs.map(c => `
                            <div class="p-2.5 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                                <div>
                                    <div class="font-bold text-navy-900 text-xs">${c.title}</div>
                                    <div class="text-[10px] text-slate-500">${c.issuer} (${c.year})</div>
                                </div>
                                <span class="text-emerald-600 font-bold text-xs"><i class="fa-solid fa-circle-check"></i> Verified</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

        </div>

        <!-- Edit Profile Modal Container -->
        <div id="editProfileModalContainer"></div>
    </div>
    `;
}

window.openEditProfileModal = function() {
    const user = (window.store && window.store.state && window.store.state.user) || {};
    const desigVal = (typeof user.designation === 'object' && user.designation)
        ? (user.designation.title || user.designation.name || 'Senior Statistical Officer (SSO)')
        : (String(user.designation || user.role || '').trim() === '[object Object]' || !(user.designation || user.role) ? 'Senior Statistical Officer (SSO)' : String(user.designation || user.role));
    const exp = user.experienceYears || user.experience_years || 4;
    const degree = user.degree || "M.Sc. Statistics";
    const spec = user.specialization || "Survey Methodology & Mathematical Statistics";
    const domains = user.statisticalDomains || user.statistical_domains || "Survey Design, Sampling, National Accounts, Price Statistics";
    const tools = user.technicalQualifications || user.technical_qualifications || "Python, R, SPSS, Stata, SQL, PowerBI, Excel";
    const prevRoles = user.previousRoles || user.previous_roles || "Statistical Investigator, Junior Statistical Officer";
    const training = user.trainingProgrammes || user.training_programmes || "NSSTA Greater Noida, iGOT Karmayogi";
    const assignment = user.currentAssignment || user.current_assignment || "Periodic Labour Force Survey (PLFS) & Price Statistics";
    const location = user.location || "Sankhyiki Bhawan, New Delhi";

    const modalHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-base shadow">
                        <i class="fa-solid fa-user-pen"></i>
                    </div>
                    <div>
                        <h2 class="text-lg font-black text-navy-900" style="color: #0B2545;">Edit Digital Competency Profile</h2>
                        <p class="text-xs text-slate-500">Block 1 — Official Cadre Records & Experience</p>
                    </div>
                </div>
                <button onclick="closeEditProfileModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer">
                    ✕
                </button>
            </div>

            <div class="space-y-4 max-h-[65vh] overflow-y-auto pr-2 text-xs">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Ministry / Administration <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">🔒 Locked Record</span></label>
                        <input type="text" id="modal_prof_ministry" value="${user.ministry || 'Ministry of Statistics & Programme Implementation'}" disabled class="w-full p-2.5 bg-slate-100/90 border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-not-allowed select-none">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Department / Division <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">🔒 Locked Record</span></label>
                        <input type="text" id="modal_prof_dept" value="${user.department || 'National Statistical Office (NSO - SDRD)'}" disabled class="w-full p-2.5 bg-slate-100/90 border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-not-allowed select-none">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Designation / Role <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">🔒 Locked Record</span></label>
                        <input type="text" id="modal_prof_desig" value="${desigVal}" disabled class="w-full p-2.5 bg-slate-100/90 border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-not-allowed select-none">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Posting Office & Location</label>
                        <input type="text" id="modal_prof_location" value="${location}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Current Survey & Statistical Assignment</label>
                        <input type="text" id="modal_prof_assignment" value="${assignment}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Academic Degree</label>
                        <input type="text" id="modal_prof_degree" value="${degree}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Specialization</label>
                        <input type="text" id="modal_prof_spec" value="${spec}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Years of Experience in Cadre</label>
                        <input type="number" step="0.5" id="modal_prof_exp" value="${exp}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium">
                    </div>
                    <div>
                        <label class="font-bold text-slate-700 block mb-1">Previous Roles</label>
                        <input type="text" id="modal_prof_prevRoles" value="${prevRoles}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Statistical Domains (Comma-separated)</label>
                        <input type="text" id="modal_prof_domains" value="${domains}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Software & Analytical Tools Known</label>
                        <input type="text" id="modal_prof_tools" value="${tools}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-bold text-slate-700 block mb-1">Training Programmes Attended</label>
                        <input type="text" id="modal_prof_training" value="${training}" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium">
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button onclick="closeEditProfileModal()" class="btn btn-secondary text-xs py-2.5 px-5">Cancel</button>
                <button onclick="saveModalProfile()" class="btn btn-primary text-xs py-2.5 px-6">
                    <i class="fa-solid fa-floppy-disk"></i> Save Profile
                </button>
            </div>
        </div>
    </div>
    `;

    const container = document.getElementById('editProfileModalContainer');
    if (container) container.innerHTML = modalHTML;
};

window.closeEditProfileModal = function() {
    const container = document.getElementById('editProfileModalContainer');
    if (container) container.innerHTML = '';
};

window.saveModalProfile = function() {
    const activeUser = (window.store && window.store.state && window.store.state.user) || {};
    const desigClean = (typeof activeUser.designation === 'object' && activeUser.designation ? (activeUser.designation.title || activeUser.designation.name) : activeUser.designation) || 'Senior Statistical Officer (SSO)';
    const updatedProfile = {
        email: activeUser.email || 'ananya.sharma@nic.in',
        mobile: activeUser.mobile || '',
        name: activeUser.name || 'Statistical Officer',
        ministry: activeUser.ministry || 'Ministry of Statistics & Programme Implementation',
        department: activeUser.department || 'National Statistical Office (NSO - SDRD)',
        designation: desigClean,
        role: desigClean,
        employeeId: activeUser.employeeId || activeUser.employee_id || 'ISS/2026/84920',
        org_type: activeUser.org_type || 'Central Government',
        location: document.getElementById('modal_prof_location')?.value || activeUser.location,
        currentAssignment: document.getElementById('modal_prof_assignment')?.value || activeUser.currentAssignment,
        degree: document.getElementById('modal_prof_degree')?.value || activeUser.degree,
        specialization: document.getElementById('modal_prof_spec')?.value || activeUser.specialization,
        experienceYears: parseFloat(document.getElementById('modal_prof_exp')?.value || 4.0),
        previousRoles: document.getElementById('modal_prof_prevRoles')?.value || activeUser.previousRoles,
        statisticalDomains: document.getElementById('modal_prof_domains')?.value || activeUser.statisticalDomains,
        technicalQualifications: document.getElementById('modal_prof_tools')?.value || activeUser.technicalQualifications,
        trainingProgrammes: document.getElementById('modal_prof_training')?.value || activeUser.trainingProgrammes,
        profileCompleted: true
    };

    if (window.store) {
        window.store.state.user = Object.assign({}, window.store.state.user, updatedProfile);
        window.store.state.currentUser = window.store.state.user;
    }

    fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
    })
    .then(res => res.json())
    .then(data => {
        window.closeEditProfileModal();
        if (window.store) window.store.notify();
    })
    .catch(err => {
        window.closeEditProfileModal();
        if (window.store) window.store.notify();
    });
};

window.renderUserProfile = renderUserProfile;
