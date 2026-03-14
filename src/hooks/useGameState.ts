import { useState, useCallback, useMemo } from 'react';
import { TOTAL_BUDGET, PARK_ITEMS, DEFAULT_ITINERARY, QUIZ_QUESTIONS, type ParkItem, type ItinerarySlot, type EarnedBadge, type SouvenirDesign } from '@/lib/gameState';

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
  const [extraBudget, setExtraBudget] = useState(0);
  
  // NEW Engagement Features State
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('girl');
  const [weatherType, setWeatherType] = useState<string>('sunny');
  const [souvenirDesign, setSouvenirDesign] = useState<SouvenirDesign>({ 
    color: '#FF7E5F', 
    icon: '🎨',
    pattern: 'none',
    shape: 'circle'
  });
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

  const remaining = TOTAL_BUDGET + extraBudget - totalSpent;
  const isOverBudget = remaining < 0;

  const rideCount = selectedParkItems.filter(i => i.category === 'ride').length;
  const mealCount = selectedParkItems.filter(i => i.category === 'meal').length;
  const activityCount = selectedParkItems.filter(i => i.category === 'activity').length;

  const meetsRequirements = rideCount >= 3 && mealCount >= 1 && activityCount >= 1;

  const earnedBadges = useMemo(() => {
    const badges: EarnedBadge[] = [];
    if (rideCount >= 3) {
      badges.push({ id: 'thrill', name: 'Thrill Seeker', emoji: '🎢', description: 'Selected 3+ rides' });
    }
    if (mealCount >= 3) {
      badges.push({ id: 'foodie', name: 'Foodie', emoji: '🍕', description: 'Selected 3+ meals' });
    }
    if (remaining > 300 && remaining <= TOTAL_BUDGET) {
      badges.push({ id: 'budget', name: 'Budget Master', emoji: '💰', description: 'Saved over ₹300' });
    }
    const perfectQuiz = Object.values(quizAnswers).length === QUIZ_QUESTIONS.length && 
       Object.entries(quizAnswers).every(([qId, aIdx]) => {
         const q = QUIZ_QUESTIONS.find(qq => qq.id === parseInt(qId));
         return q && (q.correctIndex === -1 || q.correctIndex === aIdx);
       });
    if (perfectQuiz) {
      badges.push({ id: 'quiz', name: 'Quiz Whiz', emoji: '🧠', description: 'Perfect quiz score' });
    }
    if (activityCount >= 3) {
      badges.push({ id: 'activity', name: 'Activity Ace', emoji: '🎯', description: 'Selected 3+ activities' });
    }
    return badges;
  }, [rideCount, mealCount, activityCount, remaining, quizAnswers]);

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
    extraBudget, setExtraBudget,
    totalSpent, remaining, isOverBudget,
    rideCount, mealCount, activityCount, meetsRequirements,
    earnedBadges,
    TOTAL_BUDGET,
  };
}
