import { motion } from "framer-motion";
import { useCasinoGame } from "@/lib/stores/useCasinoGame";
import { CasinoButton } from "../ui/button-casino";

interface GameOverProps {
  message?: string;
}

const GameOver = ({ message = "You're out of money!" }: GameOverProps) => {
  const { resetBalance } = useCasinoGame();

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-zinc-900 border-4 border-amber-500 rounded-lg p-6 max-w-md w-full text-center"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 12 }}
      >
        <h2 className="text-3xl font-bold text-red-500 mb-2">GAME OVER</h2>
        <p className="text-white text-lg mb-6">{message}</p>
        
        <div className="flex flex-col gap-4">
          <CasinoButton
            variant="gold"
            size="lg"
            onClick={resetBalance}
            className="mx-auto min-w-[200px]"
          >
            Reset Balance ($250)
          </CasinoButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameOver;