import { motion } from "framer-motion";
import { Card as CardType } from "@/lib/utils/cards";
import Card from "../Blackjack/Card";
import Chip from "../ui/chip";

interface GameBoardProps {
  pyramid: (CardType | null)[][];
  currentCard: CardType | null;
  currentLevel: number;
  bet: number;
}

const GameBoard = ({ pyramid, currentCard, currentLevel, bet }: GameBoardProps) => {
  // Calculate completed rounds
  const completedRounds = 
    pyramid[0].every(Boolean) ? 
      (pyramid[1].every(Boolean) ? 
        (pyramid[2].every(Boolean) ? 3 : 2) 
        : 1) 
      : 0;
  
  // Calculate payout multiplier based on completed rounds
  const getPayoutMultiplier = () => {
    switch (completedRounds) {
      case 1: return 2;   // Round 1: x2
      case 2: return 5;   // Round 2: x5
      case 3: return 10;  // Round 3: x10
      case 4: return 20;  // Round 4: x20
      default: return 0;  // No completed rounds
    }
  };
  
  const payoutMultiplier = getPayoutMultiplier();
  const possibleWinning = bet * payoutMultiplier;
  
  // Calculate current active level completion
  const currentLevelComplete = currentLevel === 0 
    ? pyramid[0].every(Boolean) 
    : currentLevel === 1 
      ? pyramid[1].every(Boolean) 
      : pyramid[2].every(Boolean);
  
  // Card scale based on screen size
  const cardScale = 0.7; // Smaller cards to fit on screen
  
  return (
    <div className="flex flex-col items-center">
      {/* Current bet and possible winnings */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4">
        <div className="flex flex-col items-center">
          <span className="text-xs sm:text-sm text-gray-500 mb-1">Your Bet</span>
          <div className="flex items-center">
            <Chip value={bet >= 100 ? 100 : (bet >= 50 ? 50 : (bet >= 25 ? 25 : (bet >= 10 ? 10 : 5)))} size="sm" />
            <span className="ml-2 font-bold">${bet}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-xs sm:text-sm text-gray-500 mb-1">Possible Win</span>
          <span className="font-bold text-green-600">${possibleWinning}</span>
        </div>
      </div>
      
      {/* Payout information */}
      <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs sm:text-sm">
        <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Round 1: 2x</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Round 2: 5x</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Round 3: 10x</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Round 4: 20x</div>
      </div>
      
      {/* Current card and pyramid together in a more compact layout */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
        {/* Current card */}
        {currentCard && (
          <div>
            <div className="text-center mb-1 font-medium text-sm">Current Card</div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <Card card={currentCard} faceUp={true} scale={cardScale * 1.1} />
            </motion.div>
          </div>
        )}
        
        {/* Pyramid structure */}
        <div className="flex flex-col items-center space-y-2 sm:space-y-3">
          {/* Level 3 (Top) - Round 3 */}
          <div className="flex justify-center">
            {pyramid[2].map((card, index) => (
              <div key={`2-${index}`} className="mx-[2px]">
                {card ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                  >
                    <Card card={card} faceUp={true} scale={cardScale} />
                  </motion.div>
                ) : (
                  <div className="w-[50px] h-[70px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {currentLevel === 2 && !currentLevelComplete && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Level 2 (Middle) - Round 2 */}
          <div className="flex justify-center">
            {pyramid[1].map((card, index) => (
              <div key={`1-${index}`} className="mx-[2px]">
                {card ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.1 * index }}
                  >
                    <Card card={card} faceUp={true} scale={cardScale} />
                  </motion.div>
                ) : (
                  <div className="w-[50px] h-[70px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {currentLevel === 1 && !currentLevelComplete && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Level 1 (Bottom) - Round 1 */}
          <div className="flex justify-center">
            {pyramid[0].map((card, index) => (
              <div key={`0-${index}`} className="mx-[2px]">
                {card ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.1 * index }}
                  >
                    <Card card={card} faceUp={true} scale={cardScale} />
                  </motion.div>
                ) : (
                  <div className="w-[50px] h-[70px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {currentLevel === 0 && !currentLevelComplete && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Game completion status */}
      {completedRounds === 3 && (
        <motion.div 
          className="mt-4 p-2 bg-green-100 text-green-800 rounded-md font-bold text-sm sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Congratulations! You completed all rounds!
        </motion.div>
      )}
    </div>
  );
};

export default GameBoard;
