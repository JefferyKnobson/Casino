import { useState } from "react";
import { addLeaderboardEntry } from "../../lib/api/leaderboard";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useCasinoGame } from "../../lib/stores/useCasinoGame";

interface DrawOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timePlayed: number; // Time in seconds
}

const DrawOutDialog = ({ open, onOpenChange, timePlayed }: DrawOutDialogProps) => {
  const [playerName, setPlayerName] = useState("");
  const { balance, resetBalance } = useCasinoGame();
  const queryClient = useQueryClient();
  
  const { mutate, isPending } = useMutation({
    mutationFn: addLeaderboardEntry,
    onSuccess: () => {
      toast.success("Score saved to leaderboard!");
      // Reset player's balance to starting amount
      resetBalance();
      // Invalidate the leaderboard cache to refresh it
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Failed to save score:", error);
      toast.error("Failed to save your score. Please try again.");
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    mutate({
      playerName: playerName.trim(),
      score: balance,
      timeTaken: timePlayed
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cash Out</DialogTitle>
          <DialogDescription>
            Save your score to the leaderboard and start a new game.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Current Balance:</span>
              <span className="font-bold text-green-600">${balance}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Time Played:</span>
              <span className="font-medium">
                {Math.floor(timePlayed / 60)}m {timePlayed % 60}s
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="playerName" className="text-sm font-medium">
              Your Name
            </label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              required
              autoFocus
              className="col-span-3"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isPending || !playerName.trim()}
            >
              {isPending ? "Saving..." : "Save Score"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DrawOutDialog;