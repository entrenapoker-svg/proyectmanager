
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with Hardcoded Key (Hotfix)
export const generateAIResponse = async (userMessage, context = "", projectTitle = "") => {
    try {
        // 1. Get User Preferences from LocalStorage
        let apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
        let modelName = "gemini-2.0-flash-lite-001";

        try {
            const savedPrefs = localStorage.getItem('jama1_global_prefs');
            if (savedPrefs) {
                const parsed = JSON.parse(savedPrefs);
                // Priority: User Custom Key > Env Key
                if (parsed.userApiKey && parsed.userApiKey.trim().length > 20) {
                    apiKey = parsed.userApiKey.trim();
                }
                if (parsed.userModel) {
                    modelName = parsed.userModel;
                }
            }
        } catch (e) {
            console.error("Error reading local settings", e);
        }

        // 2. SECURITY CHECK: Block known leaked keys or empty keys explicitly
        const LEAKED_KEY_SIGNATURE = "AIzaSyBwU_AqBYBzO6b7LeawntlKIzxk2Y0mNhw"; // The leaked one

        if (!apiKey || apiKey.length < 20) {
            return {
                text: "⚠️ Falta la API Key. Ve a 'Configuración' en el menú izquierda y pega tu clave de Google Gemini (es gratis).",
                suggestions: ["Ir a Configuración"]
            };
        }

        if (apiKey.includes(LEAKED_KEY_SIGNATURE) || apiKey.includes("YOUR_API_KEY")) {
            return {
                text: "⛔ ERROR DE SEGURIDAD: Estás usando una API Key que ha sido bloqueada por Google por filtrarse. Por favor, genera una NUEVA en Google AI Studio y pégala en Configuración.",
                suggestions: ["Generar Nueva Key", "Ir a Configuración"]
            };
        }

        console.log(`🤖 AI Request using Model: ${modelName} | Key ending in: ...${apiKey.slice(-4)}`);

        // 3. Initialize Client Dynamically
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
            .filter(line => line.trim().match(/^[-*1-9]/))
            .map(line => line.replace(/^[-*0-9.)]+/, '').trim())
            .slice(0, 5);

        return { text, suggestions };

    } catch (error) {
        console.error("AI Configuration Error FULL:", error);

        // Default detailed error
        let errorMsg = `Error Técnico: ${error.message || error.toString()}`;

        if (error.message.includes("403") || error.message.includes("leaked")) {
            errorMsg = "⛔ TU API KEY ESTÁ BLOQUEADA O ES INCORRECTA. Google la rechazó (Error 403). Ve a Configuración y verifica que la copiaste bien.";
        } else if (error.message.includes("429")) {
            errorMsg = "⏳ Cuota excedida (Rate Limit). Google está limitando las peticiones. Espera un poco.";
        } else if (error.message.includes("404")) {
            errorMsg = "❌ Modelo no encontrado. El modelo seleccionado puede no estar disponible. Prueba 'gemini-1.5-flash' en Configuración.";
        } else if (error.message.includes("API key not valid")) {
            errorMsg = "🔑 La API Key no es válida. Asegúrate de haberla copiado completa (empieza por AIzaSy...).";
        }

        return {
            text: errorMsg,
            suggestions: ["Ir a Configuración", "Reintentar"]
        };
    }
};

export const testConnection = async (apiKey, modelName = "gemini-2.0-flash-lite-001") => {
    try {
        console.log("Testing connection with key ending in:", apiKey?.slice(-4));
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        // Minimal token test
        const result = await model.generateContent("Hello");
        const response = await result.response;
        // Access text safely
        const text = response.text ? response.text() : "Success";

        return { success: true, message: "Validada correctamente" };
    } catch (error) {
        console.error("Test Connection Exception:", error);

        let msg = error.message || "Error desconocido";
        // Ensure string conversion
        msg = msg.toString();

        if (msg.includes("403") || msg.includes("leaked")) msg = "Key Bloqueada/Filtrada (403)";
        if (msg.includes("429") || msg.includes("quota") || msg.includes("limit")) msg = "⏳ Límite de Cuota Excedido (429). Espera 1 min.";
        if (msg.includes("400") || msg.includes("expired") || msg.includes("API key expired")) msg = "❌ Key Expirada/Inválida (400). Crea una nueva.";
        if (msg.includes("404")) msg = "Modelo no disponible (404)";
        if (msg.includes("fetch failed")) msg = "Error de Red / Conexión";

        return { success: false, message: msg };
    }
};
