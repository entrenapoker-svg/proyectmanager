import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableProjectCard } from './SortableProjectCard';
import ProjectModal from './ProjectModal';
import DailyPlanEditor from './DailyPlanEditor';
import { useProjects } from '../context/ProjectContext';
import { Plus, RefreshCw, CheckSquare, Settings, Trash2, X, Palette } from 'lucide-react';
import { cn } from '../utils';
import { testConnection } from '../lib/ai';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
    const { projects, reorderProjects, addProject, updateProject, deleteProject, generateDailyPlan, processCommand, activeView, globalPreferences, setGlobalPreferences } = useProjects();
    const { currentTheme, setCurrentTheme, themes, theme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [selectedProjects, setSelectedProjects] = useState([]);

    const toggleSelection = (id) => {
        setSelectedProjects(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const clearSelection = () => setSelectedProjects([]);

    const handleBulkDelete = async () => {
        if (!window.confirm(`¿Estás seguro de eliminar ${selectedProjects.length} proyectos seleccionados? Esta acción es irreversible.`)) return;

        for (const id of selectedProjects) {
            await deleteProject(id);
        }
        clearSelection();
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            reorderProjects(active.id, over.id);
        }
    };

    const alert = {
        type: 'warning',
        message: '⚠ ALERT: High variance detected in last Poker session. Review required.',
    };

    const handleCreateNew = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleSave = (data) => {
        if (editingProject) {
            updateProject(editingProject.id, data);
        } else {
            addProject(data);
        }
    };

    const handleTestConnection = async (apiKey, model, provider = "gemini") => {
        const btn = document.getElementById('save-prefs-btn');
        const originalText = "Confirmar y Probar Configuración";

        if (btn) {
            btn.innerText = "⏳ Verificando con " + (provider === 'groq' ? "Groq..." : "Google...");
            btn.disabled = true;

            try {
                const result = await testConnection(apiKey, model, provider);
                console.log("Test Connection Result:", result);

                if (result && result.success) {
                    btn.innerText = "✅ ¡Conexión Exitosa!";
                    btn.className = "w-full py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 font-bold text-sm transition-all flex items-center justify-center gap-2";
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.disabled = false;
                        btn.className = "w-full py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 font-bold text-sm hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2";
                    }, 3000);
                } else {
                    const errorMsg = result?.message || "Error desconocido";

                    // Special handling for rate limit
                    if (errorMsg.includes("429") || errorMsg.includes("Cuota") || errorMsg.includes("Esperar")) {
                        btn.innerText = "⏳ " + errorMsg;
                        btn.className = "w-full py-2 bg-amber-500/20 border border-amber-500/50 rounded-lg text-amber-400 font-bold text-sm transition-all flex items-center justify-center gap-2";
                    } else {
                        // Allow longer messages up to 50 chars
                        btn.innerText = errorMsg.length > 50 ? "❌ Error (Ver Consola)" : ("❌ " + errorMsg);
                        btn.className = "w-full py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-bold text-sm transition-all flex items-center justify-center gap-2";
                    }

                    console.warn(errorMsg);

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.disabled = false;
                        btn.className = "w-full py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 font-bold text-sm hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2";
                    }, 5000);
                }
            } catch (err) {
                console.error("Dashboard Button Error:", err);
                btn.innerText = "❌ Error Crítico";
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 3000);
            }
        }
    };

    return (
        <main className={`flex-1 p-4 md:p-8 min-h-full relative pb-32 transition-colors duration-300`}>
            {/* Background Orbs only for Dark Mode */}
            {currentTheme === 'dark' && (
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px]"></div>
                </div>
            )}

            <DailyPlanEditor />

            <div className="relative z-10 w-full max-w-none">
                {alert && (
                    <div className="w-full bg-orange-500/10 border border-orange-500/20 text-orange-200 px-4 py-2 rounded-lg mb-8 flex items-center animate-fade-in-down">
                        <span className="font-mono text-sm tracking-tight">{alert.message}</span>
                    </div>
                )}

                <div className="flex items-center justify-between mb-8">
                    <h2 className={`text-xl font-bold tracking-tight ${theme.text}`}>Active Pillars</h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={generateDailyPlan}
                            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm font-bold text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        >
                            <CheckSquare size={16} />
                            <span>Tareas para Hoy</span>
                        </button>
                        <button
                            onClick={handleCreateNew}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-bold text-cyan-400 border ${theme.bgSecondary} ${theme.border} hover:bg-cyan-500/10`}
                        >
                            <Plus size={16} />
                            <span>Nuevo Proyecto</span>
                        </button>
                    </div>
                </div>

                {(activeView === 'overview' || activeView === 'projects') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects
                            .filter(p => activeView === 'projects' ? p.category === 'IA' : true)
                            .map((pillar) => (
                                <SortableProjectCard
                                    key={pillar.id}
                                    project={pillar}
                                    onEdit={handleEdit}
                                    onDelete={deleteProject}
                                    isSelected={selectedProjects.includes(pillar.id)}
                                    onToggleSelect={() => toggleSelection(pillar.id)}
                                />
                            ))}

                        <button
                            onClick={handleCreateNew}
                            className={cn(
                                `group flex flex-col items-center justify-center h-full min-h-[200px] rounded-xl border-2 border-dashed transition-all duration-300 ${theme.border} hover:border-cyan-500/50 hover:bg-cyan-500/5`,
                                selectedProjects.length > 0 && "opacity-50 pointer-events-none"
                            )}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors mb-3 ${theme.bgSecondary}`}>
                                <Plus size={24} className={theme.textSecondary} />
                            </div>
                            <span className={`text-sm font-bold group-hover:text-cyan-400 ${theme.textSecondary}`}>Crear Nuevo Pilar</span>
                        </button>
                    </div>
                )}

                {activeView === 'settings' && (
                    <div className={`w-full border rounded-2xl p-8 animate-fade-in-down ${theme.bgSecondary} ${theme.border}`}>
                        <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${theme.text}`}>
                            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400"><Settings size={20} /></div>
                            Configuración del Sistema
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <section className={`p-6 rounded-xl border ${theme.bgTertiary} ${theme.border}`}>
                                    <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2 ${theme.textSecondary} ${theme.border}`}>Conexión IA Multi-Proveedor</h4>

                                    <div className="space-y-4">
                                        {/* Provider Selector */}
                                        <div>
                                            <label className={`text-xs font-bold mb-1.5 block ${theme.textSecondary}`}>Proveedor de IA</label>
                                            <select
                                                value={globalPreferences?.userProvider || "gemini"}
                                                onChange={(e) => {
                                                    const newProvider = e.target.value;
                                                    let defaultModel = "gemini-1.5-flash";
                                                    if (newProvider === "groq") defaultModel = "llama-3.3-70b-versatile";
                                                    if (newProvider === "huggingface") defaultModel = "Qwen/Qwen2.5-72B-Instruct";
                                                    if (newProvider === "cohere") defaultModel = "command-r-plus";

                                                    setGlobalPreferences(prev => ({
                                                        ...prev,
                                                        userProvider: newProvider,
                                                        userModel: defaultModel
                                                    }));
                                                }}
                                                className={`w-full border rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:border-cyan-500/50 ${theme.bg} ${theme.text} ${theme.border}`}
                                            >
                                                <option value="gemini">Google Gemini (Gratis & Multimodal)</option>
                                                <option value="groq">Groq Cloud (Ultra Rápido - Llama 3)</option>
                                                <option value="huggingface">Hugging Face (Open Source - Illimitado*)</option>
                                                <option value="cohere">Cohere (Enterprise Grade - Trial)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={`text-xs font-bold mb-1.5 flex justify-between ${theme.textSecondary}`}>
                                                <span>Tu API Key Personal</span>
                                                {globalPreferences?.userApiKey && (
                                                    <span
                                                        className="text-xs text-red-400 cursor-pointer hover:underline"
                                                        onClick={() => setGlobalPreferences(prev => ({ ...prev, userApiKey: "" }))}
                                                    >
                                                        Borrar
                                                    </span>
                                                )}
                                            </label>
                                            <div className="flex gap-2 mb-2">
                                                <input
                                                    type="password"
                                                    value={globalPreferences?.userApiKey || ""}
                                                    onChange={(e) => setGlobalPreferences(prev => ({ ...prev, userApiKey: e.target.value }))}
                                                    placeholder={globalPreferences?.userProvider === 'groq' ? "gsk_..." : (globalPreferences?.userProvider === 'huggingface' ? "hf_..." : "AIzaSy...")}
                                                    className={cn(
                                                        `flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none font-mono ${theme.bg} ${theme.text}`,
                                                        // Validation logic for border color
                                                        (() => {
                                                            const key = globalPreferences?.userApiKey || "";
                                                            const provider = globalPreferences?.userProvider || "gemini";
                                                            if (key.length < 5) return `${theme.border} focus:border-cyan-500/50`;

                                                            if (provider === 'gemini' && !key.startsWith('AIza')) return "border-red-500/50 text-red-400";
                                                            if (provider === 'groq' && !key.startsWith('gsk_')) return "border-red-500/50 text-red-400";
                                                            if (provider === 'huggingface' && !key.startsWith('hf_')) return "border-red-500/50 text-red-400";

                                                            return "border-emerald-500/30 text-emerald-400";
                                                        })()
                                                    )}
                                                />
                                            </div>

                                            <p className={`text-[10px] leading-relaxed ${theme.textSecondary}`}>
                                                *Tu clave se guarda <strong>localmente</strong> en tu navegador.
                                            </p>
                                        </div>

                                        <div>
                                            <label className={`text-xs font-bold mb-1.5 block ${theme.textSecondary}`}>Modelo de IA</label>
                                            <select
                                                value={globalPreferences?.userModel || "gemini-1.5-flash"}
                                                onChange={(e) => setGlobalPreferences(prev => ({ ...prev, userModel: e.target.value }))}
                                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50 ${theme.bg} ${theme.text} ${theme.border}`}
                                            >
                                                {/* GEMINI MODELS */}
                                                {(!globalPreferences?.userProvider || globalPreferences?.userProvider === 'gemini') && (
                                                    <>
                                                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (RECOMENDADO)</option>
                                                        <option value="gemini-2.0-flash-lite-001">Gemini 2.0 Flash Lite (Experimental)</option>
                                                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Más Potente)</option>
                                                    </>
                                                )}

                                                {/* GROQ MODELS (Updated 2025) */}
                                                {globalPreferences?.userProvider === 'groq' && (
                                                    <>
                                                        <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Recomendado)</option>
                                                        <option value="llama-3.1-8b-instant">Llama 3.1 8B (Velocidad Extrema)</option>
                                                        <option value="mixtral-8x7b-32768">Mixtral 8x7B (Balanceado)</option>
                                                        <option value="gemma2-9b-it">Gemma 2 9B (Google on Groq)</option>
                                                    </>
                                                )}

                                                {/* HUGGING FACE MODELS */}
                                                {globalPreferences?.userProvider === 'huggingface' && (
                                                    <>
                                                        <option value="Qwen/Qwen2.5-72B-Instruct">Qwen 2.5 72B (Muy Potente)</option>
                                                        <option value="mistralai/Mistral-7B-Instruct-v0.3">Mistral 7B v0.3 (Estándar)</option>
                                                        <option value="microsoft/Phi-3.5-mini-instruct">Phi 3.5 Mini (Muy Rápido)</option>
                                                        <option value="meta-llama/Meta-Llama-3-8B-Instruct">Llama 3 8B (Classic)</option>
                                                    </>
                                                )}

                                                {/* COHERE MODELS */}
                                                {globalPreferences?.userProvider === 'cohere' && (
                                                    <>
                                                        <option value="command-r-plus">Command R+ (Súper Inteligente)</option>
                                                        <option value="command-r">Command R (Optimizado RAG)</option>
                                                        <option value="command-light">Command Light (Rápido)</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                onClick={() => handleTestConnection(
                                                    globalPreferences?.userApiKey,
                                                    globalPreferences?.userModel,
                                                    globalPreferences?.userProvider || "gemini"
                                                )}
                                                id="save-prefs-btn"
                                                className="w-full py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 font-bold text-sm hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckSquare size={16} />
                                                Confirmar y Probar Configuración
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                {/* Visual Preferences Section */}
                                <section className={`p-6 ${theme.bgTertiary} rounded-xl border ${theme.border}`}>
                                    <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2 ${theme.textSecondary} ${theme.border}`}>
                                        <Palette size={16} /> Apariencia
                                    </h4>

                                    <div className="grid grid-cols-1 gap-4">
                                        {Object.entries(themes).map(([key, t]) => (
                                            <button
                                                key={key}
                                                onClick={() => setCurrentTheme(key)}
                                                className={cn(
                                                    "flex items-center gap-4 p-3 rounded-xl border transition-all duration-200",
                                                    currentTheme === key
                                                        ? `bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/50`
                                                        : `${theme.bgSecondary} ${theme.border} hover:border-gray-500/50`
                                                )}
                                            >
                                                <div className={`w-12 h-8 rounded-lg border shadow-sm flex overflow-hidden ${key === 'light' ? 'bg-gray-100 border-gray-300' : key === 'minimal' ? 'bg-white border-gray-200' : 'bg-[#0a0a0b] border-gray-800'}`}>
                                                    <div className={`w-4 h-full ${key === 'light' ? 'bg-white border-r border-gray-300' : key === 'minimal' ? 'bg-gray-50 border-r border-gray-100' : 'bg-[#121214] border-r border-gray-800'}`}></div>
                                                    <div className="flex-1 p-1 space-y-1">
                                                        <div className={`h-1 w-3/4 rounded-full ${key === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                                        <div className={`h-1 w-1/2 rounded-full ${key === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                                                    </div>
                                                </div>
                                                <div className="text-left">
                                                    <span className={`block text-sm font-bold ${currentTheme === key ? 'text-cyan-400' : theme.text}`}>
                                                        {t.name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500">
                                                        {key === 'dark' ? 'Para la noche' : key === 'light' ? 'Clásico' : 'Limpio y simple'}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={editingProject}
                onSave={handleSave}
                onDelete={deleteProject}
            />
        </main>
    );
};

export default Dashboard;
