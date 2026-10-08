require('dotenv').config();
const connectDB = require('../config/db');

const User     = require('../models/User');
const Research = require('../models/Research');
const Dataset  = require('../models/Dataset');
const Policy   = require('../models/Policy');
const CaseStudy = require('../models/CaseStudy');
const Innovation = require('../models/Innovation');

// ─── USERS ────────────────────────────────────────────────────────────────────
const DEMO_USERS = [
  { name: 'Admin User',         email: 'admin@bharatlandportal.gov.in', password: 'Admin@1234',    role: 'admin',       organization: 'Bharat Land Portal',             state: 'Delhi',       designation: 'Platform Administrator' },
  { name: 'Dr. Priya Sharma',   email: 'priya.sharma@iitd.ac.in',       password: 'Research@1234', role: 'researcher',  organization: 'IIT Delhi',                      state: 'Delhi',       designation: 'Senior Research Fellow',  expertise: ['Land Use Analysis', 'GIS', 'Remote Sensing'] },
  { name: 'Rajesh Kumar IAS',   email: 'rajesh.kumar@revenue.gov.in',   password: 'Govt@1234',     role: 'government',  organization: 'Ministry of Rural Development',  state: 'Delhi',       designation: 'Joint Secretary' },
  { name: 'Dr. Ananya Krishnan',email: 'ananya.k@iisc.ac.in',           password: 'Research@1234', role: 'researcher',  organization: 'Indian Institute of Science',    state: 'Karnataka',   designation: 'Associate Professor',     expertise: ['Agricultural Land Management', 'Climate Resilience'] },
  { name: 'Suresh Patel',       email: 'suresh.patel@gujarat.gov.in',   password: 'Govt@1234',     role: 'government',  organization: 'Gujarat Revenue Department',     state: 'Gujarat',     designation: 'District Collector' },
  { name: 'Dr. Ramesh Naidu',   email: 'ramesh.naidu@uohyd.ac.in',      password: 'Research@1234', role: 'researcher',  organization: 'University of Hyderabad',        state: 'Telangana',   designation: 'Professor',              expertise: ['GIS', 'Remote Sensing', 'Urban Planning'] },
  { name: 'Meena Iyer',         email: 'meena.iyer@tnau.ac.in',         password: 'Research@1234', role: 'researcher',  organization: 'Tamil Nadu Agricultural University', state: 'Tamil Nadu', designation: 'Research Scientist',    expertise: ['Agriculture', 'Soil Science', 'Climate'] },
  { name: 'Public User',        email: 'user@example.com',              password: 'User@1234',     role: 'public',      organization: 'General Public',                 state: 'Maharashtra' },
];

