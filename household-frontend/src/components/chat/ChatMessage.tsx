import type { ReactNode } from 'react';

export type ChatRole = 'user' | 'ai' | 'system';

export type ChatMessageModel = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: number;
};

export const ChatMessage = ({ message }: { message: ChatMessageModel }) => {
  const isUser = message.role === 'user';
  const isAi = message.role === 'ai';

  const bubbleBase =
    'max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-[13px] leading-5 border';

  const bubbleCls = isUser
    ? `${bubbleBase} bg-blue-50 text-blue-900 border-blue-100`
    : isAi
      ? `${bubbleBase} bg-purple-50 text-purple-900 border-purple-100`
      : `${bubbleBase} bg-amber-50 text-amber-900 border-amber-100`;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={bubbleCls}>{message.text}</div>
    </div>
  );
};

export const TypingIndicator = ({ leftSlot }: { leftSlot?: ReactNode }) => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-5 border bg-purple-50 text-purple-900 border-purple-100">
        <div className="flex items-center gap-2">
          {leftSlot}
          <span className="text-[12px]">Đang trả lời…</span>
        </div>
      </div>
    </div>
  );
};
