import { motion } from "framer-motion";
import { Card as CardType } from "@/lib/utils/cards";
import Card from "../Blackjack/Card";
import Chip from "../ui/chip";

interface GameBoardProps {
  cardsInPlay: (CardType | null)[];
  currentCard: CardType | null;
  currentPosition: number;
  bet: number;
  stage: number;
}

const GameBoard = ({ cardsInPlay, currentCard, currentPosition, bet, stage }: GameBoardProps) => {
  // Calculate payout multiplier based on current stage
  const getPayoutMultiplier = () => {
    switch (currentPosition) {
      case 1: return 2;    // Passed stage 1 (red/black): x2
      case 2: return 4;    // Passed stage 2 (higher/lower): x4
      case 3: return 8;    // Passed stage 3 (inside/outside): x8
      case 4: return 20;   // Passed all 4 stages (suits): x20
      default: return 0;   // No completed stages
    }
  };
  
  const payoutMultiplier = getPayoutMultiplier();
  const possibleWinning = bet * payoutMultiplier;
  
  // Card scale based on screen size - smaller to fit more cards
  const cardScale = 0.55; 
  
  // Get stage name for display
  const getStageName = (stageNum: number) => {
    switch (stageNum) {
      case 0: return "Red or Black";
      case 1: return "Higher or Lower";
      case 2: return "Inside or Outside";
      case 3: return "Guess the Suit";
      default: return "";
    }
  };
  
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
          <div className={`px-2 py-0.5 text-xs rounded ${stage >= 0 ? (currentPosition >= 1 ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900') : 'bg-slate-100 dark:bg-slate-800'}`}>Stage 1: 2x</div>
          <div className={`px-2 py-0.5 text-xs rounded ${stage >= 1 ? (currentPosition >= 2 ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900') : 'bg-slate-100 dark:bg-slate-800'}`}>Stage 2: 4x</div>
          <div className={`px-2 py-0.5 text-xs rounded ${stage >= 2 ? (currentPosition >= 3 ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900') : 'bg-slate-100 dark:bg-slate-800'}`}>Stage 3: 8x</div>
          <div className={`px-2 py-0.5 text-xs rounded ${stage >= 3 ? (currentPosition >= 4 ? 'bg-green-100 dark:bg-green-900 font-bold' : 'bg-blue-100 dark:bg-blue-900') : 'bg-slate-100 dark:bg-slate-800'}`}>Stage 4: 20x</div>
        </div>
      </div>
      
      {/* Current stage indicator */}
      <div className="w-full mb-4">
        <div className="text-center text-sm font-semibold">
          Current Stage: {getStageName(stage)}
        </div>
        
        {/* Progress bar showing all 4 stages */}
        <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(stage / 3) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Combined cards layout - more compact */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
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
          <div className="text-center mb-1 text-xs font-medium">Your Cards</div>
          <div className="flex justify-center space-x-3">
            {cardsInPlay.map((card, index) => (
              <div key={`card-${index}`} className="relative">
                {card ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.1 * index }}
                  >
                    <Card card={card} faceUp={true} scale={cardScale} />
                    <div 
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center ${
                        index <= stage ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-[40px] h-[56px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative">
                    <div 
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center ${
                        index <= stage ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {currentPosition === index && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Game completion status - if won the game */}
      {currentPosition === 4 && (
        <motion.div 
          className="mt-3 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-md font-bold text-center text-xs sm:text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-base sm:text-lg mb-0.5">🎉 JACKPOT! 🎉</div>
          <div>Congratulations! You completed all 4 stages and won {payoutMultiplier}x your bet!</div>
        </motion.div>
      )}
    </div>
  );
};

export default GameBoard;