
import React, { useMemo } from 'react';

const Snowfall: React.FC = () => {
  const snowflakes = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 20}s`,
      opacity: 0.3 + Math.random() * 0.7,
      size: `${10 + Math.random() * 15}px`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {snowflakes.map((s) => (
        <div
          key={s.id}
          className="snowflake"
          style={{
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.duration,
            opacity: s.opacity,
            fontSize: s.size,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowfall;
