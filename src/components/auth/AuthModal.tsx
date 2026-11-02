import React, { useState } from 'react';
import { 
  Shield, 
  User, 
  Crown, 
  Lock, 
  CheckCircle, 
  X, 
  ArrowRight,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    registerAccount, 
    continueAsGuest,
    loginAsUser,
    language 
  } = useApp();

  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');

  // Registration form inputs
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [efootballUsername, setEfootballUsername] = useState('');
  const [efootballId, setEfootballId] = useState('');

  if (!isAuthModalOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email) return;

    registerAccount({
      fullName,
      username: username.toLowerCase().replace(/\s+/g, '_'),
      email,
      phoneNumber: phoneNumber || '+880 1700-000000',
      role: selectedRole,
      profilePicture: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      efootballUsername: efootballUsername || `${username}_pro`,
      efootballId: efootballId || `${Math.floor(100 + Math.random() * 899)}-${Math.floor(100 + Math.random() * 899)}-${Math.floor(100 + Math.random() * 899)}`,
      accountStatus: 'active'
    });

    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl liquid-glass-dark border border-slate-700 shadow-2xl p-6 max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              EFBTOUR Authentication
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">
              {authMode === 'register' ? 'Create Official Account' : 'Sign In to EFBTOUR'}
            </h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 my-4 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              authMode === 'register' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register New Account
          </button>
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              authMode === 'login' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Existing Demo Accounts
          </button>
        </div>

        {authMode === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Section 5: The Three Professional Role Selection Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Permanent Role (Role Locked):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. OWNER MODE */}
                <div
                  onClick={() => setSelectedRole('owner')}
                  className={`cursor-pointer p-3.5 rounded-2xl border text-left transition-all ${
                    selectedRole === 'owner'
                      ? 'bg-emerald-500/15 border-emerald-400 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Crown className="w-5 h-5 text-emerald-400 mb-1" />
                  <div className="text-xs font-bold text-white">Owner Mode</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                    Own a team, bid in auctions, manage 10-player squad.
                  </div>
                </div>

                {/* 2. MANAGEMENT MODE */}
                <div
                  onClick={() => setSelectedRole('management')}
                  className={`cursor-pointer p-3.5 rounded-2xl border text-left transition-all ${
                    selectedRole === 'management'
                      ? 'bg-purple-500/15 border-purple-400 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Shield className="w-5 h-5 text-purple-400 mb-1" />
                  <div className="text-xs font-bold text-white">Management</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                    Full control: brackets, verify results, team replacement.
                  </div>
                </div>

                {/* 3. PLAYER MODE */}
                <div
                  onClick={() => setSelectedRole('player')}
                  className={`cursor-pointer p-3.5 rounded-2xl border text-left transition-all ${
                    selectedRole === 'player'
                      ? 'bg-blue-500/15 border-blue-400 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <User className="w-5 h-5 text-blue-400 mb-1" />
                  <div className="text-xs font-bold text-white">Player Mode</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                    Compete, track individual points, join auctions.
                  </div>
                </div>
              </div>

              {/* Role Lock Warning Callout */}
              <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Permanent Role Lock: Once selected, this role cannot be switched. (Account deletion permits fresh registration).
                </span>
              </div>
            </div>

            {/* Registration Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Zubair Ahmed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., zubair_pes"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="zubair@pes.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+880 1711-000000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">eFootball Gamertag</label>
                <input
                  type="text"
                  placeholder="e.g., Sniper_Zubair"
                  value={efootballUsername}
                  onChange={(e) => setEfootballUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">eFootball User ID</label>
                <input
                  type="text"
                  placeholder="e.g., 893-412-091"
                  value={efootballId}
                  onChange={(e) => setEfootballId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              Register & Lock Role as {selectedRole.toUpperCase()}
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Select one of the pre-configured accounts to instantly test role-locked permissions:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => { loginAsUser('user-owner-01'); setIsAuthModalOpen(false); }}
                className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">Zubair Ahmed</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Role: OWNER MODE (Dhaka Thunderbolts)</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { loginAsUser('user-mgmt-01'); setIsAuthModalOpen(false); }}
                className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">Tanvir Hasan</div>
                  <div className="text-[10px] text-purple-400 font-mono">Role: MANAGEMENT MODE (Tournament Director)</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { loginAsUser('user-player-01'); setIsAuthModalOpen(false); }}
                className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">Fahim Rahman</div>
                  <div className="text-[10px] text-blue-400 font-mono">Role: PLAYER MODE (Pro Striker)</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { continueAsGuest(); setIsAuthModalOpen(false); }}
                className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">Public Visitor (Guest)</div>
                  <div className="text-[10px] text-slate-400 font-mono">No Login Required · View Results & Bracket</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
