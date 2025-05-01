import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useGameState } from "@/lib/stores/useGameState";
import { useCasinoGame } from "@/lib/stores/useCasinoGame";
import { useAudio } from "@/lib/stores/useAudio";
import { playSound } from "@/lib/utils/audio";
import { CasinoCard, CasinoCardContent, CasinoCardHeader, CasinoCardTitle } from "../ui/card-casino";
import { CasinoButton } from "../ui/button-casino";
import Reel from "./Reel";
import Chip from "../ui/chip";
import CoinAnimation from "../ui/coin-animation";
import ConfettiExplosion from "../ui/confetti-explosion";
import { slotSymbolData } from "@/assets/svg/slot-symbols";
import { shouldTriggerCelebration, getConfettiConfig } from "@/lib/utils/celebration";

const SlotMachine = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationAmount, setAnimationAmount] = useState(0);
  const [spinning, setSpinning] = useState(false);
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
  
  const {
    slotMachine,
    initSlotMachine,
    placeSlotBet,
    spinSlotMachine,
  } = useGameState();
  
  const { balance, isBroke, updateBalance, addToHistory, resetBalance } = useCasinoGame();
  
  // Initialize the game when component mounts
  useEffect(() => {
    initSlotMachine();
  }, [initSlotMachine]);
  
  // Handle placing a bet
  const handlePlaceBet = (amount: number) => {
    if (amount > balance) {
      toast.error("Not enough balance");
      return;
    }
    
    if (!isMuted) {
      playSound("bet");
    }
    
    placeSlotBet(amount);
  };
  
  // Handle spinning the reels
  const handleSpin = async () => {
    if (spinning || !slotMachine.bet) return;
    
    setSpinning(true);
    
    if (!isMuted) {
      playSound("spin");
    }
    
    try {
      const result = await spinSlotMachine();
      
      // Update balance and game history
      updateBalance(result.winAmount - slotMachine.bet);
      
      // Play appropriate sound
      if (!isMuted) {
        if (result.winAmount > 0) {
          playSound("win");
        } else {
          playSound("loss");
        }
      }
      
      // Record in history
      const gameResult = result.winAmount > 0 ? "win" : "loss";
      addToHistory("slots", result.winAmount - slotMachine.bet, gameResult);
      
      // Show win animation and toast
      if (result.winAmount > 0) {
        setAnimationAmount(result.winAmount);
        setShowAnimation(true);
        
        // Check if win is big enough for confetti celebration
        const celebration = shouldTriggerCelebration(result.winAmount, slotMachine.bet);
        if (celebration.trigger) {
          // Configure and show confetti based on win size
          const config = getConfettiConfig(celebration.tier);
          setConfettiConfig(config);
          setShowConfetti(true);
          
          // Play success sound for bigger wins
          if (!isMuted && (celebration.tier === 'large' || celebration.tier === 'jackpot')) {
            playSound("success", 0.8);
          }
          
          // Show appropriate toast message based on win size
          if (celebration.tier === 'jackpot') {
            toast.success(`JACKPOT! You won $${result.winAmount}!`, {
              duration: 5000,
              className: "font-bold text-xl",
            });
          } else if (celebration.tier === 'large') {
            toast.success(`BIG WIN! $${result.winAmount}!`, {
              duration: 4000,
              className: "font-bold",
            });
          } else {
            toast.success(`You won $${result.winAmount}!`);
          }
        } else {
          toast.success(`You won $${result.winAmount}!`);
        }
      } else {
        toast.error("Better luck next time!");
      }
    } catch (error) {
      console.error("Error spinning:", error);
      toast.error("Something went wrong while spinning");
    } finally {
      setSpinning(false);
    }
  };
  
  // Render betting controls
  const renderBettingControls = () => (
    <div className="flex flex-col items-center mt-6">
      <h3 className="font-bold mb-3">Select Bet</h3>
      
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {[5, 10, 25, 50, 100].map(value => (
          <Chip
            key={value}
            value={value as any}
            size="md"
            onClick={() => handlePlaceBet(value)}
            disabled={spinning || value > balance}
            className={slotMachine.bet === value ? "ring-2 ring-offset-2 ring-primary" : ""}
          />
        ))}
      </div>
      
      <CasinoButton
        variant="red"
        size="xl"
        onClick={handleSpin}
        disabled={spinning || !slotMachine.bet}
        className="mt-2 w-full max-w-xs"
      >
        {spinning ? "Spinning..." : "SPIN"}
      </CasinoButton>
    </div>
  );
  
  // Render the paytable - formatted to match the image
  const renderPaytable = () => (
    <div className="mt-8 p-4 bg-black text-white rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg">3 FRUIT:</span>
          <span className="text-xl">🍋 🍉 🍒</span>
          <span className="text-yellow-400 font-bold ml-auto">2x</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg">SAME FRUIT:</span>
          <span className="text-xl">🍇 🍇 🍇</span>
          <span className="text-yellow-400 font-bold ml-auto">10x</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg">3 BELLS:</span>
          <span className="text-xl">🔔 🔔 🔔</span>
          <span className="text-yellow-400 font-bold ml-auto">25x</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg">3 SEVENS:</span>
          <span className="text-xl text-red-600 font-bold">7 7 7</span>
          <span className="text-yellow-400 font-bold ml-auto">100x</span>
        </div>
      </div>
    </div>
  );
  
  // Get the currently visible symbols
  const getVisibleSymbols = () => {
    if (slotMachine.lastResult) {
      return slotMachine.lastResult.symbols;
    }
    
    // Default symbols if no result yet
    return ["🍒", "🍋", "7️⃣"];
  };
  
  return (
    <div className="max-w-4xl mx-auto pt-6">
      <CasinoCard gradient="red" bordered className="mb-6">
        <CasinoCardHeader>
          <CasinoCardTitle>Slot Machine</CasinoCardTitle>
        </CasinoCardHeader>
        <CasinoCardContent>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <p>Place your bet and try your luck! Match symbols across the payline to win.</p>
            <p>Three matching symbols pay the biggest prizes. Two matching symbols from left to right pay smaller wins.</p>
          </div>
        </CasinoCardContent>
      </CasinoCard>
      
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Slot machine top */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 p-3 text-amber-100 flex justify-between items-center">
          <div className="font-bold">
            Balance: ${balance}
          </div>
          {slotMachine.bet > 0 && (
            <div>
              Bet: ${slotMachine.bet}
            </div>
          )}
          {slotMachine.lastResult?.winAmount ? (
            <div className="font-bold text-amber-200">
              Win: ${slotMachine.lastResult.winAmount}
            </div>
          ) : (
            <div>Win: $0</div>
          )}
        </div>
        
        {/* Slot machine body */}
        <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 p-8">
          {/* Show out of money message when broke */}
          {isBroke && !slotMachine.bet && (
            <div className="text-center py-8">
              <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-4">You're out of money!</h2>
              <p className="mb-6 text-gray-300">Reset your balance to continue playing.</p>
              <CasinoButton
                variant="red"
                onClick={resetBalance}
              >
                Reset Balance to $250
              </CasinoButton>
            </div>
          )}
          
          {/* Only show game elements if not broke or if game has a bet */}
          {(!isBroke || slotMachine.bet > 0) && (
            <>
              {/* Reels container */}
              <div className="relative mb-8">
                {/* Reels */}
                <div className="flex justify-center gap-3 mb-2">
                  {slotMachine.reels.map((reel, index) => (
                    <Reel
                      key={index}
                      spinning={spinning}
                      symbol={getVisibleSymbols()[index]}
                      delay={index * 0.5}
                      isWinning={
                        slotMachine.lastResult?.winLines.includes(0) &&
                        !spinning
                      }
                    />
                  ))}
                </div>
                
                {/* Payline removed as requested */}
                
                {/* Win markers */}
                {slotMachine.lastResult?.winLines.includes(0) && !spinning && (
                  <>
                    <motion.div 
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    <motion.div 
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  </>
                )}
              </div>
              
              {/* Controls */}
              {renderBettingControls()}
            </>
          )}
        </div>
        
        {/* Paytable */}
        <div className="p-4">
          {renderPaytable()}
        </div>
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

export default SlotMachine;
