import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "../../lib/api/leaderboard";
import type { LeaderboardEntry } from "../../lib/types/leaderboard";
import { formatDistanceToNow } from "date-fns";
import { Trophy, Clock } from "lucide-react";

// Component to format time duration (seconds to MM:SS)
const FormatTime = ({ seconds }: { seconds: number }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return (
    <span className="flex items-center gap-1">
      <Clock className="h-4 w-4 text-slate-500" />
      {minutes}m {remainingSeconds}s
    </span>
  );
};

const LeaderboardTab = () => {
  const [limit, setLimit] = useState(5);
  
  // Fetch leaderboard data
  const { data: entries, isLoading, error, refetch } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", limit],
    queryFn: () => fetchLeaderboard(limit),
  });

  // Refresh leaderboard data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>Failed to load leaderboard data.</p>
        <button 
          onClick={() => refetch()} 
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Leaderboard</h2>
      
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="p-3 text-left font-medium">#</th>
              <th className="p-3 text-left font-medium">Player</th>
              <th className="p-3 text-right font-medium">Score</th>
              <th className="p-3 text-right font-medium">Time</th>
              <th className="p-3 text-right font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {entries && entries.length > 0 ? (
              entries.map((entry, index) => (
                <tr key={entry.id} className={index === 0 ? "bg-amber-50 dark:bg-amber-900/20" : ""}>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      {index === 0 && <Trophy className="h-4 w-4 text-amber-500" />}
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-3 font-medium">
                    {entry.playerName}
                  </td>
                  <td className="p-3 text-right font-bold text-green-600 dark:text-green-400">
                    ${entry.score}
                  </td>
                  <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                    <FormatTime seconds={entry.timeTaken} />
                  </td>
                  <td className="p-3 text-right text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No entries yet. Be the first to cash out!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {entries && entries.length > 0 && (
        <div className="mt-4 text-center text-sm text-slate-500">
          Showing top {entries.length} players
        </div>
      )}
    </div>
  );
};

export default LeaderboardTab;