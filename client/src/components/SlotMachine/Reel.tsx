import { motion } from "framer-motion";
import Symbol from "./Symbol";

interface ReelProps {
  symbol: string;
  spinning: boolean;
  delay?: number;
  isWinning?: boolean;
}

const Reel = ({ symbol, spinning, delay = 0, isWinning = false }: ReelProps) => {
  // Simple spinning animation
  const spinVariants = {
    spinning: {
      y: [0, -1000],
      transition: { 
        repeat: Infinity, 
        duration: 0.5, 
        ease: "linear"
      }
    },
    stopping: {
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay 
      }
    }
  };
  
  // Simple winning animation
  const winVariants = {
    idle: { 
      scale: 1 
    },
    winning: { 
      scale: [1, 1.1, 1],
      boxShadow: [
        "0 0 0 rgba(245, 158, 11, 0)",
        "0 0 15px rgba(245, 158, 11, 0.7)",
        "0 0 0 rgba(245, 158, 11, 0)"
      ],
      transition: { 
        repeat: Infinity, 
        duration: 1.5
      }
    }
  };
  
  return (
    <div className="relative h-32 w-24 overflow-hidden rounded-md bg-black border border-zinc-700">
      {/* Simple top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-600"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-600"></div>
      
      {/* Spinning reels animation */}
      {spinning && (
        <motion.div
          className="absolute inset-0"
          variants={spinVariants}
          animate="spinning"
        >
          <div className="flex flex-col">
            {Array.from({ length: 15 }).map((_, i) => {
              // Generate random symbol for spinning effect
              const symbols = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣", "🍀", "🔔"];
              const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
              
              return (
                <div key={i} className="h-32 w-24 flex items-center justify-center bg-white dark:bg-zinc-700">
                  <Symbol symbol={randomSymbol} />
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
      
      {/* Fixed display when not spinning */}
      {!spinning && (
        <motion.div
          className={`h-full w-full flex items-center justify-center ${
            isWinning ? "bg-amber-100 dark:bg-amber-900/40" : "bg-white dark:bg-zinc-700"
          }`}
          variants={winVariants}
          animate={isWinning ? "winning" : "idle"}
          initial={false}
        >
          <Symbol symbol={symbol} size={60} />
        </motion.div>
      )}
    </div>
  );
};

export default Reel;
