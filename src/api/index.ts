import api from './client';
import type { User, Event, Category, CreateEventPayload, SocialConnectPayload } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ access_token: string; user: User }>('/auth/login', { email, password }),
  register: (data: { email: string; password: string; name: string }) =>
    api.post<User>('/auth/register', data),
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
  facebookConnect: (data: SocialConnectPayload) => api.post('/social/facebook/connect', data),
  instagramConnect: (data: SocialConnectPayload) => api.post('/social/instagram/connect', data),
  disconnect: (platform: string) => api.delete(`/social/${platform}/disconnect`),
  getStatus: () => api.get<{ facebook: boolean; instagram: boolean }>('/social/status'),
  syncFeed: (eventId: string) => api.post(`/social/sync/${eventId}`),
};

export const usersApi = {
  getProfile: () => api.get<User>('/users/profile'),
  updateProfile: (data: Partial<User>) => api.put<User>('/users/profile', data),
};
