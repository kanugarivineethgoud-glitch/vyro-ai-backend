
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "https://kanugarivineethgoud-glitch.github.io"
}));

app.use(express.json({ limit: "1mb" }));

fal.config({
  credentials: process.env.FAL_KEY
});

app.get("/", (req, res) => {
  res.json({
    name: "VYRO AI Backend",
    version: "6.2",
    status: "online",
    generation: "disabled"
  });
});

app.post("/api/generate", async (req, res) => {
  if (process.env.AI_GENERATION_ENABLED !== "true") {
    return res.status(503).json({
      error: "Video generation is temporarily disabled."
    });
  }

  if (!process.env.FAL_KEY) {
    return res.status(503).json({
      error: "AI provider is not configured."
    });
  }

  try {
    const { prompt } = req.body || {};

    if (
      typeof prompt !== "string" ||
      prompt.trim().length < 3 ||
      prompt.length > 1500
    ) {
      return res.status(400).json({
        error: "Enter a prompt between 3 and 1500 characters."
      });
    }

    const result = await fal.subscribe(
      "fal-ai/wan-25-preview/text-to-video",
      {
        input: {
          prompt: prompt.trim(),
          resolution: "720p",
          duration: "5",
          aspect_ratio: "16:9",
          enable_safety_checker: true
        }
      }
    );

    res.json({
      success: true,
      video: result.data.video,
      requestId: result.requestId
    });

  } catch (error) {
    console.error("Generation error:", error.message);

    res.status(500).json({
      error: "Video generation failed."
    });
  }
});

app.listen(PORT, () => {
  console.log(`VYRO AI backend running on port ${PORT}`);
});
