import React, { useState, useEffect, useRef } from 'react';
import { Save, Trash2, Plus, RefreshCw, CheckCircle, Circle, RotateCcw, Copy, ChevronLeft, ChevronRight, Play, Pause, SkipBack, SkipForward, Music, PlayCircle, ListMusic, Volume2, Trophy, Code2, Play as PlayIcon, Keyboard } from 'lucide-react';

// --- CodeStudio (Web Editor) ---
export const CodeStudio = () => {
    const [html, setHtml] = useState('<h1>Hello World</h1>\n<p>Start coding...</p>');
    const [css, setCss] = useState('body { font-family: sans-serif; \n color: #333; \n padding: 20px; } \nh1 { color: #2563eb; }');
    const [srcDoc, setSrcDoc] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
                <html>
                <style>${css}</style>
                <body>${html}</body>
                </html>
            `);
        }, 500);
        return () => clearTimeout(timeout);
    }, [html, css]);

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] text-gray-300">
            <div className="flex-1 flex overflow-hidden">
                {/* Editors */}
                <div className="w-1/2 flex flex-col border-r border-[#333]">
                    <div className="h-1/2 flex flex-col border-b border-[#333]">
                        <div className="bg-[#252526] px-4 py-1 text-xs font-bold text-blue-400 flex justify-between">
                            <span>HTML</span>
                        </div>
                        <textarea 
                            className="flex-1 bg-[#1e1e1e] p-4 outline-none font-mono text-sm resize-none"
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            spellCheck={false}
                        />
                    </div>
                    <div className="h-1/2 flex flex-col">
                        <div className="bg-[#252526] px-4 py-1 text-xs font-bold text-green-400 flex justify-between">
                            <span>CSS</span>
                        </div>
                        <textarea 
                            className="flex-1 bg-[#1e1e1e] p-4 outline-none font-mono text-sm resize-none"
                            value={css}
                            onChange={(e) => setCss(e.target.value)}
                            spellCheck={false}
                        />
                    </div>
                </div>
                {/* Preview */}
                <div className="w-1/2 bg-white">
                    <iframe 
                        srcDoc={srcDoc}
                        title="preview"
                        sandbox="allow-scripts"
                        className="w-full h-full border-none"
                    />
                </div>
            </div>
        </div>
    );
};

// --- TypeMaster (WPM Game) ---
export const TypeMaster = () => {
    const sentences = [
        "The quick brown fox jumps over the lazy dog.",
        "To be or not to be, that is the question.",
        "All that glitters is not gold.",
        "A journey of a thousand miles begins with a single step.",
        "Coding is the art of telling a computer what to do."
    ];
    
    const [text, setText] = useState('');
    const [target, setTarget] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        restart();
    }, []);

    const restart = () => {
        const rand = sentences[Math.floor(Math.random() * sentences.length)];
        setTarget(rand);
        setText('');
        setStartTime(null);
        setWpm(0);
        setFinished(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!startTime) setStartTime(Date.now());
        
        setText(val);

        if (val === target) {
            setFinished(true);
            const durationInMinutes = (Date.now() - (startTime || Date.now())) / 60000;
            const wordCount = target.split(' ').length;
            setWpm(Math.round(wordCount / durationInMinutes));
        }
    };

    return (
        <div className="h-full bg-slate-100 flex flex-col items-center justify-center p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
                    <Keyboard className="text-blue-500" /> TypeMaster
                </h2>
                
                {finished ? (
                    <div className="animate-in zoom-in">
                        <div className="text-6xl font-black text-blue-600 mb-2">{wpm}</div>
                        <div className="text-gray-500 font-medium mb-6">Words Per Minute</div>
                        <button onClick={restart} className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-slate-800">
                            Next Sentence
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-lg font-medium text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200 select-none">
                            {target.split('').map((char, i) => {
                                let color = 'text-gray-400';
                                if (i < text.length) {
                                    color = text[i] === char ? 'text-green-600' : 'text-red-500 bg-red-100';
                                }
                                return <span key={i} className={color}>{char}</span>;
                            })}
                        </div>
                        <input 
                            className="w-full text-xl p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-center font-medium"
                            value={text}
                            onChange={handleChange}
                            placeholder="Start typing..."
                            autoFocus
                        />
                    </>
                )}
            </div>
        </div>
    );
};

// --- Beats App (Synthesizer) ---
export const BeatsApp = () => {
    const [activePad, setActivePad] = useState<number | null>(null);
    
    const playSound = (freq: number, type: 'sine' | 'square' | 'triangle', index: number) => {
        setActivePad(index);
        setTimeout(() => setActivePad(null), 150);

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    };

    const pads = [
        { label: 'KICK', freq: 150, type: 'square', color: 'bg-red-500' },
        { label: 'SNARE', freq: 400, type: 'triangle', color: 'bg-orange-500' },
        { label: 'HI-HAT', freq: 800, type: 'square', color: 'bg-yellow-500' },
        { label: 'BASS', freq: 110, type: 'sine', color: 'bg-purple-600' },
        { label: 'LEAD', freq: 660, type: 'triangle', color: 'bg-blue-500' },
        { label: 'CHORD', freq: 550, type: 'sine', color: 'bg-teal-500' },
        { label: 'FX 1', freq: 1200, type: 'square', color: 'bg-pink-500' },
        { label: 'FX 2', freq: 150, type: 'sawtooth', color: 'bg-green-500' },
        { label: 'LOW', freq: 60, type: 'sine', color: 'bg-indigo-600' },
    ];

    return (
        <div className="h-full bg-slate-900 p-6 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-8 text-white">
                <Volume2 className="text-teal-400" />
                <h2 className="text-2xl font-bold tracking-widest">BEATS MAKER</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                {pads.map((pad, idx) => (
                    <button
                        key={idx}
                        onMouseDown={() => playSound(pad.freq, pad.type as any, idx)}
                        className={`aspect-square rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-all transform active:scale-95 duration-75
                            ${pad.color}
                            ${activePad === idx ? 'brightness-125 scale-95 shadow-inner' : 'hover:brightness-110'}
                        `}
                    >
                        {pad.label}
                    </button>
                ))}
            </div>
            <p className="mt-8 text-slate-500 text-sm">Click pads to play sounds</p>
        </div>
    );
};

// --- Quiz App ---
export const QuizApp = () => {
    const questions = [
        { q: "What is the capital of France?", options: ["Berlin", "London", "Paris", "Rome"], ans: 2 },
        { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], ans: 1 },
        { q: "What is 2 + 2 * 2?", options: ["6", "8", "4", "12"], ans: 0 },
        { q: "Who wrote 'Romeo and Juliet'?", options: ["Dickens", "Hemingway", "Shakespeare", "Orwell"], ans: 2 },
        { q: "What is the chemical symbol for Gold?", options: ["Ag", "Fe", "Au", "Pb"], ans: 2 }
    ];

    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

    const handleAnswer = (idx: number) => {
        setSelectedOpt(idx);
        setTimeout(() => {
            if (idx === questions[currentQ].ans) setScore(s => s + 1);
            
            if (currentQ < questions.length - 1) {
                setCurrentQ(c => c + 1);
                setSelectedOpt(null);
            } else {
                setShowResult(true);
            }
        }, 800);
    };

    const restart = () => {
        setScore(0);
        setCurrentQ(0);
        setShowResult(false);
        setSelectedOpt(null);
    };

    return (
        <div className="h-full bg-gradient-to-br from-violet-600 to-indigo-700 text-white flex flex-col items-center justify-center p-8">
            {showResult ? (
                <div className="text-center animate-in zoom-in">
                    <Trophy size={64} className="text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                    <p className="text-xl text-violet-200 mb-8">You scored {score} out of {questions.length}</p>
                    <button onClick={restart} className="bg-white text-violet-700 px-8 py-3 rounded-full font-bold hover:bg-violet-50 transition-colors">
                        Play Again
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-md">
                    <div className="flex justify-between text-sm text-violet-200 mb-8 uppercase tracking-wider font-bold">
                        <span>Question {currentQ + 1}/{questions.length}</span>
                        <span>Score: {score}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-8 leading-snug">{questions[currentQ].q}</h2>
                    
                    <div className="space-y-3">
                        {questions[currentQ].options.map((opt, idx) => {
                            let bgClass = "bg-white/10 hover:bg-white/20";
                            if (selectedOpt !== null) {
                                if (idx === questions[currentQ].ans) bgClass = "bg-green-500";
                                else if (idx === selectedOpt) bgClass = "bg-red-500";
                                else bgClass = "bg-white/5 opacity-50";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => selectedOpt === null && handleAnswer(idx)}
                                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${bgClass}`}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Todo App ---
