import { format, isToday, isYesterday, isTomorrow, isAfter, isBefore, addDays, startOfWeek, endOfWeek, parseISO } from 'date-fns';

export type TimeBucket = 'Today' | 'In this week' | 'Upcoming' | 'Completed';

export function getTaskTimeBucket(dueDate: string | null, status: string): TimeBucket {
  if (status === 'completed') return 'Completed';
  if (!dueDate) return 'Upcoming';

  const date = parseISO(dueDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (isBefore(date, today) || isToday(date)) {
    return 'Today';
  }

  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Assuming Monday start
  if (isBefore(date, addDays(weekEnd, 1))) {
    return 'In this week';
  }

  return 'Upcoming';
}

export function formatRelativeDueDate(dueDate: string | null): { text: string; colorClass: string } {
  if (!dueDate) return { text: 'No date', colorClass: 'text-white/10' };

  const date = parseISO(dueDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, 1);

  if (isYesterday(date)) {
    return { text: 'Yesterday', colorClass: 'text-red-400/90' };
  }

  if (isToday(date)) {
    return { text: 'Today', colorClass: 'text-amber-400/90' };
  }

  if (isTomorrow(date)) {
    return { text: 'Tomorrow', colorClass: 'text-white/40' };
  }

  if (isBefore(date, yesterday)) {
    return { 
      text: format(date, 'MMM d, yyyy'), 
      colorClass: 'text-red-400/80' 
    };
  }

  // Future days
  const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff > 0 && diff <= 14) {
    return { text: `In ${diff} days`, colorClass: 'text-white/30' };
  }

  return { 
    text: format(date, 'MMM d, yyyy'), 
    colorClass: 'text-white/20' 
  };
}
