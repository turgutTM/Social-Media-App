import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      console.log("Authentication:", payload);

      if (["/login", "/register"].includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
      }

    
      return NextResponse.next();
    } catch (error) {
      console.error("Authentication error:", error);

      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  if (!token && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/"], 
};
