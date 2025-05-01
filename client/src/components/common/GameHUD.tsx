import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCasinoGame } from '../../lib/stores/useCasinoGame';
import { Clock, Home, Lock, HelpCircle, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import DrawOutDialog from './DrawOutDialog';
import { formatDuration } from '../../lib/utils';

const GameHUD = () => {
  const [drawOutDialogOpen, setDrawOutDialogOpen] = useState(false);
  const { balance, startTime, getTimePlayed } = useCasinoGame();
  const navigate = useNavigate();
  
  const [elapsed, setElapsed] = useState(getTimePlayed());
  
  // Update the elapsed time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(getTimePlayed());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [getTimePlayed]);
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleHelp = () => {
    // Show a help dialog or tooltip here
    alert("If you're stuck, use the 'I'm Stuck' button to reset the current game state without losing your money. If you want to cash out your winnings to the leaderboard, use the 'Cash Out' button.");
  };
  
  return (
    <>
      {/* Fixed position HUD at the bottom of the screen */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          {/* Left side - Game info */}
          <Card className="bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-700 p-2 flex items-center space-x-3 pointer-events-auto">
            <button
              onClick={handleGoHome}
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Return to Lobby"
            >
              <Home className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </button>
            
            <div className="flex flex-col text-xs sm:text-sm">
              <div className="font-medium text-slate-800 dark:text-slate-200">
                Balance: <span className="text-green-600 font-bold">${balance}</span>
              </div>
              <div className="text-slate-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(elapsed)}</span>
              </div>
            </div>
          </Card>
          
          {/* Right side - Action buttons */}
          <div className="flex gap-2 pointer-events-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleHelp}
              className="h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md"
              title="Help"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md"
              title="I'm Stuck"
            >
              <Lock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">I'm Stuck</span>
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={() => setDrawOutDialogOpen(true)}
              className="h-10 bg-green-600 hover:bg-green-700 text-white font-medium shadow-md"
              title="Cash Out"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Cash Out</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Draw Out Dialog */}
      <DrawOutDialog
        open={drawOutDialogOpen}
        onOpenChange={setDrawOutDialogOpen}
        timePlayed={elapsed}
      />
    </>
  );
};

export default GameHUD;