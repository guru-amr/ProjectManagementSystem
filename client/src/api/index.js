import api from './axios';

export const register = d => api.post('/auth/register', d);
export const login = d => api.post('/auth/login', d);
export const logout = () => api.post('/auth/logout');

export const getProjects = params => api.get('/projects', { params });
export const getProject = id => api.get(`/projects/${id}`);
export const createProject = d => api.post('/projects', d);
export const updateProject = (id, d) => api.put(`/projects/${id}`, d);
export const deleteProject = id => api.delete(`/projects/${id}`);

export const getTasks = params => api.get('/tasks', { params });
export const getTask = id => api.get(`/tasks/${id}`);
export const createTask = d => api.post('/tasks', d);
export const updateTask = (id, d) => api.put(`/tasks/${id}`, d);
export const deleteTask = id => api.delete(`/tasks/${id}`);

export const getDashboard = () => api.get('/dashboard');
