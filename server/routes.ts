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

  app.get('/api/news/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getNewsArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: 'News article not found' });
      }
      
      res.json(article);
    } catch (error) {
      console.error('Error fetching news article:', error);
      res.status(500).json({ message: 'Failed to fetch news article' });
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

  app.delete('/api/admin/seasons/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSeason(id);
      res.json({ message: 'Season deleted successfully' });
    } catch (error) {
      console.error('Error deleting season:', error);
      res.status(500).json({ message: 'Failed to delete season' });
    }
  });

  // Team management routes
  app.get('/api/admin/team', authenticateToken, async (req, res) => {
    try {
      const team = await storage.getActiveTeamMembers();
      res.json(team);
    } catch (error) {
      console.error('Error fetching team:', error);
      res.status(500).json({ message: 'Failed to fetch team' });
    }
  });

  app.post('/api/admin/team', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(validatedData);
      res.json(member);
    } catch (error) {
      console.error('Error creating team member:', error);
      res.status(500).json({ message: 'Failed to create team member' });
    }
  });

  app.put('/api/admin/team/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertTeamMemberSchema.partial().parse(req.body);
      const member = await storage.updateTeamMember(id, validatedData);
      res.json(member);
    } catch (error) {
      console.error('Error updating team member:', error);
      res.status(500).json({ message: 'Failed to update team member' });
    }
  });

  app.delete('/api/admin/team/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTeamMember(id);
      res.json({ message: 'Team member deleted successfully' });
    } catch (error) {
      console.error('Error deleting team member:', error);
      res.status(500).json({ message: 'Failed to delete team member' });
    }
  });

  // Voting sites management routes
  app.get('/api/admin/voting-sites', authenticateToken, async (req, res) => {
    try {
      const sites = await storage.getActiveVotingSites();
      res.json(sites);
    } catch (error) {
      console.error('Error fetching voting sites:', error);
      res.status(500).json({ message: 'Failed to fetch voting sites' });
    }
  });

  app.post('/api/admin/voting-sites', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertVotingSiteSchema.parse(req.body);
      const site = await storage.createVotingSite(validatedData);
      res.json(site);
    } catch (error) {
      console.error('Error creating voting site:', error);
      res.status(500).json({ message: 'Failed to create voting site' });
    }
  });

  app.put('/api/admin/voting-sites/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertVotingSiteSchema.partial().parse(req.body);
      const site = await storage.updateVotingSite(id, validatedData);
      res.json(site);
    } catch (error) {
      console.error('Error updating voting site:', error);
      res.status(500).json({ message: 'Failed to update voting site' });
    }
  });

  // Gallery management routes
  app.get('/api/admin/gallery', authenticateToken, async (req, res) => {
    try {
      const images = await storage.getVisibleGalleryImages();
      res.json(images);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      res.status(500).json({ message: 'Failed to fetch gallery' });
    }
  });

  app.post('/api/admin/gallery', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage(validatedData);
      res.json(image);
    } catch (error) {
      console.error('Error creating gallery image:', error);
      res.status(500).json({ message: 'Failed to create gallery image' });
    }
  });

  app.put('/api/admin/gallery/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertGalleryImageSchema.partial().parse(req.body);
      const image = await storage.updateGalleryImage(id, validatedData);
      res.json(image);
    } catch (error) {
      console.error('Error updating gallery image:', error);
      res.status(500).json({ message: 'Failed to update gallery image' });
    }
  });

  // Store management routes
  app.get('/api/admin/store', authenticateToken, async (req, res) => {
    try {
      const items = await storage.getActiveStoreItems();
      res.json(items);
    } catch (error) {
      console.error('Error fetching store items:', error);
      res.status(500).json({ message: 'Failed to fetch store items' });
    }
  });

  app.post('/api/admin/store', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertStoreItemSchema.parse(req.body);
      const item = await storage.createStoreItem(validatedData);
      res.json(item);
    } catch (error) {
      console.error('Error creating store item:', error);
      res.status(500).json({ message: 'Failed to create store item' });
    }
  });

  app.put('/api/admin/store/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertStoreItemSchema.partial().parse(req.body);
      const item = await storage.updateStoreItem(id, validatedData);
      res.json(item);
    } catch (error) {
      console.error('Error updating store item:', error);
      res.status(500).json({ message: 'Failed to update store item' });
    }
  });

  // Server configuration
  app.get('/api/admin/server/config', authenticateToken, async (req, res) => {
    try {
      const config = await storage.getServerConfig();
      res.json(config);
    } catch (error) {
      console.error('Error fetching server config:', error);
      res.status(500).json({ message: 'Failed to fetch server config' });
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
