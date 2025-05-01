import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeaderboardSchema } from "../shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Leaderboard API routes
  app.get('/api/leaderboard', async (req: Request, res: Response) => {
    try {
      // Get top 5 leaderboard entries by default
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const entries = await storage.getTopLeaderboardEntries(limit);
      return res.json(entries);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return res.status(500).json({ error: 'Failed to fetch leaderboard entries' });
    }
  });

  app.post('/api/leaderboard', async (req: Request, res: Response) => {
    try {
      // Validate the request body against the schema
      const validatedData = insertLeaderboardSchema.parse(req.body);
      
      // Add the entry to the leaderboard
      const newEntry = await storage.addLeaderboardEntry(validatedData);
      return res.status(201).json(newEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error adding leaderboard entry:', error);
      return res.status(500).json({ error: 'Failed to add leaderboard entry' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
