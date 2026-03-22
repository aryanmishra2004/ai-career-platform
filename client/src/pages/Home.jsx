import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../hooks/useTheme";

const highlights = [
  "Smart AI career report with roadmap, backup career, reality check, and success probability",
  "Progress tracking, points, daily plan, mini projects, and persistent dashboard state",
  "Confusion mode, mentor chat, interview prep, comparison tools, and resume analysis",
];

const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-7xl justify-end">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <div className="mx-auto grid min-h-[88vh] max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 dark:border-sky-800 dark:bg-sky-950/70 dark:text-sky-300">
            Career Guidance App upgraded into a full AI career platform
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-black leading-tight text-slate-950 dark:text-white md:text-6xl">
              Plan your career with AI, track real progress, and stay consistent.
            </h1>
            <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Generate a personalized report, follow a dynamic roadmap, compare career options,
              analyze skill gaps, chat with an AI mentor, and build momentum with gamified progress.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate("/form")}
              className="rounded-2xl bg-slate-950 px-7 py-4 text-base font-semibold text-white shadow-xl transition hover:-translate-y-0.5 dark:bg-sky-500"
            >
              Launch Career Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate("/confusion")}
              className="rounded-2xl border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Start Confusion Mode
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {highlights.map((item, index) => (
            <div
              key={item}
              className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.3)] backdrop-blur transition hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-950/75"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-xl font-bold text-white">
                0{index + 1}
              </div>
              <p className="text-base leading-7 text-slate-700 dark:text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
