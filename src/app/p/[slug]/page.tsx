import Table from '@/components/Table';

export default async function Page({ params }: { params: { slug: string } }) {
  const actions = await getData(params.slug);

  return (
    <>
      <Table slug={params.slug} actions={actions} type="all" />
    </>
  );
}

async function getData(slug: string) {
  const actions = await prisma.projectActionFlow.findMany({
    where: {
      project: {
        slug,
      },
    },
    include: {
      originalStatus: {
        select: {
          title: true,
        },
      },
      finalStatus: {
        select: {
          title: true,
        },
      },
    },
  });
  if (!actions) {
    throw new Error('Failed to fetch data');
  }
  return actions;
}
