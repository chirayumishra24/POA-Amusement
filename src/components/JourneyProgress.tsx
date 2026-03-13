import { motion } from 'framer-motion';
import type { GameScreen } from '@/hooks/useGameState';

const JOURNEY_STEPS: { screen: GameScreen; emoji: string; label: string }[] = [
  { screen: 'welcome', emoji: '🏠', label: 'Start' },
  { screen: 'learn', emoji: '📚', label: 'Learn' },
  { screen: 'quiz', emoji: '🧠', label: 'Quiz' },
  { screen: 'park', emoji: '🗺️', label: 'Plan' },
  { screen: 'itinerary', emoji: '📋', label: 'Build' },
  { screen: 'customize', emoji: '✨', label: 'Style' },
  { screen: 'summary', emoji: '🎉', label: 'Review' },
  { screen: 'present', emoji: '🎤', label: 'Show' },
];

interface Props {
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
}

export default function JourneyProgress({ currentScreen, onNavigate }: Props) {
  const currentIdx = JOURNEY_STEPS.findIndex(s => s.screen === currentScreen);
  
  return (
    <div className="fixed top-0 left-0 right-0 z-30 px-4 py-2">
      <div className="max-w-3xl mx-auto glass-card px-4 py-2">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-muted rounded-full -translate-y-1/2 z-0" />
          <motion.div
            className="absolute top-1/2 left-4 h-1 bg-gradient-to-r from-primary via-sunny to-accent rounded-full -translate-y-1/2 z-0"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIdx / (JOURNEY_STEPS.length - 1)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
          
          {JOURNEY_STEPS.map((step, i) => {
            const isActive = i === currentIdx;
            const isCompleted = i < currentIdx;
            const isClickable = i <= currentIdx;
            
            return (
              <motion.button
                key={step.screen}
                className={`relative z-10 flex flex-col items-center group ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => isClickable && onNavigate(step.screen)}
                whileHover={isClickable ? { scale: 1.15 } : {}}
                whileTap={isClickable ? { scale: 0.9 } : {}}
              >
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                    isActive
                      ? 'bg-primary shadow-lg ring-2 ring-primary/30'
                      : isCompleted
                      ? 'bg-accent shadow-md'
                      : 'bg-muted'
                  }`}
                  animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                  transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                >
                  {step.emoji}
                </motion.div>
                <span className={`text-[10px] font-display font-bold mt-0.5 ${
                  isActive ? 'text-primary' : isCompleted ? 'text-accent' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
