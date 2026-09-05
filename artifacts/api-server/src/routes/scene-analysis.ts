import { Router, type IRouter } from "express";
import { AnalyzeSceneBody, AnalyzeSceneResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const providerUrl = "https://generativelanguage.googleapis.com/v1beta/models";
const defaultModel = "gemini-2.5-flash";

const analysisShape = {
  type: "OBJECT",
  properties: {
    summary: { type: "STRING" },
    findings: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          severity: { type: "STRING", enum: ["low", "medium", "high", "critical"] },
          confidence: { type: "NUMBER" },
          explanation: { type: "STRING" },
          evidence: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["title", "severity", "confidence", "explanation", "evidence"],
      },
    },
    repairs: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          description: { type: "STRING" },
          tradeoff: { type: "STRING" },
        },
        required: ["title", "description", "tradeoff"],
      },
    },
  },
  required: ["summary", "findings", "repairs"],
} as const;

router.post("/scene-analysis", async (req, res) => {
  const parsed = AnalyzeSceneBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Scene and Series Bible context are required." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    req.log.warn("Scene analysis requested but GEMINI_API_KEY is not configured in environment");
    res.status(503).json({
      error: "AI analysis is not configured yet. Add GEMINI_API_KEY to enable the continuity pass.",
    });
    return;
  }

  const { scene, seriesBible } = parsed.data;
  const prompt = `You are a continuity editor for the television series Echoes of Tomorrow.

Analyze the supplied screenplay scene against the supplied Series Bible. Treat the Series Bible as established canon and the scene as the proposed new material. Identify only contradictions or material continuity risks supported by the supplied evidence. Explain exactly which canon facts conflict, cite episode/scene/timeline references in the evidence array, and distinguish a true contradiction from an intentional mystery.

Return JSON matching the requested schema. Include at least one finding when the supplied material supports a continuity risk. Provide at least two distinct narrative repairs that preserve as much of the scene's intent as possible. Repairs may preserve an apparent impossibility as a story mystery, but must explain the continuity tradeoff. Confidence is a 0-100 number.

SCREENPLAY SCENE:
${JSON.stringify(scene, null, 2)}

SERIES BIBLE:
${JSON.stringify(seriesBible, null, 2)}`;

  try {
    const model = process.env.GEMINI_MODEL || defaultModel;
    const response = await fetch(
      `${providerUrl}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: analysisShape,
          },
        }),
      },
    );

    if (!response.ok) {
      let errorBody: unknown;
      try {
        errorBody = await response.json();
      } catch {
        try {
          errorBody = await response.text();
        } catch {
          errorBody = "Failed to retrieve response body";
        }
      }

      req.log.error(
        {
          status: response.status,
          statusText: response.statusText,
          model,
          error: errorBody,
        },
        "Gemini API returned non-2xx status",
      );

      res.status(503).json({
        error: "The AI provider could not complete the continuity pass.",
      });
      return;
    }

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
      promptFeedback?: unknown;
    };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      req.log.error(
        {
          model,
          payload,
        },
        "Gemini API returned an empty analysis or missing candidate text",
      );
      res.status(503).json({ error: "The AI provider returned an empty analysis." });
      return;
    }

    let parsedJson: Record<string, unknown>;
    try {
      const rawParsed = JSON.parse(text);
      if (typeof rawParsed !== "object" || rawParsed === null || Array.isArray(rawParsed)) {
        throw new Error("Parsed Gemini output is not a JSON object");
      }
      parsedJson = rawParsed as Record<string, unknown>;
    } catch (parseError) {
      req.log.error(
        { err: parseError, rawText: text, model },
        "Failed to parse Gemini output text as JSON object",
      );
      res.status(503).json({ error: "The AI provider returned an invalid continuity analysis." });
      return;
    }

    const validated = AnalyzeSceneResponse.safeParse({
      ...parsedJson,
      provider: "Google Gemini",
    });

    if (!validated.success) {
      req.log.error(
        { zodErrors: validated.error.format(), parsedJson, model },
        "Gemini output failed validation against AnalyzeSceneResponse schema",
      );
      res.status(503).json({ error: "The AI provider returned an invalid continuity analysis." });
      return;
    }

    res.json(validated.data);
  } catch (error) {
    req.log.error({ err: error }, "Unexpected error during scene analysis");
    res.status(503).json({ error: "The AI provider returned an invalid continuity analysis." });
  }
});

export default router;