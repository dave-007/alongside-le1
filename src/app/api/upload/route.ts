import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload MP4, WebM, or Ogg video.' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 100MB.' },
        { status: 400 }
      );
    }
    
    // Generate a unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename with the original extension
    const originalName = file.name;
    const extension = originalName.split('.').pop() || 'mp4';
    const fileName = `${uuidv4()}.${extension}`;
    
    // Save the file
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'videos');
    const filePath = join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      success: true,
      fileName,
      url: `/uploads/videos/${fileName}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Increase the body size limit for file uploads (default is 4MB)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}; 