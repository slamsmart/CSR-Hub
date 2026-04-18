import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/proposals/buat", "/pengaturan", "/notifikasi"];

// Routes requiring specific roles
const ROLE_ROUTES: Record<string, UserRole[]> = {
  "/admin": ["SUPER_ADMIN", "ADMIN_PLATFORM"],
  "/admin/verifikasi": ["SUPER_ADMIN", "ADMIN_PLATFORM", "VERIFIKATOR"],
  "/admin/audit": ["SUPER_ADMIN", "ADMIN_PLATFORM", "AUDITOR"],
  "/dashboard/perusahaan": ["PERUSAHAAN", "SUPER_ADMIN", "ADMIN_PLATFORM"],
  "/dashboard/pengusul": ["PENGUSUL", "SUPER_ADMIN", "ADMIN_PLATFORM"],
  "/dashboard/verifikator": ["VERIFIKATOR", "SUPER_ADMIN", "ADMIN_PLATFORM"],
  "/dashboard/auditor": ["AUDITOR", "SUPER_ADMIN", "ADMIN_PLATFORM"],
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Check if route needs authentication
  const needsAuth = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (needsAuth && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  for (const [route, roles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!session) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      const userRole = (session.user as any)?.role as UserRole;
      if (!roles.includes(userRole)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  // Redirect logged-in users away from auth pages
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Security headers are added via next.config.ts
  const response = NextResponse.next();

  // Add CSRF protection for state-changing requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host && !origin.includes(host)) {
      // API routes only - check origin
      if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden - Origin mismatch" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  return response;
});

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/auditor/:path*",
    "/verifikator/:path*",
    "/pengusul/:path*",
    "/perusahaan/:path*",
    "/notifikasi/:path*",
    "/pengaturan/:path*",
    "/login",
    "/register",
  ],
};
