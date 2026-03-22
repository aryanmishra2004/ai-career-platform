import { useState } from "react";
import { toast } from "react-toastify";
import Card from "../components/Card";
import Loader from "../components/Loader";
import ProgressBar from "../components/ProgressBar";
import { getStepAI } from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { APP_KEYS, getProgressValue, getLeaderboardData, mergeLeaderboard } from "../utils/storage";

const Roadmap = () => {
  const [roadmap] = useLocalStorage(APP_KEYS.roadmap, []);
  const [report] = useLocalStorage(APP_KEYS.report, null);
  const [completedSteps, setCompletedSteps] = useLocalStorage(APP_KEYS.completedSteps, []);
  const [details, setDetails] = useState({});
  const [loadingStep, setLoadingStep] = useState("");
  const [points, setPoints] = useLocalStorage(APP_KEYS.points, 0);
  const [user] = useLocalStorage(APP_KEYS.user, null);

  const progress = getProgressValue(roadmap, completedSteps);

  const toggleStep = (stepId) => {
    const isComplete = completedSteps.includes(stepId);
    const nextSteps = isComplete
      ? completedSteps.filter((id) => id !== stepId)
      : [...completedSteps, stepId];

    setCompletedSteps(nextSteps);

    if (!isComplete) {
      const nextPoints = points + 10;
      setPoints(nextPoints);
      mergeLeaderboard(getLeaderboardData(), user, nextPoints);
      toast.success("Step completed");
    }
  };

  const loadDetails = async (step) => {
    if (details[step.id]) {
      return;
    }

    setLoadingStep(step.id);
    try {
      const data = await getStepAI({ step: step.title, career: report?.primaryCareer });
      setDetails((prev) => ({ ...prev, [step.id]: data }));
    } catch {
      toast.error("Could not load step details");
    } finally {
      setLoadingStep("");
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Career Roadmap" subtitle="Track each milestone and keep momentum visible">
        <ProgressBar value={progress} />
      </Card>

      <div className="space-y-4">
        {roadmap.map((step, index) => {
          const isComplete = completedSteps.includes(step.id);

          return (
            <Card
              key={step.id}
              title={`${index + 1}. ${step.title}`}
              subtitle={step.timeRequired}
              action={
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                    isComplete
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-slate-950 text-white dark:bg-sky-500"
                  }`}
                >
                  {isComplete ? "Completed" : "Mark as Complete"}
                </button>
              }
            >
              <div className="space-y-4">
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{step.description}</p>
                <button
                  type="button"
                  onClick={() => loadDetails(step)}
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  View AI Details
                </button>
                {loadingStep === step.id && <Loader label="Loading roadmap detail..." />}
                {details[step.id] && (
                  <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900/60 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">What to do</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                        {details[step.id].whatToDo}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Skills needed
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {details[step.id].skillsNeeded?.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-white px-3 py-1 text-sm dark:bg-slate-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Tips</p>
                      <div className="mt-2 space-y-2">
                        {details[step.id].tips?.map((tip) => (
                          <div key={tip} className="rounded-2xl bg-white p-3 text-sm dark:bg-slate-800">
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Estimated time
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                        {details[step.id].timeRequired}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
