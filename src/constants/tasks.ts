import type { TaskStatus } from '../store/types';

export const statusColumns: { status: TaskStatus; label: string; color: string; dotStyle?: React.CSSProperties }[] = [
  { status: 'to_do', label: 'To Do', color: 'bg-white/30' },
  { status: 'in_progress', label: 'In Progress', color: 'bg-amber-400', dotStyle: { boxShadow: '0 0 8px rgba(251,191,36,0.5)' } },
  { status: 'hold', label: 'Hold', color: 'bg-purple-400', dotStyle: { boxShadow: '0 0 8px rgba(192,132,252,0.5)' } },
  { status: 'completed', label: 'Completed', color: 'bg-emerald-400', dotStyle: { boxShadow: '0 0 8px rgba(52,211,153,0.5)' } },
];

export const priorityColors = {
  high: { bg: 'from-[#3a1d1d] to-[#241010]', text: 'text-[#ff8a8a]', border: 'border-[#522525]' },
  medium: { bg: 'from-[#3a3a1d] to-[#242410]', text: 'text-[#ffd98a]', border: 'border-[#525225]' },
  low: { bg: 'from-[#1d3a24] to-[#102415]', text: 'text-[#8affb1]', border: 'border-[#2b5936]' },
};
