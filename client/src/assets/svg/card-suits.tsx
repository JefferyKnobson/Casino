// Card suit SVG components
import { cn } from "@/lib/utils";

interface SuitProps {
  className?: string;
  size?: number;
  color?: string;
}

export const HeartSuit = ({ className, size = 24, color = "#e11d48" }: SuitProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("", className)}
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={color}
    />
  </svg>
);

export const DiamondSuit = ({ className, size = 24, color = "#e11d48" }: SuitProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("", className)}
  >
    <path
      d="M12 2L5 12l7 10 7-10-7-10z"
      fill={color}
    />
  </svg>
);

export const ClubSuit = ({ className, size = 24, color = "#1e293b" }: SuitProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("", className)}
  >
    <path
      d="M12 2c-1.66 0-3 1.34-3 3 0 1.31.84 2.42 2 2.83V8.5A2.5 2.5 0 0 1 8.5 11c-1.25 0-2.31-.93-2.47-2.13A3 3 0 1 0 4 15c1.31 0 2.42-.84 2.83-2H7.5A2.5 2.5 0 0 1 10 15.5v.17c-1.16.41-2 1.52-2 2.83a3 3 0 0 0 6 0c0-1.31-.84-2.42-2-2.83v-.17a2.5 2.5 0 0 1 2.5-2.5h.67A3 3 0 1 0 18 9c-1.31 0-2.42.84-2.83 2h-.67a2.5 2.5 0 0 1-2.5-2.5V7.83A3 3 0 0 0 12 2Z"
      fill={color}
    />
  </svg>
);

export const SpadeSuit = ({ className, size = 24, color = "#1e293b" }: SuitProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("", className)}
  >
    <path
      d="M12 2.88l-.5.55c-2.5 2.76-7.5 8.69-7.5 12.37 0 2.29 1.84 4.14 4.1 4.2 1.5.04 2.75-.68 3.46-1.8a4.05 4.05 0 0 0 .39-3.17A3.52 3.52 0 0 1 12 17.5c.06 1.22.36 2.09.95 2.53.4.3.92.47 1.55.47 2.26-.06 4.1-1.91 4.1-4.2 0-3.68-5-9.61-7.5-12.37l-.5-.55Z"
      fill={color}
    />
  </svg>
);

// Function to get the appropriate suit component based on suit name
export const getSuitComponent = (
  suit: "hearts" | "diamonds" | "clubs" | "spades",
  props: SuitProps = {}
) => {
  switch (suit) {
    case "hearts":
      return <HeartSuit {...props} />;
    case "diamonds":
      return <DiamondSuit {...props} />;
    case "clubs":
      return <ClubSuit {...props} />;
    case "spades":
      return <SpadeSuit {...props} />;
    default:
      return null;
  }
};

// Get suit color
export const getSuitColor = (suit: "hearts" | "diamonds" | "clubs" | "spades"): string => {
  return suit === "hearts" || suit === "diamonds" ? "#e11d48" : "#1e293b";
};
