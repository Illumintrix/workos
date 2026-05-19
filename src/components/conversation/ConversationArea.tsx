import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../store';
import { AIMessage } from './AIMessage';
import { UserMessage } from './UserMessage';
import { MessageInput } from './MessageInput';
import { sendMessageToAI } from '../../engine/aiEngine';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, Link } from 'react-router-dom';
import { CustomDialog } from '../ui/CustomDialog';
import { TodayTasks } from '../today/TodayTasks';
import { TaskAddModal } from '../tasks/TaskAddModal';
import { TaskDetailModal } from '../tasks/TaskDetailModal';
import { History, Brain } from 'lucide-react';
import { DynamicLoader } from '../ui/DynamicLoader';

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
    selectedConversationId,
    addConversation,
    updateConversation,
    conversations,
    isAIProcessing,
  } = useAppStore();

  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversationId]);

  // Expose handleSendMessage to custom events (like morning briefing)
  const handleSendMessageRef = useRef<((content: string) => void) | undefined>(undefined);

  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });

  useEffect(() => {
    const handleMorningBriefing = () => {
      if (handleSendMessageRef.current) {
        handleSendMessageRef.current("[SYSTEM: The user just opened the app for the first time today. Generate a proactive morning briefing summarizing their pending tasks, open decisions, and suggesting a focus for the day. Keep it brief and friendly.]");
      }
    };
    window.addEventListener('trigger-morning-briefing', handleMorningBriefing);
    return () => window.removeEventListener('trigger-morning-briefing', handleMorningBriefing);
  }, []);

  const handleSendMessage = async (content: string) => {
    // Auto-create conversation if it's the first message
    let convId = selectedConversationId;
    if (!convId) {
      const title = content.split(' ').slice(0, 5).join(' ') + (content.split(' ').length > 5 ? '...' : '');
      await addConversation(title);
      const newConvId = useAppStore.getState().selectedConversationId;
      convId = newConvId;
      if (newConvId) {
        navigate(`/chat/${newConvId}`);
      }
    } else {
      // Rename if it's currently "Untitled Chat"
      const currentConv = conversations.find(c => c.id === convId);
      if (currentConv?.title === 'Untitled Chat') {
        const title = content.split(' ').slice(0, 5).join(' ') + (content.split(' ').length > 5 ? '...' : '');
        await updateConversation(convId, { title });
      }
    }

    // Add user message
    const userMessageId = uuidv4();
    const userMessage = {
      id: userMessageId,
      role: 'user' as const,
      content,
      conversationId: convId || undefined,
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
        conversationId: convId || undefined,
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

  const currentMessages = messages.filter(m => m.conversationId === selectedConversationId);
  const showEmptyState = !selectedConversationId;
  const recentConversation = conversations[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden bg-[#050505]">
      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto min-h-0 hide-scrollbar px-6 sm:px-10 lg:px-16 py-10"
      >
        {showEmptyState ? (
          <div className="max-w-4xl w-full mx-auto flex flex-col pt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Greeting */}
            <h1 className="text-4xl sm:text-5xl font-light text-white tracking-tight mb-12" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {getGreeting()}, <span className="font-semibold">{settings.name ? settings.name.split(' ')[0] : 'Rahul'}.</span>
            </h1>

            {/* Input Section */}
            <div className="w-full mb-8">
               {recentConversation && (
                 <Link 
                   to={`/chat/${recentConversation.id}`}
                   className="flex items-center gap-2.5 mb-4 ml-1 w-fit group/recent bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] px-3 py-1.5 rounded-full transition-all"
                 >
                   <History className="w-3.5 h-3.5 text-white/40 group-hover/recent:text-white/60 transition-colors" />
                   <div className="flex items-center gap-1.5 text-xs">
                     <span className="text-white/40 font-medium">Recent chat</span>
                     <span className="text-white/10 text-[8px]">•</span>
                     <span className="text-white/80 font-medium truncate max-w-[200px] sm:max-w-[400px]">
                       {recentConversation.title}
                     </span>
                   </div>
                 </Link>
               )}
               <MessageInput onSend={handleSendMessage} isInitial />
            </div>

            {/* Content Sections */}
            <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
              <TodayTasks 
                onAddTask={() => setIsTaskModalOpen(true)} 
                onTaskClick={(id) => setActiveTaskId(id)}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-3xl mx-auto relative group pt-10">
            <CustomDialog
              isOpen={showClearConfirm}
              onClose={() => setShowClearConfirm(false)}
              onConfirm={clearMessages}
              title="Clear Conversation"
              message="Are you sure you want to clear the current conversation history? This action cannot be undone."
              type="danger"
              confirmLabel="Clear Chat"
            />

            {currentMessages.map((message) => (
              message.role === 'assistant' ? (
                <AIMessage key={message.id} content={message.content} timestamp={message.timestamp} />
              ) : (
                <UserMessage key={message.id} content={message.content} timestamp={message.timestamp} />
              )
            ))}
            
            {isAIProcessing && (
              <div className="flex items-center gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div
                  className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center shrink-0"
                  style={{
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <Brain className="w-4 h-4 text-amber-400/80" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }} />
                </div>
                <DynamicLoader />
              </div>
            )}

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

      {/* Root-level Modals to avoid clipping */}
      <TaskAddModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />
      
      <TaskDetailModal 
        taskId={activeTaskId} 
        onClose={() => setActiveTaskId(null)} 
      />
    </div>
  );
}

