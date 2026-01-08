
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { pillars as initialPillars } from '../data/pillars';
import { Cpu, Briefcase, Users, Dumbbell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [activeView, setActiveView] = useState('overview'); // 'overview', 'settings'

    // Global Preferences (Layer 1) - Kept in LocalStorage for now
    const [globalPreferences, setGlobalPreferences] = useState(() => {
        const saved = localStorage.getItem('jama1_global_prefs');
        return saved ? JSON.parse(saved) : {
            identity: "Soy jama1, experto en IA, Poker y Techno.",
            style: "Directo, técnico y sin rodeos.",
            workflow: "Planifica antes de ejecutar."
        };
    });

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [lastCommandResponse, setLastCommandResponse] = useState(null);
    const [dailyPlan, setDailyPlan] = useState([]);

    // Specific Plan Mode State
    const [planMode, setPlanMode] = useState(false);
    const [expandedPlanItem, setExpandedPlanItem] = useState(null);

    // FETCH DATA
    const fetchProjects = useCallback(async () => {
        if (!user) {
            setProjects([]);
            setIsLoadingData(false);
            return;
        }

        try {
            setIsLoadingData(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*, tasks(*)');

            if (error) throw error;

            // AUTO-MIGRATION / SEEDING
            if (!data || data.length === 0) {
                console.log("No projects in DB. Checking for local migration...");
                const savedLocal = localStorage.getItem('jama1_projects');
                let projectsToInsert = [];

                if (savedLocal) {
                    const parsed = JSON.parse(savedLocal);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        projectsToInsert = parsed;
                        console.log("Migrating from LocalStorage...", projectsToInsert);
                    }
                }

                // If no local storage (clean slate), seeds with Initial Pillars
                if (projectsToInsert.length === 0) {
                    console.log("Seeding initial pillars...");
                    projectsToInsert = initialPillars.map(p => ({
                        ...p,
                        aiContext: "Eres un asistente general. Ayuda a completar tareas.",
                        importance: 5,
                        tasks: []
                    }));
                }

                // Perform Insertions
                if (projectsToInsert.length > 0) {
                    for (const p of projectsToInsert) {
                        const newScaleProject = {
                            user_id: user.id,
                            title: p.title,
                            color: p.color,
                            icon: 'Cpu', // Defaulting icon, could map
                            importance: p.importance || 5,
                            ai_context: p.aiContext || ""
                        };

                        const { data: insertedProj, error: insertError } = await supabase
                            .from('projects')
                            .insert([newScaleProject])
                            .select()
                            .single();

                        if (!insertError && insertedProj && p.tasks && p.tasks.length > 0) {
                            const tasksToInsert = p.tasks.map(t => ({
                                project_id: insertedProj.id,
                                text: t.text,
                                done: t.done || false,
                                details: t.details || ""
                            }));
                            await supabase.from('tasks').insert(tasksToInsert);
                        }
                    }
                    // Re-fetch after migration
                    const { data: refreshed } = await supabase.from('projects').select('*, tasks(*)');
                    setProjects(refreshed || []);
                } else {
                    setProjects([]);
                }

            } else {
                setProjects(data || []);
            }
        } catch (error) {
            console.error('Error fetching/migrating projects:', error);
        } finally {
            setIsLoadingData(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Persistence for Preferences
    useEffect(() => {
        localStorage.setItem('jama1_global_prefs', JSON.stringify(globalPreferences));
    }, [globalPreferences]);

    // CRUD Operations

    const addProject = async (projectData) => {
        if (!user) {
            alert("Debes iniciar sesión para crear proyectos.");
            return;
        }

        // Whitelist DB columns to avoid "Column not found" errors
        const dbProject = {
            user_id: user.id,
            title: projectData.title || "Nuevo Proyecto",
            color: projectData.color || 'cyan',
            icon: projectData.icon || 'Cpu',
            importance: parseInt(projectData.importance) || 5,
            ai_context: projectData.aiContext || ""
        };

        try {
            const { data: newProject, error } = await supabase
                .from('projects')
                .insert([dbProject])
                .select()
                .single();

            if (error) throw error;

            let createdTasks = [];

            // Insert initial tasks if present
            if (projectData.tasks && projectData.tasks.length > 0) {
                const tasksPayload = projectData.tasks.map(t => ({
                    project_id: newProject.id,
                    text: t.text,
                    done: t.done || false,
                    details: t.details || ""
                }));

                const { data: tasksData, error: tasksError } = await supabase
                    .from('tasks')
                    .insert(tasksPayload)
                    .select();

                if (!tasksError) {
                    createdTasks = tasksData;
                }
            }

            setProjects(prev => [...prev, { ...newProject, tasks: createdTasks }]);
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Error al crear proyecto: " + error.message);
        }
    };

    const updateProject = async (id, updatedData) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));

        try {
            // Filter strictly for DB columns
            const dbUpdate = {};
            if (updatedData.title !== undefined) dbUpdate.title = updatedData.title;
            if (updatedData.color !== undefined) dbUpdate.color = updatedData.color;
            if (updatedData.icon !== undefined) dbUpdate.icon = updatedData.icon;
            if (updatedData.importance !== undefined) dbUpdate.importance = parseInt(updatedData.importance);
            if (updatedData.aiContext !== undefined) dbUpdate.ai_context = updatedData.aiContext;

            if (Object.keys(dbUpdate).length > 0) {
                const { error } = await supabase
                    .from('projects')
                    .update(dbUpdate)
                    .eq('id', id);

                if (error) throw error;
            }
        } catch (error) {
            console.error("Error updating project:", error);
            alert("Error al actualizar: " + error.message);
            fetchProjects();
        }
    };

    const reorderProjects = (activeId, overId) => {
        setProjects((items) => {
            const oldIndex = items.findIndex(i => i.id === activeId);
            const newIndex = items.findIndex(i => i.id === overId);
            const newItems = [...items];
            const [movedItem] = newItems.splice(oldIndex, 1);
            newItems.splice(newIndex, 0, movedItem);
            return newItems;
        });
    };

    const deleteProject = async (id) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        try {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) throw error;
        } catch (error) {
            console.error("Error deleting project:", error);
            fetchProjects();
        }
    };

    const addTask = async (projectId, taskText) => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    project_id: projectId,
                    text: taskText,
                    done: false
                }])
                .select()
                .single();

            if (error) throw error;

            setProjects(prev => prev.map(p => {
                if (p.id === projectId) {
                    return {
                        ...p,
                        tasks: [...(p.tasks || []), data]
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const toggleTask = async (projectId, taskId) => {
        const project = projects.find(p => p.id === projectId);
        const task = project?.tasks.find(t => t.id === taskId);
        if (!task) return;
        const newStatus = !task.done;

        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    tasks: p.tasks.map(t => t.id === taskId ? { ...t, done: newStatus } : t)
                };
            }
            return p;
        }));

        try {
            const { error } = await supabase
                .from('tasks')
                .update({ done: newStatus })
                .eq('id', taskId);

            if (error) throw error;
        } catch (error) {
            console.error("Error toggling task:", error);
            fetchProjects();
        }
    };

    const generateDailyPlan = () => {
        const allPending = projects.flatMap(p =>
            (p.tasks || []).filter(t => !t.done).map(t => ({
                ...t,
                projectTitle: p.title,
                projectId: p.id,
                projectImportance: p.importance || 5,
                color: p.color,
                details: t.details || `Estrategia para "${t.text}"...`
            }))
        );
        const sortedTasks = allPending.sort((a, b) => b.projectImportance - a.projectImportance);
        const prioritized = sortedTasks.slice(0, 5);
        setDailyPlan(prioritized);
        setPlanMode(true);
    };

    const updatePlanItemDetails = async (taskId, newDetails) => {
        // 1. Optimistic Update (Daily Plan)
        setDailyPlan(prev => prev.map(t => t.id === taskId ? { ...t, details: newDetails } : t));

        // 2. Optimistic Update (Projects/Main List)
        setProjects(prev => prev.map(p => {
            const hasTask = p.tasks.some(t => t.id === taskId);
            if (hasTask) {
                return {
                    ...p,
                    tasks: p.tasks.map(t => t.id === taskId ? { ...t, details: newDetails } : t)
                };
            }
            return p;
        }));

        // 3. Persist to Supabase
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ details: newDetails })
                .eq('id', taskId);

            if (error) throw error;
        } catch (error) {
            console.error("Error updating task details:", error);
            // Optional: Revert state here if needed, but for details it's usually fine to keep optimistic for a bit
        }
    };

    const processCommand = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('plan del día') || lowerText.includes('generar plan')) {
            generateDailyPlan();
            return `Abriendo editor de Plan Diario...`;
        }

        if (lowerText.includes('agregar tarea') || lowerText.includes('nueva tarea') || lowerText.includes('anotar')) {
            const parts = text.split(/ en | para | proyecto /i);
            if (parts.length >= 2) {
                const projectTarget = parts[parts.length - 1].trim();
                const taskText = parts.slice(0, parts.length - 1).join(' ').replace(/agregar tarea|nueva tarea|anotar/i, '').trim();
                const project = projects.find(p => p.title.toLowerCase().includes(projectTarget.toLowerCase()));

                if (project) {
                    addTask(project.id, taskText);
                    return `Anotado en ${project.title}: "${taskText}"`;
                } else {
                    return `No encontré el proyecto "${projectTarget}".`;
                }
            }
            return "Por favor especifica el proyecto. Ej: 'Agregar tarea comprar pan en Salud'";
        }
        return "Comando no reconocido. Intenta 'Generar plan', 'Agregar tarea...'";
    };

    return (
        <ProjectContext.Provider value={{
            projects,
            setProjects,
            reorderProjects,
            globalPreferences,
            setGlobalPreferences,
            dailyPlan,
            setDailyPlan,
            planMode,
            setPlanMode,
            updatePlanItemDetails,
            addProject,
            updateProject,
            deleteProject,
            addTask,
            toggleTask,
            processCommand,
            generateDailyPlan,
            isListening,
            setIsListening,
            transcript,
            setTranscript,
            lastCommandResponse,
            setLastCommandResponse,
            activeView,
            setActiveView,
            isLoadingData
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
