import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SymbolProps extends HTMLAttributes<HTMLDivElement> {
  symbol: string;
  size?: number;
}

const Symbol = ({ symbol, size = 48, className, ...props }: SymbolProps) => {
  // Enhanced map of symbols with more sophisticated styling
  const symbolStyles: Record<string, { 
    color: string; 
    glow?: string; 
    shadow?: string;
    special?: boolean;
  }> = {
    "7️⃣": { 
      color: "text-amber-500", 
      glow: "filter drop-shadow(0 0 3px rgba(245, 158, 11, 0.7))",
      special: true
    },
    "💎": { 
      color: "text-blue-400", 
      glow: "filter drop-shadow(0 0 3px rgba(59, 130, 246, 0.7))",
      shadow: "text-shadow-md"
    },
    "🍀": { 
      color: "text-green-500", 
      shadow: "drop-shadow-sm"
    },
    "🔔": { 
      color: "text-yellow-500", 
      glow: "filter drop-shadow(0 0 2px rgba(234, 179, 8, 0.6))",
      special: true
    },
    "🍇": { 
      color: "text-purple-500", 
      shadow: "drop-shadow-sm"
    },
    "🍊": { 
      color: "text-orange-500", 
      shadow: "drop-shadow-sm"
    },
    "🍋": { 
      color: "text-yellow-400", 
      shadow: "drop-shadow-sm"
    },
    "🍒": { 
      color: "text-red-600", 
      shadow: "drop-shadow-sm"
    },
  };
  
  // Get style based on symbol or use default
  const style = symbolStyles[symbol] || { color: "text-current" };
  
  // Special treatment for the 777 symbol
  if (symbol === "7️⃣") {
    return (
      <div 
        className={cn(
          "flex items-center justify-center font-bold relative", 
          style.color,
          style.shadow,
          className
        )}
        style={{ fontSize: size }}
        {...props}
      >
        {/* Special background glow effect for 7 */}
        <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md"></div>
        
        {/* Render the symbol with special effects for 7 */}
        <div className={style.glow}>
          {/* 7 is special so we replace the emoji with text */}
          <span className="font-mono font-black tracking-tighter">7</span>
        </div>
      </div>
    );
  }
  
  // Special treatment for bells
  if (symbol === "🔔") {
    return (
      <motion.div 
        className={cn(
          "flex items-center justify-center font-bold", 
          style.color,
          style.shadow,
          style.glow,
          className
        )}
        style={{ fontSize: size }}
        {...props}
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "mirror",
          duration: 2,
          ease: "easeInOut"
        }}
      >
        {symbol}
      </motion.div>
    );
  }
  
  // Render all other symbols normally
  return (
    <div 
      className={cn(
        "flex items-center justify-center font-bold", 
        style.color,
        style.shadow,
        style.glow,
        className
      )}
      style={{ fontSize: size }}
      {...props}
    >
      {symbol}
    </div>
  );
};

export default Symbol;
