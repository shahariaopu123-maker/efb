import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Gavel, 
  DollarSign, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Settings, 
  AlertCircle, 
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Team } from '../../types';

export const OwnerDashboard: React.FC = () => {
  const { 
    currentUser, 
    teams, 
    players, 
    matches, 
    createTeam, 
    updateTeam, 
    activeTournament, 
    language 
  } = useApp();

  // Find owner's team or default to Dhaka Thunderbolts FC for testing
  const myTeam = teams.find(t => t.ownerId === currentUser?.userId) || teams[0];

  const [activeTab, setActiveTab] = useState<'squad' | 'matches' | 'budget' | 'settings'>('squad');
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState(myTeam?.teamName || '');
  const [teamDescInput, setTeamDescInput] = useState(myTeam?.description || '');

  // Team players (10 players for BID tournament)
  const squadPlayers = players.filter(p => 
    p.teamId === myTeam?.teamId || (myTeam?.squadPlayerIds.includes(p.userId))
  ).slice(0, 10);

  // My upcoming matches
  const myMatches = matches.filter(m => 
    m.teamAId === myTeam?.teamId || m.teamBId === myTeam?.teamId
  );

  const availableBudget = myTeam ? myTeam.budget - myTeam.spentBudget : 0;

  const handleSaveTeamSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (myTeam) {
      updateTeam(myTeam.teamId, {
        teamName: teamNameInput,
        description: teamDescInput
      });
      setIsEditingTeam(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Team Owner Hero Card */}
      <div className="p-6 rounded-3xl liquid-glass-dark border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/20 shrink-0">
              {myTeam?.teamLogo || '⚡'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {myTeam?.teamTag} · OWNER MODE
                </span>
                <span className="text-xs text-slate-400">
                  Owner: <span className="text-white font-semibold">{currentUser?.fullName || myTeam?.ownerName}</span>
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                {myTeam?.teamName || 'Create Your Team'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 max-w-lg">
                {myTeam?.description || 'Build and manage your 10-player squad for the eFootball tournament.'}
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center min-w-[90px]">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Total Points</div>
              <div className="text-base font-mono font-bold text-emerald-300 mt-0.5">
                {myTeam?.totalPoints.toFixed(1)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center min-w-[90px]">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Squad Count</div>
              <div className="text-base font-mono font-bold text-white mt-0.5">
                {squadPlayers.length}/10
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center min-w-[90px]">
              <div className="text-[10px] text-slate-500 uppercase font-bold">W / D / L</div>
              <div className="text-xs font-mono font-bold text-slate-300 mt-1">
                {myTeam?.wins} - {myTeam?.draws} - {myTeam?.losses}
              </div>
            </div>
          </div>

        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('squad')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'squad' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            10-Player Squad ({squadPlayers.length}/10)
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'matches' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            My Matches ({myMatches.length})
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'budget' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Team Budget & Auctions
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'settings' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Team Profile Settings
          </button>
        </div>
      </div>

      {/* ================= SQUAD TAB ================= */}
      {activeTab === 'squad' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl liquid-glass-dark border border-slate-700/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Official 10-Player Roster
              </h3>
              <p className="text-xs text-slate-400">
                In BID Team Tournaments, each team has exactly 10 active players. Only owners manage their own squad.
              </p>
            </div>

            <div className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active: {squadPlayers.length}/10 Slots
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {squadPlayers.map((player, idx) => (
              <div 
                key={player.userId}
                className="p-3.5 rounded-2xl liquid-glass-dark border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-slate-800 text-xs font-mono font-bold text-slate-400 flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <img 
                    src={player.profilePicture} 
                    alt={player.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{player.fullName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {player.position} · OVR {player.overallRating} · ID: {player.efootballId}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-emerald-400">
                    {player.stats.individualPoints.toFixed(1)} Pts
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {player.stats.wins}W - {player.stats.draws}D - {player.stats.losses}L
                  </div>
                </div>
              </div>
            ))}
          </div>

          {squadPlayers.length < 10 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Team needs {10 - squadPlayers.length} more player(s) to reach the mandatory 10-player requirement before the tournament begins.
              </span>
              <button 
                onClick={() => window.location.hash = '#auction'}
                className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold shrink-0 text-xs"
              >
                Go to Auction
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= MATCHES TAB ================= */}
      {activeTab === 'matches' && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-white pb-2 border-b border-slate-800 uppercase tracking-wider">
            Team Encounters Schedule & Results
          </div>

          {myMatches.map(m => (
            <div key={m.encounterId} className="p-4 rounded-2xl liquid-glass-dark border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{m.roundName}</div>
                <div className="text-sm font-extrabold text-white mt-0.5">
                  {m.teamAName} vs {m.teamBName}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  {new Date(m.scheduledTime).toLocaleDateString()} · Asia/Dhaka
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-base font-extrabold text-white">
                  {m.teamAPoints.toFixed(1)} : {m.teamBPoints.toFixed(1)}
                </div>
                <div className="text-[10px] uppercase font-bold text-emerald-400">
                  {m.verified ? 'Verified Official' : m.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= BUDGET TAB ================= */}
      {activeTab === 'budget' && (
        <div className="p-6 rounded-3xl liquid-glass-dark border border-slate-700 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Virtual Auction Budget Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Total Virtual Credits</div>
              <div className="text-lg font-mono font-bold text-white mt-1">
                ৳ {myTeam?.budget.toLocaleString()} BDT
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-rose-400 uppercase font-bold">Spent On Players</div>
              <div className="text-lg font-mono font-bold text-rose-300 mt-1">
                ৳ {myTeam?.spentBudget.toLocaleString()} BDT
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-emerald-400 uppercase font-bold">Available Reserve</div>
              <div className="text-lg font-mono font-bold text-emerald-300 mt-1">
                ৳ {availableBudget.toLocaleString()} BDT
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Virtual auction credits are allotted by tournament management. Budget cannot be exceeded during player bidding.
          </p>
        </div>
      )}

      {/* ================= SETTINGS TAB ================= */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-3xl liquid-glass-dark border border-slate-700 space-y-4 max-w-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Team Details & Branding
          </h3>

          <form onSubmit={handleSaveTeamSettings} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Team Name</label>
              <input
                type="text"
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Team Description</label>
              <textarea
                rows={3}
                value={teamDescInput}
                onChange={(e) => setTeamDescInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs"
              >
                Save Team Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
