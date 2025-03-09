import { NextRequest, NextResponse } from 'next/server';
import { JsonDatabaseAdapter } from '@/lib/db/json-adapter';
import { PresentationRepository } from '@/lib/db/repositories/presentation-repository';
import { BaseEntity } from '@/lib/db/types';

const db = new JsonDatabaseAdapter<BaseEntity>('contentRequests');
const presentationRepository = new PresentationRepository(db);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.requestType || !body.description) {
      return NextResponse.json(
        { error: 'Request type and description are required' },
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
    const contentRequest = await presentationRepository.createContentRequest({
      presentationId: params.id,
      requestType: body.requestType,
      description: body.description,
      offerAmount: body.offerAmount || 0,
      userId: 'user789', // Mock user ID
      userName: 'Request User', // Mock user name
    });
    
    return NextResponse.json(contentRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating content request:', error);
    return NextResponse.json(
      { error: 'Failed to create content request' },
      { status: 500 }
    );
  }
}

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
    
    // In a real app, we would check if the user is the author of the presentation
    // if (presentation.authorId !== authenticatedUserId) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 403 }
    //   );
    // }
    
    const requests = await presentationRepository.getContentRequestsByPresentationId(params.id);
    
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching content requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content requests' },
      { status: 500 }
    );
  }
} 