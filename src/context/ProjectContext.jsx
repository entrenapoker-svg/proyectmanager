import React, { createContext, useContext, useState, useEffect } from 'react';
import { pillars as initialPillars } from '../data/pillars';
import { Cpu, Briefcase, Users, Dumbbell } from 'lucide-react';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
    // Initialize Projects (Layer 2 & 3: Context & Data)
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem('jama1_projects');
        let initial = saved ? JSON.parse(saved) : initialPillars.map(p => ({
            ...p,
            aiContext: "Eres un asistente general. Ayuda a completar tareas.",
            importance: 5 // Default importance
        }));

        // Migration check: ensure all have importance
        if (initial.length > 0 && typeof initial[0].importance === 'undefined') {
            initial = initial.map(p => ({ ...p, importance: p.importance || 5 }));
        }
        return initial;
    });

    const [activeView, setActiveView] = useState('overview'); // 'overview', 'settings'

    // Global Preferences (Layer 1)
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
    const [planMode, setPlanMode] = useState(false); // Controls if we are in "Generate Plan" overlay
    const [expandedPlanItem, setExpandedPlanItem] = useState(null); // Which item is being edited in detail

    // Persistence
    useEffect(() => {
        localStorage.setItem('jama1_projects', JSON.stringify(projects));
    }, [projects]);

    useEffect(() => {
        localStorage.setItem('jama1_global_prefs', JSON.stringify(globalPreferences));
    }, [globalPreferences]);

    // CRUD Operations
    const addProject = (projectData) => {
        const newProject = {
            id: Date.now().toString(),
            icon: Cpu,
            color: 'cyan',
            progress: 0,
            tasks: [],
            aiContext: "",
            ...projectData
        };
        setProjects(prev => [...prev, newProject]);
    };

    const updateProject = (id, updatedData) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    // DND Reorder Projects
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

    const deleteProject = (id) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };


    const addTask = (projectId, taskText) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    tasks: [...p.tasks, { id: Date.now(), text: taskText, done: false }]
                };
            }
            return p;
        }));
    };

    const toggleTask = (projectId, taskId) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    tasks: p.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
                };
            }
            return p;
        }));
    };

    // DAILY PLAN LOGIC REFINED
    // DAILY PLAN LOGIC (SMART PRIORITIZATION)
    const generateDailyPlan = () => {
        // 1. Flatten all pending tasks with project metadata
        const allPending = projects.flatMap(p =>
            p.tasks.filter(t => !t.done).map(t => ({
                ...t,
                projectTitle: p.title,
                projectId: p.id,
                projectImportance: p.importance || 5, // Use project importance (1-10)
                color: p.color,
                details: t.details || `Estrategia para "${t.text}"...`
            }))
        );

        // 2. Sort by Project Importance (High to Low)
        // We could also add task-level priority later
        const sortedTasks = allPending.sort((a, b) => b.projectImportance - a.projectImportance);

        // 3. Selection Algorithm:
        // Instead of strict top 5, we ensure high priority projects get slots, 
        // but maybe allow 1 slot for a lower priority "quick win"?
        // For now, strict importance sorting is reliable.
        const prioritized = sortedTasks.slice(0, 5);

        setDailyPlan(prioritized);
        setPlanMode(true);
    };

    const updatePlanItemDetails = (taskId, newDetails) => {
        setDailyPlan(prev => prev.map(t => t.id === taskId ? { ...t, details: newDetails } : t));
    };

    // "Second Brain" AI Logic with Voice Routing
    const processCommand = (text) => {
        const lowerText = text.toLowerCase();

        // Command: "Generar Plan"
        if (lowerText.includes('plan del día') || lowerText.includes('generar plan')) {
            generateDailyPlan();
            return `Abriendo editor de Plan Diario...`;
        }

        // Command: "Agregar tarea [X] a [Y]" - Direct dictation
        if (lowerText.includes('agregar tarea') || lowerText.includes('nueva tarea') || lowerText.includes('anotar')) {
            const parts = text.split(/ en | para | proyecto /i);
            if (parts.length >= 2) {
                // Last part is likely the project, everything before is the task
                const projectTarget = parts[parts.length - 1].trim();
                const taskText = parts.slice(0, parts.length - 1).join(' ').replace(/agregar tarea|nueva tarea|anotar/i, '').trim();

                const project = projects.find(p => p.title.toLowerCase().includes(projectTarget.toLowerCase()));

                if (project) {
                    addTask(project.id, taskText);
                    return `Anotado en ${project.title}: "${taskText}"`;
                } else {
                    // Fuzzy search fallback could go here
                    return `No encontré el proyecto "${projectTarget}".`;
                }
            }
            // Fallback: If no project specified, maybe add to "Inbox" or "General"?
            return "Por favor especifica el proyecto. Ej: 'Agregar tarea comprar pan en Salud'";
        }

        return "Comando no reconocido. Intenta 'Generar plan', 'Agregar tarea...'";
    };

    return (
        <ProjectContext.Provider value={{
            projects,
            setProjects, // Exposed for DND
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
            setActiveView
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
