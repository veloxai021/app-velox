/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquareCode, Sparkles, BarChart, Zap, Crown, 
  HelpCircle, AlertCircle, LogOut, CheckCircle2, UserCheck, Lock
} from 'lucide-react';
import { ScreenState, PlanType, UserSession } from './types';

// Firebase & Firestore Sync
import { auth, db, isMock, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';

// Supabase Sync
import { syncUserProfile, saveLogToSupabase, isSupabaseConfigured } from './lib/supabase';

// Views
import SplashView from './components/SplashView';
import LoginView from './components/LoginView';
import QuizView from './components/QuizView';
import AnalysisView from './components/AnalysisView';
import PlansView from './components/PlansView';

// App Tabs
import RespostasTab from './components/RespostasTab';
import CantadasTab from './components/CantadasTab';
import EstatisticaTab from './components/EstatisticaTab';
import CreditsModal from './components/CreditsModal';

const STORAGE_KEY = 'velox_ai_user_session';

export default function App() {
  // Global states
  const [screen, setScreen] = useState<ScreenState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.googleUser && parsed.selectedPlan) {
          return 'app'; // Skip splash completely!
        }
        if (parsed.screen && parsed.screen !== 'splash') {
          return parsed.screen;
        }
      }
    } catch (e) {
      // ignore
    }
    return 'splash';
  });
  const [googleUser, setGoogleUser] = useState<{ displayName: string; email: string; photoURL?: string } | null>(null);
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [credits, setCredits] = useState(3);
  const [maxCredits, setMaxCredits] = useState(3);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  const [totalPickups, setTotalPickups] = useState(0);
  const [mostUsedStyle, setMostUsedStyle] = useState('Ousado');
  const [activeTab, setActiveTab] = useState<'respuestas' | 'cantadas' | 'estadisticas'>('respuestas');
  const [creditsModalOpen, setCreditsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [showCantadasLock, setShowCantadasLock] = useState(false);
  const [showEstadisticasLock, setShowEstadisticasLock] = useState(false);

  // Helper to format/generate the next subscription payment date (recalculates monthly based on current date)
  const getNextBillingDate = () => {
    const now = new Date();
    // Get the same day next month
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    
    const day = String(nextMonth.getDate()).padStart(2, '0');
    const month = String(nextMonth.getMonth() + 1).padStart(2, '0');
    const year = nextMonth.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper inside App to detect if a log is a pickup (for database normalization)
  const isPickupLog = (log: any) => {
    if (log && log.type) {
      return log.type === 'cantada';
    }
    const textToSearch = `${log.context || ''} ${log.recommendation || ''} ${log.content || ''}`.toLowerCase();
    return textToSearch.includes('perfil') || 
           textToSearch.includes('foto') || 
           textToSearch.includes('imagem') || 
           textToSearch.includes('cantada') || 
           textToSearch.includes('enviar') || 
           textToSearch.includes('visual') ||
           textToSearch.includes('dela');
  };

  // Synchronize auth state with Firestore
  useEffect(() => {
    if (isMock || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const u = {
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          photoURL: user.photoURL || undefined
        };
        setGoogleUser(u);

        // Fetch user document
        const userRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Load state from Firestore
            if (data.selectedPlan !== undefined) setSelectedPlan(data.selectedPlan);
            if (data.credits !== undefined) setCredits(data.credits);
            if (data.maxCredits !== undefined) setMaxCredits(data.maxCredits);
            if (data.creditsUsed !== undefined) setCreditsUsed(data.creditsUsed);
            if (data.totalResponsesGenerated !== undefined) setTotalResponses(data.totalResponsesGenerated);
            if (data.totalPickupsCreated !== undefined) setTotalPickups(data.totalPickupsCreated);
            if (data.quizAnswers !== undefined) setQuizAnswers(data.quizAnswers);
            
            // Redirect to App screen if a plan has been selected
            if (data.selectedPlan) {
              setScreen('app');
            } else {
              setScreen('quiz');
            }

            // Sync user logs from chronological subcollection
            const logsRef = collection(db, 'users', user.uid, 'logs');
            const logsSnap = await getDocs(logsRef);
            const fetchedLogs: any[] = [];
            logsSnap.forEach((doc) => {
              const logData = doc.data();
              fetchedLogs.push({
                ...logData,
                createdAt: logData.createdAt?.toDate ? logData.createdAt.toDate().toISOString() : logData.createdAt
              });
            });
            // Newest logs first
            fetchedLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setLogs(fetchedLogs);
          } else {
            // Document doesn't exist yet, populate it with current state
            const initialUserDoc = {
              uid: user.uid,
              displayName: u.displayName,
              email: u.email,
              photoURL: u.photoURL || '',
              selectedPlan: selectedPlan || 'free',
              credits: credits,
              maxCredits: maxCredits,
              creditsUsed: creditsUsed,
              totalResponsesGenerated: totalResponses,
              totalPickupsCreated: totalPickups,
              quizAnswers: quizAnswers || {},
              createdAt: new Date(),
              updatedAt: new Date()
            };
            await setDoc(userRef, initialUserDoc);

            // Supabase initial profile synchronization
            if (isSupabaseConfigured) {
              try {
                await syncUserProfile({
                  id: user.uid,
                  display_name: u.displayName,
                  email: u.email,
                  photo_url: u.photoURL,
                  selected_plan: selectedPlan || 'free',
                  credits: credits,
                  max_credits: maxCredits,
                  credits_used: creditsUsed,
                  total_responses_generated: totalResponses,
                  total_pickups_created: totalPickups,
                  quiz_answers: quizAnswers || {}
                });
              } catch (se) {
                console.error('Supabase initial profile sync error:', se);
              }
            }

            // Back up any local logs to Firestore logs subcollection
            if (logs.length > 0) {
              const batch = writeBatch(db);
              logs.forEach((logItem) => {
                const safeLogId = logItem.id || 'log_' + Math.random().toString(36).substring(2, 11);
                const logDocRef = doc(db, 'users', user.uid, 'logs', safeLogId);
                batch.set(logDocRef, {
                  id: safeLogId,
                  type: logItem.type || (isPickupLog(logItem) ? 'cantada' : 'resposta'),
                  context: logItem.context || '',
                  style: logItem.style || 'Ousado',
                  recommendation: logItem.recommendation || '',
                  levelText: logItem.levelText || '',
                  percentage: logItem.percentage || 75,
                  content: logItem.content || '',
                  createdAt: serverTimestamp()
                });

                // Dual sync local logs to Supabase
                if (isSupabaseConfigured) {
                  saveLogToSupabase({
                    id: safeLogId,
                    user_id: user.uid,
                    type: logItem.type || (isPickupLog(logItem) ? 'cantada' : 'resposta'),
                    context: logItem.context || '',
                    style: logItem.style || 'Ousado',
                    recommendation: logItem.recommendation || '',
                    level_text: logItem.levelText || '',
                    percentage: logItem.percentage || 75,
                    content: logItem.content || '',
                    created_at: logItem.createdAt
                  }).catch(err => console.error('Supabase local log backup sync error:', err));
                }
              });
              await batch.commit();
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setGoogleUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle 5-second locks delay for free plan
  useEffect(() => {
    setShowCantadasLock(false);
    setShowEstadisticasLock(false);

    if (selectedPlan === 'free' || !selectedPlan) {
      if (activeTab === 'cantadas') {
        const timer = setTimeout(() => {
          setShowCantadasLock(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
      if (activeTab === 'estadisticas') {
        const timer = setTimeout(() => {
          setShowEstadisticasLock(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [activeTab, selectedPlan]);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedPlan = parsed.selectedPlan || null;
        let savedCredits = parsed.credits !== undefined ? parsed.credits : 3;

        if (parsed.screen) setScreen(savedPlan ? 'app' : parsed.screen);
        if (parsed.quizStep) setQuizStep(parsed.quizStep);
        if (parsed.quizAnswers) setQuizAnswers(parsed.quizAnswers);
        setSelectedPlan(savedPlan);
        setCredits(savedCredits);
        if (parsed.maxCredits !== undefined) setMaxCredits(parsed.maxCredits);
        if (parsed.creditsUsed !== undefined) setCreditsUsed(parsed.creditsUsed);
        if (parsed.totalResponses !== undefined) setTotalResponses(parsed.totalResponses);
        if (parsed.totalPickups !== undefined) setTotalPickups(parsed.totalPickups);
        if (parsed.activeTab) setActiveTab(parsed.activeTab);
        if (parsed.mostUsedStyle) setMostUsedStyle(parsed.mostUsedStyle);
        if (parsed.logs) setLogs(parsed.logs);
        if (parsed.googleUser) setGoogleUser(parsed.googleUser);
      } catch (err) {
        console.error('Failed to parse user session from storage:', err);
      }
    }
  }, []);

  // Save to LocalStorage and Firestore
  const saveSession = async (updatedFields: Partial<any>) => {
    const freshSession = {
      screen,
      quizStep,
      quizAnswers,
      selectedPlan,
      credits,
      maxCredits,
      creditsUsed,
      totalResponses,
      totalPickups,
      activeTab,
      mostUsedStyle,
      logs,
      googleUser: updatedFields.hasOwnProperty('googleUser') ? updatedFields.googleUser : googleUser,
      ...updatedFields
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshSession));

    // Save online if authenticated
    if (!isMock && auth?.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const mappedUpdate: any = {};
        if (updatedFields.selectedPlan !== undefined) mappedUpdate.selectedPlan = updatedFields.selectedPlan;
        if (updatedFields.credits !== undefined) mappedUpdate.credits = updatedFields.credits;
        if (updatedFields.maxCredits !== undefined) mappedUpdate.maxCredits = updatedFields.maxCredits;
        if (updatedFields.creditsUsed !== undefined) mappedUpdate.creditsUsed = updatedFields.creditsUsed;
        if (updatedFields.totalResponses !== undefined) mappedUpdate.totalResponsesGenerated = updatedFields.totalResponses;
        if (updatedFields.totalPickups !== undefined) mappedUpdate.totalPickupsCreated = updatedFields.totalPickups;
        if (updatedFields.quizAnswers !== undefined) mappedUpdate.quizAnswers = updatedFields.quizAnswers;
        
        mappedUpdate.updatedAt = new Date();

        if (Object.keys(mappedUpdate).length > 1) {
          await updateDoc(userRef, mappedUpdate);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }

      // Supabase user profile synchronization
      if (isSupabaseConfigured) {
        try {
          await syncUserProfile({
            id: auth.currentUser.uid,
            display_name: googleUser?.displayName || 'User',
            email: auth.currentUser.email || undefined,
            photo_url: auth.currentUser.photoURL || undefined,
            selected_plan: updatedFields.selectedPlan !== undefined ? updatedFields.selectedPlan : (selectedPlan || 'free'),
            credits: updatedFields.credits !== undefined ? updatedFields.credits : credits,
            max_credits: updatedFields.maxCredits !== undefined ? updatedFields.maxCredits : maxCredits,
            credits_used: updatedFields.creditsUsed !== undefined ? updatedFields.creditsUsed : creditsUsed,
            total_responses_generated: updatedFields.totalResponses !== undefined ? updatedFields.totalResponses : totalResponses,
            total_pickups_created: updatedFields.totalPickups !== undefined ? updatedFields.totalPickups : totalPickups,
            quiz_answers: updatedFields.quizAnswers !== undefined ? updatedFields.quizAnswers : quizAnswers
          });
        } catch (supabaseErr) {
          console.error('Supabase profile sync error inside saveSession:', supabaseErr);
        }
      }
    }
  };

  const handleSplashComplete = () => {
    const nextScreen: ScreenState = 'login';
    setScreen(nextScreen);
    saveSession({ screen: nextScreen });
  };

  const handleLoginSuccess = (user: { displayName: string; email: string; photoURL?: string }) => {
    const nextScreen: ScreenState = 'quiz';
    setGoogleUser(user);
    setScreen(nextScreen);
    saveSession({ screen: nextScreen, googleUser: user });
  };

  const handleQuizAnswer = (questionId: number, answerText: string) => {
    const updatedAnswers = { ...quizAnswers, [questionId]: answerText };
    setQuizAnswers(updatedAnswers);

    if (quizStep < 6) {
      const nextStep = quizStep + 1;
      setQuizStep(nextStep);
      saveSession({ quizAnswers: updatedAnswers, quizStep: nextStep });
    } else {
      // Finished all 6 steps, proceed to cyber analysis
      const nextScreen: ScreenState = 'analyzing';
      setScreen(nextScreen);
      saveSession({ quizAnswers: updatedAnswers, screen: nextScreen });
    }
  };

  const handleAnalysisComplete = () => {
    const nextScreen: ScreenState = 'plans';
    setScreen(nextScreen);
    saveSession({ screen: nextScreen });
  };

  const handleSelectPlan = (plan: PlanType) => {
    let initialCredits = 3;
    if (plan === 'pro') initialCredits = 80;
    if (plan === 'elite') initialCredits = 120;

    setSelectedPlan(plan);
    setCredits(initialCredits);
    setMaxCredits(plan === 'free' ? 3 : initialCredits);
    const nextScreen: ScreenState = 'app';
    setScreen(nextScreen);

    const todayStr = new Date().toDateString();

    saveSession({
      selectedPlan: plan,
      credits: initialCredits,
      maxCredits: plan === 'free' ? 3 : initialCredits,
      screen: nextScreen,
      lastReloadDay: todayStr
    });
  };

  const useCredit = (amount: number = 1) => {
    if (credits >= amount) {
      const newCredits = credits - amount;
      const newUsed = creditsUsed + amount;
      setCredits(newCredits);
      setCreditsUsed(newUsed);
      saveSession({ credits: newCredits, creditsUsed: newUsed });
    }
  };

  const handleBuyCredits = (amount: number) => {
    const newCredits = credits + amount;
    const newMax = maxCredits + amount;
    setCredits(newCredits);
    setMaxCredits(newMax);
    setCreditsModalOpen(false);
    saveSession({ credits: newCredits, maxCredits: newMax });
  };

  const incrementResponses = () => {
    const updated = totalResponses + 1;
    setTotalResponses(updated);
    saveSession({ totalResponses: updated });
  };

  const incrementPickups = () => {
    const updated = totalPickups + 1;
    setTotalPickups(updated);
    saveSession({ totalPickups: updated });
  };

  const handleSelectStyle = (style: string) => {
    setMostUsedStyle(style);
    saveSession({ mostUsedStyle: style });
  };

  const handleAddLog = async (newLog: any) => {
    const isPickup = isPickupLog(newLog);
    const logId = newLog.id || 'log_' + Math.random().toString(36).substring(2, 11);
    
    const normalizedLog = {
      ...newLog,
      id: logId,
      type: isPickup ? 'cantada' : 'resposta',
      createdAt: newLog.createdAt || new Date().toISOString()
    };

    const updatedLogs = [normalizedLog, ...logs].slice(0, 50); // retain last 50
    setLogs(updatedLogs);
    saveSession({ logs: updatedLogs });

    // Save directly to Firestore users/logs subcollection
    if (!isMock && auth?.currentUser) {
      try {
        const logDocRef = doc(db, 'users', auth.currentUser.uid, 'logs', logId);
        await setDoc(logDocRef, {
          id: normalizedLog.id,
          type: normalizedLog.type,
          context: normalizedLog.context || '',
          style: normalizedLog.style || 'Ousado',
          recommendation: normalizedLog.recommendation || '',
          levelText: normalizedLog.levelText || '',
          percentage: normalizedLog.percentage || 75,
          content: normalizedLog.content || '',
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${auth.currentUser.uid}/logs/${logId}`);
      }

      // Supabase synchronization for logs
      if (isSupabaseConfigured) {
        try {
          await saveLogToSupabase({
            id: logId,
            user_id: auth.currentUser.uid,
            type: normalizedLog.type,
            context: normalizedLog.context || '',
            style: normalizedLog.style || 'Ousado',
            recommendation: normalizedLog.recommendation || '',
            level_text: normalizedLog.levelText || '',
            percentage: normalizedLog.percentage || 75,
            content: normalizedLog.content || '',
            created_at: normalizedLog.createdAt
          });
        } catch (supabaseErr) {
          console.error('Supabase save log error inside handleAddLog:', supabaseErr);
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    if (!isMock && auth) {
      signOut(auth).catch(console.error);
    }
    setScreen('login');
    setQuizStep(1);
    setQuizAnswers({});
    setSelectedPlan(null);
    setCredits(3);
    setMaxCredits(3);
    setCreditsUsed(0);
    setTotalResponses(0);
    setTotalPickups(0);
    setMostUsedStyle('Ousado');
    setActiveTab('respuestas');
    setLogs([]);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#030303] text-gray-100 flex flex-col selection:bg-red-600 selection:text-white">
      <AnimatePresence mode="wait">
        
        {screen === 'splash' && (
          <motion.div key="splash" exit={{ opacity: 0 }} className="w-full h-full">
            <SplashView onComplete={handleSplashComplete} />
          </motion.div>
        )}

        {screen === 'login' && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
            <LoginView onLogin={handleLoginSuccess} />
          </motion.div>
        )}

        {screen === 'quiz' && (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
            <QuizView step={quizStep} onAnswer={handleQuizAnswer} />
          </motion.div>
        )}

        {screen === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
            <AnalysisView onComplete={handleAnalysisComplete} />
          </motion.div>
        )}

        {screen === 'plans' && (
          <motion.div key="plans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
            <PlansView 
              onSelectPlan={handleSelectPlan} 
              onBack={selectedPlan ? () => setScreen('app') : undefined}
            />
          </motion.div>
        )}

        {screen === 'app' && (
          <motion.div 
            key="app" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="w-full max-w-md mx-auto flex flex-col h-[100dvh] max-h-[100dvh] relative bg-[#030303] px-4 pt-4 pb-20 overflow-hidden"
          >
            {/* Header section with brand, subscription and credits */}
            <div className="flex flex-col gap-4 mb-6 shrink-0 relative">
              
              {/* Top cyber logo bar */}
              <div className="flex justify-between items-center py-1 gap-2 select-none">
                {/* Active subscription plan badge - clickable, dynamic and sleek */}
                <button
                  onClick={() => setScreen('plans')}
                  className="px-2.5 py-1.5 rounded-lg border border-red-950/60 bg-red-950/20 hover:border-red-500/50 hover:bg-red-950/45 text-white font-mono text-[9px] tracking-wider uppercase cursor-pointer transition-all flex items-center gap-1.5 shadow-[0_0_8px_rgba(239,68,68,0.05)] select-none shrink-0"
                  title="Ver ou trocar plano de assinatura"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_#10b981]"></span>
                  <span>PLANO {selectedPlan ? selectedPlan.toUpperCase() : 'FREE'}</span>
                </button>

                <div className="flex items-center gap-1 select-none">
                  <span className="text-xl font-bold tracking-[0.2em] font-serif text-white uppercase font-display">VELOX</span>
                  <span className="text-[9.5px] font-sans font-black bg-red-650 text-white px-1.5 py-0.5 rounded font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(239,68,68,0.45)]">AI</span>
                </div>

                {/* Right quick logout */}
                <button
                  onClick={handleLogout}
                  className="p-1 px-2 rounded bg-red-950/10 border border-red-950/60 hover:border-red-650 text-[8.5px] font-mono tracking-widest text-neutral-400 hover:text-red-500 uppercase cursor-pointer transition-all"
                  title="Sair da conta"
                >
                  Sair
                </button>
              </div>

              {/* Credits remaining premium card bar - compact and sleek */}
              <div className="flex justify-between items-center bg-[#070101] border border-red-950/50 rounded-xl p-2.5 shadow-[0_0_15px_rgba(0,0,0,0.8),inset_0_2px_8px_rgba(239,68,68,0.01)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-2xl rounded-full pointer-events-none"></div>

                <div className="flex items-center gap-2">
                  {/* Glowing 4-wedges red diamond shape SVG */}
                  <div className="w-8 h-8 rounded-lg bg-red-950/20 border border-red-900/40 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.1)] animate-pulse">
                    <svg className="w-4.5 h-4.5 text-red-500 filter drop-shadow-[0_0_3px_rgba(239,68,68,0.8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 22 12 12 22 2 12 12 2" className="fill-red-500/10" />
                      <line x1="12" y1="2" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                    </svg>
                  </div>
                  
                  {/* Credits quantity */}
                  <div className="flex flex-col text-left">
                    <span className="text-[7.5px] text-red-500 font-mono font-bold tracking-[0.16em] uppercase">CRÉDITOS RESTANTES</span>
                    <span className="text-xl font-black font-mono text-white tracking-tight leading-none mt-0.5">
                      {credits}
                    </span>
                  </div>
                </div>

                {/* Plus Credits red sci-fi button - compact style */}
                <button
                  onClick={() => setCreditsModalOpen(true)}
                  className="py-1.5 px-3 rounded-lg bg-black hover:bg-red-950/20 border border-red-500 text-white font-mono font-bold text-[9px] tracking-wider uppercase shadow-[0_0_10px_rgba(239,68,68,0.15)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer transition-all shrink-0 uppercase"
                >
                  + CRÉDITOS
                </button>
              </div>

            </div>

            {/* Content Area Rendering requested Tab */}
            <div className="flex-1 overflow-y-auto mb-20 scrollbar-none relative">
              {activeTab === 'respuestas' && (
                <RespostasTab 
                  credits={credits} 
                  selectedPlan={selectedPlan || 'free'}
                  onUseCredit={useCredit} 
                  onIncrementResponses={incrementResponses}
                  onSelectStyleStore={handleSelectStyle}
                  onAddLog={(log) => handleAddLog({ ...log, type: 'resposta' })}
                  onRequestUpgrade={() => setScreen('plans')}
                />
              )}
              {activeTab === 'cantadas' && (
                <div className="relative w-full h-full min-h-[350px]">
                  <div className={selectedPlan === 'free' || !selectedPlan ? "[&_button]:pointer-events-none [&_input]:pointer-events-none [&_textarea]:pointer-events-none [&_select]:pointer-events-none opacity-90 select-none pb-12" : ""}>
                    <CantadasTab 
                      credits={credits} 
                      selectedPlan={selectedPlan || 'free'}
                      onUseCredit={useCredit} 
                      onIncrementPickups={incrementPickups}
                      onSelectStyleStore={handleSelectStyle}
                      onAddLog={(log) => handleAddLog({ ...log, type: 'cantada' })}
                      onRequestUpgrade={() => setScreen('plans')}
                    />
                  </div>
                  {(selectedPlan === 'free' || !selectedPlan) && (
                    <AnimatePresence>
                      {showCantadasLock && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute top-3 right-3 z-40 select-none pointer-events-none"
                        >
                          <div className="bg-[#050101]/95 border border-red-500/40 rounded-xl p-3 w-52 shadow-[0_4px_20px_rgba(239,68,68,0.35)] flex flex-col items-start gap-1.5 text-left pointer-events-auto">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-red-950/50 border border-red-500/40 flex items-center justify-center shrink-0">
                                <Lock className="w-2.5 h-2.5 text-red-500" />
                              </div>
                              <h3 className="text-[8px] font-mono tracking-wider text-red-500 font-extrabold uppercase">Premium 🔒</h3>
                            </div>
                            <p className="text-[8.5px] text-gray-300 font-sans leading-snug">
                              O Gerador de Cantadas por imagem por I.A. é exclusivo do <span className="text-white font-bold">PRO</span> e <span className="text-white font-bold">ELITE</span>!
                            </p>
                            <button
                              onClick={() => setScreen('plans')}
                              className="w-full py-1 text-center bg-red-650 hover:bg-red-600 text-white font-mono text-[7.5px] tracking-wider font-extrabold uppercase rounded border border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)] transition-all cursor-pointer pointer-events-auto mt-0.5 animate-pulse"
                            >
                              LIBERAR ACESSO
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              )}
              {activeTab === 'estadisticas' && (
                <div className="relative w-full h-full min-h-[350px]">
                  <div className={selectedPlan === 'free' || !selectedPlan ? "[&_button]:pointer-events-none [&_input]:pointer-events-none [&_textarea]:pointer-events-none [&_select]:pointer-events-none opacity-90 select-none pb-12" : ""}>
                    <EstatisticaTab 
                      totalResponses={totalResponses} 
                      totalPickups={totalPickups} 
                      creditsUsed={creditsUsed} 
                      mostUsedStyle={mostUsedStyle}
                      logs={logs}
                      credits={credits}
                      maxCredits={maxCredits}
                    />
                  </div>
                  {(selectedPlan === 'free' || !selectedPlan) && (
                    <AnimatePresence>
                      {showEstadisticasLock && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute top-3 right-3 z-40 select-none pointer-events-none"
                        >
                          <div className="bg-[#050101]/95 border border-red-500/40 rounded-xl p-3 w-52 shadow-[0_4px_20px_rgba(239,68,68,0.35)] flex flex-col items-start gap-1.5 text-left pointer-events-auto">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-red-950/50 border border-red-500/40 flex items-center justify-center shrink-0">
                                <Lock className="w-2.5 h-2.5 text-red-500" />
                              </div>
                              <h3 className="text-[8px] font-mono tracking-wider text-red-500 font-extrabold uppercase">Premium 🔒</h3>
                            </div>
                            <p className="text-[8.5px] text-gray-300 font-sans leading-snug">
                              O painel de Estatísticas Avançadas e logs de uso é exclusivo para membros <span className="text-white font-bold">PRO</span> e <span className="text-white font-bold">ELITE</span>!
                            </p>
                            <button
                              onClick={() => setScreen('plans')}
                              className="w-full py-1 text-center bg-red-650 hover:bg-red-600 text-white font-mono text-[7.5px] tracking-wider font-extrabold uppercase rounded border border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)] transition-all cursor-pointer pointer-events-auto mt-0.5 animate-pulse"
                            >
                              LIBERAR ACESSO
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              )}
            </div>

            {/* Persistent bottom visual navigation bar - visual exactly matching footer style */}
            <div className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-[#030303]/95 backdrop-blur-md border-t border-red-950/45 p-3 flex justify-around items-center z-40 rounded-t-xl shadow-[0_-5px_15px_rgba(0,0,0,0.8)]">
              
              <button
                onClick={() => {
                  setActiveTab('respuestas');
                  saveSession({ activeTab: 'respuestas' });
                }}
                className={`flex flex-col items-center gap-1.5 py-1.5 px-3 transition-colors shrink-0 group cursor-pointer ${
                  activeTab === 'respuestas' ? 'text-red-500' : 'text-gray-500 hover:text-white'
                }`}
              >
                <MessageSquareCode className={`w-5.5 h-5.5 ${activeTab === 'respuestas' ? 'filter drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'group-hover:scale-105'}`} />
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase">RESPONSAS</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('cantadas');
                  saveSession({ activeTab: 'cantadas' });
                }}
                className={`flex flex-col items-center gap-1.5 py-1.5 px-3 transition-colors shrink-0 group cursor-pointer relative ${
                  activeTab === 'cantadas' ? 'text-red-500' : 'text-gray-500 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Sparkles className={`w-5.5 h-5.5 ${activeTab === 'cantadas' ? 'filter drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'group-hover:scale-105'}`} />
                  {selectedPlan === 'free' && (
                    <span className="absolute -top-1 -right-2 bg-red-600 rounded-full px-1.5 py-0.5 text-[7px] font-black text-white scale-75 select-none shadow-[0_0_5px_rgba(239,68,68,0.7)]">
                      LOCKED
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase">CANTADAS</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('estadisticas');
                  saveSession({ activeTab: 'estadisticas' });
                }}
                className={`flex flex-col items-center gap-1.5 py-1.5 px-3 transition-colors shrink-0 group cursor-pointer relative ${
                  activeTab === 'estadisticas' ? 'text-red-500' : 'text-gray-500 hover:text-white'
                }`}
              >
                <div className="relative">
                  <BarChart className={`w-5.5 h-5.5 ${activeTab === 'estadisticas' ? 'filter drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'group-hover:scale-105'}`} />
                  {selectedPlan === 'free' && (
                    <span className="absolute -top-1 -right-2 bg-red-600 rounded-full px-1.5 py-0.5 text-[7px] font-black text-white scale-75 select-none shadow-[0_0_5px_rgba(239,68,68,0.7)]">
                      LOCKED
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase">ESTATÍSTICAS</span>
              </button>

            </div>

            {/* Modal for Buying Credits */}
            {creditsModalOpen && (
              <CreditsModal 
                onClose={() => setCreditsModalOpen(false)} 
                onBuyCredits={handleBuyCredits} 
              />
            )}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
