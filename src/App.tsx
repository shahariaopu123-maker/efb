import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SymmetricalBracket } from './components/bracket/SymmetricalBracket';
import { PublicMatchCenter } from './components/matches/PublicMatchCenter';
import { LiveAuctionCenter } from './components/auction/LiveAuctionCenter';
import { LeaderboardCenter } from './components/leaderboards/LeaderboardCenter';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { ManagementDashboard } from './components/management/ManagementDashboard';
import { PlayerDashboard } from './components/player/PlayerDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { MobileBuildGuideModal } from './components/docs/MobileBuildGuideModal';
import { Trophy, Shield, Users, Crown, Smartphone, ArrowRight } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { userRole, isGuest, setIsAuthModalOpen, deviceFrame, setDeviceFrame } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('bracket');

  // Render the appropriate role dashboard
  const renderDashboard = () => {
    switch (userRole) {
      case 'owner':
        return <OwnerDashboard />;
      case 'management':
        return <ManagementDashboard />;
      case 'player':
        return <PlayerDashboard />;
      case 'superadmin':
        return <SuperAdminDashboard />;
      default:
        return (
          <div className="p-8 rounded-3xl liquid-glass-dark border border-slate-700/80 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Public Visitor Mode Active
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You are currently browsing public tournament records. All verified match results, brackets, and standings are public. To own a team, enter the player auction, or manage tournaments, register an account with a role.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-xl shadow-emerald-500/20 transition-all inline-flex items-center gap-2"
              >
                <span>Select Role & Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
    }
  };

  const appContent = (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentTab === 'bracket' && <SymmetricalBracket onNavigateTab={(tab) => setCurrentTab(tab)} />}
        {currentTab === 'matches' && <PublicMatchCenter />}
        {currentTab === 'auction' && <LiveAuctionCenter />}
        {currentTab === 'leaderboards' && <LeaderboardCenter />}
        {currentTab === 'dashboard' && renderDashboard()}
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <SettingsModal />
      <MobileBuildGuideModal />
    </div>
  );

  // If mobile viewport frame preview is active (iPhone 16 Pro or Google Pixel)
  if (deviceFrame === 'iphone' || deviceFrame === 'android') {
    return (
      <div className="min-h-screen bg-slate-900 py-8 px-4 flex flex-col items-center justify-center">
        {/* Device Switcher floating bar */}
        <div className="mb-4 flex items-center gap-3 bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 shadow-xl">
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {deviceFrame === 'iphone' ? 'iPhone 16 Pro (iOS)' : 'Google Pixel (Android)'} Viewport
          </span>
          <button
            onClick={() => setDeviceFrame('responsive')}
            className="text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-700 font-medium"
          >
            Exit Frame to Desktop
          </button>
        </div>

        {/* Mobile Device Mockup Frame */}
        <div className={`relative overflow-hidden shadow-2xl transition-all duration-300 ${
          deviceFrame === 'iphone'
            ? 'w-[410px] h-[850px] rounded-[52px] border-[12px] border-slate-800 bg-slate-950'
            : 'w-[410px] h-[850px] rounded-[36px] border-[10px] border-slate-800 bg-slate-950'
        }`}>
          {/* Dynamic Island / Camera cutout */}
          {deviceFrame === 'iphone' ? (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 pointer-events-none" />
          ) : (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 pointer-events-none" />
          )}

          <div className="w-full h-full overflow-y-auto pt-6">
            {appContent}
          </div>
        </div>
      </div>
    );
  }

  return appContent;
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
