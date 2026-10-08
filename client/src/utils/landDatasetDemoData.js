/**
 * Land Dataset Module – Demo Data
 * All records are clearly labelled as demo/sample data.
 * Replace with verified official data when available.
 */

// ─── Dataset catalogue (4 cards on the main dashboard) ──────────────────────
export const LAND_DATASET_TYPES = [
  {
    id: 'state-wise',
    title: 'State-wise Land Data',
    subtitle: 'Land distribution across states & districts',
    description:
      'Comprehensive state and district-level breakdown of total geographic area, classified land, forest cover, water bodies, and net sown area across all 28 states and 8 UTs of India.',
    icon: '🗺️',
    color: 'blue',
    totalRecords: 1250,
    lastUpdated: '2026-07-01',
    format: 'CSV / Excel',
    source: 'Ministry of Land Resources (Demo)',
    tags: ['State-wise', 'Districts', 'Geographic Area', 'Land Classification'],
    stats: [
      { label: 'States Covered', value: '28', icon: '🏛️' },
      { label: 'UTs Covered', value: '8', icon: '🏙️' },
      { label: 'Total Districts', value: '766', icon: '📍' },
      { label: 'Data Points', value: '12,500+', icon: '📊' },
    ],
  },
  {
    id: 'land-use',
    title: 'Land Use Dataset',
    subtitle: 'Agriculture, forest, urban, industrial usage',
    description:
      'Detailed land-use classification data covering agricultural land, forest and tree cover, built-up/residential areas, industrial zones, wasteland, water bodies, and other-use categories across all states.',
    icon: '🌾',
    color: 'green',
    totalRecords: 980,
    lastUpdated: '2026-06-15',
    format: 'GeoJSON / CSV',
    source: 'National Remote Sensing Centre (Demo)',
    tags: ['Agriculture', 'Forest', 'Urban', 'Industrial', 'Wasteland'],
    stats: [
      { label: 'Agricultural Land', value: '54.7%', icon: '🌾' },
      { label: 'Forest Cover', value: '21.7%', icon: '🌲' },
      { label: 'Urban Area', value: '7.9%', icon: '🏙️' },
      { label: 'Other Uses', value: '15.7%', icon: '🏭' },
    ],
  },
  {
    id: 'land-ownership',
    title: 'Land Ownership Dataset',
    subtitle: 'Government, private, community & institutional',
    description:
      'State-wise breakdown of land ownership categories — government land (central & state), private holdings, community land (gram sabha / panchayat), institutional ownership, and forest department land.',
    icon: '🏛️',
    color: 'purple',
    totalRecords: 740,
    lastUpdated: '2026-05-20',
    format: 'CSV / PDF',
    source: 'Survey of India / State Revenue Depts (Demo)',
    tags: ['Government', 'Private', 'Community', 'Institutional', 'Patta Land'],
    stats: [
      { label: 'Govt-owned Land', value: '43.2%', icon: '🏛️' },
      { label: 'Private Holdings', value: '38.6%', icon: '👤' },
      { label: 'Community Land', value: '12.1%', icon: '👥' },
      { label: 'Institutional', value: '6.1%', icon: '🏫' },
    ],
  },
  {
    id: 'land-records',
    title: 'Land Records Dataset',
    subtitle: 'State · District · Village · Survey No. · Area',
    description:
      'Structured parcel-level land records containing state, district, tehsil, village, survey/khasra number, area (hectares), land type, and ownership category — enabling granular research and policy analysis.',
    icon: '📋',
    color: 'orange',
    totalRecords: 5200,
    lastUpdated: '2026-08-01',
    format: 'CSV / JSON',
    source: 'Digital India Land Records Modernisation (Demo)',
    tags: ['Survey Number', 'Khasra', 'Village', 'Patta', 'Digital Records'],
    stats: [
      { label: 'Total Parcels', value: '5,200+', icon: '📋' },
      { label: 'States Included', value: '15', icon: '🗺️' },
      { label: 'Villages Covered', value: '320+', icon: '🏘️' },
      { label: 'Record Types', value: '6', icon: '📂' },
    ],
  },
];

