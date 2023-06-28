import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/utils/prisma';
import ExtendedUser from '@/models/ExtendedUser';

const { GITHUB_ID = '', GITHUB_SECRET = '', NEXTAUTH_SECRET = '' } = process.env;

const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  session: {
    strategy: 'jwt',
    maxAge: 5 * 60 * 60, // 30 days
  },
  callbacks: {
    session: async ({ session, token }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(token.sub || '0'),
        },
        select: {
          id: true,
          isAdmin: true,
        },
      });

      session.user = {
        ...session.user,
        isAdmin: user?.isAdmin || false,
        id: token.sub || (user?.id as any),
      } as ExtendedUser; // Cast the session.user object to ExtendedUser

      return {
        ...session,
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export default authOptions;
