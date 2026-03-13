import { motion } from 'framer-motion';

const FLOATING_ITEMS = [
  { emoji: '🎈', x: '5%', y: '15%', size: 'text-4xl', duration: 4 },
  { emoji: '🎈', x: '90%', y: '25%', size: 'text-3xl', duration: 3.5 },
  { emoji: '⭐', x: '15%', y: '70%', size: 'text-2xl', duration: 5 },
  { emoji: '⭐', x: '80%', y: '60%', size: 'text-2xl', duration: 4.5 },
  { emoji: '🌟', x: '50%', y: '10%', size: 'text-xl', duration: 3 },
  { emoji: '✨', x: '70%', y: '80%', size: 'text-xl', duration: 3.8 },
  { emoji: '✨', x: '25%', y: '45%', size: 'text-lg', duration: 4.2 },
  { emoji: '💫', x: '60%', y: '35%', size: 'text-lg', duration: 3.3 },
];

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {FLOATING_ITEMS.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.size} opacity-40`}
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
