import { ReactNode } from 'react';

type Website = {
  name: string;
  url: string;
  image_url: string;
  categories: string[];
};

type SectionIntroProps = {
  badgeLabel: string;
  badgeIcon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

type RecentAppsProps = {
  recentWebsites: Website[];
  addRecentOpened: (website: Website) => void;
  onClearRecentOpened: () => void;
  onRemoveRecentApp: (url: string) => void;
  failedImages: Set<string>;
  setFailedImages: React.Dispatch<React.SetStateAction<Set<string>>>;
  SectionIntro: (props: SectionIntroProps) => React.ReactNode;
};

export function RecentApps({
  recentWebsites,
  addRecentOpened,
  onClearRecentOpened,
  onRemoveRecentApp,
  failedImages,
  setFailedImages,
  SectionIntro,
}: RecentAppsProps) {
  return (
    <section className="mb-12 overflow-visible">
      <div className="rounded-2xl border border-blue-100/60 dark:border-slate-700/60 bg-blue-50/60 dark:bg-slate-800/70 shadow-sm p-6 overflow-visible">
        <SectionIntro
          badgeLabel="Baru saja dibuka"
          badgeIcon={
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="Aplikasi yang terakhir Anda akses untuk dibuka kembali dengan cepat."
          description=""
          actionLabel="Hapus riwayat"
          onAction={onClearRecentOpened}
        />
        <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-2 pt-4 -mt-2">
          {recentWebsites.map(recentWebsite => (
            <div key={`${recentWebsite.url}-recent`} className="relative group" style={{ overflow: 'visible', paddingTop: '8px', paddingRight: '8px' }}>
              <a
                href={recentWebsite.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => addRecentOpened(recentWebsite)}
                onAuxClick={(event) => {
                  if (event.button === 1) {
                    addRecentOpened(recentWebsite);
                  }
                }}
                className="relative mt-1 bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl border border-blue-100/60 dark:border-slate-700/60 p-4 flex min-w-[180px] flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/60 dark:hover:border-blue-500/60"
              >
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-200/70 dark:group-hover:border-blue-500/50 transition-colors duration-300" />
                <div className="relative z-10 flex flex-col items-center gap-3 w-full">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/30">
                    <img
                      src={failedImages.has(recentWebsite.image_url) ? '/logo.webp' : recentWebsite.image_url}
                      alt={recentWebsite.name}
                      className="h-9 w-auto object-contain"
                      onError={() => {
                        setFailedImages(prev => new Set(prev).add(recentWebsite.image_url));
                      }}
                    />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                    {recentWebsite.name}
                  </h3>
                </div>
              </a>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemoveRecentApp(recentWebsite.url);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="absolute -top-2 -right-2 z-50 p-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-slate-600/50 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-lg scale-0 group-hover:scale-100"
                aria-label={`Remove ${recentWebsite.name} from recent apps`}
                title={`Remove ${recentWebsite.name}`}
              >
                <svg
                  className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
