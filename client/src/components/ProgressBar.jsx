const ProgressBar = ({ value }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
      <span>Roadmap Progress</span>
      <span>{value}%</span>
    </div>
    <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default ProgressBar;
