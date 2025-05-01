import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useCasinoGame } from '../../lib/stores/useCasinoGame';
import { formatDuration } from '../../lib/utils';
import { Trophy, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { addLeaderboardEntry } from '../../lib/api/leaderboard';

interface DrawOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timePlayed: number; // Time in seconds
}

const DrawOutDialog = ({ open, onOpenChange, timePlayed }: DrawOutDialogProps) => {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { balance } = useCasinoGame();
  const navigate = useNavigate();
  
  const handleSubmit = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit to leaderboard API
      await addLeaderboardEntry({
        playerName: playerName.trim(),
        score: balance,
        timeTaken: timePlayed
      });
      
      // Success!
      toast.success('Your score has been recorded on the leaderboard!');
      onOpenChange(false);
      
      // Navigate to leaderboard tab
      setTimeout(() => {
        navigate('/', { state: { openLeaderboard: true } });
      }, 500);
    } catch (error) {
      console.error('Error submitting score:', error);
      toast.error('There was a problem submitting your score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Draw Out Your Winnings
          </DialogTitle>
          <DialogDescription>
            Record your score on the leaderboard and cash out your winnings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Your Balance
                </span>
                <span className="text-2xl font-bold text-green-600">${balance}</span>
              </div>
              
              <div className="flex flex-col gap-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Time Played
                </span>
                <span className="text-lg font-medium">{formatDuration(timePlayed)}</span>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="playerName">Your Name</Label>
              <Input
                id="playerName"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !playerName.trim()}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Save Score & Exit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DrawOutDialog;