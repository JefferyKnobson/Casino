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

// Card type interface
interface Card {
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  value: number;
  faceUp: boolean;
}

// Simple Higher or Lower game with increasing stake
const HigherOrLowerGame = () => {
  // Animation states
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

  // Game state
  const { isMuted } = useAudio();
  const { balance, updateBalance, addToHistory, isBroke, resetBalance } = useCasinoGame();
  
  // Custom game state (not using Zustand for simplicity)
  const [deck, setDeck] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [previousCard, setPreviousCard] = useState<Card | null>(null);
  const [bet, setBet] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [gamePhase, setGamePhase] = useState<"betting" | "playing" | "finished">("betting");
  const [lastResult, setLastResult] = useState<"correct" | "wrong" | null>(null);
  const [totalWinnings, setTotalWinnings] = useState(0);
  
  // Initialize the game
  useEffect(() => {
    initGame();
  }, []);
  
  // Helper to create and shuffle a deck
  const createDeck = (): Card[] => {
    const suits: ("hearts" | "diamonds" | "clubs" | "spades")[] = ["hearts", "diamonds", "clubs", "spades"];
    const deck: Card[] = [];
    
    suits.forEach(suit => {
      for (let value = 1; value <= 13; value++) {
        deck.push({ suit, value, faceUp: false });
      }
    });
    
    return shuffleDeck(deck);
  };
  
  const shuffleDeck = (deck: Card[]): Card[] => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  };
  
  // Initialize or reset the game
  const initGame = () => {
    const newDeck = createDeck();
    setDeck(newDeck);
    setCurrentCard(null);
    setPreviousCard(null);
    setBet(0);
    setStreak(0);
    setGamePhase("betting");
    setLastResult(null);
    setTotalWinnings(0);
  };
  
  // Place a bet and start the game
  const placeBet = (amount: number) => {
    if (amount > balance) {
      toast.error("Not enough balance for this bet");
      return;
    }
    
    if (!isMuted) {
      playSound("bet");
    }
    
    // Deal the first card
    const newDeck = [...deck];
    const firstCard = { ...newDeck[0], faceUp: true };
    newDeck.shift();
    
    setBet(amount);
    setCurrentCard(firstCard);
    setDeck(newDeck);
    setGamePhase("playing");
  };
  
  // Calculate the payout multiplier based on streak
  const getPayoutMultiplier = () => {
    // Base payouts increase with streak
    if (streak < 5) return 2;
    if (streak < 10) return 3;
    if (streak < 15) return 5;
    if (streak < 20) return 10;
    return 20; // Maximum payout
  };
  
  // Handle player's choice (higher or lower)
  const makeGuess = (guess: "higher" | "lower") => {
    if (gamePhase !== "playing" || !currentCard) return;
    
    // Draw next card
    const newDeck = [...deck];
    const nextCard = { ...newDeck[0], faceUp: true };
    newDeck.shift();
    
    // Determine if the guess was correct
    let correct = false;
    if (guess === "higher") {
      correct = nextCard.value > currentCard.value;
    } else {
      correct = nextCard.value < currentCard.value;
    }
    
    // If cards are equal, the player loses
    if (nextCard.value === currentCard.value) {
      handleIncorrectGuess(nextCard, newDeck);
      return;
    }
    
    if (correct) {
      handleCorrectGuess(nextCard, newDeck);
    } else {
      handleIncorrectGuess(nextCard, newDeck);
    }
  };
  
  // Handle correct guess
  const handleCorrectGuess = (nextCard: Card, newDeck: Card[]) => {
    if (!isMuted) {
      playSound("win");
    }
    
    const newStreak = streak + 1;
    const newMaxStreak = Math.max(maxStreak, newStreak);
    
    // Calculate winnings
    const multiplier = getPayoutMultiplier();
    const winAmount = bet * multiplier;
    
    // Update the game state
    setPreviousCard(currentCard);
    setCurrentCard(nextCard);
    setDeck(newDeck);
    setStreak(newStreak);
    setMaxStreak(newMaxStreak);
    setLastResult("correct");
    setTotalWinnings(totalWinnings + winAmount);
    
    // Show animation for win
    if (multiplier >= 5) {
      // For bigger wins, show more celebration
      setAnimationAmount(winAmount);
      setShowAnimation(true);
      
      // Bigger wins get confetti
      if (multiplier >= 10) {
        const celebration = shouldTriggerCelebration(winAmount, bet);
        if (celebration.trigger) {
          const config = getConfettiConfig(celebration.tier);
          setConfettiConfig(config);
          setShowConfetti(true);
        }
      }
    }
    
    toast.success(`Correct! Win $${winAmount}`, { duration: 2000 });
  };
  
  // Handle incorrect guess
  const handleIncorrectGuess = (nextCard: Card, newDeck: Card[]) => {
    if (!isMuted) {
      playSound("loss");
    }
    
    // Calculate final payout
    const finalStreak = streak;
    
    // Update game state
    setPreviousCard(currentCard);
    setCurrentCard(nextCard);
    setDeck(newDeck);
    setLastResult("wrong");
    setGamePhase("finished");
    
    // If player had any streak, give them their winnings
    let finalWinnings = 0;
    if (finalStreak > 0) {
      // They keep what they've won so far
      finalWinnings = totalWinnings;
      
      // Update player balance
      updateBalance(finalWinnings - bet);
      addToHistory("higher-or-lower", finalWinnings - bet, "loss");
      
      toast.error(`Wrong guess! You lose, but keep $${finalWinnings} in winnings.`, { duration: 3000 });
    } else {
      // First guess was wrong, they lose their bet
      updateBalance(-bet);
      addToHistory("higher-or-lower", -bet, "loss");
      
      toast.error("Wrong guess! You lose your bet.", { duration: 2000 });
      
      // If they lost all their money, show broke message
      if (balance - bet <= 0) {
        setTimeout(() => {
          toast.error("You're out of money!", { duration: 3000 });
        }, 1000);
      }
    }
  };
  
  // Cash out and end the game with current winnings
  const cashOut = () => {
    if (gamePhase !== "playing" || !currentCard || streak === 0) return;
    
    if (!isMuted) {
      playSound("success");
    }
    
    // Calculate final payout
    const finalWinnings = totalWinnings;
    
    // Update player balance and history
    updateBalance(finalWinnings - bet);
    addToHistory("higher-or-lower", finalWinnings - bet, "win");
    
    // Show animations for cashing out
    setAnimationAmount(finalWinnings);
    setShowAnimation(true);
    
    // For big wins, add confetti
    if (streak >= 10) {
      const celebration = shouldTriggerCelebration(finalWinnings, bet);
      if (celebration.trigger) {
        const config = getConfettiConfig(celebration.tier);
        setConfettiConfig(config);
        setShowConfetti(true);
      }
    }
    
    setGamePhase("finished");
    toast.success(`You cashed out with $${finalWinnings}!`, { duration: 2500 });
  };
  
  // Start a new game
  const startNewGame = () => {
    initGame();
  };
  
  // Render betting controls
  const renderBettingControls = () => (
    <div className="mt-4 p-4 bg-slate-700 rounded-lg">
      <h3 className="text-center font-semibold text-white mb-3">Place Your Bet</h3>
      
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {[5, 10, 25, 50, 100].map(amount => (
          <Chip
            key={amount}
            value={amount as any}
            size="md"
            onClick={() => placeBet(amount)}
            disabled={amount > balance}
            className={bet === amount ? "ring-2 ring-offset-1 ring-primary" : ""}
          />
        ))}
      </div>
      
      <p className="text-xs text-center text-slate-300 mb-2">
        Increasing streak = higher rewards!<br />
        Start with 2x, up to 20x for long streaks.
      </p>
    </div>
  );
  
  // Render playing controls
  const renderPlayingControls = () => (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex gap-2 mb-2">
        <CasinoButton 
          variant="red" 
          className="flex-1" 
          onClick={() => makeGuess("lower")}
        >
          LOWER
        </CasinoButton>
        
        <CasinoButton 
          variant="green" 
          className="flex-1" 
          onClick={() => makeGuess("higher")}
        >
          HIGHER
        </CasinoButton>
      </div>
      
      <CasinoButton 
        variant="gold" 
        onClick={cashOut}
        disabled={streak === 0}
      >
        CASH OUT ${totalWinnings}
      </CasinoButton>
      
      <div className="text-center text-xs text-slate-300 mt-1">
        Current streak: {streak} | Payout multiplier: {getPayoutMultiplier()}x
      </div>
    </div>
  );
  
  // Render game over screen
  const renderGameOverControls = () => (
    <div className="mt-4 text-center">
      <p className="mb-3 text-slate-300">
        Game Over! {streak > 0 ? `You reached a streak of ${streak} correct guesses.` : "Better luck next time!"}
      </p>
      
      <CasinoButton 
        variant="blue" 
        onClick={startNewGame}
      >
        Play Again
      </CasinoButton>
    </div>
  );
  
  return (
    <div className="max-w-4xl mx-auto pt-4 pb-28 sm:pb-16 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
      <CasinoCard gradient="blue" bordered className="mb-4">
        <CasinoCardHeader className="py-2">
          <CasinoCardTitle>Higher or Lower</CasinoCardTitle>
        </CasinoCardHeader>
        <CasinoCardContent className="py-2">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <p>Guess if the next card will be higher or lower than the current one.</p>
            <p>The longer your streak, the bigger your potential rewards!</p>
          </div>
        </CasinoCardContent>
      </CasinoCard>
      
      {/* Show broke message if applicable */}
      {isBroke && gamePhase === "betting" && (
        <div className="mb-6 text-center py-4 bg-red-900/30 rounded-lg border border-red-800">
          <h2 className="text-xl font-bold text-red-400 mb-4">You're out of money!</h2>
          <p className="mb-6 text-gray-300">Reset your balance to continue playing.</p>
          <CasinoButton
            variant="red"
            onClick={resetBalance}
          >
            Reset Balance to $250
          </CasinoButton>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="game" className="text-base">Game</TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-base">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="game" className="mt-0">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Game info header */}
            <div className="bg-blue-800 p-3 text-white flex justify-between items-center border-b border-blue-900">
              <div className="font-bold">
                Balance: ${balance}
              </div>
              {bet > 0 && (
                <div>
                  Bet: ${bet}
                </div>
              )}
              {streak > 0 && (
                <div className="font-bold text-yellow-200">
                  Streak: {streak}
                </div>
              )}
            </div>
            
            {/* Game board display */}
            <div className="bg-slate-900 p-4">
              <GameBoard 
                currentCard={currentCard}
                previousCard={previousCard}
                streak={streak}
                lastResult={lastResult}
              />
              
              {/* Game controls */}
              {gamePhase === "betting" && !isBroke && renderBettingControls()}
              {gamePhase === "playing" && renderPlayingControls()}
              {gamePhase === "finished" && renderGameOverControls()}
            </div>
            
            {/* Game rules */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
              <div className="text-sm">
                <h3 className="font-bold mb-1">Rules:</h3>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Guess if the next card will be higher or lower than the current one</li>
                  <li>Aces are low (value 1)</li>
                  <li>Same value = lose</li>
                  <li>Cash out anytime to keep your winnings</li>
                  <li>Streak rewards: 0-4 = 2x, 5-9 = 3x, 10-14 = 5x, 15-19 = 10x, 20+ = 20x</li>
                </ul>
              </div>
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

export default HigherOrLowerGame;