// ─── Summary statistics (top stat bar) ──────────────────────────────────────
export const LAND_SUMMARY_STATS = [
  { label: 'Total Geographic Area', value: '328.7 M ha', icon: '🗺️', color: 'blue' },
  { label: 'Agricultural Land', value: '179.8 M ha', icon: '🌾', color: 'green' },
  { label: 'Forest Cover', value: '71.6 M ha', icon: '🌲', color: 'teal' },
  { label: 'Datasets Available', value: '4', icon: '📦', color: 'purple' },
];

// ─── STATE-WISE LAND DATA ────────────────────────────────────────────────────
export const STATE_WISE_DATA = [
  { state: 'Rajasthan', totalArea: 34222, agricultural: 20150, forest: 3224, water: 1210, urban: 890, other: 8748, district: 33 },
  { state: 'Madhya Pradesh', totalArea: 30852, agricultural: 15840, forest: 9462, water: 1100, urban: 720, other: 3730, district: 52 },
  { state: 'Maharashtra', totalArea: 30758, agricultural: 18200, forest: 6162, water: 1520, urban: 1800, other: 3076, district: 36 },
  { state: 'Uttar Pradesh', totalArea: 24093, agricultural: 17460, forest: 1680, water: 1630, urban: 1240, other: 2083, district: 75 },
  { state: 'Gujarat', totalArea: 19602, agricultural: 10890, forest: 2027, water: 1800, urban: 1100, other: 3785, district: 33 },
  { state: 'Karnataka', totalArea: 19179, agricultural: 10870, forest: 4310, water: 1100, urban: 940, other: 1959, district: 31 },
  { state: 'Andhra Pradesh', totalArea: 16279, agricultural: 9620, forest: 2946, water: 1080, urban: 860, other: 1773, district: 26 },
  { state: 'Odisha', totalArea: 15571, agricultural: 6830, forest: 5841, water: 1020, urban: 420, other: 1460, district: 30 },
  { state: 'Chhattisgarh', totalArea: 13519, agricultural: 5680, forest: 5560, water: 840, urban: 380, other: 1059, district: 33 },
  { state: 'Tamil Nadu', totalArea: 13006, agricultural: 6480, forest: 2629, water: 960, urban: 1480, other: 1457, district: 38 },
  { state: 'Telangana', totalArea: 11218, agricultural: 5890, forest: 2762, water: 940, urban: 680, other: 946, district: 33 },
  { state: 'Bihar', totalArea: 9416, agricultural: 5640, forest: 629, water: 1140, urban: 620, other: 1387, district: 38 },
  { state: 'West Bengal', totalArea: 8875, agricultural: 5390, forest: 1254, water: 1270, urban: 980, other: 981, district: 23 },
  { state: 'Jharkhand', totalArea: 7960, agricultural: 2830, forest: 3472, water: 560, urban: 320, other: 778, district: 24 },
  { state: 'Punjab', totalArea: 5036, agricultural: 4180, forest: 184, water: 420, urban: 480, other: 772, district: 23 },
  { state: 'Haryana', totalArea: 4421, agricultural: 3620, forest: 160, water: 340, urban: 560, other: 741, district: 22 },
  { state: 'Delhi', totalArea: 148, agricultural: 28, forest: 16, water: 12, urban: 82, other: 10, district: 11 },
];

export const STATE_WISE_CHART = [
  { state: 'Rajasthan', area: 342 },
  { state: 'M.P.', area: 308 },
  { state: 'Maharashtra', area: 307 },
  { state: 'U.P.', area: 241 },
  { state: 'Gujarat', area: 196 },
  { state: 'Karnataka', area: 192 },
  { state: 'A.P.', area: 162 },
  { state: 'Odisha', area: 155 },
];

