import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Machine from '@/models/Machine';

export async function GET() {
  try {
    await connectDB();
    // Only fetch active machines
    const machines = await Machine.find({ isActive: true });
    return NextResponse.json(machines);
  } catch (error) {
    console.error('Error fetching machines:', error);
    return NextResponse.json(
      { error: 'Error fetching machines' },
      { status: 500 }
    );
  }
} 