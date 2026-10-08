/**
 * Government Policies Repository – Demo Data
 *
 * ALL records are clearly labelled isDemoData: true and verificationStatus: 'Demo / Not Verified'.
 * They are prototype examples for UI demonstration ONLY.
 * They must NOT be interpreted as official government policy records.
 * Replace with verified official data when authorised sources are connected.
 *
 * Note on real policies referenced:
 * Some records reference real policy names (e.g. DILRMP, FRA 2006) to make the
 * interface realistic. However ALL metadata, provisions, dates, and descriptions
 * in this file are DEMO content and must be verified against official sources
 * before being treated as accurate information.
 */

// ─── Filter / taxonomy lists ──────────────────────────────────────────────────
export const POLICY_CATEGORY_LIST = [
  'Agriculture Land',
  'Land Records',
  'Land Acquisition',
  'Land Use',
  'Forest and Conservation',
  'Urban Development',
  'Rural Development',
  'Land Dispute Resolution',
];

export const POLICY_TYPE_LIST = [
  'Policy', 'Act', 'Rule', 'Scheme', 'Programme',
  'Guideline', 'Regulation', 'Initiative',
];

export const POLICY_STATUS_LIST = ['Active', 'Amended', 'Replaced', 'Archived', 'Verification Required'];

export const GOVT_LEVEL_LIST = ['Central Government', 'State Government'];

export const POLICY_SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First'        },
  { value: 'oldest',   label: 'Oldest First'         },
  { value: 'name_asc', label: 'Policy Name A–Z'      },
  { value: 'name_desc',label: 'Policy Name Z–A'      },
  { value: 'category', label: 'By Category'          },
  { value: 'level',    label: 'By Government Level'  },
];

// ─── Analytics data (derived from policies below) ────────────────────────────
export const POL_BY_CATEGORY = [
  { category: 'Land Records',           count: 2 },
  { category: 'Agriculture Land',       count: 2 },
  { category: 'Forest & Conservation',  count: 1 },
  { category: 'Urban Development',      count: 1 },
  { category: 'Rural Development',      count: 1 },
  { category: 'Land Acquisition',       count: 1 },
  { category: 'Land Use',               count: 1 },
  { category: 'Land Dispute Resolution',count: 1 },
];

export const POL_BY_LEVEL = [
  { label: 'Central Government', value: 7, color: '#1d4ed8' },
  { label: 'State Government',   value: 3, color: '#10b981' },
];

export const POL_BY_YEAR = [
  { year: '2006', count: 1 },
  { year: '2013', count: 1 },
  { year: '2015', count: 1 },
  { year: '2016', count: 1 },
  { year: '2018', count: 1 },
  { year: '2021', count: 2 },
  { year: '2022', count: 1 },
  { year: '2023', count: 2 },
];

export const POL_BY_TYPE = [
  { label: 'Programme', value: 3, color: '#1d4ed8' },
  { label: 'Act',       value: 2, color: '#10b981' },
  { label: 'Scheme',    value: 2, color: '#f97316' },
  { label: 'Policy',    value: 1, color: '#8b5cf6' },
  { label: 'Rule',      value: 1, color: '#0ea5e9' },
  { label: 'Initiative',value: 1, color: '#f59e0b' },
];

export const POL_BY_STATE = [
  { state: 'Karnataka',   count: 1 },
  { state: 'Telangana',   count: 1 },
  { state: 'Maharashtra', count: 1 },
];

