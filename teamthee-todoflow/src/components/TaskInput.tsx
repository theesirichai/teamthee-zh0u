import { useState, FormEvent } from 'react';
import { Plus, Flag } from 'lucide-react';
import { motion } from 'motion/react';
import { DatePicker } from './ui/DatePicker';
import { Priority } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface TaskInputProps {
  onAdd: (title: string, dueDate?: number, priority?: Priority) => void;
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, date ? date.getTime() : undefined, priority);
    setTitle('');
    setDate(undefined);
    setPriority('medium');
  };

  const priorityColors = {
    low: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
    medium: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5',
    high: 'text-red-400 border-red-500/30 bg-red-500/5',
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-8 group">
      <div className="flex flex-col gap-3 p-4 bg-purple-900/10 border border-purple-500/20 rounded-2xl backdrop-blur-xl focus-within:border-white/30 transition-all duration-300">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="สิ่งที่ต้องทำต่อไป..."
            className="flex-1 bg-transparent border-none text-white placeholder-purple-300/50 focus:ring-0 text-lg py-2"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl text-white shadow-lg shadow-purple-500/20 hover:shadow-pink-500/30 transition-all"
          >
            <Plus size={24} />
          </motion.button>
        </div>
        
        <div className="flex items-center gap-4 px-1">
          <DatePicker date={date} setDate={setDate} />
          
          <div className="flex items-center gap-2">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={cn(
                  "px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all",
                  priority === p ? priorityColors[p] : "text-white/20 border-white/5 hover:border-white/20"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
