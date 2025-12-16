import React, { useState, useEffect } from 'react';
import { WALLPAPERS } from '../data';
import { WallPaper } from '../types';
import { Image, Monitor, Smartphone, Battery, Wifi, Key, Info } from 'lucide-react';

interface SettingsProps {
    currentWallpaperId: string;
    onSetWallpaper: (id: string) => void;
    isMobileMode: boolean;
    onToggleMobileMode: (enabled: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentWallpaperId, onSetWallpaper, isMobileMode, onToggleMobileMode }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key');
    if (key) setApiKey(key);
  }, []);

  const saveKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const removeKey = () => {
      localStorage.removeItem('gemini_api_key');
      setApiKey('');
  };

  return (
    <div className="w-full h-full flex bg-gray-50/90 text-gray-800">
        {/* Sidebar */}
        <div className="w-1/3 min-w-[150px] bg-white/50 border-r h-full flex flex-col backdrop-blur-sm">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold pl-2">Settings</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                <div className="flex items-center gap-3 p-2 bg-blue-500 text-white rounded-lg shadow-sm cursor-pointer">
                    <Monitor size={18} />
                    <span className="font-medium text-sm">General</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                     <div className="flex items-center gap-3 p-2 text-gray-400 cursor-not-allowed">
                        <Wifi size={18} />
                        <span className="font-medium text-sm">Wi-Fi</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-white/80">
            {/* Display/Mobile Mode */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-6">Display</h2>
                <div className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Mobile Mode</h3>
                            <p className="text-sm text-gray-500">Apps open in full screen, optimized for phones</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onToggleMobileMode(!isMobileMode)}
                        className={`w-14 h-8 rounded-full transition-colors relative ${isMobileMode ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${isMobileMode ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <h3 className="text-lg font-semibold mb-3">Wallpaper</h3>
                <div className="grid grid-cols-2 gap-4">
                    {WALLPAPERS.map((wp: WallPaper) => (
                        <div 
                            key={wp.id}
                            className={`group relative aspect-video rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all border-4 ${currentWallpaperId === wp.id ? 'border-blue-500' : 'border-transparent'}`}
                            onClick={() => onSetWallpaper(wp.id)}
                        >
                            <img src={wp.url} alt={wp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    ))}
                </div>
            </section>

            {/* AI Key Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    AI & Search
                </h2>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                    <div className="flex items-start gap-3">
                        <Info className="text-blue-500 shrink-0 mt-1" size={20} />
                        <p className="text-sm text-blue-800 leading-relaxed">
                            Browser search uses Bing by default. Add a Google Gemini API Key to enable AI summaries.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key (Optional)</label>
                        <input 
                            type="password" 
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={saveKey}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            {saved ? 'Saved!' : 'Save Key'}
                        </button>
                        {apiKey && (
                            <button 
                                onClick={removeKey}
                                className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-medium rounded-lg transition-colors"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    </div>
  );
};
