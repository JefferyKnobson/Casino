import { create } from "zustand";

// Generic interface for card games
interface Card {
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  value: number; // 1-13 where 1 is Ace, 11-13 are Jack, Queen, King
  faceUp: boolean;
}

// Blackjack specific state
interface BlackjackState {
  deck: Card[];
  playerHands: Card[][];
  activeHandIndex: number;
  dealerHand: Card[];
  bets: number[];
  gamePhase: "betting" | "dealing" | "playerTurn" | "dealerTurn" | "payout" | "finished";
  insurance: number;
}

// Round the Bus specific state
interface RoundTheBusState {
  deck: Card[];
  pyramid: (Card | null)[][];
  currentCard: Card | null;
  currentLevel: number;
  bet: number;
  history: { card: Card; result: "higher" | "lower" | "same" }[];
  gamePhase: "betting" | "playing" | "finished";
}

// Slot machine specific state
interface SlotMachineState {
  reels: string[][];
  spinning: boolean;
  bet: number;
  lastResult: {
    symbols: string[];
    winAmount: number;
    winLines: number[];
  } | null;
}

// Combined game state
interface GameState {
  blackjack: BlackjackState;
  roundTheBus: RoundTheBusState;
  slotMachine: SlotMachineState;
  
  // Blackjack actions
  initBlackjack: () => void;
  placeBet: (amount: number) => void;
  dealBlackjack: () => void;
  hitBlackjack: () => void;
  standBlackjack: () => void;
  doubleDownBlackjack: () => void;
  splitBlackjack: () => void;
  placeInsurance: (amount: number) => void;
  resetBlackjack: () => void;
  
  // Round the Bus actions
  initRoundTheBus: () => void;
  placeBusRoundBet: (amount: number) => void;
  chooseHigher: () => boolean;
  chooseLower: () => boolean;
  resetRoundTheBus: () => void;
  
  // Slot machine actions
  initSlotMachine: () => void;
  placeSlotBet: (amount: number) => void;
  spinSlotMachine: () => Promise<{
    symbols: string[];
    winAmount: number;
    winLines: number[];
  }>;
  resetSlotMachine: () => void;
}

// Initial states for each game
const initialBlackjackState: BlackjackState = {
  deck: [],
  playerHands: [[]],
  activeHandIndex: 0,
  dealerHand: [],
  bets: [0],
  gamePhase: "betting",
  insurance: 0,
};

const initialRoundTheBusState: RoundTheBusState = {
  deck: [],
  pyramid: [
    [null, null, null],
    [null, null],
    [null],
  ],
  currentCard: null,
  currentLevel: 0,
  bet: 0,
  history: [],
  gamePhase: "betting",
};

const initialSlotMachineState: SlotMachineState = {
  reels: [
    ["🍒", "🍋", "🍉", "🍇", "7️⃣", "🔔", "🍀"],
    ["🍒", "🍋", "🍉", "🍇", "7️⃣", "🔔", "🍀"],
    ["🍒", "🍋", "🍉", "🍇", "7️⃣", "🔔", "🍀"],
  ],
  spinning: false,
  bet: 0,
  lastResult: null,
};

