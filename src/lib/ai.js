
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with Hardcoded Key (Hotfix)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE");

export const generateAIResponse = async (userMessage, context = "", projectTitle = "") => {
    try {
        // Use gemini-1.5-flash-001 for specific stable version to avoid 404s
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

        const prompt = `
        ACT AS AN EXPERT PROJECT MANAGER.
        CONTEXT FOR PROJECT "${projectTitle}":
        ${context || "General tasks."}
        
        USER REQUEST: "${userMessage}"
        
        INSTRUCTIONS:
        1. Analyze based on context.
        2. If asking for specific tasks, list them clearly.
        3. Be direct and concise.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        const text = response.text();

        // Simple parsing logic
        const suggestions = text.split('\n')
            .filter(line => line.trim().match(/^[-*1-9]/)) // Lines starting with list markers
            .map(line => line.replace(/^[-*0-9.)]+/, '').trim())
            .slice(0, 5);

        return { text, suggestions };

    } catch (error) {
        console.error("AI Error:", error);
        return {
            text: `(Error IA: ${error.message || "Desconocido"}). Verifica tu conexión.`,
            suggestions: []
        };
    }
};
