import { TypingDots } from "./Skeleton";

const Loader = ({ label = "Loading..." }) => (
  <div className="flex min-h-[180px] items-center justify-center">
    <div className="flex items-center gap-3 rounded-full border border-white/40 bg-white/80 px-5 py-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
      <TypingDots label={label} />
    </div>
  </div>
);

export default Loader;
