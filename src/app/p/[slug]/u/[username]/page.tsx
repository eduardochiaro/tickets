//profile page
import Image from 'next/image';

export default async function Page({ params }: { params: { username: string, slug: string }}) {
  const user = await getUserData(params.username);

  return (
    <div className="mx-auto max-w-sm mt-7 rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-5">
        {user.image && (
          <Image
            src={user.image as string}
            className="h-18 w-18 rounded-full"
            width={200}
            height={200}
            alt={`Logged as ${user.name}`}
            title={`Logged as ${user.name}`}
          />
        )}
      </div>
      <div className="p-5">
        <h1 className="text-3xl">Profile</h1>
        <p>{user?.name}</p>
        <p>{user?.email}</p>
      </div>
    </div>
  );
}

async function getUserData(username: string) {
  const user = await prisma.user.findFirst({
    where: {
      username,
    }
  });
  if (!user) {
    throw new Error('Failed to fetch data');
  }
  return user;
}