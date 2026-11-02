import React, { useState } from 'react';
import { 
  Pin, 
  Megaphone, 
  AlertCircle, 
  Calendar, 
  Layers, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TournamentAnnouncement } from '../../types';

interface TournamentUpdatesProps {
  onNavigateTab?: (tab: string) => void;
}

export const TournamentUpdates: React.FC<TournamentUpdatesProps> = ({ onNavigateTab }) => {
  const { 
    announcements, 
    dismissedAnnouncementIds, 
    dismissAnnouncement, 
    togglePinAnnouncement, 
    deleteAnnouncement, 
    postAnnouncement, 
    currentUser, 
    userRole, 
    language 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPostingOpen, setIsPostingOpen] = useState(false);

  // New announcement form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'schedule' | 'bracket' | 'rules' | 'urgent' | 'general'>('urgent');
  const [newIsPinned, setNewIsPinned] = useState(true);
  const [newLinkText, setNewLinkText] = useState('View Details');
  const [newLinkTab, setNewLinkTab] = useState('matches');

  const isManagement = userRole === 'management' || userRole === 'superadmin';

  // Visible announcements (not dismissed)
  const visibleAnnouncements = announcements.filter(
    a => !dismissedAnnouncementIds.includes(a.id)
  );

  // Filtered by category
  const filteredAnnouncements = visibleAnnouncements.filter(a => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'pinned') return a.isPinned;
    return a.category === activeCategory;
  });

  // Sort: pinned first, then by timestamp desc
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const pinnedCount = visibleAnnouncements.filter(a => a.isPinned).length;

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    postAnnouncement({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      isPinned: newIsPinned,
      author: currentUser?.fullName || 'Tournament Director',
      authorRole: userRole === 'superadmin' ? 'Super Admin' : 'Management',
      linkText: newLinkText || undefined,
      linkTab: newLinkTab || undefined
    });

    setNewTitle('');
    setNewContent('');
    setIsPostingOpen(false);
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'urgent':
        return {
          label: 'CRITICAL BULLETIN',
          badgeClass: 'text-rose-400 bg-rose-500/10 border border-rose-500/20',
          indicator: 'bg-rose-500'
        };
      case 'bracket':
        return {
          label: 'BRACKET PROGRESSION',
          badgeClass: 'text-purple-400 bg-purple-500/10 border border-purple-500/20',
          indicator: 'bg-purple-500'
        };
      case 'schedule':
        return {
          label: 'MATCH SCHEDULE',
          badgeClass: 'text-amber-400 bg-amber-500/10 border border-amber-500/20',
          indicator: 'bg-amber-500'
        };
      case 'rules':
        return {
          label: 'REGULATION & TIE-BREAKER',
          badgeClass: 'text-blue-400 bg-blue-500/10 border border-blue-500/20',
          indicator: 'bg-blue-500'
        };
      default:
        return {
          label: 'ANNOUNCEMENT',
          badgeClass: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
          indicator: 'bg-emerald-500'
        };
    }
  };

  return (
    <div className="w-full space-y-3">
      
      {/* Tournament Updates Container */}
      <div className="rounded-3xl liquid-glass-dark border border-slate-700/80 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow for live esports feel */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />

        {/* Top Bar: Title & Filter Tabs */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                  {language === 'bn' ? 'টুর্নামেন্ট আপডেট ও নোটিশ' : 'Live Tournament Updates'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {visibleAnnouncements.length} Active {pinnedCount > 0 ? `(${pinnedCount} Pinned)` : ''}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {language === 'bn' 
                  ? 'সব অংশগ্রহণকারী এবং টিম ওনারদের জন্য রিয়েল-টাইম অফিশিয়াল নোটিশ।'
                  : 'Official announcements, match call-times, verified results, and bracket notices for all participants.'}
              </p>
            </div>
          </div>

          {/* Action buttons: Filter tabs & Post Button */}
          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
            {/* Category Filter segmented control */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto text-[11px]">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Updates
              </button>
              <button
                onClick={() => setActiveCategory('pinned')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeCategory === 'pinned' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Pin className="w-3 h-3" />
                Pinned ({pinnedCount})
              </button>
              <button
                onClick={() => setActiveCategory('schedule')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'schedule' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Schedule
              </button>
              <button
                onClick={() => setActiveCategory('bracket')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'bracket' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bracket
              </button>
            </div>

            {/* Management Post Announcement Button */}
            {isManagement && (
              <button
                onClick={() => setIsPostingOpen(!isPostingOpen)}
                className="py-1.5 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Update</span>
              </button>
            )}
          </div>
        </div>

        {/* Inline Management Composer */}
        {isPostingOpen && isManagement && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Broadcast Official Tournament Bulletin
              </span>
              <button 
                onClick={() => setIsPostingOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Semi Finals Lineup Submission Deadline"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Details & Instructions</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Provide precise schedule instructions, server IPs, roster requirements, or bracket advance notices..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-400 font-mono"
                  >
                    <option value="urgent">Critical Bulletin</option>
                    <option value="bracket">Bracket Progression</option>
                    <option value="schedule">Match Schedule</option>
                    <option value="rules">Regulation & Tie-Breaker</option>
                    <option value="general">General Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quick Action Tab</label>
                  <select
                    value={newLinkTab}
                    onChange={(e) => setNewLinkTab(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-400 font-mono"
                  >
                    <option value="matches">Public Matches</option>
                    <option value="bracket">Tournament Bracket</option>
                    <option value="auction">Live Auction</option>
                    <option value="leaderboards">Standings</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="pinNotice"
                    checked={newIsPinned}
                    onChange={(e) => setNewIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-500 accent-purple-500"
                  />
                  <label htmlFor="pinNotice" className="text-slate-300 font-semibold cursor-pointer">
                    Pin to top of bracket
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostingOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20"
                >
                  Broadcast Update
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Updates Feed */}
        <div className="mt-3 space-y-2.5">
          {sortedAnnouncements.length > 0 ? (
            sortedAnnouncements.map((item) => {
              const styles = getCategoryStyles(item.category);
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                    item.isPinned 
                      ? 'bg-slate-900/90 border-emerald-500/30 shadow-md shadow-emerald-500/5' 
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Top line metadata without pills */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      {item.isPinned && (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold shrink-0">
                          <Pin className="w-3 h-3 fill-emerald-400" />
                          PINNED
                        </span>
                      )}
                      
                      {item.isPinned && <span aria-hidden="true" className="text-slate-600">·</span>}

                      <span className={styles.badgeClass.split(' ')[0] + ' font-bold uppercase'}>
                        {styles.label}
                      </span>

                      <span aria-hidden="true" className="text-slate-600">·</span>

                      <span className="text-slate-400 truncate">
                        {item.author} ({item.authorRole})
                      </span>

                      <span aria-hidden="true" className="text-slate-600">·</span>

                      <span className="text-slate-500">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Asia/Dhaka
                      </span>
                    </div>

                    {/* Controls: Pin, Action Button, Dismiss */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {item.linkTab && (
                        <button
                          onClick={() => onNavigateTab && onNavigateTab(item.linkTab!)}
                          className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors font-mono"
                        >
                          <span>{item.linkText || 'Inspect'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}

                      {/* Management controls */}
                      {isManagement && (
                        <>
                          <button
                            onClick={() => togglePinAnnouncement(item.id)}
                            title={item.isPinned ? 'Unpin update' : 'Pin update to top'}
                            className={`p-1 rounded text-xs transition-colors ${
                              item.isPinned ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Pin className={`w-3.5 h-3.5 ${item.isPinned ? 'fill-emerald-400' : ''}`} />
                          </button>

                          <button
                            onClick={() => deleteAnnouncement(item.id)}
                            title="Delete update"
                            className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {/* Dismiss */}
                      <button
                        onClick={() => dismissAnnouncement(item.id)}
                        title="Dismiss for this session"
                        className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Headline Title */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="cursor-pointer group mt-1.5 flex items-start justify-between gap-2"
                  >
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h4>
                    <button className="text-slate-400 group-hover:text-white p-0.5 shrink-0">
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Content (Collapsible / Full) */}
                  <div className={`text-xs text-slate-300 leading-relaxed mt-1 transition-all ${
                    isExpanded ? '' : 'line-clamp-2'
                  }`}>
                    {item.content}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">
              No active updates in this category. All systems are running on schedule.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
