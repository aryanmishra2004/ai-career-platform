import axios from "axios";

export const FRIENDLY_ERROR_MESSAGE = "Server busy. Please try again.";

const API = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://ai-career-platformm.onrender.com/api";

const api = axios.create({
  baseURL: API,
});

api.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      new Error(error?.response?.data?.error || error?.response?.data?.result || FRIENDLY_ERROR_MESSAGE)
    )
);

export const getCareerAI = async (data) => {
  const res = await api.post("/career/report", data);
  return res.data;
};

export const getStepAI = async ({ step, career }) => {
  const res = await api.post("/roadmap/detail", { step, career });
  return res.data;
};

export const compareCareerAI = async (careerOne, careerTwo) => {
  const res = await api.post("/career/compare", { careerOne, careerTwo });
  return res.data;
};

export const getSkillGapAI = async ({ targetCareer, currentSkills }) => {
  const res = await api.post("/career/skill-gap", { targetCareer, currentSkills });
  return res.data;
};

export const getProjectsAI = async (career) => {
  const res = await api.post("/career/projects", { career });
  return res.data;
};

export const getDailyPlanAI = async (career) => {
  const res = await api.post("/career/daily-plan", { career });
  return res.data;
};

export const getInterviewPrepAI = async (career) => {
  const res = await api.post("/career/interview-prep", { career });
  return res.data;
};

export const analyzeResumeAI = async ({ resumeText, targetCareer }) => {
  const res = await api.post("/career/resume-analyze", { resumeText, targetCareer });
  return res.data;
};

export const analyzeResumeFileAI = async ({ file, targetCareer }) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("targetCareer", targetCareer);

  const res = await api.post("/career/resume-analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getMentorReplyAI = async ({ message, history, mode }) => {
  const res = await api.post("/chatbot", { message, history, mode });
  return res.data;
};
