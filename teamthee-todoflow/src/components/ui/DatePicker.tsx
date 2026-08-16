import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium",
            date 
              ? "bg-white/10 border-white/20 text-white" 
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
          )}
        >
          <CalendarIcon size={14} className="text-white" />
          {date ? format(date, 'PPP', { locale: th }) : 'เลือกวันสิ้นสุด'}
          {date && (
            <X 
              size={14} 
              className="ml-1 hover:text-white" 
              onClick={(e) => {
                e.stopPropagation();
                setDate(undefined);
              }}
            />
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          className="z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="p-4 bg-[#0d0d12] border border-purple-500/30 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={th}
              className="text-sm"
            />
            
            {date && (
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-purple-300/60">
                  <Clock size={14} />
                  <span>เวลา (Coming Soon)</span>
                </div>
                <Popover.Close asChild>
                  <button className="px-4 py-1.5 bg-pink-600 rounded-lg text-xs font-bold hover:bg-pink-500 transition-colors">
                    ตกลง
                  </button>
                </Popover.Close>
              </div>
            )}
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
