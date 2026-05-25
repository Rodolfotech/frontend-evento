import api from './client';
import type { User, Event, Category, CreateEventPayload, SocialConnectPayload, SocialPost } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ access_token: string; user: User }>('/auth/login', { email, password }),
  register: (data: { email: string; password: string; name: string }) =>
    api.post<{ access_token: string; user: User }>('/auth/register', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
  getInstagramAuthUrl: (state?: string) =>
    api.get<{ url: string }>('/auth/instagram/url', { params: state ? { state } : {} }),
  instagramLogin: (code: string) =>
    api.post<{ access_token: string; user: User }>('/auth/instagram', { code }),
};

export const eventsApi = {
  getAll: (params?: { dateFrom?: string; dateTo?: string; categoryId?: string; city?: string }) =>
    api.get<Event[]>('/events', { params }),
  getBySlug: (slug: string) => api.get<Event>(`/events/${slug}`),
  create: (data: CreateEventPayload) => api.post<Event>('/events', data),
  update: (id: string, data: Partial<CreateEventPayload>) => api.put<Event>(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
  getByOwner: () => api.get<Event[]>('/events/my'),
};

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
};

export const attendeesApi = {
  register: (eventId: string) => api.post('/attendees', { eventId }),
  findByEvent: (eventId: string) => api.get(`/attendees/event/${eventId}`),
  findByUser: () => api.get('/attendees/my'),
  unregister: (eventId: string) => api.delete(`/attendees/${eventId}`),
};

export const socialApi = {
  getInstagramAuthUrl: () => api.get<{ url: string }>('/social/instagram/auth-url'),
  instagramCallback: (code: string) => api.post('/social/instagram/callback', { code }),
  facebookConnect: (data: SocialConnectPayload) => api.post('/social/facebook/connect', data),
  instagramConnect: (data: SocialConnectPayload) => api.post('/social/instagram/connect', data),
  disconnect: (platform: string) => api.delete(`/social/${platform}/disconnect`),
  getStatus: () => api.get<{ facebook: boolean; instagram: boolean }>('/social/status'),
  refreshToken: () => api.post('/social/instagram/refresh'),
  syncFeed: (eventId: string) => api.post(`/social/sync/${eventId}`),
  getUserMedia: () => api.get<SocialPost[]>('/social/instagram/media'),
};

export const usersApi = {
  getProfile: () => api.get<User>('/users/profile'),
  updateProfile: (data: Partial<User>) => api.put<User>('/users/profile', data),
};
