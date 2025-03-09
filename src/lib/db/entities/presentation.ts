import { BaseEntity } from '../types';

export interface Presentation extends BaseEntity {
  title: string;
  summary: string;
  videoUrl: string;
  videoType: 'youtube' | 'upload' | 'none';
  videoFileName?: string;
  githubUrl: string;
  authorId: string;
  authorName: string;
}

export interface Comment extends BaseEntity {
  content: string;
  userId: string;
  userName: string;
  presentationId: string;
}

export interface ContentRequest extends BaseEntity {
  presentationId: string;
  requestType: string;
  description: string;
  offerAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  userId: string;
  userName: string;
} 