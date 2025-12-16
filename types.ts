import { LucideIcon } from 'lucide-react';

export type AppComponentType = 
  | 'Browser' | 'Settings' | 'AppStore' | 'Calculator' | 'Notes' 
  | 'Camera' | 'Clock' | 'Photos' | 'TicTacToe' | 'Todo' 
  | 'Paint' | 'Converter' | 'Stopwatch' | 'PasswordGen' 
  | 'Terminal' | 'Calendar' | 'Memory' | 'Music' | 'Snake' 
  | 'Beats' | 'Quiz' | 'CodeStudio' | 'TypeMaster' | 'Placeholder';

export interface AppConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string; 
  component: AppComponentType;
  description?: string;
  isSystem?: boolean; 
  defaultUrl?: string; 
  // Window preferences
  preferredWidth?: number;
  preferredHeight?: number;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface WallPaper {
  id: string;
  url: string;
  name: string;
}
