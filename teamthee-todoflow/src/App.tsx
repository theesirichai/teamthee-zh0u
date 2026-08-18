import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, LogOut, CheckCircle2, ListTodo, Loader2, Key, ChevronRight } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { useTasks } from '@/src/hooks/useTasks';
import { TaskInput } from '@/src/components/TaskInput';
import { TaskItem } from '@/src/components/TaskItem';

const ACCESS_CODE = 'teamthee-bzxt04y';

export default function App() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const { tasks, loading: tasksLoading, addTask, toggleTask, deleteTask } = useTasks(user?.uid);
  
  const [inputCode, setInputCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(false);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode === ACCESS_CODE) {
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <Loader2 className="text-pink-600 animate-spin" size={40} />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center px-6">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-600/10 blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md p-8 bg-purple-900/10 border border-purple-500/20 rounded-[32px] backdrop-blur-xl text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
            <Key size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Required</h2>
          <p className="text-purple-300/60 mb-8 text-sm">กรุณาใส่รหัสสมัครใช้งานเพื่อเข้าถึง TodoFlow</p>
          
          <form onSubmit={handleAccess} className="space-y-4">
            <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="ใส่รหัสที่นี่..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 outline-none transition-all text-center tracking-widest font-mono"
              />
            </motion.div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              ยืนยันรหัส
              <ChevronRight size={18} />
            </button>
            {error && (
              <p className="text-red-400 text-xs mt-2">รหัสไม่ถูกต้อง กรุณาลองใหม่</p>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-pink-500/30">
      {/* Top Gradient Blur */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-600/10 blur-[120px] pointer-events-none" />

      <main className="relative max-w-2xl mx-auto px-6 py-12 md:py-24">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                TodoFlow
              </h1>
              <p className="text-xs text-purple-400/60 font-medium tracking-wider uppercase">
                Productivity Stream
              </p>
            </div>
          </div>

          {!user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={login}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <LogIn size={18} className="text-pink-500" />
              Sign In
            </motion.button>
          ) : (
            <div className="flex items-center gap-4">
              <img 
                src={user.photoURL || ''} 
                alt={user.displayName || ''} 
                className="w-8 h-8 rounded-lg border border-purple-500/30"
              />
              <button 
                onClick={logout}
                className="p-2 text-purple-400 hover:text-pink-400 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </header>

        {user ? (
          <>
            <TaskInput onAdd={addTask} />

            {tasksLoading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>กำลังโหลดข้อมูลจากคลาวด์...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <section>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-sm font-semibold text-purple-300/80 uppercase tracking-widest flex items-center gap-2">
                      <ListTodo size={16} />
                      รายการงาน ({pendingTasks.length})
                    </h2>
                  </div>
                  
                  <AnimatePresence mode="popLayout">
                    {pendingTasks.map(task => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        onToggle={toggleTask} 
                        onDelete={deleteTask} 
                      />
                    ))}
                  </AnimatePresence>

                  {pendingTasks.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/5"
                    >
                      <p className="text-purple-300/30">ไม่มีงานค้าง ยอดเยี่ยมมาก!</p>
                    </motion.div>
                  )}
                </section>

                {completedTasks.length > 0 && (
                  <section className="opacity-60">
                    <h2 className="text-sm font-semibold text-purple-300/80 uppercase tracking-widest mb-4 px-2">
                      เสร็จสิ้นแล้ว ({completedTasks.length})
                    </h2>
                    <AnimatePresence mode="popLayout">
                      {completedTasks.map(task => (
                        <TaskItem 
                          key={task.id} 
                          task={task} 
                          onToggle={toggleTask} 
                          onDelete={deleteTask} 
                        />
                      ))}
                    </AnimatePresence>
                  </section>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-purple-900/5 rounded-[40px] border border-purple-500/10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ListTodo size={32} className="text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">ยินดีต้อนรับสู่ TodoFlow</h2>
            <p className="text-purple-300/60 mb-8 max-w-sm mx-auto">
              เข้าสู่ระบบเพื่อซิงค์ข้อมูลของคุณผ่านคลาวด์ และใช้งานได้จากทุกอุปกรณ์
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={login}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold shadow-xl shadow-purple-500/20 hover:shadow-pink-500/30 transition-all"
            >
              เริ่มต้นใช้งานฟรี
            </motion.button>
          </div>
        )}
      </main>

      {/* Bottom Gradient Blur */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/5 blur-[150px] pointer-events-none" />
    </div>
  );
}
