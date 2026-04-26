import { format, isToday, isYesterday, isTomorrow, isBefore, addDays, endOfWeek, parseISO } from 'date-fns';

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
  if (!dueDate) return { text: 'No date', colorClass: 'text-white/20' };

  const date = parseISO(dueDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  // Overdue
  if (isBefore(date, today)) {
    return { 
      text: isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy'), 
      colorClass: 'text-red-400' 
    };
  }

  // Today
  if (isToday(date)) {
    return { text: 'Today', colorClass: 'text-amber-400' };
  }

  // This Week
  if (isBefore(date, addDays(weekEnd, 1))) {
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { 
      text: isTomorrow(date) ? 'Tomorrow' : `In ${diff} days`, 
      colorClass: 'text-amber-400/80' 
    };
  }

  // Upcoming
  return { 
    text: format(date, 'MMM d, yyyy'), 
    colorClass: 'text-white/70' 
  };
}
