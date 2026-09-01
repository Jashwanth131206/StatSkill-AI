/**
 * StatSkill AI — Official Authentication & Registration System
 * 
 * Modeled 1:1 after official Government of India iGOT Karmayogi / MoSPI portal design:
 *  - Split Screen: Left Side = Royal Blue Informational Visual Graphic ("How To Login" / "How To Register")
 *  - Right Side = Clean White Auth Card with Cascading Hierarchy & Email, OTP, and Password Wizard.
 * 
 * Mixed-Case Alphanumeric Security CAPTCHA Engine:
 *  - Generates combined Upper Case + Lower Case + Numeric codes (e.g. 3eK8wT).
 *  - Interactive Refresh button dynamically regenerates new codes with live visual pulse.
 *  - Speech Engine clearly announces case distinctions ("Capital A", "Small b", "Number 7").
 *  - Dual Verification: User can either TYPE the code OR 1-click "I'm not a robot" to instantly verify.
 *  - Instant real-time green checkmark verification and form unlocking.
 */

(function(window) {
    'use strict';

    // Internal Form & Validation State
    let authState = {
        tab: 'register', // 'login' | 'register'
        step: 1, // 1: Info + Email, 2: OTP, 3: Create Password
        name: '',
        govType: 'central', // 'central' | 'state'
        ministry: '',
        department: '',
        designation: '',
        email: '',
        otp: '',
        demoOtp: '',
        password: '',
        confirmPassword: '',
        resendTimer: 0,
        timerInterval: null,
        isSendingOtp: false,
        isVerifyingOtp: false,
        isRegistering: false,
        isLoggingIn: false,
        step1Error: null,
        step2Error: null,
        step3Error: null,
        loginError: null,
        loginEmail: '',
        loginPassword: ''
    };

    // CAPTCHA Generator & State Engine
    let isRobotChecked = false;
    let currentCaptchaCode = generateCaptchaCode();

    function getRandomInt(max) {
        if (window.crypto && window.crypto.getRandomValues) {
            const arr = new Uint32Array(1);
            window.crypto.getRandomValues(arr);
            return arr[0] % max;
        }
        return Math.floor(Math.random() * max);
    }

    function generateCaptchaCode() {
        const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const lowercase = 'abcdefghijkmnpqrstuvwxyz';
        const numbers = '23456789';
        
        // Ensure guaranteed mix of capital letters, small letters, and numbers
        let chars = [
            uppercase.charAt(getRandomInt(uppercase.length)),
            uppercase.charAt(getRandomInt(uppercase.length)),
            lowercase.charAt(getRandomInt(lowercase.length)),
            lowercase.charAt(getRandomInt(lowercase.length)),
            numbers.charAt(getRandomInt(numbers.length)),
            numbers.charAt(getRandomInt(numbers.length))
        ];
        
        // Fisher-Yates random shuffle with cryptographic randomness
        for (let i = chars.length - 1; i > 0; i--) {
            const j = getRandomInt(i + 1);
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        return chars.join('');
    }

    window.refreshCaptcha = function() {
        currentCaptchaCode = generateCaptchaCode();
        isRobotChecked = false;

        const codeEls = document.querySelectorAll('.captchaCodeDisplay');
        codeEls.forEach(el => {
            el.textContent = currentCaptchaCode;
            el.classList.add('animate-pulse');
            setTimeout(() => el.classList.remove('animate-pulse'), 350);
        });

        // Reset input fields
        const loginInp = document.getElementById('loginCaptchaInput');
        const regInp = document.getElementById('regCaptchaInput');
        if (loginInp) loginInp.value = '';
        if (regInp) regInp.value = '';

        syncCaptchaUI();
        if (typeof window.updateStep3State === 'function') window.updateStep3State();
        if (typeof window.updateLoginState === 'function') window.updateLoginState();
    };

    window.playAudioCaptcha = function() {
        if (!('speechSynthesis' in window)) {
            alert("Audio CAPTCHA code is: " + currentCaptchaCode.split('').join(' - '));
            return;
        }
        window.speechSynthesis.cancel();
        const spokenList = currentCaptchaCode.split('').map(c => {
            if (/[A-Z]/.test(c)) return "Capital " + c;
            if (/[a-z]/.test(c)) return "Small " + c;
            return "Number " + c;
        });
        const spoken = "Security code is: " + spokenList.join(', ');
        const utterance = new SpeechSynthesisUtterance(spoken);
        utterance.rate = 0.75;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    // User types CAPTCHA code
    window.handleCaptchaInputChange = function(val, formType) {
        const inputVal = (val || '').trim();
        const matches = inputVal.toLowerCase() === currentCaptchaCode.toLowerCase();

        if (matches) {
            isRobotChecked = true;
        } else {
            isRobotChecked = false;
        }

        syncCaptchaUI();
        if (formType === 'login') {
            if (typeof window.updateLoginState === 'function') window.updateLoginState();
        } else {
            if (typeof window.updateStep3State === 'function') window.updateStep3State();
        }
    };

    // 1-Click Quick Verification ("I'm not a robot")
    window.quickVerifyRobot = function(formType) {
        isRobotChecked = !isRobotChecked;

        const loginInp = document.getElementById('loginCaptchaInput');
        const regInp = document.getElementById('regCaptchaInput');

        if (isRobotChecked) {
            if (loginInp) loginInp.value = currentCaptchaCode;
            if (regInp) regInp.value = currentCaptchaCode;
        } else {
            if (loginInp) loginInp.value = '';
            if (regInp) regInp.value = '';
        }

        syncCaptchaUI();
        if (formType === 'login' || authState.tab === 'login') {
            if (typeof window.updateLoginState === 'function') window.updateLoginState();
        } else {
            if (typeof window.updateStep3State === 'function') window.updateStep3State();
        }
    };

    function syncCaptchaUI() {
        // Badges
        const loginBadge = document.getElementById('loginCaptchaBadge');
        const regBadge = document.getElementById('regCaptchaBadge');
        if (loginBadge) {
            if (isRobotChecked) loginBadge.classList.remove('hidden');
            else loginBadge.classList.add('hidden');
        }
        if (regBadge) {
            if (isRobotChecked) regBadge.classList.remove('hidden');
            else regBadge.classList.add('hidden');
        }

        // Quick Verify Buttons
        const loginBtn = document.getElementById('loginQuickVerifyBtn');
        const regBtn = document.getElementById('regQuickVerifyBtn');
        
        if (loginBtn) {
            if (isRobotChecked) {
                loginBtn.className = "w-full sm:w-auto px-3.5 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-emerald-50 border-emerald-500 text-emerald-700 shadow-2xs";
                loginBtn.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i> <span>Verified</span>`;
            } else {
                loginBtn.className = "w-full sm:w-auto px-3.5 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs";
                loginBtn.innerHTML = `<i class="fa-solid fa-shield-halved text-blue-600 text-xs"></i> <span>I'm not a robot</span>`;
            }
        }

        if (regBtn) {
            if (isRobotChecked) {
                regBtn.className = "w-full sm:w-auto px-3.5 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-emerald-50 border-emerald-500 text-emerald-700 shadow-2xs";
                regBtn.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i> <span>Verified</span>`;
            } else {
                regBtn.className = "w-full sm:w-auto px-3.5 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs";
                regBtn.innerHTML = `<i class="fa-solid fa-shield-halved text-blue-600 text-xs"></i> <span>I'm not a robot</span>`;
            }
        }

        // Hide errors
        const loginErr = document.getElementById('loginCaptchaError');
        const regErr = document.getElementById('regCaptchaError');
        if (isRobotChecked) {
            if (loginErr) loginErr.classList.add('hidden');
            if (regErr) regErr.classList.add('hidden');
        }
    }

    // Reset Auth State helper
    function resetAuthState(tab = 'register') {
        if (authState.timerInterval) {
            clearInterval(authState.timerInterval);
            authState.timerInterval = null;
        }
        currentCaptchaCode = generateCaptchaCode();
        isRobotChecked = false;
        authState = {
            tab: tab,
            step: 1,
            name: '',
            govType: 'central',
            ministry: '',
            department: '',
            designation: '',
            email: '',
            otp: '',
            demoOtp: '',
            password: '',
            confirmPassword: '',
            resendTimer: 0,
            timerInterval: null,
            isSendingOtp: false,
            isVerifyingOtp: false,
            isRegistering: false,
            isLoggingIn: false,
            step1Error: null,
            step2Error: null,
            step3Error: null,
            loginError: null,
            loginEmail: '',
            loginPassword: ''
        };
    }

    // Validation Helpers
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
    }

    function isMinistrySelected() {
        const m = (authState.ministry || '').trim();
        return m !== '' && !m.startsWith('--');
    }

    function isDepartmentSelected() {
        const d = (authState.department || '').trim();
        return isMinistrySelected() && d !== '' && !d.startsWith('--');
    }

    function isDesignationSelected() {
        const des = (authState.designation || '').trim();
        return isDepartmentSelected() && des !== '' && !des.startsWith('--');
    }

    function isNameFilled() {
        return Boolean((authState.name || '').trim().length >= 2);
    }

    function isAllPriorFilled() {
        return isNameFilled() && isMinistrySelected() && isDepartmentSelected() && isDesignationSelected();
    }

    function isStep1Valid() {
        return isAllPriorFilled() && isValidEmail(authState.email);
    }

    function isPasswordLengthValid(pwd) { return (pwd || '').length >= 8; }
    function hasPasswordLetter(pwd) { return /[a-zA-Z]/.test(pwd || ''); }
    function hasPasswordNumber(pwd) { return /\d/.test(pwd || ''); }

    function isStep3Valid() {
        const p = authState.password;
        const cp = authState.confirmPassword;
        return isPasswordLengthValid(p) && hasPasswordLetter(p) && hasPasswordNumber(p) && cp.length > 0 && p === cp && isRobotChecked;
    }

    // Dynamic Hierarchy Helpers
    function getDepartmentList(govType, ministryName) {
        if (!ministryName || ministryName.startsWith('--')) return [];
        if (window.OrgDataService) {
            const depts = window.OrgDataService.getDepartments(govType, ministryName);
            let list = [];
            if (depts && depts.length > 0) {
                depts.forEach(d => {
                    list.push(d.name);
                    const orgs = window.OrgDataService.getOrganisations(govType, ministryName, d.id || d.name);
                    if (orgs && orgs.length > 0) {
                        orgs.forEach(o => {
                            if (!list.includes(o.name)) list.push(o.name);
                        });
                    }
                });
            }
            if (list.length > 0) return list;
        }
        if (govType === 'central') {
            return [
                "National Statistical Office (NSO)",
                "Survey Design and Research Division (SDRD), Kolkata",
                "Field Operations Division (FOD), New Delhi / Regional Offices",
                "Data Processing Division (DPD), Kolkata & Data Centres",
                "National Accounts Division (NAD), New Delhi",
                "Economic Statistics Division (ESD - ASI/IIP), New Delhi",
                "Price Statistics Division (PSD - CPI), New Delhi",
                "Social Statistics Division (SSD & SDG Unit), New Delhi",
                "National Statistical Systems Training Academy (NSSTA)",
                "Programme Implementation Wing (PI Wing)"
            ];
        } else {
            return [
                "Directorate of Economics & Statistics (DES)",
                "State Planning & Development Department",
                "Bureau of Applied Economics & Statistics",
                "District Statistical Office (DSO)",
                "State Data Analytics & Monitoring Cell",
                "State Evaluation & Statistics Division"
            ];
        }
    }

    function getDesignationList(govType, ministryName, deptName) {
        if (!deptName || deptName.startsWith('--')) return [];
        if (window.OrgDataService) {
            const desigs = window.OrgDataService.getDesignations(govType, ministryName, deptName, deptName);
            if (desigs && desigs.length > 0) {
                return desigs.map(d => d.title || d.name || d);
            }
        }
        return [
            "Senior Statistical Officer (SSO)",
            "Junior Statistical Officer (JSO)",
            "Director / Joint Director (Statistics)",
            "Deputy Director (Survey & Accounts)",
            "Assistant Director (Data Analytics)",
            "Additional Director General (ADG) / DDG",
            "Director General (Statistical Cadre)",
            "District Statistical Officer (DSO)",
            "Assistant Statistical Officer (ASO)",
            "Data Analyst / GIS Specialist",
            "Technical Director / Systems Analyst",
            "Designated Departmental Nodal Officer"
        ];
    }

    // Start 30s Countdown for Resend OTP
    function startResendTimer() {
        if (authState.timerInterval) clearInterval(authState.timerInterval);
        authState.resendTimer = 30;
        authState.timerInterval = setInterval(() => {
            if (authState.resendTimer > 0) {
                authState.resendTimer--;
                const timerEl = document.getElementById('resendTimerDisplay');
                if (timerEl) timerEl.textContent = `Resend code in ${authState.resendTimer}s`;
            } else {
                clearInterval(authState.timerInterval);
                authState.timerInterval = null;
                const timerContainer = document.getElementById('resendTimerContainer');
                if (timerContainer) {
                    timerContainer.innerHTML = `<button type="button" onclick="handleResendOtp()" class="text-blue-600 font-bold hover:underline cursor-pointer"><i class="fa-solid fa-rotate-right"></i> Resend OTP Code</button>`;
                }
            }
        }, 1000);
    }

    // -------------------------------------------------------------
    // MAIN RENDERER
    // -------------------------------------------------------------
    function renderAuthModal(state) {
        if (!state.isAuthModalOpen) return '';

        const tab = state.authModalTab || authState.tab || 'register';
        const step = authState.step || 1;
        const isNodalOpen = state.isNodalModalOpen || false;

        return `
        <!-- Full Overlay Modal Container -->
        <div id="statskillAuthModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
            
            <!-- Split-Screen Dialog Card (1:1 iGOT Layout) -->
            <div class="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto transition-all flex flex-col md:flex-row max-h-[96vh] min-h-[640px]">
                
                <!-- Close Button -->
                <button onclick="closeAuthModal()" class="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all focus:outline-none cursor-pointer" title="Close">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>

                <!-- LEFT HALF: ROYAL BLUE VISUAL GRAPHIC -->
                <div class="w-full md:w-5/12 p-6 sm:p-8 bg-[#0b3b80] text-white flex flex-col justify-between relative overflow-hidden" style="background: linear-gradient(135deg, #072559 0%, #0b3b80 50%, #0052cc 100%);">
                    <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 20px 20px;"></div>
                    ${tab === 'register' ? renderLeftRegisterGraphic(step) : renderLeftLoginGraphic()}
                </div>

                <!-- RIGHT HALF: CLEAN WHITE AUTH FORM -->
                <div class="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white">
                    ${tab === 'login' ? renderLoginForm(state) : renderRegistrationWizard(state, step)}
                </div>

                <!-- Drawer for Nodal Officer Assistance -->
                ${isNodalOpen ? renderNodalOfficerDrawer(state) : ''}

            </div>
        </div>
        `;
    }

    window.closeAuthModal = function() {
        resetAuthState();
        if (window.store) {
            window.store.state.isAuthModalOpen = false;
            window.store.notify();
        }
    };

    window.switchTab = function(newTab) {
        currentCaptchaCode = generateCaptchaCode();
        resetAuthState(newTab);
        if (window.store) {
            window.store.state.authModalTab = newTab;
            window.store.notify();
        }
    };

    function renderNodalOfficerDrawer(state) {
        return `
        <div class="absolute inset-0 z-40 bg-white/95 backdrop-blur-md p-6 overflow-y-auto animate-fadeIn flex flex-col justify-between">
            <div class="flex justify-between items-center pb-3 border-b">
                <h3 class="font-bold text-slate-900 text-sm">Nodal Officer Assistance</h3>
                <button onclick="store.state.isNodalModalOpen = false; store.notify();" class="text-slate-500 hover:text-slate-900 text-sm cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="py-4 space-y-3 text-xs text-slate-700">
                <p class="font-bold text-blue-900">Need help joining StatSkill AI under your Ministry / MDO?</p>
                <div class="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5">
                    <div class="font-bold text-slate-900">MoSPI Nodal Officer Support Desk</div>
                    <div>Email: <strong class="text-blue-700">nodalofficer.statskill@mospi.gov.in</strong></div>
                    <div>Helpline: <strong>+91 11 2334 0000</strong> (Mon-Fri 9:00 AM - 5:30 PM IST)</div>
                </div>
            </div>
            <button onclick="store.state.isNodalModalOpen = false; store.notify();" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer">Close Assistance</button>
        </div>
        `;
    }

    // -------------------------------------------------------------
    // LEFT GRAPHIC A: HOW TO LOGIN
    // -------------------------------------------------------------
    function renderLeftLoginGraphic() {
        return `
        <div class="relative z-10 space-y-6 my-auto">
            <div class="text-center space-y-1">
                <p class="text-xs font-bold uppercase tracking-widest text-blue-200">Welcome to StatSkill AI</p>
                <h2 class="text-2xl sm:text-3xl font-black text-white font-sans">
                    How To Log<span class="border-b-4 border-orange-400 pb-0.5">in</span>
                </h2>
            </div>
            <div class="space-y-4 pt-2">
                <div class="flex items-start gap-3.5 bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-xs">
                    <div class="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-md">!</div>
                    <div class="space-y-1 text-xs">
                        <div class="font-bold text-orange-300">Official Credentials Login:</div>
                        <ul class="space-y-1 text-slate-200 text-[11px] list-disc list-inside">
                            <li>Enter your registered email address</li>
                            <li>Enter your secure account password</li>
                            <li>Verify the alphanumeric security code</li>
                        </ul>
                    </div>
                </div>
                <div class="flex items-start gap-3.5 bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-xs">
                    <div class="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md">
                        <i class="fa-solid fa-key"></i>
                    </div>
                    <div class="space-y-1 text-xs">
                        <div class="font-bold text-amber-300">Parichay / JanParichay SSO:</div>
                        <ul class="space-y-1 text-slate-200 text-[11px] list-disc list-inside">
                            <li>Select Parichay from provider SSO options</li>
                            <li>Authenticate using your Government SSO credentials</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="relative z-10 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-300 font-semibold">
            <span>StatSkill AI • MoSPI Capacity Building</span>
            <span>WCAG 2.1 AA Compliant</span>
        </div>
        `;
    }

    // -------------------------------------------------------------
    // LEFT GRAPHIC B: HOW TO REGISTER
    // -------------------------------------------------------------
    function renderLeftRegisterGraphic(step) {
        return `
        <div class="relative z-10 space-y-6 my-auto">
            <div class="text-center space-y-1">
                <p class="text-xs font-bold uppercase tracking-widest text-blue-200">Welcome to StatSkill AI</p>
                <h2 class="text-2xl sm:text-3xl font-black text-white font-sans">How To Register</h2>
            </div>
            <div class="grid grid-cols-2 gap-3 pt-2">
                <div class="p-3.5 bg-white/10 border border-white/15 rounded-2xl text-center space-y-1.5 backdrop-blur-xs">
                    <div class="w-8 h-8 rounded-full bg-amber-400 text-slate-950 mx-auto flex items-center justify-center text-sm font-bold shadow">1</div>
                    <p class="text-[11px] text-slate-200 leading-snug">Select Ministry → Department → Designation in order</p>
                </div>
                <div class="p-3.5 bg-white/10 border border-white/15 rounded-2xl text-center space-y-1.5 backdrop-blur-xs">
                    <div class="w-8 h-8 rounded-full bg-orange-400 text-white mx-auto flex items-center justify-center text-sm font-bold shadow">2</div>
                    <p class="text-[11px] text-slate-200 leading-snug">Enter email to activate the Send OTP button</p>
                </div>
                <div class="p-3.5 bg-white/10 border border-white/15 rounded-2xl text-center space-y-1.5 backdrop-blur-xs">
                    <div class="w-8 h-8 rounded-full bg-orange-500 text-white mx-auto flex items-center justify-center text-sm font-bold shadow">3</div>
                    <p class="text-[11px] text-slate-200 leading-snug">Verify 6-digit OTP & create a secure password</p>
                </div>
                <div class="p-3.5 bg-white/10 border border-white/15 rounded-2xl text-center space-y-1.5 backdrop-blur-xs">
                    <div class="w-8 h-8 rounded-full bg-blue-400 text-slate-950 mx-auto flex items-center justify-center text-sm font-bold shadow">4</div>
                    <p class="text-[11px] text-slate-200 leading-snug">Access your personalized competency dashboard</p>
                </div>
            </div>
        </div>
        <div class="relative z-10 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-300 font-semibold">
            <span>StatSkill AI • MoSPI Capacity Building</span>
            <button onclick="store.openNodalModal()" class="text-amber-300 font-bold underline cursor-pointer">Need Nodal Help?</button>
        </div>
        `;
    }

    // -------------------------------------------------------------
    // RIGHT FORM A: RETURNING USER LOGIN TAB
    // -------------------------------------------------------------
    function renderLoginForm(state) {
        const canLogin = authState.loginEmail && authState.loginPassword && isRobotChecked && !authState.isLoggingIn;

        return `
        <div class="space-y-4 my-auto max-w-md mx-auto w-full">
            
            <!-- Logo Header -->
            <div class="text-center space-y-1">
                <div class="inline-flex items-center gap-2">
                    <div class="w-10 h-10 rounded-xl bg-navy-900 text-orange-400 flex items-center justify-center text-xl font-black shadow" style="background:#0B2545;">
                        <i class="fa-solid fa-chart-network"></i>
                    </div>
                    <div class="text-left">
                        <span class="text-2xl font-black tracking-tight text-slate-900 font-sans" style="color:#0B2545;">StatSkill <span class="text-blue-600">AI</span></span>
                        <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">MoSPI National Portal</div>
                    </div>
                </div>
            </div>

            <div class="text-center text-xs font-bold text-slate-600 border-b border-slate-200 pb-2">
                <span class="text-blue-700 font-extrabold text-sm">Official Account Login</span>
            </div>

            <!-- Login Form Error Notice -->
            <div id="loginErrorNotice" class="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-shake ${authState.loginError ? '' : 'hidden'}">
                <i class="fa-solid fa-circle-exclamation text-sm text-red-600 flex-shrink-0"></i>
                <span id="loginErrorText" class="font-semibold">${authState.loginError || ''}</span>
            </div>

            <form onsubmit="event.preventDefault(); handleLoginSubmit();" class="space-y-3">
                
                <!-- Email Field -->
                <div class="space-y-1">
                    <label class="block text-xs font-bold text-slate-700">Email Address <span class="text-red-500">*</span></label>
                    <input id="loginEmail" type="email" required value="${authState.loginEmail}" oninput="updateLoginState()" placeholder="e.g. officer@nic.in or yourname@gmail.com" class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600">
                </div>

                <!-- Password Field -->
                <div class="space-y-1">
                    <div class="flex justify-between items-center">
                        <label class="block text-xs font-bold text-slate-700">Password <span class="text-red-500">*</span></label>
                    </div>
                    <div class="relative">
                        <input id="loginPassword" type="password" required value="${authState.loginPassword}" oninput="updateLoginState()" placeholder="••••••••••••" class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10">
                        <button type="button" onclick="togglePasswordVisibility('loginPassword', this)" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>

                <!-- DUAL SECURITY VERIFICATION (Enter CAPTCHA Code OR 1-Click "I'm not a robot") -->
                <div class="space-y-1.5 pt-0.5">
                    <label class="block text-xs font-bold text-slate-700">Security Verification <span class="text-red-500">*</span></label>
                    <div class="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
                        
                        <!-- CAPTCHA Display Card with Mixed Case + Refresh + Audio -->
                        <div class="flex items-center justify-between bg-slate-900 px-3.5 py-2 rounded-lg border border-slate-700 shadow-inner">
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] text-slate-400 font-mono uppercase tracking-wider">CAPTCHA:</span>
                                <span class="captchaCodeDisplay text-amber-400 font-mono font-black text-base tracking-widest select-none">${currentCaptchaCode}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <button type="button" onclick="playAudioCaptcha()" class="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-md text-xs cursor-pointer transition-colors" title="Listen to CAPTCHA">
                                    <i class="fa-solid fa-volume-high"></i>
                                </button>
                                <button type="button" onclick="refreshCaptcha()" class="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-md text-xs cursor-pointer transition-colors" title="Generate New CAPTCHA">
                                    <i class="fa-solid fa-rotate-right"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Two-way verification: Type CAPTCHA Code OR Click "I'm not a robot" -->
                        <div class="flex flex-col sm:flex-row items-center gap-2">
                            <div class="relative flex-1 w-full">
                                <input type="text" id="loginCaptchaInput" placeholder="Enter CAPTCHA code" oninput="handleCaptchaInputChange(this.value, 'login')" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-600 pr-20">
                                <div id="loginCaptchaBadge" class="${isRobotChecked ? '' : 'hidden'} absolute right-2 top-2 text-emerald-600 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                                    <i class="fa-solid fa-circle-check text-xs"></i> <span>Verified</span>
                                </div>
                            </div>
                            <button type="button" onclick="quickVerifyRobot('login')" id="loginQuickVerifyBtn" class="w-full sm:w-auto px-3.5 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${isRobotChecked ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-2xs' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'}">
                                <i class="fa-solid ${isRobotChecked ? 'fa-circle-check text-emerald-600' : 'fa-shield-halved text-blue-600'}"></i>
                                <span>${isRobotChecked ? 'Verified' : "I'm not a robot"}</span>
                            </button>
                        </div>

                        <div id="loginCaptchaError" class="text-[11px] text-red-600 font-semibold hidden">
                            <i class="fa-solid fa-circle-exclamation"></i> Security verification required.
                        </div>
                    </div>
                </div>

                <!-- Main Login Button -->
                <button type="submit" id="loginSubmitBtn" class="w-full py-2.5 ${canLogin ? 'bg-[#0077d6] hover:bg-[#0066cc] cursor-pointer shadow-md' : 'bg-slate-300 cursor-pointer'} text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                    <span id="loginBtnText">${authState.isLoggingIn ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Logging in...' : 'Log In'}</span>
                </button>
            </form>

            <!-- Provider SSO Selector -->
            <div class="space-y-2 pt-1">
                <div class="relative flex py-1 items-center">
                    <div class="flex-grow border-t border-slate-200"></div>
                    <span class="flex-shrink mx-3 text-slate-400 text-[11px] font-bold">or</span>
                    <div class="flex-grow border-t border-slate-200"></div>
                </div>
                <div class="space-y-1">
                    <select onchange="if(this.value) alert('Redirecting to official Single Sign-On provider: ' + this.value)" class="w-full px-3.5 py-2 bg-white border border-[#0077d6] text-[#0077d6] rounded-lg text-xs font-bold text-center focus:outline-none cursor-pointer">
                        <option value="">Login with Provider SSO ∨</option>
                        <option value="Parichay Single Sign-On">Parichay (Govt Officer SSO)</option>
                        <option value="JanParichay">JanParichay National Portal</option>
                        <option value="iGOT Karmayogi SSO">iGOT Karmayogi Single Sign-On</option>
                    </select>
                </div>
            </div>

            <!-- Footer Toggle to Register -->
            <div class="text-center text-xs font-bold text-slate-600 pt-1">
                Don't have an account yet? 
                <button type="button" onclick="switchTab('register')" class="text-[#0077d6] hover:underline font-extrabold cursor-pointer">Register here</button>
            </div>
        </div>
        `;
    }

    // -------------------------------------------------------------
    // RIGHT FORM B: REGISTRATION WIZARD (STEP 1, 2, 3)
    // -------------------------------------------------------------
    function renderRegistrationWizard(state, step) {
        return `
        <div class="space-y-3 my-auto max-w-lg mx-auto w-full">
            
            <!-- Header Back to Login + Title -->
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                <div class="flex items-center gap-2">
                    <button type="button" onclick="switchTab('login')" class="text-slate-600 hover:text-slate-900 text-base cursor-pointer">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <h2 class="text-xl sm:text-2xl font-black text-slate-900 font-sans">Official Registration</h2>
                </div>
                <button type="button" onclick="switchTab('login')" class="text-xs text-blue-600 font-bold hover:underline cursor-pointer">
                    Already registered? Log in
                </button>
            </div>

            <!-- Step Progress Bar -->
            <div class="flex items-center justify-between text-xs py-1">
                <div class="flex items-center gap-1.5">
                    <div class="w-5 h-5 rounded-full ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'} font-bold flex items-center justify-center text-[11px]">1</div>
                    <span class="font-bold ${step >= 1 ? 'text-blue-600' : 'text-slate-400'} text-[11px]">Hierarchy & Email</span>
                </div>
                <div class="flex-1 h-1 ${step >= 2 ? 'bg-orange-500' : 'bg-slate-200'} mx-2 rounded-full"></div>
                <div class="flex items-center gap-1.5">
                    <div class="w-5 h-5 rounded-full ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'} font-bold flex items-center justify-center text-[11px]">2</div>
                    <span class="font-bold ${step >= 2 ? 'text-blue-600' : 'text-slate-400'} text-[11px]">OTP</span>
                </div>
                <div class="flex-1 h-1 ${step >= 3 ? 'bg-orange-500' : 'bg-slate-200'} mx-2 rounded-full"></div>
                <div class="flex items-center gap-1.5">
                    <div class="w-5 h-5 rounded-full ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'} font-bold flex items-center justify-center text-[11px]">3</div>
                    <span class="font-bold ${step >= 3 ? 'text-blue-600' : 'text-slate-400'} text-[11px]">Password</span>
                </div>
            </div>

            ${step === 1 ? renderStep1() : (step === 2 ? renderStep2() : renderStep3())}

        </div>
        `;
    }

    // -------------------------------------------------------------
    // STEP 1: CASCADING HIERARCHY DETAILS & EMAIL UNLOCK
    // -------------------------------------------------------------
    function renderStep1() {
        const govType = authState.govType || 'central';
        const minSelected = isMinistrySelected();
        const deptSelected = isDepartmentSelected();
        const desigSelected = isDesignationSelected();
        const emailUnlocked = isAllPriorFilled();
        const canSendOtp = isStep1Valid();

        // 1. Fetch Ministries / States
        let ministryOptions = [];
        if (window.OrgDataService) {
            if (govType === 'central') {
                ministryOptions = window.OrgDataService.getMinistries().map(m => m.name);
            } else {
                ministryOptions = window.OrgDataService.getStatesAndUTs().map(s => s.name);
            }
        }
        if (!ministryOptions.length) {
            ministryOptions = [
                "Ministry of Statistics & Programme Implementation (MoSPI)",
                "National Statistical Office (NSO)",
                "Ministry of Finance",
                "Ministry of Commerce & Industry",
                "Ministry of Agriculture & Farmers Welfare",
                "Ministry of Health & Family Welfare",
                "State Directorate of Economics & Statistics (DES)"
            ];
        }

        // 2. Fetch Cascaded Departments for current selected Ministry
        const departmentOptions = minSelected ? getDepartmentList(govType, authState.ministry) : [];

        // 3. Fetch Cascaded Designations for current selected Department
        const designationOptions = deptSelected ? getDesignationList(govType, authState.ministry, authState.department) : [];

        return `
        <form id="regStep1Form" onsubmit="event.preventDefault(); handleStep1Submit();" class="space-y-2.5">
            
            <div id="step1ErrorNotice" class="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-shake ${authState.step1Error ? '' : 'hidden'}">
                <i class="fa-solid fa-circle-exclamation text-sm text-red-600 flex-shrink-0"></i>
                <span id="step1ErrorText" class="font-semibold">${authState.step1Error || ''}</span>
            </div>

            <!-- 1. Full Name -->
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">1. Full Name <span class="text-red-500">*</span></label>
                <input id="regFullName" type="text" required value="${authState.name}" oninput="handleNameChange(this.value)" placeholder="Enter your full official name" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600">
            </div>

            <!-- 2. Administration Type (Center vs State) -->
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">2. Administration Type <span class="text-red-500">*</span></label>
                <div class="grid grid-cols-2 gap-2">
                    <button type="button" onclick="setGovType('central')" id="btnGovCentral" class="py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${govType === 'central' ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 shadow-xs' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}">
                        <i class="fa-solid fa-building-columns text-xs"></i>
                        <span>Central Government</span>
                    </button>
                    <button type="button" onclick="setGovType('state')" id="btnGovState" class="py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${govType === 'state' ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 shadow-xs' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}">
                        <i class="fa-solid fa-landmark-flag text-xs"></i>
                        <span>State / UT Government</span>
                    </button>
                </div>
            </div>

            <!-- 3. Ministry / State (Select FIRST) -->
            <div class="space-y-1">
                <label id="ministryLabel" class="block text-xs font-bold text-slate-700">
                    3. ${govType === 'central' ? 'Ministry / Central Entity' : 'State / UT Administration'} <span class="text-red-500">*</span>
                </label>
                <select id="regMinistrySelect" required onchange="handleMinistryChange(this.value)" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer">
                    <option value="">${govType === 'central' ? '-- Select Ministry or Department --' : '-- Select State / UT --'}</option>
                    ${ministryOptions.map(m => `
                        <option value="${m}" ${authState.ministry === m ? 'selected' : ''}>${m}</option>
                    `).join('')}
                </select>
            </div>

            <!-- 4. Department / Division (LOCKED until Ministry is selected) -->
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">4. Department / Division <span class="text-red-500">*</span></label>
                <select id="regDepartmentSelect" required ${!minSelected ? 'disabled' : ''} onchange="handleDepartmentChange(this.value)" class="w-full px-3 py-2 ${minSelected ? 'bg-white border-slate-300 text-slate-800 cursor-pointer' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'} rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="">${minSelected ? '-- Select Department / Division --' : '-- Select Ministry first --'}</option>
                    ${departmentOptions.map(d => `
                        <option value="${d}" ${authState.department === d ? 'selected' : ''}>${d}</option>
                    `).join('')}
                </select>
            </div>

            <!-- 5. Designation (LOCKED until Department is selected) -->
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">5. Designation <span class="text-red-500">*</span></label>
                <select id="regDesignationSelect" required ${!deptSelected ? 'disabled' : ''} onchange="handleDesignationChange(this.value)" class="w-full px-3 py-2 ${deptSelected ? 'bg-white border-slate-300 text-slate-800 cursor-pointer' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'} rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="">${deptSelected ? '-- Select Designation --' : '-- Select Department first --'}</option>
                    ${designationOptions.map(des => `
                        <option value="${des}" ${authState.designation === des ? 'selected' : ''}>${des}</option>
                    `).join('')}
                </select>
            </div>

            <!-- 6. Official Email Address (LOCKED until Name, Ministry, Department & Designation are all selected) -->
            <div class="space-y-1 pt-0.5">
                <label class="block text-xs font-bold text-slate-700">
                    6. Email Address <span class="text-red-500">*</span>
                </label>
                <input id="regOfficialEmail" type="email" required ${!emailUnlocked ? 'disabled' : ''} value="${authState.email}" oninput="handleEmailChange(this.value)" placeholder="${emailUnlocked ? 'e.g. officer@nic.in or yourname@gmail.com' : 'Fill all fields above to enter email'}" class="w-full px-3 py-2 ${emailUnlocked ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'} border rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600">
                <div id="step1EmailError" class="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1 hidden">
                    <i class="fa-solid fa-circle-exclamation text-xs"></i> Please enter a valid email format
                </div>
            </div>

            <!-- 7. Send OTP Button (LOCKED until valid Email is entered) -->
            <div class="pt-1.5">
                <button type="button" onclick="handleStep1Submit()" id="sendOtpBtn" ${!canSendOtp ? 'disabled' : ''} class="w-full py-2.5 ${canSendOtp ? 'bg-[#0077d6] hover:bg-[#0066cc] cursor-pointer shadow-sm' : 'bg-slate-300 cursor-not-allowed'} text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-2">
                    <span id="sendOtpBtnText">${authState.isSendingOtp ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending OTP...' : 'Send OTP Code →'}</span>
                </button>
            </div>

        </form>
        `;
    }

    // -------------------------------------------------------------
    // STEP 2: OTP VERIFICATION
    // -------------------------------------------------------------
    function renderStep2() {
        const isOtpFilled = (authState.otp || '').trim().length === 6;
        const canVerify = isOtpFilled && !authState.isVerifyingOtp;

        return `
        <form id="regStep2Form" onsubmit="event.preventDefault(); handleStep2Verify();" class="space-y-4">
            
            <div class="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-blue-900 text-xs">Verification Code Sent</span>
                    ${authState.demoOtp ? `<span class="bg-blue-600 text-white font-mono text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">OTP: ${authState.demoOtp}</span>` : ''}
                </div>
                <div class="text-[11px] text-slate-600">Enter the 6-digit OTP sent to <strong>${authState.email}</strong></div>
                
                ${authState.demoOtp ? `
                <div class="pt-1">
                    <button type="button" onclick="quickFillOtp('${authState.demoOtp}')" class="text-[11px] font-bold text-blue-700 bg-white hover:bg-blue-100 border border-blue-300 px-3 py-1 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs">
                        <i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i> Click to Auto-Fill OTP (${authState.demoOtp})
                    </button>
                </div>
                ` : ''}
            </div>

            <div id="step2ErrorNotice" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-shake ${authState.step2Error ? '' : 'hidden'}">
                <i class="fa-solid fa-circle-exclamation text-base text-red-600 flex-shrink-0"></i>
                <span id="step2ErrorText" class="font-semibold">${authState.step2Error || ''}</span>
            </div>

            <!-- OTP Input -->
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">6-Digit OTP Code <span class="text-red-500">*</span></label>
                <input id="regEmailOtp" type="text" maxLength="6" required value="${authState.otp}" oninput="updateStep2State()" placeholder="Enter 6-digit OTP" class="w-full px-3.5 py-3 bg-white border border-blue-400 rounded-lg text-center font-mono font-black text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-600">
            </div>

            <!-- Resend Timer & Button -->
            <div class="flex items-center justify-between text-xs pt-1">
                <div id="resendTimerContainer">
                    ${authState.resendTimer > 0 ? `
                        <span id="resendTimerDisplay" class="text-slate-500 font-medium"><i class="fa-regular fa-clock"></i> Resend code in ${authState.resendTimer}s</span>
                    ` : `
                        <button type="button" onclick="handleResendOtp()" class="text-blue-600 font-bold hover:underline cursor-pointer"><i class="fa-solid fa-rotate-right"></i> Resend OTP Code</button>
                    `}
                </div>
                <button type="button" onclick="goToStep(1)" class="text-slate-500 hover:text-slate-800 text-[11px] font-semibold underline cursor-pointer">Edit Hierarchy / Email</button>
            </div>

            <!-- Verify Button -->
            <div class="flex items-center justify-between pt-3">
                <button type="button" onclick="goToStep(1)" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">
                    ← Back
                </button>
                <button type="button" onclick="handleStep2Verify()" id="verifyOtpBtn" ${!canVerify ? 'disabled' : ''} class="px-6 py-2.5 ${canVerify ? 'bg-[#0077d6] hover:bg-[#0066cc] cursor-pointer' : 'bg-slate-300 cursor-not-allowed'} text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-2">
                    <span id="verifyOtpBtnText">${authState.isVerifyingOtp ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying...' : 'Verify OTP →'}</span>
                </button>
            </div>

        </form>
        `;
    }

    // -------------------------------------------------------------
    // STEP 3: CREATE PASSWORD
    // -------------------------------------------------------------
    function renderStep3() {
        const pwd = authState.password || '';
        const cpwd = authState.confirmPassword || '';

        const lenOk = isPasswordLengthValid(pwd);
        const letterOk = hasPasswordLetter(pwd);
        const numOk = hasPasswordNumber(pwd);
        const matchOk = cpwd.length > 0 && pwd === cpwd;

        const canRegister = isStep3Valid() && !authState.isRegistering;

        return `
        <form id="regStep3Form" onsubmit="event.preventDefault(); handleStep3Register();" class="space-y-3.5">
            
            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <i class="fa-solid fa-circle-check text-emerald-600 text-base flex-shrink-0"></i>
                <span>Email <strong>${authState.email}</strong> verified! Create your password.</span>
            </div>

            <div id="step3ErrorNotice" class="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-shake ${authState.step3Error ? '' : 'hidden'}">
                <i class="fa-solid fa-circle-exclamation text-base text-red-600 flex-shrink-0"></i>
                <span id="step3ErrorText" class="font-semibold">${authState.step3Error || ''}</span>
            </div>

            <!-- Password Field -->
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">Create Password <span class="text-red-500">*</span></label>
                <div class="relative">
                    <input id="regPassword" type="password" required value="${pwd}" oninput="updateStep3State()" placeholder="Minimum 8 characters" class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10">
                    <button type="button" onclick="togglePasswordVisibility('regPassword', this)" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </div>

            <!-- Confirm Password Field -->
            <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">Confirm Password <span class="text-red-500">*</span></label>
                <div class="relative">
                    <input id="regConfirmPassword" type="password" required value="${cpwd}" oninput="updateStep3State()" placeholder="Re-enter password" class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10">
                    <button type="button" onclick="togglePasswordVisibility('regConfirmPassword', this)" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
                <div id="passwordMatchError" class="text-[11px] text-red-600 font-semibold mt-1 ${cpwd && !matchOk ? '' : 'hidden'}">Passwords do not match</div>
            </div>

            <!-- Live Validation Feedback Checklist -->
            <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                <div class="font-bold text-slate-700 text-[11px]">Password Security Checklist:</div>
                <div class="grid grid-cols-1 gap-1 text-[11px]">
                    <div id="chkLen" class="flex items-center gap-2 ${lenOk ? 'text-emerald-700 font-bold' : 'text-slate-500'}">
                        <i class="fa-solid ${lenOk ? 'fa-circle-check text-emerald-600' : 'fa-circle-dot text-slate-300'}"></i>
                        <span>At least 8 characters</span>
                    </div>
                    <div id="chkLetter" class="flex items-center gap-2 ${letterOk ? 'text-emerald-700 font-bold' : 'text-slate-500'}">
                        <i class="fa-solid ${letterOk ? 'fa-circle-check text-emerald-600' : 'fa-circle-dot text-slate-300'}"></i>
                        <span>Contains at least one letter</span>
                    </div>
                    <div id="chkNum" class="flex items-center gap-2 ${numOk ? 'text-emerald-700 font-bold' : 'text-slate-500'}">
                        <i class="fa-solid ${numOk ? 'fa-circle-check text-emerald-600' : 'fa-circle-dot text-slate-300'}"></i>
                        <span>Contains at least one number</span>
                    </div>
                </div>
            </div>

            <!-- DUAL SECURITY VERIFICATION (Enter CAPTCHA Code OR 1-Click "I'm not a robot") -->
            <div class="space-y-1.5 pt-0.5">
                <label class="block text-xs font-bold text-slate-700">Security Verification <span class="text-red-500">*</span></label>
                <div class="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
                    
                    <!-- CAPTCHA Display Card with Mixed Case + Refresh + Audio -->
                    <div class="flex items-center justify-between bg-slate-900 px-3.5 py-2 rounded-lg border border-slate-700 shadow-inner">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] text-slate-400 font-mono uppercase tracking-wider">CAPTCHA:</span>
                            <span class="captchaCodeDisplay text-amber-400 font-mono font-black text-base tracking-widest select-none">${currentCaptchaCode}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <button type="button" onclick="playAudioCaptcha()" class="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-md text-xs cursor-pointer transition-colors" title="Listen to CAPTCHA">
                                <i class="fa-solid fa-volume-high"></i>
                            </button>
                            <button type="button" onclick="refreshCaptcha()" class="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-md text-xs cursor-pointer transition-colors" title="Generate New CAPTCHA">
                                <i class="fa-solid fa-rotate-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Two-way verification: Type CAPTCHA Code OR Click "I'm not a robot" -->
                    <div class="flex flex-col sm:flex-row items-center gap-2">
                        <div class="relative flex-1 w-full">
                            <input type="text" id="regCaptchaInput" placeholder="Enter CAPTCHA code" oninput="handleCaptchaInputChange(this.value, 'register')" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-600 pr-20">
                            <div id="regCaptchaBadge" class="${isRobotChecked ? '' : 'hidden'} absolute right-2 top-2 text-emerald-600 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                                <i class="fa-solid fa-circle-check text-xs"></i> <span>Verified</span>
                            </div>
                        </div>
                        <button type="button" onclick="quickVerifyRobot('register')" id="regQuickVerifyBtn" class="w-full sm:w-auto px-3.5 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${isRobotChecked ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-2xs' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'}">
                            <i class="fa-solid ${isRobotChecked ? 'fa-circle-check text-emerald-600' : 'fa-shield-halved text-blue-600'}"></i>
                            <span>${isRobotChecked ? 'Verified' : "I'm not a robot"}</span>
                        </button>
                    </div>

                    <div id="regCaptchaError" class="text-[11px] text-red-600 font-semibold hidden">
                        <i class="fa-solid fa-circle-exclamation"></i> Security verification required.
                    </div>
                </div>
            </div>

            <!-- Complete Registration Button -->
            <div class="flex items-center justify-between pt-2">
                <button type="button" onclick="goToStep(2)" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">
                    ← Back
                </button>
                <button type="submit" id="registerBtn" class="px-6 py-2.5 ${canRegister ? 'bg-[#0077d6] hover:bg-[#0066cc] cursor-pointer shadow-md' : 'bg-slate-300 cursor-pointer'} text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-2">
                    <span id="registerBtnText">${authState.isRegistering ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating Account...' : 'Complete Registration'}</span>
                </button>
            </div>

        </form>
        `;
    }

    // -------------------------------------------------------------
    // LIVE CASCADING STEP 1 HANDLERS
    // -------------------------------------------------------------

    window.handleNameChange = function(val) {
        authState.name = (val || '').trim();
        checkAndUnlockEmail();
    };

    window.setGovType = function(type) {
        authState.govType = type;
        authState.ministry = '';
        authState.department = '';
        authState.designation = '';
        authState.email = '';

        const btnCentral = document.getElementById('btnGovCentral');
        const btnState = document.getElementById('btnGovState');
        const ministryLabel = document.getElementById('ministryLabel');
        const minSelect = document.getElementById('regMinistrySelect');
        const deptSelect = document.getElementById('regDepartmentSelect');
        const desSelect = document.getElementById('regDesignationSelect');

        if (btnCentral && btnState) {
            if (type === 'central') {
                btnCentral.className = "py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 shadow-xs";
                btnState.className = "py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer bg-white border-slate-300 text-slate-600 hover:bg-slate-50";
            } else {
                btnState.className = "py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 shadow-xs";
                btnCentral.className = "py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer bg-white border-slate-300 text-slate-600 hover:bg-slate-50";
            }
        }

        if (ministryLabel) {
            ministryLabel.innerHTML = `3. ${type === 'central' ? 'Ministry / Central Entity' : 'State / UT Administration'} <span class="text-red-500">*</span>`;
        }

        if (minSelect) {
            let options = [];
            if (window.OrgDataService) {
                if (type === 'central') {
                    options = window.OrgDataService.getMinistries().map(m => m.name);
                } else {
                    options = window.OrgDataService.getStatesAndUTs().map(s => s.name);
                }
            }
            if (!options.length) {
                options = [
                    "Ministry of Statistics & Programme Implementation (MoSPI)",
                    "Ministry of Finance",
                    "State Directorate of Economics & Statistics (DES)"
                ];
            }
            minSelect.innerHTML = `
                <option value="">${type === 'central' ? '-- Select Ministry or Department --' : '-- Select State / UT --'}</option>
                ${options.map(o => `<option value="${o}">${o}</option>`).join('')}
            `;
        }

        // Lock Department & Designation
        if (deptSelect) {
            deptSelect.setAttribute('disabled', 'true');
            deptSelect.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-medium focus:outline-none";
            deptSelect.innerHTML = `<option value="">-- Select Ministry first --</option>`;
        }

        if (desSelect) {
            desSelect.setAttribute('disabled', 'true');
            desSelect.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-medium focus:outline-none";
            desSelect.innerHTML = `<option value="">-- Select Department first --</option>`;
        }

        checkAndUnlockEmail();
    };

    // When Ministry is selected -> Unlock & Populate Department
    window.handleMinistryChange = function(val) {
        authState.ministry = (val || '').trim();
        authState.department = '';
        authState.designation = '';
        authState.email = '';

        const deptSelect = document.getElementById('regDepartmentSelect');
        const desSelect = document.getElementById('regDesignationSelect');
        const minSelected = isMinistrySelected();

        if (deptSelect) {
            if (minSelected) {
                const depts = getDepartmentList(authState.govType, authState.ministry);
                deptSelect.removeAttribute('disabled');
                deptSelect.className = "w-full px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer";
                deptSelect.innerHTML = `
                    <option value="">-- Select Department / Division --</option>
                    ${depts.map(d => `<option value="${d}">${d}</option>`).join('')}
                `;
                deptSelect.focus();
            } else {
                deptSelect.setAttribute('disabled', 'true');
                deptSelect.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-medium focus:outline-none";
                deptSelect.innerHTML = `<option value="">-- Select Ministry first --</option>`;
            }
        }

        if (desSelect) {
            desSelect.setAttribute('disabled', 'true');
            desSelect.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-medium focus:outline-none";
            desSelect.innerHTML = `<option value="">-- Select Department first --</option>`;
        }

        checkAndUnlockEmail();
    };

    // When Department is selected -> Unlock & Populate Designation
    window.handleDepartmentChange = function(val) {
        authState.department = (val || '').trim();
        authState.designation = '';
        authState.email = '';

        const desSelect = document.getElementById('regDesignationSelect');
        const deptSelected = isDepartmentSelected();

        if (desSelect) {
            if (deptSelected) {
                const desigs = getDesignationList(authState.govType, authState.ministry, authState.department);
                desSelect.removeAttribute('disabled');
                desSelect.className = "w-full px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer";
                desSelect.innerHTML = `
                    <option value="">-- Select Designation --</option>
                    ${desigs.map(des => `<option value="${des}">${des}</option>`).join('')}
                `;
                desSelect.focus();
            } else {
                desSelect.setAttribute('disabled', 'true');
                desSelect.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-medium focus:outline-none";
                desSelect.innerHTML = `<option value="">-- Select Department first --</option>`;
            }
        }

        checkAndUnlockEmail();
    };

    // When Designation is selected -> Check & Unlock Email
    window.handleDesignationChange = function(val) {
        authState.designation = (val || '').trim();
        checkAndUnlockEmail();
    };

    window.checkAndUnlockEmail = function() {
        const emailUnlocked = isAllPriorFilled();
        const emailInput = document.getElementById('regOfficialEmail');
        const errNotice = document.getElementById('step1ErrorNotice');

        if (errNotice) errNotice.classList.add('hidden');

        if (emailInput) {
            if (emailUnlocked) {
                emailInput.removeAttribute('disabled');
                emailInput.className = "w-full px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600";
                emailInput.placeholder = "e.g. officer@nic.in or yourname@gmail.com";
                emailInput.focus();
            } else {
                emailInput.value = '';
                authState.email = '';
                emailInput.setAttribute('disabled', 'true');
                emailInput.className = "w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-medium focus:outline-none";
                emailInput.placeholder = "Fill all fields above to enter email";
            }
        }

        handleEmailChange(emailInput ? emailInput.value : '');
    };

    window.handleEmailChange = function(val) {
        authState.email = (val || '').trim();
        const emailInput = document.getElementById('regOfficialEmail');
        const emailErrEl = document.getElementById('step1EmailError');
        const sendOtpBtn = document.getElementById('sendOtpBtn');

        const priorFilled = isAllPriorFilled();
        const emailValid = isValidEmail(authState.email);

        if (emailErrEl && emailInput) {
            if (authState.email !== '' && !emailValid) {
                emailErrEl.classList.remove('hidden');
                emailInput.classList.add('border-red-500', 'ring-1', 'ring-red-500');
            } else {
                emailErrEl.classList.add('hidden');
                emailInput.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
            }
        }

        if (sendOtpBtn) {
            if (priorFilled && emailValid && !authState.isSendingOtp) {
                sendOtpBtn.removeAttribute('disabled');
                sendOtpBtn.className = "w-full py-2.5 bg-[#0077d6] hover:bg-[#0066cc] text-white font-bold rounded-lg text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2";
            } else {
                sendOtpBtn.setAttribute('disabled', 'true');
                sendOtpBtn.className = "w-full py-2.5 bg-slate-300 text-white font-bold rounded-lg text-xs shadow-none transition-all cursor-not-allowed flex items-center justify-center gap-2";
            }
        }
    };

    window.quickFillOtp = function(code) {
        const otpEl = document.getElementById('regEmailOtp');
        if (otpEl) {
            otpEl.value = code;
            authState.otp = code;
            updateStep2State();
        }
    };

    window.updateStep2State = function() {
        const otpEl = document.getElementById('regEmailOtp');
        const btn = document.getElementById('verifyOtpBtn');
        if (!otpEl || !btn) return;

        let otp = otpEl.value.replace(/\D/g, '').slice(0, 6);
        otpEl.value = otp;
        authState.otp = otp;

        if (otp.length === 6 && !authState.isVerifyingOtp) {
            btn.removeAttribute('disabled');
            btn.className = "px-6 py-2.5 bg-[#0077d6] hover:bg-[#0066cc] text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2";
        } else {
            btn.setAttribute('disabled', 'true');
            btn.className = "px-6 py-2.5 bg-slate-300 text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-not-allowed flex items-center justify-center gap-2";
        }
    };

    window.updateStep3State = function() {
        const pwdEl = document.getElementById('regPassword');
        const cpwdEl = document.getElementById('regConfirmPassword');
        const btn = document.getElementById('registerBtn');
        const matchErr = document.getElementById('passwordMatchError');

        const pwd = pwdEl ? pwdEl.value : '';
        const cpwd = cpwdEl ? cpwdEl.value : '';

        authState.password = pwd;
        authState.confirmPassword = cpwd;

        const lenOk = isPasswordLengthValid(pwd);
        const letterOk = hasPasswordLetter(pwd);
        const numOk = hasPasswordNumber(pwd);
        const matchOk = cpwd.length > 0 && pwd === cpwd;

        const chkLen = document.getElementById('chkLen');
        const chkLetter = document.getElementById('chkLetter');
        const chkNum = document.getElementById('chkNum');

        if (chkLen) {
            chkLen.className = lenOk ? 'flex items-center gap-2 text-emerald-700 font-bold' : 'flex items-center gap-2 text-slate-500';
            chkLen.querySelector('i').className = lenOk ? 'fa-solid fa-circle-check text-emerald-600' : 'fa-solid fa-circle-dot text-slate-300';
        }
        if (chkLetter) {
            chkLetter.className = letterOk ? 'flex items-center gap-2 text-emerald-700 font-bold' : 'flex items-center gap-2 text-slate-500';
            chkLetter.querySelector('i').className = letterOk ? 'fa-solid fa-circle-check text-emerald-600' : 'fa-solid fa-circle-dot text-slate-300';
        }
        if (chkNum) {
            chkNum.className = numOk ? 'flex items-center gap-2 text-emerald-700 font-bold' : 'flex items-center gap-2 text-slate-500';
            chkNum.querySelector('i').className = numOk ? 'fa-solid fa-circle-check text-emerald-600' : 'fa-solid fa-circle-dot text-slate-300';
        }

        if (matchErr) {
            if (cpwd.length > 0 && !matchOk) matchErr.classList.remove('hidden');
            else matchErr.classList.add('hidden');
        }

        if (btn) {
            if (lenOk && letterOk && numOk && matchOk && isRobotChecked && !authState.isRegistering) {
                btn.removeAttribute('disabled');
                btn.className = "px-6 py-2.5 bg-[#0077d6] hover:bg-[#0066cc] text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2";
            } else {
                btn.className = "px-6 py-2.5 bg-[#0077d6] hover:bg-[#0066cc] text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2";
            }
        }
    };

    window.updateLoginState = function() {
        const emailEl = document.getElementById('loginEmail');
        const pwdEl = document.getElementById('loginPassword');
        const btn = document.getElementById('loginSubmitBtn');

        const email = emailEl ? emailEl.value.trim() : '';
        const pwd = pwdEl ? pwdEl.value : '';

        authState.loginEmail = email;
        authState.loginPassword = pwd;

        if (btn) {
            if (email !== '' && pwd !== '' && isRobotChecked && !authState.isLoggingIn) {
                btn.className = "w-full py-2.5 bg-[#0077d6] hover:bg-[#0066cc] text-white font-bold rounded-lg text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2";
            } else {
                btn.className = "w-full py-2.5 bg-[#0077d6] hover:bg-[#0066cc] text-white font-bold rounded-lg text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-2";
            }
        }
    };

    window.goToStep = function(targetStep) {
        if (targetStep === 3) {
            currentCaptchaCode = generateCaptchaCode();
            isRobotChecked = false;
        }
        authState.step = targetStep;
        if (window.store) window.store.notify();
    };

    // -------------------------------------------------------------
    // API ACTIONS & SUBMISSIONS
    // -------------------------------------------------------------

    // Step 1: Send OTP Submit Handler
    window.handleStep1Submit = function() {
        const nameInput = document.getElementById('regFullName');
        const minSelect = document.getElementById('regMinistrySelect');
        const deptSelect = document.getElementById('regDepartmentSelect');
        const desSelect = document.getElementById('regDesignationSelect');
        const emailInput = document.getElementById('regOfficialEmail');

        authState.name = nameInput ? nameInput.value.trim() : authState.name;
        authState.ministry = minSelect ? minSelect.value.trim() : authState.ministry;
        authState.department = deptSelect ? deptSelect.value.trim() : authState.department;
        authState.designation = desSelect ? desSelect.value.trim() : authState.designation;
        authState.email = emailInput ? emailInput.value.trim() : authState.email;

        const isPriorValid = isAllPriorFilled();
        const isEmailValid = isValidEmail(authState.email);

        // STRICT GUARD CLAUSE
        if (!isPriorValid || !isEmailValid) {
            const errNotice = document.getElementById('step1ErrorNotice');
            const errText = document.getElementById('step1ErrorText');

            let msg = "";
            if (!isNameFilled()) {
                msg = "Please enter your Full Name.";
            } else if (!isMinistrySelected()) {
                msg = "Please select your Ministry or State/UT Administration.";
            } else if (!isDepartmentSelected()) {
                msg = "Please select your Department / Division.";
            } else if (!isDesignationSelected()) {
                msg = "Please select your Official Designation.";
            } else if (!isEmailValid) {
                msg = "Please enter a valid email address format.";
            }

            if (errText) errText.textContent = msg;
            if (errNotice) errNotice.classList.remove('hidden');
            return;
        }

        authState.isSendingOtp = true;
        const btnText = document.getElementById('sendOtpBtnText');
        if (btnText) btnText.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending OTP...';
        handleEmailChange(authState.email);

        fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: authState.email, ministry: authState.ministry })
        })
        .then(res => res.json())
        .then(data => {
            authState.isSendingOtp = false;
            if (data.success) {
                authState.demoOtp = data.otp || '';
                authState.step = 2;
                if (window.store) window.store.notify();
                startResendTimer();
            } else {
                const errNotice = document.getElementById('step1ErrorNotice');
                const errText = document.getElementById('step1ErrorText');
                if (errText) errText.textContent = data.error || "Failed to send OTP. Please try again.";
                if (errNotice) errNotice.classList.remove('hidden');
                handleEmailChange(authState.email);
            }
        })
        .catch(err => {
            authState.isSendingOtp = false;
            const errNotice = document.getElementById('step1ErrorNotice');
            const errText = document.getElementById('step1ErrorText');
            if (errText) errText.textContent = "Network error connecting to backend server.";
            if (errNotice) errNotice.classList.remove('hidden');
            handleEmailChange(authState.email);
        });
    };

    window.handleResendOtp = function() {
        if (authState.resendTimer > 0) return;
        handleStep1Submit();
    };

    // Step 2: Verify OTP
    window.handleStep2Verify = function() {
        if (authState.otp.length !== 6) {
            const errNotice = document.getElementById('step2ErrorNotice');
            const errText = document.getElementById('step2ErrorText');
            if (errText) errText.textContent = "Please enter all 6 digits of the OTP.";
            if (errNotice) errNotice.classList.remove('hidden');
            return;
        }

        authState.isVerifyingOtp = true;
        const btnText = document.getElementById('verifyOtpBtnText');
        if (btnText) btnText.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying...';
        updateStep2State();

        fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: authState.email, otp: authState.otp })
        })
        .then(res => res.json())
        .then(data => {
            authState.isVerifyingOtp = false;
            if (data.success) {
                currentCaptchaCode = generateCaptchaCode();
                isRobotChecked = false;
                authState.step = 3;
                if (window.store) window.store.notify();
            } else {
                const errNotice = document.getElementById('step2ErrorNotice');
                const errText = document.getElementById('step2ErrorText');
                if (errText) errText.textContent = data.error || "Invalid OTP code. Please try again.";
                if (errNotice) errNotice.classList.remove('hidden');
                updateStep2State();
            }
        })
        .catch(err => {
            authState.isVerifyingOtp = false;
            const errNotice = document.getElementById('step2ErrorNotice');
            const errText = document.getElementById('step2ErrorText');
            if (errText) errText.textContent = "Network error verifying OTP code.";
            if (errNotice) errNotice.classList.remove('hidden');
            updateStep2State();
        });
    };

    // Step 3: Complete Registration
    window.handleStep3Register = function() {
        const pwdEl = document.getElementById('regPassword');
        const cpwdEl = document.getElementById('regConfirmPassword');
        const regErr = document.getElementById('regCaptchaError');

        authState.password = pwdEl ? pwdEl.value : authState.password;
        authState.confirmPassword = cpwdEl ? cpwdEl.value : authState.confirmPassword;

        if (!isRobotChecked) {
            if (regErr) regErr.classList.remove('hidden');
            const errNotice = document.getElementById('step3ErrorNotice');
            const errText = document.getElementById('step3ErrorText');
            if (errText) errText.textContent = "Please enter the CAPTCHA code or click \"I'm not a robot\".";
            if (errNotice) errNotice.classList.remove('hidden');
            return;
        }

        if (!isStep3Valid()) {
            const errNotice = document.getElementById('step3ErrorNotice');
            const errText = document.getElementById('step3ErrorText');
            if (errText) errText.textContent = "Please satisfy all password security rules.";
            if (errNotice) errNotice.classList.remove('hidden');
            return;
        }

        authState.isRegistering = true;
        const btnText = document.getElementById('registerBtnText');
        if (btnText) btnText.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating Account...';
        updateStep3State();

        fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: authState.name,
                email: authState.email,
                gov_type: authState.govType === 'central' ? 'Central Government' : 'State / UT Government',
                ministry: authState.ministry,
                department: authState.department,
                designation: authState.designation,
                password: authState.password
            })
        })
        .then(res => res.json())
        .then(data => {
            authState.isRegistering = false;
            if (data.success && data.user) {
                if (window.store) {
                    const target = window.store.state.pendingRedirectView || 'learner-dash';
                    window.store.state.pendingRedirectView = null;
                    window.store.state.user = data.user;
                    window.store.state.currentUser = data.user;
                    window.store.state.isAuthModalOpen = false;
                    resetAuthState();
                    window.store.navigate(target);
                }
            } else {
                const errNotice = document.getElementById('step3ErrorNotice');
                const errText = document.getElementById('step3ErrorText');
                if (errText) errText.textContent = data.error || "Registration failed. Please try again.";
                if (errNotice) errNotice.classList.remove('hidden');
                updateStep3State();
            }
        })
        .catch(err => {
            authState.isRegistering = false;
            const errNotice = document.getElementById('step3ErrorNotice');
            const errText = document.getElementById('step3ErrorText');
            if (errText) errText.textContent = "Network error registering user.";
            if (errNotice) errNotice.classList.remove('hidden');
            updateStep3State();
        });
    };

    // Returning User Login Submit
    window.handleLoginSubmit = function() {
        const emailEl = document.getElementById('loginEmail');
        const pwdEl = document.getElementById('loginPassword');
        const loginErr = document.getElementById('loginCaptchaError');

        authState.loginEmail = emailEl ? emailEl.value.trim() : '';
        authState.loginPassword = pwdEl ? pwdEl.value : '';

        if (!authState.loginEmail || !authState.loginPassword) {
            const errNotice = document.getElementById('loginErrorNotice');
            const errText = document.getElementById('loginErrorText');
            if (errText) errText.textContent = "Please enter both email and password.";
            if (errNotice) errNotice.classList.remove('hidden');
            return;
        }

        if (!isRobotChecked) {
            if (loginErr) loginErr.classList.remove('hidden');
            const errNotice = document.getElementById('loginErrorNotice');
            const errText = document.getElementById('loginErrorText');
            if (errText) errText.textContent = "Please enter the CAPTCHA code or click \"I'm not a robot\".";
            if (errNotice) errNotice.classList.remove('hidden');
            return;
        }

        authState.isLoggingIn = true;
        const btnText = document.getElementById('loginBtnText');
        if (btnText) btnText.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Logging in...';
        updateLoginState();

        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: authState.loginEmail,
                password: authState.loginPassword
            })
        })
        .then(res => res.json())
        .then(data => {
            authState.isLoggingIn = false;
            if (data.success && data.user) {
                if (window.store) {
                    const target = window.store.state.pendingRedirectView || 'learner-dash';
                    window.store.state.pendingRedirectView = null;
                    window.store.state.user = data.user;
                    window.store.state.currentUser = data.user;
                    window.store.state.isAuthModalOpen = false;
                    resetAuthState();
                    window.store.navigate(target);
                }
            } else {
                const errNotice = document.getElementById('loginErrorNotice');
                const errText = document.getElementById('loginErrorText');
                if (errText) errText.textContent = "Invalid email or password";
                if (errNotice) errNotice.classList.remove('hidden');
                updateLoginState();
            }
        })
        .catch(err => {
            authState.isLoggingIn = false;
            const errNotice = document.getElementById('loginErrorNotice');
            const errText = document.getElementById('loginErrorText');
            if (errText) errText.textContent = "Network error logging in.";
            if (errNotice) errNotice.classList.remove('hidden');
            updateLoginState();
        });
    };

    window.togglePasswordVisibility = function(inputId, btn) {
        const input = document.getElementById(inputId);
        if (input) {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            const icon = btn.querySelector('i');
            if (icon) icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        }
    };

    window.renderAuthModal = renderAuthModal;

})(window);
