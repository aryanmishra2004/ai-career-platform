import { useState } from "react";
import { toast } from "react-toastify";
import Card from "../components/Card";
import Loader from "../components/Loader";
import { getInterviewPrepAI } from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { APP_KEYS } from "../utils/storage";

const InterviewPrep = () => {
  const [report] = useLocalStorage(APP_KEYS.report, null);
  const [career, setCareer] = useState(report?.primaryCareer || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePrep = async () => {
    setLoading(true);
    try {
      const data = await getInterviewPrepAI(career);
      setResult(data);
      toast.success("Saved successfully");
    } catch {
      toast.error("Could not generate interview prep");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Interview Prep Module" subtitle="Technical, HR, and coding practice for your target role">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={career}
            onChange={(event) => setCareer(event.target.value)}
            placeholder="Enter target career"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <button
            type="button"
            onClick={generatePrep}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-sky-500"
          >
            Generate Questions
          </button>
        </div>
      </Card>

      {loading && <Loader label="Preparing interview questions..." />}

      {result && (
        <div className="grid gap-6 xl:grid-cols-3">
          <Card title="Technical Q&A">
            <div className="space-y-3">
              {result.technical?.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900/60">
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card title="HR Questions">
            <div className="space-y-3">
              {result.hr?.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900/60">
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Coding Practice">
            <div className="space-y-3">
              {result.coding?.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900/60">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
