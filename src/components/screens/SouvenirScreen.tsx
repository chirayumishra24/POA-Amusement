import { motion } from 'framer-motion';
import { useState } from 'react';
import type { GameScreen } from '@/hooks/useGameState';
import { useSound } from '@/hooks/useSound';

interface Props {
  design: { color: string; icon: string };
  setDesign: (design: { color: string; icon: string }) => void;
  onNavigate: (screen: GameScreen) => void;
  onAddPoints: (pts: number) => void;
}

const COLORS = ['#FF7E5F', '#FEB47B', '#86A8E7', '#91EAE4', '#FAD0C4', '#A18CD1'];
const ICONS = ['🎨', '🌟', '🚀', '🐱', '🤖', '🦊', '💖', '🍀', '⚡'];

export default function SouvenirScreen({ design, setDesign, onNavigate, onAddPoints }: Props) {
  const { playSound } = useSound();
  const [hasCreated, setHasCreated] = useState(false);

  return (
    <div className="min-h-screen p-6 pt-20 max-w-4xl mx-auto text-center space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold text-primary mb-2">🏷️ Souvenir Creator</h1>
        <p className="text-muted-foreground font-body">Design your own team badge to take home!</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Preview */}
        <div className="flex justify-center">
          <motion.div
            className="w-64 h-64 rounded-full shadow-2xl flex items-center justify-center text-8xl relative overflow-hidden border-8 border-white/50"
            style={{ backgroundColor: design.color }}
            animate={{ scale: [1, 1.02, 1], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-white/10" />
            <motion.span
              key={design.icon}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {design.icon}
            </motion.span>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="space-y-8 text-left glass-card p-8">
          <section className="space-y-4">
            <h3 className="font-display font-bold">Pick a Color</h3>
            <div className="flex flex-wrap gap-3">
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${design.color === c ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    playSound('select');
                    setDesign({ ...design, color: c });
                  }}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="font-display font-bold">Choose an Icon</h3>
            <div className="flex flex-wrap gap-4">
              {ICONS.map(icon => (
                <button
                  key={icon}
                  className={`text-3xl transition-transform hover:scale-125 ${design.icon === icon ? 'scale-125' : 'opacity-50'}`}
                  onClick={() => {
                    playSound('select');
                    setDesign({ ...design, icon });
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </section>

          <motion.button
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (!hasCreated) {
                onAddPoints(5);
                setHasCreated(true);
                playSound('success');
              }
              onNavigate('summary');
            }}
          >
            Finish Design 🚀 (+5 Brownie Points!)
          </motion.button>
        </div>
      </div>
    </div>
  );
}