export const TodoApp = () => {
    const [tasks, setTasks] = useState<{id: number, text: string, done: boolean}[]>(() => {
        const saved = localStorage.getItem('os-tasks');
        return saved ? JSON.parse(saved) : [{id: 1, text: 'Download more apps', done: false}];
    });
    const [input, setInput] = useState('');

    useEffect(() => {
        localStorage.setItem('os-tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if(!input.trim()) return;
        setTasks([...tasks, {id: Date.now(), text: input, done: false}]);
        setInput('');
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <h1 className="text-2xl font-bold mb-1">Tasks</h1>
                <p className="text-blue-100 text-sm">{tasks.filter(t => !t.done).length} pending tasks</p>
            </div>
            
            <form onSubmit={addTask} className="p-4 border-b bg-gray-50 flex gap-2">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 ring-blue-500 shadow-sm"
                    placeholder="Add a new task..."
                />
                <button type="submit" className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 shadow-sm font-medium">Add</button>
            </form>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {tasks.length === 0 && <div className="text-center text-gray-400 mt-10">No tasks yet. Enjoy your day!</div>}
                {tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                        <button onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, done: !t.done} : t))} className="shrink-0">
                            {task.done ? <CheckCircle className="text-green-500 fill-green-100" size={22} /> : <Circle className="text-gray-300 hover:text-blue-500 transition-colors" size={22} />}
                        </button>
                        <span className={`flex-1 font-medium ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.text}</span>
                        <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Notes App (Improved Design) ---
export const NotesApp: React.FC = () => {
    const [text, setText] = useState(() => localStorage.getItem('os-notes') || '');
    
    useEffect(() => {
        localStorage.setItem('os-notes', text);
    }, [text]);

    return (
        <div className="h-full flex flex-col bg-[#fef9c3]">
             {/* Yellow Pad Header */}
            <div className="bg-[#fde047] p-4 border-b border-[#eab308] shadow-sm flex justify-between items-center">
                <h1 className="text-yellow-900 font-bold text-lg tracking-wide">Notepad</h1>
                <div className="text-xs text-yellow-800 font-medium">{text.length} chars</div>
            </div>
            
            {/* Lined Paper Effect */}
            <div className="flex-1 relative">
                <div className="absolute left-12 top-0 bottom-0 w-px bg-red-300/50 z-10 pointer-events-none"></div>
                <textarea 
                    className="w-full h-full bg-transparent p-8 pl-16 text-gray-800 text-lg leading-[3rem] outline-none resize-none"
                    style={{
                        backgroundImage: 'linear-gradient(transparent 95%, #e5e7eb 95%)',
                        backgroundSize: '100% 3rem',
                        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
                    }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write something..."
                />
            </div>
        </div>
    );
};

// --- Music Player (New) ---
export const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackIndex, setTrackIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const tracks = [
        { title: "Midnight City", artist: "M83", cover: "bg-purple-500" },
        { title: "Get Lucky", artist: "Daft Punk", cover: "bg-yellow-500" },
        { title: "The Less I Know", artist: "Tame Impala", cover: "bg-red-500" },
        { title: "Blinding Lights", artist: "The Weeknd", cover: "bg-blue-600" }
    ];

    useEffect(() => {
        let timer: any;
        if (isPlaying) {
            timer = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        nextTrack();
                        return 0;
                    }
                    return p + 0.5;
                });
            }, 100);
        }
        return () => clearInterval(timer);
    }, [isPlaying]);

    const nextTrack = () => {
        setTrackIndex((trackIndex + 1) % tracks.length);
        setProgress(0);
    };

    const prevTrack = () => {
        setTrackIndex((trackIndex - 1 + tracks.length) % tracks.length);
        setProgress(0);
    };

    const currentTrack = tracks[trackIndex];

    return (
        <div className="h-full bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <div className="p-4 flex justify-between items-center text-gray-400">
                <ChevronLeft />
                <span className="text-xs font-bold tracking-widest uppercase">Now Playing</span>
                <ListMusic />
            </div>

            {/* Album Art */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className={`w-64 h-64 ${currentTrack.cover} rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden group`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <Music size={64} className="text-white/50" />
                    
                    {/* Visualizer simulation */}
                    {isPlaying && (
                        <div className="absolute bottom-4 right-4 flex gap-1 items-end h-8">
                            <div className="w-1 bg-white/80 animate-[bounce_1s_infinite] h-4"></div>
                            <div className="w-1 bg-white/80 animate-[bounce_1.2s_infinite] h-6"></div>
                            <div className="w-1 bg-white/80 animate-[bounce_0.8s_infinite] h-3"></div>
                            <div className="w-1 bg-white/80 animate-[bounce_1.1s_infinite] h-5"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-t-3xl p-8 pb-12">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-1">{currentTrack.title}</h2>
                    <p className="text-gray-400">{currentTrack.artist}</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 h-1.5 rounded-full mb-8 overflow-hidden">
                    <div className="bg-white h-full rounded-full transition-all duration-100" style={{width: `${progress}%`}}></div>
                </div>

                <div className="flex justify-between items-center px-4">
                    <button onClick={prevTrack} className="text-gray-400 hover:text-white transition-colors"><SkipBack size={32}/></button>
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
                    >
                        {isPlaying ? <Pause size={32} fill="black" /> : <PlayIcon size={32} fill="black" className="ml-1" />}
                    </button>
                    <button onClick={nextTrack} className="text-gray-400 hover:text-white transition-colors"><SkipForward size={32}/></button>
                </div>
            </div>
        </div>
    );
};

// --- Snake Game (New) ---
export const SnakeGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    
    // Game State refs to avoid closure staleness in interval
    const snakeRef = useRef([{x: 10, y: 10}]);
    const foodRef = useRef({x: 15, y: 15});
    const dirRef = useRef({x: 1, y: 0}); // Moving right
    const gameLoopRef = useRef<any>(null);

    const gridSize = 20;
    const tileCount = 20; // 400x400 canvas assumed roughly

    const resetGame = () => {
        snakeRef.current = [{x: 10, y: 10}];
        foodRef.current = {x: 15, y: 15};
        dirRef.current = {x: 1, y: 0};
        setScore(0);
        setGameOver(false);
        if(gameLoopRef.current) clearInterval(gameLoopRef.current);
        startGame();
    };

    const startGame = () => {
        gameLoopRef.current = setInterval(() => {
            update();
        }, 100);
    };

    const update = () => {
        const snake = snakeRef.current;
        const head = { x: snake[0].x + dirRef.current.x, y: snake[0].y + dirRef.current.y };

        // Wall Collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            setGameOver(true);
            clearInterval(gameLoopRef.current);
            return;
        }

        // Self Collision
        for (let part of snake) {
            if (part.x === head.x && part.y === head.y) {
                setGameOver(true);
                clearInterval(gameLoopRef.current);
                return;
            }
        }

        snake.unshift(head);

        // Food Collision
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
            setScore(s => s + 1);
            foodRef.current = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } else {
            snake.pop();
        }

        draw();
    };

    const draw = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.fillStyle = '#111827'; // gray-900
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Food
        ctx.fillStyle = '#ef4444'; // red-500
        ctx.fillRect(foodRef.current.x * gridSize, foodRef.current.y * gridSize, gridSize - 2, gridSize - 2);

        // Snake
        ctx.fillStyle = '#22c55e'; // green-500
        snakeRef.current.forEach((part, index) => {
            if(index === 0) ctx.fillStyle = '#4ade80'; // lighter head
            else ctx.fillStyle = '#22c55e';
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
        });
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            switch(e.key) {
                case 'ArrowUp': if(dirRef.current.y !== 1) dirRef.current = {x: 0, y: -1}; break;
                case 'ArrowDown': if(dirRef.current.y !== -1) dirRef.current = {x: 0, y: 1}; break;
                case 'ArrowLeft': if(dirRef.current.x !== 1) dirRef.current = {x: -1, y: 0}; break;
                case 'ArrowRight': if(dirRef.current.x !== -1) dirRef.current = {x: 1, y: 0}; break;
            }
        };
        window.addEventListener('keydown', handleKey);
        resetGame();
        return () => {
            window.removeEventListener('keydown', handleKey);
            clearInterval(gameLoopRef.current);
        };
    }, []);

    return (
        <div className="h-full bg-gray-800 flex flex-col items-center justify-center p-4">
            <div className="flex justify-between w-[400px] mb-4 text-white font-mono">
                <span className="text-xl font-bold">SNAKE</span>
                <span className="text-xl">Score: {score}</span>
            </div>
            
            <div className="relative border-4 border-gray-600 rounded-lg overflow-hidden">
                <canvas 
                    ref={canvasRef} 
                    width={400} 
                    height={400} 
                    className="block bg-gray-900"
                />
                {gameOver && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                        <h2 className="text-3xl font-bold mb-4 text-red-500">GAME OVER</h2>
                        <button 
                            onClick={resetGame}
                            className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-full font-bold transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
            <p className="text-gray-500 mt-4 text-sm font-mono">Use Arrow Keys to move</p>
        </div>
    );
};

// --- Tic Tac Toe (Improved) ---
export const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    
    const calculateWinner = (squares: any[]) => {
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
        }
        return null;
    };

    const handleClick = (i: number) => {
        if (calculateWinner(board) || board[i]) return;
        const nextBoard = board.slice();
        nextBoard[i] = xIsNext ? 'X' : 'O';
        setBoard(nextBoard);
        setXIsNext(!xIsNext);
    };

    const winner = calculateWinner(board);
    const isDraw = !winner && board.every(Boolean);
    const status = winner ? `Winner: ${winner}` : isDraw ? "It's a Draw!" : `Player: ${xIsNext ? 'X' : 'O'}`;

    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-800">
            <div className="mb-6 text-3xl font-bold tracking-tight text-blue-600">{status}</div>
            <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-2xl shadow-xl">
                {board.map((val, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleClick(i)}
                        className={`w-24 h-24 text-6xl font-bold rounded-xl transition-all duration-200 flex items-center justify-center
                            ${!val ? 'bg-gray-100 hover:bg-gray-200' : ''}
                            ${val === 'X' ? 'bg-blue-50 text-blue-500' : ''}
                            ${val === 'O' ? 'bg-rose-50 text-rose-500' : ''}
                        `}
                    >
                        {val}
                    </button>
                ))}
            </div>
            <button 
                onClick={() => setBoard(Array(9).fill(null))} 
                className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-transform hover:scale-105 shadow-lg"
            >
                Restart Game
            </button>
        </div>
    );
};

// --- Paint ---
export const PaintApp = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState('#000000');
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.parentElement?.clientWidth || 600;
            canvas.height = canvas.parentElement?.clientHeight || 400;
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0,0, canvas.width, canvas.height);
            }
        }
    }, []);

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, lineWidth, 0, Math.PI * 2);
        ctx.fill();
    };

    return (
        <div className="h-full flex flex-col bg-gray-100">
            <div className="p-2 bg-white border-b flex gap-4 items-center justify-center shadow-sm">
                <div className="flex gap-2">
                    {['#000000', '#ef4444', '#22c55e', '#3b82f6', '#eab308', '#ffffff'].map(c => (
                        <button 
                            key={c} 
                            onClick={() => setColor(c)}
                            className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-gray-900 scale-110' : 'border-gray-200'}`}
                            style={{backgroundColor: c}}
                        />
                    ))}
                </div>
                
                <div className="h-8 w-px bg-gray-300"></div>
                
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">Size</span>
                    <input 
                        type="range" 
                        min="2" 
                        max="20" 
                        value={lineWidth} 
                        onChange={(e) => setLineWidth(Number(e.target.value))} 
                        className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="h-8 w-px bg-gray-300"></div>

                <button onClick={() => {
                     const ctx = canvasRef.current?.getContext('2d');
                     if(ctx && canvasRef.current) ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);
                }} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={20}/></button>
            </div>
            <div className="flex-1 overflow-hidden relative cursor-crosshair">
                <canvas 
                    ref={canvasRef}
                    onMouseDown={() => setIsDrawing(true)}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseMove={draw}
                    onMouseLeave={() => setIsDrawing(false)}
                />
            </div>
        </div>
    );
};

