import { NextRequest, NextResponse } from 'next/server';
import { JsonDatabaseAdapter } from '@/lib/db/json-adapter';
import { PresentationRepository } from '@/lib/db/repositories/presentation-repository';
import { BaseEntity } from '@/lib/db/types';

const db = new JsonDatabaseAdapter<BaseEntity>('presentations');
const presentationRepository = new PresentationRepository(db);

export async function GET(request: NextRequest) {
  try {
    const presentations = await presentationRepository.getAllPresentations();
    
    // Handle pagination and search in a real implementation
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Simple pagination implementation
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Simple search implementation
    let filteredPresentations = presentations;
    if (search) {
      filteredPresentations = presentations.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.summary.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const paginatedPresentations = filteredPresentations.slice(startIndex, endIndex);
    
    return NextResponse.json({
      data: paginatedPresentations,
      pagination: {
        total: filteredPresentations.length,
        page,
        limit,
        pages: Math.ceil(filteredPresentations.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching presentations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presentations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.summary) {
      return NextResponse.json(
        { error: 'Title and summary are required' },
        { status: 400 }
      );
    }
    
    // Validate video type
    const validVideoTypes = ['youtube', 'upload', 'none'];
    if (body.videoType && !validVideoTypes.includes(body.videoType)) {
      return NextResponse.json(
        { error: 'Invalid video type' },
        { status: 400 }
      );
    }
    
    // Validate YouTube URL if video type is YouTube
    if (body.videoType === 'youtube' && !body.videoUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required when video type is YouTube' },
        { status: 400 }
      );
    }
    
    // In a real app, we would validate the user is authenticated
    // and set the authorId and authorName from the session
    const presentation = await presentationRepository.createPresentation({
      title: body.title,
      summary: body.summary,
      videoUrl: body.videoUrl || '',
      videoType: body.videoType || 'none',
      videoFileName: body.videoFileName,
      githubUrl: body.githubUrl || '',
      authorId: 'user123', // Mock user ID
      authorName: 'Demo User', // Mock user name
    });
    
    return NextResponse.json(presentation, { status: 201 });
  } catch (error) {
    console.error('Error creating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to create presentation' },
      { status: 500 }
    );
  }
} 