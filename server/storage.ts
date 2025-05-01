import { users, leaderboard, type User, type InsertUser, type LeaderboardEntry, type InsertLeaderboardEntry } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Leaderboard operations
  getTopLeaderboardEntries(limit: number): Promise<LeaderboardEntry[]>;
  addLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leaderboardEntries: LeaderboardEntry[];
  currentId: number;
  private leaderboardId: number;

  constructor() {
    this.users = new Map();
    this.leaderboardEntries = [];
    this.currentId = 1;
    this.leaderboardId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getTopLeaderboardEntries(limit: number): Promise<LeaderboardEntry[]> {
    // Sort by score in descending order and return the top entries
    return [...this.leaderboardEntries]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  async addLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const id = this.leaderboardId++;
    const createdAt = new Date();
    
    const newEntry: LeaderboardEntry = {
      id,
      createdAt,
      ...entry
    };
    
    this.leaderboardEntries.push(newEntry);
    return newEntry;
  }
}

export const storage = new MemStorage();
