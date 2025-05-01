import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGameState } from "@/lib/stores/useGameState";
import { useCasinoGame } from "@/lib/stores/useCasinoGame";
import { useAudio } from "@/lib/stores/useAudio";
import { playSound } from "@/lib/utils/audio";
import { shouldTriggerCelebration, getConfettiConfig } from "@/lib/utils/celebration";
import { CasinoCard, CasinoCardContent, CasinoCardHeader, CasinoCardTitle } from "../ui/card-casino";
import { CasinoButton } from "../ui/button-casino";
import Chip from "../ui/chip";
import CoinAnimation from "../ui/coin-animation";
import ConfettiExplosion from "../ui/confetti-explosion";

const RideTheBusGame = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationAmount, setAnimationAmount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiConfig, setConfettiConfig] = useState<{
    particleCount: number;
    duration: number;
    colors?: string[];
  }>({
    particleCount: 0,
    duration: 0,
    colors: undefined
  });
  const { isMuted } = useAudio();
  const { balance, isBroke, updateBalance, addToHistory, resetBalance } = useCasinoGame();
  
  // Handle placing a bet
  const handlePlaceBet = (amount: number) => {
    if (amount > balance) {
      toast.error("Not enough balance");
      return;
    }
    
    if (!isMuted) {
      playSound("bet");
    }
    
    // TODO: Implement actual bet placement
    toast.info(`Bet $${amount} placed (placeholder)`);
  };
  
  // Handle all-in bet
  const handleAllIn = () => {
    if (balance <= 0) {
      toast.error("You don't have any money to bet!");
      return;
    }
    
    if (!isMuted) {
      playSound("bet");
      setTimeout(() => playSound("success", 0.7), 300);
    }
    
    // Round down to nearest 5 for consistency with chip values
    const allInAmount = Math.floor(balance / 5) * 5;
    
    // Safeguard to ensure we don't bet more than available
    const betAmount = Math.min(allInAmount, balance);
    
    handlePlaceBet(betAmount);
    toast.success(`All in! Betting $${betAmount}`, { duration: 2000 });
  };
  
  // Render betting phase
  const renderBettingPhase = () => (
    <div className="mt-6 flex flex-col items-center">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Place Your Bet</h2>
      
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        {[5, 10, 25, 50, 100].map(value => (
          <Chip
            key={value}
            value={value as any}
            size="md"
            onClick={() => handlePlaceBet(value)}
            disabled={value > balance}
          />
        ))}
      </div>
      
      {/* All In Button */}
      <CasinoButton
        variant="green"
        onClick={handleAllIn}
        disabled={balance <= 0}
        className="mb-3 animate-pulse"
      >
        All In (${Math.floor(balance / 5) * 5})
      </CasinoButton>
      
      <div className="text-center text-gray-600 dark:text-gray-400 mt-3 sm:mt-4 text-sm sm:text-base">
        Click on a chip to place your bet
      </div>
    </div>
  );
  
  // Render game interface
  return (
    <div className="max-w-4xl mx-auto pt-6">
      <CasinoCard gradient="green" bordered className="mb-4">
        <CasinoCardHeader className="py-2">
          <CasinoCardTitle>Ride the Bus</CasinoCardTitle>
        </CasinoCardHeader>
        <CasinoCardContent className="py-2">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p>The classic Ride the Bus card game with four challenging stages:</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              <span>1. Red or Black</span>
              <span>2. Higher or Lower</span>
              <span>3. Inside or Outside</span>
              <span>4. Guess the Suit</span>
            </div>
          </div>
        </CasinoCardContent>
      </CasinoCard>
      
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-800">
        {/* Show out of money message when broke */}
        {isBroke && (
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
        
        {/* Show "under development" message if not broke */}
        {!isBroke && (
          <div className="text-center py-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              The new Ride the Bus game is currently under active development.
              <br/>
              Check back soon to play the full 4-stage version!
            </p>
            
            {/* Demo betting UI */}
            {renderBettingPhase()}
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
      
      {/* Confetti celebration for big wins */}
      {showConfetti && (
        <ConfettiExplosion
          active={showConfetti}
          duration={confettiConfig.duration}
          particleCount={confettiConfig.particleCount}
          colors={confettiConfig.colors}
          onComplete={() => setShowConfetti(false)}
        />
      )}
    </div>
  );
};

export default RideTheBusGame;