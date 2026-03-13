import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { GameScreen } from '@/hooks/useGameState';
import MascotGuide from '@/components/MascotGuide';

interface Props {
  onNavigate: (screen: GameScreen) => void;
  onAddPoints: (pts: number) => void;
  slideIndex: number;
  setSlideIndex: (idx: number | ((prev: number) => number)) => void;
}

const LEARN_SLIDES = [
  {
    emoji: '🎢',
    bg: 'from-secondary/20 to-purple/10',
    title: 'Introduction: Plan a Trip!',
    text: 'Have you ever visited an amusement park? What was your favourite ride? If you had to plan the entire trip yourself, what would you include?',
    mascot: "Hi! I'm Skilli, your adventure guide! 🦊 Let's imagine the kind of adventure you would plan.",
    funFact: '🌟 Planning a trip involves making smart choices and working with a budget!',
  },
  {
    emoji: '💰',
    bg: 'from-sunny/20 to-orange/10',
    title: 'Your Budget: ₹1,500',
    text: 'You are now a Trip Planner! Your goal is to design the perfect amusement park day while staying within a ₹1,500 budget.',
    mascot: "Every ride, snack, or activity requires thoughtful decision-making! 💸",
    funFact: '💡 Choose rides, meals, and activities wisely to create a fun trip!',
    image: 'https://jurasikparkinn.com/wp-content/uploads/2024/02/6-Reasons-To-Explore-Amusement-Parks.webp'
  },
  {
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/D916Xq4Fbxg',
    title: 'What is a Budget?',
    text: 'Watch this short video to learn how budgeting works for kids!',
    emoji: '📺',
    bg: 'from-blue/20 to-indigo/10',
  },
  {
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/yH9OIsi2c4k',
    title: 'Top 10 Theme Parks',
    text: 'Get inspired by the most amazing theme parks in the world 2024!',
    emoji: '🌍',
    bg: 'from-green/20 to-teal/10',
  },
  {
    emoji: '💬',
    bg: 'from-accent/20 to-secondary/10',
    title: 'Let\'s Discuss!',
    text: 'What types of rides are there? Which rides look exciting or relaxing? What else can people do in amusement parks?',
    mascot: "Which ride looked the most exciting from the video? 🎢",
    funFact: '🤔 Thinking about your choices helps you plan a better trip!',
  },
];

const MINI_QUESTIONS = [
  { question: 'What ride do you want to try most?', emoji: '🤩', options: ['🎢 Thrilling Roller Coaster', '🎡 Relaxing Ferris Wheel', '🎠 Classic Carousel', '🚗 Bumper Cars'] },
  { question: 'What activity sounds most fun?', emoji: '🎯', options: ['📸 Photo Booth', '🕹️ Arcade Games', '🎁 Souvenir Shop', '🎯 Interactive Games'] },
];

export default function LearnScreen({ onNavigate, onAddPoints, slideIndex, setSlideIndex }: Props) {
  const [miniAnswers, setMiniAnswers] = useState<Record<number, number>>({});
  const isSlides = slideIndex < LEARN_SLIDES.length;
  const currentSlide = LEARN_SLIDES[slideIndex];
  const questionIndex = slideIndex - LEARN_SLIDES.length;
  const totalSlides = LEARN_SLIDES.length + MINI_QUESTIONS.length;

  const handleNext = () => {
    if (slideIndex === 1) {
      // Finished 1.1, go to Quiz (1.3)
      onNavigate('quiz');
      setSlideIndex(2);
      return;
    }

    if (slideIndex < totalSlides - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      onAddPoints(1);
      onNavigate('park');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20 fun-bg">
      {isSlides && currentSlide.mascot && (
        <MascotGuide 
          message={currentSlide.mascot} 
          autoHide={8000}
        />
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={slideIndex}
          className="glass-card p-8 max-w-2xl w-full text-center relative overflow-hidden"
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        >
          {isSlides ? (
            <>
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.bg} opacity-50 -z-10`} />
              
              <motion.div 
                className="text-7xl md:text-8xl mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {currentSlide.emoji}
              </motion.div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 text-primary">
                {currentSlide.title}
              </h2>
              
              {currentSlide.type === 'video' ? (
                <div className="aspect-video w-full mb-4 rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    className="w-full h-full"
                    src={currentSlide.videoUrl}
                    title={currentSlide.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : currentSlide.image ? (
                <div className="w-full mb-4 rounded-xl overflow-hidden shadow-lg max-h-48">
                  <img src={currentSlide.image} alt={currentSlide.title} className="w-full h-full object-cover" />
                </div>
              ) : null}

              <p className="text-muted-foreground font-body text-lg leading-relaxed mb-4">
                {currentSlide.text}
              </p>
              
              {/* Fun fact */}
              {currentSlide.funFact && (
                <motion.div
                  className="bg-sunny/10 rounded-2xl p-3 border border-sunny/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm font-body font-semibold text-sunny-foreground">
                    {currentSlide.funFact}
                  </p>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <motion.div 
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {MINI_QUESTIONS[questionIndex].emoji}
              </motion.div>
              <h2 className="font-display text-xl font-bold mb-5 text-secondary">
                {MINI_QUESTIONS[questionIndex].question}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {MINI_QUESTIONS[questionIndex].options.map((opt, i) => (
                  <motion.button
                    key={i}
                    className={`p-4 rounded-2xl font-body font-semibold text-sm border-2 transition-all ${
                      miniAnswers[questionIndex] === i
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                        : 'bg-card text-foreground border-border hover:border-primary hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMiniAnswers(prev => ({ ...prev, [questionIndex]: i }))}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-between items-center mt-6">
            <motion.button
              className="text-muted-foreground font-body text-sm hover:text-foreground transition-colors disabled:opacity-30"
              onClick={() => slideIndex > 0 && setSlideIndex(s => s - 1)}
              disabled={slideIndex === 0}
              whileHover={{ x: -3 }}
            >
              ← Back
            </motion.button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalSlides }, (_, i) => (
                <motion.div 
                  key={i} 
                  className={`rounded-full transition-all ${
                    i === slideIndex ? 'bg-primary w-6 h-2.5' : i < slideIndex ? 'bg-accent w-2.5 h-2.5' : 'bg-muted w-2.5 h-2.5'
                  }`}
                  layout
                />
              ))}
            </div>
            <motion.button
              className={`px-6 py-2.5 rounded-2xl font-display font-bold text-sm shadow-md ${
                !isSlides && miniAnswers[questionIndex] === undefined 
                  ? 'bg-muted text-muted-foreground' 
                  : 'bg-primary text-primary-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!isSlides && miniAnswers[questionIndex] === undefined}
            >
              {slideIndex === totalSlides - 1 ? 'Start Quiz →' : 'Next →'}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.button
        className="mt-4 text-muted-foreground text-sm font-body hover:text-foreground transition-colors underline decoration-dotted"
        onClick={() => onNavigate('quiz')}
        whileHover={{ y: -1 }}
      >
        Skip to Quiz
      </motion.button>
    </div>
  );
}
