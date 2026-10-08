/**
 * Land Governance Case Studies – Demo Data
 *
 * ALL records are clearly labelled isDemoData: true.
 * They are prototype examples for demonstration purposes ONLY.
 * They must NOT be interpreted as official government reports or verified field studies.
 * Replace with verified case studies when official sources are connected.
 */

// ─── Filter option lists ──────────────────────────────────────────────────────
export const CS_LAND_TYPES = [
  'Agricultural Land', 'Urban Land', 'Forest Land', 'Rural Land',
  'Community Land', 'Government Land', 'Mixed Land Use',
];

export const CS_PROBLEM_CATEGORIES = [
  'Land Records', 'Land Titling', 'Land Use Planning', 'Land Administration',
  'Land Registration', 'Land Governance', 'Digitization', 'Mapping & GIS',
  'Rural Land Management', 'Urban Land Management', 'Community Land Management',
];

export const CS_STUDY_TYPES = [
  'Digital Transformation', 'GIS & Mapping', 'Land Records Modernization',
  'Land Use Planning', 'Rural Land Governance', 'Urban Land Governance',
  'Community Land Management', 'Administrative Innovation', 'Technology-Based Governance',
];

export const CS_EVIDENCE_LEVELS = [
  'Verified Source', 'Published Study', 'Government Report',
  'Academic Research', 'Institutional Report', 'Demo / Prototype',
];

export const CS_STATUS_OPTIONS = ['Demo', 'Published', 'Under Review', 'Archived'];

// ─── Analytics data (derived from case studies below) ────────────────────────
export const CS_BY_STATE = [
  { state: 'Karnataka',    count: 2 },
  { state: 'Maharashtra',  count: 1 },
  { state: 'Odisha',       count: 1 },
  { state: 'Telangana',    count: 1 },
  { state: 'Uttarakhand',  count: 1 },
];

export const CS_BY_LAND_TYPE = [
  { label: 'Rural Land',        value: 2, color: '#10b981' },
  { label: 'Agricultural Land', value: 1, color: '#f59e0b' },
  { label: 'Urban Land',        value: 1, color: '#6366f1' },
  { label: 'Forest Land',       value: 1, color: '#065f46' },
  { label: 'Community Land',    value: 1, color: '#f97316' },
];

export const CS_BY_CATEGORY = [
  { category: 'Land Records',          count: 2 },
  { category: 'Digitization',          count: 2 },
  { category: 'Mapping & GIS',         count: 1 },
  { category: 'Community Land Mgmt',   count: 1 },
  { category: 'Urban Land Mgmt',       count: 1 },
  { category: 'Rural Land Governance', count: 1 },
];

export const CS_BY_YEAR = [
  { year: '2020', count: 1 },
  { year: '2021', count: 1 },
  { year: '2022', count: 1 },
  { year: '2023', count: 2 },
  { year: '2024', count: 1 },
];

