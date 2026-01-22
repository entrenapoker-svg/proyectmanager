
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// NOTE: You need to add VITE_GEMINI_API_KEY to your .env file
const genAI = new GoogleGenerativeAI("AIzaSyBwU_AqBYBzO6b7LeawntlKIzxk2Y0mNhw");

export const generateAIResponse = async (userMessage, context = "", projectTitle = "") => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // ... rest of logic ...

        const result = await model.generateContent(prompt);
        // ...

        return {
            text: text,
            suggestions: suggestions
        };

    } catch (error) {
        console.error("AI Generation Error Full Object:", error);
        return {
            text: `Error de Conexión: ${error.message || error.toString()}`,
            suggestions: []
        };
    }
};
