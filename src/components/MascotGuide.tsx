import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Props {
  message: string;
  emoji?: string;
  position?: 'left' | 'right';
  autoHide?: number;
}

export default function MascotGuide({ message, emoji = '🦊', position = 'left', autoHide }: Props) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    setVisible(true);
    if (autoHide) {
      const timer = setTimeout(() => setVisible(false), autoHide);
      return () => clearTimeout(timer);
    }
  }, [message, autoHide]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed bottom-6 ${position === 'left' ? 'left-4' : 'right-4'} z-40 flex items-end gap-2 max-w-xs`}
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <motion.div
            className="text-5xl cursor-pointer select-none"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => setVisible(false)}
          >
            {emoji}
          </motion.div>
          <motion.div
            className="glass-card px-4 py-3 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {/* Speech bubble tail */}
            <div className="absolute -bottom-1 left-4 w-3 h-3 bg-card/90 rotate-45 border-b border-r border-border/50" />
            <p className="font-body text-sm font-semibold text-foreground leading-snug">
              {message}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
