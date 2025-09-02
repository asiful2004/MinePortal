import {
  users,
  serverConfig,
  newsArticles,
  seasons,
  teamMembers,
  votingSites,
  galleryImages,
  storeItems,
  type User,
  type InsertUser,
  type ServerConfig,
  type InsertServerConfig,
  type NewsArticle,
  type InsertNewsArticle,
  type Season,
  type InsertSeason,
  type TeamMember,
  type InsertTeamMember,
  type VotingSite,
  type InsertVotingSite,
  type GalleryImage,
  type InsertGalleryImage,
  type StoreItem,
  type InsertStoreItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;

  // Server Config
  getServerConfig(): Promise<ServerConfig | undefined>;
  updateServerConfig(config: Partial<InsertServerConfig>): Promise<ServerConfig>;

  // News
  getPublishedNews(limit?: number): Promise<NewsArticle[]>;
  getFeaturedNews(): Promise<NewsArticle | undefined>;
  getAllNews(): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  updateNewsArticle(id: string, article: Partial<InsertNewsArticle>): Promise<NewsArticle>;
  deleteNewsArticle(id: string): Promise<void>;

  // Seasons
  getActiveSeason(): Promise<Season | undefined>;
  getAllSeasons(): Promise<Season[]>;
  createSeason(season: InsertSeason): Promise<Season>;
  updateSeason(id: string, season: Partial<InsertSeason>): Promise<Season>;

  // Team
  getActiveTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, member: Partial<InsertTeamMember>): Promise<TeamMember>;

  // Voting
  getActiveVotingSites(): Promise<VotingSite[]>;
  createVotingSite(site: InsertVotingSite): Promise<VotingSite>;
  updateVotingSite(id: string, site: Partial<InsertVotingSite>): Promise<VotingSite>;

  // Gallery
  getVisibleGalleryImages(): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage>;

  // Store
  getActiveStoreItems(): Promise<StoreItem[]>;
  createStoreItem(item: InsertStoreItem): Promise<StoreItem>;
  updateStoreItem(id: string, item: Partial<InsertStoreItem>): Promise<StoreItem>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // Server Config
  async getServerConfig(): Promise<ServerConfig | undefined> {
    const [config] = await db.select().from(serverConfig).limit(1);
    return config;
  }

  async updateServerConfig(configData: Partial<InsertServerConfig>): Promise<ServerConfig> {
    const existing = await this.getServerConfig();
    if (existing) {
      const [updated] = await db
        .update(serverConfig)
        .set({ ...configData, updatedAt: new Date() })
        .where(eq(serverConfig.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(serverConfig)
        .values(configData as InsertServerConfig)
        .returning();
      return created;
    }
  }

  // News
  async getPublishedNews(limit = 10): Promise<NewsArticle[]> {
    return db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.isPublished, true))
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit);
  }

  async getFeaturedNews(): Promise<NewsArticle | undefined> {
    const [featured] = await db
      .select()
      .from(newsArticles)
      .where(and(eq(newsArticles.isPublished, true), eq(newsArticles.isFeatured, true)))
      .orderBy(desc(newsArticles.publishedAt))
      .limit(1);
    return featured;
  }

  async getAllNews(): Promise<NewsArticle[]> {
    return db
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.createdAt));
  }

  async getNewsArticleById(id: string): Promise<NewsArticle | undefined> {
    const [article] = await db
      .select()
      .from(newsArticles)
      .where(and(eq(newsArticles.id, id), eq(newsArticles.isPublished, true)))
      .limit(1);
    return article;
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const [created] = await db
      .insert(newsArticles)
      .values(article)
      .returning();
    return created;
  }

  async updateNewsArticle(id: string, articleData: Partial<InsertNewsArticle>): Promise<NewsArticle> {
    const [updated] = await db
      .update(newsArticles)
      .set({ ...articleData, updatedAt: new Date() })
      .where(eq(newsArticles.id, id))
      .returning();
    return updated;
  }

  async deleteNewsArticle(id: string): Promise<void> {
    await db.delete(newsArticles).where(eq(newsArticles.id, id));
  }

  // Seasons
  async getActiveSeason(): Promise<Season | undefined> {
    const [active] = await db
      .select()
      .from(seasons)
      .where(eq(seasons.isActive, true))
      .limit(1);
    return active;
  }

  async getAllSeasons(): Promise<Season[]> {
    return db
      .select()
      .from(seasons)
      .orderBy(desc(seasons.startDate));
  }

  async createSeason(season: InsertSeason): Promise<Season> {
    const [created] = await db
      .insert(seasons)
      .values(season)
      .returning();
    return created;
  }

  async updateSeason(id: string, seasonData: Partial<InsertSeason>): Promise<Season> {
    const [updated] = await db
      .update(seasons)
      .set(seasonData)
      .where(eq(seasons.id, id))
      .returning();
    return updated;
  }

  // Team
  async getActiveTeamMembers(): Promise<TeamMember[]> {
    return db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.isActive, true))
      .orderBy(teamMembers.order);
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [created] = await db
      .insert(teamMembers)
      .values(member)
      .returning();
    return created;
  }

  async updateTeamMember(id: string, memberData: Partial<InsertTeamMember>): Promise<TeamMember> {
    const [updated] = await db
      .update(teamMembers)
      .set(memberData)
      .where(eq(teamMembers.id, id))
      .returning();
    return updated;
  }

  // Voting
  async getActiveVotingSites(): Promise<VotingSite[]> {
    return db
      .select()
      .from(votingSites)
      .where(eq(votingSites.isActive, true))
      .orderBy(votingSites.order);
  }

  async createVotingSite(site: InsertVotingSite): Promise<VotingSite> {
    const [created] = await db
      .insert(votingSites)
      .values(site)
      .returning();
    return created;
  }

  async updateVotingSite(id: string, siteData: Partial<InsertVotingSite>): Promise<VotingSite> {
    const [updated] = await db
      .update(votingSites)
      .set(siteData)
      .where(eq(votingSites.id, id))
      .returning();
    return updated;
  }

  // Gallery
  async getVisibleGalleryImages(): Promise<GalleryImage[]> {
    return db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.isVisible, true))
      .orderBy(galleryImages.order);
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const [created] = await db
      .insert(galleryImages)
      .values(image)
      .returning();
    return created;
  }

  async updateGalleryImage(id: string, imageData: Partial<InsertGalleryImage>): Promise<GalleryImage> {
    const [updated] = await db
      .update(galleryImages)
      .set(imageData)
      .where(eq(galleryImages.id, id))
      .returning();
    return updated;
  }

  // Store
  async getActiveStoreItems(): Promise<StoreItem[]> {
    return db
      .select()
      .from(storeItems)
      .where(eq(storeItems.isActive, true))
      .orderBy(storeItems.order);
  }

  async createStoreItem(item: InsertStoreItem): Promise<StoreItem> {
    const [created] = await db
      .insert(storeItems)
      .values(item)
      .returning();
    return created;
  }

  async updateStoreItem(id: string, itemData: Partial<InsertStoreItem>): Promise<StoreItem> {
    const [updated] = await db
      .update(storeItems)
      .set(itemData)
      .where(eq(storeItems.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
