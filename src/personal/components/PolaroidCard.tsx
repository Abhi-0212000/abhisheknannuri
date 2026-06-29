import React from 'react';

interface PolaroidCardProps {
  imgUrl: string;
  caption: string;
  subcaption?: string;
  rotationClass?: string;
  tapeColorClass?: string;
  cardBgClass?: string;
}

export default function PolaroidCard({ 
  imgUrl, 
  caption, 
  subcaption, 
  rotationClass = "rotate-1",
  tapeColorClass = "bg-[#FEF9E7]/60 dark:bg-amber-500/20 border-amber-300/35",
  cardBgClass = "bg-[#FAF8F5] dark:bg-[#1C1917]"
}: PolaroidCardProps) {
  return (
    <div className={`relative inline-block p-4 pb-8 ${cardBgClass} text-[#2D2A26] dark:text-[#EAE6DF] border-2 border-[#2D2A26] dark:border-[#524B44] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-2 group ${rotationClass} shadow-[8px_8px_0px_#2D2A26] dark:shadow-[8px_8px_0px_rgba(0,0,0,0.6)]`}>
      {/* Hand-drawn Scotch Tape Effect: Semi-transparent CSS pseudo-element styled tape at top center */}
      <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-6 ${tapeColorClass} backdrop-blur-[0.5px] border-l border-r border-dashed border-[#2D2A26]/15 rotate-[-2deg] shadow-sm pointer-events-none`} />
      
      {/* Image container */}
      <div className="w-full aspect-[4/3] overflow-hidden border border-[#E6E1D8] dark:border-[#3E3832] bg-[#EAE6D8] dark:bg-[#2A2521]">
        <img 
          src={imgUrl} 
          alt={caption} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-300"
        />
      </div>
      
      {/* Handwritten Caption in Caveat (font-sketch) */}
      <div className="mt-4 text-center">
        <p className="font-sketch text-2xl font-bold tracking-tight text-[#2D2A26] dark:text-[#EAE6DF] leading-none">
          {caption}
        </p>
        {subcaption && (
          <p className="text-[10px] font-mono mt-1 text-[#2D2A26]/50 dark:text-[#EAE6DF]/50 tracking-widest uppercase">
            {subcaption}
          </p>
        )}
      </div>
    </div>
  );
}
