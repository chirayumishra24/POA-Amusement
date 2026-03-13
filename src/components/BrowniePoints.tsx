import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface BrowniePointsProps {
  points: number;
  hasBadge: boolean;
}

export default function BrowniePoints({ points, hasBadge }: BrowniePointsProps) {
  const [animate, setAnimate] = useState(false);
  const [prevPoints, setPrevPoints] = useState(points);
  
  useEffect(() => {
    if (points > prevPoints) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      setPrevPoints(points);
      return () => clearTimeout(timer);
    }
    setPrevPoints(points);
  }, [points, prevPoints]);

  return (
    <motion.div 
      className="flex items-center gap-2 glass-card px-4 py-2 relative overflow-hidden"
      animate={animate ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* Glow effect on points earned */}
      {animate && (
        <motion.div
          className="absolute inset-0 bg-sunny/20 rounded-3xl"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
      
      <motion.span 
        className="text-xl"
        animate={animate ? { rotate: [0, 360], scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        ⭐
      </motion.span>
      <span className="font-display font-bold text-sm">
        <motion.span
          key={points}
          initial={animate ? { y: -10, opacity: 0 } : {}}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block"
        >
          {points}
        </motion.span>
        {' '}Brownie {points === 1 ? 'Point' : 'Points'}
      </span>
      {hasBadge && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="text-xl"
          title="Master Trip Planner!"
        >
          🏆
        </motion.span>
      )}
    </motion.div>
  );
}
