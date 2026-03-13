import { motion, AnimatePresence } from 'framer-motion';
import { PARK_ITEMS, WEATHER_OPTIONS, AVATAR_OPTIONS, type ParkItem } from '@/lib/gameState';
import BudgetTracker from '@/components/BudgetTracker';
import EmojiExplosion from '@/components/EmojiExplosion';
import MascotGuide from '@/components/MascotGuide';
import AnimatedParkMap3D from '@/components/AnimatedParkMap3D';
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
  extraBudget: number;
  setExtraBudget: (amount: number | ((prev: number) => number)) => void;
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
      className={`relative w-full rounded-3xl text-left transition-all overflow-hidden group ${
        selected 
          ? `ring-4 ring-offset-2 ring-${item.color} ${colors.glow}` 
          : 'hover:shadow-xl hover:-translate-y-1'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      layout
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      </div>

      {/* Selected glow effect overlay */}
      {selected && (
        <motion.div
          className={`absolute inset-0 bg-${item.color}/20 mix-blend-overlay`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
      
      {/* Content wrapper */}
      <div className="relative p-5 h-full min-h-[160px] flex flex-col justify-end">
        <div className="flex justify-between items-start mb-auto">
          <motion.span 
            className="text-3xl drop-shadow-lg bg-black/30 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm"
            animate={selected ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {item.emoji}
          </motion.span>
          
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="bg-accent text-accent-foreground text-xl w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
              >
                ✓
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-bold text-lg text-white drop-shadow-md leading-tight">{item.name}</h3>
            <motion.span 
              className="font-display font-black text-lg text-[#FFD700] drop-shadow-lg bg-black/40 px-2 py-0.5 rounded-lg"
              key={selected ? 'selected' : 'not'}
              initial={{ scale: 1 }}
              animate={{ scale: selected ? [1, 1.3, 1] : 1 }}
            >
              ₹{item.cost}
            </motion.span>
          </div>
          
          <p className="text-sm text-gray-200 mt-1 line-clamp-2 font-body drop-shadow">{item.description}</p>
          
          <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
            item.category === 'ride' ? (item.cost === 400 ? 'bg-primary/80 text-white' : 'bg-secondary/80 text-white') :
            item.category === 'meal' ? 'bg-orange/80 text-white' : 'bg-purple/80 text-white'
          }`}>
            {item.category === 'ride' ? (item.cost === 400 ? '🎢 Big Ride' : '🎠 Small Ride') :
             item.category === 'meal' ? '🍕 Meal/Snack' : '🎯 Activity'}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export default function ParkMapScreen({
  selectedItems, toggleItem, totalSpent, remaining, isOverBudget,
  rideCount, mealCount, activityCount, meetsRequirements, onNavigate,
  weatherType, setWeatherType, selectedAvatarId, extraBudget, setExtraBudget
}: Props) {
  const { playSound } = useSound();
  const rides = PARK_ITEMS.filter(i => i.category === 'ride');
  const meals = PARK_ITEMS.filter(i => i.category === 'meal');
  const activities = PARK_ITEMS.filter(i => i.category === 'activity');
  const [selectExplosion, setSelectExplosion] = useState(false);
  const [mysteryEventAppeared, setMysteryEventAppeared] = useState(false);
  const [mysteryMessage, setMysteryMessage] = useState<string | null>(null);

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

  const handleMysteryBox = () => {
    playSound('success');
    setMysteryEventAppeared(true);
    const events = [
      { msg: "Lucky find! You found a dropped ₹100 note on the ground!", bonus: 100 },
      { msg: "Special Bonus! The park manager gave you ₹200 for being polite!", bonus: 200 },
      { msg: "Oh no! A monkey stole ₹50 from your pocket!", bonus: -50 }
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    setExtraBudget(prev => prev + event.bonus);
    setMysteryMessage(event.msg);
    setTimeout(() => setMysteryMessage(null), 5000); // Hide message after 5 seconds
  };

  return (
    <div className="min-h-screen p-4 pt-20 max-w-5xl mx-auto fun-bg relative">
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


      {/* 3D Animated Park Map Banner */}
      <AnimatedParkMap3D />
      
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