// --- Password Generator ---
export const PasswordGen = () => {
    const [pass, setPass] = useState('');
    const [len, setLen] = useState(12);

    const generate = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let res = '';
        for(let i=0; i<len; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
        setPass(res);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-800 text-white p-8">
            <div className="w-full max-w-md bg-slate-700 p-6 rounded-2xl shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-center">Password Generator</h2>
                <div className="bg-slate-900 p-4 rounded-xl mb-4 font-mono text-lg break-all text-center flex items-center justify-between">
                    <span>{pass || 'Click Generate'}</span>
                    <button onClick={() => navigator.clipboard.writeText(pass)} className="ml-2 hover:text-green-400"><Copy size={16}/></button>
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <span>Length: {len}</span>
                    <input type="range" min="8" max="32" value={len} onChange={e=>setLen(Number(e.target.value))} className="flex-1" />
                </div>
                <button onClick={generate} className="w-full py-3 bg-emerald-500 rounded-xl font-bold hover:bg-emerald-400 transition-colors">Generate</button>
            </div>
        </div>
    );
};

// --- Unit Converter ---
export const Converter = () => {
    const [val, setVal] = useState(0);
    const [type, setType] = useState('km-mile');

    const result = () => {
        if(type === 'km-mile') return (val * 0.621371).toFixed(2) + ' miles';
        if(type === 'mile-km') return (val / 0.621371).toFixed(2) + ' km';
        if(type === 'c-f') return ((val * 9/5) + 32).toFixed(1) + ' °F';
        if(type === 'f-c') return ((val - 32) * 5/9).toFixed(1) + ' °C';
        return '';
    };

    return (
        <div className="h-full bg-teal-50 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-teal-800">Converter</h2>
                <input type="number" value={val} onChange={e => setVal(Number(e.target.value))} className="w-full p-3 border rounded-lg mb-4 text-xl" />
                <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 border rounded-lg mb-6 bg-gray-50">
                    <option value="km-mile">Kilometers to Miles</option>
                    <option value="mile-km">Miles to Kilometers</option>
                    <option value="c-f">Celsius to Fahrenheit</option>
                    <option value="f-c">Fahrenheit to Celsius</option>
                </select>
                <div className="text-center p-4 bg-teal-100 rounded-xl text-2xl font-bold text-teal-900">
                    {result()}
                </div>
            </div>
        </div>
    );
};

