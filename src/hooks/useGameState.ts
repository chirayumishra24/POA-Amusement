import { useState, useCallback, useMemo } from 'react';
import { TOTAL_BUDGET, PARK_ITEMS, DEFAULT_ITINERARY, type ParkItem, type ItinerarySlot } from '@/lib/gameState';

export type GameScreen = 'welcome' | 'learn' | 'quiz' | 'park' | 'itinerary' | 'customize' | 'summary' | 'present' | 'souvenir';

export function useGameState() {
  const [screen, setScreen] = useState<GameScreen>('welcome');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<ItinerarySlot[]>(DEFAULT_ITINERARY);
  const [browniePoints, setBrowniePoints] = useState(0);
  const [tripName, setTripName] = useState('');
  const [teamColor, setTeamColor] = useState('primary');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [learnSlideIndex, setLearnSlideIndex] = useState(0);
  
  // NEW Engagement Features State
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('skilli');
  const [weatherType, setWeatherType] = useState<string>('sunny');
  const [souvenirDesign, setSouvenirDesign] = useState<{ color: string; icon: string }>({ color: '#FF7E5F', icon: '🎨' });
  const [applauseCount, setApplauseCount] = useState(0);

  const selectedParkItems = useMemo(() =>
    selectedItems.map(id => PARK_ITEMS.find(i => i.id === id)!).filter(Boolean),
    [selectedItems]
  );

  const totalSpent = useMemo(() => {
    return selectedParkItems.reduce((sum, item) => {
      let cost = item.cost;
      
      if (weatherType === 'rainy') {
        if (item.category === 'meal' || item.category === 'activity') {
          cost = Math.floor(cost * 0.8); // 20% off
        }
      } else if (weatherType === 'holiday') {
        cost += 50;
      }
      
      return sum + cost;
    }, 0);
  }, [selectedParkItems, weatherType]);

  const remaining = TOTAL_BUDGET - totalSpent;
  const isOverBudget = remaining < 0;

  const rideCount = selectedParkItems.filter(i => i.category === 'ride').length;
  const mealCount = selectedParkItems.filter(i => i.category === 'meal').length;
  const activityCount = selectedParkItems.filter(i => i.category === 'activity').length;

  const meetsRequirements = rideCount >= 3 && mealCount >= 1 && activityCount >= 1;

  const toggleItem = useCallback((id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const addPoints = useCallback((pts: number) => {
    setBrowniePoints(prev => prev + pts);
  }, []);

  const hasBadge = browniePoints >= 5;

  return {
    screen, setScreen,
    selectedItems, selectedParkItems, toggleItem,
    itinerary, setItinerary,
    browniePoints, addPoints, hasBadge,
    tripName, setTripName,
    teamColor, setTeamColor,
    quizAnswers, setQuizAnswers,
    learnSlideIndex, setLearnSlideIndex,
    selectedAvatarId, setSelectedAvatarId,
    weatherType, setWeatherType,
    souvenirDesign, setSouvenirDesign,
    applauseCount, setApplauseCount,
    totalSpent, remaining, isOverBudget,
    rideCount, mealCount, activityCount, meetsRequirements,
    TOTAL_BUDGET,
  };
}
