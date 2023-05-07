import Table from '@/components/Table';

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug);
  return (
    <>
      {data && <Table data={data} />}
    </>
  );
}

async function getData(slug: string) {
  const issues = await fetch(`${process.env.NEXTAUTH_URL}/api/projects/${slug}/issues`).then((res) => res.json());
  if (!issues) {
    throw new Error('Failed to fetch data');
  }
  return issues;
}