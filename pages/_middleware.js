import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Token exist, if the user is logged in
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });
  const { pathname } = req.nextUrl;

  // Allow request, if its a request for next-auth or if the token exists
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect to login page, if user has no token and requests a protected route
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
};
