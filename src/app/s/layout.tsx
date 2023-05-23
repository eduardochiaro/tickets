import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import prisma from '@/utils/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export default async function Project({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <>NO</>;
  }
  const navigation = [
    { name: 'Profile', href: `/s/profile`, current: true },
    { name: 'Projects', href: `/s/projects`, current: false },
  ];
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar navigation={navigation} />
      <section className="mx-auto container px-2 sm:px-6 lg:px-8">{children}</section>
    </main>
  );
}

export const metadata = {
  title: 'Profile | Tickets',
};
