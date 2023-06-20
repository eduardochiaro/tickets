import CreateIssue from '@/components/CreateIssue';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890abcdef', 16);

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <div className="px-4 md:px-10 py-4 md:py-7">
        <div className=" w-1/2 mx-auto">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">New Issue</p>
          <CreateIssue slug={params.slug} />
        </div>
      </div>
    </>
  );
}
