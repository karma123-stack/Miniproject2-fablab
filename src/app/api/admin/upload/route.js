import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = path.extname(originalName);
    const filename = `machine_${timestamp}${extension}`;

    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    // Ensure machines directory exists
    const machinesDir = path.join(publicDir, 'machines');
    if (!fs.existsSync(machinesDir)) {
      await mkdir(machinesDir, { recursive: true });
    }

    const filepath = path.join(machinesDir, filename);
    
    // Write the file
    await writeFile(filepath, buffer);

    // Return the public URL
    return NextResponse.json({ 
      url: `/machines/${filename}`,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
} 