// ─── RESEARCH ─────────────────────────────────────────────────────────────────
const DEMO_RESEARCH = [
  {
    researchId: 'RES-001',
    title: 'Digital Evidence for Sustainable Land-Use Governance',
    authors: [
      { name: 'Aren Veyra', affiliation: 'Civic Evidence Lab, National Digital Platform Prototype' },
      { name: 'Mira Solven', affiliation: 'Civic Evidence Lab, National Digital Platform Prototype' },
      { name: 'Kavin Ardent', affiliation: 'Civic Evidence Lab, National Digital Platform Prototype' },
    ],
    institution: 'Civic Evidence Lab, National Digital Platform Prototype',
    abstract: 'DEMO / FICTIONAL RESEARCH PAPER - FOR HACKATHON PROTOTYPE. This fictional demonstration study explores how citizen-submitted land observations, photographs, geographic coordinates, survey observations, and GIS information can be combined to identify land-use patterns and generate structured evidence for land-governance research and policy-support analysis.',
    keywords: ['citizen evidence', 'land governance', 'GIS', 'land-use change', 'spatial analysis', 'policy support'],
    category: 'Land Governance & Policy',
    domain: ['Land Governance', 'GIS', 'Citizen Evidence'],
    researchType: 'Research Paper',
    studyArea: 'Navira Valley Demonstration Region',
    dataSources: ['Citizen Evidence', 'Photographs', 'GIS', 'Survey'],
    evidenceStatus: 'Demo - preliminary screening',
    datasetId: 'DATA-001',
    gisLayerId: 'GIS-001',
    state: 'Demo Study Area',
    district: 'Navira Valley (Fictional)',
    publicationYear: 2026,
    methodology: 'DEMO / FICTIONAL: Citizen evidence collection, verification and categorization, GIS overlay analysis, spatial clustering, pattern interpretation, and conversion of findings into policy-support information.',
    findings: 'DEMO / FICTIONAL: Of 1,240 reports, 1,000 were classified for preliminary research screening. Fictional verified categories were agricultural land conversion (31.5%), disputed or unclear land information (24.0%), water-body encroachment (18.0%), unauthorized land-use change (16.5%), and infrastructure-related issues (10.0%).',
    status: 'published', isPublic: true, viewCount: 0, downloadCount: 0, isDemoData: true,
  },
  {
    title: 'Digital Land Records and Dispute Resolution in Rural Rajasthan: A GIS-Based Analysis',
    authors: [{ name: 'Dr. Priya Sharma', affiliation: 'IIT Delhi' }, { name: 'Prof. Ramesh Agarwal', affiliation: 'IARI' }],
    institution: 'IIT Delhi', abstract: 'This study analyzes the impact of digital land records under DILRMP on reducing land disputes in rural Rajasthan. Using GIS mapping of 500 villages across 10 districts, we found a 34% reduction in new land disputes following full digitization. The study proposes an integrated approach combining satellite imagery with ground-truth validation.',
    keywords: ['land disputes', 'digital records', 'GIS', 'Rajasthan', 'DILRMP'], category: 'Digital Land Records',
    state: 'Rajasthan', district: 'Jodhpur', publicationYear: 2024,
    methodology: 'Mixed Methods - GIS analysis, field surveys, policy review',
    findings: 'Digital land records reduced disputes by 34%; farmer satisfaction increased by 48%',
    status: 'published', isPublic: true, viewCount: 1245, downloadCount: 387, isDemoData: true,
  },
  {
    title: 'Urban Land Use Change Detection in Pune Metropolitan Region Using Multi-Temporal Satellite Imagery',
    authors: [{ name: 'Dr. Ananya Krishnan', affiliation: 'IISc Bangalore' }, { name: 'Dr. Sunil Naik', affiliation: 'NRSC Hyderabad' }],
    institution: 'Indian Institute of Science', abstract: 'This research examines land use change in the Pune Metropolitan Region over 2010-2024 using Landsat and Sentinel-2 satellite imagery. Findings indicate a 62% increase in urban built-up area, predominantly at the expense of agricultural and forest lands. The study recommends stricter enforcement of green belt policies.',
    keywords: ['urban expansion', 'land use change', 'Pune', 'satellite imagery', 'metropolitan'], category: 'Urban Land Development',
    state: 'Maharashtra', district: 'Pune', publicationYear: 2024,
    methodology: 'Remote sensing classification, change detection algorithms, regression analysis',
    status: 'published', isPublic: true, viewCount: 892, downloadCount: 256, isDemoData: true,
  },
  {
    title: 'Climate Vulnerability Assessment of Agricultural Lands in Vidarbha',
    authors: [{ name: 'Dr. Meera Kulkarni', affiliation: 'VNIT Nagpur' }],
    institution: 'VNIT Nagpur', abstract: 'This study assesses climate vulnerability of agricultural lands in 11 districts of Vidarbha, Maharashtra. Using composite vulnerability indices combining exposure, sensitivity, and adaptive capacity, the study identifies 43% of agricultural land as highly vulnerable to climate change.',
    keywords: ['climate vulnerability', 'agricultural land', 'Vidarbha', 'drought', 'food security'], category: 'Climate Vulnerability',
    state: 'Maharashtra', district: 'Nagpur', publicationYear: 2023,
    methodology: 'Composite Vulnerability Index, field surveys, climate scenario modeling',
    status: 'published', isPublic: true, viewCount: 1567, downloadCount: 489, isDemoData: true,
  },
  {
    title: 'Forest Rights Act Implementation and Land Tenure Security of Tribal Communities in Jharkhand',
    authors: [{ name: 'Dr. Sudha Tripathi', affiliation: 'TISS Mumbai' }],
    institution: 'Tata Institute of Social Sciences', abstract: 'This research evaluates the implementation of the Forest Rights Act (2006) in Jharkhand with a focus on individual and community forest rights. Based on 200 household surveys, the study reveals only 38% title recognition rate despite high eligibility.',
    keywords: ['tribal land rights', 'Forest Rights Act', 'Jharkhand', 'land tenure', 'indigenous'], category: 'Tribal Land Rights',
    state: 'Jharkhand', publicationYear: 2023, status: 'published', isPublic: true, viewCount: 743, downloadCount: 198, isDemoData: true,
  },
  {
    title: 'Geospatial Analysis of Land Degradation and Restoration Potential in the Deccan Plateau',
    authors: [{ name: 'Dr. Vijay Kumar', affiliation: 'NRSC Hyderabad' }, { name: 'Dr. Lakshmi Devi', affiliation: 'University of Hyderabad' }],
    institution: 'National Remote Sensing Centre', abstract: 'Using multi-source remote sensing data and GIS analysis, this study maps land degradation across the Deccan Plateau covering Karnataka, Telangana, and Andhra Pradesh. An estimated 2.3 million hectares show severe degradation primarily due to soil erosion, waterlogging, and salinity.',
    keywords: ['land degradation', 'GIS', 'Deccan Plateau', 'restoration', 'watershed'], category: 'GIS & Remote Sensing',
    state: 'Karnataka', publicationYear: 2024, status: 'published', isPublic: true, viewCount: 1089, downloadCount: 312, isDemoData: true,
  },
  {
    title: 'Smart Land Administration: Blockchain Applications for Transparent Property Records in India',
    authors: [{ name: 'Dr. Arjun Mehta', affiliation: 'IIT Bombay' }, { name: 'Kavita Singh', affiliation: 'NIC India' }],
    institution: 'IIT Bombay', abstract: 'This research explores the feasibility and pilot results of blockchain-based land registration systems tested in Andhra Pradesh and Telangana. The study demonstrates 89% reduction in fraudulent transactions and 65% faster mutation processes.',
    keywords: ['blockchain', 'land registration', 'digital governance', 'property records', 'fraud prevention'], category: 'Digital Land Records',
    state: 'Andhra Pradesh', publicationYear: 2024, status: 'published', isPublic: true, viewCount: 2134, downloadCount: 678, isDemoData: true,
  },
  {
    title: 'Agricultural Land Conversion and Food Security Risks in Tamil Nadu Delta Region',
    authors: [{ name: 'Dr. Meena Iyer', affiliation: 'TNAU' }, { name: 'Prof. S. Krishnamurthy', affiliation: 'Anna University' }],
    institution: 'Tamil Nadu Agricultural University', abstract: 'This study examines the conversion of prime agricultural land in the Cauvery delta region of Tamil Nadu for industrial and urban uses between 2005 and 2024. The findings indicate a 22% reduction in wetland paddy cultivation area and quantify associated food security risks.',
    keywords: ['agricultural land conversion', 'food security', 'Tamil Nadu', 'Cauvery delta', 'paddy'], category: 'Agricultural Land Management',
    state: 'Tamil Nadu', district: 'Thanjavur', publicationYear: 2024, status: 'published', isPublic: true, viewCount: 654, downloadCount: 189, isDemoData: true,
  },
  {
    title: 'Coastal Land Use Change and Vulnerability in Gujarat: Implications for Climate Adaptation',
    authors: [{ name: 'Dr. Neha Shah', affiliation: 'CEPT University Ahmedabad' }],
    institution: 'CEPT University', abstract: 'This research maps coastal land use changes along the 1,600 km Gujarat coastline from 2000-2024. Findings reveal significant encroachment into coastal regulation zones, mangrove loss of 14%, and increased vulnerability of coastal communities to cyclone-induced flooding.',
    keywords: ['coastal land', 'Gujarat', 'climate adaptation', 'mangrove', 'vulnerability'], category: 'Climate Vulnerability',
    state: 'Gujarat', district: 'Kutch', publicationYear: 2023, status: 'published', isPublic: true, viewCount: 876, downloadCount: 234, isDemoData: true,
  },
  {
    title: 'Land Revenue Reforms and Farmer Welfare in Andhra Pradesh: Post-Bifurcation Analysis',
    authors: [{ name: 'Dr. Ramesh Naidu', affiliation: 'University of Hyderabad' }],
    institution: 'University of Hyderabad', abstract: 'This paper analyses the land revenue reform programs implemented in Andhra Pradesh post-bifurcation (2014-2024). The study evaluates Mee-Seva integration with Dharani portal for land records, quantifying improvements in service delivery and reduction in corruption incidents.',
    keywords: ['land revenue', 'Andhra Pradesh', 'Dharani', 'Mee-Seva', 'farmer welfare'], category: 'Land Governance & Policy',
    state: 'Andhra Pradesh', publicationYear: 2024, status: 'published', isPublic: true, viewCount: 543, downloadCount: 167, isDemoData: true,
  },
  {
    title: 'Urban Sprawl and Green Space Loss in Bengaluru Metropolitan Area 2000-2024',
    authors: [{ name: 'Dr. Ananya Krishnan', affiliation: 'IISc Bangalore' }, { name: 'Dr. Prasad Rao', affiliation: 'BMS College' }],
    institution: 'Indian Institute of Science', abstract: 'A multi-temporal satellite imagery analysis reveals Bengaluru lost 78% of its lake area and 65% of open green spaces between 2000 and 2024 due to rapid urban sprawl. The study proposes a spatial planning framework integrating green corridors and urban forests.',
    keywords: ['urban sprawl', 'Bengaluru', 'green space', 'lake encroachment', 'urban planning'], category: 'Urban Land Development',
    state: 'Karnataka', district: 'Bengaluru Urban', publicationYear: 2024, status: 'published', isPublic: true, viewCount: 1876, downloadCount: 512, isDemoData: true,
  },
  {
    title: 'Soil Health and Land Productivity Assessment in Indo-Gangetic Plains',
    authors: [{ name: 'Dr. Arun Mishra', affiliation: 'Banaras Hindu University' }],
    institution: 'Banaras Hindu University', abstract: 'Comprehensive soil health assessment across 12 districts of Uttar Pradesh and Bihar reveals declining organic matter content, increasing soil compaction, and micronutrient deficiency in 67% of sampled agricultural land. Policy recommendations include organic farming transitions and balanced fertilizer programs.',
    keywords: ['soil health', 'Indo-Gangetic Plains', 'Uttar Pradesh', 'Bihar', 'agricultural productivity'], category: 'Agricultural Land Management',
    state: 'Uttar Pradesh', publicationYear: 2023, status: 'published', isPublic: true, viewCount: 789, downloadCount: 234, isDemoData: true,
  },
  {
    title: 'Flood Plain Encroachment and Disaster Risk in Assam: A Spatial Analysis',
    authors: [{ name: 'Dr. Dipankar Borah', affiliation: 'Gauhati University' }],
    institution: 'Gauhati University', abstract: 'Spatial analysis of Brahmaputra floodplain encroachment in Assam identifies 2.4 lakh hectares of high-risk settlement area and the correlation between flood plain land use change and increased disaster impact. Land use zoning enforcement recommendations are provided.',
    keywords: ['flood plain', 'Assam', 'Brahmaputra', 'disaster risk', 'spatial analysis'], category: 'Land Governance & Policy',
    state: 'Assam', publicationYear: 2024, status: 'published', isPublic: true, viewCount: 432, downloadCount: 145, isDemoData: true,
  },
];

