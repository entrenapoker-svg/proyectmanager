
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with Hardcoded Key (Hotfix)
export const generateAIResponse = async (userMessage, context = "", projectTitle = "") => {
    try {
        // 1. Get User Preferences from LocalStorage
        let apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
        let modelName = "gemini-2.0-flash-lite-001"; // Default Fallback

        try {
            const savedPrefs = localStorage.getItem('jama1_global_prefs');
            if (savedPrefs) {
                const parsed = JSON.parse(savedPrefs);
                if (parsed.userApiKey && parsed.userApiKey.trim().length > 10) {
                    // Safety check: Ignore the leaked key to force user to input new one if they accidentally pasted the old one
                    if (!parsed.userApiKey.includes("AIzaSyBwU_AqBYBzO6b7LeawntlKIzxk2Y0mNhw")) {
                        apiKey = parsed.userApiKey;
                        console.log("Using User Custom API Key");
                    }
                }
                if (parsed.userModel) {
                    modelName = parsed.userModel;
                }
            }
        } catch (e) {
            console.error("Error reading local AI prefs", e);
        }

        // 2. Initialize Client Dynamically
        const dynamicGenAI = new GoogleGenerativeAI(apiKey);
        const model = dynamicGenAI.getGenerativeModel({ model: modelName });

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
