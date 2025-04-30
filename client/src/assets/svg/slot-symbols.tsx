import { cn } from "@/lib/utils";

interface SymbolProps {
  className?: string;
  size?: number;
}

// Cherry symbol
export const CherrySymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.6 }}>🍒</span>
  </div>
);

// Lemon symbol
export const LemonSymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.6 }}>🍋</span>
  </div>
);

// Orange symbol
export const OrangeSymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.6 }}>🍊</span>
  </div>
);

// Grape symbol
export const GrapeSymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.6 }}>🍇</span>
  </div>
);

// Diamond symbol
export const DiamondSymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.6 }}>💎</span>
  </div>
);

// Seven symbol
export const SevenSymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.6 }}>7️⃣</span>
  </div>
);

// Clover symbol
export const CloverSymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.6 }}>🍀</span>
  </div>
);

// Bell symbol
export const BellSymbol = ({ className, size = 48 }: SymbolProps) => (
  <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.6 }}>🔔</span>
  </div>
);

// Function to get symbol component by ID
export const getSymbolComponent = (symbolId: string, props: SymbolProps = {}) => {
  switch (symbolId) {
    case "cherry":
      return <CherrySymbol {...props} />;
    case "lemon":
      return <LemonSymbol {...props} />;
    case "orange":
      return <OrangeSymbol {...props} />;
    case "grape":
      return <GrapeSymbol {...props} />;
    case "diamond":
      return <DiamondSymbol {...props} />;
    case "seven":
      return <SevenSymbol {...props} />;
    case "clover":
      return <CloverSymbol {...props} />;
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
    case "orange": return "🍊";
    case "grape": return "🍇";
    case "diamond": return "💎";
    case "seven": return "7️⃣";
    case "clover": return "🍀";
    case "bell": return "🔔";
    default: return "🎰";
  }
};

// Slot symbol data with payout information
export const slotSymbolData = [
  { id: "seven", emoji: "7️⃣", name: "Seven", payout: 200, rarity: 1 },
  { id: "diamond", emoji: "💎", name: "Diamond", payout: 100, rarity: 2 },
  { id: "clover", emoji: "🍀", name: "Clover", payout: 50, rarity: 3 },
  { id: "bell", emoji: "🔔", name: "Bell", payout: 30, rarity: 4 },
  { id: "grape", emoji: "🍇", name: "Grape", payout: 20, rarity: 6 },
  { id: "orange", emoji: "🍊", name: "Orange", payout: 15, rarity: 8 },
  { id: "lemon", emoji: "🍋", name: "Lemon", payout: 10, rarity: 10 },
  { id: "cherry", emoji: "🍒", name: "Cherry", payout: 7, rarity: 12 },
];
