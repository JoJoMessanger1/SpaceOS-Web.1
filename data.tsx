import { 
  Globe, Settings, ShoppingBag, Camera, 
  Calculator, Clock, FileText, Image, 
  Gamepad2, Terminal, CheckSquare, Key, 
  Ruler, Hourglass, Palette,
  Calendar, Brain, Music, Ghost,
  Mic2, HelpCircle, Code2, Keyboard
} from 'lucide-react';
import { AppConfig, WallPaper } from './types';

export const WALLPAPERS: WallPaper[] = [
  { id: '1', name: 'Big Sur', url: 'https://images.unsplash.com/photo-1621574539437-4b7b49b4b609?q=80&w=2664&auto=format&fit=crop' },
  { id: '2', name: 'Dark Valley', url: 'https://images.unsplash.com/photo-1504221502061-1d98a0d04b8c?q=80&w=2673&auto=format&fit=crop' },
  { id: '3', name: 'Liquid Colors', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
  { id: '4', name: 'Abstract Blue', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop' },
];

// System Apps (Pre-installed)
export const SYSTEM_APPS: AppConfig[] = [
  { id: 'browser', name: 'NetSurf', icon: Globe, color: 'bg-gradient-to-b from-blue-400 to-blue-600', component: 'Browser', isSystem: true, description: 'Browse the Web' },
  { id: 'settings', name: 'System', icon: Settings, color: 'bg-gradient-to-b from-gray-400 to-gray-600', component: 'Settings', isSystem: true, description: 'Settings' },
  { id: 'store', name: 'Store', icon: ShoppingBag, color: 'bg-gradient-to-b from-blue-500 to-blue-700', component: 'AppStore', isSystem: true, description: 'App Store' },
  { id: 'photos', name: 'Photos', icon: Image, color: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500', component: 'Photos', isSystem: true, description: 'Gallery' },
  { id: 'camera', name: 'Camera', icon: Camera, color: 'bg-gradient-to-b from-zinc-600 to-zinc-800', component: 'Camera', isSystem: true, description: 'Webcam' },
];

// App Store Apps (Installable)
export const STORE_APPS: AppConfig[] = [
  // Productivity & Dev
  { id: 'code', name: 'CodeStudio', icon: Code2, color: 'bg-gradient-to-br from-slate-700 to-slate-900', component: 'CodeStudio', description: 'HTML/CSS Editor', preferredWidth: 700, preferredHeight: 500 },
  { id: 'notes', name: 'Notes', icon: FileText, color: 'bg-gradient-to-b from-yellow-300 to-yellow-500', component: 'Notes', description: 'Notepad' },
  { id: 'todo', name: 'Tasks', icon: CheckSquare, color: 'bg-gradient-to-b from-blue-400 to-indigo-500', component: 'Todo', description: 'To-Do List' },
  { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'bg-gradient-to-b from-red-500 to-red-700', component: 'Calendar', description: 'Plan your days' },
  
  // Tools
  { id: 'calc', name: 'Calc', icon: Calculator, color: 'bg-gradient-to-b from-orange-400 to-orange-600', component: 'Calculator', description: 'Calculator', preferredWidth: 340, preferredHeight: 520 },
  { id: 'clock', name: 'Clock', icon: Clock, color: 'bg-gradient-to-b from-gray-800 to-black', component: 'Clock', description: 'World Clock' },
  { id: 'passgen', name: 'Secrets', icon: Key, color: 'bg-gradient-to-b from-emerald-500 to-emerald-700', component: 'PasswordGen', description: 'Password Gen' },
  { id: 'convert', name: 'Units', icon: Ruler, color: 'bg-gradient-to-b from-teal-400 to-teal-600', component: 'Converter', description: 'Converter' },
  { id: 'stopwatch', name: 'Stopwatch', icon: Hourglass, color: 'bg-gradient-to-b from-orange-500 to-red-600', component: 'Stopwatch', description: 'Timer' },
  { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'bg-black border border-gray-700', component: 'Terminal', description: 'CLI' },
  
  // Creative & Games
  { id: 'paint', name: 'Paint', icon: Palette, color: 'bg-gradient-to-br from-indigo-400 to-cyan-400', component: 'Paint', description: 'Drawing Tool' },
  { id: 'beats', name: 'Beats', icon: Mic2, color: 'bg-gradient-to-br from-rose-500 to-orange-500', component: 'Beats', description: 'Make Music', preferredWidth: 500, preferredHeight: 600 },
  { id: 'music', name: 'Music', icon: Music, color: 'bg-gradient-to-br from-pink-500 to-rose-600', component: 'Music', description: 'Listen to tunes', preferredWidth: 380, preferredHeight: 600 },
  { id: 'typemaster', name: 'TypeMaster', icon: Keyboard, color: 'bg-gradient-to-br from-cyan-500 to-blue-600', component: 'TypeMaster', description: 'Test WPM' },
  { id: 'quiz', name: 'Quiz', icon: HelpCircle, color: 'bg-gradient-to-b from-violet-500 to-purple-700', component: 'Quiz', description: 'Trivia Game', preferredWidth: 400, preferredHeight: 550 },
  { id: 'snake', name: 'Snake', icon: Ghost, color: 'bg-gradient-to-br from-green-500 to-emerald-700', component: 'Snake', description: 'Classic Game', preferredWidth: 400, preferredHeight: 500 },
  { id: 'tictactoe', name: 'TicTacToe', icon: Gamepad2, color: 'bg-gradient-to-br from-green-400 to-blue-500', component: 'TicTacToe', description: 'Game', preferredWidth: 400, preferredHeight: 500 },
  { id: 'memory', name: 'Memory', icon: Brain, color: 'bg-gradient-to-br from-purple-500 to-indigo-600', component: 'Memory', description: 'Brain Game' },
];
