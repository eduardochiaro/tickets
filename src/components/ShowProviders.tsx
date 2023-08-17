'use client';

import GitHub from '@/icons/Github';
import Google from '@/icons/Google';
import { BuiltInProviderType } from 'next-auth/providers';
import { ClientSafeProvider, LiteralUnion, signIn } from 'next-auth/react';
import { AriaAttributes, SVGAttributes, SVGProps } from 'react';

const LogoProvider = ({ provider, ...props }: { provider: string; className: string; alt?: string }) => {
  switch (provider) {
    case 'github':
      return <GitHub {...props} />;
    case 'google':
      return <Google {...props} />;
    default:
      return <></>;
  }
};

export default function ShowProviders({ providers }: { providers: Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider> | null }) {
  return (
    <>
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.id}>
            <button
              onClick={() => signIn(provider.id)}
              className="flex item-center gap-4 p-2 px-6 btn bg-gray-900 text-gray-50 !border-gray-600 !text-lg mx-auto"
            >
              <LogoProvider provider={provider.id} className="w-6" alt={provider.name} />
              Sign in with {provider.name}
            </button>
          </div>
        ))}
    </>
  );
}
