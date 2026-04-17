import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { adminRoutes, demoAuthCookie, protectedRoutes } from "@/lib/constants";
import { isDemoMode } from "@/lib/env";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsProtection = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!needsProtection) {
    return NextResponse.next();
  }

  if (isDemoMode) {
    const viewer = request.cookies.get(demoAuthCookie)?.value;
    if (!viewer) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (adminRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`)) && viewer !== "profile_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api/health).*)"],
};
