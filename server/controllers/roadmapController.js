import { getStructuredAIResponse } from "../services/aiService.js";
import { createRoadmapDetailFallback } from "../utils/careerFallbacks.js";

export const getStepDetails = async (req, res) => {
  try {
    const { step, career } = req.body;

    const result = await getStructuredAIResponse(
      `You are a career mentor.
Explain this roadmap step for a student targeting ${career || "their chosen career"}.

Step: ${step}

Return STRICT JSON only:
{
  "title": "string",
  "whatToDo": "string",
  "skillsNeeded": ["string"],
  "tips": ["string"],
  "timeRequired": "string"
}`,
      () => createRoadmapDetailFallback(step)
    );

    res.json(result);
  } catch (error) {
    console.error("Roadmap detail error:", error);
    res.json(createRoadmapDetailFallback(req.body.step));
  }
};
