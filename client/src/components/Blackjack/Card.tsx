import { motion } from "framer-motion";
import { Card as CardType } from "@/lib/utils/cards";
import { getSuitComponent, getSuitColor } from "@/assets/svg/card-suits";

interface CardProps {
  card: CardType;
  faceUp: boolean;
  scale?: number;
  rotateY?: number;
  delay?: number;
}

const Card = ({ card, faceUp = true, scale = 1, rotateY = 0, delay = 0 }: CardProps) => {
  // Card value labels
  const valueLabels: Record<number, string> = {
    1: "A",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "J",
    12: "Q",
    13: "K",
  };
  
  const color = getSuitColor(card.suit);
  
  return (
    <motion.div
      className="relative select-none"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: scale, opacity: 1, rotateY }}
      transition={{ 
        type: "spring", 
        damping: 12, 
        delay,
        duration: 0.4 
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div 
        className="relative rounded-lg overflow-hidden shadow-md bg-white border border-gray-200"
        style={{ 
          width: "70px", 
          height: "100px",
          transform: faceUp ? "rotateY(0deg)" : "rotateY(180deg)",
          transition: "transform 0.5s"
        }}
      >
        {/* Card front */}
        <div className="absolute inset-0 flex flex-col p-1" style={{ backfaceVisibility: "hidden" }}>
          <div className="flex justify-between items-start px-1.5">
            <div className="text-base font-bold" style={{ color }}>
              {valueLabels[card.value]}
            </div>
            <div className="w-4 h-4">
              {getSuitComponent(card.suit, { size: 14, color })}
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            {getSuitComponent(card.suit, { size: 32, color })}
          </div>
          
          <div className="flex justify-between items-end px-1.5 rotate-180">
            <div className="text-base font-bold" style={{ color }}>
              {valueLabels[card.value]}
            </div>
            <div className="w-4 h-4">
              {getSuitComponent(card.suit, { size: 14, color })}
            </div>
          </div>
        </div>
        
        {/* Card back */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 p-2"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className="h-full w-full border-2 border-white border-opacity-30 rounded flex items-center justify-center">
            <div className="h-1/2 w-1/2 bg-white bg-opacity-20 rounded-full"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
