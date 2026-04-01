type Website = {
  name: string;
  url: string;
  image_url: string;
  categories: string[];
};

type AppListProps = {
  websites: Website[];
  addRecentOpened: (website: Website) => void;
  failedImages: Set<string>;
  setFailedImages: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export function AppList({ websites, addRecentOpened, failedImages, setFailedImages }: AppListProps) {
  return (
    <div className="space-y-2">
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
          className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md border border-gray-200/50 dark:border-slate-700/50 p-2.5 flex flex-col sm:flex-row items-center sm:items-center gap-3 transition-all duration-300 hover:border-blue-300/50 dark:hover:border-blue-500/50"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full">
            <div className="p-1.5 rounded-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 group-hover:from-blue-100 group-hover:to-indigo-100 dark:group-hover:from-blue-800/40 dark:group-hover:to-indigo-800/40 transition-all duration-300 flex-shrink-0">
              <img
                src={failedImages.has(website.image_url) ? '/logo.webp' : website.image_url}
                alt={website.name}
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                onError={() => {
                  setFailedImages(prev => new Set(prev).add(website.image_url));
                }}
              />
            </div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 flex-1 text-center sm:text-left group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
              {website.name}
            </h3>
          </div>
        </a>
      ))}
    </div>
  );
}
