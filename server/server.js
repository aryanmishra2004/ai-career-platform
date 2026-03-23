import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import careerRoute from "./routes/career.js";
import chatbotRoute from "./routes/chatbot.js";
import roadmapRoute from "./routes/roadmap.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "5mb" }));

app.use("/api/career", careerRoute);
app.use("/api/chatbot", chatbotRoute);
app.use("/api/roadmap", roadmapRoute);

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
