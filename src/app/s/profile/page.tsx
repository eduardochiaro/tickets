//profile page

import UserCard from "@/components/UserCard";
import authOptions from '@/config/nextAuth';
import ExtendedUser from '@/models/ExtendedUser';
import { getServerSession } from 'next-auth';

export default async function Page() {
  const session = await getServerSession(authOptions);
  const user = session?.user as ExtendedUser;
  if (!session) {
    return <>NO</>;
  }
  return (
    <UserCard user={user} />
  );
}
