import { motion } from "framer-motion";
import { Card as CardType } from "@/lib/utils/cards";
import Card from "../Blackjack/Card";
import Chip from "../ui/chip";

interface GameBoardProps {
  cardsInPlay: (CardType | null)[];
  currentCard: CardType | null;
  currentPosition: number;
  bet: number;
}

const GameBoard = ({ cardsInPlay, currentCard, currentPosition, bet }: GameBoardProps) => {
  // Calculate completed rounds (0-4)
  const completedPositions = currentPosition;
  
  // Calculate payout multiplier based on completed rounds
  const getPayoutMultiplier = () => {
    switch (completedPositions) {
      case 1: return 2;   // 1 correct guess: x2
      case 2: return 4;   // 2 correct guesses: x4
      case 3: return 8;   // 3 correct guesses: x8
      case 4: return 10;  // All 4 correct guesses: x10
      default: return 0;  // No completed positions
    }
  };
  
  const payoutMultiplier = getPayoutMultiplier();
  const possibleWinning = bet * payoutMultiplier;
  
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
        <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">1 Card: 2x</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">2 Cards: 4x</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">3 Cards: 8x</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">4 Cards: 10x</div>
      </div>
      
      {/* Current card and cards in play in a linear layout */}
      <div className="flex flex-col items-center gap-6 sm:gap-8">
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
        
        {/* Cards in play - linear arrangement */}
        <div>
          <div className="text-center mb-2 font-medium text-sm">Cards in Play</div>
          <div className="flex justify-center space-x-3 sm:space-x-4">
            {cardsInPlay.map((card, index) => (
              <div key={`card-${index}`} className="relative">
                {card ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.1 * index }}
                  >
                    <Card card={card} faceUp={true} scale={cardScale} />
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      {index + 1}
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-[50px] h-[70px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative">
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center">
                      {index + 1}
                    </div>
                    {currentPosition + 1 === index && (
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
      {completedPositions === 4 && (
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
