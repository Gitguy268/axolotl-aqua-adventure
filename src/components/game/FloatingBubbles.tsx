import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export const FloatingBubbles = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const createBubble = () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: 100,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 1
    });

    // Create initial bubbles
    const initialBubbles = Array.from({ length: 8 }, createBubble);
    setBubbles(initialBubbles);

    // Add new bubbles periodically
    const interval = setInterval(() => {
      setBubbles(prev => {
        const filtered = prev.filter(bubble => bubble.y > -50);
        if (filtered.length < 12) {
          return [...filtered, createBubble()];
        }
        return filtered;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-bubble animate-bubble opacity-60"
          style={{
            left: `${bubble.x}%`,
            bottom: `${bubble.y}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDuration: `${4 / bubble.speed}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};