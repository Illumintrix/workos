// AI Work Intelligence OS — Data Models & Types

export type TaskStatus = 'to_do' | 'in_progress' | 'hold' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';
export type EventType = 'task' | 'note' | 'decision' | 'reflection';
export type AIConfidence = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null; // ISO date string
  projectId: string | null;
  tags: string[];
  linkedTaskIds?: string[];
  linkedNoteIds?: string[];
  linkedDecisionIds?: string[];
  sourceMessageId: string | null;
  aiConfidence: AIConfidence;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  projectId: string | null;
  tags: string[];
  linkedTaskIds?: string[];
  linkedNoteIds?: string[];
  linkedDecisionIds?: string[];
  sourceMessageId: string | null;
  aiConfidence: AIConfidence;
  createdAt: string;
  updatedAt: string;
}

export interface Decision {
  id: string;
  title: string;
  reasoning: string;
  alternatives: string[];
  tradeoffs: string;
  risks: string;
  projectId: string | null;
  tags: string[];
  linkedTaskIds?: string[];
  linkedNoteIds?: string[];
  linkedDecisionIds?: string[];
  sourceMessageId: string | null;
  aiConfidence: AIConfidence;
  createdAt: string;
  updatedAt: string;
}

export interface Reflection {
  id: string;
  type: 'weekly' | 'monthly' | 'manual';
  weekLabel?: string;
  monthLabel?: string;
  summary: string;
  wins: string[];
  challenges: string[];
  learnings: string[];
  improvements: string[];
  moodScore: number | null; // 1-10
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  type: EventType;
  referenceId: string; // ID of the related task/note/decision/reflection
  summary: string;
  timestamp: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  impactDescription: string;
  timeframe: string;
  relatedTaskIds: string[];
  relatedDecisionIds: string[];
  resumeBullet: string;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  extractions?: AIExtractions;
  conversationId?: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface AIExtractions {
  tasks: Task[];
  notes: Note[];
  decisions: Decision[];
  reflections: Reflection[];
  deletions?: { id: string; type: EventType }[];
  clarification?: string;
}

export interface UserSettings {
  name: string;
  avatarUrl: string;
  role: string;
  timezone: string;
  hasCompletedOnboarding: boolean;
  openaiApiKey: string;
}

export interface Project {
  id: string;
  name: string;
  parentId: string | null;
  type: 'category' | 'project' | 'sub-project';
  color?: string;
  icon?: string;
  createdAt: string;
}

export interface InboxItem {
  id: string;
  type: EventType;
  item: Task | Note | Decision | Reflection;
  createdAt: string;
}
