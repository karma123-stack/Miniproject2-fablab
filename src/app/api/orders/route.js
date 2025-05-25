import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { product, quantity, address, phoneNumber, totalPrice } = await request.json();
    console.log('Received order data:', { product, quantity, address, phoneNumber, totalPrice });

    if (!product || !quantity || !address || !phoneNumber || !totalPrice) {
      console.log('Missing required fields:', { product, quantity, address, phoneNumber, totalPrice });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    console.log('Connected to database successfully');

    // Fetch product details to get the name
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const productUrl = `${baseUrl}/api/products/${product}`;
    console.log('Fetching product from:', productUrl);
    
    const productResponse = await fetch(productUrl);
    if (!productResponse.ok) {
      console.error('Failed to fetch product:', await productResponse.text());
      throw new Error('Failed to fetch product details');
    }
    const productData = await productResponse.json();
    console.log('Product data fetched:', productData);

    const order = await Order.create({
      userId: session.user.id,
      productId: product,
      productName: productData.title,
      quantity,
      address,
      phoneNumber,
      totalPrice,
      status: 'pending'
    });
    console.log('Order created successfully:', order);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 