import api from './api';

export const getPipelineSummary = () => api.get('/dashboard/pipeline-summary');
export const getKpis = () => api.get('/dashboard/kpis');
export const getLegalQueuePreview = () => api.get('/dashboard/legal-queue-preview');
export const getTodayActions = () => api.get('/dashboard/today-actions');
export const getIntegrationsStatus = () => api.get('/dashboard/integrations-status');
