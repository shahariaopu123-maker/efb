import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserAccount, 
  UserRole, 
  PlayerProfile, 
  Team, 
  Tournament, 
  AuctionItem, 
  TeamEncounterMatch, 
  BracketNode, 
  TeamReplacementRecord, 
  AuditLog, 
  NotificationItem,
  TournamentAnnouncement,
  ThemeMode,
  LanguageMode,
  DeviceFrameMode,
  ManagementPermission,
  TournamentType
} from '../types';
import { 
  SEED_USERS, 
  SEED_PLAYERS, 
  SEED_TEAMS, 
  SEED_TOURNAMENTS, 
  SEED_AUCTION_ITEMS, 
  SEED_MATCHES, 
  SEED_BRACKET_NODES, 
  SEED_AUDIT_LOGS, 
  SEED_NOTIFICATIONS,
  SEED_ANNOUNCEMENTS,
  generateTenMatches
} from '../data/seedData';

interface AppContextType {
  // Auth & Roles
  currentUser: UserAccount | null;
  isGuest: boolean;
  userRole: UserRole;
  loginAsUser: (userId: string) => void;
  continueAsGuest: () => void;
  logout: () => void;
  registerAccount: (accountData: Omit<UserAccount, 'userId' | 'roleLocked' | 'roleSelectedAt' | 'createdAt'>) => void;
  deleteAccount: (userId: string) => void;
  hasPermission: (permission: ManagementPermission) => boolean;

  // Tournaments
  tournaments: Tournament[];
  activeTournamentId: string;
  activeTournament: Tournament | null;
  setActiveTournamentId: (id: string) => void;
  createTournament: (data: { title: string; type: TournamentType; maxParticipants: number; timezone: string; prizePool: string; description: string }) => Tournament;
  lockRegistration: (tournamentId: string) => void;

  // Teams & Squads (10-Player strict for BID)
  teams: Team[];
  players: PlayerProfile[];
  createTeam: (teamData: { teamName: string; teamTag: string; teamLogo: string; description: string; ownerId: string; ownerName: string; tournamentId: string }) => Team;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  replaceTeamInTournament: (tournamentId: string, oldTeamId: string, newTeamId: string, reason: string) => boolean;
  replacements: TeamReplacementRecord[];

  // Auction System
  auctionItems: AuctionItem[];
  placeAuctionBid: (auctionId: string, teamId: string, bidAmount: number) => { success: boolean; message: string };
  closeAuctionItem: (auctionId: string) => void;

  // Matches & Scoring (10-matches per encounter)
  matches: TeamEncounterMatch[];
  submitEncounterScore: (encounterId: string, individualMatchIndex: number, pAScore: number, pBScore: number) => void;
  verifyEncounterResults: (encounterId: string) => void;
  correctOfficialScore: (encounterId: string, teamAPoints: number, teamBPoints: number, reason: string) => void;

  // Bracket Nodes & Progression
  bracketNodes: BracketNode[];
  generateBracketForTournament: (tournamentId: string, teamList: Team[]) => void;

  // Logs, Notifications & Real-Time Announcements
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  addAuditLog: (action: string, details: string, severity?: 'info' | 'warning' | 'security') => void;
  announcements: TournamentAnnouncement[];
  postAnnouncement: (data: Omit<TournamentAnnouncement, 'id' | 'timestamp'>) => void;
  togglePinAnnouncement: (id: string) => void;
  deleteAnnouncement: (id: string) => void;
  dismissAnnouncement: (id: string) => void;
  dismissedAnnouncementIds: string[];

  // Settings & Preferences
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  deviceFrame: DeviceFrameMode;
  setDeviceFrame: (frame: DeviceFrameMode) => void;

  // Modal controls
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isBuildGuideOpen: boolean;
  setIsBuildGuideOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or seeds
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('efbtour_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEED_USERS[0]; // Default logged-in as Team Owner for immediate interactive demonstration
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('efbtour_is_guest') === 'true';
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('efbtour_tournaments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEED_TOURNAMENTS;
  });

