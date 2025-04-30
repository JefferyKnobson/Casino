import { ReactNode, useEffect } from "react";
import CasinoHeader from "./common/CasinoHeader";
import { useAudio } from "@/lib/stores/useAudio";
import { playSound } from "@/lib/utils/audio";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { backgroundMusic, isMuted, toggleMute } = useAudio();
  
  useEffect(() => {
    // Play background music when component mounts
    if (backgroundMusic && !isMuted) {
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.3;
      
      backgroundMusic.play().catch((error) => {
        console.error("Background music play prevented:", error);
      });
    }
    
    // Pause background music when component unmounts
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
      }
    };
  }, [backgroundMusic, isMuted]);
  
  // Handle sound toggle
  const handleToggleSound = () => {
    toggleMute();
    playSound("hit");
    
    if (backgroundMusic) {
      if (isMuted) {
        backgroundMusic.play().catch(error => {
          console.error("Background music play prevented:", error);
        });
      } else {
        backgroundMusic.pause();
      }
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CasinoHeader isMuted={isMuted} onToggleSound={handleToggleSound} />
      <main className="flex-1 w-full max-w-full sm:max-w-7xl mx-auto px-2 sm:px-4 pb-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
      <footer className="w-full py-2 border-t border-primary/20 text-center text-sm text-muted-foreground">
        <p>Casino Desperado &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;
