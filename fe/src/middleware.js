import { NextResponse } from "next/server";
import { AUTH_SESSION_TOKEN, AUTH_ROLE } from "../constants/tokenKey";

export function middleware(request) {
  const url = request.nextUrl;
  const authToken = request.cookies.get(AUTH_SESSION_TOKEN);
  const role = request.cookies.get("auth_role")?.value;

  const adminPublicPaths = ["/admin/login"];

  const customerPublicPaths = ["/", "/signin", "/signup",];

  const adminProtectedPaths = ["/admin/dashboard", "/dashboard"];

  const customerProtectedPaths = ["/documents"];

  if (authToken && role) {
    if (role === "Admin" && adminPublicPaths.includes(url.pathname)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (role === "Customer" && customerPublicPaths.includes(url.pathname)) {
      return NextResponse.redirect(new URL("/documents", request.url));
    }

    if (role === "Admin" && customerProtectedPaths.includes(url.pathname)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (
      role === "Customer" &&
      (adminProtectedPaths.includes(url.pathname) ||
        adminPublicPaths.includes(url.pathname))
    ) {
      return NextResponse.redirect(new URL("/documents", request.url));
    }

    return NextResponse.next();
  }

  if (!authToken) {
    if (
      adminPublicPaths.includes(url.pathname) ||
      customerPublicPaths.includes(url.pathname)
    ) {
      return NextResponse.next();
    }

    if (adminProtectedPaths.includes(url.pathname)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (customerProtectedPaths.includes(url.pathname)) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/",
    "/signup",
    "/signin",
    "/documents",
    "/admin/:path*",
  ],
};
