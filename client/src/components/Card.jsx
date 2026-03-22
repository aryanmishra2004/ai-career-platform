const Card = ({ title, subtitle, children, action }) => (
  <section className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/85">
    {(title || action) && (
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);

export default Card;
