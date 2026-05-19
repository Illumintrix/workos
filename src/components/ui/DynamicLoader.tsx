import { useState, useEffect } from 'react';

const loadingStates = [
  'Reading context...',
  'Analyzing intent...',
  'Extracting tasks...',
  'Logging decisions...',
  'Structuring response...'
];

export function DynamicLoader() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % loadingStates.length);
    }, 1500); // Change text every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 mt-3 ml-2 animate-in fade-in duration-300">
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <div className="relative h-4 overflow-hidden min-w-[150px]">
        {loadingStates.map((text, index) => (
          <span
            key={index}
            className={`absolute top-0 left-0 text-xs font-light transition-all duration-500 ${
              index === currentIndex
                ? 'opacity-100 translate-y-0 text-amber-400/80'
                : 'opacity-0 translate-y-4 text-white/40'
            }`}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
