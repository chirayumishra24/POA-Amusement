import { motion } from 'framer-motion';
import { AVATAR_OPTIONS, type AvatarOption } from '@/lib/gameState';

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}

export default function AvatarSelection({ selectedId, onSelect, onConfirm }: Props) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="font-display text-2xl font-bold text-primary">Choose Your Adventure Guide!</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {AVATAR_OPTIONS.map((avatar) => (
          <motion.button
            key={avatar.id}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(avatar.id)}
            className={`p-6 rounded-3xl border-3 transition-all flex flex-col items-center gap-3 relative overflow-hidden ${
              selectedId === avatar.id 
                ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20 scale-105' 
                : 'bg-card/50 border-border hover:border-primary/50 grayscale-[0.5] hover:grayscale-0'
            }`}
          >
            {selectedId === avatar.id && (
              <motion.div 
                layoutId="selected-avatar"
                className="absolute inset-0 border-4 border-primary rounded-3xl pointer-events-none"
              />
            )}
            <span className="text-6xl">{avatar.emoji}</span>
            <div>
              <h3 className="font-display font-bold text-lg">{avatar.name}</h3>
              <p className="text-xs font-body text-muted-foreground">{avatar.trait}</p>
            </div>
          </motion.button>
        ))}
      </div>
      
      <motion.button
        className="px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-xl shadow-xl mt-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onConfirm}
      >
        Let's Go! 🚀
      </motion.button>
    </div>
  );
}
