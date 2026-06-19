// Static AMS demo data — single source for all screens.
// Realistic shape modelled on LinkedIn / GitHub / Trailhead / Datadog.

export const ME = {
  name: "Elias Vance",
  handle: "@eliasv",
  title: "Principal Engineer · Software Vala",
  location: "Berlin, DE",
  joined: "2022-03-14",
  initials: "EV",
  tier: "Diamond",
  rank: 5,
  level: 42,
  xp: 198640,
  xpNext: 201000,
  trustScore: 96,
  streak: 128,
  email: "elias.vance@softwarevala.com",
  passportId: "AMS-7F2A-DM-2026",
  verified: true,
};

export const PILLARS = [
  { label: "Trust", value: 96 },
  { label: "Contribution", value: 88 },
  { label: "Influence", value: 74 },
  { label: "Loyalty", value: 91 },
  { label: "Community", value: 82 },
];

export const RANKS = [
  { name: "Bronze", min: 0, color: "#c89668" },
  { name: "Silver", min: 5000, color: "#c0c0c0" },
  { name: "Gold", min: 25000, color: "#f5d77a" },
  { name: "Platinum", min: 75000, color: "#e5e4e2" },
  { name: "Diamond", min: 150000, color: "#9be5ff" },
  { name: "Champion", min: 250000, color: "#ff9b6a" },
  { name: "Legend", min: 500000, color: "#d97aff" },
];

export const ACHIEVEMENTS = [
  { name: "First Light", desc: "Activated AMS Passport", rarity: "Common", unlocked: true, date: "2022-03-14", xp: 50 },
  { name: "Trailblazer", desc: "Completed 10 missions in one season", rarity: "Rare", unlocked: true, date: "2023-07-02", xp: 500 },
  { name: "Vanguard", desc: "Top 1% contributor of the quarter", rarity: "Epic", unlocked: true, date: "2024-12-30", xp: 2500 },
  { name: "Architect", desc: "Authored 50 verified contributions", rarity: "Epic", unlocked: true, date: "2025-04-12", xp: 3000 },
  { name: "Mentor", desc: "Onboarded 25 new members", rarity: "Rare", unlocked: true, date: "2025-09-01", xp: 1200 },
  { name: "Immortal", desc: "Maintained Legend rank for 365 days", rarity: "Mythic", unlocked: false, xp: 10000 },
  { name: "Founder Circle", desc: "Invited into the Founder Circle", rarity: "Legendary", unlocked: false, xp: 8000 },
  { name: "Hall Eternal", desc: "Inducted into the Hall Of Fame", rarity: "Mythic", unlocked: false, xp: 15000 },
];

export const BADGES = [
  { name: "Verified Identity", tier: "Gold", earned: "2022-03-14" },
  { name: "Streak 100", tier: "Gold", earned: "2024-11-04" },
  { name: "Streak 30", tier: "Silver", earned: "2023-02-10" },
  { name: "Code Reviewer", tier: "Gold", earned: "2023-08-19" },
  { name: "Community Voice", tier: "Silver", earned: "2024-01-22" },
  { name: "Top Author", tier: "Platinum", earned: "2025-03-08" },
  { name: "Founder Sponsor", tier: "Diamond", earned: "2025-06-30" },
  { name: "Open Source", tier: "Gold", earned: "2024-05-14" },
  { name: "Speaker", tier: "Silver", earned: "2024-10-02" },
  { name: "Beta Pilot", tier: "Bronze", earned: "2022-09-01" },
  { name: "Bug Bounty", tier: "Silver", earned: "2023-11-15" },
  { name: "Champion Vendor", tier: "Diamond", earned: "2025-12-01" },
];

export const TROPHIES = [
  { name: "Champion 2025", category: "Annual", tier: "Gold", year: 2025 },
  { name: "Top Vendor Q4", category: "Quarterly", tier: "Diamond", year: 2025 },
  { name: "Founder Award", category: "Lifetime", tier: "Elite", year: 2024 },
  { name: "Innovation Cup", category: "Special", tier: "Gold", year: 2025 },
  { name: "Mentor Of The Year", category: "Annual", tier: "Platinum", year: 2024 },
  { name: "Open Source Hero", category: "Community", tier: "Gold", year: 2023 },
];

