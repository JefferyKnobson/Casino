import { motion } from "framer-motion";
import Symbol from "./Symbol";

interface ReelProps {
  symbol: string;
  spinning: boolean;
  delay?: number;
  isWinning?: boolean;
}

const Reel = ({ symbol, spinning, delay = 0, isWinning = false }: ReelProps) => {
  // Enhanced spinning animation states for more realistic slot machine feel
  const spinVariants = {
    spinning: {
      y: [0, -1500],
      transition: { 
        repeat: Infinity, 
        duration: 0.3, 
        ease: "linear"
      }
    },
    stopping: {
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay 
      }
    }
  };
  
  // Enhanced celebration animation for winning symbols with more visual effects
  const winVariants = {
    idle: { 
      scale: 1,
      rotate: 0
    },
    winning: { 
      scale: [1, 1.12, 1],
      rotate: [0, 3, 0, -3, 0],
      boxShadow: [
        "0 0 0 rgba(245, 158, 11, 0)",
        "0 0 20px rgba(245, 158, 11, 0.8)",
        "0 0 10px rgba(245, 158, 11, 0.4)",
        "0 0 25px rgba(245, 158, 11, 0.8)",
        "0 0 0 rgba(245, 158, 11, 0)"
      ],
      transition: { 
        repeat: Infinity, 
        duration: 2,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <div className="relative h-32 w-24 overflow-hidden rounded-lg bg-black border-2 border-zinc-800 shadow-lg">
      {/* Metal trim effect at top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-zinc-700 via-zinc-400 to-zinc-700"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-zinc-700 via-zinc-400 to-zinc-700"></div>
      
      {/* Spinning reels animation */}
      {spinning && (
        <motion.div
          className="absolute inset-0"
          variants={spinVariants}
          animate="spinning"
        >
          <div className="flex flex-col">
            {Array.from({ length: 20 }).map((_, i) => {
              // Generate random symbol for spinning effect
              const symbols = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣", "🍀", "🔔"];
              const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
              
              return (
                <div key={i} className="h-32 w-24 flex items-center justify-center bg-gradient-to-b from-slate-200 to-slate-300 dark:from-zinc-600 dark:to-zinc-700">
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
            isWinning 
              ? "bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900/60 dark:to-amber-800/40" 
              : "bg-gradient-to-b from-slate-200 to-slate-300 dark:from-zinc-600 dark:to-zinc-700"
          }`}
          variants={winVariants}
          animate={isWinning ? "winning" : "idle"}
          initial={false}
        >
          {/* Lightning effect around winning symbols */}
          {isWinning && (
            <div className="absolute inset-0 bg-amber-400/20 animate-pulse"></div>
          )}
          
          {/* Drop shadow for better visibility */}
          <div className={`${isWinning ? 'drop-shadow-lg' : 'drop-shadow'}`}>
            <Symbol symbol={symbol} size={65} />
          </div>
        </motion.div>
      )}
      
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
      
      {/* Side shadows for depth */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-black/40"></div>
      <div className="absolute top-0 bottom-0 right-0 w-1 bg-black/40"></div>
    </div>
  );
};

export default Reel;
