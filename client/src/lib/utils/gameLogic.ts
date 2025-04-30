import { Card, getBlackjackHandValue, isBlackjack } from "./cards";

// Blackjack Game Logic
export type BlackjackGamePhase = "betting" | "dealing" | "playerTurn" | "dealerTurn" | "payout" | "finished";

export type BlackjackAction = "hit" | "stand" | "double" | "split" | "surrender" | "insurance";

export interface BlackjackGameState {
  deck: Card[];
  playerHands: Card[][];
  dealerHand: Card[];
  activeHandIndex: number;
  bets: number[];
  insurance: number;
  phase: BlackjackGamePhase;
}

export function getAvailableActions(gameState: BlackjackGameState): BlackjackAction[] {
  if (gameState.phase !== "playerTurn") return [];
  
  const actions: BlackjackAction[] = ["hit", "stand"];
  const currentHand = gameState.playerHands[gameState.activeHandIndex];
  
  // Can only double down on first action with a hand of 2 cards
  if (currentHand.length === 2) {
    actions.push("double");
    
    // Can only split if the two cards have the same value
    if (currentHand[0].value === currentHand[1].value) {
      actions.push("split");
    }
  }
  
  // Insurance is only available on dealer's first card is an Ace and it's the first player action
  if (
    gameState.dealerHand.length > 0 &&
    gameState.dealerHand[0].value === 1 && // Ace
    gameState.activeHandIndex === 0 &&
    gameState.insurance === 0 &&
    currentHand.length === 2
  ) {
    actions.push("insurance");
  }
  
  return actions;
}

// Calculate the outcome of a blackjack hand
export function calculateBlackjackOutcome(
  playerHand: Card[],
  dealerHand: Card[],
): "blackjack" | "win" | "loss" | "push" {
  const playerValue = getBlackjackHandValue(playerHand);
  const dealerValue = getBlackjackHandValue(dealerHand);
  
  // Check for player blackjack (pays 3:2)
  if (isBlackjack(playerHand)) {
    if (isBlackjack(dealerHand)) {
      return "push"; // Both have blackjack - push
    }
    return "blackjack"; // Player has blackjack, dealer doesn't
  }
  
  // Check for dealer blackjack (player already checked)
  if (isBlackjack(dealerHand)) {
    return "loss"; // Dealer has blackjack, player doesn't
  }
  
  // Check for busts
  if (playerValue.total > 21) {
    return "loss"; // Player busts
  }
  
  if (dealerValue.total > 21) {
    return "win"; // Dealer busts
  }
  
  // Compare hand values
  if (playerValue.total > dealerValue.total) {
    return "win"; // Player has higher value
  } else if (playerValue.total < dealerValue.total) {
    return "loss"; // Dealer has higher value
  } else {
    return "push"; // Equal values - push
  }
}

// Calculate payout for a blackjack bet
export function calculateBlackjackPayout(
  outcome: "blackjack" | "win" | "loss" | "push",
  bet: number,
): number {
  switch (outcome) {
    case "blackjack":
      return bet * 2.5; // Original bet + 1.5x payout (3:2)
    case "win":
      return bet * 2; // Original bet + 1x payout (1:1)
    case "push":
      return bet; // Return original bet
    case "loss":
    default:
      return 0; // Lose the bet
  }
}

// Round the Bus Game Logic
export type RoundTheBusGamePhase = "betting" | "playing" | "finished";

export interface RoundTheBusGameState {
  deck: Card[];
  pyramid: (Card | null)[][];
  currentCard: Card | null;
  currentLevel: number;
  bet: number;
  phase: RoundTheBusGamePhase;
}

// Calculate the payout for Round the Bus
export function calculateRoundTheBusPayout(gameState: RoundTheBusGameState): number {
  // If game is not finished, no payout yet
  if (gameState.phase !== "finished") return 0;
  
  // Check if player completed the pyramid
  const allLevelsComplete = 
    gameState.pyramid[0].every(card => card !== null) &&
    gameState.pyramid[1].every(card => card !== null) &&
    gameState.pyramid[2].every(card => card !== null);
  
  if (allLevelsComplete) {
    // Player completed all levels - win 3x the bet
    return gameState.bet * 3;
  }
  
  // Count how many cards were successfully placed
  let completedCards = 0;
  for (let i = 0; i < gameState.pyramid.length; i++) {
    for (let j = 0; j < gameState.pyramid[i].length; j++) {
      if (gameState.pyramid[i][j] !== null) {
        completedCards++;
      }
    }
  }
  
  // Partial completion payouts
  if (completedCards >= 5) { // Completed 5-6 cards
    return gameState.bet * 2;
  } else if (completedCards >= 3) { // Completed 3-4 cards
    return gameState.bet;
  } else {
    // Completed less than 3 cards - lose the bet
    return 0;
  }
}
