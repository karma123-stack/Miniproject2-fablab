import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Machine from '@/models/Machine';

// GET all machines
export async function GET() {
  try {
    await connectToDatabase();
    const machines = await Machine.find({});
    return NextResponse.json(machines);
  } catch (error) {
    console.error('Error fetching machines:', error);
    return NextResponse.json(
      { error: 'Error fetching machines' },
      { status: 500 }
    );
  }
}

// POST new machine
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, image, description, capabilities, requirements, icon } = body;

    // Validate required fields
    if (!name || !image || !description || !capabilities || !requirements || !icon) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const machine = await Machine.create({
      name,
      image,
      description,
      capabilities,
      requirements,
      icon,
      isActive: true
    });

    return NextResponse.json(machine, { status: 201 });
  } catch (error) {
    console.error('Error creating machine:', error);
    return NextResponse.json(
      { error: 'Error creating machine' },
      { status: 500 }
    );
  }
} 