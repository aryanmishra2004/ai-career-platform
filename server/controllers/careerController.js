import { getStructuredAIResponse } from "../services/aiService.js";
import pdf from "pdf-parse/lib/pdf-parse.js";
import {
  createCareerReportFallback,
  createComparisonFallback,
  createDailyPlanFallback,
  createInterviewFallback,
  createProjectsFallback,
  createResumeFallback,
  createSkillGapFallback,
} from "../utils/careerFallbacks.js";

const buildCareerPrompt = ({
  stream,
  marks,
  interest,
  budget,
  targetCareer,
  location,
  strengths,
}) => `You are an expert AI career strategist for students in India.

Analyze this student profile and return STRICT JSON only.

Student profile:
- Stream: ${stream}
- Marks: ${marks}
- Interest: ${interest}
- Budget: ${budget}
- Target career: ${targetCareer || "Not decided"}
- Preferred location: ${location || "India"}
- Strengths: ${strengths || "Not provided"}

Return JSON with this exact shape:
{
  "overview": "short paragraph",
  "successProbability": 0,
  "timeToJob": "string",
  "primaryCareer": "string",
  "backupCareer": "string",
  "realityCheck": {
    "competitionLevel": "string",
    "timeToSuccess": "string",
    "effortRequired": "string"
  },
  "careerOptions": [
    {
      "title": "string",
      "fitReason": "string",
      "courses": ["string"],
      "salary": "string",
      "difficulty": "string"
    }
  ],
  "skillsRequired": ["string"],
  "missingSkills": ["string"],
  "learningRoadmap": ["string"],
  "miniProjects": [
    {
      "title": "string",
      "description": "string"
    }
  ],
  "dailyPlan": ["string"],
  "roadmap": [
    {
      "id": "step-id",
      "title": "string",
      "description": "string",
      "timeRequired": "string"
    }
  ],
  "reportText": "plain text multi-line report"
}

Rules:
- Give 3 to 5 career options
- Give 3 to 5 mini projects
- Give a 7-day daily plan
- Give 5 to 6 roadmap steps
- Success probability must be a number from 1 to 100
- Make the advice practical, realistic, and encouraging`;

export const getCareerSuggestion = async (req, res) => {
  try {
    const data = req.body;
    const result = await getStructuredAIResponse(
      buildCareerPrompt(data),
      () => createCareerReportFallback(data)
    );

    res.json(result);
  } catch (error) {
    console.error("Career report error:", error);
    res.status(500).json(createCareerReportFallback(req.body));
  }
};

export const compareCareers = async (req, res) => {
  try {
    const { careerOne, careerTwo } = req.body;
    const result = await getStructuredAIResponse(
      `You are a practical career counselor. Compare ${careerOne} and ${careerTwo}.
Return STRICT JSON only:
{
  "careers": [
    {
      "name": "string",
      "duration": "string",
      "fees": "string",
      "salary": "string",
      "difficulty": "string"
    },
    {
      "name": "string",
      "duration": "string",
      "fees": "string",
      "salary": "string",
      "difficulty": "string"
    }
  ],
  "verdict": "string"
}`,
      () => createComparisonFallback(careerOne, careerTwo)
    );

    res.json(result);
  } catch (error) {
    console.error("Career comparison error:", error);
    res.status(500).json(createComparisonFallback(req.body.careerOne, req.body.careerTwo));
  }
};

export const getSkillGapAnalysis = async (req, res) => {
  try {
    const { targetCareer, currentSkills } = req.body;
    const result = await getStructuredAIResponse(
      `You are a career mentor. Analyze skill gaps for ${targetCareer}.
Current skills: ${(currentSkills || []).join(", ") || "none"}.
Return STRICT JSON only:
{
  "targetCareer": "string",
  "requiredSkills": ["string"],
  "missingSkills": ["string"],
  "learningRoadmap": ["string"]
}`,
      () => createSkillGapFallback(targetCareer, currentSkills)
    );

    res.json(result);
  } catch (error) {
    console.error("Skill gap error:", error);
    res.status(500).json(createSkillGapFallback(req.body.targetCareer, req.body.currentSkills));
  }
};

export const getMiniProjects = async (req, res) => {
  try {
    const { career } = req.body;
    const result = await getStructuredAIResponse(
      `Suggest 3 to 5 beginner-to-intermediate mini projects for ${career}.
Return STRICT JSON only:
{
  "projects": [
    {
      "title": "string",
      "description": "string"
    }
  ]
}`,
      () => createProjectsFallback(career)
    );

    res.json(result);
  } catch (error) {
    console.error("Mini project error:", error);
    res.status(500).json(createProjectsFallback(req.body.career));
  }
};

export const getDailyTaskPlan = async (req, res) => {
  try {
    const { career } = req.body;
    const result = await getStructuredAIResponse(
      `Create a 7-day action plan for a student preparing for ${career}.
Return STRICT JSON only:
{
  "timeline": ["string"]
}`,
      () => createDailyPlanFallback(career)
    );

    res.json(result);
  } catch (error) {
    console.error("Daily plan error:", error);
    res.status(500).json(createDailyPlanFallback(req.body.career));
  }
};

export const getInterviewPrep = async (req, res) => {
  try {
    const { career } = req.body;
    const result = await getStructuredAIResponse(
      `Generate beginner interview preparation for ${career}.
Return STRICT JSON only:
{
  "technical": ["string"],
  "hr": ["string"],
  "coding": ["string"]
}`,
      () => createInterviewFallback(career)
    );

    res.json(result);
  } catch (error) {
    console.error("Interview prep error:", error);
    res.status(500).json(createInterviewFallback(req.body.career));
  }
};

export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, targetCareer } = req.body;
    let finalResumeText = resumeText;

    if (req.file?.buffer) {
      const parsed = await pdf(req.file.buffer);
      finalResumeText = parsed.text;
    }

    const result = await getStructuredAIResponse(
      `You are a resume coach. Analyze this resume for ${targetCareer}.
Resume text:
${finalResumeText || "No resume text provided"}

Return STRICT JSON only:
{
  "score": 0,
  "summary": "string",
  "suggestions": ["string"]
}`,
      () => createResumeFallback(targetCareer)
    );

    res.json(result);
  } catch (error) {
    console.error("Resume analysis error:", error);
    res.status(500).json(createResumeFallback(req.body.targetCareer));
  }
};
