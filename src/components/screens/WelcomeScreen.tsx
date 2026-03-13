import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { GameScreen } from '@/hooks/useGameState';
import AvatarSelection from '@/components/AvatarSelection';
import { useSound } from '@/hooks/useSound';

interface Props {
  onNavigate: (screen: GameScreen) => void;
  selectedAvatarId: string;
  setSelectedAvatarId: (id: string) => void;
}

const FLOATING_EMOJIS = [
  { emoji: '🎢', x: '10%', y: '20%', size: 40, delay: 0 },
  { emoji: '🎡', x: '85%', y: '15%', size: 35, delay: 0.2 },
  { emoji: '🎠', x: '15%', y: '75%', size: 30, delay: 0.4 },
  { emoji: '🍿', x: '80%', y: '80%', size: 25, delay: 0.6 },
  { emoji: '🎟️', x: '50%', y: '10%', size: 32, delay: 0.8 },
  { emoji: '🍦', x: '90%', y: '60%', size: 28, delay: 0.5 },
  { emoji: '🎯', x: '18%', y: '30%', size: 28, delay: 1.1 },
];

export default function WelcomeScreen({ onNavigate, selectedAvatarId, setSelectedAvatarId }: Props) {
  const [showAvatarSelect, setShowAvatarSelect] = useState(false);
  const { playSound } = useSound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden sparkle-bg">
      {/* Animated background emojis */}
      {FLOATING_EMOJIS.map((item, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none"
          initial={{ opacity: 0, x: item.x, y: item.y }}
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            y: ['0%', '-5%', '0%'],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 4, 
            delay: item.delay, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ left: item.x, top: item.y, fontSize: item.size }}
        >
          {item.emoji}
        </motion.div>
      ))}

      <div className="max-w-4xl w-full text-center z-10">
        <AnimatePresence mode="wait">
          {!showAvatarSelect ? (
            <motion.div
              key="welcome-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8"
            >
              <motion.div
                className="mb-4 relative inline-block"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <span className="text-[100px] md:text-[120px] block leading-none">🎪</span>
                <motion.span
                  className="absolute -top-2 -right-4 text-3xl"
                  animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </motion.div>

              <div className="space-y-4">
                <h1 className="font-display text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-purple to-secondary bg-clip-text text-transparent drop-shadow-sm pb-2">
                  Amusement Park<br />Adventure
                </h1>
                <p className="font-body text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  Join Skilli and friends on the ultimate trip planning mission! 🎢 Stay in budget and build the perfect day.
                </p>
              </div>

              <motion.button
                onClick={() => {
                  playSound('click');
                  setShowAvatarSelect(true);
                }}
                className="group relative px-12 py-5 bg-gradient-to-r from-primary to-purple rounded-3xl font-display text-2xl font-bold text-white shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2">
                  Start Adventure 🎡
                </span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="avatar-select"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <AvatarSelection 
                selectedId={selectedAvatarId} 
                onSelect={(id) => {
                  playSound('select');
                  setSelectedAvatarId(id);
                }} 
                onConfirm={() => {
                  playSound('success');
                  onNavigate('learn');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
