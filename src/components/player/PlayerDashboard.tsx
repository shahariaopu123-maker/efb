import React from 'react';
import { 
  User, 
  Trophy, 
  Calendar, 
  Award, 
  Shield, 
  Target, 
  Activity, 
  CheckCircle,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PlayerDashboard: React.FC = () => {
  const { currentUser, players, teams, matches, notifications, language } = useApp();

  // Find player profile matching current user or default to Fahim Rahman
  const myProfile = players.find(p => p.userId === currentUser?.userId) || players[0];
  const myTeam = teams.find(t => t.teamId === myProfile?.teamId);

  // My matches
  const myTeamMatches = matches.filter(m => 
    m.teamAId === myProfile?.teamId || m.teamBId === myProfile?.teamId
  );

  return (
    <div className="space-y-6">
      
      {/* Player Profile Header Card */}
      <div className="p-6 rounded-3xl liquid-glass-dark border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          <img 
            src={myProfile?.profilePicture} 
            alt={myProfile?.fullName} 
            className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-xl shrink-0"
            referrerPolicy="no-referrer"
          />

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PLAYER MODE
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                {myProfile?.position} · OVR {myProfile?.overallRating}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                Status: {myProfile?.auctionStatus}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mt-2">
              {currentUser?.fullName || myProfile?.fullName}
            </h2>

            <div className="text-xs text-slate-400 mt-1 space-y-0.5 font-mono">
              <div>eFootball ID: <span className="text-white font-bold">{myProfile?.efootballId}</span></div>
              <div>Gamertag: <span className="text-slate-300">@{myProfile?.efootballUsername}</span></div>
            </div>
          </div>

          {/* Individual Points Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center min-w-[140px] shrink-0">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Individual Points
            </div>
            <div className="text-2xl font-mono font-black text-emerald-400 mt-1">
              {myProfile?.stats.individualPoints.toFixed(1)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
              Win Rate: {myProfile?.stats.winRate}%
            </div>
          </div>

        </div>
      </div>

      {/* Grid: My Team & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: My Team Overview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              My Current Team Assignment
            </h3>

            {myTeam ? (
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{myTeam.teamLogo}</span>
                  <div>
                    <div className="text-base font-bold text-white flex items-center gap-1.5">
                      {myTeam.teamName}
                      <span className="text-xs font-mono text-emerald-400">[{myTeam.teamTag}]</span>
                    </div>
                    <div className="text-xs text-slate-400">Owner: {myTeam.ownerName}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-xl bg-slate-800/60">
                    <div className="text-[10px] text-slate-500">Points</div>
                    <div className="font-bold text-emerald-300 mt-0.5">{myTeam.totalPoints.toFixed(1)}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/60">
                    <div className="text-[10px] text-slate-500">Record</div>
                    <div className="font-bold text-white mt-0.5">{myTeam.wins}W-{myTeam.losses}L</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/60">
                    <div className="text-[10px] text-slate-500">Active Squad</div>
                    <div className="font-bold text-white mt-0.5">10 Players</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                You are currently a free agent entered in the live player auction.
              </div>
            )}
          </div>

          {/* Individual Statistics Detailed Breakdown */}
          <div className="p-5 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Personal Performance Telemetry
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Matches</div>
                <div className="text-sm font-bold text-white mt-1">{myProfile?.stats.matchesPlayed}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-emerald-400 uppercase">Wins</div>
                <div className="text-sm font-bold text-emerald-300 mt-1">{myProfile?.stats.wins}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Draws</div>
                <div className="text-sm font-bold text-slate-300 mt-1">{myProfile?.stats.draws}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-rose-400 uppercase">Losses</div>
                <div className="text-sm font-bold text-rose-300 mt-1">{myProfile?.stats.losses}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Match Schedule & Player Notifications */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="p-5 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Upcoming Team Fixtures
            </h3>

            <div className="space-y-2">
              {myTeamMatches.slice(0, 3).map(m => (
                <div key={m.encounterId} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{m.teamAName} vs {m.teamBName}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {m.roundName} · {new Date(m.scheduledTime).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 uppercase font-bold">
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications feed */}
          <div className="p-5 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              Player Direct Notifications
            </h3>

            <div className="space-y-2">
              {notifications.slice(0, 3).map(n => (
                <div key={n.id} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="font-bold text-white">{n.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{n.message}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
