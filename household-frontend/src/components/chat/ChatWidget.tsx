import { useRef, useState } from 'react';
import { ChatButton } from './ChatButton';
import { ChatPopup } from './ChatPopup';

type ChatWidgetProps = {
  animated?: boolean;
};

export const ChatWidget = ({ animated = true }: ChatWidgetProps) => {
  const [open, setOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const buttonRef = useRef<{ triggerBounce: () => void } | null>(null);

  const handleToggle = () => {
    if (open) {
      if (animated) {
        setIsAnimatingOut(true);
        setTimeout(() => {
          setIsAnimatingOut(false);
          setOpen(false);
        }, 260);
      } else {
        setOpen(false);
      }
    } else {
      setOpen(true);
    }
  };

  const handlePopupClose = () => {
    handleToggle();
  };

  return (
    <>
      <ChatPopup
        open={open}
        onClose={handlePopupClose}
        animated={animated}
        isAnimatingOut={isAnimatingOut}
      />
      <ChatButton
        isOpen={open}
        onClick={handleToggle}
        animated={animated}
      />
    </>
  );
};
