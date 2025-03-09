import { NextRequest, NextResponse } from 'next/server';
import { JsonDatabaseAdapter } from '@/lib/db/json-adapter';
import { PresentationRepository } from '@/lib/db/repositories/presentation-repository';
import { BaseEntity } from '@/lib/db/types';

const db = new JsonDatabaseAdapter<BaseEntity>('presentations');
const presentationRepository = new PresentationRepository(db);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const presentation = await presentationRepository.getPresentationById(params.id);
    
    if (!presentation) {
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
      );
    }
    
    // If videoType is not specified, determine it from the URL
    if (!presentation.videoType) {
      if (!presentation.videoUrl) {
        presentation.videoType = 'none';
      } else if (presentation.videoUrl.includes('youtube.com') || presentation.videoUrl.includes('youtu.be')) {
        presentation.videoType = 'youtube';
      } else if (presentation.videoUrl.startsWith('/uploads/')) {
        presentation.videoType = 'upload';
      } else {
        presentation.videoType = 'none';
      }
    }
    
    // In a real implementation, we would also fetch comments
    // const comments = await commentRepository.getCommentsByPresentationId(params.id);
    
    return NextResponse.json({
      ...presentation,
      comments: [] // We would include real comments here
    });
  } catch (error) {
    console.error('Error fetching presentation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presentation' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate that the presentation exists
    const existingPresentation = await presentationRepository.getPresentationById(params.id);
    if (!existingPresentation) {
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
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
    
    // In a real app, we would validate that the user is the author
    // if (existingPresentation.authorId !== authenticatedUserId) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 403 }
    //   );
    // }
    
    const updatedPresentation = await presentationRepository.updatePresentation(
      params.id,
      {
        title: body.title,
        summary: body.summary,
        videoUrl: body.videoUrl,
        videoType: body.videoType,
        videoFileName: body.videoFileName,
        githubUrl: body.githubUrl,
      }
    );
    
    return NextResponse.json(updatedPresentation);
  } catch (error) {
    console.error('Error updating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to update presentation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate that the presentation exists
    const existingPresentation = await presentationRepository.getPresentationById(params.id);
    if (!existingPresentation) {
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
      );
    }
    
    // In a real app, we would validate that the user is the author
    // if (existingPresentation.authorId !== authenticatedUserId) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 403 }
    //   );
    // }
    
    const success = await presentationRepository.deletePresentation(params.id);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Presentation deleted successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete presentation' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting presentation:', error);
    return NextResponse.json(
      { error: 'Failed to delete presentation' },
      { status: 500 }
    );
  }
} 