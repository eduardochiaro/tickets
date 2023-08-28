'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import ThemeProvider from './theme';
import AuthProvider from './auth';
import { Suspense } from 'react';

interface Props {
  children: React.ReactNode;
}

function Fallback() {
  return <></>;
}

export default function Providers({ children }: Props) {
  return (
    <>
      <ThemeProvider>
        <Suspense fallback={<Fallback />}>
          <ProgressBar height="4px" color="#fde047" options={{ showSpinner: false }} shallowRouting />
        </Suspense>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </>
  );
}
