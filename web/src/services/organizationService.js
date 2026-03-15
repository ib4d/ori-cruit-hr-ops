import api from './api';

export const getOrganizations = (params) => api.get('/organizations', { params });
export const getOrganization = (id) => api.get(`/organizations/${id}`);
export const assignCandidate = (organizationId, candidateId) => api.post(`/organizations/${organizationId}/candidates/${candidateId}`);
