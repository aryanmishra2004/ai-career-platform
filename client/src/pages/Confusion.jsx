import { useState } from "react";
import { toast } from "react-toastify";
import Card from "../components/Card";
import { TypingDots } from "../components/Skeleton";
import { FRIENDLY_ERROR_MESSAGE, getMentorReplyAI } from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { APP_KEYS } from "../utils/storage";

const Confusion = () => {
  const [messages, setMessages] = useLocalStorage(APP_KEYS.confusionChat, []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUps, setFollowUps] = useState([]);

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) {
      return;
    }

    const nextMessages = [...messages, { role: "user", text: messageText }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await getMentorReplyAI({
        message: messageText,
        history: nextMessages,
        mode: "confusion",
      });
      setMessages((prev) => [...prev, { role: "bot", text: res.reply }]);
      setFollowUps(res.followUpQuestions || []);
    } catch {
      toast.error(`⚠️ ${FRIENDLY_ERROR_MESSAGE}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Confusion Mode"
      subtitle="An AI guide that asks step-by-step questions before pushing you toward a choice"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex min-h-[420px] flex-col gap-3 rounded-[2rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            {messages.length === 0 && (
              <div className="rounded-3xl bg-white p-4 text-sm leading-7 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                Start with what is confusing you right now, and the AI will guide you through the decision.
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                  msg.role === "user"
                    ? "self-end bg-slate-950 text-white dark:bg-sky-500"
                    : "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-100"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="rounded-3xl bg-white px-4 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <TypingDots label="Thinking" />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && sendMessage()}
              placeholder="Type your confusion..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-sky-500"
            >
              Send
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-slate-950 shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">Step by step</p>
            <h3 className="mt-2 text-2xl font-black">Follow-up prompts</h3>
            <p className="mt-2 text-sm leading-6">
              Tap a prompt to keep the conversation moving when you feel stuck.
            </p>
          </div>
          {followUps.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => sendMessage(question)}
              className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Confusion;
