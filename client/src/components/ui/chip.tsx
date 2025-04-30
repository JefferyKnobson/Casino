import { cn } from "@/lib/utils";
import { ReactNode, forwardRef, ButtonHTMLAttributes } from "react";

export type ChipValue = 1 | 5 | 10 | 25 | 50 | 100 | 500 | 1000;

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: ChipValue;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  stacked?: boolean;
  stackIndex?: number;
  disabled?: boolean;
  children?: ReactNode;
}

const chipColors: Record<ChipValue, { bg: string; border: string; text: string; shadow: string }> = {
  1: {
    bg: "bg-white",
    border: "border-slate-300",
    text: "text-slate-800",
    shadow: "shadow-slate-300/50",
  },
  5: {
    bg: "bg-red-600",
    border: "border-red-800",
    text: "text-white",
    shadow: "shadow-red-700/50",
  },
  10: {
    bg: "bg-blue-600",
    border: "border-blue-800",
    text: "text-white",
    shadow: "shadow-blue-700/50",
  },
  25: {
    bg: "bg-green-600",
    border: "border-green-800",
    text: "text-white",
    shadow: "shadow-green-700/50",
  },
  50: {
    bg: "bg-purple-700",
    border: "border-purple-900",
    text: "text-white",
    shadow: "shadow-purple-700/50",
  },
  100: {
    bg: "bg-amber-500",
    border: "border-amber-700",
    text: "text-black",
    shadow: "shadow-amber-500/50",
  },
  500: {
    bg: "bg-zinc-800",
    border: "border-zinc-900",
    text: "text-white",
    shadow: "shadow-zinc-800/50",
  },
  1000: {
    bg: "bg-gradient-to-r from-amber-500 to-yellow-300",
    border: "border-amber-700",
    text: "text-black",
    shadow: "shadow-amber-500/50",
  },
};

const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ value, size = "md", onClick, stacked = false, stackIndex = 0, disabled = false, className, children, ...props }, ref) => {
    const { bg, border, text, shadow } = chipColors[value];
    
    const sizeClasses = {
      sm: "w-12 h-12 text-xs",
      md: "w-16 h-16 text-sm",
      lg: "w-20 h-20 text-base",
    };
    
    // Calculate stack offset if stacked
    const stackStyle = stacked 
      ? { transform: `translateY(${-4 * stackIndex}px)`, zIndex: stackIndex } 
      : {};
    
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "relative rounded-full font-bold flex items-center justify-center select-none",
          "transition-transform transform hover:-translate-y-1 active:translate-y-0",
          "border-2 shadow-md",
          bg,
          border,
          text,
          shadow,
          sizeClasses[size],
          disabled && "opacity-50 cursor-not-allowed hover:translate-y-0",
          className
        )}
        onClick={onClick}
        disabled={disabled}
        style={stackStyle}
        {...props}
      >
        {children || `$${value}`}
        
        {/* Inner ring for visual detail */}
        <div className="absolute rounded-full border border-current opacity-30 inset-2"></div>
      </button>
    );
  }
);

Chip.displayName = "Chip";

interface ChipStackProps {
  value: ChipValue;
  count: number;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  maxVisibleChips?: number;
  disabled?: boolean;
}

// A stack of chips to represent multiple chips of the same value
export const ChipStack = ({
  value,
  count,
  size = "md",
  onClick,
  maxVisibleChips = 3,
  disabled = false,
}: ChipStackProps) => {
  if (count <= 0) return null;
  
  // Limit to displaying a max number of chips visually
  const visibleCount = Math.min(count, maxVisibleChips);
  
  return (
    <div className="relative inline-block">
      {Array.from({ length: visibleCount }).map((_, index) => (
        <Chip
          key={index}
          value={value}
          size={size}
          stacked={true}
          stackIndex={index}
          onClick={onClick}
          disabled={disabled}
        />
      ))}
      
      {/* Display count if there are more chips than we're showing */}
      {count > 1 && (
        <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border border-white">
          {count}
        </div>
      )}
    </div>
  );
};

export default Chip;