// ─── DATASETS ─────────────────────────────────────────────────────────────────
const DEMO_DATASETS = [
  // ── National datasets ────────────────────────────────────────────────────
  {
    name: 'India District-Level Land Use Statistics 2023-24',
    description: 'Comprehensive district-level land use data for all 28 states and 8 UTs including agricultural land, forest cover, urban area, water bodies, and wasteland. Data sourced from state revenue departments and satellite analysis. Covers 766 districts with area breakdowns in km².',
    organization: 'Ministry of Agriculture & Farmers Welfare', category: 'Land Use',
    state: 'National', dataFormat: 'CSV', year: 2024, source: 'DACFW Annual Report',
    geographicCoverage: 'Pan-India – 766 districts', license: 'Open Government Data (OGD)',
    tags: ['land use', 'agriculture', 'district', 'annual statistics', 'national'],
    status: 'published', isPublic: true, downloadCount: 1234, isDemoData: true,
  },
  {
    name: 'SVAMITVA Scheme Property Records Dataset – Pilot States',
    description: 'Property card data from the SVAMITVA pilot scheme covering 9 states. Includes village-level property ownership records, area details, and georeferenced property boundaries for 6.3 lakh villages surveyed using drone technology.',
    organization: 'Ministry of Panchayati Raj', category: 'Land Records',
    state: 'National', dataFormat: 'GeoJSON', year: 2024, source: 'SVAMITVA Portal',
    geographicCoverage: '9 States – UP, Maharashtra, Karnataka, MP, AP, TS, Uttarakhand, Haryana, Punjab',
    tags: ['SVAMITVA', 'property records', 'rural', 'village', 'drone survey'],
    status: 'published', isPublic: true, downloadCount: 876, isDemoData: true,
  },
  {
    name: 'Climate Vulnerability Index – Agricultural Districts India 2024',
    description: 'State and district-level composite Climate Vulnerability Index for agricultural areas. Includes drought frequency index, rainfall variability, temperature anomalies, soil moisture data, and crop loss probability scores for all 766 districts.',
    organization: 'NICRA – Indian Council of Agricultural Research', category: 'Climate',
    state: 'National', dataFormat: 'Excel', year: 2024, source: 'ICAR-NICRA',
    geographicCoverage: 'All 766 districts',
    tags: ['climate', 'vulnerability', 'drought', 'agriculture', 'NICRA'],
    status: 'published', isPublic: true, downloadCount: 2156, isDemoData: true,
  },
  {
    name: 'Urban Growth Monitoring Dataset – Top 50 Cities India',
    description: 'Annual land use change data for India\'s top 50 cities from 2010 to 2024 derived from Sentinel-2 and Landsat-8 satellite imagery. Includes built-up area expansion, green cover loss, water body changes, and urban heat island intensity.',
    organization: 'National Remote Sensing Centre, ISRO', category: 'Urbanization',
    state: 'National', dataFormat: 'GeoJSON', year: 2024, source: 'NRSC Urban Observatory',
    geographicCoverage: '50 major urban agglomerations',
    tags: ['urban', 'growth', 'cities', 'satellite', 'land use change'],
    status: 'published', isPublic: true, downloadCount: 1567, isDemoData: true,
  },
  {
    name: 'Land Dispute Statistics by State and Category 2022-23',
    description: 'Compiled land dispute data from High Courts and District Courts covering 28 states. Categorized by dispute type (boundary, ownership, acquisition, tribal), resolution status, duration, and demographic information of affected parties.',
    organization: 'Ministry of Law and Justice', category: 'Land Records',
    state: 'National', dataFormat: 'CSV', year: 2023, source: 'NJDG – National Judicial Data Grid',
    geographicCoverage: 'All states and UTs',
    tags: ['land disputes', 'judiciary', 'courts', 'ownership', 'boundary'],
    status: 'published', isPublic: true, downloadCount: 987, isDemoData: true,
  },
  {
    name: 'DILRMP Digitization Progress – State-wise Status 2024',
    description: 'State-wise progress data on land record digitization under the Digital India Land Records Modernization Programme. Includes percentage of digitized records, computerized registration offices, mutation completion rates, and court case statistics.',
    organization: 'Department of Land Resources, MoRD', category: 'Land Records',
    state: 'National', dataFormat: 'Excel', year: 2024, source: 'DILRMP Annual Report',
    geographicCoverage: 'All 28 states and 8 UTs',
    tags: ['DILRMP', 'digitization', 'land records', 'mutation', 'registration'],
    status: 'published', isPublic: true, downloadCount: 1423, isDemoData: true,
  },
  {
    name: 'India Forest Cover Classification – ISFR 2023',
    description: 'Forest cover classification data derived from satellite imagery interpretation for India. Includes very dense, moderately dense, open forest, scrub, and non-forest categories with district-level statistics and change analysis from 2021 baseline.',
    organization: 'Forest Survey of India, MoEFCC', category: 'Land Use',
    state: 'National', dataFormat: 'Shapefile', year: 2023, source: 'India State of Forest Report 2023',
    geographicCoverage: 'Pan-India',
    tags: ['forest', 'FSI', 'land cover', 'satellite', 'ISFR'],
    status: 'published', isPublic: true, downloadCount: 2340, isDemoData: true,
  },
  {
    name: 'National Population Census Land Holdings 2011 (Extended)',
    description: 'Land holding data derived from 2011 census agricultural module. Includes marginal (< 1 ha), small (1-2 ha), semi-medium (2-4 ha), medium (4-10 ha), and large (>10 ha) farmer household counts by district and social category.',
    organization: 'Office of the Registrar General of India', category: 'Socio-Economic',
    state: 'National', dataFormat: 'CSV', year: 2011, source: 'Census of India 2011',
    geographicCoverage: 'All districts',
    tags: ['census', 'land holdings', 'farmers', 'social category', 'population'],
    status: 'published', isPublic: true, downloadCount: 3421, isDemoData: true,
  },
  {
    name: 'Flood Risk Zones – India River Basin Assessment',
    description: 'GIS dataset mapping flood-prone zones across 20 major river basins in India. Includes 1-in-25 year and 1-in-100 year flood inundation extents, affected agricultural areas, population exposure, and historical flood event data from 1980-2023.',
    organization: 'National Disaster Management Authority (NDMA)', category: 'Climate',
    state: 'National', dataFormat: 'GeoJSON', year: 2024, source: 'NDMA Flood Risk Atlas',
    geographicCoverage: '20 major river basins, 23 flood-prone states',
    tags: ['flood', 'risk', 'river basin', 'NDMA', 'disaster'],
    status: 'published', isPublic: true, downloadCount: 1876, isDemoData: true,
  },
  {
    name: 'National Highway Land Acquisition Records 2019-24',
    description: 'Land acquisition data for national highway projects approved between 2019 and 2024. Includes project-wise land area, compensation paid, number of affected families, resettlement status, and state-wise progress under the RFCTLARR Act.',
    organization: 'NHAI / Ministry of Road Transport and Highways', category: 'Infrastructure',
    state: 'National', dataFormat: 'CSV', year: 2024, source: 'NHAI Annual Report',
    geographicCoverage: 'All states with NH projects',
    tags: ['highway', 'land acquisition', 'NHAI', 'RFCTLARR', 'infrastructure'],
    status: 'published', isPublic: true, downloadCount: 1129, isDemoData: true,
  },

  // ── State-specific datasets ───────────────────────────────────────────────
  {
    name: 'Karnataka Bhoomi Land Records – District Summary 2024',
    description: 'District-wise summary statistics from the Bhoomi land records system of Karnataka. Includes total land parcels, mutation requests, pending cases, digitization completion percentage, and court-related encumbrances for all 30 districts.',
    organization: 'Department of Revenue, Government of Karnataka', category: 'Land Records',
    state: 'Karnataka', dataFormat: 'CSV', year: 2024, source: 'Bhoomi Portal / Karnataka Revenue',
    geographicCoverage: 'All 30 districts of Karnataka',
    tags: ['Bhoomi', 'Karnataka', 'land records', 'mutation', 'revenue'],
    status: 'published', isPublic: true, downloadCount: 892, isDemoData: true,
  },
  {
    name: 'Karnataka Agriculture Land Use Survey 2023',
    description: 'Comprehensive agricultural land use survey data for Karnataka covering crop-wise area, irrigated vs rainfed area, fallow land, orchard/plantation, and wasteland for all taluks. Based on village-level patwari surveys and satellite cross-verification.',
    organization: 'Department of Agriculture, Karnataka', category: 'Agriculture',
    state: 'Karnataka', dataFormat: 'Excel', year: 2023, source: 'DoA Karnataka Annual Survey',
    geographicCoverage: '236 taluks, 30 districts of Karnataka',
    tags: ['Karnataka', 'agriculture', 'crop area', 'irrigation', 'taluk'],
    status: 'published', isPublic: true, downloadCount: 743, isDemoData: true,
  },
  {
    name: 'Maharashtra Land Records MahaabhUmi Dataset 2024',
    description: 'Land parcel-level summary data from MahaabhUmi (Maharashtra land records portal). Covers 7-12 extract statistics, mutation processing times, land classification changes, and pending court encumbrances across all 36 districts.',
    organization: 'Department of Land Records, Government of Maharashtra', category: 'Land Records',
    state: 'Maharashtra', dataFormat: 'CSV', year: 2024, source: 'MahaabhUmi Portal',
    geographicCoverage: 'All 36 districts of Maharashtra',
    tags: ['Maharashtra', 'MahaabhUmi', 'land records', '7-12', 'mutation'],
    status: 'published', isPublic: true, downloadCount: 1156, isDemoData: true,
  },
  {
    name: 'Maharashtra Drought-Prone Districts Agricultural Stress Index 2024',
    description: 'Agricultural stress indicators for 14 drought-prone districts of Maharashtra (Marathwada and Vidarbha). Includes Normalized Difference Vegetation Index (NDVI) timeseries, soil moisture anomaly, reservoir storage levels, and crop failure risk scores.',
    organization: 'MRSAC – Maharashtra Remote Sensing Application Centre', category: 'Climate',
    state: 'Maharashtra', dataFormat: 'GeoJSON', year: 2024, source: 'MRSAC Drought Monitoring',
    geographicCoverage: 'Marathwada and Vidarbha – 14 districts',
    tags: ['Maharashtra', 'drought', 'NDVI', 'agricultural stress', 'Vidarbha'],
    status: 'published', isPublic: true, downloadCount: 1243, isDemoData: true,
  },
  {
    name: 'Rajasthan Desert Land Degradation GIS Dataset',
    description: 'GIS dataset mapping land degradation severity across the Thar Desert region of Rajasthan. Includes sand dune movement data, abandoned agricultural land, saline soil extent, wind erosion vulnerability, and vegetation cover change from 2005-2024.',
    organization: 'Central Arid Zone Research Institute (CAZRI)', category: 'Land Use',
    state: 'Rajasthan', dataFormat: 'Shapefile', year: 2024, source: 'CAZRI Desertification Atlas',
    geographicCoverage: '12 western districts of Rajasthan',
    tags: ['Rajasthan', 'desert', 'land degradation', 'Thar', 'desertification'],
    status: 'published', isPublic: true, downloadCount: 756, isDemoData: true,
  },
  {
    name: 'Rajasthan e-Dharti Land Records Summary 2024',
    description: 'District-wise summary of Rajasthan\'s e-Dharti land records portal. Includes Jamabandi records, Girdawari agricultural statistics, mutation statistics, and encumbrance certificate data for all 50 districts of Rajasthan.',
    organization: 'Board of Revenue, Government of Rajasthan', category: 'Land Records',
    state: 'Rajasthan', dataFormat: 'Excel', year: 2024, source: 'e-Dharti Portal Rajasthan',
    geographicCoverage: 'All 50 districts of Rajasthan',
    tags: ['Rajasthan', 'e-Dharti', 'Jamabandi', 'land records', 'Girdawari'],
    status: 'published', isPublic: true, downloadCount: 634, isDemoData: true,
  },
  {
    name: 'Tamil Nadu Patta & Chitta Land Records Statistics 2024',
    description: 'Summary statistics from Tamil Nadu\'s computerized land records system. Covers Patta (ownership), Chitta (cultivation), Adangal survey records, pending mutation requests, and e-service delivery metrics across all 38 districts and 294 taluks.',
    organization: 'Department of Revenue Administration, Tamil Nadu', category: 'Land Records',
    state: 'Tamil Nadu', dataFormat: 'CSV', year: 2024, source: 'TNRD e-Services Portal',
    geographicCoverage: 'All 38 districts of Tamil Nadu',
    tags: ['Tamil Nadu', 'Patta', 'Chitta', 'land records', 'TNRD'],
    status: 'published', isPublic: true, downloadCount: 924, isDemoData: true,
  },
  {
    name: 'Tamil Nadu Cauvery Delta Agricultural Land Survey 2023',
    description: 'Detailed agricultural land survey of the Cauvery delta districts (Thanjavur, Tiruvarur, Nagapattinam, Ariyalur). Covers paddy cultivation area, dry and wet land classification, irrigation sources, and land conversion pressures from 2010-2023.',
    organization: 'Tamil Nadu Agricultural University', category: 'Agriculture',
    state: 'Tamil Nadu', dataFormat: 'Excel', year: 2023, source: 'TNAU Agricultural Survey',
    geographicCoverage: 'Cauvery Delta – Thanjavur, Tiruvarur, Nagapattinam, Ariyalur districts',
    tags: ['Tamil Nadu', 'Cauvery', 'paddy', 'delta', 'agriculture'],
    status: 'published', isPublic: true, downloadCount: 567, isDemoData: true,
  },
  {
    name: 'Gujarat Industrial Land Allocation Dataset 2020-24',
    description: 'Land allotment data for industrial zones and Special Economic Zones (SEZs) in Gujarat from 2020 to 2024. Includes GIDC estates, DMIC corridor land, allotment area per industry type, investment attracted, employment generated, and acquired agricultural land.',
    organization: 'Gujarat Industrial Development Corporation (GIDC)', category: 'Infrastructure',
    state: 'Gujarat', dataFormat: 'CSV', year: 2024, source: 'GIDC Annual Data',
    geographicCoverage: 'All industrial estates across Gujarat',
    tags: ['Gujarat', 'industrial', 'GIDC', 'SEZ', 'DMIC'],
    status: 'published', isPublic: true, downloadCount: 812, isDemoData: true,
  },
  {
    name: 'Gujarat Kutch Land Use Post-Earthquake Recovery 2001-2024',
    description: 'Long-term land use change analysis in Kutch district following the 2001 Bhuj earthquake. Tracks land settlement patterns, agricultural recovery, new township development, infrastructure expansion, and ecological restoration over two decades.',
    organization: 'Gujarat State Disaster Management Authority', category: 'Land Use',
    state: 'Gujarat', district: 'Kutch', dataFormat: 'GeoJSON', year: 2024, source: 'GSDMA Post-Disaster Records',
    geographicCoverage: 'Kutch District – Gujarat',
    tags: ['Gujarat', 'Kutch', 'earthquake', 'land recovery', 'post-disaster'],
    status: 'published', isPublic: true, downloadCount: 489, isDemoData: true,
  },
  {
    name: 'Andhra Pradesh Dharani Portal Land Records Summary 2024',
    description: 'Aggregated statistics from the Andhra Pradesh Dharani integrated land records management portal. Includes registered land transactions, mutation approvals, encumbrance certificates, and land use classification data for all 26 districts.',
    organization: 'Revenue Department, Government of Andhra Pradesh', category: 'Land Records',
    state: 'Andhra Pradesh', dataFormat: 'CSV', year: 2024, source: 'Dharani AP Portal',
    geographicCoverage: 'All 26 districts of Andhra Pradesh',
    tags: ['Andhra Pradesh', 'Dharani', 'land records', 'mutation', 'registration'],
    status: 'published', isPublic: true, downloadCount: 756, isDemoData: true,
  },
  {
    name: 'Telangana Dharani Land Records and Agriculture Data 2024',
    description: 'Combined dataset from Telangana\'s Dharani portal and agriculture department. Includes digital land records status, Pattadar passbooks issued, crop area statistics, and irrigation coverage for all 33 districts of Telangana.',
    organization: 'Revenue Department, Government of Telangana', category: 'Land Records',
    state: 'Telangana', dataFormat: 'CSV', year: 2024, source: 'Dharani TS Portal',
    geographicCoverage: 'All 33 districts of Telangana',
    tags: ['Telangana', 'Dharani', 'Pattadar', 'land records', 'agriculture'],
    status: 'published', isPublic: true, downloadCount: 645, isDemoData: true,
  },
  {
    name: 'Kerala Land Use Classification – Western Ghats 2023',
    description: 'Land use and land cover classification for the Western Ghats portion of Kerala. Includes forest types, plantation area, agriculture, built-up area, wetlands, and high-range encroachment mapping. Data critical for Kasturirangan Committee recommendations.',
    organization: 'Kerala State Land Use Board', category: 'Land Use',
    state: 'Kerala', dataFormat: 'Shapefile', year: 2023, source: 'Kerala SLUB / Forest Dept',
    geographicCoverage: 'Western Ghats – Wayanad, Idukki, Palakkad, Thrissur, Malappuram districts',
    tags: ['Kerala', 'Western Ghats', 'forest', 'plantation', 'Kasturirangan'],
    status: 'published', isPublic: true, downloadCount: 934, isDemoData: true,
  },
  {
    name: 'West Bengal Agricultural Land Use Survey – Kharif 2023',
    description: 'Kharif crop season agricultural survey for West Bengal covering rice area, jute cultivation, vegetables, and other crops. Includes district-wise irrigated area, crop intensity index, and year-on-year comparison for 23 districts.',
    organization: 'Directorate of Agriculture, Government of West Bengal', category: 'Agriculture',
    state: 'West Bengal', dataFormat: 'Excel', year: 2023, source: 'DoA West Bengal Kharif Survey',
    geographicCoverage: 'All 23 districts of West Bengal',
    tags: ['West Bengal', 'agriculture', 'rice', 'jute', 'Kharif'],
    status: 'published', isPublic: true, downloadCount: 534, isDemoData: true,
  },
  {
    name: 'Uttar Pradesh Land Records Bhulekh Portal Statistics 2024',
    description: 'Portal usage and land records statistics from UP Bhulekh. Covers khasra/khatauni records, mutation requests, certified copy downloads, and service delivery timelines for all 75 districts. Includes GIS-linked Bhu-Naksha cadastral map statistics.',
    organization: 'Board of Revenue, Uttar Pradesh', category: 'Land Records',
    state: 'Uttar Pradesh', dataFormat: 'CSV', year: 2024, source: 'UP Bhulekh Portal',
    geographicCoverage: 'All 75 districts of Uttar Pradesh',
    tags: ['Uttar Pradesh', 'Bhulekh', 'khasra', 'khatauni', 'Bhu-Naksha'],
    status: 'published', isPublic: true, downloadCount: 1876, isDemoData: true,
  },
  {
    name: 'Delhi Urban Land Use and Property Tax GIS Dataset 2024',
    description: 'GIS-linked urban land use and property data for all 11 districts of Delhi. Includes land use zone classification (residential, commercial, industrial, recreational), floor area ratio compliance, unauthorized construction zones, and property tax collection.',
    organization: 'Delhi Development Authority (DDA)', category: 'Urbanization',
    state: 'Delhi', dataFormat: 'GeoJSON', year: 2024, source: 'DDA / MCD Records',
    geographicCoverage: 'All 11 districts of National Capital Territory of Delhi',
    tags: ['Delhi', 'urban land', 'DDA', 'property tax', 'land use zone'],
    status: 'published', isPublic: true, downloadCount: 1345, isDemoData: true,
  },
  {
    name: 'Population Density and Land Pressure Index – Urban India 2024',
    description: 'Composite index dataset combining population density, land price proxies, built-up area percentage, and available open space for 500 urban areas. Identifies high land pressure zones requiring immediate policy intervention for affordable housing.',
    organization: 'Ministry of Housing and Urban Affairs', category: 'Population',
    state: 'National', dataFormat: 'Excel', year: 2024, source: 'MoHUA Urban Data',
    geographicCoverage: '500 urban areas across India',
    tags: ['population', 'density', 'urban', 'land pressure', 'affordable housing'],
    status: 'published', isPublic: true, downloadCount: 1654, isDemoData: true,
  },
  {
    name: 'Soil Organic Carbon Stock – All India Map 2022',
    description: 'National dataset of soil organic carbon (SOC) stocks at 0-30cm depth for all agricultural soils. Includes state and district-level SOC averages, trend analysis, and identification of soils requiring organic matter restoration interventions.',
    organization: 'ICAR – National Bureau of Soil Survey & Land Use Planning', category: 'Agriculture',
    state: 'National', dataFormat: 'GeoJSON', year: 2022, source: 'NBSS&LUP Soil Carbon Atlas',
    geographicCoverage: 'Pan-India agricultural soils',
    tags: ['soil', 'carbon', 'organic matter', 'NBSS', 'agriculture'],
    status: 'published', isPublic: true, downloadCount: 1123, isDemoData: true,
  },
  {
    name: 'Groundwater Level and Land Subsidence Data – North India 2024',
    description: 'Groundwater level monitoring data from 8,500 observation wells across Punjab, Haryana, Rajasthan, and UP. Includes seasonal water table fluctuations, over-exploited block classification, land subsidence measurements, and recommendations for sustainable water-land management.',
    organization: 'Central Ground Water Board (CGWB)', category: 'Socio-Economic',
    state: 'National', dataFormat: 'CSV', year: 2024, source: 'CGWB Monitoring Report',
    geographicCoverage: 'Punjab, Haryana, Rajasthan, Uttar Pradesh',
    tags: ['groundwater', 'Punjab', 'Haryana', 'land subsidence', 'CGWB'],
    status: 'published', isPublic: true, downloadCount: 1456, isDemoData: true,
  },
  {
    name: 'Tribal Land Rights – Gram Sabha Resolutions Database 2023',
    description: 'Database of Gram Sabha resolutions on Forest Rights Act claims from tribal districts across 10 states. Includes claim status, appeal decisions, type of rights (individual/community), area covered, and grievance redressal outcomes.',
    organization: 'Ministry of Tribal Affairs, Government of India', category: 'Socio-Economic',
    state: 'National', dataFormat: 'CSV', year: 2023, source: 'MoTA FRA Monitoring Dashboard',
    geographicCoverage: 'Tribal districts – 10 states including Jharkhand, Odisha, Chhattisgarh, MP, Maharashtra',
    tags: ['tribal', 'forest rights', 'FRA', 'Gram Sabha', 'land tenure'],
    status: 'published', isPublic: true, downloadCount: 1287, isDemoData: true,
  },
  {
    name: 'Karnataka GIS Layers – Land Use Land Cover 2023',
    description: 'High-resolution land use and land cover GIS layers for Karnataka prepared from IRS satellite imagery. Seven-class classification: cropland, fallow, forest, urban, water, scrub, and barren land. Available at 1:50,000 scale for all taluks.',
    organization: 'Karnataka State Remote Sensing Application Centre (KSRSAC)', category: 'Geospatial',
    state: 'Karnataka', dataFormat: 'Shapefile', year: 2023, source: 'KSRSAC Karnataka LULC',
    geographicCoverage: 'Entire Karnataka – all 236 taluks',
    tags: ['Karnataka', 'LULC', 'GIS', 'satellite', 'KSRSAC'],
    status: 'published', isPublic: true, downloadCount: 1543, isDemoData: true,
  },
  {
    name: 'Andhra Pradesh Land Use GIS Dataset – Post-Bifurcation 2024',
    description: 'Land use and land cover GIS dataset for Andhra Pradesh prepared after state bifurcation. Includes administrative boundary updates, new capital region Amaravati land acquisition data, industrial corridor mapping, and coastal zone regulation classification.',
    organization: 'AP Space Applications Centre (APSAC)', category: 'Geospatial',
    state: 'Andhra Pradesh', dataFormat: 'GeoJSON', year: 2024, source: 'APSAC Land Use Survey',
    geographicCoverage: 'All 26 districts of Andhra Pradesh',
    tags: ['Andhra Pradesh', 'GIS', 'Amaravati', 'LULC', 'coastal zone'],
    status: 'published', isPublic: true, downloadCount: 678, isDemoData: true,
  },
  {
    name: 'Rajasthan Indira Gandhi Canal Command Area Land Use',
    description: 'Land use transformation in the IGNP (Indira Gandhi Nahar Pariyojana) command area covering 15 lakh hectares in Rajasthan. Dataset tracks agricultural conversion of desert land, salinity issues, waterlogging areas, and beneficiary household statistics from 1960-2024.',
    organization: 'Rajasthan Water Resources Department', category: 'Agriculture',
    state: 'Rajasthan', dataFormat: 'Shapefile', year: 2024, source: 'RWD IGNP Records',
    geographicCoverage: 'IGNP Command Area – Ganganagar, Bikaner, Jodhpur, Barmer districts',
    tags: ['Rajasthan', 'irrigation', 'IGNP', 'canal command', 'desertification'],
    status: 'published', isPublic: true, downloadCount: 534, isDemoData: true,
  },
  {
    name: 'Maharashtra Urban Development Land Records – MHADA & SRA 2024',
    description: 'Land and housing records from MHADA (Maharashtra Housing and Area Development Authority) and Slum Rehabilitation Authority (SRA). Includes scheme-wise allotted plots, redevelopment project status, slum survey data, and FSI utilization statistics.',
    organization: 'MHADA / SRA Maharashtra', category: 'Urbanization',
    state: 'Maharashtra', dataFormat: 'Excel', year: 2024, source: 'MHADA & SRA Annual Data',
    geographicCoverage: 'Mumbai Metropolitan Region and major Maharashtra cities',
    tags: ['Maharashtra', 'Mumbai', 'MHADA', 'slum', 'urban redevelopment'],
    status: 'published', isPublic: true, downloadCount: 1123, isDemoData: true,
  },
  {
    name: 'Tamil Nadu Urban Land Use Pattern – Smart Cities 2024',
    description: 'Land use analysis for 11 Tamil Nadu smart cities under the Smart Cities Mission. Includes before-after land use comparison, greenfield vs brownfield development, heritage zone land management, and transit-oriented development corridor mapping.',
    organization: 'Tamil Nadu Smart Cities Development Corporation', category: 'Urbanization',
    state: 'Tamil Nadu', dataFormat: 'GeoJSON', year: 2024, source: 'TNSCDC Smart City Data',
    geographicCoverage: '11 Smart Cities of Tamil Nadu',
    tags: ['Tamil Nadu', 'smart city', 'urban', 'transit-oriented', 'greenfield'],
    status: 'published', isPublic: true, downloadCount: 876, isDemoData: true,
  },
  {
    name: 'Telangana Irrigation and Kaleswaram Project Land Use Impact',
    description: 'Land use change analysis around the Kaleswaram Lift Irrigation Scheme in Telangana. Tracks conversion of drought-prone dryland agriculture to irrigated land, reservoir submergence areas, resettlement zones, and environmental impact on forest areas.',
    organization: 'Telangana Irrigation Department / TSWRD', category: 'Agriculture',
    state: 'Telangana', dataFormat: 'GeoJSON', year: 2024, source: 'TSWRD Project Records',
    geographicCoverage: 'Command area of Kaleswaram project – 9 northern Telangana districts',
    tags: ['Telangana', 'Kaleswaram', 'irrigation', 'land conversion', 'dryland'],
    status: 'published', isPublic: true, downloadCount: 723, isDemoData: true,
  },
  {
    name: 'India Infrastructure Land Footprint – Roads Railways Airports 2024',
    description: 'Comprehensive GIS dataset of land under major infrastructure across India. Covers national highways (1.46 lakh km), railways (68,000 km), airports (137 locations), major ports, and electricity transmission corridors with land area, state-wise distribution, and encroachment zones.',
    organization: 'Ministry of Statistics and Programme Implementation', category: 'Infrastructure',
    state: 'National', dataFormat: 'JSON', year: 2024, source: 'MoSPI Infrastructure Compendium',
    geographicCoverage: 'Pan-India',
    tags: ['infrastructure', 'highway', 'railway', 'airport', 'land footprint'],
    status: 'published', isPublic: true, downloadCount: 2134, isDemoData: true,
  },
  {
    name: 'Wetland Inventory and Assessment – India 2022',
    description: 'National wetland inventory dataset based on remote sensing survey. Covers inland freshwater, estuarine, and coastal wetlands. Includes area statistics, health assessment, encroachment mapping, water quality indices, and biodiversity significance scores.',
    organization: 'Space Applications Centre (SAC), ISRO / MoEFCC', category: 'Land Use',
    state: 'National', dataFormat: 'Shapefile', year: 2022, source: 'National Wetland Inventory 2022',
    geographicCoverage: 'Pan-India – all wetland types',
    tags: ['wetland', 'ISRO', 'encroachment', 'biodiversity', 'water bodies'],
    status: 'published', isPublic: true, downloadCount: 1654, isDemoData: true,
  },
  {
    name: 'Gujarat Coastal Zone Management Plan – Land Records 2023',
    description: 'Coastal Regulation Zone (CRZ) classification data for Gujarat. Includes CRZ-I, II, III, and IV zone boundaries, permitted vs prohibited land uses, fishing village boundaries (CZMP), mangrove boundaries, and violation cases.',
    organization: 'Gujarat Environment Management Institute (GEMI) / MoEFCC', category: 'Land Use',
    state: 'Gujarat', dataFormat: 'Shapefile', year: 2023, source: 'Gujarat CRZ Management Plan',
    geographicCoverage: 'Gujarat coastline – 1,600 km',
    tags: ['Gujarat', 'CRZ', 'coastal', 'mangrove', 'regulation zone'],
    status: 'published', isPublic: true, downloadCount: 567, isDemoData: true,
  },
];

