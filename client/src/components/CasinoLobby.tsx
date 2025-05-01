import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CasinoCard, CasinoCardContent, CasinoCardFooter, CasinoCardHeader, CasinoCardTitle } from "./ui/card-casino";
import { CasinoButton } from "./ui/button-casino";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useCasinoGame } from "../lib/stores/useCasinoGame";
import { useAudio } from "../lib/stores/useAudio";
import { playSound } from "../lib/utils/audio";
import GameOver from "./common/GameOver";
import LeaderboardTab from "./Leaderboard/LeaderboardTab";

const CasinoLobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("games");
  const { setGame, balance, gameHistory, isBroke, resetBalance } = useCasinoGame();
  const { isMuted } = useAudio();

  useEffect(() => {
    // Set active game to null when in the lobby
    setGame(null);
    
    // Check if we should open the leaderboard tab from a navigation state
    const state = location.state as { openLeaderboard?: boolean } | null;
    if (state?.openLeaderboard) {
      setActiveTab("leaderboard");
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [setGame, location.state]);

  const handleSelectGame = (game: "blackjack" | "round-the-bus" | "ride-the-bus" | "slots") => {
    if (!isMuted) {
      playSound("hit");
    }
    setGame(game);
    navigate(`/${game}`);
  };

  return (
    <div className="max-w-full sm:max-w-6xl mx-auto pt-4 sm:pt-8 px-2">
      {/* Show GameOver when player is broke */}
      {isBroke && <GameOver />}
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6">Welcome to Casino Desperado</h1>
      
      <p className="text-center mb-4 sm:mb-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
        Choose your game of chance and test your luck. Your current balance is 
        <span className="font-bold text-primary"> ${balance}</span>.
      </p>
      
      {/* Reset balance button when broke */}
      {isBroke && (
        <div className="mb-6 text-center">
          <CasinoButton
            variant="gold"
            onClick={resetBalance}
          >
            Reset Balance to $250
          </CasinoButton>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="games" className="text-base">Games</TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-base">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="games" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <CasinoCard gradient="gold" bordered elevated className="flex flex-col h-full">
              <CasinoCardHeader className="p-4 sm:p-6">
                <CasinoCardTitle>Blackjack</CasinoCardTitle>
              </CasinoCardHeader>
              <CasinoCardContent className="flex-1 p-4 sm:p-6">
                <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm sm:text-base">
                  Try to beat the dealer by getting a hand value as close to 21 as possible without going over. 
                  Blackjack pays 3:2!
                </p>
                <div className="flex justify-center my-3 sm:my-4">
                  <div className="relative h-20 sm:h-24 w-28 sm:w-32">
                    <div className="absolute top-0 left-0 h-16 sm:h-20 w-12 sm:w-14 border border-slate-300 rounded-md bg-white shadow transform rotate-[-15deg]">
                      <div className="text-red-600 text-lg sm:text-xl font-bold m-1">A♥</div>
                    </div>
                    <div className="absolute top-0 left-5 h-16 sm:h-20 w-12 sm:w-14 border border-slate-300 rounded-md bg-white shadow transform rotate-[-5deg]">
                      <div className="text-black text-lg sm:text-xl font-bold m-1">K♠</div>
                    </div>
                  </div>
                </div>
              </CasinoCardContent>
              <CasinoCardFooter className="p-4 sm:p-6 pt-2 sm:pt-3">
                <CasinoButton 
                  variant="gold" 
                  className="w-full" 
                  onClick={() => handleSelectGame("blackjack")}
                >
                  Play Blackjack
                </CasinoButton>
              </CasinoCardFooter>
            </CasinoCard>
            
            <CasinoCard gradient="green" bordered elevated className="flex flex-col h-full">
              <CasinoCardHeader className="p-4 sm:p-6">
                <CasinoCardTitle>Ride the Bus</CasinoCardTitle>
              </CasinoCardHeader>
              <CasinoCardContent className="flex-1 p-4 sm:p-6">
                <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm sm:text-base">
                  Guess if the next card will be higher or lower than the current one.
                  Complete all 4 cards to win up to 20x your bet! Each successful card doubles your potential winnings.
                </p>
                <div className="flex justify-center my-3 sm:my-4">
                  <div className="flex space-x-3">
                    <div className="h-12 w-10 sm:h-16 sm:w-12 border border-slate-300 rounded-md bg-white shadow flex items-center justify-center text-black text-base sm:text-lg font-bold">2♠</div>
                    <div className="h-12 w-10 sm:h-16 sm:w-12 border border-slate-300 rounded-md bg-white shadow flex items-center justify-center text-red-600 text-base sm:text-lg font-bold">8♥</div>
                    <div className="h-12 w-10 sm:h-16 sm:w-12 border border-slate-300 rounded-md bg-white shadow flex items-center justify-center text-black text-base sm:text-lg font-bold">K♠</div>
                    <div className="h-12 w-10 sm:h-16 sm:w-12 border border-slate-300 rounded-md bg-white shadow flex items-center justify-center text-red-600 text-base sm:text-lg font-bold">A♥</div>
                  </div>
                </div>
              </CasinoCardContent>
              <CasinoCardFooter className="p-4 sm:p-6 pt-2 sm:pt-3">
                <CasinoButton 
                  variant="green" 
                  className="w-full" 
                  onClick={() => handleSelectGame("ride-the-bus")}
                >
                  Play Ride the Bus
                </CasinoButton>
              </CasinoCardFooter>
            </CasinoCard>
            
            <CasinoCard gradient="red" bordered elevated className="flex flex-col h-full">
              <CasinoCardHeader className="p-4 sm:p-6">
                <CasinoCardTitle>Slot Machine</CasinoCardTitle>
              </CasinoCardHeader>
              <CasinoCardContent className="flex-1 p-4 sm:p-6">
                <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm sm:text-base">
                  Pull the lever and watch the reels spin! Match symbols across the payline to win. 
                  Three 7s pay the jackpot of 200x!
                </p>
                <div className="flex justify-center my-3 sm:my-4">
                  <div className="border-3 sm:border-4 border-amber-600 rounded-lg bg-zinc-800 p-1 sm:p-2 shadow-lg">
                    <div className="flex space-x-1">
                      <div className="h-12 w-10 sm:h-16 sm:w-12 bg-white flex items-center justify-center text-xl sm:text-2xl rounded">🍒</div>
                      <div className="h-12 w-10 sm:h-16 sm:w-12 bg-white flex items-center justify-center text-xl sm:text-2xl rounded">7️⃣</div>
                      <div className="h-12 w-10 sm:h-16 sm:w-12 bg-white flex items-center justify-center text-xl sm:text-2xl rounded">🍀</div>
                    </div>
                  </div>
                </div>
              </CasinoCardContent>
              <CasinoCardFooter className="p-4 sm:p-6 pt-2 sm:pt-3">
                <CasinoButton 
                  variant="red" 
                  className="w-full" 
                  onClick={() => handleSelectGame("slots")}
                >
                  Play Slots
                </CasinoButton>
              </CasinoCardFooter>
            </CasinoCard>
          </div>
          
          {gameHistory.length > 0 && (
            <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Recent Activity</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1 sm:py-2 px-2 sm:px-4">Time</th>
                      <th className="text-left py-1 sm:py-2 px-2 sm:px-4">Game</th>
                      <th className="text-right py-1 sm:py-2 px-2 sm:px-4">Amount</th>
                      <th className="text-center py-1 sm:py-2 px-2 sm:px-4">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameHistory.slice(0, 5).map((entry, index) => (
                      <tr key={index} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/30">
                        <td className="py-1 sm:py-2 px-2 sm:px-4">{entry.time}</td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4">
                          {entry.game === "blackjack" && "Blackjack"}
                          {entry.game === "round-the-bus" && "Ride the Bus"}
                          {entry.game === "ride-the-bus" && "Ride the Bus"}
                          {entry.game === "slots" && "Slots"}
                        </td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 text-right">${Math.abs(entry.amount)}</td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 text-center">
                          <span className={
                            entry.result === "win" 
                              ? "text-green-600 font-medium"
                              : entry.result === "loss" 
                                ? "text-red-600 font-medium"
                                : "text-slate-600 font-medium"
                          }>
                            {entry.result === "win" ? "Win" : entry.result === "loss" ? "Loss" : "Tie"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-0">
          <LeaderboardTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CasinoLobby;