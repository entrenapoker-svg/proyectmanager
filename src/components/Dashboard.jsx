import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableProjectCard } from './SortableProjectCard';
import ProjectModal from './ProjectModal';
import DailyPlanEditor from './DailyPlanEditor';
import { useProjects } from '../context/ProjectContext';
import { Plus, RefreshCw, CheckSquare, Settings, Trash2, X } from 'lucide-react';
import { cn } from '../utils';
import { testConnection } from '../lib/ai';

const Dashboard = () => {
    const { projects, reorderProjects, addProject, updateProject, deleteProject, generateDailyPlan, processCommand, activeView, globalPreferences, setGlobalPreferences } = useProjects();
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
                        // Allow longer messages up to 50 chars (button is wide enough)
                        btn.innerText = errorMsg.length > 50 ? "❌ Error (Ver Consola)" : ("❌ " + errorMsg);
                        btn.className = "w-full py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-bold text-sm transition-all flex items-center justify-center gap-2";
                    }

                    // Also show a temporary error div or toast if we had one. 
                    // Let's fallback to console warning to avoid blocking UI
                    console.warn(errorMsg);

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.disabled = false;
                        btn.className = "w-full py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 font-bold text-sm hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2";
                    }, 5000); // 5 seconds wait before resetting
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
        <main className="flex-1 p-4 md:p-8 min-h-full bg-[#0a0a0b] relative pb-32">
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px]"></div>
            </div>

            <DailyPlanEditor />

            <div className="relative z-10 w-full max-w-none">
                {alert && (
                    <div className="w-full bg-orange-500/10 border border-orange-500/20 text-orange-200 px-4 py-2 rounded-lg mb-8 flex items-center animate-fade-in-down">
                        <span className="font-mono text-sm tracking-tight">{alert.message}</span>
                    </div>
                )}

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-white tracking-tight">Active Pillars</h2>
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
                            className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm font-bold text-cyan-400"
                        >
                            <Plus size={16} />
                            <span>Nuevo Proyecto</span>
                        </button>
                    </div>
                </div>

                {(activeView === 'overview' || activeView === 'projects') && (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={projects.map(p => p.id)} strategy={rectSortingStrategy}>
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
                                        "group flex flex-col items-center justify-center h-full min-h-[200px] rounded-xl border-2 border-dashed border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-300",
                                        selectedProjects.length > 0 && "opacity-50 pointer-events-none"
                                    )}
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors mb-3">
                                        <Plus size={24} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-cyan-400">Crear Nuevo Pilar</span>
                                </button>
                            </div>
                        </SortableContext>
                    </DndContext>
                )}

                {activeView === 'settings' && (
                    <div className="w-full bg-[#121214] border border-white/5 rounded-2xl p-8 animate-fade-in-down">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400"><Settings size={20} /></div>
                            Configuración del Sistema
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <section className="p-6 bg-black/20 rounded-xl border border-white/5">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Conexión IA</h4>

                                    <div className="space-y-4">
                                        {/* Provider Selector */}
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-1.5 block">Proveedor de IA</label>
                                            <select
                                                value={globalPreferences?.userProvider || "gemini"}
                                                onChange={(e) => {
                                                    const newProvider = e.target.value;
                                                    const defaultModel = newProvider === "groq" ? "llama3-70b-8192" : "gemini-2.0-flash-lite-001";
                                                    setGlobalPreferences(prev => ({
                                                        ...prev,
                                                        userProvider: newProvider,
                                                        userModel: defaultModel
                                                    }));
                                                }}
                                                className="w-full bg-[#1A1A1C] border border-white/10 rounded-lg px-3 py-2 text-sm text-cyan-400 font-bold focus:outline-none focus:border-cyan-500/50"
                                            >
                                                <option value="gemini">Google Gemini (Multimodal & Free Tier)</option>
                                                <option value="groq">Groq Cloud (Ultra Fast Llama 3 - Free Beta)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-1.5 block">Tu API Key Personal</label>
                                            <div className="flex gap-2 mb-2">
                                                <input
                                                    type="password"
                                                    value={globalPreferences?.userApiKey || ""}
                                                    onChange={(e) => setGlobalPreferences(prev => ({ ...prev, userApiKey: e.target.value }))}
                                                    placeholder={globalPreferences?.userProvider === 'groq' ? "gsk_..." : "AIzaSy..."}
                                                    className="flex-1 bg-[#1A1A1C] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono"
                                                />
                                            </div>
                                            <p className="text-[11px] text-gray-500">
                                                ¿No tienes clave?{" "}
                                                <a
                                                    href={globalPreferences?.userProvider === 'groq' ? "https://console.groq.com/keys" : "https://aistudio.google.com/app/apikey"}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-cyan-400 hover:underline"
                                                >
                                                    Consíguela GRATIS aquí ({globalPreferences?.userProvider === 'groq' ? "Groq" : "Google"})
                                                </a>. Se guarda localmente.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-1.5 block">Modelo de IA</label>
                                            <select
                                                value={globalPreferences?.userModel || "gemini-2.0-flash-lite-001"}
                                                onChange={(e) => setGlobalPreferences(prev => ({ ...prev, userModel: e.target.value }))}
                                                className="w-full bg-[#1A1A1C] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
                                            >
                                                {globalPreferences?.userProvider === 'groq' ? (
                                                    <>
                                                        <option value="llama3-70b-8192">Llama 3 70B (Muy Inteligente)</option>
                                                        <option value="llama3-8b-8192">Llama 3 8B (Súper Rápido)</option>
                                                        <option value="mixtral-8x7b-32768">Mixtral 8x7B (Balanceado)</option>
                                                        <option value="gemma-7b-it">Gemma 7B IT (Google on Groq)</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value="gemini-2.0-flash-lite-001">Gemini 2.0 Flash Lite (Recomendado)</option>
                                                        <option value="gemini-2.0-flash">Gemini 2.0 Flash (Potente)</option>
                                                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Estándar)</option>
                                                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Más Capaz / Lento)</option>
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
                                <section className="p-6 bg-black/20 rounded-xl border border-white/5 opacity-50">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Apariencia (Próximamente)</h4>
                                    <div className="h-24 flex items-center justify-center text-xs text-gray-600">
                                        Personalización de temas y colores deshabilitada.
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )
                }
            </div >

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={editingProject}
                onSave={handleSave}
                onDelete={deleteProject}
            />
        </main >
    );
};

export default Dashboard;
