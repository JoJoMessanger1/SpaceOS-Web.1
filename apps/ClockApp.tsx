import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export const ClockApp: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    { name: 'New York', offset: -4 },
    { name: 'London', offset: 1 },
    { name: 'Tokyo', offset: 9 },
    { name: 'Sydney', offset: 10 },
  ];

  const getCityTime = (offset: number) => {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const nd = new Date(utc + (3600000 * offset));
    return nd.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="h-full bg-black text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center flex-col">
            <div className="text-8xl font-thin tracking-wider">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-2xl text-gray-400 mt-2 font-light">
                {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
        </div>
        
        <div className="h-1/3 border-t border-gray-800 grid grid-cols-4 divide-x divide-gray-800">
             {cities.map(city => (
                 <div key={city.name} className="flex flex-col items-center justify-center hover:bg-gray-900 transition-colors">
                     <span className="text-gray-500 text-sm mb-1">{city.name}</span>
                     <span className="text-xl font-medium">{getCityTime(city.offset)}</span>
                 </div>
             ))}
        </div>
    </div>
  );
};
