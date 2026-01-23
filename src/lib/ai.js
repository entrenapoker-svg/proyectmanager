
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with Hardcoded Key (Hotfix)
const genAI = new GoogleGenerativeAI("AIzaSyBwU_AqBYBzO6b7LeawntlKIzxk2Y0mNhw");

export const generateAIResponse = async (userMessage, context = "", projectTitle = "") => {
    try {
        // Use gemini-1.5-flash for best performance/cost ratio
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
