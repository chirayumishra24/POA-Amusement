import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const COLORS = ['hsl(355, 80%, 55%)', 'hsl(195, 85%, 50%)', 'hsl(145, 60%, 45%)', 'hsl(45, 95%, 55%)', 'hsl(270, 70%, 55%)', 'hsl(25, 95%, 55%)', 'hsl(330, 80%, 60%)'];
const SHAPES = ['rounded-sm', 'rounded-full', 'rounded-none'];

export default function Confetti({ trigger }: { trigger: boolean }) {
  const [pieces, setPieces] = useState<{ id: number; x: number; color: string; delay: number; size: number; shape: string; rotation: number }[]>([]);

  useEffect(() => {
    if (trigger) {
      setPieces(
        Array.from({ length: 50 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: Math.random() * 0.8,
          size: 6 + Math.random() * 10,
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          rotation: Math.random() * 360,
        }))
      );
      const timer = setTimeout(() => setPieces([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!pieces.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className={`absolute ${p.shape}`}
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size * (p.shape === 'rounded-none' ? 0.6 : 1),
            backgroundColor: p.color,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: '100vh',
            rotate: [p.rotation, p.rotation + 720],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 2 + Math.random(), delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}
