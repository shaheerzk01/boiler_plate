// /frontend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Define which paths should be checked by the middleware
export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"], // protect all dashboard routes
};
