import { storage } from "./storage";
import type { 
  InsertNewsArticle, 
  InsertSeason, 
  InsertTeamMember, 
  InsertVotingSite, 
  InsertGalleryImage, 
  InsertStoreItem 
} from "@shared/schema";

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user
    await storage.createUser({
      username: "admin",
      password: "admin123",
      role: "admin",
    });

    // Update server config
    await storage.updateServerConfig({
      name: "SkyBlock Legends",
      ip: "play.skyblocklegends.net",
      description: "Experience the ultimate SkyBlock adventure with custom islands, epic quests, and legendary rewards.",
      version: "1.20.1",
      maxPlayers: 2000,
      isOnline: true,
      playerCount: 1247,
    });

    // Seed news articles
    const newsArticles: InsertNewsArticle[] = [
      {
        title: "Season 3: The Sky Legends Update is Here!",
        excerpt: "After months of development, we're thrilled to announce the launch of Season 3: Sky Legends! This massive update introduces floating islands, magic systems, legendary quests, and so much more.",
        content: "After months of development, we're thrilled to announce the launch of Season 3: Sky Legends! This massive update introduces floating islands, magic systems, legendary quests, and so much more. Explore new dimensions of SkyBlock gameplay like never before.",
        category: "update",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        authorId: null,
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date(),
      },
      {
        title: "Winter PvP Championship 2024",
        excerpt: "Join the ultimate PvP showdown with $10,000 in prizes. Registration opens soon for our biggest tournament yet!",
        content: "Join the ultimate PvP showdown with $10,000 in prizes. Registration opens soon for our biggest tournament yet! This will be an epic battle between the best players on our server.",
        category: "tournament",
        imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        authorId: null,
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        title: "Performance Improvements & Bug Fixes",
        excerpt: "Latest server optimizations include reduced lag, bug fixes, and enhanced stability for better gameplay experience.",
        content: "Latest server optimizations include reduced lag, bug fixes, and enhanced stability for better gameplay experience. We've been working hard to make sure everyone has the best possible experience.",
        category: "maintenance",
        imageUrl: "https://pixabay.com/get/ge51242a0708c2f7278323cf722f071ef53f6684bc0d52dff87a4a2e49f3a166349cf505a67d474c02acb689332b2920cea1395f720901b774fee0abcbbe60484_1280.jpg",
        authorId: null,
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 172800000), // 2 days ago
      },
    ];

    for (const article of newsArticles) {
      await storage.createNewsArticle(article);
    }

    // Seed current season
    const currentSeason: InsertSeason = {
      name: "Season 3: Sky Legends",
      description: "Embark on the ultimate SkyBlock adventure in our most ambitious season yet. Explore floating islands, master new magic systems, and compete for legendary titles. With custom enchantments, unique mobs, and endless possibilities, Season 3 brings SkyBlock to a whole new level.",
      version: "S3",
      startDate: new Date("2024-01-01"),
      endDate: null,
      isActive: true,
      features: ["50+ New Custom Islands", "Magic System & Spells", "Legendary Boss Battles", "Exclusive Season Rewards"],
      videoUrl: null,
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    };

    await storage.createSeason(currentSeason);

    // Seed previous seasons
    const previousSeasons: InsertSeason[] = [
      {
        name: "Season 2: Skyward Bound",
        description: "Introduced vertical progression with sky towers, advanced automation, and guild systems. Featured epic clan wars and territory control.",
        version: "S2",
        startDate: new Date("2023-06-01"),
        endDate: new Date("2023-12-31"),
        isActive: false,
        features: ["Guilds", "Automation", "PvP Wars"],
        videoUrl: null,
        imageUrl: null,
      },
      {
        name: "Season 1: The Foundation",
        description: "The beginning of our epic journey! Established core SkyBlock mechanics, economy system, and basic island progression with custom enchantments.",
        version: "S1",
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-05-31"),
        isActive: false,
        features: ["Economy", "Enchants", "Islands"],
        videoUrl: null,
        imageUrl: null,
      },
    ];

    for (const season of previousSeasons) {
      await storage.createSeason(season);
    }

    // Seed team members
    const teamMembers: InsertTeamMember[] = [
      {
        name: "SkyKing",
        role: "founder",
        description: "Visionary leader with 8+ years in Minecraft server development. Passionate about creating innovative gameplay experiences.",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        order: 1,
        isActive: true,
      },
      {
        name: "CodeMaster",
        role: "developer",
        description: "Expert Java developer specializing in Minecraft plugins and server optimization. Creates the magic behind our custom features.",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        order: 2,
        isActive: true,
      },
      {
        name: "SkyQueen",
        role: "admin",
        description: "Heart of our community, managing events, player relations, and ensuring everyone has an amazing experience on our server.",
        avatarUrl: "https://pixabay.com/get/g2cd3e0eadd2eb2a2c062dbae9eb26c239639836b254ae5f7075a6652f7488875f3bd71cfcbb9fe50f283ddfd473f342079ba20dec4f7c25733e0469dc9b8ab22_1280.jpg",
        order: 3,
        isActive: true,
      },
      {
        name: "GuardianX",
        role: "admin",
        description: "Head administrator ensuring fair play and maintaining server security. Always available to help players.",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        order: 4,
        isActive: true,
      },
      {
        name: "BuilderPro",
        role: "builder",
        description: "Master builder responsible for creating stunning server infrastructure and helping with player builds.",
        avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        order: 5,
        isActive: true,
      },
    ];

    for (const member of teamMembers) {
      await storage.createTeamMember(member);
    }

    // Seed voting sites
    const votingSites: InsertVotingSite[] = [
      {
        name: "MinecraftServers.org",
        url: "https://minecraftservers.org/vote/123456",
        description: "One of the largest Minecraft server lists with millions of players.",
        reward: "+500 Diamonds",
        order: 1,
        isActive: true,
      },
      {
        name: "Planet Minecraft",
        url: "https://planetminecraft.com/server/vote/123456",
        description: "Creative community platform with server rankings.",
        reward: "+500 Diamonds",
        order: 2,
        isActive: true,
      },
      {
        name: "Minecraft-MP",
        url: "https://minecraft-mp.com/server/vote/123456",
        description: "Popular server listing site with active community voting.",
        reward: "+500 Diamonds",
        order: 3,
        isActive: true,
      },
      {
        name: "TopG",
        url: "https://topg.org/minecraft-servers/vote/123456",
        description: "Gaming server rankings across multiple games.",
        reward: "+500 Diamonds",
        order: 4,
        isActive: true,
      },
      {
        name: "Minecraft Server List",
        url: "https://minecraft-server-list.com/server/vote/123456",
        description: "Comprehensive directory of quality Minecraft servers.",
        reward: "+500 Diamonds",
        order: 5,
        isActive: true,
      },
    ];

    for (const site of votingSites) {
      await storage.createVotingSite(site);
    }

    // Seed gallery images
    const galleryImages: InsertGalleryImage[] = [
      {
        title: "Epic Castle Build",
        description: "A magnificent castle built by one of our talented players",
        imageUrl: "https://pixabay.com/get/g89d0fd1cf93ab4499b9aa22aa0f5e7d13c968425f99bc5b2d9e6821053342fa95ffeba8913e50d235a63942d97004f6871c179940606521b176fcd9c37cb61ba_1280.jpg",
        author: "MasterBuilder",
        category: "build",
        order: 1,
        isVisible: true,
      },
      {
        title: "Redstone Factory",
        description: "Incredible automated redstone contraption",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        author: "EngineerPro",
        category: "build",
        order: 2,
        isVisible: true,
      },
      {
        title: "PvP Arena Finals",
        description: "Intense battle from our latest tournament",
        imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        author: "Tournament Staff",
        category: "event",
        order: 3,
        isVisible: true,
      },
      {
        title: "Dragon Pixel Art",
        description: "Amazing pixel art creation",
        imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        author: "ArtistMaster",
        category: "art",
        order: 4,
        isVisible: true,
      },
      {
        title: "Floating City",
        description: "Breathtaking sky city build",
        imageUrl: "https://pixabay.com/get/gc4b10477fb0bd9f35fa439496ca33939871f6ce174d3af82d03e8de09540d22e9332d289c35fc4c1ceeaa892bd1c2af67c31d1d8c753e621a9abf21ceec453f4_1280.jpg",
        author: "SkyBuilder",
        category: "build",
        order: 5,
        isVisible: true,
      },
      {
        title: "Community Event",
        description: "Server anniversary celebration",
        imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        author: "Event Team",
        category: "event",
        order: 6,
        isVisible: true,
      },
    ];

    for (const image of galleryImages) {
      await storage.createGalleryImage(image);
    }

    // Seed store items
    const storeItems: InsertStoreItem[] = [
      {
        name: "VIP Rank",
        description: "Enhanced gameplay experience with exclusive perks",
        price: "$9.99",
        category: "rank",
        features: ["5 Island Warps", "VIP Chat Color", "Daily Rewards", "Access to VIP Island"],
        imageUrl: null,
        isPopular: false,
        isActive: true,
        order: 1,
      },
      {
        name: "MVP Rank",
        description: "Premium rank with advanced features and benefits",
        price: "$19.99",
        category: "rank",
        features: ["All VIP Features", "10 Island Warps", "Exclusive Cosmetics", "Priority Queue"],
        imageUrl: null,
        isPopular: true,
        isActive: true,
        order: 2,
      },
      {
        name: "Legend Rank",
        description: "Ultimate rank with maximum privileges",
        price: "$39.99",
        category: "rank",
        features: ["All MVP Features", "Unlimited Warps", "Legend Island Access", "Custom Commands"],
        imageUrl: null,
        isPopular: false,
        isActive: true,
        order: 3,
      },
      {
        name: "Legendary Crate",
        description: "Contains rare items and exclusive rewards",
        price: "$4.99",
        category: "item",
        features: ["Rare Items", "Exclusive Rewards"],
        imageUrl: null,
        isPopular: false,
        isActive: true,
        order: 4,
      },
      {
        name: "Epic Pet",
        description: "Loyal companion with special abilities",
        price: "$7.99",
        category: "item",
        features: ["Special Abilities", "Loyal Companion"],
        imageUrl: null,
        isPopular: false,
        isActive: true,
        order: 5,
      },
      {
        name: "Particle Effect",
        description: "Cool visual effects for your character",
        price: "$2.99",
        category: "cosmetic",
        features: ["Visual Effects", "Character Enhancement"],
        imageUrl: null,
        isPopular: false,
        isActive: true,
        order: 6,
      },
      {
        name: "Custom Title",
        description: "Personalized title to show off your style",
        price: "$1.99",
        category: "cosmetic",
        features: ["Personalized Title", "Style Enhancement"],
        imageUrl: null,
        isPopular: false,
        isActive: true,
        order: 7,
      },
    ];

    for (const item of storeItems) {
      await storage.createStoreItem(item);
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
