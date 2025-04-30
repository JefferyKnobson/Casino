// Card types and utilities for card games

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Card {
  suit: Suit;
  value: CardValue;
  faceUp: boolean;
}

// Create a standard 52-card deck
export function createDeck(): Card[] {
  const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
  const values: CardValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value, faceUp: false });
    }
  }
  
  return shuffleDeck(deck);
}

// Shuffle a deck using Fisher-Yates algorithm
export function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

// Draw a single card from the deck
export function drawCard(deck: Card[], faceUp = true): [Card, Card[]] {
  if (deck.length === 0) {
    throw new Error("Cannot draw from an empty deck");
  }
  
  const card: Card = { ...deck[0], faceUp };
  const remainingDeck = deck.slice(1);
  
  return [card, remainingDeck];
}

// Get card display name
export function getCardName(card: Card): string {
  const valueNames = {
    1: "A",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "J",
    12: "Q",
    13: "K",
  };
  
  return `${valueNames[card.value]} of ${card.suit}`;
}

// Calculate the blackjack value of a card
export function getBlackjackCardValue(card: Card): number {
  if (card.value === 1) return 11; // Ace is 11 by default (soft value)
  if (card.value >= 10) return 10; // 10, J, Q, K all worth 10
  return card.value; // Number cards worth their face value
}

// Calculate the blackjack value of a hand, handling aces optimally
export function getBlackjackHandValue(cards: Card[]): { total: number; soft: boolean } {
  let total = 0;
  let aces = 0;
  let soft = false;
  
  for (const card of cards) {
    if (card.value === 1) {
      aces++;
      total += 11; // Initially count aces as 11
    } else if (card.value >= 10) {
      total += 10;
    } else {
      total += card.value;
    }
  }
  
  // Convert aces from 11 to 1 as needed to avoid busting
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  
  // If there's at least one ace counted as 11, the hand is "soft"
  soft = aces > 0;
  
  return { total, soft };
}

// Get the color of a card based on suit
export function getCardColor(suit: Suit): "red" | "black" {
  return (suit === "hearts" || suit === "diamonds") ? "red" : "black";
}

// Check if a blackjack hand is a blackjack (21 with exactly 2 cards)
export function isBlackjack(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  
  const { total } = getBlackjackHandValue(cards);
  return total === 21;
}

// Compare two cards for higher/lower game
export function compareCards(card1: Card, card2: Card): "higher" | "lower" | "same" {
  if (card1.value < card2.value) return "higher";
  if (card1.value > card2.value) return "lower";
  return "same";
}
