export const SkeletonLine = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 ${className}`}
  />
);

export const SkeletonCard = () => (
  <div className="animate-pulse rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
    <SkeletonLine className="mb-4 h-6 w-1/2" />
    <SkeletonLine className="mb-2 h-4 w-full" />
    <SkeletonLine className="mb-2 h-4 w-5/6" />
    <SkeletonLine className="h-4 w-2/3" />
  </div>
);

export const TypingDots = ({ label = "Thinking" }) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
    <span>{label}</span>
    <span className="flex gap-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-500 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-500 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-500" />
    </span>
  </div>
);
