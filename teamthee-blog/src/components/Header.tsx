import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, LogOut, Plus, Radio, Globe } from 'lucide-react';
import { AdminUser } from '../types/blog';

interface HeaderProps {
  adminUser: AdminUser;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenAdminPanel: () => void;
  onOpenNewPost: () => void;
  isFirebaseOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  adminUser,
  onOpenLogin,
  onLogout,
  onOpenAdminPanel,
  onOpenNewPost,
  isFirebaseOnline
}) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 md:mb-20 gap-6 border-b border-white/10 pb-6"
    >
      {/* Left: System Status & Cloud Telemetry */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.4em] uppercase text-stone-600 font-bold mb-1">
            SYSTEM STATUS
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-none shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            <span className="text-xs font-bold text-emerald-500 tracking-tighter">
              OPERATIONAL
            </span>
          </div>
        </div>

        <div className="hidden sm:flex flex-col border-l border-white/10 pl-6">
          <span className="text-[10px] tracking-[0.4em] uppercase text-stone-600 font-bold mb-1">
            CLOUD ENGINE
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isFirebaseOnline ? 'bg-fuchsia-500 shadow-[0_0_6px_#d946ef]' : 'bg-amber-500'
              }`}
            />
            <span className={`text-[11px] font-bold tracking-tight ${isFirebaseOnline ? 'text-stone-300' : 'text-amber-400'}`}>
              {isFirebaseOnline ? 'FIREBASE SYNC ACTIVE' : 'LOCAL CACHE MODE'}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Local Clock, Portal Link & Admin Actions */}
      <div className="flex items-center flex-wrap gap-4 md:gap-6 self-end md:self-auto">
        <div className="flex flex-col items-end mr-2">
          <span className="text-[10px] tracking-[0.4em] uppercase text-stone-600 font-bold mb-1">
            LOCAL TIME
          </span>
          <span className="text-sm font-bold tabular-nums text-stone-200 tracking-tight font-mono">
            {time.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>

        {/* External Portal Link */}
        <a
          href="https://teamthee-webportal.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          title="TeamThee Web Portal"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 border border-white/10 hover:border-fuchsia-500/40 text-[10px] font-bold text-stone-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          <Globe size={12} className="text-fuchsia-400" />
          <span className="hidden sm:inline">PORTAL</span>
        </a>

        {/* Admin Navigation Controls */}
        {adminUser.isAuthenticated ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewPost}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-[10px] font-black tracking-widest uppercase hover:bg-stone-200 transition-colors shadow-sm"
              title="Create New Post"
            >
              <Plus size={13} strokeWidth={3} />
              <span>NEW POST</span>
            </button>
            <button
              onClick={onOpenAdminPanel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-500 text-black text-[10px] font-black tracking-widest uppercase hover:bg-fuchsia-400 transition-colors shadow-[0_0_15px_rgba(217,70,239,0.3)]"
            >
              <ShieldCheck size={13} />
              <span>COMMAND CENTER</span>
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
              title="Logout Security Terminal"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-fuchsia-500/50 hover:bg-white/10 transition-all text-stone-400 hover:text-white text-xs font-bold uppercase tracking-wider"
            title="Terminal Admin Login"
          >
            <Shield size={14} className="text-stone-500 group-hover:text-fuchsia-400" />
            <span className="text-[10px] tracking-widest">ADMIN TERMINAL</span>
          </button>
        )}
      </div>
    </motion.nav>
  );
};

