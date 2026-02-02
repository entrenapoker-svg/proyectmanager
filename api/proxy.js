export default async function handler(req, res) {
    // Handling CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { provider, apiKey, modelName, messages } = req.body;

        if (!provider || !apiKey) {
            return res.status(400).json({ error: "Missing provider or apiKey" });
        }

        let url = "";
        let requestBody = {};

        // Prepare request based on provider
        if (provider === 'groq') {
            url = "https://api.groq.com/openai/v1/chat/completions";
            requestBody = {
                messages,
                model: modelName,
                temperature: 0.7
            };
        } else if (provider === 'huggingface') {
            // FIX strategy: The v1/chat/completions endpoint on the free tier is unstable/deprecated.
            // We switch to the RAW INFERENCE strategy.
            url = `https://api-inference.huggingface.co/models/${modelName}`;

            // Manually construct the prompt from messages
            const systemMsg = messages.find(m => m.role === 'system')?.content || "";
            const userMsg = messages.find(m => m.role === 'user')?.content || "";
            // Use a generic chat format usually understood by instruction-tuned models
            const fullPrompt = `${systemMsg ? "System: " + systemMsg + "\n" : ""}User: ${userMsg}\nAssistant:`;

            requestBody = {
                inputs: fullPrompt,
                parameters: {
                    max_new_tokens: 1024,
                    temperature: 0.7,
                    return_full_text: false
                }
            };
        } else if (provider === 'cohere') {
            url = "https://api.cohere.ai/v1/chat";
            const systemMsg = messages.find(m => m.role === 'system')?.content || "";
            const userMsg = messages.find(m => m.role === 'user')?.content || "";
            requestBody = {
                message: userMsg,
                model: modelName,
                preamble: systemMsg,
                temperature: 0.7
            };
        } else {
            return res.status(400).json({ error: "Provider not supported by proxy" });
        }

        // Execute Server-Side Request
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Proxy Error [${provider}]:`, errorText);
            return res.status(response.status).json({ error: errorText, details: "Upstream API Error" });
        }

        const data = await response.json();

        // Normalize Hugging Face Raw Response
        if (provider === 'huggingface' && Array.isArray(data)) {
            return res.status(200).json({
                choices: [{
                    message: {
                        content: data[0]?.generated_text || ""
                    }
                }]
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Proxy Server Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
