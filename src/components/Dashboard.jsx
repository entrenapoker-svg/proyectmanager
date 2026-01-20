import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableProjectCard } from './SortableProjectCard';
import ProjectModal from './ProjectModal';
import DailyPlanEditor from './DailyPlanEditor';
import { useProjects } from '../context/ProjectContext';
import { Plus, RefreshCw, CheckSquare, Settings, Trash2, X } from 'lucide-react';
import { cn } from '../utils';

const Dashboard = () => {
    const { projects, reorderProjects, addProject, updateProject, deleteProject, generateDailyPlan, processCommand, activeView } = useProjects();
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

        // Execute deletions sequentially to ensure stability
        for (const id of selectedProjects) {
            await deleteProject(id);
        }
        clearSelection();
    };

    // DND Sensors (Touch/Mouse/Keyboard)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), // Require 8px movement to start drag
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            reorderProjects(active.id, over.id);
        }
    };

    // Alert System
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

    return (
        <main className="flex-1 ml-0 mt-14 p-4 md:p-8 min-h-screen bg-[#0a0a0b] relative pb-32">
            {/* Background Gradients / Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Daily Plan Overlay Editor - triggered by state */}
            <DailyPlanEditor />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-none">

                {/* Alert Banner */}
                {alert && (
                    <div className="w-full bg-orange-500/10 border border-orange-500/20 text-orange-200 px-4 py-2 rounded-lg mb-8 flex items-center animate-fade-in-down">
                        <span className="font-mono text-sm tracking-tight">{alert.message}</span>
                    </div>
                )}

                {/* Section Header */}
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

                {/* Draggable Grid */}
                {/* Draggable Grid (Overview / Projects) */}
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

                                {/* Add New Card (Static) - Hide during selection mode to reduce clutter? -> No, keep it */}
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

                {/* Settings View */}
                {activeView === 'settings' && (
                    <div className="w-full bg-[#121214] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] animate-fade-in-down">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-500">
                            <Settings size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Configuración del Sistema</h3>
                        <p className="text-gray-500 text-center max-w-md">
                            Panel de configuración global (Identidad, Preferencias, Conexiones API) en construcción.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
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
