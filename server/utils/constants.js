const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const USER_ROLES = {
  PUBLIC: 'public',
  RESEARCHER: 'researcher',
  GOVERNMENT: 'government',
  ADMIN: 'admin',
};

const RESEARCH_CATEGORIES = [
  'Land Use & Land Cover', 'Agricultural Land Management', 'Urban Land Development',
  'Forest & Biodiversity', 'Water Bodies & Wetlands', 'Land Disputes & Legal',
  'Climate Vulnerability', 'Infrastructure Development', 'Socio-Economic Analysis',
  'GIS & Remote Sensing', 'Land Governance & Policy', 'Digital Land Records',
  'Land Acquisition & Resettlement', 'Tribal Land Rights', 'Coastal Land Management',
];

const DATASET_CATEGORIES = [
  'Land Records', 'Agriculture', 'Climate', 'Infrastructure', 'Population',
  'Urbanization', 'Land Use', 'Geospatial', 'Socio-Economic',
];

const POLICY_CATEGORIES = [
  'Land Acquisition', 'Land Reform', 'Agricultural Policy', 'Urban Development',
  'Forest Policy', 'Water Management', 'Environmental Policy', 'Infrastructure Policy',
  'Tribal Rights', 'Digital Governance', 'Housing Policy', 'Revenue Policy',
];

const RESEARCH_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PUBLISHED: 'published',
};

const PROJECT_STATUS = {
  PROPOSED: 'proposed',
  ACTIVE: 'active',
  UNDER_REVIEW: 'under_review',
  COMPLETED: 'completed',
};

const INNOVATION_TYPES = {
  HACKATHON: 'hackathon',
  GRANT: 'grant',
  PILOT: 'pilot',
  CHALLENGE: 'challenge',
  COMPETITION: 'competition',
};

module.exports = {
  INDIAN_STATES,
  USER_ROLES,
  RESEARCH_CATEGORIES,
  DATASET_CATEGORIES,
  POLICY_CATEGORIES,
  RESEARCH_STATUS,
  PROJECT_STATUS,
  INNOVATION_TYPES,
};
