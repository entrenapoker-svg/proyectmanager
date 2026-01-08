import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus, Brain, FileText, Settings, MessageSquare, ArrowRight, Star } from 'lucide-react';
import { cn } from '../utils';

const ProjectModal = ({ isOpen, onClose, project, onSave, onDelete }) => {
    const [activeTab, setActiveTab] = useState('details'); // 'details' | 'context'
    const [formData, setFormData] = useState({
        title: '',
        category: 'IA',
        status: 'Planning',
        color: 'cyan',
        progress: 0,
        importance: 5,
        tasks: [],
        aiContext: ''
    });

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData({
                ...project,
                aiContext: project.aiContext || project.ai_context || ''
            });
            setMessages([{ role: 'ai', text: `¡Hola! Soy tu copiloto para "${project.title}". ¿Necesitas ayuda descomponiendo este objetivo en tareas?` }]);
        } else {
            setFormData({
                title: '',
                category: 'IA',
                status: 'Planning',
                color: 'cyan',
                progress: 0,
                importance: 5,
                tasks: [],
                aiContext: 'Eres un experto encargado de este proyecto. Tu objetivo es...'
            });
            setMessages([{ role: 'ai', text: 'Bienvenido. Vamos a estructurar este nuevo pilar. Cuéntame tu idea y generaré las tareas iniciales.' }]);
        }
    }, [project, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTaskChange = (id, text) => {
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t.id === id ? { ...t, text } : t)
        }));
    };

    const handleAddTask = () => {
        setFormData(prev => ({
            ...prev,
            tasks: [...prev.tasks, { id: Date.now(), text: '', done: false }]
        }));
    };

    const handleDeleteTask = (id) => {
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.filter(t => t.id !== id)
        }));
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // MOCK AI LOGIC (To be replaced by real API)
        setTimeout(() => {
            const lowerInput = userMsg.text.toLowerCase();
            let aiResponse = { role: 'ai', text: '', suggestions: [] };

            if (lowerInput.includes('tarea') || lowerInput.includes('plan') || lowerInput.includes('hacer') || lowerInput.includes('ayuda')) {
                aiResponse.text = `Analizando el contexto "${formData.category}" y tu objetivo... He detectado estas acciones clave para avanzar:`;
                aiResponse.suggestions = [
                    `Investigación de mercado para ${formData.title || 'el proyecto'}`,
                    "Definir arquitectura inicial",
                    "Crear prototipo de baja fidelidad",
                    "Configurar entorno de desarrollo"
                ];
            } else if (lowerInput.includes('hola')) {
                aiResponse.text = `¡Hola! Estoy listo. Tu proyecto tiene una prioridad de ${formData.importance}/10. ¿Quieres que sugiera tareas para aumentar el impacto inmediato?`;
            } else {
                aiResponse.text = "Entendido. He procesado esa información. Si necesitas que la convierta en items accionables, solo pídelo.";
            }

            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const addSuggestion = (text) => {
        setFormData(prev => ({
            ...prev,
            tasks: [...prev.tasks, { id: Date.now(), text: text, done: false }]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-down">
            <div className="w-full max-w-lg bg-[#121214] border border-white/10 rounded-xl shadow-2xl relative flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                        {project ? <Edit2Icon /> : <PlusIcon />}
                        <span>{project ? 'Gestionar Proyecto' : 'Nuevo Pilar'}</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 pt-4 space-x-4 border-b border-white/5">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={cn(
                            "pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2",
                            activeTab === 'details' ? "text-cyan-500 border-cyan-500" : "text-gray-500 border-transparent hover:text-gray-300"
                        )}
                    >
                        Detalles
                    </button>
                    <button
                        onClick={() => setActiveTab('context')}
                        className={cn(
                            "pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center space-x-2",
                            activeTab === 'context' ? "text-purple-500 border-purple-500" : "text-gray-500 border-transparent hover:text-gray-300"
                        )}
                    >
                        <Brain size={14} />
                        <span>Contexto</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('assistant')}
                        className={cn(
                            "pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center space-x-2",
                            activeTab === 'assistant' ? "text-cyan-400 border-cyan-400" : "text-gray-500 border-transparent hover:text-gray-300"
                        )}
                    >
                        <MessageSquare size={14} />
                        <span>Asistente IA</span>
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">

                    {activeTab === 'details' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Título</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none placeholder-gray-700"
                                    placeholder="Ej: Dominación Mundial..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Categoría</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        <option value="IA">IA</option>
                                        <option value="Finanzas">Finanzas</option>
                                        <option value="Creatividad">Creatividad</option>
                                        <option value="Salud">Salud</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Color</label>
                                    <select
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        <option value="cyan">Cian (IA)</option>
                                        <option value="orange">Naranja (Fi)</option>
                                        <option value="purple">Púrpura (Cr)</option>
                                        <option value="emerald">Esmeralda (Sa)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Progreso ({formData.progress}%)</label>
                                <input
                                    type="range"
                                    name="progress"
                                    min="0" max="100"
                                    value={formData.progress}
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-gray-500 font-bold mb-1 flex justify-between">
                                    <span>Nivel de Importancia (Prioridad)</span>
                                    <span className="text-cyan-400">{formData.importance || 5}/10</span>
                                </label>
                                <input
                                    type="range"
                                    name="importance"
                                    min="1" max="10"
                                    step="1"
                                    value={formData.importance || 5}
                                    onChange={handleChange}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <p className="text-[10px] text-gray-500 mt-1">
                                    Mayor importancia = Mayor prioridad en la generación automática del Plan Diario.
                                </p>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs uppercase text-gray-500 font-bold">Lista de Tareas</label>
                                    <button type="button" onClick={handleAddTask} className="text-xs text-cyan-500 hover:text-cyan-400 font-bold flex items-center transition-colors">
                                        <Plus size={12} className="mr-1" /> Agregar
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {formData.tasks.map((task, idx) => (
                                        <div key={task.id || idx} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={task.text}
                                                onChange={(e) => handleTaskChange(task.id, e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/5 rounded p-2 text-sm text-gray-300 focus:border-cyan-500/50 outline-none transition-colors"
                                                placeholder="Nueva tarea..."
                                            />
                                            <button type="button" onClick={() => handleDeleteTask(task.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.tasks.length === 0 && (
                                        <p className="text-xs text-gray-600 italic text-center py-2">No hay tareas activas.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'context' && (
                        <div className="space-y-4 h-full">
                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-purple-200 text-xs mb-4">
                                <p className="font-bold flex items-center mb-1"><Settings size={12} className="mr-1" /> Instrucciones de Proyecto (Capa 2)</p>
                                Define cómo debe comportarse la IA en este proyecto específico. Ejemplo: "Actúa como un entrenador de Poker agresivo".
                            </div>

                            <textarea
                                name="aiContext"
                                value={formData.aiContext}
                                onChange={handleChange}
                                className="w-full h-64 bg-black/30 border border-white/10 rounded-lg p-4 text-gray-300 font-mono text-sm focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
                                placeholder="Escribe aquí las instrucciones de contexto para la IA..."
                            ></textarea>
                        </div>
                    )}

                    {activeTab === 'assistant' && (
                        <div className="flex flex-col h-full bg-black/20 rounded-lg overflow-hidden border border-white/5">
                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={cn("flex flex-col max-w-[85%]", msg.role === 'user' ? "self-end items-end" : "self-start items-start")}>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm leading-relaxed",
                                            msg.role === 'user'
                                                ? "bg-cyan-600/20 border border-cyan-500/30 text-cyan-50 rounded-br-none"
                                                : "bg-[#1A1A1E] border border-white/10 text-gray-300 rounded-bl-none"
                                        )}>
                                            {msg.role === 'ai' && <MessageSquare size={14} className="mb-2 text-cyan-400" />}
                                            {msg.text}
                                        </div>

                                        {/* Suggestions Chips */}
                                        {msg.suggestions && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {msg.suggestions.map((sug, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => addSuggestion(sug)}
                                                        className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400 hover:bg-emerald-500/20 transition-colors animate-fade-in"
                                                    >
                                                        <Plus size={10} />
                                                        <span>{sug}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="self-start bg-[#1A1A1E] px-4 py-3 rounded-2xl rounded-bl-none flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-3 bg-[#1A1A1E] border-t border-white/5 flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                                    placeholder="Escribe tu idea o pide tareas..."
                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={handleSendMessage}
                                    className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
                                >
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-6">
                        {project ? (
                            <button
                                type="button"
                                onClick={() => { onDelete(project.id); onClose(); }}
                                className="px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/10 text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                                Eliminar Pilar
                            </button>
                        ) : <div></div>}

                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-white text-black hover:bg-gray-200 text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all transform hover:scale-105"
                        >
                            Guardar Cambios
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

// Icons helpers
const Edit2Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default ProjectModal;