// ─── POLICIES ─────────────────────────────────────────────────────────────────
const DEMO_POLICIES = [
  {
    name: 'Digital India Land Records Modernization Programme (DILRMP)',
    department: 'Department of Land Resources, Ministry of Rural Development',
    category: 'Digital Governance', state: 'National', year: 2008,
    description: 'DILRMP is a centrally sponsored scheme to develop a modern, comprehensive and transparent land records management system. Focuses on computerization of land records, survey/re-survey, computerization of registration, and modern record rooms.',
    objective: 'Develop a modern, transparent land records management system to reduce land disputes and improve service delivery.',
    keyFeatures: ['Computerization of all land records', 'Digitization of cadastral maps', 'Integration with registration system', 'Geo-referenced cadastral maps', 'Real Time Updation'],
    implementationStatus: 'active', keywords: ['land records', 'digitization', 'DILRMP', 'computerization', 'cadastral'],
    status: 'published', isDemoData: true,
  },
  {
    name: 'SVAMITVA Scheme – Survey of Villages Mapping with Improvised Technology',
    department: 'Ministry of Panchayati Raj', category: 'Land Reform', state: 'National', year: 2020,
    description: 'Maps inhabited land in rural areas using drone technology to provide property rights to villagers and issues Property Cards (Adhikar Patra) enabling financial access.',
    objective: 'Provide property rights to rural residents, reduce land disputes, enable institutional credit access.',
    keyFeatures: ['Drone-based mapping', 'Property Cards (Adhikar Patra)', 'Integration with Revenue Records', 'Financial empowerment', 'Village-level planning'],
    implementationStatus: 'active', keywords: ['SVAMITVA', 'rural', 'property rights', 'drone', 'village'],
    status: 'published', isDemoData: true,
  },
  {
    name: 'National Land Utilization Policy 2013',
    department: 'Planning Commission of India', category: 'Land Reform', state: 'National', year: 2013,
    description: 'Framework for optimal utilization of land resources balancing development with conservation and rights of vulnerable communities.',
    objective: 'Ensure sustainable, equitable, and productive use of India\'s land resources.',
    keyFeatures: ['Land Bank for non-agricultural use', 'Protection of agricultural land', 'Land use planning guidelines', 'Wasteland development', 'Environmental management'],
    implementationStatus: 'active', keywords: ['land utilization', 'agricultural land', 'wasteland', 'policy'],
    status: 'published', isDemoData: true,
  },
  {
    name: 'Right to Fair Compensation – Land Acquisition Act 2013',
    department: 'Ministry of Rural Development', category: 'Land Acquisition', state: 'National', year: 2013,
    description: 'Replaces Land Acquisition Act 1894. Provides fair compensation, rehabilitation and resettlement for those whose land is acquired for public purposes.',
    objective: 'Fair compensation, humane resettlement, and transparent processes in land acquisition.',
    keyFeatures: ['Social Impact Assessment mandatory', '70-80% consent required', '4x market value compensation', 'Comprehensive R&R', 'Grievance redressal'],
    implementationStatus: 'active', keywords: ['land acquisition', 'compensation', 'rehabilitation', 'resettlement', 'RFCTLARR'],
    status: 'published', isDemoData: true,
  },
  {
    name: 'PM-KISAN Samman Nidhi Scheme',
    department: 'Ministry of Agriculture & Farmers Welfare', category: 'Agricultural Policy', state: 'National', year: 2019,
    description: 'Income support of ₹6,000 per year to small and marginal landholder farmer families in three equal installments.',
    objective: 'Financial support to small/marginal farmers to supplement income and meet agricultural needs.',
    keyFeatures: ['₹6,000 annual income support', 'DBT to Aadhaar-linked accounts', 'All landholder farmers', 'Exclusion criteria', 'Regular verification'],
    implementationStatus: 'active', keywords: ['PM-KISAN', 'farmer', 'income support', 'DBT', 'marginal farmers'],
    status: 'published', isDemoData: true,
  },
  {
    name: 'Karnataka Land Revenue Act and Bhoomi Reforms',
    department: 'Revenue Department, Government of Karnataka', category: 'Digital Governance', state: 'Karnataka', year: 2000,
    description: 'Karnataka\'s flagship land records computerization under Bhoomi project that digitized 20 million land records and reduced mutation time from 2 years to 30 days.',
    objective: 'Transparent, efficient, and corruption-free land records administration in Karnataka.',
    keyFeatures: ['20 million digital records', '177 kiosk centers', 'Biometric mutation authentication', 'Online RTC (Record of Rights)', 'Mobile RTC access'],
    implementationStatus: 'active', keywords: ['Karnataka', 'Bhoomi', 'land records', 'RTC', 'digitization'],
    status: 'published', isDemoData: true,
  },
  {
    name: 'Maharashtra Slum Rehabilitation Authority (SRA) Policy',
    department: 'Housing Department, Government of Maharashtra', category: 'Urban Development', state: 'Maharashtra', year: 1995,
    description: 'Comprehensive policy framework for slum rehabilitation in Maharashtra, primarily Mumbai. Uses in-situ redevelopment with developer-led construction of rehabilitation units and sale units.',
    objective: 'Provide permanent housing to slum dwellers while optimizing land use in urban Maharashtra.',
    keyFeatures: ['In-situ redevelopment', 'Free housing for slum dwellers', 'Developer incentives via FSI', 'Biometric slum surveys', 'State-wide application'],
    implementationStatus: 'active', keywords: ['SRA', 'slum', 'Maharashtra', 'Mumbai', 'urban housing'],
    status: 'published', isDemoData: true,
  },
  {
    name: 'Forest Rights Act 2006 – Implementation Guidelines',
    department: 'Ministry of Tribal Affairs', category: 'Tribal Rights', state: 'National', year: 2006,
    description: 'Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act provides individual and community rights over forestland to tribal communities who depend on forests.',
    objective: 'Recognize and vest rights of forest-dwelling tribal and traditional communities over forestland.',
    keyFeatures: ['Individual forest rights', 'Community forest rights', 'Gram Sabha empowerment', 'MFP collection rights', 'Developmental rights'],
    implementationStatus: 'active', keywords: ['forest rights', 'tribal', 'Gram Sabha', 'FRA', 'community rights'],
    status: 'published', isDemoData: true,
  },
];

