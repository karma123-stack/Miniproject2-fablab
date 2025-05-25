import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '../../../models/Event';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';

// Helper function to check if user is admin
async function isAdmin(req) {
  const session = await getServerSession(authOptions, req);
  return session?.user?.role === 'admin';
}

// GET all events
export async function GET(req) {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ date: 1 });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Error fetching events' },
      { status: 500 }
    );
  }
}

// POST new event
export async function POST(req) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, date, time, location, description, image, capacity } = body;

    // Validate required fields
    if (!title || !date || !time || !location || !description || !image || !capacity) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const event = await Event.create({
      title,
      date: new Date(date),
      time,
      location,
      description,
      image,
      capacity,
      status: 'upcoming'
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Error creating event' },
      { status: 500 }
    );
  }
}

// PUT update event
export async function PUT(req) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, date, time, location, description, image, capacity, status } = body;

    await connectToDatabase();
    const event = await Event.findByIdAndUpdate(
      id,
      {
        title,
        date: new Date(date),
        time,
        location,
        description,
        image,
        capacity,
        status
      },
      { new: true }
    );

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Error updating event' },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(req) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Error deleting event' },
      { status: 500 }
    );
  }
} 