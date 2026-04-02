import API from './api.js';

export const getProgress = () => API.get('/progress');