// ─── CASE STUDIES ─────────────────────────────────────────────────────────────
const DEMO_CASE_STUDIES = [
  {
    title: 'Bhoomi Project: Digital Land Records Transformation in Karnataka',
    location: { state: 'Karnataka', district: 'Bangalore Rural', village: 'Multiple' },
    category: 'Digital Land Governance',
    problem: 'Karnataka faced massive land records corruption with delays of up to 2 years for mutation services. Citizens paid bribes for basic services.',
    intervention: 'Launch of Bhoomi project in 2000 to computerize 20 million land records across 30,000 villages with 177 kiosk centers.',
    technologyUsed: ['Oracle Database', 'Intranet Network', 'Biometric Authentication', 'Citizen Kiosks', 'Web Portal'],
    results: 'Mutation time reduced from 2 years to 30 days. Corruption nearly eliminated. Model replicated in 10+ states.',
    challenges: 'Initial resistance from revenue officials, staff training, data quality issues, rural connectivity.',
    lessonsLearned: 'Political will and change management are as critical as technology. Continuous updates needed.',
    impact: { economic: 'Savings of Rs. 150 crore annually in reduced corruption', social: 'Improved trust for 4 crore+ landholders', environmental: 'Reduced paper use' },
    timeline: { startYear: 2000, endYear: 2003 },
    stakeholders: ['Karnataka Government', 'Revenue Department', 'NIC', 'World Bank'],
    tags: ['digital governance', 'land records', 'Karnataka', 'Bhoomi', 'e-governance'],
    status: 'published', isDemoData: true,
  },
  {
    title: 'Integrated Watershed Development in Ralegaon Siddhi, Maharashtra',
    location: { state: 'Maharashtra', district: 'Ahmednagar', village: 'Ralegaon Siddhi' },
    category: 'Watershed Development',
    problem: 'Severe drought-prone region with degraded land and 80% population migration.',
    intervention: 'Community-led integrated watershed management with check dams, contour trenches, nala bunds, and social reformation.',
    technologyUsed: ['Contour mapping', 'Watershed GIS', 'Check dam design', 'Water harvesting structures'],
    results: 'Water table raised from 100ft to 15ft. Green cover increased to 35%. Migration stopped.',
    challenges: 'Community consensus building, funding constraints, resistance to social changes.',
    lessonsLearned: 'Community ownership is key. Social reforms must accompany technical interventions.',
    impact: { economic: 'Per capita income increased 5x', social: 'Zero migration, 100% school enrollment', environmental: 'Groundwater recharge of 1.3 billion liters annually' },
    timeline: { startYear: 1975, endYear: 1995 },
    stakeholders: ['Anna Hazare', 'NABARD', 'Maharashtra Government', 'Local Community'],
    tags: ['watershed', 'community', 'drought', 'Maharashtra', 'water conservation'],
    status: 'published', isDemoData: true,
  },
  {
    title: 'SVAMITVA Drone Mapping: Rural Property Rights in Uttar Pradesh',
    location: { state: 'Uttar Pradesh', district: 'Banda', village: 'Multiple' },
    category: 'Digital Land Governance',
    problem: 'Abadi land in rural UP had no official demarcation, causing widespread disputes and inability to access credit.',
    intervention: 'Drone survey of 4,200 villages under SVAMITVA. GIS-based property maps and property cards issued.',
    technologyUsed: ['Drone Surveys', 'GPS Ground Control Points', 'GIS Mapping', 'Property Card Portal', 'Aadhaar Integration'],
    results: '4.2 lakh property cards issued. 92% dispute reduction. 15,000 bank loan applications enabled.',
    challenges: 'Privacy concerns, community engagement, quality control, multi-department coordination.',
    lessonsLearned: 'Technology-enabled surveys work at scale. Integration with financial systems critical.',
    impact: { economic: 'Formal credit access worth Rs. 500 crore', social: '92% dispute reduction', environmental: 'Better village land use planning' },
    timeline: { startYear: 2020, endYear: 2022 },
    stakeholders: ['Ministry of Panchayati Raj', 'Survey of India', 'UP Revenue Department', 'ISRO'],
    tags: ['SVAMITVA', 'drone', 'property rights', 'UP', 'rural'],
    status: 'published', isDemoData: true,
  },
  {
    title: 'Dharani Portal: Integrated Land Records Management in Andhra Pradesh',
    location: { state: 'Andhra Pradesh', district: 'Multiple', village: 'State-wide' },
    category: 'Digital Land Governance',
    problem: 'Land registration fraud, encroachments, and revenue corruption affecting 65 lakh land parcels in AP.',
    intervention: 'Launch of Dharani integrated portal combining registration and land records. All transactions through Mee-Seva centers with biometric verification.',
    technologyUsed: ['Aadhaar Integration', 'Biometric Verification', 'Blockchain Timestamps', 'Mee-Seva Centers', 'GIS Integration'],
    results: 'Registration fraud reduced by 78%. Processing time reduced from 15 days to 1 day. 3.2 crore records integrated.',
    challenges: 'Legacy data migration, system downtime, connectivity in remote mandals, citizen digital literacy.',
    lessonsLearned: 'Single-window integration reduces friction. Aadhaar-seeding critical for verification.',
    impact: { economic: 'Rs. 2,800 crore stamp duty revenue increase YoY', social: 'Fraud-free land transactions for farmers', environmental: 'Paperless records saved 180 tonnes of paper' },
    timeline: { startYear: 2020, endYear: 2022 },
    stakeholders: ['AP Revenue Department', 'NIC', 'Mee-Seva Corporation'],
    tags: ['Dharani', 'Andhra Pradesh', 'land registration', 'digital governance', 'fraud prevention'],
    status: 'published', isDemoData: true,
  },
];

