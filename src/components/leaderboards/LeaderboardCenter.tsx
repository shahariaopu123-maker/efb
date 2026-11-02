import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  User, 
  Shield, 
  ChevronRight, 
  Award, 
  Search, 
  ExternalLink,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Team, PlayerProfile } from '../../types';

export const LeaderboardCenter: React.FC = () => {
  const { teams, players, activeTournament, language } = useApp();
  const [activeTab, setActiveTab] = useState<'teams' | 'players'>('teams');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Sort teams by totalPoints desc, then wins desc
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return b.wins - a.wins;
  });

  // Sort players by individual points desc, then wins desc
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.stats.individualPoints !== a.stats.individualPoints) {
      return b.stats.individualPoints - a.stats.individualPoints;
    }
    return b.stats.wins - a.stats.wins;
  });

  const filteredTeams = sortedTeams.filter(t => 
    t.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.teamTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlayers = sortedPlayers.filter(p => 
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.efootballId.includes(searchQuery) ||
    p.teamName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Leaderboard Header Bar */}
      <div className="p-5 rounded-2xl liquid-glass-dark border border-slate-700/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                {language === 'bn' ? 'অফিসিয়াল টুর্নামেন্ট স্ট্যান্ডিংস' : 'Official Tournament Standings & Squads'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Dynamic Calculation
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {activeTab === 'teams' ? 'Team Leaderboard' : 'Individual Player Leaderboard'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'bn'
                ? 'ম্যাচ ফলাফল ভেরিফাই হওয়ার পর স্বয়ংক্রিয়ভাবে পয়েন্ট টেবিল ও ব্যক্তিগত পরিসংখ্যান আপডেট হয়।'
                : 'Points calculated automatically after official verification: Win = 1.0, Draw = 0.5, Loss = 0.'}
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'teams' ? 'Search team or owner...' : 'Search player or eFootball ID...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>
        </div>

        {/* Tab Switcher: Team Standings vs Player Standings */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'teams' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Team Leaderboard ({teams.length})
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'players' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Player Leaderboard ({players.length})
            </button>
          </div>
        </div>
      </div>

      {/* ================= TEAM LEADERBOARD ================= */}
      {activeTab === 'teams' && (
        <div className="rounded-3xl liquid-glass-dark border border-slate-700/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-center w-12">Pos</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-3 text-center">Played</th>
                  <th className="py-3 px-3 text-center text-emerald-400">Wins</th>
                  <th className="py-3 px-3 text-center text-slate-300">Draws</th>
                  <th className="py-3 px-3 text-center text-rose-400">Losses</th>
                  <th className="py-3 px-4 text-right font-bold text-white">Total Points</th>
                  <th className="py-3 px-4 text-center">Squad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTeams.map((team, index) => {
                  const isTopThree = index < 3;
                  return (
                    <tr 
                      key={team.teamId}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => setSelectedTeam(team)}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        {index === 0 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center mx-auto text-xs">1</span>
                        ) : index === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/30 flex items-center justify-center mx-auto text-xs">2</span>
                        ) : index === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-600/20 text-amber-500 border border-amber-600/30 flex items-center justify-center mx-auto text-xs">3</span>
                        ) : (
                          <span className="text-slate-500">{index + 1}</span>
                        )}
                      </td>

                      {/* Team Logo & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0">{team.teamLogo}</span>
                          <div>
                            <div className="font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                              {team.teamName}
                              <span className="text-[10px] font-mono text-slate-400">[{team.teamTag}]</span>
                            </div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                              {team.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        {team.ownerName}
                      </td>

                      {/* Played */}
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-300">
                        {team.matchesPlayed}
                      </td>

                      {/* W / D / L */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-400">
                        {team.wins}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-400">
                        {team.draws}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-rose-400">
                        {team.losses}
                      </td>

                      {/* Total Points */}
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-sm text-emerald-300">
                        {team.totalPoints.toFixed(1)}
                      </td>

                      {/* Squad Trigger */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTeam(team);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-300 text-[11px] font-medium border border-slate-700 transition-all inline-flex items-center gap-1"
                        >
                          <span>10-Player Squad</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= PLAYER LEADERBOARD ================= */}
      {activeTab === 'players' && (
        <div className="rounded-3xl liquid-glass-dark border border-slate-700/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-center w-12">Pos</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-3 text-center">Rating</th>
                  <th className="py-3 px-3 text-center">Played</th>
                  <th className="py-3 px-3 text-center text-emerald-400">Wins</th>
                  <th className="py-3 px-3 text-center text-slate-300">Draws</th>
                  <th className="py-3 px-3 text-center text-rose-400">Losses</th>
                  <th className="py-3 px-4 text-right font-bold text-white">Individual Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPlayers.map((player, index) => (
                  <tr key={player.userId} className="hover:bg-slate-800/40 transition-colors">
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      {index < 3 ? (
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs ${
                          index === 0 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                          index === 1 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30' :
                          'bg-amber-600/20 text-amber-500 border border-amber-600/30'
                        }`}>
                          {index + 1}
                        </span>
                      ) : (
                        <span className="text-slate-500">{index + 1}</span>
                      )}
                    </td>

                    {/* Player Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={player.profilePicture} 
                          alt={player.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-white">{player.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            ID: {player.efootballId} · {player.position}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {player.teamName || 'Unassigned / Free Agent'}
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-300">
                      {player.overallRating}
                    </td>

                    {/* Played */}
                    <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                      {player.stats.matchesPlayed}
                    </td>

                    {/* W / D / L */}
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-400">
                      {player.stats.wins}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-slate-400">
                      {player.stats.draws}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-rose-400">
                      {player.stats.losses}
                    </td>

                    {/* Individual Points */}
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-sm text-emerald-300">
                      {player.stats.individualPoints.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 10-PLAYER SQUAD MODAL ================= */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl rounded-3xl liquid-glass-dark border border-slate-700 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedTeam.teamLogo}</span>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {selectedTeam.teamName}
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      {selectedTeam.teamTag}
                    </span>
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Owner: <span className="text-slate-200 font-semibold">{selectedTeam.ownerName}</span> · Total Points: <span className="text-emerald-400 font-bold">{selectedTeam.totalPoints.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedTeam(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Squad Stats strip */}
            <div className="grid grid-cols-4 gap-3 my-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-xs font-mono">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Matches</div>
                <div className="text-sm font-bold text-white mt-0.5">{selectedTeam.matchesPlayed}</div>
              </div>
              <div>
                <div className="text-[10px] text-emerald-400 uppercase font-bold">Wins</div>
                <div className="text-sm font-bold text-emerald-300 mt-0.5">{selectedTeam.wins}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Draws</div>
                <div className="text-sm font-bold text-slate-300 mt-0.5">{selectedTeam.draws}</div>
              </div>
              <div>
                <div className="text-[10px] text-rose-400 uppercase font-bold">Losses</div>
                <div className="text-sm font-bold text-rose-300 mt-0.5">{selectedTeam.losses}</div>
              </div>
            </div>

            {/* 10-Player Active Roster Table */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Active 10-Player Squad (BID Team Tournament Requirement)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {selectedTeam.squadPlayerIds.length > 0 ? `${selectedTeam.squadPlayerIds.length}/10 Registered` : '10 / 10 Active'}
                </span>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {players
                  .filter(p => p.teamId === selectedTeam.teamId || selectedTeam.squadPlayerIds.includes(p.userId))
                  .slice(0, 10)
                  .map((player, idx) => (
                    <div 
                      key={player.userId}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded bg-slate-800 text-[10px] font-mono font-bold text-slate-400 flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <img 
                          src={player.profilePicture} 
                          alt={player.fullName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-white">{player.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {player.position} · OVR {player.overallRating} · eFootball ID: {player.efootballId}
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-emerald-400 font-bold">{player.stats.individualPoints.toFixed(1)} Pts</div>
                        <div className="text-[9px] text-slate-500">{player.stats.wins}W - {player.stats.draws}D - {player.stats.losses}L</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setSelectedTeam(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                Close Squad View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
