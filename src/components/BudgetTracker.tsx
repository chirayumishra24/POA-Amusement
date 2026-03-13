import { motion } from 'framer-motion';
import { TOTAL_BUDGET } from '@/lib/gameState';

interface BudgetTrackerProps {
  totalSpent: number;
  remaining: number;
  isOverBudget: boolean;
}

export default function BudgetTracker({ totalSpent, remaining, isOverBudget }: BudgetTrackerProps) {
  const percentage = Math.min((totalSpent / TOTAL_BUDGET) * 100, 100);
  const isAlmostFull = percentage > 75 && !isOverBudget;

  return (
    <motion.div
      className={`gradient-card p-5 ${isOverBudget ? 'ring-2 ring-destructive/50' : ''}`}
      animate={isOverBudget ? { x: [-4, 4, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.span 
          className="text-2xl"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💰
        </motion.span>
        <h3 className="font-display text-lg font-bold">Budget Tracker</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm font-semibold font-body">
          <span>Total Budget</span>
          <span className="font-display text-lg">₹{TOTAL_BUDGET.toLocaleString()}</span>
        </div>
        
        {/* Enhanced progress bar */}
        <div className="relative w-full h-6 bg-muted rounded-full overflow-hidden shadow-inner">
          <motion.div
            className={`h-full rounded-full relative ${
              isOverBudget 
                ? 'bg-gradient-to-r from-destructive to-primary' 
                : isAlmostFull 
                ? 'bg-gradient-to-r from-accent via-sunny to-orange'
                : 'bg-gradient-to-r from-accent to-secondary'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 12 }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[glow-rotate_2s_linear_infinite]" />
          </motion.div>
          
          {/* Percentage label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-display font-bold text-foreground/70">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
        
        <div className="flex justify-between text-sm font-body">
          <span>
            Spent: <strong className="text-primary font-display">₹{totalSpent.toLocaleString()}</strong>
          </span>
          <span>
            Left: <motion.strong 
              className={`font-display ${isOverBudget ? 'text-destructive' : 'text-accent'}`}
              key={remaining}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
            >
              ₹{remaining.toLocaleString()}
            </motion.strong>
          </span>
        </div>
        
        {isOverBudget && (
          <motion.div
            className="flex items-center gap-2 p-3 rounded-2xl bg-destructive/10 border border-destructive/30"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.span
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ⚠️
            </motion.span>
            <p className="text-sm text-destructive font-bold font-body">
              Over budget! Remove some items!
            </p>
          </motion.div>
        )}
        
        {isAlmostFull && (
          <motion.p
            className="text-xs text-orange font-semibold text-center font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            💡 Almost there — choose wisely!
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
