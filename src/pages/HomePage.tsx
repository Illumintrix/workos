import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../store';
import { ConversationArea } from '../components/conversation/ConversationArea';

export function HomePage() {
  const { id } = useParams();
  const selectConversation = useAppStore(state => state.selectConversation);

  useEffect(() => {
    selectConversation(id || null);
  }, [id, selectConversation]);
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
      {/* Background ambient effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative z-10 animate-in fade-in duration-700">
        <ConversationArea />
      </div>
    </div>
  );
}
