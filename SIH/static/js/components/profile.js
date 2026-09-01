/**
 * User Profile Component
 * Detailed profile for Ananya Sharma (Statistical Officer) with service records, education, skills, and certifications.
 */

function renderUserProfile(state) {
    const user = state.user || {};
    const defaultAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
    const avatar = user.avatar || defaultAvatar;
    const name = user.name || "Statistical Officer";
    const cadre = user.cadre || (user.employeeId && user.employeeId.startsWith('ISS') ? 'Indian Statistical Service (ISS)' : 'Subordinate Statistical Service (SSS)');
    const designation = user.designation || user.role || 'Senior Statistical Officer';
    const department = user.department || user.ministry || 'Ministry of Statistics & Programme Implementation';
    const employeeId = user.employeeId || 'GOV/2026/001';
    const location = user.location || 'Sankhyiki Bhawan, New Delhi';
    const email = user.email || 'officer@nic.in';
    const overallScore = user.overallScore || state.overallScore || 68;

    const edu = user.education || {
        degree: "M.Sc. Statistics",
        year: 2019,
        institution: "Indian Statistical Institute (ISI) / University of Delhi"
    };

    const certs = user.certifications || [
        { title: "Karmayogi National Statistical Methodology", issuer: "NSSTA / MoSPI", year: 2025 },
        { title: "Official Data Systems & Analytics", issuer: "iGOT Karmayogi", year: 2026 }
    ];

    return `
    <div class="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Top Profile Banner Card -->
        <div class="stat-card p-6 sm:p-8 bg-white border border-slate-200 shadow-md rounded-3xl flex flex-col md:flex-row items-center gap-6 border-t-4 border-orange-500">
            <img src="${avatar}" alt="${name}" class="w-24 h-24 rounded-2xl border-2 border-orange-500 object-cover shadow-lg">
            <div class="space-y-2 text-center md:text-left flex-1">
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <h1 class="text-2xl font-black text-navy-900" style="color: #0B2545;">${name}</h1>
                    <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-0.5 rounded-full border border-blue-200">
                        ${cadre}
                    </span>
                </div>
                <p class="text-xs sm:text-sm font-semibold text-slate-600">${designation} • ${department}</p>
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 pt-1">
                    <span><i class="fa-solid fa-id-badge text-orange-500"></i> ${employeeId}</span>
                    <span><i class="fa-solid fa-location-dot text-orange-500"></i> ${location}</span>
                    <span><i class="fa-solid fa-envelope text-orange-500"></i> ${email}</span>
                </div>
            </div>

            <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center min-w-[150px]">
                <span class="text-xs font-bold text-slate-500 uppercase block">Competency Score</span>
                <span class="text-3xl font-black text-navy-900" style="color: #0B2545;">${overallScore}%</span>
                <span class="text-[10px] text-emerald-600 font-bold block mt-0.5">↑ 8% Gain</span>
            </div>
        </div>

        <!-- 2 Columns: Professional Information & Certifications -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Left: Education & Experience Details -->
            <div class="stat-card p-6 space-y-4">
                <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                    <i class="fa-solid fa-graduation-cap text-orange-500"></i> Education & Service Records
                </h2>

                <div class="space-y-3 text-xs">
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-blue-700 uppercase">Highest Qualification</span>
                        <div class="font-bold text-slate-800">${edu.degree} (${edu.year})</div>
                        <div class="text-slate-500">${edu.institution}</div>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-emerald-700 uppercase">Service Experience</span>
                        <div class="font-bold text-slate-800">${user.experienceYears || '4'} Years in Official Statistical Cadre</div>
                        <div class="text-slate-500">Joined National Statistical System in 2022.</div>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-orange-700 uppercase">Current Assignment</span>
                        <div class="font-bold text-slate-800">${user.currentAssignment || department}</div>
                    </div>
                </div>
            </div>

            <!-- Right: Certifications & Skills -->
            <div class="stat-card p-6 space-y-4">
                <h2 class="text-base font-bold text-navy-900 flex items-center gap-2" style="color: #0B2545;">
                    <i class="fa-solid fa-certificate text-orange-500"></i> Certifications & Validated Skills
                </h2>

                <div class="space-y-2.5 text-xs">
                    ${certs.map(c => `
                        <div class="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                            <div>
                                <div class="font-bold text-navy-900">${c.title}</div>
                                <div class="text-[11px] text-slate-500">Issued by ${c.issuer} (${c.year})</div>
                            </div>
                            <span class="text-emerald-600 font-bold text-xs"><i class="fa-solid fa-circle-check"></i> Verified</span>
                        </div>
                    `).join('')}
                </div>

                <div class="pt-3 border-t border-slate-100">
                    <span class="text-xs font-bold text-slate-700 block mb-2">Assessed Skill Chips:</span>
                    <div class="flex flex-wrap gap-1.5">
                        <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-lg">Sampling (L4)</span>
                        <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-lg">Survey Design (L4)</span>
                        <span class="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-lg">Python (L2)</span>
                        <span class="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-lg">AI/ML (L1)</span>
                        <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg">R Programming (L3)</span>
                        <span class="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-lg">National Accounts (L3)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

window.renderUserProfile = renderUserProfile;
