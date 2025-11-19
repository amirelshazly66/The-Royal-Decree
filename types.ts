export type Role = 'king' | 'queen';
export type TaskType = 'decree' | 'edict' | 'quest';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  assignedTo: Role | 'shared';
  dueDate: string; // ISO Date string
  completed: boolean;
  completedAt?: string; // ISO Date string
}

export interface DailyScore {
  date: string;
  king: number;
  queen: number;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
}

export interface AppState {
  tasks: Task[];
  coins: number;
  dailyScores: Record<string, DailyScore>;
}