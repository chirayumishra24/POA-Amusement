import { useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import BrowniePoints from '@/components/BrowniePoints';
import JourneyProgress from '@/components/JourneyProgress';
import FloatingElements from '@/components/FloatingElements';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import WelcomeScreen from '@/components/screens/WelcomeScreen';
import LearnScreen from '@/components/screens/LearnScreen';
import QuizScreen from '@/components/screens/QuizScreen';
import ParkMapScreen from '@/components/screens/ParkMapScreen';
import ItineraryScreen from '@/components/screens/ItineraryScreen';
import CustomizeScreen from '@/components/screens/CustomizeScreen';
import SummaryScreen from '@/components/screens/SummaryScreen';
import PresentScreen from '@/components/screens/PresentScreen';
import SouvenirScreen from '@/components/screens/SouvenirScreen';
import { AVATAR_OPTIONS, WEATHER_OPTIONS } from '@/lib/gameState';
import { Maximize2, Minimize2 } from 'lucide-react';

const Index = () => {
  const game = useGameState();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(false);

  useEffect(() => {
    const getFullscreenElement = () =>
      document.fullscreenElement ||
      (document as Document & { webkitFullscreenElement?: Element | null }).webkitFullscreenElement;

    const updateFullscreenState = () => {
      setIsFullscreen(Boolean(getFullscreenElement()));
    };

    const supportsFullscreen =
      typeof document !== 'undefined' &&
      (Boolean(document.documentElement?.requestFullscreen) ||
        Boolean((document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen));

    setIsFullscreenSupported(supportsFullscreen);
    updateFullscreenState();

    document.addEventListener('fullscreenchange', updateFullscreenState);
    document.addEventListener('webkitfullscreenchange', updateFullscreenState as EventListener);

    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreenState);
      document.removeEventListener('webkitfullscreenchange', updateFullscreenState as EventListener);
    };
  }, []);

  const toggleFullscreen = async () => {
    const fullscreenElement =
      document.fullscreenElement ||
      (document as Document & { webkitFullscreenElement?: Element | null }).webkitFullscreenElement;

    try {
      if (!fullscreenElement) {
        const element = document.documentElement;
        const requestFullscreen =
          element.requestFullscreen ||
          (element as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen;

        await requestFullscreen?.call(element);
      } else {
        const exitFullscreen =
          document.exitFullscreen ||
          (document as Document & { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen;

        await exitFullscreen?.call(document);
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  };

  const getBackgroundClass = () => {
    switch (game.screen) {
      case 'welcome':
      case 'learn':
      case 'quiz':
        return 'bg-gradient-to-br from-blue-400 via-blue-200 to-cyan-100'; // Morning
      case 'park':
      case 'itinerary':
      case 'customize':
        return 'bg-gradient-to-br from-orange-300 via-amber-200 to-yellow-100'; // Afternoon
      case 'summary':
      case 'present':
      case 'souvenir':
        return 'bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900'; // Night
      default:
        return 'bg-background';
    }
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-1000 ${getBackgroundClass()}`}>
      {/* Floating background elements */}
      <FloatingElements />

      {isFullscreenSupported && (
        <div className="fixed top-4 right-4 z-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-10 w-10 bg-white/85 text-slate-900 shadow-lg hover:bg-white"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 /> : <Maximize2 />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}</TooltipContent>
          </Tooltip>
        </div>
      )}
      
      {/* Journey Progress - visible except on welcome */}
      {game.screen !== 'welcome' && (
        <JourneyProgress currentScreen={game.screen} onNavigate={game.setScreen} />
      )}
      
      {/* Brownie Points - always visible except welcome */}
      {game.screen !== 'welcome' && (
        <div className="fixed top-16 right-4 z-40">
          <BrowniePoints points={game.browniePoints} hasBadge={game.hasBadge} />
        </div>
      )}

      {game.screen === 'welcome' && (
        <WelcomeScreen 
          onNavigate={game.setScreen} 
          selectedAvatarId={game.selectedAvatarId}
          setSelectedAvatarId={game.setSelectedAvatarId}
        />
      )}
      {game.screen === 'learn' && (
        <LearnScreen
          onNavigate={game.setScreen}
          onAddPoints={game.addPoints}
          slideIndex={game.learnSlideIndex}
          setSlideIndex={game.setLearnSlideIndex}
        />
      )}
      {game.screen === 'quiz' && (
        <QuizScreen
          onNavigate={game.setScreen}
          onAddPoints={game.addPoints}
          quizAnswers={game.quizAnswers}
          setQuizAnswers={game.setQuizAnswers}
        />
      )}
      {game.screen === 'park' && (
        <ParkMapScreen
          selectedItems={game.selectedItems}
          toggleItem={game.toggleItem}
          totalSpent={game.totalSpent}
          remaining={game.remaining}
          isOverBudget={game.isOverBudget}
          rideCount={game.rideCount}
          mealCount={game.mealCount}
          activityCount={game.activityCount}
          meetsRequirements={game.meetsRequirements}
          onNavigate={game.setScreen}
          weatherType={game.weatherType}
          setWeatherType={game.setWeatherType}
          selectedAvatarId={game.selectedAvatarId}
          extraBudget={game.extraBudget}
          setExtraBudget={game.setExtraBudget}
        />
      )}
      {game.screen === 'itinerary' && (
        <ItineraryScreen
          selectedItems={game.selectedItems}
          selectedParkItems={game.selectedParkItems}
          itinerary={game.itinerary}
          setItinerary={game.setItinerary}
          totalSpent={game.totalSpent}
          remaining={game.remaining}
          isOverBudget={game.isOverBudget}
          onNavigate={game.setScreen}
          onAddPoints={game.addPoints}
        />
      )}
      {game.screen === 'customize' && (
        <CustomizeScreen
          tripName={game.tripName}
          setTripName={game.setTripName}
          teamColor={game.teamColor}
          setTeamColor={game.setTeamColor}
          onNavigate={game.setScreen}
          onAddPoints={game.addPoints}
        />
      )}
      {game.screen === 'summary' && (
        <SummaryScreen
          tripName={game.tripName}
          teamColor={game.teamColor}
          selectedParkItems={game.selectedParkItems}
          itinerary={game.itinerary}
          totalSpent={game.totalSpent}
          remaining={game.remaining}
          isOverBudget={game.isOverBudget}
          browniePoints={game.browniePoints}
          hasBadge={game.hasBadge}
          onNavigate={game.setScreen}
          selectedAvatarId={game.selectedAvatarId}
          souvenirDesign={game.souvenirDesign}
          earnedBadges={game.earnedBadges}
        />
      )}
      {game.screen === 'present' && (
        <PresentScreen
          tripName={game.tripName}
          teamColor={game.teamColor}
          selectedParkItems={game.selectedParkItems}
          itinerary={game.itinerary}
          totalSpent={game.totalSpent}
          remaining={game.remaining}
          browniePoints={game.browniePoints}
          hasBadge={game.hasBadge}
          onNavigate={game.setScreen}
          applauseCount={game.applauseCount}
          setApplauseCount={game.setApplauseCount}
          selectedAvatarId={game.selectedAvatarId}
          souvenirDesign={game.souvenirDesign}
        />
      )}
      {game.screen === 'souvenir' && (
        <SouvenirScreen
          design={game.souvenirDesign}
          setDesign={game.setSouvenirDesign}
          onNavigate={game.setScreen}
          onAddPoints={game.addPoints}
        />
      )}
    </div>
  );
};

export default Index;
