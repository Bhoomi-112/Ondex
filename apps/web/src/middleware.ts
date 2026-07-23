import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  verifyAccessCookie,
} from "@/lib/session";
import { ROLE_ROUTE_MAP, type UserRole } from "@/lib/auth-types";

const PROTECTED: Array<{ prefix: string; role: UserRole }> = [
  { prefix: "/startup", role: "founder" },
  { prefix: "/jury", role: "jury" },
  { prefix: "/investor", role: "investor" },
];

const AUTH_PAGES = ["/login", "/signup", "/onboarding", "/apply-founder", "/apply-jury", "/apply-investor"];

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

    if (claims.role !== protectedMatch.role) {
      if (!claims.role) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      const correct = ROLE_ROUTE_MAP[claims.role as UserRole];
      return NextResponse.redirect(new URL(correct, request.url));
    }

    if (claims.onboardingStatus !== "active") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!claims) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }

    const adminWallet = process.env.ADMIN_ADDRESS;
    if (adminWallet && claims.wallet !== adminWallet) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (AUTH_PAGES.some((p) => pathname.startsWith(p)) && claims) {
    if (!claims.role) {
      if (
        !pathname.startsWith("/apply-founder") &&
        !pathname.startsWith("/apply-jury") &&
        !pathname.startsWith("/apply-investor")
      ) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } else if (claims.onboardingStatus !== "active") {
      if (!pathname.startsWith("/onboarding")) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    } else if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup")
    ) {
      return NextResponse.redirect(
        new URL(ROLE_ROUTE_MAP[claims.role as UserRole], request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/startup",
    "/startup/:path*",
    "/jury",
    "/jury/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/signup",
    "/signup/:path*",
    "/onboarding",
    "/onboarding/:path*",
    "/apply-founder",
    "/apply-founder/:path*",
    "/apply-jury",
    "/apply-jury/:path*",
    "/investor",
    "/investor/:path*",
    "/apply-investor",
    "/apply-investor/:path*",
  ],
};
