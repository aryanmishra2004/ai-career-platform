import express from "express";
import { getStepDetails } from "../controllers/roadmapController.js";

const router = express.Router();

router.post("/", getStepDetails);
router.post("/detail", getStepDetails);

export default router;
