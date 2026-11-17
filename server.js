
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;

fal.config({
  credentials: process.env.FAL_KEY
});

app.get("/", (req, res) => {
  res.json({
    name: "VYRO AI Backend",
    version: "6.2",
    status: "online"
  });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body || {};

    if (!process.env.FAL_KEY) {
      return res.status(503).json({
        error: "AI provider is not configured yet."
      });
    }

    if (
      typeof prompt !== "string" ||
      prompt.trim().length < 3 ||
      prompt.length > 1000
    ) {
      return res.status(400).json({
        error: "Enter a prompt between 3 and 1000 characters."
      });
    }

    const result = await fal.subscribe(
      "fal-ai/fast-svd",
      {
        input: {
          prompt: prompt.trim()
        }
      }
    );

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error("Generation error:", error.message);

    res.status(500).json({
      error: "Video generation failed. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`VYRO AI backend running on port ${PORT}`);
});
