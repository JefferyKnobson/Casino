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

    // Determine appropriate chip values based on the win amount
    let coinsToShow: ChipValue[] = [];
    const winAmount = Math.abs(amount);
    
    // For more accurate representation of win amounts
    if (winAmount >= 1000) {
      coinsToShow.push(1000);
      if (winAmount >= 1500) coinsToShow.push(500);
      if (winAmount >= 1600) coinsToShow.push(100);
    } else if (winAmount >= 500) {
      coinsToShow.push(500);
      if (winAmount >= 600) coinsToShow.push(100);
      if (winAmount >= 650) coinsToShow.push(50);
    } else if (winAmount >= 100) {
      coinsToShow.push(100);
      if (winAmount >= 150) coinsToShow.push(50);
      if (winAmount >= 175) coinsToShow.push(25);
    } else if (winAmount >= 50) {
      coinsToShow.push(50);
      if (winAmount >= 75) coinsToShow.push(25);
    } else if (winAmount >= 25) {
      coinsToShow.push(25);
      if (winAmount >= 35) coinsToShow.push(10);
    } else if (winAmount >= 10) {
      coinsToShow.push(10);
      if (winAmount >= 15) coinsToShow.push(5);
    } else {
      coinsToShow.push(5);
    }
    
    // Limit to max 5 coins
    coinsToShow = coinsToShow.slice(0, 5);
    
    // Create coins with random positions
    const newCoins = coinsToShow.map((value, index) => {
      // Calculate random positions - more compact spread
      const randomX = Math.random() * 160 - 80; // -80 to 80
      const randomY = Math.random() * 160 - 80; // -80 to 80
      
      return {
        id: index,
        value,
        x: randomX,
        y: randomY,
      };
    });
    
    setCoins(newCoins);
    
    // Cleanup after animation - shorter duration
    const timer = setTimeout(() => {
      setCoins([]);
      onComplete?.();
    }, 1200); // Reduced from 2000ms to 1200ms
    
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
                duration: 0.8,
                delay: coin.id * 0.05,
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