// ─── INNOVATIONS ──────────────────────────────────────────────────────────────
const DEMO_INNOVATIONS = [
  {
    title: 'Smart Land Governance Hackathon 2026', type: 'hackathon',
    organization: 'Ministry of Rural Development & NIC India',
    description: 'National hackathon for innovative land governance solutions: land record digitization, dispute resolution, GIS-based monitoring, and citizen services.',
    eligibility: 'Open to all Indian citizens, students, startups, and companies',
    prizePool: '₹50 Lakh total – 1st: ₹20L, 2nd: ₹15L, 3rd: ₹10L + Mentorship',
    deadline: new Date('2026-11-30'), applicationUrl: 'https://smartlandgov.hackathon.gov.in',
    status: 'open', tags: ['hackathon', 'land governance', 'innovation', 'technology'], category: 'Digital Governance', isDemoData: true,
  },
  {
    title: 'ICSSR Research Grant: Land Rights and Social Equity Studies', type: 'grant',
    organization: 'Indian Council of Social Science Research (ICSSR)',
    description: 'Research grants for interdisciplinary studies on land rights, social equity, and governance. Priority: tribal land rights, women\'s land ownership, urban governance, digital records.',
    eligibility: 'Faculty/researchers at recognized Indian universities',
    prizePool: 'Up to ₹25 Lakh per project over 3 years',
    deadline: new Date('2026-10-15'), applicationUrl: 'https://icssr.org/grants',
    status: 'open', tags: ['research grant', 'land rights', 'equity', 'ICSSR'], category: 'Land Rights', isDemoData: true,
  },
  {
    title: 'GIS-Based Land Use Monitoring Pilot – North-East India', type: 'pilot',
    organization: 'ISRO & Ministry of DoNER',
    description: 'Deploy GIS-based land use change monitoring across 8 North-East states using Bhuvan satellite data integrated with state revenue records.',
    eligibility: 'State governments and registered research institutions in NE India',
    prizePool: 'Technical and financial support of ₹5 Crore per state',
    deadline: new Date('2026-12-31'), applicationUrl: 'https://bhuvan.nrsc.gov.in/pilots',
    status: 'open', tags: ['GIS', 'satellite', 'North-East', 'pilot'], category: 'GIS & Remote Sensing', isDemoData: true,
  },
  {
    title: 'Digital Land Dispute Resolution Challenge', type: 'challenge',
    organization: 'NITI Aayog & Ministry of Law',
    description: 'Design AI/ML-based tools for faster, transparent land dispute resolution. Reduce court burden and enable out-of-court settlements.',
    eligibility: 'Startups (DPIIT recognized), legal tech companies, individual innovators',
    prizePool: '₹30 Lakh + incubation + pilot deployment',
    deadline: new Date('2026-09-30'), applicationUrl: 'https://innovate.mygov.in/challenges',
    status: 'open', tags: ['dispute resolution', 'AI', 'legal tech', 'land'], category: 'Land Disputes', isDemoData: true,
  },
  {
    title: 'Women Land Rights Fellowship Program', type: 'grant',
    organization: 'Landesa India / Tata Trusts',
    description: 'Fellowship for young researchers studying women\'s land ownership, inheritance rights, and the impact of joint titling policies on gender equity in India.',
    eligibility: 'Postgraduate researchers and civil society practitioners under 35',
    prizePool: '₹8 Lakh fellowship + international exposure trip',
    deadline: new Date('2026-08-31'), applicationUrl: 'https://landesa.org/india-fellowship',
    status: 'open', tags: ['women', 'land rights', 'fellowship', 'gender equity'], category: 'Land Rights', isDemoData: true,
  },
];

