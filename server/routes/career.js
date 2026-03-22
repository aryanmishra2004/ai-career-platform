import express from "express";
import multer from "multer";
import {
  analyzeResume,
  compareCareers,
  getCareerSuggestion,
  getDailyTaskPlan,
  getInterviewPrep,
  getMiniProjects,
  getSkillGapAnalysis,
} from "../controllers/careerController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", getCareerSuggestion);
router.post("/report", getCareerSuggestion);
router.post("/compare", compareCareers);
router.post("/skill-gap", getSkillGapAnalysis);
router.post("/projects", getMiniProjects);
router.post("/daily-plan", getDailyTaskPlan);
router.post("/interview-prep", getInterviewPrep);
router.post("/resume-analyze", upload.single("resume"), analyzeResume);

export default router;
