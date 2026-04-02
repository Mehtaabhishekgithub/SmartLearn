import API from './api.js';

export const getNotes = (search = '') => API.get(`/notes?search=${search}`);
export const createNote = (data) => API.post('/notes', data);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data);
export const deleteNote = (id) => API.delete(`/notes/${id}`);