import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { chatbotApi } from '../../api/chatbotApi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Button } from '../ui/Button';
import { ChatMessage, type ChatMessageModel, TypingIndicator } from './ChatMessage';

type ChatPopupProps = {
  open: boolean;
  onClose: () => void;
  animated?: boolean;
  isAnimatingOut?: boolean;
};

const genId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const ChatPopup = ({ open, onClose, animated = true, isAnimatingOut = false }: ChatPopupProps) => {
  const toast = useToast();
  const { user } = useAuth();

  const userId = useMemo(() => (user?.userID ? String(user.userID) : undefined), [user?.userID]);

  const [messages, setMessages] = useState<ChatMessageModel[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    if (!open) return;
    scrollToBottom();
  }, [open, messages.length, sending]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const check = async () => {
      try {
        const res = await chatbotApi.health();
        if (!cancelled) setOnline(String(res.status).toLowerCase() === 'online');
      } catch {
        if (!cancelled) setOnline(false);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const pushMessage = (m: Omit<ChatMessageModel, 'id' | 'createdAt'>) => {
    setMessages((prev) => [...prev, { ...m, id: genId(), createdAt: Date.now() }]);
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;

    setDraft('');
    pushMessage({ role: 'user', text });

    setSending(true);
    try {
      const res = await chatbotApi.send({ message: text, userId });
      const reply = (res.text || '').trim();
      pushMessage({ role: 'ai', text: reply || 'Mình chưa nhận được phản hồi hợp lệ từ server.' });
    } catch (err: any) {
      const msg = err?.message || 'Không gửi được tin nhắn';
      toast.error(msg);
      pushMessage({ role: 'system', text: `Lỗi: ${msg}` });
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!open && !isAnimatingOut) return null;

  const statusText = online === null ? 'Đang kiểm tra…' : online ? 'Online' : 'Offline';
  const statusCls =
    online === null
      ? 'text-textc-faint'
      : online
        ? 'text-emerald-700'
        : 'text-amber-700';
  const dotCls =
    online === null
      ? 'bg-slate-300'
      : online
        ? 'bg-emerald-500'
        : 'bg-amber-500';

  const animClass = animated
    ? isAnimatingOut
      ? 'chat-pop-out'
      : open
        ? 'chat-pop'
        : ''
    : '';

  return (
    <div
      className={`fixed bottom-20 right-5 z-40 w-[360px] max-w-[calc(100vw-2.5rem)] ${animClass}`.trim()}
      style={{ transformOrigin: 'bottom right' }}
    >
      <div className="rounded-xl border border-border bg-white shadow-deep overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-blue-50 via-purple-50 to-amber-50">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[16px]">🤖</span>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-textc-primary truncate">Trợ lý AI</div>
              <div className={`text-[11px] ${statusCls}`}>
                <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 align-middle ${dotCls}`} />
                {statusText}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-textc-secondary hover:text-textc-primary hover:bg-surface-muted transition"
            aria-label="Đóng"
            title="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div ref={listRef} className="px-4 py-3 h-[360px] overflow-y-auto bg-white space-y-2">
          {messages.length === 0 ? (
            <div className="text-[12px] text-textc-faint">
              Hãy nhập câu hỏi để bắt đầu trò chuyện.
            </div>
          ) : (
            messages.map((m) => <ChatMessage key={m.id} message={m} />)
          )}

          {sending && <TypingIndicator />}
        </div>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-border bg-white">
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Nhập tin nhắn…"
              className="flex-1 resize-none border border-border rounded-xl px-3 py-2 text-[13px] bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400/30"
            />
            <Button
              type="button"
              size="sm"
              onClick={send}
              disabled={sending || draft.trim().length === 0}
              variant="primary"
              className="rounded-xl"
            >
              Gửi
            </Button>
          </div>
          <div className="mt-2 text-[11px] text-textc-faint px-1">
            Enter để gửi • Shift+Enter để xuống dòng
          </div>
        </div>
      </div>
    </div>
  );
};
