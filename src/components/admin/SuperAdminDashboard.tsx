import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  UserCheck, 
  Lock, 
  Unlock, 
  Key, 
  History, 
  Check, 
  X, 
  AlertOctagon 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SEED_USERS } from '../../data/seedData';
import { ManagementPermission } from '../../types';

export const SuperAdminDashboard: React.FC = () => {
  const { currentUser, auditLogs, addAuditLog, language } = useApp();

  const [usersList, setUsersList] = useState(SEED_USERS);
  const [selectedUserForPerms, setSelectedUserForPerms] = useState<string | null>(null);

  const ALL_PERMISSIONS: ManagementPermission[] = [
    'tournament_manager',
    'team_manager',
    'match_manager',
    'score_verification_manager',
    'auction_manager',
    'bracket_manager'
  ];

  const toggleUserStatus = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.userId === userId) {
        const nextStatus = u.accountStatus === 'active' ? 'suspended' : 'active';
        addAuditLog(
          'Super Admin Action',
          `Changed account ${u.username} status to ${nextStatus.toUpperCase()}`,
          'security'
        );
        return { ...u, accountStatus: nextStatus };
      }
      return u;
    }));
  };

  const togglePermission = (userId: string, perm: ManagementPermission) => {
    setUsersList(prev => prev.map(u => {
      if (u.userId === userId) {
        const currentPerms = u.managementPermissions || [];
        const hasIt = currentPerms.includes(perm);
        const updated = hasIt ? currentPerms.filter(p => p !== perm) : [...currentPerms, perm];
        addAuditLog(
          'Permission Updated',
          `Super Admin updated permissions for ${u.username}: ${perm} ${hasIt ? 'REVOKED' : 'GRANTED'}`,
          'security'
        );
        return { ...u, managementPermissions: updated };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Super Admin Top Banner */}
      <div className="p-6 rounded-3xl liquid-glass-dark border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                SUPER ADMIN OVERSIGHT · ROOT PRIVILEGES
              </span>
              <span className="text-xs text-slate-400">
                Security Invariant: Role-Locked Firestore Schemas
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Global Platform Administration
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Super Admin manages and approves Management accounts, assigns granular tournament permissions, and audits security events.
            </p>
          </div>
        </div>
      </div>

      {/* Management Accounts & Granular Permissions Grid */}
      <div className="p-6 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Management Account Authorization & Permissions
            </h3>
            <p className="text-xs text-slate-400">
              Only authorized tournament personnel can access tournament operations.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {usersList.filter(u => u.role === 'management' || u.role === 'superadmin').map(user => (
            <div 
              key={user.userId}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.profilePicture} 
                    alt={user.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      {user.fullName}
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
                        {user.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      @{user.username} · {user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    user.accountStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {user.accountStatus}
                  </span>

                  {user.role !== 'superadmin' && (
                    <button
                      onClick={() => toggleUserStatus(user.userId)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                        user.accountStatus === 'active'
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {user.accountStatus === 'active' ? 'Suspend Account' : 'Re-Activate'}
                    </button>
                  )}
                </div>
              </div>

              {/* Granular Permissions Toggle Matrix */}
              {user.role === 'management' && (
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-300 mb-2">
                    Granular Tournament Permissions:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALL_PERMISSIONS.map(perm => {
                      const isGranted = user.managementPermissions?.includes(perm);
                      return (
                        <button
                          key={perm}
                          onClick={() => togglePermission(user.userId, perm)}
                          className={`p-2 rounded-xl text-left text-[11px] font-mono flex items-center justify-between border transition-all ${
                            isGranted 
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold' 
                              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <span className="truncate">{perm.replace(/_/g, ' ')}</span>
                          {isGranted ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Global User Directory */}
      <div className="p-6 rounded-3xl liquid-glass-dark border border-slate-700 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Registered EFBTOUR User Directory ({usersList.length} Accounts)
        </h3>

        <div className="space-y-2">
          {usersList.map(u => (
            <div key={u.userId} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img 
                  src={u.profilePicture} 
                  alt={u.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-bold text-white">{u.fullName} (@{u.username})</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Locked Role: <span className="uppercase text-emerald-400">{u.role}</span> · eFootball: {u.efootballId}
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                u.accountStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {u.accountStatus}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
