import React, { useState } from 'react';
import { 
  X, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Trash2, 
  Bell, 
  HelpCircle, 
  Check, 
  AlertTriangle,
  Lock,
  Smartphone,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeMode, LanguageMode } from '../../types';

export const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    theme, 
    setTheme, 
    language, 
    setLanguage, 
    currentUser, 
    deleteAccount,
    setIsBuildGuideOpen 
  } = useApp();

  const [activeSection, setActiveSection] = useState<'appearance' | 'account' | 'notifications' | 'privacy' | 'support'>('appearance');
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [auctionAlerts, setAuctionAlerts] = useState(true);
  const [tournamentAnnouncements, setTournamentAnnouncements] = useState(true);
  const [isDeletingConfirm, setIsDeletingConfirm] = useState(false);

  if (!isSettingsOpen) return null;

  const handleDeleteAccount = () => {
    if (currentUser) {
      deleteAccount(currentUser.userId);
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl liquid-glass-dark border border-slate-700 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              EFBTOUR Configuration
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">
              Settings & Preferences
            </h3>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 my-4 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveSection('appearance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSection === 'appearance' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Appearance & Theme
          </button>
          <button
            onClick={() => setActiveSection('account')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSection === 'account' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Account & Role Lock
          </button>
          <button
            onClick={() => setActiveSection('notifications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSection === 'notifications' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Push Notifications
          </button>
          <button
            onClick={() => setActiveSection('support')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSection === 'support' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Support & About
          </button>
        </div>

        {/* ================= APPEARANCE SECTION ================= */}
        {activeSection === 'appearance' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Color Theme (Apple Liquid Glass)
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    theme === 'dark' 
                      ? 'bg-emerald-500/15 border-emerald-400 text-white font-bold' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <div className="text-xs">Dark Mode</div>
                  <div className="text-[10px] text-slate-500">Esports Neon</div>
                </button>

                <button
                  onClick={() => setTheme('light')}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    theme === 'light' 
                      ? 'bg-emerald-500/15 border-emerald-400 text-white font-bold' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <div className="text-xs">Light Mode</div>
                  <div className="text-[10px] text-slate-500">Clean Glass</div>
                </button>

                <button
                  onClick={() => setTheme('system')}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    theme === 'system' 
                      ? 'bg-emerald-500/15 border-emerald-400 text-white font-bold' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                  <div className="text-xs">System Default</div>
                  <div className="text-[10px] text-slate-500">Auto Match</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Language (ভাষা)
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLanguage('en')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    language === 'en'
                      ? 'bg-emerald-500/15 border-emerald-400 text-white font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold">English (US)</div>
                  <div className="text-[10px] text-slate-400 font-mono">Official Tournament Language</div>
                </button>

                <button
                  onClick={() => setLanguage('bn')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    language === 'bn'
                      ? 'bg-emerald-500/15 border-emerald-400 text-white font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold">বাংলা (Bengali)</div>
                  <div className="text-[10px] text-slate-400 font-mono">বাংলাদেশ লোকাল সাপোর্ট</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= ACCOUNT & ROLE LOCK SECTION ================= */}
        {activeSection === 'account' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Active Account Details</span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase">
                  Locked Role: {currentUser?.role || 'Guest'}
                </span>
              </div>
              <div className="text-xs text-slate-300">Name: <span className="font-semibold text-white">{currentUser?.fullName}</span></div>
              <div className="text-xs text-slate-300">Username: <span className="font-mono text-white">@{currentUser?.username}</span></div>
              <div className="text-xs text-slate-300">Email: <span className="text-white">{currentUser?.email}</span></div>
              <div className="text-xs text-slate-300">eFootball ID: <span className="font-mono text-emerald-400">{currentUser?.efootballId}</span></div>
            </div>

            {/* Permanent Role Lock Invariant Explanation */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Lock className="w-4 h-4" />
                Permanent Role Lock System (Section 5)
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Role switching is strictly disabled by architectural design. Logout, reinstalling the app, or changing devices will not alter this account's role.
              </p>
            </div>

            {/* Account Deletion Workflow */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
              <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                Secure Account Deletion & Role Wipe
              </div>
              <p className="text-[11px] text-slate-400">
                Deleting this account will permanently erase credentials and lifted the role lock, allowing you to register a fresh account with a new role.
              </p>

              {!isDeletingConfirm ? (
                <button
                  onClick={() => setIsDeletingConfirm(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors"
                >
                  Delete Account & Reset Role Lock
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30"
                  >
                    Confirm Permanent Deletion
                  </button>
                  <button
                    onClick={() => setIsDeletingConfirm(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= NOTIFICATIONS SECTION ================= */}
        {activeSection === 'notifications' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Match Reminders & Live Scores</div>
                <div className="text-[11px] text-slate-400">Get notified 15 mins before scheduled fixtures</div>
              </div>
              <input
                type="checkbox"
                checked={matchAlerts}
                onChange={(e) => setMatchAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Player Auction Bidding Alerts</div>
                <div className="text-[11px] text-slate-400">Instant alert when outbid by another team owner</div>
              </div>
              <input
                type="checkbox"
                checked={auctionAlerts}
                onChange={(e) => setAuctionAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Official Tournament Announcements</div>
                <div className="text-[11px] text-slate-400">Bracket updates, champion crowning, and deadlines</div>
              </div>
              <input
                type="checkbox"
                checked={tournamentAnnouncements}
                onChange={(e) => setTournamentAnnouncements(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
              />
            </div>
          </div>
        )}

        {/* ================= SUPPORT & ABOUT SECTION ================= */}
        {activeSection === 'support' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-white">About EFBTOUR Platform</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                EFBTOUR is the complete eFootball esports tournament management platform designed for tournament organizers, team owners, and players.
              </p>
              <div className="pt-2 text-[10px] text-slate-500 font-mono">
                Version 3.4.0 (Production Master Build) · Flutter Cross-Platform Architecture
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsBuildGuideOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold border border-slate-700 text-xs flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                View Android APK & iOS Xcode Release Specs
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
