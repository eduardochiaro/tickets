import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export default async function Project({ params, children }: { params: { slug: string }; children: React.ReactNode }) {
  const data = await getData(params.slug);
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar name={data.title} />
      <section className="mx-auto container px-2 sm:px-6 lg:px-8">{children}</section>
    </main>
  );
}

async function getData(slug: string) {
  const project = await fetch(`${process.env.NEXTAUTH_URL}/api/projects/${slug}`).then((res) => res.json());
  if (!project) {
    throw new Error('Failed to fetch data');
  }
  return project;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getData(params.slug);
  return { title: product.title + ' | Tickets' };
}
