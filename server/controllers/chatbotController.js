import { getAIResponse, getStructuredAIResponse } from "../services/aiService.js";
import { createConfusionFallback, createMentorFallback } from "../utils/careerFallbacks.js";

export const chatbotReply = async (req, res) => {
  try {
    const { message, history = [], mode = "mentor" } = req.body;

    if (mode === "confusion") {
      const result = await getStructuredAIResponse(
        `You are an empathetic AI career mentor helping a confused student.
Conversation so far:
${history.map((item) => `${item.role}: ${item.text}`).join("\n")}

Latest student message: ${message}

Reply with one helpful next message and 3 concise follow-up questions.
Return STRICT JSON only:
{
  "reply": "string",
  "followUpQuestions": ["string"]
}`,
        () => createConfusionFallback(message)
      );

      return res.json(result);
    }

    const prompt = `You are a supportive AI mentor inside a career platform.
Conversation:
${history.map((item) => `${item.role}: ${item.text}`).join("\n")}

Latest user message: ${message}

Respond with practical guidance, encouragement, and concrete next steps.`;

    const reply = (await getAIResponse(prompt)) || createMentorFallback(message);
    res.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ reply: createMentorFallback(req.body.message) });
  }
};
