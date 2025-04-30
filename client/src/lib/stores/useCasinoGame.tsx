import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export type GameType = "blackjack" | "round-the-bus" | "slots" | null;

interface CasinoGameState {
  balance: number;
  isBroke: boolean;
  activeGame: GameType;
  gameHistory: {
    time: string;
    game: GameType;
    amount: number;
    result: "win" | "loss" | "tie";
  }[];
  
  // Actions
  init: () => void;
  setGame: (game: GameType) => void;
  updateBalance: (amount: number) => void;
  addToHistory: (game: GameType, amount: number, result: "win" | "loss" | "tie") => void;
  resetBalance: () => void;
  checkBrokeStatus: () => boolean;
}

export const useCasinoGame = create<CasinoGameState>()(
  persist(
    (set, get) => ({
      balance: 250, // Starting balance
      isBroke: false,
      activeGame: null,
      gameHistory: [],
      
      init: () => {
        // Initialization logic if needed
        console.log("Casino game initialized");
      },
      
      setGame: (game) => {
        set({ activeGame: game });
      },
      
      updateBalance: (amount) => {
        set((state) => {
          const newBalance = Math.max(0, state.balance + amount);
          const isBroke = newBalance === 0;
          
          // If player just went broke, show a notification
          if (isBroke && !state.isBroke) {
            toast.error("You're out of money! Reset your balance to keep playing.");
          }
          
          return { 
            balance: newBalance,
            isBroke
          };
        });
      },
      
      addToHistory: (game, amount, result) => {
        const time = new Date().toLocaleString();
        set((state) => ({
          gameHistory: [
            { time, game, amount, result },
            ...state.gameHistory.slice(0, 19) // Keep last 20 entries
          ]
        }));
        
        // Check if player is broke after adding to history
        get().checkBrokeStatus();
      },
      
      resetBalance: () => {
        set({ 
          balance: 250,
          isBroke: false
        });
        toast.success("Your balance has been reset to $250!");
      },
      
      checkBrokeStatus: () => {
        const { balance } = get();
        const isBroke = balance === 0;
        
        if (isBroke) {
          set({ isBroke: true });
        }
        
        return isBroke;
      }
    }),
    {
      name: "casino-game-storage",
      partialize: (state) => ({ 
        balance: state.balance,
        isBroke: state.isBroke,
        gameHistory: state.gameHistory 
      })
    }
  )
);
