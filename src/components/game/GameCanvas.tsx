import { useEffect, useRef, useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import axolotlSprite from '@/assets/axolotl-character.png';
import coralObstacle from '@/assets/coral-obstacle.png';
import oceanBackground from '@/assets/ocean-background.png';

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isGrounded: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const PLAYER_SPEED = 3;
const OBSTACLE_SPEED = 2;
const GROUND_Y = GAME_HEIGHT - 80;

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());
  const { toast } = useToast();

  const [gameState, setGameState] = useState<'playing' | 'gameOver'>('playing');
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState<Player>({
    x: 100,
    y: GROUND_Y - 60,
    width: 60,
    height: 60,
    velocityY: 0,
    isGrounded: true
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [backgroundX, setBackgroundX] = useState(0);

  // Load images
  const [images, setImages] = useState<{
    axolotl?: HTMLImageElement;
    coral?: HTMLImageElement;
    background?: HTMLImageElement;
  }>({});

  useEffect(() => {
    const loadImages = async () => {
      const axolotlImg = new Image();
      const coralImg = new Image();
      const backgroundImg = new Image();
      
      axolotlImg.src = axolotlSprite;
      coralImg.src = coralObstacle;
      backgroundImg.src = oceanBackground;

      await Promise.all([
        new Promise(resolve => { axolotlImg.onload = resolve; }),
        new Promise(resolve => { coralImg.onload = resolve; }),
        new Promise(resolve => { backgroundImg.onload = resolve; })
      ]);

      setImages({ 
        axolotl: axolotlImg, 
        coral: coralImg, 
        background: backgroundImg 
      });
    };

    loadImages();
  }, []);

  // Keyboard event handlers
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysPressed.current.add(event.code);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysPressed.current.delete(event.code);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Collision detection
  const checkCollision = (rect1: { x: number; y: number; width: number; height: number }, 
                         rect2: { x: number; y: number; width: number; height: number }) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw background with parallax scrolling
    if (images.background) {
      const bgWidth = images.background.width;
      const bgX1 = backgroundX % bgWidth;
      const bgX2 = bgX1 - bgWidth;
      
      ctx.drawImage(images.background, bgX1, 0, bgWidth, GAME_HEIGHT);
      ctx.drawImage(images.background, bgX2, 0, bgWidth, GAME_HEIGHT);
    }

    // Update player physics
    setPlayer(prevPlayer => {
      let newPlayer = { ...prevPlayer };

      // Handle input
      if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('KeyA')) {
        newPlayer.x = Math.max(0, newPlayer.x - PLAYER_SPEED);
      }
      if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('KeyD')) {
        newPlayer.x = Math.min(GAME_WIDTH - newPlayer.width, newPlayer.x + PLAYER_SPEED);
      }
      if ((keysPressed.current.has('Space') || keysPressed.current.has('ArrowUp') || keysPressed.current.has('KeyW')) && newPlayer.isGrounded) {
        newPlayer.velocityY = JUMP_FORCE;
        newPlayer.isGrounded = false;
      }

      // Apply gravity
      newPlayer.velocityY += GRAVITY;
      newPlayer.y += newPlayer.velocityY;

      // Ground collision
      if (newPlayer.y >= GROUND_Y - newPlayer.height) {
        newPlayer.y = GROUND_Y - newPlayer.height;
        newPlayer.velocityY = 0;
        newPlayer.isGrounded = true;
      }

      return newPlayer;
    });

    // Update obstacles
    setObstacles(prevObstacles => {
      return prevObstacles
        .map(obstacle => ({ ...obstacle, x: obstacle.x - OBSTACLE_SPEED }))
        .filter(obstacle => obstacle.x > -obstacle.width);
    });

    // Spawn new obstacles
    setObstacles(prevObstacles => {
      const lastObstacle = prevObstacles[prevObstacles.length - 1];
      if (!lastObstacle || lastObstacle.x < GAME_WIDTH - 200) {
        const newObstacle: Obstacle = {
          x: GAME_WIDTH,
          y: GROUND_Y - 80,
          width: 60,
          height: 80
        };
        return [...prevObstacles, newObstacle];
      }
      return prevObstacles;
    });

    // Update background position
    setBackgroundX(prev => prev - 1);

    // Update score
    setScore(prev => prev + 1);

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, images, backgroundX]);

  // Draw game objects
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || gameState !== 'playing') return;

    // Draw player
    if (images.axolotl) {
      ctx.drawImage(images.axolotl, player.x, player.y, player.width, player.height);
    } else {
      // Fallback rectangle
      ctx.fillStyle = '#ff69b4';
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Draw obstacles
    obstacles.forEach(obstacle => {
      if (images.coral) {
        ctx.drawImage(images.coral, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      } else {
        // Fallback rectangle
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }

      // Check collision
      if (checkCollision(player, obstacle)) {
        setGameState('gameOver');
        toast({
          title: "Game Over!",
          description: `Score: ${score}`,
          duration: 3000,
        });
      }
    });

    // Draw ground
    ctx.fillStyle = 'hsl(var(--seaweed-green))';
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
  }, [player, obstacles, score, gameState, images, toast]);

  // Start game loop
  useEffect(() => {
    if (gameState === 'playing') {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop, gameState]);

  const resetGame = () => {
    setGameState('playing');
    setScore(0);
    setPlayer({
      x: 100,
      y: GROUND_Y - 60,
      width: 60,
      height: 60,
      velocityY: 0,
      isGrounded: true
    });
    setObstacles([]);
    setBackgroundX(0);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="border-2 border-ocean-mid rounded-lg shadow-lg bg-gradient-ocean"
      />
      
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 bg-ocean-deep/80 flex items-center justify-center rounded-lg">
          <div className="bg-card p-8 rounded-lg text-center shadow-xl">
            <h2 className="text-3xl font-bold text-coral-pink mb-4">Game Over!</h2>
            <p className="text-xl mb-4">Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-coral-pink text-white rounded-lg hover:bg-coral-orange transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 bg-card/90 px-4 py-2 rounded-lg">
        <p className="text-lg font-bold text-ocean-deep">Score: {score}</p>
      </div>

      <div className="absolute bottom-4 left-4 bg-card/90 px-4 py-2 rounded-lg">
        <p className="text-sm text-ocean-mid">
          Use WASD or Arrow Keys to move • Space to jump
        </p>
      </div>
    </div>
  );
};