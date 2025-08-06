import { useState, useEffect } from 'react';
import { GameCanvas } from '@/components/game/GameCanvas';
import { GameUI } from '@/components/game/GameUI';
import { FloatingBubbles } from '@/components/game/FloatingBubbles';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('axolotl-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Update high score when game ends
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('axolotl-high-score', score.toString());
    }
  }, [score, highScore]);

  const handleStartGame = () => {
    setGameStarted(true);
    setScore(0);
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-ocean relative overflow-hidden">
      <FloatingBubbles />
      
      {!gameStarted ? (
        <GameUI 
          onStartGame={handleStartGame}
          score={score}
          highScore={highScore}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center p-8">
          <GameCanvas />
        </div>
      )}
    </div>
  );
};

export default Index;
