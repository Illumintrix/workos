import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  chevronClassName?: string;
  showChevron?: boolean;
}

export function CustomSelect({ value, options, onChange, className = "", triggerClassName = "", chevronClassName = "", showChevron = true }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-transparent focus:outline-none text-left ${triggerClassName || "w-full justify-between text-sm text-white py-1 px-0"}`}
      >
        <span className="truncate">{selectedOption?.label || value}</span>
        {showChevron && (
          <ChevronDown className={`${chevronClassName || "w-3.5 h-3.5"} text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-3 min-w-[180px] bg-[#0a0a0a] backdrop-blur-2xl border border-white/10 rounded-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
        >
          <div className="p-1.5 flex flex-col gap-0.5">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between group/item ${
                  opt.value === value 
                    ? 'text-white bg-white/5 font-medium' 
                    : 'text-white/60 hover:text-white hover:bg-white/[0.03] font-light'
                }`}
              >
                <span>{opt.label}</span>
                {opt.value === value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
