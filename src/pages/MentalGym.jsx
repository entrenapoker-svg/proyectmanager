import React, { useState } from 'react';
import { Brain, Play, CheckCircle, Activity, Coffee, BookOpen, ChevronRight, BarChart2 } from 'lucide-react';
import { cn } from '../utils';

const MentalGym = () => {
    // Estado de demostración para KPIs y checklists
    const [checklist, setChecklist] = useState({
        hydration: false,
        meditation: false,
        objectives: false,
        noDistractions: false
    });

    const toggleCheck = (key) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const completedCount = Object.values(checklist).filter(Boolean).length;
    const progress = (completedCount / Object.keys(checklist).length) * 100;

    return (
        <main className="flex-1 ml-0 md:ml-64 mt-14 p-4 md:p-8 min-h-screen bg-[#0a0a0b] relative pb-32">

            {/* Background Ambience (Matching Dashboard style) */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 animate-fade-in-down">
                            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                <Brain className="text-emerald-500" size={32} />
                            </div>
                            Gimnasio Mental
                        </h1>
                        <p className="text-gray-400 mt-2 max-w-2xl font-mono text-sm">
                            <span className="text-emerald-500">&gt;</span> Centro de preparación cognitiva de alto rendimiento v1.0
                        </p>
                    </div>

                    {/* KPI Cards (Header Stats) */}
                    <div className="flex gap-4">
                        <div className="bg-[#121214] border border-white/10 rounded-xl p-3 min-w-[120px]">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Estado de Flow</span>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">85</span>
                                <span className="text-xs text-emerald-500 font-mono">%</span>
                            </div>
                        </div>
                        <div className="bg-[#121214] border border-white/10 rounded-xl p-3 min-w-[120px]">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Días en Racha</span>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">12</span>
                                <span className="text-xs text-orange-500 font-mono">🔥</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>

                    {/* Card 1: Rutina de Alineación (Interactive) */}
                    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group shadow-2xl shadow-black/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                                <Coffee className="text-orange-500" size={20} />
                                Rutina de Alineación
                            </h3>
                            <span className={cn(
                                "text-xs font-mono px-2 py-1 rounded transition-colors",
                                progress === 100 ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-gray-500"
                            )}>{completedCount}/4</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-800 h-1 rounded-full mb-6 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="space-y-3">
                            <CheckItem
                                label="Hidratación (500ml)"
                                checked={checklist.hydration}
                                onClick={() => toggleCheck('hydration')}
                            />
                            <CheckItem
                                label="Meditación (10min)"
                                checked={checklist.meditation}
                                onClick={() => toggleCheck('meditation')}
                            />
                            <CheckItem
                                label="Revisar Objetivos"
                                checked={checklist.objectives}
                                onClick={() => toggleCheck('objectives')}
                            />
                            <CheckItem
                                label="Eliminar Distracciones"
                                checked={checklist.noDistractions}
                                onClick={() => toggleCheck('noDistractions')}
                            />
                        </div>
                    </div>


                    {/* Card 2: Warm Up (Poker Specific) */}
                    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 rounded-full blur-[60px] transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                                <Activity className="text-cyan-500" size={20} />
                                Warm Up Técnico
                            </h3>
                            <button className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg hover:bg-cyan-500 hover:text-black transition-colors">
                                <Play size={16} fill="currentColor" />
                            </button>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="p-4 bg-black/40 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors cursor-pointer">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-300">Revisión de Rangos Preflop</span>
                                    <ChevronRight size={14} className="text-gray-600" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1 font-mono">Ultima práctica: Ayer</p>
                            </div>
                            <div className="p-4 bg-black/40 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors cursor-pointer">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-300">Análisis de Manos Marcadas</span>
                                    <ChevronRight size={14} className="text-gray-600" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1 font-mono">3 manos pendientes</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Bitácora / Journaling */}
                    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-all group md:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                                <BookOpen className="text-purple-500" size={20} />
                                Bitácora Pre-Sesión
                            </h3>
                        </div>
                        <div className="bg-black/40 rounded-xl border border-white/5 p-1">
                            <textarea
                                className="w-full bg-transparent text-gray-300 text-sm p-3 focus:outline-none min-h-[120px] resize-none font-mono placeholder:text-gray-700"
                                placeholder="¿Cómo te sientes hoy? ¿Cuál es tu objetivo principal para la sesión?..."
                            />
                            <div className="flex justify-between items-center px-3 py-2 border-t border-white/5 bg-white/[0.02]">
                                <span className="text-[10px] text-gray-600 uppercase font-bold tracking-wider">GUARDADO AUTO</span>
                                <button className="text-xs text-purple-400 hover:text-purple-300 font-bold">Historial Completo</button>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Stats View (Placeholder for deeper analytics) */}
                    <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-emerald-900/10 to-cyan-900/10 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/5 rounded-full">
                                <BarChart2 size={24} className="text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Análisis de Varianza</h3>
                                <p className="text-sm text-gray-400 max-w-md">Tu desempeño mental vs. resultados muestra una correlación positiva del 80% esta semana.</p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-sm transition-all whitespace-nowrap">
                            Ver Reporte Detallado
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
};

// Componente Helper para CheckItems
const CheckItem = ({ label, checked, onClick }) => (
    <div
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border",
            checked
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
        )}
    >
        <div className={cn(
            "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
            checked ? "bg-emerald-500 border-emerald-500" : "border-gray-600 group-hover:border-gray-400"
        )}>
            {checked && <CheckCircle size={12} className="text-black" strokeWidth={3} />}
        </div>
        <span className={cn(
            "text-sm font-medium transition-colors select-none",
            checked ? "text-emerald-100 line-through decoration-emerald-500/50" : "text-gray-300"
        )}>{label}</span>
    </div>
);

export default MentalGym;
