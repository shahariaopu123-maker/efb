import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Lock, 
  Unlock, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  Trophy, 
  Users, 
  Layers, 
  Sliders, 
  Calendar,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TournamentType, Team } from '../../types';

export const ManagementDashboard: React.FC = () => {
  const { 
    currentUser, 
    activeTournament, 
    tournaments, 
    setActiveTournamentId, 
    createTournament, 
    lockRegistration, 
    teams, 
    createTeam, 
    replaceTeamInTournament, 
    replacements, 
    matches, 
    verifyEncounterResults, 
    correctOfficialScore, 
    generateBracketForTournament, 
    auditLogs, 
    hasPermission, 
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'replacement' | 'bracket' | 'scores' | 'audit'>('overview');

  // Create tournament form state
  const [newTournTitle, setNewTournTitle] = useState('');
  const [newTournType, setNewTournType] = useState<TournamentType>('bid_team');
  const [newTournParticipants, setNewTournParticipants] = useState<number>(16);
  const [newTournPrize, setNewTournPrize] = useState('৳ 500,000 BDT');
  const [newTournDesc, setNewTournDesc] = useState('');

  // Create team form state (Unlimited teams support)
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamTag, setNewTeamTag] = useState('');
  const [newTeamOwner, setNewTeamOwner] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');

  // Team Replacement form state
  const [replaceOldTeamId, setReplaceOldTeamId] = useState('');
  const [replaceNewTeamId, setReplaceNewTeamId] = useState('');
  const [replaceReason, setReplaceReason] = useState('');
  const [replaceFeedback, setReplaceFeedback] = useState<string | null>(null);

  // Score correction form state
  const [correctMatchId, setCorrectMatchId] = useState('');
  const [correctScoreA, setCorrectScoreA] = useState<number>(0);
  const [correctScoreB, setCorrectScoreB] = useState<number>(0);
  const [correctReason, setCorrectReason] = useState('');

  const handleCreateTournamentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTournTitle) return;
    createTournament({
      title: newTournTitle,
      type: newTournType,
      maxParticipants: newTournParticipants,
      timezone: 'Asia/Dhaka',
      prizePool: newTournPrize,
      description: newTournDesc || 'Official eFootball Tournament'
    });
    setNewTournTitle('');
    setActiveTab('overview');
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName || !newTeamTag) return;
    createTeam({
      teamName: newTeamName,
      teamTag: newTeamTag,
      teamLogo: '⚽',
      description: newTeamDesc || 'eFootball Esports Team',
      ownerId: `owner-${Date.now()}`,
      ownerName: newTeamOwner || 'Assigned Owner',
      tournamentId: activeTournament?.tournamentId || 'tourn-asia-bid-01'
    });
    setNewTeamName('');
    setNewTeamTag('');
    setNewTeamOwner('');
    setNewTeamDesc('');
  };

  const handleReplaceTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTournament || !replaceOldTeamId || !replaceNewTeamId || !replaceReason) {
      setReplaceFeedback('Please select both teams and provide a mandatory replacement reason.');
      return;
    }

    const success = replaceTeamInTournament(
      activeTournament.tournamentId,
      replaceOldTeamId,
      replaceNewTeamId,
      replaceReason
    );

    if (success) {
      setReplaceFeedback('Team successfully replaced. Slot preserved and audit history recorded.');
      setReplaceReason('');
    } else {
      setReplaceFeedback('Replacement failed: verify team selection.');
    }
  };

  const handleGenerateBracket = (size: number) => {
    if (!activeTournament) return;
    const currentTeams = teams.slice(0, size);
    generateBracketForTournament(activeTournament.tournamentId, currentTeams);
  };

  const isLocked = activeTournament?.status === 'registration_locked' || activeTournament?.status === 'in_progress';

  return (
    <div className="space-y-6">
      
      {/* Management Top Command Header */}
      <div className="p-6 rounded-3xl liquid-glass-dark border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                MANAGEMENT MODE · TOURNAMENT CONTROL
              </span>
              <span className="text-xs text-slate-400">
                Director: <span className="text-white font-semibold">{currentUser?.fullName}</span>
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              {activeTournament?.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized tournament operations: team creation, replacement system, score verification, and bracket seeding.
            </p>
          </div>

          {/* Registration Lock & Quick Status */}
          <div className="flex flex-wrap items-center gap-3">
            {!isLocked ? (
              <button
                onClick={() => activeTournament && lockRegistration(activeTournament.tournamentId)}
                className="py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                Lock Registration
              </button>
            ) : (
              <div className="py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Registration Locked
              </div>
            )}
          </div>
        </div>

        {/* Management Sub-Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Tournament Overview
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'teams' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Unlimited Teams ({teams.length})
          </button>

          <button
            onClick={() => setActiveTab('replacement')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'replacement' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Team Replacement System
          </button>

          <button
            onClick={() => setActiveTab('bracket')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'bracket' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Bracket Seeding & BYEs
          </button>

          <button
            onClick={() => setActiveTab('scores')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'scores' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Score Verification & Audit
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Audit Logs
          </button>
        </div>
      </div>

      {/* ================= OVERVIEW TAB ================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Tournament Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Tournament Operational Status
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Tournament Type</div>
                  <div className="text-white font-bold mt-0.5">
                    {activeTournament?.type === 'bid_team' ? '10-Player BID Team' : 'Solo Knockout'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Bracket Slots</div>
                  <div className="text-emerald-400 font-bold mt-0.5">
                    {activeTournament?.bracketSize} Slots (Power of 2)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Official Timezone</div>
                  <div className="text-white font-bold mt-0.5">Asia/Dhaka</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-white">Prize Pool:</span> {activeTournament?.prizePool} · <span className="font-bold text-white">Current Stage:</span> {activeTournament?.currentRound}
              </div>
            </div>

            {/* Replacement Records List */}
            {replacements.length > 0 && (
              <div className="p-5 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                  Recent Team Replacements (Audit Preserved)
                </h3>

                <div className="space-y-2">
                  {replacements.map(rep => (
                    <div key={rep.replacementId} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between font-semibold text-white">
                        <span>{rep.previousTeamName} ➔ {rep.replacementTeamName}</span>
                        <span className="text-[10px] text-purple-400 font-mono">Preserved Verified History</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Reason: "{rep.reason}"</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        By Manager: {rep.managerName} · {new Date(rep.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Create New Tournament Form */}
          <div className="lg:col-span-5">
            <div className="p-5 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-400" />
                Create New Tournament
              </h3>

              <form onSubmit={handleCreateTournamentSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tournament Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., EFB Premier Championship 2026"
                    value={newTournTitle}
                    onChange={(e) => setNewTournTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tournament Type</label>
                    <select
                      value={newTournType}
                      onChange={(e) => setNewTournType(e.target.value as TournamentType)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    >
                      <option value="bid_team">BID Team (10-Player)</option>
                      <option value="solo">Solo Knockout</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Bracket Size</label>
                    <select
                      value={newTournParticipants}
                      onChange={(e) => setNewTournParticipants(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                    >
                      <option value={4}>4 Teams</option>
                      <option value={8}>8 Teams</option>
                      <option value={16}>16 Teams</option>
                      <option value={24}>24 Teams (with 8 BYEs)</option>
                      <option value={32}>32 Teams</option>
                      <option value={50}>50 Teams (with 14 BYEs)</option>
                      <option value={64}>64 Teams</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={newTournPrize}
                    onChange={(e) => setNewTournPrize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all mt-2"
                >
                  Create Tournament & Allocate Slots
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* ================= TEAMS TAB (Unlimited Teams) ================= */}
      {activeTab === 'teams' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl liquid-glass-dark border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Unlimited Team Management
              </h3>
              <p className="text-xs text-slate-400">
                No arbitrary application-level limit on participating teams. Management can create as many teams as needed (4, 8, 16, 24, 32, 50, 100+).
              </p>
            </div>
            <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
              Total Teams in Database: {teams.length}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Create Team Form */}
            <div className="lg:col-span-4 p-5 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Register New Tournament Team
              </h4>

              <form onSubmit={handleCreateTeamSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sylhet Strikers"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Team Tag (3-letter)</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      placeholder="SSX"
                      value={newTeamTag}
                      onChange={(e) => setNewTeamTag(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Owner Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Mahbub Alam"
                      value={newTeamOwner}
                      onChange={(e) => setNewTeamOwner(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Team style, home division..."
                    value={newTeamDesc}
                    onChange={(e) => setNewTeamDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs"
                >
                  Create Team in Database
                </button>
              </form>
            </div>

            {/* Teams List Table */}
            <div className="lg:col-span-8 p-5 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl overflow-hidden">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                All Registered Teams ({teams.length})
              </h4>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {teams.map(t => (
                  <div key={t.teamId} className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{t.teamLogo}</span>
                      <div>
                        <div className="font-bold text-white">{t.teamName} [{t.teamTag}]</div>
                        <div className="text-[10px] text-slate-400">Owner: {t.ownerName} · Squad: {t.squadPlayerIds.length}/10</div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-emerald-400 font-bold">{t.totalPoints.toFixed(1)} Pts</div>
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                        t.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TEAM REPLACEMENT TAB ================= */}
      {activeTab === 'replacement' && (
        <div className="max-w-2xl space-y-4">
          <div className="p-5 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-400" />
                Post-Start Team Replacement System
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Section 13 Compliance: Management can replace an existing team without creating an additional slot. Old verified scores are strictly preserved and never silently transferred.
              </p>
            </div>

            <form onSubmit={handleReplaceTeamSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  1. Select Team to Remove from Tournament Slot
                </label>
                <select
                  value={replaceOldTeamId}
                  onChange={(e) => setReplaceOldTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                >
                  <option value="">-- Choose Existing Team to Remove --</option>
                  {teams.filter(t => t.status === 'active').map(t => (
                    <option key={t.teamId} value={t.teamId}>
                      {t.teamName} [{t.teamTag}] - Owner: {t.ownerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  2. Select Replacement Team (Takes Existing Slot)
                </label>
                <select
                  value={replaceNewTeamId}
                  onChange={(e) => setReplaceNewTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                >
                  <option value="">-- Choose Replacement Team --</option>
                  {teams.filter(t => t.teamId !== replaceOldTeamId).map(t => (
                    <option key={t.teamId} value={t.teamId}>
                      {t.teamName} [{t.teamTag}] - Owner: {t.ownerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  3. Mandatory Replacement Reason (Recorded in Security Audit Log)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g., Unannounced withdrawal / Disqualification / Roster forfeit"
                  value={replaceReason}
                  onChange={(e) => setReplaceReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              {replaceFeedback && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs">
                  {replaceFeedback}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all"
              >
                Execute Replacement & Audit Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= BRACKET SEEDING & BYES ================= */}
      {activeTab === 'bracket' && (
        <div className="p-6 rounded-3xl liquid-glass-dark border border-slate-700 space-y-4">
          <h3 className="text-base font-bold text-white">
            Dynamic Bracket Generation & Power-of-Two BYE System
          </h3>
          <p className="text-xs text-slate-400">
            Generate symmetrical left-right knockout brackets for any participant count (4, 8, 16, 24, 32, 50, 64). Odd counts automatically compute BYEs without creating fake matches.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => handleGenerateBracket(8)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold border border-slate-700"
            >
              8-Team Bracket (QF ➔ Final)
            </button>
            <button
              onClick={() => handleGenerateBracket(16)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-mono text-xs font-bold"
            >
              16-Team Bracket (R16 ➔ Final)
            </button>
            <button
              onClick={() => handleGenerateBracket(24)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold border border-slate-700"
            >
              24-Team Bracket (32 slots with 8 BYEs)
            </button>
            <button
              onClick={() => handleGenerateBracket(32)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold border border-slate-700"
            >
              32-Team Bracket
            </button>
          </div>
        </div>
      )}

      {/* ================= AUDIT LOGS TAB ================= */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl liquid-glass-dark border border-slate-700 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-4 h-4 text-emerald-400" />
            Tournament Security Audit History
          </h3>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {auditLogs.map(log => (
              <div 
                key={log.logId}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-start justify-between"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{log.action}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {log.userRole}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{log.details}</div>
                </div>

                <div className="text-[9px] font-mono text-slate-500 shrink-0 ml-4">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
