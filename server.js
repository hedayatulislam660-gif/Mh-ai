
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import rateLimit from "express-rate-limit";

const app = express();

app.use(cors({
  origin: "https://hedayatulislam660-gif.github.io"
}));

app.use(express.json({ limit: "20kb" }));

app.use("/api/", rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: { error: "Please try again later." }
}));

app.get("/", (req, res) => {
  res.json({
    name: "MH AI",
    status: "online"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 4000
    ) {
      return res.status(400).json({
        error: "Please enter a valid message."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "AI service is not configured."
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-astra",
      instructions:
        "You are MH AI, a helpful multilingual AI assistant. " +
        "Understand and respond in the user's language. " +
        "Be friendly, accurate and helpful.",
      input: message
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("MH AI request failed:", error.status || "unknown");

    res.status(500).json({
      error: "MH AI could not answer right now. Please try again."
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("MH AI Backend is running!");
});
