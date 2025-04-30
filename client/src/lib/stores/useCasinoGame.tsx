import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GameType = "blackjack" | "round-the-bus" | "slots" | null;

interface CasinoGameState {
  balance: number;
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
}

export const useCasinoGame = create<CasinoGameState>()(
  persist(
    (set, get) => ({
      balance: 250, // Starting balance
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
        set((state) => ({ 
          balance: Math.max(0, state.balance + amount) 
        }));
      },
      
      addToHistory: (game, amount, result) => {
        const time = new Date().toLocaleString();
        set((state) => ({
          gameHistory: [
            { time, game, amount, result },
            ...state.gameHistory.slice(0, 19) // Keep last 20 entries
          ]
        }));
      },
      
      resetBalance: () => {
        set({ balance: 250 });
      }
    }),
    {
      name: "casino-game-storage",
      partialize: (state) => ({ 
        balance: state.balance,
        gameHistory: state.gameHistory 
      })
    }
  )
);
