import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import prisma from '@/utils/prisma';
import authOptions from '@/config/nextAuth';
import { getServerSession } from 'next-auth';
import ThemeChanger from '@/components/ThemeChanger';

export default async function Project({ params, children }: { params: { slug: string }; children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <>NO</>;
  }
  const project = await getData(params.slug);

  const navigation = [
    { name: project.title, href: `/p/${project.slug}`, current: false },
    { name: 'My Issues', href: `/p/${project.slug}/me`, current: false },
    { name: 'Team', href: `/p/${project.slug}/team`, current: false },
  ];

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar slug={params.slug} navigation={navigation} />
      <section className="mx-auto container grow flex flex-col px-2 sm:px-6 lg:px-8">{children}</section>
      <footer className="container flex justify-end items-center py-4">
        <ThemeChanger />
      </footer>
    </main>
  );
}

async function getData(slug: string) {
  const project = await prisma.project.findFirst({
    where: {
      slug,
    },
    select: {
      title: true,
      slug: true,
    },
  });
  if (!project) {
    throw new Error('Failed to fetch data');
  }
  return project;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getData(params.slug);
  return { title: product.title + ' | Tickets' };
}
