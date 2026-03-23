import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import careerRoute from "./routes/career.js";
import chatbotRoute from "./routes/chatbot.js";
import roadmapRoute from "./routes/roadmap.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, "..", "client", "dist");
const clientIndexPath = path.join(clientDistPath, "index.html");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "5mb" }));

app.use("/api/career", careerRoute);
app.use("/api/chatbot", chatbotRoute);
app.use("/api/roadmap", roadmapRoute);

app.get("/api", (req, res) => {
  res.send("API is running");
});

if (existsSync(clientIndexPath)) {
  app.use(express.static(clientDistPath));

  app.get("/", (req, res) => {
    res.sendFile(clientIndexPath);
  });

  app.get("/{*any}", (req, res) => {
    res.sendFile(clientIndexPath);
  });
} else {
  app.get("/", (req, res) => {
    res.status(503).send("Frontend build not found. Run `npm run build --prefix client`.");
  });
}

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
