// Trainer configuration
export interface Drill {
  id: string;
  name: string;
}

export interface Trainer {
  id: string;
  name: string;
  defaultMinDelay: number;
  defaultMaxDelay: number;
  drills: Drill[];
}

// Session configuration
export interface TrainingConfig {
  trainerId: string;
  prepInterval: number;
  numReps: number;
  selectedDrills: string[]; // drill IDs
  minDelay: number;
  maxDelay: number;
  playSoundCue: boolean;
  speakDrillName: boolean;
  visualFlashCue: boolean;
}

// Session data
export interface DrillRecord {
  repNumber: number;
  drillId: string;
  drillName: string;
  randomDelay: number; // in milliseconds
  timestamp: number; // Unix timestamp
}

export interface Session {
  id: string;
  trainerId: string;
  trainerName: string;
  startTime: number;
  endTime: number;
  config: TrainingConfig;
  drills: DrillRecord[];
}

export interface SessionStats {
  totalReps: number;
  averageDelay: number;
  fastestDelay: number;
  longestDelay: number;
  drillFrequency: Record<string, number>;
}

// App state
export type AppScreen = 'setup' | 'training' | 'results' | 'history';

export interface AppState {
  screen: AppScreen;
  config: TrainingConfig | null;
  currentSession: Session | null;
  sessions: Session[];
}
