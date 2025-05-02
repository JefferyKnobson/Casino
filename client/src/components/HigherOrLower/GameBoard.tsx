import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import Card from "../Blackjack/Card";
import { Card as CardType } from "@/lib/utils/cards";

interface GameBoardProps extends HTMLAttributes<HTMLDivElement> {
  currentCard: CardType | null;
  previousCard: CardType | null;
  streak: number;
  lastResult?: "correct" | "wrong" | null;
}

const GameBoard = ({ 
  currentCard, 
  previousCard, 
  streak, 
  lastResult, 
  className, 
  ...props 
}: GameBoardProps) => {
  // Function to get card label
  const getCardLabel = (value: number): string => {
    if (value === 1) return "A";
    if (value === 11) return "J";
    if (value === 12) return "Q";
    if (value === 13) return "K";
    return String(value);
  };

  return (
    <div className={cn("p-4 rounded-lg bg-slate-800 flex flex-col items-center", className)} {...props}>
      {/* Streak counter */}
      <div className="text-center mb-4">
        <h3 className="text-sm text-slate-300 mb-1">Current Streak</h3>
        <div className="text-2xl font-bold text-amber-400">{streak}</div>
      </div>
      
      {/* Cards display */}
      <div className="flex justify-center items-center space-x-12 mb-6 min-h-[180px]">
        {/* Previous card */}
        <div className="relative">
          <div className="absolute -top-6 left-0 right-0 text-center text-xs text-slate-300">Previous</div>
          {previousCard ? (
            <Card 
              card={previousCard} 
              faceUp={true} 
              scale={1.2}
            />
          ) : (
            <div className="h-36 w-24 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-400">
              No card
            </div>
          )}
        </div>
        
        {/* Current card */}
        <div className="relative">
          <div className="absolute -top-6 left-0 right-0 text-center text-xs text-slate-300">Current</div>
          {currentCard ? (
            <Card 
              card={currentCard} 
              faceUp={true}
              scale={1.2}
            />
          ) : (
            <div className="h-36 w-24 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-400">
              ?
            </div>
          )}
        </div>
      </div>
      
      {/* Last result indicator */}
      {lastResult && (
        <div className={cn(
          "py-1 px-3 rounded-full text-sm font-medium",
          lastResult === "correct" ? "bg-green-700 text-white" : "bg-red-700 text-white"
        )}>
          {lastResult === "correct" ? "Correct!" : "Wrong!"}
        </div>
      )}
    </div>
  );
};

export default GameBoard;