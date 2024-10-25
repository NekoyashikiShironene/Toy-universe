import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectToDatabase from './utils/db';
import { IUser } from './types/db';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.SESSION_SECRET
  });

  if (token?.provider === "google" && token?.role === "cus") {
    const connection = await connectToDatabase();
    const [results] = await connection.query<IUser[]>("SELECT username FROM customer WHERE cus_id = ?", [token.id]);
    const result = results[0];
    connection.release();

    if (!result.username) {
      return NextResponse.redirect('/set-username');
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!set-username))"],
}
