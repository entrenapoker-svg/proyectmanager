import React, { useState } from 'react';
import { X, Save, BarChart2, Activity, Shield, Zap, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SessionDebrief = ({ isOpen, onClose, onSave }) => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        concentration: 5,
        tilt: 0,
        distractions: 0,
        resilience: 5, // Resistencia ante malos resultados
        badBeats: 0,
        notes: ''
    });

    if (!isOpen) return null;

    const handleSliderChange = (key, e) => {
        setData(prev => ({ ...prev, [key]: parseInt(e.target.value) }));
    };

    const handleFinish = () => {
        // Guardar en LocalStorage (Simulando DB)
        const sessions = JSON.parse(localStorage.getItem('jama1_poker_sessions') || '[]');
        const newSession = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...data
        };
        sessions.push(newSession);
        localStorage.setItem('jama1_poker_sessions', JSON.stringify(sessions));

        onSave && onSave(newSession);

        // Proceder al logout o cierre real
        // signOut(); 
        // navigate('/login');
        // Por ahora solo cerramos el modal para demo
        onClose();
        alert("Sesión guardada en historial local.");
    };

    const renderSlider = (label, key, icon, colorClass) => (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <label className="flex items-center gap-2 text-gray-200 font-bold">
                    {icon}
                    {label}
                </label>
                <div className={`text-xl font-mono font-bold ${colorClass}`}>
                    {data[key]}/10
                </div>
            </div>
            <input
                type="range"
                min="0"
                max="10"
                value={data[key]}
                onChange={(e) => handleSliderChange(key, e)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                <span>Bajo</span>
                <span>Óptimo</span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-cyan-900/10 to-transparent">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Debriefing de Sesión</h2>
                        <p className="text-cyan-400 text-sm font-mono">&gt; Análisis de rendimiento cognitivo</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-8">
                    {/* Concentración */}
                    {renderSlider("Nivel de Concentración", "concentration", <Zap size={18} className="text-yellow-400" />, "text-yellow-400")}

                    {/* Tilt */}
                    {renderSlider("Nivel de Tilt (0 = Zen)", "tilt", <AlertTriangle size={18} className="text-red-500" />, "text-red-500")}

                    {/* Resistencia */}
                    {renderSlider("Resistencia (Bad Beats)", "resilience", <Shield size={18} className="text-emerald-500" />, "text-emerald-500")}

                    {/* Desconcentraciones Counter */}
                    <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                        <label className="flex items-center gap-2 text-gray-200 font-bold">
                            <Activity size={18} className="text-purple-400" />
                            Cant. Desconcentraciones
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setData(prev => ({ ...prev, distractions: Math.max(0, prev.distractions - 1) }))}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                            >-</button>
                            <span className="text-xl font-mono font-bold w-12 text-center">{data.distractions}</span>
                            <button
                                onClick={() => setData(prev => ({ ...prev, distractions: prev.distractions + 1 }))}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                            >+</button>
                        </div>
                    </div>

                    <button
                        onClick={handleFinish}
                        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        Guardar Sesión y Analizar
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SessionDebrief;
