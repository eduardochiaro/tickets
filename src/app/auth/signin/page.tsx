import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ShowProviders from '@/components/ShowProviders';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { TicketIcon } from '@heroicons/react/24/solid';

export default async function SignIn({ searchParams }: { searchParams: any }) {
  const session = await getServerSession(authOptions);
  const { callbackUrl } = searchParams;
  if (session && callbackUrl) {
    redirect(callbackUrl);
  }
  return (
    <main className="flex items-center justify-center min-h-screen relative">
      <div className="w-full">
        <div className="mx-auto max-w-fit rounded-lg bg-white p-8 ring-1 ring-black ring-opacity-5">
          <TicketIcon
            className="mx-auto h-20 text-sky-600 -rotate-[20deg] hover:-rotate-45 transition-all duration-300 ease-in-out"
            aria-hidden="true"
            title="Tickets"
          />
          <h1 className="text-center text-2xl font-semibold mb-10 mt-6">Login</h1>
          <ShowProviders />
        </div>
      </div>
    </main>
  );
}
