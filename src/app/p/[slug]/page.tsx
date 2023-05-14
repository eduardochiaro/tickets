import Table from '@/components/Table';

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <Table slug={params.slug} />
    </>
  );
}
