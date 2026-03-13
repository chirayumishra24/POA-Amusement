import { motion } from 'framer-motion';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { TOTAL_BUDGET, PARK_ITEMS, type ParkItem, type ItinerarySlot, type EarnedBadge } from '@/lib/gameState';
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
  souvenirDesign: { color: string; icon: string };
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
          scale: 2,
          backgroundColor: null,
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
        className="relative bg-[#FFF9E6] border-8 border-[#D4AF37] rounded-[40px] shadow-2xl overflow-hidden p-8 md:p-12 text-[#5C4033] font-display"
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
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Master Planner</p>
                <p className="text-xl font-black">Student Adventurer</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Team Recognition</p>
                <p className="text-xl font-black">{hasBadge ? '🏆 Master Status' : '⭐ Explorer Status'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Adventure Points</p>
                <p className="text-xl font-black text-primary">{browniePoints} Stars</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Budget Efficiency</p>
                <p className="text-xl font-black">{Math.round((totalSpent / TOTAL_BUDGET) * 100)}% Used</p>
              </div>
            </div>
          </div>

          {/* Portrait Section */}
          <div className="flex flex-col items-center gap-4 bg-white/50 p-6 rounded-3xl border-4 border-dashed border-[#D4AF37]">
            <div className="relative">
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center text-7xl shadow-inner"
                style={{ backgroundColor: souvenirDesign.color }}
              >
                {souvenirDesign.icon}
              </div>
              <motion.div 
                className="absolute -bottom-2 -right-2 text-4xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                ⭐
              </motion.div>
            </div>
            <p className="text-center font-black text-sm uppercase tracking-widest">Official Stamp</p>
          </div>
        </div>

        {/* Selected Items List */}
        <div className="mt-12 pt-8 border-t-2 border-dashed border-[#D4AF37]/50">
          <h3 className="text-center text-xs font-black uppercase tracking-[0.3em] mb-6 opacity-40">Approved Adventure Manifesto</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {selectedParkItems.map(item => (
              <span key={item.id} title={item.name} className="flex items-center gap-1 bg-white/40 px-3 py-1.5 rounded-full border border-[#D4AF37]/20 text-sm">
                <span>{item.emoji}</span>
                <span className="font-bold">{item.name}</span>
              </span>
            ))}
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
        <div className="mt-12 flex justify-between items-end opacity-60">
          <div className="flex flex-col">
            <div className="h-8 w-32 border-b-2 border-[#5C4033]/30" />
            <p className="text-[10px] uppercase font-bold">Authorized Signature</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-widest">Ticket ID: AP-{Date.now().toString().slice(-6)}</p>
            <p className="text-xl font-display italic font-bold">SkilliZee Parks & Rec</p>
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
