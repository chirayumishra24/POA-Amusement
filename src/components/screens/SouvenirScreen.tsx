import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { GameScreen } from '@/hooks/useGameState';
import { useSound } from '@/hooks/useSound';
import { SOUVENIR_PATTERNS, SOUVENIR_SHAPES, type SouvenirDesign } from '@/lib/gameState';

interface Props {
  design: SouvenirDesign;
  setDesign: (design: SouvenirDesign) => void;
  onNavigate: (screen: GameScreen) => void;
  onAddPoints: (pts: number) => void;
}

const COLORS = ['#FF7E5F', '#FEB47B', '#86A8E7', '#91EAE4', '#FAD0C4', '#A18CD1', '#FFD93D', '#6BCB77'];
const ICONS = ['🎨', '🌟', '🚀', '🐱', '🤖', '🦊', '💖', '🍀', '⚡', '🏆', '💎', '🌈'];

export default function SouvenirScreen({ design, setDesign, onNavigate, onAddPoints }: Props) {
  const { playSound } = useSound();
  const [hasCreated, setHasCreated] = useState(false);

  const getShapeClass = () => {
    switch (design.shape) {
      case 'circle': return 'rounded-full';
      case 'hexagon': return 'clip-path-hexagon'; // Needs CSS
      case 'star': return 'clip-path-star'; // Needs CSS
      default: return 'rounded-full';
    }
  };

  const renderPattern = () => {
    switch (design.pattern) {
      case 'sparkles':
        return (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white text-[10px]"
                style={{ 
                  top: `${Math.random() * 100}%`, 
                  left: `${Math.random() * 100}%` 
                }}
                animate={{ 
                  scale: [0, 1, 0], 
                  opacity: [0, 1, 0],
                  rotate: [0, 180]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2, 
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        );
      case 'stripes':
        return (
          <div 
            className="absolute inset-0 pointer-events-none opacity-20" 
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 20px)' }}
          />
        );
      case 'stars':
        return (
          <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-wrap gap-4 p-4 overflow-hidden">
            {[...Array(20)].map((_, i) => <span key={i} className="text-white text-xs">⭐</span>)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 pt-20 max-w-5xl mx-auto text-center space-y-8 sparkle-bg">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold text-primary mb-2">🏷️ Premium Souvenir Creator</h1>
        <p className="text-muted-foreground font-body">Design your own high-quality team badge to take home!</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Preview Section */}
        <div className="flex flex-col items-center space-y-6 sticky top-24">
          <div className="relative group">
            {/* Glossy Overlay/Reflection */}
            <motion.div
              className={`w-72 h-72 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center text-9xl relative overflow-hidden border-8 border-white/80 z-10 ${getShapeClass()}`}
              style={{ backgroundColor: design.color }}
              animate={{ 
                rotateY: [0, 10, -10, 0],
                rotateX: [0, -5, 5, 0],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/30" />
              
              {renderPattern()}

              <AnimatePresence mode="wait">
                <motion.span
                  key={design.icon}
                  className="relative z-20 filter drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)]"
                  initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {design.icon}
                </motion.span>
              </AnimatePresence>

              {/* Gloss Finish */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 -skew-y-12 pointer-events-none" />
            </motion.div>

            {/* Stage/Shadow */}
            <div className="w-48 h-10 bg-black/10 blur-xl rounded-full mx-auto mt-4 scale-x-150 opacity-50" />
          </div>

          <div className="bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-white shadow-sm inline-flex items-center gap-3">
             <span className="text-xl">🏆</span>
             <span className="font-display font-bold text-primary italic">Adventure Edition 2024</span>
          </div>
        </div>

        {/* Customization Controls */}
        <div className="space-y-6 text-left glass-card p-8 shadow-xl border-white/50">
          <section className="space-y-3">
            <h3 className="font-display font-bold text-sm uppercase tracking-widest text-primary/70">1. Select Base Color</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 shadow-sm ${design.color === c ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-white'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    playSound('select');
                    setDesign({ ...design, color: c });
                  }}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-display font-bold text-sm uppercase tracking-widest text-primary/70">2. Choose Shape</h3>
            <div className="grid grid-cols-3 gap-3">
              {SOUVENIR_SHAPES.map(shape => (
                <button
                  key={shape.id}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${design.shape === shape.id ? 'bg-primary/10 border-primary text-primary shadow-md' : 'bg-white/50 border-white text-muted-foreground hover:bg-white'}`}
                  onClick={() => {
                    playSound('select');
                    setDesign({ ...design, shape: shape.id as any });
                  }}
                >
                  <span className="text-xl">{shape.icon}</span>
                  <span className="text-[10px] font-bold uppercase">{shape.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-display font-bold text-sm uppercase tracking-widest text-primary/70">3. Apply Pattern</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SOUVENIR_PATTERNS.map(p => (
                <button
                  key={p.id}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${design.pattern === p.id ? 'bg-primary/10 border-primary text-primary shadow-md' : 'bg-white/50 border-white text-muted-foreground hover:bg-white'}`}
                  onClick={() => {
                    playSound('select');
                    setDesign({ ...design, pattern: p.id as any });
                  }}
                >
                  <span className="text-xl">{p.icon}</span>
                  <span className="text-[10px] font-bold uppercase">{p.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-display font-bold text-sm uppercase tracking-widest text-primary/70">4. Final Icon</h3>
            <div className="grid grid-cols-6 gap-3">
              {ICONS.map(icon => (
                <button
                  key={icon}
                  className={`w-12 h-12 rounded-xl bg-white/50 border-2 flex items-center justify-center transition-all hover:scale-110 shadow-sm ${design.icon === icon ? 'border-primary ring-2 ring-primary/20 bg-primary/10 scale-110 text-3xl' : 'border-white text-2xl grayscale opacity-60 hover:grayscale-0 hover:opacity-100'}`}
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

          <div className="pt-4 mt-6 border-t-2 border-primary/10">
            <motion.button
              className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-xl shadow-xl relative overflow-hidden group"
              whileHover={{ scale: 1.02, y: -2 }}
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
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-3">
                Complete Design 🚀 
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">+5 Points</span>
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
