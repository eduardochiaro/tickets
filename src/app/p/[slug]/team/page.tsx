import Team from '@/components/Team';

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <Team slug={params.slug} />
    </>
  );
}
