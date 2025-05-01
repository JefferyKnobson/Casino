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
      case 1: return 2;    // 1 correct guess: x2
      case 2: return 4;    // 2 correct guesses: x4
      case 3: return 8;    // 3 correct guesses: x8
      case 4: return 20;   // All 4 correct guesses: x20
      default: return 0;   // No completed positions
    }
  };
  
  const payoutMultiplier = getPayoutMultiplier();
  const possibleWinning = bet * payoutMultiplier;
  
  // Card scale based on screen size - smaller to fit more cards
  const cardScale = 0.55; 
  
  return (
    <div className="flex flex-col items-center pb-20 sm:pb-16">
      {/* Current bet and possible winnings + Payout info in one row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-2 sm:gap-4 mb-4">
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Your Bet</span>
            <div className="flex items-center">
              <Chip value={bet >= 100 ? 100 : (bet >= 50 ? 50 : (bet >= 25 ? 25 : (bet >= 10 ? 10 : 5)))} size="sm" />
              <span className="ml-2 font-bold">${bet}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Possible Win</span>
            <span className="font-bold text-green-600">${possibleWinning}</span>
          </div>
        </div>
        
        {/* Payout information in a compact horizontal layout */}
        <div className="flex justify-center items-center flex-wrap gap-1">
          <div className={`px-2 py-0.5 text-xs rounded ${completedPositions >= 1 ? 'bg-green-100 dark:bg-green-900' : 'bg-slate-100 dark:bg-slate-800'}`}>1st: 2x</div>
          <div className={`px-2 py-0.5 text-xs rounded ${completedPositions >= 2 ? 'bg-green-100 dark:bg-green-900' : 'bg-slate-100 dark:bg-slate-800'}`}>2nd: 4x</div>
          <div className={`px-2 py-0.5 text-xs rounded ${completedPositions >= 3 ? 'bg-green-100 dark:bg-green-900' : 'bg-slate-100 dark:bg-slate-800'}`}>3rd: 8x</div>
          <div className={`px-2 py-0.5 text-xs rounded ${completedPositions >= 4 ? 'bg-green-100 dark:bg-green-900 font-bold' : 'bg-slate-100 dark:bg-slate-800'}`}>4th: 20x</div>
        </div>
      </div>
      
      {/* Combined cards layout - more compact */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        {/* Current card */}
        {currentCard && (
          <div className="flex flex-col items-center">
            <div className="text-center mb-1 text-xs font-medium">Current Card</div>
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
        <div className="flex flex-col items-center">
          <div className="text-center mb-1 text-xs font-medium">Cards in Play</div>
          <div className="flex justify-center space-x-2">
            {cardsInPlay.map((card, index) => (
              <div key={`card-${index}`} className="relative">
                {card ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.1 * index }}
                  >
                    <Card card={card} faceUp={true} scale={cardScale} />
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      {index + 1}
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-[40px] h-[56px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative">
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center">
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
      
      {/* Game completion status - smaller and more compact */}
      {completedPositions === 4 && (
        <motion.div 
          className="mt-3 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-md font-bold text-center text-xs sm:text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-base sm:text-lg mb-0.5">🎉 JACKPOT! 🎉</div>
          <div>Congratulations! You rode the entire bus and won 20x your bet!</div>
        </motion.div>
      )}
    </div>
  );
};

export default GameBoard;
