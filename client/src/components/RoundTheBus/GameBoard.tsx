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
  // Calculate the state of the board
  const levelProgress = [
    pyramid[0].filter(Boolean).length / pyramid[0].length,
    pyramid[1].filter(Boolean).length / pyramid[1].length,
    pyramid[2].filter(Boolean).length / pyramid[2].length,
  ];
  
  const isComplete = pyramid[2][0] !== null;
  const currentLevelComplete = currentLevel === 0 
    ? levelProgress[0] === 1 
    : currentLevel === 1 
      ? levelProgress[1] === 1 
      : levelProgress[2] === 1;
  
  // Calculate payout multiplier based on progress
  const getPayoutMultiplier = () => {
    if (isComplete) return 3; // Completed all levels
    if (levelProgress[1] === 1) return 2; // Completed 2 levels
    if (levelProgress[0] === 1) return 1.5; // Completed 1 level
    return 1; // Default
  };
  
  const payoutMultiplier = getPayoutMultiplier();
  const possibleWinning = Math.floor(bet * payoutMultiplier);
  
  return (
    <div className="flex flex-col items-center">
      {/* Current bet and possible winnings */}
      <div className="flex items-center justify-center space-x-8 mb-8">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-1">Your Bet</span>
          <div className="flex items-center">
            <Chip value={bet >= 100 ? 100 : (bet >= 50 ? 50 : (bet >= 25 ? 25 : (bet >= 10 ? 10 : 5)))} size="sm" />
            <span className="ml-2 font-bold">${bet}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-1">Possible Win</span>
          <span className="font-bold text-green-600">${possibleWinning}</span>
        </div>
      </div>
      
      {/* Current card */}
      {currentCard && (
        <div className="mb-10">
          <div className="text-center mb-2 font-medium">Current Card</div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <Card card={currentCard} faceUp={true} scale={1.2} />
          </motion.div>
        </div>
      )}
      
      {/* Pyramid structure */}
      <div className="flex flex-col items-center space-y-6">
        {/* Level 3 (Top) */}
        <div className="flex justify-center">
          {pyramid[2].map((card, index) => (
            <div key={`2-${index}`} className="mx-1">
              {card ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.2 }}
                >
                  <Card card={card} faceUp={true} />
                </motion.div>
              ) : (
                <div className="w-[70px] h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {currentLevel === 2 && !currentLevelComplete && (
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Level 2 (Middle) */}
        <div className="flex justify-center">
          {pyramid[1].map((card, index) => (
            <div key={`1-${index}`} className="mx-1">
              {card ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.1 * index }}
                >
                  <Card card={card} faceUp={true} />
                </motion.div>
              ) : (
                <div className="w-[70px] h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {currentLevel === 1 && !currentLevelComplete && (
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Level 1 (Bottom) */}
        <div className="flex justify-center">
          {pyramid[0].map((card, index) => (
            <div key={`0-${index}`} className="mx-1">
              {card ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.1 * index }}
                >
                  <Card card={card} faceUp={true} />
                </motion.div>
              ) : (
                <div className="w-[70px] h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {currentLevel === 0 && !currentLevelComplete && (
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Game completion status */}
      {isComplete && (
        <motion.div 
          className="mt-6 p-3 bg-green-100 text-green-800 rounded-md font-bold text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Congratulations! You completed the pyramid!
        </motion.div>
      )}
    </div>
  );
};

export default GameBoard;
