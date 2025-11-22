import React from 'react';
import { Sparkles } from 'lucide-react';

export const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-brand-500 to-purple-600 text-white p-1.5 rounded-lg shadow-sm">
            <Sparkles size={18} />
          </div>
          <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purple-600">
            MirrorAI
          </h1>
        </div>
        <div className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full text-slate-600">
          Beta
        </div>
      </div>
    </header>
  );
};
