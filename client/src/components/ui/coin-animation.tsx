import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Chip, { ChipValue } from "./chip";

interface CoinAnimationProps {
  amount: number;
  onComplete?: () => void;
  isWinning?: boolean;
}

const CoinAnimation = ({ amount, onComplete, isWinning = true }: CoinAnimationProps) => {
  const [coins, setCoins] = useState<{id: number; value: ChipValue; x: number; y: number}[]>([]);

  useEffect(() => {
    if (amount <= 0) {
      onComplete?.();
      return;
    }

    // Determine the number and types of coins to show based on amount
    const coinValues: ChipValue[] = [1000, 500, 100, 50, 25, 10, 5, 1];
    const coinsToShow: ChipValue[] = [];
    
    let remainingAmount = Math.abs(amount);
    
    // Calculate coins needed to represent the amount
    coinValues.forEach(value => {
      while (remainingAmount >= value) {
        coinsToShow.push(value);
        remainingAmount -= value;
      }
    });
    
    // Limit to max 10 coins for performance
    const limitedCoins = coinsToShow.slice(0, 10);
    
    // Create coins with random positions
    const newCoins = limitedCoins.map((value, index) => {
      // Calculate random positions
      const randomX = Math.random() * 200 - 100; // -100 to 100
      const randomY = Math.random() * 200 - 100; // -100 to 100
      
      return {
        id: index,
        value,
        x: randomX,
        y: randomY,
      };
    });
    
    setCoins(newCoins);
    
    // Cleanup after animation
    const timer = setTimeout(() => {
      setCoins([]);
      onComplete?.();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [amount, onComplete]);
  
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence>
          {coins.map(coin => (
            <motion.div
              key={coin.id}
              className="absolute"
              initial={{ 
                opacity: 0,
                scale: 0.5,
                x: 0,
                y: isWinning ? 100 : -100
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: coin.x,
                y: coin.y,
                rotate: Math.random() * 360,
              }}
              exit={{ 
                opacity: 0,
                scale: 0.5,
                y: isWinning ? -200 : 200
              }}
              transition={{
                type: "spring",
                duration: 1.5,
                delay: coin.id * 0.1,
              }}
            >
              <Chip 
                value={coin.value} 
                size="md" 
                className="pointer-events-none select-none"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoinAnimation;
