import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Note, Decision, Reflection, TimelineEvent, Message, PortfolioItem, UserSettings, AIExtractions, InboxItem, Project } from './types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

// ─── App Store ───────────────────────────────────────────────────────────────

interface AppState {
  // Data
  tasks: Task[];
  notes: Note[];
  decisions: Decision[];
  reflections: Reflection[];
  timeline: TimelineEvent[];
  portfolio: PortfolioItem[];
  messages: Message[];
  settings: UserSettings;
  inbox: InboxItem[];
  projects: Project[];

  // UI State
  rightPanelContent: AIExtractions | null;
  isRightPanelOpen: boolean;
  isSidebarCollapsed: boolean;
  isAIProcessing: boolean;
  isSyncing: boolean;
  selectedProjectId: string | null;
  pendingOpenId: string | null;
  pendingOpenType: 'task' | 'note' | 'decision' | 'reflection' | null;
  user: any | null; // From Supabase
  isInitialized: boolean;
  isSettingsOpen: boolean;

  // Actions
  setSettingsOpen: (open: boolean) => void;
  resetUserData: () => Promise<void>;
  syncWithSupabase: () => Promise<void>;
  setSelectedProjectId: (id: string | null) => void;
  
  // Project Actions
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Task Actions
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Note Actions
  addNote: (note: Note) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;

  // Decision Actions
  addDecision: (decision: Decision) => Promise<void>;
  updateDecision: (id: string, updates: Partial<Decision>) => Promise<void>;
  deleteDecision: (id: string) => Promise<void>;

  // Reflection Actions
  addReflection: (reflection: Reflection) => Promise<void>;
  updateReflection: (id: string, updates: Partial<Reflection>) => Promise<void>;
  deleteReflection: (id: string) => Promise<void>;

  // Timeline Actions
  addTimelineEvent: (event: TimelineEvent) => Promise<void>;

  // Portfolio Actions
  addPortfolioItem: (item: PortfolioItem) => Promise<void>;
  updatePortfolioItem: (id: string, updates: Partial<PortfolioItem>) => Promise<void>;
  deletePortfolioItem: (id: string) => Promise<void>;

  // Message Actions
  addMessage: (message: Message) => Promise<void>;
  clearMessages: () => Promise<void>;

  // Settings Actions
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;

  // Inbox Actions
  removeFromInbox: (id: string) => void;
  approveInboxItem: (id: string) => Promise<void>;

  // UI Actions
  setRightPanelContent: (content: AIExtractions | null) => void;
  toggleRightPanel: (open?: boolean) => void;
  toggleSidebar: () => void;
  setAIProcessing: (processing: boolean) => void;
  setPendingOpen: (type: 'task' | 'note' | 'decision' | 'reflection', id: string) => void;
  clearPendingOpen: () => void;
  setUser: (user: any | null) => void;
  signOut: () => Promise<void>;

  // Bulk action from AI extractions
  processExtractions: (extractions: AIExtractions, messageId: string) => Promise<void>;
}

