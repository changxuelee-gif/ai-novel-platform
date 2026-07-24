import type {
  NovelCard,
  ActivityCardData,
  RankingItem,
  RecentRead,
  CheckinDay,
  ActivityBannerData,
  ActivityCardDataExtended,
  ActivityWorkItem,
  ActivityDetail,
  RankingListItem,
  AuthorProfile,
  AuthorWork,
  AuthorFeedItem,
  AuthorReview,
  RatingDistribution,
} from "@/types/novel";
import type {
  Comment,
  ReadingHistory,
  BookshelfItem,
  VoteOption,
  InteractiveChoice,
} from "@/types";

export const recentReads: RecentRead[] = [
  { id: "rr1", title: "血月之影", cover: "https://picsum.photos/seed/rr1/120/160" },
  { id: "rr2", title: "冥河海渊", cover: "https://picsum.photos/seed/rr2/120/160" },
  { id: "rr3", title: "与君长携手", cover: "https://picsum.photos/seed/rr3/120/160" },
  { id: "rr4", title: "24小时永恒狂奔", cover: "https://picsum.photos/seed/rr4/120/160" },
  { id: "rr5", title: "熊猫夜影", cover: "https://picsum.photos/seed/rr5/120/160" },
];

export const featuredNovels: NovelCard[] = [
  {
    id: "f1",
    title: "血月之影",
    author: "老陈LaoChen",
    cover: "https://picsum.photos/seed/f1/240/320",
    rating: 3.0,
    popularity: 52500,
    tags: ["狼人", "大女主", "悬疑"],
    status: "ongoing",
    genre: "mystery",
    language: "zh",
    description:
      "在月光般如银线的夜晚城市中，古老的预言在血月下悄然降临。对月长嚎的，是夜行者最深沉的恐惧与勇气的交织——而她，将揭开隐藏在黑暗中的真相。",
  },
  {
    id: "f2",
    title: "冥河海渊：深海的残缺乌托邦",
    author: "TTES",
    cover: "https://picsum.photos/seed/f2/240/320",
    rating: 4.3,
    popularity: 35600,
    tags: ["冒险", "科幻", "漂流"],
    status: "ongoing",
    genre: "scifi",
    language: "zh",
    description:
      "20岁的天才少女林微在深海中醒来，失去了所有记忆。她发现自己身处一个被称为'冥河海渊'的神秘海底城市，这里的人类与海洋生物共存，却隐藏着惊人的秘密。",
  },
  {
    id: "f3",
    title: "与君长携手",
    author: "陆生清寒",
    cover: "https://picsum.photos/seed/f3/240/320",
    rating: 4.9,
    popularity: 36500,
    tags: ["古言", "甜宠", "宫斗"],
    status: "completed",
    genre: "history",
    language: "zh",
    description:
      "她是相府庶女，被嫡姐陷害送入冷宫。却意外与当朝最神秘的王爷相遇，两人从互相试探到携手并肩，共同面对朝堂风云。",
  },
];

export const activities: ActivityCardData[] = [
  {
    id: "a1",
    title: "词条挑战 #21",
    subtitle: "用故事定义你的词条",
    startDate: "7/17",
    endDate: "7/21",
    themeColor: "bg-gray-800",
    cover: "https://picsum.photos/seed/a1/160/120",
  },
  {
    id: "a2",
    title: "IP挑战赛 #14",
    subtitle: "那个最懂你，最懂你的角色故事你的一天",
    startDate: "7/17",
    endDate: "7/28",
    themeColor: "bg-orange-500",
    cover: "https://picsum.photos/seed/a2/160/120",
  },
  {
    id: "a3",
    title: "领航员计划 #36",
    subtitle: "探索未知的故事线，故事才刚刚开始",
    startDate: "7/26",
    endDate: "7/28",
    themeColor: "bg-slate-700",
    cover: "https://picsum.photos/seed/a3/160/120",
  },
  {
    id: "a4",
    title: "互动小说有奖反馈",
    subtitle: "全新互动小说平台上线！点击进入beta版，送上精美奖励！",
    startDate: "",
    endDate: "",
    themeColor: "bg-gradient-to-br from-pink-500 to-purple-600",
    cover: "https://picsum.photos/seed/a4/160/120",
  },
];

export const languageTabs = [
  { key: "all", label: "全部" },
  { key: "en", label: "English" },
  { key: "ja", label: "日本語" },
  { key: "pt", label: "Português" },
  { key: "es", label: "Español" },
  { key: "zh", label: "中文" },
] as const;

export const genreTabs = [
  { key: "all", label: "全部" },
  { key: "werewolf", label: "狼人" },
  { key: "scifi", label: "科幻" },
  { key: "mystery", label: "悬疑" },
  { key: "history", label: "历史" },
  { key: "military", label: "军事" },
  { key: "system", label: "系统" },
  { key: "wuxia", label: "武侠" },
  { key: "campus", label: "校园" },
  { key: "fantasy", label: "奇幻" },
  { key: "modern", label: "现代" },
] as const;

export const novelCards: NovelCard[] = [
  { id: "n1", title: "24小时永恒狂奔：空荡都市少女", author: "林夕", cover: "https://picsum.photos/seed/n1/300/400", rating: 4.2, popularity: 12800, tags: ["现代", "都市"], status: "ongoing", genre: "modern", language: "zh" },
  { id: "n2", title: "熊猫夜影", author: "墨白", cover: "https://picsum.photos/seed/n2/300/400", rating: 3.8, popularity: 9500, tags: ["奇幻", "冒险"], status: "ongoing", genre: "fantasy", language: "zh" },
  { id: "n3", title: "血月之约：狼族守护者的誓言", author: "夜风", cover: "https://picsum.photos/seed/n3/300/400", rating: 4.5, popularity: 28300, tags: ["狼人", "言情"], status: "ongoing", genre: "werewolf", language: "zh" },
  { id: "n4", title: "冥河海渊：深海的残缺乌托邦", author: "TTES", cover: "https://picsum.photos/seed/n4/300/400", rating: 4.3, popularity: 35600, tags: ["科幻", "冒险"], status: "ongoing", genre: "scifi", language: "zh" },
  { id: "n5", title: "三国：双翼变猛，立不世之功", author: "历史控", cover: "https://picsum.photos/seed/n5/300/400", rating: 4.1, popularity: 15200, tags: ["历史", "军事"], status: "completed", genre: "history", language: "zh" },
  { id: "n6", title: "重逢时，他已是商界巨头", author: "星辰", cover: "https://picsum.photos/seed/n6/300/400", rating: 4.7, popularity: 42100, tags: ["现代", "言情"], status: "ongoing", genre: "modern", language: "zh" },
  { id: "n7", title: "燃烧的孤岛", author: "远方", cover: "https://picsum.photos/seed/n7/300/400", rating: 3.9, popularity: 7800, tags: ["悬疑", "推理"], status: "ongoing", genre: "mystery", language: "en" },
  { id: "n8", title: "暗影行者", author: "夜行者", cover: "https://picsum.photos/seed/n8/300/400", rating: 4.4, popularity: 19600, tags: ["武侠", "动作"], status: "ongoing", genre: "wuxia", language: "zh" },
  { id: "n9", title: "金色海滩", author: "阳光", cover: "https://picsum.photos/seed/n9/300/400", rating: 3.5, popularity: 6200, tags: ["校园", "青春"], status: "completed", genre: "campus", language: "ja" },
  { id: "n10", title: "退休失败的一百种方式", author: "老王", cover: "https://picsum.photos/seed/n10/300/400", rating: 4.6, popularity: 31400, tags: ["系统", "搞笑"], status: "ongoing", genre: "system", language: "zh" },
  { id: "n11", title: "情断英京", author: "英伦风", cover: "https://picsum.photos/seed/n11/300/400", rating: 4.0, popularity: 11300, tags: ["现代", "言情"], status: "completed", genre: "modern", language: "en" },
  { id: "n12", title: "校园时光里的暗恋", author: "甜蜜蜜", cover: "https://picsum.photos/seed/n12/300/400", rating: 3.7, popularity: 8900, tags: ["校园", "甜宠"], status: "ongoing", genre: "campus", language: "ko" },
  { id: "n13", title: "剑破苍穹", author: "剑客", cover: "https://picsum.photos/seed/n13/300/400", rating: 4.8, popularity: 56700, tags: ["武侠", "玄幻"], status: "ongoing", genre: "wuxia", language: "zh" },
  { id: "n14", title: "末日求生指南", author: "幸存者", cover: "https://picsum.photos/seed/n14/300/400", rating: 4.2, popularity: 22100, tags: ["科幻", "末日"], status: "ongoing", genre: "scifi", language: "pt" },
  { id: "n15", title: "银河帝国崛起", author: "星际", cover: "https://picsum.photos/seed/n15/300/400", rating: 4.5, popularity: 38900, tags: ["科幻", "史诗"], status: "ongoing", genre: "scifi", language: "es" },
  { id: "n16", title: "迷雾追凶录", author: "侦探", cover: "https://picsum.photos/seed/n16/300/400", rating: 4.3, popularity: 17500, tags: ["悬疑", "推理"], status: "completed", genre: "mystery", language: "zh" },
  { id: "n17", title: "大明·永乐风云", author: "史官", cover: "https://picsum.photos/seed/n17/300/400", rating: 4.6, popularity: 29800, tags: ["历史", "权谋"], status: "ongoing", genre: "history", language: "zh" },
  { id: "n18", title: "电竞之王", author: "玩家", cover: "https://picsum.photos/seed/n18/300/400", rating: 4.1, popularity: 14600, tags: ["现代", "电竞"], status: "ongoing", genre: "modern", language: "zh" },
];

