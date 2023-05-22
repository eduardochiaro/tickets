import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ShowProviders from "@/components/ShowProviders";
import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";

export default async function SignIn({ searchParams } : { searchParams: any }) {
  const session = await getServerSession(authOptions);
  const { callbackUrl } = searchParams;
  if (session && callbackUrl) {
    redirect(callbackUrl);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center">
        <ShowProviders />
      </div>
    </main>
  )
}