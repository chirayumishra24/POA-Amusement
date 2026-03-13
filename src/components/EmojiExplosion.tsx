import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const EMOJIS = ['🎉', '⭐', '🌟', '✨', '💫', '🎊', '🥳', '🎆', '💥', '🔥'];

interface Props {
  trigger: boolean;
  emoji?: string;
}

export default function EmojiExplosion({ trigger, emoji }: Props) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string; angle: number; distance: number }[]>([]);

  useEffect(() => {
    if (trigger) {
      setParticles(
        Array.from({ length: 20 }, (_, i) => ({
          id: i,
          x: 50 + (Math.random() - 0.5) * 30,
          y: 50 + (Math.random() - 0.5) * 20,
          emoji: emoji || EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          angle: (i / 20) * 360,
          distance: 80 + Math.random() * 120,
        }))
      );
      const timer = setTimeout(() => setParticles([]), 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger, emoji]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute text-2xl"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
            x: Math.cos(p.angle * Math.PI / 180) * p.distance,
            y: Math.sin(p.angle * Math.PI / 180) * p.distance - 50,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
