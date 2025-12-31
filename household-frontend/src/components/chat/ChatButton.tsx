import { useState } from 'react';

type ChatButtonProps = {
  isOpen: boolean;
  onClick: () => void;
  animated?: boolean;
  onAnimationEnd?: () => void;
};

export const ChatButton = ({ isOpen, onClick, animated = true, onAnimationEnd }: ChatButtonProps) => {
  const [pressed, setPressed] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const handleClick = () => {
    if (!animated) {
      onClick();
      return;
    }

    if (!isOpen) {
      setPressed(true);
      setTimeout(() => {
        setPressed(false);
        onClick();
      }, 100);
    } else {
      onClick();
    }
  };

  const handleBounce = () => {
    if (animated && isOpen) {
      setBouncing(true);
    }
  };

  const baseClasses =
    'fixed bottom-5 right-5 z-40 inline-flex items-center justify-center h-12 w-12 rounded-full ' +
    'bg-purple-600 text-white shadow-card hover:bg-purple-700 transition-colors ' +
    'focus:outline-none focus:ring-2 focus:ring-purple-300/50';

  const animClasses = animated
    ? `${!isOpen && !pressed ? 'chat-idle' : ''} ${pressed ? 'chat-btn-press' : ''} ${bouncing ? 'chat-btn-bounce' : ''}`
    : '';

  return (
    <button
      type="button"
      onClick={handleClick}
      onAnimationEnd={(e) => {
        if (e.animationName.includes('bounce')) {
          setBouncing(false);
          onAnimationEnd?.();
        }
      }}
      className={`${baseClasses} ${animClasses}`.trim()}
      style={{ transformOrigin: 'center' }}
      aria-label={isOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI'}
      title={isOpen ? 'Đóng trợ lý AI' : 'Trợ lý AI'}
    >
      <span className="text-[18px] leading-none">🤖</span>
    </button>
  );
};
