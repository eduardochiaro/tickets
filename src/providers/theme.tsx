'use client';

import { ThemeProvider as Provider } from 'next-themes';

export interface AuthContextProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: AuthContextProps) {
  return (
    <Provider enableSystem={true} attribute="class">
      {children}
    </Provider>
  );
}