  const [activeTournamentId, setActiveTournamentId] = useState<string>('tourn-asia-bid-01');

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('efbtour_teams');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEED_TEAMS;
  });

  const [players, setPlayers] = useState<PlayerProfile[]>(() => {
    const saved = localStorage.getItem('efbtour_players');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEED_PLAYERS;
  });

  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>(() => {
    const saved = localStorage.getItem('efbtour_auctions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEED_AUCTION_ITEMS;
  });

  const [matches, setMatches] = useState<TeamEncounterMatch[]>(() => {
    const saved = localStorage.getItem('efbtour_matches');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEED_MATCHES;
  });

  const [bracketNodes, setBracketNodes] = useState<BracketNode[]>(() => {
    const saved = localStorage.getItem('efbtour_bracket_nodes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEED_BRACKET_NODES;
  });

  const [replacements, setReplacements] = useState<TeamReplacementRecord[]>(() => {
    const saved = localStorage.getItem('efbtour_replacements');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('efbtour_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEED_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('efbtour_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEED_NOTIFICATIONS;
  });

  const [announcements, setAnnouncements] = useState<TournamentAnnouncement[]>(() => {
    const saved = localStorage.getItem('efbtour_announcements');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SEED_ANNOUNCEMENTS;
  });

  const [dismissedAnnouncementIds, setDismissedAnnouncementIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('efbtour_dismissed_announcements');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Settings
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('efbtour_theme') as ThemeMode) || 'dark';
  });

  const [language, setLanguageState] = useState<LanguageMode>(() => {
    return (localStorage.getItem('efbtour_lang') as LanguageMode) || 'en';
  });

  const [deviceFrame, setDeviceFrame] = useState<DeviceFrameMode>('responsive');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBuildGuideOpen, setIsBuildGuideOpen] = useState(false);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    localStorage.setItem('efbtour_theme', theme);
  }, [theme]);

  // Sync localStorage persistence
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('efbtour_current_user', JSON.stringify(currentUser));
      localStorage.setItem('efbtour_is_guest', 'false');
    } else {
      localStorage.removeItem('efbtour_current_user');
      localStorage.setItem('efbtour_is_guest', isGuest ? 'true' : 'false');
    }
  }, [currentUser, isGuest]);

  useEffect(() => {
    localStorage.setItem('efbtour_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('efbtour_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('efbtour_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('efbtour_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('efbtour_bracket_nodes', JSON.stringify(bracketNodes));
  }, [bracketNodes]);

  useEffect(() => {
    localStorage.setItem('efbtour_auctions', JSON.stringify(auctionItems));
  }, [auctionItems]);

  useEffect(() => {
    localStorage.setItem('efbtour_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('efbtour_replacements', JSON.stringify(replacements));
  }, [replacements]);

  useEffect(() => {
    localStorage.setItem('efbtour_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('efbtour_dismissed_announcements', JSON.stringify(dismissedAnnouncementIds));
  }, [dismissedAnnouncementIds]);

  const postAnnouncement = (data: Omit<TournamentAnnouncement, 'id' | 'timestamp'>) => {
    const newAnnouncement: TournamentAnnouncement = {
      ...data,
      id: `ann-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    addAuditLog(
      'Tournament Announcement Posted',
      `Posted update: "${newAnnouncement.title}" [Category: ${newAnnouncement.category.toUpperCase()}]`,
      newAnnouncement.category === 'urgent' ? 'warning' : 'info'
    );
  };

  const togglePinAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addAuditLog('Announcement Deleted', `Deleted announcement ID ${id}`);
  };

  const dismissAnnouncement = (id: string) => {
    setDismissedAnnouncementIds(prev => [...prev, id]);
  };

  const setTheme = (t: ThemeMode) => setThemeState(t);
  const setLanguage = (l: LanguageMode) => {
    setLanguageState(l);
    localStorage.setItem('efbtour_lang', l);
  };

  const addAuditLog = (action: string, details: string, severity: 'info' | 'warning' | 'security' = 'info') => {
    const newLog: AuditLog = {
      logId: `log-${Date.now()}`,
      action,
      userId: currentUser?.userId || 'guest',
      userRole: currentUser?.role || 'Guest',
      details,
      timestamp: new Date().toISOString(),
      severity
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const loginAsUser = (userId: string) => {
    const found = SEED_USERS.find(u => u.userId === userId);
    if (found) {
      setCurrentUser(found);
      setIsGuest(false);
      addAuditLog('User Login', `Logged in as ${found.fullName} (${found.role.toUpperCase()})`);
    }
  };

  const continueAsGuest = () => {
    setCurrentUser(null);
    setIsGuest(true);
    addAuditLog('Public Guest Mode', 'Visitor entered public match center (no login required)');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsGuest(true);
    addAuditLog('User Logout', 'Session ended');
  };

  const registerAccount = (accountData: Omit<UserAccount, 'userId' | 'roleLocked' | 'roleSelectedAt' | 'createdAt'>) => {
    const newAcc: UserAccount = {
      ...accountData,
      userId: `user-${Date.now()}`,
      roleLocked: true, // Permanent role lock
      roleSelectedAt: new Date().toISOString(),
      accountStatus: 'active',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newAcc);
    setIsGuest(false);
    addAuditLog('Account Registered', `Created account ${newAcc.username} with locked role: ${newAcc.role.toUpperCase()}`, 'security');
  };

  const deleteAccount = (userId: string) => {
    addAuditLog('Account Deletion', `Account ${userId} securely erased. Role lock lifted. User may now re-register with fresh role.`, 'warning');
    setCurrentUser(null);
    setIsGuest(true);
    localStorage.removeItem('efbtour_current_user');
  };

  const hasPermission = (permission: ManagementPermission): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin') return true;
    if (currentUser.role === 'management') {
      return currentUser.managementPermissions?.includes(permission) ?? true;
    }
    return false;
  };

  const activeTournament = tournaments.find(t => t.tournamentId === activeTournamentId) || tournaments[0] || null;

  // Lock Tournament Registration
  const lockRegistration = (tournamentId: string) => {
    setTournaments(prev => prev.map(t => {
      if (t.tournamentId === tournamentId) {
        return { ...t, status: 'registration_locked' };
      }
      return t;
    }));
    addAuditLog('Registration Locked', `Tournament ${tournamentId} registration is locked. No new regular teams permitted.`, 'warning');
  };

  // Create Team (Unlimited teams support)
  const createTeam = (teamData: { 
    teamName: string; 
    teamTag: string; 
    teamLogo: string; 
    description: string; 
    ownerId: string; 
    ownerName: string; 
    tournamentId: string 
  }): Team => {
    const newTeam: Team = {
      teamId: `team-${Date.now()}`,
      teamName: teamData.teamName,
      teamTag: teamData.teamTag.toUpperCase(),
      teamLogo: teamData.teamLogo || '⚽',
      description: teamData.description,
      ownerId: teamData.ownerId,
      ownerName: teamData.ownerName,
      tournamentId: teamData.tournamentId,
      squadPlayerIds: [],
      budget: 10000000,
      spentBudget: 0,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      totalPoints: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setTeams(prev => [newTeam, ...prev]);
    addAuditLog('Team Created', `Created team "${newTeam.teamName}" [${newTeam.teamTag}] for owner ${newTeam.ownerName}`);
    return newTeam;
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(t => t.teamId === teamId ? { ...t, ...updates } : t));
    addAuditLog('Team Updated', `Updated details for team ${teamId}`);
  };

  // Team Replacement System (Post-Start)
  const replaceTeamInTournament = (
    tournamentId: string, 
    oldTeamId: string, 
    newTeamId: string, 
    reason: string
  ): boolean => {
    const oldTeam = teams.find(t => t.teamId === oldTeamId);
    const newTeam = teams.find(t => t.teamId === newTeamId);
    if (!oldTeam || !newTeam) return false;

    // 1. Mark old team as replaced
    setTeams(prev => prev.map(t => {
      if (t.teamId === oldTeamId) return { ...t, status: 'replaced' };
      return t;
    }));

    // 2. Count affected future matches and replace slot in matches and bracket without transferring old scores!
    let affectedCount = 0;

    setMatches(prev => prev.map(m => {
      if (m.tournamentId !== tournamentId) return m;
      // Do not alter completed verified matches!
      if (m.status === 'completed' && m.verified) return m;

      let changed = false;
      let newMA = { ...m };
      if (m.teamAId === oldTeamId) {
        newMA.teamAId = newTeam.teamId;
        newMA.teamAName = newTeam.teamName;
        newMA.teamALogo = newTeam.teamLogo;
        changed = true;
      }
      if (m.teamBId === oldTeamId) {
        newMA.teamBId = newTeam.teamId;
        newMA.teamBName = newTeam.teamName;
        newMA.teamBLogo = newTeam.teamLogo;
        changed = true;
      }
      if (changed) {
        affectedCount++;
        return newMA;
      }
      return m;
    }));

    // Update bracket nodes
    setBracketNodes(prev => prev.map(node => {
      if (node.tournamentId !== tournamentId) return node;
      let updatedNode = { ...node };
      if (node.participantA?.id === oldTeamId) {
        updatedNode.participantA = {
          ...node.participantA,
          id: newTeam.teamId,
          name: newTeam.teamName,
          logo: newTeam.teamLogo
        };
      }
      if (node.participantB?.id === oldTeamId) {
        updatedNode.participantB = {
          ...node.participantB,
          id: newTeam.teamId,
          name: newTeam.teamName,
          logo: newTeam.teamLogo
        };
      }
      return updatedNode;
    }));

    // 3. Record mandatory replacement audit log
    const replacementRecord: TeamReplacementRecord = {
      replacementId: `rep-${Date.now()}`,
      tournamentId,
      previousTeamId: oldTeam.teamId,
      previousTeamName: oldTeam.teamName,
      replacementTeamId: newTeam.teamId,
      replacementTeamName: newTeam.teamName,
      managerId: currentUser?.userId || 'unknown-manager',
      managerName: currentUser?.fullName || 'Tournament Director',
      reason,
      timestamp: new Date().toISOString(),
      affectedMatchesCount: affectedCount,
      verifiedResultsPreserved: true
    };

    setReplacements(prev => [replacementRecord, ...prev]);

    addAuditLog(
      'Team Replacement Executed', 
      `Replaced "${oldTeam.teamName}" with "${newTeam.teamName}". Reason: ${reason}. Historical verified scores strictly preserved.`, 
      'warning'
    );

    return true;
  };

  // Place Auction Bid
  const placeAuctionBid = (auctionId: string, teamId: string, bidAmount: number): { success: boolean; message: string } => {
    const item = auctionItems.find(a => a.auctionId === auctionId);
    const team = teams.find(t => t.teamId === teamId);

    if (!item) return { success: false, message: 'Auction item not found' };
    if (!team) return { success: false, message: 'Team not found' };

    // Strict 10-player squad limit rule
    if (team.squadPlayerIds.length >= 10) {
      return { 
        success: false, 
        message: 'Strict Squad Limit: Team already has maximum 10 active players!' 
      };
    }

    const availableBudget = team.budget - team.spentBudget;
    if (bidAmount > availableBudget) {
      return { 
        success: false, 
        message: `Insufficient Virtual Budget! Available: ৳ ${availableBudget.toLocaleString()}` 
      };
    }

    if (bidAmount <= item.currentHighestBid) {
      return { 
        success: false, 
        message: `Bid must exceed current highest bid (৳ ${item.currentHighestBid.toLocaleString()})` 
      };
    }

    const newBid = {
      bidId: `bid-${Date.now()}`,
      auctionId,
      teamId: team.teamId,
      teamName: team.teamName,
      ownerId: team.ownerId,
      ownerName: team.ownerName,
      amount: bidAmount,
      timestamp: new Date().toISOString()
    };

    setAuctionItems(prev => prev.map(a => {
      if (a.auctionId === auctionId) {
        return {
          ...a,
          currentHighestBid: bidAmount,
          highestBidderTeamId: team.teamId,
          highestBidderTeamName: team.teamName,
          bidHistory: [newBid, ...a.bidHistory]
        };
      }
      return a;
    }));

    addAuditLog(
      'Auction Bid Placed',
      `${team.teamName} placed bid ৳ ${bidAmount.toLocaleString()} for player ${item.playerName}`
    );

    return { success: true, message: `Bid of ৳ ${bidAmount.toLocaleString()} placed successfully!` };
  };

  // Close Auction and assign player to winning team
  const closeAuctionItem = (auctionId: string) => {
    const item = auctionItems.find(a => a.auctionId === auctionId);
    if (!item || !item.highestBidderTeamId) return;

    const winningTeamId = item.highestBidderTeamId;
    const finalPrice = item.currentHighestBid;

    // Deduct budget and add to winning team
    setTeams(prev => prev.map(t => {
      if (t.teamId === winningTeamId) {
        return {
          ...t,
          spentBudget: t.spentBudget + finalPrice,
          squadPlayerIds: [...t.squadPlayerIds, item.playerId]
        };
      }
      return t;
    }));

    // Update player profile
    setPlayers(prev => prev.map(p => {
      if (p.userId === item.playerId) {
        return {
          ...p,
          teamId: winningTeamId,
          teamName: item.highestBidderTeamName,
          auctionStatus: 'Selected',
          soldPrice: finalPrice
        };
      }
      return p;
    }));

    // Update auction status
    setAuctionItems(prev => prev.map(a => {
      if (a.auctionId === auctionId) {
        return { ...a, status: 'sold' };
      }
      return a;
    }));

    addAuditLog(
      'Auction Completed',
      `Player ${item.playerName} SOLD to ${item.highestBidderTeamName} for ৳ ${finalPrice.toLocaleString()}`,
      'info'
    );
  };

  // Match Scoring System: Submit individual match score in a 10-match encounter
  const submitEncounterScore = (
    encounterId: string, 
    individualMatchIndex: number, 
    pAScore: number, 
    pBScore: number
  ) => {
    setMatches(prev => prev.map(m => {
      if (m.encounterId !== encounterId) return m;

      const updatedIndividual = m.individualMatches.map(im => {
        if (im.matchIndex === individualMatchIndex) {
          const isDraw = pAScore === pBScore;
          const winnerPlayerId = isDraw ? undefined : pAScore > pBScore ? im.playerAId : im.playerBId;
          return {
            ...im,
            playerAScore: pAScore,
            playerBScore: pBScore,
            isDraw,
            winnerPlayerId,
            status: 'completed' as const
          };
        }
        return im;
      });

      // Recalculate aggregate team points: Win=1, Draw=0.5, Loss=0
      let tAPoints = 0;
      let tBPoints = 0;
      updatedIndividual.forEach(im => {
        if (im.status === 'completed') {
          if (im.isDraw) {
            tAPoints += 0.5;
            tBPoints += 0.5;
          } else if (im.playerAScore > im.playerBScore) {
            tAPoints += 1.0;
          } else {
            tBPoints += 1.0;
          }
        }
      });

      return {
        ...m,
        individualMatches: updatedIndividual,
        teamAPoints: tAPoints,
        teamBPoints: tBPoints,
        status: 'pending_verification'
      };
    }));
  };

  // Verify Encounter Results & Auto-Advance in Bracket
  const verifyEncounterResults = (encounterId: string) => {
    const encounter = matches.find(m => m.encounterId === encounterId);
    if (!encounter) return;

    const winnerId = encounter.teamAPoints > encounter.teamBPoints ? encounter.teamAId : encounter.teamBId;
    const winnerName = encounter.teamAPoints > encounter.teamBPoints ? encounter.teamAName : encounter.teamBName;
    const winnerLogo = encounter.teamAPoints > encounter.teamBPoints ? encounter.teamALogo : encounter.teamBLogo;

    // 1. Mark match verified
    setMatches(prev => prev.map(m => {
      if (m.encounterId === encounterId) {
        return {
          ...m,
          status: 'completed',
          verified: true,
          winnerId,
          verifiedBy: currentUser?.fullName || 'Tanvir Hasan (Management)',
          verifiedAt: new Date().toISOString()
        };
      }
      return m;
    }));

    // 2. Update Leaderboard stats for both teams
    const isADraw = encounter.teamAPoints === encounter.teamBPoints;
    const isAWinner = encounter.teamAPoints > encounter.teamBPoints;

    setTeams(prev => prev.map(t => {
      if (t.teamId === encounter.teamAId) {
        return {
          ...t,
          matchesPlayed: t.matchesPlayed + 1,
          wins: t.wins + (isAWinner ? 1 : 0),
          draws: t.draws + (isADraw ? 1 : 0),
          losses: t.losses + (!isAWinner && !isADraw ? 1 : 0),
          totalPoints: t.totalPoints + encounter.teamAPoints
        };
      }
      if (t.teamId === encounter.teamBId) {
        return {
          ...t,
          matchesPlayed: t.matchesPlayed + 1,
          wins: t.wins + (!isAWinner && !isADraw ? 1 : 0),
          draws: t.draws + (isADraw ? 1 : 0),
          losses: t.losses + (isAWinner ? 1 : 0),
          totalPoints: t.totalPoints + encounter.teamBPoints
        };
      }
      return t;
    }));

    // 3. Advance Winner in Symmetrical Bracket Nodes!
    setBracketNodes(prev => {
      const currentBracketNode = prev.find(n => n.matchId === encounterId);
      if (!currentBracketNode) return prev;

      return prev.map(node => {
        // Update current node
        if (node.nodeId === currentBracketNode.nodeId) {
          return {
            ...node,
            winnerId,
            status: 'completed',
            participantA: node.participantA ? { ...node.participantA, score: encounter.teamAPoints } : undefined,
            participantB: node.participantB ? { ...node.participantB, score: encounter.teamBPoints } : undefined
          };
        }

        // Advance into next node
        if (currentBracketNode.nextMatchNodeId && node.nodeId === currentBracketNode.nextMatchNodeId) {
          const slot = currentBracketNode.nextMatchSlot;
          if (slot === 'A') {
            return {
              ...node,
              participantA: {
                id: winnerId,
                name: winnerName,
                logo: winnerLogo
              }
            };
          } else if (slot === 'B') {
            return {
              ...node,
              participantB: {
                id: winnerId,
                name: winnerName,
                logo: winnerLogo
              }
            };
          }
        }

        return node;
      });
    });

    // Check if this was the Grand Final
    if (encounter.roundId === 'final') {
      setTournaments(prev => prev.map(t => {
        if (t.tournamentId === encounter.tournamentId) {
          return {
            ...t,
            status: 'completed',
            championId: winnerId,
            championName: winnerName,
            championLogo: winnerLogo
          };
        }
        return t;
      }));

      // Fire victory confetti celebration!
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore in tests
      }

      addAuditLog(
        'Champion Crowned!',
        `Official Tournament Complete! ${winnerName} is crowned the Champion of ${activeTournament?.title}!`,
        'warning'
      );
    } else {
      addAuditLog(
        'Match Result Verified',
        `Management verified ${encounter.roundName}: ${encounter.teamAName} (${encounter.teamAPoints}) vs ${encounter.teamBName} (${encounter.teamBPoints}). Winner ${winnerName} advanced in bracket.`
      );
    }
  };

  // Correct Official Score with Audit Log
  const correctOfficialScore = (encounterId: string, teamAPoints: number, teamBPoints: number, reason: string) => {
    setMatches(prev => prev.map(m => {
      if (m.encounterId === encounterId) {
        const winnerId = teamAPoints > teamBPoints ? m.teamAId : m.teamBId;
        return {
          ...m,
          teamAPoints,
          teamBPoints,
          winnerId,
          verified: true,
          verifiedBy: `${currentUser?.fullName || 'Super Admin'} (Correction)`
        };
      }
      return m;
    }));

    addAuditLog(
      'Official Score Corrected',
      `Match ${encounterId} corrected to ${teamAPoints} - ${teamBPoints}. Reason: ${reason}`,
      'security'
    );
  };

  // Create Tournament
  const createTournament = (data: { 
    title: string; 
    type: TournamentType; 
    maxParticipants: number; 
    timezone: string; 
    prizePool: string; 
    description: string 
  }): Tournament => {
    // calculate next power of 2 for bracket
    const count = data.maxParticipants;
    let bracketSize = 4;
    while (bracketSize < count) {
      bracketSize *= 2;
    }

    const newTournament: Tournament = {
      tournamentId: `tourn-${Date.now()}`,
      title: data.title,
      type: data.type,
      status: 'registration_open',
      registrationDeadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      startTime: new Date(Date.now() + 10 * 86400000).toISOString(),
      participantCount: 0,
      bracketSize,
      bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
      currentRound: 'Registration Open',
      timezone: data.timezone || 'Asia/Dhaka',
      description: data.description,
      prizePool: data.prizePool,
      createdAt: new Date().toISOString()
    };

    setTournaments(prev => [newTournament, ...prev]);
    setActiveTournamentId(newTournament.tournamentId);
    addAuditLog('Tournament Created', `Created ${newTournament.title} (${newTournament.type.toUpperCase()}) for ${bracketSize} bracket slots.`);
    return newTournament;
  };

  // Symmetrical Bracket Generator supporting dynamic participant scale (4, 8, 16, 32, 64) with BYE rule
  const generateBracketForTournament = (tournamentId: string, teamList: Team[]) => {
    const participantCount = teamList.length;
    let bracketSize = 4;
    while (bracketSize < participantCount) {
      bracketSize *= 2;
    }

    const numByes = bracketSize - participantCount;
    const generatedNodes: BracketNode[] = [];
    const generatedMatches: TeamEncounterMatch[] = [];

    // Let's create Round 1 matches
    const halfSlots = bracketSize / 2;
    const roundsTotal = Math.log2(bracketSize);

    // Populate Round 1 (Left and Right wings)
    for (let i = 0; i < halfSlots; i++) {
      const isLeft = i < halfSlots / 2;
      const side = isLeft ? 'left' : 'right';
      const posIndex = isLeft ? i : i - Math.floor(halfSlots / 2);

      const teamAIndex = i * 2;
      const teamBIndex = i * 2 + 1;

      const teamA = teamList[teamAIndex];
      const isTeamBBye = teamBIndex >= participantCount;
      const teamB = !isTeamBBye ? teamList[teamBIndex] : undefined;

      const matchId = `gen-match-r1-${i + 1}`;
      const nodeId = `gen-node-r1-${i + 1}`;

      const winnerId = isTeamBBye && teamA ? teamA.teamId : undefined;

      generatedNodes.push({
        nodeId,
        tournamentId,
        roundNumber: 1,
        roundName: bracketSize === 16 ? 'Round of 16' : bracketSize === 8 ? 'Quarter Final' : 'Opening Round',
        bracketSide: side,
        positionIndex: posIndex,
        matchId: isTeamBBye ? undefined : matchId,
        participantA: teamA ? { id: teamA.teamId, name: teamA.teamName, logo: teamA.teamLogo } : { id: '', name: 'TBD' },
        participantB: isTeamBBye 
          ? { id: 'bye', name: 'BYE', isBye: true }
          : teamB 
            ? { id: teamB.teamId, name: teamB.teamName, logo: teamB.teamLogo }
            : { id: '', name: 'TBD' },
        winnerId,
        status: isTeamBBye ? 'completed' : 'upcoming',
        isBye: isTeamBBye
      });

      if (!isTeamBBye && teamA && teamB) {
        generatedMatches.push({
          encounterId: matchId,
          tournamentId,
          roundId: 'r1',
          roundName: bracketSize === 16 ? 'Round of 16' : 'Opening Round',
          matchNumber: i + 1,
          bracketSide: side,
          teamAId: teamA.teamId,
          teamAName: teamA.teamName,
          teamALogo: teamA.teamLogo,
          teamBId: teamB.teamId,
          teamBName: teamB.teamName,
          teamBLogo: teamB.teamLogo,
          scheduledTime: new Date(Date.now() + (i + 1) * 3600000).toISOString(),
          deadlineTime: new Date(Date.now() + (i + 3) * 3600000).toISOString(),
          status: 'scheduled',
          teamAPoints: 0,
          teamBPoints: 0,
          verified: false,
          individualMatches: generateTenMatches(teamA.teamId, teamA.teamName, teamB.teamId, teamB.teamName, false)
        });
      }
    }

    // Link into Quarter Finals, Semi Finals, and Grand Final
    // Also build center Final node
    const finalNodeId = `gen-node-final`;
    const finalMatchId = `gen-match-final`;

    generatedNodes.push({
      nodeId: finalNodeId,
      tournamentId,
      roundNumber: roundsTotal,
      roundName: 'Grand Final',
      bracketSide: 'center',
      positionIndex: 0,
      matchId: finalMatchId,
      participantA: { id: '', name: 'Winner Left Bracket', logo: '🏆' },
      participantB: { id: '', name: 'Winner Right Bracket', logo: '🏆' },
      status: 'upcoming',
      isBye: false
    });

    setBracketNodes(prev => [...prev.filter(n => n.tournamentId !== tournamentId), ...generatedNodes]);
    setMatches(prev => [...prev.filter(m => m.tournamentId !== tournamentId), ...generatedMatches]);

    addAuditLog(
      'Symmetrical Bracket Generated',
      `Generated ${bracketSize}-slot symmetrical bracket for tournament ${tournamentId} with ${numByes} automatic BYEs.`
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isGuest,
        userRole: currentUser?.role || 'guest',
        loginAsUser,
        continueAsGuest,
        logout,
        registerAccount,
        deleteAccount,
        hasPermission,

        tournaments,
        activeTournamentId,
        activeTournament,
        setActiveTournamentId,
        createTournament,
        lockRegistration,

        teams,
        players,
        createTeam,
        updateTeam,
        replaceTeamInTournament,
        replacements,

        auctionItems,
        placeAuctionBid,
        closeAuctionItem,

        matches,
        submitEncounterScore,
        verifyEncounterResults,
        correctOfficialScore,

        bracketNodes,
        generateBracketForTournament,

        auditLogs,
        notifications,
        markNotificationRead,
        addAuditLog,

        announcements,
        postAnnouncement,
        togglePinAnnouncement,
        deleteAnnouncement,
        dismissAnnouncement,
        dismissedAnnouncementIds,

        theme,
        setTheme,
        language,
        setLanguage,
        deviceFrame,
        setDeviceFrame,

        isAuthModalOpen,
        setIsAuthModalOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isBuildGuideOpen,
        setIsBuildGuideOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
