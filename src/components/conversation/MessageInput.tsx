import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Plus, AudioLines, ChevronDown, Folder } from 'lucide-react';
import { useAppStore } from '../../store';
import type { Project } from '../../store/types';

// ─── Web Speech API Types ────────────────────────────────────────────────────

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface MessageInputProps {
  onSend: (message: string) => void;
  isInitial?: boolean;
}

export function MessageInput({ onSend, isInitial }: MessageInputProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpaceHeld, setIsSpaceHeld] = useState(false);
  const shouldSendOnStop = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { projects, isAIProcessing, selectedProjectId, setSelectedProjectId, settings, setApiKeyModalOpen } = useAppStore();

  // @ mentions state
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [isProjectPickerOpen, setIsProjectPickerOpen] = useState(false);

  // Check for Web Speech API support
  const speechSupported = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
    }
  }, [input, interimTranscript]);

  // Listen for custom fill-chat-input event
  useEffect(() => {
    const handleFillInput = (e: Event) => {
      const customEvent = e as CustomEvent;
      setInput(customEvent.detail);
      // Optional: focus the input
      textareaRef.current?.focus();
    };
    window.addEventListener('fill-chat-input', handleFillInput);
    return () => window.removeEventListener('fill-chat-input', handleFillInput);
  }, []);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isProjectPickerOpen && !(e.target as Element).closest('.project-picker-container')) {
        setIsProjectPickerOpen(false);
      }
      if (showMentions && !(e.target as Element).closest('.mentions-menu-container')) {
        setShowMentions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProjectPickerOpen, showMentions]);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!speechSupported || isAIProcessing) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setInput((prev) => {
          const separator = prev && !prev.endsWith(' ') ? ' ' : '';
          return prev + separator + finalTranscript;
        });
        setInterimTranscript('');
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setInterimTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      
      // Auto-send if triggered by spacebar release
      if (shouldSendOnStop.current) {
        shouldSendOnStop.current = false;
        // Small delay to ensure state has settled
        setTimeout(() => {
          handleSend();
        }, 100);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [speechSupported, isAIProcessing]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSend = () => {
    // Stop listening if active
    if (isListening) stopListening();

    const trimmed = input.trim();
    if (!trimmed || isAIProcessing) return;

    // Check for API Key
    if (!settings.openaiApiKey) {
      setApiKeyModalOpen(true);
      return;
    }

    onSend(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    
    // Shift key "Push to Talk" logic
    if (e.key === 'Shift' && !isListening && !isAIProcessing && !e.repeat) {
      e.preventDefault();
      setIsSpaceHeld(true); // Reusing state name for 'key held'
      shouldSendOnStop.current = true;
      startListening();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Shift' && isSpaceHeld) {
      e.preventDefault();
      setIsSpaceHeld(false);
      
      // Give a tiny bit of time for the final transcript to catch up
      setTimeout(() => {
        stopListening();
        // Auto-send will be handled by the onend listener
      }, 300);
    }
  };

  // Combined display value: typed text + interim speech
  const displayValue = interimTranscript
    ? input + (input && !input.endsWith(' ') ? ' ' : '') + interimTranscript
    : input;

  const handleSelectMention = (project: Project) => {
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const textBeforeMention = input.slice(0, cursorPosition).replace(/@(\w*)$/, '');
    const textAfterMention = input.slice(cursorPosition);
    
    setInput(textBeforeMention + textAfterMention);
    setSelectedProjectId(project.id);
    setShowMentions(false);
    
    // Focus back to textarea
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const renderMentionOptions = (project: Project, depth = 0) => {
    const children = projects.filter(p => p.parentId === project.id);
    const matches = project.name.toLowerCase().includes(mentionQuery.toLowerCase());
    const isSelected = filteredProjects[mentionIndex]?.id === project.id;

    if (!matches && children.length === 0) return null;

    return (
      <React.Fragment key={project.id}>
        {matches && (
          <button
            onClick={() => handleSelectMention(project)}
            onMouseEnter={() => {
              const idx = filteredProjects.findIndex(p => p.id === project.id);
              if (idx !== -1) setMentionIndex(idx);
            }}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group/item
              ${isSelected ? 'bg-white/5 text-white shadow-sm' : 'text-white/60 hover:bg-white/[0.03] hover:text-white'}
            `}
            style={{ marginLeft: `${depth * 12}px`, width: `calc(100% - ${depth * 12}px)` }}
          >
            <div className={`
              w-7 h-7 rounded-lg flex items-center justify-center transition-colors
              ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/20'}
            `}>
              <Folder className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col items-start truncate">
              <span className="font-light truncate tracking-tight">{project.name}</span>
              <span className="text-[9px] text-white/20 uppercase tracking-widest">{project.type}</span>
            </div>
          </button>
        )}
        {children.map(child => renderMentionOptions(child, depth + 1))}
      </React.Fragment>
    );
  };

  const renderProjectOptions = (project: Project, depth = 0) => {
    const children = projects.filter(p => p.parentId === project.id);
    const isSelected = selectedProjectId === project.id;

    return (
      <React.Fragment key={project.id}>
        <button
          onClick={() => {
            setSelectedProjectId(project.id);
            setIsProjectPickerOpen(false);
          }}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group/item
            ${isSelected ? 'bg-white/5 text-white shadow-sm' : 'text-white/60 hover:bg-white/[0.03] hover:text-white'}
          `}
          style={{ marginLeft: `${depth * 12}px`, width: `calc(100% - ${depth * 12}px)` }}
        >
          <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-white/20'}`} />
          <span className="truncate tracking-tight font-light">{project.name}</span>
        </button>
        {children.map(child => renderProjectOptions(child, depth + 1))}
      </React.Fragment>
    );
  };
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-0">
      {/* Mention Menu */}
      {showMentions && (
        <div 
          className="fixed z-[100] w-72 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.9)] overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-200 mentions-menu-container"
          style={{ 
            top: `${mentionPosition.top}px`, 
            left: `${mentionPosition.left}px` 
          }}
        >
          <div className="px-3 py-2 mb-1.5 border-b border-white/[0.04]">
            <span className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em]">Select Project</span>
          </div>
          
          <div className="max-h-64 overflow-y-auto hide-scrollbar flex flex-col gap-0.5">
            {projects.filter(p => !p.parentId).map(p => renderMentionOptions(p))}
            {filteredProjects.length === 0 && (
              <div className="px-4 py-10 text-center">
                <span className="text-xs text-white/20 font-light italic tracking-tight">No results for "{mentionQuery}"</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className={`relative flex items-end gap-3 rounded-2xl p-[1px] ${isInitial ? 'shadow-[0_24px_48px_-12px_rgba(0,0,0,0.9)]' : ''}`}
        style={{
          background: isListening
            ? 'linear-gradient(180deg, rgba(239,68,68,0.3) 0%, rgba(239,68,68,0.05) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          transition: 'background 0.3s ease',
        }}
      >
        <div
          className={`flex-1 flex flex-col gap-3 rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] ${isInitial ? 'p-6' : 'px-5 py-4'} relative`}
          style={{
            boxShadow: isInitial 
              ? 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8)'
              : 'inset 0 1px 1px rgba(255,255,255,0.06), inset 0 -2px 8px rgba(0,0,0,0.5)',
          }}
        >
          {/* Noise texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
              backgroundSize: '4px 4px',
            }}
          />

          <div className="flex flex-col gap-4 relative z-10">
            <textarea
              ref={textareaRef}
              value={displayValue}
              onChange={(e) => {
                const newValue = e.target.value;
                setInput(newValue);
                setInterimTranscript('');

                // Mention detection
                const cursorPosition = e.target.selectionStart;
                const textBeforeCursor = newValue.slice(0, cursorPosition);
                const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

                if (mentionMatch) {
                  const query = mentionMatch[1];
                  setMentionQuery(query);
                  setShowMentions(true);
                  setMentionIndex(0);
                  
                  // Accurate caret position calculation using a mirror element
                  if (textareaRef.current) {
                    const textarea = textareaRef.current;
                    const cursorPosition = textarea.selectionStart;
                    const textBeforeCursor = textarea.value.slice(0, cursorPosition);
                    
                    const rect = textarea.getBoundingClientRect();
                    const div = document.createElement('div');
                    const style = window.getComputedStyle(textarea);
                    
                    // Copy all layout and font styles exactly
                    const stylesToCopy = [
                      'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing',
                      'textTransform', 'wordSpacing', 'textIndent', 'whiteSpace', 'wordBreak',
                      'lineHeight', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom',
                      'borderWidth', 'boxSizing', 'width', 'textAlign', 'textRendering'
                    ];
                    
                    stylesToCopy.forEach(prop => {
                      (div.style as any)[prop] = (style as any)[prop];
                    });
                    
                    div.style.position = 'fixed';
                    div.style.visibility = 'hidden';
                    div.style.top = rect.top + 'px';
                    div.style.left = rect.left + 'px';
                    div.style.height = 'auto';
                    div.style.whiteSpace = 'pre-wrap';
                    div.style.wordWrap = 'break-word';
                    
                    // Mirror the content exactly
                    div.textContent = textBeforeCursor;
                    const span = document.createElement('span');
                    span.textContent = '|';
                    div.appendChild(span);
                    
                    document.body.appendChild(div);
                    
                    const spanRect = span.getBoundingClientRect();
                    
                    // Calculate position relative to viewport
                    let top = spanRect.top + 28;
                    let left = spanRect.left;
                    
                    // Boundary checks
                    const menuWidth = 288;
                    if (left + menuWidth > window.innerWidth) {
                      left = window.innerWidth - menuWidth - 20;
                    }
                    
                    setMentionPosition({ top, left });
                    document.body.removeChild(div);
                  }
                } else {
                  setShowMentions(false);
                }
              }}
              onKeyDown={(e) => {
                if (showMentions) {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setMentionIndex((prev) => (prev + 1) % filteredProjects.length);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setMentionIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
                  } else if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    if (filteredProjects[mentionIndex]) {
                      handleSelectMention(filteredProjects[mentionIndex]);
                    }
                  } else if (e.key === 'Escape') {
                    setShowMentions(false);
                  }
                } else {
                  handleKeyDown(e);
                }
              }}
              onKeyUp={handleKeyUp}
              placeholder={isListening ? (isSpaceHeld ? 'Recording while Shift is held...' : 'Listening...') : (isInitial ? 'Tell me what\'s on your mind...' : 'Ask anything...')}
              disabled={isAIProcessing}
              className={`w-full bg-transparent text-white/90 font-light placeholder:text-white/20 focus:outline-none resize-none leading-relaxed hide-scrollbar disabled:opacity-50 tracking-tight ${isInitial ? 'text-xl min-h-[96px]' : 'text-sm min-h-[32px]'}`}
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            />

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                {/* Future: Add file button moved to bottom left */}
                <button 
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/[0.05] transition-all"
                  title="Add attachment (Coming soon)"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* Project Selector */}
                <div className="relative project-picker-container">
                  <button
                    onClick={() => setIsProjectPickerOpen(!isProjectPickerOpen)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border
                      ${selectedProjectId 
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                        : 'bg-white/[0.03] border-white/[0.05] text-white/30 hover:text-white/50 hover:bg-white/[0.05]'}
                    `}
                  >
                    <Folder className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[100px] tracking-tight">
                      {selectedProjectId 
                        ? projects.find(p => p.id === selectedProjectId)?.name 
                        : 'No Project'}
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isProjectPickerOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProjectPickerOpen && (
                    <div className="absolute bottom-full left-0 mb-3 w-64 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.9)] overflow-hidden p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="px-3 py-2 border-b border-white/[0.04] mb-1.5">
                        <span className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em]">Select Project</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto hide-scrollbar flex flex-col gap-0.5">
                        <button
                          onClick={() => {
                            setSelectedProjectId(null);
                            setIsProjectPickerOpen(false);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group/item
                            ${!selectedProjectId ? 'bg-white/5 text-white shadow-sm' : 'text-white/60 hover:bg-white/[0.03] hover:text-white'}
                          `}
                        >
                          <Folder className="w-3.5 h-3.5 text-white/20" />
                          <span className="tracking-tight font-light">Global Context (Default)</span>
                        </button>
                        
                        <div className="pt-0.5 mt-0.5 border-t border-white/[0.02] flex flex-col gap-0.5">
                          {projects.filter(p => !p.parentId).map(p => renderProjectOptions(p))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Whisper-style icon / Voice button */}
                {speechSupported && (
                  <button
                    onClick={toggleListening}
                    disabled={isAIProcessing}
                    className={`
                      relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      disabled:opacity-30
                      ${isListening
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'hover:bg-white/[0.05] text-white/40 hover:text-white/70 border border-transparent'
                      }
                    `}
                    title={isListening ? 'Stop listening' : 'Push to Talk (Hold Shift)'}
                  >
                    {isListening ? (
                      <>
                        <AudioLines className="w-5 h-5 animate-pulse" />
                        <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 animate-ping opacity-20" />
                      </>
                    ) : (
                      <AudioLines className="w-5 h-5" />
                    )}
                  </button>
                )}

                {/* Send / Stop button */}
                <button
                  onClick={() => {
                    if (isAIProcessing) {
                      useAppStore.getState().setAIProcessing(false);
                    } else {
                      handleSend();
                    }
                  }}
                  disabled={!input.trim() && !isAIProcessing}
                  className={`relative shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${isAIProcessing ? 'bg-red-500/10 border border-red-500/20 text-red-400' : ''}`}
                  style={{
                    background: !isAIProcessing && input.trim()
                      ? 'linear-gradient(180deg, #2e2e2e 0%, #141414 100%)'
                      : isAIProcessing ? '' : 'transparent',
                    boxShadow: !isAIProcessing && input.trim()
                      ? 'inset 0 2px 2px rgba(255,255,255,0.15), inset 0 -2px 8px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.9)'
                      : 'none',
                    border: !isAIProcessing && input.trim()
                      ? '1px solid rgba(255,255,255,0.08)'
                      : isAIProcessing ? '' : '1px solid transparent',
                  }}
                >
                  {isAIProcessing ? (
                    <div className="w-3 h-3 bg-red-400 rounded-sm animate-pulse" />
                  ) : (
                    <Send className="w-4 h-4 text-white/70" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))' }} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status indicators */}
      {isListening && (
        <div className="flex items-center gap-2 mt-3 ml-2 animate-in fade-in duration-300">
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-xs text-red-400/70 font-light">Listening — speak naturally, then click send or stop</span>
        </div>
      )}
    </div>
  );
}
