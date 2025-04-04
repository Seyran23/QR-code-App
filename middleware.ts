import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, refreshTokens } from "./actions/auth-actions";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  try {
    if (pathname === "/") {
      const accessToken = await getAccessToken();
      const redirectPath = accessToken ? "/dashboard" : "/login";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    const publicPaths = ["/login", "/register"];
    const protectedPaths = ["/dashboard"];
    const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));
    const isPublicPath = publicPaths.includes(pathname);

    let accessToken = await getAccessToken();

    if (!accessToken && isProtectedPath) {
      try {
        accessToken = await refreshTokens();
      } catch  {
        console.log("Refresh attempt failed, redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (accessToken && isPublicPath) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!accessToken && isProtectedPath) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    const response = NextResponse.next();
    
    return response;

  } catch (error) {
    console.error("Middleware error:", error);
    
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    
    return response;
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
};