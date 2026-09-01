/**
 * Competency Framework Component
 * Interactive catalog of 30+ official statistical competencies across 4 domains with 5-Level Maturity Model.
 */

function renderCompetencyFramework(state) {
    const lang = state.currentLanguage;
    const framework = state.competencyFramework;

    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <!-- Header -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <span class="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase">
                    National Competency Standard 2026
                </span>
                <h1 class="text-2xl sm:text-3xl font-black text-navy-900 mt-2" style="color: #0B2545;">
                    Official Statistics Competency Framework
                </h1>
                <p class="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1">
                    Structured proficiency standards across 4 core domains covering 30+ specialized statistical, technical, digital governance, and managerial competencies.
                </p>
            </div>
            <button onclick="store.navigate('assessment')" class="btn btn-saffron text-xs sm:text-sm py-2.5 px-4 shadow-sm whitespace-nowrap">
                <i class="fa-solid fa-clipboard-check"></i> Launch Self-Assessment
            </button>
        </div>

        <!-- 5-Level Competency Model Reference Banner -->
        <div class="stat-card p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white rounded-2xl" style="background: #0B2545;">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-base font-bold text-orange-400 flex items-center gap-2">
                    <i class="fa-solid fa-layer-group"></i> The 5-Level Competency Maturity Model
                </h2>
                <span class="text-[11px] text-slate-300">Adopted by NSSTA & Capacity Building Commission</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                <div class="p-3 rounded-xl bg-white/10 border border-white/10">
                    <div class="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                        <span class="w-5 h-5 rounded-full bg-slate-700 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                        Level 1 — Awareness
                    </div>
                    <p class="text-[11px] text-slate-300">Basic theoretical understanding of statistical terms and concepts.</p>
                </div>
                <div class="p-3 rounded-xl bg-white/10 border border-white/10">
                    <div class="font-bold text-blue-300 mb-1 flex items-center gap-1.5">
                        <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                        Level 2 — Foundation
                    </div>
                    <p class="text-[11px] text-slate-300">Performs standard routine survey data collection under supervision.</p>
                </div>
                <div class="p-3 rounded-xl bg-white/10 border border-white/10">
                    <div class="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                        <span class="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                        Level 3 — Working
                    </div>
                    <p class="text-[11px] text-slate-300">Independently designs questionnaires, weights data, and cleans microdata.</p>
                </div>
                <div class="p-3 rounded-xl bg-white/10 border border-white/10">
                    <div class="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                        <span class="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                        Level 4 — Advanced
                    </div>
                    <p class="text-[11px] text-slate-300">Solves complex methodological problems, optimizes sample designs, and guides teams.</p>
                </div>
                <div class="p-3 rounded-xl bg-white/10 border border-white/10">
                    <div class="font-bold text-orange-300 mb-1 flex items-center gap-1.5">
                        <span class="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-bold">5</span>
                        Level 5 — Expert
                    </div>
                    <p class="text-[11px] text-slate-300">National authority designing national accounting base revisions and policy standards.</p>
                </div>
            </div>
        </div>

        <!-- Filter and Search Bar -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="relative w-full sm:w-80">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs"></i>
                <input type="text" id="compSearchInput" onkeyup="filterCompetencyCards()" placeholder="Search competencies, tools, skills..." class="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-navy-900">
            </div>

            <div class="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <span class="text-xs text-slate-500 font-semibold">Filter Domain:</span>
                <button onclick="filterDomain('all')" class="domain-btn active px-3 py-1.5 rounded-lg text-xs font-bold bg-navy-900 text-white" style="background: #0B2545;">All (30+)</button>
                <button onclick="filterDomain('stat')" class="domain-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">Statistical</button>
                <button onclick="filterDomain('tech')" class="domain-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">Technical</button>
                <button onclick="filterDomain('gov')" class="domain-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">Governance</button>
                <button onclick="filterDomain('mgmt')" class="domain-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">Managerial</button>
            </div>
        </div>

        <!-- Competency Domain Sections -->
        <div class="space-y-10" id="competencyContainer">
            ${framework.map(domain => `
                <div class="space-y-4 domain-section" data-domain="${domain.domainId}">
                    <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div class="flex items-center gap-2.5">
                            <span class="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center text-sm" style="background: #0B2545;">
                                <i class="fa-solid fa-${domain.icon}"></i>
                            </span>
                            <div>
                                <h2 class="text-xl font-bold text-navy-900" style="color: #0B2545;">${domain.domainName}</h2>
                                <span class="text-xs text-slate-500">${domain.competencies.length} Competencies in this domain</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        ${domain.competencies.map(comp => {
                            const levelLabels = { 1: "L1 Awareness", 2: "L2 Foundation", 3: "L3 Working", 4: "L4 Advanced", 5: "L5 Expert" };
                            let gapBadge = comp.gap > 0 ? (comp.priority === "Critical" ? "gap-critical" : "gap-high") : "gap-none";

                            return `
                            <div class="stat-card p-5 space-y-4 flex flex-col justify-between competency-card" data-name="${comp.name.toLowerCase()}" data-desc="${comp.description.toLowerCase()}">
                                <div class="space-y-2">
                                    <div class="flex justify-between items-start gap-2">
                                        <h3 class="text-base font-bold text-navy-900" style="color: #0B2545;">${comp.name}</h3>
                                        <span class="${gapBadge}">
                                            ${comp.gap > 0 ? `Gap: ${comp.gap} Levels` : 'Compliant'}
                                        </span>
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed">${comp.description}</p>
                                </div>

                                <!-- Current vs Required Levels -->
                                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                                    <div class="flex justify-between items-center">
                                        <span class="text-slate-500">Your Current Level:</span>
                                        <strong class="text-navy-900 font-bold">${levelLabels[comp.currentLevel]}</strong>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-slate-500">Mandated Role Target:</span>
                                        <strong class="text-orange-700 font-bold">${levelLabels[comp.requiredLevel]}</strong>
                                    </div>
                                    <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                        <div class="bg-navy-900 h-full rounded-full" style="width: ${(comp.currentLevel / 5) * 100}%; background: #0B2545;"></div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                                    <button onclick="showCompetencyLevelModal('${comp.id}')" class="text-blue-600 hover:underline font-semibold flex items-center gap-1">
                                        <i class="fa-solid fa-eye text-[11px]"></i> Level Criteria
                                    </button>
                                    <button onclick="store.navigate('recommendations')" class="btn btn-secondary text-[11px] py-1 px-2.5 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200">
                                        <i class="fa-solid fa-graduation-cap text-orange-500"></i> Learn
                                    </button>
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <!-- Competency Level Detail Modal -->
    <div id="compLevelModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 class="text-lg font-bold text-navy-900" id="modalCompTitle" style="color: #0B2545;">Competency Levels</h3>
                <button onclick="document.getElementById('compLevelModal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700 text-lg">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <p class="text-xs text-slate-600" id="modalCompDesc"></p>
            <div class="space-y-2.5 text-xs" id="modalLevelsList"></div>
            <div class="pt-3 border-t border-slate-100 flex justify-end">
                <button onclick="document.getElementById('compLevelModal').classList.add('hidden')" class="btn btn-primary text-xs py-2 px-4">
                    Close
                </button>
            </div>
        </div>
    </div>
    `;
}

function filterDomain(domainId) {
    document.querySelectorAll('.domain-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-navy-900', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
    });
    event.target.classList.add('active', 'bg-navy-900', 'text-white');
    event.target.classList.remove('bg-slate-100', 'text-slate-700');

    document.querySelectorAll('.domain-section').forEach(sec => {
        if (domainId === 'all' || sec.dataset.domain === domainId) {
            sec.style.display = 'block';
        } else {
            sec.style.display = 'none';
        }
    });
}

function filterCompetencyCards() {
    const query = document.getElementById('compSearchInput').value.toLowerCase();
    document.querySelectorAll('.competency-card').forEach(card => {
        const name = card.dataset.name;
        const desc = card.dataset.desc;
        if (name.includes(query) || desc.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function showCompetencyLevelModal(compId) {
    let targetComp = null;
    window.store.state.competencyFramework.forEach(d => {
        d.competencies.forEach(c => {
            if (c.id === compId) targetComp = c;
        });
    });

    if (!targetComp) return;

    document.getElementById('modalCompTitle').innerText = `${targetComp.name} — 5-Level Model`;
    document.getElementById('modalCompDesc').innerText = targetComp.description;

    const levels = targetComp.levels || {};
    const html = [1, 2, 3, 4, 5].map(lvl => `
        <div class="p-3 rounded-xl border ${targetComp.currentLevel === lvl ? 'border-blue-500 bg-blue-50/70' : (targetComp.requiredLevel === lvl ? 'border-orange-400 bg-orange-50/50' : 'border-slate-200 bg-slate-50')}">
            <div class="font-bold text-navy-900 flex justify-between items-center mb-1">
                <span>Level ${lvl} — ${["Awareness", "Foundation", "Working", "Advanced", "Expert"][lvl - 1]}</span>
                ${targetComp.currentLevel === lvl ? '<span class="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">Your Current Level</span>' : ''}
                ${targetComp.requiredLevel === lvl && targetComp.currentLevel !== lvl ? '<span class="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-bold">Role Target</span>' : ''}
            </div>
            <p class="text-[11px] text-slate-700">${levels[lvl] || 'Detailed rubric criteria specified under NSSTA guideline manual.'}</p>
        </div>
    `).join('');

    document.getElementById('modalLevelsList').innerHTML = html;
    document.getElementById('compLevelModal').classList.remove('hidden');
}

window.renderCompetencyFramework = renderCompetencyFramework;
window.filterDomain = filterDomain;
window.filterCompetencyCards = filterCompetencyCards;
window.showCompetencyLevelModal = showCompetencyLevelModal;