export const CERTIFICATES = [
  { id: "CERT-2025-0042", title: "Advanced AMS Architect", issued: "2025-11-10", issuer: "Software Vala Council", credId: "SV-AAA-7F2A" },
  { id: "CERT-2025-0011", title: "Verified Vendor Excellence", issued: "2025-04-22", issuer: "Software Vala Marketplace", credId: "SV-VVE-3K91" },
  { id: "CERT-2024-0123", title: "Community Champion", issued: "2024-12-15", issuer: "Hall Of Fame Committee", credId: "SV-CC-2P44" },
  { id: "CERT-2024-0067", title: "Open Source Maintainer", issued: "2024-06-30", issuer: "OSS Working Group", credId: "SV-OSM-9D12" },
];

export const MISSIONS = [
  { title: "Daily Login Streak", reward: "+120 XP", progress: 80, type: "Daily" },
  { title: "Verify 3 Contributions", reward: "+450 XP", progress: 66, type: "Weekly" },
  { title: "Mentor a New Member", reward: "Silver Badge", progress: 40, type: "Seasonal" },
  { title: "Reach 200K XP", reward: "Gold Trophy", progress: 92, type: "Milestone" },
  { title: "Publish 5 Articles", reward: "+1,200 XP", progress: 60, type: "Monthly" },
  { title: "Refer 10 Members", reward: "Founder Badge", progress: 30, type: "Seasonal" },
];

export const LEADERBOARD = [
  { rank: 1, name: "Aarav Mehta", role: "Top Vendor", xp: 248910, tier: "Legend", country: "IN" },
  { rank: 2, name: "Sofia Linden", role: "Top Author", xp: 231400, tier: "Champion", country: "SE" },
  { rank: 3, name: "Kenji Mori", role: "Top Reseller", xp: 218775, tier: "Champion", country: "JP" },
  { rank: 4, name: "Amara Okafor", role: "Top Influencer", xp: 204210, tier: "Diamond", country: "NG" },
  { rank: 5, name: "Elias Vance", role: "Top Contributor", xp: 198640, tier: "Diamond", country: "DE", you: true },
  { rank: 6, name: "Liam O'Brien", role: "Top Mentor", xp: 187330, tier: "Diamond", country: "IE" },
  { rank: 7, name: "Yuki Tanaka", role: "Top Reviewer", xp: 176800, tier: "Diamond", country: "JP" },
  { rank: 8, name: "Carla Mendes", role: "Top Speaker", xp: 165120, tier: "Platinum", country: "BR" },
  { rank: 9, name: "Noah Becker", role: "Top Engineer", xp: 158340, tier: "Platinum", country: "DE" },
  { rank: 10, name: "Priya Raman", role: "Top Architect", xp: 152910, tier: "Platinum", country: "IN" },
];

export const HALL_OF_FAME = [
  { year: 2025, name: "Aarav Mehta", title: "Vendor Of The Year", quote: "Set the bar for marketplace quality." },
  { year: 2024, name: "Sofia Linden", title: "Author Of The Year", quote: "Defined the technical voice of Software Vala." },
  { year: 2023, name: "Kenji Mori", title: "Reseller Of The Year", quote: "Built the global reseller blueprint." },
  { year: 2022, name: "Amara Okafor", title: "Founder Member", quote: "Pioneered the first Hall Of Fame cohort." },
];

export const REWARDS = [
  { name: "1 Month Pro Access", cost: 4500, type: "Subscription", available: true },
  { name: "Founders Hoodie", cost: 12000, type: "Merch", available: true },
  { name: "AMS Trophy Replica", cost: 25000, type: "Physical", available: true },
  { name: "1:1 Mentorship Hour", cost: 18000, type: "Experience", available: true },
  { name: "Conference Pass 2026", cost: 60000, type: "Event", available: false },
  { name: "Hall Of Fame Pin", cost: 8000, type: "Collectible", available: true },
];

