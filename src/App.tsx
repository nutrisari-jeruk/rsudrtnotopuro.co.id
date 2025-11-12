import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { useDarkMode } from './hooks/useDarkMode';
import websitesData from './data/websites.json';

type Website = {
  name: string;
  url: string;
  image_url: string;
};

const websites: Website[] = websitesData as Website[];

const RECENT_SEARCH_STORAGE_KEY = 'appPortalRecentSearches';
const RECENT_OPENED_STORAGE_KEY = 'appPortalRecentOpened';
const RECENT_SEARCH_LIMIT = 8;
const RECENT_OPENED_LIMIT = 6;

type StoredWebsite = Pick<Website, 'name' | 'url' | 'image_url'>;

const readStoredSearches = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCH_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(item => typeof item === 'string');
    }
    return [];
  } catch (error) {
    console.error('Failed to parse recent searches from storage', error);
    return [];
  }
};

const readStoredOpenedApps = (): StoredWebsite[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_OPENED_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is StoredWebsite =>
          typeof item?.name === 'string' &&
          typeof item?.url === 'string' &&
          typeof item?.image_url === 'string'
      );
    }
    return [];
  } catch (error) {
    console.error('Failed to parse recently opened apps from storage', error);
    return [];
  }
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [recentSearches, setRecentSearches] = useState<string[]>(readStoredSearches);
  const [recentOpenedApps, setRecentOpenedApps] = useState<StoredWebsite[]>(readStoredOpenedApps);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState<number>(-1);
  const { isDark, toggle } = useDarkMode();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<number | null>(null);

  const filteredWebsites = websites.filter(website =>
    website.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasRecentSearches = recentSearches.length > 0;
  const hasRecentOpenedApps = recentOpenedApps.length > 0;

  const recentOpenedWebsites = useMemo(() => {
    if (!hasRecentOpenedApps) {
      return [];
    }

    const knownWebsitesByUrl = new Map(websites.map(site => [site.url, site]));

    return recentOpenedApps.map(item => knownWebsitesByUrl.get(item.url) ?? item);
  }, [hasRecentOpenedApps, recentOpenedApps]);

  const addRecentSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }

    setRecentSearches(prev => {
      const next = [trimmedQuery, ...prev.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase())];
      return next.slice(0, RECENT_SEARCH_LIMIT);
    });
  }, []);

  const handleClearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    setActiveSearchIndex(-1);
  }, []);

  const addRecentOpened = useCallback((website: Website | StoredWebsite) => {
    const storedWebsite: StoredWebsite = {
      name: website.name,
      url: website.url,
      image_url: website.image_url,
    };

    setRecentOpenedApps(prev => {
      const next = [
        storedWebsite,
        ...prev.filter(item => item.url !== storedWebsite.url)
      ];
      return next.slice(0, RECENT_OPENED_LIMIT);
    });
  }, []);

  const handleClearRecentOpened = useCallback(() => {
    setRecentOpenedApps([]);
  }, []);

  const handleSelectRecentSearch = useCallback((query: string) => {
    setSearchQuery(query);
    addRecentSearch(query);
    setIsSearchFocused(false);
    setActiveSearchIndex(-1);
  }, [addRecentSearch]);

  const handleSearchKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hasRecentSearches) {
      if (event.key === 'Enter') {
        addRecentSearch(searchQuery);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSearchIndex(prev => {
        const nextIndex = prev + 1;
        return nextIndex >= recentSearches.length ? 0 : nextIndex;
      });
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSearchIndex(prev => {
        if (prev === -1) {
          return recentSearches.length - 1;
        }
        const nextIndex = prev - 1;
        return nextIndex < 0 ? recentSearches.length - 1 : nextIndex;
      });
      return;
    }

    if (event.key === 'Enter') {
      const selectedQuery =
        activeSearchIndex >= 0 && activeSearchIndex < recentSearches.length
          ? recentSearches[activeSearchIndex]
          : searchQuery;

      addRecentSearch(selectedQuery);
      setSearchQuery(selectedQuery);
      setIsSearchFocused(false);
      setActiveSearchIndex(-1);
      return;
    }

    if (event.key === 'Escape') {
      setIsSearchFocused(false);
      setActiveSearchIndex(-1);
      return;
    }
  }, [activeSearchIndex, addRecentSearch, hasRecentSearches, recentSearches, searchQuery]);
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        window.clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(RECENT_OPENED_STORAGE_KEY, JSON.stringify(recentOpenedApps));
  }, [recentOpenedApps]);

  useEffect(() => {
    setActiveSearchIndex(-1);
  }, [searchQuery, isSearchFocused]);

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
                onFocus={() => {
                  if (blurTimeoutRef.current) {
                    window.clearTimeout(blurTimeoutRef.current);
                  }
                  setIsSearchFocused(true);
                }}
                onBlur={() => {
                  if (blurTimeoutRef.current) {
                    window.clearTimeout(blurTimeoutRef.current);
                  }
                  blurTimeoutRef.current = window.setTimeout(() => {
                    setIsSearchFocused(false);
                  }, 120);
                }}
                onKeyDown={handleSearchKeyDown}
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
              {isSearchFocused && hasRecentSearches && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Recent searches
                    </span>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={handleClearRecentSearches}
                      className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Clear
                    </button>
                  </div>
                  <ul className="max-h-64 overflow-y-auto py-1">
                    {recentSearches.map((recentQuery, index) => {
                      const isActive = index === activeSearchIndex;
                      return (
                        <li key={recentQuery}>
                          <button
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => handleSelectRecentSearch(recentQuery)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 dark:bg-slate-700 dark:text-blue-300'
                                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-700/60'
                            }`}
                          >
                            {recentQuery}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
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
        {hasRecentOpenedApps && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Recently opened
              </h2>
              <button
                type="button"
                onClick={handleClearRecentOpened}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear history
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recentOpenedWebsites.map(recentWebsite => (
                <a
                  key={`${recentWebsite.url}-recent`}
                  href={recentWebsite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => addRecentOpened(recentWebsite)}
                  onAuxClick={(event) => {
                    if (event.button === 1) {
                      addRecentOpened(recentWebsite);
                    }
                  }}
                  className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-slate-700/50 p-5 flex flex-col items-center justify-center min-h-[140px] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/50 dark:hover:border-blue-500/50"
                >
                  <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-200/70 dark:group-hover:border-blue-500/50 transition-colors duration-300" />
                  <div className="relative z-10 flex flex-col items-center gap-3 w-full">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                      <img
                        src={failedImages.has(recentWebsite.image_url) ? '/logo.webp' : recentWebsite.image_url}
                        alt={recentWebsite.name}
                        className="h-10 w-auto object-contain"
                        onError={() => {
                          setFailedImages(prev => new Set(prev).add(recentWebsite.image_url));
                        }}
                      />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 text-center line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {recentWebsite.name}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
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
                onClick={() => addRecentOpened(website)}
                onAuxClick={(event) => {
                  if (event.button === 1) {
                    addRecentOpened(website);
                  }
                }}
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
