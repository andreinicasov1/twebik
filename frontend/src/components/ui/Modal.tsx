import { ReactNode, useEffect } from 'react';

export function Modal({ open, title, onClose, children }: {
  open: boolean; title: string; onClose: () => void; children: ReactNode;
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative cyber-card w-full max-w-lg p-5 shadow-neon">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-neon-300 font-semibold">{title}</h3>
          <button onClick={onClose} className="text-cyber-muted hover:text-neon-300">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
