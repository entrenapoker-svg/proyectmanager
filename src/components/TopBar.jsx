import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Menu, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';

const TopBar = ({ onMenuClick }) => {
    const [time, setTime] = useState(new Date());
    const { user } = useAuth();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="h-14 sticky top-0 z-40 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 transition-all duration-300 w-full">
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
                    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center">
                            <User size={12} className="text-white" />
                        </div>
                        <span className="text-xs text-gray-300 font-medium hidden sm:inline">
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
                    <p className="text-xs text-gray-400 uppercase font-medium tracking-wide">
                        {format(time, "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                </div>
                <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                <div className="font-mono text-xl font-bold text-white tracking-widest text-shadow-glow">
                    {format(time, "HH:mm:ss")}
                </div>
                <div className="flex items-center space-x-3 text-gray-500">
                    <Wifi size={16} />
                </div>
            </div>
        </header>
    );
};

export default TopBar;
