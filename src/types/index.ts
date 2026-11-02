export type UserRole = 'owner' | 'management' | 'player' | 'superadmin' | 'guest';

export type ManagementPermission = 
  | 'tournament_manager'
  | 'team_manager'
  | 'match_manager'
  | 'score_verification_manager'
  | 'auction_manager'
  | 'bracket_manager';

export type PlayerStatus = 
  | 'Registered'
  | 'Available for Auction'
  | 'Auction Pending'
  | 'Selected'
  | 'Not Selected'
  | 'Active'
  | 'Suspended'
  | 'Tournament Completed';

export interface UserAccount {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  roleLocked: boolean;
  roleSelectedAt: string;
  profilePicture: string;
  efootballUsername: string;
  efootballId: string;
  accountStatus: 'active' | 'suspended' | 'pending';
  managementPermissions?: ManagementPermission[];
  createdAt: string;
}

export interface PlayerStats {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  individualPoints: number; // Win = 1, Draw = 0.5, Loss = 0
  winRate: number;
}

export interface PlayerProfile extends UserAccount {
  position: 'CF' | 'SS' | 'LWF' | 'RWF' | 'AMF' | 'CMF' | 'DMF' | 'CB' | 'LB' | 'RB' | 'GK';
  overallRating: number;
  teamId?: string;
  teamName?: string;
  auctionStatus: PlayerStatus;
  soldPrice?: number;
  stats: PlayerStats;
}

export interface Team {
  teamId: string;
  teamName: string;
  teamTag: string;
  teamLogo: string;
  description: string;
  ownerId: string;
  ownerName: string;
  tournamentId: string;
  squadPlayerIds: string[]; // Exactly 10 players for BID team tournaments
  budget: number; // Virtual tournament credits, e.g. 10,000,000
  spentBudget: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  totalPoints: number; // Win=1, Draw=0.5, Loss=0
  status: 'active' | 'eliminated' | 'replaced' | 'champion';
  createdAt: string;
}

export type TournamentType = 'solo' | 'bid_team';

export type TournamentStatus = 
  | 'registration_open'
  | 'registration_locked'
  | 'auction_live'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Tournament {
  tournamentId: string;
  title: string;
  type: TournamentType;
  status: TournamentStatus;
  registrationDeadline: string;
  startTime: string;
  participantCount: number;
  bracketSize: number; // 4, 8, 16, 32, 64
  bannerUrl: string;
  currentRound: string;
  timezone: string; // e.g., 'Asia/Dhaka'
  description: string;
  prizePool: string;
  championId?: string;
  championName?: string;
  championLogo?: string;
  createdAt: string;
}

export interface AuctionBid {
  bidId: string;
  auctionId: string;
  teamId: string;
  teamName: string;
  ownerId: string;
  ownerName: string;
  amount: number;
  timestamp: string;
}

export interface AuctionItem {
  auctionId: string;
  tournamentId: string;
  playerId: string;
  playerName: string;
  playerPhoto: string;
  efootballUsername: string;
  efootballId: string;
  position: string;
  rating: number;
  startingBid: number;
  currentHighestBid: number;
  highestBidderTeamId?: string;
  highestBidderTeamName?: string;
  status: 'upcoming' | 'live' | 'sold' | 'unsold';
  endsAt: string;
  bidHistory: AuctionBid[];
}

export interface IndividualPlayerMatch {
  matchIndex: number; // 1 to 10 for BID tournament encounters
  playerAId: string;
  playerAName: string;
  playerAScore: number;
  playerBId: string;
  playerBName: string;
  playerBScore: number;
  winnerPlayerId?: string;
  isDraw: boolean;
  status: 'scheduled' | 'completed';
}

export interface TeamEncounterMatch {
  encounterId: string;
  tournamentId: string;
  roundId: string;
  roundName: string; // 'Round of 16', 'Quarter Final', 'Semi Final', 'Final'
  matchNumber: number;
  bracketSide: 'left' | 'right' | 'center';
  teamAId: string;
  teamAName: string;
  teamALogo: string;
  teamBId: string;
  teamBName: string;
  teamBLogo: string;
  scheduledTime: string;
  deadlineTime: string;
  status: 'upcoming' | 'scheduled' | 'live' | 'pending_verification' | 'completed' | 'cancelled';
  teamAPoints: number; // Win=1, Draw=0.5, Loss=0
  teamBPoints: number;
  winnerId?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  individualMatches: IndividualPlayerMatch[];
  isBye?: boolean;
}

export interface SoloMatch {
  matchId: string;
  tournamentId: string;
  roundName: string;
  matchNumber: number;
  bracketSide: 'left' | 'right' | 'center';
  playerAId: string;
  playerAName: string;
  playerAPhoto: string;
  playerAScore: number;
  playerBId: string;
  playerBName: string;
  playerBPhoto: string;
  playerBScore: number;
  winnerId?: string;
  status: 'upcoming' | 'scheduled' | 'live' | 'pending_verification' | 'completed';
  scheduledTime: string;
  verified: boolean;
  isBye?: boolean;
}

export interface BracketNode {
  nodeId: string;
  tournamentId: string;
  roundNumber: number;
  roundName: string;
  bracketSide: 'left' | 'right' | 'center';
  positionIndex: number;
  matchId?: string;
  participantA?: {
    id: string;
    name: string;
    logo?: string;
    score?: number;
    isBye?: boolean;
  };
  participantB?: {
    id: string;
    name: string;
    logo?: string;
    score?: number;
    isBye?: boolean;
  };
  winnerId?: string;
  status: 'upcoming' | 'live' | 'completed';
  isBye?: boolean;
  nextMatchNodeId?: string;
  nextMatchSlot?: 'A' | 'B';
}

export interface TeamReplacementRecord {
  replacementId: string;
  tournamentId: string;
  previousTeamId: string;
  previousTeamName: string;
  replacementTeamId: string;
  replacementTeamName: string;
  managerId: string;
  managerName: string;
  reason: string;
  timestamp: string;
  affectedMatchesCount: number;
  verifiedResultsPreserved: boolean;
}

export interface AuditLog {
  logId: string;
  action: string;
  userId: string;
  userRole: string;
  details: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'security';
}

export interface TournamentAnnouncement {
  id: string;
  tournamentId?: string;
  title: string;
  content: string;
  category: 'schedule' | 'bracket' | 'rules' | 'urgent' | 'general';
  isPinned: boolean;
  author: string;
  authorRole: string;
  timestamp: string;
  linkText?: string;
  linkTab?: string;
}

export interface NotificationItem {
  id: string;
  targetRole?: UserRole | 'all';
  targetUserId?: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'auction' | 'match' | 'tournament' | 'system';
  read: boolean;
}

export type ThemeMode = 'dark' | 'light' | 'system';
export type LanguageMode = 'en' | 'bn';
export type DeviceFrameMode = 'responsive' | 'iphone' | 'android';
