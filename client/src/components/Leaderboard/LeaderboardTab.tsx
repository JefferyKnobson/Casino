import { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../ui/table';
import { Trophy, Clock, DollarSign, Loader2, RefreshCw } from 'lucide-react';
import { formatDuration } from '../../lib/utils';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { LeaderboardEntry, getLeaderboardEntries } from '../../lib/api/leaderboard';
import { toast } from 'sonner';

const LeaderboardTab = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLeaderboardEntries();
      setEntries(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
    toast.success('Leaderboard refreshed!');
  };
  
  // Calculate efficiency score (more points in less time = better)
  const getEfficiencyScore = (score: number, time: number) => {
    // Avoid division by zero
    if (time <= 0) return 0;
    
    // Points per second, multiplied by 60 for minutes
    return ((score / time) * 60).toFixed(1);
  };

  // Format date for last updated timestamp
  const formatLastUpdated = (date: Date) => {
    if (!date) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      const options: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit'
      };
      return date.toLocaleTimeString(undefined, options);
    }
  };

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Global Leaderboard</h2>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      {lastUpdated && (
        <div className="text-xs text-slate-500 mb-4">
          Last updated: {formatLastUpdated(lastUpdated)}
        </div>
      )}
      
      {loading && !refreshing ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card className="p-8 text-center text-red-500">
          {error}
        </Card>
      ) : entries.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-500">No entries yet. Be the first to join the global leaderboard!</p>
        </Card>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            <Table>
              <TableHeader className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                <TableRow>
                  <TableHead className="w-12 text-center">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">
                    <span className="flex items-center justify-end gap-1">
                      <DollarSign className="h-4 w-4" />
                      Score
                    </span>
                  </TableHead>
                  <TableHead className="text-right">
                    <span className="flex items-center justify-end gap-1">
                      <Clock className="h-4 w-4" />
                      Time
                    </span>
                  </TableHead>
                  <TableHead className="text-right hidden md:table-cell">Efficiency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, index) => (
                  <TableRow key={entry.id} className={index < 3 ? "bg-amber-50 dark:bg-amber-950/20" : ""}>
                    <TableCell className="font-medium text-center">
                      {index === 0 ? (
                        <div className="relative">
                          <Trophy className="h-5 w-5 text-yellow-500 mx-auto" />
                          <span className="absolute -top-1 -right-1 text-xs bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center">1</span>
                        </div>
                      ) : index === 1 ? (
                        <div className="relative">
                          <Trophy className="h-5 w-5 text-slate-400 mx-auto" />
                          <span className="absolute -top-1 -right-1 text-xs bg-slate-400 text-white rounded-full w-4 h-4 flex items-center justify-center">2</span>
                        </div>
                      ) : index === 2 ? (
                        <div className="relative">
                          <Trophy className="h-5 w-5 text-amber-700 mx-auto" />
                          <span className="absolute -top-1 -right-1 text-xs bg-amber-700 text-white rounded-full w-4 h-4 flex items-center justify-center">3</span>
                        </div>
                      ) : (
                        <span className="font-semibold">{index + 1}</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.playerName}
                      {new Date(entry.createdAt).getDate() === new Date().getDate() && (
                        <span className="ml-2 text-xs text-white bg-blue-500 px-1.5 py-0.5 rounded-full">Today</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      ${entry.score.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-slate-600 dark:text-slate-300">
                      {formatDuration(entry.timeTaken)}
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                        {getEfficiencyScore(entry.score, entry.timeTaken)} $/min
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
            Cash out your winnings to appear on the global leaderboard!
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTab;