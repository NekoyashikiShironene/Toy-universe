import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  if ((request.nextUrl.pathname.startsWith("/_next")) || request.nextUrl.pathname.startsWith("/api"))
    return NextResponse.next();
  
  const token = await getToken({
    req: request,
    secret: process.env.SESSION_SECRET
  });

  if (!token)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/login`);

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
  matcher: [
    "/cart",
    "/payment",
    "/payment-success",
    "/payment-failed",
    "/profile",
    "/order",
    "/order-management",
    "/edit-product",
    "/set-username",
  ],
}
