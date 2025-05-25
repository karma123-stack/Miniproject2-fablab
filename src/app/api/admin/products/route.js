import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function POST(req) {
  try {
    // Temporarily remove admin check for debugging
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const body = await req.json();
    console.log('Received product data:', body);

    const { name, description, price, category, image } = body;

    if (!name || !description || !price || !category || !image) {
      console.log('Missing required fields:', { name, description, price, category, image });
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Convert price to number, removing any currency symbols and commas
    const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    
    if (isNaN(numericPrice)) {
      return NextResponse.json(
        { error: 'Invalid price format' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('Connected to database');

    const product = await Product.create({
      name,
      description,
      price: numericPrice,
      category,
      image,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Product created successfully:', product);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Detailed error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 