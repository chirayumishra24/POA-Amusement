import { motion } from 'framer-motion';
import MascotGuide from '@/components/MascotGuide';
import type { GameScreen } from '@/hooks/useGameState';
import { useState } from 'react';

const TEAM_COLORS = [
  { id: 'primary', label: 'Red', class: 'bg-primary', ring: 'ring-primary' },
  { id: 'secondary', label: 'Blue', class: 'bg-secondary', ring: 'ring-secondary' },
  { id: 'accent', label: 'Green', class: 'bg-accent', ring: 'ring-accent' },
  { id: 'purple', label: 'Purple', class: 'bg-purple', ring: 'ring-purple' },
  { id: 'orange', label: 'Orange', class: 'bg-orange', ring: 'ring-orange' },
  { id: 'pink', label: 'Pink', class: 'bg-pink', ring: 'ring-pink' },
  { id: 'sunny', label: 'Yellow', class: 'bg-sunny', ring: 'ring-sunny' },
];

const FUN_IDEAS = [
  { emoji: '📸', label: 'Group Photo', selected: false },
  { emoji: '🏳️', label: 'Team Flag', selected: false },
  { emoji: '🎁', label: 'Souvenir Box', selected: false },
  { emoji: '📝', label: 'Trip Journal', selected: false },
  { emoji: '🎶', label: 'Theme Song', selected: false },
  { emoji: '🤝', label: 'Team Cheer', selected: false },
];

interface Props {
  tripName: string;
  setTripName: (name: string) => void;
  teamColor: string;
  setTeamColor: (color: string) => void;
  onNavigate: (screen: GameScreen) => void;
  onAddPoints: (pts: number) => void;
}

export default function CustomizeScreen({ tripName, setTripName, teamColor, setTeamColor, onNavigate, onAddPoints }: Props) {
  const [selectedIdeas, setSelectedIdeas] = useState<number[]>([]);
  
  const toggleIdea = (i: number) => {
    setSelectedIdeas(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const handleContinue = () => {
    if (tripName.trim()) onAddPoints(1);
    onNavigate('summary');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20 sparkle-bg">
      <MascotGuide message="Make your trip unique! Give it a cool name and pick your team color! 🎨" autoHide={6000} />
      
      <motion.div
        className="glass-card p-8 max-w-md w-full relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 150 }}
      >
        {/* Decorative corner elements */}
        <div className="absolute top-3 right-3 text-2xl opacity-50">✨</div>
        <div className="absolute bottom-3 left-3 text-2xl opacity-50">🎨</div>
        
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-center mb-6 text-shadow-fun">
          ✨ Customize Your Trip
        </h1>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="font-display font-bold text-sm block mb-2">🏷️ Name Your Trip</label>
            <input
              type="text"
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-border bg-background font-body text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
              placeholder="e.g., Super Fun Day 🎉"
              value={tripName}
              onChange={e => setTripName(e.target.value)}
              maxLength={40}
            />
            {tripName && (
              <motion.p 
                className="text-xs text-accent font-body mt-1.5 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ✨ Great name! +1 Brownie Point when you continue!
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="font-display font-bold text-sm block mb-2">🎨 Team Color</label>
            <div className="flex flex-wrap gap-3">
              {TEAM_COLORS.map((c, i) => (
                <motion.button
                  key={c.id}
                  className={`w-12 h-12 rounded-full ${c.class} border-2 transition-all shadow-md ${
                    teamColor === c.id ? `border-foreground scale-110 ring-3 ${c.ring}/30` : 'border-transparent hover:scale-105'
                  }`}
                  onClick={() => setTeamColor(c.id)}
                  title={c.label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: teamColor === c.id ? 1.1 : 1 }}
                  transition={{ delay: i * 0.05 + 0.3 }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="font-display font-bold text-sm block mb-2">📸 Fun Ideas (pick any!)</label>
            <div className="grid grid-cols-2 gap-2">
              {FUN_IDEAS.map((idea, i) => (
                <motion.button
                  key={i}
                  className={`p-3 rounded-2xl text-center font-body text-sm font-semibold border-2 transition-all ${
                    selectedIdeas.includes(i) 
                      ? 'bg-primary/10 border-primary text-foreground shadow-md' 
                      : 'bg-muted/50 border-border text-muted-foreground hover:border-primary/30'
                  }`}
                  onClick={() => toggleIdea(i)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.4 }}
                >
                  {idea.emoji} {idea.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.button
          className="mt-6 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-lg shadow-xl relative overflow-hidden group"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative">🎉 View Trip Summary →</span>
        </motion.button>
      </motion.div>

      <motion.button 
        className="mt-4 text-muted-foreground text-sm underline decoration-dotted font-body hover:text-foreground transition-colors" 
        onClick={() => onNavigate('itinerary')}
        whileHover={{ y: -1 }}
      >
        ← Back to Itinerary
      </motion.button>
    </div>
  );
}
