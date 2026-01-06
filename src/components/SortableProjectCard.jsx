import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ProjectCard from './ProjectCard';

export const SortableProjectCard = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: props.project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ProjectCard {...props} />
        </div>
    );
};
