import React, { useState } from 'react';
import { 
  Trophy, 
  Crown, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Shield, 
  ExternalLink, 
  Zap, 
  Layers, 
  Edit3, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BracketNode, TeamEncounterMatch } from '../../types';
import { TournamentUpdates } from './TournamentUpdates';

interface SymmetricalBracketProps {
  onNavigateTab?: (tab: string) => void;
}

export const SymmetricalBracket: React.FC<SymmetricalBracketProps> = ({ onNavigateTab }) => {
  const { 
    bracketNodes, 
    matches, 
    activeTournament, 
    tournaments, 
    setActiveTournamentId, 
    userRole, 
    hasPermission,
    verifyEncounterResults,
    submitEncounterScore,
    correctOfficialScore,
    language
  } = useApp();

  const [selectedMatch, setSelectedMatch] = useState<TeamEncounterMatch | null>(null);
  const [selectedNode, setSelectedNode] = useState<BracketNode | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [scaleFilter, setScaleFilter] = useState<number>(16);

  // Group bracket nodes by side and round
  const leftR16 = bracketNodes.filter(n => n.bracketSide === 'left' && n.roundNumber === 1);
  const leftQF = bracketNodes.filter(n => n.bracketSide === 'left' && n.roundNumber === 2);
  const leftSF = bracketNodes.filter(n => n.bracketSide === 'left' && n.roundNumber === 3);

  const rightR16 = bracketNodes.filter(n => n.bracketSide === 'right' && n.roundNumber === 1);
  const rightQF = bracketNodes.filter(n => n.bracketSide === 'right' && n.roundNumber === 2);
  const rightSF = bracketNodes.filter(n => n.bracketSide === 'right' && n.roundNumber === 3);

  const centerFinal = bracketNodes.find(n => n.roundName.toLowerCase().includes('final') && n.bracketSide === 'center') || bracketNodes.find(n => n.roundNumber === 4);

  const handleNodeClick = (node: BracketNode) => {
    setSelectedNode(node);
    if (node.matchId) {
      const match = matches.find(m => m.encounterId === node.matchId);
      if (match) {
        setSelectedMatch(match);
      } else {
        setSelectedMatch(null);
      }
    } else {
      setSelectedMatch(null);
    }
    setIsMatchModalOpen(true);
  };

  const isManagement = userRole === 'management' || userRole === 'superadmin';

  return (
    <div className="w-full space-y-6">
      
      {/* Real-Time Tournament Updates & Pinned Announcements Bar */}
      <TournamentUpdates onNavigateTab={onNavigateTab} />

      {/* Tournament Selector and Symmetrical Blueprint Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl liquid-glass-dark border border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              {language === 'bn' ? 'অফিসিয়াল নকআউট ব্র্যাকেট' : 'Official Symmetrical Knockout Bracket'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {activeTournament?.bracketSize || 16} Slots
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Asia/Dhaka
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 tracking-tight">
            {activeTournament?.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'bn' 
              ? 'দুই পাশ থেকে শুরু হয়ে কেন্দ্রে গ্র্যান্ড ফাইনালে পৌঁছানোর প্রতিসম (Symmetrical) ব্র্যাকেট নকশা।'
              : 'Left and right symmetrical bracket converging towards the Center Grand Final and Championship podium.'}
          </p>
        </div>

        {/* Tournament Switcher */}
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <select
            value={activeTournament?.tournamentId}
            onChange={(e) => setActiveTournamentId(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            {tournaments.map(t => (
              <option key={t.tournamentId} value={t.tournamentId}>
                {t.title} ({t.type === 'bid_team' ? '10-Player BID' : 'Solo'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Symmetrical Left-Right Bracket Blueprint Layout */}
      <div className="w-full overflow-x-auto pb-6 pt-2">
        <div className="min-w-[1100px] flex items-center justify-between gap-4 px-2">
          
          {/* ================= LEFT WING ================= */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            
            {/* Round of 16 (Left Wing) */}
            <div className="flex flex-col gap-5 w-60">
              <div className="text-center pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Round of 16 (Left)
                </span>
                <div className="text-[10px] text-slate-500 font-mono">4 Matches · 8 Teams</div>
              </div>

              {leftR16.map((node) => (
                <BracketCard 
                  key={node.nodeId} 
                  node={node} 
                  onClick={() => handleNodeClick(node)}
                  direction="left"
                />
              ))}
            </div>

            {/* Quarter Finals (Left Wing) */}
            <div className="flex flex-col gap-24 w-60">
              <div className="text-center pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Quarter Finals
                </span>
                <div className="text-[10px] text-slate-500 font-mono">2 Matches</div>
              </div>

              {leftQF.map((node) => (
                <BracketCard 
                  key={node.nodeId} 
                  node={node} 
                  onClick={() => handleNodeClick(node)}
                  direction="left"
                  highlighted
                />
              ))}
            </div>

            {/* Semi Final (Left Side meeting Center) */}
            <div className="flex flex-col justify-center w-64 h-full">
              <div className="text-center pb-2 border-b border-slate-800 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Semi Final 1
                </span>
                <div className="text-[10px] text-slate-500 font-mono">Left Champion Qualifier</div>
              </div>

              {leftSF.map((node) => (
                <BracketCard 
                  key={node.nodeId} 
                  node={node} 
                  onClick={() => handleNodeClick(node)}
                  direction="left"
                  isSemiFinal
                />
              ))}
            </div>

          </div>

          {/* ================= CENTER: GRAND FINAL & CHAMPION ================= */}
          <div className="flex flex-col items-center justify-center w-72 px-4 shrink-0">
            
            {/* Champion Showcase Card */}
            <div className="w-full mb-6 p-4 rounded-3xl liquid-glass-dark border border-amber-500/40 shadow-2xl shadow-amber-500/10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
              
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-2">
                <Trophy className="w-8 h-8 text-slate-950 stroke-[2.5]" />
              </div>

              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                Official Champion
              </div>

              <div className="text-base font-extrabold text-white mt-1">
                {activeTournament?.championName || 'Awaiting Grand Final'}
              </div>

              <div className="text-[11px] text-slate-400 mt-0.5">
                {activeTournament?.championName 
                  ? 'EFB Asia Champion 2026' 
                  : 'Winner of Center Final will be crowned here'}
              </div>

              {activeTournament?.championName && (
                <div className="mt-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block">
                  Prize: {activeTournament.prizePool}
                </div>
              )}
            </div>

            {/* Grand Final Center Match Card */}
            <div className="w-full">
              <div className="text-center pb-2 border-b border-amber-500/30 mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 flex items-center justify-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  GRAND FINAL
                </span>
                <div className="text-[10px] text-slate-400 font-mono">Center Encounter · 10 Matches</div>
              </div>

              {centerFinal && (
                <div 
                  onClick={() => handleNodeClick(centerFinal)}
                  className="cursor-pointer p-4 rounded-2xl liquid-glass-dark border-2 border-amber-500/60 hover:border-amber-400 shadow-xl transition-all hover:scale-105"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{centerFinal.participantA?.logo || '🏆'}</span>
                        <span className="text-xs font-bold text-white truncate max-w-[130px]">
                          {centerFinal.participantA?.name || 'Winner SF 1'}
                        </span>
                      </div>
                      <span className="text-sm font-mono font-bold text-emerald-400">
                        {centerFinal.participantA?.score ?? '--'}
                      </span>
                    </div>

                    <div className="h-[1px] bg-slate-800" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{centerFinal.participantB?.logo || '🏆'}</span>
                        <span className="text-xs font-bold text-white truncate max-w-[130px]">
                          {centerFinal.participantB?.name || 'Winner SF 2'}
                        </span>
                      </div>
                      <span className="text-sm font-mono font-bold text-emerald-400">
                        {centerFinal.participantB?.score ?? '--'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-amber-400 font-semibold uppercase">{centerFinal.status}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ================= RIGHT WING ================= */}
          <div className="flex items-center gap-4 flex-1 justify-start">
            
            {/* Semi Final (Right Side meeting Center) */}
            <div className="flex flex-col justify-center w-64 h-full">
              <div className="text-center pb-2 border-b border-slate-800 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Semi Final 2
                </span>
                <div className="text-[10px] text-slate-500 font-mono">Right Champion Qualifier</div>
              </div>

              {rightSF.map((node) => (
                <BracketCard 
                  key={node.nodeId} 
                  node={node} 
                  onClick={() => handleNodeClick(node)}
                  direction="right"
                  isSemiFinal
                />
              ))}
            </div>

            {/* Quarter Finals (Right Wing) */}
            <div className="flex flex-col gap-24 w-60">
              <div className="text-center pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Quarter Finals
                </span>
                <div className="text-[10px] text-slate-500 font-mono">2 Matches</div>
              </div>

              {rightQF.map((node) => (
                <BracketCard 
                  key={node.nodeId} 
                  node={node} 
                  onClick={() => handleNodeClick(node)}
                  direction="right"
                  highlighted
                />
              ))}
            </div>

            {/* Round of 16 (Right Wing) */}
            <div className="flex flex-col gap-5 w-60">
              <div className="text-center pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Round of 16 (Right)
                </span>
                <div className="text-[10px] text-slate-500 font-mono">4 Matches · 8 Teams</div>
              </div>

              {rightR16.map((node) => (
                <BracketCard 
                  key={node.nodeId} 
                  node={node} 
                  onClick={() => handleNodeClick(node)}
                  direction="right"
                />
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Match Details & Management Verification Modal */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl liquid-glass-dark border border-slate-700 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                  {selectedNode?.roundName} Match Inspector
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedMatch?.teamAName || selectedNode?.participantA?.name || 'TBD'} vs {selectedMatch?.teamBName || selectedNode?.participantB?.name || 'TBD'}
                </h3>
              </div>
              <button 
                onClick={() => setIsMatchModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Scoreboard Overview */}
            <div className="my-5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-around text-center">
              <div>
                <div className="text-3xl">{selectedMatch?.teamALogo || selectedNode?.participantA?.logo || '⚽'}</div>
                <div className="text-xs font-bold text-white mt-1 max-w-[130px] truncate">
                  {selectedMatch?.teamAName || selectedNode?.participantA?.name}
                </div>
                <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">
                  {selectedMatch?.teamAPoints ?? selectedNode?.participantA?.score ?? 0}
                </div>
                <div className="text-[10px] text-slate-400">Aggregate Pts</div>
              </div>

              <div className="px-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-700 text-slate-300">
                  {selectedMatch?.verified ? 'VERIFIED OFFICIAL' : 'SCHEDULED / LIVE'}
                </span>
                <div className="text-[11px] text-slate-400 mt-2 font-mono">10 Individual Matches</div>
                <div className="text-[10px] text-slate-500">Win = 1.0 · Draw = 0.5 · Loss = 0</div>
              </div>

              <div>
                <div className="text-3xl">{selectedMatch?.teamBLogo || selectedNode?.participantB?.logo || '⚽'}</div>
                <div className="text-xs font-bold text-white mt-1 max-w-[130px] truncate">
                  {selectedMatch?.teamBName || selectedNode?.participantB?.name}
                </div>
                <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">
                  {selectedMatch?.teamBPoints ?? selectedNode?.participantB?.score ?? 0}
                </div>
                <div className="text-[10px] text-slate-400">Aggregate Pts</div>
              </div>
            </div>

            {/* 10 Individual Player Matches List */}
            {selectedMatch && selectedMatch.individualMatches && (
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
                  <span>Encounter Matchups (A1 vs B1 through A10 vs B10)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">10 Match System</span>
                </div>

                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {selectedMatch.individualMatches.map((im) => (
                    <div 
                      key={im.matchIndex} 
                      className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-5 h-5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-center">
                          #{im.matchIndex}
                        </span>
                        <span className="font-medium text-slate-200 truncate max-w-[140px]">
                          {im.playerAName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3">
                        <span className={`font-mono font-bold ${im.playerAScore > im.playerBScore ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {im.playerAScore}
                        </span>
                        <span className="text-slate-600 font-bold">-</span>
                        <span className={`font-mono font-bold ${im.playerBScore > im.playerAScore ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {im.playerBScore}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="font-medium text-slate-200 truncate max-w-[140px] text-right">
                          {im.playerBName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {im.isDraw ? 'DRAW (+0.5)' : im.status === 'completed' ? 'WIN (+1.0)' : 'PENDING'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Management Controls: Verification, Simulation, and Correction */}
            {isManagement && selectedMatch && (
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    Management Official Result Verification
                  </span>
                  <span className="text-[10px] text-purple-400 font-mono">Authorized Manager Mode</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {!selectedMatch.verified ? (
                    <button
                      onClick={() => {
                        verifyEncounterResults(selectedMatch.encounterId);
                        setIsMatchModalOpen(false);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Verify Official Results & Auto-Advance Winner in Bracket
                    </button>
                  ) : (
                    <div className="w-full p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified by: {selectedMatch.verifiedBy || 'Management'}
                      </span>
                      <span className="text-[10px] font-mono">Locked</span>
                    </div>
                  )}

                  {/* Simulate Score quick button for testing */}
                  {!selectedMatch.verified && (
                    <button
                      onClick={() => {
                        // Fill all 10 matches with realistic scores
                        for (let i = 1; i <= 10; i++) {
                          const pA = i % 2 === 0 ? 2 : 1;
                          const pB = i % 3 === 0 ? 2 : i % 2 === 0 ? 1 : 0;
                          submitEncounterScore(selectedMatch.encounterId, i, pA, pB);
                        }
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Simulate 10 Matches
                    </button>
                  )}
                </div>
              </div>
            )}

            {!isManagement && (
              <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                <p className="text-[11px] text-slate-500">
                  Public Result Center: All results shown are verified by EFBTOUR tournament directors.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

// Sub-component for individual Bracket Card
interface BracketCardProps {
  node: BracketNode;
  onClick: () => void;
  direction: 'left' | 'right';
  highlighted?: boolean;
  isSemiFinal?: boolean;
}

const BracketCard: React.FC<BracketCardProps> = ({ 
  node, 
  onClick, 
  direction, 
  highlighted,
  isSemiFinal
}) => {
  const isAWin = node.winnerId && node.winnerId === node.participantA?.id;
  const isBWin = node.winnerId && node.winnerId === node.participantB?.id;

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer group relative p-3 rounded-2xl liquid-glass-dark border transition-all duration-200 hover:scale-[1.02] ${
        highlighted 
          ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
          : isSemiFinal
            ? 'border-purple-500/40 shadow-lg shadow-purple-500/5'
            : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="space-y-2">
        {/* Team A */}
        <div className={`flex items-center justify-between text-xs rounded-lg p-1.5 transition-colors ${
          isAWin ? 'bg-emerald-500/15 font-semibold text-emerald-300' : 'text-slate-300'
        }`}>
          <div className="flex items-center gap-2 truncate">
            <span className="text-base shrink-0">{node.participantA?.logo || '⚽'}</span>
            <span className="truncate">{node.participantA?.name || 'TBD'}</span>
          </div>
          <span className="font-mono font-bold shrink-0 ml-2">
            {node.participantA?.score !== undefined ? node.participantA.score : '--'}
          </span>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-slate-800/80" />

        {/* Team B */}
        <div className={`flex items-center justify-between text-xs rounded-lg p-1.5 transition-colors ${
          isBWin ? 'bg-emerald-500/15 font-semibold text-emerald-300' : 'text-slate-300'
        }`}>
          <div className="flex items-center gap-2 truncate">
            <span className="text-base shrink-0">{node.participantB?.logo || '⚽'}</span>
            <span className="truncate">{node.participantB?.name || 'TBD'}</span>
          </div>
          <span className="font-mono font-bold shrink-0 ml-2">
            {node.participantB?.score !== undefined ? node.participantB.score : '--'}
          </span>
        </div>
      </div>

      {/* Micro Status Bar */}
      <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>{node.isBye ? 'BYE AUTO-PASS' : node.status.toUpperCase()}</span>
        <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
          Inspect <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
