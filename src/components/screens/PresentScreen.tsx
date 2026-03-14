import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useSound } from '@/hooks/useSound';
import { AVATAR_OPTIONS, type ParkItem, type SouvenirDesign } from '@/lib/gameState';
import type { GameScreen } from '@/hooks/useGameState';

interface Props {
  tripName: string;
  teamColor: string;
  selectedParkItems: ParkItem[];
  itinerary: any[];
  totalSpent: number;
  remaining: number;
  browniePoints: number;
  hasBadge: boolean;
  onNavigate: (screen: GameScreen) => void;
  applauseCount: number;
  setApplauseCount: (c: number | ((prev: number) => number)) => void;
  selectedAvatarId: string;
  souvenirDesign: SouvenirDesign;
}

export default function PresentScreen({
  tripName, selectedParkItems, totalSpent, onNavigate,
  applauseCount, setApplauseCount, selectedAvatarId, souvenirDesign
}: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { playSound } = useSound();
  const avatar = AVATAR_OPTIONS.find(a => a.id === selectedAvatarId)!;

  const slides = [
    {
      title: "Our Epic Trip!",
      subtitle: `Welcome to the ${tripName || 'Amazing Park'} Trip!`,
      bg: "from-primary/20 to-purple/20",
      content: (
        <div className="text-center space-y-4">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            🎢
          </motion.div>
          <p className="text-xl font-body">We planned a trip with <strong>{selectedParkItems.length}</strong> awesome things!</p>
          <p className="text-lg font-display font-bold text-primary">Total Budget Spent: ₹{totalSpent}</p>
        </div>
      )
    },
    {
      title: "The Highlights",
      subtitle: "Check out what we picked!",
      bg: "from-secondary/20 to-accent/20",
      content: (
        <div className="grid grid-cols-4 gap-4">
          {selectedParkItems.slice(0, 8).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-4xl bg-white/50 p-3 rounded-2xl shadow-sm"
            >
              {item.emoji}
            </motion.div>
          ))}
          {selectedParkItems.length > 8 && <div className="text-xl font-bold flex items-center justify-center">+ {selectedParkItems.length - 8} more</div>}
        </div>
      )
    },
    {
      title: "Fun Riddles!",
      subtitle: "Can you solve these?",
      bg: "from-orange/20 to-pink/20",
      content: (
        <div className="space-y-4 text-left">
          <div className="p-4 bg-white/40 rounded-2xl border-2 border-orange/20">
            <p className="font-bold text-orange">Riddle 1:</p>
            <p className="font-body italic">"I go round and round, but never get anywhere. I have horses but no hay. What am I?"</p>
          </div>
          <div className="p-4 bg-white/40 rounded-2xl border-2 border-pink/20">
            <p className="font-bold text-pink">Riddle 2:</p>
            <p className="font-body italic">"I have a track but no train. I make you scream with joy and rain. What am I?"</p>
          </div>
        </div>
      )
    },
    {
      title: "Discussion Time",
      subtitle: "Let's talk about our trip!",
      bg: "from-primary/20 to-secondary/20",
      content: (
        <div className="text-center space-y-6">
          <p className="font-body text-lg italic">"Tell us: Why did you choose these rides? What was your favorite part of planning?"</p>
          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-3xl border-2 border-primary/20">
              <span className="text-4xl">👏</span>
              <div className="text-left">
                <p className="font-display font-bold text-primary">Applause Meter</p>
                <p className="text-2xl font-display font-black text-primary">{applauseCount}</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-24 h-24 rounded-full bg-primary text-white text-4xl shadow-xl flex items-center justify-center border-4 border-white"
              onClick={() => {
                playSound('applause');
                setApplauseCount(c => c + 1);
              }}
            >
              👏
            </motion.button>
          </div>
        </div>
      ),
      isInteraction: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20 sparkle-bg">
      <div className="w-full max-w-2xl text-center space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="glass-card p-8 min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bg} -z-10`} />
            
            <div className="mb-6">
              <h1 className="font-display text-4xl font-bold text-primary">{slides[currentSlide].title}</h1>
              <p className="text-muted-foreground font-body">{slides[currentSlide].subtitle}</p>
            </div>

            <div className="flex-1 flex items-center justify-center w-full">
              {slides[currentSlide].content}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Floating Avatar Guide */}
        <motion.div 
          className="flex items-center gap-4 bg-white/80 p-4 rounded-3xl shadow-lg border-2 border-primary/10 self-center mx-auto w-fit"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="text-5xl">{avatar.emoji}</span>
          <div className="text-left">
            <p className="font-display font-bold text-primary">{avatar.name}</p>
            <p className="text-xs font-body text-muted-foreground italic">"{avatar.trait} at your service!"</p>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center w-full gap-4">
          <button
            onClick={() => setCurrentSlide(s => Math.max(0, s - 1))}
            className="px-8 py-3 rounded-2xl border-2 border-primary/20 font-display font-bold disabled:opacity-30 bg-white/50"
            disabled={currentSlide === 0}
          >
            Back
          </button>
          
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i === currentSlide ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>

          <button
            onClick={() => {
              if (currentSlide < slides.length - 1) {
                setCurrentSlide(s => s + 1);
              } else {
                onNavigate('souvenir');
              }
            }}
            className="px-10 py-3 rounded-2xl bg-primary text-primary-foreground font-display font-bold shadow-lg shadow-primary/20"
          >
            {currentSlide === slides.length - 1 ? 'Go to Souvenir Creator →' : 'Next Slide →'}
          </button>
        </div>
      </div>
    </div>
  );
}
