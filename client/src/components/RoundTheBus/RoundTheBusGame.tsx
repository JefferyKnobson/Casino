import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGameState } from "@/lib/stores/useGameState";
import { useCasinoGame } from "@/lib/stores/useCasinoGame";
import { useAudio } from "@/lib/stores/useAudio";
import { playSound } from "@/lib/utils/audio";
import { CasinoCard, CasinoCardContent, CasinoCardHeader, CasinoCardTitle } from "../ui/card-casino";
import { CasinoButton } from "../ui/button-casino";
import GameBoard from "./GameBoard";
import Chip from "../ui/chip";
import CoinAnimation from "../ui/coin-animation";

// Function to calculate the payout based on the number of correct guesses (position)
const calculateRoundTheBusPayout = (state: any) => {
  const { currentPosition, bet, gamePhase } = state;
  
  if (gamePhase !== "finished") return 0;
  
  // If position is 0, player lost on the first guess
  if (currentPosition === 0) return 0;
  
  // Calculate based on how many correct guesses the player made
  switch (currentPosition) {
    case 1: return bet * 2;   // 1 correct guess: 2x
    case 2: return bet * 4;   // 2 correct guesses: 4x
    case 3: return bet * 8;   // 3 correct guesses: 8x
    case 4: return bet * 10;  // All 4 correct guesses: 10x
    default: return 0;
  }
};

const RoundTheBusGame = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationAmount, setAnimationAmount] = useState(0);
  const { isMuted } = useAudio();
  const {
    roundTheBus,
    initRoundTheBus,
    placeBusRoundBet,
    chooseHigher,
    chooseLower,
    resetRoundTheBus,
  } = useGameState();
  
  const { balance, isBroke, updateBalance, addToHistory, resetBalance } = useCasinoGame();
  
  // Initialize the game when component mounts
  useEffect(() => {
    initRoundTheBus();
  }, [initRoundTheBus]);
  
  // Check for game completion when phase changes to finished
  useEffect(() => {
    if (roundTheBus.gamePhase === "finished") {
      const payout = calculateRoundTheBusPayout(roundTheBus);
      const netWinnings = payout - roundTheBus.bet;
      
      // Play appropriate sound
      if (!isMuted) {
        if (payout > 0) {
          playSound("win");
        } else {
          playSound("loss");
        }
      }
      
      // Update balance
      updateBalance(netWinnings);
      
      // Record in history
      const result = payout > 0 ? "win" : "loss";
      addToHistory("round-the-bus", netWinnings, result);
      
      // Show animation for wins
      if (payout > 0) {
        setAnimationAmount(payout);
        setShowAnimation(true);
      }
      
      // Show toast notification
      if (payout > 0) {
        toast.success(`You won $${payout}!`);
      } else {
        toast.error("Better luck next time!");
      }
    }
  }, [roundTheBus.gamePhase, roundTheBus, updateBalance, addToHistory, isMuted]);
  
  // Handle betting
  const handlePlaceBet = (amount: number) => {
    if (amount > balance) {
      toast.error("Not enough balance");
      return;
    }
    
    if (!isMuted) {
      playSound("bet");
    }
    
    placeBusRoundBet(amount);
  };
  
  // Handle guessing higher/lower
  const handleHigher = () => {
    if (!isMuted) {
      playSound("hit");
    }
    
    const correct = chooseHigher();
    
    if (correct) {
      if (!isMuted) {
        playSound("success");
      }
    }
  };
  
  const handleLower = () => {
    if (!isMuted) {
      playSound("hit");
    }
    
    const correct = chooseLower();
    
    if (correct) {
      if (!isMuted) {
        playSound("success");
      }
    }
  };
  
  // Handle starting a new game
  const handleNewGame = () => {
    if (!isMuted) {
      playSound("hit");
    }
    resetRoundTheBus();
  };
  
  // Render betting phase
  const renderBettingPhase = () => (
    <div className="mt-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">Place Your Bet</h2>
      
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {[5, 10, 25, 50, 100].map(value => (
          <Chip
            key={value}
            value={value as any}
            size="lg"
            onClick={() => handlePlaceBet(value)}
            disabled={value > balance}
          />
        ))}
      </div>
      
      <div className="text-center text-gray-600 dark:text-gray-400 mt-4">
        Click on a chip to place your bet
      </div>
    </div>
  );
  
  // Render game interface
  return (
    <div className="max-w-4xl mx-auto pt-6">
      <CasinoCard gradient="green" bordered className="mb-6">
        <CasinoCardHeader>
          <CasinoCardTitle>Round the Bus</CasinoCardTitle>
        </CasinoCardHeader>
        <CasinoCardContent>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <p>Guess if the next card will be higher or lower than the current one. Same value is a loss.</p>
            <p>Successfully complete all rounds to win up to 10x your bet!</p>
          </div>
        </CasinoCardContent>
      </CasinoCard>
      
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-800">
        {/* Show out of money message when broke */}
        {isBroke && roundTheBus.gamePhase === "betting" && (
          <div className="text-center py-8">
            <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">You're out of money!</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">Reset your balance to continue playing.</p>
            <CasinoButton
              variant="green"
              onClick={resetBalance}
            >
              Reset Balance to $250
            </CasinoButton>
          </div>
        )}
        
        {/* Only show game elements if not broke or if game is in progress */}
        {(!isBroke || roundTheBus.gamePhase !== "betting") && (
          <>
            {/* Game Board */}
            {roundTheBus.currentCard && (
              <GameBoard 
                cardsInPlay={roundTheBus.cardsInPlay}
                currentCard={roundTheBus.currentCard}
                currentPosition={roundTheBus.currentPosition}
                bet={roundTheBus.bet}
              />
            )}
            
            {/* Game Controls */}
            {roundTheBus.gamePhase === "betting" && renderBettingPhase()}
          </>
        )}
        
        {roundTheBus.gamePhase === "playing" && (
          <div className="mt-8 flex justify-center gap-6">
            <CasinoButton
              variant="blue"
              size="xl"
              onClick={handleHigher}
            >
              Higher ↑
            </CasinoButton>
            
            <CasinoButton
              variant="red"
              size="xl"
              onClick={handleLower}
            >
              Lower ↓
            </CasinoButton>
          </div>
        )}
        
        {roundTheBus.gamePhase === "finished" && (
          <div className="mt-6 flex justify-center">
            <CasinoButton
              variant="green"
              size="xl"
              onClick={handleNewGame}
            >
              Play Again
            </CasinoButton>
          </div>
        )}
      </div>
      
      {/* Coin animation */}
      {showAnimation && (
        <CoinAnimation 
          amount={animationAmount} 
          isWinning={true}
          onComplete={() => setShowAnimation(false)} 
        />
      )}
    </div>
  );
};

export default RoundTheBusGame;
