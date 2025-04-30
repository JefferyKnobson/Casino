import { cn } from "@/lib/utils";

interface SymbolProps {
  className?: string;
  size?: number;
}

// Cherry symbol - red fruit
export const CherrySymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.7 }}>🍒</span>
  </div>
);

// Lemon symbol - yellow fruit
export const LemonSymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.7 }}>🍋</span>
  </div>
);

// Watermelon symbol - green fruit based on image
export const WatermelonSymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.7 }}>🍉</span>
  </div>
);

// Grapes symbol - purple fruit
export const GrapeSymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.7 }}>🍇</span>
  </div>
);

// Seven symbol - jackpot symbol
export const SevenSymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center font-bold text-red-600", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.7 }}>7</span>
  </div>
);

// Bell symbol 
export const BellSymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.7 }}>🔔</span>
  </div>
);

// Function to get symbol component by ID
export const getSymbolComponent = (symbolId: string, props: SymbolProps = {}) => {
  switch (symbolId) {
    case "cherry":
      return <CherrySymbol {...props} />;
    case "lemon":
      return <LemonSymbol {...props} />;
    case "watermelon":
      return <WatermelonSymbol {...props} />;
    case "grape":
      return <GrapeSymbol {...props} />;
    case "seven":
      return <SevenSymbol {...props} />;
    case "bell":
      return <BellSymbol {...props} />;
    default:
      return <CherrySymbol {...props} />;
  }
};

// Function to get emoji by symbol ID
export const getSymbolEmoji = (symbolId: string): string => {
  switch (symbolId) {
    case "cherry": return "🍒";
    case "lemon": return "🍋";
    case "watermelon": return "🍉";
    case "grape": return "🍇";
    case "seven": return "7";
    case "bell": return "🔔";
    default: return "🎰";
  }
};

// Slot symbol data with payout information based on the image
export const slotSymbolData = [
  // Main symbols (these match the image)
  { id: "seven", emoji: "7", name: "Seven", payout: 100, rarity: 1 },
  { id: "bell", emoji: "🔔", name: "Bell", payout: 25, rarity: 3 },
  { id: "cherry", emoji: "🍒", name: "Cherry", payout: 10, rarity: 5 },
  { id: "lemon", emoji: "🍋", name: "Lemon", payout: 10, rarity: 5 },
  { id: "watermelon", emoji: "🍉", name: "Watermelon", payout: 10, rarity: 5 },
  { id: "grape", emoji: "🍇", name: "Grape", payout: 10, rarity: 5 },
];
