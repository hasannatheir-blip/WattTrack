import React from 'react';
import { Zap } from 'lucide-react';
import { JordanFlag } from './JordanFlag';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-4 group">
      <div className="relative flex items-center">
        {/* Dynamic Electricity Icon */}
        <div className="bg-jordan-gradient p-3 rounded-2xl shadow-xl shadow-primary/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          <Zap className="text-white w-7 h-7 fill-white animate-pulse" />
        </div>
        
        {/* Flag integrated dynamically */}
        <div className="absolute -right-3 -bottom-2 border-4 border-white rounded-xl overflow-hidden shadow-2xl transform rotate-6 group-hover:rotate-0 transition-all duration-500 scale-110">
          <JordanFlag className="w-10 h-6" />
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="text-3xl font-[900] tracking-tighter leading-none flex items-baseline">
          <span className="text-ink">Track</span>
          <span className="text-primary">Watt</span>
        </div>
        <div className="text-[10px] uppercase font-black tracking-[0.3em] text-primary/60 mt-1">
          Jordan • الأردن
        </div>
      </div>
    </div>
  );
};
