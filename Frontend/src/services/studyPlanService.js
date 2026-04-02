import API from './api.js';

export const generatePlan = (data) => API.post('/study-plan/generate', data);
export const getMyPlans = () => API.get('/study-plan');
export const markTopicComplete = (planId, topicIndex) => API.patch(`/study-plan/${planId}/topic/${topicIndex}`);
export const deletePlan = (id) => API.delete(`/study-plan/${id}`);