import React, { useState } from 'react';
import { Download, Check, Loader2, Search } from 'lucide-react';
import { STORE_APPS } from '../data';
import { AppConfig } from '../types';

interface AppStoreProps {
  installedAppIds: string[];
  onInstall: (appId: string) => void;
}

export const AppStore: React.FC<AppStoreProps> = ({ installedAppIds, onInstall }) => {
  const [installing, setInstalling] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInstall = (appId: string) => {
    setInstalling(appId);
    // Simulate network delay 2-5 seconds (user asked for within 10s)
    setTimeout(() => {
      onInstall(appId);
      setInstalling(null);
    }, 2500);
  };

  const filteredApps = STORE_APPS.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (app.description && app.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col">
        {/* Header */}
        <div className="p-6 pb-2 border-b bg-white sticky top-0 z-10">
            <h1 className="text-3xl font-bold mb-4 tracking-tight">App Store</h1>
            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search Apps, Games, and more..." 
                    className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Hero Feature Card (Fake) */}
                <div className="col-span-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-6 shadow-lg">
                    <p className="text-blue-100 font-semibold mb-2">FEATURED</p>
                    <h2 className="text-3xl font-bold mb-2">Essential Apps Collection</h2>
                    <p className="opacity-90 max-w-md">Upgrade your OS experience with these must-have applications designed for productivity and creativity.</p>
                </div>

                {filteredApps.map((app: AppConfig) => {
                    const isInstalled = installedAppIds.includes(app.id);
                    const isInstallingThis = installing === app.id;
                    const Icon = app.icon;

                    return (
                        <div key={app.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`w-16 h-16 ${app.color} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                                <Icon className="text-white w-8 h-8" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">{app.name}</h3>
                                <p className="text-xs text-gray-500 truncate">{app.description}</p>
                            </div>
                            <button 
                                onClick={() => !isInstalled && !isInstallingThis && handleInstall(app.id)}
                                disabled={isInstalled || isInstallingThis}
                                className={`px-5 py-1.5 rounded-full font-bold text-sm transition-all duration-300 min-w-[90px] flex items-center justify-center
                                    ${isInstalled 
                                        ? 'bg-gray-100 text-gray-400 cursor-default' 
                                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200 active:scale-95'
                                    }
                                `}
                            >
                                {isInstallingThis ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                ) : isInstalled ? (
                                    "OPEN"
                                ) : (
                                    "GET"
                                )}
                            </button>
                        </div>
                    );
                })}

                {filteredApps.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        No apps found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};