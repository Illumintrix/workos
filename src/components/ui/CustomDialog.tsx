import { createPortal } from 'react-dom';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'danger';
  confirmLabel?: string;
  cancelLabel?: string;
}

export function CustomDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel'
}: CustomDialogProps) {
  if (!isOpen) return null;

  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle2,
    danger: AlertTriangle
  };

  const IconComponent = icons[type];

  const colors = {
    info: 'border-blue-500/20 bg-blue-500/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
    success: 'border-emerald-500/20 bg-emerald-500/5',
    danger: 'border-red-500/20 bg-red-500/5'
  };

  const buttonColors = {
    info: 'bg-blue-500 text-white hover:bg-blue-600',
    warning: 'bg-amber-500 text-black hover:bg-amber-600',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg bg-[#0a0a0a] border border-white/[0.08] rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 p-2"
        style={{ boxShadow: '0 32px 64px -16px rgba(0,0,0,0.8)' }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-2 ${colors[type]} shadow-inner`}>
            <IconComponent className="w-7 h-7" />
          </div>
          
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 max-h-[300px] overflow-y-auto hide-scrollbar">
            <h3 className="text-xl font-medium text-white tracking-tight mb-2 leading-tight">{title}</h3>
            <p className="text-sm text-white/40 font-light leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 p-2">
          {onConfirm ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-[32px] bg-white/[0.03] text-white/40 text-sm font-light hover:bg-white/[0.08] transition-all border border-white/[0.05]"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-[1.5] px-6 py-4 rounded-[32px] text-sm font-medium transition-all shadow-xl ${buttonColors[type]}`}
              >
                {confirmLabel}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full px-6 py-4 rounded-[32px] bg-white text-black text-sm font-medium hover:bg-white/90 transition-all shadow-xl"
            >
              Understand
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