// --- Stopwatch ---
export const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        let int: number;
        if(running) {
            int = window.setInterval(() => setTime(t => t+10), 10);
        }
        return () => clearInterval(int);
    }, [running]);

    return (
        <div className="h-full bg-gray-900 text-white flex flex-col items-center justify-center">
            <div className="text-6xl font-mono font-light tabular-nums mb-12">
                {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
                {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
                <span className="text-gray-500">{("0" + ((time / 10) % 100)).slice(-2)}</span>
            </div>
            <div className="flex gap-4">
                <button onClick={() => setRunning(!running)} className={`w-20 h-20 rounded-full font-bold ${running ? 'bg-red-900 text-red-400' : 'bg-green-900 text-green-400'}`}>
                    {running ? 'Stop' : 'Start'}
                </button>
                <button onClick={() => {setRunning(false); setTime(0)}} className="w-20 h-20 rounded-full bg-gray-800 text-gray-300 font-bold">
                    Reset
                </button>
            </div>
        </div>
    );
};

// --- Terminal Mock ---
export const TerminalApp = () => {
    const [lines, setLines] = useState(['Welcome to WebOS v1.0', 'Type "help" for commands.']);
    const [input, setInput] = useState('');
    const [isMatrix, setIsMatrix] = useState(false);
    const matrixCanvasRef = useRef<HTMLCanvasElement>(null);

    // Matrix Effect
    useEffect(() => {
        if(!isMatrix || !matrixCanvasRef.current) return;
        
        const canvas = matrixCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        canvas.width = canvas.parentElement?.clientWidth || 600;
        canvas.height = canvas.parentElement?.clientHeight || 400;

        const cols = Math.floor(canvas.width / 20) + 1;
        const ypos = Array(cols).fill(0);

        const matrix = () => {
            ctx.fillStyle = '#0001';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0f0';
            ctx.font = '15pt monospace';

            ypos.forEach((y, ind) => {
                const text = String.fromCharCode(Math.random() * 128);
                const x = ind * 20;
                ctx.fillText(text, x, y);
                if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
                else ypos[ind] = y + 20;
            });
        };

        const interval = setInterval(matrix, 50);
        return () => clearInterval(interval);
    }, [isMatrix]);

    const handleKey = (e: React.KeyboardEvent) => {
        if(e.key === 'Enter') {
            const cmd = input.toLowerCase().trim();
            if (cmd === 'matrix') {
                setIsMatrix(true);
                setInput('');
                return;
            }

            const newLines = [...lines, `> ${input}`];
            if(cmd === 'help') newLines.push('Available commands: help, date, clear, echo [text], whoami, matrix');
            else if(cmd === 'date') newLines.push(new Date().toString());
            else if(cmd === 'clear') { setLines([]); setInput(''); return; }
            else if(cmd === 'whoami') newLines.push('guest_user');
            else if(cmd.startsWith('echo ')) newLines.push(cmd.substring(5));
            else newLines.push(`Command not found: ${cmd}`);
            
            setLines(newLines);
            setInput('');
        }
    };

    if (isMatrix) {
        return (
            <div className="h-full bg-black relative overflow-hidden" onClick={() => setIsMatrix(false)}>
                <canvas ref={matrixCanvasRef} className="absolute inset-0 z-0" />
                <div className="absolute top-4 left-4 z-10 bg-black/50 text-green-500 p-2 border border-green-500 rounded font-mono cursor-pointer">
                    Click to exit Matrix
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-black p-4 font-mono text-green-400 text-sm overflow-auto" onClick={() => document.getElementById('term-input')?.focus()}>
            {lines.map((l, i) => <div key={i}>{l}</div>)}
            <div className="flex">
                <span className="mr-2">{'>'}</span>
                <input 
                    id="term-input"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    className="bg-transparent outline-none flex-1 caret-green-400"
                    autoFocus
                />
            </div>
        </div>
    );
};

// --- Calendar ---
export const CalendarApp = () => {
    const [date, setDate] = useState(new Date());

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const prevMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1));
    const nextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1));

    return (
        <div className="h-full bg-white flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{monthNames[date.getMonth()]} {date.getFullYear()}</h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold text-gray-500 uppercase text-xs">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-2 flex-1">
                {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                {Array(daysInMonth).fill(null).map((_, i) => {
                    const d = i + 1;
                    const isToday = d === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
                    // Add random fake events to populate calendar
                    const hasEvent = (d % 3 === 0) || (d % 7 === 0);
                    
                    return (
                        <div key={d} className={`rounded-xl border flex flex-col items-center justify-center font-medium relative ${isToday ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}>
                            {d}
                            {hasEvent && !isToday && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1"></div>}
                            {hasEvent && isToday && <div className="w-1.5 h-1.5 bg-white/50 rounded-full mt-1"></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Memory Game ---
export const MemoryGame = () => {
    const [cards, setCards] = useState<{id: number, val: string, flipped: boolean, matched: boolean}[]>([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState<any>(null);
    const [choiceTwo, setChoiceTwo] = useState<any>(null);
    const [disabled, setDisabled] = useState(false);

    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

    const shuffleCards = () => {
        const shuffled = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map(card => ({ id: Math.random(), val: card, flipped: false, matched: false }));
        setChoiceOne(null);
        setChoiceTwo(null);
        setCards(shuffled);
        setTurns(0);
    };

    useEffect(() => {
        shuffleCards();
    }, []);

    const handleChoice = (card: any) => {
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    };

    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true);
            if (choiceOne.val === choiceTwo.val) {
                setCards(prev => prev.map(c => c.val === choiceOne.val ? {...c, matched: true} : c));
                resetTurn();
            } else {
                setTimeout(() => resetTurn(), 1000);
            }
        }
    }, [choiceOne, choiceTwo]);

    const resetTurn = () => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setTurns(prev => prev + 1);
        setDisabled(false);
    };

    return (
        <div className="h-full flex flex-col items-center p-6 bg-indigo-50">
            <div className="flex justify-between w-full max-w-lg mb-4 items-center">
                <h1 className="text-2xl font-bold text-indigo-900">Memory</h1>
                <div className="flex gap-4 items-center">
                    <span>Turns: {turns}</span>
                    <button onClick={shuffleCards} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"><RotateCcw size={16}/></button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 w-full max-w-lg flex-1">
                {cards.map(card => (
                    <div 
                        key={card.id} 
                        className={`relative aspect-square cursor-pointer transition-transform duration-500 transform-style-3d ${card.flipped || card.matched || card === choiceOne || card === choiceTwo ? 'rotate-y-180' : ''}`}
                        onClick={() => !disabled && !card.matched && card !== choiceOne && handleChoice(card)}
                    >
                         {/* Front (Hidden) */}
                        {!(card.flipped || card.matched || card === choiceOne || card === choiceTwo) ? (
                            <div className="absolute inset-0 bg-indigo-500 rounded-xl shadow-md flex items-center justify-center text-white font-bold text-2xl">
                                ?
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-white rounded-xl shadow-md border-2 border-indigo-200 flex items-center justify-center text-4xl">
                                {card.val}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};