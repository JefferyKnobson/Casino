import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SymbolProps extends HTMLAttributes<HTMLDivElement> {
  symbol: string;
  size?: number;
}

const Symbol = ({ symbol, size = 48, className, ...props }: SymbolProps) => {
  // Map of symbols to their colors for visual flair
  const symbolColors: Record<string, string> = {
    "7️⃣": "text-amber-500",
    "💎": "text-blue-500",
    "🍀": "text-green-500",
    "🔔": "text-yellow-500",
    "🍇": "text-purple-500",
    "🍊": "text-orange-500",
    "🍋": "text-yellow-400",
    "🍒": "text-red-500",
  };
  
  // Get color based on symbol or default
  const symbolColor = symbolColors[symbol] || "text-current";
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center font-bold", 
        symbolColor,
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
