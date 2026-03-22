import { useState } from "react";
import { toast } from "react-toastify";
import Card from "../components/Card";
import { TypingDots } from "../components/Skeleton";
import { FRIENDLY_ERROR_MESSAGE, getMentorReplyAI } from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { APP_KEYS } from "../utils/storage";

const MentorChat = () => {
  const [messages, setMessages] = useLocalStorage(APP_KEYS.mentorChat, [
    {
      role: "bot",
      text: "I am your AI mentor. Ask me about study plans, career decisions, habits, interviews, or what to do next today.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    }

    const userMessage = { role: "user", text: input };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await getMentorReplyAI({
        message: input,
        history: nextMessages,
        mode: "mentor",
      });
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      toast.error(`⚠️ ${FRIENDLY_ERROR_MESSAGE}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="AI Mentor Chat"
      subtitle="A chat-first workspace for daily guidance, habits, and career direction"
    >
      <div className="flex min-h-[70vh] flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto rounded-[2rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-7 ${
                message.role === "user"
                  ? "ml-auto bg-slate-950 text-white dark:bg-sky-500"
                  : "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-100"
              }`}
            >
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="max-w-[80%] rounded-3xl bg-white px-4 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <TypingDots label="Mentor is typing" />
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && sendMessage()}
            placeholder="Ask for your next step, study plan, or career advice"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <button
            type="button"
            onClick={sendMessage}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-sky-500"
          >
            Send
          </button>
        </div>
      </div>
    </Card>
  );
};

export default MentorChat;
