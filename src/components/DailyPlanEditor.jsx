import React, { useState } from 'react';
import { X, CheckSquare, Edit3, Mic, Save } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { cn } from '../utils';

const DailyPlanEditor = () => {
    const { dailyPlan, setDailyPlan, planMode, setPlanMode, updatePlanItemDetails, isListening, setIsListening, setTranscript } = useProjects();
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    if (!planMode) return null;

    const handleEditClick = (task) => {
        setEditingId(task.id);
        setEditText(task.details || '');
    };

    const handleSaveDetails = (id) => {
        updatePlanItemDetails(id, editText);
        setEditingId(null);
    };

    // Very simple voice-to-text for the detail field (mock simulation of hook usage)
    const handleVoiceInput = () => {
        alert("Función de dictado específica para este campo en desarrollo. Usa el botón principal por ahora.");
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-start justify-center pt-20 bg-black/80 backdrop-blur-md animate-fade-in-down overflow-y-auto">
            <div className="w-full max-w-3xl bg-[#0a0a0b] border border-emerald-500/30 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)] relative mb-20">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-emerald-900/10 rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center tracking-tight">
                            <CheckSquare className="mr-3 text-emerald-400" size={28} />
                            Plan Diario de Ejecución
                        </h2>
                        <p className="text-emerald-400/60 text-sm mt-1 font-mono">
                            &gt; Define la estrategia específica para cada tarea prioritaria.
                        </p>
                    </div>
                    <button
                        onClick={() => setPlanMode(false)}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* List */}
                <div className="p-6 space-y-4">
                    {dailyPlan.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No hay tareas pendientes prioritarias. ¡Todo limpio!
                        </div>
                    ) : dailyPlan.map((task) => (
                        <div
                            key={task.id}
                            className={cn(
                                "group border rounded-xl transition-all duration-300",
                                editingId === task.id ? "bg-white/5 border-emerald-500/50 ring-1 ring-emerald-500/20" : "bg-[#121214] border-white/5 hover:border-white/10"
                            )}
                        >
                            {/* Task Header */}
                            <div className="p-4 flex items-start justify-between cursor-pointer" onClick={() => !editingId && handleEditClick(task)}>
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full bg-${task.color}-500 shadow-[0_0_10px_currentColor] opacity-80`}></div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-100">{task.text}</h3>
                                        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{task.projectTitle}</span>
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-emerald-400 transition-opacity">
                                    <Edit3 size={18} />
                                </button>
                            </div>

                            {/* Expanded Details Editor */}
                            {(editingId === task.id || task.details) && (
                                <div className="px-4 pb-4 pl-10">
                                    {editingId === task.id ? (
                                        <div className="animate-fade-in-down">
                                            <label className="block text-xs uppercase text-emerald-500 font-bold mb-2">Estrategia / Detalle Específico</label>
                                            <textarea
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-3 text-gray-300 font-mono text-sm focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
                                                placeholder="Dicta o escribe aquí los pasos específicos para completar esta tarea hoy..."
                                                autoFocus
                                            />
                                            <div className="flex justify-between items-center mt-3">
                                                <button
                                                    type="button"
                                                    onClick={handleVoiceInput}
                                                    className="flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <Mic size={14} />
                                                    <span>Dictar detalle</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSaveDetails(task.id)}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                                >
                                                    <Save size={14} />
                                                    <span>Guardar Detalle</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-black/30 rounded-lg p-3 border-l-2 border-gray-700">
                                            <p className="text-gray-400 text-sm leading-relaxed font-mono">
                                                {task.details}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex justify-end">
                    <button
                        onClick={() => setPlanMode(false)}
                        className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    >
                        Confirmar Plan del Día
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyPlanEditor;
