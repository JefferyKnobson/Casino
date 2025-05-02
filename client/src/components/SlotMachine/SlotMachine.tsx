import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useGameState } from "@/lib/stores/useGameState";
import { useCasinoGame } from "@/lib/stores/useCasinoGame";
import { useAudio } from "@/lib/stores/useAudio";
import { playSound } from "@/lib/utils/audio";
import { CasinoCard, CasinoCardContent, CasinoCardHeader, CasinoCardTitle } from "../ui/card-casino";
import { CasinoButton } from "../ui/button-casino";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Reel from "./Reel";
import Chip from "../ui/chip";
import CoinAnimation from "../ui/coin-animation";
import ConfettiExplosion from "../ui/confetti-explosion";
import { slotSymbolData } from "@/assets/svg/slot-symbols";
import { shouldTriggerCelebration, getConfettiConfig } from "@/lib/utils/celebration";
import LeaderboardTab from "../Leaderboard/LeaderboardTab";

const SlotMachine = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationAmount, setAnimationAmount] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("game");
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
  
  // Handle all-in bet
  const handleAllIn = () => {
    if (balance <= 0) {
      toast.error("You don't have any money to bet!");
      return;
    }
    
    if (!isMuted) {
      playSound("bet");
      // For a big bet, add an extra sound
      setTimeout(() => playSound("success", 0.7), 300);
    }
    
    // Round down to nearest 5 for consistency with chip values
    const allInAmount = Math.floor(balance / 5) * 5;
    
    // Safeguard to ensure we don't bet more than available
    const betAmount = Math.min(allInAmount, balance);
    
    placeSlotBet(betAmount);
    toast.success(`All in! Betting $${betAmount}`, { duration: 2000 });
  };
  
  // Handle spinning the reels
  const handleSpin = async () => {
    if (spinning || !slotMachine.bet) return;
    
    // Check if player has enough balance for this bet
    if (balance < slotMachine.bet) {
      toast.error("Not enough balance to spin!");
      return;
    }
    
    setSpinning(true);
    
    if (!isMuted) {
      playSound("spin");
    }
    
    try {
      const result = await spinSlotMachine();
      
      // Update balance and game history
      const newBalance = balance + (result.winAmount - slotMachine.bet);
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
              duration: 3000,
              className: "font-bold text-xl",
            });
          } else if (celebration.tier === 'large') {
            toast.success(`BIG WIN! $${result.winAmount}!`, {
              duration: 2500,
              className: "font-bold",
            });
          } else {
            toast.success(`You won $${result.winAmount}!`, { duration: 2000 });
          }
        } else {
          toast.success(`You won $${result.winAmount}!`, { duration: 2000 });
        }
      } else {
        toast.error("Better luck next time!", { duration: 2000 });
        
        // If player just lost their last money, show game over message
        if (newBalance <= 0) {
          setTimeout(() => {
            toast.error("You're out of money!", { duration: 3000 });
            // Reset bet so the game shows the reset balance button
            placeSlotBet(0);
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error spinning:", error);
      toast.error("Something went wrong while spinning");
    } finally {
      setSpinning(false);
    }
  };
  
  // Render betting controls - professional design
  const renderBettingControls = () => (
    <div className="flex flex-col items-center mt-4 sm:mt-6">
      <h3 className="font-bold mb-3 text-sm sm:text-base text-amber-300 drop-shadow-sm uppercase tracking-wide">Place Your Bet</h3>
      
      <div className="flex flex-wrap justify-center gap-2 mb-4 p-2 bg-black/20 rounded-lg">
        {[5, 10, 25, 50, 100].map(value => (
          <Chip
            key={value}
            value={value as any}
            size="sm"
            onClick={() => handlePlaceBet(value)}
            disabled={spinning || value > balance}
            className={`transition-all duration-200 ${slotMachine.bet === value ? "ring-2 ring-offset-1 ring-amber-500 shadow-lg shadow-amber-500/30" : "hover:scale-110"}`}
          />
        ))}
      </div>
      
      {/* Buttons row - improved layout and styling */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        {/* All In Button */}
        <CasinoButton
          variant="gold"
          onClick={handleAllIn}
          disabled={spinning || balance <= 0}
          className="text-sm sm:text-base py-2 px-3 shadow-md shadow-amber-900/30 transition-all duration-200 hover:scale-105"
          size="sm"
        >
          <span className="font-bold">All In</span>
          <span className="ml-1 font-medium">(${Math.floor(balance / 5) * 5})</span>
        </CasinoButton>
        
        <CasinoButton
          variant="red"
          onClick={handleSpin}
          disabled={spinning || !slotMachine.bet}
          className="w-full py-2 sm:py-3 text-sm sm:text-base font-bold tracking-wide shadow-md shadow-red-900/30 transition-all duration-200 hover:scale-105"
          size="sm"
        >
          {spinning ? (
            <div className="flex items-center justify-center">
              <span className="mr-2">SPINNING</span>
              <span className="animate-ping">...</span>
            </div>
          ) : (
            <span className="uppercase">Spin!</span>
          )}
        </CasinoButton>
      </div>
    </div>
  );
  
  // Render the paytable - professional design
  const renderPaytable = () => (
    <div className="mt-1 p-3 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-lg border border-zinc-700/50 shadow-inner">
      {/* Title */}
      <h3 className="text-center text-amber-300 font-bold text-sm uppercase tracking-wider mb-2">Payout Table</h3>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 bg-black/30 p-2 rounded-md">
          <div className="flex flex-col items-start">
            <span className="text-gray-300 text-xs">Three Fruit</span>
            <span className="text-base">🍋🍉🍒</span>
          </div>
          <div className="ml-auto px-2 py-1 bg-amber-900/60 rounded font-mono font-bold text-amber-300">2x</div>
        </div>
        
        <div className="flex items-center gap-2 bg-black/30 p-2 rounded-md">
          <div className="flex flex-col items-start">
            <span className="text-gray-300 text-xs">Any Three Same</span>
            <span className="text-base">🍇🍇🍇</span>
          </div>
          <div className="ml-auto px-2 py-1 bg-amber-800/60 rounded font-mono font-bold text-amber-300">10x</div>
        </div>
        
        <div className="flex items-center gap-2 bg-black/30 p-2 rounded-md">
          <div className="flex flex-col items-start">
            <span className="text-gray-300 text-xs">Three Bells</span>
            <span className="text-base">🔔🔔🔔</span>
          </div>
          <div className="ml-auto px-2 py-1 bg-amber-700/60 rounded font-mono font-bold text-amber-300">25x</div>
        </div>
        
        <div className="flex items-center gap-2 bg-black/30 p-2 rounded-md">
          <div className="flex flex-col items-start">
            <span className="text-gray-300 text-xs">Jackpot</span>
            <span className="text-base text-red-500 font-bold">777</span>
          </div>
          <div className="ml-auto px-2 py-1 bg-red-800/60 rounded font-mono font-bold text-amber-300">100x</div>
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
    <div className="max-w-4xl mx-auto pt-4 pb-28 sm:pb-16 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
      <CasinoCard gradient="red" bordered elevated className="mb-4 overflow-hidden">
        <CasinoCardHeader className="py-3 bg-gradient-to-r from-red-700 to-red-900 text-white">
          <CasinoCardTitle className="text-xl font-bold tracking-wide">Slot Machine</CasinoCardTitle>
        </CasinoCardHeader>
        <CasinoCardContent className="py-3 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
            <p className="mb-1">Place your bet and try your luck! Match symbols across the payline to win.</p>
            <p>Three matching symbols pay the biggest prizes. Match 7-7-7 to win the grand jackpot!</p>
          </div>
        </CasinoCardContent>
      </CasinoCard>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
        <TabsList className="grid w-full grid-cols-2 mb-4 shadow-sm">
          <TabsTrigger value="game" className="text-base font-medium">Game</TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-base font-medium">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="game" className="mt-0">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Slot machine top - refined with better gradient and cleaner layout */}
            <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 p-3 text-amber-50 flex justify-between items-center border-b border-amber-900/50">
              <div className="font-bold flex items-center">
                <span className="text-amber-200 mr-1">Balance:</span> 
                <span className="text-white">${balance}</span>
              </div>
              {slotMachine.bet > 0 && (
                <div className="flex items-center">
                  <span className="text-amber-200 mr-1">Bet:</span>
                  <span className="text-white">${slotMachine.bet}</span>
                </div>
              )}
              {slotMachine.lastResult?.winAmount ? (
                <div className="flex items-center font-bold">
                  <span className="text-amber-200 mr-1">Win:</span>
                  <span className="text-amber-50">${slotMachine.lastResult.winAmount}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-amber-200 mr-1">Win:</span>
                  <span className="text-white">$0</span>
                </div>
              )}
            </div>
            
            {/* Slot machine body - sophisticated design with better gradients */}
            <div className="bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 p-4 sm:p-6 border-b border-zinc-700">
              {/* Show out of money message when broke */}
              {isBroke && !slotMachine.bet && (
                <div className="text-center py-8 px-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-4 drop-shadow-md">You're out of money!</h2>
                  <p className="mb-6 text-gray-300">Reset your balance to continue playing.</p>
                  <CasinoButton
                    variant="red"
                    onClick={resetBalance}
                    className="px-6 py-2.5 font-semibold"
                  >
                    Reset Balance to $250
                  </CasinoButton>
                </div>
              )}
              
              {/* Only show game elements if not broke or if game has a bet */}
              {(!isBroke || slotMachine.bet > 0) && (
                <>
                  {/* Reels container - better styling with border and shadow */}
                  <div className="relative mb-6 bg-black/30 p-4 rounded-lg shadow-inner">
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
                    
                    {/* Win markers - improved design */}
                    {slotMachine.lastResult?.winLines.includes(0) && !spinning && (
                      <>
                        <motion.div 
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full shadow-md shadow-amber-500/50"
                          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        />
                        <motion.div 
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full shadow-md shadow-amber-500/50"
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
            
            {/* Paytable - redesigned with better styling */}
            <div className="p-3 sm:p-4 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
              {renderPaytable()}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-0">
          <LeaderboardTab />
        </TabsContent>
      </Tabs>
      
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
