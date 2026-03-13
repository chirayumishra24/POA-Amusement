import { useGameState } from '@/hooks/useGameState';
import BrowniePoints from '@/components/BrowniePoints';
import JourneyProgress from '@/components/JourneyProgress';
import FloatingElements from '@/components/FloatingElements';
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

const Index = () => {
  const game = useGameState();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Floating background elements */}
      <FloatingElements />
      
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
