export { default } from 'next-auth/middleware';

export const config = { matcher: ['/p/:path*', '/s/:path*'] };
