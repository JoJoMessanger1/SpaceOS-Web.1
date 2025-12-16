import React, { useState, useEffect } from 'react';
import { SYSTEM_APPS, STORE_APPS, WALLPAPERS } from './data';
import { AppConfig, WindowState } from './types';
import { AppIcon } from './components/Icon.tsx';
import { OSWindow } from './components/Window.tsx';
import { LockScreen } from './components/LockScreen.tsx';

// Apps
import { Browser } from './apps/Browser.tsx';
import { AppStore } from './apps/AppStore.tsx';
import { Settings } from './apps/Settings.tsx';
import { CalculatorApp } from './apps/Calculator.tsx';
import { NotesApp } from './apps/MicroApps.tsx'; // Moved to MicroApps
import { CameraApp } from './apps/CameraApp.tsx';
import { ClockApp } from './apps/ClockApp.tsx';
import { PhotosApp } from './apps/Photos.tsx';
import { 
    TodoApp, TicTacToe, PaintApp, PasswordGen, 
    Converter, Stopwatch, TerminalApp, CalendarApp, MemoryGame,
    MusicPlayer, SnakeGame, BeatsApp, QuizApp, CodeStudio, TypeMaster
} from './apps/MicroApps.tsx';

import { Wifi, Battery, Search as SearchIcon } from 'lucide-react';

