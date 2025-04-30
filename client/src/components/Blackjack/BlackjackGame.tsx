import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card as CardType } from "@/lib/utils/cards";
import { useGameState } from "@/lib/stores/useGameState";
import { useCasinoGame } from "@/lib/stores/useCasinoGame";
import { useAudio } from "@/lib/stores/useAudio";
import { calculateBlackjackOutcome, calculateBlackjackPayout } from "@/lib/utils/gameLogic";
import { playSound } from "@/lib/utils/audio";
import Card from "./Card";
import GameControls from "./GameControls";
import { CasinoCard, CasinoCardContent, CasinoCardHeader, CasinoCardTitle } from "../ui/card-casino";
import Chip, { ChipStack } from "../ui/chip";
import CoinAnimation from "../ui/coin-animation";
import { Button } from "../ui/button";

const BlackjackGame = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationAmount, setAnimationAmount] = useState(0);
  const { isMuted } = useAudio();
  const {
    blackjack,
    initBlackjack,
    placeBet,
    dealBlackjack,
    hitBlackjack,
    standBlackjack,
    doubleDownBlackjack,
    splitBlackjack,
    resetBlackjack,
  } = useGameState();
  
  const { balance, updateBalance, addToHistory } = useCasinoGame();
  
  // Initialize the game when component mounts
  useEffect(() => {
    initBlackjack();
  }, [initBlackjack]);
  
  // Handle coin animations when game phase changes to payout
  useEffect(() => {
    if (blackjack.gamePhase === "payout") {
      let totalWinnings = 0;
      let allBusted = true;
      
      // Check each player hand
      blackjack.playerHands.forEach((hand, index) => {
        const bet = blackjack.bets[index];
        const outcome = calculateBlackjackOutcome(hand, blackjack.dealerHand);
        const payout = calculateBlackjackPayout(outcome, bet);
        const netWinnings = payout - bet; // What the player won/lost
        
        totalWinnings += netWinnings;
        
        if (outcome !== "loss") {
          allBusted = false;
        }
      });
      
      // Play appropriate sound
      if (!isMuted) {
        if (totalWinnings > 0) {
          playSound("win");
        } else if (totalWinnings < 0) {
          playSound("loss");
        } else {
          playSound("hit");
        }
      }
      
      // Update balance
      updateBalance(totalWinnings);
      
      // Record in history
      const result = totalWinnings > 0 ? "win" : totalWinnings < 0 ? "loss" : "tie";
      addToHistory("blackjack", totalWinnings, result);
      
      // Show animation for wins
      if (totalWinnings !== 0) {
        setAnimationAmount(totalWinnings);
        setShowAnimation(true);
      }
      
      // Show toast notification
      if (totalWinnings > 0) {
        toast.success(`You won $${totalWinnings}!`);
      } else if (totalWinnings < 0) {
        toast.error(`You lost $${Math.abs(totalWinnings)}`);
      } else {
        toast.info("It's a push. Your bet is returned.");
      }
    }
  }, [blackjack.gamePhase, blackjack.playerHands, blackjack.dealerHand, blackjack.bets, updateBalance, addToHistory, isMuted]);
  
  // Calculate hand values
  const getHandValue = (hand: CardType[]) => {
    let value = 0;
    let aces = 0;
    
    hand.forEach(card => {
      if (card.value === 1) {
        aces++;
        value += 11;
      } else if (card.value >= 10) {
        value += 10;
      } else {
        value += card.value;
      }
    });
    
    // Adjust for aces
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  };
  
  // Handle clicking a chip to place a bet
  const handleChipClick = (value: number) => {
    if (blackjack.gamePhase !== "betting" || value > balance) return;
    
    if (!isMuted) {
      playSound("bet");
    }
    
    placeBet(value);
    dealBlackjack();
  };
  
  // Handle game actions
  const handleHit = () => {
    if (!isMuted) {
      playSound("hit");
    }
    hitBlackjack();
  };
  
  const handleStand = () => {
    if (!isMuted) {
      playSound("hit", 0.3);
    }
    standBlackjack();
  };
  
  const handleDoubleDown = () => {
    if (blackjack.bets[blackjack.activeHandIndex] > balance) {
      toast.error("Not enough balance to double down");
      return;
    }
    
    if (!isMuted) {
      playSound("bet");
    }
    
    doubleDownBlackjack();
  };
  
  const handleNewGame = () => {
    if (!isMuted) {
      playSound("hit");
    }
    resetBlackjack();
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
            onClick={() => handleChipClick(value)}
            disabled={value > balance}
          />
        ))}
      </div>
      
      <div className="text-center text-gray-600 dark:text-gray-400 mt-4">
        Click on a chip to place your bet
      </div>
    </div>
  );
  
  // Render player hands
  const renderPlayerHands = () => (
    <div className="mb-6">
      {blackjack.playerHands.map((hand, index) => (
        <div 
          key={index} 
          className={`relative mb-4 p-4 rounded-lg ${
            index === blackjack.activeHandIndex && blackjack.gamePhase === "playerTurn"
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              : ""
          }`}
        >
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium mr-3">
              Hand {index + 1}: {getHandValue(hand)}
            </h3>
            
            <div className="flex items-center">
              <ChipStack 
                value={blackjack.bets[index] >= 100 ? 100 : (blackjack.bets[index] >= 50 ? 50 : (blackjack.bets[index] >= 25 ? 25 : (blackjack.bets[index] >= 10 ? 10 : 5)))} 
                count={Math.floor(blackjack.bets[index] / (blackjack.bets[index] >= 100 ? 100 : (blackjack.bets[index] >= 50 ? 50 : (blackjack.bets[index] >= 25 ? 25 : (blackjack.bets[index] >= 10 ? 10 : 5)))))}
                size="sm"
              />
              <span className="ml-2 text-sm font-semibold">${blackjack.bets[index]}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {hand.map((card, cardIndex) => (
              <Card 
                key={cardIndex} 
                card={card} 
                faceUp={card.faceUp}
              />
            ))}
          </div>
          
          {getHandValue(hand) > 21 && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/20 rounded-lg">
              <div className="bg-red-600 text-white px-4 py-2 rounded-md font-bold transform -rotate-12">
                BUST!
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
  
  // Render dealer hand
  const renderDealerHand = () => (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-2">
        Dealer: {blackjack.dealerHand.some(card => !card.faceUp) ? "?" : getHandValue(blackjack.dealerHand)}
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {blackjack.dealerHand.map((card, index) => (
          <Card 
            key={index} 
            card={card} 
            faceUp={card.faceUp}
          />
        ))}
      </div>
      
      {blackjack.gamePhase === "payout" && getHandValue(blackjack.dealerHand) > 21 && (
        <div className="mt-2 inline-block bg-red-600 text-white px-4 py-2 rounded-md font-bold">
          DEALER BUST!
        </div>
      )}
    </div>
  );
  
  // Render controls based on game phase
  const renderControls = () => {
    if (blackjack.gamePhase === "betting") {
      return renderBettingPhase();
    }
    
    if (blackjack.gamePhase === "playerTurn") {
      const currentHand = blackjack.playerHands[blackjack.activeHandIndex];
      const currentBet = blackjack.bets[blackjack.activeHandIndex];
      const handValue = getHandValue(currentHand);
      
      // Disable controls if hand is already at 21 or busted
      const disableControls = handValue >= 21;
      
      // Check if we can double down (only on first action with 2 cards)
      const canDoubleDown = currentHand.length === 2 && balance >= currentBet;
      
      // Check if we can split (only with 2 cards of the same value)
      const canSplit = currentHand.length === 2 && 
        (currentHand[0].value === currentHand[1].value || 
          (currentHand[0].value >= 10 && currentHand[1].value >= 10)) && // Face cards can split too
        balance >= currentBet;
      
      return (
        <GameControls 
          onHit={handleHit}
          onStand={handleStand}
          onDoubleDown={handleDoubleDown}
          onSplit={splitBlackjack}
          disableControls={disableControls}
          canDoubleDown={canDoubleDown}
          canSplit={canSplit}
        />
      );
    }
    
    if (blackjack.gamePhase === "finished") {
      return (
        <div className="mt-6 flex justify-center">
          <Button onClick={handleNewGame} size="lg">New Game</Button>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="max-w-4xl mx-auto pt-6">
      <CasinoCard gradient="gold" bordered className="mb-6">
        <CasinoCardHeader>
          <CasinoCardTitle>Blackjack</CasinoCardTitle>
        </CasinoCardHeader>
        <CasinoCardContent>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <p>Get as close to 21 as possible without going over. Dealer hits on 16 or less and stands on 17 or more.</p>
            <p>Blackjack pays 3:2. All other wins pay 1:1.</p>
          </div>
        </CasinoCardContent>
      </CasinoCard>
      
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-800">
        {/* Dealer's Hand */}
        {blackjack.dealerHand.length > 0 && renderDealerHand()}
        
        {/* Player's Hands */}
        {blackjack.playerHands[0].length > 0 && renderPlayerHands()}
        
        {/* Game Controls */}
        {renderControls()}
      </div>
      
      {/* Coin animation */}
      {showAnimation && (
        <CoinAnimation 
          amount={animationAmount} 
          isWinning={animationAmount > 0}
          onComplete={() => setShowAnimation(false)} 
        />
      )}
    </div>
  );
};

export default BlackjackGame;
