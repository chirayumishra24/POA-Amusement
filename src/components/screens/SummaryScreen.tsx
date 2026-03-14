import { motion } from 'framer-motion';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { TOTAL_BUDGET, PARK_ITEMS, AVATAR_OPTIONS, type ParkItem, type ItinerarySlot, type EarnedBadge, type SouvenirDesign } from '@/lib/gameState';
import BudgetTracker from '@/components/BudgetTracker';
import Confetti from '@/components/Confetti';
import MascotGuide from '@/components/MascotGuide';
import type { GameScreen } from '@/hooks/useGameState';

interface Props {
  tripName: string;
  teamColor: string;
  selectedParkItems: ParkItem[];
  itinerary: ItinerarySlot[];
  totalSpent: number;
  remaining: number;
  isOverBudget: boolean;
  browniePoints: number;
  hasBadge: boolean;
  onNavigate: (screen: GameScreen) => void;
  selectedAvatarId: string;
  souvenirDesign: SouvenirDesign;
  earnedBadges: EarnedBadge[];
}

export default function SummaryScreen({
  tripName, teamColor, selectedParkItems, itinerary,
  totalSpent, remaining, isOverBudget, browniePoints, hasBadge, onNavigate,
  selectedAvatarId, souvenirDesign, earnedBadges
}: Props) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const rides = selectedParkItems.filter(i => i.category === 'ride');
  const meals = selectedParkItems.filter(i => i.category === 'meal');
  const activities = selectedParkItems.filter(i => i.category === 'activity');

  const colorBorder: Record<string, string> = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent',
    purple: 'border-purple',
    orange: 'border-orange',
    pink: 'border-pink',
    sunny: 'border-sunny',
  };

  const handleDownloadTicket = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, {
          scale: 3,
          backgroundColor: '#FFF9E6',
          useCORS: true,
          logging: false,
          scrollX: 0,
          scrollY: -window.scrollY,
          windowWidth: ticketRef.current.scrollWidth,
          windowHeight: ticketRef.current.scrollHeight,
        });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${tripName || 'Adventure'}-Golden-Ticket.png`;
        link.click();
      } catch (error) {
        console.error('Error downloading ticket', error);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 pt-20 max-w-4xl mx-auto sparkle-bg space-y-8">
      <Confetti trigger={hasBadge} />

      {/* The Golden Ticket / Passport */}
      <motion.div 
        ref={ticketRef}
        className="relative bg-[#FFF9E6] border-8 border-[#D4AF37] rounded-[40px] shadow-2xl overflow-hidden p-8 md:p-14 text-[#5C4033] font-display"
        initial={{ rotateX: 45, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {/* Decorative Scalloped Edges */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-[radial-gradient(circle_at_center,_#D4AF37_4px,_transparent_5px)] bg-[length:16px_16px]" />
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-[radial-gradient(circle_at_center,_#D4AF37_4px,_transparent_5px)] bg-[length:16px_16px] rotate-180" />

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🎫</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#B8860B]">Official Adventure Passport</h1>
                <p className="font-body font-bold text-[#8B4513] italic">Subject: {tripName || 'Amusement Park Exploration'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t-2 border-[#D4AF37]/30">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">Master Planner</p>
                <p className="text-xl font-black leading-tight">Adventure Expert</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">Team Recognition</p>
                <p className="text-xl font-black leading-tight">{hasBadge ? '🏆 Master' : '⭐ Explorer'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Adventure Points</p>
                <p className="text-xl font-black text-primary">{browniePoints} Stars</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Budget Categories</p>
                <div className="flex gap-2 items-center">
                  <span title="Rides" className="flex items-center gap-0.5 text-xs font-bold">🎢{rides.length}</span>
                  <span title="Meals" className="flex items-center gap-0.5 text-xs font-bold">🍕{meals.length}</span>
                  <span title="Activities" className="flex items-center gap-0.5 text-xs font-bold">🎯{activities.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Portrait Section - Polaroid Style */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-3 pb-8 shadow-xl -rotate-2 border border-black/5 relative group">
              <div className="w-32 h-32 bg-sky-100 flex items-center justify-center text-6xl rounded-sm overflow-hidden relative">
                {/* Avatar Icon */}
                <span>{AVATAR_OPTIONS.find(a => a.id === selectedAvatarId)?.emoji}</span>
                
                {/* Adventure Badge Overlay */}
                <div className="absolute bottom-0 right-0 p-1">
                  <div 
                    className={`w-12 h-12 shadow-lg flex items-center justify-center text-xl border-2 border-white/80 ${
                      souvenirDesign.shape === 'circle' ? 'rounded-full' : 
                      souvenirDesign.shape === 'hexagon' ? 'clip-path-hexagon' : 'clip-path-star'
                    }`}
                    style={{ backgroundColor: souvenirDesign.color }}
                  >
                    <span className="relative z-10">{souvenirDesign.icon}</span>
                  </div>
                </div>
              </div>
              <p className="text-center font-[Handlee,cursive] text-xs pt-2 text-[#5C4033] font-bold">Explorer Profile</p>
              
              {/* Official Stamp Overlay */}
              <div className="absolute -top-6 -right-6 w-20 h-20 border-4 border-red-600/30 rounded-full flex items-center justify-center -rotate-12 pointer-events-none">
                <p className="text-[8px] font-black text-red-600/30 uppercase text-center leading-none">Official<br/>Passport<br/>Seal</p>
              </div>
            </div>
            <div className="mt-2 text-right">
               <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Issue #: SKZ-{Date.now().toString().slice(-4)}</p>
            </div>
          </div>
        </div>

        {/* Selected Items List */}
        <div className="mt-12 pt-8 border-t-2 border-dashed border-[#D4AF37]/50 relative">
          {/* Decorative Corner Stars */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-2xl opacity-50">✨</div>
          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-2xl opacity-50">✨</div>

          <h3 className="text-center text-sm font-black uppercase tracking-[0.2em] mb-8 text-[#8B4513] drop-shadow-sm flex items-center justify-center gap-4">
            <span className="h-px bg-[#D4AF37]/50 flex-1"></span>
            Approved Adventure Manifesto
            <span className="h-px bg-[#D4AF37]/50 flex-1"></span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Rides Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#B8860B] mb-2 border-b border-[#D4AF37]/30 pb-1">🎢 Epic Rides</h4>
              {rides.length > 0 ? rides.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm bg-white/40 px-3 py-3 rounded-lg border border-[#D4AF37]/10 leading-relaxed">
                  <span className="flex items-center gap-2"><span className="text-lg">{item.emoji}</span><span className="font-bold">{item.name}</span></span>
                  <span className="font-mono text-xs opacity-60">₹{item.cost}</span>
                </div>
              )) : <div className="text-sm italic opacity-50">No rides scheduled</div>}
            </div>

            {/* Meals & Activities Column */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#B8860B] mb-2 border-b border-[#D4AF37]/30 pb-1">🍕 Tasty Meals</h4>
                {meals.length > 0 ? meals.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm bg-white/40 px-3 py-3 rounded-lg border border-[#D4AF37]/10 leading-relaxed">
                    <span className="flex items-center gap-2"><span className="text-lg">{item.emoji}</span><span className="font-bold">{item.name}</span></span>
                    <span className="font-mono text-xs opacity-60">₹{item.cost}</span>
                  </div>
                )) : <div className="text-sm italic opacity-50">No meals scheduled</div>}
              </div>
              
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#B8860B] mb-2 border-b border-[#D4AF37]/30 pb-1">🎯 Fun Activities</h4>
                {activities.length > 0 ? activities.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm bg-white/40 px-3 py-3 rounded-lg border border-[#D4AF37]/10 leading-relaxed">
                    <span className="flex items-center gap-2"><span className="text-lg">{item.emoji}</span><span className="font-bold">{item.name}</span></span>
                    <span className="font-mono text-xs opacity-60">₹{item.cost}</span>
                  </div>
                )) : <div className="text-sm italic opacity-50">No activities scheduled</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Earned Badges Section */}
        {earnedBadges && earnedBadges.length > 0 && (
          <div className="mt-8 pt-8 border-t-2 border-dashed border-[#D4AF37]/50">
            <h3 className="text-center text-xs font-black uppercase tracking-[0.3em] mb-6 opacity-40">Earned Accolades</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {earnedBadges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center justify-center gap-2 bg-white/40 px-4 py-3 rounded-2xl border-2 border-[#D4AF37]/30 min-w-[120px]">
                  <span className="text-4xl">{badge.emoji}</span>
                  <div className="text-center">
                    <p className="font-bold text-sm tracking-tight">{badge.name}</p>
                    <p className="text-[10px] opacity-70 leading-tight">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 flex justify-between items-end opacity-80 pt-6 border-t-4 border-double border-[#D4AF37]/30">
          <div className="flex flex-col space-y-2">
            <div className="h-12 w-48 border-b-2 border-[#5C4033]/50 relative">
              <span className="absolute bottom-2 left-2 font-[Brush_Script_MT,cursive] text-3xl text-[#8B4513]/80 -rotate-3">S. Zee</span>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#8B4513]">Authorized Signature</p>
            <p className="text-[9px] uppercase tracking-widest opacity-60">Valid On: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-right space-y-1">
            <div className="inline-block border-2 border-[#5C4033] p-1 mb-2">
              <div className="border border-[#5C4033] px-2 py-1 flex items-center gap-2">
                <span className="font-mono text-sm tracking-widest font-bold">AP</span>
                <span className="w-px h-4 bg-[#5C4033]" />
                <span className="font-mono text-xs tracking-[0.2em]">{Date.now().toString().slice(-8)}</span>
              </div>
            </div>
            <p className="text-2xl font-display italic font-black text-[#B8860B] drop-shadow-sm">SkilliZee Parks & Rec</p>
          </div>
        </div>
        
        {/* Holographic Sweep Effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%]"
          animate={{ x: '200%' }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
        />
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          className="px-8 py-4 rounded-3xl bg-purple-600 text-white font-display font-bold text-xl shadow-xl hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadTicket}
        >
          ⬇️ Download Ticket
        </motion.button>
        <motion.button
          className="px-8 py-4 rounded-3xl bg-primary text-primary-foreground font-display font-bold text-xl shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.print()}
        >
          🖨️ Print My Ticket
        </motion.button>
        <motion.button
          className="px-8 py-4 rounded-3xl bg-secondary text-secondary-foreground font-display font-bold text-xl shadow-xl transition-all"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('welcome')}
        >
          🎡 Start New Adventure
        </motion.button>
      </div>
    </div>
  );
}
