import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Apple, 
  Terminal, 
  Layers, 
  Download, 
  CheckCircle,
  FileCode,
  Shield,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileBuildGuideModal: React.FC = () => {
  const { isBuildGuideOpen, setIsBuildGuideOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'flutter' | 'android' | 'ios' | 'firebase'>('flutter');

  if (!isBuildGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl rounded-3xl liquid-glass-dark border border-slate-700 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                Cross-Platform Deployment Specs
              </span>
              <h3 className="text-xl font-extrabold text-white">
                Android APK, iOS Xcode & Flutter Architecture
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsBuildGuideOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 my-4 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('flutter')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'flutter' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Flutter Clean Architecture
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'android' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Android APK / Play Store
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'ios' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            iOS Xcode / App Store
          </button>
          <button
            onClick={() => setActiveTab('firebase')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'firebase' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Firebase Schema & Rules
          </button>
        </div>

        {/* ================= FLUTTER ARCHITECTURE ================= */}
        {activeTab === 'flutter' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300">
              EFBTOUR uses Flutter & Material 3 with Clean Architecture and Liquid Glass component shaders for a single shared codebase across Android and iOS.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="text-emerald-400 font-bold">// Flutter Project File Structure</div>
              <div>lib/</div>
              <div>├── core/</div>
              <div>│   ├── theme/ (liquid_glass_theme.dart, colors.dart)</div>
              <div>│   ├── network/ (firebase_client.dart)</div>
              <div>│   └── security/ (role_guard.dart)</div>
              <div>├── features/</div>
              <div>│   ├── auth/ (role_selection_card.dart, login_cubit.dart)</div>
              <div>│   ├── bracket/ (symmetrical_bracket_painter.dart, bracket_view.dart)</div>
              <div>│   ├── auction/ (live_bid_room.dart, budget_counter.dart)</div>
              <div>│   ├── squad/ (ten_player_roster_table.dart)</div>
              <div>│   └── matches/ (public_results_screen.dart, score_verification.dart)</div>
              <div>└── main.dart (MultiBlocProvider, LiquidGlassWrapper)</div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-white mb-1">State Management</div>
                <div className="text-slate-400 text-[11px]">Bloc / Cubit with immutable tournament states and offline Firestore caching.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-white mb-1">Custom Glass Shader</div>
                <div className="text-slate-400 text-[11px]">BackdropFilter + ImageFilter.blur(sigmaX: 20, sigmaY: 20) with radial neon lighting.</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ANDROID BUILD SPECS ================= */}
        {activeTab === 'android' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-white">Android Production Build Instructions (Section 2 & 28)</div>
              <p className="text-slate-400 text-[11px]">
                Generate release Android APK and App Bundle (AAB) for Google Play Store distribution:
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1">
                <div># 1. Generate release keystore</div>
                <div className="text-slate-300">keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload</div>
                <div className="pt-2"># 2. Build Release APK (Direct Device Installation)</div>
                <div className="text-slate-300">flutter build apk --release --split-per-abi</div>
                <div className="pt-2"># 3. Build Release App Bundle (Google Play Console)</div>
                <div className="text-slate-300">flutter build appbundle --release</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="font-bold text-white">Google Play Console Publishing Checklist:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>Package ID: <code className="text-emerald-400">com.efbtour.esports</code></li>
                <li>Target SDK: API 34+ (Android 14)</li>
                <li>Permissions: INTERNET, POST_NOTIFICATIONS, VIBRATE</li>
                <li>Store Listing: Upload 10-player squad screenshots, Symmetrical Bracket preview, and Liquid Glass UI graphics.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ================= iOS BUILD SPECS ================= */}
        {activeTab === 'ios' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-white">iOS Xcode Project Configuration (Section 2 & 28)</div>
              <p className="text-slate-400 text-[11px]">
                Building and signing the iOS application requires macOS and Xcode:
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1">
                <div># 1. Update CocoaPods dependencies</div>
                <div className="text-slate-300">cd ios && pod install --repo-update</div>
                <div className="pt-2"># 2. Build iOS Archive</div>
                <div className="text-slate-300">flutter build ipa --release</div>
                <div className="pt-2"># 3. Upload to TestFlight / App Store Connect</div>
                <div className="text-slate-300">xcrun altool --upload-app -f build/ios/ipa/efbtour.ipa -t ios -u [APPLE_ID] -p [APP_SPECIFIC_PWD]</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="font-bold text-white">Apple App Store Requirements:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>Bundle Identifier: <code className="text-emerald-400">com.efbtour.esports</code></li>
                <li>iOS Deployment Target: iOS 15.0+</li>
                <li>Capabilities: Push Notifications, Background Modes (Remote Notifications), Sign in with Apple.</li>
                <li>Privacy: In-app account deletion workflow verified (included in Settings).</li>
              </ul>
            </div>
          </div>
        )}

        {/* ================= FIREBASE ARCHITECTURE ================= */}
        {activeTab === 'firebase' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300">
              One shared Firebase backend for Android, iOS, and Web with strict security rules enforcing role locking and verified score integrity:
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="text-emerald-400 font-bold">// Firestore Collections Schema</div>
              <div>users/ [userId] (role, roleLocked: true, efootballId)</div>
              <div>tournaments/ [tournId] (type: solo|bid_team, status, bracketSize)</div>
              <div>teams/ [teamId] (ownerId, squadPlayerIds[10], budget, totalPoints)</div>
              <div>matches/ [encounterId] (teamAId, teamBId, teamAPoints, verified: bool)</div>
              <div>brackets/ [nodeId] (roundNumber, winnerId, nextMatchNodeId)</div>
              <div>auctions/ [aucId] (currentHighestBid, highestBidderTeamId, status)</div>
              <div>auditLogs/ [logId] (action, userId, timestamp, details)</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
