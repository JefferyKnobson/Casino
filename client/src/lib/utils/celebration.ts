// Celebratory effects utilities for the casino games

/**
 * Determine if a win is significant enough to trigger confetti
 * based on the bet amount and win amount.
 * 
 * @param winAmount The amount won
 * @param betAmount The original bet amount
 * @returns Object with trigger status and celebration tier
 */
export function shouldTriggerCelebration(winAmount: number, betAmount: number): {
  trigger: boolean;
  tier: 'small' | 'medium' | 'large' | 'jackpot';
} {
  if (winAmount <= 0) {
    return { trigger: false, tier: 'small' };
  }

  // Calculate win ratio (how many times the bet was won)
  const winRatio = winAmount / betAmount;

  // Determine celebration tier based on win ratio
  if (winRatio >= 50) {
    // Epic win - 50x or more
    return { trigger: true, tier: 'jackpot' };
  } else if (winRatio >= 10) {
    // Big win - 10x to 50x
    return { trigger: true, tier: 'large' };
  } else if (winRatio >= 5) {
    // Good win - 5x to 10x
    return { trigger: true, tier: 'medium' };
  } else if (winRatio >= 3) {
    // Small win - 3x to 5x
    return { trigger: true, tier: 'small' };
  }

  // Win ratio too small to celebrate
  return { trigger: false, tier: 'small' };
}

/**
 * Get confetti settings based on the celebration tier
 * 
 * @param tier The celebration tier ('small', 'medium', 'large', 'jackpot')
 * @returns Configuration for the confetti effect
 */
export function getConfettiConfig(tier: 'small' | 'medium' | 'large' | 'jackpot'): {
  particleCount: number;
  duration: number;
  colors?: string[];
} {
  switch (tier) {
    case 'jackpot':
      return {
        particleCount: 1000,
        duration: 8000,
        colors: ['#FFD700', '#FFC107', '#FFEB3B', '#FFFF00', '#F5F5DC'], // Gold colors
      };
    case 'large':
      return {
        particleCount: 500,
        duration: 5000,
      };
    case 'medium':
      return {
        particleCount: 200,
        duration: 3000,
      };
    case 'small':
    default:
      return {
        particleCount: 100,
        duration: 2000,
      };
  }
}