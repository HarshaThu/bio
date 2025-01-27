import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAuth = !!token;

  if (req.nextUrl.pathname.startsWith("/cart") || req.nextUrl.pathname.startsWith("/chat")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/chat/:path*",
    "/api/chat/:path*",
    {
      source: "/((?!api/auth).*)",
      has: [
        {
          type: "query",
          key: "chat",
          value: "true"
        }
      ]
    }
  ]
};
