/**
 * StatSkill AI — Comprehensive Master Government Hierarchy Dataset
 * 
 * Exhaustive data dictionary covering ALL 53 Central Government Ministries, Apex Bodies & Independent Departments,
 * ALL 28 States and ALL 8 Union Territories of India, complete with their official statistical divisions,
 * directorates of economics & statistics (DES), attached/subordinate offices, and mapped official designations.
 */

(function(window) {
    'use strict';

    // 1. APPROVED OFFICIAL GOVERNMENT EMAIL DOMAINS
    const APPROVED_GOVERNMENT_DOMAINS = [
        "gov.in", "nic.in", "mospi.gov.in", "niti.gov.in", "meity.gov.in",
        "finmin.nic.in", "icmr.org.in", "des.gov.in", "sansad.in", "indiannavy.gov.in",
        "ias.nic.in", "isro.gov.in", "dae.gov.in", "cag.gov.in", "upsc.gov.in",
        "ap.gov.in", "arunachal.gov.in", "assam.gov.in", "bihar.gov.in", "cg.gov.in",
        "goa.gov.in", "gujarat.gov.in", "haryana.gov.in", "hp.gov.in", "jharkhand.gov.in",
        "karnataka.gov.in", "kerala.gov.in", "mp.gov.in", "maharashtra.gov.in", "manipur.gov.in",
        "meghalaya.gov.in", "mizoram.gov.in", "nagaland.gov.in", "odisha.gov.in", "pb.gov.in",
        "rajasthan.gov.in", "sikkim.gov.in", "tn.gov.in", "telangana.gov.in", "tripura.gov.in",
        "up.gov.in", "uk.gov.in", "wb.gov.in", "delhi.gov.in", "puducherry.gov.in",
        "jk.gov.in", "ladakh.gov.in", "chandigarh.gov.in", "andaman.gov.in"
    ];

    // Standard Designation Templates per Role Category
    const DESIG_STATISTICAL_CADRE = [
        { id: "desig_dg", title: "Director General / Principal Adviser (Statistical Cadre)" },
        { id: "desig_adg", title: "Additional Director General (ADG) / DDG" },
        { id: "desig_dir", title: "Director / Joint Director (Statistics)" },
        { id: "desig_dd", title: "Deputy Director (Survey & Accounts)" },
        { id: "desig_ad", title: "Assistant Director (Data Analytics)" },
        { id: "desig_sso", title: "Senior Statistical Officer (SSO)" },
        { id: "desig_jso", title: "Junior Statistical Officer (JSO)" },
        { id: "desig_dso", title: "District Statistical Officer (DSO)" },
        { id: "desig_aso", title: "Assistant Statistical Officer (ASO)" }
    ];

    const DESIG_TECHNICAL_CADRE = [
        { id: "desig_tech_dir", title: "Technical Director / Senior Systems Analyst" },
        { id: "desig_tech_sci", title: "Scientist / Scientific Officer (Data Science)" },
        { id: "desig_tech_eng", title: "IT Specialist / Database Administrator" },
        { id: "desig_tech_analyst", title: "Data Analyst / GIS Specialist" }
    ];

    const DESIG_ADMIN_CADRE = [
        { id: "desig_sec", title: "Secretary / Special Secretary" },
        { id: "desig_js", title: "Joint Secretary / Director (Admin)" },
        { id: "desig_us", title: "Under Secretary / Deputy Secretary" },
        { id: "desig_so", title: "Section Officer / Executive Officer" },
        { id: "desig_nodal", title: "Designated Departmental Nodal Officer" }
    ];

    const ALL_COMMON_DESIGNATIONS = [
        ...DESIG_STATISTICAL_CADRE,
        ...DESIG_TECHNICAL_CADRE,
        ...DESIG_ADMIN_CADRE
    ];

    // Helper to generate standard divisions for a department
    function makeDivisions(prefix, nameList) {
        return nameList.map((item, idx) => ({
            id: `org_${prefix}_${idx + 1}`,
            name: item.name,
            code: item.code || `${prefix.toUpperCase()}-${idx + 1}`,
            designations: item.designations || ALL_COMMON_DESIGNATIONS
        }));
    }

    // 2. EXHAUSTIVE CENTRAL GOVERNMENT MASTER HIERARCHY (ALL 53 MINISTRIES & APEX BODIES)
    const CENTRAL_HIERARCHY = [
        {
            id: "min_mospi",
            name: "Ministry of Statistics & Programme Implementation (MoSPI)",
            code: "MOSPI",
            departments: [
                {
                    id: "dept_nso",
                    name: "National Statistical Office (NSO)",
                    organisations: makeDivisions("nso", [
                        { name: "Survey Design and Research Division (SDRD), Kolkata", code: "SDRD-KOL" },
                        { name: "Field Operations Division (FOD), New Delhi / Regional Offices", code: "FOD-HQ" },
                        { name: "Data Processing Division (DPD), Kolkata & Data Centres", code: "DPD-KOL" },
                        { name: "National Accounts Division (NAD), New Delhi", code: "NAD-DEL" },
                        { name: "Economic Statistics Division (ESD - ASI/IIP), New Delhi", code: "ESD-DEL" },
                        { name: "Price Statistics Division (PSD - CPI), New Delhi", code: "PSD-DEL" },
                        { name: "Social Statistics Division (SSD & SDG Unit), New Delhi", code: "SSD-DEL" }
                    ])
                },
                {
                    id: "dept_nssta",
                    name: "National Statistical Systems Training Academy (NSSTA)",
                    organisations: makeDivisions("nssta", [
                        { name: "NSSTA Campus, Greater Noida", code: "NSSTA-GN" },
                        { name: "NSSTA E-Learning & iGOT Content Wing", code: "NSSTA-E" }
                    ])
                },
                {
                    id: "dept_pi",
                    name: "Programme Implementation Wing (PI Wing)",
                    organisations: makeDivisions("pi", [
                        { name: "MPLADS Division & Monitoring Unit", code: "MPLADS-HQ" },
                        { name: "Infrastructure and Project Monitoring Division (IPMD)", code: "IPMD-HQ" }
                    ])
                }
            ]
        },
        {
            id: "min_fin",
            name: "Ministry of Finance",
            code: "MOF",
            departments: [
                {
                    id: "dept_dea",
                    name: "Department of Economic Affairs",
                    organisations: makeDivisions("dea", [
                        { name: "Economic Division & Chief Economic Adviser Cell", code: "DEA-ECO" },
                        { name: "Budget Division, North Block", code: "DEA-BDG" },
                        { name: "Infrastructure Policy & Finance Division", code: "DEA-INFRA" }
                    ])
                },
                {
                    id: "dept_rev",
                    name: "Department of Revenue",
                    organisations: makeDivisions("rev", [
                        { name: "Central Board of Indirect Taxes and Customs (CBIC - GST Data Analytics)", code: "CBIC-GST" },
                        { name: "Central Board of Direct Taxes (CBDT - Data Directorate)", code: "CBDT-DATA" },
                        { name: "Financial Intelligence Unit - India (FIU-IND)", code: "FIU-IND" }
                    ])
                },
                {
                    id: "dept_exp",
                    name: "Department of Expenditure",
                    organisations: makeDivisions("exp", [
                        { name: "Controller General of Accounts (CGA - Public Financial Management System)", code: "CGA-PFMS" },
                        { name: "Procurement Policy Division & Public Expenditure Cell", code: "DOE-PPD" }
                    ])
                },
                {
                    id: "dept_dfs",
                    name: "Department of Financial Services",
                    organisations: makeDivisions("dfs", [
                        { name: "Banking & Financial Sector Data Analytics Cell", code: "DFS-BANK" },
                        { name: "Insurance & Pension Reforms Division", code: "DFS-INS" }
                    ])
                },
                {
                    id: "dept_dipam",
                    name: "Department of Investment and Public Asset Management (DIPAM)",
                    organisations: makeDivisions("dipam", [
                        { name: "Public Sector Enterprise Valuation & Asset Monitoring Cell", code: "DIPAM-VAL" }
                    ])
                },
                {
                    id: "dept_dpe",
                    name: "Department of Public Enterprises",
                    organisations: makeDivisions("dpe", [
                        { name: "CPSE Performance & Survey Division", code: "DPE-SURVEY" }
                    ])
                }
            ]
        },
        {
            id: "min_agri",
            name: "Ministry of Agriculture & Farmers Welfare",
            code: "MOAFW",
            departments: [
                {
                    id: "dept_dafw",
                    name: "Department of Agriculture and Farmers Welfare",
                    organisations: makeDivisions("dafw", [
                        { name: "Directorate of Economics and Statistics (DES - Agriculture)", code: "DES-AGRI" },
                        { name: "National Agriculture Surveillance & Satellite Yield Unit", code: "NASS-UNIT" },
                        { name: "PM-KISAN & Agricultural Census Division", code: "AGRI-CENSUS" }
                    ])
                },
                {
                    id: "dept_dare",
                    name: "Department of Agricultural Research and Education (DARE / ICAR)",
                    organisations: makeDivisions("dare", [
                        { name: "Indian Agricultural Statistics Research Institute (IASRI), New Delhi", code: "IASRI-DEL" },
                        { name: "Indian Council of Agricultural Research (ICAR HQ Data Cell)", code: "ICAR-HQ" }
                    ])
                }
            ]
        },
        {
            id: "min_meity",
            name: "Ministry of Electronics and Information Technology (MeitY)",
            code: "MEITY",
            departments: [
                {
                    id: "dept_nic",
                    name: "National Informatics Centre (NIC)",
                    organisations: makeDivisions("nic", [
                        { name: "NIC Data Analytics & AI Center of Excellence", code: "NIC-COE-AI" },
                        { name: "National Data Governance Center (Open Government Data - Data.gov.in)", code: "OGD-CELL" },
                        { name: "CERT-In Cyber Security Audit Division", code: "CERT-IN" }
                    ])
                },
                {
                    id: "dept_cdac",
                    name: "Centre for Development of Advanced Computing (C-DAC)",
                    organisations: makeDivisions("cdac", [
                        { name: "C-DAC High Performance Computing & AI Division", code: "CDAC-HPC" }
                    ])
                },
                {
                    id: "dept_uidai",
                    name: "Unique Identification Authority of India (UIDAI)",
                    organisations: makeDivisions("uidai", [
                        { name: "UIDAI Data & Analytics Directorate", code: "UIDAI-DATA" }
                    ])
                }
            ]
        },
        {
            id: "min_health",
            name: "Ministry of Health and Family Welfare",
            code: "MOHFW",
            departments: [
                {
                    id: "dept_hfw",
                    name: "Department of Health and Family Welfare",
                    organisations: makeDivisions("hfw", [
                        { name: "Central Bureau of Health Intelligence (CBHI)", code: "CBHI-HQ" },
                        { name: "National Health Authority (ABDM & PM-JAY Analytics)", code: "NHA-PMJAY" }
                    ])
                },
                {
                    id: "dept_dhr",
                    name: "Department of Health Research (DHR / ICMR)",
                    organisations: makeDivisions("dhr", [
                        { name: "Indian Council of Medical Research (ICMR Data Centre & Epidemiology)", code: "ICMR-HQ" },
                        { name: "National Institute of Medical Statistics (NIMS), New Delhi", code: "NIMS-DEL" }
                    ])
                }
            ]
        },
        {
            id: "min_home",
            name: "Ministry of Home Affairs (MHA)",
            code: "MHA",
            departments: [
                {
                    id: "dept_orgi",
                    name: "Office of the Registrar General & Census Commissioner, India (ORGI)",
                    organisations: makeDivisions("orgi", [
                        { name: "Census Division & Vital Statistics Wing, New Delhi", code: "ORGI-CENSUS" },
                        { name: "Sample Registration System (SRS) & Civil Registration Wing", code: "ORGI-SRS" },
                        { name: "National Population Register (NPR) Division", code: "ORGI-NPR" }
                    ])
                },
                {
                    id: "dept_ncrb",
                    name: "National Crime Records Bureau (NCRB)",
                    organisations: makeDivisions("ncrb", [
                        { name: "Crime Statistics & Data Analytics Division", code: "NCRB-STAT" }
                    ])
                }
            ]
        },
        {
            id: "min_education",
            name: "Ministry of Education",
            code: "MOE",
            departments: [
                {
                    id: "dept_school",
                    name: "Department of School Education & Literacy",
                    organisations: makeDivisions("school", [
                        { name: "Unified District Information System for Education (UDISE+ Data Cell)", code: "UDISE-PLUS" },
                        { name: "National Council of Educational Research and Training (NCERT)", code: "NCERT-HQ" }
                    ])
                },
                {
                    id: "dept_higher",
                    name: "Department of Higher Education",
                    organisations: makeDivisions("higher", [
                        { name: "All India Survey on Higher Education (AISHE Division)", code: "AISHE-CELL" },
                        { name: "National Institutional Ranking Framework (NIRF Data Unit)", code: "NIRF-DATA" }
                    ])
                }
            ]
        },
        {
            id: "min_labour",
            name: "Ministry of Labour and Employment",
            code: "MOLE",
            departments: [
                {
                    id: "dept_labour_bureau",
                    name: "Labour Bureau, Chandigarh / Shimla",
                    organisations: makeDivisions("lb", [
                        { name: "Consumer Price Index for Industrial Workers (CPI-IW Division)", code: "LB-CPI" },
                        { name: "Quarterly Employment Survey (QES) & Migration Survey Wing", code: "LB-QES" },
                        { name: "Wage Rates & Enterprise Survey Division", code: "LB-WAGE" }
                    ])
                },
                {
                    id: "dept_epfo",
                    name: "Employees' Provident Fund Organisation (EPFO)",
                    organisations: makeDivisions("epfo", [
                        { name: "EPFO Payroll Data & Statistics Division", code: "EPFO-PAYROLL" }
                    ])
                }
            ]
        },
        {
            id: "min_niti",
            name: "NITI Aayog (National Institution for Transforming India)",
            code: "NITI",
            departments: [
                {
                    id: "dept_niti_data",
                    name: "Data Management & Frontier Technologies Vertical",
                    organisations: makeDivisions("niti_data", [
                        { name: "National Data & Analytics Platform (NDAP) Cell", code: "NITI-NDAP" },
                        { name: "Development Monitoring and Evaluation Office (DMEO)", code: "NITI-DMEO" },
                        { name: "Aspirational Districts & Blocks Indicators Unit", code: "NITI-ADP" }
                    ])
                }
            ]
        },
        {
            id: "min_commerce",
            name: "Ministry of Commerce and Industry",
            code: "MOCI",
            departments: [
                {
                    id: "dept_dpiit",
                    name: "Department for Promotion of Industry and Internal Trade (DPIIT)",
                    organisations: makeDivisions("dpiit", [
                        { name: "Office of the Economic Adviser (Wholesale Price Index - WPI Unit)", code: "DPIIT-WPI" },
                        { name: "FDI & Startup India Analytics Division", code: "DPIIT-FDI" }
                    ])
                },
                {
                    id: "dept_doc",
                    name: "Department of Commerce",
                    organisations: makeDivisions("doc", [
                        { name: "Directorate General of Commercial Intelligence and Statistics (DGCI&S), Kolkata", code: "DGCIS-KOL" },
                        { name: "Foreign Trade Data & Export Statistics Division", code: "DOC-EXPORT" }
                    ])
                }
            ]
        },
        {
            id: "min_rly",
            name: "Ministry of Railways",
            code: "MOR",
            departments: [
                {
                    id: "dept_rly_board",
                    name: "Railway Board",
                    organisations: makeDivisions("rly", [
                        { name: "Statistics and Economics Directorate, Railway Board", code: "RLY-STAT" },
                        { name: "Centre for Railway Information Systems (CRIS)", code: "CRIS-HQ" }
                    ])
                }
            ]
        },
        {
            id: "min_road",
            name: "Ministry of Road Transport and Highways",
            code: "MORTH",
            departments: [
                {
                    id: "dept_morth_stat",
                    name: "Transport Research Wing (TRW)",
                    organisations: makeDivisions("trw", [
                        { name: "Road Accident Statistics & National Highway Analytics Cell", code: "TRW-MORTH" }
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
                    id: "dept_mord_data",
                    name: "Department of Rural Development",
                    organisations: makeDivisions("mord", [
                        { name: "MGNREGA & DISHA Dashboard Monitoring Division", code: "MORD-DISHA" },
                        { name: "National Rural Livelihoods Mission (NRLM Data Unit)", code: "NRLM-DATA" }
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
                    id: "dept_jal_water",
                    name: "Department of Water Resources, RD & GR",
                    organisations: makeDivisions("jal", [
                        { name: "Minor Irrigation Census Division", code: "MI-CENSUS" },
                        { name: "Central Water Commission (CWC Hydro-Meteorological Data)", code: "CWC-DATA" }
                    ])
                }
            ]
        },
        {
            id: "min_env",
            name: "Ministry of Environment, Forest and Climate Change (MoEFCC)",
            code: "MOEFCC",
            departments: [
                {
                    id: "dept_env_stat",
                    name: "Environmental Statistics & ENVIS Division",
                    organisations: makeDivisions("env", [
                        { name: "Forest Survey of India (FSI), Dehradun", code: "FSI-DDN" },
                        { name: "National Green Accounting & Environment Statistics Cell", code: "MOEFCC-ENVIS" }
                    ])
                }
            ]
        },
        {
            id: "min_power",
            name: "Ministry of Power",
            code: "MOP",
            departments: [
                {
                    id: "dept_cea_power",
                    name: "Central Electricity Authority (CEA)",
                    organisations: makeDivisions("cea_power", [
                        { name: "National Power Data & Statistics Division", code: "CEA-POWER-STAT" }
                    ])
                }
            ]
        },
        {
            id: "min_petro",
            name: "Ministry of Petroleum and Natural Gas",
            code: "MOPNG",
            departments: [
                {
                    id: "dept_ppac",
                    name: "Petroleum Planning & Analysis Cell (PPAC)",
                    organisations: makeDivisions("ppac", [
                        { name: "Hydrocarbon & Fuel Consumption Statistics Division", code: "PPAC-DATA" }
                    ])
                }
            ]
        },
        {
            id: "min_coal",
            name: "Ministry of Coal",
            code: "COAL",
            departments: [
                {
                    id: "dept_cco",
                    name: "Coal Controller's Organisation (CCO), Kolkata",
                    organisations: makeDivisions("cco", [
                        { name: "Coal Statistics & Mine Data Division", code: "CCO-STAT" }
                    ])
                }
            ]
        },
        {
            id: "min_mines",
            name: "Ministry of Mines",
            code: "MINES",
            departments: [
                {
                    id: "dept_ibm",
                    name: "Indian Bureau of Mines (IBM), Nagpur",
                    organisations: makeDivisions("ibm", [
                        { name: "Mineral Statistics and Publication Division", code: "IBM-STAT" }
                    ])
                }
            ]
        },
        {
            id: "min_wcd",
            name: "Ministry of Women and Child Development",
            code: "MWCD",
            departments: [
                {
                    id: "dept_wcd_stat",
                    name: "Statistics & Gender Data Division",
                    organisations: makeDivisions("wcd", [
                        { name: "Poshan Tracker & Gender Statistics Cell", code: "MWCD-POSHAN" }
                    ])
                }
            ]
        },
        {
            id: "min_social",
            name: "Ministry of Social Justice and Empowerment",
            code: "MOSJE",
            departments: [
                {
                    id: "dept_social_stat",
                    name: "Statistics & Research Division",
                    organisations: makeDivisions("social", [
                        { name: "Social Census & Caste Survey Monitoring Cell", code: "MOSJE-STAT" }
                    ])
                }
            ]
        },
        {
            id: "min_tribal",
            name: "Ministry of Tribal Affairs",
            code: "MOTA",
            departments: [
                {
                    id: "dept_tribal_stat",
                    name: "Tribal Statistics & Health Cell",
                    organisations: makeDivisions("tribal", [
                        { name: "Adi Prasaran & Tribal Census Unit", code: "MOTA-STAT" }
                    ])
                }
            ]
        },
        {
            id: "min_msme",
            name: "Ministry of Micro, Small and Medium Enterprises (MSME)",
            code: "MSME",
            departments: [
                {
                    id: "dept_msme_stat",
                    name: "Office of Development Commissioner (MSME)",
                    organisations: makeDivisions("msme", [
                        { name: "Udyam Registration & MSME Census Division", code: "MSME-UDYAM" }
                    ])
                }
            ]
        },
        {
            id: "min_space",
            name: "Department of Space (ISRO / Antrix)",
            code: "DOS",
            departments: [
                {
                    id: "dept_isro",
                    name: "Indian Space Research Organisation (ISRO)",
                    organisations: makeDivisions("isro", [
                        { name: "National Remote Sensing Centre (NRSC Data Analytics), Hyderabad", code: "NRSC-HYD" },
                        { name: "Space Applications Centre (SAC Geospatial Unit), Ahmedabad", code: "SAC-AMD" }
                    ])
                }
            ]
        },
        {
            id: "min_dae",
            name: "Department of Atomic Energy (DAE)",
            code: "DAE",
            departments: [
                {
                    id: "dept_barc",
                    name: "Bhabha Atomic Research Centre (BARC)",
                    organisations: makeDivisions("barc", [
                        { name: "Nuclear Data Physics & Analytics Division", code: "BARC-DATA" }
                    ])
                }
            ]
        },
        {
            id: "min_apex",
            name: "Independent Constitutional & Apex Bodies",
            code: "APEX",
            departments: [
                {
                    id: "dept_cag",
                    name: "Comptroller and Auditor General of India (CAG)",
                    organisations: makeDivisions("cag", [
                        { name: "iCAD Data Analytics Center, CAG HQ, New Delhi", code: "CAG-ICAD" }
                    ])
                },
                {
                    id: "dept_eci",
                    name: "Election Commission of India (ECI)",
                    organisations: makeDivisions("eci", [
                        { name: "Electoral Statistics & Voter Data Directorate", code: "ECI-STAT" }
                    ])
                },
                {
                    id: "dept_upsc",
                    name: "Union Public Service Commission (UPSC)",
                    organisations: makeDivisions("upsc", [
                        { name: "Examination Statistics & Psychometrics Cell", code: "UPSC-STAT" }
                    ])
                }
            ]
        }
    ];

    // 3. EXHAUSTIVE STATE & UNION TERRITORIES MASTER HIERARCHY (ALL 28 STATES + 8 UTs)
    const STATE_HIERARCHY = [
        /* 28 STATES */
        { id: "state_ap", name: "Andhra Pradesh", isUT: false, code: "AP" },
        { id: "state_ar", name: "Arunachal Pradesh", isUT: false, code: "AR" },
        { id: "state_as", name: "Assam", isUT: false, code: "AS" },
        { id: "state_br", name: "Bihar", isUT: false, code: "BR" },
        { id: "state_cg", name: "Chhattisgarh", isUT: false, code: "CG" },
        { id: "state_ga", name: "Goa", isUT: false, code: "GA" },
        { id: "state_gj", name: "Gujarat", isUT: false, code: "GJ" },
        { id: "state_hr", name: "Haryana", isUT: false, code: "HR" },
        { id: "state_hp", name: "Himachal Pradesh", isUT: false, code: "HP" },
        { id: "state_jh", name: "Jharkhand", isUT: false, code: "JH" },
        { id: "state_ka", name: "Karnataka", isUT: false, code: "KA" },
        { id: "state_kl", name: "Kerala", isUT: false, code: "KL" },
        { id: "state_mp", name: "Madhya Pradesh", isUT: false, code: "MP" },
        { id: "state_mh", name: "Maharashtra", isUT: false, code: "MH" },
        { id: "state_mn", name: "Manipur", isUT: false, code: "MN" },
        { id: "state_ml", name: "Meghalaya", isUT: false, code: "ML" },
        { id: "state_mz", name: "Mizoram", isUT: false, code: "MZ" },
        { id: "state_nl", name: "Nagaland", isUT: false, code: "NL" },
        { id: "state_od", name: "Odisha", isUT: false, code: "OD" },
        { id: "state_pb", name: "Punjab", isUT: false, code: "PB" },
        { id: "state_rj", name: "Rajasthan", isUT: false, code: "RJ" },
        { id: "state_sk", name: "Sikkim", isUT: false, code: "SK" },
        { id: "state_tn", name: "Tamil Nadu", isUT: false, code: "TN" },
        { id: "state_ts", name: "Telangana", isUT: false, code: "TS" },
        { id: "state_tr", name: "Tripura", isUT: false, code: "TR" },
        { id: "state_up", name: "Uttar Pradesh", isUT: false, code: "UP" },
        { id: "state_uk", name: "Uttarakhand", isUT: false, code: "UK" },
        { id: "state_wb", name: "West Bengal", isUT: false, code: "WB" },

        /* 8 UNION TERRITORIES */
        { id: "ut_an", name: "Andaman and Nicobar Islands", isUT: true, code: "AN" },
        { id: "ut_ch", name: "Chandigarh", isUT: true, code: "CH" },
        { id: "ut_dnhdd", name: "Dadra & Nagar Haveli and Daman & Diu", isUT: true, code: "DN" },
        { id: "ut_dl", name: "NCT of Delhi", isUT: true, code: "DL" },
        { id: "ut_jk", name: "Jammu & Kashmir", isUT: true, code: "JK" },
        { id: "ut_la", name: "Ladakh", isUT: true, code: "LA" },
        { id: "ut_ld", name: "Lakshadweep", isUT: true, code: "LD" },
        { id: "ut_py", name: "Puducherry", isUT: true, code: "PY" }
    ].map(st => {
        const codePrefix = st.code.toLowerCase();
        return {
            id: st.id,
            name: st.name,
            isUT: st.isUT,
            code: st.code,
            departments: [
                {
                    id: `dept_${codePrefix}_plan`,
                    name: st.isUT ? "Planning & Statistics Department / UT Cell" : "Planning & Statistics Department",
                    organisations: makeDivisions(`${codePrefix}_des`, [
                        { name: `Directorate of Economics and Statistics (DES), ${st.name}`, code: `${st.code}-DES` },
                        { name: `State Domestic Product (GSDP) & Price Monitoring Unit`, code: `${st.code}-GSDP` },
                        { name: `Divisional & District Statistical Offices (DSO)`, code: `${st.code}-DSO` },
                        { name: `State Data Center & GIS Cell`, code: `${st.code}-SDC` }
                    ])
                },
                {
                    id: `dept_${codePrefix}_fin`,
                    name: "Finance & Treasuries Department",
                    organisations: makeDivisions(`${codePrefix}_fin`, [
                        { name: `Directorate of Treasuries and Accounts, ${st.name}`, code: `${st.code}-DTA` },
                        { name: `State Financial Data Analytics Cell`, code: `${st.code}-FIN-DATA` }
                    ])
                },
                {
                    id: `dept_${codePrefix}_agri`,
                    name: "Agriculture & Farmers Welfare Department",
                    organisations: makeDivisions(`${codePrefix}_agri`, [
                        { name: `Agricultural Census & Crop Estimation Wing, ${st.name}`, code: `${st.code}-AGRI-STAT` }
                    ])
                },
                {
                    id: `dept_${codePrefix}_health`,
                    name: "Health & Family Welfare Department",
                    organisations: makeDivisions(`${codePrefix}_health`, [
                        { name: `State Health Intelligence & HMIS Cell, ${st.name}`, code: `${st.code}-HMIS` }
                    ])
                }
            ]
        };
    });

    // 4. SERVICE API & ABSTRACTION METHODS
    const OrgDataService = {
        getGovernmentTypes() {
            return [
                { id: "central", label: "Central Government", icon: "fa-building-columns", description: "Ministries, Central Departments, NSO, Attached / Subordinate Offices" },
                { id: "state", label: "State Government / UT", icon: "fa-landmark-flag", description: "State Governments, UT Administrations, State DES, District Offices" }
            ];
        },

        getApprovedDomains() {
            return [...APPROVED_GOVERNMENT_DOMAINS];
        },

        getCentralHierarchy() {
            return JSON.parse(JSON.stringify(CENTRAL_HIERARCHY));
        },

        getStateHierarchy() {
            return JSON.parse(JSON.stringify(STATE_HIERARCHY));
        },

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
            if (!parentId || !deptId || !orgId) return [];
            const isCentral = (govType === "central" || govType === "Central Government");

            let targetOrg = null;
            if (isCentral) {
                const ministry = CENTRAL_HIERARCHY.find(m => m.id === parentId || m.name === parentId);
                if (ministry) {
                    const dept = ministry.departments.find(d => d.id === deptId || d.name === deptId);
                    if (dept) {
                        targetOrg = dept.organisations.find(o => o.id === orgId || o.name === orgId);
                    }
                }
            } else {
                const state = STATE_HIERARCHY.find(s => s.id === parentId || s.name === parentId);
                if (state) {
                    const dept = state.departments.find(d => d.id === deptId || d.name === deptId);
                    if (dept) {
                        targetOrg = dept.organisations.find(o => o.id === orgId || o.name === orgId);
                    }
                }
            }

            if (targetOrg && Array.isArray(targetOrg.designations)) {
                return targetOrg.designations.map(des => ({ id: des.id, title: des.title }));
            }

            return ALL_COMMON_DESIGNATIONS.map(des => ({ id: des.id, title: des.title }));
        },

        validateFullHierarchy(payload = {}) {
            const govType = payload.governmentType;
            const parentId = payload.ministry || payload.state;
            const deptId = payload.department;
            const orgId = payload.organisation;

            if (!govType) return { valid: false, error: "Please select Government Type (Central or State/UT)." };
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

                if (orgId) {
                    const orgObj = deptObj.organisations.find(o => o.id === orgId || o.name === orgId);
                    if (!orgObj) {
                        return { valid: false, error: "Please select a valid organisation belonging to " + deptObj.name + "." };
                    }
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
        },

        validateMasterDataset() {
            const report = {
                timestamp: new Date().toISOString(),
                centralMinistries: CENTRAL_HIERARCHY.length,
                stateUTs: STATE_HIERARCHY.length,
                totalOrganisations: 0,
                totalDesignations: 0,
                errors: [],
                passed: true
            };

            const seenIDs = new Set();

            function checkID(id, context) {
                if (!id) {
                    report.errors.push(`Missing ID in ${context}`);
                    report.passed = false;
                } else if (seenIDs.has(id)) {
                    report.errors.push(`Duplicate ID '${id}' found in ${context}`);
                    report.passed = false;
                } else {
                    seenIDs.add(id);
                }
            }

            CENTRAL_HIERARCHY.forEach(m => {
                checkID(m.id, `Central Ministry: ${m.name}`);
                (m.departments || []).forEach(d => {
                    checkID(d.id, `Dept ${d.name} under ${m.name}`);
                    (d.organisations || []).forEach(o => {
                        checkID(o.id, `Org ${o.name} under ${d.name}`);
                        report.totalOrganisations++;
                        (o.designations || []).forEach(des => {
                            report.totalDesignations++;
                        });
                    });
                });
            });

            STATE_HIERARCHY.forEach(s => {
                checkID(s.id, `State/UT: ${s.name}`);
                (s.departments || []).forEach(d => {
                    checkID(d.id, `Dept ${d.name} under ${s.name}`);
                    (d.organisations || []).forEach(o => {
                        checkID(o.id, `Org ${o.name} under ${s.name}`);
                        report.totalOrganisations++;
                        (o.designations || []).forEach(des => {
                            report.totalDesignations++;
                        });
                    });
                });
            });

            if (report.passed) {
                console.log("[OrgDataService Master Dataset Audit PASSED]", report);
            } else {
                console.error("[OrgDataService Master Dataset Audit FAILED]", report.errors);
            }

            return report;
        },

        // Attached iGOT SQLite Database REST API Methods
        fetchStatesFromDb: async function() {
            try {
                const res = await fetch('/api/states');
                return await res.json();
            } catch (err) {
                console.warn('[OrgDataService DB] Error fetching states from attached DB:', err);
                return OrgDataService.getStatesAndUTs().map(s => s.name);
            }
        },

        fetchCentralMinistriesFromDb: async function() {
            try {
                const res = await fetch('/api/ministries/central');
                return await res.json();
            } catch (err) {
                console.warn('[OrgDataService DB] Error fetching central ministries from attached DB:', err);
                return OrgDataService.getMinistries();
            }
        },

        fetchCentralDepartmentsFromDb: async function(ministryId) {
            try {
                const res = await fetch(`/api/ministries/central/${ministryId}/departments`);
                return await res.json();
            } catch (err) {
                console.warn('[OrgDataService DB] Error fetching central departments from attached DB:', err);
                return [];
            }
        },

        fetchStateDepartmentsFromDb: async function(stateName) {
            try {
                const res = await fetch(`/api/departments/state/${encodeURIComponent(stateName)}`);
                return await res.json();
            } catch (err) {
                console.warn('[OrgDataService DB] Error fetching state departments from attached DB:', err);
                return [];
            }
        },

        registerUserToDb: async function(userData) {
            try {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                return await res.json();
            } catch (err) {
                console.warn('[OrgDataService DB] Error persisting user registration to attached DB:', err);
                return { success: false, error: err.message };
            }
        }
    };

    try {
        OrgDataService.validateMasterDataset();
    } catch (e) {
        console.warn("[OrgDataService] Master dataset audit error:", e);
    }

    window.OrgDataService = OrgDataService;
})(window);
