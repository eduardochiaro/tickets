//profile page
import UserCard from '@/components/UserCard';

export default async function Page({ params }: { params: { username: string; slug: string } }) {
  const user = await getUserData(params.username);

  return <UserCard user={user} />;
}

async function getUserData(username: string) {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });
  if (!user) {
    throw new Error('Failed to fetch data');
  }
  return user;
}
