import { v4 as uuidv4 } from 'uuid';
import { BaseEntity, DatabaseAdapter } from '../types';
import { Presentation, Comment, ContentRequest } from '../entities/presentation';

export class PresentationRepository {
  private db: DatabaseAdapter<BaseEntity>;
  private presentationsCollection = 'presentations';
  private commentsCollection = 'comments';
  private requestsCollection = 'contentRequests';

  constructor(databaseAdapter: DatabaseAdapter<BaseEntity>) {
    this.db = databaseAdapter;
  }

  // Presentation methods
  async getAllPresentations(): Promise<Presentation[]> {
    return this.db.findMany() as Promise<Presentation[]>;
  }

  async getPresentationById(id: string): Promise<Presentation | null> {
    return this.db.findById(id) as Promise<Presentation | null>;
  }

  async createPresentation(presentation: Omit<Presentation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Presentation> {
    const now = new Date().toISOString();
    const newPresentation: Presentation = {
      id: uuidv4(),
      ...presentation,
      createdAt: now,
      updatedAt: now,
    };
    
    return this.db.create(newPresentation) as Promise<Presentation>;
  }

  async updatePresentation(id: string, presentation: Partial<Presentation>): Promise<Presentation | null> {
    const existingPresentation = await this.getPresentationById(id);
    if (!existingPresentation) return null;

    return this.db.update(id, presentation) as Promise<Presentation>;
  }

  async deletePresentation(id: string): Promise<boolean> {
    try {
      await this.db.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting presentation:', error);
      return false;
    }
  }

  // Comment methods
  async getCommentsByPresentationId(presentationId: string): Promise<Comment[]> {
    return this.db.findMany({ presentationId } as Partial<BaseEntity>) as Promise<Comment[]>;
  }

  async createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const now = new Date().toISOString();
    const newComment: Comment = {
      id: uuidv4(),
      ...comment,
      createdAt: now,
      updatedAt: now,
    };
    
    return this.db.create(newComment) as Promise<Comment>;
  }

  // Content Request methods
  async createContentRequest(request: Omit<ContentRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<ContentRequest> {
    const now = new Date().toISOString();
    const newRequest: ContentRequest = {
      id: uuidv4(),
      ...request,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    
    return this.db.create(newRequest) as Promise<ContentRequest>;
  }

  async getContentRequestsByPresentationId(presentationId: string): Promise<ContentRequest[]> {
    return this.db.findMany({ presentationId } as Partial<BaseEntity>) as Promise<ContentRequest[]>;
  }
} 