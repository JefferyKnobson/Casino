// Slot machine symbols and their properties
export interface SlotSymbol {
  id: string;
  symbol: string; // Emoji representation
  name: string;
  value: number; // Base multiplier value
  rarity: number; // Probability weight (lower = rarer)
}

// Slot machine symbols configuration
export const slotSymbols: SlotSymbol[] = [
  { id: "seven", symbol: "7️⃣", name: "Seven", value: 100, rarity: 1 },
  { id: "bell", symbol: "🔔", name: "Bell", value: 25, rarity: 1 },
  { id: "cherry", symbol: "🍒", name: "Cherry", value: 10, rarity: 6 },
  { id: "lemon", symbol: "🍋", name: "Lemon", value: 10, rarity: 6 },
  { id: "grape", symbol: "🍇", name: "Grape", value: 10, rarity: 6 },
  { id: "watermelon", symbol: "🍉", name: "Watermelon", value: 10, rarity: 6 },
];

// Generate random symbol based on rarity weights
export function getRandomSymbol(): SlotSymbol {
  // Calculate total weight
  const totalWeight = slotSymbols.reduce((sum, symbol) => sum + symbol.rarity, 0);
  
  // Generate random number within weight range
  const randomWeight = Math.random() * totalWeight;
  
  // Select symbol based on weight
  let cumulativeWeight = 0;
  for (const symbol of slotSymbols) {
    cumulativeWeight += symbol.rarity;
    if (randomWeight <= cumulativeWeight) {
      return symbol;
    }
  }
  
  // Fallback to last symbol (should never happen)
  return slotSymbols[slotSymbols.length - 1];
}

// Create a reel with symbols distributed according to their rarity
export function createReel(length: number = 20): SlotSymbol[] {
  const reel: SlotSymbol[] = [];
  
  for (let i = 0; i < length; i++) {
    reel.push(getRandomSymbol());
  }
  
  return reel;
}

// Generate random symbols for the slot machine
export function spinReels(numReels: number = 3): SlotSymbol[] {
  const result: SlotSymbol[] = [];
  
  for (let i = 0; i < numReels; i++) {
    result.push(getRandomSymbol());
  }
  
  return result;
}

// Calculate winnings based on the result of a spin
export interface SpinResult {
  symbols: SlotSymbol[];
  winLines: number[];
  multiplier: number;
  winAmount: number;
}

// Calculate winnings for a single spin
export function calculateWinnings(symbols: SlotSymbol[], bet: number): SpinResult {
  const winLines: number[] = [];
  let multiplier = 0;
  
  // Check for three matching symbols (jackpot)
  if (symbols[0].id === symbols[1].id && symbols[1].id === symbols[2].id) {
    winLines.push(0); // Center line
    multiplier = symbols[0].value;
  }
  // Check for two matching symbols (left to right)
  else if (symbols[0].id === symbols[1].id) {
    winLines.push(0); // Center line
    multiplier = Math.ceil(symbols[0].value / 5); // 20% of the symbol value
  }
  
  const winAmount = bet * multiplier;
  
  return {
    symbols,
    winLines,
    multiplier,
    winAmount,
  };
}

// Generate animation frames for spinning reels
export function generateSpinAnimation(
  finalSymbols: SlotSymbol[],
  frames: number = 20
): SlotSymbol[][] {
  const animation: SlotSymbol[][] = [];
  
  // Create initial random frames
  for (let i = 0; i < frames - 3; i++) {
    animation.push(spinReels());
  }
  
  // Last three frames gradually reveal the final result
  // Frame n-3: First reel stops
  animation.push([finalSymbols[0], getRandomSymbol(), getRandomSymbol()]);
  
  // Frame n-2: First and second reels stop
  animation.push([finalSymbols[0], finalSymbols[1], getRandomSymbol()]);
  
  // Frame n-1: All reels show final result
  animation.push(finalSymbols);
  
  return animation;
}