// ─── LAND USE DATA ────────────────────────────────────────────────────────────
export const LAND_USE_DATA = [
  { state: 'Rajasthan', agricultural: 58.9, forest: 9.4, urban: 2.6, industrial: 1.8, water: 3.5, wasteland: 14.2, other: 9.6 },
  { state: 'Madhya Pradesh', agricultural: 51.3, forest: 30.7, urban: 2.3, industrial: 1.5, water: 3.6, wasteland: 7.2, other: 3.4 },
  { state: 'Maharashtra', agricultural: 59.2, forest: 20.0, urban: 5.9, industrial: 2.8, water: 4.9, wasteland: 4.4, other: 2.8 },
  { state: 'Uttar Pradesh', agricultural: 72.5, forest: 7.0, urban: 5.2, industrial: 2.1, water: 6.8, wasteland: 3.8, other: 2.6 },
  { state: 'Gujarat', agricultural: 55.6, forest: 10.3, urban: 5.6, industrial: 4.2, water: 9.2, wasteland: 10.4, other: 4.7 },
  { state: 'Karnataka', agricultural: 56.7, forest: 22.5, urban: 4.9, industrial: 2.3, water: 5.7, wasteland: 5.6, other: 2.3 },
  { state: 'Punjab', agricultural: 83.0, forest: 3.7, urban: 9.5, industrial: 1.9, water: 8.3, wasteland: 1.5, other: 0.6 },
  { state: 'Tamil Nadu', agricultural: 49.8, forest: 20.2, urban: 11.4, industrial: 3.8, water: 7.4, wasteland: 5.1, other: 2.3 },
  { state: 'West Bengal', agricultural: 60.7, forest: 14.1, urban: 11.1, industrial: 3.2, water: 14.3, wasteland: 2.8, other: 2.1 },
  { state: 'Kerala', agricultural: 54.3, forest: 27.6, urban: 8.2, industrial: 2.1, water: 3.9, wasteland: 1.8, other: 2.1 },
];

export const LAND_USE_PIE = [
  { label: 'Agriculture', value: 54.7, color: '#10b981' },
  { label: 'Forest', value: 21.7, color: '#065f46' },
  { label: 'Urban / Built-up', value: 7.9, color: '#6366f1' },
  { label: 'Water Bodies', value: 6.4, color: '#0ea5e9' },
  { label: 'Wasteland', value: 5.6, color: '#f59e0b' },
  { label: 'Industrial', value: 2.1, color: '#f97316' },
  { label: 'Other', value: 1.6, color: '#d1d5db' },
];

// ─── LAND OWNERSHIP DATA ─────────────────────────────────────────────────────
export const LAND_OWNERSHIP_DATA = [
  { state: 'Rajasthan', government: 48.2, private: 33.4, community: 12.6, institutional: 3.4, forest_dept: 2.4 },
  { state: 'Madhya Pradesh', government: 46.1, private: 34.8, community: 11.2, institutional: 3.9, forest_dept: 4.0 },
  { state: 'Maharashtra', government: 42.5, private: 39.2, community: 10.8, institutional: 4.1, forest_dept: 3.4 },
  { state: 'Uttar Pradesh', government: 38.6, private: 45.3, community: 9.4, institutional: 4.2, forest_dept: 2.5 },
  { state: 'Gujarat', government: 41.8, private: 38.9, community: 11.6, institutional: 4.6, forest_dept: 3.1 },
  { state: 'Karnataka', government: 40.3, private: 40.1, community: 11.5, institutional: 4.3, forest_dept: 3.8 },
  { state: 'Tamil Nadu', government: 35.2, private: 46.8, community: 9.6, institutional: 5.6, forest_dept: 2.8 },
  { state: 'West Bengal', government: 34.7, private: 47.9, community: 10.4, institutional: 4.8, forest_dept: 2.2 },
  { state: 'Punjab', government: 30.1, private: 55.6, community: 7.4, institutional: 4.5, forest_dept: 2.4 },
  { state: 'Bihar', government: 36.4, private: 46.2, community: 10.8, institutional: 4.1, forest_dept: 2.5 },
];