// ─── CASE STUDIES ─────────────────────────────────────────────────────────────
export const CASE_STUDIES = [
  // ── CS-001 ──────────────────────────────────────────────────────────────────
  {
    id: 'CS-001',
    title: 'Digital Land Records Modernization in Belagavi District',
    state: 'Karnataka',
    district: 'Belagavi',
    location: 'Belagavi District, North Karnataka',
    landType: 'Rural Land',
    problemCategory: 'Land Records',
    caseStudyType: 'Land Records Modernization',
    status: 'Demo',
    evidenceLevel: 'Demo / Prototype',
    year: 2023,
    isDemoData: true,
    shortDescription:
      'A demonstration case examining how digitization and improved access to land records can support more efficient land administration and reduce disputes in a rural district.',
    tags: ['Digitization', 'Land Records', 'Karnataka', 'Rural', 'DILRMP'],

    location_detail: {
      state: 'Karnataka',
      district: 'Belagavi',
      taluk: 'Belagavi Taluk (demo area)',
      village: 'Selected demonstration villages',
      coordinates: { lat: 15.8497, lng: 74.4977 },
      geographicCoverage: 'Selected villages across 3 demonstration taluks',
    },

    problem: {
      summary: 'Large volumes of land records in the district existed only in paper form, making access difficult for farmers and administrators alike.',
      affected: 'Smallholder farmers, land-owners, revenue officials, and dispute-resolution bodies.',
      location: 'Belagavi District, Karnataka',
      importance: 'Inaccessible land records lead to unresolved boundary disputes, delays in agricultural loans, and difficulties transferring property.',
      challenges: [
        'Paper records degraded or missing in several taluks',
        'No centralised database for cross-referencing ownership',
        'Long queues at revenue offices for simple record extracts',
        'High incidence of measurement disputes between neighbouring parcels',
      ],
    },

    background: {
      regional: 'Belagavi is a large district in northern Karnataka with a predominantly agricultural economy. Land is a critical asset for rural livelihoods.',
      landCharacteristics: 'Mixed dryland and irrigated agricultural land, with significant peri-urban pressure near Belagavi city.',
      historical: 'Land records were maintained in paper registers (Record of Rights, Tenancy and Crops – RTC) since colonial times, with no systematic digitization before 2015.',
      administrative: 'Revenue administration is managed through District Collector, Tahasildars, and village accountants (shanbhogs).',
      socioEconomic: 'A significant proportion of the farming population lacks formal documentation, limiting access to institutional credit.',
      existingPractices: 'Manual RTC extraction required in-person visits; mutation records maintained in separate registers.',
      whyImportant: 'Modernizing records is a prerequisite for linking land data to agricultural credit, welfare schemes, and efficient dispute resolution.',
    },

    evidence: [
      {
        type: 'Administrative Records',
        source: 'Karnataka Revenue Department (Demo Reference)',
        year: 2022,
        coverage: 'District-level',
        description: 'Sample register of RTC records used for demonstration of digitization workflow.',
        verificationStatus: 'Demo / Sample',
      },
      {
        type: 'GIS Dataset',
        source: 'Karnataka State Remote Sensing Application Centre (Demo)',
        year: 2022,
        coverage: 'District cadastral maps (sample)',
        description: 'Sample cadastral boundary data used to demonstrate spatial overlay with ownership records.',
        verificationStatus: 'Demo / Sample',
      },
      {
        type: 'Survey Data',
        source: 'Demo Field Survey',
        year: 2023,
        coverage: '3 demonstration villages',
        description: 'Simulated field survey of 150 households capturing land-record access challenges.',
        verificationStatus: 'Demo / Sample',
      },
    ],

    gisInfo: {
      available: true,
      isDemo: true,
      center: [15.8497, 74.4977],
      zoom: 10,
      note: 'DEMO MAP – Sample GIS data for demonstration only. Does not represent official land boundaries.',
      layers: ['District Boundary', 'Agricultural Zones', 'Urban Areas', 'Village Settlements'],
    },

    analysis: {
      summary: 'Analysis of demo data indicates that delayed record access contributes to protracted land disputes and reduced agricultural loan uptake.',
      findings: [
        'Approximately 40% of sampled households reported difficulty obtaining RTC extracts.',
        'Average processing time for mutation requests was 45 days (demo estimate).',
        'Boundary disputes concentrated in peri-urban taluks where agricultural land is transitioning to residential use.',
      ],
      dataGaps: [
        'Actual time-series mutation data not yet verified',
        'Dispute resolution outcomes not available in demo dataset',
      ],
      charts: [
        { type: 'bar', title: 'Record Access Difficulty by Taluk (%)', data: [{ label: 'Taluk A', value: 42 }, { label: 'Taluk B', value: 37 }, { label: 'Taluk C', value: 29 }] },
        { type: 'donut', title: 'Record Issues Reported', data: [{ label: 'Missing Records', value: 35, color: '#ef4444' }, { label: 'Boundary Disputes', value: 28, color: '#f97316' }, { label: 'Mutation Delays', value: 25, color: '#f59e0b' }, { label: 'Ownership Unclear', value: 12, color: '#6366f1' }] },
      ],
    },

    interventions: [
      { name: 'Record Digitization Drive', stakeholder: 'District Revenue Office', period: '2022–2023', description: 'Scanning and indexing of paper RTC registers for all taluks.', status: 'Demo – Ongoing' },
      { name: 'Online RTC Portal', stakeholder: 'Karnataka e-Governance Services', period: '2023', description: 'Citizen-facing portal for downloading RTC extracts without visiting revenue offices.', status: 'Demo – Implemented' },
      { name: 'GIS Cadastral Mapping', stakeholder: 'Survey & Land Records Dept (Demo)', period: '2022–2024', description: 'Geo-referencing of survey maps and overlay with ownership database.', status: 'Demo – Planned' },
    ],

    outcomes: [
      { indicator: 'Villages Covered', value: '48 (Demo)', icon: '🏘️', color: 'blue' },
      { indicator: 'Records Digitized', value: '1.2 L (Demo)', icon: '📋', color: 'green' },
      { indicator: 'Portal Transactions', value: '8,400 (Demo)', icon: '💻', color: 'purple' },
      { indicator: 'Avg. Processing Time', value: '12 Days (Demo)', icon: '⏱️', color: 'orange' },
    ],

    lessonsLearned: [
      { category: 'What Worked', text: 'Centralised scanning centres reduced backlog significantly in demonstration scenario.' },
      { category: 'Challenge', text: 'Legacy paper records contained errors that required manual verification before digitization.' },
      { category: 'Institutional Lesson', text: 'Coordination between revenue, survey, and e-governance departments was critical.' },
      { category: 'Technology Lesson', text: 'OCR accuracy on handwritten revenue records was limited; human verification remained necessary.' },
      { category: 'Improvement', text: 'A dedicated grievance mechanism for record correction errors would improve user trust.' },
    ],

    stakeholders: [
      { name: 'District Collector, Belagavi', role: 'Implementation Lead', type: 'Government' },
      { name: 'Karnataka Revenue Department', role: 'Data Owner', type: 'Government' },
      { name: 'Karnataka e-Governance Services Ltd.', role: 'Technology Partner', type: 'Institutional' },
      { name: 'Village Accountants (Shanbhogs)', role: 'Data Entry & Verification', type: 'Government' },
      { name: 'Smallholder Farming Communities', role: 'Primary Beneficiary', type: 'Community' },
    ],

    timeline: [
      { year: '2021', event: 'Problem Identified', description: 'Revenue department audit identified large backlog of undigitized records.' },
      { year: '2022 Q1', event: 'Planning & Baseline', description: 'Baseline survey of record condition conducted across taluks.' },
      { year: '2022 Q3', event: 'Digitization Pilot', description: 'Pilot scanning centre established in Belagavi Taluk.' },
      { year: '2023 Q1', event: 'Portal Launch', description: 'Online RTC portal launched for citizen access.' },
      { year: '2023 Q4', event: 'Evaluation', description: 'User adoption and processing-time metrics collected.' },
      { year: '2024', event: 'Scale-up Planned', description: 'Expansion to remaining taluks under demo plan.' },
    ],

    relatedDatasets: ['state-wise', 'land-records'],
    relatedPolicies: [
      { name: 'DILRMP', description: 'Digital India Land Records Modernisation Programme', link: '/policies' },
    ],

    sources: [
      { title: 'Demo Reference – Land Records Modernization Study', org: 'Prototype Organisation (Demo)', year: 2023, type: 'Demo Reference', status: 'Demo / Not Verified', link: null },
      { title: 'Karnataka Bhoomi Portal Overview', org: 'Karnataka e-Governance Services Ltd.', year: 2022, type: 'Government Web Resource', status: 'Demo Reference Only', link: null },
    ],
  },

  // ── CS-002 ──────────────────────────────────────────────────────────────────
  {
    id: 'CS-002',
    title: 'Community Forest Land Governance in Tribal Belt, Odisha',
    state: 'Odisha',
    district: 'Koraput',
    location: 'Koraput District, Southern Odisha',
    landType: 'Forest Land',
    problemCategory: 'Community Land Management',
    caseStudyType: 'Community Land Management',
    status: 'Demo',
    evidenceLevel: 'Demo / Prototype',
    year: 2022,
    isDemoData: true,
    shortDescription:
      'A demonstration case exploring how community forest rights recognition and participatory land governance can strengthen tribal land security in a forest-dependent district.',
    tags: ['Forest Rights', 'Tribal Land', 'Community', 'Odisha', 'FRA'],

    location_detail: {
      state: 'Odisha',
      district: 'Koraput',
      taluk: 'Demonstration Block',
      village: 'Selected tribal habitations (demo)',
      coordinates: { lat: 18.8126, lng: 82.7111 },
      geographicCoverage: 'Selected forest-fringe villages across 2 demonstration blocks',
    },

    problem: {
      summary: 'Tribal communities in forest areas lacked formal documentation of their customary land and forest use rights, leaving them vulnerable to displacement and resource loss.',
      affected: 'Scheduled Tribe (ST) households, traditional forest dwellers, gram sabhas.',
      location: 'Koraput District, Southern Odisha',
      importance: 'Without formalised rights, communities cannot access government schemes, institutional credit, or legal protections for their land.',
      challenges: [
        'Complex administrative process for forest rights claims',
        'Low awareness among communities of their rights under FRA 2006',
        'Insufficient capacity in village-level governance bodies',
        'Overlap between forest department and revenue department jurisdictions',
      ],
    },

    background: {
      regional: "Koraput is one of Odisha's most forested and tribal districts. Land and forests are central to community livelihoods, identity, and culture.",
      landCharacteristics: 'Dense tropical forests intermixed with small agricultural clearings and shifting cultivation areas.',
      historical: 'Tribal communities have practiced customary land use for generations, but formal land rights recognition lagged under colonial-era forest laws.',
      administrative: 'Forest administration under Divisional Forest Officer; community rights process under District Collector and Sub-Divisional Level Committee.',
      socioEconomic: 'High poverty incidence. Dependence on forest produce, agriculture, and common resources. Limited financial inclusion.',
      existingPractices: 'Traditional governance through gram sabha and tribal councils, but weakly linked to formal administrative processes.',
      whyImportant: 'Formalising community land rights reduces conflict, enables investment in land, and strengthens social protection for tribal communities.',
    },

    evidence: [
      { type: 'Government Records', source: 'Odisha Tribal Development Cooperative (Demo)', year: 2022, coverage: 'Block-level', description: 'Demo records of forest rights claims filed and processed.', verificationStatus: 'Demo / Sample' },
      { type: 'Field Observations', source: 'Demo Research Team', year: 2022, coverage: '12 demo villages', description: 'Observation notes on gram sabha processes and claim documentation.', verificationStatus: 'Demo / Sample' },
      { type: 'Satellite Imagery', source: 'NRSC (Demo Reference)', year: 2021, coverage: 'District forest area', description: 'Sample forest cover data for overlay analysis.', verificationStatus: 'Demo / Sample' },
    ],

    gisInfo: {
      available: true,
      isDemo: true,
      center: [18.8126, 82.7111],
      zoom: 10,
      note: 'DEMO MAP – Sample GIS data. Does not represent verified official forest boundaries.',
      layers: ['District Boundary', 'Forest Cover', 'Village Settlements', 'Community Land Areas'],
    },

    analysis: {
      summary: 'Demo analysis highlights significant gaps between the number of eligible households and those with formalised forest land rights.',
      findings: [
        'Only ~35% of eligible households in demo sample had completed rights claims (demo figure).',
        'Community forest rights titles covered less than 20% of traditional use areas in demo scenario.',
        'Gram sabha awareness of FRA processes was low in remote habitations.',
      ],
      dataGaps: ['Actual rights claim data not yet verified', 'Forest boundary demarcation data unavailable'],
      charts: [
        { type: 'donut', title: 'Forest Rights Claim Status (Demo)', data: [{ label: 'Completed', value: 35, color: '#10b981' }, { label: 'In Process', value: 28, color: '#f59e0b' }, { label: 'Not Filed', value: 37, color: '#ef4444' }] },
        { type: 'bar', title: 'Awareness Level by Village Type (Demo %)', data: [{ label: 'Roadside', value: 64 }, { label: 'Interior', value: 31 }, { label: 'Remote', value: 18 }] },
      ],
    },

    interventions: [
      { name: 'Community Awareness Camps', stakeholder: 'District Administration & NGO Partners (Demo)', period: '2021–2022', description: 'Village-level meetings to explain FRA rights and claim process.', status: 'Demo – Completed' },
      { name: 'Gram Sabha Strengthening', stakeholder: 'Panchayati Raj Dept (Demo)', period: '2022', description: 'Capacity building for gram sabhas to conduct rights verification meetings.', status: 'Demo – Completed' },
      { name: 'GIS-Assisted Rights Mapping', stakeholder: 'NRSC & District Administration (Demo)', period: '2022–2023', description: 'Use of satellite data to support boundary identification for community forest areas.', status: 'Demo – Pilot' },
    ],

    outcomes: [
      { indicator: 'Rights Claims Filed', value: '420 (Demo)', icon: '📄', color: 'blue' },
      { indicator: 'Titles Issued', value: '148 (Demo)', icon: '✅', color: 'green' },
      { indicator: 'Villages Covered', value: '12 (Demo)', icon: '🏘️', color: 'purple' },
      { indicator: 'Area Documented', value: '860 ha (Demo)', icon: '🌲', color: 'teal' },
    ],

    lessonsLearned: [
      { category: 'What Worked', text: 'In-village awareness camps with vernacular materials significantly improved claim filing rates.' },
      { category: 'Challenge', text: 'Administrative coordination between forest and revenue departments was complex and slow.' },
      { category: 'Community Lesson', text: 'Gram sabha-led verification was more trusted by communities than top-down processes.' },
      { category: 'Data Limitation', text: 'Forest boundary demarcation data was incomplete, causing delays in processing claims.' },
      { category: 'Improvement', text: 'Integrating GIS mapping from the outset would reduce boundary disputes during verification.' },
    ],

    stakeholders: [
      { name: 'District Collector, Koraput', role: 'Implementation Authority', type: 'Government' },
      { name: 'Odisha Forest Department', role: 'Forest Land Management', type: 'Government' },
      { name: 'Gram Sabhas', role: 'Rights Verification', type: 'Community' },
      { name: 'Tribal Welfare Department', role: 'Coordination', type: 'Government' },
      { name: 'Demo Research Organisation', role: 'Documentation & Analysis', type: 'Institutional' },
    ],

    timeline: [
      { year: '2020', event: 'Needs Assessment', description: 'Assessment of forest rights recognition gaps in the district.' },
      { year: '2021 Q2', event: 'Awareness Programme', description: 'Village-level awareness campaign launched.' },
      { year: '2022 Q1', event: 'Claims Drive', description: 'Organised mass claim filing with administrative support.' },
      { year: '2022 Q3', event: 'Verification', description: 'Gram sabha verification meetings conducted.' },
      { year: '2023', event: 'Titles Issued', description: 'First batch of individual and community titles issued.' },
    ],

    relatedDatasets: ['land-ownership', 'land-records'],
    relatedPolicies: [
      { name: 'Forest Rights Act 2006', description: 'Recognition of Forest Rights for tribal and forest-dwelling communities', link: '/policies' },
    ],

    sources: [
      { title: 'Demo Reference – Community Forest Rights Study', org: 'Demo Institutional Reference', year: 2022, type: 'Demo Reference', status: 'Demo / Not Verified', link: null },
    ],
  },

  // ── CS-003 ──────────────────────────────────────────────────────────────────
  {
    id: 'CS-003',
    title: 'Urban Land Use Planning and Unauthorised Construction – Pune Fringe Areas',
    state: 'Maharashtra',
    district: 'Pune',
    location: 'Peri-urban fringe, Pune District',
    landType: 'Urban Land',
    problemCategory: 'Urban Land Management',
    caseStudyType: 'Urban Land Governance',
    status: 'Demo',
    evidenceLevel: 'Demo / Prototype',
    year: 2023,
    isDemoData: true,
    shortDescription:
      'A demonstration case exploring the challenges of managing land-use transitions in peri-urban areas of Pune where agricultural land is rapidly converting to urban and industrial uses.',
    tags: ['Urban Expansion', 'Land Use Planning', 'Maharashtra', 'Peri-urban', 'GIS'],

    location_detail: {
      state: 'Maharashtra',
      district: 'Pune',
      taluk: 'Haveli Taluk (demo area)',
      village: 'Peri-urban fringe villages (demo)',
      coordinates: { lat: 18.5204, lng: 73.8567 },
      geographicCoverage: 'Selected peri-urban villages on Pune urban fringe',
    },

    problem: {
      summary: "Rapid urban expansion in Pune's fringe areas is converting agricultural land to built-up uses without adequate planning, resulting in infrastructure deficits and loss of productive farmland.",
      affected: 'Farmers, peri-urban residents, Pune Metropolitan Authority, infrastructure agencies.',
      location: 'Haveli Taluk fringe areas, Pune District',
      importance: 'Unplanned urbanisation leads to inadequate water, sanitation, and transport infrastructure and creates long-term urban management challenges.',
      challenges: [
        'Weak enforcement of land-use conversion rules in fringe areas',
        'Multiple overlapping jurisdictions (gram panchayat, PMRDA, revenue dept)',
        'Limited real-time land-use monitoring',
        'Land records not updated to reflect actual use-change',
      ],
    },

    background: {
      regional: "Pune is one of India's fastest-growing metropolitan regions. The urban fringe experiences intense development pressure from IT parks, residential projects, and industrial corridors.",
      landCharacteristics: 'Predominantly agricultural land transitioning to mixed urban use.',
      historical: "Pune's planned areas are governed by PMRDA; fringe villages fall under different regulatory regimes, creating governance gaps.",
      administrative: 'District Collector, Pune Metropolitan Region Development Authority (PMRDA), Gram Panchayats, Revenue Department.',
      socioEconomic: 'High land values attract speculative investment. Original farming communities face land value increases but also livelihood disruption.',
      existingPractices: 'Land use plans exist but enforcement in fringe areas is limited. Development permission systems are under-resourced.',
      whyImportant: 'Planned land-use transition is critical to ensure that urban growth is sustainable and equitable.',
    },

    evidence: [
      { type: 'Satellite Imagery', source: 'NRSC / Bhuvan (Demo Reference)', year: 2022, coverage: 'Pune fringe – demo area', description: 'Multi-year land cover change analysis showing conversion from agricultural to built-up.', verificationStatus: 'Demo / Sample' },
      { type: 'Administrative Records', source: 'Pune Revenue Office (Demo)', year: 2022, coverage: 'Selected villages', description: 'Sample mutation and conversion permission records.', verificationStatus: 'Demo / Sample' },
      { type: 'Statistical Data', source: 'Maharashtra Census (Demo Reference)', year: 2021, coverage: 'District', description: 'Population growth trends used to estimate urbanisation pressure.', verificationStatus: 'Demo / Sample' },
    ],

    gisInfo: {
      available: true,
      isDemo: true,
      center: [18.5204, 73.8567],
      zoom: 11,
      note: 'DEMO MAP – Sample GIS data for demonstration. Does not represent verified PMRDA or Revenue Department data.',
      layers: ['District Boundary', 'Urban Expansion Zone', 'Agricultural Areas', 'Infrastructure', 'Unauthorised Constructions (Demo)'],
    },

    analysis: {
      summary: 'Demo satellite analysis suggests significant agricultural land conversion in fringe taluks over a 5-year period.',
      findings: [
        'Demo analysis: ~12% of agricultural land in sampled fringe villages converted to built-up in 5 years.',
        'Conversion concentrated along major road corridors.',
        'Only a small fraction of conversions had formal planning permissions (demo estimate).',
      ],
      dataGaps: ['Actual conversion approval data unavailable', 'Enforcement action data not included in demo'],
      charts: [
        { type: 'bar', title: 'Land Cover Change 2018–2023 (Demo %)', data: [{ label: 'Agricultural', value: -12 }, { label: 'Built-up', value: 9 }, { label: 'Vacant/Open', value: 3 }] },
        { type: 'donut', title: 'Conversion Permission Status (Demo)', data: [{ label: 'Formal Permission', value: 22, color: '#10b981' }, { label: 'Pending', value: 31, color: '#f59e0b' }, { label: 'No Permission', value: 47, color: '#ef4444' }] },
      ],
    },

    interventions: [
      { name: 'Real-time Land Use Monitoring (Demo)', stakeholder: 'PMRDA & NRSC (Demo)', period: '2023', description: 'Pilot satellite-based monitoring to detect unauthorised construction in fringe areas.', status: 'Demo – Pilot' },
      { name: 'Land Records Synchronisation', stakeholder: 'Revenue Department (Demo)', period: '2022–2023', description: 'Effort to update land-use records to reflect actual ground conditions.', status: 'Demo – In Progress' },
    ],

    outcomes: [
      { indicator: 'Area Monitored', value: '480 ha (Demo)', icon: '🗺️', color: 'blue' },
      { indicator: 'Violations Detected', value: '64 (Demo)', icon: '⚠️', color: 'orange' },
      { indicator: 'Mutations Updated', value: '210 (Demo)', icon: '📋', color: 'green' },
      { indicator: 'Villages Covered', value: '9 (Demo)', icon: '🏘️', color: 'purple' },
    ],

    lessonsLearned: [
      { category: 'What Worked', text: 'Satellite change-detection enabled rapid identification of conversion hotspots.' },
      { category: 'Challenge', text: 'Jurisdictional overlaps between multiple agencies slowed enforcement response.' },
      { category: 'Technology Lesson', text: 'Near-real-time monitoring requires strong backend data integration with land records.' },
      { category: 'Improvement', text: 'A single integrated land-use dashboard for all fringe-area agencies would significantly improve coordination.' },
    ],

    stakeholders: [
      { name: 'Pune Metropolitan Region Development Authority', role: 'Planning Authority', type: 'Government' },
      { name: 'Maharashtra Revenue Department', role: 'Land Records', type: 'Government' },
      { name: 'Gram Panchayats (Fringe)', role: 'Local Governance', type: 'Government' },
      { name: 'NRSC (Demo Reference)', role: 'Remote Sensing Support', type: 'Institutional' },
    ],

    timeline: [
      { year: '2018', event: 'Baseline Mapping', description: 'Baseline land-use map prepared for fringe areas.' },
      { year: '2021', event: 'Problem Documented', description: 'Large-scale unauthorised construction documented through field surveys.' },
      { year: '2022', event: 'Monitoring Pilot', description: 'Satellite monitoring pilot initiated.' },
      { year: '2023', event: 'Interventions', description: 'Records synchronisation and enforcement actions initiated.' },
    ],

    relatedDatasets: ['land-use', 'state-wise'],
    relatedPolicies: [
      { name: 'Maharashtra Regional and Town Planning Act', description: 'Governs land use planning and development permissions', link: '/policies' },
    ],

    sources: [
      { title: 'Demo Reference – Urban Fringe Land Use Study', org: 'Demo Institutional Reference', year: 2023, type: 'Demo Reference', status: 'Demo / Not Verified', link: null },
    ],
  },

  // ── CS-004 ──────────────────────────────────────────────────────────────────
  {
    id: 'CS-004',
    title: 'GIS-Based Cadastral Mapping for Agricultural Land, Nalgonda District',
    state: 'Telangana',
    district: 'Nalgonda',
    location: 'Nalgonda District, Telangana',
    landType: 'Agricultural Land',
    problemCategory: 'Mapping & GIS',
    caseStudyType: 'GIS & Mapping',
    status: 'Demo',
    evidenceLevel: 'Demo / Prototype',
    year: 2021,
    isDemoData: true,
    shortDescription:
      'A demonstration case showing how GIS-based cadastral re-survey can resolve boundary disputes and improve the accuracy of agricultural land records in a delta district.',
    tags: ['GIS', 'Cadastral Survey', 'Agricultural', 'Telangana', 'Dharani'],

    location_detail: {
      state: 'Telangana',
      district: 'Nalgonda',
      taluk: 'Demonstration Mandal',
      village: 'Selected mandals (demo)',
      coordinates: { lat: 17.0575, lng: 79.2661 },
      geographicCoverage: 'Selected mandals across the district',
    },

    problem: {
      summary: 'Outdated cadastral maps and measurement discrepancies were causing persistent boundary disputes between agricultural landholders.',
      affected: 'Agricultural landholders, revenue officials, courts handling land disputes.',
      location: 'Nalgonda District, Telangana',
      importance: 'Inaccurate cadastral records directly affect agricultural loan eligibility, crop insurance, and government subsidy delivery.',
      challenges: [
        'Survey maps were decades old with no systematic update',
        'Large discrepancies between ground measurements and registered area',
        'High volume of boundary dispute cases pending in revenue courts',
        'Limited technical capacity in revenue survey department',
      ],
    },

    background: {
      regional: 'Nalgonda is a major agricultural district in Telangana with predominantly rainfed agriculture. Land fragmentation is high.',
      landCharacteristics: 'Fragmented agricultural holdings, canal irrigation areas, and dryland farms.',
      historical: 'Original cadastral surveys date to early 20th century. Subdivision and inheritance over generations created extreme fragmentation without matching record updates.',
      administrative: 'Revenue administration under Mandal Revenue Officers; survey under Survey, Settlements and Land Records Department.',
      socioEconomic: 'Farming communities rely on accurate land documents for loans, schemes, and dispute resolution.',
      existingPractices: 'Manual chain surveys for boundary resolution. Dharani portal introduced for property registration but cadastral data accuracy remains an issue.',
      whyImportant: 'Accurate cadastral records are foundational for effective land governance and agricultural support.',
    },

    evidence: [
      { type: 'Survey Data', source: 'Telangana Survey Dept (Demo Reference)', year: 2021, coverage: 'Sampled mandals', description: 'Demo resurvey data for selected mandals showing measurement discrepancies.', verificationStatus: 'Demo / Sample' },
      { type: 'GIS Dataset', source: 'Bhuvan / NRSC (Demo)', year: 2020, coverage: 'District', description: 'Cadastral boundary layer for GIS overlay analysis.', verificationStatus: 'Demo / Sample' },
      { type: 'Administrative Records', source: 'Revenue Disputes Register (Demo)', year: 2021, coverage: 'District', description: 'Number and nature of pending boundary dispute cases.', verificationStatus: 'Demo / Sample' },
    ],

    gisInfo: {
      available: true,
      isDemo: true,
      center: [17.0575, 79.2661],
      zoom: 10,
      note: 'DEMO MAP – Sample GIS representation. Does not represent verified cadastral survey data.',
      layers: ['District Boundary', 'Agricultural Parcels (Demo)', 'Survey Discrepancy Zones', 'Irrigation Channels'],
    },

    analysis: {
      summary: 'Demo resurvey data indicates significant area discrepancies in highly fragmented holdings.',
      findings: [
        '~28% of resurveyed parcels showed area discrepancies > 10% versus registered area (demo figure).',
        'Boundary disputes concentrated along irrigation channel margins.',
        'Discrepancies larger in older settlement areas with more inheritance subdivisions.',
      ],
      dataGaps: ['Full district resurvey data not available in demo', 'Dispute resolution outcomes not tracked'],
      charts: [
        { type: 'bar', title: 'Resurvey Discrepancy by Category (Demo)', data: [{ label: '<5%', value: 42 }, { label: '5–10%', value: 30 }, { label: '10–20%', value: 18 }, { label: '>20%', value: 10 }] },
        { type: 'donut', title: 'Dispute Categories (Demo)', data: [{ label: 'Boundary', value: 55, color: '#ef4444' }, { label: 'Area Mismatch', value: 28, color: '#f97316' }, { label: 'Ownership', value: 17, color: '#6366f1' }] },
      ],
    },

    interventions: [
      { name: 'GIS-Based Resurvey Pilot', stakeholder: 'Survey Dept & NIC (Demo)', period: '2020–2021', description: 'Use of GPS equipment and GIS software for cadastral resurvey in selected mandals.', status: 'Demo – Completed' },
      { name: 'Dharani Portal Data Update', stakeholder: 'Revenue Department, Telangana (Demo)', period: '2021–2022', description: 'Updating Dharani portal records with resurveyed measurements.', status: 'Demo – Ongoing' },
    ],

    outcomes: [
      { indicator: 'Parcels Re-surveyed', value: '3,200 (Demo)', icon: '📐', color: 'blue' },
      { indicator: 'Disputes Resolved', value: '180 (Demo)', icon: '✅', color: 'green' },
      { indicator: 'Area Corrected', value: '1,400 ha (Demo)', icon: '🌾', color: 'orange' },
      { indicator: 'Mandals Covered', value: '4 (Demo)', icon: '📍', color: 'purple' },
    ],

    lessonsLearned: [
      { category: 'What Worked', text: 'GPS-based resurvey was significantly faster and more accurate than chain survey.' },
      { category: 'Challenge', text: 'Stakeholder resistance when resurvey outcomes differed from claimed areas.' },
      { category: 'Data Lesson', text: 'Integrating resurvey results into Dharani portal required additional data transformation.' },
      { category: 'Improvement', text: 'Continuous update mechanism needed; one-time resurvey benefits erode without maintenance.' },
    ],

    stakeholders: [
      { name: 'Survey, Settlements and Land Records Dept, Telangana', role: 'Survey Authority', type: 'Government' },
      { name: 'Revenue Department, Telangana', role: 'Records Management', type: 'Government' },
      { name: 'NIC Telangana (Demo)', role: 'Technology Support', type: 'Institutional' },
      { name: 'Agricultural Landholders', role: 'Primary Beneficiary', type: 'Community' },
    ],

    timeline: [
      { year: '2019', event: 'Problem Identification', description: 'High dispute caseload prompts review of cadastral accuracy.' },
      { year: '2020', event: 'Pilot Design', description: 'GIS resurvey methodology designed and piloted in one mandal.' },
      { year: '2021', event: 'Resurvey Drive', description: 'Full pilot resurvey across 4 mandals completed.' },
      { year: '2022', event: 'Data Integration', description: 'Resurveyed data integrated into Dharani portal.' },
    ],

    relatedDatasets: ['land-records', 'land-use'],
    relatedPolicies: [
      { name: 'Dharani Portal, Telangana', description: 'Integrated land records and registration portal', link: '/policies' },
    ],

    sources: [
      { title: 'Demo Reference – Cadastral Resurvey Study', org: 'Demo Institutional Reference', year: 2021, type: 'Demo Reference', status: 'Demo / Not Verified', link: null },
    ],
  },

  // ── CS-005 ──────────────────────────────────────────────────────────────────
  {
    id: 'CS-005',
    title: 'Participatory Rural Land Titling Programme – Uttarakhand Hills',
    state: 'Uttarakhand',
    district: 'Pauri Garhwal',
    location: 'Pauri Garhwal District, Uttarakhand',
    landType: 'Rural Land',
    problemCategory: 'Land Titling',
    caseStudyType: 'Rural Land Governance',
    status: 'Demo',
    evidenceLevel: 'Demo / Prototype',
    year: 2024,
    isDemoData: true,
    shortDescription:
      'A demonstration case on how participatory land titling approaches can address complex, informal land holdings in hill districts of Uttarakhand.',
    tags: ['Land Titling', 'Hill Areas', 'Rural', 'Uttarakhand', 'Participatory'],

    location_detail: {
      state: 'Uttarakhand',
      district: 'Pauri Garhwal',
      taluk: 'Demonstration Block, Pauri',
      village: 'Selected hill villages (demo)',
      coordinates: { lat: 29.7977, lng: 79.0203 },
      geographicCoverage: 'Selected village clusters in hill zones',
    },

    problem: {
      summary: 'Hill villages in Pauri Garhwal have a high proportion of informal land holdings, particularly among women and elderly residents whose titles were never formally registered.',
      affected: 'Women landholders, elderly residents, migrant-origin households, returning migrants.',
      location: 'Pauri Garhwal hill villages',
      importance: 'Without formal titles, residents cannot access crop insurance, agricultural schemes, or use land as loan collateral.',
      challenges: [
        'Complex terrain makes physical survey difficult',
        'Large proportion of absentee landholders (migration to cities)',
        "Women's land rights rarely formalised despite customary recognition",
        'Revenue records not updated for decades in many villages',
      ],
    },

    background: {
      regional: 'Pauri Garhwal is a remote hill district with high out-migration. Villages are often managed predominantly by women and elderly residents.',
      landCharacteristics: 'Fragmented terraced agricultural fields, pastures, community forests, and mixed-use hill land.',
      historical: 'Land records in hill areas are among the oldest and least updated in Uttarakhand. Traditional practices around inheritance often did not result in formal mutation.',
      administrative: 'Revenue administration under Patwaris and Tehsildars; difficult terrain limits administrative reach.',
      socioEconomic: 'High dependence on remittances; subsistence agriculture; tourism growing as economic activity.',
      existingPractices: 'Community-level recognition of land rights exists but not linked to formal records.',
      whyImportant: "Formalising hill land rights is critical for food security, women's economic empowerment, and enabling sustainable agriculture investments.",
    },

    evidence: [
      { type: 'Survey Data', source: 'Demo Field Survey, Hill Villages', year: 2023, coverage: '8 demo villages', description: 'Sample household survey on land rights formalisation status.', verificationStatus: 'Demo / Sample' },
      { type: 'Administrative Records', source: 'Pauri Revenue Office (Demo)', year: 2023, coverage: 'District', description: 'Sample mutation records showing proportion of informally held land.', verificationStatus: 'Demo / Sample' },
    ],

    gisInfo: {
      available: true,
      isDemo: true,
      center: [29.7977, 79.0203],
      zoom: 11,
      note: 'DEMO MAP – Sample representation of hill district terrain.',
      layers: ['District Boundary', 'Village Settlements', 'Agricultural Terraces (Demo)', 'Forest Land'],
    },

    analysis: {
      summary: 'Demo survey data suggests significant under-registration of land rights, particularly for women-headed households.',
      findings: [
        '~52% of surveyed women landholders lacked formal title (demo figure).',
        'Mutation backlog estimated at 5+ years in several demo villages.',
        'Access to formal credit significantly lower for informally-held plots.',
      ],
      dataGaps: ['Comprehensive district-level titling data unavailable', 'Gender-disaggregated mutation data not fully available'],
      charts: [
        { type: 'donut', title: 'Title Formalisation Status (Demo)', data: [{ label: 'Formally Titled', value: 48, color: '#10b981' }, { label: 'Informal / Undocumented', value: 52, color: '#ef4444' }] },
        { type: 'bar', title: 'Women Title Holders by Village Category (Demo %)', data: [{ label: 'Accessible', value: 38 }, { label: 'Semi-remote', value: 22 }, { label: 'Remote', value: 11 }] },
      ],
    },

    interventions: [
      { name: 'Participatory Land Mapping', stakeholder: 'Revenue Dept & Village Committees (Demo)', period: '2023', description: 'Community-led identification and mapping of informal holdings.', status: 'Demo – Pilot' },
      { name: 'Women Land Rights Drive', stakeholder: 'District Administration & SHGs (Demo)', period: '2023–2024', description: "Targeted campaign to formalise women's land titles through expedited mutation.", status: 'Demo – Active' },
    ],

    outcomes: [
      { indicator: 'Villages Covered', value: '8 (Demo)', icon: '🏘️', color: 'blue' },
      { indicator: 'Titles Formalised', value: '340 (Demo)', icon: '📋', color: 'green' },
      { indicator: 'Women Titles', value: '180 (Demo)', icon: '👩‍🌾', color: 'purple' },
      { indicator: 'Mutation Backlog Cleared', value: '60% (Demo)', icon: '✅', color: 'orange' },
    ],

    lessonsLearned: [
      { category: 'What Worked', text: 'Community involvement in mapping was critical for acceptance of outcomes.' },
      { category: 'Challenge', text: 'Reaching absentee landholders for consent required significant effort.' },
      { category: 'Gender Lesson', text: 'Targeted women-focused titling drives were more effective than general programmes.' },
      { category: 'Technology Lesson', text: 'Mobile-based data collection worked well even in areas with limited connectivity.' },
      { category: 'Improvement', text: 'A continuous, rather than one-off, titling mechanism would prevent future backlog accumulation.' },
    ],

    stakeholders: [
      { name: 'Uttarakhand Revenue Department', role: 'Records & Titling Authority', type: 'Government' },
      { name: 'District Administration, Pauri Garhwal', role: 'Implementation', type: 'Government' },
      { name: 'Village Land Committees (Demo)', role: 'Community Verification', type: 'Community' },
      { name: 'Self Help Groups (SHGs)', role: "Women's Rights Facilitation", type: 'Community' },
    ],

    timeline: [
      { year: '2022', event: 'Assessment', description: 'Assessment of land titling gaps in hill villages.' },
      { year: '2023 Q1', event: 'Community Engagement', description: 'Village meetings to explain process and gather data.' },
      { year: '2023 Q3', event: 'Participatory Mapping', description: 'Mapping of informal holdings with village participation.' },
      { year: '2024', event: 'Titling Drive', description: 'Expedited mutation and titling drive launched.' },
    ],

    relatedDatasets: ['land-records', 'land-ownership'],
    relatedPolicies: [
      { name: 'SVAMITVA Scheme', description: 'Survey of Villages and Mapping with Improvised Technology in Village Areas', link: '/policies' },
    ],

    sources: [
      { title: 'Demo Reference – Hill Land Titling Study', org: 'Demo Institutional Reference', year: 2024, type: 'Demo Reference', status: 'Demo / Not Verified', link: null },
    ],
  },

  // ── CS-006 ──────────────────────────────────────────────────────────────────
  {
    id: 'CS-006',
    title: 'Integrated Land Governance Dashboard – Bengaluru Rural District',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    location: 'Bengaluru Rural District, Karnataka',
    landType: 'Mixed Land Use',
    problemCategory: 'Land Administration',
    caseStudyType: 'Digital Transformation',
    status: 'Demo',
    evidenceLevel: 'Demo / Prototype',
    year: 2024,
    isDemoData: true,
    shortDescription:
      'A demonstration of how an integrated digital land governance dashboard combining multiple data sources can improve administrative decision-making in a rapidly transforming peri-urban district.',
    tags: ['Digital Governance', 'Dashboard', 'Karnataka', 'Land Administration', 'Integration'],

    location_detail: {
      state: 'Karnataka',
      district: 'Bengaluru Rural',
      taluk: 'Multiple taluks (demo)',
      village: 'Selected demonstration villages',
      coordinates: { lat: 13.0827, lng: 77.5877 },
      geographicCoverage: 'Entire district – multi-taluk',
    },

    problem: {
      summary: 'Land administration in Bengaluru Rural District is fragmented across multiple departments with no integrated view, leading to delays, duplication, and poor policy decisions.',
      affected: 'Revenue officials, planning authorities, landowners, developers, farmers.',
      location: 'Bengaluru Rural District',
      importance: 'Integrated land data is essential for coordinated land use management in a district experiencing rapid transformation from rural to urban character.',
      challenges: [
        'Land records, survey maps, mutation data, and use permissions maintained in silos',
        'No single dashboard for cross-departmental monitoring',
        'Delayed mutation processing impacting land market transparency',
        'Rapid land-use change not captured in official records',
      ],
    },

    background: {
      regional: 'Bengaluru Rural District borders Bengaluru Urban and is experiencing rapid land-use transition. Agriculture, IT infrastructure, and residential development compete for land.',
      landCharacteristics: 'Mixed — transitioning from predominantly agricultural to mixed urban-rural use.',
      historical: 'Revenue records managed through Bhoomi since early 2000s, but spatial and administrative data remain fragmented.',
      administrative: 'District Collector, Tahasildars, BDA, BMRDA, Gram Panchayats, Revenue Department.',
      socioEconomic: 'Rising land values, speculative pressure, and dispossession risk for original farming communities.',
      existingPractices: 'Bhoomi for records; Kaveri for registration; survey data in SSLR; planning data in BMRDA — no integration.',
      whyImportant: 'An integrated view enables proactive governance rather than reactive problem management.',
    },

    evidence: [
      { type: 'Administrative Records', source: 'Multiple Karnataka Depts (Demo)', year: 2023, coverage: 'District', description: 'Sample data from Bhoomi, Kaveri, and SSLR for integration demonstration.', verificationStatus: 'Demo / Sample' },
      { type: 'GIS Dataset', source: 'Karnataka SSLR (Demo)', year: 2023, coverage: 'District', description: 'Sample cadastral and land-use spatial data.', verificationStatus: 'Demo / Sample' },
      { type: 'Statistical Data', source: 'Revenue Analytics Demo', year: 2023, coverage: 'District-level', description: 'Sample mutation, registration, and dispute statistics.', verificationStatus: 'Demo / Sample' },
    ],

    gisInfo: {
      available: true,
      isDemo: true,
      center: [13.0827, 77.5877],
      zoom: 10,
      note: 'DEMO MAP – Sample integrated GIS view for demonstration. Not verified official data.',
      layers: ['District Boundary', 'Land Use Zones', 'Mutation Hotspots (Demo)', 'Urban Growth Corridor', 'Agricultural Land'],
    },

    analysis: {
      summary: 'Demo data integration exercise reveals major inconsistencies between records held by different departments for the same land parcels.',
      findings: [
        '~18% of sample parcels showed different ownership data across Bhoomi and Kaveri (demo).',
        'Mutation backlog highest in taluks bordering Bengaluru Urban.',
        'Land-use change faster than record update cycle in most taluks.',
      ],
      dataGaps: ['Real-time data feeds not yet established in demo', 'Historical transaction data partially unavailable'],
      charts: [
        { type: 'bar', title: 'Data Inconsistency by Department (Demo %)', data: [{ label: 'Bhoomi vs Kaveri', value: 18 }, { label: 'SSLR vs Bhoomi', value: 22 }, { label: 'Planning vs Revenue', value: 34 }] },
        { type: 'donut', title: 'Mutation Status Distribution (Demo)', data: [{ label: 'Up to date', value: 44, color: '#10b981' }, { label: 'Pending < 6mo', value: 31, color: '#f59e0b' }, { label: 'Backlog > 6mo', value: 25, color: '#ef4444' }] },
      ],
    },

    interventions: [
      { name: 'Integrated Land Dashboard (Demo)', stakeholder: 'District IT Cell & Revenue Dept (Demo)', period: '2023–2024', description: 'Development of a unified dashboard pulling data from Bhoomi, Kaveri, and SSLR.', status: 'Demo – Development' },
      { name: 'Data Reconciliation Exercise', stakeholder: 'Revenue & Registration Dept (Demo)', period: '2024', description: 'Reconciliation of conflicting records between departments.', status: 'Demo – Pilot' },
    ],

    outcomes: [
      { indicator: 'Depts Integrated', value: '4 (Demo)', icon: '🔗', color: 'blue' },
      { indicator: 'Records Reconciled', value: '5,800 (Demo)', icon: '📋', color: 'green' },
      { indicator: 'Dashboard Users', value: '120 (Demo)', icon: '💻', color: 'purple' },
      { indicator: 'Decision Turnaround', value: '−35% (Demo)', icon: '⏱️', color: 'orange' },
    ],

    lessonsLearned: [
      { category: 'What Worked', text: 'A common API layer for data access significantly simplified integration.' },
      { category: 'Challenge', text: 'Data standardisation across departments required extensive negotiation and technical mapping.' },
      { category: 'Institutional Lesson', text: 'Senior leadership buy-in across all departments was essential for progress.' },
      { category: 'Technology Lesson', text: 'Real-time integration is more effective than batch synchronisation for land records.' },
      { category: 'Improvement', text: 'A data governance framework defining ownership and update responsibilities is needed before scaling.' },
    ],

    stakeholders: [
      { name: 'District Collectorate, Bengaluru Rural', role: 'Champion & Coordinator', type: 'Government' },
      { name: 'Revenue Department, Karnataka', role: 'Data Owner – Bhoomi', type: 'Government' },
      { name: 'Registration Department, Karnataka', role: 'Data Owner – Kaveri', type: 'Government' },
      { name: 'SSLR Karnataka', role: 'Spatial Data', type: 'Government' },
      { name: 'NIC Karnataka (Demo)', role: 'Technology Implementation', type: 'Institutional' },
    ],

    timeline: [
      { year: '2022', event: 'Feasibility Study', description: 'Assessment of data sources and integration requirements.' },
      { year: '2023 Q1', event: 'Architecture Design', description: 'Dashboard architecture and data model designed.' },
      { year: '2023 Q3', event: 'Prototype', description: 'First dashboard prototype demonstrated to stakeholders.' },
      { year: '2024 Q1', event: 'Pilot Deployment', description: 'Pilot deployment in selected taluks.' },
      { year: '2024 Q3', event: 'Evaluation', description: 'User feedback and system performance evaluation.' },
    ],

    relatedDatasets: ['state-wise', 'land-records', 'land-use', 'land-ownership'],
    relatedPolicies: [
      { name: 'Digital India Programme', description: 'National digital governance and data integration framework', link: '/policies' },
      { name: 'DILRMP', description: 'Digital India Land Records Modernisation Programme', link: '/policies' },
    ],

    sources: [
      { title: 'Demo Reference – Integrated Land Governance Dashboard', org: 'Demo Institutional Reference', year: 2024, type: 'Demo Reference', status: 'Demo / Not Verified', link: null },
    ],
  },
];

// ─── Helper lookups ───────────────────────────────────────────────────────────
export const getCaseStudy = (id) => CASE_STUDIES.find((cs) => cs.id === id) || null;

export const CS_SUMMARY_STATS = [
  { label: 'Total Case Studies', value: CASE_STUDIES.length, icon: '📚', color: 'blue' },
  { label: 'States Covered',     value: [...new Set(CASE_STUDIES.map((c) => c.state))].length, icon: '🗺️', color: 'green' },
  { label: 'Districts Covered',  value: [...new Set(CASE_STUDIES.map((c) => c.district))].length, icon: '📍', color: 'purple' },
  { label: 'Land Types',         value: [...new Set(CASE_STUDIES.map((c) => c.landType))].length, icon: '🌱', color: 'teal' },
  { label: 'Demo Studies',       value: CASE_STUDIES.filter((c) => c.isDemoData).length, icon: '🟡', color: 'orange' },
  { label: 'Verified Studies',   value: CASE_STUDIES.filter((c) => !c.isDemoData).length, icon: '✅', color: 'indigo' },
];
