import API from './api.js';

export const generateQuiz = (data) => API.post('/quiz/generate', data);
export const submitQuiz = (id, answers) => API.post(`/quiz/submit/${id}`, { answers });
export const getMyQuizzes = (page = 1) => API.get(`/quiz?page=${page}`);
export const deleteQuiz = (id) => API.delete(`/quiz/${id}`);