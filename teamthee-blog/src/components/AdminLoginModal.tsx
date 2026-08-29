import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Key, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { AdminUser } from '../types/blog';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [identifier, setIdentifier] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanIdentifier = identifier.trim();
    const cleanKey = accessKey.trim();

    // 1. Check Master Portal Key (thee-b02 / Thee_Thee207812)
    if (
      (cleanIdentifier.toLowerCase() === 'thee-b02' && cleanKey === 'Thee_Thee207812') ||
      (cleanIdentifier.toLowerCase() === 'thee-b01' && cleanKey === 'Thee_Thee207812') ||
      (cleanIdentifier.toLowerCase() === 'admin' && cleanKey === 'theethee2026')
    ) {
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess({
          isAuthenticated: true,
          identifier: cleanIdentifier,
          displayName: 'TEAMTHEE ADMIN (thee-b02)'
        });
        onClose();
      }, 400);
      return;
    }

    // 2. Try Firebase Auth (if user provided email)
    if (auth && cleanIdentifier.includes('@')) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanIdentifier, cleanKey);
        setLoading(false);
        onLoginSuccess({
          isAuthenticated: true,
          email: userCredential.user.email || '',
          displayName: userCredential.user.displayName || 'Admin'
        });
        onClose();
        return;
      } catch (err: any) {
        console.warn('Firebase Auth error:', err);
      }
    }

    setLoading(false);
    setError('ACCESS DENIED: Invalid Security Identifier or Access Key');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050505]/90 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm bg-[#0a0a0a] border border-white/20 p-8 shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-fuchsia-500" />
              <h2 className="text-xs font-black tracking-[0.3em] uppercase text-white">
                SECURITY TERMINAL
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-stone-600 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 mb-2">
                COMMAND IDENTIFIER / EMAIL
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. thee-b02"
                required
                className="w-full bg-[#050505] border border-white/15 p-3 text-xs text-white focus:outline-none focus:border-fuchsia-500 font-mono tracking-wider"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 mb-2">
                ACCESS KEY
              </label>
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#050505] border border-white/15 p-3 text-xs text-white focus:outline-none focus:border-fuchsia-500 font-mono tracking-wider"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2 bg-red-950/40 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                <ShieldAlert size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3 text-xs font-black tracking-[0.3em] uppercase hover:bg-stone-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHORIZE TERMINAL'}
            </button>
          </form>

          {/* Quick hint badge */}
          <div className="mt-6 pt-4 border-t border-white/5 text-[9px] font-mono text-stone-600 uppercase tracking-widest flex items-center justify-between">
            <span>TEAMTHEE SECURE PROTOCOL</span>
            <span className="text-stone-500">v2.6</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

