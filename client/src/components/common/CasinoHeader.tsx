import { Link, useLocation } from "react-router-dom";
import { VolumeX, Volume2, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCasinoGame } from "@/lib/stores/useCasinoGame";
import { cn } from "@/lib/utils";

interface CasinoHeaderProps {
  isMuted: boolean;
  onToggleSound: () => void;
}

const CasinoHeader = ({ isMuted, onToggleSound }: CasinoHeaderProps) => {
  const location = useLocation();
  const { balance } = useCasinoGame();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="w-full bg-primary text-primary-foreground py-4 px-4 sm:px-8 sticky top-0 z-10 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Casino Desperado
            </h1>
          </Link>
          
          <nav className="hidden sm:flex items-center ml-6 space-x-1">
            <Link 
              to="/" 
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive('/') 
                  ? "bg-primary-foreground/20 text-white" 
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
              )}
            >
              Lobby
            </Link>
            <Link 
              to="/blackjack" 
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive('/blackjack') 
                  ? "bg-primary-foreground/20 text-white" 
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
              )}
            >
              Blackjack
            </Link>
            <Link 
              to="/round-the-bus" 
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive('/round-the-bus') 
                  ? "bg-primary-foreground/20 text-white" 
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
              )}
            >
              Round the Bus
            </Link>
            <Link 
              to="/slots" 
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive('/slots') 
                  ? "bg-primary-foreground/20 text-white" 
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
              )}
            >
              Slots
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center bg-primary-foreground/10 rounded-md px-3 py-1.5">
            <User size={16} className="mr-2" />
            <span className="font-semibold text-sm sm:text-base">
              {formatCurrency(balance)}
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleSound}
            title={isMuted ? "Unmute" : "Mute"}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          
          <Link to="/" className="sm:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Home size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CasinoHeader;