// Helper functions
const createDeck = (): Card[] => {
  const suits: Card["suit"][] = ["hearts", "diamonds", "clubs", "spades"];
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

export const useGameState = create<GameState>((set, get) => ({
  blackjack: initialBlackjackState,
  roundTheBus: initialRoundTheBusState,
  slotMachine: initialSlotMachineState,
  
  // Blackjack actions
  initBlackjack: () => {
    set({
      blackjack: {
        ...initialBlackjackState,
        deck: createDeck(),
      }
    });
  },
  
  placeBet: (amount) => {
    set(state => ({
      blackjack: {
        ...state.blackjack,
        bets: [amount],
        gamePhase: "dealing",
      }
    }));
  },
  
  dealBlackjack: () => {
    const { blackjack } = get();
    const { deck } = blackjack;
    
    // Deal two cards to player and dealer
    const playerCard1 = { ...deck[0], faceUp: true };
    const dealerCard1 = { ...deck[1], faceUp: true };
    const playerCard2 = { ...deck[2], faceUp: true };
    const dealerCard2 = { ...deck[3], faceUp: false }; // Dealer's hole card is face down
    
    const newDeck = deck.slice(4);
    
    set({
      blackjack: {
        ...blackjack,
        deck: newDeck,
        playerHands: [[playerCard1, playerCard2]],
        dealerHand: [dealerCard1, dealerCard2],
        gamePhase: "playerTurn",
      }
    });
    
    // Check for blackjack
    const playerTotal = playerCard1.value + playerCard2.value;
    if (playerTotal === 21) {
      // Player has blackjack, move to dealer turn
      get().standBlackjack();
    }
  },
  
  hitBlackjack: () => {
    const { blackjack } = get();
    const { deck, playerHands, activeHandIndex } = blackjack;
    
    // Draw a card from the deck
    const newCard = { ...deck[0], faceUp: true };
    const newDeck = deck.slice(1);
    
    // Add card to the active hand
    const updatedHands = [...playerHands];
    updatedHands[activeHandIndex] = [...updatedHands[activeHandIndex], newCard];
    
    // Calculate new hand value
    const handValue = calculateHandValue(updatedHands[activeHandIndex]);
    
    // Update state
    set({
      blackjack: {
        ...blackjack,
        deck: newDeck,
        playerHands: updatedHands,
        // If hand busted, move to next hand or dealer turn
        gamePhase: handValue > 21 
          ? (activeHandIndex < playerHands.length - 1 
              ? "playerTurn" 
              : "dealerTurn")
          : "playerTurn",
        activeHandIndex: handValue > 21 && activeHandIndex < playerHands.length - 1 
          ? activeHandIndex + 1 
          : activeHandIndex,
      }
    });
    
    // If player busted on last hand, move to dealer turn
    if (handValue > 21 && activeHandIndex === playerHands.length - 1) {
      // Reveal dealer's hole card
      setTimeout(() => {
        const { blackjack } = get();
        const updatedDealerHand = blackjack.dealerHand.map(card => ({ ...card, faceUp: true }));
        
        set({
          blackjack: {
            ...blackjack,
            dealerHand: updatedDealerHand,
            gamePhase: "payout",
          }
        });
        
        // Move to payout phase
        setTimeout(() => {
          set(state => ({
            blackjack: {
              ...state.blackjack,
              gamePhase: "finished",
            }
          }));
        }, 1500);
      }, 500);
    }
  },
  
  standBlackjack: () => {
    const { blackjack } = get();
    const { playerHands, activeHandIndex, dealerHand, deck } = blackjack;
    
    // If this is not the last hand, move to the next one
    if (activeHandIndex < playerHands.length - 1) {
      set({
        blackjack: {
          ...blackjack,
          activeHandIndex: activeHandIndex + 1,
        }
      });
      return;
    }
    
    // This is the last hand, move to dealer turn
    // First, reveal dealer's hole card
    const updatedDealerHand = dealerHand.map(card => ({ ...card, faceUp: true }));
    let newDeck = [...deck];
    
    set({
      blackjack: {
        ...blackjack,
        dealerHand: updatedDealerHand,
        gamePhase: "dealerTurn",
      }
    });
    
    // Dealer's turn logic
    setTimeout(() => {
      let currentDealerHand = [...updatedDealerHand];
      let dealerValue = calculateHandValue(currentDealerHand);
      
      // Dealer draws until 17 or higher
      const dealerDraw = () => {
        if (dealerValue < 17) {
          const { blackjack } = get();
          const { deck } = blackjack;
          
          // Draw a card
          const newCard = { ...deck[0], faceUp: true };
          newDeck = deck.slice(1);
          currentDealerHand = [...currentDealerHand, newCard];
          dealerValue = calculateHandValue(currentDealerHand);
          
          // Update state
          set({
            blackjack: {
              ...blackjack,
              deck: newDeck,
              dealerHand: currentDealerHand,
            }
          });
          
          // Continue drawing if needed
          setTimeout(() => {
            if (dealerValue < 17) {
              dealerDraw();
            } else {
              // Dealer is done, move to payout
              setTimeout(() => {
                set(state => ({
                  blackjack: {
                    ...state.blackjack,
                    gamePhase: "payout",
                  }
                }));
                
                // Move to finished state after payout
                setTimeout(() => {
                  set(state => ({
                    blackjack: {
                      ...state.blackjack,
                      gamePhase: "finished",
                    }
                  }));
                }, 1500);
              }, 500);
            }
          }, 700);
        } else {
          // Dealer is done, move to payout
          setTimeout(() => {
            set(state => ({
              blackjack: {
                ...state.blackjack,
                gamePhase: "payout",
              }
            }));
            
            // Move to finished state after payout
            setTimeout(() => {
              set(state => ({
                blackjack: {
                  ...state.blackjack,
                  gamePhase: "finished",
                }
              }));
            }, 1500);
          }, 500);
        }
      };
      
      dealerDraw();
    }, 1000);
  },
  
  doubleDownBlackjack: () => {
    const { blackjack } = get();
    const { deck, playerHands, activeHandIndex, bets } = blackjack;
    
    // Double the bet
    const newBets = [...bets];
    newBets[activeHandIndex] *= 2;
    
    // Draw one more card
    const newCard = { ...deck[0], faceUp: true };
    const newDeck = deck.slice(1);
    
    // Add card to current hand
    const updatedHands = [...playerHands];
    updatedHands[activeHandIndex] = [...updatedHands[activeHandIndex], newCard];
    
    // Move to next hand or dealer turn
    const nextHandIndex = activeHandIndex < playerHands.length - 1 
      ? activeHandIndex + 1 
      : activeHandIndex;
    
    const nextPhase = nextHandIndex > activeHandIndex 
      ? "playerTurn" 
      : "dealerTurn";
    
    set({
      blackjack: {
        ...blackjack,
        deck: newDeck,
        playerHands: updatedHands,
        bets: newBets,
        activeHandIndex: nextHandIndex,
        gamePhase: nextPhase,
      }
    });
    
    // If moved to dealer turn, continue with dealer's play
    if (nextPhase === "dealerTurn") {
      setTimeout(() => {
        get().standBlackjack();
      }, 700);
    }
  },
  
  splitBlackjack: () => {
    const { blackjack } = get();
    const { deck, playerHands, activeHandIndex, bets } = blackjack;
    
    // Get the current hand and bet
    const currentHand = playerHands[activeHandIndex];
    const currentBet = bets[activeHandIndex];
    
    // Create two new hands
    const hand1 = [{ ...currentHand[0], faceUp: true }];
    const hand2 = [{ ...currentHand[1], faceUp: true }];
    
    // Draw a card for each new hand
    const newCard1 = { ...deck[0], faceUp: true };
    const newCard2 = { ...deck[1], faceUp: true };
    const newDeck = deck.slice(2);
    
    hand1.push(newCard1);
    hand2.push(newCard2);
    
    // Replace current hand with the first new hand and add the second new hand
    const updatedHands = [...playerHands];
    updatedHands[activeHandIndex] = hand1;
    updatedHands.splice(activeHandIndex + 1, 0, hand2);
    
    // Add the same bet for the second hand
    const updatedBets = [...bets];
    updatedBets.splice(activeHandIndex + 1, 0, currentBet);
    
    set({
      blackjack: {
        ...blackjack,
        deck: newDeck,
        playerHands: updatedHands,
        bets: updatedBets,
      }
    });
  },
  
  placeInsurance: (amount) => {
    set(state => ({
      blackjack: {
        ...state.blackjack,
        insurance: amount,
      }
    }));
  },
  
  resetBlackjack: () => {
    set({
      blackjack: {
        ...initialBlackjackState,
        deck: createDeck(),
      }
    });
  },
  
  // Round the Bus actions
  initRoundTheBus: () => {
    set({
      roundTheBus: {
        ...initialRoundTheBusState,
        deck: createDeck(),
      }
    });
  },
  
  placeBusRoundBet: (amount) => {
    const { roundTheBus } = get();
    const { deck } = roundTheBus;
    
    // Draw the first card
    const firstCard = { ...deck[0], faceUp: true };
    const newDeck = deck.slice(1);
    
    // Update the first level of the pyramid
    const pyramid = [
      [firstCard, null, null],
      [null, null],
      [null],
    ];
    
    set({
      roundTheBus: {
        ...roundTheBus,
        deck: newDeck,
        pyramid,
        currentCard: firstCard,
        bet: amount,
        gamePhase: "playing",
      }
    });
  },
  
  chooseHigher: function() {
    return playRoundTheBusTurn.call(this, "higher");
  },
  
  chooseLower: function() {
    return playRoundTheBusTurn.call(this, "lower");
  },
  
  resetRoundTheBus: () => {
    set({
      roundTheBus: {
        ...initialRoundTheBusState,
        deck: createDeck(),
      }
    });
  },
  
  // Slot machine actions
  initSlotMachine: () => {
    set({
      slotMachine: initialSlotMachineState
    });
  },
  
  placeSlotBet: (amount) => {
    set(state => ({
      slotMachine: {
        ...state.slotMachine,
        bet: amount,
      }
    }));
  },
  
  spinSlotMachine: async () => {
    const { slotMachine } = get();
    
    set({
      slotMachine: {
        ...slotMachine,
        spinning: true,
        lastResult: null,
      }
    });
    
    // Simulate spin animation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random results for each reel
    const symbols = slotMachine.reels.map(reel => {
      const randomIndex = Math.floor(Math.random() * reel.length);
      return reel[randomIndex];
    });
    
    // Calculate winnings based on symbol combinations
    const { winAmount, winLines } = calculateSlotWinnings(symbols, slotMachine.bet);
    
    const result = { symbols, winAmount, winLines };
    
    // Update state with result
    set({
      slotMachine: {
        ...slotMachine,
        spinning: false,
        lastResult: result,
      }
    });
    
    return result;
  },
  
  resetSlotMachine: () => {
    set({
      slotMachine: initialSlotMachineState
    });
  },
}));

// Helper functions

// Calculate the value of a blackjack hand
function calculateHandValue(hand: Card[]): number {
  let value = 0;
  let aces = 0;
  
  for (const card of hand) {
    if (card.value === 1) {
      // Ace
      aces++;
      value += 11;
    } else if (card.value >= 10) {
      // Face cards
      value += 10;
    } else {
      // Number cards
      value += card.value;
    }
  }
  
  // Adjust aces if needed
  while (value > 21 && aces > 0) {
    value -= 10; // Convert an ace from 11 to 1
    aces--;
  }
  
  return value;
}

// Round the Bus turn logic
function playRoundTheBusTurn(this: any, choice: "higher" | "lower"): boolean {
  // Access the state using this context
  const { roundTheBus } = this.getState();
  const { deck, pyramid, currentCard, currentLevel } = roundTheBus;
  
  if (!currentCard || roundTheBus.gamePhase !== "playing") {
    return false;
  }
  
  // Draw the next card
  const nextCard = { ...deck[0], faceUp: true };
  const newDeck = deck.slice(1);
  
  // Determine if the guess was correct
  let correct = false;
  if (choice === "higher") {
    correct = cardValue(nextCard) > cardValue(currentCard);
  } else {
    correct = cardValue(nextCard) < cardValue(currentCard);
  }
  
  // If cards are equal, the player loses
  if (cardValue(nextCard) === cardValue(currentCard)) {
    correct = false;
  }
  
  // Update the pyramid based on current level
  const updatedPyramid = [...pyramid];
  let nextLevel = currentLevel;
  let nextPhase = roundTheBus.gamePhase;
  
  if (correct) {
    // Place card in the correct position of the current level
    if (currentLevel === 0) {
      // First level (3 cards)
      const emptySlotIndex = updatedPyramid[0].findIndex(card => card === null);
      if (emptySlotIndex !== -1) {
        updatedPyramid[0][emptySlotIndex] = nextCard;
        // If this was the last card in the level, move to the next level
        if (updatedPyramid[0].every(card => card !== null)) {
          nextLevel = 1;
        }
      }
    } else if (currentLevel === 1) {
      // Second level (2 cards)
      const emptySlotIndex = updatedPyramid[1].findIndex(card => card === null);
      if (emptySlotIndex !== -1) {
        updatedPyramid[1][emptySlotIndex] = nextCard;
        // If this was the last card in the level, move to the next level
        if (updatedPyramid[1].every(card => card !== null)) {
          nextLevel = 2;
        }
      }
    } else if (currentLevel === 2) {
      // Third level (1 card)
      updatedPyramid[2][0] = nextCard;
      // Game completed successfully
      nextPhase = "finished";
    }
  } else {
    // Incorrect guess, game over
    nextPhase = "finished";
  }
  
  // Add to history
  const historyEntry = { 
    card: nextCard, 
    result: correct ? (choice as "higher" | "lower") : "same" 
  };
  
  // Update state
  this.setState({
    roundTheBus: {
      ...roundTheBus,
      deck: newDeck,
      pyramid: updatedPyramid,
      currentCard: nextCard,
      currentLevel: nextLevel,
      history: [...roundTheBus.history, historyEntry],
      gamePhase: nextPhase,
    }
  });
  
  return correct;
}

// Helper to get card's numerical value for comparing
function cardValue(card: Card): number {
  return card.value;
}

// Calculate slot machine winnings
function calculateSlotWinnings(symbols: string[], bet: number): { winAmount: number; winLines: number[] } {
  const winLines: number[] = [];
  let multiplier = 0;
  
  // Extract emoji symbols for easier comparison
  const normalizedSymbols = symbols.map(s => {
    if (s === "7️⃣") return "seven";
    if (s === "🔔") return "bell";
    if (s === "🍒") return "cherry";
    if (s === "🍋") return "lemon";
    if (s === "🍇") return "grape";
    if (s === "🍉") return "watermelon";
    return s;
  });
  
  // Check for 3 sevens (jackpot - 100x)
  if (symbols.every(symbol => symbol === "7️⃣")) {
    winLines.push(0);
    multiplier = 100; // 3 sevens pays 100x
  }
  // Check for 3 bells (25x)
  else if (symbols.every(symbol => symbol === "🔔")) {
    winLines.push(0);
    multiplier = 25; // 3 bells pays 25x
  }
  // Check for 3 identical fruits (10x)
  else if (
    (symbols[0] === symbols[1] && symbols[1] === symbols[2]) && 
    (symbols[0] === "🍒" || symbols[0] === "🍋" || symbols[0] === "🍇" || symbols[0] === "🍉")
  ) {
    winLines.push(0);
    multiplier = 10; // Same fruit pays 10x
  }
  // Check for any 3 different fruits (2x)
  else if (
    symbols.every(symbol => 
      symbol === "🍒" || 
      symbol === "🍋" || 
      symbol === "🍇" || 
      symbol === "🍉"
    )
  ) {
    winLines.push(0);
    multiplier = 2; // Any 3 fruits pays 2x
  }
  
  const winAmount = bet * multiplier;
  return { winAmount, winLines };
}
