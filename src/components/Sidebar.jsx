import React, { useState } from 'react';
import { Home, Grid, CheckSquare, Settings, User, LogOut, Brain } from 'lucide-react';
import { cn } from '../utils';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext'; // Context Import
import SessionDebrief from './SessionDebrief';

const Sidebar = ({ isOpen, onClose }) => {
    const { generateDailyPlan, activeView, setActiveView, globalPreferences } = useProjects(); // Use Context
    const navigate = useNavigate();
    const location = useLocation();
    const [showDebrief, setShowDebrief] = useState(false);

    // Handle navigation click (close sidebar on mobile)
    const handleNavClick = (view) => {
        setActiveView(view);
        if (window.innerWidth < 768) {
            onClose && onClose();
        }
    };

    const handleActionClick = () => {
        generateDailyPlan();
        if (window.innerWidth < 768) {
            onClose && onClose();
        }
    };

    return (
        <>
            <SessionDebrief isOpen={showDebrief} onClose={() => setShowDebrief(false)} />

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#0a0a0b] flex flex-col p-4 space-y-8 transition-transform duration-300 md:translate-x-0 md:static md:h-screen",
                isOpen ? "translate-x-0 shadow-2xl shadow-cyan-500/20" : "-translate-x-full"
            )}>
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
                        active={activeView === 'overview' && location.pathname === '/'}
                        onClick={() => { navigate('/'); handleNavClick('overview'); }}
                    />
                    <NavItem
                        icon={Grid}
                        label="Proyectos (IA)"
                        active={activeView === 'projects'}
                        onClick={() => handleNavClick('projects')}
                    />
                    <NavItem
                        icon={Settings}
                        label="Configuración"
                        active={activeView === 'settings'}
                        onClick={() => handleNavClick('settings')}
                    />

                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mt-6 mb-2">Acción</p>
                    <NavItem icon={CheckSquare} label="Tareas para Hoy" highlight onClick={handleActionClick} />

                    <div className="mt-6 px-0">
                        <NavItem
                            icon={Brain}
                            label="Gimnasio Mental"
                            active={location.pathname === '/gym'}
                            highlight
                            onClick={() => navigate('/gym')}
                        />
                    </div>
                </nav>

                {/* Gamification Widget (XP) */}
                <div className="bg-[#121214] border border-white/5 rounded-xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-4xl text-yellow-500">⚡</span>
                    </div>

                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nivel Actual</span>
                        <span className="text-xs font-bold text-yellow-400">Lvl {globalPreferences?.level || 1}</span>
                    </div>

                    <div className="flex items-end space-x-1 mb-3">
                        <h3 className="text-2xl font-bold text-white tracking-tight leading-none">{globalPreferences?.xp || 0}</h3>
                        <span className="text-[10px] text-gray-500 mb-1">XP Total</span>
                    </div>

                    <div className="space-y-1">
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-yellow-500 h-full rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all duration-1000 ease-out"
                                style={{ width: `${globalPreferences?.levelProgress || 0}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-gray-600 font-mono">
                            <span>0%</span>
                            <span>{globalPreferences?.levelProgress || 0}% NEXT LVL</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-auto">
                    <LogoutButton onClick={() => setShowDebrief(true)} />
                </div>
            </aside>
        </>
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

const LogoutButton = ({ onClick }) => {
    // Session Debrief trigger
    return (
        <button
            onClick={onClick}
            className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 group"
        >
            <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-medium">Finalizar Sesión</span>
        </button>
    );
};

export default Sidebar;
