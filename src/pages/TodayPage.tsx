import { useEffect } from 'react';
import { format } from 'date-fns';
import { useAppStore } from '../store';
import { ConversationArea } from '../components/conversation/ConversationArea';
import { TodayTasks } from '../components/today/TodayTasks';


function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function ContextSummary() {
  const { tasks, decisions } = useAppStore();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Calculate stats
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekStartStr = weekStart.toISOString().split('T')[0];

  const tasksDueThisWeek = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && t.dueDate >= todayStr && t.dueDate <= new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  ).length;

  const completedToday = tasks.filter(
    (t) => t.status === 'completed' && t.updatedAt.startsWith(todayStr)
  ).length;

  const overdue = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && t.dueDate < todayStr
  ).length;

  const blocked = tasks.filter((t) => t.status === 'hold').length;

  const recentDecisions = decisions.filter(
    (d) => d.createdAt >= weekStartStr
  ).length;

  // Build summary
  const parts: string[] = [];

  if (tasks.length === 0) {
    return (
      <p className="text-sm text-white/40 font-light leading-relaxed">
        Your workspace is fresh. Tell me what you're working on and I'll start organizing.
      </p>
    );
  }

  if (completedToday > 0) {
    parts.push(`${completedToday} task${completedToday > 1 ? 's' : ''} completed today`);
  }
  if (tasksDueThisWeek > 0) {
    parts.push(`${tasksDueThisWeek} due this week`);
  }
  if (overdue > 0) {
    parts.push(`${overdue} overdue`);
  }
  if (blocked > 0) {
    parts.push(`${blocked} blocked`);
  }
  if (recentDecisions > 0) {
    parts.push(`${recentDecisions} decision${recentDecisions > 1 ? 's' : ''} this week`);
  }

  const summaryText = parts.length > 0
    ? parts.join(' · ')
    : `${tasks.length} total tasks in your workspace`;

  return (
    <p className="text-sm text-white/40 font-light leading-relaxed">
      {summaryText}
    </p>
  );
}

export function TodayPage() {
  const { settings } = useAppStore();
  const today = new Date();

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();
    
    // Trigger if it's morning and briefing hasn't run today
    if (hour < 12 && settings.lastBriefingDate !== todayStr) {
      useAppStore.setState(state => ({
        settings: { ...state.settings, lastBriefingDate: todayStr }
      }));
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('trigger-morning-briefing'));
      }, 500);
    }
  }, [settings.lastBriefingDate]);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Greeting header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-2">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-white/30 font-light tracking-wider uppercase mb-2">
            {format(today, 'EEEE, d MMMM yyyy')}
          </p>
          <h1
            className="text-2xl sm:text-3xl font-normal tracking-tight text-white mb-2"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            {getGreeting()}{settings.name ? `, ${settings.name}` : ''}.{' '}
            <span className="italic font-light text-white/70 font-serif">Here's where things stand.</span>
          </h1>
          <ContextSummary />
        </div>
      </div>

      {/* Conversation workspace — the beating heart */}
      <div className="flex-1 min-h-0">
        <ConversationArea />
      </div>

      {/* Bottom section — tasks (scrollable below) */}
      <div className="px-4 sm:px-6 lg:px-8 pb-4">
        <div className="max-w-3xl mx-auto">
          <TodayTasks />
        </div>
      </div>
    </div>
  );
}
