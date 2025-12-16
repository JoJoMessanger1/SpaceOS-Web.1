import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  isDragging?: boolean;
}

export const AppIcon: React.FC<IconProps> = ({ icon: Icon, name, color, size = 'lg', onClick, isDragging }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-[10px]',
    md: 'w-12 h-12 rounded-[12px]',
    lg: 'w-[64px] h-[64px] rounded-[16px]', // Standard iPad size feel
    xl: 'w-20 h-20 rounded-[22px]',
  };

  return (
    <div 
      className={`flex flex-col items-center gap-1.5 group select-none transition-all duration-200 ${isDragging ? 'opacity-50 scale-105' : 'hover:scale-105 active:scale-95'}`}
      onClick={onClick}
    >
      <div className={`${sizeClasses[size]} ${color} flex items-center justify-center shadow-md relative overflow-hidden`}>
        {/* Subtle top shine */}
        <div className="absolute top-0 w-full h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        {/* Icon */}
        <Icon className="text-white w-1/2 h-1/2 drop-shadow-sm relative z-10" strokeWidth={2.5} />
      </div>
      {name && (
        <span className="text-[11px] font-medium text-white/90 tracking-wide drop-shadow-md text-center line-clamp-1 w-[70px]">
          {name}
        </span>
      )}
    </div>
  );
};
