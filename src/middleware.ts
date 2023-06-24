import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const { NEXTAUTH_URL = '' } = process.env;

export default async function middleware(request: NextRequestWithAuth) {
  const response = NextResponse.next();
  const { pathname, search, origin, basePath } = request.nextUrl;
  const signInPage = '/auth/signin';
  const errorPage = '/api/auth/signin';
  const publicPaths = ["/_next", "/favicon.ico", "/api/auth"];

  if (
    [signInPage, errorPage].includes(pathname) ||
    publicPaths.some((p) => pathname.startsWith(p))
  ) {
    return response;
  }

  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (request.nextUrl.pathname.startsWith('/api')) {
    if (!token) {
      return new NextResponse(JSON.stringify({ success: false, message: 'authentication failed' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }
    response.headers.append('Access-Control-Allow-Origin', NEXTAUTH_URL);
    response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } else {
    if (!request.nextUrl.pathname.startsWith('/auth')) {
      if (!token) {
        const signInUrl = new URL(`${basePath}${signInPage}`, origin)
        signInUrl.searchParams.append(
          "callbackUrl",
          `${basePath}${pathname}${search}`
        )
        return NextResponse.redirect(signInUrl)
      }
    }
  }
  //...
  return response;
}
