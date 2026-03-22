import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { FRIENDLY_ERROR_MESSAGE, getCareerAI } from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { APP_KEYS } from "../utils/storage";

const initialForm = {
  name: "",
  email: "",
  stream: "",
  marks: "",
  interest: "",
  budget: "",
  targetCareer: "",
  strengths: "",
  location: "India",
};

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

const CareerForm = () => {
  const navigate = useNavigate();
  const [savedForm, setSavedForm] = useLocalStorage(APP_KEYS.form, initialForm);
  const [, setSavedReport] = useLocalStorage(APP_KEYS.report, null);
  const [, setSavedRoadmap] = useLocalStorage(APP_KEYS.roadmap, []);
  const [, setUser] = useLocalStorage(APP_KEYS.user, null);
  const [form, setForm] = useState(savedForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const nextForm = { ...form, [event.target.name]: event.target.value };
    setForm(nextForm);
    setSavedForm(nextForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const report = await getCareerAI(form);
      setSavedForm(form);
      setSavedReport(report);
      setSavedRoadmap(report.roadmap || []);
      setUser({
        name: form.name || "Career Explorer",
        email: form.email || "demo@careerai.app",
      });
      toast.success("Saved successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(`⚠️ ${error.message || FRIENDLY_ERROR_MESSAGE}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader label="Building your AI career dashboard..." />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.3)] backdrop-blur dark:border-slate-700 dark:bg-slate-950/75">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600 dark:text-sky-400">
            Student Profile
          </p>
          <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">
            Create your AI career report
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Your details are auto-saved locally, so refreshing the page will not erase your progress.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            AI responses may take a few seconds during peak usage.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className={inputClass}
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className={inputClass}
            required
          />
          <select name="stream" value={form.stream} onChange={handleChange} className={inputClass} required>
            <option value="">Select stream</option>
            <option value="Science">Science</option>
            <option value="Commerce">Commerce</option>
            <option value="Arts">Arts</option>
          </select>
          <input
            name="marks"
            type="number"
            value={form.marks}
            onChange={handleChange}
            placeholder="Marks percentage"
            className={inputClass}
            required
          />
          <select
            name="interest"
            value={form.interest}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select interest</option>
            <option value="Technical">Technical</option>
            <option value="Creative">Creative</option>
            <option value="Business">Business</option>
            <option value="Healthcare">Healthcare</option>
          </select>
          <select name="budget" value={form.budget} onChange={handleChange} className={inputClass} required>
            <option value="">Budget</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            name="targetCareer"
            value={form.targetCareer}
            onChange={handleChange}
            placeholder="Target career, if you have one"
            className={`${inputClass} md:col-span-2`}
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Preferred location"
            className={inputClass}
          />
          <input
            name="strengths"
            value={form.strengths}
            onChange={handleChange}
            placeholder="Strengths, hobbies, or achievements"
            className={inputClass}
          />

          <button
            type="submit"
            className="mt-2 rounded-2xl bg-gradient-to-r from-slate-950 to-sky-500 px-6 py-4 text-base font-semibold text-white shadow-xl transition hover:-translate-y-0.5 md:col-span-2 dark:from-sky-500 dark:to-emerald-500"
          >
            Generate AI Career Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default CareerForm;
