import api from './api';

const researchService = {
  getAll: (params) => api.get('/research', { params }),
  getOne: (id) => api.get(`/research/${id}`),
  create: (formData) => api.post('/research', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/research/${id}`, data),
  delete: (id) => api.delete(`/research/${id}`),
  getMy: () => api.get('/research/my'),
  getPending: () => api.get('/research/pending'),
  approve: (id, data) => api.put(`/research/${id}/approve`, data),
  download: (id) => api.get(`/research/${id}/download`),
};

export default researchService;
