import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import { insertNewsArticleSchema, insertSeasonSchema, insertTeamMemberSchema, insertVotingSiteSchema, insertGalleryImageSchema, insertStoreItemSchema } from "@shared/schema";

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    username: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "skyblock-legends-secret-key";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Public API routes

  // Server status and config
  app.get('/api/server/status', async (req, res) => {
    try {
      const config = await storage.getServerConfig();
      if (!config) {
        return res.json({
          name: "SkyBlock Legends",
          ip: "play.skyblocklegends.net",
          isOnline: true,
          playerCount: 0,
          maxPlayers: 2000,
          version: "1.20.1"
        });
      }
      res.json(config);
    } catch (error) {
      console.error('Error fetching server status:', error);
      res.status(500).json({ message: 'Failed to fetch server status' });
    }
  });

  // News routes
  app.get('/api/news', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const news = await storage.getPublishedNews(limit);
      res.json(news);
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ message: 'Failed to fetch news' });
    }
  });

  app.get('/api/news/featured', async (req, res) => {
    try {
      const featured = await storage.getFeaturedNews();
      res.json(featured);
    } catch (error) {
      console.error('Error fetching featured news:', error);
      res.status(500).json({ message: 'Failed to fetch featured news' });
    }
  });

  // Seasons routes
  app.get('/api/seasons/current', async (req, res) => {
    try {
      const currentSeason = await storage.getActiveSeason();
      res.json(currentSeason);
    } catch (error) {
      console.error('Error fetching current season:', error);
      res.status(500).json({ message: 'Failed to fetch current season' });
    }
  });

  app.get('/api/seasons', async (req, res) => {
    try {
      const seasons = await storage.getAllSeasons();
      res.json(seasons);
    } catch (error) {
      console.error('Error fetching seasons:', error);
      res.status(500).json({ message: 'Failed to fetch seasons' });
    }
  });

  // Team routes
  app.get('/api/team', async (req, res) => {
    try {
      const team = await storage.getActiveTeamMembers();
      res.json(team);
    } catch (error) {
      console.error('Error fetching team:', error);
      res.status(500).json({ message: 'Failed to fetch team' });
    }
  });

  // Voting sites routes
  app.get('/api/voting-sites', async (req, res) => {
    try {
      const sites = await storage.getActiveVotingSites();
      res.json(sites);
    } catch (error) {
      console.error('Error fetching voting sites:', error);
      res.status(500).json({ message: 'Failed to fetch voting sites' });
    }
  });

  // Gallery routes
  app.get('/api/gallery', async (req, res) => {
    try {
      const images = await storage.getVisibleGalleryImages();
      res.json(images);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      res.status(500).json({ message: 'Failed to fetch gallery' });
    }
  });

  // Store routes
  app.get('/api/store/items', async (req, res) => {
    try {
      const items = await storage.getActiveStoreItems();
      res.json(items);
    } catch (error) {
      console.error('Error fetching store items:', error);
      res.status(500).json({ message: 'Failed to fetch store items' });
    }
  });

  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Protected admin routes
  app.get('/api/admin/news', authenticateToken, async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      console.error('Error fetching admin news:', error);
      res.status(500).json({ message: 'Failed to fetch news' });
    }
  });

  app.post('/api/admin/news', authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertNewsArticleSchema.parse({
        ...req.body,
        authorId: req.user.userId,
      });
      const article = await storage.createNewsArticle(validatedData);
      res.json(article);
    } catch (error) {
      console.error('Error creating news article:', error);
      res.status(500).json({ message: 'Failed to create news article' });
    }
  });

  app.put('/api/admin/news/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertNewsArticleSchema.partial().parse(req.body);
      const article = await storage.updateNewsArticle(id, validatedData);
      res.json(article);
    } catch (error) {
      console.error('Error updating news article:', error);
      res.status(500).json({ message: 'Failed to update news article' });
    }
  });

  app.delete('/api/admin/news/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNewsArticle(id);
      res.json({ message: 'News article deleted successfully' });
    } catch (error) {
      console.error('Error deleting news article:', error);
      res.status(500).json({ message: 'Failed to delete news article' });
    }
  });

  app.post('/api/admin/seasons', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertSeasonSchema.parse(req.body);
      const season = await storage.createSeason(validatedData);
      res.json(season);
    } catch (error) {
      console.error('Error creating season:', error);
      res.status(500).json({ message: 'Failed to create season' });
    }
  });

  app.put('/api/admin/seasons/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertSeasonSchema.partial().parse(req.body);
      const season = await storage.updateSeason(id, validatedData);
      res.json(season);
    } catch (error) {
      console.error('Error updating season:', error);
      res.status(500).json({ message: 'Failed to update season' });
    }
  });

  app.put('/api/admin/server/config', authenticateToken, async (req, res) => {
    try {
      const config = await storage.updateServerConfig(req.body);
      res.json(config);
    } catch (error) {
      console.error('Error updating server config:', error);
      res.status(500).json({ message: 'Failed to update server config' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
