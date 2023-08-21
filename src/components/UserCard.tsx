import Image from 'next/image';

export default async function UserCard({ user }: { user: any}) {

  return (
    <div className="mx-auto max-w-sm mt-7 min-w-fit rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden bg-gray-100 dark:bg-gray-700">
      <div className="h-52 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 relative z-0">
        <Image src="/images/bg-card-612x612.jpg" className="z-0" fill={true} alt="Cover" />
      </div>
      <div className="flex items-start p-5 -mt-16 relative z-10">
        {user.image && (
          <Image
            src={user.image as string}
            className="h-15 w-15 rounded-full bg-white"
            width={200}
            height={200}
            alt={`Logged as ${user.name}`}
            title={`Logged as ${user.name}`}
          />
        )}
        <div className="p-5 pt-12">
          <h1 className="text-3xl font-sans pb-4">Profile</h1>
          <p>{user?.name}</p>
          <p>{user?.email}</p>
      </div>
      </div>
    </div>
  );
}