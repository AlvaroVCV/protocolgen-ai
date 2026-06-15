import React, { useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type Appearance = 'theme-default' | 'theme-ocean' | 'theme-forest' | 'theme-crimson';

const THEME_KEY = 'theme';
const APPEARANCE_KEY = 'appearance';

const applyTheme = (theme: Theme) => {
  localStorage.setItem(THEME_KEY, theme);
  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
};

const applyAppearance = (appearance: Appearance) => {
  document.documentElement.classList.remove('theme-default', 'theme-ocean', 'theme-forest', 'theme-crimson');
  document.documentElement.classList.add(appearance);
  localStorage.setItem(APPEARANCE_KEY, appearance);
};

const Header: React.FC = () => {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    applyTheme(savedTheme ?? 'dark');

    const savedAppearance = localStorage.getItem(APPEARANCE_KEY) as Appearance | null;
    applyAppearance(savedAppearance ?? 'theme-default');
  }, []);

  return (
    <header className="no-print border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Protocol<span className="text-primary">Gen</span>
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Generador de Protocolos para Simulación Clínica
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="dropdown">
              <button
                className="focus-ring rounded-full p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                aria-label="Cambiar aspecto"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3.5a1.5 1.5 0 011.06.44l3.536 3.535a1.5 1.5 0 010 2.122l-3.536 3.535a1.5 1.5 0 01-2.474-1.768l.94-1.882A.5.5 0 009 11.5H4.5a.5.5 0 010-1H9a.5.5 0 00.416-.232l-.94-1.882A1.5 1.5 0 0110 3.5zM3.5 10a1.5 1.5 0 000 3h13a1.5 1.5 0 000-3h-13z" />
                </svg>
              </button>
              <div className="dropdown-content">
                <a href="#" onClick={(e) => { e.preventDefault(); applyAppearance('theme-default'); }}>
                  <span className="color-swatch" style={{ backgroundColor: '#2563eb' }}></span> Azul (Default)
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); applyAppearance('theme-ocean'); }}>
                  <span className="color-swatch" style={{ backgroundColor: '#0d9488' }}></span> Océano
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); applyAppearance('theme-forest'); }}>
                  <span className="color-swatch" style={{ backgroundColor: '#16a34a' }}></span> Bosque
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); applyAppearance('theme-crimson'); }}>
                  <span className="color-swatch" style={{ backgroundColor: '#dc2626' }}></span> Carmesí
                </a>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="focus-ring rounded-full p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label="Cambiar tema claro/oscuro"
            >
              <svg className="hidden h-5 w-5 dark:block" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 5.05a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z"
                  clipRule="evenodd"
                />
              </svg>
              <svg className="h-5 w-5 dark:hidden" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
