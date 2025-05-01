import { apiRequest } from "../queryClient";
import type { LeaderboardEntry, AddLeaderboardEntryParams } from "../types/leaderboard";

// Fetch top N leaderboard entries
export const fetchLeaderboard = async (limit: number = 5): Promise<LeaderboardEntry[]> => {
  return apiRequest(`/api/leaderboard?limit=${limit}`, { method: 'GET' });
};

// Add a new leaderboard entry
export const addLeaderboardEntry = async (entry: AddLeaderboardEntryParams): Promise<LeaderboardEntry> => {
  return apiRequest('/api/leaderboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
};