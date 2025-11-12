import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useDarkMode } from './hooks/useDarkMode';
import websitesData from './data/websites.json';

type Website = {
  name: string;
  url: string;
  image_url: string;
};

const websites: Website[] = websitesData as Website[];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const { isDark, toggle } = useDarkMode();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredWebsites = websites.filter(website =>
    website.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus({ preventScroll: true });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="sticky top-0 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <a href="/">
              <img
                src="/logo.svg"
                alt="RSUD R.T. NOTOPURO SIDOARJO Logo"
                className="h-14 w-auto drop-shadow-sm"
              />
            </a>

            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                RSUD R.T. NOTOPURO SIDOARJO
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Portal Aplikasi</p>
            </div>
            <div className="relative w-64 md:w-80">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari Aplikasi"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-28 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <kbd className="rounded border border-gray-200 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 px-1.5 py-0.5 font-medium shadow-sm">
                  Ctrl
                </kbd>
                <kbd className="rounded border border-gray-200 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 px-1.5 py-0.5 font-medium shadow-sm">
                  K
                </kbd>
                <span className="mx-1 text-gray-300 dark:text-slate-600">/</span>
                <kbd className="rounded border border-gray-200 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 px-1.5 py-0.5 font-medium shadow-sm">
                  ⌘
                </kbd>
                <kbd className="rounded border border-gray-200 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 px-1.5 py-0.5 font-medium shadow-sm">
                  K
                </kbd>
              </div>
            </div>
            <button
              onClick={toggle}
              className="ml-4 relative inline-flex h-8 w-16 items-center rounded-full bg-gray-200 dark:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2"
              aria-label="Toggle dark mode"
              role="switch"
              aria-checked={isDark}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-lg transform transition-transform duration-200 ${isDark ? 'translate-x-9' : 'translate-x-1'
                  }`}
              >
                {isDark ? (
                  <svg className="h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {filteredWebsites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No apps found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredWebsites.map((website, index) => (
              <a
                href={website.url}
                key={website.name}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-xl border border-gray-200/50 dark:border-slate-700/50 p-6 flex flex-col items-center justify-center min-h-[160px] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/50 dark:hover:border-blue-500/50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex flex-col items-center gap-3 w-full">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 group-hover:from-blue-100 group-hover:to-indigo-100 dark:group-hover:from-blue-800/40 dark:group-hover:to-indigo-800/40 transition-all duration-300">
                    <img
                      src={failedImages.has(website.image_url) ? '/logo.webp' : website.image_url}
                      alt={website.name}
                      className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                      onError={() => {
                        setFailedImages(prev => new Set(prev).add(website.image_url));
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {website.name}
                  </h3>
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-4 h-4 text-blue-500 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