// ─── POLICY RECORDS ───────────────────────────────────────────────────────────
export const POLICIES = [

  // ── POL-001 ─────────────────────────────────────────────────────────────────
  {
    id: 'POL-001',
    name: 'Digital India Land Records Modernisation Programme (DILRMP)',
    governmentLevel: 'Central Government',
    state: null,
    ministry: 'Ministry of Rural Development',
    department: 'Department of Land Resources',
    issuingAuthority: 'Department of Land Resources, GoI',
    year: 2016,
    effectiveDate: 'Demo – Year 2016 (verify official date)',
    amendmentYear: null,
    policyType: 'Programme',
    category: 'Land Records',
    status: 'Active',
    applicableArea: 'All States and UTs of India',
    relatedLandSector: ['Land Records', 'Digitization', 'Survey & Mapping'],
    isDemoData: true,
    verificationStatus: 'Demo / Not Verified',

    shortDescription:
      'A centrally-sponsored programme to modernise land records by digitising Record of Rights, cadastral maps, and linking registration and mutation processes.',

    objective:
      'To develop a modern, comprehensive, and transparent land records management system in India — eliminating scope for disputes and fraudulent practices through digital land records, updated survey, and real-time integration of mutation and registration.',

    description:
      'DILRMP (Demo Reference) consolidates earlier land records programmes under a single framework. It aims to move from presumptive to conclusive land titling through digitisation of Record of Rights (RoR), updated cadastral surveys, integration of registration and mutation, and modernisation of revenue courts. The programme supports states to establish integrated land information management systems. Note: All details are demo references — verify against official Department of Land Resources publications.',

    keyProvisions: [
      { title: 'Digitisation of Record of Rights (RoR)', description: 'All RoR records to be digitised and made accessible online through state portals.' },
      { title: 'Cadastral Map Digitisation', description: 'Survey maps to be scanned, geo-referenced, and linked with ownership databases.' },
      { title: 'Integration of Registration & Mutation', description: 'Real-time linkage of property registration with land mutation to eliminate delays.' },
      { title: 'Modernisation of Revenue Courts', description: 'Computerisation and workflow management of revenue court processes.' },
      { title: 'Unique Land Parcel Identification Number (ULPIN)', description: 'Assignment of a unique 14-digit alphanumeric ID to every land parcel in India.' },
      { title: 'Space Technology', description: 'Use of remote sensing and GIS technology for cadastral survey and boundary demarcation.' },
    ],

    timeline: [
      { year: '2008', event: 'Earlier Programme', description: 'National Land Records Modernisation Programme (NLRMP) launched as predecessor.' },
      { year: '2016', event: 'DILRMP Launched', description: 'Restructured as Digital India Land Records Modernisation Programme under Digital India.' },
      { year: '2021', event: 'ULPIN Rollout', description: 'Unique Land Parcel Identification Number initiative scaled up across states.' },
      { year: '2023', event: 'Ongoing', description: 'Programme continues with focus on conclusive titling and state integration.' },
    ],

    source: {
      title: 'DILRMP – Department of Land Resources (Demo Reference)',
      organization: 'Department of Land Resources, Ministry of Rural Development, GoI',
      url: 'https://dolr.gov.in',
      documentType: 'Government Programme Page',
      isDemo: true,
    },

    relatedPolicies: ['POL-002', 'POL-007'],
    relatedDatasets: ['land-records', 'state-wise'],
    relatedCaseStudies: ['CS-001', 'CS-006'],
    tags: ['DILRMP', 'Land Records', 'Digitization', 'Central', 'ULPIN', 'Cadastral'],
  },

  // ── POL-002 ─────────────────────────────────────────────────────────────────
  {
    id: 'POL-002',
    name: 'SVAMITVA Scheme – Survey of Villages and Mapping with Improvised Technology',
    governmentLevel: 'Central Government',
    state: null,
    ministry: 'Ministry of Panchayati Raj',
    department: 'Ministry of Panchayati Raj',
    issuingAuthority: 'Ministry of Panchayati Raj, GoI',
    year: 2021,
    effectiveDate: 'Demo – Launched April 2021 (verify official date)',
    amendmentYear: null,
    policyType: 'Scheme',
    category: 'Rural Development',
    status: 'Active',
    applicableArea: 'Rural inhabited areas (Abadi land) across all states',
    relatedLandSector: ['Land Records', 'Rural Land', 'Mapping & GIS', 'Land Titling'],
    isDemoData: true,
    verificationStatus: 'Demo / Not Verified',

    shortDescription:
      'A scheme to map inhabited land in rural villages using drone technology and provide property rights documentation to residents of rural abadi areas.',

    objective:
      'To provide property rights to residents of rural abadi areas through drone-based survey and mapping, enabling households to use property as financial assets and reducing property disputes.',

    description:
      'SVAMITVA (Demo Reference) uses drones to map the inhabited (abadi) land in rural villages, creates spatial records, and issues property cards (rights of ownership). This enables rural households to use property as collateral for loans and helps in better rural planning. Note: All details are demo references — verify against official Ministry of Panchayati Raj publications.',

    keyProvisions: [
      { title: 'Drone Survey of Abadi Land', description: 'Drone-based mapping of inhabited village land to create accurate spatial records.' },
      { title: 'Property Cards', description: 'Issuance of property rights documents (property cards) to household owners.' },
      { title: 'GIS Mapping', description: 'GIS-based village maps created and integrated with revenue records.' },
      { title: 'Financial Access', description: 'Property cards can be used as collateral for institutional loans.' },
      { title: 'Dispute Reduction', description: 'Accurate demarcation reduces boundary disputes in abadi areas.' },
    ],

    timeline: [
      { year: '2020', event: 'Pilot Launch', description: 'Pilot launched in April 2020 across selected states.' },
      { year: '2021', event: 'National Rollout', description: 'Expanded to all states and UTs.' },
      { year: '2023', event: 'Ongoing', description: 'Scheme continues with phased coverage of all eligible villages.' },
    ],

    source: {
      title: 'SVAMITVA Scheme – Ministry of Panchayati Raj (Demo Reference)',
      organization: 'Ministry of Panchayati Raj, GoI',
      url: 'https://svamitva.nic.in',
      documentType: 'Government Scheme Page',
      isDemo: true,
    },

    relatedPolicies: ['POL-001', 'POL-008'],
    relatedDatasets: ['land-records', 'land-ownership'],
    relatedCaseStudies: ['CS-005'],
    tags: ['SVAMITVA', 'Drone Survey', 'Rural', 'Abadi', 'Property Rights', 'Central'],
  },

  // ── POL-003 ─────────────────────────────────────────────────────────────────
  {
    id: 'POL-003',
    name: 'Forest Rights Act, 2006 (Scheduled Tribes and Other Traditional Forest Dwellers Act)',
    governmentLevel: 'Central Government',
    state: null,
    ministry: 'Ministry of Tribal Affairs',
    department: 'Ministry of Tribal Affairs',
    issuingAuthority: 'Parliament of India',
    year: 2006,
    effectiveDate: 'Demo – 2008 (verify official gazette notification)',
    amendmentYear: null,
    policyType: 'Act',
    category: 'Forest and Conservation',
    status: 'Active',
    applicableArea: 'Forest areas across India – Scheduled Tribes and forest-dwelling communities',
    relatedLandSector: ['Forest Land', 'Tribal Rights', 'Community Land', 'Conservation'],
    isDemoData: true,
    verificationStatus: 'Demo / Not Verified',

    shortDescription:
      'A central legislation recognising the rights of forest-dwelling Scheduled Tribes and other traditional forest dwellers over forest land and resources.',

    objective:
      'To recognise and vest forest rights and occupation of forest land in forest-dwelling Scheduled Tribes and other traditional forest dwellers who have been residing in such forests for generations, correcting historical injustice.',

    description:
      'The Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006 (Demo Reference) recognises individual and community forest rights, including rights to live in, cultivate, and access forest resources. It establishes gram sabha as the authority for rights recognition and protects communities from eviction without due process. Note: All details are demo references — verify against official gazette and Ministry of Tribal Affairs publications.',

    keyProvisions: [
      { title: 'Individual Forest Rights', description: 'Recognition of individual rights to cultivate and reside on forest land.' },
      { title: 'Community Forest Rights', description: 'Recognition of community rights over forest resources and community forest areas.' },
      { title: 'Gram Sabha Authority', description: 'Gram sabha empowered to initiate and verify forest rights claims.' },
      { title: 'Rights over Minor Forest Produce', description: 'Rights to collect, use, and sell minor forest produce.' },
      { title: 'Protection from Eviction', description: 'No eviction of forest dwellers without recognition of rights and due process.' },
      { title: 'Conservation Responsibility', description: 'Communities with forest rights have responsibility for sustainable conservation.' },
    ],

    timeline: [
      { year: '2006', event: 'Act Enacted', description: 'Scheduled Tribes and Other Traditional Forest Dwellers Act passed by Parliament.' },
      { year: '2008', event: 'Rules Notified', description: 'Forest Rights Rules notified by Ministry of Tribal Affairs.' },
      { year: '2012', event: 'Amendment Rules', description: 'Forest Rights (Amendment) Rules 2012 notified.' },
      { year: '2023', event: 'Active', description: 'Act continues in force; implementation ongoing across states.' },
    ],

    source: {
      title: 'Forest Rights Act 2006 – Ministry of Tribal Affairs (Demo Reference)',
      organization: 'Ministry of Tribal Affairs, GoI',
      url: 'https://tribal.nic.in',
      documentType: 'Act / Gazette',
      isDemo: true,
    },

    relatedPolicies: ['POL-009'],
    relatedDatasets: ['land-ownership', 'land-use'],
    relatedCaseStudies: ['CS-002'],
    tags: ['FRA', 'Forest Rights', 'Tribal', 'Community Rights', 'Central', 'Conservation'],
  },

  // ── POL-004 ─────────────────────────────────────────────────────────────────
  {
    id: 'POL-004',
    name: 'Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013',
    governmentLevel: 'Central Government',
    state: null,
    ministry: 'Ministry of Rural Development',
    department: 'Department of Land Resources',
    issuingAuthority: 'Parliament of India',
    year: 2013,
    effectiveDate: 'Demo – January 2014 (verify official gazette notification)',
    amendmentYear: null,
    policyType: 'Act',
    category: 'Land Acquisition',
    status: 'Active',
    applicableArea: 'All States and UTs of India',
    relatedLandSector: ['Land Acquisition', 'Rural Land', 'Urban Land', 'Infrastructure'],
    isDemoData: true,
    verificationStatus: 'Demo / Not Verified',

    shortDescription:
      'A central law governing the process for land acquisition by government, ensuring fair compensation, rehabilitation, and resettlement of affected families.',

    objective:
      'To ensure a humane, participative, informed, and transparent process for land acquisition with fair compensation, resettlement, and rehabilitation of those displaced.',

    description:
      'The LARR Act 2013 (Demo Reference) replaced the Land Acquisition Act of 1894. It mandates social impact assessments, consent of affected families, fair compensation (up to 4x market value for rural, 2x for urban), and comprehensive rehabilitation and resettlement provisions. Note: All details are demo references — verify against official sources.',

    keyProvisions: [
      { title: 'Social Impact Assessment', description: 'Mandatory SIA before acquisition to assess social and economic impact on affected communities.' },
      { title: 'Consent Clause', description: 'Consent of 70–80% of affected families required for private/PPP projects.' },
      { title: 'Fair Compensation', description: 'Compensation up to 4x market value in rural areas and 2x in urban areas.' },
      { title: 'Rehabilitation & Resettlement', description: 'Comprehensive R&R package for displaced families including employment, housing, and social support.' },
      { title: 'Return of Unutilised Land', description: 'Acquired land not used within 5 years must be returned to original owners or land bank.' },
      { title: 'Food Security Safeguard', description: 'Special restrictions on acquisition of multi-crop irrigated agricultural land.' },
    ],

    timeline: [
      { year: '1894', event: 'Predecessor Law', description: 'Land Acquisition Act 1894 enacted under colonial rule.' },
      { year: '2013', event: 'LARR Act Enacted', description: 'Right to Fair Compensation and Transparency in Land Acquisition Act passed.' },
      { year: '2014', event: 'Effective', description: 'Act came into effect January 2014.' },
      { year: '2015', event: 'Amendment Ordinance', description: 'Amendment ordinance issued (demo reference — verify official status).' },
      { year: '2023', event: 'Active', description: 'Act continues in force with state-level amendments in some states.' },
    ],

    source: {
      title: 'LARR Act 2013 – Dept of Land Resources (Demo Reference)',
      organization: 'Department of Land Resources, Ministry of Rural Development, GoI',
      url: 'https://dolr.gov.in',
      documentType: 'Act / Gazette',
      isDemo: true,
    },

    relatedPolicies: ['POL-001'],
    relatedDatasets: ['land-ownership', 'state-wise'],
    relatedCaseStudies: [],
    tags: ['LARR', 'Land Acquisition', 'Compensation', 'Rehabilitation', 'Central', '2013'],
  },

  // ── POL-005 ─────────────────────────────────────────────────────────────────
  {
    id: 'POL-005',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) – Agricultural Land Component',
    governmentLevel: 'Central Government',
    state: null,
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    department: 'Department of Agriculture & Farmers Welfare',
    issuingAuthority: 'Department of Agriculture & Farmers Welfare, GoI',
    year: 2016,
    effectiveDate: 'Demo – Kharif 2016 (verify official notification)',
    amendmentYear: '2020',
    policyType: 'Scheme',
    category: 'Agriculture Land',
    status: 'Active',
    applicableArea: 'All States and UTs – notified agricultural areas',
    relatedLandSector: ['Agricultural Land', 'Rural Land', 'Land Records'],
    isDemoData: true,
    verificationStatus: 'Demo / Not Verified',

    shortDescription:
      'A crop insurance scheme providing financial support to farmers suffering crop loss or damage due to unforeseen events such as natural calamities, pests, and diseases.',

    objective:
      'To provide financial support to farmers in case of crop failure due to natural calamities, pests, or diseases, thereby stabilising farm incomes and encouraging farmers to adopt innovative and modern agricultural practices.',

    description:
      'PMFBY (Demo Reference) provides comprehensive risk insurance cover to farmers. The scheme relies on accurate land records to determine insured area and is closely linked to land titling. Farmers with notified crops in notified areas are eligible. Premiums are subsidised by central and state governments. Note: All details are demo references — verify against official PMFBY guidelines.',

    keyProvisions: [
      { title: 'Uniform Premium Structure', description: 'Farmers pay maximum 2% premium for Kharif, 1.5% for Rabi, and 5% for horticultural crops.' },
      { title: 'Land Record Linkage', description: 'Coverage determined based on notified land area in official land records.' },
      { title: 'Technology Use', description: 'Smart sampling and remote sensing for crop loss assessment.' },
      { title: 'Direct Benefit Transfer', description: 'Claims paid directly to farmers through bank accounts.' },
      { title: 'State Flexibility', description: 'States may choose to implement or opt out of the scheme.' },
    ],

    timeline: [
      { year: '2016', event: 'Scheme Launched', description: 'PMFBY launched replacing NAIS and Modified NAIS.' },
      { year: '2018', event: 'Revision', description: 'Revised implementation guidelines issued.' },
      { year: '2020', event: 'Restructuring', description: 'Scheme made voluntary for farmers; state flexibility enhanced.' },
      { year: '2023', event: 'Active', description: 'Scheme continues with ongoing enrollment.' },
    ],

    source: {
      title: 'PMFBY – Dept of Agriculture & Farmers Welfare (Demo Reference)',
      organization: 'Department of Agriculture & Farmers Welfare, GoI',
      url: 'https://pmfby.gov.in',
      documentType: 'Government Scheme Page',
      isDemo: true,
    },

    relatedPolicies: ['POL-006'],
    relatedDatasets: ['land-records', 'land-use'],
    relatedCaseStudies: [],
    tags: ['PMFBY', 'Crop Insurance', 'Agriculture', 'Farmers', 'Central', 'Land Records'],
  },

  // ── POL-006 ─────────────────────────────────────────────────────────────────
  {
    id: 'POL-006',
    name: 'PM Kisan Samman Nidhi (PM-KISAN) – Agricultural Land Linkage',
    governmentLevel: 'Central Government',
    state: null,
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    department: 'Department of Agriculture & Farmers Welfare',
    issuingAuthority: 'Department of Agriculture & Farmers Welfare, GoI',
    year: 2018,
    effectiveDate: 'Demo – December 2018 (verify official notification)',
    amendmentYear: null,
    policyType: 'Scheme',
    category: 'Agriculture Land',
    status: 'Active',
    applicableArea: 'All States and UTs – eligible farmer families',
    relatedLandSector: ['Agricultural Land', 'Land Records', 'Rural Land'],
    isDemoData: true,
    verificationStatus: 'Demo / Not Verified',

    shortDescription:
      'An income support scheme providing financial assistance to land-holding farmers, directly linked to verified land records and ownership.',

    objective:
      'To supplement the financial needs of small and marginal farmers by providing them income support and enabling them to meet expenses related to agriculture inputs and domestic needs.',

    description:
      'PM-KISAN (Demo Reference) provides ₹6,000 per year in three equal installments to eligible farmer families with cultivable land. The scheme relies directly on accurate and updated land records for beneficiary identification. It highlights the importance of land titling and digital land records infrastructure. Note: All details are demo references — verify against official PM-KISAN guidelines.',

    keyProvisions: [
      { title: 'Income Support', description: '₹6,000 per year paid in three installments of ₹2,000 each.' },
      { title: 'Land Record Dependency', description: 'Beneficiary identification directly based on verified land ownership records.' },
      { title: 'Direct Benefit Transfer', description: 'Funds transferred directly to farmer bank accounts through DBT.' },
      { title: 'Aadhaar Linkage', description: 'Mandatory Aadhaar linking for all beneficiaries.' },
      { title: 'Exclusion Criteria', description: 'Excludes institutional landholders, government employees, and income-tax payers.' },
    ],

    timeline: [
      { year: '2018', event: 'Scheme Announced', description: 'PM-KISAN announced in Interim Union Budget 2019.' },
      { year: '2019', event: 'Full Rollout', description: 'Expanded to cover all eligible farmer families across India.' },
      { year: '2023', event: 'Active', description: 'Scheme continues with periodic installment releases.' },
    ],

    source: {
      title: 'PM-KISAN – Dept of Agriculture & Farmers Welfare (Demo Reference)',
      organization: 'Department of Agriculture & Farmers Welfare, GoI',
      url: 'https://pmkisan.gov.in',
      documentType: 'Government Scheme Page',
      isDemo: true,
    },

    relatedPolicies: ['POL-005', 'POL-001'],
    relatedDatasets: ['land-records', 'land-ownership'],
    relatedCaseStudies: [],
    tags: ['PM-KISAN', 'Income Support', 'Agriculture', 'Farmers', 'Land Records', 'Central'],
  },

  // ── POL-007 ─────────────────────────────────────────────────────────────────
  {
    id: 'POL-007',
    name: 'Smart Cities Mission – Urban Land and Infrastructure Development',
    governmentLevel: 'Central Government',
    state: null,
    ministry: 'Ministry of Housing and Urban Affairs',
    department: 'Ministry of Housing and Urban Affairs',
    issuingAuthority: 'Ministry of Housing and Urban Affairs, GoI',
    year: 2015,
    effectiveDate: 'Demo – June 2015 (verify official notification)',
    amendmentYear: null,
    policyType: 'Initiative',
    category: 'Urban Development',
    status: 'Active',
    applicableArea: '100 selected smart cities across India',
    relatedLandSector: ['Urban Land', 'Land Use Planning', 'Infrastructure', 'Urban Governance'],
    isDemoData: true,
    verificationStatus: 'Demo / Not Verified',

    shortDescription:
      'A flagship urban development initiative to promote sustainable and inclusive cities through smart solutions, including improved land use planning and urban infrastructure.',

    objective:
      'To promote cities that provide core infrastructure, clean and sustainable environment, and give a decent quality of life to their citizens through application of smart solutions to infrastructure and services.',

    description:
      'Smart Cities Mission (Demo Reference) selects 100 cities through a competitive process and provides central funding for area-based development and pan-city solutions. Land use planning, urban land records, and integrated urban management are core components. Note: All details are demo references — verify against official MoHUA publications.',

    keyProvisions: [
      { title: 'Area-Based Development', description: 'Focused development in selected areas within cities through redevelopment, greenfield, and retrofitting.' },
      { title: 'Pan-City Solutions', description: 'Smart IT-based solutions for city-wide infrastructure and services management.' },
      { title: 'Integrated Command and Control Centres', description: 'Centralised monitoring of urban infrastructure and services.' },
      { title: 'Land Use Rationalisation', description: 'Improved land use planning and mixed-use zoning within smart city areas.' },
      { title: 'Urban Land Records', description: 'Improved urban land records and property tax systems.' },
    ],

    timeline: [
      { year: '2015', event: 'Mission Launched', description: 'Smart Cities Mission launched by Government of India.' },
      { year: '2016', event: 'City Selection', description: 'First round of smart city selection completed.' },
      { year: '2023', event: 'Implementation', description: 'Ongoing project implementation across selected cities.' },
    ],

    source: {
      title: 'Smart Cities Mission – MoHUA (Demo Reference)',
      organization: 'Ministry of Housing and Urban Affairs, GoI',
      url: 'https://smartcities.gov.in',
      documentType: 'Government Initiative Page',
      isDemo: true,
    },

    relatedPolicies: ['POL-010'],
    relatedDatasets: ['land-use', 'state-wise'],
    relatedCaseStudies: ['CS-003'],
    tags: ['Smart Cities', 'Urban', 'Infrastructure', 'Land Use', 'Central', 'MoHUA'],
  },

  // ── POL-008 ─────────────────────────────────────────────────────────────────
  {
    id: 'POL-008',
    name: 'Pradhan Mantri Awas Yojana – Gramin (PMAY-G)',
    governmentLevel: 'Central Government',
    state: null,
    ministry: 'Ministry of Rural Development',
    department: 'Department of Rural Development',
    issuingAuthority: 'Department of Rural Development, GoI',
    year: 2016,
    effectiveDate: 'Demo – April 2016 (verify official notification)',
    amendmentYear: null,
    policyType: 'Programme',
    category: 'Rural Development',
    status: 'Active',
    applicableArea: 'Rural areas across all States and UTs',
    relatedLandSector: ['Rural Land', 'Land Records', 'Land Titling'],
    isDemoData: true,
    verificationStatus: 'Demo / Not Verified',

    shortDescription:
      'A central programme to provide housing assistance to eligible rural households, with provisions linking land ownership and titling to beneficiary selection.',

    objective:
      'To provide pucca houses with basic amenities to all houseless and those living in dilapidated houses in rural areas by a specified target year.',

    description:
      'PMAY-G (Demo Reference) provides financial assistance for construction of pucca houses in rural India. Beneficiary selection is linked to Socio-Economic and Caste Census data and land availability. The programme highlights the importance of clear land titles for rural households to access housing benefits. Note: All details are demo references — verify against official PMAY-G guidelines.',

    keyProvisions: [
      { title: 'Financial Assistance', description: 'Financial assistance per unit (₹1.20 lakh in plains, ₹1.30 lakh in hilly areas — demo figures, verify official amounts).' },
      { title: 'Land Title Requirement', description: 'Beneficiaries must have clear land title or be provided land through state government.' },
      { title: 'SECC Targeting', description: 'Beneficiary identification using Socio-Economic and Caste Census data.' },
      { title: 'Convergence', description: 'Convergence with MGNREGS, Ujjwala, Saubhagya, and other schemes.' },
      { title: 'DBT Payment', description: 'Financial assistance released in installments through Direct Benefit Transfer.' },
    ],

    timeline: [
      { year: '2016', event: 'Programme Launched', description: 'PMAY-G launched replacing Indira Awas Yojana.' },
      { year: '2019', event: 'Target Revision', description: 'Target revised and phase-wise implementation plan updated.' },
      { year: '2023', event: 'Active', description: 'Programme continues with ongoing construction and completion drives.' },
    ],

    source: {
      title: 'PMAY-G – Dept of Rural Development (Demo Reference)',
      organization: 'Department of Rural Development, Ministry of Rural Development, GoI',
      url: 'https://pmayg.nic.in',
      documentType: 'Government Programme Page',
      isDemo: true,
    },

    relatedPolicies: ['POL-002'],
    relatedDatasets: ['land-ownership', 'land-records'],
    relatedCaseStudies: ['CS-005'],
    tags: ['PMAY-G', 'Rural Housing', 'Land Title', 'Rural Development', 'Central'],
  },

  // ── POL-009 ─────────────────────────────────────────────────────────────────
  {
    id: 'POL-009',
    name: 'Karnataka Land Reforms Act – Provisions on Agricultural Land (Demo Reference)',
    governmentLevel: 'State Government',
    state: 'Karnataka',
    ministry: 'Revenue Department, Karnataka',
    department: 'Revenue Department, Government of Karnataka',
    issuingAuthority: 'Government of Karnataka',
    year: 1961,
    effectiveDate: 'Demo – verify official gazette date',
    amendmentYear: '2020',
    policyType: 'Act',
    category: 'Agriculture Land',
    status: 'Amended',
    applicableArea: 'Karnataka – Agricultural land',
    relatedLandSector: ['Agricultural Land', 'Land Records', 'Land Governance'],
    isDemoData: true,
    verificationStatus: 'Demo / Not Verified',

    shortDescription:
      'A state legislation governing agricultural land ownership, tenancy, and ceiling limits in Karnataka — with significant amendments affecting land purchase eligibility.',

    objective:
      'To regulate ownership of agricultural land, protect tenant farmers, and impose ceiling limits on agricultural land holdings in Karnataka.',

    description:
      'The Karnataka Land Reforms Act (Demo Reference) historically restricted purchase of agricultural land to persons engaged in agriculture. Significant amendments in 2020 and 2021 broadened eligibility criteria for purchasing agricultural land. Note: All details are demo references — this covers a real act name; verify all provisions and amendment details against official Karnataka government sources.',

    keyProvisions: [
      { title: 'Land Ceiling Provisions', description: 'Maximum limits on agricultural land holdings per family unit.' },
      { title: 'Tenancy Protection', description: 'Protections for registered tenants of agricultural land.' },
      { title: 'Purchase Eligibility (Amended)', description: 'Amendments modified who can purchase agricultural land in Karnataka.' },
      { title: 'Revenue Records Integration', description: 'Linkage with Karnataka Bhoomi land records system.' },
    ],

    timeline: [
      { year: '1961', event: 'Act Enacted', description: 'Karnataka Land Reforms Act enacted by State Legislature.' },
      { year: '1974', event: 'Major Amendment', description: 'Significant tenancy provisions added.' },
      { year: '2020', event: 'Amendment', description: 'Amendment to agricultural land purchase eligibility (demo reference — verify official details).' },
      { year: '2023', event: 'Active (Amended)', description: 'Act in force with amendments.' },
    ],

    source: {
      title: 'Karnataka Land Reforms Act – Revenue Dept Karnataka (Demo Reference)',
      organization: 'Revenue Department, Government of Karnataka',
      url: 'https://revenue.karnataka.gov.in',
      documentType: 'State Act / Gazette',
      isDemo: true,
    },

    relatedPolicies: ['POL-001', 'POL-003'],
    relatedDatasets: ['land-records', 'land-ownership'],
    relatedCaseStudies: ['CS-001', 'CS-006'],
    tags: ['Karnataka', 'Land Reforms', 'Agricultural Land', 'State', 'Tenancy', 'Land Ceiling'],
  },

  // ── POL-010 ─────────────────────────────────────────────────────────────────
  {
    id: 'POL-010',
    name: 'National Urban Land Policy Framework (Demo Reference)',
    governmentLevel: 'Central Government',
    state: null,
    ministry: 'Ministry of Housing and Urban Affairs',
    department: 'Ministry of Housing and Urban Affairs',
    issuingAuthority: 'Ministry of Housing and Urban Affairs, GoI',
    year: 2022,
    effectiveDate: 'Demo – verify official date',
    amendmentYear: null,
    policyType: 'Policy',
    category: 'Land Use',
    status: 'Verification Required',
    applicableArea: 'Urban areas – all States and UTs',
    relatedLandSector: ['Urban Land', 'Land Use Planning', 'Land Records', 'Urban Governance'],
    isDemoData: true,
    verificationStatus: 'Demo / Not Verified',

    shortDescription:
      'A proposed national framework for rationalising urban land use, improving urban land records, and enabling efficient urban land management across Indian cities.',

    objective:
      'To create a comprehensive national policy framework for urban land — addressing land availability, land use efficiency, digital records, and fair urban land governance.',

    description:
      'This entry is a Demo Reference for a national urban land policy framework. MoHUA has engaged in urban land policy discussions as part of urban governance reforms. Note: This is a prototype record — verify whether a specific official policy document exists and replace this entry with verified official content.',

    keyProvisions: [
      { title: 'Urban Land Records Modernisation', description: 'Framework for updating and digitising urban land records across all ULBs.' },
      { title: 'Land Use Rationalisation', description: 'Guidelines for efficient land use planning and mixed-use zoning.' },
      { title: 'Vacant Land Management', description: 'Policy direction for managing vacant and underutilised urban land.' },
      { title: 'Property Tax Reform', description: 'Linkage of land records with property tax systems.' },
    ],

    timeline: [
      { year: '2022', event: 'Demo Reference', description: 'Demo placeholder record — verify against official MoHUA publications.' },
    ],

    source: {
      title: 'MoHUA Urban Land Policy – Demo Reference',
      organization: 'Ministry of Housing and Urban Affairs, GoI',
      url: 'https://mohua.gov.in',
      documentType: 'Policy Document (Demo Reference)',
      isDemo: true,
    },

    relatedPolicies: ['POL-007'],
    relatedDatasets: ['land-use', 'state-wise'],
    relatedCaseStudies: ['CS-003'],
    tags: ['Urban Land', 'Land Use', 'Urban Planning', 'Central', 'MoHUA', 'Demo'],
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────
export const getPolicy = (id) => POLICIES.find((p) => p.id === id) || null;

export const getRelatedPolicies = (policy) =>
  (policy.relatedPolicies || [])
    .map((id) => POLICIES.find((p) => p.id === id))
    .filter(Boolean);

// ─── Summary statistics ───────────────────────────────────────────────────────
export const POL_SUMMARY_STATS = [
  { label: 'Total Policies',      value: POLICIES.length,                                                     icon: '📜', color: 'blue'   },
  { label: 'Central Government',  value: POLICIES.filter((p) => p.governmentLevel === 'Central Government').length, icon: '🏛️', color: 'indigo' },
  { label: 'State Government',    value: POLICIES.filter((p) => p.governmentLevel === 'State Government').length,   icon: '🗺️', color: 'green'  },
  { label: 'States Covered',      value: [...new Set(POLICIES.filter((p) => p.state).map((p) => p.state))].length,  icon: '📍', color: 'teal'   },
  { label: 'Policy Categories',   value: POLICY_CATEGORY_LIST.length,                                        icon: '📂', color: 'purple' },
  { label: 'Active Policies',     value: POLICIES.filter((p) => p.status === 'Active').length,               icon: '✅', color: 'orange' },
];
