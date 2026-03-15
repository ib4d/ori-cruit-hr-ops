import api from './api';

export const getTemplates = (params) => api.get('/message-templates', { params });
export const sendMessage = (data) => api.post('/messages/send', data);
export const getMessageHistory = (candidateId) => api.get(`/messages/candidate/${candidateId}`);
