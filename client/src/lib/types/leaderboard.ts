export interface LeaderboardEntry {
  id: number;
  playerName: string;
  score: number;
  timeTaken: number;
  createdAt: string;
}

export interface AddLeaderboardEntryParams {
  playerName: string;
  score: number;
  timeTaken: number;
}