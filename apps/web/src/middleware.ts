import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  verifyAccessCookie,
} from "@/lib/session";
import { ROLE_ROUTE_MAP, type UserRole } from "@/lib/auth-types";

const PROTECTED: Array<{ prefix: string; role: UserRole }> = [
  { prefix: "/startup", role: "founder" },
  { prefix: "/investor", role: "investor" },
  { prefix: "/jury", role: "jury" },
];

const AUTH_PAGES = ["/login", "/signup", "/onboarding", "/apply-jury"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  let claims: Awaited<ReturnType<typeof verifyAccessCookie>> = null;

  try {
    claims = await verifyAccessCookie(token);
  } catch {
    claims = null;
  }

  const protectedMatch = PROTECTED.find((p) => pathname.startsWith(p.prefix));

  if (protectedMatch) {
    if (!claims) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }

    if (claims.onboardingStatus !== "active") {
      const onboarding = new URL("/onboarding", request.url);
      return NextResponse.redirect(onboarding);
    }

    if (!claims.role) {
      return NextResponse.redirect(new URL("/signup/role", request.url));
    }

    if (claims.role !== protectedMatch.role) {
      const correct = ROLE_ROUTE_MAP[claims.role];
      return NextResponse.redirect(new URL(correct, request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!claims) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (AUTH_PAGES.some((p) => pathname.startsWith(p)) && claims) {
    if (!claims.role) {
      if (!pathname.startsWith("/signup/role") && !pathname.startsWith("/apply-jury")) {
        return NextResponse.redirect(new URL("/signup/role", request.url));
      }
    } else if (claims.onboardingStatus !== "active") {
      if (!pathname.startsWith("/onboarding")) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    } else if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      return NextResponse.redirect(
        new URL(ROLE_ROUTE_MAP[claims.role], request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/startup",
    "/startup/:path*",
    "/investor",
    "/investor/:path*",
    "/jury",
    "/jury/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/signup",
    "/signup/:path*",
    "/onboarding",
    "/onboarding/:path*",
    "/apply-jury",
    "/apply-jury/:path*",
  ],
};
