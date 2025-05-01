import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGameState } from "@/lib/stores/useGameState";
import { useCasinoGame } from "@/lib/stores/useCasinoGame";
import { useAudio } from "@/lib/stores/useAudio";
import { playSound } from "@/lib/utils/audio";
import { shouldTriggerCelebration, getConfettiConfig } from "@/lib/utils/celebration";
import { CasinoCard, CasinoCardContent, CasinoCardHeader, CasinoCardTitle } from "../ui/card-casino";
import { CasinoButton } from "../ui/button-casino";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import GameBoard from "./GameBoard";
import Chip from "../ui/chip";
import CoinAnimation from "../ui/coin-animation";
import ConfettiExplosion from "../ui/confetti-explosion";
import LeaderboardTab from "../Leaderboard/LeaderboardTab";

// Function to calculate the payout based on the number of correct guesses (position)
const calculateRideTheBusPayout = (state: any) => {
  const { currentPosition, bet, gamePhase } = state;
  
  if (gamePhase !== "finished") return 0;
  
  // If position is 0, player lost on the first guess (red/black)
  if (currentPosition === 0) return 0;
  
  // Calculate based on how many correct guesses the player made
  // Each stage increases the payout
  switch (currentPosition) {
    case 1: return bet * 2;    // Passed 1st stage (red/black): 2x
    case 2: return bet * 4;    // Passed 2nd stage (higher/lower): 4x
    case 3: return bet * 8;    // Passed 3rd stage (inside/outside): 8x
    case 4: return bet * 20;   // Passed all stages (suits): 20x jackpot
    default: return 0;
  }
};

