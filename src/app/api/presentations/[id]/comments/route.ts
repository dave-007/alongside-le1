import { NextRequest, NextResponse } from 'next/server';
import { JsonDatabaseAdapter } from '@/lib/db/json-adapter';
import { PresentationRepository } from '@/lib/db/repositories/presentation-repository';
import { BaseEntity } from '@/lib/db/types';

const db = new JsonDatabaseAdapter<BaseEntity>('comments');
const presentationRepository = new PresentationRepository(db);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First check if the presentation exists
    const presentationDb = new JsonDatabaseAdapter<BaseEntity>('presentations');
    const presentationRepo = new PresentationRepository(presentationDb);
    const presentation = await presentationRepo.getPresentationById(params.id);
    
    if (!presentation) {
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
      );
    }
    
    const comments = await presentationRepository.getCommentsByPresentationId(params.id);
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.content) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }
    
    // First check if the presentation exists
    const presentationDb = new JsonDatabaseAdapter<BaseEntity>('presentations');
    const presentationRepo = new PresentationRepository(presentationDb);
    const presentation = await presentationRepo.getPresentationById(params.id);
    
    if (!presentation) {
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
      );
    }
    
    // In a real app, we would validate the user is authenticated
    // and set the userId and userName from the session
    const comment = await presentationRepository.createComment({
      content: body.content,
      presentationId: params.id,
      userId: 'user456', // Mock user ID
      userName: 'Comment User', // Mock user name
    });
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
} 