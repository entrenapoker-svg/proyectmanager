
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// NOTE: You need to add VITE_GEMINI_API_KEY to your .env file
const genAI = new GoogleGenerativeAI("AIzaSyBwU_AqBYBzO6b7LeawntlKIzxk2Y0mNhw");

export const generateAIResponse = async (userMessage, context = "", projectTitle = "") => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        ACT AS AN EXPERT PROJECT MANAGER AND SPECIALIST.
        
        CONTEXT FOR THIS PROJECT ("${projectTitle}"):
        ${context || "No specific context provided. Use general productivity best practices."}

        USER REQUEST:
        "${userMessage}"

        INSTRUCTIONS:
        1. Analyze the request based strictly on the provided context.
        2. If the user asks for tasks, provide them in a list format that I can easily parse.
        3. Be direct, actionable, and concise.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Simple parsing to find action items/suggestions (lines starting with -, *, or number)
        const suggestions = text.split('\n')
            .filter(line => line.trim().match(/^[-*1-9]/))
            .map(line => line.replace(/^[-*0-9.)]+/, '').trim())
            .slice(0, 5); // Take top 5

        return {
            text: text,
            suggestions: suggestions
        };

    } catch (error) {
        console.error("AI Generation Error:", error);
        return {
            text: "Error al conectar con la IA. Por favor verifica tu API Key en el archivo .env (VITE_GEMINI_API_KEY).",
            suggestions: []
        };
    }
};
