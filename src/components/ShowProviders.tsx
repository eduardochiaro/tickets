'use client';

import GitHub from '@/icons/Github';
import Google from '@/icons/Google';
import { getProviders, signIn } from 'next-auth/react';


const LogoProvider = ({ id }: { id: string }) => {
  switch (id) {
    case 'github':
      return <GitHub className="w-5" />;
    case 'google':
      return <Google className="w-5" />;
    default:
      return <></>;
  }
};

const ShowProviders = async function ShowProviders() {
  const providers = await getProviders();
  return (
    <>
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)} className="flex item-center gap-4 font-mono btn bg-gray-900 text-gray-50 !border-gray-600 !text-xl">
							<LogoProvider id={provider.id}/>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
    </>
  );
};

export default ShowProviders as unknown as () => JSX.Element;