// ─── SEED RUNNER ──────────────────────────────────────────────────────────────
const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Research.deleteMany();
    await Dataset.deleteMany();
    await Policy.deleteMany();
    await CaseStudy.deleteMany();
    await Innovation.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create users with password hashing (use create() not insertMany)
    const createdUsers = [];
    for (const userData of DEMO_USERS) {
      const u = await User.create(userData);
      createdUsers.push(u);
    }
    console.log(`✅ Created ${createdUsers.length} demo users`);

    const researcherUser = createdUsers.find((u) => u.role === 'researcher');
    const govtUser = createdUsers.find((u) => u.role === 'government');

    await Research.insertMany(DEMO_RESEARCH.map((r) => ({ ...r, uploadedBy: researcherUser._id })));
    console.log(`✅ Created ${DEMO_RESEARCH.length} demo research papers`);

    await Dataset.insertMany(DEMO_DATASETS.map((d) => ({ ...d, uploadedBy: researcherUser._id })));
    console.log(`✅ Created ${DEMO_DATASETS.length} demo datasets`);

    await Policy.insertMany(DEMO_POLICIES.map((p) => ({ ...p, uploadedBy: govtUser._id })));
    console.log(`✅ Created ${DEMO_POLICIES.length} demo policies`);

    await CaseStudy.insertMany(DEMO_CASE_STUDIES.map((c) => ({ ...c, uploadedBy: researcherUser._id })));
    console.log(`✅ Created ${DEMO_CASE_STUDIES.length} demo case studies`);

    await Innovation.insertMany(DEMO_INNOVATIONS.map((i) => ({ ...i, createdBy: govtUser._id })));
    console.log(`✅ Created ${DEMO_INNOVATIONS.length} demo innovations`);

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ DEMO DATA SEEDED SUCCESSFULLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Datasets : ${DEMO_DATASETS.length}
Research : ${DEMO_RESEARCH.length}
Policies : ${DEMO_POLICIES.length}
Cases    : ${DEMO_CASE_STUDIES.length}

Login Credentials:
  Admin      : admin@bharatlandportal.gov.in  / Admin@1234
  Researcher : priya.sharma@iitd.ac.in        / Research@1234
  Government : rajesh.kumar@revenue.gov.in    / Govt@1234
  Public     : user@example.com               / User@1234
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err.message);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Research.deleteMany();
    await Dataset.deleteMany();
    await Policy.deleteMany();
    await CaseStudy.deleteMany();
    await Innovation.deleteMany();
    console.log('✅ All data deleted');
    process.exit(0);
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') { deleteData(); } else { importData(); }
