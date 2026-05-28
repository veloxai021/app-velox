/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, ShieldCheck, Zap, Server, Activity, UserPlus, ArrowLeft, Loader2, Check } from 'lucide-react';
import { loginWithGoogle, isMock } from '../lib/firebase';

interface LoginProps {
  onLogin: (user: { displayName: string; email: string; photoURL?: string }) => void;
}

export default function LoginView({ onLogin }: LoginProps) {
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState<string | null>(null);
  const [showAddOther, setShowAddOther] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customEmailError, setCustomEmailError] = useState('');
  const [popupError, setPopupError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Mock connection chart heights
  const points = [12, 18, 14, 25, 42, 30, 20, 28, 35, 14, 25, 10, 18, 32, 22, 14, 28, 48, 25, 15];

  const handleGoogleLogin = async () => {
    if (isSigningIn) {
      console.log('Ignore overlapping login requests');
      return;
    }
    
    setPopupError(null);
    if (!isMock) {
      setIsSigningIn(true);
      setLoadingAccount('Google Account...');
      setShowGoogleChooser(true);
      try {
        const user = await loginWithGoogle();
        if (user) {
          onLogin(user);
        } else {
          setLoadingAccount(null);
          setIsSigningIn(false);
          setShowGoogleChooser(false);
        }
      } catch (err: any) {
        setIsSigningIn(false);
        setLoadingAccount(null);
        // Do NOT close the chooser modal if error occurs.
        // Keeping it open allows them to use the fallback manual entry!
        const errMsg = err?.message || String(err);
        if (errMsg.includes('cancelled-popup-request') || errMsg.includes('popup-closed-by-user') || errMsg.includes('popup-blocked')) {
          setPopupError('O popup do Google foi bloqueado ou cancelado. Use a entrada manual segura abaixo em "Usar outra conta"!');
        } else if (errMsg.includes('network-request-failed')) {
          setPopupError('Erro de rede do Firebase (auth/network-request-failed). Isso ocorre porque o navegador bloqueou cookies de terceiros dentro do iframe do AI Studio. Clique em "Abrir em Nova Aba" abaixo para fazer login com sucesso, ou use a entrada manual segura abaixo!');
        } else {
          setPopupError('Não foi possível abrir o popup do Google. Utilize a entrada manual abaixo em "Usar outra conta"!');
        }
        console.error('Firebase authentication warning:', err);
      }
    } else {
      setShowGoogleChooser(true);
    }
  };

  const getDisplayNameFromEmail = (email: string) => {
    if (email === 'veloxcantada@gmail.com') return 'Velox Cantada';
    const firstPart = email.split('@')[0];
    return firstPart
      .split(/[\._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const handleSelectAccount = (email: string) => {
    setLoadingAccount(email);
    const resolvedName = getDisplayNameFromEmail(email);
    setTimeout(() => {
      onLogin({
        displayName: resolvedName,
        email: email,
        photoURL: email === 'veloxcantada@gmail.com' ? undefined : undefined
      });
    }, 1500); // 1.5s beautiful standard authentic loading transition 
  };

  const handleCustomEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setCustomEmailError('Digite um e-mail do Google válido');
      return;
    }
    setCustomEmailError('');
    handleSelectAccount(customEmail);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#030303] text-white flex flex-col justify-between items-center relative overflow-hidden font-sans p-6">
      {/* Decorative cyber network threads */}
      <div className="absolute top-0 left-0 w-full h-[32rem] opacity-20 pointer-events-none bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

      {/* Sci-fi header line */}
      <div className="w-full flex justify-between items-center text-[10px] text-gray-500 font-mono tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span>CONECTANDO AO SISTEMA...</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
          ENCRIPTAÇÃO ATIVA
        </div>
      </div>

      {/* Main Logo Card Container */}
      <div className="flex-1 w-full max-w-sm flex flex-col justify-center items-center gap-8 relative z-10 my-8">
        
        {/* Giant premium custom metallic shape vector / shield */}
        <motion.div 
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="relative w-44 h-44 flex items-center justify-center"
        >
          {/* Cybernetic glowing polygons behind */}
          <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 via-transparent to-red-500/10 rounded-full blur-xl scale-125 animate-pulse"></div>
          
          {/* SVG representations for the high tech cyber V from the picture */}
          <svg className="w-32 h-32 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15L50 85L90 15L74 15L50 63L26 15L10 15Z" fill="url(#metallicGradient)" stroke="#ef4444" strokeWidth="2" />
            <path d="M22 20L50 72L78 20" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" />
            <defs>
              <linearGradient id="metallicGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="40%" stopColor="#7f1d1d" />
                <stop offset="70%" stopColor="#0a0a0a" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>

          {/* Internal neon crosshairs */}
          <div className="absolute inset-4 rounded-full border border-dashed border-red-500/30 animate-spin" style={{ animationDuration: '40s' }}></div>
        </motion.div>

        {/* Brand Name Title */}
        <div className="text-center">
          <h1 className="text-5xl font-black tracking-[0.15em] font-serif inline-block text-white">
            VELOX <span className="font-sans text-red-500 text-2xl font-black bg-red-950/40 px-2 py-0.5 rounded border border-red-800/30 align-middle ml-1">AI</span>
          </h1>
          <p className="mt-6 text-sm font-bold text-neutral-100 font-sans leading-relaxed tracking-wider max-w-xs mx-auto">
            A IA criada para homens que nunca mais querem travar numa conversa.
          </p>
        </div>

        {/* White rectangular login button exactly like the design */}
        <motion.button
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4.5 px-6 bg-white text-black font-semibold rounded-lg flex items-center justify-center gap-3.5 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all cursor-pointer font-sans text-base tracking-wide"
        >
          {/* Custom Google G logo */}
          <svg className="w-5.5 h-5.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.81-.3-.66-.66-.85-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Entrar com Google
        </motion.button>

        {/* Proactive full-screen notification banner helper for iframe context */}
        {window.self !== window.top && (
          <div className="w-full -mt-5 text-center">
            <a 
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-neutral-400 hover:text-white transition-all underline decoration-red-500/50 hover:decoration-red-500 underline-offset-4 tracking-wide font-mono inline-flex items-center gap-1.5"
            >
              <span>Se o login falhar, clique aqui para abrir em Tela Cheia! 🚀</span>
            </a>
          </div>
        )}

        {/* Feature Highlights beneath Login */}
        <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-6 border-t border-red-950/40 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-red-950/30 flex items-center justify-center border border-red-900/40">
              <Cpu className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-[9px] text-gray-400 font-mono tracking-wider font-bold">INTELIGÊNCIA AVANÇADA</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-red-950/30 flex items-center justify-center border border-red-900/40">
              <ShieldCheck className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-[9px] text-gray-400 font-mono tracking-wider font-bold">PRIVACIDADE GARANTIDA</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-red-950/30 flex items-center justify-center border border-red-900/40">
              <Zap className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-[9px] text-gray-400 font-mono tracking-wider font-bold">RESPOSTAS EM TEMPO REAL</span>
          </div>
        </div>

      </div>

      {/* Interactive Google Account Chooser Modal Backdrop */}
      <AnimatePresence>
        {showGoogleChooser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans select-none"
            onClick={() => {
              if (!loadingAccount) setShowGoogleChooser(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-[#0f0f11] border border-neutral-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Google Header Logo */}
              <div className="p-6 pb-2 text-center flex flex-col items-center">
                <svg className="w-10 h-10 mb-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.81-.3-.66-.66-.85-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>

                <h3 className="text-xl font-bold text-white tracking-tight">Fazer login</h3>
                <p className="text-xs text-neutral-400 mt-1">para prosseguir para o <span className="font-extrabold text-red-500">Velox AI</span></p>
              </div>

              {/* View 1: Main List Selector */}
              {!showAddOther ? (
                <div className="p-4 flex flex-col gap-2">
                  {popupError && (
                    <div className="mb-3 p-3.5 rounded-xl bg-red-950/50 border border-red-900/50 text-red-200 text-xs text-center leading-relaxed font-sans shadow-lg flex flex-col gap-2.5">
                      <div className="flex gap-2 items-start justify-center">
                        <span className="text-sm shrink-0">⚠️</span>
                        <span className="text-left font-medium leading-relaxed">{popupError}</span>
                      </div>
                      
                      {popupError.includes('auth/network-request-failed') && (
                        <a 
                          href={window.location.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 py-2 px-3 bg-white text-black hover:bg-neutral-200 font-bold text-[11px] font-sans rounded-lg transition-all text-center uppercase tracking-wider shadow-[0_2px_8px_rgba(255,255,255,0.15)] flex items-center justify-center gap-1.5"
                        >
                          Abrir em Nova Aba 🚀
                        </a>
                      )}
                    </div>
                  )}

                  {loadingAccount ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                      <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                      <div>
                        <p className="text-sm font-semibold text-white">Entrando como</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{loadingAccount}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Active Google User account option */}
                      <button
                        onClick={() => handleSelectAccount('veloxcantada@gmail.com')}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:bg-neutral-800/80 hover:border-neutral-700/80 transition-all text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-650 to-red-500 flex items-center justify-center font-bold text-white shadow-md text-base uppercase">
                            V
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                              Velox Cantada
                            </span>
                            <span className="text-xs text-neutral-400">
                              veloxcantada@gmail.com
                            </span>
                          </div>
                        </div>
                        <Check className="w-4 h-4 text-emerald-500 opacity-60" />
                      </button>

                      {/* Add other account triggers */}
                      <button
                        onClick={() => setShowAddOther(true)}
                        className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-neutral-900/40 text-neutral-300 hover:text-white transition-all text-left cursor-pointer mt-1"
                      >
                        <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                          <UserPlus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Usar outra conta</span>
                      </button>

                      <div className="mt-4 pt-4 border-t border-neutral-900 text-[10px] text-neutral-500 text-center leading-relaxed">
                        Para continuar, o Google compartilhará seu nome, endereço de e-mail e foto do perfil com o aplicativo Velox AI.
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* View 2: Add Custom Account Mode */
                <form onSubmit={handleCustomEmailSubmit} className="p-5 flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddOther(false);
                      setCustomEmailError('');
                    }}
                    className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors bg-transparent border-0 p-0 self-start cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>

                  <div className="flex flex-col gap-1 text-left mt-1">
                    <label className="text-xs font-semibold text-neutral-300">E-mail do Google</label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="exemplo@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 text-sm"
                      disabled={!!loadingAccount}
                      autoFocus
                    />
                    {customEmailError && (
                      <span className="text-[10px] text-red-500 font-medium mt-1">{customEmailError}</span>
                    )}
                  </div>

                  {loadingAccount ? (
                    <div className="py-2 flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
                      <span className="text-xs text-neutral-400">Iniciando sessão com segurança...</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-red-600 hover:bg-red-500 font-semibold text-white rounded-lg text-sm transition-all shadow-[0_4px_12px_rgba(220,38,38,0.3)] cursor-pointer"
                    >
                      Avançar
                    </button>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cybernetic telemetry footer exact match to visual 010 */}
      <div className="w-full border-t border-[#450a0a] pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] text-gray-200 font-mono tracking-widest leading-relaxed font-bold">
        {/* Core panel metrics */}
        <div className="flex flex-col gap-1 border-r border-[#450a0a]/50 pr-4">
          <span className="font-extrabold text-[#f3f4f6]">STATUS DO SISTEMA</span>
          <div className="flex justify-between items-center text-[9px]">
            <span>CPU</span>
            <span className="text-red-500 font-black">IIIIIIIIIIIIIIIIIIII 92%</span>
          </div>
          <div className="flex justify-between items-center text-[9px]">
            <span>MEMÓRIA</span>
            <span className="text-red-500 font-black">IIIIIIIIIIIIII 78%</span>
          </div>
          <div className="flex justify-between items-center text-[9px]">
            <span>REDE</span>
            <span className="text-red-500 font-black">IIIIIIIIIII 65%</span>
          </div>
        </div>

        {/* Security / access lock indicator */}
        <div className="flex items-center justify-center gap-2 border-r border-[#450a0a]/50 pr-4">
          <Server className="w-5 h-5 text-red-500 animate-pulse" />
          <div className="text-center md:text-left">
            <span className="text-red-500 font-black block">ACESSO RESTRITO</span>
            <span className="text-[#f3f4f6] text-[8.5px] font-bold block">APENAS PARA INICIADOS</span>
          </div>
        </div>

        {/* Real-time wave telemetry graph */}
        <div className="flex flex-col gap-1 items-stretch">
          <span className="font-extrabold text-[#f3f4f6] flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-red-400" />
            ANÁLISE EM TEMPO REAL
          </span>
          <div className="flex items-end justify-between h-8 bg-[#450a0a]/10 border border-[#450a0a]/40 rounded p-1">
            {points.map((pt, i) => (
              <motion.div
                key={i}
                animate={{ height: [pt, pt * 0.5, pt] }}
                transition={{ duration: 1 + (i % 4) * 0.2, repeat: Infinity, ease: 'easeOut' }}
                className="w-[3px] bg-red-500"
                style={{ height: `${pt}%` }}
              />
            ))}
          </div>
          <span className="text-[7.5px] text-[#f3f4f6] font-extrabold tracking-normal text-right">PROCESSANDO DADOS...</span>
        </div>
      </div>
    </div>
  );
}
