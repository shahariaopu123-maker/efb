import React from 'react';
import { Trophy, Shield, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { userRole, setIsBuildGuideOpen, setIsSettingsOpen } = useApp();

  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 text-xs text-slate-400 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white font-mono">EFBTOUR</span>
            <span className="text-slate-500 mx-2">·</span>
            <span>eFootball Esports Tournament Management Platform</span>
          </div>
        </div>

        {/* Quick Links & Meta */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
          <span className="text-slate-500">Timezone: Asia/Dhaka</span>
          <span className="text-slate-500">·</span>
          <button 
            onClick={() => setIsBuildGuideOpen(true)}
            className="hover:text-emerald-400 transition-colors"
          >
            Android APK & iOS Specs
          </button>
          <span className="text-slate-500">·</span>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="hover:text-emerald-400 transition-colors"
          >
            Settings
          </button>
        </div>

        <div className="text-[11px] text-slate-500">
          © {new Date().getFullYear()} EFBTOUR. All rights reserved.
        </div>

      </div>
    </footer>
  );
};
