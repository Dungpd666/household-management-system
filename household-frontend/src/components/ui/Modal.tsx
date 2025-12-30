import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const [render, setRender] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  const [content, setContent] = useState<ReactNode>(children);

  // Giữ nguyên nội dung form trong suốt animation đóng
  useEffect(() => {
    if (isOpen) {
      setContent(children);
    }
  }, [isOpen, children]);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setClosing(false);
      return;
    }
    if (render) {
      setClosing(true);
      const timer = setTimeout(() => {
        setRender(false);
        setClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, render]);

  if (!render) return null;

  return (
    <div className="fixed inset-0 min-h-screen h-[100dvh] z-[9999] flex items-center justify-center pointer-events-none">
      {/* Overlay toàn màn hình */}
      <div
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-md transition-opacity duration-200 pointer-events-auto"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className={`relative z-[10000] w-full max-w-2xl px-4 pointer-events-auto ${closing ? 'animate-modal-pop-out' : 'animate-modal-pop'}`}>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50">
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            <button
              type="button"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-white/70 transition cursor-pointer"
              onClick={onClose}
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
          <div className="px-6 py-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};
