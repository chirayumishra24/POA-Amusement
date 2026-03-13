import { motion, AnimatePresence } from 'framer-motion';
import { PARK_ITEMS, WEATHER_OPTIONS, AVATAR_OPTIONS, type ParkItem } from '@/lib/gameState';
import BudgetTracker from '@/components/BudgetTracker';
import EmojiExplosion from '@/components/EmojiExplosion';
import MascotGuide from '@/components/MascotGuide';
import type { GameScreen } from '@/hooks/useGameState';
import { useState } from 'react';
import { useSound } from '@/hooks/useSound';

interface Props {
  selectedItems: string[];
  toggleItem: (id: string) => void;
  totalSpent: number;
  remaining: number;
  isOverBudget: boolean;
  rideCount: number;
  mealCount: number;
  activityCount: number;
  meetsRequirements: boolean;
  onNavigate: (screen: GameScreen) => void;
  weatherType: string;
  setWeatherType: (w: string) => void;
  selectedAvatarId: string;
}

function ItemCard({ item, selected, onToggle }: { item: ParkItem; selected: boolean; onToggle: () => void }) {
  const colorMap: Record<string, { border: string; bg: string; glow: string }> = {
    primary: { border: 'border-primary', bg: 'bg-primary/10', glow: 'shadow-primary/20' },
    secondary: { border: 'border-secondary', bg: 'bg-secondary/10', glow: 'shadow-secondary/20' },
    accent: { border: 'border-accent', bg: 'bg-accent/10', glow: 'shadow-accent/20' },
    purple: { border: 'border-purple', bg: 'bg-purple/10', glow: 'shadow-purple/20' },
    pink: { border: 'border-pink', bg: 'bg-pink/10', glow: 'shadow-pink/20' },
    orange: { border: 'border-orange', bg: 'bg-orange/10', glow: 'shadow-orange/20' },
    sunny: { border: 'border-sunny', bg: 'bg-sunny/10', glow: 'shadow-sunny/20' },
  };

  const colors = colorMap[item.color] || colorMap.primary;

  return (
    <motion.button
      className={`p-4 rounded-3xl border-2 text-left transition-all relative overflow-hidden ${
        selected 
          ? `${colors.border} ${colors.bg} shadow-xl ${colors.glow}` 
          : 'border-border bg-card hover:shadow-md hover:border-muted-foreground/30'
      }`}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onToggle}
      layout
    >
      {/* Selected glow */}
      {selected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
      
      <div className="flex items-start gap-3 relative">
        <motion.span 
          className="text-3xl flex-shrink-0"
          animate={selected ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {item.emoji}
        </motion.span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm truncate">{item.name}</h3>
            <motion.span 
              className="font-display font-bold text-sm text-primary ml-2"
              key={selected ? 'selected' : 'not'}
              initial={{ scale: 1 }}
              animate={{ scale: selected ? [1, 1.3, 1] : 1 }}
            >
              ₹{item.cost}
            </motion.span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-body">{item.description}</p>
          <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            item.category === 'ride' ? (item.cost === 400 ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary') :
            item.category === 'meal' ? 'bg-orange/20 text-orange' : 'bg-purple/20 text-purple'
          }`}>
            {item.category === 'ride' ? (item.cost === 400 ? '🎢 Big Ride' : '🎠 Small Ride') :
             item.category === 'meal' ? '🍕 Meal/Snack' : '🎯 Activity'}
          </span>
        </div>
        <AnimatePresence>
          {selected && (
            <motion.span
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="text-accent text-xl flex-shrink-0"
            >
              ✅
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}

export default function ParkMapScreen({
  selectedItems, toggleItem, totalSpent, remaining, isOverBudget,
  rideCount, mealCount, activityCount, meetsRequirements, onNavigate,
  weatherType, setWeatherType, selectedAvatarId
}: Props) {
  const { playSound } = useSound();
  const rides = PARK_ITEMS.filter(i => i.category === 'ride');
  const meals = PARK_ITEMS.filter(i => i.category === 'meal');
  const activities = PARK_ITEMS.filter(i => i.category === 'activity');
  const [selectExplosion, setSelectExplosion] = useState(false);

  const currentWeather = WEATHER_OPTIONS.find(w => w.type === weatherType)!;
  const avatar = AVATAR_OPTIONS.find(a => a.id === selectedAvatarId)!;

  const handleToggle = (id: string) => {
    if (!selectedItems.includes(id)) {
      setSelectExplosion(true);
      playSound('select');
      setTimeout(() => setSelectExplosion(false), 100);
    } else {
      playSound('click');
    }
    toggleItem(id);
  };

  const getMascotMessage = () => {
    if (isOverBudget) return "Oh no! You've spent too much! Remove something to stay in budget! 😰";
    if (meetsRequirements) return "Amazing! You meet all requirements! Ready to build your itinerary? 🎉";
    if (rideCount < 3) return `Pick ${3 - rideCount} more ride${3 - rideCount > 1 ? 's' : ''}! Try mixing big and small ones! 🎢`;
    if (mealCount < 1) return "Don't forget to grab some food! You'll need energy! 🍕";
    if (activityCount < 1) return "Add an activity for extra fun! Try the arcade! 🎯";
    return "Great choices so far! Keep going! 💪";
  };

  return (
    <div className="min-h-screen p-4 pt-20 max-w-5xl mx-auto fun-bg">
      <EmojiExplosion trigger={selectExplosion} emoji="⭐" />
      <MascotGuide message={getMascotMessage()} key={`${rideCount}-${mealCount}-${activityCount}-${isOverBudget}`} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h1 className="font-display text-4xl font-bold text-primary text-shadow-fun flex items-center justify-center gap-3">
          <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            🗺️
          </motion.span>
          Park Map
        </h1>
        <p className="text-muted-foreground font-body">Tap items to add them to your trip!</p>
      </motion.div>

      {/* Weather Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {WEATHER_OPTIONS.map((w) => (
          <motion.button
            key={w.type}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playSound('click');
              setWeatherType(w.type);
            }}
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-sm font-display font-bold transition-all border-2 ${
              weatherType === w.type 
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <span>{w.emoji}</span>
            <span>{w.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Weather Alert */}
      <AnimatePresence mode="wait">
        <motion.div
          key={weatherType}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card mb-8 p-4 border-2 border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{currentWeather.emoji}</span>
            <div>
              <p className="font-display font-bold text-primary">{currentWeather.name}</p>
              <p className="text-xs font-body text-muted-foreground">{currentWeather.description}</p>
            </div>
          </div>
          <div className="bg-primary/10 px-4 py-2 rounded-xl text-primary font-display font-bold text-sm">
            Effect: {currentWeather.modifier}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          {/* Animated Map Visuals */}
          <div className="relative h-48 rounded-3xl overflow-hidden bg-gradient-to-b from-sky-300 to-green-100 border-4 border-white shadow-xl mb-6">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            
            {/* Ferris Wheel Animation */}
            <motion.div 
              className="absolute left-[15%] top-1/2 -translate-y-1/2 text-6xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              🎡
            </motion.div>

            {/* Roller Coaster Animation */}
            <motion.div 
              className="absolute right-[10%] top-1/4 text-5xl"
              animate={{ 
                x: [-100, 200],
                y: [0, -20, 20, 0],
                rotate: [0, -20, 20, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              🎢
            </motion.div>

            {/* Clouds */}
            <motion.div 
              className="absolute top-4 text-3xl opacity-60"
              animate={{ x: [-20, 400] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ☁️
            </motion.div>
          </div>
          {/* Requirements checklist */}
          <motion.div 
            className="gradient-card p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-display font-bold text-sm mb-3">📋 Your Mission</h3>
            <div className="flex flex-wrap gap-4 text-sm font-body">
              {[
                { done: rideCount >= 3, label: `3+ Rides`, count: `${rideCount}/3`, emoji: '🎢' },
                { done: mealCount >= 1, label: `1+ Meal`, count: `${mealCount}/1`, emoji: '🍕' },
                { done: activityCount >= 1, label: `1+ Activity`, count: `${activityCount}/1`, emoji: '🎯' },
              ].map((req, i) => (
                <motion.div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all ${
                    req.done 
                      ? 'bg-accent/15 border-accent text-accent font-bold' 
                      : 'bg-muted/50 border-border text-muted-foreground'
                  }`}
                  animate={req.done ? { scale: [1, 1.1, 1] } : {}}
                >
                  <span>{req.done ? '✅' : req.emoji}</span>
                  <span>{req.label} ({req.count})</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rides */}
          <section>
            <motion.h2 
              className="font-display text-xl font-bold mb-3 text-secondary flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              🎢 Rides <span className="text-xs font-body text-muted-foreground font-normal">(Small ₹200 · Big ₹400)</span>
            </motion.h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {rides.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ItemCard item={item} selected={selectedItems.includes(item.id)} onToggle={() => handleToggle(item.id)} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Meals */}
          <section>
            <motion.h2 
              className="font-display text-xl font-bold mb-3 text-orange flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              🍕 Food & Snacks <span className="text-xs font-body text-muted-foreground font-normal">(₹100 each)</span>
            </motion.h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {meals.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.2 }}
                >
                  <ItemCard item={item} selected={selectedItems.includes(item.id)} onToggle={() => handleToggle(item.id)} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Activities */}
          <section>
            <motion.h2 
              className="font-display text-xl font-bold mb-3 text-purple flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              🎯 Activities <span className="text-xs font-body text-muted-foreground font-normal">(₹100 each)</span>
            </motion.h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {activities.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.4 }}
                >
                  <ItemCard item={item} selected={selectedItems.includes(item.id)} onToggle={() => handleToggle(item.id)} />
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="lg:sticky lg:top-20 space-y-4">
            <BudgetTracker totalSpent={totalSpent} remaining={remaining} isOverBudget={isOverBudget} />

            <motion.div className="gradient-card p-4" layout>
              <h3 className="font-display font-bold text-sm mb-2 flex items-center gap-2">
                🛒 Selected 
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {selectedItems.length}
                </span>
              </h3>
              {selectedItems.length === 0 ? (
                <p className="text-sm text-muted-foreground font-body">Tap items to add them! ☝️</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  <AnimatePresence>
                    {selectedItems.map(id => {
                      const item = PARK_ITEMS.find(i => i.id === id)!;
                      return (
                        <motion.div 
                          key={id} 
                          className="flex justify-between text-sm font-body items-center"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          layout
                        >
                          <span>{item.emoji} {item.name}</span>
                          <span className="font-bold font-display">₹{item.cost}</span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            <motion.button
              className={`w-full py-3.5 rounded-2xl font-display font-bold text-lg shadow-lg transition-all ${
                meetsRequirements && !isOverBudget
                  ? 'bg-accent text-accent-foreground hover:shadow-xl'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              whileHover={meetsRequirements && !isOverBudget ? { scale: 1.02, y: -2 } : {}}
              whileTap={meetsRequirements && !isOverBudget ? { scale: 0.98 } : {}}
              onClick={() => meetsRequirements && !isOverBudget && onNavigate('itinerary')}
              disabled={!meetsRequirements || isOverBudget}
              animate={meetsRequirements && !isOverBudget ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 2, repeat: meetsRequirements && !isOverBudget ? Infinity : 0 }}
            >
              {!meetsRequirements ? '📋 Complete your mission ↑' : isOverBudget ? '⚠️ Over budget! Remove items' : '📋 Build Itinerary →'}
            </motion.button>
          </div>
        </div>
      </div>

      <motion.button 
        className="mt-6 text-muted-foreground text-sm underline decoration-dotted font-body hover:text-foreground transition-colors" 
        onClick={() => onNavigate('welcome')}
        whileHover={{ y: -1 }}
      >
        ← Back to Welcome
      </motion.button>
    </div>
  );
}
