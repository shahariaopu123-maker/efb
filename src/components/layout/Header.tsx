import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Gavel, 
  BarChart2, 
  ShieldCheck, 
  User, 
  Settings, 
  Bell, 
  LogOut, 
  Smartphone,
  CheckCircle,
  HelpCircle,
  Code
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SEED_USERS } from '../../data/seedData';
import { UserRole } from '../../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const { 
    currentUser, 
    userRole, 
    isGuest, 
    loginAsUser, 
    continueAsGuest, 
    logout, 
    notifications,
    setIsAuthModalOpen, 
    setIsSettingsOpen,
    setIsBuildGuideOpen,
    deviceFrame,
    setDeviceFrame,
    language
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Role display names
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return { label: 'OWNER MODE', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'management':
        return { label: 'MANAGEMENT', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'player':
        return { label: 'PLAYER MODE', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'superadmin':
        return { label: 'SUPER ADMIN', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      default:
        return { label: 'PUBLIC GUEST', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    }
  };

  const roleInfo = getRoleBadge(userRole);

  return (
    <header className="sticky top-0 z-40 w-full transition-colors backdrop-blur-xl bg-slate-900/80 dark:bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setCurrentTab('bracket')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white font-mono">
                  EFB<span className="text-emerald-400">TOUR</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                  eFootball
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, unboxed, strictly single row) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setCurrentTab('bracket')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-400 py-1 ${
              currentTab === 'bracket' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'text-slate-300'
            }`}
          >
            {language === 'bn' ? 'ব্র্যাকেট (নকআউট)' : 'Tournament Bracket'}
          </button>

          <button
            onClick={() => setCurrentTab('matches')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-400 py-1 ${
              currentTab === 'matches' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'text-slate-300'
            }`}
          >
            {language === 'bn' ? 'ম্যাচ সেন্টার (পাবলিক)' : 'Public Match Center'}
          </button>

          <button
            onClick={() => setCurrentTab('auction')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-400 py-1 ${
              currentTab === 'auction' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'text-slate-300'
            }`}
          >
            {language === 'bn' ? 'লাইভ অকশন' : 'Live Player Auction'}
          </button>

          <button
            onClick={() => setCurrentTab('leaderboards')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-400 py-1 ${
              currentTab === 'leaderboards' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'text-slate-300'
            }`}
          >
            {language === 'bn' ? 'লিডারবোর্ড' : 'Standings & Squads'}
          </button>

          {/* Mode specific navigation tab */}
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-400 py-1 flex items-center gap-1.5 ${
              currentTab === 'dashboard' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'text-slate-300'
            }`}
          >
            {userRole === 'owner' && (language === 'bn' ? 'টিম ওনার ড্যাশবোর্ড' : 'Owner Dashboard')}
            {userRole === 'management' && (language === 'bn' ? 'ম্যানেজমেন্ট কন্ট্রোল' : 'Management Control')}
            {userRole === 'player' && (language === 'bn' ? 'প্লেয়ার ড্যাশবোর্ড' : 'Player Dashboard')}
            {userRole === 'superadmin' && (language === 'bn' ? 'সুপার এডমিন প্যানেল' : 'Super Admin Panel')}
            {userRole === 'guest' && (language === 'bn' ? 'রেজিস্ট্রেশন ও লগইন' : 'Sign In / Register')}
          </button>
        </nav>

        {/* Zone 3: Actions & Profile controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quick Device Frame Preview Switcher */}
          <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
            <button
              onClick={() => setDeviceFrame('responsive')}
              title="Responsive Web / Desktop"
              className={`px-2 py-1 text-xs rounded transition-colors ${
                deviceFrame === 'responsive' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setDeviceFrame('iphone')}
              title="iPhone 16 Pro Viewport"
              className={`px-2 py-1 text-xs rounded transition-colors ${
                deviceFrame === 'iphone' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              iOS
            </button>
            <button
              onClick={() => setDeviceFrame('android')}
              title="Android Pixel Viewport"
              className={`px-2 py-1 text-xs rounded transition-colors ${
                deviceFrame === 'android' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Android
            </button>
          </div>

          {/* Flutter & Mobile Release Build Guide Button */}
          <button
            onClick={() => setIsBuildGuideOpen(true)}
            title="Android APK & iOS Xcode Build Specs"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mobile APK/IPA Specs</span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl liquid-glass-dark border border-slate-700/80 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">Tournament Alerts</span>
                  <span className="text-[11px] text-emerald-400">{unreadNotifs.length} new</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.slice(0, 4).map(n => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-left">
                      <div className="text-xs font-semibold text-slate-200">{n.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.message}</div>
                      <div className="text-[9px] text-slate-500 mt-1 font-mono">Asia/Dhaka</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Account / Role Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl liquid-glass-dark border border-slate-700/70 hover:border-slate-600 transition-all text-left"
            >
              {currentUser?.profilePicture ? (
                <img 
                  src={currentUser.profilePicture} 
                  alt={currentUser.fullName}
                  className="w-6 h-6 rounded-full object-cover border border-emerald-500/40"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                  {currentUser?.fullName ? currentUser.fullName[0] : 'G'}
                </div>
              )}
              
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                  <span>{currentUser?.fullName?.split(' ')[0] || 'Visitor'}</span>
                </div>
                <div className={`text-[10px] font-mono leading-tight ${roleInfo.color.split(' ')[1]}`}>
                  {roleInfo.label}
                </div>
              </div>
            </button>

            {/* Profile Menu & Role Switcher Popover */}
            {isProfileMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-2xl liquid-glass-dark border border-slate-700 shadow-2xl p-3 z-50"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <div className="p-2 border-b border-slate-800 mb-2">
                  <div className="text-xs font-bold text-white">{currentUser?.fullName || 'Guest Visitor'}</div>
                  <div className="text-[11px] text-slate-400">@{currentUser?.username || 'public_visitor'}</div>
                  <div className="mt-1 text-[10px] inline-block px-2 py-0.5 rounded font-mono border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                    Role: {userRole.toUpperCase()} (PERMANENTLY LOCKED)
                  </div>
                </div>

                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 py-1">
                  Test / Switch Demo Account:
                </div>
                <div className="space-y-1">
                  {SEED_USERS.map(u => (
                    <button
                      key={u.userId}
                      onClick={() => loginAsUser(u.userId)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentUser?.userId === u.userId 
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold' 
                          : 'text-slate-300 hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate">{u.fullName}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{u.role} Mode</div>
                      </div>
                      {currentUser?.userId === u.userId && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </button>
                  ))}

                  <button
                    onClick={continueAsGuest}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                      isGuest ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    <div>
                      <div>Public Guest</div>
                      <div className="text-[10px] text-slate-400">View matches & scores without login</div>
                    </div>
                    {isGuest && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-xs text-emerald-400 hover:underline font-medium"
                  >
                    Create New Account
                  </button>
                  <button
                    onClick={logout}
                    className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/60 bg-slate-900/90 py-2 px-2 text-xs font-medium text-slate-300 overflow-x-auto">
        <button
          onClick={() => setCurrentTab('bracket')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${currentTab === 'bracket' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Bracket
        </button>
        <button
          onClick={() => setCurrentTab('matches')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${currentTab === 'matches' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Public Matches
        </button>
        <button
          onClick={() => setCurrentTab('auction')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${currentTab === 'auction' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Auction
        </button>
        <button
          onClick={() => setCurrentTab('leaderboards')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${currentTab === 'leaderboards' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Standings
        </button>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${currentTab === 'dashboard' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
      </div>
    </header>
  );
};
