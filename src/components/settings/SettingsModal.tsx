import { useState, useRef } from 'react';
import { X, Settings, User, Shield, Zap, Trash2, Mail, Globe, Lock, AlertTriangle, CheckCircle2, Camera, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store';
import { supabase } from '../../lib/supabase';
import { CustomDialog } from '../ui/CustomDialog';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'profile' | 'account' | 'intelligence' | 'danger';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, user, resetUserData } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorAlert, setErrorAlert] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!isOpen) return null;

  const handleReset = async () => {
    setIsResetting(true);
    await resetUserData();
    setIsResetting(false);
    setShowResetConfirm(false);
    setSuccessMessage('Workspace reset successfully');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateSettings({ avatarUrl: publicUrl });
      setSuccessMessage('Avatar updated successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setErrorAlert({ 
        show: true, 
        message: 'Failed to upload avatar. Please ensure the "avatars" bucket exists in your Supabase storage and is public.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'intelligence', label: 'Intelligence', icon: Zap },
    { id: 'danger', label: 'Danger Zone', icon: Trash2, danger: true },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div 
        className="bg-[#0f0f0f] border border-white/[0.08] rounded-[32px] w-full max-w-3xl h-[640px] shadow-2xl flex overflow-hidden animate-in zoom-in-95 duration-300 relative"
        style={{ boxShadow: '0 32px 64px -16px rgba(0,0,0,0.8)' }}
      >
        {/* Success Toast relocated to bottom center of screen */}
        {showSuccess && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2.5 rounded-full flex items-center gap-2 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-300">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-light tracking-tight">{successMessage}</span>
          </div>
        )}

        {/* Sidebar */}
        <div className="w-64 border-r border-white/[0.05] bg-white/[0.01] p-6 flex flex-col gap-1">
          <div className="flex items-center gap-3 px-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Settings className="w-4 h-4 text-white/70" />
            </div>
            <h2 className="text-sm font-medium text-white tracking-tight">Settings</h2>
          </div>
          
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                ${activeTab === tab.id 
                  ? 'bg-white/10 text-white shadow-sm border border-white/10' 
                  : tab.danger 
                    ? 'text-red-400/50 hover:text-red-400 hover:bg-red-400/5'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.02]'}
              `}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span className="font-light tracking-tight">{tab.label}</span>
            </button>
          ))}

          <div className="mt-auto px-3 py-4 opacity-0">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-white/20 uppercase tracking-widest font-medium">Vela OS v1.0</span>
              <span className="text-[10px] text-white/10 font-light">Build 2026.04.24</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-transparent to-white/[0.01]">
          <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
            <div className="flex flex-col">
              <h3 className="text-xl font-medium text-white tracking-tight capitalize">{activeTab}</h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
            {activeTab === 'profile' && (
              <div className="flex flex-col gap-10 max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 flex items-center justify-center text-3xl text-white/90 shadow-2xl overflow-hidden backdrop-blur-md transition-transform group-hover:scale-[1.02] duration-300">
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-white/20" />
                      ) : settings.avatarUrl ? (
                        <img src={settings.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        settings.name ? settings.name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U')
                      )}
                      <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:scale-110 border border-white/10"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        {settings.avatarUrl && (
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              
                              // Try to delete from storage if it's a Supabase URL
                              if (settings.avatarUrl.includes('supabase')) {
                                try {
                                  const urlParts = settings.avatarUrl.split('/');
                                  const fileName = urlParts[urlParts.length - 1];
                                  await supabase.storage.from('avatars').remove([fileName]);
                                } catch (err) {
                                  console.error('Error deleting file from storage:', err);
                                }
                              }

                              await updateSettings({ avatarUrl: '' });
                              setSuccessMessage('Avatar removed');
                              setShowSuccess(true);
                              setTimeout(() => setShowSuccess(false), 3000);
                            }}
                            className="p-2.5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all transform hover:scale-110 border border-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-xl text-white font-medium tracking-tight leading-none">{settings.name || 'Set your name'}</h4>
                    <p className="text-sm text-white/20 font-light tracking-wide">{settings.role || 'No role defined'}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] ml-1">Display Name</label>
                    <input 
                      type="text" 
                      value={settings.name || ''}
                      onChange={(e) => updateSettings({ name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10 shadow-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] ml-1">Professional Role</label>
                    <input 
                      type="text" 
                      value={settings.role || ''}
                      onChange={(e) => updateSettings({ role: e.target.value })}
                      placeholder="e.g. Product Designer, Founder"
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="flex flex-col gap-10 max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4.5 flex items-center gap-4 transition-colors hover:border-white/10 group">
                      <Mail className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors" />
                      <span className="text-sm text-white/40 font-light truncate">{user?.email}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] ml-1">User Identifier</label>
                    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4.5 flex items-center gap-4 transition-colors hover:border-white/10 group">
                      <Shield className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors" />
                      <span className="text-[11px] text-white/20 font-mono truncate">{user?.id}</span>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-white/[0.04] space-y-6">
                    <label className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] ml-1">Regional Context</label>
                    <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.05] flex items-center justify-between transition-colors hover:border-white/10">
                      <div className="flex items-center gap-4">
                        <Globe className="w-4 h-4 text-white/10" />
                        <span className="text-sm text-white/40 font-light">Local Timezone</span>
                      </div>
                      <span className="text-xs text-white/20 font-mono bg-white/5 px-2 py-1 rounded-md">{settings.timezone}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'intelligence' && (
              <div className="flex flex-col gap-10 max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] ml-1">OpenRouter Access</label>
                      {!settings.openaiApiKey && (
                        <span className="text-[9px] text-green-500/40 bg-green-500/[0.03] border border-green-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest font-medium">Default Channel</span>
                      )}
                    </div>
                    <div className="relative group">
                      <input 
                        type="password" 
                        value={settings.openaiApiKey || ''}
                        onChange={(e) => updateSettings({ openaiApiKey: e.target.value })}
                        placeholder="sk-or-v1-..."
                        className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4.5 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10 font-mono"
                      />
                      <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none" />
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/5 space-y-4 transition-colors hover:border-amber-500/10">
                    <div className="flex items-center gap-3 text-amber-500/40">
                      <Shield className="w-4 h-4" />
                      <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Privacy Protocol</span>
                    </div>
                    <p className="text-xs text-white/20 leading-relaxed font-light">
                      Your keys are encrypted at rest and never shared. Custom endpoints enable advanced synthesis and reasoning models.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="flex flex-col gap-10 max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-8 rounded-[32px] bg-red-500/[0.02] border border-red-500/10 space-y-8 transition-colors hover:border-red-500/20">
                  <div className="flex items-center gap-3 text-red-500/40">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Destructive Operations</span>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xl text-white font-medium tracking-tight">Delete Workspace Data</h4>
                    <p className="text-sm text-white/30 leading-relaxed font-light">
                      This will permanently purge all tasks, notes, decisions, and projects from the database.
                    </p>
                  </div>
                  
                  {!showResetConfirm ? (
                    <button 
                      onClick={() => setShowResetConfirm(true)}
                      className="w-full px-6 py-4.5 rounded-2xl bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-all font-medium border border-red-500/10 tracking-tight"
                    >
                      Initialize Data Purge
                    </button>
                  ) : (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <p className="text-xs text-red-500 font-medium tracking-tight">Warning: This action is absolute and cannot be reversed.</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={handleReset}
                          disabled={isResetting}
                          className="flex-1 px-6 py-4 rounded-2xl bg-red-500 text-white text-sm hover:bg-red-600 transition-all disabled:opacity-50 font-medium shadow-2xl shadow-red-500/40"
                        >
                          {isResetting ? 'Purging...' : 'Confirm Destruction'}
                        </button>
                        <button 
                          onClick={() => setShowResetConfirm(false)}
                          className="px-6 py-4 rounded-2xl bg-white/5 text-white/40 text-sm hover:bg-white/10 transition-all font-medium border border-white/5"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CustomDialog
        isOpen={errorAlert.show}
        onClose={() => setErrorAlert({ show: false, message: '' })}
        title="Operation Failed"
        message={errorAlert.message}
        type="danger"
      />
    </div>
  );
}
