'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import ThemeProvider from "./theme";
import AuthProvider from "./auth";

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children } : Props) {
  return (
    <>
    <ThemeProvider>
      <AuthProvider>
        {children}
        <ProgressBar
          height="4px"
          color="#fde047"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </AuthProvider>
    </ThemeProvider>
    </>
  );
};