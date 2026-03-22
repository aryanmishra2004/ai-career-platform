import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BrainCircuit, LayoutDashboard, Map, MessageSquareText, Sparkles, Trophy } from "lucide-react";
import { toast } from "react-toastify";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../hooks/useTheme";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  APP_KEYS,
  getLeaderboardData,
  getTodayKey,
  mergeLeaderboard,
} from "../utils/storage";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/mentor", label: "Chat", icon: MessageSquareText },
  { to: "/interview", label: "Interview", icon: BrainCircuit },
  { to: "/confusion", label: "Confusion", icon: Sparkles },
];

const navClass = ({ isActive }) =>
  `group flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
    isActive
      ? "bg-slate-900 text-white shadow-lg dark:bg-sky-500"
      : "text-slate-600 hover:bg-white/80 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-900/70"
  }`;

const AppShell = () => {
  const { theme, toggleTheme } = useTheme();
  const [user] = useLocalStorage(APP_KEYS.user, null);
  const [points, setPoints] = useLocalStorage(APP_KEYS.points, 0);
  const [lastLoginDate, setLastLoginDate] = useLocalStorage(APP_KEYS.lastLoginDate, "");

  useEffect(() => {
    if (lastLoginDate === getTodayKey()) {
      return;
    }

    const nextPoints = points + 5;
    setLastLoginDate(getTodayKey());
    setPoints(nextPoints);
    mergeLeaderboard(getLeaderboardData(), user, nextPoints);
    toast.success("Daily login reward: +5 points");
  }, [lastLoginDate, points, setLastLoginDate, setPoints, user]);

  return (
    <div className="min-h-screen px-4 py-4 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-white/60 bg-white/75 p-5 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.32)] backdrop-blur dark:border-slate-700 dark:bg-slate-950/75">
          <div className="mb-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">
              AI Career Platform
            </p>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Build your path</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Dashboard, roadmap, mentor chat, interview prep, and progress tracking in one place.
            </p>
          </div>

          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass}>
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-500 p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">Points</p>
            <p className="mt-1 text-3xl font-bold">{points}</p>
            <p className="mt-2 text-sm opacity-90">
              Complete roadmap steps for +10 and keep your streak alive.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold">
              <Trophy className="h-4 w-4" />
              Leaderboard Ready
            </div>
          </div>
        </aside>

        <main className="rounded-[2rem] border border-white/60 bg-white/65 p-4 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur dark:border-slate-700 dark:bg-slate-950/60 md:p-6">
          <div className="mb-6 rounded-3xl border border-white/70 bg-white/85 p-4 transition-all duration-300 dark:border-slate-700 dark:bg-slate-900/80">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user?.name || "Career Explorer"}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 font-bold text-white">
                    {(user?.name || "C").slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{user?.name || "Career Explorer"}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user?.email || "demo@careerai.app"}
                    </p>
                  </div>
                </div>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {links.slice(0, 3).map((link) => (
                <NavLink key={link.to} to={link.to} className={navClass}>
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