const defaultSettings: UserSettings = {
  name: '',
  avatarUrl: '',
  role: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  hasCompletedOnboarding: false,
  openaiApiKey: '',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial Data
      tasks: [],
      notes: [],
      decisions: [],
      reflections: [],
      pendingOpenId: null,
      pendingOpenType: null,
      user: null,
      isInitialized: false,
      timeline: [],
      portfolio: [],
      messages: [],
      settings: defaultSettings,
      inbox: [],
      projects: [],
      isSettingsOpen: false,

      // UI State
      rightPanelContent: null,
      isRightPanelOpen: false,
      isSidebarCollapsed: false,
      isAIProcessing: false,
      isSyncing: false,
      selectedProjectId: null,

      // ─── Sync Logic ────────────────────────────────────────────────
      syncWithSupabase: async () => {
        const user = get().user;
        if (!user) return;
        
        set({ isSyncing: true });
        try {
          const [
            tasksRes,
            notesRes,
            decisionsRes,
            reflectionsRes,
            timelineRes,
            portfolioRes,
            messagesRes,
            settingsRes,
            projectsRes,
            inboxRes
          ] = await Promise.all([
            supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('decisions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('reflections').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('timeline').select('*').eq('user_id', user.id).order('timestamp', { ascending: false }),
            supabase.from('portfolio').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('messages').select('*').eq('user_id', user.id).order('timestamp', { ascending: true }),
            supabase.from('settings').select('*').eq('user_id', user.id).maybeSingle(),
            supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
            supabase.from('inbox').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
          ]);

          // Log errors
          if (tasksRes.error) console.error('Error fetching tasks:', tasksRes.error);
          if (notesRes.error) console.error('Error fetching notes:', notesRes.error);
          if (projectsRes.error) console.error('Error fetching projects:', projectsRes.error);
          if (inboxRes.error) console.error('Error fetching inbox:', inboxRes.error);

          set({
            tasks: (tasksRes.data || []).map(t => ({
              id: t.id,
              title: t.title,
              description: t.description,
              status: t.status,
              priority: t.priority,
              dueDate: t.due_date,
              projectId: t.project_id,
              tags: t.tags || [],
              linkedTaskIds: t.linked_task_ids || [],
              linkedNoteIds: t.linked_note_ids || [],
              linkedDecisionIds: t.linked_decision_ids || [],
              sourceMessageId: t.source_message_id,
              aiConfidence: t.ai_confidence,
              createdAt: t.created_at,
              updatedAt: t.updated_at
            })),
            notes: (notesRes.data || []).map(n => ({
              id: n.id,
              title: n.title,
              content: n.content,
              category: n.category || 'General',
              projectId: n.project_id,
              tags: n.tags || [],
              linkedTaskIds: n.linked_task_ids || [],
              linkedNoteIds: n.linked_note_ids || [],
              linkedDecisionIds: n.linked_decision_ids || [],
              sourceMessageId: n.source_message_id,
              aiConfidence: n.ai_confidence,
              createdAt: n.created_at,
              updatedAt: n.updated_at
            })),
            decisions: (decisionsRes.data || []).map(d => ({
              id: d.id,
              title: d.title,
              reasoning: d.reasoning,
              alternatives: d.alternatives || [],
              tradeoffs: d.tradeoffs,
              risks: d.risks,
              projectId: d.project_id,
              tags: d.tags || [],
              linkedTaskIds: d.linked_task_ids || [],
              linkedNoteIds: d.linked_note_ids || [],
              linkedDecisionIds: d.linked_decision_ids || [],
              sourceMessageId: d.source_message_id,
              aiConfidence: d.ai_confidence,
              createdAt: d.created_at,
              updatedAt: d.updated_at
            })),
            reflections: (reflectionsRes.data || []).map(r => ({
              id: r.id,
              type: r.type,
              weekLabel: r.week_label,
              monthLabel: r.month_label,
              summary: r.summary,
              wins: r.wins || [],
              challenges: r.challenges || [],
              learnings: r.learnings || [],
              improvements: r.improvements || [],
              moodScore: r.mood_score,
              projectId: r.project_id,
              createdAt: r.created_at,
              updatedAt: r.updated_at
            })),
            timeline: (timelineRes.data || []).map(e => ({
              id: e.id,
              type: e.type,
              referenceId: e.reference_id,
              summary: e.summary,
              timestamp: e.timestamp
            })),
            portfolio: (portfolioRes.data || []).map(p => ({
              id: p.id,
              title: p.title,
              impactDescription: p.impact_description,
              timeframe: p.timeframe,
              relatedTaskIds: p.related_task_ids || [],
              relatedDecisionIds: p.related_decision_ids || [],
              resumeBullet: p.resume_bullet,
              projectId: p.project_id,
              createdAt: p.created_at,
              updatedAt: p.updated_at
            })),
            messages: (messagesRes.data || []).map(m => ({
              id: m.id,
              role: m.role,
              content: m.content,
              extractions: m.extractions,
              timestamp: m.timestamp
            })),
            settings: settingsRes.data ? {
              name: settingsRes.data.name || '',
              avatarUrl: settingsRes.data.avatar_url || '',
              role: settingsRes.data.role || '',
              timezone: settingsRes.data.timezone || defaultSettings.timezone,
              hasCompletedOnboarding: settingsRes.data.has_completed_onboarding || false,
              openaiApiKey: settingsRes.data.openai_api_key || ''
            } : defaultSettings,
            projects: (projectsRes.data || []).map(p => ({
              id: p.id,
              name: p.name,
              parentId: p.parent_id,
              type: p.type,
              color: p.color,
              icon: p.icon,
              createdAt: p.created_at
            })),
            inbox: (inboxRes.data || []).map(i => ({
              id: i.id,
              type: i.type,
              item: i.item,
              createdAt: i.created_at
            })),
          });
        } catch (error) {
          console.error('Fatal sync error:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      setSelectedProjectId: (id) => set({ selectedProjectId: id }),

      // ─── Project Actions ───────────────────────────────────────────
      addProject: async (project) => {
        // Optimistic Update
        set((state) => ({
          projects: [...state.projects, project],
        }));

        const { error } = await supabase.from('projects').insert([{
          id: project.id,
          user_id: get().user?.id,
          name: project.name,
          parent_id: project.parentId,
          type: project.type,
          color: project.color,
          icon: project.icon,
          created_at: project.createdAt
        }]);

        if (error) console.error('Error adding project to Supabase:', error);
      },

      updateProject: async (id, updates) => {
        // Optimistic Update
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));

        const dbUpdates: any = { ...updates };
        if (updates.parentId !== undefined) {
          dbUpdates.parent_id = updates.parentId;
          delete dbUpdates.parentId;
        }

        const { error } = await supabase.from('projects').update(dbUpdates).eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error updating project in Supabase:', error);
      },

      deleteProject: async (id) => {
        // Optimistic Update
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          selectedProjectId: get().selectedProjectId === id ? null : get().selectedProjectId
        }));

        const { error } = await supabase.from('projects').delete().eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error deleting project from Supabase:', error);
      },

      // ─── Task Actions ──────────────────────────────────────────────
      addTask: async (task) => {
        const timelineEvent: TimelineEvent = {
          id: uuidv4(),
          type: 'task' as const,
          referenceId: task.id,
          summary: `Task created: ${task.title}`,
          timestamp: new Date().toISOString(),
        };

        // Optimistic Update
        set((state) => ({
          tasks: [...state.tasks, task],
          timeline: [...state.timeline, timelineEvent],
        }));

        const { error } = await supabase.from('tasks').insert([{
          id: task.id,
          user_id: get().user?.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          due_date: task.dueDate,
          project_id: task.projectId,
          tags: task.tags,
          linked_task_ids: task.linkedTaskIds,
          linked_note_ids: task.linkedNoteIds,
          linked_decision_ids: task.linkedDecisionIds,
          source_message_id: task.sourceMessageId,
          ai_confidence: task.aiConfidence,
          created_at: task.createdAt,
          updated_at: task.updatedAt
        }]);

        if (error) console.error('Error adding task to Supabase:', error);
        await get().addTimelineEvent(timelineEvent);
      },

      updateTask: async (id, updates) => {
        const now = new Date().toISOString();
        // Optimistic Update
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: now } : t
          ),
        }));

        const dbUpdates: any = { updated_at: now };
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
        if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
        if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId;
        if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
        if (updates.linkedTaskIds !== undefined) dbUpdates.linked_task_ids = updates.linkedTaskIds;
        if (updates.linkedNoteIds !== undefined) dbUpdates.linked_note_ids = updates.linkedNoteIds;
        if (updates.linkedDecisionIds !== undefined) dbUpdates.linked_decision_ids = updates.linkedDecisionIds;
        if (updates.aiConfidence !== undefined) dbUpdates.ai_confidence = updates.aiConfidence;
        if (updates.sourceMessageId !== undefined) dbUpdates.source_message_id = updates.sourceMessageId;

        const { error } = await supabase.from('tasks').update(dbUpdates).eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error updating task in Supabase:', error);
      },

      deleteTask: async (id) => {
        // Optimistic Update
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));

        const { error } = await supabase.from('tasks').delete().eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error deleting task from Supabase:', error);
      },

      // ─── Note Actions ──────────────────────────────────────────────
      addNote: async (note) => {
        const timelineEvent: TimelineEvent = {
          id: uuidv4(),
          type: 'note' as const,
          referenceId: note.id,
          summary: `Note created: ${note.title}`,
          timestamp: new Date().toISOString(),
        };

        // Optimistic Update
        set((state) => ({
          notes: [...state.notes, note],
          timeline: [...state.timeline, timelineEvent],
        }));

        const { error } = await supabase.from('notes').insert([{
          id: note.id,
          user_id: get().user?.id,
          title: note.title,
          content: note.content,
          category: note.category,
          project_id: note.projectId,
          tags: note.tags,
          linked_task_ids: note.linkedTaskIds,
          linked_note_ids: note.linkedNoteIds,
          linked_decision_ids: note.linkedDecisionIds,
          source_message_id: note.sourceMessageId,
          ai_confidence: note.aiConfidence,
          created_at: note.createdAt,
          updated_at: note.updatedAt
        }]);

        if (error) console.error('Error adding note to Supabase:', error);
        await get().addTimelineEvent(timelineEvent);
      },

      updateNote: async (id, updates) => {
        const now = new Date().toISOString();
        // Optimistic Update
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: now } : n
          ),
        }));

        const dbUpdates: any = { updated_at: now };
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.content !== undefined) dbUpdates.content = updates.content;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId;
        if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
        if (updates.linkedTaskIds !== undefined) dbUpdates.linked_task_ids = updates.linkedTaskIds;
        if (updates.linkedNoteIds !== undefined) dbUpdates.linked_note_ids = updates.linkedNoteIds;
        if (updates.linkedDecisionIds !== undefined) dbUpdates.linked_decision_ids = updates.linkedDecisionIds;
        if (updates.aiConfidence !== undefined) dbUpdates.ai_confidence = updates.aiConfidence;
        if (updates.sourceMessageId !== undefined) dbUpdates.source_message_id = updates.sourceMessageId;

        const { error } = await supabase.from('notes').update(dbUpdates).eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error updating note in Supabase:', error);
      },

      deleteNote: async (id) => {
        // Optimistic Update
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));

        const { error } = await supabase.from('notes').delete().eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error deleting note from Supabase:', error);
      },

      // ─── Decision Actions ──────────────────────────────────────────
      addDecision: async (decision) => {
        const timelineEvent: TimelineEvent = {
          id: uuidv4(),
          type: 'decision' as const,
          referenceId: decision.id,
          summary: `Decision logged: ${decision.title}`,
          timestamp: new Date().toISOString(),
        };

        // Optimistic Update
        set((state) => ({
          decisions: [...state.decisions, decision],
          timeline: [...state.timeline, timelineEvent],
        }));

        const { error } = await supabase.from('decisions').insert([{
          id: decision.id,
          user_id: get().user?.id,
          title: decision.title,
          reasoning: decision.reasoning,
          alternatives: decision.alternatives,
          tradeoffs: decision.tradeoffs,
          risks: decision.risks,
          project_id: decision.projectId,
          tags: decision.tags,
          linked_task_ids: decision.linkedTaskIds,
          linked_note_ids: decision.linkedNoteIds,
          linked_decision_ids: decision.linkedDecisionIds,
          source_message_id: decision.sourceMessageId,
          ai_confidence: decision.aiConfidence,
          created_at: decision.createdAt,
          updated_at: decision.updatedAt
        }]);

        if (error) console.error('Error adding decision to Supabase:', error);
        await get().addTimelineEvent(timelineEvent);
      },

      updateDecision: async (id, updates) => {
        const now = new Date().toISOString();
        // Optimistic Update
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: now } : d
          ),
        }));

        const dbUpdates: any = { updated_at: now };
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.reasoning !== undefined) dbUpdates.reasoning = updates.reasoning;
        if (updates.alternatives !== undefined) dbUpdates.alternatives = updates.alternatives;
        if (updates.tradeoffs !== undefined) dbUpdates.tradeoffs = updates.tradeoffs;
        if (updates.risks !== undefined) dbUpdates.risks = updates.risks;
        if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId;
        if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
        if (updates.linkedTaskIds !== undefined) dbUpdates.linked_task_ids = updates.linkedTaskIds;
        if (updates.linkedNoteIds !== undefined) dbUpdates.linked_note_ids = updates.linkedNoteIds;
        if (updates.linkedDecisionIds !== undefined) dbUpdates.linked_decision_ids = updates.linkedDecisionIds;
        if (updates.aiConfidence !== undefined) dbUpdates.ai_confidence = updates.aiConfidence;
        if (updates.sourceMessageId !== undefined) dbUpdates.source_message_id = updates.sourceMessageId;

        const { error } = await supabase.from('decisions').update(dbUpdates).eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error updating decision in Supabase:', error);
      },

      deleteDecision: async (id) => {
        // Optimistic Update
        set((state) => ({
          decisions: state.decisions.filter((d) => d.id !== id),
        }));

        const { error } = await supabase.from('decisions').delete().eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error deleting decision from Supabase:', error);
      },

      // ─── Reflection Actions ────────────────────────────────────────
      addReflection: async (reflection) => {
        const timelineEvent: TimelineEvent = {
          id: uuidv4(),
          type: 'reflection' as const,
          referenceId: reflection.id,
          summary: `Reflection logged: ${reflection.type}`,
          timestamp: new Date().toISOString(),
        };

        // Optimistic Update
        set((state) => ({
          reflections: [...state.reflections, reflection],
          timeline: [...state.timeline, timelineEvent],
        }));

        const { error } = await supabase.from('reflections').insert([{
          id: reflection.id,
          user_id: get().user?.id,
          type: reflection.type,
          week_label: reflection.weekLabel,
          month_label: reflection.monthLabel,
          summary: reflection.summary,
          wins: reflection.wins,
          challenges: reflection.challenges,
          learnings: reflection.learnings,
          improvements: reflection.improvements,
          mood_score: reflection.moodScore,
          project_id: reflection.projectId,
          created_at: reflection.createdAt,
          updated_at: reflection.updatedAt
        }]);

        if (error) console.error('Error adding reflection to Supabase:', error);
        await get().addTimelineEvent(timelineEvent);
      },

      updateReflection: async (id, updates) => {
        const now = new Date().toISOString();
        // Optimistic Update
        set((state) => ({
          reflections: state.reflections.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: now } : r
          ),
        }));

        const dbUpdates: any = { updated_at: now };
        if (updates.summary !== undefined) dbUpdates.summary = updates.summary;
        if (updates.type !== undefined) dbUpdates.type = updates.type;
        if (updates.weekLabel !== undefined) dbUpdates.week_label = updates.weekLabel;
        if (updates.monthLabel !== undefined) dbUpdates.month_label = updates.monthLabel;
        if (updates.wins !== undefined) dbUpdates.wins = updates.wins;
        if (updates.challenges !== undefined) dbUpdates.challenges = updates.challenges;
        if (updates.learnings !== undefined) dbUpdates.learnings = updates.learnings;
        if (updates.improvements !== undefined) dbUpdates.improvements = updates.improvements;
        if (updates.moodScore !== undefined) dbUpdates.mood_score = updates.moodScore;
        if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId;

        const { error } = await supabase.from('reflections').update(dbUpdates).eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error updating reflection in Supabase:', error);
      },

      deleteReflection: async (id) => {
        // Optimistic Update
        set((state) => ({
          reflections: state.reflections.filter((r) => r.id !== id),
        }));

        const { error } = await supabase.from('reflections').delete().eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error deleting reflection from Supabase:', error);
      },

      // ─── Timeline Actions ──────────────────────────────────────────
      addTimelineEvent: async (event) => {
        set((state) => ({
          timeline: [...state.timeline, event],
        }));

        const { error } = await supabase.from('timeline').insert([{
          id: event.id,
          user_id: get().user?.id,
          type: event.type,
          reference_id: event.referenceId,
          summary: event.summary,
          timestamp: event.timestamp
        }]);

        if (error) console.error('Error adding timeline event to Supabase:', error);
      },

      // ─── Portfolio Actions ─────────────────────────────────────────
      addPortfolioItem: async (item) => {
        set((state) => ({
          portfolio: [...state.portfolio, item],
        }));

        const { error } = await supabase.from('portfolio').insert([{
          id: item.id,
          user_id: get().user?.id,
          title: item.title,
          impact_description: item.impactDescription,
          timeframe: item.timeframe,
          related_task_ids: item.relatedTaskIds,
          related_decision_ids: item.relatedDecisionIds,
          resume_bullet: item.resumeBullet,
          project_id: item.projectId,
          created_at: item.createdAt,
          updated_at: item.updatedAt
        }]);

        if (error) console.error('Error adding portfolio item to Supabase:', error);
      },

      updatePortfolioItem: async (id: string, updates: Partial<PortfolioItem>) => {
        const now = new Date().toISOString();
        set((state) => ({
          portfolio: state.portfolio.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: now } : p
          ),
        }));

        const dbUpdates: any = { updated_at: now };
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.impactDescription !== undefined) dbUpdates.impact_description = updates.impactDescription;
        if (updates.timeframe !== undefined) dbUpdates.timeframe = updates.timeframe;
        if (updates.relatedTaskIds !== undefined) dbUpdates.related_task_ids = updates.relatedTaskIds;
        if (updates.relatedDecisionIds !== undefined) dbUpdates.related_decision_ids = updates.relatedDecisionIds;
        if (updates.resumeBullet !== undefined) dbUpdates.resume_bullet = updates.resumeBullet;
        if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId;

        const { error } = await supabase.from('portfolio').update(dbUpdates).eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error updating portfolio item in Supabase:', error);
      },

      deletePortfolioItem: async (id: string) => {
        set((state) => ({
          portfolio: state.portfolio.filter((p) => p.id !== id),
        }));

        const { error } = await supabase.from('portfolio').delete().eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error deleting portfolio item from Supabase:', error);
      },

      // ─── Message Actions ───────────────────────────────────────────
      addMessage: async (message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));

        const { error } = await supabase.from('messages').insert([{
          id: message.id,
          user_id: get().user?.id,
          role: message.role,
          content: message.content,
          extractions: message.extractions,
          timestamp: message.timestamp
        }]);

        if (error) console.error('Error adding message to Supabase:', error);
      },

      clearMessages: async () => {
        set({ messages: [] });
        const { error } = await supabase.from('messages').delete().eq('user_id', get().user?.id);
        if (error) console.error('Error clearing messages in Supabase:', error);
      },

      // ─── Settings Actions ──────────────────────────────────────────
      updateSettings: async (updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      
        const dbUpdates: any = { updated_at: now };
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.role !== undefined) dbUpdates.role = updates.role;
        if (updates.timezone !== undefined) dbUpdates.timezone = updates.timezone;
        if (updates.openaiApiKey !== undefined) dbUpdates.openai_api_key = updates.openaiApiKey;
        if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
        if (updates.hasCompletedOnboarding !== undefined) {
          dbUpdates.has_completed_onboarding = updates.hasCompletedOnboarding;
        }
      
        const { error } = await supabase.from('settings').upsert({ 
          user_id: get().user?.id, 
          ...dbUpdates 
        });
        if (error) console.error('Error updating settings in Supabase:', error);
      },

      // ─── Inbox Actions ─────────────────────────────────────────────
      removeFromInbox: async (id) => {
        set((state) => ({
          inbox: state.inbox.filter((i) => i.id !== id),
        }));
        
        const { error } = await supabase.from('inbox').delete().eq('id', id).eq('user_id', get().user?.id);
        if (error) console.error('Error removing from inbox in Supabase:', error);
      },

      approveInboxItem: async (id) => {
        const state = get();
        const item = state.inbox.find(i => i.id === id);
        if (!item) return;

        // Use the new removeFromInbox which handles Supabase deletion
        await get().removeFromInbox(id);

        if (item.type === 'task') await get().addTask(item.item as Task);
        else if (item.type === 'note') await get().addNote(item.item as Note);
        else if (item.type === 'decision') await get().addDecision(item.item as Decision);
        else if (item.type === 'reflection') await get().addReflection(item.item as Reflection);
      },

      // ─── UI Actions ────────────────────────────────────────────────
      setRightPanelContent: (content) =>
        set({
          rightPanelContent: content,
          isRightPanelOpen: content !== null && (
            (content.tasks?.length > 0) ||
            (content.notes?.length > 0) ||
            (content.decisions?.length > 0) ||
            (content.reflections?.length > 0)
          ),
        }),

      toggleRightPanel: (open) =>
        set((state) => ({
          isRightPanelOpen: open !== undefined ? open : !state.isRightPanelOpen,
        })),

      toggleSidebar: () =>
        set((state) => ({
          isSidebarCollapsed: !state.isSidebarCollapsed,
        })),

      setAIProcessing: (processing) => set({ isAIProcessing: processing }),
      setPendingOpen: (type, id) => set({ pendingOpenType: type, pendingOpenId: id }),
      clearPendingOpen: () => set({ pendingOpenId: null, pendingOpenType: null }),
      setUser: (user) => set({ user, isInitialized: true }),
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),
      resetUserData: async () => {
        const user = get().user;
        if (!user) return;

        set({ isSyncing: true });
        try {
          const tables = ['tasks', 'notes', 'decisions', 'reflections', 'timeline', 'portfolio', 'messages', 'projects', 'inbox'];
          await Promise.all(tables.map(table => 
            supabase.from(table).delete().eq('user_id', user.id)
          ));
          
          set({
            tasks: [],
            notes: [],
            decisions: [],
            reflections: [],
            timeline: [],
            portfolio: [],
            messages: [],
            projects: [],
            inbox: [],
            selectedProjectId: null
          });
        } catch (error) {
          console.error('Error resetting user data:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
      signOut: async () => {
        await supabase.auth.signOut();
        set({ 
          user: null, 
          tasks: [], 
          notes: [], 
          decisions: [], 
          reflections: [], 
          timeline: [], 
          projects: [],
          inbox: [] 
        });
      },

      // ─── Bulk Process AI Extractions ───────────────────────────────
      processExtractions: async (extractions, messageId) => {
        const state = get();
        const now = new Date().toISOString();
        const newInboxItems: InboxItem[] = [];

        // 1. Process tasks
        for (const t of extractions.tasks) {
          const incoming = { ...t, sourceMessageId: messageId };
          const exists = state.tasks.some(existing => existing.id === incoming.id);
          
          if (incoming.aiConfidence === 'medium' || incoming.aiConfidence === 'low') {
            newInboxItems.push({ id: incoming.id, type: 'task', item: incoming, createdAt: now });
          } else {
            if (exists) {
              await get().updateTask(incoming.id, incoming);
            } else {
              await get().addTask(incoming);
            }
          }
        }

        // 2. Process notes
        for (const n of extractions.notes) {
          const incoming = { ...n, sourceMessageId: messageId };
          const exists = state.notes.some(existing => existing.id === incoming.id);
          
          if (incoming.aiConfidence === 'medium' || incoming.aiConfidence === 'low') {
            newInboxItems.push({ id: incoming.id, type: 'note', item: incoming, createdAt: now });
          } else {
            if (exists) {
              await get().updateNote(incoming.id, incoming);
            } else {
              await get().addNote(incoming);
            }
          }
        }

        // 3. Process decisions
        for (const d of extractions.decisions) {
          const incoming = { ...d, sourceMessageId: messageId };
          const exists = state.decisions.some(existing => existing.id === incoming.id);
          
          if (incoming.aiConfidence === 'medium' || incoming.aiConfidence === 'low') {
            newInboxItems.push({ id: incoming.id, type: 'decision', item: incoming, createdAt: now });
          } else {
            if (exists) {
              await get().updateDecision(incoming.id, incoming);
            } else {
              await get().addDecision(incoming);
            }
          }
        }

        // 4. Process reflections
        for (const r of extractions.reflections) {
          const exists = state.reflections.some(existing => existing.id === r.id);
          if (r.moodScore === null) r.moodScore = 0;
          
          if (exists) {
            await get().updateReflection(r.id, r);
          } else {
            await get().addReflection(r);
          }
        }

        // 5. Handle deletions
        if (extractions.deletions && extractions.deletions.length > 0) {
          for (const del of extractions.deletions) {
            if (del.type === 'task') await get().deleteTask(del.id);
            else if (del.type === 'note') await get().deleteNote(del.id);
            else if (del.type === 'decision') await get().deleteDecision(del.id);
          }
        }

        // Persist new inbox items to Supabase
        if (newInboxItems.length > 0) {
          const { error } = await supabase.from('inbox').insert(
            newInboxItems.map(i => ({
              id: i.id,
              type: i.type,
              item: i.item,
              created_at: i.createdAt
            }))
          );
          if (error) console.error('Error adding to inbox in Supabase:', error);
        }

        set((state) => ({
          inbox: [...state.inbox, ...newInboxItems],
          rightPanelContent: extractions,
          isRightPanelOpen:
            extractions.tasks.length > 0 ||
            extractions.notes.length > 0 ||
            extractions.decisions.length > 0 ||
            extractions.reflections.length > 0 ||
            (extractions.deletions?.length ?? 0) > 0,
        }));
      },
    }),
    {
      name: 'work-intelligence-os-ui-state', // Only persistent UI state
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);

