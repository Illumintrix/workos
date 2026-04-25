interface UserMessageProps {
  content: string;
  timestamp: string;
}

export function UserMessage({ content, timestamp }: UserMessageProps) {
  return (
    <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col items-end gap-1 max-w-[80%]">
        <div
          className="px-5 py-3.5 rounded-2xl rounded-br-md relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-sm text-white/90 font-normal leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
        <span className="text-[10px] text-white/30 font-light mr-2">
          {new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
