export type AppRole = "player" | "leader" | "admin";
export type PlatformCode = "pc" | "playstation" | "xbox" | "switch" | "mobile";
export type AttendanceStatus = "going" | "maybe" | "declined";
export type RequestStatus = "pending" | "approved" | "rejected" | "cancelled";
export type EventVisibility = "public" | "members_only";
export type ClanVisibility = "public" | "private";
export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";
export type LfgStatus = "active" | "expired" | "closed";
export type ReviewKind = "player" | "clan";

export interface AvailabilitySlot {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  from: string;
  to: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  genre: string;
  roles: string[];
}

export interface Platform {
  id: string;
  code: PlatformCode;
  name: string;
}

export interface Profile {
  id: string;
  authUserId: string;
  nick: string;
  fullName: string;
  email: string;
  role: AppRole;
  avatarUrl: string;
  bio: string;
  languages: string[];
  mainPlatform: PlatformCode;
  favoriteGameIds: string[];
  gameplayRoles: string[];
  reliabilityScore: number;
  timezone: string;
  availability: AvailabilitySlot[];
}

export interface Clan {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  gameId: string;
  preferredPlatforms: PlatformCode[];
  languages: string[];
  playstyle: "casual" | "ranked" | "competitive" | "mixed";
  visibility: ClanVisibility;
  scheduleSummary: string;
  requirements: string[];
  leaderProfileId: string;
  memberCount: number;
  openRoles: string[];
}

export interface ClanMember {
  id: string;
  clanId: string;
  profileId: string;
  role: "leader" | "officer" | "member";
  joinedAt: string;
}

export interface ClanJoinRequest {
  id: string;
  clanId: string;
  profileId: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
}

export interface Event {
  id: string;
  clanId: string;
  gameId: string;
  title: string;
  description: string;
  startsAt: string;
  capacity: number;
  visibility: EventVisibility;
  attendeeCount: number;
}

export interface EventAttendee {
  id: string;
  eventId: string;
  profileId: string;
  status: AttendanceStatus;
}

export interface LfgPost {
  id: string;
  profileId: string;
  gameId: string;
  title: string;
  description: string;
  platforms: PlatformCode[];
  desiredRoles: string[];
  languages: string[];
  expiresAt: string;
  status: LfgStatus;
}

export interface Review {
  id: string;
  authorProfileId: string;
  targetProfileId: string;
  kind: ReviewKind;
  score: number;
  comment: string;
}

export interface Report {
  id: string;
  reporterProfileId: string;
  targetType: "profile" | "clan" | "lfg_post";
  targetId: string;
  reason: string;
  details: string;
  status: ReportStatus;
  createdAt: string;
}

export interface CompatibilityBreakdown {
  schedule: number;
  gamePlatform: number;
  roleFit: number;
  languageFit: number;
  reliability: number;
}

export interface CompatibilityResult {
  score: number;
  breakdown: CompatibilityBreakdown;
  summary: string;
}

export interface AuthFixture {
  email: string;
  password: string;
  profileId: string;
}
