import { apiRequest } from '../queryClient';

// Define LeaderboardEntry type
export interface LeaderboardEntry {
  id: number;
  playerName: string;
  score: number;
  timeTaken: number;
  createdAt: string;
}

// Define the input for creating a new leaderboard entry
export interface CreateLeaderboardEntry {
  playerName: string;
  score: number;
  timeTaken: number;
}

// Get all leaderboard entries, sorted by score (highest first)
export const getLeaderboardEntries = async (): Promise<LeaderboardEntry[]> => {
  return apiRequest<LeaderboardEntry[]>({
    url: '/api/leaderboard',
    method: 'GET',
  });
};

// Add a new entry to the leaderboard
export const addLeaderboardEntry = async (
  entry: CreateLeaderboardEntry
): Promise<LeaderboardEntry> => {
  return apiRequest<LeaderboardEntry>({
    url: '/api/leaderboard',
    method: 'POST',
    body: entry,
  });
};