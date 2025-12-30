import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  /** Thời gian chạy animation (ms) */
  duration?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 400 }) => {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  const valueRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // Bắt đầu từ giá trị hiện đang hiển thị -> giá trị mới
    fromRef.current = 0;
    valueRef.current = value;
    startRef.current = null;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    const step = (timestamp: number) => {
      if (startRef.current === null) {
        startRef.current = timestamp;
      }
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const next = Math.round(fromRef.current + (valueRef.current - fromRef.current) * progress);
      setDisplay(next);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  return <span>{display.toLocaleString('vi-VN')}</span>;
};
