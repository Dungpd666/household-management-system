import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type ToastType = 'success' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const playSuccessChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx: AudioContext = new AudioCtx();
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    gain.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.connect(gain);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.05);
    osc2.connect(gain);

    osc1.start(now);
    osc1.stop(now + 0.22);

    osc2.start(now + 0.05);
    osc2.stop(now + 0.25);

    // cleanup
    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        // ignore
      }
    }, 400);
  } catch {
    // ignore audio failures
  }
};

const ToastPopup = ({ toast, onDone }: { toast: ToastItem; onDone: () => void }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const auto = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(onDone, 180);
    }, 1600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(auto);
    };
  }, [onDone]);

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-24 pointer-events-none">
      <div
        className={
          `pointer-events-none rounded-2xl border border-border bg-white/90 backdrop-blur px-5 py-4 shadow-card ` +
          `transition-all duration-300 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16'}`
        }
      >
        <div className="flex items-center gap-3">
          <div className={isSuccess ? 'text-emerald-600' : 'text-red-600'}>
            {isSuccess ? (
              <svg width="36" height="36" viewBox="0 0 52 52" className="toast-icon" aria-hidden="true">
                <circle className="toast-icon__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="toast-icon__success" fill="none" d="M14 27l7 7 17-17" />
              </svg>
            ) : (
              <svg width="36" height="36" viewBox="0 0 52 52" className="toast-icon" aria-hidden="true">
                <circle className="toast-icon__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="toast-icon__error" fill="none" d="M17 17l18 18" />
                <path className="toast-icon__error" fill="none" d="M35 17L17 35" />
              </svg>
            )}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-textc-primary">{isSuccess ? 'Thành công' : 'Lỗi'}</div>
            <div className="text-[13px] text-textc-secondary truncate max-w-[320px]">{toast.message}</div>
          </div>
        </div>
      </div>

      <style>{`
        .toast-icon {
          display: block;
        }
        .toast-icon__circle {
          stroke: currentColor;
          stroke-width: 3.5;
          stroke-linecap: round;
          stroke-dasharray: 157;
          stroke-dashoffset: 157;
          animation: toast-stroke 420ms ease-out forwards;
        }
        .toast-icon__success {
          stroke: currentColor;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: toast-stroke 320ms 220ms ease-out forwards;
        }
        .toast-icon__error {
          stroke: currentColor;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 36;
          stroke-dashoffset: 36;
          animation: toast-stroke 280ms 220ms ease-out forwards;
        }
        @keyframes toast-stroke {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const lastIdRef = useRef(0);

  const clear = useCallback(() => setToast(null), []);

  const success = useCallback((message: string) => {
    lastIdRef.current += 1;
    setToast({ id: String(lastIdRef.current), type: 'success', message });
    playSuccessChime();
  }, []);

  const error = useCallback((message: string) => {
    lastIdRef.current += 1;
    setToast({ id: String(lastIdRef.current), type: 'error', message });
  }, []);

  const value = useMemo(() => ({ success, error }), [success, error]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && <ToastPopup toast={toast} onDone={clear} />}
    </ToastContext.Provider>
  );
};
