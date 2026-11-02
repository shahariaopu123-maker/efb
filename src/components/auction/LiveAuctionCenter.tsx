import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  History, 
  Plus, 
  Award, 
  Flame 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuctionItem, Team } from '../../types';

export const LiveAuctionCenter: React.FC = () => {
  const { 
    auctionItems, 
    teams, 
    currentUser, 
    userRole, 
    placeAuctionBid, 
    closeAuctionItem, 
    language 
  } = useApp();

  const [activeAuctionId, setActiveAuctionId] = useState<string>(auctionItems[0]?.auctionId || '');
  const [customBidAmount, setCustomBidAmount] = useState<number>(0);
  const [bidFeedback, setBidFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45);

  const currentItem = auctionItems.find(a => a.auctionId === activeAuctionId) || auctionItems[0];

  // Current user's team if owner
  const myTeam = teams.find(t => t.ownerId === currentUser?.userId) || teams[0];

  // Countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePlaceBid = (increment: number) => {
    if (!currentItem || !myTeam) return;

    if (userRole !== 'owner' && userRole !== 'management' && userRole !== 'superadmin') {
      setBidFeedback({ message: 'Only authorized Team Owners can place auction bids!', isError: true });
      return;
    }

    const newAmount = currentItem.currentHighestBid + increment;
    const result = placeAuctionBid(currentItem.auctionId, myTeam.teamId, newAmount);
    setBidFeedback({ message: result.message, isError: !result.success });
  };

  const handleCustomBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem || !myTeam || !customBidAmount) return;

    const result = placeAuctionBid(currentItem.auctionId, myTeam.teamId, customBidAmount);
    setBidFeedback({ message: result.message, isError: !result.success });
    setCustomBidAmount(0);
  };

  const availableBudget = myTeam ? myTeam.budget - myTeam.spentBudget : 0;
  const isSquadFull = myTeam ? myTeam.squadPlayerIds.length >= 10 : false;

  return (
    <div className="space-y-6">
      
      {/* Auction Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl liquid-glass-dark border border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Gavel className="w-3.5 h-3.5" />
              {language === 'bn' ? 'প্রফেশনাল বিড অকশন সিস্টেম' : 'Professional Live Bid Auction System'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              10-Player Strict Quota
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Dhaka Super League Player Auction 2026
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'bn' 
              ? 'টিম ওনাররা ভার্চুয়াল বাজেট দিয়ে প্লেয়ারদের নিলামে ডাক দিতে পারেন। প্রতি টিমে সর্বোচ্চ ১০ জন সক্রিয় প্লেয়ার।' 
              : 'Team owners bid using virtual tournament credits. Purchased players are automatically assigned to the winning team.'}
          </p>
        </div>

        {/* Team Owner Budget Card */}
        {myTeam && (
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-left min-w-[240px]">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
              <span>My Team Budget</span>
              <span className="text-emerald-400 font-mono">{myTeam.teamTag}</span>
            </div>
            <div className="text-lg font-mono font-bold text-emerald-300 mt-0.5">
              ৳ {availableBudget.toLocaleString()} <span className="text-xs text-slate-400 font-normal">BDT</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 pt-1 border-t border-slate-700/60">
              <span>Squad Limit:</span>
              <span className={`font-mono font-bold ${isSquadFull ? 'text-rose-400' : 'text-emerald-400'}`}>
                {myTeam.squadPlayerIds.length}/10 Active Players
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Auction Floor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Player Spotlight Card */}
        {currentItem && (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl liquid-glass-dark border border-slate-700 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  currentItem.status === 'live' 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {currentItem.status === 'live' ? 'LIVE BIDDING' : currentItem.status.toUpperCase()}
                </span>
              </div>

              {/* Player Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <img 
                  src={currentItem.playerPhoto} 
                  alt={currentItem.playerName} 
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-xl"
                  referrerPolicy="no-referrer"
                />

                <div className="text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold">
                      {currentItem.position}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                      OVR {currentItem.rating}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-white mt-2">
                    {currentItem.playerName}
                  </h3>

                  <div className="text-xs text-slate-400 space-y-0.5 mt-1 font-mono">
                    <div>eFootball ID: <span className="text-slate-200">{currentItem.efootballId}</span></div>
                    <div>Gamertag: <span className="text-slate-200">@{currentItem.efootballUsername}</span></div>
                  </div>
                </div>
              </div>

              {/* Live Bid Telemetry Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Starting Price</div>
                  <div className="text-sm font-mono font-bold text-slate-300 mt-0.5">
                    ৳ {currentItem.startingBid.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Current Highest Bid</div>
                  <div className="text-lg font-mono font-extrabold text-emerald-300 mt-0.5">
                    ৳ {currentItem.currentHighestBid.toLocaleString()}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Highest Bidder</div>
                  <div className="text-xs font-bold text-white truncate mt-0.5">
                    {currentItem.highestBidderTeamName || 'No Bids Yet'}
                  </div>
                </div>
              </div>

              {/* Countdown Ticker */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 mb-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Auction Closes In:</span>
                </div>
                <div className="text-base font-mono font-bold text-amber-400">
                  00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}s
                </div>
              </div>

              {/* Feedback Alert */}
              {bidFeedback && (
                <div className={`p-3 rounded-xl mb-4 text-xs font-medium ${
                  bidFeedback.isError 
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' 
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {bidFeedback.message}
                </div>
              )}

              {/* Bidding Controls (Owner Mode) */}
              {currentItem.status === 'live' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-300">Quick Increment Bid:</div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handlePlaceBid(50000)}
                      disabled={isSquadFull}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-mono text-xs font-bold border border-slate-700 transition-colors"
                    >
                      + ৳ 50,000
                    </button>
                    <button
                      onClick={() => handlePlaceBid(100000)}
                      disabled={isSquadFull}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-mono text-xs font-bold border border-slate-700 transition-colors"
                    >
                      + ৳ 100,000
                    </button>
                    <button
                      onClick={() => handlePlaceBid(250000)}
                      disabled={isSquadFull}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-slate-950 font-mono text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      + ৳ 250,000
                    </button>
                  </div>

                  {/* Custom Bid Input */}
                  <form onSubmit={handleCustomBid} className="flex gap-2 pt-2">
                    <input
                      type="number"
                      placeholder={`Min: ${(currentItem.currentHighestBid + 25000).toLocaleString()}`}
                      value={customBidAmount || ''}
                      onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                      disabled={isSquadFull}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                    />
                    <button
                      type="submit"
                      disabled={isSquadFull || !customBidAmount}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs"
                    >
                      Submit Bid
                    </button>
                  </form>

                  {/* Management Quick Close Auction Item */}
                  {(userRole === 'management' || userRole === 'superadmin') && (
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Management Action:</span>
                      <button
                        onClick={() => closeAuctionItem(currentItem.auctionId)}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold"
                      >
                        Declare Sold & Assign to Winning Team
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentItem.status === 'sold' && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                  <div className="text-base font-extrabold text-white">PLAYER SOLD</div>
                  <div className="text-xs text-emerald-300 mt-1">
                    Purchased by <span className="font-bold">{currentItem.highestBidderTeamName}</span> for ৳ {currentItem.currentHighestBid.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Assigned to team's official 10-player roster.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right: Live Bid History & Auction Lots */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Bid History Stream */}
          <div className="p-5 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <History className="w-3.5 h-3.5 text-emerald-400" />
                Live Bid Log
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Real-time</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {currentItem?.bidHistory && currentItem.bidHistory.length > 0 ? (
                currentItem.bidHistory.map((bid, index) => (
                  <div 
                    key={bid.bidId}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      index === 0 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{bid.teamName}</div>
                      <div className="text-[10px] text-slate-400">by {bid.ownerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-400">
                        ৳ {bid.amount.toLocaleString()}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono">
                        {new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  No bids recorded yet. Be the first to bid!
                </div>
              )}
            </div>
          </div>

          {/* All Auction Lots */}
          <div className="p-5 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl">
            <div className="text-xs font-bold text-white pb-3 border-b border-slate-800 mb-3 uppercase tracking-wider">
              Upcoming Auction Lots
            </div>

            <div className="space-y-2">
              {auctionItems.map(item => (
                <button
                  key={item.auctionId}
                  onClick={() => setActiveAuctionId(item.auctionId)}
                  className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    activeAuctionId === item.auctionId 
                      ? 'bg-emerald-500/15 border-emerald-500/40 shadow-md' 
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={item.playerPhoto} 
                      alt={item.playerName}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{item.playerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.position} · OVR {item.rating}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-emerald-400">
                      ৳ {item.currentHighestBid.toLocaleString()}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-slate-500">
                      {item.status}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
