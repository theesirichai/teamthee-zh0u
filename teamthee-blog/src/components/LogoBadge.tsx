import React from 'react';

interface LogoBadgeProps {
  className?: string;
  subText?: string;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({ className = '', subText = 'BLOG' }) => {
  return (
    <div
      className={`flex bg-black text-white p-3.5 md:p-4 font-black tracking-tighter leading-[0.85] select-none border border-white/20 hover:border-fuchsia-500/50 transition-all duration-300 shadow-2xl shadow-purple-500/10 cursor-pointer ${className}`}
    >
      <div className="flex flex-col text-2xl md:text-3xl">
        <span>TEAMTHEE</span>
        <span className="text-stone-300">{subText}</span>
      </div>
      <div className="ml-2 text-[7px] md:text-[8px] [writing-mode:vertical-rl] self-end pb-0.5 tracking-[0.3em] font-bold text-stone-400">
        UNDERGROUND
      </div>
    </div>
  );
};

