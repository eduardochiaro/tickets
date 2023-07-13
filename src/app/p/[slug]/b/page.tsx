import type { Metadata } from 'next';
import Board from '@/components/Board';

export default async function Page({ params }: { params: { slug: string } }) {

  return (
    <>
      <Board slug={params.slug} />
    </>
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
  return { title: product.title + ' | Board' };
}
