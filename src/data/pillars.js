import { Cpu, Eye, Database, Briefcase, TrendingUp, Users, Disc, Dumbbell, Flower } from 'lucide-react';

export const pillars = [
    {
        id: 'poker-app',
        title: 'Entrena Poker App',
        category: 'IA',
        status: 'In Development',
        progress: 45,
        icon: Cpu,
        color: 'cyan',
        tasks: [
            { id: 1, text: 'Integrar API de OpenAI', done: true },
            { id: 2, text: 'Diseñar flujo de entrenamiento', done: false },
            { id: 3, text: 'Testing con usuarios', done: false },
        ]
    },
    {
        id: 'ocr-vision',
        title: 'OCR Poker Vision',
        category: 'IA',
        status: 'Optimization',
        progress: 78,
        icon: Eye,
        color: 'cyan',
        tasks: [
            { id: 1, text: 'Mejorar detección de cartas', done: true },
            { id: 2, text: 'Reducir latencia < 200ms', done: true },
            { id: 3, text: 'Soporte multi-mesa', done: false },
        ]
    },
    {
        id: 'mda-mining',
        title: 'Minería de Datos MDA',
        category: 'IA',
        status: 'Running',
        progress: 92,
        icon: Database,
        color: 'cyan',
        tasks: [
            { id: 1, text: 'Scraping diario automático', done: true },
            { id: 2, text: 'Dashboard de tendencias', done: true },
            { id: 3, text: 'Alertas de anomalías', done: true },
        ]
    },
    {
        id: 'portfolio',
        title: 'Portfolio Manager',
        category: 'Finanzas',
        status: 'Review',
        progress: 60,
        icon: Briefcase,
        color: 'orange',
        tasks: [
            { id: 1, text: 'Rebalanceo mensual', done: false },
            { id: 2, text: 'Reporte de dividendos', done: false },
            { id: 3, text: 'Investigación nuevos ETFs', done: true },
        ]
    },
    {
        id: 'options-trading',
        title: 'Trading de Opciones',
        category: 'Finanzas',
        status: 'Active',
        progress: 88,
        icon: TrendingUp,
        color: 'orange',
        tasks: [
            { id: 1, text: 'Revisar señales diarias', done: true },
            { id: 2, text: 'Ajustar Stop-Loss', done: true },
            { id: 3, text: 'Bitácora de operaciones', done: false },
        ]
    },
    {
        id: 'ia-consulting',
        title: 'Consultoría IA Social',
        category: 'Creatividad',
        status: 'Planning',
        progress: 30,
        icon: Users,
        color: 'purple',
        tasks: [
            { id: 1, text: 'Definir pilares de contenido', done: true },
            { id: 2, text: 'Crear calendario editorial', done: false },
            { id: 3, text: 'Grabar primer video', done: false },
        ]
    },
    {
        id: 'dj-jama1',
        title: 'DJ jama1 (Acid Techno)',
        category: 'Creatividad',
        status: 'Jamming',
        progress: 55,
        icon: Disc,
        color: 'purple',
        tasks: [
            { id: 1, text: 'Curar playlist TB-303', done: true },
            { id: 2, text: 'Grabar Set 004', done: false },
            { id: 3, text: 'Subir a YouTube', done: false },
        ]
    },
    {
        id: 'gym-strength',
        title: 'Gimnasio (Fuerza)',
        category: 'Salud',
        status: 'Active',
        progress: 70,
        icon: Dumbbell,
        color: 'emerald',
        tasks: [
            { id: 1, text: 'Rutina A (Pecho/Espalda)', done: true },
            { id: 2, text: 'Rutina B (Pierna/Hombro)', done: false },
            { id: 3, text: 'Meal Prep semanal', done: false },
        ]
    },
    {
        id: 'yoga-focus',
        title: 'Yoga & Foco',
        category: 'Salud',
        status: 'Maintenance',
        progress: 40,
        icon: Flower,
        color: 'emerald',
        tasks: [
            { id: 1, text: 'Estiramiento muñecas', done: true },
            { id: 2, text: 'Sesión 15min meditación', done: false },
            { id: 3, text: 'Clase presencial', done: false },
        ]
    },
];
