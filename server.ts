import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI server-side with User-Agent header as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// AI Customer Segmentation Insights Endpoint
app.post("/api/segment-insights", async (req, res) => {
  try {
    const { vertical, features, clustersSumStats } = req.body;

    if (!clustersSumStats || !Array.isArray(clustersSumStats)) {
      res.status(400).json({ error: "Missing or invalid clusters statistical data." });
      return;
    }

    const payloadText = JSON.stringify({
      vertical: vertical || "Generic / E-commerce Retail",
      featuresSelected: features || [],
      clustersData: clustersSumStats,
    });

    const prompt = `
      You are an expert Chief Marketing Officer (CMO) and Senior Customer Analytics Data Scientist.
      Analyze the following customer segmentation statistics resulting from a K-Means clustering algorithm.

      Business Vertical/Context: ${vertical || "General Retail"}
      Features used for Clustering: ${features ? features.join(", ") : "Customer Attributes"}

      Detailed Segment Statistics:
      ${payloadText}

      For each of the ${clustersSumStats.length} clusters, formulate an in-depth target persona, core behavioral insights, strategic action plans, and a highly personalized marketing email template.
      Ensure the persona name represents their actual characteristics (e.g. "Frugal Occasional Buyers", "VIP Super-Spenders", "Tech-Savvy Bargain Hunters").
    `;

    const systemInstruction = `
      You are an elite business analyst and customer segmentation strategist.
      Translate raw numerical cluster centroids and distributions into practical, human-centric marketing gold.
      Provide highly actionable, creative, and data-backed insights. Avoid dry generic recommendations like "send emails". Be specific to the business context.
    `;

    // Configure schema to receive highly structured, clean JSON back for individual rendering
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        overallAnalysis: {
          type: Type.STRING,
          description: "A summary combining the segmentation insights and highlighting high-level opportunities, under 150 words.",
        },
        segments: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              clusterId: { type: Type.INTEGER },
              name: { type: Type.STRING, description: "Highly engaging, literal and descriptive customer segment archetype name representing their trait group." },
              personaDescription: { type: Type.STRING, description: "A detailed 2-3 sentence characterization of this customer profile, their motivations, goals, and style of engagement." },
              dominantTraits: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3-4 main traits (e.g., 'Highly price sensitive', 'Purchases on weekends', 'Low digital-touchpoint affinity').",
              },
              marketingStrategies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3-4 specific targeting strategies, channel selection reasoning, or loyalty adjustments.",
              },
              recommendedChannel: { type: Type.STRING, description: "The single best communication channel (e.g., 'Email', 'SMS', 'In-App Push', 'Personal Outreach', 'Direct Mail')." },
              discountSensitivity: { type: Type.STRING, description: "Sensitivity level: High, Medium, Low, or Value-Only." },
              campaignIdea: { type: Type.STRING, description: "A highly creative campaign name and core mechanic concept tailored just for them." },
              emailSubject: { type: Type.STRING, description: "Irresistible, high-CTR subject line matching the persona's tone." },
              emailBody: { type: Type.STRING, description: "The complete, high-converting personalized email content, incorporating variable handles." },
            },
            required: [
              "clusterId",
              "name",
              "personaDescription",
              "dominantTraits",
              "marketingStrategies",
              "recommendedChannel",
              "discountSensitivity",
              "campaignIdea",
              "emailSubject",
              "emailBody",
            ],
          },
        },
      },
      required: ["overallAnalysis", "segments"],
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.3,
        },
      });
    } catch (err: any) {
      console.warn("gemini-3.5-flash failed or was rate limited, trying gemini-2.5-flash fallback...", err.message || err);
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.3,
        },
      });
    }

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Received empty response from Gemini API.");
    }

    const jsonResult = JSON.parse(resultText);
    res.json(jsonResult);
  } catch (error: any) {
    console.error("Gemini API Error in customer segmentation insights API:", error);
    res.status(500).json({
      error: "Failed to generate AI insights.",
      details: error.message || error,
    });
  }
});

async function startServer() {
  const PORT = 3000;

  // Use Vite middleware in development env
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving of static built files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Customer Segmentation Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
