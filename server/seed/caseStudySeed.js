/**
 * Case Study Rich Demo Seed Data
 * ALL DATA IS SAMPLE/DEMO – Not official government data.
 */

const CASE_STUDIES = [
  /* ═══════════════════════════════════════════════════════════════════════════
     1. URBAN EXPANSION — BENGALURU URBAN, KARNATAKA
  ═══════════════════════════════════════════════════════════════════════════ */
  {
    title: 'Urban Expansion and Agricultural Land Conversion – Bengaluru Metropolitan Region',
    slug: 'bengaluru-urban-expansion-agricultural-conversion',
    category: 'Urban Land Development',
    subCategory: 'Agricultural to Urban Conversion',
    location: {
      state: 'Karnataka', district: 'Bengaluru Urban', village: 'Multiple Villages',
      taluk: 'Bengaluru South', pincode: '560001',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      bounds: { south: 12.78, west: 77.35, north: 13.18, east: 77.82 },
    },
    studyPeriod: { startYear: 2010, endYear: 2024 },
    problem: 'The Bengaluru Metropolitan Region has experienced one of India\'s fastest urban expansions, converting over 48,000 hectares of prime agricultural land and 78% of historical lake area into built-up zones between 2010 and 2024. Rapid IT sector growth, in-migration of over 3 million people, and inadequate spatial planning have created severe land-use conflicts, groundwater depletion, and urban heat island effects.',
    background: 'Bengaluru\'s transformation from a "Garden City" to a technology hub has fundamentally altered its land-use fabric. The city\'s BBMP jurisdictional area expanded three times between 2006 and 2020, absorbing 110 surrounding villages. This rapid expansion happened with minimal cadastral updating, creating overlapping land claims, loss of periurban agricultural livelihoods, and ecological degradation. The 2024 Bengaluru floods demonstrated the consequences of systematic wetland encroachment.',
    intervention: 'The Karnataka government initiated the Bengaluru Metropolitan Land Use Management Framework (BMLUMF) in 2022. Key interventions included: satellite-based land-use monitoring through KSRSAC, mandatory Environmental Impact Assessment for developments over 5,000 sqm, restoration of 80 lakes under the Bruhat Bengaluru Palike lake rejuvenation scheme, and digital integration of BBMP, BDA, and Revenue Department land records through the Karnataka Land Information Management System.',
    methodology: 'Multi-temporal satellite imagery analysis (Landsat 8, Sentinel-2) from 2010-2024; field validation surveys across 200 sample sites; household surveys of 500 displaced agricultural families; GIS-based change detection; stakeholder interviews with urban planners, farmers, and resident welfare associations.',
    results: 'Urban built-up area increased from 650 km² (2010) to 1,034 km² (2024) – a 59% increase. Agricultural land declined by 38%. 48 lakes were partly restored. Digital land records covered 89% of properties by 2024. New Comprehensive Development Plan (2031) designated 28 green corridors.',
    lessonsLearned: 'Rapid urban growth requires proactive land-use planning rather than reactive regulation. Digital land records are the foundation of dispute resolution. Community participation in lake restoration yields better outcomes. Metropolitan governance needs unified land data systems.',
    conclusion: 'Bengaluru\'s case demonstrates that technology-led urbanization without proportionate governance investment creates irreversible land-use changes. The BMLUMF provides a replicable framework for other Tier-1 cities but requires sustained political will and inter-agency coordination.',

    indicators: {
      totalAreaHa: 226300,
      agriculturalPct: 19.2,
      urbanPct: 45.8,
      forestPct: 6.3,
      waterPct: 3.7,
      wastelandPct: 2.8,
      urbanizationRate: 3.2,
      climateVulnerability: 'moderate',
      climateVulnerabilityScore: 52,
      floodRisk: 64,
      droughtRisk: 38,
      landDegradation: 42,
      activeLandDisputes: 1876,
      resolvedDisputes: 980,
      infrastructureProjects: 28,
      population: 14765000,
      populationDensity: 4382,
      literacyRate: 88.5,
      irrigatedAreaPct: 22.0,
      soilHealth: 'moderate',
    },

    landUseTrend: [
      { year: 2010, agricultural: 32.8, urban: 28.8, forest: 9.2, water: 5.8, wasteland: 3.2, other: 20.2 },
      { year: 2012, agricultural: 30.1, urban: 31.4, forest: 8.9, water: 5.2, wasteland: 3.0, other: 21.4 },
      { year: 2014, agricultural: 27.6, urban: 34.2, forest: 8.4, water: 4.8, wasteland: 2.9, other: 22.1 },
      { year: 2016, agricultural: 25.0, urban: 37.0, forest: 7.9, water: 4.4, wasteland: 2.8, other: 22.9 },
      { year: 2018, agricultural: 23.1, urban: 39.8, forest: 7.4, water: 4.1, wasteland: 2.8, other: 22.8 },
      { year: 2020, agricultural: 21.4, urban: 42.2, forest: 7.0, water: 3.9, wasteland: 2.8, other: 22.7 },
      { year: 2022, agricultural: 20.1, urban: 44.1, forest: 6.6, water: 3.8, wasteland: 2.8, other: 22.6 },
      { year: 2024, agricultural: 19.2, urban: 45.8, forest: 6.3, water: 3.7, wasteland: 2.8, other: 22.2 },
    ],

    timeline: [
      { year: 2010, title: 'Baseline Land Use Assessment', description: 'Agricultural land covers 32.8% of BMR area. 280 functional lakes recorded. 1.2 lakh farming families in periurban zones.', type: 'initial', landUseSnapshot: { agricultural: 32.8, urban: 28.8, forest: 9.2, water: 5.8, other: 23.4 } },
      { year: 2013, title: 'BBMP Expansion – 110 Villages Absorbed', description: 'BBMP jurisdiction expanded to include 110 surrounding villages, bringing 48,000 ha of peri-urban land under urban governance without corresponding land-use planning.', type: 'change' },
      { year: 2015, title: 'IT Corridor Expansion – North & South', description: 'Major IT parks developed along Outer Ring Road, Whitefield, and Electronic City corridors. Agricultural land conversion accelerated at 4.2% annually.', type: 'change' },
      { year: 2017, title: 'Karnataka Land Use Policy Revision', description: 'State government revised Zoning Regulations allowing residential conversion of agricultural land within 30 km of BBMP boundary. Triggered rapid conversion.', type: 'policy' },
      { year: 2019, title: 'Lake Encroachment Crisis', description: '78% of historical lakes encroached or converted. NGT intervenes with order for lake boundary demarcation and restoration.', type: 'event' },
      { year: 2022, title: 'BMLUMF & Digital Land Records Launch', description: 'Karnataka launches integrated land information system. 80 lakes designated for restoration. New Metropolitan Planning Authority constituted.', type: 'policy', landUseSnapshot: { agricultural: 20.1, urban: 44.1, forest: 6.6, water: 3.8, other: 25.4 } },
      { year: 2024, title: 'Current Status & CDP 2031 Adoption', description: 'Comprehensive Development Plan 2031 adopted with 28 green corridors and urban agriculture zones. Digital records cover 89% of properties.', type: 'current', landUseSnapshot: { agricultural: 19.2, urban: 45.8, forest: 6.3, water: 3.7, other: 25.0 } },
    ],

    impacts: {
      environmental: {
        description: 'Systematic loss of periurban agricultural land, wetlands, and green spaces has created urban heat islands with 2.8°C temperature differential between core and periphery. 48,000 ha of agricultural land converted. 120 of 280 historical lakes encroached.',
        forestLoss: 6800, forestGain: 420, waterBodyChange: -78, carbonEmissionChange: 340, biodiversityScore: 28,
      },
      economic: {
        description: 'Urban land values increased 12x since 2010, but agricultural income for displaced families declined by 65%. IT sector contributes ₹4.8 lakh crore to GDP but land acquisition costs displaced 45,000 farming families.',
        agriculturalProductivityChange: -65, landValueChange: 1200, infrastructureInvestmentCr: 28000, jobsCreated: 1800000, gdpContribution: 4800000,
      },
      social: {
        description: '45,000 agricultural families displaced from periurban villages. 1.2 lakh seasonal workers lost farm employment. Land disputes increased 340% over the study period. Access to open green space decreased from 18 sqm to 2.8 sqm per capita.',
        populationAffected: 145000, displacedFamilies: 45000, landDisputeChange: 340, livelihoodImpact: 'Severe – 45,000 families lost primary livelihood', accessToServicesChange: 45,
      },
      governance: {
        description: 'Fragmented land governance across BBMP, BDA, Revenue Department, and KIADB created coordination failures. Land mutation backlog exceeded 8 lakh records at peak. Digital integration has reduced processing time from 14 months to 45 days.',
        landRecordDigitizationPct: 89, policyImplementationScore: 58, adminChallenges: ['Fragmented agency jurisdiction', 'Land mutation backlog', 'Informal settlements on encroached land', 'Lake boundary disputes', 'Agricultural to NA conversion tracking'], disputeResolutionRate: 52,
      },
    },

    policies: [
      { name: 'Bengaluru Metropolitan Land Use Management Framework (BMLUMF)', year: 2022, department: 'Urban Development Department, GoK', objective: 'Regulate land use conversion, protect remaining agricultural areas and water bodies within BMR', keyProvisions: ['Mandatory EIA for developments > 5,000 sqm', 'Green belt protection zones', 'Lake buffer area of 30m no-development zone', 'Satellite monitoring of land use change quarterly'], implementationArea: 'Bengaluru Metropolitan Region (8,005 km²)', impactDescription: 'Slowed conversion rate from 4.2% to 2.1% annually since 2022', category: 'Urban Development' },
      { name: 'Karnataka Land Revenue (Amendment) Act', year: 2020, department: 'Revenue Department, GoK', objective: 'Streamline land mutation and protect agricultural land from unauthorized conversion', keyProvisions: ['Digitization of all land records', 'Online mutation application', 'Deemed mutation for residential conversions in designated zones', 'Agricultural land conversion restrictions'], implementationArea: 'Karnataka State', impactDescription: 'Reduced mutation processing time from 14 months to 45 days', category: 'Digital Governance' },
    ],

    research: [
      { title: 'Urban Sprawl and Green Space Loss in Bengaluru Metropolitan Area 2000-2024', authors: 'Dr. Ananya Krishnan, Dr. Prasad Rao', organization: 'IISc Bangalore', year: 2024, category: 'Urban Land Development', summary: 'Multi-temporal satellite analysis reveals 78% lake loss and 65% green space reduction, with 59% built-up area increase. Recommends green corridor framework.', source: 'Journal of Environmental Management' },
      { title: 'Periurban Agricultural Land Loss and Livelihood Impacts – Bengaluru Case', authors: 'Dr. Sunita Rao, Prof. K. Venkatesh', organization: 'ISEC Bangalore', year: 2023, category: 'Socio-Economic Analysis', summary: 'Household survey of 500 displaced farming families reveals 65% income reduction, poor compensation, inadequate rehabilitation, and limited alternative livelihood options.', source: 'Economic and Political Weekly' },
    ],

    challenges: [
      { title: 'Fragmented Land Governance', description: 'Seven agencies manage different aspects of land in BMR with no unified database or spatial coordination system.', severity: 'high' },
      { title: 'Rapid Peri-Urban Conversion', description: 'Agricultural land within 30 km of BBMP boundary converting at 2.1% annually – fastest in South India.', severity: 'high' },
      { title: 'Lake Encroachment Legacy', description: '120 of 280 historical lakes significantly encroached. Restoration requires legal battles and large-scale demolition.', severity: 'high' },
      { title: 'Urban Heat Island Effect', description: '2.8°C temperature differential between core and green periphery with increasing flood vulnerability.', severity: 'medium' },
      { title: 'Land Record Mutation Backlog', description: 'Despite digital systems, 2.1 lakh mutation requests still pending due to dispute complexity.', severity: 'medium' },
    ],

    insights: [
      'Urban built-up area has increased by 59% over 14 years, consuming 38% of the region\'s agricultural land.',
      'Lake area loss of 78% has critically impacted groundwater recharge and flood management capacity.',
      'Digital land records have reduced mutation processing time by 97% (from 14 months to 45 days).',
      'Climate vulnerability is moderate but rising, with flood risk elevated due to drainage network obstruction.',
      'Land dispute density is 8.3 per km², one of the highest in Karnataka – driven by conversion pressure.',
    ],

    recommendations: [
      { priority: 'immediate', action: 'Complete digital integration of BBMP, BDA, Revenue Department, and KIADB land databases', rationale: 'Eliminate duplicate records and conflicting claims that drive 40% of disputes', responsibleAgency: 'Karnataka Digital Economy Mission' },
      { priority: 'immediate', action: 'Enforce 30m lake buffer zones with GPS-marked boundary stones', rationale: 'Prevent further encroachment of 80 restored lakes', responsibleAgency: 'BBMP Lakes Department' },
      { priority: 'short_term', action: 'Designate 28 proposed green corridors under CDP 2031 as protected land use zones', rationale: 'Maintain ecological connectivity and reduce urban heat island effect', responsibleAgency: 'BDA Urban Planning' },
      { priority: 'short_term', action: 'Implement satellite-based land use monitoring with quarterly alerts to Deputy Commissioner', rationale: 'Early detection of unauthorized conversions before infrastructure investment', responsibleAgency: 'KSRSAC' },
      { priority: 'long_term', action: 'Create dedicated Metropolitan Land Governance Authority with unified jurisdiction', rationale: 'Resolve inter-agency coordination failures that are root cause of governance gaps', responsibleAgency: 'Urban Development Department, GoK' },
    ],

    landRecords: [
      { surveyNumber: 'KA-BLR-2024-001', ownerName: 'Ramu Gowda', guardianName: 'Late Siddappa Gowda', village: 'Hesaraghatta', taluk: 'Bengaluru North', district: 'Bengaluru Urban', state: 'Karnataka', areaHectares: 2.4, areaAcres: 5.93, landType: 'agricultural', landUseClass: 'Dry Land (Type II)', registrationNumber: 'RGN/BLR/2018/4521', khasraNumber: 'SY.No.148/2', khataNumber: 'ROR-BLR-44892', coordinates: { lat: 13.1340, lng: 77.4980 }, pincode: '562123', boundaryNorth: 'Survey No. 147', boundarySouth: 'Road', boundaryEast: 'Survey No. 149', boundaryWest: 'Canal' },
      { surveyNumber: 'KA-BLR-2024-002', ownerName: 'Lakshmi Devamma', guardianName: 'Rajanna', village: 'Yelahanka', taluk: 'Bengaluru North', district: 'Bengaluru Urban', state: 'Karnataka', areaHectares: 0.8, areaAcres: 1.98, landType: 'residential', landUseClass: 'Residential (Converted)', registrationNumber: 'RGN/BLR/2020/8834', khasraNumber: 'SY.No.22/1', khataNumber: 'ROR-BLR-12234', coordinates: { lat: 13.1007, lng: 77.5963 }, pincode: '560064', boundaryNorth: 'Residential Layout', boundarySouth: 'Survey No. 23', boundaryEast: 'Internal Road', boundaryWest: 'Survey No. 21' },
      { surveyNumber: 'KA-BLR-2024-003', ownerName: 'Karnataka Industrial Areas Dev Board', guardianName: 'N/A (Government)', village: 'Electronic City', taluk: 'Bengaluru South', district: 'Bengaluru Urban', state: 'Karnataka', areaHectares: 12.6, areaAcres: 31.13, landType: 'commercial', landUseClass: 'IT/ITES Special Economic Zone', registrationNumber: 'KIADB/EC/2012/001', khasraNumber: 'SY.No.88/A', khataNumber: 'KIADB-0001', coordinates: { lat: 12.8467, lng: 77.6615 }, pincode: '560100', boundaryNorth: 'Hosur Road', boundarySouth: 'Phase II', boundaryEast: 'Phase I', boundaryWest: 'NICE Road' },
    ],

    technologyUsed: ['Sentinel-2 Satellite Imagery', 'GIS Analysis', 'Drone Surveys', 'Digital Land Records', 'AI-based Change Detection'],
    stakeholders: ['BBMP', 'BDA', 'Karnataka Revenue Department', 'KIADB', 'KSRSAC', 'NGT', 'Residents Welfare Associations', 'Farming Communities'],
    fundingSource: 'World Bank Urban Development Grant + Karnataka State Budget',
    tags: ['urban expansion', 'agricultural land loss', 'Bengaluru', 'Karnataka', 'lake encroachment', 'GIS', 'land records', 'periurban'],
    status: 'published',
    impactScore: 88,
    climateRiskLevel: 'moderate',
    isDemoData: true,
  },

  /* ═══════════════════════════════════════════════════════════════════════════
     2. CLIMATE VULNERABILITY — BELAGAVI, KARNATAKA
  ═══════════════════════════════════════════════════════════════════════════ */
  {
    title: 'Climate Vulnerability and Agricultural Land Stress – Belagavi District, Karnataka',
    slug: 'belagavi-climate-vulnerability-agricultural-land',
    category: 'Climate Vulnerability',
    subCategory: 'Agricultural Drought & Land Degradation',
    location: {
      state: 'Karnataka', district: 'Belagavi', village: 'Multiple Taluks',
      taluk: 'Belagavi', pincode: '590001',
      coordinates: { lat: 15.8497, lng: 74.4977 },
      bounds: { south: 15.10, west: 74.00, north: 17.05, east: 75.20 },
    },
    studyPeriod: { startYear: 2015, endYear: 2024 },
    problem: 'Belagavi district faces compound climate stress with irregular rainfall (coefficient of variation 38%), recurrent droughts in 6 of 10 taluks, and soil degradation affecting 42% of agricultural land. Over 1.2 lakh hectares of sugarcane and jowar cultivation are at high risk of yield decline, threatening the livelihoods of 4.8 lakh farming families.',
    background: 'Belagavi is Karnataka\'s largest district by area with 13,415 km². Agriculture employs 65% of the workforce. The Krishna River basin\'s eastern portion passes through the district, but unequal water distribution and increasing drought frequency have created severe agricultural stress. Climate projections indicate 12-18% rainfall deficit by 2035.',
    intervention: 'Karnataka Climate-Resilient Agriculture Programme (KCRAP) launched in Belagavi in 2021 with five key components: drought-resistant variety promotion, micro-irrigation expansion, soil health card programme, land use diversification incentives, and digital crop insurance integration.',
    results: 'Micro-irrigation coverage increased from 12% to 24% of irrigated area. Drought-resistant variety adoption reached 38% of vulnerable farmland. Soil health cards issued to 2.4 lakh farmers. Crop insurance uptake increased from 18% to 52%. Land degradation in targeted areas reduced by 18%.',

    indicators: {
      totalAreaHa: 1341500,
      agriculturalPct: 53.1,
      urbanPct: 3.6,
      forestPct: 9.5,
      waterPct: 2.4,
      wastelandPct: 15.8,
      urbanizationRate: 0.7,
      climateVulnerability: 'high',
      climateVulnerabilityScore: 72,
      floodRisk: 52,
      droughtRisk: 74,
      landDegradation: 42,
      activeLandDisputes: 124,
      resolvedDisputes: 48,
      infrastructureProjects: 6,
      population: 4861200,
      populationDensity: 362,
      literacyRate: 75.1,
      irrigatedAreaPct: 24.0,
      soilHealth: 'moderate',
    },

    landUseTrend: [
      { year: 2015, agricultural: 56.2, urban: 2.8, forest: 10.2, water: 2.8, wasteland: 12.4, other: 15.6 },
      { year: 2017, agricultural: 55.4, urban: 3.0, forest: 10.0, water: 2.7, wasteland: 13.2, other: 15.7 },
      { year: 2019, agricultural: 54.6, urban: 3.2, forest: 9.8, water: 2.6, wasteland: 14.0, other: 15.8 },
      { year: 2021, agricultural: 53.8, urban: 3.4, forest: 9.7, water: 2.5, wasteland: 14.8, other: 15.8 },
      { year: 2023, agricultural: 53.2, urban: 3.5, forest: 9.6, water: 2.4, wasteland: 15.5, other: 15.8 },
      { year: 2024, agricultural: 53.1, urban: 3.6, forest: 9.5, water: 2.4, wasteland: 15.8, other: 15.6 },
    ],

    timeline: [
      { year: 2015, title: 'Drought Severity Assessment', description: 'Karnataka State Natural Disaster Management Authority classifies 6 of 10 Belagavi taluks as severely drought-prone. 42% of agricultural land shows soil degradation indicators.', type: 'initial' },
      { year: 2017, title: 'Krishnaraja Sagara Water Crisis', description: 'KRS reservoir drops to 18% capacity affecting irrigation channels in 3 Belagavi taluks. 28,000 ha of sugarcane cultivation fails.', type: 'event' },
      { year: 2019, title: 'Soil Health Card Programme Launch', description: 'Karnataka launches district-wide soil health card initiative. 78% of samples show micronutrient deficiency.', type: 'policy' },
      { year: 2021, title: 'KCRAP Programme Launched', description: 'Karnataka Climate-Resilient Agriculture Programme launched with ₹480 crore allocation for Belagavi and 4 other vulnerable districts.', type: 'policy' },
      { year: 2022, title: 'Micro-Irrigation Expansion', description: 'PM Krishi Sinchayee Yojana targets coverage reaches 24% of irrigated area. Drip and sprinkler adoption increases.', type: 'event' },
      { year: 2024, title: 'Current Status', description: 'KCRAP year-3 evaluation shows 18% reduction in land degradation, 52% crop insurance uptake, and 24% micro-irrigation coverage. Drought risk remains high.', type: 'current' },
    ],

    impacts: {
      environmental: { description: 'Soil degradation affected 42% of agricultural land. Wasteland expanded by 3,400 ha. Micro-irrigation prevented soil loss on 28,000 ha.', forestLoss: 920, forestGain: 180, waterBodyChange: -14, carbonEmissionChange: -80, biodiversityScore: 42 },
      economic: { description: 'Drought years cause ₹1,200 crore agricultural loss. KCRAP has improved resilience but 4.8 lakh families remain vulnerable.', agriculturalProductivityChange: -28, landValueChange: -12, infrastructureInvestmentCr: 480, jobsCreated: 18000, gdpContribution: 0 },
      social: { description: '4.8 lakh farming families face income insecurity. 28,000 farmer families in drought-prone taluks classify as distressed.', populationAffected: 480000, displacedFamilies: 2800, landDisputeChange: 8, livelihoodImpact: 'Significant – income decline 28% in drought years', accessToServicesChange: 12 },
      governance: { description: 'KCRAP coordination between Agriculture, Revenue, and Irrigation departments improved after 2021. Digital crop insurance integration reduced fraud by 34%.', landRecordDigitizationPct: 72, policyImplementationScore: 65, adminChallenges: ['Water distribution equity', 'Soil health data gaps', 'Insurance claim delays', 'Drought declaration delays'], disputeResolutionRate: 38.7 },
    },

    policies: [
      { name: 'Karnataka Climate-Resilient Agriculture Programme (KCRAP)', year: 2021, department: 'Agriculture Department, GoK', objective: 'Improve climate resilience of agricultural communities in drought-prone districts', keyProvisions: ['Micro-irrigation expansion to 40%', 'Drought-resistant variety adoption', 'Soil health card for all farmers', 'Digital crop insurance', 'Land use diversification support'], implementationArea: 'Belagavi, Kalaburagi, Vijayapura, Yadgir, Raichur districts', impactDescription: 'Reduced land degradation by 18%, increased insurance coverage from 18% to 52%', category: 'Agricultural Policy' },
      { name: 'PM Krishi Sinchayee Yojana – Karnataka', year: 2019, department: 'Irrigation Department, GoK', objective: 'Expand micro-irrigation coverage to 40% of irrigated area by 2025', keyProvisions: ['50% subsidy on drip irrigation', 'Canal command area optimization', 'On-farm water management training'], implementationArea: 'Priority districts including Belagavi', impactDescription: 'Micro-irrigation coverage increased from 12% to 24% in Belagavi', category: 'Agricultural Policy' },
    ],

    research: [
      { title: 'Climate Vulnerability Assessment of Agricultural Lands in Belagavi', authors: 'Dr. Meera Kulkarni, Dr. S. Patil', organization: 'UAS Dharwad', year: 2023, category: 'Climate Vulnerability', summary: 'Composite vulnerability index shows 42% of Belagavi agricultural land in high/very-high vulnerability class. Soil moisture deficit primary driver.', source: 'Journal of Dryland Agriculture' },
    ],

    challenges: [
      { title: 'Recurrent Drought', description: '6 of 10 taluks face drought in 6 out of every 10 years, making sustained agricultural investment difficult.', severity: 'high' },
      { title: 'Soil Degradation', description: '42% of agricultural land shows moderate to severe degradation with declining organic matter and micronutrient deficiency.', severity: 'high' },
      { title: 'Water Distribution Equity', description: 'Canal irrigation benefits only 24% of farmers; 76% depend on erratic rainfall. Intra-district water distribution is inequitable.', severity: 'high' },
      { title: 'Insurance Claim Delays', description: 'Average crop insurance claim settlement takes 6-8 months, creating liquidity crisis for affected farmers.', severity: 'medium' },
    ],

    insights: [
      'Climate vulnerability score of 72/100 places Belagavi among Karnataka\'s top 5 most climate-stressed agricultural districts.',
      'Wasteland has expanded by 3,400 ha since 2015, indicating progressive agricultural abandonment in drought-prone areas.',
      'Micro-irrigation adoption doubled (12% to 24%) under KCRAP, preventing significant soil loss on 28,000 ha.',
      'Crop insurance uptake tripled (18% to 52%), improving farmer resilience, but claim processing delays remain a critical barrier.',
      'Drought risk score of 74/100 indicates urgent need for water storage expansion and groundwater recharge infrastructure.',
    ],

    recommendations: [
      { priority: 'immediate', action: 'Accelerate crop insurance claim digitization to reduce settlement time to 30 days', rationale: 'Liquidity crisis during drought is primary driver of distress migration', responsibleAgency: 'Agriculture Insurance Company of India / DoA Karnataka' },
      { priority: 'short_term', action: 'Scale micro-irrigation from 24% to 40% coverage with targeted farmer clusters in high-risk taluks', rationale: 'Each 1% increase in micro-irrigation coverage reduces soil erosion by 2,800 ha', responsibleAgency: 'Karnataka Irrigation Department' },
      { priority: 'long_term', action: 'Develop district-level Climate Risk Land Use Plan integrating GIS, soil health, and water availability data', rationale: 'Systemic planning needed to prevent agricultural land abandonment', responsibleAgency: 'Agriculture Department + KSRSAC + Revenue Department' },
    ],

    landRecords: [
      { surveyNumber: 'KA-BLG-2024-001', ownerName: 'Siddhappa Patil', guardianName: 'Basappa Patil', village: 'Nandgad', taluk: 'Ramdurg', district: 'Belagavi', state: 'Karnataka', areaHectares: 4.8, areaAcres: 11.86, landType: 'agricultural', landUseClass: 'Dry Land – Jowar Cultivation', registrationNumber: 'RGN/BLG/2019/1122', khasraNumber: 'SY.No.244/1A', khataNumber: 'ROR-BLG-9921', coordinates: { lat: 16.0120, lng: 75.1150 }, pincode: '591123', boundaryNorth: 'SY.No.243', boundarySouth: 'Nandgad Road', boundaryEast: 'SY.No.245', boundaryWest: 'Canal' },
      { surveyNumber: 'KA-BLG-2024-002', ownerName: 'Savitri Bai Kulkarni', guardianName: 'Dattatray Kulkarni', village: 'Gokak', taluk: 'Gokak', district: 'Belagavi', state: 'Karnataka', areaHectares: 2.1, areaAcres: 5.19, landType: 'agricultural', landUseClass: 'Wet Land – Sugarcane', registrationNumber: 'RGN/BLG/2020/3341', khasraNumber: 'SY.No.88/3B', khataNumber: 'ROR-BLG-4456', coordinates: { lat: 16.1650, lng: 74.8200 }, pincode: '591307', boundaryNorth: 'Ghataprabha Canal', boundarySouth: 'SY.No.89', boundaryEast: 'Village Road', boundaryWest: 'SY.No.87' },
    ],

    technologyUsed: ['Remote Sensing', 'Soil Moisture Sensors', 'Digital Crop Insurance', 'GIS Mapping', 'Drip Irrigation'],
    stakeholders: ['Karnataka Agriculture Dept', 'NABARD', 'District Administration', 'Farmer Producer Organizations', 'KCRAP'],
    tags: ['climate vulnerability', 'drought', 'Belagavi', 'agricultural land', 'soil degradation', 'Karnataka', 'micro-irrigation'],
    status: 'published',
    impactScore: 74,
    climateRiskLevel: 'high',
    isDemoData: true,
  },

  /* ═══════════════════════════════════════════════════════════════════════════
     3. FOREST CONSERVATION — MYSURU, KARNATAKA
  ═══════════════════════════════════════════════════════════════════════════ */
  {
    title: 'Forest Conservation and Eco-Sensitive Zone Management – Mysuru District, Karnataka',
    slug: 'mysuru-forest-conservation-eco-sensitive-zone',
    category: 'Forest & Biodiversity',
    subCategory: 'Protected Area Management',
    location: {
      state: 'Karnataka', district: 'Mysuru', village: 'Multiple Forest Areas',
      taluk: 'Mysuru', pincode: '570001',
      coordinates: { lat: 12.2958, lng: 76.6394 },
      bounds: { south: 11.50, west: 75.90, north: 13.00, east: 77.10 },
    },
    studyPeriod: { startYear: 2012, endYear: 2024 },
    problem: 'Mysuru district contains critical segments of the Mysuru-Nagarhole Wildlife Corridor and Western Ghats eco-sensitive zones. Between 2012 and 2024, fragmentation of forest land due to infrastructure expansion, tribal encroachment regularization, and illegal land conversions reduced corridor connectivity by 22%. This directly threatens the Nagarhole-Bandipur Tiger Reserve complex.',
    background: 'Mysuru district houses 31% forest cover, including portions of two Tiger Reserves, one elephant corridor, and 18 reserved forests. The Karnataka High Court\'s 2021 eco-sensitive zone notification created governance complexity. Overlapping jurisdictions of Forest Department, Revenue Department, and Tribal Welfare have created conflicting land claims affecting 48,000 hectares.',
    intervention: 'Integrated Corridor Land Management Plan (ICLMP) implemented in 2022 combining: GIS-based forest boundary demarcation, tribal land rights settlement under FRA 2006, infrastructure routing guidelines, and community forest resource management grants.',
    results: 'Forest boundary demarcation completed for 280,000 ha. FRA titles issued to 4,200 tribal households. 8 km of linear infrastructure realigned away from critical corridor. Community forest management established in 42 villages.',

    indicators: {
      totalAreaHa: 685400,
      agriculturalPct: 70.4,
      urbanPct: 9.1,
      forestPct: 31.2,
      waterPct: 5.6,
      wastelandPct: 4.2,
      urbanizationRate: 0.8,
      climateVulnerability: 'low',
      climateVulnerabilityScore: 34,
      floodRisk: 32,
      droughtRisk: 42,
      landDegradation: 20,
      activeLandDisputes: 78,
      resolvedDisputes: 38,
      infrastructureProjects: 8,
      population: 3236400,
      populationDensity: 452,
      literacyRate: 76.2,
      irrigatedAreaPct: 32.4,
      soilHealth: 'good',
    },

    landUseTrend: [
      { year: 2012, agricultural: 69.8, urban: 7.2, forest: 33.4, water: 5.8, wasteland: 3.8, other: 0.0 },
      { year: 2015, agricultural: 69.5, urban: 7.8, forest: 32.8, water: 5.7, wasteland: 4.0, other: 0.2 },
      { year: 2018, agricultural: 70.0, urban: 8.4, forest: 32.1, water: 5.7, wasteland: 4.1, other: -0.3 },
      { year: 2021, agricultural: 70.2, urban: 8.8, forest: 31.6, water: 5.6, wasteland: 4.2, other: -0.4 },
      { year: 2024, agricultural: 70.4, urban: 9.1, forest: 31.2, water: 5.6, wasteland: 4.2, other: -0.5 },
    ],

    timeline: [
      { year: 2012, title: 'Forest Boundary Survey Initiated', description: 'Karnataka Forest Department initiates comprehensive boundary demarcation of reserved and protected forests in Mysuru using GPS and satellite imagery.', type: 'initial' },
      { year: 2016, title: 'Tribal Land Claims Surge', description: '18,000 FRA claims filed in Mysuru. Revenue and Forest Department have conflicting records on 12,000 cases.', type: 'event' },
      { year: 2019, title: 'Infrastructure Corridor Conflicts', description: 'Proposed NH-766 expansion threatens 8.4 km of critical elephant corridor. NGT intervention halts work pending environmental clearance.', type: 'event' },
      { year: 2021, title: 'Karnataka ESZ Notification', description: 'Karnataka HC issues eco-sensitive zone boundaries for Nagarhole and Bandipur. Affects 48,000 ha of mixed jurisdiction land.', type: 'policy' },
      { year: 2022, title: 'ICLMP Implementation', description: 'Integrated Corridor Land Management Plan launched. GIS-based demarcation, FRA settlement, and community forest management initiated.', type: 'policy' },
      { year: 2024, title: 'Progress Assessment', description: 'Boundary demarcation 280,000 ha complete. 4,200 FRA titles issued. NH-766 realigned 8 km. 42 community forest management groups active.', type: 'current' },
    ],

    impacts: {
      environmental: { description: 'Forest corridor connectivity improved in ICLMP areas. Fragmentation index reduced by 18% in treated corridors. FRA titles secured 28,000 ha of community forest.', forestLoss: 2200, forestGain: 1800, waterBodyChange: -2, carbonEmissionChange: -120, biodiversityScore: 68 },
      economic: { description: 'Community forest management generates ₹28 crore annual NTFP income for tribal households. Eco-tourism expanded to ₹420 crore.', agriculturalProductivityChange: 8, landValueChange: 15, infrastructureInvestmentCr: 280, jobsCreated: 12000, gdpContribution: 0 },
      social: { description: '4,200 tribal households secured forest land rights. 42 village communities managing 28,000 ha of community forest. Traditional knowledge integrated into conservation.', populationAffected: 48000, displacedFamilies: 280, landDisputeChange: -22, livelihoodImpact: 'Positive – NTFP income secured for 4,200 families', accessToServicesChange: 28 },
      governance: { description: 'ICLMP created first tri-department coordination mechanism. FRA claim processing time reduced from 3 years to 14 months.', landRecordDigitizationPct: 68, policyImplementationScore: 72, adminChallenges: ['Forest-Revenue boundary conflicts', 'FRA claim verification capacity', 'Infrastructure routing through forest land', 'Tribal displacement concerns'], disputeResolutionRate: 48.7 },
    },

    policies: [
      { name: 'Forest Rights Act 2006 – Karnataka Implementation Guidelines', year: 2020, department: 'Tribal Welfare Department, GoK', objective: 'Recognize and secure forest rights of scheduled tribes in Mysuru forest areas', keyProvisions: ['Individual forest rights up to 4 ha', 'Community forest resource rights', 'Gram Sabha empowerment for forest management', 'Habitat rights for Particularly Vulnerable Tribal Groups'], implementationArea: 'All forest-adjacent taluks in Mysuru district', impactDescription: '4,200 titles issued; 28,000 ha community forest secured', category: 'Tribal Rights' },
    ],

    challenges: [
      { title: 'Revenue-Forest Department Boundary Conflicts', description: 'Overlapping cadastral and forest department maps create legal uncertainty for 12,000 land parcels in the district.', severity: 'high' },
      { title: 'FRA Claim Processing Backlog', description: '14,000 FRA claims still pending due to capacity constraints in Gram Sabha verification and sub-divisional committee review.', severity: 'high' },
      { title: 'Infrastructure-Corridor Conflicts', description: 'Two major road expansion projects require routing through eco-sensitive zone. Legal and ecological review is ongoing.', severity: 'medium' },
    ],

    insights: [
      'Forest cover has declined 2.2 percentage points (33.4% to 31.2%) over 12 years despite conservation interventions.',
      'FRA implementation has secured 28,000 ha of community forest, creating a conservation stakeholder network among 4,200 tribal households.',
      'Infrastructure routing conflicts remain the most immediate threat to corridor connectivity in the district.',
      'Community forest management generates ₹28 crore NTFP income, making conservation economically viable for local communities.',
      'Climate risk is low compared to other Karnataka districts, but fire risk in the dry season is increasing.',
    ],

    recommendations: [
      { priority: 'immediate', action: 'Resolve pending 14,000 FRA claims using dedicated fast-track sub-divisional committees', rationale: 'Rights uncertainty is primary driver of illegal encroachment and unauthorized land use', responsibleAgency: 'Tribal Welfare Department + District Administration' },
      { priority: 'short_term', action: 'Digitize and integrate Revenue Department and Forest Department cadastral maps for 48,000 ha ESZ area', rationale: 'Eliminate conflicting records that are source of 52% of land disputes', responsibleAgency: 'Revenue Department + Karnataka Forest Department + KSRSAC' },
    ],

    landRecords: [
      { surveyNumber: 'KA-MYS-2024-001', ownerName: 'Jayamma (Jenu Kuruba Tribal)', guardianName: 'Rangappa', village: 'Antharasante', taluk: 'H.D. Kote', district: 'Mysuru', state: 'Karnataka', areaHectares: 1.6, areaAcres: 3.95, landType: 'forest', landUseClass: 'Community Forest Resource – FRA Title', registrationNumber: 'FRA/MYS/2022/412', khasraNumber: 'CFR.No.12/A', khataNumber: 'TRIBAL-MYS-412', coordinates: { lat: 11.9820, lng: 76.4230 }, pincode: '571114', boundaryNorth: 'Reserved Forest', boundarySouth: 'Village Road', boundaryEast: 'Community Land', boundaryWest: 'Reserved Forest' },
    ],

    technologyUsed: ['GPS Boundary Demarcation', 'GIS Corridor Analysis', 'Satellite Forest Monitoring', 'FRA Digital Platform', 'Community Radio'],
    stakeholders: ['Karnataka Forest Department', 'Tribal Welfare Department', 'Revenue Department', 'NGT', 'WWF India', 'Tribal Communities'],
    tags: ['forest conservation', 'FRA', 'tribal land rights', 'Mysuru', 'Karnataka', 'eco-sensitive zone', 'wildlife corridor'],
    status: 'published',
    impactScore: 68,
    climateRiskLevel: 'low',
    isDemoData: true,
  },

  /* ═══════════════════════════════════════════════════════════════════════════
     4. WATER BODY ENCROACHMENT — HYDERABAD, TELANGANA
  ═══════════════════════════════════════════════════════════════════════════ */
  {
    title: 'Water Body Encroachment and Urban Flood Risk – Hyderabad Metropolitan Area',
    slug: 'hyderabad-water-body-encroachment-urban-flood',
    category: 'Water Bodies & Wetlands',
    subCategory: 'Urban Lake Encroachment',
    location: {
      state: 'Telangana', district: 'Hyderabad', village: 'Multiple Areas',
      taluk: 'Hyderabad', pincode: '500001',
      coordinates: { lat: 17.3850, lng: 78.4867 },
      bounds: { south: 17.20, west: 78.20, north: 17.60, east: 78.90 },
    },
    studyPeriod: { startYear: 2000, endYear: 2024 },
    problem: 'Hyderabad had 932 lakes and tanks in 2000; by 2024 only 422 retain significant water-holding capacity. Urban expansion has encroached on 510 water bodies, eliminating 14,000 ha of natural flood storage. The 2020 Hyderabad floods (worst in 40 years) caused ₹6,000 crore loss and 70 deaths, directly attributed to systematic lake encroachment.',
    background: 'Hyderabad\'s historical tank cascade system was designed to manage the Deccan Plateau\'s irregular rainfall. Colonial and post-independence urbanization disrupted the tank-feeder-drainage network. The IT boom of 2000-2020 accelerated encroachment as IT parks and residential colonies expanded into traditional catchment areas. GHMC had no integrated water-body protection framework until 2020.',
    intervention: 'Hyderabad Lake Protection and Restoration Mission (HLPRM) launched in 2021 by Telangana government. Key actions: lake boundary fencing, demolition of 2,800 unauthorized structures in FTL zones, Comprehensive Lake Inventory using Bhuvan satellite data, digital lake atlas, and urban flooding risk mapping.',
    results: '184 lakes fenced and protected. 2,800 unauthorized structures demolished. Digital Lake Atlas covers all 932 historically mapped water bodies. Urban drainage masterplan updated. Flood risk reduced by 28% in targeted catchments.',

    indicators: {
      totalAreaHa: 21700,
      agriculturalPct: 3.8,
      urbanPct: 72.8,
      forestPct: 2.4,
      waterPct: 5.2,
      wastelandPct: 1.8,
      urbanizationRate: 1.2,
      climateVulnerability: 'high',
      climateVulnerabilityScore: 74,
      floodRisk: 82,
      droughtRisk: 48,
      landDegradation: 18,
      activeLandDisputes: 342,
      resolvedDisputes: 168,
      infrastructureProjects: 28,
      population: 9746000,
      populationDensity: 18612,
      literacyRate: 83.2,
      irrigatedAreaPct: 8.0,
      soilHealth: 'moderate',
    },

    landUseTrend: [
      { year: 2000, agricultural: 12.4, urban: 38.2, forest: 4.8, water: 18.6, wasteland: 4.2, other: 21.8 },
      { year: 2005, agricultural: 10.2, urban: 44.8, forest: 4.2, water: 16.4, wasteland: 3.8, other: 20.6 },
      { year: 2010, agricultural: 7.8, urban: 52.4, forest: 3.6, water: 12.8, wasteland: 3.2, other: 20.2 },
      { year: 2015, agricultural: 5.6, urban: 62.1, forest: 3.0, water: 8.6, wasteland: 2.4, other: 18.3 },
      { year: 2020, agricultural: 4.2, urban: 70.4, forest: 2.6, water: 5.8, wasteland: 2.0, other: 15.0 },
      { year: 2024, agricultural: 3.8, urban: 72.8, forest: 2.4, water: 5.2, wasteland: 1.8, other: 14.0 },
    ],

    timeline: [
      { year: 2000, title: 'Baseline – 932 Lakes Functional', description: '932 lakes and tanks functional. 18.6% of HMA area under water bodies. Tank cascade system partially intact.', type: 'initial' },
      { year: 2008, title: 'IT Corridor Expansion – Western Hyderabad', description: 'HITEC City and adjacent IT parks expand into former agricultural and lake catchment areas. 120 lakes under severe encroachment pressure.', type: 'change' },
      { year: 2015, title: 'Telangana State Formation Impact', description: 'New state government accelerates infrastructure development. GHMC jurisdiction expanded. 180 additional lake catchments compromised.', type: 'event' },
      { year: 2020, title: 'Catastrophic Floods – ₹6,000 Crore Loss', description: '2020 floods inundate 26 GHMC zones. 70 deaths. NDRF deployed. Post-flood analysis confirms direct link to lake encroachment eliminating flood storage.', type: 'event' },
      { year: 2021, title: 'HLPRM Launched – Emergency Response', description: 'Hyderabad Lake Protection and Restoration Mission established with ₹1,200 crore allocation. Lake Atlas, boundary fencing, demolition drive initiated.', type: 'policy' },
      { year: 2024, title: 'Progress – 184 Lakes Protected', description: '184 lakes fenced. 2,800 unauthorized structures demolished. Digital Lake Atlas complete. Flood risk reduced 28% in targeted catchments.', type: 'current' },
    ],

    impacts: {
      environmental: { description: 'Loss of 510 water bodies eliminated 14,000 ha of natural flood storage and groundwater recharge. 2020 floods demonstrated catastrophic consequences. 184 restored lakes now sequestering water.', forestLoss: 1200, forestGain: 0, waterBodyChange: -55, carbonEmissionChange: 180, biodiversityScore: 22 },
      economic: { description: '2020 floods caused ₹6,000 crore damage. HLPRM investment of ₹1,200 crore expected to prevent ₹4,000 crore annual flood loss.', agriculturalProductivityChange: -42, landValueChange: -8, infrastructureInvestmentCr: 1200, jobsCreated: 8000, gdpContribution: 0 },
      social: { description: '70 flood deaths in 2020. 2 lakh residents displaced during floods. Low-income settlements in lake beds most affected.', populationAffected: 2000000, displacedFamilies: 15000, landDisputeChange: 28, livelihoodImpact: 'Severe in flood years – disproportionate impact on urban poor', accessToServicesChange: -15 },
      governance: { description: 'Fragmented lake governance across GHMC, HMDA, Revenue, Irrigation, and HYDRAA created the conditions for encroachment. HLPRM is first integrated framework.', landRecordDigitizationPct: 82, policyImplementationScore: 62, adminChallenges: ['Multi-agency jurisdiction', 'Political pressure on demolition drives', 'Court-protected encroachments', 'FTL demarcation disputes', 'Urban drainage masterplan implementation'], disputeResolutionRate: 49.1 },
    },

    policies: [
      { name: 'Hyderabad Lake Protection and Restoration Mission (HLPRM)', year: 2021, department: 'Municipal Administration & Urban Development, GoTS', objective: 'Protect and restore all 932 historically mapped lakes in the Hyderabad Metropolitan Area', keyProvisions: ['Full Tank Level (FTL) boundary demarcation for all lakes', 'No-development buffer zone of 30m from FTL', 'Demolition of unauthorized structures in FTL', 'Digital Lake Atlas for real-time monitoring', 'Urban drainage masterplan integration'], implementationArea: 'Greater Hyderabad Municipal Corporation + HMDA zone', impactDescription: '184 lakes protected, 2,800 structures demolished, flood risk reduced 28%', category: 'Water Management' },
    ],

    challenges: [
      { title: 'Political Pressure on Demolition', description: 'Demolition of 2,800 structures faces intense political resistance, especially from high-value real estate developments.', severity: 'high' },
      { title: 'Multi-Agency Jurisdiction Conflicts', description: 'GHMC, HMDA, Irrigation, Revenue, and new HYDRAA authority have overlapping and sometimes conflicting lake jurisdiction.', severity: 'high' },
      { title: 'FTL Demarcation Disputes', description: '248 lakes have contested FTL boundaries. Court stay orders have halted protection work on 64 lakes.', severity: 'high' },
    ],

    insights: [
      'Water body area declined from 18.6% (2000) to 5.2% (2024) – a 72% reduction in natural flood storage capacity.',
      'The 2020 floods resulted in ₹6,000 crore damage – demonstrating that unprotected lake encroachment creates exponentially larger economic costs.',
      'HLPRM is the first integrated lake protection framework but faces implementation barriers from political resistance and judicial stays.',
      'Urban population density of 18,612/km² makes Hyderabad the most flood-vulnerable major city studied, with 82/100 flood risk score.',
      '184 of 932 lakes now protected – representing 19.7% of the target, with 748 lakes still requiring protection action.',
    ],

    recommendations: [
      { priority: 'immediate', action: 'Resolve 248 contested FTL demarcation disputes through fast-track judicial mechanism', rationale: 'Legal uncertainty is blocking protection of 26% of lakes where work is stalled', responsibleAgency: 'HYDRAA + Revenue Department + High Court-appointed commissioner' },
      { priority: 'immediate', action: 'Complete urban drainage masterplan integration with lake atlas for 26 GHMC zones', rationale: 'Uncoordinated drainage exacerbates flood impact even where lakes are protected', responsibleAgency: 'GHMC Engineering Wing + HMDA' },
    ],

    landRecords: [
      { surveyNumber: 'TS-HYD-2024-001', ownerName: 'Hussain Sagar Lake (Government of Telangana)', guardianName: 'N/A', village: 'Hussain Sagar', taluk: 'Secunderabad', district: 'Hyderabad', state: 'Telangana', areaHectares: 160, areaAcres: 395.4, landType: 'government', landUseClass: 'Heritage Water Body – Protected', registrationNumber: 'GOVT/TS/HS/001', khasraNumber: 'N/A', khataNumber: 'GHMC-LAKE-001', coordinates: { lat: 17.4239, lng: 78.4738 }, pincode: '500003', boundaryNorth: 'Necklace Road', boundarySouth: 'Tank Bund Road', boundaryEast: 'Secunderabad', boundaryWest: 'HITEC City Side' },
    ],

    technologyUsed: ['Bhuvan Satellite Platform', 'GIS Lake Atlas', 'Digital FTL Marking', 'Flood Risk Modelling', 'CCTV Lake Monitoring'],
    stakeholders: ['GHMC', 'HMDA', 'HYDRAA', 'Revenue Department', 'NGT Hyderabad', 'Save our Lakes NGO', 'Urban Planning Department'],
    tags: ['water body encroachment', 'lakes', 'Hyderabad', 'Telangana', 'urban flooding', 'FTL', 'lake protection', 'HLPRM'],
    status: 'published',
    impactScore: 82,
    climateRiskLevel: 'high',
    isDemoData: true,
  },

  /* ═══════════════════════════════════════════════════════════════════════════
     5. INFRASTRUCTURE EXPANSION — PUNE, MAHARASHTRA
  ═══════════════════════════════════════════════════════════════════════════ */
  {
    title: 'Infrastructure Expansion and Land-Use Transformation – Pune Metropolitan Region',
    slug: 'pune-infrastructure-expansion-land-use-transformation',
    category: 'Infrastructure Development',
    subCategory: 'Urban Infrastructure & Land Conversion',
    location: {
      state: 'Maharashtra', district: 'Pune', village: 'Multiple Areas',
      taluk: 'Pune', pincode: '411001',
      coordinates: { lat: 18.5204, lng: 73.8567 },
      bounds: { south: 17.80, west: 73.40, north: 19.20, east: 74.60 },
    },
    studyPeriod: { startYear: 2016, endYear: 2024 },
    problem: 'Pune\'s designation as a Smart City and Tier-1 infrastructure hub triggered rapid land transformation. The Pune Ring Road (233 km), Metro Rail Phase 1&2, and Pune-Nashik Expressway collectively required 14,800 ha of land acquisition between 2016 and 2024. Compensation disputes affected 28,000 landowner families, and agricultural land conversion outpaced permissible limits under the Maharashtra Regional Town Planning Act.',
    background: 'Pune Metropolitan Region expanded from 1,300 km² to 5,400 km² PMR under PMRDA jurisdiction between 2015 and 2020. The city\'s automotive, IT, and education sectors drive demand for 18-24 million sqm of new real estate annually. Infrastructure investment of ₹1.2 lakh crore (2016-2024) is transforming the land-use fabric but creating systematic displacement and agricultural loss.',
    intervention: 'Maharashtra Land Acquisition & Rehabilitation Framework (MLARF) operationalized in 2020 combining: digital compensation processing, satellite-based crop loss assessment, social impact assessment teams, land pooling scheme for ring road affected villages, and grievance redressal portals.',
    results: '14,800 ha acquired for infrastructure. ₹12,400 crore compensation disbursed (average 3.2x market value). Land pooling benefited 8,400 families in 24 villages. 68% of compensation disputes resolved within 18 months. Agricultural land conversion slowed by 18% after MLARF implementation.',

    indicators: {
      totalAreaHa: 1564300,
      agriculturalPct: 58.8,
      urbanPct: 18.2,
      forestPct: 11.6,
      waterPct: 3.3,
      wastelandPct: 3.1,
      urbanizationRate: 1.2,
      climateVulnerability: 'moderate',
      climateVulnerabilityScore: 52,
      floodRisk: 58,
      droughtRisk: 44,
      landDegradation: 28,
      activeLandDisputes: 1240,
      resolvedDisputes: 843,
      infrastructureProjects: 24,
      population: 9426959,
      populationDensity: 603,
      literacyRate: 87.2,
      irrigatedAreaPct: 38.2,
      soilHealth: 'good',
    },

    landUseTrend: [
      { year: 2016, agricultural: 64.2, urban: 12.4, forest: 12.8, water: 3.8, wasteland: 2.4, other: 4.4 },
      { year: 2018, agricultural: 62.4, urban: 14.2, forest: 12.4, water: 3.6, wasteland: 2.6, other: 4.8 },
      { year: 2020, agricultural: 60.8, urban: 16.0, forest: 12.0, water: 3.5, wasteland: 2.8, other: 4.9 },
      { year: 2022, agricultural: 59.6, urban: 17.2, forest: 11.8, water: 3.4, wasteland: 3.0, other: 5.0 },
      { year: 2024, agricultural: 58.8, urban: 18.2, forest: 11.6, water: 3.3, wasteland: 3.1, other: 5.0 },
    ],

    timeline: [
      { year: 2016, title: 'PMRDA Formation & Smart City Selection', description: 'Pune Metropolitan Regional Development Authority constituted. Pune selected as Smart City. Infrastructure pipeline of ₹1.2 lakh crore announced.', type: 'initial' },
      { year: 2018, title: 'Ring Road Acquisition Begins', description: 'Land acquisition for 233 km Pune Ring Road initiated. 14,200 affected families notified.', type: 'event' },
      { year: 2020, title: 'MLARF & Land Pooling Scheme', description: 'Maharashtra Land Acquisition & Rehabilitation Framework operationalized. Land pooling scheme offered to ring road-affected villages.', type: 'policy' },
      { year: 2022, title: 'Metro Phase 1 Operational', description: '31.2 km Metro operational. Land integration challenges at 6 transit-oriented development nodes.', type: 'event' },
      { year: 2023, title: 'Compensation Dispute Resolution Drive', description: 'PMRDA fast-track courts resolve 843 compensation disputes. ₹12,400 crore compensation disbursed cumulatively.', type: 'policy' },
      { year: 2024, title: 'Current Status', description: '14,800 ha infrastructure land acquired. Metro Phase 2 under construction. Agricultural conversion slowed 18%. 68% disputes resolved.', type: 'current' },
    ],

    impacts: {
      environmental: { description: 'Infrastructure corridors fragmented 4,800 ha of agricultural and forest land. Ring road crosses 8 forest patches and 12 water body drainage lines. Environmental mitigation measures include 42 km wildlife underpasses.', forestLoss: 4200, forestGain: 800, waterBodyChange: -8, carbonEmissionChange: 240, biodiversityScore: 45 },
      economic: { description: 'Infrastructure investment of ₹1.2 lakh crore expected to generate ₹4.8 lakh crore GDP over 20 years. 28,000 landowner families received 3.2x market value compensation.', agriculturalProductivityChange: -22, landValueChange: 340, infrastructureInvestmentCr: 120000, jobsCreated: 480000, gdpContribution: 480000 },
      social: { description: '28,000 families affected by land acquisition. Land pooling benefited 8,400 families who retained developed plots. 12,000 agricultural workers displaced from acquired farmland.', populationAffected: 280000, displacedFamilies: 28000, landDisputeChange: 124, livelihoodImpact: 'Mixed – compensation adequate for landowners, inadequate for agricultural laborers', accessToServicesChange: 48 },
      governance: { description: 'MLARF created effective land acquisition governance with digital compensation and land pooling. 68% dispute resolution rate within 18 months is significant improvement over national average of 28%.', landRecordDigitizationPct: 86, policyImplementationScore: 74, adminChallenges: ['Agricultural labor compensation gaps', 'Transit-oriented development plan delays', 'Forest Department clearance bottlenecks', 'Encroachment on infrastructure land post-acquisition'], disputeResolutionRate: 68.0 },
    },

    policies: [
      { name: 'Maharashtra Land Acquisition & Rehabilitation Framework (MLARF)', year: 2020, department: 'Revenue & Forest Department, GoM', objective: 'Streamline land acquisition for infrastructure with fair compensation and rehabilitation', keyProvisions: ['Digital compensation processing within 60 days', 'Land pooling scheme for highway-adjacent villages', 'Social Impact Assessment for all acquisitions > 100 ha', 'Grievance portal with 30-day resolution target', '3x market value floor for agricultural land'], implementationArea: 'Maharashtra State – all infrastructure projects > ₹500 crore', impactDescription: '68% dispute resolution rate; ₹12,400 crore compensation disbursed', category: 'Land Acquisition' },
    ],

    challenges: [
      { title: 'Agricultural Labor Compensation Gap', description: 'RFCTLARR Act provides compensation to land owners but inadequate support for 12,000+ agricultural laborers who lose livelihood without land ownership.', severity: 'high' },
      { title: 'Transit-Oriented Development Plan Delays', description: '6 Metro station TOD node plans delayed due to conflicting land use designations between PMC, PMRDA, and MIDC.', severity: 'medium' },
      { title: 'Post-Acquisition Encroachment', description: 'Infrastructure land acquired and cleared faces encroachment before construction. 840 cases filed under Prevention of Damage to Public Property Act.', severity: 'medium' },
    ],

    insights: [
      'Agricultural land share declined from 64.2% (2016) to 58.8% (2024) – a 5.4 percentage point loss in 8 years due to infrastructure and urban expansion.',
      'MLARF\'s land pooling scheme converted 8,400 affected families from land losers to urban land owners, significantly reducing compensation disputes.',
      'Infrastructure investment of ₹1.2 lakh crore drives high land value appreciation (340% in strategic corridors) but creates affordability crisis for agricultural communities.',
      'Metro rail reduced land demand for road expansion by 18%, demonstrating public transport as a land-efficient urbanization tool.',
      'Dispute resolution rate of 68% significantly exceeds India\'s 28% national average for infrastructure land acquisition disputes.',
    ],

    recommendations: [
      { priority: 'immediate', action: 'Extend MLARF compensation framework to cover agricultural laborers displaced by land acquisition', rationale: 'Current framework compensates landowners but ignores 12,000 laborers with no title who lose primary livelihood', responsibleAgency: 'Revenue Department + Labour Department, GoM' },
      { priority: 'short_term', action: 'Resolve 6 pending Transit-Oriented Development node conflicts through inter-agency coordination committee', rationale: 'TOD development at metro stations is primary land optimization opportunity being lost', responsibleAgency: 'PMRDA + PMC + MIDC' },
    ],

    landRecords: [
      { surveyNumber: 'MH-PNQ-2024-001', ownerName: 'Vitthalrao Deshmukh', guardianName: 'Late Govindrao Deshmukh', village: 'Wagholi', taluk: 'Haveli', district: 'Pune', state: 'Maharashtra', areaHectares: 3.2, areaAcres: 7.91, landType: 'agricultural', landUseClass: 'Dry Crop – Compensation Processed', registrationNumber: 'RGN/PNQ/2021/7842', khasraNumber: 'SY.No.142/3A', khataNumber: 'ROR-PNQ-22341', coordinates: { lat: 18.5882, lng: 73.9820 }, pincode: '412207', boundaryNorth: 'Ring Road Alignment', boundarySouth: 'SY.No.143', boundaryEast: 'SY.No.144', boundaryWest: 'Village Road' },
      { surveyNumber: 'MH-PNQ-2024-002', ownerName: 'Sunanda Pawar', guardianName: 'Bapurao Pawar', village: 'Hinjewadi', taluk: 'Mulshi', district: 'Pune', state: 'Maharashtra', areaHectares: 1.2, areaAcres: 2.97, landType: 'commercial', landUseClass: 'IT Park – Converted from Agricultural', registrationNumber: 'MIDC/HNJ/2018/334', khasraNumber: 'SY.No.18/2B', khataNumber: 'MIDC-0334', coordinates: { lat: 18.5912, lng: 73.7380 }, pincode: '411057', boundaryNorth: 'MIDC Road', boundarySouth: 'SY.No.19', boundaryEast: 'IT Company', boundaryWest: 'Mula River' },
    ],

    technologyUsed: ['GIS Land Acquisition Mapping', 'Digital Compensation Portal', 'Drone Land Survey', 'BIM Infrastructure Planning', 'Satellite Crop Loss Assessment'],
    stakeholders: ['PMRDA', 'Revenue Department Maharashtra', 'NHAI', 'Pune Metro Rail', 'MIDC', 'Farmers Associations', 'Urban Planning Dept'],
    tags: ['infrastructure', 'land acquisition', 'Pune', 'Maharashtra', 'MLARF', 'urban expansion', 'smart city', 'compensation'],
    status: 'published',
    impactScore: 76,
    climateRiskLevel: 'moderate',
    isDemoData: true,
  },
];

module.exports = CASE_STUDIES;
