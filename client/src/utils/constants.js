export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export const RESEARCH_CATEGORIES = [
  'Land Use & Land Cover', 'Agricultural Land Management', 'Urban Land Development',
  'Forest & Biodiversity', 'Water Bodies & Wetlands', 'Land Disputes & Legal',
  'Climate Vulnerability', 'Infrastructure Development', 'Socio-Economic Analysis',
  'GIS & Remote Sensing', 'Land Governance & Policy', 'Digital Land Records',
  'Land Acquisition & Resettlement', 'Tribal Land Rights', 'Coastal Land Management',
];

export const DATASET_CATEGORIES = [
  'Land Records', 'Agriculture', 'Climate', 'Infrastructure', 'Population',
  'Urbanization', 'Land Use', 'Geospatial', 'Socio-Economic',
];

export const POLICY_CATEGORIES = [
  'Land Acquisition', 'Land Reform', 'Agricultural Policy', 'Urban Development',
  'Forest Policy', 'Water Management', 'Environmental Policy', 'Infrastructure Policy',
  'Tribal Rights', 'Digital Governance', 'Housing Policy', 'Revenue Policy',
];

export const STATUS_COLORS = {
  published: 'green',
  approved: 'green',
  pending: 'yellow',
  rejected: 'red',
  draft: 'gray',
  active: 'green',
  completed: 'blue',
  proposed: 'purple',
  under_review: 'orange',
  open: 'green',
  closed: 'red',
  upcoming: 'blue',
};

export const ROLE_LABELS = {
  public: 'Public User',
  researcher: 'Researcher',
  government: 'Government Official',
  admin: 'Administrator',
};

export const ROLE_COLORS = {
  public: 'gray',
  researcher: 'blue',
  government: 'green',
  admin: 'red',
};

export const YEARS = Array.from({ length: 15 }, (_, i) => 2024 - i);