export const rankingNovels: RankingItem[] = [
  { id: "r1", title: "星辰宫之万界天帝", popularity: 128500 },
  { id: "r2", title: "都市之巅峰高手", popularity: 96300 },
  { id: "r3", title: "三体·宇宙回响", popularity: 85200 },
  { id: "r4", title: "迷雾追凶录", popularity: 67800 },
  { id: "r5", title: "大明·永乐风云", popularity: 54100 },
];

export const checkinDays: CheckinDay[] = [
  { day: 1, checked: true, isToday: false },
  { day: 2, checked: true, isToday: false },
  { day: 3, checked: true, isToday: false },
  { day: 4, checked: true, isToday: false },
  { day: 5, checked: false, isToday: true },
  { day: 6, checked: false, isToday: false },
  { day: 7, checked: false, isToday: false },
];

// ===== Novel Detail Mock Data =====

export interface MockNovel {
  id: string;
  title: string;
  cover: string;
  author: { id: string; name: string; avatar: string; verified: boolean };
  category: string;
  tags: string[];
  status: "ongoing" | "completed" | "hiatus";
  description: string;
  views: number;
  favorites: number;
  chapterCount: number;
  wordCount: number;
  rating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export const mockNovels: MockNovel[] = [
  {
    id: "novel1",
    title: "星辰变之万界天尊",
    cover: "https://picsum.photos/seed/novel1/400/600",
    author: { id: "user1", name: "星辰子", avatar: "https://i.pravatar.cc/150?u=alice@example.com", verified: true },
    category: "玄幻",
    tags: ["修仙", "热血", "逆袭", "东方玄幻"],
    status: "ongoing",
    description: "秦羽，一名身世神秘的少年，自幼被镇东王收养。在一次意外中，他获得了一颗神秘的「流星泪」，从此踏上了一条不平凡的修仙之路。\n\n从凡人界的楚廷大陆，到仙魔妖界的浩瀚星空，再到神界的至高存在，秦羽以坚韧不拔的意志，一步步攀登力量的巅峰。他结交生死兄弟，邂逅挚爱之人，面对无数强敌与挑战，始终不曾退缩。\n\n星辰变，万法归宗。当秦羽最终揭开「流星泪」的真正秘密时，他才发现，这一切的背后，隐藏着一个关乎整个宇宙命运的惊天秘密……\n\n且看秦羽如何从一个普通少年，成长为凌驾于诸天之上的鸿蒙掌控者，书写一段属于自己的传奇！",
    views: 1285000, favorites: 320000, chapterCount: 284, wordCount: 8600000,
    rating: 8.6, ratingCount: 70000, createdAt: "2025-01-15", updatedAt: "2026-07-22",
  },
  {
    id: "novel2", title: "The Crystal Throne", cover: "https://picsum.photos/seed/novel2/400/600",
    author: { id: "user1", name: "Alice Chen", avatar: "https://i.pravatar.cc/150?u=alice@example.com", verified: true },
    category: "Fantasy", tags: ["magic", "fantasy", "adventure"], status: "ongoing",
    description: "A young mage discovers a hidden throne that grants immense power but at a terrible cost.",
    views: 152000, favorites: 45000, chapterCount: 156, wordCount: 2400000,
    rating: 9.2, ratingCount: 12800, createdAt: "2025-03-01", updatedAt: "2026-07-20",
  },
  {
    id: "novel3", title: "Whispers in the Dark", cover: "https://picsum.photos/seed/novel3/400/600",
    author: { id: "user1", name: "Alice Chen", avatar: "https://i.pravatar.cc/150?u=alice@example.com", verified: true },
    category: "Horror", tags: ["horror", "dark", "mystery"], status: "completed",
    description: "In a Victorian mansion, secrets come alive when the clock strikes midnight.",
    views: 89000, favorites: 23000, chapterCount: 89, wordCount: 1200000,
    rating: 8.1, ratingCount: 8900, createdAt: "2025-02-10", updatedAt: "2026-05-15",
  },
  {
    id: "novel4", title: "Starbound Hearts", cover: "https://picsum.photos/seed/novel4/400/600",
    author: { id: "user2", name: "Bob Martinez", avatar: "https://i.pravatar.cc/150?u=bob@example.com", verified: false },
    category: "Sci-Fi", tags: ["romance", "sci-fi", "drama"], status: "ongoing",
    description: "Two astronauts from rival colonies fall in love aboard a generation ship.",
    views: 124000, favorites: 38000, chapterCount: 112, wordCount: 1800000,
    rating: 8.8, ratingCount: 15600, createdAt: "2025-04-20", updatedAt: "2026-07-18",
  },
  {
    id: "novel5", title: "Crimson Tides", cover: "https://picsum.photos/seed/novel5/400/600",
    author: { id: "user3", name: "Catherine Lee", avatar: "https://i.pravatar.cc/150?u=catherine@example.com", verified: true },
    category: "Adventure", tags: ["adventure", "action", "fantasy"], status: "ongoing",
    description: "A pirate captain navigates cursed waters to find the legendary Crimson Pearl.",
    views: 185000, favorites: 52000, chapterCount: 203, wordCount: 3200000,
    rating: 9.0, ratingCount: 22100, createdAt: "2025-01-05", updatedAt: "2026-07-21",
  },
  {
    id: "novel6", title: "Moonlit Garden", cover: "https://picsum.photos/seed/novel6/400/600",
    author: { id: "user4", name: "David Kim", avatar: "https://i.pravatar.cc/150?u=david@example.com", verified: false },
    category: "Romance", tags: ["romance", "slice-of-life", "drama"], status: "completed",
    description: "A gentle love story between a botanist and a poet in a small coastal town.",
    views: 221000, favorites: 67000, chapterCount: 78, wordCount: 980000,
    rating: 9.4, ratingCount: 28900, createdAt: "2025-05-10", updatedAt: "2026-03-20",
  },
];

export interface MockChapter {
  id: string; novelId: string; title: string; content: string;
  order: number; wordCount: number; isPremium: boolean; createdAt: string;
}

const chapterContents: Record<string, string> = {
  chapter1: `    秦羽站在镇东王府的后院中，仰望着夜空中那颗最亮的星辰。流星泪在他胸前微微发热，仿佛在回应着某种遥远的召唤。

    "少爷，该休息了。"老管家福伯的声音从身后传来，带着几分关切。

    秦羽转过身，微微一笑："福伯，我再看一会儿。"

    他的目光再次投向星空。自从三个月前意外获得流星泪以来，他的身体发生了许多奇妙的变化。力量增强了，感知变得敏锐，甚至能隐约感受到天地间某种神秘能量的流动。

    "这颗流星泪，究竟隐藏着什么秘密？"秦羽喃喃自语。

    突然，流星泪爆发出强烈的光芒，秦羽感到一股庞大的信息涌入脑海——那是一部修炼功法，名为《星辰变》。

    功法共分九重，每一重都对应着不同的修炼境界。从星云、流星到星核，再到行星、渡劫、恒星、暗星、黑洞，最终达到传说中的创世之境。

    秦羽深吸一口气，按照功法的指引开始修炼。周围的天地灵气如潮水般涌来，在他周身形成了一个小小的漩涡。

    这一夜，镇东王府的后院中，一颗新星悄然升起。`,

  chapter2: `    修炼《星辰变》的第一个月，秦羽的实力突飞猛进。他已经达到了星云境界的巅峰，距离流星境界只差一步之遥。

    然而，修炼之路并非一帆风顺。

    "秦羽，听说你最近实力大增？"一个阴阳怪气的声音从前方传来。

    秦羽抬头看去，只见镇东王的嫡孙秦风带着几个跟班挡住了去路。秦风一直视秦羽为眼中钉，因为秦羽虽然是被收养的孤儿，却深得镇东王喜爱。

    "秦风哥，有何指教？"秦羽平静地说道。

    "指教不敢，只是想切磋切磋。"秦风冷笑一声，身上爆发出强大的气势。

    秦羽心中一凛。秦风已经是流星境界的强者，而自己只是星云巅峰。但他并没有退缩。

    "请。"秦羽摆出防御姿态。

    战斗一触即发。秦风的攻击如狂风暴雨般袭来，秦羽左躲右闪，险象环生。但他发现，在生死压力下，流星泪的力量被进一步激发，他的反应速度越来越快。

    终于，秦羽抓住了秦风的一个破绽，一掌击出。掌风带着星辰之力，将秦风震退数步。

    "不可能！"秦风满脸震惊。

    秦羽没有追击，而是转身离去。他知道，今天的胜利只是暂时的，修炼之路还很长。`,

  chapter3: `    秦羽的突破引起了镇东王的注意。

    "羽儿，你过来。"镇东王在书房中召见了秦羽。

    秦羽心中忐忑，不知道镇东王葫芦里卖的什么药。

    镇东王仔细打量着秦羽，眼中闪过一丝复杂的神色："你的实力进步很快，这很好。但是，木秀于林，风必摧之。你要小心。"

    "义父放心，孩儿明白。"秦羽恭敬地回答。

    镇东王点了点头，从抽屉中取出一枚令牌递给秦羽："这是通往外界的信物。如果有一天你在府中待不下去了，可以拿着它去外面闯荡。"

    秦羽心中一暖，接过令牌："义父，孩儿不会让您失望的。"

    离开书房后，秦羽遇到了一个神秘的老者。老者自称姜澜，是流星泪的前任主人。

    "年轻人，你很有天赋。"姜澜微笑着说，"但流星泪的力量远不止于此。跟我来，我教你真正的修炼之法。"

    秦羽犹豫了一下，最终跟上了姜澜的步伐。他不知道，这个决定将彻底改变他的人生轨迹。

    在姜澜的指导下，秦羽开始学习更加高深的修炼技巧。他了解到，流星泪不仅是一件修炼宝物，更是一把打开宇宙奥秘的钥匙。

    "宇宙之中，存在着无数个世界。"姜澜指着星空说道，"凡人界、仙魔妖界、神界……每一个世界都有着自己的规则和强者。而流星泪，就是通往这些世界的通行证。"

    秦羽听得目瞪口呆。他从未想过，自己生活的世界竟然只是宇宙中的一小部分。

    "那么，我该怎么做？"秦羽问道。

    姜澜笑了："继续修炼，变得更强。当你达到足够的实力，自然就会明白一切。"

    从那天起，秦羽的修炼进入了一个全新的阶段。他不再局限于镇东王府的小天地，而是将目光投向了更加广阔的宇宙。`,
};

export const mockChapters: MockChapter[] = [
  { id: "chapter1", novelId: "novel1", title: "第1章 流星泪", content: chapterContents.chapter1, order: 1, wordCount: 3200, isPremium: false, createdAt: "2025-01-15" },
  { id: "chapter2", novelId: "novel1", title: "第2章 初露锋芒", content: chapterContents.chapter2, order: 2, wordCount: 2800, isPremium: false, createdAt: "2025-01-16" },
  { id: "chapter3", novelId: "novel1", title: "第3章 神秘老者", content: chapterContents.chapter3, order: 3, wordCount: 3500, isPremium: true, createdAt: "2025-01-17" },
];

for (let i = 4; i <= 30; i++) {
  mockChapters.push({
    id: `chapter${i}`, novelId: "novel1",
    title: `第${i}章 ${["修炼突破", "强敌来袭", "秘境探险", "生死之战", "新的征程", "暗流涌动", "真相浮现", "绝地反击", "巅峰对决", "新的开始"][i % 10]}`,
    content: `    这是第${i}章的内容。故事继续发展，秦羽在修炼之路上不断前行，面对各种挑战和机遇。\n\n    天地灵气在他周身流转，星辰之力在他的经脉中奔涌。每一次突破，都让他离真相更近一步。\n\n    "这条路，我会一直走下去。"秦羽坚定地想着。`,
    order: i, wordCount: 2500 + Math.floor(Math.random() * 1500),
    isPremium: i > 20, createdAt: `2025-01-${String(14 + i).padStart(2, "0")}`,
  });
}

export const mockComments: Comment[] = [
  {
    id: "comment1", userId: "user8", userName: "夜行者",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=夜行者",
    novelId: "novel1",
    content: "追了这本书两年了，从凡人界看到神界。秦羽的成长真的太让人热血了！特别是星辰变功法的设定，简直是太精妙了。作者的想象力真的绝了，每一个境界的突破都让人期待不已。强烈推荐给所有喜欢东方玄幻的朋友！",
    likes: 856, createdAt: "2026-07-20",
    replies: [{ id: "reply1", userId: "user1", userName: "星辰子", userAvatar: "https://i.pravatar.cc/150?u=alice@example.com", novelId: "novel1", content: "感谢支持！后续会更加精彩，鸿蒙篇即将开启~", likes: 234, createdAt: "2026-07-20", replies: [] }],
  },
  {
    id: "comment2", userId: "user9", userName: "星辰大海",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=星辰大海",
    novelId: "novel1",
    content: "文笔细腻，世界观宏大。人物塑造也非常立体，秦羽、侯费、黑羽三兄弟的友情描写得特别好。每次看到他们并肩作战都很感动。唯一的小瑕疵是中间有些章节水了点，希望后面能紧凑一些。",
    likes: 523, createdAt: "2026-07-18",
    replies: [{ id: "reply2", userId: "user10", userName: "书虫小王", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=书虫", novelId: "novel1", content: "同感！三兄弟的友情是这本书最大的亮点之一。", likes: 89, createdAt: "2026-07-19", replies: [] }],
  },
  {
    id: "comment3", userId: "user11", userName: "玄幻老书虫",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=老书虫",
    novelId: "novel1",
    content: "作为看了十几年玄幻小说的老读者，这本书绝对能排进前五。修炼体系设计得很合理，不像有些书战力崩坏。而且感情线也很自然，不是那种强行凑CP的感觉。",
    likes: 412, createdAt: "2026-07-15", replies: [],
  },
  {
    id: "comment4", userId: "user4", userName: "Emma Wilson",
    userAvatar: "https://i.pravatar.cc/150?u=emma@example.com",
    novelId: "novel1",
    content: "The worldbuilding in this novel is absolutely incredible. I love how the cultivation system is tied to actual astronomical concepts.",
    likes: 267, createdAt: "2026-07-12", replies: [],
  },
  {
    id: "comment5", userId: "user5", userName: "Frank Zhang",
    userAvatar: "https://i.pravatar.cc/150?u=frank@example.com",
    novelId: "novel1",
    content: "第278章那场大战写得太燃了！秦羽一人独战三大神王，星辰之力全面爆发，看得我热血沸腾。作者的战斗场面描写真的是一流水平。",
    likes: 345, createdAt: "2026-07-10", replies: [],
  },
];

export const mockBookshelf: BookshelfItem[] = [
  { novelId: "novel1", title: "星辰变之万界天尊", author: "星辰子", cover: "https://picsum.photos/seed/novel1/400/600", progress: 68, lastReadChapter: "第193章 神界风云", category: "following", addedAt: "2026-01-15", updatedAt: "2026-07-22" },
  { novelId: "novel2", title: "The Crystal Throne", author: "Alice Chen", cover: "https://picsum.photos/seed/novel2/400/600", progress: 100, lastReadChapter: "第156章 终章", category: "completed", addedAt: "2026-02-20", updatedAt: "2026-06-15" },
  { novelId: "novel5", title: "Crimson Tides", author: "Catherine Lee", cover: "https://picsum.photos/seed/novel5/400/600", progress: 45, lastReadChapter: "第91章 深海秘境", category: "following", addedAt: "2026-03-10", updatedAt: "2026-07-21" },
  { novelId: "novel6", title: "Moonlit Garden", author: "David Kim", cover: "https://picsum.photos/seed/novel6/400/600", progress: 100, lastReadChapter: "第78章 月光下的告白", category: "completed", addedAt: "2026-04-05", updatedAt: "2026-05-20" },
  { novelId: "novel4", title: "Starbound Hearts", author: "Bob Martinez", cover: "https://picsum.photos/seed/novel4/400/600", progress: 12, lastReadChapter: "第13章 零重力之舞", category: "pending", addedAt: "2026-07-01", updatedAt: "2026-07-05" },
  { novelId: "novel3", title: "Whispers in the Dark", author: "Alice Chen", cover: "https://picsum.photos/seed/novel3/400/600", progress: 78, lastReadChapter: "第69章 午夜的真相", category: "following", addedAt: "2026-05-15", updatedAt: "2026-07-18" },
];

export const mockReadingHistory: ReadingHistory[] = [
  { id: "history1", novelId: "novel1", novelTitle: "星辰变之万界天尊", novelCover: "https://picsum.photos/seed/novel1/400/600", chapterTitle: "第193章 神界风云", chapterOrder: 193, readAt: "2026-07-22 21:30" },
  { id: "history2", novelId: "novel5", novelTitle: "Crimson Tides", novelCover: "https://picsum.photos/seed/novel5/400/600", chapterTitle: "第91章 深海秘境", chapterOrder: 91, readAt: "2026-07-21 19:45" },
  { id: "history3", novelId: "novel3", novelTitle: "Whispers in the Dark", novelCover: "https://picsum.photos/seed/novel3/400/600", chapterTitle: "第69章 午夜的真相", chapterOrder: 69, readAt: "2026-07-20 22:15" },
  { id: "history4", novelId: "novel2", novelTitle: "The Crystal Throne", novelCover: "https://picsum.photos/seed/novel2/400/600", chapterTitle: "第156章 终章", chapterOrder: 156, readAt: "2026-07-18 16:20" },
  { id: "history5", novelId: "novel1", novelTitle: "星辰变之万界天尊", novelCover: "https://picsum.photos/seed/novel1/400/600", chapterTitle: "第192章 神王之威", chapterOrder: 192, readAt: "2026-07-17 20:00" },
  { id: "history6", novelId: "novel6", novelTitle: "Moonlit Garden", novelCover: "https://picsum.photos/seed/novel6/400/600", chapterTitle: "第78章 月光下的告白", chapterOrder: 78, readAt: "2026-07-15 23:10" },
  { id: "history7", novelId: "novel4", novelTitle: "Starbound Hearts", novelCover: "https://picsum.photos/seed/novel4/400/600", chapterTitle: "第13章 零重力之舞", chapterOrder: 13, readAt: "2026-07-10 14:30" },
  { id: "history8", novelId: "novel5", novelTitle: "Crimson Tides", novelCover: "https://picsum.photos/seed/novel5/400/600", chapterTitle: "第90章 海盗联盟", chapterOrder: 90, readAt: "2026-07-08 18:45" },
];

export const mockVoteOptions: VoteOption[] = [
  { id: "vote1", label: "A. 鸿蒙掌控者，超越天道", votes: 1247, percentage: 68 },
  { id: "vote2", label: "B. 天尊级别，与天道持平", votes: 402, percentage: 22 },
  { id: "vote3", label: "C. 神王级别，成为一方霸主", votes: 183, percentage: 10 },
];

export const mockInteractiveChoices: InteractiveChoice[] = [
  {
    id: "choice1", chapterId: "chapter2",
    options: [
      { id: "opt1", text: "正面迎战秦风，展示实力", targetChapterId: "chapter3" },
      { id: "opt2", text: "暂时退让，暗中修炼", targetChapterId: "chapter4" },
      { id: "opt3", text: "寻求镇东王的帮助", targetChapterId: "chapter5" },
    ],
  },
];

// ===== Profile Page Mock Data =====

export interface UserProfile {
  id: string; name: string; avatar: string; vip: boolean;
  bio: string; following: number; followers: number; works: number;
  banner: string;
}

export interface UserAssets {
  coins: number; membershipExpiry: string;
}

export interface DataOverview {
  booksRead: number; wordsWritten: number; followers: number; earnings: number;
  booksReadChange: number; wordsWrittenChange: number; followersChange: number; earningsChange: number;
}

export interface UserWork {
  id: string; title: string; cover: string; status: "ongoing" | "completed" | "draft";
  wordCount: number; chapterCount: number; updatedAt: string;
  views: number; favorites: number; rating: number;
  activityTag?: string;
}

export interface ProfileActivity {
  id: string; title: string; status: "ongoing" | "ended";
  remainingTime?: string; submissions: number;
  rank?: number; reward?: string; totalReads?: number;
  color: string; icon: string;
}

export const mockUserProfile: UserProfile = {
  id: "user1", name: "小明同学", avatar: "https://i.pravatar.cc/150?u=xiaoming",
  vip: true, bio: "热爱写作，梦想成为一名作家 ✍️",
  following: 12, followers: 128, works: 3,
  banner: "https://picsum.photos/seed/banner/800/200",
};

export const mockUserAssets: UserAssets = {
  coins: 2580, membershipExpiry: "2026-12-31",
};

export const mockDataOverview: DataOverview = {
  booksRead: 156, wordsWritten: 230000, followers: 128, earnings: 1280,
  booksReadChange: 12, wordsWrittenChange: 25, followersChange: 8, earningsChange: 42,
};

export const mockUserWorks: UserWork[] = [
  { id: "w1", title: "灌篮之王", cover: "https://picsum.photos/seed/w1/200/280", status: "ongoing", wordCount: 125000, chapterCount: 32, updatedAt: "昨日更新", views: 125000, favorites: 8642, rating: 9.2, activityTag: "标杆活动" },
  { id: "w2", title: "都市异能者", cover: "https://picsum.photos/seed/w2/200/280", status: "ongoing", wordCount: 82000, chapterCount: 18, updatedAt: "3天前更新", views: 36000, favorites: 2341, rating: 8.5 },
  { id: "w3", title: "问道长生", cover: "https://picsum.photos/seed/w3/200/280", status: "draft", wordCount: 23000, chapterCount: 5, updatedAt: "7天前更新", views: 0, favorites: 0, rating: 0 },
];

export const mockProfileActivities: ProfileActivity[] = [
  { id: "pa1", title: "【标杆】体育盛世", status: "ongoing", remainingTime: "3天14小时", submissions: 1, rank: 128, totalReads: 125000, color: "bg-indigo-500", icon: "trophy" },
  { id: "pa2", title: "末日求生", status: "ongoing", remainingTime: "5天8小时", submissions: 0, reward: "300墨币奖励", color: "bg-orange-500", icon: "book" },
  { id: "pa3", title: "人间烟火", status: "ended", submissions: 1, rank: 56, reward: "200墨币", color: "bg-teal-500", icon: "award" },
  { id: "pa4", title: "江湖侠客行", status: "ended", submissions: 1, rank: 12, reward: "400墨币", color: "bg-rose-400", icon: "medal" },
];

// ===== Earnings Page Mock Data =====

export interface EarningsData {
  totalReads: number;
  totalWords: number;
  totalFavorites: number;
  totalCoins: number;
  currentIncome: number;
  pendingIncome: number;
  withdrawable: number;
}

export interface TrendDataPoint {
  label: string;
  reads: number;
  income: number;
}

export interface TopNovel {
  id: string;
  title: string;
  cover: string;
  reads: number;
  income: number;
  rank: number;
}

export const mockEarningsData: EarningsData = {
  totalReads: 2850000,
  totalWords: 230000,
  totalFavorites: 186000,
  totalCoins: 12580,
  currentIncome: 3200,
  pendingIncome: 860,
  withdrawable: 4200,
};

export const mockTrendData7d: TrendDataPoint[] = [
  { label: "7/17", reads: 12500, income: 180 },
  { label: "7/18", reads: 15800, income: 220 },
  { label: "7/19", reads: 11200, income: 160 },
  { label: "7/20", reads: 18600, income: 280 },
  { label: "7/21", reads: 22100, income: 350 },
  { label: "7/22", reads: 19800, income: 310 },
  { label: "7/23", reads: 25400, income: 420 },
];

export const mockTrendData30d: TrendDataPoint[] = [
  { label: "6/24", reads: 8200, income: 120 },
  { label: "6/28", reads: 9500, income: 140 },
  { label: "7/02", reads: 11200, income: 165 },
  { label: "7/06", reads: 13800, income: 195 },
  { label: "7/10", reads: 15200, income: 230 },
  { label: "7/14", reads: 17600, income: 265 },
  { label: "7/18", reads: 19400, income: 310 },
  { label: "7/22", reads: 22800, income: 380 },
  { label: "7/23", reads: 25400, income: 420 },
];

export const mockTopNovels: TopNovel[] = [
  { id: "w1", title: "灌篮之王", cover: "https://picsum.photos/seed/w1/200/280", reads: 125000, income: 1860, rank: 1 },
  { id: "w2", title: "都市异能者", cover: "https://picsum.photos/seed/w2/200/280", reads: 36000, income: 540, rank: 2 },
  { id: "w3", title: "问道长生", cover: "https://picsum.photos/seed/w3/200/280", reads: 12800, income: 192, rank: 3 },
  { id: "n1", title: "星辰变之万界天尊", cover: "https://picsum.photos/seed/novel1/400/600", reads: 1285000, income: 19200, rank: 4 },
  { id: "n5", title: "Crimson Tides", cover: "https://picsum.photos/seed/novel5/400/600", reads: 185000, income: 2780, rank: 5 },
];

// ===== Messages Page Mock Data =====

export interface MessageItem {
  id: string;
  type: "system" | "comment" | "like";
  avatar: string;
  userName: string;
  content: string;
  novelTitle?: string;
  createdAt: string;
  isRead: boolean;
}

export const mockMessages: MessageItem[] = [
  // System messages
  { id: "msg1", type: "system", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=system", userName: "系统通知", content: "您的作品《灌篮之王》已通过审核，现已公开发布。", createdAt: "2026-07-23 10:30", isRead: false },
  { id: "msg2", type: "system", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=system", userName: "系统通知", content: "恭喜！您的作品《都市异能者》获得本周编辑推荐。", createdAt: "2026-07-22 15:20", isRead: false },
  { id: "msg3", type: "system", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=system", userName: "系统通知", content: "您参与的【标杆】体育盛世活动即将结束，请尽快提交作品。", createdAt: "2026-07-21 09:00", isRead: true },
  { id: "msg4", type: "system", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=system", userName: "系统通知", content: "您的会员将于 2026-12-31 到期，请及时续费。", createdAt: "2026-07-20 08:00", isRead: true },
  { id: "msg5", type: "system", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=system", userName: "系统通知", content: "平台新功能上线：AI 多语言翻译已支持 20+ 种语言。", createdAt: "2026-07-18 12:00", isRead: true },
  // Comments
  { id: "msg6", type: "comment", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reader1", userName: "夜行者", content: "第三章写得太精彩了！秦羽和秦风的对决让人热血沸腾，期待后续发展。", novelTitle: "灌篮之王", createdAt: "2026-07-23 09:15", isRead: false },
  { id: "msg7", type: "comment", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reader2", userName: "星辰大海", content: "人物塑造很立体，剧情节奏也不错。加油！", novelTitle: "都市异能者", createdAt: "2026-07-22 20:30", isRead: false },
  { id: "msg8", type: "comment", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reader3", userName: "书虫小王", content: "这个设定很有意思，继续追更！", novelTitle: "灌篮之王", createdAt: "2026-07-21 16:45", isRead: true },
  { id: "msg9", type: "comment", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reader4", userName: "玄幻老书虫", content: "文笔细腻，世界观宏大。五星好评！", novelTitle: "问道长生", createdAt: "2026-07-20 11:20", isRead: true },
  { id: "msg10", type: "comment", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reader5", userName: "Emma Wilson", content: "Great story! Can't wait for the next chapter.", novelTitle: "灌篮之王", createdAt: "2026-07-19 08:30", isRead: true },
  // Likes & Favorites
  { id: "msg11", type: "like", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fan1", userName: "篮球迷", content: "收藏了您的作品《灌篮之王》", novelTitle: "灌篮之王", createdAt: "2026-07-23 11:00", isRead: false },
  { id: "msg12", type: "like", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fan2", userName: "都市控", content: "赞了您的作品《都市异能者》", novelTitle: "都市异能者", createdAt: "2026-07-22 14:20", isRead: false },
  { id: "msg13", type: "like", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fan3", userName: "修仙党", content: "收藏了您的作品《问道长生》", novelTitle: "问道长生", createdAt: "2026-07-21 10:10", isRead: true },
  { id: "msg14", type: "like", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fan4", userName: "热血少年", content: "赞了您的作品《灌篮之王》", novelTitle: "灌篮之王", createdAt: "2026-07-20 18:30", isRead: true },
  { id: "msg15", type: "like", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fan5", userName: "阅读达人", content: "收藏了您的作品《都市异能者》", novelTitle: "都市异能者", createdAt: "2026-07-19 22:15", isRead: true },
];

// ===== Settings Page Mock Data =====

export interface UserSettings {
  nickname: string;
  avatar: string;
  bio: string;
  fontSize: number;
  lineHeight: number;
  bgColor: string;
  emailNotification: boolean;
  inAppNotification: boolean;
  pushNotification: boolean;
  defaultVisibility: "public" | "private";
  commentPermission: "all" | "followers" | "none";
  interfaceLanguage: string;
  aiTranslationEnabled: boolean;
  defaultTranslationTarget: string;
  creationPrimaryLanguage: string;
  creationAuxLanguages: string[];
  region: string;
  timezone: string;
}

export const mockUserSettings: UserSettings = {
  nickname: "小明同学",
  avatar: "https://i.pravatar.cc/150?u=xiaoming",
  bio: "热爱写作，梦想成为一名作家 ✍️",
  fontSize: 16,
  lineHeight: 1.8,
  bgColor: "#ffffff",
  emailNotification: true,
  inAppNotification: true,
  pushNotification: false,
  defaultVisibility: "public",
  commentPermission: "all",
  interfaceLanguage: "zh-CN",
  aiTranslationEnabled: true,
  defaultTranslationTarget: "zh-CN",
  creationPrimaryLanguage: "zh-CN",
  creationAuxLanguages: ["en"],
  region: "CN",
  timezone: "UTC+8",
};

// ===== Helper Functions =====

export function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + "万";
  return num.toString();
}

export function getNovelById(id: string): MockNovel | undefined {
  return mockNovels.find((n) => n.id === id);
}

export function getChaptersByNovelId(novelId: string): MockChapter[] {
  return mockChapters.filter((c) => c.novelId === novelId).sort((a, b) => a.order - b.order);
}

export function getChapterById(id: string): MockChapter | undefined {
  return mockChapters.find((c) => c.id === id);
}

export function getCommentsByNovelId(novelId: string): Comment[] {
  return mockComments.filter((c) => c.novelId === novelId);
}

export function getRelatedNovels(novelId: string, limit = 4): MockNovel[] {
  const current = getNovelById(novelId);
  if (!current) return mockNovels.slice(0, limit);
  return mockNovels.filter((n) => n.id !== novelId && n.category === current.category).slice(0, limit);
}

// ===== Activities Page Mock Data =====

export const activityBanner: ActivityBannerData = {
  id: "banner1",
  title: "标杆小说计划 #18",
  subtitle: "【标杆】体育盛世 · 围绕赛场，写下竞技与热血",
  description: "以体育竞技为主题，创作热血竞技小说。无论是篮球、足球还是电竞，用文字点燃赛场激情！",
  participants: 3247,
  submissions: 1856,
  remainingTime: "3天14时",
  themeColor: "from-indigo-600 via-purple-600 to-violet-700",
};

export const activityCategories = [
  { key: "all", label: "全部活动" },
  { key: "benchmark", label: "标杆计划" },
  { key: "challenge", label: "词条挑战" },
  { key: "navigator", label: "领航员计划" },
  { key: "theme", label: "主题征文" },
  { key: "contract", label: "签约大赛" },
] as const;

export const activityCards: ActivityCardDataExtended[] = [
  {
    id: "ac1", title: "【标杆】体育盛世", subtitle: "竞技 · 热血 · 青春",
    startDate: "7/10", endDate: "7/25", themeColor: "from-indigo-500 to-purple-600",
    cover: "https://picsum.photos/seed/ac1/300/200",
    status: "ongoing", participants: 3247, reward: "600 墨币", progress: 65, category: "benchmark",
  },
  {
    id: "ac2", title: "末日求生", subtitle: "生存 · 冒险 · 探索",
    startDate: "7/12", endDate: "7/28", themeColor: "from-orange-500 to-red-500",
    cover: "https://picsum.photos/seed/ac2/300/200",
    status: "ongoing", participants: 2156, reward: "300 墨币", progress: 45, category: "theme",
  },
  {
    id: "ac3", title: "人间烟火", subtitle: "日常 · 治愈 · 温情",
    startDate: "7/15", endDate: "7/30", themeColor: "from-teal-500 to-cyan-600",
    cover: "https://picsum.photos/seed/ac3/300/200",
    status: "ongoing", participants: 1823, reward: "500 墨币", progress: 90, category: "theme",
  },
  {
    id: "ac4", title: "夏日物语", subtitle: "夏天 · 回忆 · 青春",
    startDate: "7/18", endDate: "7/31", themeColor: "from-pink-500 to-rose-500",
    cover: "https://picsum.photos/seed/ac4/300/200",
    status: "ongoing", participants: 986, reward: "200 墨币", progress: 30, category: "theme",
  },
  {
    id: "ac5", title: "AI创意大赛", subtitle: "AI辅助 · 创意 · 实验",
    startDate: "7/20", endDate: "8/10", themeColor: "from-blue-500 to-indigo-600",
    cover: "https://picsum.photos/seed/ac5/300/200",
    status: "ongoing", participants: 1542, reward: "1000 墨币", progress: 25, category: "challenge",
  },
  {
    id: "ac6", title: "星际迷航", subtitle: "科幻 · 太空 · 探索",
    startDate: "8/1", endDate: "8/20", themeColor: "from-slate-600 to-gray-800",
    cover: "https://picsum.photos/seed/ac6/300/200",
    status: "upcoming", participants: 0, reward: "800 墨币", progress: 0, category: "navigator",
  },
];

export const pastActivities: ActivityCardDataExtended[] = [
  {
    id: "pa1", title: "星际迷航", subtitle: "科幻 · 太空",
    startDate: "6/1", endDate: "6/20", themeColor: "from-indigo-400 to-purple-500",
    cover: "https://picsum.photos/seed/pa1/300/200",
    status: "ended", participants: 2056, reward: "标杆计划 #17", progress: 100, category: "benchmark",
  },
  {
    id: "pa2", title: "江湖侠客行", subtitle: "武侠 · 江湖",
    startDate: "6/5", endDate: "6/25", themeColor: "from-amber-500 to-orange-600",
    cover: "https://picsum.photos/seed/pa2/300/200",
    status: "ended", participants: 3124, reward: "标杆计划 #16", progress: 100, category: "benchmark",
  },
  {
    id: "pa3", title: "都市异闻录", subtitle: "都市 · 悬疑",
    startDate: "6/10", endDate: "6/28", themeColor: "from-emerald-500 to-teal-600",
    cover: "https://picsum.photos/seed/pa3/300/200",
    status: "ended", participants: 1876, reward: "词条挑战", progress: 100, category: "challenge",
  },
  {
    id: "pa4", title: "恋爱物语", subtitle: "言情 · 甜宠",
    startDate: "6/15", endDate: "7/5", themeColor: "from-pink-400 to-rose-500",
    cover: "https://picsum.photos/seed/pa4/300/200",
    status: "ended", participants: 2034, reward: "主题征文", progress: 100, category: "theme",
  },
];

export const activityWorkRankings: Record<string, ActivityWorkItem[]> = {
  popularity: [
    { id: "aw1", rank: 1, title: "灌篮之王", author: "篮球少年", cover: "https://picsum.photos/seed/aw1/200/280", rating: 9.2, views: 125000, trend: 0 },
    { id: "aw2", rank: 2, title: "绿茵传奇", author: "足球达人", cover: "https://picsum.photos/seed/aw2/200/280", rating: 8.8, views: 98000, trend: 1 },
    { id: "aw3", rank: 3, title: "网球王子", author: "挥拍者", cover: "https://picsum.photos/seed/aw3/200/280", rating: 8.5, views: 76000, trend: -1 },
    { id: "aw4", rank: 4, title: "泳池之王", author: "飞鱼", cover: "https://picsum.photos/seed/aw4/200/280", rating: 8.3, views: 68000, trend: 2 },
    { id: "aw5", rank: 5, title: "追风者", author: "田径达人", cover: "https://picsum.photos/seed/aw5/200/280", rating: 8.1, views: 54000, trend: 0 },
    { id: "aw6", rank: 6, title: "电竞之王", author: "职业选手", cover: "https://picsum.photos/seed/aw6/200/280", rating: 8.0, views: 52600, trend: 5 },
    { id: "aw7", rank: 7, title: "格斗王者", author: "格斗家", cover: "https://picsum.photos/seed/aw7/200/280", rating: 7.8, views: 42000, trend: -2 },
    { id: "aw8", rank: 8, title: "棋圣", author: "棋道", cover: "https://picsum.photos/seed/aw8/200/280", rating: 7.5, views: 38000, trend: 3 },
  ],
  newbook: [
    { id: "aw9", rank: 1, title: "泳道之星", author: "水花", cover: "https://picsum.photos/seed/aw9/200/280", rating: 8.9, views: 45000 },
    { id: "aw10", rank: 2, title: "篮下风云", author: "扣篮王", cover: "https://picsum.photos/seed/aw10/200/280", rating: 8.7, views: 38000 },
    { id: "aw11", rank: 3, title: "赛道英雄", author: "极速", cover: "https://picsum.photos/seed/aw11/200/280", rating: 8.5, views: 32000 },
  ],
  rating: [
    { id: "aw1", rank: 1, title: "灌篮之王", author: "篮球少年", cover: "https://picsum.photos/seed/aw1/200/280", rating: 9.2, views: 125000 },
    { id: "aw2", rank: 2, title: "绿茵传奇", author: "足球达人", cover: "https://picsum.photos/seed/aw2/200/280", rating: 8.8, views: 98000 },
    { id: "aw3", rank: 3, title: "网球王子", author: "挥拍者", cover: "https://picsum.photos/seed/aw3/200/280", rating: 8.5, views: 76000 },
  ],
};

export const activityDetails: Record<string, ActivityDetail> = {
  ac1: {
    id: "ac1", title: "【标杆】体育盛世", subtitle: "竞技 · 热血 · 青春",
    description: "以体育竞技为主题，创作热血竞技小说。无论是篮球、足球、网球还是电竞，用文字点燃赛场激情！本活动旨在发掘优秀的体育题材作品，为读者带来充满热血与感动的竞技故事。",
    rules: [
      "作品必须以体育竞技为核心主题",
      "字数不少于5万字，章节不少于20章",
      "必须为原创作品，不得抄袭",
      "投稿作品需在本活动期间发布",
      "每位作者最多投稿2部作品",
    ],
    rewards: [
      { rank: "第1名", reward: "600墨币 + 标杆认证 + 首页推荐" },
      { rank: "第2-3名", reward: "400墨币 + 专区推荐" },
      { rank: "第4-10名", reward: "200墨币" },
      { rank: "参与奖", reward: "完赛即得50墨币" },
    ],
    submissions: activityWorkRankings.popularity,
    status: "ongoing", startDate: "7/10", endDate: "7/25",
    participants: 3247, category: "benchmark",
    themeColor: "from-indigo-500 to-purple-600",
  },
};

// ===== Ranking Page Mock Data =====

export const rankingTypes = [
  { key: "popularity", label: "人气榜", icon: "flame" },
  { key: "newbook", label: "新书榜", icon: "sparkles" },
  { key: "rating", label: "评分榜", icon: "star" },
  { key: "rising", label: "飙升榜", icon: "trending-up" },
  { key: "completed", label: "完结榜", icon: "check-circle" },
  { key: "signed", label: "签约榜", icon: "file-signature" },
] as const;

export const rankingTimeRanges = [
  { key: "all", label: "全部" },
  { key: "week", label: "本周" },
  { key: "month", label: "本月" },
] as const;

export const rankingCategories = [
  { key: "all", label: "全部" },
  { key: "werewolf", label: "狼人" },
  { key: "scifi", label: "科幻" },
  { key: "mystery", label: "悬疑" },
  { key: "history", label: "历史" },
  { key: "military", label: "军事" },
  { key: "urban", label: "都市" },
  { key: "fantasy", label: "奇幻" },
  { key: "romance", label: "言情" },
  { key: "game", label: "游戏" },
  { key: "wuxia", label: "武侠" },
] as const;

export const rankingTop3: RankingListItem[] = [
  {
    id: "rt1", rank: 1, title: "星辰变之万界天尊", author: "星辰子", authorId: "user1",
    cover: "https://picsum.photos/seed/rt1/300/420", category: "玄幻",
    rating: 9.2, views: 1285000, wordCount: 8600000, chapterCount: 284,
    status: "ongoing", trend: "up", trendValue: 2,
  },
  {
    id: "rt2", rank: 2, title: "都市之巅峰高手", author: "高手", authorId: "user2",
    cover: "https://picsum.photos/seed/rt2/300/420", category: "都市",
    rating: 8.9, views: 963000, wordCount: 4600000, chapterCount: 520,
    status: "ongoing", trend: "up", trendValue: 1,
  },
  {
    id: "rt3", rank: 3, title: "三体·宇宙回响", author: "刘工", authorId: "user3",
    cover: "https://picsum.photos/seed/rt3/300/420", category: "科幻",
    rating: 9.5, views: 871000, wordCount: 2500000, chapterCount: 186,
    status: "completed", trend: "up", trendValue: 1,
  },
];

export const rankingFullList: RankingListItem[] = [
  { id: "rl1", rank: 1, title: "星辰变之万界天尊", author: "星辰子", authorId: "user1", cover: "https://picsum.photos/seed/rl1/100/140", category: "玄幻", rating: 9.2, views: 1285000, wordCount: 8600000, chapterCount: 284, status: "ongoing", trend: "up", trendValue: 2 },
  { id: "rl2", rank: 2, title: "都市之巅峰高手", author: "高手", authorId: "user2", cover: "https://picsum.photos/seed/rl2/100/140", category: "都市", rating: 8.9, views: 963000, wordCount: 4600000, chapterCount: 520, status: "ongoing", trend: "up", trendValue: 1 },
  { id: "rl3", rank: 3, title: "三体·宇宙回响", author: "刘工", authorId: "user3", cover: "https://picsum.photos/seed/rl3/100/140", category: "科幻", rating: 9.5, views: 871000, wordCount: 2500000, chapterCount: 186, status: "completed", trend: "up", trendValue: 1 },
  { id: "rl4", rank: 4, title: "迷雾追凶录", author: "夜行者", authorId: "user4", cover: "https://picsum.photos/seed/rl4/100/140", category: "悬疑", rating: 9.1, views: 728000, wordCount: 2560000, chapterCount: 256, status: "ongoing", trend: "flat" },
  { id: "rl5", rank: 5, title: "大明·永乐风云", author: "史官", authorId: "user5", cover: "https://picsum.photos/seed/rl5/100/140", category: "历史", rating: 8.8, views: 654000, wordCount: 3200000, chapterCount: 320, status: "ongoing", trend: "up", trendValue: 3 },
  { id: "rl6", rank: 6, title: "樱花树下的约定", author: "樱花", authorId: "user6", cover: "https://picsum.photos/seed/rl6/100/140", category: "言情", rating: 8.8, views: 582000, wordCount: 2000000, chapterCount: 200, status: "completed", trend: "up", trendValue: 2 },
  { id: "rl7", rank: 7, title: "电竞之王", author: "职业选手", authorId: "user7", cover: "https://picsum.photos/seed/rl7/100/140", category: "游戏", rating: 8.6, views: 526000, wordCount: 1500000, chapterCount: 150, status: "ongoing", trend: "up", trendValue: 5 },
  { id: "rl8", rank: 8, title: "问道长生", author: "玄天一", authorId: "user8", cover: "https://picsum.photos/seed/rl8/100/140", category: "仙侠", rating: 8.9, views: 489000, wordCount: 4500000, chapterCount: 450, status: "ongoing", trend: "up", trendValue: 1 },
  { id: "rl9", rank: 9, title: "末日求生指南", author: "末日行者", authorId: "user9", cover: "https://picsum.photos/seed/rl9/100/140", category: "科幻", rating: 8.5, views: 423000, wordCount: 1800000, chapterCount: 180, status: "ongoing", trend: "up", trendValue: 1 },
  { id: "rl10", rank: 10, title: "我的AI女友", author: "码农小哥", authorId: "user10", cover: "https://picsum.photos/seed/rl10/100/140", category: "科幻", rating: 8.3, views: 387000, wordCount: 1500000, chapterCount: 150, status: "ongoing", trend: "up", trendValue: 3 },
  { id: "rl11", rank: 11, title: "暗影行者", author: "夜行者", authorId: "user4", cover: "https://picsum.photos/seed/rl11/100/140", category: "武侠", rating: 8.4, views: 356000, wordCount: 2100000, chapterCount: 210, status: "ongoing", trend: "down", trendValue: 1 },
  { id: "rl12", rank: 12, title: "金色海滩", author: "阳光", authorId: "user11", cover: "https://picsum.photos/seed/rl12/100/140", category: "校园", rating: 8.2, views: 312000, wordCount: 1200000, chapterCount: 120, status: "completed", trend: "flat" },
  { id: "rl13", rank: 13, title: "剑破苍穹", author: "剑客", authorId: "user12", cover: "https://picsum.photos/seed/rl13/100/140", category: "武侠", rating: 8.8, views: 298000, wordCount: 3800000, chapterCount: 380, status: "ongoing", trend: "up", trendValue: 4 },
  { id: "rl14", rank: 14, title: "银河帝国崛起", author: "星际", authorId: "user13", cover: "https://picsum.photos/seed/rl14/100/140", category: "科幻", rating: 8.5, views: 276000, wordCount: 2800000, chapterCount: 280, status: "ongoing", trend: "up", trendValue: 2 },
  { id: "rl15", rank: 15, title: "情断英京", author: "英伦风", authorId: "user14", cover: "https://picsum.photos/seed/rl15/100/140", category: "言情", rating: 8.0, views: 245000, wordCount: 1600000, chapterCount: 160, status: "completed", trend: "down", trendValue: 2 },
  { id: "rl16", rank: 16, title: "退休失败的一百种方式", author: "老王", authorId: "user15", cover: "https://picsum.photos/seed/rl16/100/140", category: "系统", rating: 8.6, views: 234000, wordCount: 2200000, chapterCount: 220, status: "ongoing", trend: "up", trendValue: 6 },
  { id: "rl17", rank: 17, title: "重逢时已是巨头", author: "星辰", authorId: "user16", cover: "https://picsum.photos/seed/rl17/100/140", category: "现代", rating: 8.7, views: 221000, wordCount: 1900000, chapterCount: 190, status: "ongoing", trend: "up", trendValue: 3 },
  { id: "rl18", rank: 18, title: "燃烧的孤岛", author: "远方", authorId: "user17", cover: "https://picsum.photos/seed/rl18/100/140", category: "悬疑", rating: 7.9, views: 198000, wordCount: 1400000, chapterCount: 140, status: "ongoing", trend: "down", trendValue: 1 },
  { id: "rl19", rank: 19, title: "校园时光里的暗恋", author: "甜蜜蜜", authorId: "user18", cover: "https://picsum.photos/seed/rl19/100/140", category: "校园", rating: 7.7, views: 176000, wordCount: 1100000, chapterCount: 110, status: "ongoing", trend: "flat" },
  { id: "rl20", rank: 20, title: "三国：双翼变猛", author: "历史控", authorId: "user19", cover: "https://picsum.photos/seed/rl20/100/140", category: "历史", rating: 8.1, views: 165000, wordCount: 2600000, chapterCount: 260, status: "completed", trend: "down", trendValue: 3 },
];

// ===== Author Page Mock Data =====

export const mockAuthorProfile: AuthorProfile = {
  id: "author1",
  name: "TTES",
  avatar: "https://i.pravatar.cc/150?u=ttes",
  verified: true,
  bio: "热爱创作的科幻迷，擅长将现实与想象融合。相信每一个故事都是一次灵魂的旅行。",
  worksCount: 3,
  totalHeat: "24.4k",
  followers: 12800,
  rating: 4.8,
};

export const mockAuthorWorks: AuthorWork[] = [
  {
    id: "novel1", title: "無限複製", cover: "https://picsum.photos/seed/authorwork1/300/420",
    tags: ["悬疑", "科幻"], rating: 4.8, heat: "24.4k",
    chapterCount: 8, wordCount: "25.3k字", status: "ongoing",
    activityTag: "连载中",
    description: "在無盡日復中，人性是否還能保留？背叛與忠誠的界線，系統的真實面目，以及「我究竟是誰」的終極拷問。",
  },
  {
    id: "novel2", title: "古墓迷蹤", cover: "https://picsum.photos/seed/authorwork2/300/420",
    tags: ["冒险", "悬疑"], rating: 4.6, heat: "12.1k",
    chapterCount: 12, wordCount: "32.5k字", status: "completed",
    description: "考古學家意外發現一座神秘古墓，從此開始了一段跨越千年的驚險旅程。",
  },
  {
    id: "novel3", title: "星際遠征", cover: "https://picsum.photos/seed/authorwork3/300/420",
    tags: ["科幻", "战争"], rating: 4.7, heat: "18.7k",
    chapterCount: 56, wordCount: "18万字", status: "ongoing",
    description: "在遙遠的銀河系邊緣，人類艦隊與未知文明展開了一場決定命運的戰爭。",
  },
];

export const mockAuthorFeeds: AuthorFeedItem[] = [
  {
    id: "feed1", authorId: "author1", authorName: "TTES",
    authorAvatar: "https://i.pravatar.cc/150?u=ttes",
    content: "第8章「反轉」已更新！這一章釀了很久，終於把第一個大反轉放出來了。不知道大家猜到了多少？後面還會有更多反轉，敬請期待~",
    createdAt: "2小时前",
    relatedWork: {
      title: "無限複製 · 第8章：反轉",
      cover: "https://picsum.photos/seed/authorwork1/200/280",
      chapterTitle: "第8章：反轉",
      wordCount: "3,200字",
      updatedAt: "刚刚更新",
    },
    likes: 128, comments: 86,
  },
  {
    id: "feed2", authorId: "author1", authorName: "TTES",
    authorAvatar: "https://i.pravatar.cc/150?u=ttes",
    content: "感謝大家的支持！《無限複製》登上了新書榜第一名！作為一個新人作者，真的非常感動。後面會繼續努力，給大家帶來更精彩的故事！",
    createdAt: "昨天",
    likes: 562, comments: 124,
  },
  {
    id: "feed3", authorId: "author1", authorName: "TTES",
    authorAvatar: "https://i.pravatar.cc/150?u=ttes",
    content: "新書《星際遠征》開始連載了！這次嘗試了硬科幻風格，希望大家喜歡。歡迎在評論區交流討論~",
    createdAt: "3天前",
    relatedWork: {
      title: "星際遠征 · 第1章：起程",
      cover: "https://picsum.photos/seed/authorwork3/200/280",
      chapterTitle: "第1章：起程",
      wordCount: "4,100字",
      updatedAt: "3天前",
    },
    likes: 345, comments: 67,
  },
];

export const mockAuthorReviews: AuthorReview[] = [
  {
    id: "review1", userId: "user20", userName: "夜行者",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=夜行者2",
    rating: 5, content: "絕對是今年看過最精彩的賽博朋克小說！節奏緊湊，反轉不斷，人物塑造也非常立體。零這個角色太有魅力了，外表冷酷強大，內心卻有著柔軟的一面。強烈推薦！",
    likes: 256, createdAt: "3天前",
  },
  {
    id: "review2", userId: "user21", userName: "星辰大海",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=星辰大海2",
    rating: 5, content: "文筆很好，氛圍感營造得非常到位。尤其是動作場面的描寫，畫面感超強。唯一的缺點就是更新有點慢，希望作者大大能加更！",
    likes: 128, createdAt: "5天前",
  },
  {
    id: "review3", userId: "user22", userName: "书虫小王",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=书虫2",
    rating: 4, content: "整体很不错，世界观设定很有创意。剧情推进节奏适中，人物关系处理得也很好。期待后续发展！",
    likes: 89, createdAt: "1周前",
  },
  {
    id: "review4", userId: "user23", userName: "科幻迷",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=科幻迷",
    rating: 5, content: "作为硬科幻爱好者，这部作品的科学设定让我非常满意。作者显然做了很多功课，物理概念运用得很准确。剧情也很吸引人，一口气看了十几章。",
    likes: 203, createdAt: "1周前",
  },
  {
    id: "review5", userId: "user24", userName: "阅读达人",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=阅读达人",
    rating: 4, content: "故事情节紧凑，人物性格鲜明。特别喜欢主角的成长线，从迷茫到坚定的转变写得很自然。",
    likes: 67, createdAt: "2周前",
  },
];

export const mockRatingDistribution: RatingDistribution[] = [
  { star: 5, percentage: 78, count: 987 },
  { star: 4, percentage: 15, count: 189 },
  { star: 3, percentage: 5, count: 63 },
  { star: 2, percentage: 1, count: 13 },
  { star: 1, percentage: 1, count: 12 },
];

// ===== Author Page Helper =====

export function getAuthorById(id: string): AuthorProfile | undefined {
  if (id === "author1" || id === "user1") return mockAuthorProfile;
  return undefined;
}

export function getAuthorWorksByAuthorId(authorId: string): AuthorWork[] {
  if (authorId === "author1" || authorId === "user1") return mockAuthorWorks;
  return [];
}

export function getAuthorFeedsByAuthorId(authorId: string): AuthorFeedItem[] {
  if (authorId === "author1" || authorId === "user1") return mockAuthorFeeds;
  return [];
}

export function getAuthorReviewsByAuthorId(authorId: string): AuthorReview[] {
  if (authorId === "author1" || authorId === "user1") return mockAuthorReviews;
  return [];
}
