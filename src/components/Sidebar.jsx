import React, { useState } from 'react';
import { Home, Grid, CheckSquare, Settings, User, LogOut, HelpCircle, ShieldCheck, Folder, Layers } from 'lucide-react';
import { cn } from '../utils';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { generateDailyPlan, activeView, setActiveView, categories, currentCategoryFilter, setCurrentCategoryFilter } = useProjects();
    const { theme } = useTheme();
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

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
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={cn(
                `fixed inset-y-0 left-0 z-50 w-64 border-r flex flex-col p-4 space-y-8 transition-transform duration-300 md:translate-x-0 md:static md:h-screen`,
                theme.bg,
                theme.border,
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
                        <h2 className={`text-sm font-bold tracking-wide ${theme.text}`}>Project Manager</h2>
                        <p className={`text-[10px] uppercase tracking-widest ${theme.textSecondary}`}>Dashboard</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    <p className={`text-[10px] font-bold uppercase tracking-widest px-2 mb-2 ${theme.textSecondary}`}>Navegación</p>

                    <NavItem
                        icon={Home}
                        label="Overview"
                        active={activeView === 'overview' && location.pathname === '/app'}
                        onClick={() => { navigate('/app'); setActiveView('overview'); setCurrentCategoryFilter('All'); handleNavClick('overview'); }}
                        theme={theme}
                    />

                    <p className={`text-[10px] font-bold uppercase tracking-widest px-2 mt-4 mb-2 ${theme.textSecondary}`}>Categorías</p>

                    {categories.length > 0 ? (
                        categories.map(cat => (
                            <NavItem
                                key={cat}
                                icon={cat === 'IA' ? Grid : Folder}
                                label={cat}
                                active={activeView === 'projects' && currentCategoryFilter === cat}
                                onClick={() => {
                                    handleNavClick('projects');
                                    setCurrentCategoryFilter(cat);
                                }}
                                theme={theme}
                            />
                        ))
                    ) : (
                        <NavItem
                            icon={Grid}
                            label="Proyectos"
                            active={activeView === 'projects'}
                            onClick={() => handleNavClick('projects')}
                            theme={theme}
                        />
                    )}

                    <div className="mt-4"></div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest px-2 mt-6 mb-2 ${theme.textSecondary}`}>Sistema</p>
                    <NavItem
                        icon={Settings}
                        label="Configuración"
                        active={activeView === 'settings'}
                        onClick={() => handleNavClick('settings')}
                        theme={theme}
                    />

                    <p className={`text-[10px] font-bold uppercase tracking-widest px-2 mt-6 mb-2 ${theme.textSecondary}`}>Acción</p>
                    <NavItem icon={CheckSquare} label="Tareas para Hoy" highlight onClick={handleActionClick} theme={theme} />

                    <div className="mt-2 px-0">
                        <NavItem
                            icon={HelpCircle}
                            label="Ayuda / Guía"
                            active={location.pathname === '/landing'}
                            onClick={() => navigate('/landing')}
                            theme={theme}
                        />
                        <NavItem
                            icon={ShieldCheck}
                            label="Admin Panel"
                            active={location.pathname === '/admin'}
                            onClick={() => navigate('/admin')}
                            highlight
                            theme={theme}
                        />
                    </div>
                </nav>

                <div className={`pt-4 border-t mt-auto ${theme.border}`}>
                    <LogoutButton onClick={handleLogout} />
                </div>
            </aside>
        </>
    );
};

const NavItem = ({ icon: Icon, label, active, highlight, onClick, theme }) => {
    return (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
            className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group relative overflow-hidden",
                active
                    ? "bg-cyan-500/10 text-cyan-400 font-bold"
                    : `${theme.textSecondary} hover:${theme.text} hover:bg-gray-500/10`,
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
