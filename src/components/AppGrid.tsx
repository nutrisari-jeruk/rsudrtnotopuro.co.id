type Website = {
  name: string;
  url: string;
  image_url: string;
  categories: string[];
};

type AppGridProps = {
  websites: Website[];
  addRecentOpened: (website: Website) => void;
  failedImages: Set<string>;
  setFailedImages: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export function AppGrid({ websites, addRecentOpened, failedImages, setFailedImages }: AppGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {websites.map((website, index) => (
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
  );
}
