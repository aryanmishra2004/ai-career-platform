import { useMemo, useState } from "react";
import { Briefcase, ClipboardCheck, Download, FileText, Goal, Radar, Sparkles, WandSparkles } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import Loader from "../components/Loader";
import { SkeletonCard } from "../components/Skeleton";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  APP_KEYS,
  copyToClipboard,
  downloadTextReport,
  getLeaderboardData,
  getProgressValue,
  mergeLeaderboard,
} from "../utils/storage";
import {
  FRIENDLY_ERROR_MESSAGE,
  analyzeResumeAI,
  analyzeResumeFileAI,
  compareCareerAI,
  getDailyPlanAI,
  getProjectsAI,
  getSkillGapAI,
} from "../services/api";

const pillClass =
  "rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200";

const Dashboard = () => {
  const [report, setReport] = useLocalStorage(APP_KEYS.report, null);
  const [form] = useLocalStorage(APP_KEYS.form, null);
  const [roadmap] = useLocalStorage(APP_KEYS.roadmap, []);
  const [completedSteps] = useLocalStorage(APP_KEYS.completedSteps, []);
  const [points] = useLocalStorage(APP_KEYS.points, 0);
  const [user] = useLocalStorage(APP_KEYS.user, null);
  const [skillInput, setSkillInput] = useState("");
  const [skillGap, setSkillGap] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [comparisonForm, setComparisonForm] = useState({
    careerOne: report?.primaryCareer || "BCA",
    careerTwo: report?.backupCareer || "B.Tech",
  });
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeResult, setResumeResult] = useState(null);
  const [smartLoading, setSmartLoading] = useState("");

  const progress = getProgressValue(roadmap, completedSteps);
  const leaderboard = useMemo(
    () => mergeLeaderboard(getLeaderboardData(), user, points),
    [user, points]
  );

  if (!report || !form) {
    return <Navigate to="/form" replace />;
  }

  const copyReport = async () => {
    await copyToClipboard(report.reportText || report.overview);
    toast.success("Copied");
  };

  const downloadReport = async () => {
    await downloadTextReport(report.reportText || report.overview);
    toast.success("Career report downloaded");
  };

  const refreshProjects = async () => {
    setSmartLoading("projects");
    try {
      const data = await getProjectsAI(report.primaryCareer);
      setReport((prev) => ({ ...prev, miniProjects: data.projects }));
      toast.success("Saved successfully");
    } catch {
      toast.error(`⚠️ ${FRIENDLY_ERROR_MESSAGE}`);
    } finally {
      setSmartLoading("");
    }
  };

  const refreshDailyPlan = async () => {
    setSmartLoading("daily");
    try {
      const data = await getDailyPlanAI(report.primaryCareer);
      setReport((prev) => ({ ...prev, dailyPlan: data.timeline }));
      toast.success("Saved successfully");
    } catch {
      toast.error(`⚠️ ${FRIENDLY_ERROR_MESSAGE}`);
    } finally {
      setSmartLoading("");
    }
  };

  const runSkillGap = async () => {
    setSmartLoading("skill");
    try {
      const data = await getSkillGapAI({
        targetCareer: report.primaryCareer,
        currentSkills: skillInput
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      });
      setSkillGap(data);
      toast.success("Saved successfully");
    } catch {
      toast.error(`⚠️ ${FRIENDLY_ERROR_MESSAGE}`);
    } finally {
      setSmartLoading("");
    }
  };

  const runComparison = async () => {
    setSmartLoading("compare");
    try {
      const data = await compareCareerAI(comparisonForm.careerOne, comparisonForm.careerTwo);
      setComparison(data);
      toast.success("Saved successfully");
    } catch {
      toast.error(`⚠️ ${FRIENDLY_ERROR_MESSAGE}`);
    } finally {
      setSmartLoading("");
    }
  };

  const runResumeAnalysis = async () => {
    setSmartLoading("resume");
    try {
      const data = resumeFile
        ? await analyzeResumeFileAI({
            file: resumeFile,
            targetCareer: report.primaryCareer,
          })
        : await analyzeResumeAI({
            resumeText,
            targetCareer: report.primaryCareer,
          });
      setResumeResult(data);
      toast.success("Saved successfully");
    } catch {
      toast.error(`⚠️ ${FRIENDLY_ERROR_MESSAGE}`);
    } finally {
      setSmartLoading("");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-sky-800 to-emerald-600 p-8 text-white shadow-[0_24px_80px_-24px_rgba(14,116,144,0.55)]">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-100/80">
              Personalized Report
            </p>
            <h1 className="text-4xl font-black">{report.primaryCareer}</h1>
            <p className="max-w-3xl text-base leading-7 text-sky-50/90">{report.overview}</p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                <Goal className="h-4 w-4" />
                Success Probability: {report.successProbability}%
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                <Briefcase className="h-4 w-4" />
                Time to Job: {report.timeToJob}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Backup Career: {report.backupCareer}
              </span>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/20 bg-white/10 p-5 backdrop-blur">
            <ProgressBar value={progress} />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-sky-100/80">Points</p>
                <p className="text-3xl font-bold">{points}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-sky-100/80">Completed Steps</p>
                <p className="text-3xl font-bold">{completedSteps.length}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyReport}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
              >
                <ClipboardCheck className="h-4 w-4" />
                Copy Report
              </button>
              <button
                type="button"
                onClick={downloadReport}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
              <Link
                to="/roadmap"
                className="rounded-2xl border border-white/25 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Open Roadmap
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Career Options" subtitle="Primary, backup, and adjacent career choices">
          <div className="grid gap-4">
            {report.careerOptions?.map((option) => (
              <div
                key={option.title}
                className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{option.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{option.fitReason}</p>
                  </div>
                  <span className={pillClass}>{option.salary}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(option.courses || []).map((course) => (
                    <span key={course} className={pillClass}>
                      {course}
                    </span>
                  ))}
                  <span className={pillClass}>Difficulty: {option.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Reality Check Mode" subtitle="Practical expectations before you commit">
          <div className="grid gap-4">
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Competition Level</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {report.realityCheck?.competitionLevel}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Time to Success</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {report.realityCheck?.timeToSuccess}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Effort Required</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {report.realityCheck?.effortRequired}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card
          title="Mini Project Generator"
          subtitle="Portfolio-friendly ideas to prove your skills"
          action={
            <button
              type="button"
              onClick={refreshProjects}
              className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-sky-500"
            >
              Refresh
            </button>
          }
        >
          {smartLoading === "projects" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {report.miniProjects?.map((project) => (
                <div
                  key={project.title}
                  className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card
          title="Daily Task Generator"
          subtitle="A focused 7-day execution plan"
          action={
            <button
              type="button"
              onClick={refreshDailyPlan}
              className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-sky-500"
            >
              Refresh
            </button>
          }
        >
          {smartLoading === "daily" ? (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="space-y-4">
              {report.dailyPlan?.map((item) => (
                <div key={item} className="flex gap-4 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900/60">
                  <div className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Skill Gap Analyzer" subtitle="Find what is missing for your target career">
          <div className="space-y-4">
            <textarea
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              placeholder="Enter your current skills separated by commas"
              className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white p-4 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
            />
            <button
              type="button"
              onClick={runSkillGap}
              className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-sky-500"
            >
              Analyze Skill Gap
            </button>
            {smartLoading === "skill" && <Loader label="Analyzing your skill gap..." />}
            {skillGap && (
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skillGap.requiredSkills?.map((skill) => (
                      <span key={skill} className={pillClass}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Missing Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skillGap.missingSkills?.map((skill) => (
                      <span key={skill} className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {skillGap.learningRoadmap?.map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-900/60">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Career Comparison Tool" subtitle="Compare two options before you decide">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={comparisonForm.careerOne}
              onChange={(event) =>
                setComparisonForm((prev) => ({ ...prev, careerOne: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
            />
            <input
              value={comparisonForm.careerTwo}
              onChange={(event) =>
                setComparisonForm((prev) => ({ ...prev, careerTwo: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <button
            type="button"
            onClick={runComparison}
            className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-sky-500"
          >
            Compare Careers
          </button>
          {smartLoading === "compare" && <Loader label="Comparing career paths..." />}
          {comparison && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {comparison.careers?.map((career) => (
                <div key={career.name} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{career.name}</h3>
                  <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <p>Duration: {career.duration}</p>
                    <p>Fees: {career.fees}</p>
                    <p>Salary: {career.salary}</p>
                    <p>Difficulty: {career.difficulty}</p>
                  </div>
                </div>
              ))}
              <div className="rounded-3xl bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200 md:col-span-2">
                {comparison.verdict}
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Resume Analyzer" subtitle="Paste resume text for quick AI feedback">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
            className="mb-4 block w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300"
          />
          <textarea
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste your resume text here, or upload a PDF/TXT above"
            className="min-h-40 w-full rounded-3xl border border-slate-200 bg-white p-4 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <button
            type="button"
            onClick={runResumeAnalysis}
            className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-sky-500"
          >
            Analyze Resume
          </button>
          {smartLoading === "resume" && <Loader label="Analyzing resume..." />}
          {resumeResult && (
            <div className="mt-4 space-y-3">
              <div className="rounded-3xl bg-emerald-50 p-4 text-slate-800 dark:bg-emerald-950/30 dark:text-emerald-100">
                Resume Score: <span className="font-bold">{resumeResult.score}/100</span>
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{resumeResult.summary}</p>
              <div className="space-y-2">
                {resumeResult.suggestions?.map((suggestion) => (
                  <div key={suggestion} className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-900/60">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card title="Leaderboard" subtitle="Mock leaderboard with your current score">
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={`${entry.name}-${index}`}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/60"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-sky-500">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{entry.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {entry.name === user?.name ? "You" : "Community"}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{entry.points} pts</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
