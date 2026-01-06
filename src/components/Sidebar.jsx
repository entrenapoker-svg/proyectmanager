import React from 'react';
import { Home, Grid, CheckSquare, Settings, User } from 'lucide-react';
import { cn } from '../utils';


import { useProjects } from '../context/ProjectContext'; // Context Import

const Sidebar = () => {
    const { generateDailyPlan, activeView, setActiveView } = useProjects(); // Use Context

    return (
        <aside className="w-64 border-r border-white/5 bg-[#0a0a0b] flex flex-col p-4 space-y-8 hidden md:flex fixed h-full z-40">
            {/* Profile/User Section */}
            <div className="flex items-center space-x-3 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <span className="font-bold text-xs text-white">J1</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white tracking-wide">jama1</h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Administrator</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">Navegación</p>

                <NavItem
                    icon={Home}
                    label="Overview"
                    active={activeView === 'overview'}
                    onClick={() => setActiveView('overview')}
                />
                <NavItem
                    icon={Grid}
                    label="Proyectos (IA)"
                    active={activeView === 'projects'}
                    onClick={() => setActiveView('projects')}
                />
                <NavItem
                    icon={Settings}
                    label="Configuración"
                    active={activeView === 'settings'}
                    onClick={() => setActiveView('settings')}
                />

                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mt-6 mb-2">Acción</p>
                <NavItem icon={CheckSquare} label="Tareas para Hoy" highlight onClick={generateDailyPlan} />
            </nav>

            {/* Habits Widget (Mini) */}
            <div className="bg-[#121214] border border-white/5 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Hábitos</span>
                    <span className="text-[10px] font-bold text-cyan-500">66%</span>
                </div>
                <div className="space-y-2">
                    <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full w-2/3 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                    </div>
                    <p className="text-[10px] text-gray-400">Progreso Diario</p>
                </div>
            </div>
        </aside>
    );
};

const NavItem = ({ icon: Icon, label, active, highlight, onClick }) => {
    return (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
            className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group relative overflow-hidden",
                active
                    ? "bg-white/5 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5",
                highlight && "text-emerald-400 hover:text-emerald-300 bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10"
            )}
        >
            <Icon size={18} className={cn("transition-colors", highlight ? "text-emerald-500" : active ? "text-cyan-400" : "group-hover:text-cyan-400")} />
            <span className="text-sm font-medium">{label}</span>

            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            )}
        </a>
    );
};

export default Sidebar;