export default function App() {
  // System State
  const [isLocked, setIsLocked] = useState(true);
  const [isMobileMode, setIsMobileMode] = useState<boolean>(() => {
      return localStorage.getItem('os-mobile-mode') === 'true';
  });

  // Load State from LocalStorage
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(() => {
      const saved = localStorage.getItem('os-installed');
      return saved ? JSON.parse(saved) : SYSTEM_APPS.map(app => app.id);
  });

  const [wallpaperId, setWallpaperId] = useState<string>(() => {
      return localStorage.getItem('os-wallpaper') || '1';
  });

  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Spotlight State
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');

  // Home Screen Layout State
  const [appOrder, setAppOrder] = useState<string[]>(() => {
      const saved = localStorage.getItem('os-order');
      return saved ? JSON.parse(saved) : [];
  });
  
  const [draggingAppId, setDraggingAppId] = useState<string | null>(null);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('os-installed', JSON.stringify(installedAppIds)); }, [installedAppIds]);
  useEffect(() => { localStorage.setItem('os-order', JSON.stringify(appOrder)); }, [appOrder]);
  useEffect(() => { localStorage.setItem('os-wallpaper', wallpaperId); }, [wallpaperId]);
  useEffect(() => { localStorage.setItem('os-mobile-mode', String(isMobileMode)); }, [isMobileMode]);

  // Sync Installed Apps with Order
  useEffect(() => {
    setAppOrder(prevOrder => {
      const newApps = installedAppIds.filter(id => !prevOrder.includes(id));
      const existingApps = prevOrder.filter(id => installedAppIds.includes(id));
      return [...existingApps, ...newApps];
    });
  }, [installedAppIds]);

  // Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Spotlight Keyboard Shortcut
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
              e.preventDefault();
              setShowSpotlight(prev => !prev);
              setSpotlightQuery('');
          }
          if (e.key === 'Escape' && showSpotlight) {
              setShowSpotlight(false);
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSpotlight]);

  const openApp = (appId: string) => {
    setShowSpotlight(false);
    const existingWindow = windows.find(w => w.appId === appId);
    
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows(prev => prev.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false } : w));
      }
      bringToFront(existingWindow.id);
    } else {
      const app = [...SYSTEM_APPS, ...STORE_APPS].find(a => a.id === appId);
      if (!app) return;

      const newWindow: WindowState = {
        id: Date.now().toString(),
        appId: app.id,
        title: app.name,
        isOpen: true,
        isMinimized: false,
        zIndex: windows.length + 1,
        position: { x: 50 + (windows.length * 30), y: 50 + (windows.length * 30) },
        size: { width: 850, height: 600 }
      };
      setWindows(prev => [...prev, newWindow]);
      setActiveWindowId(newWindow.id);
    }
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  };

  const bringToFront = (id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
    });
  };

  const installApp = (appId: string) => {
    if (!installedAppIds.includes(appId)) {
      setInstalledAppIds(prev => [...prev, appId]);
    }
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, appId: string) => {
    setDraggingAppId(appId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetAppId: string) => {
    e.preventDefault();
    if (!draggingAppId || draggingAppId === targetAppId) return;
    setAppOrder(prev => {
        const newOrder = [...prev];
        const dragIndex = newOrder.indexOf(draggingAppId);
        const dropIndex = newOrder.indexOf(targetAppId);
        if (dragIndex !== -1 && dropIndex !== -1) {
            [newOrder[dragIndex], newOrder[dropIndex]] = [newOrder[dropIndex], newOrder[dragIndex]];
        }
        return newOrder;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingAppId(null);
  };

  const allKnownApps = [...SYSTEM_APPS, ...STORE_APPS];
  const currentWallpaper = WALLPAPERS.find(w => w.id === wallpaperId) || WALLPAPERS[0];
  
  // Logic to hide icons if any window is open and NOT minimized
  const isAnyAppOpen = windows.some(w => !w.isMinimized);

  const renderContent = (appId: string) => {
    const app = allKnownApps.find(a => a.id === appId);
    
    if (app?.defaultUrl && app.component === 'Browser') {
        return <Browser defaultUrl={app.defaultUrl} />;
    }

    switch (app?.component) {
        case 'Browser': return <Browser />;
        case 'AppStore': return <AppStore installedAppIds={installedAppIds} onInstall={installApp} />;
        case 'Settings': return (
            <Settings 
                currentWallpaperId={wallpaperId} 
                onSetWallpaper={setWallpaperId} 
                isMobileMode={isMobileMode}
                onToggleMobileMode={setIsMobileMode}
            />
        );
        case 'Calculator': return <CalculatorApp />;
        case 'Notes': return <NotesApp />;
        case 'Camera': return <CameraApp />;
        case 'Clock': return <ClockApp />;
        case 'Photos': return <PhotosApp />;
        case 'Todo': return <TodoApp />;
        case 'TicTacToe': return <TicTacToe />;
        case 'Paint': return <PaintApp />;
        case 'PasswordGen': return <PasswordGen />;
        case 'Converter': return <Converter />;
        case 'Stopwatch': return <Stopwatch />;
        case 'Terminal': return <TerminalApp />;
        case 'Calendar': return <CalendarApp />;
        case 'Memory': return <MemoryGame />;
        case 'Music': return <MusicPlayer />;
        case 'Snake': return <SnakeGame />;
        case 'Beats': return <BeatsApp />;
        case 'Quiz': return <QuizApp />;
        case 'CodeStudio': return <CodeStudio />;
        case 'TypeMaster': return <TypeMaster />;
        default: return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
                <app.icon size={80} className="mb-6 opacity-30" />
                <h2 className="text-2xl font-semibold text-gray-600">{app?.name}</h2>
                <p className="text-sm mt-2 text-gray-400">Coming Soon</p>
            </div>
        );
    }
  };

  // Mobile Grid Class
  const gridClass = isMobileMode 
    ? "grid grid-cols-4 gap-y-6 gap-x-2" // Tighter for mobile
    : "grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-8 gap-x-4";

  // Spotlight Filter
  const spotlightResults = spotlightQuery.trim() === '' 
    ? [] 
    : allKnownApps.filter(app => 
        installedAppIds.includes(app.id) && 
        app.name.toLowerCase().includes(spotlightQuery.toLowerCase())
      );

  return (
    <div 
        className="w-full h-screen overflow-hidden relative bg-cover bg-center transition-all duration-1000 ease-in-out font-sans select-none"
        style={{ backgroundImage: `url(${currentWallpaper.url})` }}
    >
        {isLocked && <LockScreen onUnlock={() => setIsLocked(false)} wallpaperUrl={currentWallpaper.url} />}

        {/* Status Bar */}
        <div className="w-full h-8 flex items-center justify-between px-6 text-white text-xs font-semibold z-40 absolute top-0 left-0 tracking-wide backdrop-blur-sm bg-black/10">
            <div className="flex items-center gap-4">
                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {!isMobileMode && <span>{currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>}
            </div>
            <div className="flex items-center gap-4">
                <Wifi size={14} />
                <Battery size={14} />
            </div>
        </div>

        {/* Spotlight Overlay */}
        {showSpotlight && (
            <div className="absolute inset-0 z-50 flex flex-col items-center pt-[20vh] bg-black/20 backdrop-blur-sm" onClick={() => setShowSpotlight(false)}>
                <div 
                    className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/40"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center px-4 py-4 border-b border-gray-200/50">
                        <SearchIcon className="text-gray-500 mr-3" size={24} />
                        <input 
                            className="flex-1 bg-transparent text-2xl outline-none text-gray-800 placeholder-gray-400 font-light"
                            placeholder="Spotlight Search"
                            autoFocus
                            value={spotlightQuery}
                            onChange={e => setSpotlightQuery(e.target.value)}
                        />
                    </div>
                    {spotlightResults.length > 0 && (
                        <div className="py-2">
                            {spotlightResults.map(app => (
                                <div 
                                    key={app.id}
                                    onClick={() => openApp(app.id)}
                                    className="flex items-center gap-4 px-4 py-3 hover:bg-blue-500 hover:text-white cursor-pointer transition-colors group"
                                >
                                    <app.icon size={24} />
                                    <span className="text-lg">{app.name}</span>
                                    <span className="ml-auto text-sm opacity-50 group-hover:text-white">App</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Desktop/Mobile Grid Area - Hides when an app is open */}
        <div 
            className={`absolute inset-0 pt-16 pb-32 px-4 md:px-12 overflow-y-auto overflow-x-hidden no-scrollbar transition-all duration-500 ease-in-out 
                ${isAnyAppOpen ? 'opacity-0 scale-[1.2] pointer-events-none blur-xl' : 'opacity-100 scale-100'}`}
        >
            <div className={`${gridClass} justify-items-center animate-in zoom-in duration-500`}>
                {appOrder.map((appId) => {
                    const app = allKnownApps.find(a => a.id === appId);
                    if (!app) return null;
                    return (
                        <div 
                            key={appId}
                            draggable
                            onDragStart={(e) => handleDragStart(e, appId)}
                            onDragOver={(e) => handleDragOver(e, appId)}
                            onDrop={handleDrop}
                            className="flex justify-center w-full"
                        >
                            <AppIcon 
                                icon={app.icon} 
                                name={app.name} 
                                color={app.color} 
                                size={isMobileMode ? 'md' : 'lg'}
                                onClick={() => openApp(appId)}
                                isDragging={draggingAppId === appId}
                            />
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Windows Layer */}
        {windows.map(win => {
            if (win.isMinimized) return null;
            const app = allKnownApps.find(a => a.id === win.appId);
            return (
                <OSWindow
                    key={win.id}
                    title={win.title}
                    isActive={activeWindowId === win.id}
                    zIndex={win.zIndex}
                    onClose={() => closeWindow(win.id)}
                    onMinimize={() => minimizeWindow(win.id)}
                    onFocus={() => bringToFront(win.id)}
                    initialWidth={app?.preferredWidth}
                    initialHeight={app?.preferredHeight}
                    isMobileMode={isMobileMode}
                >
                    {renderContent(win.appId)}
                </OSWindow>
            );
        })}

        {/* Dock - Hides when an app is open, similar to iPad unless gesture used (simulated by hover near bottom, but let's keep it simple for now) */}
        {/* We keep the Dock visible for multitasking, or hide it if we want pure focus. Let's keep visible but dimmed. */}
        <div className={`absolute bottom-4 left-0 right-0 flex justify-center z-50 transition-all duration-500 ${isAnyAppOpen ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
            <div className={`bg-white/20 backdrop-blur-2xl border border-white/20 rounded-[24px] px-4 py-3 flex items-end gap-3 pointer-events-auto shadow-2xl transition-all duration-300 ${isMobileMode ? 'scale-90' : 'hover:scale-[1.02] hover:bg-white/30'}`}>
                 {/* Pinned Apps */}
                 {SYSTEM_APPS.map(app => (
                     <div key={`dock-${app.id}`} className="relative group flex flex-col items-center">
                         <AppIcon 
                             icon={app.icon} 
                             name="" 
                             color={app.color} 
                             size="md" 
                             onClick={() => openApp(app.id)} 
                         />
                         {windows.some(w => w.appId === app.id && !w.isMinimized) && (
                             <div className="absolute -bottom-2 w-1 h-1 bg-white/60 rounded-full shadow-sm"></div>
                         )}
                     </div>
                 ))}
                 
                 <div className="w-px h-10 bg-white/20 mx-1 self-center"></div>

                 {/* Recent / Minimized Apps */}
                 {windows
                    .filter(w => !SYSTEM_APPS.some(sa => sa.id === w.appId))
                    .map((win) => {
                     const app = allKnownApps.find(a => a.id === win.appId);
                     if (!app) return null;
                     return (
                         <div key={`dock-win-${win.id}`} className="relative group flex flex-col items-center">
                             <AppIcon 
                                icon={app.icon} 
                                name="" 
                                color={app.color} 
                                size="md" 
                                onClick={() => {
                                    if(win.isMinimized) {
                                        setWindows(prev => prev.map(w => w.id === win.id ? {...w, isMinimized: false} : w));
                                        bringToFront(win.id);
                                    } else {
                                        bringToFront(win.id);
                                    }
                                }} 
                             />
                             {!win.isMinimized && (
                                <div className="absolute -bottom-2 w-1 h-1 bg-white/60 rounded-full shadow-sm"></div>
                             )}
                         </div>
                     )
                 })}
            </div>
        </div>
        
        {/* Dock Trigger Area for when hidden (Mobile style swipe up hint) */}
        {isAnyAppOpen && (
             <div className="absolute bottom-1 left-0 right-0 h-1 bg-gray-400/50 rounded-full mx-auto w-32 z-50 cursor-pointer hover:bg-white transition-colors" onClick={() => setWindows(prev => prev.map(w => ({...w, isMinimized: true})))} />
        )}
    </div>
  );
}
