import { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../ui/table';
import { Trophy, Clock, DollarSign, Loader2 } from 'lucide-react';
import { formatDuration } from '../../lib/utils';
import { Card } from '../ui/card';
import { LeaderboardEntry, getLeaderboardEntries } from '../../lib/api/leaderboard';

const LeaderboardTab = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboardEntries();
        setEntries(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);
  
  // Calculate efficiency score (more points in less time = better)
  const getEfficiencyScore = (score: number, time: number) => {
    // Avoid division by zero
    if (time <= 0) return 0;
    
    // Points per second, multiplied by 100 for readability
    return ((score / time) * 100).toFixed(2);
  };

  return (
    <div className="my-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Top Casino Players</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card className="p-8 text-center text-red-500">
          {error}
        </Card>
      ) : entries.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-500">No entries yet. Be the first to join the leaderboard!</p>
        </Card>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
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
                      <Trophy className="h-5 w-5 text-yellow-500 mx-auto" />
                    ) : index === 1 ? (
                      <Trophy className="h-5 w-5 text-slate-400 mx-auto" />
                    ) : index === 2 ? (
                      <Trophy className="h-5 w-5 text-amber-700 mx-auto" />
                    ) : (
                      index + 1
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {entry.playerName}
                  </TableCell>
                  <TableCell className="text-right font-bold text-green-600">
                    ${entry.score}
                  </TableCell>
                  <TableCell className="text-right text-slate-600 dark:text-slate-300">
                    {formatDuration(entry.timeTaken)}
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                      {getEfficiencyScore(entry.score, entry.timeTaken)} pts/min
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTab;