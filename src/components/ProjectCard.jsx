import React, { useState } from 'react';
import { cn } from '../utils'; // Util refactor
import { Check, Edit2, Play, Trash2 } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

const ProjectCard = ({ project, onEdit, onDelete, isSelected, onToggleSelect }) => {
    const { title, status, progress, icon: Icon, color, tasks } = project;
    const { toggleTask } = useProjects();

    // Map color names to tailwind classes dynamically or static map
    const colorMap = {
        cyan: {
            text: 'text-cyan-500',
            bg: 'bg-cyan-500',
            border: 'group-hover:border-cyan-500/50',
            glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
        },
        orange: {
            text: 'text-orange-500',
            bg: 'bg-orange-500',
            border: 'group-hover:border-orange-500/50',
            glow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]'
        },
        purple: {
            text: 'text-purple-500',
            bg: 'bg-purple-500',
            border: 'group-hover:border-purple-500/50',
            glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
        },
        emerald: {
            text: 'text-emerald-500',
            bg: 'bg-emerald-500',
            border: 'group-hover:border-emerald-500/50',
            glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
        },
    };

    const theme = colorMap[color] || colorMap.cyan;

    // Handle generic icon if it's not a direct import
    const DisplayIcon = Icon || Play;

    return (
        <div className={cn(
            "group relative bg-[#121214] rounded-xl p-5 border transition-all duration-300",
            isSelected ? "border-cyan-500 bg-cyan-500/5 ring-1 ring-cyan-500/50 translate-y-[-4px]" : "border-white/5 hover:-translate-y-1 " + theme.border,
            theme.glow
        )}>

            {/* Selection Checkbox (Absolute Top-Left) */}
            <div className="absolute top-4 left-4 z-30">
                <input
                    type="checkbox"
                    checked={isSelected || false}
                    onChange={(e) => { e.stopPropagation(); onToggleSelect(); }}
                    className="w-4 h-4 rounded appearance-none border border-gray-600 bg-black/50 checked:bg-cyan-500 checked:border-cyan-500 cursor-pointer transition-all hover:border-cyan-400"
                />
            </div>

            {/* Edit Button (Absolute Top-Right) */}
            {/* Actions (Absolute Top-Right) */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button
                    onClick={() => onEdit(project)}
                    className="text-gray-500 hover:text-white transition-colors"
                >
                    <Edit2 size={15} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`¿Estás seguro de eliminar "${title}"?\nSe borrarán todas las tareas asociadas.`)) {
                            onDelete(project.id);
                        }
                    }}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                >
                    <Trash2 size={15} />
                </button>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-4 pr-6">
                <div className="flex items-center space-x-3">
                    <div className={cn("p-2 rounded-lg bg-white/5 text-white", theme.text)}>
                        <DisplayIcon size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-100 text-sm">{title}</h3>
                        <span className={cn("text-[10px] uppercase font-bold tracking-wider opacity-80", theme.text)}>
                            {status}
                        </span>
                    </div>
                </div>
                <div className="text-xs font-mono text-gray-400">{progress}%</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 h-1 rounded-full mb-4 overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000", theme.bg)}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Mini Tasks */}
            <div className="space-y-2">
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-start space-x-2">
                        <button
                            onClick={() => toggleTask(project.id, task.id)}
                            className={cn(
                                "w-4 h-4 rounded border flex items-center justify-center mt-0.5 transition-colors cursor-pointer",
                                task.done
                                    ? cn("border-transparent text-black", theme.bg)
                                    : "border-gray-600 bg-transparent hover:border-gray-400"
                            )}>
                            {task.done && <Check size={10} strokeWidth={4} />}
                        </button>
                        <span className={cn(
                            "text-xs leading-5 select-none cursor-pointer",
                            task.done ? "text-gray-500 line-through" : "text-gray-300"
                        )}
                            onClick={() => toggleTask(project.id, task.id)}
                        >
                            {task.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectCard;
