import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { PARK_ITEMS, type ItinerarySlot, type ParkItem } from '@/lib/gameState';
import BudgetTracker from '@/components/BudgetTracker';
import MascotGuide from '@/components/MascotGuide';
import type { GameScreen } from '@/hooks/useGameState';

interface Props {
  selectedItems: string[];
  selectedParkItems: ParkItem[];
  itinerary: ItinerarySlot[];
  setItinerary: (it: ItinerarySlot[]) => void;
  totalSpent: number;
  remaining: number;
  isOverBudget: boolean;
  onNavigate: (screen: GameScreen) => void;
  onAddPoints: (pts: number) => void;
}

export default function ItineraryScreen({
  selectedItems, selectedParkItems, itinerary, setItinerary,
  totalSpent, remaining, isOverBudget, onNavigate, onAddPoints,
}: Props) {
  const [assigned, setAssigned] = useState<Record<string, string>>({});

  const placedItemIds = Object.values(assigned);
  const unplacedItems = selectedParkItems.filter(i => !placedItemIds.includes(i.id));

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId === 'items' && destination.droppableId.startsWith('slot-')) {
      setAssigned(prev => ({
        ...prev,
        [destination.droppableId]: draggableId,
      }));
    }
  }, []);

  const removeFromSlot = (slotId: string) => {
    setAssigned(prev => {
      const copy = { ...prev };
      delete copy[slotId];
      return copy;
    });
  };

  const allPlaced = selectedParkItems.length > 0 && unplacedItems.length === 0;

  const handleContinue = () => {
    const updated = itinerary.map(slot => ({
      ...slot,
      itemId: assigned[slot.id] || null,
    }));
    setItinerary(updated);
    onAddPoints(1);
    onNavigate('customize');
  };

  return (
    <div className="min-h-screen p-4 pt-20 max-w-4xl mx-auto fun-bg">
      <MascotGuide message="Drag your items into the timeline! Plan your perfect day! 📋" autoHide={6000} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary text-shadow-fun">📋 Build Your Itinerary</h1>
        <p className="text-muted-foreground font-body">Drag your selections into the timeline!</p>
      </motion.div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-[1fr_280px] gap-6">
          {/* Timeline */}
          <div className="space-y-3">
            {itinerary.map((slot, i) => {
              const assignedItem = assigned[slot.id] ? PARK_ITEMS.find(p => p.id === assigned[slot.id]) : null;
              return (
                <Droppable key={slot.id} droppableId={slot.id}>
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`gradient-card p-4 flex items-center gap-4 min-h-[76px] transition-all ${
                        snapshot.isDraggingOver ? 'ring-2 ring-primary shadow-xl scale-[1.02]' : ''
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <motion.div 
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm shadow-md ${
                          assignedItem ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
                        }`}
                        animate={assignedItem ? { scale: [1, 1.1, 1] } : {}}
                      >
                        {i + 1}
                      </motion.div>
                      <div className="flex-1">
                        <p className="font-display text-sm font-bold">{slot.label}</p>
                        {assignedItem ? (
                          <motion.div 
                            className="flex items-center gap-2 mt-1"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <span className="text-xl">{assignedItem.emoji}</span>
                            <span className="font-body text-sm font-semibold">{assignedItem.name}</span>
                            <span className="text-xs text-muted-foreground font-display">₹{assignedItem.cost}</span>
                            <button
                              className="ml-auto text-xs text-destructive hover:underline font-body font-bold"
                              onClick={() => removeFromSlot(slot.id)}
                            >
                              ✕ Remove
                            </button>
                          </motion.div>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-1 font-body">
                            {snapshot.isDraggingOver ? '✨ Drop here!' : '👆 Drag an item here'}
                          </p>
                        )}
                      </div>
                      {provided.placeholder}
                    </motion.div>
                  )}
                </Droppable>
              );
            })}
          </div>

          {/* Available items */}
          <div className="space-y-4">
            <BudgetTracker totalSpent={totalSpent} remaining={remaining} isOverBudget={isOverBudget} />

            <div className="gradient-card p-4">
              <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
                🎒 Your Items 
                <span className="text-xs text-muted-foreground font-normal font-body">
                  ({unplacedItems.length} left)
                </span>
              </h3>
              <Droppable droppableId="items">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    {unplacedItems.length === 0 ? (
                      <motion.p 
                        className="text-sm text-muted-foreground text-center py-3 font-body"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {allPlaced ? '✅ All items placed! 🎉' : 'No items available'}
                      </motion.p>
                    ) : (
                      unplacedItems.map((item, i) => (
                        <Draggable key={item.id} draggableId={item.id} index={i}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={`p-3 rounded-2xl border-2 border-border bg-card flex items-center gap-2 cursor-grab active:cursor-grabbing transition-all ${
                                snap.isDragging ? 'shadow-xl ring-2 ring-primary scale-105' : 'hover:shadow-md hover:border-primary/40'
                              }`}
                            >
                              <span className="text-xl">{item.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <span className="font-display text-xs font-bold truncate block">{item.name}</span>
                              </div>
                              <span className="font-bold text-xs text-primary font-display">₹{item.cost}</span>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <motion.button
              className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-display font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
            >
              ✨ Customize Trip →
            </motion.button>
          </div>
        </div>
      </DragDropContext>

      <motion.button 
        className="mt-4 text-muted-foreground text-sm underline decoration-dotted font-body hover:text-foreground transition-colors" 
        onClick={() => onNavigate('park')}
        whileHover={{ y: -1 }}
      >
        ← Back to Park Map
      </motion.button>
    </div>
  );
}
