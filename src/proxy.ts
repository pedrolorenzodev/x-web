import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/config/auth";
import { routes } from "@/config/routes";

const guestOnlyPaths: string[] = [routes.login, routes.register];

function redirectHome(request: NextRequest) {
  return NextResponse.redirect(new URL(routes.home, request.url));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (pathname === routes.expiredSession) {
    const response = redirectHome(request);
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
  if (pathname === routes.landing) return redirectHome(request);
  if (guestOnlyPaths.includes(pathname)) {
    return hasSession ? redirectHome(request) : NextResponse.next();
  }
  if (hasSession) return NextResponse.next();
  if (pathname === routes.home) {
    return NextResponse.rewrite(new URL(routes.landing, request.url));
  }
  return redirectHome(request);
}

export const config = {
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
