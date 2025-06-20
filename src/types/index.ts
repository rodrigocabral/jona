export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  onboardingCompleted: boolean;
  instagramConnected: boolean;
  createdAt: Date;
}

export interface OnboardingResponse {
  question: string;
  answer: string;
}

export interface Connection {
  id: string;
  name: string;
  avatar?: string;
  compatibility: number;
  commonInterests: string[];
  lastActive: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface EmotionalEntry {
  id: string;
  userId: string;
  emotion: 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious' | 'calm';
  text: string;
  audioUrl?: string;
  timestamp: Date;
}

export interface Event {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: Date;
  reminderSet: boolean;
  googleCalendarId?: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  tags: string[];
  memberCount: number;
  isJoined: boolean;
  createdAt: Date;
}

export interface LiveEvent {
  id: string;
  communityId: string;
  title: string;
  description: string;
  scheduledAt: Date;
  participantCount: number;
  isJoined: boolean;
}
