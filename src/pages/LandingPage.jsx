import React from 'react';
import { Link } from 'react-router-dom';
import {
    Bot,
    Mic,
    Settings,
    Layout,
    ArrowRight,
    CheckCircle2,
    Terminal,
    Sparkles,
    Brain,
    HelpCircle,
    Copy,
    Wand2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils';

const LandingPage = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                <span className="font-bold text-xs text-white">J1</span>
                            </div>
                        </div>
                        <span className="font-bold text-lg tracking-tight">JAMA1 <span className="text-cyan-400">CENTRAL</span></span>
                    </div>
                    <div>
                        <Link
                            to={user ? "/" : "/login"}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold transition-all flex items-center gap-2 group"
                        >
                            {user ? 'Ir al Dashboard' : 'Iniciar Sesión'}
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold mb-6 animate-fade-in-up">
                        <Sparkles size={12} />
                        <span>SISTEMA OPERATIVO PARA POKER & VIDA</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                        Gestiona tu Caos.<br />
                        <span className="text-cyan-400">Domina tu Mente.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Unifica tus proyectos, rutinas de Poker y gimnasio mental en una sola interfaz potenciada por Inteligencia Artificial.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to={user ? "/" : "/login"}
                            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2"
                        >
                            <Layout size={18} />
                            Comenzar Ahora
                        </Link>
                        <a
                            href="#guia"
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center gap-2"
                        >
                            <HelpCircle size={18} />
                            Ver Guía de Uso
                        </a>
                    </div>
                </div>
            </section>

            {/* Guía de Uso Section */}
            <section id="guia" className="py-20 px-6 bg-black/40 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Centro de Comando 101</h2>
                        <p className="text-gray-400">Domina las herramientas avanzadas de JAMA1 Central.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Tutorial 1: Conectando la IA */}
                        <div className="bg-[#121214] border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Settings size={120} />
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                                    <Terminal size={24} />
                                </div>
                                <h3 className="text-2xl font-bold">1. Conecta tu Inteligencia (API)</h3>
                            </div>

                            <p className="text-gray-400 mb-6">
                                Para activar el cerebro de JAMA1, necesitas una "llave" (API Key). El sistema soporta múltiples proveedores para máxima flexibilidad.
                            </p>

                            <ol className="space-y-4 relative z-10">
                                <li className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-sm border border-white/10">1</div>
                                    <div>
                                        <h4 className="font-bold text-white">Ve a Configuración</h4>
                                        <p className="text-sm text-gray-500">Haz click en "Configuración" en la barra lateral izquierda.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-sm border border-white/10">2</div>
                                    <div>
                                        <h4 className="font-bold text-white">Elige tu Proveedor</h4>
                                        <p className="text-sm text-gray-500 mb-2">Recomendamos <strong>Google Gemini</strong> (Gratis y Potente).</p>
                                        <div className="p-3 bg-black rounded-lg border border-white/10 text-xs font-mono text-gray-300">
                                            Selección: [ Google Gemini (Gratis) ▼ ]
                                        </div>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-sm border border-white/10">3</div>
                                    <div>
                                        <h4 className="font-bold text-white">Pega tu API Key</h4>
                                        <p className="text-sm text-gray-500 mb-2">Consíguela en <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-cyan-400 hover:underline">Google AI Studio</a>.</p>
                                        <div className="p-3 bg-black rounded-lg border border-white/10 text-xs font-mono text-emerald-400 flex justify-between items-center">
                                            <span>AIzaSy...****************</span>
                                            <CheckCircle2 size={14} />
                                        </div>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-sm border border-white/10">4</div>
                                    <div>
                                        <h4 className="font-bold text-white">Confirma y Prueba</h4>
                                        <p className="text-sm text-gray-500">Dale click al botón de prueba. Si se pone verde, ¡estás listo!</p>
                                    </div>
                                </li>
                            </ol>
                        </div>

                        {/* Tutorial 2: Asistente de Voz */}
                        <div className="bg-[#121214] border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Mic size={120} />
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="text-2xl font-bold">2. Asistente de Voz & Magia</h3>
                            </div>

                            <p className="text-gray-400 mb-6">
                                No pierdas tiempo escribiendo. Habla con tu proyecto y deja que la IA estructure tus tareas automáticamente.
                            </p>

                            <div className="space-y-6 relative z-10">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <h4 className="font-bold text-sm text-gray-300 mb-3 flex items-center gap-2">
                                        <Mic size={14} className="text-red-400" /> Cómo usarlo
                                    </h4>
                                    <p className="text-sm text-gray-400 mb-3">
                                        Busca el botón flotante en la esquina inferior derecha.
                                    </p>
                                    <div className="flex gap-4 items-center justify-center py-4 border-t border-white/5 border-b border-white/5 mb-3 bg-black/20">
                                        <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                                            <Mic className="text-black" />
                                        </div>
                                        <ArrowRight className="text-gray-600" />
                                        <div className="text-sm font-mono text-gray-300">
                                            "Crear tarea: Estudiar rangos de Open Raise"
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        *Tip: También puedes escribir manualmente y usar la varita mágica.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-sm text-gray-300 mb-3 flex items-center gap-2">
                                        <Wand2 size={14} className="text-purple-400" /> Comandos Poderosos
                                    </h4>
                                    <div className="grid gap-2">
                                        <div className="p-3 bg-black rounded-lg border border-white/10 text-xs font-mono text-gray-400 flex gap-3">
                                            <span className="text-purple-400">Prompt:</span>
                                            <span>"Dame un plan para hoy basado en mis proyectos activos"</span>
                                        </div>
                                        <div className="p-3 bg-black rounded-lg border border-white/10 text-xs font-mono text-gray-400 flex gap-3">
                                            <span className="text-purple-400">Prompt:</span>
                                            <span>"Analiza mi última sesión de Poker y encuentra fugas mentales"</span>
                                        </div>
                                        <div className="p-3 bg-black rounded-lg border border-white/10 text-xs font-mono text-gray-400 flex gap-3">
                                            <span className="text-purple-400">Prompt:</span>
                                            <span>"Optimizar este texto: [Pega tu borrador]" (Usa la varita mágica)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-white/5 text-center text-gray-600 text-sm">
                <p>&copy; 2026 JAMA1 Central System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
