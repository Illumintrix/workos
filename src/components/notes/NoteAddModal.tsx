import { useState } from 'react';
import { X, AudioLines, Loader2, Plus, FileText } from 'lucide-react';
import { useAppStore } from '../../store';
import { extractSingleItem } from '../../engine/aiEngine';
import { v4 as uuidv4 } from 'uuid';
import { CustomDialog } from '../ui/CustomDialog';
import type { Note } from '../../store/types';

interface NoteAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NoteAddModal({ isOpen, onClose }: NoteAddModalProps) {
  const { addNote } = useAppStore();
  const [addText, setAddText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showError, setShowError] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setShowError({ show: true, message: 'Speech recognition is not supported in this browser. Please try using Chrome or Edge.' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAddText(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.start();
  };

  const handleManualAdd = async () => {
    if (!addText.trim()) return;
    setIsExtracting(true);
    try {
      const extracted = await extractSingleItem(addText, 'note');
      if (extracted) {
        const newNote: Note = {
          id: uuidv4(),
          title: extracted.title || 'Untitled Note',
          content: extracted.content || addText,
          category: extracted.category || 'General',
          tags: extracted.tags || [],
          linkedTaskIds: [],
          linkedDecisionIds: [],
          sourceMessageId: null,
          projectId: extracted.projectId || null,
          aiConfidence: 'high',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addNote(newNote);
        onClose();
        setAddText('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtracting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div 
          className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.05] rounded-3xl p-8 w-full max-w-lg relative animate-in zoom-in-95 duration-300 overflow-hidden"
          style={{
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8), 0 24px 48px -12px rgba(0,0,0,0.9)'
          }}
        >
          {/* Background Texture (Radial Dots) */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              opacity: 0.015
            }}
          />

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/20 hover:text-white transition-all hover:rotate-90 duration-300 z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2 z-10">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <h3 
              className="text-xl font-normal text-white tracking-tight"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            >
              Add a Note
            </h3>
          </div>
          <p className="text-sm text-white/40 font-light mb-8 leading-relaxed z-10">
            Type naturally. The AI will extract the title, content, and category.
          </p>
          
          <div className="relative mb-8 group z-10">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-white/[0.05] to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <textarea
              value={addText}
              onChange={(e) => setAddText(e.target.value)}
              placeholder="e.g., Had a meeting with the client today. We discussed the new API architecture and decided to use GraphQL..."
              className="relative w-full h-36 bg-black/40 border border-white/[0.05] rounded-2xl p-5 pr-14 text-white text-sm focus:outline-none focus:border-white/20 resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all placeholder:text-white/10 font-light leading-relaxed"
              autoFocus
            />
            <button
              onClick={startListening}
              className={`absolute bottom-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-110' 
                  : 'bg-white/5 text-white/20 hover:text-white/50 border border-transparent hover:bg-white/10'
              }`}
              title={isListening ? "Stop listening" : "Voice Dictation"}
            >
              {isListening ? (
                <AudioLines className="w-5 h-5 animate-pulse" />
              ) : (
                <AudioLines className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex justify-end items-center gap-6 z-10">
            <button
              onClick={onClose}
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleManualAdd}
              disabled={!addText.trim() || isExtracting}
              className="px-6 py-2.5 bg-gradient-to-b from-[#2e2e2e] to-[#141414] text-white text-xs font-medium rounded-xl transition-all flex items-center gap-2.5 disabled:opacity-50 disabled:grayscale border border-white/[0.05] active:scale-95"
              style={{
                boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.15), inset 0 -2px 8px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.9)'
              }}
            >
              {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" strokeWidth={3} />}
              {isExtracting ? 'Extracting...' : 'Add Note'}
            </button>
          </div>
        </div>
      </div>
      <CustomDialog
        isOpen={showError.show}
        onClose={() => setShowError({ show: false, message: '' })}
        title="Voice Capture Unavailable"
        message={showError.message}
        type="danger"
      />
    </>
  );
}
