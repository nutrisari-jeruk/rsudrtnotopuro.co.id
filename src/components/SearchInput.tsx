import { useRef, useEffect } from 'react';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  recentSearches: string[];
  isSearchFocused: boolean;
  activeSearchIndex: number;
  onClearRecentSearches: () => void;
  onSelectRecentSearch: (query: string) => void;
};

export function SearchInput({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  recentSearches,
  isSearchFocused,
  activeSearchIndex,
  onClearRecentSearches,
  onSelectRecentSearch,
}: SearchInputProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<number | null>(null);

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

  return (
    <div className="relative w-64 md:w-80">
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Cari Aplikasi"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (blurTimeoutRef.current) {
            window.clearTimeout(blurTimeoutRef.current);
          }
          onFocus();
        }}
        onBlur={() => {
          if (blurTimeoutRef.current) {
            window.clearTimeout(blurTimeoutRef.current);
          }
          blurTimeoutRef.current = window.setTimeout(() => {
            onBlur();
          }, 120);
        }}
        onKeyDown={onKeyDown}
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
      {isSearchFocused && recentSearches.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-slate-700">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Recent searches
            </span>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={onClearRecentSearches}
              className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
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
                    onClick={() => onSelectRecentSearch(recentQuery)}
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
  );
}
