export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'ORGANIZER';
  facebookId?: string;
  instagramId?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  date: string;
  locationName?: string;
  address?: string;
  city?: string;
  isOnline: boolean;
  imageUrl?: string;
  socialFeed?: SocialPost[];
  lastSync?: string;
  owner: User;
  category?: Category;
  attendees?: Attendee[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Attendee {
  id: string;
  userId: string;
  eventId: string;
  status: string;
  user: User;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook';
  media_url?: string;
  caption?: string;
  permalink?: string;
  timestamp: string;
  media_type?: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  locationName?: string;
  address?: string;
  city?: string;
  isOnline: boolean;
  imageUrl?: string;
  categoryId?: string;
}

export interface SocialConnectPayload {
  platform: 'facebook' | 'instagram';
  accessToken: string;
  userId?: string;
}
