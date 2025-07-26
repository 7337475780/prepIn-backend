import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  conceptExplainPrompt,
  questionAnswerPrompt,
} from "../utils/prompts.js";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Generate interview questions and answers
export const generateInterviewQue = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const prompt = questionAnswerPrompt({
      role,
      experience,
      topicsToFocus,
      numberOfQuestions,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let rawText = response.text;

    // Clean the raw text removing markdown json fences and trimming whitespace
    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ msg: "Failed to generate", err: err.message });
  }
};

// Generate concept explanation for a question
export const generateConceptExp = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ msg: "Question is required" });
    }

    const prompt = conceptExplainPrompt({ question });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let rawText = response.text;

    // Clean the raw text removing markdown json fences and trimming whitespace
    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ msg: "Failed to generate", err: err.message });
  }
};
