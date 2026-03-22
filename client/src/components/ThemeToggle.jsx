const ThemeToggle = ({ theme, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="rounded-full border border-white/70 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
  >
    {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
  </button>
);

export default ThemeToggle;
