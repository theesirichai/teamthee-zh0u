export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
}

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: number; // timestamp in ms
  createdAt: number;
  updatedAt: number;
}
