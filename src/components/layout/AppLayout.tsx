import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';
import { AmbientBackground } from '../AmbientBackground';
import { useAppStore } from '../../store';
import { Menu } from 'lucide-react';
import { CommandPalette } from '../search/CommandPalette';
import { ChatBrowser } from '../conversation/ChatBrowser';
import { ApiKeyPromptModal } from '../settings/ApiKeyPromptModal';

export function AppLayout() {
  const { toggleSidebar } = useAppStore();

  return (
    <div className="relative min-h-screen text-white antialiased font-sans bg-[#050505]">
      <AmbientBackground />
      <CommandPalette />
      <ApiKeyPromptModal />
      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Zone 1: Left Sidebar */}
        <Sidebar />
        <ChatBrowser />

        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-all"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Zone 2: Center — Main Workspace */}
        <main className="flex-1 overflow-hidden flex flex-col relative min-h-0">
          <Outlet />
        </main>

        {/* Zone 3: Right Panel — AI Output */}
        <RightPanel />
      </div>
    </div>
  );
}
