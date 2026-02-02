import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Menu, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const TopBar = ({ onMenuClick }) => {
    const [time, setTime] = useState(new Date());
    const { user } = useAuth();
    const { theme } = useTheme();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className={`h-14 sticky top-0 z-40 backdrop-blur-md border-b flex items-center justify-between px-6 transition-all duration-300 w-full ${theme.bgSecondary}/80 ${theme.border}`}>
            {/* Left: Hamburger (Mobile) & User Info */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-gray-400 hover:text-white mr-2 p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* User Display */}
                {user && (
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${theme.bgTertiary} ${theme.border}`}>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center">
                            <User size={12} className="text-white" />
                        </div>
                        <span className={`text-xs font-medium hidden sm:inline ${theme.textSecondary}`}>
                            {user.email}
                        </span>
                    </div>
                )}

                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">En Línea</span>
                </div>
            </div>

            {/* Right: Clock & System */}
            <div className="flex items-center space-x-6">
                <div className="text-right hidden sm:block">
                    <p className={`text-xs uppercase font-medium tracking-wide ${theme.textSecondary}`}>
                        {format(time, "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                </div>
                <div className={`h-4 w-px hidden sm:block ${theme.border} bg-gray-500/20`}></div>
                <div className={`font-mono text-xl font-bold tracking-widest text-shadow-glow ${theme.text}`}>
                    {format(time, "HH:mm:ss")}
                </div>
                <div className={`flex items-center space-x-3 ${theme.textSecondary}`}>
                    <Wifi size={16} />
                </div>
            </div>
        </header>
    );
};

export default TopBar;
