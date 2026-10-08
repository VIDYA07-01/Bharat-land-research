import api from './api';

const datasetService = {
  getAll: (params) => api.get('/datasets', { params }),
  getOne: (id) => api.get(`/datasets/${id}`),
  create: (formData) => api.post('/datasets', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/datasets/${id}`, data),
  delete: (id) => api.delete(`/datasets/${id}`),
  getMy: () => api.get('/datasets/my'),
  approve: (id, data) => api.put(`/datasets/${id}/approve`, data),
  download: (id) => api.get(`/datasets/${id}/download`),
};

export default datasetService;
