import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Sparkles, X, Wand2, Send, Copy, HelpCircle } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { cn } from '../utils';

const AIAssistant = () => {
    const {
        isListening,
        setIsListening,
        transcript,
        setTranscript,
        processCommand,
        setLastCommandResponse,
        lastCommandResponse,
        globalPreferences,
        setGlobalPreferences
    } = useProjects();

    const [manualInput, setManualInput] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [view, setActiveView] = useState('console'); // 'console' | 'settings'
    const [showHelp, setShowHelp] = useState(false);
    const recognitionRef = useRef(null);
    const inputRef = useRef(null);

    // Sync transcript to input when voice is used
    useEffect(() => {
        if (transcript) {
            setManualInput(transcript);
            setIsExpanded(true);
        }
    }, [transcript]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'es-ES';
            recognition.interimResults = true;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const current = event.resultIndex;
                const transcriptText = event.results[current][0].transcript;
                setTranscript(transcriptText);
                if (event.results[current].isFinal) {
                    processCommand(transcriptText); // Auto-execute if voice? Or waiting for confirmation?
                    // Currently keeping auto-execute for voice legacy, but updating input for visuals
                }
            };
            recognitionRef.current = recognition;
        }
    }, [setIsListening, setTranscript, processCommand]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setLastCommandResponse(null);
            setTranscript('');
            setManualInput('');
            setIsExpanded(true);
            recognitionRef.current?.start();
        }
    };

    const handleMagicWand = () => {
        if (!manualInput.trim()) return;

        // "Consultar Internamente" logic: Use Global Preferences Identity
        const identity = globalPreferences?.identity || "Experto en Productividad y Poker";
        const style = globalPreferences?.style || "Directo y técnico";

        // Logic to construct a "Well-Made Prompt"
        const optimizedPrompt = `[ACT AS: ${identity}]
[TONE: ${style}]
[OBJECTIVE: Comprehensive Analysis]

QUERY: "${manualInput}"

INSTRUCTIONS:
1. Analyze the request based on the user's profile.
2. Provide a structured, step-by-step solution.
3. Focus on high-value actionable advice.`;

        setManualInput(optimizedPrompt);

        // Pulse effect or notification could go here
    };

    const handleSend = () => {
        if (!manualInput.trim()) return;
        const response = processCommand(manualInput);
        setLastCommandResponse(response);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(manualInput);
        alert("Prompt copiado al portapapeles");
    };

    return (
        <>
            {/* Main Floating Button */}
            <button
                onClick={() => {
                    if (!isExpanded) setIsExpanded(true);
                    else toggleListening();
                }}
                className={cn(
                    "fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 z-[60] border border-white/10",
                    isListening
                        ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse-slow"
                        : "bg-cyan-500 hover:scale-110 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                )}
            >
                {isListening ? <MicOff className="text-white" /> : <Mic className="text-black" />}
            </button>

            {/* Expanded Interface */}
            {isExpanded && (
                <div className="fixed bottom-24 right-8 w-96 bg-[#121214]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-[60] animate-fade-in-up flex flex-col gap-4">

                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div className="flex items-center space-x-2">
                            <Sparkles size={16} className="text-cyan-400" />
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">JAMA1 AI Console</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveView(v => v === 'settings' ? 'console' : 'settings')}
                                className={cn("text-xs uppercase tracking-wider hover:text-white transition-colors", view === 'settings' ? "text-cyan-400 font-bold" : "text-gray-500")}
                            >
                                Config
                            </button>
                            <button onClick={() => setIsExpanded(false)} className="text-gray-500 hover:text-white">
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {view === 'settings' ? (
                        <div className="flex flex-col gap-3 p-1">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs text-gray-500">Tu API Key (Gemini)</label>
                                    <button
                                        onClick={() => setShowHelp(!showHelp)}
                                        className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-1"
                                    >
                                        <HelpCircle size={12} />
                                        ¿Cómo conseguirla?
                                    </button>
                                </div>

                                {showHelp && (
                                    <div className="bg-cyan-900/20 border border-cyan-500/30 p-2 rounded-lg mb-2 text-[10px] text-gray-300">
                                        <p className="font-bold text-cyan-400 mb-1">¡Es GRATIS y fácil!</p>
                                        <ol className="list-decimal list-inside space-y-1">
                                            <li>Ve a <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-cyan-400 underline decoration-dashed">Google AI Studio</a>.</li>
                                            <li>Logueate con tu cuenta Google.</li>
                                            <li>Clic en <strong>Create API Key</strong>.</li>
                                            <li>Copia la clave y pégala abajo.</li>
                                        </ol>
                                        <div className="mt-2 text-center">
                                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white px-2 py-1 rounded text-[10px] font-bold transition-colors">
                                                Ir a Crear Key →
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <input
                                    type="password"
                                    value={globalPreferences?.userApiKey || ""}
                                    onChange={(e) => setGlobalPreferences(prev => ({ ...prev, userApiKey: e.target.value }))}
                                    placeholder="Pegar AIzaSy..."
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-cyan-500/50"
                                />
                                <p className="text-[10px] text-gray-600 mt-1">Se guarda en tu navegador. No se comparte.</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Modelo Preferido</label>
                                <select
                                    value={globalPreferences?.userModel || "gemini-2.0-flash-lite-001"}
                                    onChange={(e) => setGlobalPreferences(prev => ({ ...prev, userModel: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-cyan-500/50"
                                >
                                    <option value="gemini-2.0-flash-lite-001">Gemini 2.0 Flash Lite (Rápido)</option>
                                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Potente)</option>
                                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Legacy)</option>
                                    <option value="gemini-pro">Gemini Pro (Estándar)</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Input Area */}
                            <div className="relative">
                                <textarea
                                    ref={inputRef}
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    placeholder="Describe tu tarea o comando..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 min-h-[100px] resize-y font-mono"
                                />

                                {/* Magic Actions Bar */}
                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        onClick={handleMagicWand}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-xs font-bold border border-purple-500/20 transition-all group"
                                        title="Mejorar Prompt (Varita Mágica)"
                                    >
                                        <Wand2 size={14} className="group-hover:rotate-12 transition-transform" />
                                        <span>Enhance</span>
                                    </button>

                                    <button
                                        onClick={copyToClipboard}
                                        className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                        title="Copiar"
                                    >
                                        <Copy size={14} />
                                    </button>

                                    <button
                                        onClick={handleSend}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold border border-cyan-500/20 transition-all ml-auto"
                                    >
                                        <Send size={14} />
                                        <span>Ejecutar</span>
                                    </button>
                                </div>
                            </div>

                            {/* System Response */}
                            {lastCommandResponse && (
                                <div className="mt-2 text-xs font-mono text-emerald-400 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                                    <span className="opacity-50 select-none">&gt; </span>{lastCommandResponse}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default AIAssistant;
