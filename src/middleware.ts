import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectToDatabase from './utils/db';
import { IUser } from './types/db';

export async function middleware(request: NextRequest) {
  
  if (request.nextUrl.pathname.startsWith("/_next")) 
    return NextResponse.next();
  
  const token = await getToken({
    req: request,
    secret: process.env.SESSION_SECRET
  });

  if (token?.provider === "google" && token?.role === "cus") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/validate/isempty?attr=username&id=${token.id}`);
    const empty = (await res.json())?.value

    if (empty) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/set-username`);
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!set-username).*)"],
}
