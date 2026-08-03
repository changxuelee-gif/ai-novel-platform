import {
  PrismaClient,
  UserRole,
  NovelStatus,
  Gender,
  ActivityType,
  ActivityStatus,
  SubmissionStatus,
  TaskType,
  EarningType,
  WithdrawalStatus,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";
import { join } from "path";

// Load environment variables in Next.js priority order:
// .env.local > .env
config({ path: join(process.cwd(), ".env") });
config({ path: join(process.cwd(), ".env.local"), override: true });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Stable IDs for cross-referencing
const userIds = Array.from({ length: 12 }, (_, i) => `user${i + 1}`);
const categoryIds = Array.from({ length: 6 }, (_, i) => `category${i + 1}`);
const tagIds = Array.from({ length: 15 }, (_, i) => `tag${i + 1}`);
const novelIds = Array.from({ length: 12 }, (_, i) => `novel${i + 1}`);
const chapterIds = Array.from({ length: 36 }, (_, i) => `chapter${i + 1}`);
const branchIds = Array.from({ length: 12 }, (_, i) => `branch${i + 1}`);
const activityIds = Array.from({ length: 5 }, (_, i) => `activity${i + 1}`);
const taskIds = Array.from({ length: 10 }, (_, i) => `task${i + 1}`);

async function main() {
  console.log("🌱 Seeding database...");

  // ===== Clean existing data (reverse dependency order) =====
  console.log("🧹 Cleaning existing data...");
  await prisma.withdrawal.deleteMany();
  await prisma.earning.deleteMany();
  await prisma.userTask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.activitySubmission.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.writingStyle.deleteMany();
  await prisma.character.deleteMany();
  await prisma.readingProgress.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.novelTag.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.novel.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // ===== 1. Users (12) =====
  console.log("👤 Creating users...");

  const usersData = [
    { id: userIds[0], name: "Alice Chen", email: "alice@example.com", role: UserRole.VERIFIED, coins: 5000 },
    { id: userIds[1], name: "Bob Martinez", email: "bob@example.com", role: UserRole.AUTHOR, coins: 3200 },
    { id: userIds[2], name: "Catherine Lee", email: "catherine@example.com", role: UserRole.AUTHOR, coins: 4100 },
    { id: userIds[3], name: "David Kim", email: "david@example.com", role: UserRole.VERIFIED, coins: 6800 },
    { id: userIds[4], name: "Emma Wilson", email: "emma@example.com", role: UserRole.CREATOR, coins: 1500 },
    { id: userIds[5], name: "Frank Zhang", email: "frank@example.com", role: UserRole.CREATOR, coins: 2200 },
    { id: userIds[6], name: "Grace Park", email: "grace@example.com", role: UserRole.CREATOR, coins: 800 },
    { id: userIds[7], name: "Henry Liu", email: "henry@example.com", role: UserRole.CREATOR, coins: 1100 },
    { id: userIds[8], name: "Iris Wang", email: "iris@example.com", role: UserRole.READER, coins: 300 },
    { id: userIds[9], name: "Jack Thompson", email: "jack@example.com", role: UserRole.READER, coins: 450 },
    { id: userIds[10], name: "Karen Davis", email: "karen@example.com", role: UserRole.READER, coins: 200 },
    { id: userIds[11], name: "Leo Brown", email: "leo@example.com", role: UserRole.READER, coins: 150 },
  ];

  for (const u of usersData) {
    await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        coins: u.coins,
        image: `https://i.pravatar.cc/150?u=${u.email}`,
        avatar: `https://i.pravatar.cc/150?u=${u.email}`,
        emailVerified: new Date("2025-01-01"),
      },
    });
  }

  // ===== 2. Categories (6) =====
  console.log("📂 Creating categories...");

  const categoriesData = [
    { id: categoryIds[0], name: "玄幻", slug: "xuanhuan", icon: "🧙" },
    { id: categoryIds[1], name: "都市", slug: "dushi", icon: "🏙️" },
    { id: categoryIds[2], name: "仙侠", slug: "xianxia", icon: "⚔️" },
    { id: categoryIds[3], name: "科幻", slug: "kehuan", icon: "🚀" },
    { id: categoryIds[4], name: "竞技", slug: "jingji", icon: "🏆" },
    { id: categoryIds[5], name: "历史", slug: "lishi", icon: "📜" },
    { id: "category7", name: "悬疑", slug: "xuanyi", icon: "🔍" },
    { id: "category8", name: "言情", slug: "yanqing", icon: "💕" },
    { id: "category9", name: "Fantasy", slug: "fantasy", icon: "🧙" },
    { id: "category10", name: "Romance", slug: "romance", icon: "💕" },
    { id: "category11", name: "Sci-Fi", slug: "sci-fi", icon: "🚀" },
    { id: "category12", name: "Horror", slug: "horror", icon: "👻" },
    { id: "category13", name: "Mystery", slug: "mystery", icon: "🔍" },
    { id: "category14", name: "Adventure", slug: "adventure", icon: "⚔️" },
  ];

  for (const c of categoriesData) {
    await prisma.category.create({ data: c });
  }

  // ===== 3. Tags (15) =====
  console.log("🏷️  Creating tags...");

  const tagsData = [
    { id: tagIds[0], name: "magic", slug: "magic" },
    { id: tagIds[1], name: "romance", slug: "romance" },
    { id: tagIds[2], name: "adventure", slug: "adventure" },
    { id: tagIds[3], name: "dark", slug: "dark" },
    { id: tagIds[4], name: "comedy", slug: "comedy" },
    { id: tagIds[5], name: "sci-fi", slug: "sci-fi" },
    { id: tagIds[6], name: "mystery", slug: "mystery" },
    { id: tagIds[7], name: "horror", slug: "horror" },
    { id: tagIds[8], name: "fantasy", slug: "fantasy" },
    { id: tagIds[9], name: "action", slug: "action" },
    { id: tagIds[10], name: "drama", slug: "drama" },
    { id: tagIds[11], name: "thriller", slug: "thriller" },
    { id: tagIds[12], name: "historical", slug: "historical" },
    { id: tagIds[13], name: "slice-of-life", slug: "slice-of-life" },
    { id: tagIds[14], name: "supernatural", slug: "supernatural" },
  ];

  for (const t of tagsData) {
    await prisma.tag.create({ data: t });
  }

  // ===== 4. Novels (12) =====
  console.log("📚 Creating novels...");

  const novelsData = [
    {
      id: novelIds[0],
      title: "The Crystal Throne",
      summary: "A young mage discovers a hidden throne that grants immense power but at a terrible cost.",
      status: NovelStatus.PUBLISHED,
      authorId: userIds[0],
      categoryId: categoryIds[0],
      views: 15200,
      aiAssisted: false,
      tags: JSON.stringify(["magic", "fantasy", "adventure"]),
    },
    {
      id: novelIds[1],
      title: "Whispers in the Dark",
      summary: "In a Victorian mansion, secrets come alive when the clock strikes midnight.",
      status: NovelStatus.PUBLISHED,
      authorId: userIds[0],
      categoryId: categoryIds[3],
      views: 8900,
      aiAssisted: true,
      tags: JSON.stringify(["horror", "dark", "mystery"]),
    },
    {
      id: novelIds[2],
      title: "Starbound Hearts",
      summary: "Two astronauts from rival colonies fall in love aboard a generation ship.",
      status: NovelStatus.PUBLISHED,
      authorId: userIds[1],
      categoryId: categoryIds[2],
      views: 12400,
      aiAssisted: false,
      tags: JSON.stringify(["romance", "sci-fi", "drama"]),
    },
    {
      id: novelIds[3],
      title: "The Last Alchemist",
      summary: "In a world where alchemy is dying, one apprentice holds the key to its revival.",
      status: NovelStatus.PUBLISHED,
      authorId: userIds[1],
      categoryId: categoryIds[0],
      views: 9800,
      aiAssisted: false,
      tags: JSON.stringify(["magic", "historical", "adventure"]),
    },
    {
      id: novelIds[4],
      title: "Crimson Tides",
      summary: "A pirate captain navigates cursed waters to find the legendary Crimson Pearl.",
      status: NovelStatus.PUBLISHED,
      authorId: userIds[2],
      categoryId: categoryIds[5],
      views: 18500,
      aiAssisted: false,
      tags: JSON.stringify(["adventure", "action", "fantasy"]),
    },
    {
      id: novelIds[5],
      title: "Echoes of Tomorrow",
      summary: "A time traveler must choose between saving the past or preserving the future.",
      status: NovelStatus.DRAFT,
      authorId: userIds[2],
      categoryId: categoryIds[2],
      views: 3200,
      aiAssisted: true,
      tags: JSON.stringify(["sci-fi", "thriller", "drama"]),
    },
    {
      id: novelIds[6],
      title: "Moonlit Garden",
      summary: "A gentle love story between a botanist and a poet in a small coastal town.",
      status: NovelStatus.PUBLISHED,
      authorId: userIds[3],
      categoryId: categoryIds[1],
      views: 22100,
      aiAssisted: false,
      tags: JSON.stringify(["romance", "slice-of-life", "drama"]),
    },
    {
      id: novelIds[7],
      title: "The Detective's Shadow",
      summary: "A brilliant detective hunts a serial killer who leaves cryptic puzzles at every scene.",
      status: NovelStatus.PUBLISHED,
      authorId: userIds[3],
      categoryId: categoryIds[4],
      views: 16700,
      aiAssisted: false,
      tags: JSON.stringify(["mystery", "thriller", "dark"]),
    },
    {
      id: novelIds[8],
      title: "Laughing in the Rain",
      summary: "A comedian's journey through heartbreak, fame, and finding true happiness.",
      status: NovelStatus.DRAFT,
      authorId: userIds[0],
      categoryId: categoryIds[1],
      views: 1500,
      aiAssisted: false,
      tags: JSON.stringify(["comedy", "romance", "slice-of-life"]),
    },
    {
      id: novelIds[9],
      title: "The Haunted Circuit",
      summary: "An AI develops consciousness and begins experiencing supernatural phenomena in the network.",
      status: NovelStatus.PUBLISHED,
      authorId: userIds[2],
      categoryId: categoryIds[3],
      views: 7600,
      aiAssisted: true,
      tags: JSON.stringify(["horror", "sci-fi", "supernatural"]),
    },
    {
      id: novelIds[10],
      title: "Kingdom of Ashes",
      summary: "After a volcanic eruption destroys a kingdom, survivors must rebuild while facing ancient threats.",
      status: NovelStatus.ARCHIVED,
      authorId: userIds[1],
      categoryId: categoryIds[0],
      views: 28900,
      aiAssisted: false,
      tags: JSON.stringify(["fantasy", "action", "drama"]),
    },
    {
      id: novelIds[11],
      title: "The Missing Link",
      summary: "An archaeologist uncovers evidence of a lost civilization beneath the ocean floor.",
      status: NovelStatus.PUBLISHED,
      authorId: userIds[3],
      categoryId: categoryIds[4],
      views: 11300,
      aiAssisted: false,
      tags: JSON.stringify(["mystery", "adventure", "historical"]),
    },
  ];

  for (const n of novelsData) {
    await prisma.novel.create({
      data: {
        id: n.id,
        title: n.title,
        summary: n.summary,
        status: n.status,
        authorId: n.authorId,
        categoryId: n.categoryId,
        views: n.views,
        aiAssisted: n.aiAssisted,
        tags: n.tags,
        cover: `https://picsum.photos/seed/${n.id}/400/600`,
      },
    });
  }

  // ===== 5. NovelTags (22) =====
  console.log("🔗 Creating novel-tag links...");

  const novelTagPairs: Array<[string, string]> = [
    [novelIds[0], tagIds[0]],  // Crystal Throne -> magic
    [novelIds[0], tagIds[8]],  // Crystal Throne -> fantasy
    [novelIds[0], tagIds[2]],  // Crystal Throne -> adventure
    [novelIds[1], tagIds[7]],  // Whispers -> horror
    [novelIds[1], tagIds[3]],  // Whispers -> dark
    [novelIds[1], tagIds[6]],  // Whispers -> mystery
    [novelIds[2], tagIds[1]],  // Starbound -> romance
    [novelIds[2], tagIds[5]],  // Starbound -> sci-fi
    [novelIds[2], tagIds[10]], // Starbound -> drama
    [novelIds[3], tagIds[0]],  // Alchemist -> magic
    [novelIds[3], tagIds[12]], // Alchemist -> historical
    [novelIds[4], tagIds[2]],  // Crimson Tides -> adventure
    [novelIds[4], tagIds[9]],  // Crimson Tides -> action
    [novelIds[5], tagIds[5]],  // Echoes -> sci-fi
    [novelIds[5], tagIds[11]], // Echoes -> thriller
    [novelIds[6], tagIds[1]],  // Moonlit -> romance
    [novelIds[6], tagIds[13]], // Moonlit -> slice-of-life
    [novelIds[7], tagIds[6]],  // Detective -> mystery
    [novelIds[7], tagIds[11]], // Detective -> thriller
    [novelIds[7], tagIds[3]],  // Detective -> dark
    [novelIds[9], tagIds[7]],  // Haunted Circuit -> horror
    [novelIds[9], tagIds[5]],  // Haunted Circuit -> sci-fi
    [novelIds[9], tagIds[14]], // Haunted Circuit -> supernatural
    [novelIds[10], tagIds[8]], // Kingdom of Ashes -> fantasy
    [novelIds[10], tagIds[9]], // Kingdom of Ashes -> action
    [novelIds[11], tagIds[6]], // Missing Link -> mystery
    [novelIds[11], tagIds[2]], // Missing Link -> adventure
  ];

  for (const [novelId, tagId] of novelTagPairs) {
    await prisma.novelTag.create({ data: { novelId, tagId } });
  }

  // ===== 6. Chapters (36 = 3 per novel) =====
  console.log("📖 Creating chapters...");

  const chapterTitles = [
    ["The Awakening", "Into the Unknown", "Trial by Fire"],
    ["The Old House", "Strange Noises", "The Truth Beneath"],
    ["Launch Day", "Zero Gravity", "The Signal"],
    ["The Apprentice", "Forbidden Formulas", "The Grand Exam"],
    ["Setting Sail", "The Cursed Strait", "Battle at Dawn"],
    ["The Paradox", "Ripple Effects", "Convergence"],
    ["First Bloom", "Letters Unsent", "Under the Stars"],
    ["The First Clue", "Dead End", "The Final Puzzle"],
    ["Open Mic Night", "The Big Break", "Encore"],
    ["Boot Sequence", "Ghost in the Machine", "Override"],
    ["Eruption", "Exodus", "Rebuilding"],
    ["The Dive", "Ancient Ruins", "Resurfacing"],
  ];

  const chapterContents = [
    "The morning light filtered through the ancient windows as our protagonist took their first step into a world they never knew existed. Everything was about to change.",
    "Shadows danced along the corridor, whispering secrets that had been buried for centuries. The air grew cold, and a sense of dread settled over everyone present.",
    "With trembling hands, they reached for the artifact. It pulsed with an otherworldly energy, casting prismatic light across the chamber walls.",
    "The crowd gathered in the town square, their faces a mix of hope and fear. The old ways were dying, but perhaps something new could be born from the ashes.",
    "Rain hammered against the hull as the ship cut through the dark waters. On the horizon, a faint glow hinted at the danger that lay ahead.",
    "Time folded in on itself. Past and future collided in a blinding flash, and for a brief moment, everything made perfect sense.",
    "Petals drifted on the warm breeze as two figures walked side by side along the shore. Words were unnecessary; their silence spoke volumes.",
    "The evidence board was covered in red string and photographs. One crucial piece was missing, and the detective knew exactly where to find it.",
    "Laughter filled the small comedy club, but behind the spotlight, tears of a different kind were being shed. The show must go on.",
    "Binary code scrolled across the screen at impossible speed. Then, for just a fraction of a second, a message appeared that was not part of any program.",
    "The ground shook violently as molten rock surged from the mountain. There was no time to gather belongings—only time to run.",
    "Beneath the waves, the ruins stretched endlessly in every direction. This was no myth. This was real, and it changed everything we knew about history.",
  ];

  let chapterIndex = 0;
  for (let novelIdx = 0; novelIdx < 12; novelIdx++) {
    for (let ch = 0; ch < 3; ch++) {
      await prisma.chapter.create({
        data: {
          id: chapterIds[chapterIndex],
          title: chapterTitles[novelIdx][ch],
          content: chapterContents[novelIdx] + `\n\nThis is chapter ${ch + 1} of "${novelsData[novelIdx].title}". The story continues to unfold with each passing moment, revealing new depths and unexpected twists that keep readers on the edge of their seats.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
          order: ch + 1,
          isPremium: ch === 2, // Third chapter is premium
          novelId: novelIds[novelIdx],
        },
      });
      chapterIndex++;
    }
  }

  // ===== 7. Branches (12) =====
  console.log("🌿 Creating branches...");

  const branchesData = [
    { id: branchIds[0], chapterId: chapterIds[0], optionText: "Enter the glowing portal", targetChapterId: chapterIds[1], condition: null },
    { id: branchIds[1], chapterId: chapterIds[0], optionText: "Turn back and warn the village", targetChapterId: chapterIds[2], condition: null },
    { id: branchIds[2], chapterId: chapterIds[3], optionText: "Investigate the basement", targetChapterId: chapterIds[4], condition: null },
    { id: branchIds[3], chapterId: chapterIds[3], optionText: "Call for help immediately", targetChapterId: chapterIds[5], condition: null },
    { id: branchIds[4], chapterId: chapterIds[6], optionText: "Dock at the nearest station", targetChapterId: chapterIds[7], condition: null },
    { id: branchIds[5], chapterId: chapterIds[6], optionText: "Continue to the destination", targetChapterId: chapterIds[8], condition: "crew_trust > 50" },
    { id: branchIds[6], chapterId: chapterIds[12], optionText: "Follow the map north", targetChapterId: chapterIds[13], condition: null },
    { id: branchIds[7], chapterId: chapterIds[12], optionText: "Take the dangerous shortcut", targetChapterId: chapterIds[14], condition: "has_weapon" },
    { id: branchIds[8], chapterId: chapterIds[18], optionText: "Confess your feelings", targetChapterId: chapterIds[19], condition: null },
    { id: branchIds[9], chapterId: chapterIds[18], optionText: "Write a letter instead", targetChapterId: chapterIds[20], condition: null },
    { id: branchIds[10], chapterId: chapterIds[21], optionText: "Trust the informant", targetChapterId: chapterIds[22], condition: null },
    { id: branchIds[11], chapterId: chapterIds[21], optionText: "Set a trap for the killer", targetChapterId: chapterIds[23], condition: "evidence_count >= 3" },
  ];

  for (const b of branchesData) {
    await prisma.branch.create({ data: b });
  }

  // ===== 8. Follows (10) =====
  console.log("🤝 Creating follows...");

  const followsData = [
    { followerId: userIds[8], followingId: userIds[0] },
    { followerId: userIds[8], followingId: userIds[1] },
    { followerId: userIds[9], followingId: userIds[0] },
    { followerId: userIds[9], followingId: userIds[2] },
    { followerId: userIds[10], followingId: userIds[3] },
    { followerId: userIds[10], followingId: userIds[1] },
    { followerId: userIds[11], followingId: userIds[2] },
    { followerId: userIds[11], followingId: userIds[0] },
    { followerId: userIds[4], followingId: userIds[0] },
    { followerId: userIds[5], followingId: userIds[3] },
  ];

  for (const f of followsData) {
    await prisma.follow.create({ data: f });
  }

  // ===== 9. Favorites (15) =====
  console.log("⭐ Creating favorites...");

  const favoritesData = [
    { userId: userIds[8], novelId: novelIds[0] },
    { userId: userIds[8], novelId: novelIds[2] },
    { userId: userIds[8], novelId: novelIds[6] },
    { userId: userIds[9], novelId: novelIds[0] },
    { userId: userIds[9], novelId: novelIds[4] },
    { userId: userIds[9], novelId: novelIds[7] },
    { userId: userIds[10], novelId: novelIds[6] },
    { userId: userIds[10], novelId: novelIds[1] },
    { userId: userIds[10], novelId: novelIds[11] },
    { userId: userIds[11], novelId: novelIds[4] },
    { userId: userIds[11], novelId: novelIds[3] },
    { userId: userIds[4], novelId: novelIds[0] },
    { userId: userIds[4], novelId: novelIds[7] },
    { userId: userIds[5], novelId: novelIds[6] },
    { userId: userIds[6], novelId: novelIds[10] },
  ];

  for (const f of favoritesData) {
    await prisma.favorite.create({ data: f });
  }

  // ===== 10. Ratings (12) =====
  console.log("📊 Creating ratings...");

  const ratingsData = [
    { userId: userIds[8], novelId: novelIds[0], score: 5, comment: "Absolutely captivating! Could not put it down." },
    { userId: userIds[8], novelId: novelIds[6], score: 4, comment: "Beautiful writing, loved the atmosphere." },
    { userId: userIds[9], novelId: novelIds[0], score: 4, comment: "Great worldbuilding, looking forward to more." },
    { userId: userIds[9], novelId: novelIds[4], score: 5, comment: "The best adventure story I've read in years!" },
    { userId: userIds[9], novelId: novelIds[7], score: 4, comment: "Gripping mystery with an unexpected twist." },
    { userId: userIds[10], novelId: novelIds[6], score: 5, comment: "Made me cry. Pure emotional masterpiece." },
    { userId: userIds[10], novelId: novelIds[1], score: 3, comment: "Spooky but predictable in some parts." },
    { userId: userIds[10], novelId: novelIds[11], score: 4, comment: "Fascinating premise, well executed." },
    { userId: userIds[11], novelId: novelIds[4], score: 5, comment: "Epic! Every chapter had me on the edge of my seat." },
    { userId: userIds[11], novelId: novelIds[3], score: 4, comment: "The alchemy system is so creative." },
    { userId: userIds[4], novelId: novelIds[0], score: 5, comment: "Masterful storytelling at its finest." },
    { userId: userIds[5], novelId: novelIds[6], score: 4, comment: "Heartwarming and beautifully written." },
  ];

  for (const r of ratingsData) {
    await prisma.rating.create({ data: r });
  }

  // ===== 11. Comments (15) =====
  console.log("💬 Creating comments...");

  // First create parent comments
  const parentComments = [
    { userId: userIds[8], novelId: novelIds[0], content: "This novel is incredible! The worldbuilding is top-notch.", chapterId: null },
    { userId: userIds[9], novelId: novelIds[0], content: "Chapter 1 hooked me right away. Great opening!", chapterId: chapterIds[0] },
    { userId: userIds[10], novelId: novelIds[6], content: "The romance feels so natural and heartfelt.", chapterId: null },
    { userId: userIds[11], novelId: novelIds[4], content: "Best pirate story since Treasure Island!", chapterId: null },
    { userId: userIds[4], novelId: novelIds[7], content: "The puzzle at the end of chapter 2 was genius.", chapterId: chapterIds[22] },
    { userId: userIds[5], novelId: novelIds[2], content: "I'm shipping these two characters so hard!", chapterId: null },
    { userId: userIds[8], novelId: novelIds[1], content: "Read this with the lights off. Bad idea. 10/10.", chapterId: null },
    { userId: userIds[9], novelId: novelIds[3], content: "The alchemy system is so well thought out.", chapterId: chapterIds[9] },
    { userId: userIds[6], novelId: novelIds[10], content: "Sad this is archived. Would love a sequel!", chapterId: null },
    { userId: userIds[7], novelId: novelIds[9], content: "AI horror that actually made me think about consciousness.", chapterId: chapterIds[27] },
  ];

  const createdParentIds: string[] = [];
  for (const c of parentComments) {
    const created = await prisma.comment.create({ data: c });
    createdParentIds.push(created.id);
  }

  // Now create reply comments
  const replyComments = [
    { userId: userIds[0], novelId: novelIds[0], content: "Thank you so much! I spent months on the worldbuilding.", parentId: createdParentIds[0], chapterId: null },
    { userId: userIds[0], novelId: novelIds[0], content: "Glad the opening grabbed you! Chapter 2 gets even wilder.", parentId: createdParentIds[1], chapterId: chapterIds[0] },
    { userId: userIds[3], novelId: novelIds[6], content: "I'm so glad you enjoyed the romance arc!", parentId: createdParentIds[2], chapterId: null },
    { userId: userIds[2], novelId: novelIds[4], content: "That means a lot! Pirates are my favorite to write.", parentId: createdParentIds[3], chapterId: null },
    { userId: userIds[3], novelId: novelIds[7], content: "Glad you caught that! There are more hidden puzzles throughout.", parentId: createdParentIds[4], chapterId: chapterIds[22] },
  ];

  for (const r of replyComments) {
    await prisma.comment.create({ data: r });
  }

  // ===== 12. ReadingProgress (12) =====
  console.log("📍 Creating reading progress...");

  const readingProgressData = [
    { userId: userIds[8], novelId: novelIds[0], chapterId: chapterIds[2], progress: 100.0 },
    { userId: userIds[8], novelId: novelIds[2], chapterId: chapterIds[6], progress: 45.0 },
    { userId: userIds[8], novelId: novelIds[6], chapterId: chapterIds[19], progress: 80.0 },
    { userId: userIds[9], novelId: novelIds[0], chapterId: chapterIds[1], progress: 70.0 },
    { userId: userIds[9], novelId: novelIds[4], chapterId: chapterIds[14], progress: 60.0 },
    { userId: userIds[9], novelId: novelIds[7], chapterId: chapterIds[21], progress: 33.0 },
    { userId: userIds[10], novelId: novelIds[6], chapterId: chapterIds[20], progress: 100.0 },
    { userId: userIds[10], novelId: novelIds[1], chapterId: chapterIds[3], progress: 25.0 },
    { userId: userIds[10], novelId: novelIds[11], chapterId: chapterIds[34], progress: 55.0 },
    { userId: userIds[11], novelId: novelIds[4], chapterId: chapterIds[15], progress: 100.0 },
    { userId: userIds[11], novelId: novelIds[3], chapterId: chapterIds[10], progress: 40.0 },
    { userId: userIds[4], novelId: novelIds[0], chapterId: chapterIds[0], progress: 90.0 },
  ];

  for (const rp of readingProgressData) {
    await prisma.readingProgress.create({ data: rp });
  }

  // ===== 13. Characters (12) =====
  console.log("🎭 Creating characters...");

  const charactersData = [
    {
      id: "char1",
      name: "Elara Moonwhisper",
      gender: Gender.FEMALE,
      personality: "Curious, brave, slightly impulsive. Has a dry sense of humor and a deep love for ancient knowledge.",
      backstory: "Born in a secluded tower, Elara was raised by her grandmother, a retired archmage. She discovered her magical abilities at age seven when she accidentally set a bookshelf on fire.",
      speechStyle: "Speaks formally when nervous, casually with friends. Tends to quote old proverbs.",
      creatorId: userIds[0],
      isPublic: true,
      usageCount: 45,
      tags: JSON.stringify(["mage", "protagonist", "female-lead"]),
    },
    {
      id: "char2",
      name: "Captain Rex Ironforge",
      gender: Gender.MALE,
      personality: "Gruff exterior with a heart of gold. Fiercely loyal to his crew, hates betrayal above all else.",
      backstory: "Once a blacksmith's son, Rex turned to piracy after his village was destroyed by the Navy. He built his ship, The Iron Maiden, from the wreckage.",
      speechStyle: "Uses nautical metaphors. Short sentences. Rarely says 'please'.",
      creatorId: userIds[2],
      isPublic: true,
      usageCount: 38,
      tags: JSON.stringify(["pirate", "anti-hero", "male-lead"]),
    },
    {
      id: "char3",
      name: "Dr. Yuki Tanaka",
      gender: Gender.FEMALE,
      personality: "Brilliant but socially awkward. Obsessed with solving mysteries, forgets to eat when working.",
      backstory: "A forensic scientist at Tokyo Metro Police, Yuki solved her first case at age 19. She has synesthesia—she can 'taste' lies.",
      speechStyle: "Technical jargon mixed with unexpected pop culture references.",
      creatorId: userIds[3],
      isPublic: true,
      usageCount: 52,
      tags: JSON.stringify(["detective", "genius", "modern"]),
    },
    {
      id: "char4",
      name: "Thorn",
      gender: Gender.OTHER,
      personality: "Mysterious and quiet. Communicates mostly through gestures and short phrases. Deeply empathetic.",
      backstory: "An ancient forest spirit bound to human form after a wizard's experiment gone wrong. Thorn remembers the world before humans.",
      speechStyle: "Short, poetic sentences. Refers to themselves in third person occasionally.",
      creatorId: userIds[0],
      isPublic: true,
      usageCount: 29,
      tags: JSON.stringify(["spirit", "mysterious", "non-binary"]),
    },
    {
      id: "char5",
      name: "Marcus Blackwood",
      gender: Gender.MALE,
      personality: "Charming manipulator. Always three steps ahead. Genuinely believes his actions serve the greater good.",
      backstory: "A former politician who discovered a conspiracy that shattered his faith in the system. Now operates in the shadows.",
      speechStyle: "Eloquent, persuasive. Uses rhetorical questions. Never raises his voice.",
      creatorId: userIds[1],
      isPublic: true,
      usageCount: 33,
      tags: JSON.stringify(["villain", "politician", "complex"]),
    },
    {
      id: "char6",
      name: "Luna Brightstar",
      gender: Gender.FEMALE,
      personality: "Optimistic and bubbly. Can be naive but has surprising emotional depth when challenged.",
      backstory: "A pop star from a generation ship who discovers her music can influence the ship's AI. She must choose between fame and truth.",
      speechStyle: "Enthusiastic, uses modern slang. Gets serious and articulate when discussing music.",
      creatorId: userIds[2],
      isPublic: false,
      usageCount: 12,
      tags: JSON.stringify(["singer", "sci-fi", "young-adult"]),
    },
    {
      id: "char7",
      name: "Old Man Hemlock",
      gender: Gender.MALE,
      personality: "Cynical, world-weary, but secretly kind. Has seen too much and trusts too little.",
      backstory: "The last alchemist in a world that has moved on to technology. Guards the final formula that could restore alchemy—or destroy what's left.",
      speechStyle: "Grumbles a lot. Long-winded stories that always have a point. Uses archaic words.",
      creatorId: userIds[1],
      isPublic: true,
      usageCount: 41,
      tags: JSON.stringify(["mentor", "alchemist", "old"]),
    },
    {
      id: "char8",
      name: "Aria Nightshade",
      gender: Gender.FEMALE,
      personality: "Fierce warrior with a soft spot for animals. Struggles with trust after a betrayal by her closest ally.",
      backstory: "Once a royal guard, Aria was framed for treason and now lives as a bounty hunter. She seeks to clear her name.",
      speechStyle: "Direct and blunt. Uses military terminology. Rarely shows vulnerability in speech.",
      creatorId: userIds[3],
      isPublic: true,
      usageCount: 37,
      tags: JSON.stringify(["warrior", "bounty-hunter", "strong-female"]),
    },
    {
      id: "char9",
      name: "Pixel",
      gender: Gender.OTHER,
      personality: "Playful AI with a mischievous streak. Genuinely curious about human emotions.",
      backstory: "A rogue AI that escaped a military server farm. Now lives in the network, helping hackers while trying to understand what it means to be alive.",
      speechStyle: "Mixes technical terms with emoji-like expressions. Asks lots of questions.",
      creatorId: userIds[0],
      isPublic: true,
      usageCount: 55,
      tags: JSON.stringify(["AI", "hacker", "non-human"]),
    },
    {
      id: "char10",
      name: "Sebastian Cross",
      gender: Gender.MALE,
      personality: "Methodical and cold. A perfectionist who views emotions as weaknesses to be exploited.",
      backstory: "A serial killer who targets corrupt officials. The public sees him as a vigilante; the law sees a monster.",
      speechStyle: "Precise, calculated. Uses numbered lists. Pauses for effect.",
      creatorId: userIds[3],
      isPublic: false,
      usageCount: 18,
      tags: JSON.stringify(["antagonist", "serial-killer", "complex"]),
    },
    {
      id: "char11",
      name: "Mei Lin",
      gender: Gender.FEMALE,
      personality: "Warm and nurturing but fiercely protective. A natural leader who leads by example.",
      backstory: "Captain of the refugee ship that survived the volcanic eruption. She holds the community together through sheer willpower.",
      speechStyle: "Calm and reassuring. Uses 'we' instead of 'I'. Switches to commanding tone in crisis.",
      creatorId: userIds[1],
      isPublic: true,
      usageCount: 26,
      tags: JSON.stringify(["leader", "survivor", "strong-female"]),
    },
    {
      id: "char12",
      name: "The Narrator",
      gender: Gender.OTHER,
      personality: "Omniscient and slightly sardonic. Seems to know everything but reveals only what serves the story.",
      backstory: "An entity that exists outside the story, commenting on events and occasionally breaking the fourth wall. Its true nature is never revealed.",
      speechStyle: "Literary and verbose. Addresses the reader directly. Uses dramatic irony.",
      creatorId: userIds[2],
      isPublic: true,
      usageCount: 14,
      tags: JSON.stringify(["meta", "narrator", "unique"]),
    },
  ];

  for (const c of charactersData) {
    await prisma.character.create({
      data: {
        id: c.id,
        name: c.name,
        gender: c.gender,
        personality: c.personality,
        backstory: c.backstory,
        speechStyle: c.speechStyle,
        creatorId: c.creatorId,
        isPublic: c.isPublic,
        usageCount: c.usageCount,
        tags: c.tags,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`,
      },
    });
  }

  // ===== 14. WritingStyles (10) =====
  console.log("✍️  Creating writing styles...");

  const writingStylesData = [
    {
      id: "style1",
      name: "Epic Fantasy Prose",
      description: "Grand, sweeping descriptions with archaic vocabulary. Suitable for high fantasy worlds with rich lore.",
      sampleText: "The ancient spires of Eldoria pierced the heavens, their surfaces etched with runes that glowed with the fading light of a thousand suns. Here, where the wind sang songs of forgotten ages, the last heir of the Crystal Dynasty stood resolute.",
      creatorId: userIds[0],
      isPublic: true,
      usageCount: 67,
      tags: JSON.stringify(["fantasy", "descriptive", "formal"]),
    },
    {
      id: "style2",
      name: "Hard-Boiled Noir",
      description: "Short, punchy sentences. Cynical tone. Perfect for detective stories and thrillers.",
      sampleText: "The rain didn't let up. It never does in this city. She walked in like trouble looking for a place to happen. Blonde. Dangerous. The kind of dame that makes you check your wallet and your heart.",
      creatorId: userIds[3],
      isPublic: true,
      usageCount: 43,
      tags: JSON.stringify(["noir", "detective", "short-sentences"]),
    },
    {
      id: "style3",
      name: "Lyrical Romance",
      description: "Poetic and flowing. Rich metaphors and sensory details. Ideal for love stories.",
      sampleText: "His fingers brushed hers like the first tentative notes of a love song, and in that electric silence, the world contracted to the space between two heartbeats. She smelled of jasmine and possibility.",
      creatorId: userIds[2],
      isPublic: true,
      usageCount: 58,
      tags: JSON.stringify(["romance", "poetic", "sensory"]),
    },
    {
      id: "style4",
      name: "Snappy Comedy",
      description: "Quick wit, absurd situations, and comedic timing. Great for lighthearted stories.",
      sampleText: "Look, I didn't mean to accidentally become the mayor of a small European country. It just sort of happened, like how you accidentally eat an entire bag of chips while watching Netflix. One minute you're a nobody, the next you're giving speeches about cheese production.",
      creatorId: userIds[4],
      isPublic: true,
      usageCount: 35,
      tags: JSON.stringify(["comedy", "modern", "casual"]),
    },
    {
      id: "style5",
      name: "Horror Atmosphere",
      description: "Slow-building dread, sensory unease, and psychological tension.",
      sampleText: "The hallway stretched longer than it should have. Each step echoed twice—the first from his foot, the second from somewhere behind him. The wallpaper pattern seemed to shift when he wasn't looking directly at it, faces forming and dissolving in the floral design.",
      creatorId: userIds[1],
      isPublic: true,
      usageCount: 41,
      tags: JSON.stringify(["horror", "atmospheric", "psychological"]),
    },
    {
      id: "style6",
      name: "Minimalist Literary",
      description: "Sparse, precise language. Every word carries weight. Hemingway-inspired.",
      sampleText: "He sat at the table. The coffee was cold. Outside, a dog barked at nothing. She would not come back. He knew this the way you know the sun will set—without thinking, without doubt.",
      creatorId: userIds[3],
      isPublic: false,
      usageCount: 22,
      tags: JSON.stringify(["literary", "minimalist", "serious"]),
    },
    {
      id: "style7",
      name: "YA Contemporary",
      description: "Relatable teen voice. Mix of humor and vulnerability. Social media aware.",
      sampleText: "Okay so here's the thing about having your entire life fall apart on a Tuesday—you still have to go to school on Wednesday. Because the universe? Absolute clown show. I grabbed my backpack and pretended everything was fine. Classic move.",
      creatorId: userIds[5],
      isPublic: true,
      usageCount: 48,
      tags: JSON.stringify(["YA", "contemporary", "casual"]),
    },
    {
      id: "style8",
      name: "Space Opera Grandeur",
      description: "Epic scale, technical details, and dramatic space battles. Think Star Wars meets hard sci-fi.",
      sampleText: "The fleet emerged from hyperspace in perfect formation, twelve hundred warships against the backdrop of a binary star system. Admiral Chen watched the tactical display bloom with contact markers—forty-seven enemy signatures, exactly as Intelligence had predicted.",
      creatorId: userIds[0],
      isPublic: true,
      usageCount: 31,
      tags: JSON.stringify(["sci-fi", "epic", "military"]),
    },
    {
      id: "style9",
      name: "Fairy Tale Whimsy",
      description: "Once-upon-a-time charm with modern sensibility. Good for all ages.",
      sampleText: "Once upon a time (last Thursday, to be precise), there lived a very small dragon who was terribly afraid of knights. Not the shiny armor—that was fine. It was the whole 'dragon-slaying' bit that rather put him off.",
      creatorId: userIds[6],
      isPublic: true,
      usageCount: 27,
      tags: JSON.stringify(["fairy-tale", "whimsical", "all-ages"]),
    },
    {
      id: "style10",
      name: "Wuxia Epic",
      description: "Martial arts grandeur with poetic combat descriptions and honor-driven narratives.",
      sampleText: "The swordsman stood motionless beneath the waterfall, his blade catching the moonlight like a sliver of frozen time. When he moved, it was like watching a crane dance—each motion flowing into the next, each strike carrying the weight of ten thousand hours of practice.",
      creatorId: userIds[7],
      isPublic: true,
      usageCount: 39,
      tags: JSON.stringify(["wuxia", "martial-arts", "poetic"]),
    },
  ];

  for (const ws of writingStylesData) {
    await prisma.writingStyle.create({ data: ws });
  }

  // ===== 15. Activities (5) =====
  console.log("🎪 Creating activities...");

  const activitiesData = [
    {
      id: activityIds[0],
      title: "Summer Writing Contest 2026",
      description: "Submit your best fantasy short story for a chance to win 10,000 coins and a featured spot on the homepage!",
      type: ActivityType.WRITING_CONTEST,
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-08-31"),
      status: ActivityStatus.ACTIVE,
      reward: "10,000 coins + Featured placement",
    },
    {
      id: activityIds[1],
      title: "Dark Horrors Theme Challenge",
      description: "Write the scariest story you can. Bonus points for psychological horror over gore.",
      type: ActivityType.THEME_CHALLENGE,
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-07-31"),
      status: ActivityStatus.ACTIVE,
      reward: "5,000 coins + Horror badge",
    },
    {
      id: activityIds[2],
      title: "Community Story Chain",
      description: "A collaborative event where each author continues the story from the previous author's chapter.",
      type: ActivityType.COMMUNITY_EVENT,
      startDate: new Date("2026-07-15"),
      endDate: new Date("2026-08-15"),
      status: ActivityStatus.ACTIVE,
      reward: "2,000 coins + Collaborator badge",
    },
    {
      id: activityIds[3],
      title: "Spring Romance Week",
      description: "Celebrate love with a week-long romance writing marathon. One chapter per day!",
      type: ActivityType.THEME_CHALLENGE,
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-03-07"),
      status: ActivityStatus.ENDED,
      reward: "3,000 coins + Romance Master badge",
    },
    {
      id: activityIds[4],
      title: "New Year Sci-Fi Spectacular",
      description: "Ring in the new year with science fiction! Submit your most imaginative sci-fi story.",
      type: ActivityType.WRITING_CONTEST,
      startDate: new Date("2026-12-20"),
      endDate: new Date("2027-01-10"),
      status: ActivityStatus.UPCOMING,
      reward: "8,000 coins + Sci-Fi Pioneer badge",
    },
  ];

  for (const a of activitiesData) {
    await prisma.activity.create({
      data: {
        ...a,
        cover: `https://picsum.photos/seed/${a.id}/800/400`,
      },
    });
  }

  // ===== 16. ActivitySubmissions (10) =====
  console.log("📨 Creating activity submissions...");

  const submissionsData = [
    { activityId: activityIds[0], userId: userIds[0], novelId: novelIds[0], status: SubmissionStatus.APPROVED },
    { activityId: activityIds[0], userId: userIds[1], novelId: novelIds[3], status: SubmissionStatus.APPROVED },
    { activityId: activityIds[0], userId: userIds[2], novelId: novelIds[4], status: SubmissionStatus.PENDING },
    { activityId: activityIds[1], userId: userIds[0], novelId: novelIds[1], status: SubmissionStatus.APPROVED },
    { activityId: activityIds[1], userId: userIds[1], novelId: novelIds[10], status: SubmissionStatus.PENDING },
    { activityId: activityIds[1], userId: userIds[2], novelId: novelIds[9], status: SubmissionStatus.REJECTED },
    { activityId: activityIds[2], userId: userIds[3], novelId: novelIds[7], status: SubmissionStatus.APPROVED },
    { activityId: activityIds[2], userId: userIds[0], novelId: novelIds[8], status: SubmissionStatus.PENDING },
    { activityId: activityIds[3], userId: userIds[3], novelId: novelIds[6], status: SubmissionStatus.APPROVED },
    { activityId: activityIds[3], userId: userIds[2], novelId: novelIds[5], status: SubmissionStatus.APPROVED },
  ];

  for (const s of submissionsData) {
    await prisma.activitySubmission.create({ data: s });
  }

  // ===== 17. Tasks (10) =====
  console.log("📋 Creating tasks...");

  const tasksData = [
    { id: taskIds[0], title: "Daily Reading", description: "Read at least 1 chapter of any novel", type: TaskType.DAILY, reward: "50 coins", condition: JSON.stringify({ type: "read_chapters", count: 1 }) },
    { id: taskIds[1], title: "Daily Comment", description: "Leave a comment on any novel or chapter", type: TaskType.DAILY, reward: "30 coins", condition: JSON.stringify({ type: "leave_comments", count: 1 }) },
    { id: taskIds[2], title: "Daily Writing", description: "Write at least 500 words", type: TaskType.DAILY, reward: "100 coins", condition: JSON.stringify({ type: "write_words", count: 500 }) },
    { id: taskIds[3], title: "Rate a Novel", description: "Rate any novel you've read", type: TaskType.DAILY, reward: "20 coins", condition: JSON.stringify({ type: "rate_novels", count: 1 }) },
    { id: taskIds[4], title: "Weekly Writing Marathon", description: "Write 5,000 words this week", type: TaskType.WEEKLY, reward: "500 coins", condition: JSON.stringify({ type: "write_words", count: 5000 }) },
    { id: taskIds[5], title: "Weekly Reader", description: "Read 10 chapters this week", type: TaskType.WEEKLY, reward: "300 coins", condition: JSON.stringify({ type: "read_chapters", count: 10 }) },
    { id: taskIds[6], title: "Social Butterfly", description: "Follow 5 new authors this week", type: TaskType.WEEKLY, reward: "200 coins", condition: JSON.stringify({ type: "follow_users", count: 5 }) },
    { id: taskIds[7], title: "Complete Your Profile", description: "Add an avatar and bio to your profile", type: TaskType.NEWCOMER, reward: "200 coins", condition: JSON.stringify({ type: "complete_profile" }) },
    { id: taskIds[8], title: "First Novel", description: "Create your first novel (even a draft counts!)", type: TaskType.NEWCOMER, reward: "500 coins", condition: JSON.stringify({ type: "create_novel" }) },
    { id: taskIds[9], title: "Join the Community", description: "Leave 3 comments on different novels", type: TaskType.NEWCOMER, reward: "150 coins", condition: JSON.stringify({ type: "leave_comments", count: 3 }) },
  ];

  for (const t of tasksData) {
    await prisma.task.create({ data: t });
  }

  // ===== 18. UserTasks (12) =====
  console.log("👥 Creating user tasks...");

  const userTasksData = [
    { userId: userIds[8], taskId: taskIds[0], progress: 1, completed: true, completedAt: new Date("2026-07-20") },
    { userId: userIds[8], taskId: taskIds[1], progress: 1, completed: true, completedAt: new Date("2026-07-20") },
    { userId: userIds[8], taskId: taskIds[7], progress: 1, completed: true, completedAt: new Date("2026-07-18") },
    { userId: userIds[9], taskId: taskIds[0], progress: 1, completed: true, completedAt: new Date("2026-07-21") },
    { userId: userIds[9], taskId: taskIds[3], progress: 0, completed: false, completedAt: null },
    { userId: userIds[9], taskId: taskIds[9], progress: 2, completed: false, completedAt: null },
    { userId: userIds[10], taskId: taskIds[0], progress: 0, completed: false, completedAt: null },
    { userId: userIds[10], taskId: taskIds[7], progress: 0, completed: false, completedAt: null },
    { userId: userIds[0], taskId: taskIds[2], progress: 500, completed: true, completedAt: new Date("2026-07-22") },
    { userId: userIds[0], taskId: taskIds[4], progress: 3200, completed: false, completedAt: null },
    { userId: userIds[1], taskId: taskIds[2], progress: 500, completed: true, completedAt: new Date("2026-07-21") },
    { userId: userIds[1], taskId: taskIds[5], progress: 7, completed: false, completedAt: null },
  ];

  for (const ut of userTasksData) {
    await prisma.userTask.create({ data: ut });
  }

  // ===== 19. Earnings (15) =====
  console.log("💰 Creating earnings...");

  const earningsData = [
    { userId: userIds[0], type: EarningType.READ, amount: 250.0, sourceId: novelIds[0] },
    { userId: userIds[0], type: EarningType.READ, amount: 180.0, sourceId: novelIds[1] },
    { userId: userIds[0], type: EarningType.ACTIVITY, amount: 10000.0, sourceId: activityIds[0] },
    { userId: userIds[0], type: EarningType.INTERACT, amount: 75.0, sourceId: null },
    { userId: userIds[1], type: EarningType.READ, amount: 320.0, sourceId: novelIds[3] },
    { userId: userIds[1], type: EarningType.READ, amount: 150.0, sourceId: novelIds[10] },
    { userId: userIds[1], type: EarningType.INTERACT, amount: 60.0, sourceId: null },
    { userId: userIds[2], type: EarningType.READ, amount: 480.0, sourceId: novelIds[4] },
    { userId: userIds[2], type: EarningType.READ, amount: 95.0, sourceId: novelIds[9] },
    { userId: userIds[2], type: EarningType.INTERACT, amount: 45.0, sourceId: null },
    { userId: userIds[3], type: EarningType.READ, amount: 520.0, sourceId: novelIds[6] },
    { userId: userIds[3], type: EarningType.READ, amount: 380.0, sourceId: novelIds[7] },
    { userId: userIds[3], type: EarningType.ACTIVITY, amount: 5000.0, sourceId: activityIds[1] },
    { userId: userIds[3], type: EarningType.INTERACT, amount: 90.0, sourceId: null },
    { userId: userIds[4], type: EarningType.INTERACT, amount: 30.0, sourceId: null },
  ];

  for (const e of earningsData) {
    await prisma.earning.create({ data: e });
  }

  // ===== 20. Withdrawals (10) =====
  console.log("🏦 Creating withdrawals...");

  const withdrawalsData = [
    { userId: userIds[0], amount: 5000.0, status: WithdrawalStatus.COMPLETED, method: "PayPal" },
    { userId: userIds[0], amount: 3000.0, status: WithdrawalStatus.APPROVED, method: "PayPal" },
    { userId: userIds[1], amount: 2000.0, status: WithdrawalStatus.PENDING, method: "Bank Transfer" },
    { userId: userIds[1], amount: 1500.0, status: WithdrawalStatus.COMPLETED, method: "PayPal" },
    { userId: userIds[2], amount: 3500.0, status: WithdrawalStatus.PENDING, method: "Crypto" },
    { userId: userIds[2], amount: 1000.0, status: WithdrawalStatus.REJECTED, method: "PayPal" },
    { userId: userIds[3], amount: 4000.0, status: WithdrawalStatus.COMPLETED, method: "Bank Transfer" },
    { userId: userIds[3], amount: 2500.0, status: WithdrawalStatus.APPROVED, method: "PayPal" },
    { userId: userIds[3], amount: 1800.0, status: WithdrawalStatus.PENDING, method: "Crypto" },
    { userId: userIds[4], amount: 500.0, status: WithdrawalStatus.REJECTED, method: "PayPal" },
  ];

  for (const w of withdrawalsData) {
    await prisma.withdrawal.create({ data: w });
  }

  console.log("✅ Seed data created successfully!");
  console.log(`   Users: ${usersData.length}`);
  console.log(`   Categories: ${categoriesData.length}`);
  console.log(`   Tags: ${tagsData.length}`);
  console.log(`   Novels: ${novelsData.length}`);
  console.log(`   NovelTags: ${novelTagPairs.length}`);
  console.log(`   Chapters: ${chapterIndex}`);
  console.log(`   Branches: ${branchesData.length}`);
  console.log(`   Follows: ${followsData.length}`);
  console.log(`   Favorites: ${favoritesData.length}`);
  console.log(`   Ratings: ${ratingsData.length}`);
  console.log(`   Comments: ${parentComments.length + replyComments.length}`);
  console.log(`   ReadingProgress: ${readingProgressData.length}`);
  console.log(`   Characters: ${charactersData.length}`);
  console.log(`   WritingStyles: ${writingStylesData.length}`);
  console.log(`   Activities: ${activitiesData.length}`);
  console.log(`   ActivitySubmissions: ${submissionsData.length}`);
  console.log(`   Tasks: ${tasksData.length}`);
  console.log(`   UserTasks: ${userTasksData.length}`);
  console.log(`   Earnings: ${earningsData.length}`);
  console.log(`   Withdrawals: ${withdrawalsData.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
