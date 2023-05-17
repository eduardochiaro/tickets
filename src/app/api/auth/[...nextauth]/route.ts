import NextAuth, { AuthOptions as NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/utils/prisma';
import { User as NextAuthUser } from 'next-auth';

interface ExtendedUser extends NextAuthUser {
  id: string;
  roles: string[];
}

const { GITHUB_ID = '', GITHUB_SECRET = '', GOOGLE_CLIENT_ID = '', GOOGLE_CLIENT_SECRET = '', NEXTAUTH_SECRET = '' } = process.env;

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
        },
      });

      session.user = {
        ...session.user,
        id: token.sub || (user?.id as any),
      } as ExtendedUser; // Cast the session.user object to ExtendedUser

      return {
        ...session,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
