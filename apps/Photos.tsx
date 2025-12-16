import React from 'react';
import { WALLPAPERS } from '../data';

export const PhotosApp: React.FC = () => {
    return (
        <div className="h-full bg-white flex flex-col">
            <div className="p-4 border-b flex justify-between items-end pb-2">
                <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
                <span className="text-gray-500 text-sm">{WALLPAPERS.length} Photos</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {WALLPAPERS.map(wp => (
                        <div key={wp.id} className="aspect-square relative group overflow-hidden bg-gray-200 cursor-pointer">
                            <img 
                                src={wp.url} 
                                alt={wp.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                    ))}
                    {/* Placeholder images to fill grid */}
                    {[1,2,3,4,5,6].map(i => (
                         <div key={i} className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300">
                             <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                         </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
