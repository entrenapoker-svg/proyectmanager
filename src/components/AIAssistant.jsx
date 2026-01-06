import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, X } from 'lucide-react';
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
        lastCommandResponse
    } = useProjects();

    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'es-ES';
            recognition.interimResults = true;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onresult = (event) => {
                const current = event.resultIndex;
                const transcriptText = event.results[current][0].transcript;
                setTranscript(transcriptText);

                if (event.results[current].isFinal) {
                    const response = processCommand(transcriptText);
                    setLastCommandResponse(response);
                }
            };

            recognitionRef.current = recognition;
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setLastCommandResponse(null);
            setTranscript('');
            recognitionRef.current?.start();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={toggleListening}
                className={cn(
                    "fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 z-[60] border border-white/10",
                    isListening
                        ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse-slow"
                        : "bg-cyan-500 hover:scale-110 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                )}
            >
                {isListening ? <MicOff className="text-white" /> : <Mic className="text-black" />}
            </button>

            {/* Voice Interface Overlay */}
            {(isListening || transcript || lastCommandResponse) && (
                <div className="fixed bottom-24 right-8 w-80 bg-[#121214]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-[60] animate-fade-in-down">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <Sparkles size={16} className="text-cyan-400" />
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">JAMA1 AI Agent</span>
                        </div>
                        <button onClick={() => { setIsListening(false); setTranscript(''); setLastCommandResponse(null); }} className="text-gray-500 hover:text-white">
                            <X size={14} />
                        </button>
                    </div>

                    {/* Visualizer / Status */}
                    <div className="h-16 flex items-center justify-center mb-4 relative overflow-hidden bg-black/20 rounded-lg">
                        {isListening ? (
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-1 bg-cyan-500 animate-pulse" style={{ height: `${Math.random() * 20 + 10}px`, animationDuration: `${0.2 + Math.random() * 0.3}s` }}></div>
                                ))}
                            </div>
                        ) : (
                            <span className="text-xs text-gray-600 font-mono">Esperando comando...</span>
                        )}
                    </div>

                    {/* Transcript */}
                    {transcript && (
                        <div className="mb-4">
                            <p className="text-sm text-white italic">"{transcript}"</p>
                        </div>
                    )}

                    {/* System Response */}
                    {lastCommandResponse && (
                        <div className="mt-2 text-xs font-mono text-emerald-400 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded">
                            &gt; {lastCommandResponse}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AIAssistant;
