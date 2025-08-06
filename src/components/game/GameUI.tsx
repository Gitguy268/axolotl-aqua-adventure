import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GameUIProps {
  onStartGame: () => void;
  score: number;
  highScore: number;
}

export const GameUI = ({ onStartGame, score, highScore }: GameUIProps) => {
  return (
    <div className="min-h-screen bg-gradient-ocean flex items-center justify-center p-8">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold bg-gradient-coral bg-clip-text text-transparent">
            Axolotl Adventure
          </CardTitle>
          <CardDescription className="text-lg text-ocean-mid">
            Navigate through the infinite underwater world!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
              <span className="text-ocean-deep font-medium">Current Score:</span>
              <span className="text-2xl font-bold text-coral-pink">{score}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-ocean-deep font-medium">High Score:</span>
              <span className="text-2xl font-bold text-ocean-mid">{highScore}</span>
            </div>
          </div>

          <div className="space-y-3 text-sm text-ocean-mid">
            <h3 className="font-bold text-ocean-deep">How to Play:</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-coral-pink rounded-full"></span>
                Use <kbd className="px-2 py-1 bg-muted rounded">WASD</kbd> or arrow keys to move
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-coral-pink rounded-full"></span>
                Press <kbd className="px-2 py-1 bg-muted rounded">Space</kbd> to jump
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-coral-pink rounded-full"></span>
                Avoid coral obstacles to survive
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-coral-pink rounded-full"></span>
                The world scrolls infinitely!
              </li>
            </ul>
          </div>

          <Button 
            onClick={onStartGame}
            className="w-full bg-gradient-coral hover:scale-105 transition-transform text-white font-bold py-3 text-lg"
          >
            Start Swimming! 🌊
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};