import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Search, Sparkles, AlertCircle, Home, Globe } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface BrowserProps {
    defaultUrl?: string;
}

export const Browser: React.FC<BrowserProps> = ({ defaultUrl }) => {
  // If a defaultUrl is provided (like Weather or Maps), start there. 
  // Otherwise start with an empty URL (Start Page).
  const [url, setUrl] = useState(defaultUrl || '');
  const [inputUrl, setInputUrl] = useState(defaultUrl || '');
  const [iframeUrl, setIframeUrl] = useState<string | null>(defaultUrl || null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [aiContent, setAiContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNavigate = async (e: React.FormEvent) => {
    e.preventDefault();
    go(inputUrl);
  };

  const go = async (targetInput: string) => {
    setIsLoading(true);
    setAiContent(null);
    setError(null);
    
    let target = targetInput.trim();

    // If empty, go home (Start Page)
    if (!target) {
        setIframeUrl(null);
        setUrl('');
        setIsLoading(false);
        return;
    }

    // Simple URL detection
    const isUrl = (target.includes('.') && !target.includes(' ')) || target.startsWith('http') || target.startsWith('localhost');
    
    if (isUrl) {
        if (!target.startsWith('http')) {
            target = 'https://' + target;
        }
        setIframeUrl(target);
        setUrl(target);
        setIsLoading(false);
    } else {
        // Search
        const apiKey = localStorage.getItem('gemini_api_key');

        if (apiKey) {
            try {
                const ai = new GoogleGenAI({ apiKey });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Provide a concise, helpful summary answer for this search query in plain text: "${target}". Keep it under 150 words.`,
                });
                
                if (response.text) {
                    setAiContent(response.text);
                    setUrl(`search://ai?q=${encodeURIComponent(target)}`);
                } else {
                    doWebSearch(target);
                }
            } catch (err) {
                console.error(err);
                doWebSearch(target);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Normal Search
            doWebSearch(target);
            setIsLoading(false);
        }
    }
  };

  const doWebSearch = (query: string) => {
      const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
      setIframeUrl(searchUrl);
      setUrl(searchUrl);
  };

  const goHome = () => {
      setIframeUrl(null);
      setUrl('');
      setInputUrl('');
      setAiContent(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Browser Toolbar */}
      <div className="h-14 border-b flex items-center px-3 gap-2 bg-gray-100/90 backdrop-blur-md text-gray-600 shadow-sm z-10 transition-colors">
        <div className="flex gap-2">
          <button onClick={goHome} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><Home size={18} /></button>
          <button onClick={() => setIsLoading(true)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><RotateCw size={18} className={isLoading ? 'animate-spin' : ''} /></button>
        </div>
        <form onSubmit={handleNavigate} className="flex-1">
            <div className={`w-full border shadow-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm focus-within:ring-2 ring-blue-500/50 transition-all ${iframeUrl ? 'bg-white' : 'bg-gray-200 border-transparent'}`}>
                {url.startsWith('https') ? <Lock size={12} className="text-green-600" /> : <Search size={12} className="text-gray-400" />}
                <input 
                    className="bg-transparent w-full outline-none text-gray-700"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Search or enter website..."
                    onFocus={(e) => e.target.select()}
                />
            </div>
        </form>
      </div>
      
      {/* Browser Content */}
      <div className="flex-1 bg-white relative w-full h-full overflow-hidden">
         {!iframeUrl && !aiContent ? (
             // START PAGE
             <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 pb-20">
                 <div className="mb-8 p-6 bg-white rounded-3xl shadow-lg border border-gray-100 flex items-center justify-center">
                    <Globe size={64} className="text-blue-500" />
                 </div>
                 <h1 className="text-4xl font-bold text-gray-800 mb-8 tracking-tight">NetSurf</h1>
                 
                 <div className="w-full max-w-md px-6">
                    <form onSubmit={(e) => { e.preventDefault(); go(inputUrl); }}>
                        <div className="relative group">
                            <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input 
                                className="w-full py-3.5 pl-12 pr-4 rounded-2xl border border-gray-200 shadow-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg"
                                placeholder="Search the web"
                                value={inputUrl}
                                onChange={(e) => setInputUrl(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </form>
                 </div>

                 <div className="flex gap-6 mt-12">
                     {[
                         {name: 'Google', url: 'google.com', color: 'bg-red-500'},
                         {name: 'Bing', url: 'bing.com', color: 'bg-blue-500'},
                         {name: 'Wiki', url: 'wikipedia.org', color: 'bg-gray-800'},
                         {name: 'News', url: 'cnn.com', color: 'bg-red-600'},
                     ].map(fav => (
                         <button 
                            key={fav.name}
                            onClick={() => { setInputUrl(fav.url); go(fav.url); }}
                            className="flex flex-col items-center gap-2 group"
                         >
                             <div className={`w-12 h-12 rounded-full ${fav.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                 {fav.name[0]}
                             </div>
                             <span className="text-xs text-gray-500 font-medium">{fav.name}</span>
                         </button>
                     ))}
                 </div>
             </div>
         ) : aiContent ? (
             <div className="w-full h-full p-8 overflow-y-auto bg-slate-50">
                 <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-6 text-blue-600 border-b pb-4">
                        <Sparkles size={24} />
                        <h2 className="font-bold text-xl">AI Summary</h2>
                    </div>
                    <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-line font-medium">
                        {aiContent}
                    </p>
                    <div className="mt-8 pt-6 border-t flex justify-between items-center">
                        <span className="text-xs text-gray-400">Generated by Gemini 2.5 Flash</span>
                        <button 
                            onClick={() => {
                                setAiContent(null);
                                doWebSearch(inputUrl);
                            }}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            View Web Results &rarr;
                        </button>
                    </div>
                 </div>
             </div>
         ) : (
            <>
                <iframe 
                    src={iframeUrl}
                    className="w-full h-full border-none bg-white"
                    title="browser-view"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                />
            </>
         )}
      </div>
    </div>
  );
};
