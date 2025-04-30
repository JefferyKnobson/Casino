import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCasinoGame } from '@/lib/stores/useCasinoGame';
import { useAudio } from '@/lib/stores/useAudio';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StuckButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { resetBalance } = useCasinoGame();
  const { playGameOver } = useAudio();
  const navigate = useNavigate();

  const handleReset = () => {
    // Play game over sound
    playGameOver();
    
    // Reset the balance
    resetBalance();
    
    // Navigate to home
    navigate('/');
    
    // Close the modal
    setIsOpen(false);
    
    // Show a toast message
    toast.success("Game reset! Your balance has been restored.");
  };

  return (
    <>
      {/* Stuck button - fixed at bottom right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>I'm Stuck</span>
      </button>

      {/* Modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-900 border-4 border-amber-500 rounded-lg p-6 max-w-md w-full text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <h2 className="text-2xl font-bold text-amber-500 mb-2">Reset Game?</h2>
              <p className="text-white text-lg mb-6">
                This will reset your game progress, restore your balance to $250, and return you to the lobby.
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Reset Game
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StuckButton;