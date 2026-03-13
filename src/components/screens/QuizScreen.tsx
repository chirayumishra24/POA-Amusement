import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { QUIZ_QUESTIONS } from '@/lib/gameState';
import Confetti from '@/components/Confetti';
import EmojiExplosion from '@/components/EmojiExplosion';
import MascotGuide from '@/components/MascotGuide';
import type { GameScreen } from '@/hooks/useGameState';

interface Props {
  onNavigate: (screen: GameScreen) => void;
  onAddPoints: (pts: number) => void;
  quizAnswers: Record<number, number>;
  setQuizAnswers: (answers: Record<number, number>) => void;
}

const ENCOURAGEMENTS = [
  "You're a budgeting superstar! 🌟",
  "Amazing thinking! Keep it up! 🧠",
  "Wow, you really know your stuff! 🎉",
  "That's exactly right! You're so smart! 💪",
];

const TRY_AGAIN_MESSAGES = [
  "Almost! Don't worry, you're still learning! 💪",
  "Good try! Every mistake helps us learn! 🌟",
  "Not quite, but you're getting smarter! 🧠",
];

export default function QuizScreen({ onNavigate, onAddPoints, quizAnswers, setQuizAnswers }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [explosion, setExplosion] = useState(false);
  const [streak, setStreak] = useState(0);

  const q = QUIZ_QUESTIONS[currentQ];
  const selectedAnswer = quizAnswers[q.id];
  const isCorrect = selectedAnswer === q.correctIndex;

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setQuizAnswers({ ...quizAnswers, [q.id]: idx });
    setShowResult(true);
    if (idx === q.correctIndex) {
      onAddPoints(1);
      setConfetti(true);
      setExplosion(true);
      setStreak(s => s + 1);
      setTimeout(() => { setConfetti(false); setExplosion(false); }, 100);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      // Quiz (1.3) done, move back to 1.2 (Watch & Learn)
      onNavigate('learn');
    }
  };

  const optionColors = [
    { bg: 'bg-primary/15', border: 'border-primary/40', hover: 'hover:bg-primary/20 hover:border-primary' },
    { bg: 'bg-secondary/15', border: 'border-secondary/40', hover: 'hover:bg-secondary/20 hover:border-secondary' },
    { bg: 'bg-purple/15', border: 'border-purple/40', hover: 'hover:bg-purple/20 hover:border-purple' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20 sparkle-bg">
      <Confetti trigger={confetti} />
      <EmojiExplosion trigger={explosion} />
      
      {showResult && (
        <MascotGuide 
          message={isCorrect 
            ? ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
            : TRY_AGAIN_MESSAGES[Math.floor(Math.random() * TRY_AGAIN_MESSAGES.length)]
          }
          autoHide={4000}
        />
      )}

      {/* Question counter with streak */}
      <motion.div 
        className="glass-card px-6 py-2 mb-4 flex items-center gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <span className="font-display text-sm text-muted-foreground">
          Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
        </span>
        {streak > 0 && (
          <motion.span 
            className="font-display text-sm text-orange font-bold flex items-center gap-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            🔥 {streak} streak!
          </motion.span>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          className="glass-card p-8 max-w-lg w-full relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        >
          {/* Question emoji */}
          <motion.div 
            className="text-5xl text-center mb-4"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🤔
          </motion.div>
          
          <h2 className="font-display text-xl font-bold mb-6 text-foreground text-center">
            {q.question}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const colors = optionColors[i % optionColors.length];
              let style: string;
              
              if (showResult && i === q.correctIndex) {
                style = 'bg-accent/20 text-foreground border-accent ring-2 ring-accent/30 shadow-lg';
              } else if (showResult && selectedAnswer === i && !isCorrect) {
                style = 'bg-destructive/15 text-foreground border-destructive ring-2 ring-destructive/30';
              } else if (selectedAnswer === i) {
                style = 'bg-secondary/20 text-foreground border-secondary shadow-md';
              } else {
                style = `${colors.bg} text-foreground ${colors.border} ${!showResult ? colors.hover : ''}`;
              }

              return (
                <motion.button
                  key={i}
                  className={`w-full p-4 rounded-2xl font-body font-semibold text-left border-2 transition-all ${style}`}
                  whileHover={!showResult ? { scale: 1.02, x: 5 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(i)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-card font-display font-bold text-sm mr-3 shadow-sm">
                    {opt.label}
                  </span>
                  {opt.text}
                  
                  {showResult && i === q.correctIndex && (
                    <motion.span 
                      className="float-right text-xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 1] }}
                    >
                      ✅
                    </motion.span>
                  )}
                  {showResult && selectedAnswer === i && !isCorrect && (
                    <motion.span 
                      className="float-right text-xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ❌
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                className={`mt-5 p-4 rounded-2xl border-2 ${isCorrect ? 'bg-accent/10 border-accent/30' : 'bg-orange/10 border-orange/30'}`}
                initial={{ opacity: 0, y: 15, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <p className="font-display font-bold text-lg mb-1">
                  {isCorrect ? '🎉 Correct! +1 Brownie Point!' : '😊 Not quite — but now you know!'}
                </p>
                <p className="font-body text-sm text-muted-foreground">{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showResult && (
              <motion.button
                className="mt-4 w-full py-3 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {currentQ < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : '🎢 Start Planning! →'}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <motion.button
        className="mt-4 text-muted-foreground text-sm font-body underline decoration-dotted hover:text-foreground transition-colors"
        onClick={() => onNavigate('park')}
        whileHover={{ y: -1 }}
      >
        Skip to Park
      </motion.button>
    </div>
  );
}
