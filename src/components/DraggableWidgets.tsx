import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';

export interface WidgetConfig {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  component: React.ReactNode;
}

interface DraggableWidgetProps {
  widget: WidgetConfig;
  isEditing: boolean;
}

const DragHandle: React.FC<{ isEditing: boolean }> = ({ isEditing }) => (
  <AnimatePresence>
    {isEditing && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="absolute -left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1.5 bg-white rounded-full shadow-lg border border-slate-200 z-50"
      >
        <GripVertical size={16} className="text-slate-400" />
      </motion.div>
    )}
  </AnimatePresence>
);

const DraggableWidget: React.FC<DraggableWidgetProps> = ({ widget, isEditing }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-2',
    large: 'col-span-2 row-span-2',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className={cn(
        'relative transition-all duration-200',
        sizeClasses[widget.size],
        isDragging && 'z-50 opacity-90 scale-[1.02]',
        isEditing && 'hover:ring-2 hover:ring-primary-300 hover:ring-offset-2 rounded-[28px]'
      )}
      {...attributes}
      {...(isEditing ? listeners : {})}
    >
      <DragHandle isEditing={isEditing} />
      <motion.section
        layout
        className={cn(
          'glass-panel rounded-[28px] border border-slate-200/80 p-5 h-full',
          isDragging && 'shadow-2xl'
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            {widget.subtitle && (
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                {widget.subtitle}
              </p>
            )}
            <p className="text-xl font-semibold text-slate-900">{widget.title}</p>
          </div>
          {widget.icon && <span className="text-slate-500">{widget.icon}</span>}
        </div>
        <div className="mt-4 flex flex-col gap-4">{widget.component}</div>
      </motion.section>
    </motion.div>
  );
};

interface WidgetGridProps {
  widgets: WidgetConfig[];
  storageKey?: string;
  onWidgetReorder?: (widgets: WidgetConfig[]) => void;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets: initialWidgets,
  storageKey = 'dashboard-widgets',
  onWidgetReorder,
}) => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const savedIds: string[] = JSON.parse(saved);
        const reordered = savedIds
          .map(id => initialWidgets.find(w => w.id === id))
          .filter(Boolean) as WidgetConfig[];
        const newWidgets = [...reordered];
        initialWidgets.forEach(w => {
          if (!savedIds.includes(w.id)) {
            newWidgets.push(w);
          }
        });
        return newWidgets;
      } catch {
        return initialWidgets;
      }
    }
    return initialWidgets;
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const ids = widgets.map(w => w.id);
    localStorage.setItem(storageKey, JSON.stringify(ids));
    onWidgetReorder?.(widgets);
  }, [widgets, storageKey, onWidgetReorder]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="relative">
      {/* Edit Mode Toggle */}
      <motion.button
        onClick={() => setIsEditing(!isEditing)}
        className={cn(
          'absolute -top-2 right-4 z-50 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          isEditing
            ? 'bg-primary-500 text-white shadow-lg'
            : 'bg-white/80 text-slate-600 border border-slate-200 hover:bg-white'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isEditing ? '✓ Готово' : '↻ Изменить порядок'}
      </motion.button>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">
            {widgets.map(widget => (
              <DraggableWidget
                key={widget.id}
                widget={widget}
                isEditing={isEditing}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default WidgetGrid;
