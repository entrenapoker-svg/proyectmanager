import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Sparkles, X, Wand2, Send, Copy, HelpCircle, Loader2 } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { generateAIResponse } from '../lib/ai';
import { cn } from '../utils';

const AIAssistant = () => {
    const {
        isListening,
        setIsListening,
        transcript,
        setTranscript,
        setLastCommandResponse,
        lastCommandResponse,
        globalPreferences,
        projects
    } = useProjects();

    const [manualInput, setManualInput] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
            };
            recognitionRef.current = recognition;
        }
    }, [setIsListening, setTranscript]);

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

        const polished = `Tarea: Análisis Experto
Consulta: "${manualInput}"

Requisitos:
1. Respuesta técnica y directa.
2. Formato paso a paso.`;

        setManualInput(polished);
    };

    const handleSend = async () => {
        if (!manualInput.trim() || isLoading) return;

        setIsLoading(true);
        setLastCommandResponse("⏳ Procesando...");

        try {
            // Build context from projects
            const projectContext = projects.map(p => `- ${p.title}: ${p.tasks?.length || 0} tareas`).join('\n');

            const result = await generateAIResponse(manualInput, projectContext, "General");
            setLastCommandResponse(result.text || "Sin respuesta");
        } catch (error) {
            setLastCommandResponse(`❌ Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
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
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Asistente por Voz</span>
                        </div>
                        <button onClick={() => setIsExpanded(false)} className="text-gray-500 hover:text-white">
                            <X size={14} />
                        </button>
                    </div>


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
                                    <span>Optimizar</span>
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
                                    disabled={isLoading}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold border border-cyan-500/20 transition-all ml-auto disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                    <span>{isLoading ? 'Procesando...' : 'Ejecutar'}</span>
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

                </div>
            )}
        </>
    );
};

export default AIAssistant;
