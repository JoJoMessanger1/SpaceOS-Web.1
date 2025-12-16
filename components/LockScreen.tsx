import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';

interface LockScreenProps {
    onUnlock: () => void;
    wallpaperUrl: string;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, wallpaperUrl }) => {
    const [time, setTime] = useState(new Date());
    const [isUnlocking, setIsUnlocking] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const handleUnlock = () => {
        setIsUnlocking(true);
        setTimeout(onUnlock, 500); // Wait for animation
    };

    return (
        <div 
            className={`absolute inset-0 z-[100] bg-cover bg-center flex flex-col items-center pt-20 text-white transition-transform duration-500 ease-in-out ${isUnlocking ? '-translate-y-full' : 'translate-y-0'}`}
            style={{ backgroundImage: `url(${wallpaperUrl})` }}
            onClick={handleUnlock}
        >
            <div className="backdrop-blur-sm bg-black/20 absolute inset-0 -z-10" />
            
            <div className="flex flex-col items-center animate-in fade-in duration-1000">
                <Lock size={24} className="mb-4 opacity-80" />
                <div className="text-8xl font-thin tracking-tight drop-shadow-lg">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-2xl font-medium mt-2 drop-shadow-md">
                    {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="mt-auto mb-16 animate-pulse text-center">
                <p className="text-sm font-medium tracking-wide opacity-80">Click to Unlock</p>
                <div className="w-32 h-1 bg-white/50 rounded-full mt-2 mx-auto" />
            </div>
        </div>
    );
};
