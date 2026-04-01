type CategoryFilterProps = {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  sortOrder: 'asc' | 'desc';
  onToggleSort: () => void;
  viewMode: 'grid' | 'list';
  onSetViewMode: (mode: 'grid' | 'list') => void;
  hasWebsites: boolean;
};

const categories = [
  { id: null, label: 'Semua', ariaLabel: 'Show all categories' },
  { id: 'healthcare', label: 'Pelayanan Kesehatan', ariaLabel: 'Filter by healthcare' },
  { id: 'office', label: 'Perkantoran', ariaLabel: 'Filter by office' },
  { id: 'finance', label: 'Keuangan', ariaLabel: 'Filter by finance' },
  { id: 'asset management', label: 'Manajemen Aset', ariaLabel: 'Filter by asset management' },
  { id: 'other', label: 'Lainnya', ariaLabel: 'Filter by other' },
] as const;

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  sortOrder,
  onToggleSort,
  viewMode,
  onSetViewMode,
  hasWebsites,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id ?? 'all'}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm'
                : 'bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60 border border-gray-200/50 dark:border-slate-700/50'
            }`}
            aria-label={cat.ariaLabel}
            aria-pressed={selectedCategory === cat.id}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {hasWebsites && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSort}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
            title={sortOrder === 'asc' ? 'Sort A-Z' : 'Sort Z-A'}
            aria-label={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {sortOrder === 'asc' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                />
              )}
            </svg>
            <span className="hidden sm:inline">{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
          </button>
          <button
            type="button"
            onClick={() => onSetViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
            title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            aria-pressed={false}
          >
            {viewMode === 'grid' ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
