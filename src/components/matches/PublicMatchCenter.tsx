import React, { useState } from 'react';
import { 
  Trophy, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  Eye, 
  Calendar, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Award,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeamEncounterMatch } from '../../types';

export const PublicMatchCenter: React.FC = () => {
  const { 
    matches, 
    activeTournament, 
    userRole, 
    verifyEncounterResults,
    submitEncounterScore,
    language 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'scheduled' | 'live'>('all');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(matches[0]?.encounterId || null);
  const [roundFilter, setRoundFilter] = useState<string>('all');

  const filteredMatches = matches.filter(m => {
    if (m.tournamentId !== activeTournament?.tournamentId) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) {
      if (statusFilter === 'scheduled' && (m.status === 'upcoming' || m.status === 'scheduled')) return true;
      return false;
    }
    if (roundFilter !== 'all' && m.roundName !== roundFilter) return false;
    return true;
  });

  const isManagement = userRole === 'management' || userRole === 'superadmin';

  return (
    <div className="space-y-6">
      
      {/* Public Results Header */}
      <div className="p-5 rounded-2xl liquid-glass-dark border border-slate-700/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {language === 'bn' ? 'পাবলিক ম্যাচ সেন্টার (সবার জন্য উন্মুক্ত)' : 'Public Match Result Center'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                No Login Required
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Official Match Results & Schedules
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'bn' 
                ? 'যেকোনো ভিজিটর কোনো রেজিস্ট্রেশন বা লগইন ছাড়াই সমস্ত ম্যাচ ফলাফল, পয়েন্ট এবং প্লেয়ার স্কোর দেখতে পারবেন।' 
                : 'All tournament scores, aggregate points, and individual player matchups are publicly accessible.'}
            </p>
          </div>

          {/* Public / Verified Badge */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400">Timezone</div>
              <div className="text-xs font-mono font-bold text-emerald-300">Asia/Dhaka (BST)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Encounters</div>
              <div className="text-xs font-mono font-bold text-white">{matches.length} Matches</div>
            </div>
          </div>
        </div>

        {/* Filter Controls (Segmented buttons - allowed by Anti-Slop constitution) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === 'completed' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Verified Results
            </button>
            <button
              onClick={() => setStatusFilter('scheduled')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === 'scheduled' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming
            </button>
          </div>

          {/* Round Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Round:</span>
            <select
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              <option value="all">All Rounds</option>
              <option value="Round of 16">Round of 16</option>
              <option value="Quarter Final">Quarter Finals</option>
              <option value="Semi Final">Semi Finals</option>
              <option value="Grand Final">Grand Final</option>
            </select>
          </div>
        </div>
      </div>

      {/* Match Encounters List */}
      <div className="space-y-4">
        {filteredMatches.map((match) => {
          const isExpanded = expandedMatchId === match.encounterId;
          const isAWin = match.winnerId === match.teamAId;
          const isBWin = match.winnerId === match.teamBId;

          return (
            <div 
              key={match.encounterId}
              className="rounded-3xl liquid-glass-dark border border-slate-700/80 overflow-hidden shadow-xl transition-all"
            >
              {/* Encounter Header Bar */}
              <div 
                onClick={() => setExpandedMatchId(isExpanded ? null : match.encounterId)}
                className="p-4 sm:p-5 cursor-pointer hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Round & Date Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-300 shrink-0">
                    M{match.matchNumber}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      {match.roundName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(match.scheduledTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} · {new Date(match.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Asia/Dhaka)
                    </div>
                  </div>
                </div>

                {/* Main Scoreboard: Team A vs Team B */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 flex-1 max-w-xl self-center">
                  {/* Team A */}
                  <div className={`flex items-center gap-2.5 text-right flex-1 justify-end ${
                    isAWin ? 'font-extrabold text-emerald-300' : 'text-slate-200'
                  }`}>
                    <span className="text-sm sm:text-base font-bold truncate max-w-[140px] sm:max-w-[180px]">
                      {match.teamAName}
                    </span>
                    <span className="text-2xl shrink-0">{match.teamALogo}</span>
                  </div>

                  {/* Aggregate Points Box */}
                  <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-700 text-center shrink-0">
                    <div className="text-lg sm:text-xl font-mono font-black text-white tracking-wider">
                      <span className={isAWin ? 'text-emerald-400' : ''}>{match.teamAPoints.toFixed(1)}</span>
                      <span className="text-slate-600 mx-1.5">:</span>
                      <span className={isBWin ? 'text-emerald-400' : ''}>{match.teamBPoints.toFixed(1)}</span>
                    </div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Team Points</div>
                  </div>

                  {/* Team B */}
                  <div className={`flex items-center gap-2.5 text-left flex-1 justify-start ${
                    isBWin ? 'font-extrabold text-emerald-300' : 'text-slate-200'
                  }`}>
                    <span className="text-2xl shrink-0">{match.teamBLogo}</span>
                    <span className="text-sm sm:text-base font-bold truncate max-w-[140px] sm:max-w-[180px]">
                      {match.teamBName}
                    </span>
                  </div>
                </div>

                {/* Status & Accordion Toggle */}
                <div className="flex items-center gap-3 self-end md:self-center">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    match.verified 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : match.status === 'live'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {match.verified ? 'Verified Official' : match.status.toUpperCase()}
                  </span>

                  <button className="p-1 rounded-lg text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded: 10 Individual Player Matches Table */}
              {isExpanded && (
                <div className="p-4 sm:p-6 bg-slate-950/60 border-t border-slate-800 space-y-4 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        10 Individual Matches Breakdown
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Point calculation: Win = 1.0 point, Draw = 0.5 point each, Loss = 0 points.
                      </p>
                    </div>

                    {match.verified && (
                      <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified by: {match.verifiedBy}
                      </div>
                    )}
                  </div>

                  {/* 10 Matches Table */}
                  <div className="space-y-1.5">
                    {match.individualMatches.map((im) => (
                      <div 
                        key={im.matchIndex}
                        className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-6 h-6 rounded bg-slate-800 text-[10px] font-mono font-bold text-slate-400 flex items-center justify-center">
                            #{im.matchIndex}
                          </span>
                          <span className="font-semibold text-slate-200 truncate max-w-[150px]">
                            {im.playerAName}
                          </span>
                        </div>

                        {/* Individual Match Score */}
                        <div className="flex items-center gap-3 px-4 py-1 rounded-lg bg-slate-950 border border-slate-800">
                          <span className={`font-mono font-bold ${im.playerAScore > im.playerBScore ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {im.playerAScore}
                          </span>
                          <span className="text-slate-600 font-bold">:</span>
                          <span className={`font-mono font-bold ${im.playerBScore > im.playerAScore ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {im.playerBScore}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <span className="font-semibold text-slate-200 truncate max-w-[150px] text-right">
                            {im.playerBName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                            {im.isDraw ? '+0.5 Draw' : im.status === 'completed' ? '+1.0 Win' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Management Verification Action */}
                  {isManagement && !match.verified && (
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-purple-300 font-semibold">
                        Management Action: Review and verify these 10 match results.
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            for (let i = 1; i <= 10; i++) {
                              const pA = i % 2 === 0 ? 2 : 1;
                              const pB = i % 3 === 0 ? 2 : 0;
                              submitEncounterScore(match.encounterId, i, pA, pB);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium border border-slate-700 flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          Simulate Scores
                        </button>

                        <button
                          onClick={() => verifyEncounterResults(match.encounterId)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Verify Official Result
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
