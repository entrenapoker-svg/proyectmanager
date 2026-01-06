import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Menu } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TopBar = ({ onMenuClick }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="h-14 fixed top-0 right-0 left-0 md:left-64 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-40 transition-all duration-300">
            {/* Left: Hamburger (Mobile) & Breadcrumbs */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-gray-400 hover:text-white mr-2 p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                    <Menu size={20} />
                </button>
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">En Línea</span>
                </div>
            </div>

            {/* Right: Clock & System */}
            <div className="flex items-center space-x-6">
                <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-medium tracking-wide">
                        {format(time, "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                </div>
                <div className="h-4 w-px bg-white/10"></div>
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
