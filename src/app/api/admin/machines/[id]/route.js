import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/auth.config';
import connectDB from '@/lib/db';
import Machine from '@/models/Machine';
import { connectToDatabase } from '@/lib/mongodb';

// GET single machine
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const machine = await Machine.findById(params.id);
    
    if (!machine) {
      return NextResponse.json(
        { error: 'Machine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(machine);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching machine' },
      { status: 500 }
    );
  }
}

// PUT update machine
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, image, description, capabilities, requirements, icon, isActive } = body;

    await connectDB();
    
    const machine = await Machine.findById(params.id);
    
    if (!machine) {
      return NextResponse.json(
        { error: 'Machine not found' },
        { status: 404 }
      );
    }

    // Update machine fields
    machine.name = name || machine.name;
    machine.image = image || machine.image;
    machine.description = description || machine.description;
    machine.capabilities = capabilities || machine.capabilities;
    machine.requirements = requirements || machine.requirements;
    machine.icon = icon || machine.icon;
    machine.isActive = isActive !== undefined ? isActive : machine.isActive;

    await machine.save();

    return NextResponse.json(machine);
  } catch (error) {
    console.error('Error updating machine:', error);
    return NextResponse.json(
      { error: 'Error updating machine' },
      { status: 500 }
    );
  }
}

// DELETE machine
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const machine = await Machine.findById(params.id);

    if (!machine) {
      return NextResponse.json(
        { error: 'Machine not found' },
        { status: 404 }
      );
    }

    await machine.deleteOne();
    
    return NextResponse.json(
      { message: 'Machine deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting machine:', error);
    return NextResponse.json(
      { error: 'Error deleting machine' },
      { status: 500 }
    );
  }
} 