const RideTheBusGame = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationAmount, setAnimationAmount] = useState(0);
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
    rideTheBus,
    initRideTheBus,
    placeRideTheBusBet,
    chooseRed,
    chooseBlack,
    chooseHigherRide,
    chooseLowerRide,
    chooseInside,
    chooseOutside,
    chooseHearts,
    chooseDiamonds,
    chooseClubs,
    chooseSpades,
    resetRideTheBus,
  } = useGameState();
  
  const { balance, isBroke, updateBalance, addToHistory, resetBalance } = useCasinoGame();
  
  // Initialize the game when component mounts
  useEffect(() => {
    initRideTheBus();
  }, [initRideTheBus]);
  
  // Check for game completion when phase changes to finished
  useEffect(() => {
    if (rideTheBus.gamePhase === "finished") {
      const payout = calculateRideTheBusPayout(rideTheBus);
      const netWinnings = payout - rideTheBus.bet;
      
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
      addToHistory("ride-the-bus", netWinnings, result);
      
      // Show animation for wins
      if (payout > 0) {
        setAnimationAmount(payout);
        setShowAnimation(true);
        
        // Check if win is significant enough for confetti celebration
        // Ride the Bus can have very high payouts, especially for a full run
        const celebration = shouldTriggerCelebration(payout, rideTheBus.bet);
        
        if (celebration.trigger) {
          // Configure confetti based on win size
          const config = getConfettiConfig(celebration.tier);
          setConfettiConfig(config);
          setShowConfetti(true);
          
          // Play special success sound for big wins
          if (!isMuted && (celebration.tier === 'large' || celebration.tier === 'jackpot')) {
            playSound("success", 0.8);
          }
          
          // Show appropriate toast based on win significance
          if (celebration.tier === 'jackpot') {
            toast.success(`JACKPOT! You won $${payout}!`, {
              duration: 5000,
              className: "font-bold text-xl",
            });
          } else if (celebration.tier === 'large') {
            toast.success(`BIG WIN! $${payout}!`, {
              duration: 4000,
              className: "font-bold",
            });
          } else {
            toast.success(`You won $${payout}!`);
          }
        } else {
          toast.success(`You won $${payout}!`);
        }
      } else {
        toast.error("Better luck next time!");
      }
    }
  }, [rideTheBus.gamePhase, rideTheBus, updateBalance, addToHistory, isMuted]);
  
  // Handle betting
  const handlePlaceBet = (amount: number) => {
    if (amount > balance) {
      toast.error("Not enough balance");
      return;
    }
    
    if (!isMuted) {
      playSound("bet");
    }
    
    placeRideTheBusBet(amount);
  };
  
  // All-in betting function
  const handleAllIn = () => {
    if (balance <= 0) {
      toast.error("You have no balance to bet");
      return;
    }
    
    if (!isMuted) {
      playSound("bet");
    }
    
    placeRideTheBusBet(balance);
  };
  
  // Handle guessing red/black
  const handleRed = () => {
    if (!isMuted) {
      playSound("hit");
    }
    
    const correct = chooseRed();
    
    if (correct) {
      if (!isMuted) {
        playSound("success");
      }
    }
  };
  
  const handleBlack = () => {
    if (!isMuted) {
      playSound("hit");
    }
    
    const correct = chooseBlack();
    
    if (correct) {
      if (!isMuted) {
        playSound("success");
      }
    }
  };
  
  // Handle guessing higher/lower
  const handleHigher = () => {
    if (!isMuted) {
      playSound("hit");
    }
    
    const correct = chooseHigherRide();
    
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
    
    const correct = chooseLowerRide();
    
    if (correct) {
      if (!isMuted) {
        playSound("success");
      }
    }
  };
  
  // Handle guessing inside/outside
  const handleInside = () => {
    if (!isMuted) {
      playSound("hit");
    }
    
    const correct = chooseInside();
    
    if (correct) {
      if (!isMuted) {
        playSound("success");
      }
    }
  };
  
  const handleOutside = () => {
    if (!isMuted) {
      playSound("hit");
    }
    
    const correct = chooseOutside();
    
    if (correct) {
      if (!isMuted) {
        playSound("success");
      }
    }
  };
  
  // Handle guessing suit
  const handleHearts = () => {
    if (!isMuted) {
      playSound("hit");
    }
    
    const correct = chooseHearts();
    
    if (correct) {
      if (!isMuted) {
        playSound("success");
      }
    }
  };
  
  const handleDiamonds = () => {
    if (!isMuted) {
      playSound("hit");
    }
    
    const correct = chooseDiamonds();
    
    if (correct) {
      if (!isMuted) {
        playSound("success");
      }
    }
  };
  
  const handleClubs = () => {
    if (!isMuted) {
      playSound("hit");
    }
    
    const correct = chooseClubs();
    
    if (correct) {
      if (!isMuted) {
        playSound("success");
      }
    }
  };
  
  const handleSpades = () => {
    if (!isMuted) {
      playSound("hit");
    }
    
    const correct = chooseSpades();
    
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
    resetRideTheBus();
  };
  
  // Render betting phase
  const renderBettingPhase = () => (
    <div className="mt-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">Place Your Bet</h2>
      
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Chip
          key={5}
          value={5}
          size="lg"
          onClick={() => handlePlaceBet(5)}
          disabled={5 > balance}
        />
        <Chip
          key={10}
          value={10}
          size="lg"
          onClick={() => handlePlaceBet(10)}
          disabled={10 > balance}
        />
        <Chip
          key={25}
          value={25}
          size="lg"
          onClick={() => handlePlaceBet(25)}
          disabled={25 > balance}
        />
        <Chip
          key={50}
          value={50}
          size="lg"
          onClick={() => handlePlaceBet(50)}
          disabled={50 > balance}
        />
        <Chip
          key={100}
          value={100}
          size="lg"
          onClick={() => handlePlaceBet(100)}
          disabled={100 > balance}
        />
      </div>
      
      <CasinoButton
        variant="gold"
        size="lg"
        onClick={handleAllIn}
        disabled={balance <= 0}
      >
        ALL IN
      </CasinoButton>
    </div>
  );
  
  // Get the appropriate stage controls based on current stage
  const renderStageControls = () => {
    if (rideTheBus.gamePhase !== "playing") return null;
    
    switch (rideTheBus.stage) {
      case 0: // Red or Black
        return (
          <div className="mt-8 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Stage 1: Red or Black?</h3>
            <div className="flex justify-center gap-6">
              <CasinoButton
                variant="red"
                size="xl"
                onClick={handleRed}
              >
                Red
              </CasinoButton>
              
              <CasinoButton
                variant="default"
                size="xl"
                onClick={handleBlack}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Black
              </CasinoButton>
            </div>
          </div>
        );
        
      case 1: // Higher or Lower
        return (
          <div className="mt-8 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Stage 2: Higher or Lower?</h3>
            <div className="flex justify-center gap-6">
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
          </div>
        );
        
      case 2: // Inside or Outside
        return (
          <div className="mt-8 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Stage 3: Inside or Outside?</h3>
            <div className="flex justify-center gap-6">
              <CasinoButton
                variant="purple"
                size="xl"
                onClick={handleInside}
              >
                Inside
              </CasinoButton>
              
              <CasinoButton
                variant="green"
                size="xl"
                onClick={handleOutside}
              >
                Outside
              </CasinoButton>
            </div>
          </div>
        );
        
      case 3: // Guess the Suit
        return (
          <div className="mt-8 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Final Stage: Guess the Suit!</h3>
            <div className="grid grid-cols-2 gap-4">
              <CasinoButton
                variant="red"
                size="lg"
                onClick={handleHearts}
              >
                Hearts ♥
              </CasinoButton>
              
              <CasinoButton
                variant="red"
                size="lg"
                onClick={handleDiamonds}
              >
                Diamonds ♦
              </CasinoButton>
              
              <CasinoButton
                variant="default"
                size="lg"
                onClick={handleClubs}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Clubs ♣
              </CasinoButton>
              
              <CasinoButton
                variant="default"
                size="lg"
                onClick={handleSpades}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Spades ♠
              </CasinoButton>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render game interface
  return (
    <div className="max-w-4xl mx-auto pt-6 max-h-screen overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
      <CasinoCard gradient="red" bordered className="mb-4">
        <CasinoCardHeader className="py-2">
          <CasinoCardTitle>Ride The Bus</CasinoCardTitle>
        </CasinoCardHeader>
        <CasinoCardContent className="py-2">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p>Play through 4 stages of increasing difficulty to win big payouts!</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
              <span>1. Red or Black</span>
              <span>1st Stage: 2x payout</span>
              <span>2. Higher or Lower</span>
              <span>2nd Stage: 4x payout</span>
              <span>3. Inside or Outside</span>
              <span>3rd Stage: 8x payout</span>
              <span>4. Guess the Suit</span>
              <span>Final Stage: 20x payout</span>
            </div>
          </div>
        </CasinoCardContent>
      </CasinoCard>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="game" className="text-base">Game</TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-base">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="game" className="mt-0">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-800">
            {/* Show out of money message when broke */}
            {isBroke && rideTheBus.gamePhase === "betting" && (
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
            {(!isBroke || rideTheBus.gamePhase !== "betting") && (
              <>
                {/* Game Board */}
                {rideTheBus.currentCard && (
                  <GameBoard 
                    cardsInPlay={rideTheBus.cardsInPlay}
                    currentCard={rideTheBus.currentCard}
                    currentPosition={rideTheBus.currentPosition}
                    bet={rideTheBus.bet}
                    stage={rideTheBus.stage}
                  />
                )}
                
                {/* Game Controls */}
                {rideTheBus.gamePhase === "betting" && renderBettingPhase()}
                
                {/* Stage-specific controls */}
                {renderStageControls()}
                
                {/* Play Again button */}
                {rideTheBus.gamePhase === "finished" && (
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
              </>
            )}
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

export default RideTheBusGame;