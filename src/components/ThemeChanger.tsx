'use client';

import classNames from '@/utils/classNames';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeChanger = () => {
  const [currentTheme, setCurrentTheme] = useState('system');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setCurrentTheme(theme || 'system');
  }, [theme]);

  return (
    <div className="text-xs flex items-center gap-2">
      <button onClick={() => setTheme('system')} className={classNames(`btn btn-small`, currentTheme == 'system' ? 'btn-primary' : '')}>
        System Mode
      </button>
      <button onClick={() => setTheme('light')} className={classNames(`btn btn-small`, currentTheme == 'light' ? 'btn-primary' : '')}>
        Light Mode
      </button>
      <button onClick={() => setTheme('dark')} className={classNames(`btn btn-small`, currentTheme == 'dark' ? 'btn-primary' : '')}>
        Dark Mode
      </button>
    </div>
  );
};

export default ThemeChanger;
