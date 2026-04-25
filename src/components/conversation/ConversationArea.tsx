import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../store';
import { AIMessage } from './AIMessage';
import { UserMessage } from './UserMessage';
import { MessageInput } from './MessageInput';
import { sendMessageToAI } from '../../engine/aiEngine';
import { v4 as uuidv4 } from 'uuid';
import { Brain, Trash2, Sparkles } from 'lucide-react';
import { CustomDialog } from '../ui/CustomDialog';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function ConversationArea() {
  const {
    messages,
    addMessage,
    setAIProcessing,
    processExtractions,
    setRightPanelContent,
    clearMessages,
    settings,
  } = useAppStore();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessageId = uuidv4();
    const userMessage = {
      id: userMessageId,
      role: 'user' as const,
      content,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMessage);

    // Set processing state
    setAIProcessing(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map((m) => ({
        role: m.role,
        content: m.role === 'assistant' && m.extractions
          ? m.content // Just the conversational text, not the JSON
          : m.content,
      }));

      // Call AI
      const response = await sendMessageToAI(content, conversationHistory);

      // Add AI message
      const aiMessageId = uuidv4();
      const aiMessage = {
        id: aiMessageId,
        role: 'assistant' as const,
        content: response.message,
        extractions: response.extractions,
        timestamp: new Date().toISOString(),
      };
      addMessage(aiMessage);

      // Process extractions (add to store)
      const hasExtractions =
        response.extractions.tasks.length > 0 ||
        response.extractions.notes.length > 0 ||
        response.extractions.decisions.length > 0 ||
        response.extractions.reflections.length > 0 ||
        (response.extractions.deletions?.length ?? 0) > 0;

      if (hasExtractions) {
        processExtractions(response.extractions, aiMessageId);
      } else {
        setRightPanelContent(null);
      }
    } catch (error: any) {
      console.error('Failed to process message:', error);
      // Add error message
      addMessage({
        id: uuidv4(),
        role: 'assistant',
        content: `I ran into an issue processing that. ${error.message || 'Please try again.'}\n\nMake sure your OpenRouter API key is configured correctly in the .env file.`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setAIProcessing(false);
    }
  };

  const showEmptyState = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto min-h-0 hide-scrollbar px-4 sm:px-6 lg:px-8 py-6"
      >
        {showEmptyState ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 max-w-[1200px] mx-auto -mt-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-8 mb-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f87171]/20 to-[#fb923c]/20 flex items-center justify-center border border-white/5 shadow-2xl">
                <Brain className="w-9 h-9 text-[#fb923c]/80" />
              </div>
              <h1
                className="text-4xl sm:text-5xl font-semibold text-white tracking-tight"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}
              >
                {getGreeting()}{settings.name ? `, ${settings.name.split(' ')[0]}` : ''}
              </h1>
            </div>
            <p className="text-base sm:text-lg text-white/30 font-light mb-16 max-w-2xl leading-relaxed tracking-wide">
              Manage your tasks, decisions, and notes through a unified intelligence interface. Speak or type to capture your thoughts.
            </p>
            <div className="w-full">
               <MessageInput onSend={handleSendMessage} isInitial />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-3xl mx-auto relative group">
            {/* Header / Clear Chat button */}
            {/* Header / Clear Chat button */}
            <div className="flex items-center justify-between mb-8 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm shadow-sm group/header">
               <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-lg bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
                   <Sparkles className="w-3 h-3 text-amber-400/60" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/40">Context Engine</span>
                   <span className="text-[9px] text-white/20 font-light tracking-wide">Session History</span>
                 </div>
               </div>
               <button 
                 onClick={() => setShowClearConfirm(true)}
                 className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 font-light border border-transparent hover:border-red-400/20"
               >
                 <Trash2 className="w-3.5 h-3.5" />
                 Clear Chat
               </button>
            </div>

            <CustomDialog
              isOpen={showClearConfirm}
              onClose={() => setShowClearConfirm(false)}
              onConfirm={clearMessages}
              title="Clear Conversation"
              message="Are you sure you want to clear the current conversation history? This action cannot be undone."
              type="danger"
              confirmLabel="Clear Chat"
            />

            {messages.map((message) => (
              message.role === 'assistant' ? (
                <AIMessage key={message.id} content={message.content} timestamp={message.timestamp} />
              ) : (
                <UserMessage key={message.id} content={message.content} timestamp={message.timestamp} />
              )
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Persistent Input area when chat is active */}
      {!showEmptyState && (
        <div className="max-w-3xl mx-auto w-full pb-6">
          <MessageInput onSend={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
