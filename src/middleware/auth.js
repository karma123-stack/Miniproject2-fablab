import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function authMiddleware(req) {
  const token = await getToken({ req });

  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Please login to access this resource' }),
      { status: 401 }
    );
  }

  req.user = token;
  return NextResponse.next();
}

export async function adminMiddleware(req) {
  const token = await getToken({ req });

  if (!token || token.role !== 'admin') {
    return new NextResponse(
      JSON.stringify({ error: 'Access denied. Admin only.' }),
      { status: 403 }
    );
  }

  req.user = token;
  return NextResponse.next();
} 