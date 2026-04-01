import { ReactNode } from 'react';

type SectionIntroProps = {
  badgeLabel: string;
  badgeIcon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionIntro({
  badgeLabel,
  badgeIcon,
  title,
  description,
  actionLabel,
  onAction,
}: SectionIntroProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6 mb-5">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300 shadow-sm">
          {badgeIcon}
          <span>{badgeLabel}</span>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="self-start cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
