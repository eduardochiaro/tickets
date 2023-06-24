//profile page

import authOptions from '@/config/nextAuth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <>NO</>;
  }
  return (
    <div className="mx-auto max-w-xl mt-7 rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden bg-gray-50">
      <div className="flex flex-col items-center justify-center bg-gray-100 border-b border-gray-300 p-5">
        {session.user && (
          <Image
            src={session.user.image as string}
            className="h-18 w-18 rounded-full"
            width={200}
            height={200}
            alt={`Logged as ${session.user.name}`}
            title={`Logged as ${session.user.name}`}
          />
        )}
      </div>
      <div className="p-5">
        <h1 className="text-3xl">Profile</h1>
        <p>{session.user?.name}</p>
        <p>{session.user?.email}</p>
      </div>
    </div>
  );
}
