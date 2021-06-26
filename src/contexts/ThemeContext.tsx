import { createContext, ReactNode, useEffect, useState } from 'react'

type Theme = 'light' | 'dark';

type ThemeContextProviderProps = {
  children: ReactNode;
}

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeContextProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storagedTheme = localStorage.getItem('theme')

    return (storagedTheme ?? 'light') as Theme;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme])

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  )
}