export const OWNERSHIP_PIE = [
  { label: 'Government', value: 43.2, color: '#1d4ed8' },
  { label: 'Private', value: 38.6, color: '#10b981' },
  { label: 'Community', value: 12.1, color: '#f97316' },
  { label: 'Institutional', value: 6.1, color: '#8b5cf6' },
];

// ─── LAND RECORDS DATA ────────────────────────────────────────────────────────
export const LAND_RECORDS_DATA = [
  { id: 'LR-0001', state: 'Maharashtra', district: 'Pune', tehsil: 'Haveli', village: 'Manjri', surveyNo: '42/1', area: 2.45, landType: 'Agricultural', ownership: 'Private', lastUpdated: '2026-03-12', status: 'Verified' },
  { id: 'LR-0002', state: 'Maharashtra', district: 'Pune', tehsil: 'Haveli', village: 'Manjri', surveyNo: '42/2', area: 1.80, landType: 'Agricultural', ownership: 'Private', lastUpdated: '2026-03-12', status: 'Verified' },
  { id: 'LR-0003', state: 'Maharashtra', district: 'Nashik', tehsil: 'Dindori', village: 'Vani', surveyNo: '118/A', area: 4.20, landType: 'Forest', ownership: 'Government', lastUpdated: '2025-11-04', status: 'Verified' },
  { id: 'LR-0004', state: 'Rajasthan', district: 'Jaipur', tehsil: 'Amer', village: 'Kanota', surveyNo: '256', area: 3.10, landType: 'Agricultural', ownership: 'Private', lastUpdated: '2026-01-20', status: 'Pending' },
  { id: 'LR-0005', state: 'Rajasthan', district: 'Jodhpur', tehsil: 'Shergarh', village: 'Baori', surveyNo: '88/B', area: 6.80, landType: 'Wasteland', ownership: 'Government', lastUpdated: '2025-09-15', status: 'Verified' },
  { id: 'LR-0006', state: 'Uttar Pradesh', district: 'Lucknow', tehsil: 'Sarojini Nagar', village: 'Malihabad', surveyNo: '33', area: 0.90, landType: 'Residential', ownership: 'Private', lastUpdated: '2026-06-08', status: 'Verified' },
  { id: 'LR-0007', state: 'Uttar Pradesh', district: 'Agra', tehsil: 'Fatehabad', village: 'Pinahat', surveyNo: '72/3', area: 1.60, landType: 'Agricultural', ownership: 'Community', lastUpdated: '2026-02-14', status: 'Verified' },
  { id: 'LR-0008', state: 'Karnataka', district: 'Bengaluru Rural', tehsil: 'Devanahalli', village: 'Nandagudi', surveyNo: '194', area: 5.30, landType: 'Industrial', ownership: 'Institutional', lastUpdated: '2026-04-29', status: 'Verified' },
  { id: 'LR-0009', state: 'Karnataka', district: 'Mysuru', tehsil: 'Nanjangud', village: 'Heballa', surveyNo: '67/C', area: 2.10, landType: 'Agricultural', ownership: 'Private', lastUpdated: '2025-12-18', status: 'Verified' },
  { id: 'LR-0010', state: 'Gujarat', district: 'Ahmedabad', tehsil: 'Daskroi', village: 'Vastral', surveyNo: '301', area: 0.75, landType: 'Residential', ownership: 'Private', lastUpdated: '2026-05-03', status: 'Pending' },
  { id: 'LR-0011', state: 'Gujarat', district: 'Surat', tehsil: 'Choryasi', village: 'Kumbharia', surveyNo: '145/2', area: 3.90, landType: 'Industrial', ownership: 'Private', lastUpdated: '2026-07-11', status: 'Verified' },
  { id: 'LR-0012', state: 'Tamil Nadu', district: 'Coimbatore', tehsil: 'Sulur', village: 'Alandurai', surveyNo: '87', area: 1.20, landType: 'Agricultural', ownership: 'Private', lastUpdated: '2026-01-05', status: 'Verified' },
  { id: 'LR-0013', state: 'Tamil Nadu', district: 'Chennai', tehsil: 'Tondiarpet', village: 'Tondiarpet', surveyNo: '22/A', area: 0.40, landType: 'Commercial', ownership: 'Private', lastUpdated: '2026-08-01', status: 'Verified' },
  { id: 'LR-0014', state: 'West Bengal', district: 'Hooghly', tehsil: 'Arambag', village: 'Bhandarhati', surveyNo: '519', area: 2.80, landType: 'Agricultural', ownership: 'Community', lastUpdated: '2025-10-22', status: 'Under Review' },
  { id: 'LR-0015', state: 'West Bengal', district: 'Bardhaman', tehsil: 'Kalna', village: 'Adisaptagram', surveyNo: '306/1', area: 1.55, landType: 'Agricultural', ownership: 'Private', lastUpdated: '2026-03-28', status: 'Verified' },
  { id: 'LR-0016', state: 'Madhya Pradesh', district: 'Bhopal', tehsil: 'Huzur', village: 'Ratibad', surveyNo: '64/4', area: 4.70, landType: 'Forest', ownership: 'Government', lastUpdated: '2025-07-19', status: 'Verified' },
  { id: 'LR-0017', state: 'Madhya Pradesh', district: 'Indore', tehsil: 'Mhow', village: 'Simrol', surveyNo: '231', area: 0.60, landType: 'Residential', ownership: 'Private', lastUpdated: '2026-06-14', status: 'Verified' },
  { id: 'LR-0018', state: 'Punjab', district: 'Ludhiana', tehsil: 'Samrala', village: 'Ghungrali', surveyNo: '111', area: 2.30, landType: 'Agricultural', ownership: 'Private', lastUpdated: '2026-02-07', status: 'Verified' },
  { id: 'LR-0019', state: 'Haryana', district: 'Gurugram', tehsil: 'Sohna', village: 'Samaspur', surveyNo: '78', area: 1.10, landType: 'Residential', ownership: 'Private', lastUpdated: '2026-07-22', status: 'Pending' },
  { id: 'LR-0020', state: 'Odisha', district: 'Puri', tehsil: 'Brahmagiri', village: 'Sipasarubali', surveyNo: '42', area: 3.40, landType: 'Coastal', ownership: 'Government', lastUpdated: '2026-04-16', status: 'Verified' },
];

export const RECORDS_LAND_TYPES = ['Agricultural', 'Forest', 'Residential', 'Commercial', 'Industrial', 'Wasteland', 'Coastal'];
export const RECORDS_OWNERSHIP_TYPES = ['Private', 'Government', 'Community', 'Institutional'];
export const RECORDS_STATUS_TYPES = ['Verified', 'Pending', 'Under Review'];

// ─── Trend data for state-wise area chart (mocked year series) ───────────────
export const YEAR_TREND = [
  { year: '2020', agricultural: 178.2, forest: 70.8, urban: 18.4 },
  { year: '2021', agricultural: 178.6, forest: 71.0, urban: 19.1 },
  { year: '2022', agricultural: 179.0, forest: 71.2, urban: 19.8 },
  { year: '2023', agricultural: 179.4, forest: 71.4, urban: 20.5 },
  { year: '2024', agricultural: 179.6, forest: 71.5, urban: 21.2 },
  { year: '2025', agricultural: 179.8, forest: 71.6, urban: 21.9 },
];
