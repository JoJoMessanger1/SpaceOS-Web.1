import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
  // Size props
  initialWidth?: number;
  initialHeight?: number;
  isMobileMode?: boolean;
}

export const OSWindow: React.FC<WindowProps> = ({ 
  title, children, isActive, onClose, onMinimize, onFocus, zIndex,
  initialWidth = 800, initialHeight = 550, isMobileMode = false
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50 + Math.random() * 50, y: 50 + Math.random() * 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);

  // If Mobile Mode is ON, force full screen/fixed position
  useEffect(() => {
    if (isMobileMode) {
      setPosition({ x: 0, y: 32 }); // Start below status bar
    } else {
        // Center calculator if small
        if (initialWidth < 400) {
            setPosition({ 
                x: (window.innerWidth / 2) - (initialWidth / 2),
                y: (window.innerHeight / 2) - (initialHeight / 2)
            });
        }
    }
  }, [isMobileMode, initialWidth, initialHeight]);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    if (!isMobileMode && windowRef.current) {
      setIsDragging(true);
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMinimize();
  };

  // Determine Dimensions
  const style = isMobileMode ? {
      top: '32px', // Below status bar
      left: '0px',
      width: '100%',
      height: 'calc(100% - 32px - 80px)', // Minus status bar and dock
      zIndex: zIndex,
      borderRadius: '0 0 24px 24px', // Rounded bottom
  } : {
      top: position.y,
      left: position.x,
      width: `${initialWidth}px`,
      height: `${initialHeight}px`,
      zIndex: zIndex,
  };

  return (
    <div
      ref={windowRef}
      style={{
        ...style,
        transform: isClosing ? 'scale(0.9) opacity(0)' : 'scale(1) opacity(1)',
      }}
      className={`absolute flex flex-col overflow-hidden shadow-2xl transition-transform duration-200 ease-out glass-panel window-animate ${isActive ? 'shadow-2xl ring-1 ring-white/30' : 'shadow-lg opacity-90'}`}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div 
        className={`h-11 bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-xl flex items-center justify-between px-4 select-none border-b border-gray-200/20 ${isMobileMode ? '' : 'cursor-move'}`}
        onMouseDown={handleMouseDown}
      >
        {!isMobileMode && (
             <div className="flex items-center gap-2 group">
                <button onClick={handleClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 border border-red-600/20 flex items-center justify-center transition-colors">
                    <X size={8} className="text-red-900 opacity-0 group-hover:opacity-100" />
                </button>
                <button onClick={handleMinimize} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 border border-yellow-600/20 flex items-center justify-center transition-colors">
                    <Minus size={8} className="text-yellow-900 opacity-0 group-hover:opacity-100" />
                </button>
                <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600/20" />
            </div>
        )}
        {isMobileMode && (
            <div className="text-blue-500 font-bold text-sm cursor-pointer" onClick={handleClose}>Done</div>
        )}
        
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide opacity-80">{title}</div>
        
        <div className="w-12"></div> 
      </div>

      {/* Content */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};
