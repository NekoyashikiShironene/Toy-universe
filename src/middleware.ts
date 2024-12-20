import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const empOnlyPaths = [
  "/order-management",
  "/edit-product",
]

export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  const responseNext = NextResponse.next(
    {
      request: {
        headers: requestHeaders
      }
    }
  );

  // ignore some requests
  if (
      req.nextUrl.pathname.startsWith("/_next") || 
      req.nextUrl.pathname.startsWith("/api") ||
      req.nextUrl.pathname.startsWith("/products")
    )
    return responseNext;
  
  // get cookie & session
  const token = await getToken({
    req: req,
    secret: process.env.SESSION_SECRET
  });

  // If user has not logged in yet then redirect to login page
  if (!token)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/login`);


  // Protect employee routes from customers or guests
  if (token?.role !== "emp" && empOnlyPaths.some(path => req.nextUrl.pathname.startsWith(path)))
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/`);


  // Force new user who logged in with google to set their username
  if (token?.provider === "google" && token?.role === "cus" && !req.nextUrl.pathname.startsWith("/set-username")) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/validate/isempty?attr=username&id=${token.id}`, { cache: "no-store" });
    const empty = (await res.json())?.value

    if (empty) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/set-username`);
    }

  }

  return responseNext;
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

    // No authen required use for doing pagination
    "/products"
  ],
}
