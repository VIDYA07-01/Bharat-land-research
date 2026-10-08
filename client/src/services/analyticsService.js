import api from './api';

const analyticsService = {
  getLandUseTrends: () => api.get('/analytics/land-use'),
  getClimateResilience: () => api.get('/analytics/climate'),
  getLandDisputes: () => api.get('/analytics/disputes'),
  getPolicyPerformance: () => api.get('/analytics/policy-performance'),
  getPlatformStats: () => api.get('/analytics/platform-stats'),
  getAdminStats: () => api.get('/analytics/admin-stats'),
};

export default analyticsService;
