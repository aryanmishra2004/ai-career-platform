import axios from "axios";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const HUGGING_FACE_URL = "https://router.huggingface.co/v1/chat/completions";
const HUGGING_FACE_MODEL = "katanemo/Arch-Router-1.5B:hf-inference";

const extractText = (response) =>
  response?.data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim() || "";

const extractHuggingFaceText = (response) => {
  const data = response?.data;

  return data?.choices?.[0]?.message?.content?.trim() || "";
};

const cleanJsonText = (text) =>
  text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

const callGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 30000 }
    );

    return extractText(response);
  } catch (error) {
    console.error("Gemini error:", error.response?.data || error.message);
    return null;
  }
};

const callHuggingFace = async (prompt) => {
  if (!process.env.HF_API_KEY) {
    return null;
  }

  try {
    const response = await axios.post(
      HUGGING_FACE_URL,
      {
        model: HUGGING_FACE_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 900,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 45000,
      }
    );

    return extractHuggingFaceText(response);
  } catch (error) {
    console.error("Hugging Face error:", error.response?.data || error.message);
    return null;
  }
};

export const getAIResponse = async (prompt) => {
  let result = await callGemini(prompt);

  if (result) {
    return result;
  }

  console.warn("Gemini failed or returned empty output. Trying Hugging Face...");

  result = await callHuggingFace(prompt);

  if (result) {
    return result;
  }

  console.warn("All AI providers failed. Using controller fallback.");
  return null;
};

export const getStructuredAIResponse = async (prompt, fallbackFactory) => {
  const text = await getAIResponse(prompt);

  if (!text) {
    return fallbackFactory();
  }

  try {
    return JSON.parse(cleanJsonText(text));
  } catch (error) {
    console.error("AI JSON PARSE ERROR:", error.message);
    return fallbackFactory();
  }
};
