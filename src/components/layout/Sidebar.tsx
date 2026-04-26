import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import {
  Home,
  Inbox,
  CheckSquare,
  FileText,
  GitBranch,
  RefreshCw,
  Clock,
  Briefcase,
  Search,

  ChevronLeft,
  Layers,
  LogOut,
  User as UserIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { SettingsModal } from '../settings/SettingsModal';
import { ChatHistory } from './ChatHistory';

const navItems = [
  { path: '/app', label: 'Home', icon: Home },
  { path: '/inbox', label: 'Inbox', icon: Inbox },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/notes', label: 'Notes', icon: FileText },
  { path: '/decisions', label: 'Decisions', icon: GitBranch },
  { path: '/reflections', label: 'Reflections', icon: RefreshCw },
  { path: '/timeline', label: 'Timeline', icon: Clock },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    isSidebarCollapsed, 
    toggleSidebar, 
    settings, 
    setSettingsOpen, 
    isSettingsOpen, 
    signOut, 
    user,
    setSearchModalOpen 
  } = useAppStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchModalOpen, toggleSidebar]);

  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isCollapseHovered, setIsCollapseHovered] = useState(false);

  return (
    <>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      {/* Mobile overlay */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed lg:relative z-50 h-screen flex flex-col
          bg-[#0a0a0a]/95 backdrop-blur-xl
          border-r border-white/[0.04]
          transition-all duration-300 ease-out
          ${isSidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-[72px]' : 'translate-x-0 w-[240px]'}
        `}
        style={{
          boxShadow: '1px 0 20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />

        {/* Logo / Brand */}
        <div className={`relative z-10 flex items-center h-[60px] px-5 border-b border-white/[0.04] transition-all duration-300 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              onClick={() => isSidebarCollapsed && toggleSidebar()}
              className={`
                relative w-8 h-8 rounded-xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center shrink-0 transition-all duration-300
                ${isSidebarCollapsed ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-default'}
              `}
              style={{
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {isSidebarCollapsed && isLogoHovered ? (
                <PanelLeftOpen className="w-4 h-4 text-white/90 animate-in fade-in zoom-in-50 duration-200" />
              ) : (
                <Layers className="w-4 h-4 text-white/90" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }} />
              )}
            </button>
            
            {!isSidebarCollapsed && (
              <span
                className="text-sm font-normal text-white tracking-tight animate-in fade-in slide-in-from-left-2 duration-300"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
              >
                Vela
              </span>
            )}
          </div>

          {!isSidebarCollapsed && (
            <div className="relative group">
              <button
                onClick={toggleSidebar}
                onMouseEnter={() => setIsCollapseHovered(true)}
                onMouseLeave={() => setIsCollapseHovered(false)}
                className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>

              {/* Tooltip */}
              {isCollapseHovered && (
                <div 
                  className="absolute left-full ml-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl z-[100] whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200"
                >
                  <span className="text-xs text-white/80 font-light">Collapse sidebar</span>
                  <div className="flex gap-0.5">
                    <span className="flex items-center justify-center w-4 h-4 rounded bg-white/10 text-[10px] text-white/60 font-mono">⌘</span>
                    <span className="flex items-center justify-center w-4 h-4 rounded bg-white/10 text-[10px] text-white/60 font-mono">.</span>
                  </div>
                  {/* Arrow */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-[#0a0a0a] z-10" />
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[7px] border-transparent border-r-white/10 -mr-[1px]" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Utility Header — Only visible when expanded */}
        {!isSidebarCollapsed && (
          <div className="px-3 pt-4 pb-2 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
            {/* Project Button - Wide Pill */}
            <button
              onClick={() => navigate('/projects')}
              className="
                flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl
                bg-gradient-to-b from-white/[0.05] to-transparent
                border border-white/[0.08]
                hover:bg-white/[0.08] hover:border-white/[0.12]
                transition-all group active:scale-[0.98]
              "
              style={{
                boxShadow: '0 2px 8px -2px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)',
              }}
            >
              <Layers className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" />
              <span className="text-[12px] font-medium text-white/50 group-hover:text-white/80 tracking-tight">Projects</span>
            </button>

            {/* Search Button - Compact Pill */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="
                flex items-center gap-2 px-3 py-2 rounded-xl
                bg-gradient-to-b from-white/[0.05] to-transparent
                border border-white/[0.08]
                hover:bg-white/[0.08] hover:border-white/[0.12]
                transition-all group active:scale-[0.98]
              "
              style={{
                boxShadow: '0 2px 8px -2px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)',
              }}
            >
              <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" />
              <div className="flex gap-0.5 opacity-30 group-hover:opacity-100 transition-opacity">
                <span className="flex items-center justify-center w-4 h-4 rounded-md bg-white/10 text-[9px] text-white/60 font-mono border border-white/5 shadow-sm">⌘</span>
                <span className="flex items-center justify-center w-4 h-4 rounded-md bg-white/10 text-[9px] text-white/60 font-mono border border-white/5 shadow-sm">K</span>
              </div>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="relative z-10 flex flex-col gap-1 px-3 pt-0 pb-4 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 w-full rounded-xl transition-all duration-200
                  ${isSidebarCollapsed ? 'p-3 justify-center' : 'px-3 py-2.5'}
                  ${isActive 
                    ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/[0.05]' 
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'}
                `}
              >
                <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : ''}`} />
                {!isSidebarCollapsed && (
                  <span className={`text-sm tracking-tight ${isActive ? 'font-medium' : 'font-light'}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>


        {/* Chat History */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <ChatHistory isCollapsed={isSidebarCollapsed} />
        </div>

        {/* Bottom section — user + settings */}
        <div className="relative z-10 border-t border-white/[0.04] px-3 py-4 flex flex-col gap-2">
          {/* User Avatar & Menu */}
          <div className="relative">
            {isUserMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div 
                  className={`
                    absolute bottom-full mb-2 z-50
                    bg-[#1a1a1a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden
                    animate-in slide-in-from-bottom-2 duration-200
                    ${isSidebarCollapsed ? 'left-0 w-48' : 'left-0 right-0'}
                  `}
                  style={{ boxShadow: '0 12px 32px -4px rgba(0,0,0,0.5)' }}
                >
                  <div className="p-2 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setSettingsOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-light text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                        navigate('/auth');
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-light text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`
                flex items-center gap-3 w-full rounded-xl transition-all duration-200
                ${isSidebarCollapsed ? 'justify-center p-2' : 'px-3 py-2.5'}
                hover:bg-white/[0.03]
              `}
            >
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-b from-[#444] to-[#222] flex items-center justify-center text-xs text-white/90 shrink-0 overflow-hidden"
                style={{
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {settings.avatarUrl ? (
                  <img src={settings.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  settings.name ? settings.name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U')
                )}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col min-w-0 items-start">
                  <span className="text-sm text-white font-normal tracking-tight truncate">
                    {settings.name || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <span className="text-[10px] text-white/40 font-light truncate">
                    {settings.role || 'Active'}
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>


      </aside>
    </>
  );
}
