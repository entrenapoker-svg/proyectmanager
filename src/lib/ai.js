
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- PROXY HELPER (Solves CORS) ---
const callAIProxy = async (provider, apiKey, modelName, messages) => {
    try {
        const response = await fetch("/api/proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ provider, apiKey, modelName, messages })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Proxy Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Response Parsing Strategy
        if (provider === 'cohere') {
            return data.text || "";
        }
        // Groq & Hugging Face (OpenAI Compatible)
        return data.choices?.[0]?.message?.content || "";

    } catch (error) {
        console.error(`${provider} Proxy Error:`, error);
        throw error;
    }
};

// --- GROQ ---
const generateGroqResponse = (apiKey, modelName, messages) => callAIProxy('groq', apiKey, modelName, messages);

// --- HUGGING FACE ---
const generateHuggingFaceResponse = (apiKey, modelName, messages) => callAIProxy('huggingface', apiKey, modelName, messages);

// --- COHERE ---
const generateCohereResponse = (apiKey, modelName, messages) => callAIProxy('cohere', apiKey, modelName, messages);

// --- MAIN AI HANDLER ---
export const generateAIResponse = async (userMessage, context = "", projectTitle = "") => {
    try {
        // 1. Get User Preferences from LocalStorage
        let apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
        let modelName = "gemini-1.5-flash"; // Default to a stable model
        let provider = "gemini";

        try {
            const savedPrefs = localStorage.getItem('jama1_global_prefs');
            if (savedPrefs) {
                const parsed = JSON.parse(savedPrefs);

                if (parsed.userProvider) {
                    provider = parsed.userProvider;
                }

                // Priority: User Custom Key > Env Key
                if (parsed.userApiKey && parsed.userApiKey.trim().length > 5) {
                    apiKey = parsed.userApiKey.trim();
                }

                if (parsed.userModel) {
                    modelName = parsed.userModel;
                }
            }
        } catch (e) {
            console.error("Error reading local settings", e);
        }

        if (!apiKey) {
            return {
                text: "⚠️ Falta la API Key. Ve a 'Configuración' y añade tu clave.",
                suggestions: ["Ir a Configuración"]
            };
        }

        console.log(`🤖 AI Request | Provider: ${provider} | Model: ${modelName}`);

        const systemPrompt = `
        ACT AS AN EXPERT PROJECT MANAGER.
        CONTEXT FOR PROJECT "${projectTitle}":
        ${context || "General tasks."}
        
        INSTRUCTIONS:
        1. Analyze based on context.
        2. If asking for specific tasks, list them clearly.
        3. Be direct and concise.
        `;

        let text = "";
        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
        ];

        if (provider === 'groq') {
            text = await generateGroqResponse(apiKey, modelName, messages);
        } else if (provider === 'huggingface') {
            text = await generateHuggingFaceResponse(apiKey, modelName, messages);
        } else if (provider === 'cohere') {
            text = await generateCohereResponse(apiKey, modelName, messages);
        } else {
            // --- GEMINI EXECUTION (Default) ---
            const dynamicGenAI = new GoogleGenerativeAI(apiKey);
            const model = dynamicGenAI.getGenerativeModel({ model: modelName });

            const prompt = `${systemPrompt}\n\nUSER REQUEST: "${userMessage}"`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            text = response.text();
        }

        // Simple parsing logic for suggestions (shared)
        const suggestions = text.split('\n')
            .filter(line => line.trim().match(/^[-*1-9]/))
            .map(line => line.replace(/^[-*0-9.)]+/, '').trim())
            .slice(0, 5);

        return { text, suggestions };

    } catch (error) {
        console.error("AI Configuration Error FULL:", error);

        // Default detailed error
        let errorMsg = `Error Técnico: ${error.message || error.toString()}`;

        // Standardized Error Messages
        const msgLow = errorMsg.toLowerCase();
        if (msgLow.includes("403") || msgLow.includes("leaked") || msgLow.includes("permission denied")) {
            errorMsg = "⛔ API Key Bloqueada o Incorrecta. Verifica tu clave en configuración.";
        } else if (msgLow.includes("429") || msgLow.includes("quota") || msgLow.includes("rate limit") || msgLow.includes("limit")) {
            errorMsg = "⏳ Cuota excedida (Rate Limit). El proveedor está limitando las peticiones. Espera un momento o cambia de proveedor.";
        } else if (msgLow.includes("404") || msgLow.includes("not found") || msgLow.includes("decommissioned")) {
            errorMsg = "❌ Modelo no disponible o retirado. Selecciona otro modelo en Configuración.";
        } else if (msgLow.includes("401") || msgLow.includes("unauthorized")) {
            errorMsg = "🔑 API Key Inválida (401). Verifica que sea correcta para el proveedor seleccionado.";
        } else if (msgLow.includes("loading")) {
            errorMsg = "⏳ El modelo se está cargando en el servidor (Cold Boot). Intenta de nuevo en 30s.";
        }

        return {
            text: errorMsg,
            suggestions: ["Ir a Configuración", "Reintentar"]
        };
    }
};

export const testConnection = async (apiKey, modelName, provider = "gemini") => {
    try {
        console.log(`Testing connection | Provider: ${provider} | Key ending: ...${apiKey?.slice(-4)}`);

        if (provider === 'groq') {
            await generateGroqResponse(apiKey, modelName, [{ role: "user", content: "Hello" }]);
            return { success: true, message: "Conexión con Groq Exitosa" };
        } else if (provider === 'huggingface') {
            await generateHuggingFaceResponse(apiKey, modelName, [{ role: "user", content: "Hello" }]);
            return { success: true, message: "Conexión con Hugging Face Exitosa" };
        } else if (provider === 'cohere') {
            await generateCohereResponse(apiKey, modelName, [{ role: "user", content: "Hello" }]);
            return { success: true, message: "Conexión con Cohere Exitosa" };
        } else {
            // Gemini Test
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelName || "gemini-1.5-flash" });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            const text = response.text ? response.text() : "Success";
            return { success: true, message: "Conexión con Gemini Exitosa" };
        }

    } catch (error) {
        console.error("Test Connection Exception:", error);

        let msg = error.message || "Error desconocido";
        msg = msg.toString();
        const msgLow = msg.toLowerCase();

        if (msgLow.includes("403") || msgLow.includes("leaked")) msg = "Key Bloqueada/Filtrada (403)";
        if (msgLow.includes("429") || msgLow.includes("quota") || msgLow.includes("limit")) msg = "⏳ Límite de Cuota Excedido (429). Espera 1 min.";
        if (msgLow.includes("401") || msgLow.includes("unauthorized") || msgLow.includes("invalid api key")) msg = "❌ Key Inválida (401). Verifica que la copiaste bien.";
        if (msgLow.includes("404") || msgLow.includes("not found") || msgLow.includes("decommissioned")) msg = "❌ Modelo retirado/no existe. Cambia el modelo.";
        if (msgLow.includes("fetch failed")) msg = "Error de Red / Conexión";

        return { success: false, message: msg };
    }
};
