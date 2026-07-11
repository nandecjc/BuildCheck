import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "BuildCheck API is running" });
  });

  // Mock Analysis Detection Endpoint (Simple for MVP)
  app.post("/api/analysis/detect", async (req, res) => {
    const { imageUrl, type } = req.body;
    // Automated analysis logic.
    const defects = [
      "Surface crack detected in structural beam",
      "Corrosion visible on reinforcement bars",
      "Water leakage signs on ceiling",
      "Exposed electrical wiring"
    ];
    const randomDefect = defects[Math.floor(Math.random() * defects.length)];
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    res.json({
      issue: Math.random() > 0.5 ? randomDefect : "No significant defects detected",
      confidence: 0.85 + Math.random() * 0.1
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
