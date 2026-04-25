import { useAppStore } from '../../store';
import { Lightbulb } from 'lucide-react';

export function AISuggestions() {
  const { tasks, reflections } = useAppStore();

  // Generate contextual suggestions
  const suggestions: string[] = [];
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Check for overdue tasks
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < today
  );
  if (overdueTasks.length > 0) {
    suggestions.push(
      `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}. Want to review and update them?`
    );
  }

  // Check for long in-progress tasks
  const longRunning = tasks.filter((t) => {
    if (t.status !== 'in_progress') return false;
    const created = new Date(t.createdAt);
    const daysSince = Math.floor((today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return daysSince > 5;
  });
  if (longRunning.length > 0) {
    suggestions.push(
      `"${longRunning[0].title}" has been in progress for a while. Is there a blocker?`
    );
  }

  // Check for missing reflections
  const lastReflection = reflections.length > 0
    ? new Date(reflections[reflections.length - 1].createdAt)
    : null;
  const daysSinceReflection = lastReflection
    ? Math.floor((today.getTime() - lastReflection.getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  if (daysSinceReflection > 7) {
    suggestions.push("You haven't reflected this week. Want to do a quick end-of-day check-in?");
  }

  // Monday recap
  if (dayOfWeek === 1 && tasks.length > 0) {
    suggestions.push("It's Monday. Want me to show you last week's recap?");
  }

  // Friday reflection
  if (dayOfWeek === 5 && today.getHours() >= 15) {
    suggestions.push("It's Friday afternoon. Want to do an end-of-week reflection?");
  }

  // Default suggestion if nothing else
  if (suggestions.length === 0 && tasks.length === 0) {
    suggestions.push("Tell me about your current projects and I'll help you organize everything.");
  }

  if (suggestions.length === 0) return null;

  const handleSuggestionClick = (suggestion: string) => {
    window.dispatchEvent(new CustomEvent('fill-chat-input', { detail: suggestion }));
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-amber-400/50" />
        <span className="text-xs font-normal text-white/40 tracking-wide uppercase">Suggestions</span>
      </div>
      <div className="flex flex-col gap-2">
        {suggestions.slice(0, 3).map((suggestion, i) => (
          <div
            key={i}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/[0.04] to-transparent border border-amber-500/[0.08] text-sm text-white/60 font-light leading-relaxed cursor-pointer hover:text-white/80 hover:border-amber-500/[0.15] transition-all"
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
}
