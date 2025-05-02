import { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useAudio } from "./lib/stores/useAudio";
import { useCasinoGame } from "./lib/stores/useCasinoGame";
import Layout from "./components/Layout";
import CasinoLobby from "./components/CasinoLobby";
import BlackjackGame from "./components/Blackjack/BlackjackGame";
import HigherOrLowerGame from "./components/HigherOrLower/HigherOrLowerGame";
import RideTheBusGame from "./components/RideTheBus/RideTheBusGame";
import SlotMachine from "./components/SlotMachine/SlotMachine";
import GameHUD from "./components/common/GameHUD";
import NotFound from "./pages/not-found";
import { initAudio } from "./lib/utils/audio";
import { Toaster } from "./components/ui/sonner";

// Game wrapper component to add HUD to all game routes
// This needs to be outside App so it can use useLocation hook properly
const GameRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  // Only show GameHUD on game routes, not on home/lobby
  const showHUD = location.pathname !== '/';
  
  return (
    <>
      {children}
      {showHUD && <GameHUD />}
    </>
  );
};

function App() {
  const { init } = useCasinoGame();
  const { 
    setBackgroundMusic,
    setHitSound,
    setSuccessSound,
    setWinSound,
    setLoseSound,
    setGameOverSound
  } = useAudio();

  useEffect(() => {
    // Initialize casino game state
    init();
    
    // Load and set up audio
    initAudio().then((audioFiles) => {
      // Set all the sounds in our audio store
      setBackgroundMusic(audioFiles.backgroundMusic);
      setHitSound(audioFiles.hitSound);
      setSuccessSound(audioFiles.successSound);
      setWinSound(audioFiles.winSound);
      setLoseSound(audioFiles.lossSound);
      setGameOverSound(audioFiles.gameOverSound);
    });
  }, [
    init, 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound, 
    setWinSound, 
    setLoseSound, 
    setGameOverSound
  ]);
  
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<CasinoLobby />} />
            <Route path="/blackjack" element={
              <GameRouteWrapper>
                <BlackjackGame />
              </GameRouteWrapper>
            } />
            <Route path="/higher-or-lower" element={
              <GameRouteWrapper>
                <HigherOrLowerGame />
              </GameRouteWrapper>
            } />
            <Route path="/ride-the-bus" element={
              <GameRouteWrapper>
                <RideTheBusGame />
              </GameRouteWrapper>
            } />
            <Route path="/slots" element={
              <GameRouteWrapper>
                <SlotMachine />
              </GameRouteWrapper>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
      <Toaster position="top-center" />
    </Router>
  );
}

export default App;
