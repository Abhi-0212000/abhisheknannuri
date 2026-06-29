import React from 'react';
import { Coffee } from 'lucide-react';

export default function PersonalFooter() {
  return (
    <footer className="py-12 border-t border-dashed border-[#2D2A26]/15 dark:border-[#524B44]/25 text-center relative z-10 select-none">
      <div className="max-w-6xl mx-auto px-4 font-mono text-[10px] text-current/40 space-y-1.5 uppercase">
        <div className="flex items-center justify-center gap-2">
          <Coffee className="w-3 h-3 text-[#f43f5e]" />
          <span>DRIP COFFEE MODULE & SHADOWLESS WRITING BLOCKS</span>
        </div>
        <div>ABHISHEK NANNURI © 2026 // ALL THOUGHTS PERSISTED IN MEMORY</div>
        <div>LAT: 48.8353° N // DEGGENDORF_DE</div>
      </div>
    </footer>
  );
}
