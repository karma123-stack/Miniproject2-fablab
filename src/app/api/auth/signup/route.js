import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  console.log('Signup request received');
  
  try {
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // Parse request body
    const body = await req.json();
    console.log('Request body parsed:', { ...body, password: '[REDACTED]' });
    
    const { name, email, password, adminCode } = body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if this is an admin signup
    let role = 'user';
    if (adminCode) {
      // Verify admin code (you should change this to a secure code)
      if (adminCode === process.env.ADMIN_CODE) {
        role = 'admin';
      } else {
        return NextResponse.json(
          { error: 'Invalid admin code' },
          { status: 400 }
        );
      }
    }

    // Create new user
    console.log('Creating new user...');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });
    console.log('User created successfully');

    // Remove password from response
    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    console.log('Sending success response');
    return NextResponse.json(
      { message: 'User registered successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in signup route:', error);
    return NextResponse.json(
      { error: error.message || 'Error registering user' },
      { status: 500 }
    );
  }
} 