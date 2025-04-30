import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface DeckProps extends HTMLAttributes<HTMLDivElement> {
  count?: number;
  spread?: boolean;
}

const Deck = forwardRef<HTMLDivElement, DeckProps>(
  ({ className, count = 52, spread = false, ...props }, ref) => {
    // Limit the visual stack to a maximum of 10 cards
    const visibleCount = Math.min(count, 10);
    
    return (
      <div 
        ref={ref}
        className={cn("relative", className)} 
        {...props}
      >
        {Array.from({ length: visibleCount }).map((_, index) => (
          <div
            key={index}
            className="absolute rounded-lg overflow-hidden shadow-sm bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-900"
            style={{
              width: "70px",
              height: "100px",
              top: spread ? `${index * 0.5}px` : `${index * 0.5}px`,
              left: spread ? `${index * 5}px` : `${index * 0.5}px`,
              zIndex: index,
            }}
          >
            <div className="h-full w-full border-2 border-white border-opacity-30 rounded m-2 flex items-center justify-center">
              <div className="h-1/2 w-1/2 bg-white bg-opacity-20 rounded-full"></div>
            </div>
          </div>
        ))}
        
        {count > 10 && (
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-xs text-white font-bold bg-black bg-opacity-50 px-2 py-0.5 rounded-full">
            {count}
          </div>
        )}
      </div>
    );
  }
);

Deck.displayName = "Deck";

export default Deck;
