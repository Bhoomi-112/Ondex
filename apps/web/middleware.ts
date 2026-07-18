import { NextResponse, type NextRequest } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  startup: ["/app/startup"],
  jury: ["/app/jury"],
  investor: ["/app/investor"],
};

const AUTH_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function getSessionFromRequest(req: NextRequest) {
  const cookie = req.headers.get("cookie") ?? "";
  try {
    const res = await fetch(`${AUTH_BASE}/api/v1/auth/me`, {
      headers: { cookie },
      credentials: "include",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as { wallet: string; role: string } | null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/app")) {
    return NextResponse.next();
  }

  const session = await getSessionFromRequest(req);

  if (pathname === "/app/dashboard") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.redirect(
      new URL(`/app/${session.role}/dashboard`, req.url)
    );
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  for (const [role, prefixes] of Object.entries(ROLE_ROUTES)) {
    if (prefixes.some((p) => pathname.startsWith(p))) {
      if (session.role !== role) {
        return NextResponse.redirect(
          new URL(`/app/${session.role}/dashboard`, req.url)
        );
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
