'use client';

import { getProviders, signIn } from 'next-auth/react';

const ShowProviders = async function ShowProviders() {
  const providers = await getProviders();
  return (
    <>
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)} className="btn bg-gray-900 text-gray-50 ring-gray-700 !text-xl !p-3">
              Sign in with {provider.name}
            </button>
          </div>
        ))}
    </>
  );
};

export default ShowProviders as unknown as () => JSX.Element;
