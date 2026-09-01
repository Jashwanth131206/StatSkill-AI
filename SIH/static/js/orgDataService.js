/**
 * StatSkill AI — Master Official Statistics Administrative Hierarchy Dataset
 * 
 * Filtered specifically for the National Statistical System (NSS) of India:
 * - Top 10 High-Relevance Central Ministries producing & utilizing Official Statistics
 * - State Directorates of Economics & Statistics (DES) and District Statistical Offices across all 36 States & UTs
 * - Pure Official Statistical Cadre Designations (ISS, SSS, and State DES Statistical Officers)
 */

(function(window) {
    'use strict';

    // 1. APPROVED OFFICIAL GOVERNMENT EMAIL DOMAINS
    const APPROVED_GOVERNMENT_DOMAINS = [
        "gov.in", "nic.in", "mospi.gov.in", "niti.gov.in", "meity.gov.in",
        "finmin.nic.in", "icmr.org.in", "des.gov.in", "sansad.in",
        "ias.nic.in", "cag.gov.in", "upsc.gov.in",
        "ap.gov.in", "assam.gov.in", "bihar.gov.in", "cg.gov.in",
        "goa.gov.in", "gujarat.gov.in", "haryana.gov.in", "hp.gov.in", "jharkhand.gov.in",
        "karnataka.gov.in", "kerala.gov.in", "mp.gov.in", "maharashtra.gov.in", "manipur.gov.in",
        "meghalaya.gov.in", "mizoram.gov.in", "nagaland.gov.in", "odisha.gov.in", "pb.gov.in",
        "rajasthan.gov.in", "sikkim.gov.in", "tn.gov.in", "telangana.gov.in", "tripura.gov.in",
        "up.gov.in", "uk.gov.in", "wb.gov.in", "delhi.gov.in", "puducherry.gov.in",
        "jk.gov.in", "ladakh.gov.in", "chandigarh.gov.in", "andaman.gov.in"
    ];

    // 2. PURE OFFICIAL STATISTICAL CADRE DESIGNATIONS (ISS / SSS / State DES)
    const OFFICIAL_STATISTICAL_DESIGNATIONS = [
        { id: "desig_jso", title: "Junior Statistical Officer (JSO) — SSS Cadre", name: "Junior Statistical Officer (JSO) — SSS Cadre" },
        { id: "desig_sso", title: "Senior Statistical Officer (SSO) — SSS Cadre", name: "Senior Statistical Officer (SSO) — SSS Cadre" },
        { id: "desig_ad", title: "Assistant Director (Statistics / Data Analytics) — ISS Cadre", name: "Assistant Director (Statistics / Data Analytics) — ISS Cadre" },
        { id: "desig_dd", title: "Deputy Director (Survey Operations / National Accounts) — ISS Cadre", name: "Deputy Director (Survey Operations / National Accounts) — ISS Cadre" },
        { id: "desig_jd", title: "Joint Director (Economic Statistics / Macroeconomics) — ISS Cadre", name: "Joint Director (Economic Statistics / Macroeconomics) — ISS Cadre" },
        { id: "desig_dir", title: "Director (Survey Design / Official Statistics) — ISS Cadre", name: "Director (Survey Design / Official Statistics) — ISS Cadre" },
        { id: "desig_ddg", title: "Deputy Director General (DDG - Statistical Cadre)", name: "Deputy Director General (DDG - Statistical Cadre)" },
        { id: "desig_adg", title: "Additional Director General (ADG - Official Statistics)", name: "Additional Director General (ADG - Official Statistics)" },
        { id: "desig_dg", title: "Director General (NSO / Central Statistical System)", name: "Director General (NSO / Central Statistical System)" },
        { id: "desig_dso", title: "District Statistical Officer (DSO) — State DES", name: "District Statistical Officer (DSO) — State DES" },
        { id: "desig_aso", title: "Assistant Statistical Officer (ASO) — State Statistical Cadre", name: "Assistant Statistical Officer (ASO) — State Statistical Cadre" },
        { id: "desig_inv", title: "Statistical Investigator / Survey Field Officer (FOD)", name: "Statistical Investigator / Survey Field Officer (FOD)" }
    ];

    function makeDivisions(prefix, nameList) {
        return nameList.map((item, idx) => ({
            id: `org_${prefix}_${idx + 1}`,
            name: item.name,
            code: item.code || `${prefix.toUpperCase()}-${idx + 1}`,
            designations: OFFICIAL_STATISTICAL_DESIGNATIONS
        }));
    }

    // 3. TOP 10 HIGH-RELEVANCE STATISTICAL MINISTRIES OF INDIA
    const CENTRAL_HIERARCHY = [
        {
            id: "min_mospi",
            name: "Ministry of Statistics & Programme Implementation (MoSPI)",
            code: "MOSPI",
            departments: [
                {
                    id: "dept_mospi_nso",
                    name: "National Statistical Office (NSO)",
                    organisations: makeDivisions("nso", [
                        { name: "Survey Design and Research Division (SDRD), Kolkata", code: "SDRD-KOL" },
                        { name: "Field Operations Division (FOD), New Delhi & Regional Directorates", code: "FOD-HQ" },
                        { name: "Data Processing Division (DPD), Kolkata & Data Centres", code: "DPD-KOL" },
                        { name: "National Accounts Division (NAD) — GDP & Macroeconomic Statistics", code: "NAD-DEL" },
                        { name: "Economic Statistics Division (ESD) — ASI, IIP & Business Register", code: "ESD-DEL" },
                        { name: "Price Statistics Division (PSD) — Consumer Price Index (CPI)", code: "PSD-DEL" },
                        { name: "Social Statistics Division (SSD) — SDG National Indicator Framework", code: "SSD-DEL" }
                    ])
                },
                {
                    id: "dept_mospi_nssta",
                    name: "National Statistical Systems Training Academy (NSSTA)",
                    organisations: makeDivisions("nssta", [
                        { name: "NSSTA Greater Noida (Official Statistics & Capacity Building Campus)", code: "NSSTA-GN" },
                        { name: "NSSTA E-Learning, AI Analytics & iGOT Karmayogi Wing", code: "NSSTA-E" }
                    ])
                },
                {
                    id: "dept_mospi_pi",
                    name: "Programme Implementation Wing (PI Wing)",
                    organisations: makeDivisions("pi", [
                        { name: "Twenty Point Programme (TPP) Monitoring Cell", code: "PI-TPP" },
                        { name: "Infrastructure & Project Monitoring Division (IPMD)", code: "PI-IPMD" }
                    ])
                }
            ]
        },
        {
            id: "min_finance",
            name: "Ministry of Finance",
            code: "FINMIN",
            departments: [
                {
                    id: "dept_fin_dea",
                    name: "Department of Economic Affairs",
                    organisations: makeDivisions("dea", [
                        { name: "Economic Division (Economic Survey, Macro Forecasting & Modeling)", code: "DEA-ECON" },
                        { name: "Budget Division — Fiscal & Revenue Statistics Unit", code: "DEA-BUD" }
                    ])
                },
                {
                    id: "dept_fin_rev",
                    name: "Department of Revenue (CBDT / CBIC)",
                    organisations: makeDivisions("rev", [
                        { name: "Direct Taxes Data Analytics & Tax Statistics Cell (CBDT)", code: "CBDT-STAT" },
                        { name: "GST Analytics, Trade & Indirect Tax Intelligence Wing (CBIC)", code: "CBIC-STAT" }
                    ])
                },
                {
                    id: "dept_fin_dfs",
                    name: "Department of Financial Services",
                    organisations: makeDivisions("dfs", [
                        { name: "Banking, Credit Flow & Financial Inclusion Statistics Cell", code: "DFS-STAT" }
                    ])
                }
            ]
        },
        {
            id: "min_agri",
            name: "Ministry of Agriculture & Farmers Welfare",
            code: "AGRI",
            departments: [
                {
                    id: "dept_agri_des",
                    name: "Directorate of Economics and Statistics (DES - Agriculture)",
                    organisations: makeDivisions("agrides", [
                        { name: "Crop Estimation, Advance Estimates & Agricultural Statistics Wing", code: "AGRI-CROP" },
                        { name: "Agricultural Census & Land Use Input Survey Division", code: "AGRI-CENSUS" },
                        { name: "Integrated Scheme on Agriculture Statistics (ISAS) Directorate", code: "AGRI-ISAS" },
                        { name: "Mahalanobis National Crop Forecast Centre (MNCFC) — GIS & Remote Sensing", code: "MNCFC-GIS" }
                    ])
                }
            ]
        },
        {
            id: "min_health",
            name: "Ministry of Health & Family Welfare",
            code: "MOHFW",
            departments: [
                {
                    id: "dept_health_stat",
                    name: "Statistics & Data Analytics Division",
                    organisations: makeDivisions("hstat", [
                        { name: "National Family Health Survey (NFHS) & Demographic Statistics Cell", code: "NFHS-CELL" },
                        { name: "Central Bureau of Health Intelligence (CBHI) — Vital & Health Records", code: "CBHI-STAT" },
                        { name: "Health Management Information System (HMIS) & Digital Health Analytics", code: "HMIS-STAT" }
                    ])
                }
            ]
        },
        {
            id: "min_commerce",
            name: "Ministry of Commerce & Industry",
            code: "MOCI",
            departments: [
                {
                    id: "dept_comm_dgcis",
                    name: "Directorate General of Commercial Intelligence and Statistics (DGCI&S), Kolkata",
                    organisations: makeDivisions("dgcis", [
                        { name: "Foreign Trade & Export-Import Merchandise Statistics Directorate", code: "DGCIS-FT" },
                        { name: "Inland Trade, Shipping & Commercial Data Processing Division", code: "DGCIS-INL" }
                    ])
                },
                {
                    id: "dept_comm_dpiit",
                    name: "Department for Promotion of Industry and Internal Trade (DPIIT)",
                    organisations: makeDivisions("dpiit", [
                        { name: "Wholesale Price Index (WPI) & Industrial Production Monitoring Cell", code: "DPIIT-WPI" }
                    ])
                }
            ]
        },
        {
            id: "min_labour",
            name: "Ministry of Labour & Employment",
            code: "MOLE",
            departments: [
                {
                    id: "dept_lab_bureau",
                    name: "Labour Bureau (Chandigarh / Shimla)",
                    organisations: makeDivisions("labbur", [
                        { name: "Consumer Price Index for Industrial Workers (CPI-IW) Division", code: "BUR-CPIIW" },
                        { name: "Consumer Price Index for Agricultural & Rural Labourers (CPI-AL/RL)", code: "BUR-CPIAL" },
                        { name: "Annual Employment-Unemployment Survey & Wage Statistics Cell", code: "BUR-WAGE" }
                    ])
                },
                {
                    id: "dept_lab_dge",
                    name: "Directorate General of Employment (DGE)",
                    organisations: makeDivisions("dge", [
                        { name: "National Career Service (NCS) Data & Employment Market Analytics", code: "DGE-NCS" }
                    ])
                }
            ]
        },
        {
            id: "min_consumer",
            name: "Ministry of Consumer Affairs, Food & Public Distribution",
            code: "DOCA",
            departments: [
                {
                    id: "dept_ca_pmc",
                    name: "Department of Consumer Affairs — Price Monitoring Cell (PMC)",
                    organisations: makeDivisions("pmc", [
                        { name: "Essential Commodities Daily Retail & Wholesale Price Tracking Division", code: "PMC-PRICE" },
                        { name: "Market Intelligence & Commodity Buffer Stock Analytics Directorate", code: "PMC-INTEL" }
                    ])
                },
                {
                    id: "dept_ca_dfpd",
                    name: "Department of Food & Public Distribution",
                    organisations: makeDivisions("dfpd", [
                        { name: "National Food Security Act (NFSA) & PDS Data Analytics Unit", code: "DFPD-PDS" }
                    ])
                }
            ]
        },
        {
            id: "min_rural",
            name: "Ministry of Rural Development",
            code: "MORD",
            departments: [
                {
                    id: "dept_rd_stat",
                    name: "Statistics, Monitoring & Evaluation Division",
                    organisations: makeDivisions("rdstat", [
                        { name: "DISHA Monitoring & Socio-Economic Caste Census (SECC) Analytics", code: "RD-DISHA" },
                        { name: "Mahatma Gandhi NREGA Real-time MIS & Performance Analytics Wing", code: "RD-MGNREGA" },
                        { name: "PMGSY Geo-Spatial GIS & Rural Connectivity Analytics Directorate", code: "RD-PMGSY" }
                    ])
                }
            ]
        },
        {
            id: "min_jal",
            name: "Ministry of Jal Shakti",
            code: "MOJS",
            departments: [
                {
                    id: "dept_jal_census",
                    name: "Minor Irrigation Census & Water Bodies Directorate",
                    organisations: makeDivisions("jalcen", [
                        { name: "National Minor Irrigation Census & Groundwater Data Division", code: "JAL-MICEN" },
                        { name: "Census of Water Bodies & Geo-Tagging Survey Unit", code: "JAL-WBCEN" },
                        { name: "Central Water Commission (CWC) — Hydrological & Water Statistics Directorate", code: "CWC-HYDRO" }
                    ])
                }
            ]
        },
        {
            id: "min_edu",
            name: "Ministry of Education",
            code: "MOE",
            departments: [
                {
                    id: "dept_edu_stats",
                    name: "Statistics & Educational Survey Division",
                    organisations: makeDivisions("edustat", [
                        { name: "All India Survey on Higher Education (AISHE) Data Analytics Cell", code: "EDU-AISHE" },
                        { name: "Unified District Information System for Education (UDISE+) Data Directorate", code: "EDU-UDISE" },
                        { name: "Performance Grading Index (PGI) & National Achievement Survey (NAS) Unit", code: "EDU-PGI" }
                    ])
                }
            ]
        }
    ];

    // 4. ALL 36 STATES & UNION TERRITORIES (STATE DES & DISTRICT STATISTICAL OFFICES)
    const STATE_NAMES = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
        "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
        "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
        "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    const UT_NAMES = [
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
        "Delhi (NCT)", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];

    function makeStateDESHierarchy(stateName, isUT = false) {
        const code = stateName.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
        return {
            id: `state_${code.toLowerCase()}`,
            name: stateName + (isUT ? " (UT Administration)" : " Government"),
            code: code,
            isUT: isUT,
            departments: [
                {
                    id: `dept_${code.toLowerCase()}_des`,
                    name: `Directorate of Economics & Statistics (DES), ${stateName}`,
                    organisations: [
                        {
                            id: `org_${code.toLowerCase()}_sdp`,
                            name: `State Domestic Product (GSDP/DDP) & State Accounts Division`,
                            code: `${code}-GSDP`,
                            designations: OFFICIAL_STATISTICAL_DESIGNATIONS
                        },
                        {
                            id: `org_${code.toLowerCase()}_survey`,
                            name: `Socio-Economic Sample Survey & NSS State Sample Division`,
                            code: `${code}-NSS`,
                            designations: OFFICIAL_STATISTICAL_DESIGNATIONS
                        },
                        {
                            id: `org_${code.toLowerCase()}_dso`,
                            name: `District Statistical Offices (DSO Network across all Districts)`,
                            code: `${code}-DSO`,
                            designations: OFFICIAL_STATISTICAL_DESIGNATIONS
                        },
                        {
                            id: `org_${code.toLowerCase()}_sdg`,
                            name: `State SDG Indicator Framework & Evaluation Monitoring Cell`,
                            code: `${code}-SDG`,
                            designations: OFFICIAL_STATISTICAL_DESIGNATIONS
                        }
                    ]
                }
            ]
        };
    }

    const STATE_HIERARCHY = [
        ...STATE_NAMES.map(s => makeStateDESHierarchy(s, false)),
        ...UT_NAMES.map(u => makeStateDESHierarchy(u, true))
    ];

    // 5. PUBLIC MASTER SERVICE API
    const OrgDataService = {
        getMinistries() {
            return CENTRAL_HIERARCHY.map(m => ({ id: m.id, name: m.name, code: m.code }));
        },

        getStatesAndUTs() {
            return STATE_HIERARCHY.map(s => ({ id: s.id, name: s.name, code: s.code, isUT: s.isUT }));
        },

        getDepartments(govType, parentId) {
            if (!parentId) return [];
            const isCentral = (govType === "central" || govType === "Central Government");
            if (isCentral) {
                const ministry = CENTRAL_HIERARCHY.find(m => m.id === parentId || m.name === parentId);
                return ministry ? ministry.departments.map(d => ({ id: d.id, name: d.name })) : [];
            } else {
                const state = STATE_HIERARCHY.find(s => s.id === parentId || s.name === parentId);
                return state ? state.departments.map(d => ({ id: d.id, name: d.name })) : [];
            }
        },

        getOrganisations(govType, parentId, deptId) {
            if (!parentId || !deptId) return [];
            const isCentral = (govType === "central" || govType === "Central Government");
            if (isCentral) {
                const ministry = CENTRAL_HIERARCHY.find(m => m.id === parentId || m.name === parentId);
                if (!ministry) return [];
                const dept = ministry.departments.find(d => d.id === deptId || d.name === deptId);
                return dept ? dept.organisations.map(o => ({ id: o.id, name: o.name, code: o.code })) : [];
            } else {
                const state = STATE_HIERARCHY.find(s => s.id === parentId || s.name === parentId);
                if (!state) return [];
                const dept = state.departments.find(d => d.id === deptId || d.name === deptId);
                return dept ? dept.organisations.map(o => ({ id: o.id, name: o.name, code: o.code })) : [];
            }
        },

        getDesignations(govType, parentId, deptId, orgId) {
            return OFFICIAL_STATISTICAL_DESIGNATIONS.map(des => ({ id: des.id, title: des.title }));
        },

        validateFullHierarchy(payload = {}) {
            const govType = payload.governmentType;
            const parentId = payload.ministry || payload.state;
            const deptId = payload.department;

            if (!govType) return { valid: false, error: "Please select Administration Type (Central or State/UT)." };
            if (!parentId) return { valid: false, error: "Please select a valid Ministry or State/UT." };

            const isCentral = (govType === "central" || govType === "Central Government");
            const parentList = isCentral ? CENTRAL_HIERARCHY : STATE_HIERARCHY;

            const parentObj = parentList.find(p => p.id === parentId || p.name === parentId);
            if (!parentObj) {
                return { valid: false, error: isCentral ? "Selected Ministry is invalid." : "Selected State/UT is invalid." };
            }

            if (deptId) {
                const deptObj = parentObj.departments.find(d => d.id === deptId || d.name === deptId);
                if (!deptObj) {
                    return { valid: false, error: "Please select a valid department belonging to " + parentObj.name + "." };
                }
            }

            return { valid: true };
        },

        isOfficialGovernmentEmail(email) {
            if (!email || typeof email !== "string") return false;
            const trimmed = email.trim().toLowerCase();

            const genericProviders = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com", "icloud.com", "protonmail.com"];
            const domain = trimmed.split('@')[1];
            if (domain && genericProviders.includes(domain)) {
                return false;
            }

            const matchesApproved = APPROVED_GOVERNMENT_DOMAINS.some(d => trimmed.endsWith('@' + d) || trimmed.endsWith('.' + d));
            const matchesGovPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(gov\.in|nic\.in|org\.in|sansad\.in)$/.test(trimmed);

            return matchesApproved || matchesGovPattern;
        }
    };

    window.OrgDataService = OrgDataService;
})(window);
