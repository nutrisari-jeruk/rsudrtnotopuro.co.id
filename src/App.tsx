import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import { useDarkMode } from './hooks/useDarkMode';
import websitesData from './data/websites.json';
import { SectionIntro } from './components/SectionIntro';
import { DarkModeToggle } from './components/DarkModeToggle';
import { SearchInput } from './components/SearchInput';
import { CategoryFilter } from './components/CategoryFilter';
import { AppGrid } from './components/AppGrid';
import { AppList } from './components/AppList';
import { RecentApps } from './components/RecentApps';

type Website = {
  name: string;
  url: string;
  image_url: string;
  categories: string[];
};

const websites: Website[] = websitesData as Website[];

const RECENT_SEARCH_STORAGE_KEY = 'appPortalRecentSearches';
const RECENT_OPENED_STORAGE_KEY = 'appPortalRecentOpened';
const SORT_ORDER_STORAGE_KEY = 'appPortalSortOrder';
const VIEW_MODE_STORAGE_KEY = 'appPortalViewMode';
const CATEGORY_FILTER_STORAGE_KEY = 'appPortalCategoryFilter';
const RECENT_SEARCH_LIMIT = 8;
const RECENT_OPENED_LIMIT = 6;

type StoredWebsite = Pick<Website, 'name' | 'url' | 'image_url' | 'categories'>;

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
          typeof item?.image_url === 'string' &&
          Array.isArray(item?.categories)
      );
    }
    return [];
  } catch (error) {
    console.error('Failed to parse recently opened apps from storage', error);
    return [];
  }
};

const readStoredSortOrder = (): 'asc' | 'desc' => {
  if (typeof window === 'undefined') {
    return 'asc';
  }

  try {
    const raw = window.localStorage.getItem(SORT_ORDER_STORAGE_KEY);
    if (raw === 'asc' || raw === 'desc') {
      return raw;
    }
    return 'asc';
  } catch (error) {
    console.error('Failed to parse sort order from storage', error);
    return 'asc';
  }
};

const readStoredViewMode = (): 'grid' | 'list' => {
  if (typeof window === 'undefined') {
    return 'grid';
  }

  try {
    const raw = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (raw === 'grid' || raw === 'list') {
      return raw;
    }
    return 'grid';
  } catch (error) {
    console.error('Failed to parse view mode from storage', error);
    return 'grid';
  }
};

const readStoredCategoryFilter = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CATEGORY_FILTER_STORAGE_KEY);
    if (raw === null || raw === '') {
      return null;
    }
    return raw;
  } catch (error) {
    console.error('Failed to parse category filter from storage', error);
    return null;
  }
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [recentSearches, setRecentSearches] = useState<string[]>(readStoredSearches);
  const [recentOpenedApps, setRecentOpenedApps] = useState<StoredWebsite[]>(readStoredOpenedApps);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState<number>(-1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(readStoredSortOrder);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(readStoredViewMode);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(readStoredCategoryFilter);
  const { isDark, toggle } = useDarkMode();

  const filteredWebsites = useMemo(() => {
    let filtered = websites.filter(website =>
      website.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (selectedCategory !== null) {
      filtered = filtered.filter(website =>
        website.categories.includes(selectedCategory)
      );
    }
    
    return [...filtered].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }, [searchQuery, sortOrder, selectedCategory]);

  const hasRecentSearches = recentSearches.length > 0;
  const hasRecentOpenedApps = recentOpenedApps.length > 0;

  const recentOpenedWebsites = useMemo(() => {
    if (!hasRecentOpenedApps) {
      return [];
    }

    const knownWebsitesByUrl = new Map(websites.map(site => [site.url, site]));

    return recentOpenedApps
      .map(item => knownWebsitesByUrl.get(item.url) ?? item)
      .filter(item => knownWebsitesByUrl.has(item.url));
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
      categories: website.categories,
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

  const handleRemoveRecentApp = useCallback((url: string) => {
    setRecentOpenedApps(prev => prev.filter(item => item.url !== url));
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
    setActiveSearchIndex(-1);
  }, [searchQuery, isSearchFocused]);

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
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(SORT_ORDER_STORAGE_KEY, sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (selectedCategory === null) {
      window.localStorage.removeItem(CATEGORY_FILTER_STORAGE_KEY);
    } else {
      window.localStorage.setItem(CATEGORY_FILTER_STORAGE_KEY, selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setActiveSearchIndex(-1);
  }, [searchQuery, isSearchFocused]);

  const handleToggleSort = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const handleSetViewMode = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
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
            <SearchInput
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyDown={handleSearchKeyDown}
              recentSearches={recentSearches}
              isSearchFocused={isSearchFocused}
              activeSearchIndex={activeSearchIndex}
              onClearRecentSearches={handleClearRecentSearches}
              onSelectRecentSearch={handleSelectRecentSearch}
            />
            <DarkModeToggle isDark={isDark} onToggle={toggle} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {hasRecentOpenedApps && (
          <RecentApps
            recentWebsites={recentOpenedWebsites}
            addRecentOpened={addRecentOpened}
            onClearRecentOpened={handleClearRecentOpened}
            onRemoveRecentApp={handleRemoveRecentApp}
            failedImages={failedImages}
            setFailedImages={setFailedImages}
            SectionIntro={SectionIntro}
          />
        )}
        {hasRecentOpenedApps && filteredWebsites.length > 0 && (
          <div className="relative mb-10">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-slate-600" />
          </div>
        )}
        {websites.length > 0 && (
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortOrder={sortOrder}
            onToggleSort={handleToggleSort}
            viewMode={viewMode}
            onSetViewMode={handleSetViewMode}
            hasWebsites={filteredWebsites.length > 0}
          />
        )}
        {filteredWebsites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No apps found matching "{searchQuery}"</p>
          </div>
        ) : viewMode === 'grid' ? (
          <AppGrid
            websites={filteredWebsites}
            addRecentOpened={addRecentOpened}
            failedImages={failedImages}
            setFailedImages={setFailedImages}
          />
        ) : (
          <AppList
            websites={filteredWebsites}
            addRecentOpened={addRecentOpened}
            failedImages={failedImages}
            setFailedImages={setFailedImages}
          />
        )}
      </main>
    </div>
  );
}

export default App;
