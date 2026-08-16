import React from 'react';
import { Check, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const isOverdue = task.dueDate && task.dueDate < Date.now() && !task.completed;

  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group flex items-center gap-4 p-4 mb-3 rounded-2xl border transition-all duration-300",
        task.completed 
          ? "bg-black/20 border-purple-900/20" 
          : "bg-purple-900/5 border-purple-500/20 hover:border-pink-500/30"
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => onToggle(task.id, task.completed)}
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
            task.completed
              ? "bg-pink-600 border-pink-600 text-white"
              : "border-purple-500/40 hover:border-pink-500"
          )}
        >
          <AnimatePresence>
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check size={14} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        {!task.completed && (
          <div className={cn("w-1 h-3 rounded-full opacity-60", priorityColors[task.priority])} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "text-base font-medium truncate transition-all",
            task.completed ? "text-purple-300/40 line-through" : "text-white"
          )}>
            {task.title}
          </h3>
          {!task.completed && (
            <span className={cn(
              "text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase border",
              task.priority === 'high' ? "text-red-400 border-red-500/20" : 
              task.priority === 'medium' ? "text-yellow-400 border-yellow-500/20" : 
              "text-blue-400 border-blue-500/20"
            )}>
              {task.priority}
            </span>
          )}
        </div>
        
        {task.dueDate && (
          <div className={cn(
            "flex items-center gap-1.5 mt-1 text-xs",
            isOverdue ? "text-red-400" : "text-purple-400/60"
          )}>
            <Clock size={12} />
            <span>
              {format(task.dueDate, 'PPp', { locale: th })}
            </span>
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.1, color: '#f472b6' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(task.id)}
        className="text-purple-500/40 opacity-0 group-hover:opacity-100 transition-all p-2"
      >
        <Trash2 size={18} />
      </motion.button>
    </motion.div>
  );
};