export const COLLECTIONS = [
  { name: "Founders Pack", type: "Owned", items: 8, rarity: "Legendary" },
  { name: "Season 2025 Bundle", type: "Owned", items: 14, rarity: "Epic" },
  { name: "Mentor Toolkit", type: "Unlocked", items: 6, rarity: "Rare" },
  { name: "Vendor Suite", type: "Owned", items: 22, rarity: "Epic" },
  { name: "Speaker Kit", type: "Unlocked", items: 4, rarity: "Rare" },
  { name: "Diamond Drop 2026", type: "Owned", items: 5, rarity: "Mythic" },
];

export const JOURNEY = [
  { date: "2022-03-14", label: "Joined Software Vala", kind: "milestone" },
  { date: "2022-03-15", label: "First Login", kind: "event" },
  { date: "2022-04-02", label: "Earned First Badge", kind: "badge" },
  { date: "2022-09-01", label: "Reached Silver Rank", kind: "rank" },
  { date: "2023-02-10", label: "30-day Streak", kind: "streak" },
  { date: "2023-08-19", label: "Promoted to Code Reviewer", kind: "badge" },
  { date: "2024-01-22", label: "Reached Gold Rank", kind: "rank" },
  { date: "2024-12-30", label: "Earned Vanguard Achievement", kind: "achievement" },
  { date: "2025-04-12", label: "Reached Platinum Rank", kind: "rank" },
  { date: "2025-12-01", label: "Reached Diamond Rank", kind: "rank" },
  { date: "2026-06-14", label: "128-day Streak", kind: "streak" },
];

// 365-day contribution heatmap deterministic seed (0..4 intensity).
export const HEATMAP: number[] = Array.from({ length: 365 }, (_, i) => {
  const v = Math.floor(((i * 9301 + 49297) % 233280) / 233280 * 5);
  // weight: more activity recently
  const recencyBoost = i > 300 ? 1 : 0;
  return Math.min(4, v + recencyBoost);
});

export const XP_TREND = [
  { m: "Jan", v: 142000 },
  { m: "Feb", v: 148500 },
  { m: "Mar", v: 156200 },
  { m: "Apr", v: 162900 },
  { m: "May", v: 170100 },
  { m: "Jun", v: 178400 },
  { m: "Jul", v: 184700 },
  { m: "Aug", v: 189300 },
  { m: "Sep", v: 192800 },
  { m: "Oct", v: 195400 },
  { m: "Nov", v: 197500 },
  { m: "Dec", v: 198640 },
];

export const ENGAGEMENT = [
  { label: "Sessions / week", value: 14, delta: "+8%" },
  { label: "Avg. session", value: "23m", delta: "+2m" },
  { label: "Active days", value: "27 / 30", delta: "+3" },
  { label: "Contributions", value: 188, delta: "+12%" },
  { label: "Reactions given", value: 1240, delta: "+18%" },
  { label: "Reactions received", value: 3982, delta: "+24%" },
];

export const CONNECTED = [
  { name: "GitHub", handle: "elias-vance", connected: true },
  { name: "LinkedIn", handle: "in/eliasvance", connected: true },
  { name: "Google", handle: "elias.vance@gmail.com", connected: true },
  { name: "Microsoft Entra", handle: "elias.vance@softwarevala.com", connected: true },
  { name: "Apple ID", handle: "elias.vance@icloud.com", connected: false },
  { name: "Discord", handle: "eliasv#0042", connected: true },
];

export const NOTIFICATIONS_PREFS = [
  { label: "Achievement unlocked", email: true, push: true },
  { label: "New badge earned", email: true, push: true },
  { label: "Rank promotion", email: true, push: true },
  { label: "Mission deadline", email: false, push: true },
  { label: "Leaderboard movement", email: false, push: false },
  { label: "Weekly digest", email: true, push: false },
];
