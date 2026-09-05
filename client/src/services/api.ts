import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  verifyEmail: (data: { otp: string }) => api.post('/auth/verify-email', data),
  uploadCollegeId: (formData: FormData) => api.post('/auth/upload-college-id', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  uploadPhoto: (formData: FormData) => api.post('/users/profile/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  addSkill: (data: { name: string }) => api.post('/users/skills', data),
  removeSkill: (id: number) => api.delete(`/users/skills/${id}`),
  addInterest: (data: { name: string }) => api.post('/users/interests', data),
  removeInterest: (id: number) => api.delete(`/users/interests/${id}`),
  addCertificate: (data: any) => api.post('/users/certificates', data),
  addProject: (data: any) => api.post('/users/projects', data),
  addHackathonHistory: (data: any) => api.post('/users/hackathon-history', data),
};

export const eventAPI = {
  getAll: (params?: any) => api.get('/events', { params }),
  getById: (id: number) => api.get(`/events/${id}`),
  getRecommended: () => api.get('/events/recommended'),
  getClosingSoon: () => api.get('/events/closing-soon'),
  getMyRegistrations: () => api.get('/events/my-registrations'),
  getCompatibility: (id: number) => api.get(`/events/${id}/compatibility`),
  create: (data: any) => api.post('/events', data),
  update: (id: number, data: any) => api.put(`/events/${id}`, data),
  remove: (id: number) => api.delete(`/events/${id}`),
  register: (id: number) => api.post(`/events/${id}/register`),
  getRegistrations: (id: number) => api.get(`/events/${id}/registrations`),
};

export const teamAPI = {
  getAll: (params?: any) => api.get('/teams', { params }),
  getById: (id: number) => api.get(`/teams/${id}`),
  getMyTeams: () => api.get('/teams/my-teams'),
  create: (data: any) => api.post('/teams', data),
  update: (id: number, data: any) => api.put(`/teams/${id}`, data),
  remove: (id: number) => api.delete(`/teams/${id}`),
  requestJoin: (id: number, data?: any) => api.post(`/teams/${id}/join`, data),
  getRequests: (id: number) => api.get(`/teams/${id}/requests`),
  handleRequest: (teamId: number, requestId: number, data: { status: string }) => api.put(`/teams/${teamId}/requests/${requestId}`, data),
};

export const clubAPI = {
  getAll: (params?: any) => api.get('/clubs', { params }),
  getById: (id: number) => api.get(`/clubs/${id}`),
  toggleFollow: (id: number) => api.post(`/clubs/${id}/follow`),
  createAnnouncement: (id: number, data: any) => api.post(`/clubs/${id}/announcements`, data),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export const copilotAPI = {
  sendMessage: (data: { message: string; chatId?: number }) => api.post('/copilot/chat', data),
  getChats: () => api.get('/copilot/chats'),
  getChatById: (id: number) => api.get(`/copilot/chats/${id}`),
  deleteChat: (id: number) => api.delete(`/copilot/chats/${id}`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getVerifications: () => api.get('/admin/verifications'),
  handleVerification: (id: number, data: { status: string }) => api.put(`/admin/verifications/${id}`, data),
  getEvents: () => api.get('/admin/events'),
  deleteEvent: (id: number) => api.delete(`/admin/events/${id}`),
};

export const searchAPI = {
  search: (q: string) => api.get('/search', { params: { q } }),
};

export default api;
