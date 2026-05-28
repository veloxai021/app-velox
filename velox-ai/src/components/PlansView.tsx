/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  Shield, Calendar, Sliders, Zap, Palette, Sparkles, 
  Diamond, ShieldAlert, Laptop, BarChart, Maximize, Brain,
  Rocket, Crown, Award, Asterisk, Skull, Lock, Coins, Infinity, Star
} from 'lucide-react';
import { PlanType } from '../types';

interface PlansProps {
  onSelectPlan: (plan: PlanType) => void;
  onBack?: () => void;
}

// Custom highly aesthetic split dual-energy cyber flame (half neon blue, half red fire)
const CyberFlameLogo = () => (
  <div className="absolute top-2 -right-4 w-28 h-28 opacity-25 pointer-events-none select-none transition-transform duration-500 group-hover:scale-110 group-hover:opacity-45 z-0">
    <svg className="w-full h-full filter drop-shadow-[0_0_12px_rgba(239,68,68,0.3)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blueFlame" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#2563eb" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="redFlame" x1="100%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#ef4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f87171" />
        </linearGradient>
      </defs>
      {/* Left side Blue Flame shape */}
      <path 
        d="M50 90 C35 78 18 53 22 38 C27 23 35 12 50 3 C44 17 41 30 45 43 C38 48 33 58 36 67 C38 77 43 83 50 90 Z" 
        fill="url(#blueFlame)" 
      />
      {/* Right side Red Flame shape */}
      <path 
        d="M50 90 C65 78 82 53 78 38 C73 23 65 12 50 3 C56 17 59 30 55 43 C62 48 67 58 64 67 C62 77 57 83 50 90 Z" 
        fill="url(#redFlame)"
      />
    </svg>
  </div>
);

export default function PlansView({ onSelectPlan, onBack }: PlansProps) {
  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#030101] text-white flex flex-col justify-start items-center p-4 md:p-6 relative overflow-y-auto font-sans select-none">
      
      {/* Decorative bg glowing red mesh */}
      <div className="absolute top-0 w-full max-w-lg h-96 bg-red-600/5 blur-3xl rounded-full pointer-events-none z-0"></div>

      {/* Sci-fi Top Line Logo details */}
      <div className="w-full max-w-5xl flex justify-between items-center text-[10px] text-gray-200 font-mono tracking-widest uppercase mb-6 z-20 font-bold">
        <div className="flex items-center gap-1.5 matches-hero">
          <span className="text-red-500 font-black">VELOX</span>
          <span className="bg-red-950/40 text-red-500 px-1.5 py-0.5 rounded border border-red-900/40 text-[9px] font-black">AI</span>
        </div>
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#100202] hover:bg-red-950 text-red-500 hover:text-white border-2 border-red-600/80 hover:border-red-500 rounded-lg text-[9px] font-mono tracking-widest uppercase transition-all duration-250 cursor-pointer select-none active:scale-95 shadow-[0_0_10px_rgba(239,68,68,0.4)] font-black"
          >
            « VOLTAR
          </button>
        ) : (
          <div className="text-neutral-100 font-extrabold">ACCESS_MANAGER // DECRYPTED</div>
        )}
      </div>

      {/* Main Headers - matching the screenshot exactly */}
      <div className="text-center mt-2 mb-8 relative z-10 flex flex-col items-center select-none">
        
        {/* Double-Wing sharp red V logo */}
        <div className="mb-3 relative">
          <svg className="w-16 h-16 text-red-500 filter drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#811d1d" />
              </linearGradient>
            </defs>
            <path d="M12 30 L40 30 L50 52 L34 52 Z" fill="url(#wingGrad)" />
            <path d="M88 30 L60 30 L50 52 L66 52 Z" fill="url(#wingGrad)" />
            <path d="M42 56 L58 56 L50 67 Z" fill="url(#wingGrad)" />
          </svg>
          <div className="absolute -inset-1 bg-red-600/10 rounded-full blur-xl -z-10"></div>
        </div>

        <h1 className="text-4xl md:text-5.55xl font-serif tracking-[0.18em] text-white font-black uppercase flex items-center justify-center gap-1">
          VELOX <span className="text-red-500 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.95)]">AI</span>
        </h1>
        <p className="mt-2 text-xs md:text-sm text-neutral-200 font-serif font-extrabold tracking-[0.05em] leading-relaxed select-none">
          Escolha seu <span className="text-red-505 font-black italic border-b border-red-800/40 pb-0.5">nível de acesso.</span>
        </p>
      </div>      {/* Column Cards Container - Grid Layout matching visual bounds from screenshot */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-3.5 justify-center items-stretch relative z-10 pb-12 px-1">
               {/* FREE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-[#040101]/90 rounded-2xl border-2 border-red-950/60 hover:border-red-900/60 p-4.5 flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden group min-h-[510px] md:min-h-[530px] backdrop-blur-sm transition-all duration-300"
        >
          {/* Cyber design flame element */}
          <CyberFlameLogo />

          {/* Futuristic technical background grid & corner indicators */}
          <div className="absolute top-1.5 left-1.5 text-[6px] text-gray-600 font-mono tracking-widest select-none">FREE_ACCESS // V1.0</div>
          <div className="absolute bottom-1.5 right-1.5 text-[5px] text-red-650/30 font-mono tracking-widest select-none">VELOX_DB_OFFLINE</div>
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:12px_20px] pointer-events-none"></div>

          <div className="w-full relative z-10">
            {/* V Shield Icon Header */}
            <div className="w-full flex justify-center mb-3">
              <div className="w-11 h-11 rounded-full border border-red-900/30 flex items-center justify-center bg-black shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
                <svg className="w-5 h-5 text-red-500/70 filter drop-shadow-[0_0_2px_#ef4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </div>

            {/* Plan Header */}
            <h3 className="text-xl font-serif tracking-[0.2em] font-black text-white uppercase mb-1.5 select-none">FREE</h3>
            
            <div className="w-10 h-[1px] bg-red-900/30 mx-auto my-2"></div>

            {/* Pricing Frame */}
            <div className="my-3 flex flex-col items-center">
              <span className="text-5xl font-black font-mono tracking-tight text-white select-none">3</span>
              <p className="text-[9px] text-[#f3f4f6] font-mono tracking-[0.2em] mt-0.5 font-black uppercase">Créditos Iniciais</p>
            </div>

            {/* Metade azul metade chama de fogo divider */}
            <div className="w-full h-[2px] bg-gradient-to-r from-blue-500 via-transparent to-red-500 my-3.5 relative overflow-hidden">
              <div className="absolute top-0 w-1/4 h-full bg-white/25 animate-scan"></div>
            </div>

            {/* Checklist exactly matching screenshot description */}
            <ul className="flex flex-col gap-2.5 text-left px-2 mb-6">
              <li className="flex items-center gap-3 text-[10.5px] font-sans font-black text-neutral-100 tracking-wide select-none">
                <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="uppercase">Acesso Básico Inicial</span>
              </li>
              <li className="flex items-center gap-3 text-[10.5px] font-sans font-black text-neutral-100 tracking-wide select-none">
                <Sliders className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <div className="flex flex-col">
                  <span className="uppercase">Apenas 1 Estilo</span>
                  <span className="text-[7.5px] text-red-650 font-mono tracking-wide block uppercase font-black">3 estilos bloqueados 🔒</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-[10.5px] font-sans font-black text-neutral-100 tracking-wide select-none">
                <Zap className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="uppercase">Velocidade Normal</span>
              </li>
              <li className="flex items-center gap-3 text-[10.5px] font-sans font-black text-neutral-100 tracking-wide select-none">
                <Lock className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="uppercase">Uso Limitado</span>
              </li>
            </ul>
          </div>

          {/* Action button with high tech framed corners */}
          <button
            onClick={() => onSelectPlan('free')}
            className="w-full py-3.5 bg-black hover:bg-red-950/20 text-red-500 hover:text-white font-mono text-[10px] tracking-[0.2em] uppercase font-black rounded-xl border border-red-900/40 hover:border-red-500 shadow-[0_3px_12px_rgba(0,0,0,0.6)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer flex items-center justify-center relative select-none"
          >
            <div className="absolute top-1 left-1.5 w-1 h-1 bg-red-600 rounded-full animate-ping"></div>
            COMEÇAR GRÁTIS
          </button>
        </motion.div>

        {/* PRO CARD (Double Neon Thick Bordered Frame) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="bg-[#050101] rounded-2xl border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35),inset_0_0_12px_rgba(239,68,68,0.1)] p-4.5 flex flex-col justify-between items-center text-center relative overflow-hidden group min-h-[530px] md:min-h-[550px] transform md:scale-[1.03] z-20 transition-all duration-300"
        >
          {/* Cyber design flame element */}
          <CyberFlameLogo />

          {/* Cyber design highlight bars inside corners */}
          <div className="absolute top-1.5 left-2 text-[6px] text-red-400 font-mono tracking-widest select-none">SYS_LEVEL // PRO_ACTIVATED</div>
          <div className="absolute top-1.5 right-2 bg-red-600/90 text-white font-mono text-[7px] px-2 py-0.5 rounded tracking-wide font-black animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]">
            RECOMENDADO
          </div>
          <div className="absolute bottom-1.5 right-1.5 text-[5px] text-red-500/30 font-mono tracking-widest select-none">CORE_ENGINE_V31</div>
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ef4444_1px,transparent_1px),linear-gradient(to_bottom,#ef4444_1px,transparent_1px)] bg-[size:10px_18px] pointer-events-none"></div>

          <div className="w-full relative z-10 mt-1">
            {/* Red Skull Icon pulsing in the circular frame as shown in screenshot */}
            <div className="w-full flex justify-center mb-2.5">
              <div className="w-11 h-11 rounded-full border-2 border-red-600/70 flex items-center justify-center bg-[#050101] shadow-[0_0_12px_rgba(239,68,68,0.5),inset_0_0_6px_rgba(239,68,68,0.2)] select-none">
                <Skull className="w-5 h-5 text-red-500 animate-pulse filter drop-shadow-[0_0_3px_#ef4444]" />
              </div>
            </div>
            {/* Plan Header */}
            <h3 className="text-xl font-serif tracking-[0.22em] font-black text-white uppercase flex items-center justify-center gap-1.5 select-none">
              PRO 💀
            </h3>
            
            <div className="w-12 h-[1px] bg-red-650 mx-auto my-2"></div>

            {/* Pricing Cost layout: R$ 29,90 / MÊS on a single line with / MÊS in green */}
            <div className="my-2.5 flex items-baseline justify-center relative select-none gap-1">
              <span className="text-sm text-red-500 font-black tracking-widest uppercase">R$</span>
              <span className="text-5xl font-sans font-black tracking-tighter text-white filter drop-shadow-[0_0_6px_rgba(239,68,68,0.35)]">29,90</span>
              <span className="text-sm text-[#39ff14] font-mono font-black tracking-wider uppercase ml-1.5 align-baseline select-none animate-pulse">/ MÊS</span>
            </div>

            {/* Metade azul metade chama de fogo divider */}
            <div className="w-full h-[2px] bg-gradient-to-r from-blue-500 via-transparent to-red-500 my-3 relative overflow-hidden">
              <div className="absolute top-0 w-1/4 h-full bg-white/25 animate-scan"></div>
            </div>

            {/* Checklist representing the exact items of PRO in screen */}
            <ul className="flex flex-col gap-2.5 text-left px-1.5 mb-5">
              <li className="flex items-center gap-2.5 text-[10.5px] font-sans font-black text-neutral-100 tracking-wide select-none">
                <Coins className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <div className="flex flex-col">
                  <span className="font-extrabold uppercase text-white">80 Créditos iniciais</span>
                  <span className="text-[9px] text-red-400 font-mono tracking-wide block uppercase font-black">8 créditos por dia ⚡</span>
                </div>
              </li>
              <li className="flex items-center gap-2.5 text-[10.5px] font-sans font-black text-neutral-100 tracking-wide select-none">
                <Shield className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="font-extrabold uppercase text-white">Cifragem ultra-segura ativa</span>
              </li>
              <li className="flex items-center gap-2.5 text-[10.5px] font-sans font-black text-neutral-100 tracking-wide select-none">
                <Palette className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <div className="flex flex-col">
                  <span className="font-extrabold uppercase text-white">3 Estilos de Resposta liberados</span>
                  <span className="text-[7.5px] text-red-450 font-mono tracking-wide block uppercase font-black">1 estilo (Sedutor) bloqueado 🔒</span>
                </div>
              </li>
              <li className="flex items-center gap-2.5 text-[10.5px] font-sans font-black text-white tracking-wide select-none">
                <Zap className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="font-black uppercase">Respostas mais rápidas</span>
              </li>
              <li className="flex items-center gap-2.5 text-[10.5px] font-sans font-black text-red-400 tracking-wide select-none">
                <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0 filter drop-shadow-[0_0_3px_#f87171]" />
                <div className="flex flex-col">
                  <span className="uppercase text-red-400 font-black">Gerador de Cantadas por foto</span>
                  <span className="text-[7.5px] text-blue-400 font-mono tracking-wide block uppercase font-black">2 Estilos liberados (2 bloqueados 🔒)</span>
                </div>
              </li>
              <li className="flex items-center gap-2.5 text-[10.5px] font-sans font-black text-neutral-100 tracking-wide select-none">
                <Diamond className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="font-black uppercase">Qualidade superior & Estatísticas</span>
              </li>
            </ul>
          </div>

          {/* Action button in full hot gradient glowing neon */}
          <button
            onClick={() => onSelectPlan('pro')}
            className="w-full py-3.5 bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white font-sans text-xs tracking-[0.2em] font-black uppercase rounded-xl shadow-[0_4px_16px_rgba(239,68,68,0.6)] hover:shadow-[0_0_25px_rgba(239,68,68,0.9)] hover:scale-[1.01] active:scale-95 transition-all duration-300 cursor-pointer select-none border border-red-400/30 flex items-center justify-center"
          >
            DESBLOQUEAR PRO
          </button>
        </motion.div>

        {/* ELITE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#040101]/90 rounded-2xl border-2 border-red-950/60 hover:border-red-900/60 p-4.5 flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden group min-h-[510px] md:min-h-[530px] backdrop-blur-sm transition-all duration-300"
        >
          {/* Cyber design flame element */}
          <CyberFlameLogo />

          {/* Grid visual lines */}
          <div className="absolute top-1.5 left-1.5 text-[6px] text-gray-600 font-mono tracking-widest select-none">ELITE_ACCESS // MAX_D</div>
          <div className="absolute bottom-1.5 right-1.5 text-[5px] text-red-650/30 font-mono tracking-widest select-none">REAL_TIME_SUPERPOWER</div>
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:12px_20px] pointer-events-none"></div>

          <div className="w-full relative z-10">
            {/* Red Skull Icon pulsing in the circular frame */}
            <div className="w-full flex justify-center mb-3">
              <div className="w-11 h-11 rounded-full border border-red-900/40 flex items-center justify-center bg-black shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] select-none">
                <Skull className="w-5 h-5 text-red-500/90 filter drop-shadow-[0_0_2px_#ef4444]" />
              </div>
            </div>

            {/* Plan Header */}
            <h3 className="text-xl font-serif tracking-[0.22em] font-black text-white uppercase flex items-center justify-center gap-1.5 select-none">
              ELITE 💀
            </h3>
            
            <div className="w-10 h-[1px] bg-red-900/40 mx-auto my-2"></div>

            {/* Pricing Cost layout: R$ 49,90 / MÊS on a single line with / MÊS in green */}
            <div className="my-2.5 flex items-baseline justify-center relative select-none gap-1">
              <span className="text-sm text-red-500 font-black tracking-widest uppercase">R$</span>
              <span className="text-5xl font-sans font-black tracking-tighter text-white">49,90</span>
              <span className="text-sm text-[#39ff14] font-mono font-black tracking-wider uppercase ml-1.5 align-baseline select-none animate-pulse">/ MÊS</span>
            </div>

            {/* Metade azul metade chama de fogo divider */}
            <div className="w-full h-[2px] bg-gradient-to-r from-blue-500 via-transparent to-red-500 my-3 relative overflow-hidden">
              <div className="absolute top-0 w-1/4 h-full bg-white/25 animate-scan"></div>
            </div>

            {/* Checklist exactly representing Elite in screen image (Enriched to 10 bullet items) */}
            <ul className="flex flex-col gap-2.5 text-left px-2 mb-5">
              <li className="flex items-center gap-2 text-[10.5px] font-sans font-black text-neutral-100 tracking-wide select-none">
                <Coins className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <div className="flex flex-col">
                  <span className="uppercase text-white font-black">120 Créditos iniciais</span>
                  <span className="text-[9px] text-[#39ff14] font-mono tracking-wide block uppercase font-black">12 créditos por dia ⚡</span>
                </div>
              </li>
              <li className="flex items-center gap-2 text-[10.5px] font-sans font-black text-neutral-100 tracking-wide select-none">
                <Laptop className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="uppercase text-white">Sincronização em nuvem de conversas</span>
              </li>
              <li className="flex items-center gap-2 text-[10.5px] font-sans font-black text-[#39ff14]/90 tracking-wide select-none">
                <Infinity className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="uppercase text-[#39ff14] font-black">Todos os 4 estilos liberados v8.1</span>
              </li>
              <li className="flex items-center gap-2 text-[10.5px] font-sans font-black text-neutral-100 tracking-wide select-none">
                <Sparkles className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="uppercase text-white font-black">Gerador de Cantadas por foto ilimitado</span>
              </li>
              <li className="flex items-center gap-2 text-[10.5px] font-sans font-black text-red-450 tracking-wide select-none">
                <Zap className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="uppercase text-red-400 font-extrabold">Velocidade Prioritária VIP (Sem Filas)</span>
              </li>
              <li className="flex items-center gap-2 text-[10.5px] font-sans font-black text-[#f3f4f6] tracking-wide select-none">
                <Brain className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="uppercase text-red-400">Modelo Cognitivo Persuasivo Inteligente</span>
              </li>
              <li className="flex items-center gap-2 text-[10.5px] font-sans font-black text-neutral-200 tracking-wide select-none">
                <BarChart className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="uppercase text-white">Compatibilidade & Estatísticas Completas</span>
              </li>
              <li className="flex items-center gap-2 text-[10.5px] font-sans font-black text-neutral-100 tracking-wide select-none">
                <Shield className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="uppercase text-white font-bold">Estilo Sedutor Exclusivo 💋 Unlocked</span>
              </li>
              <li className="flex items-center gap-2 text-[10.5px] font-sans font-black text-[#eab308] tracking-wide select-none">
                <Crown className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="uppercase text-yellow-500 font-extrabold">Badge/Selo VIP no Perfil da Conta</span>
              </li>
              <li className="flex items-center gap-2 text-[10.5px] font-sans font-black text-neutral-200 tracking-wide select-none">
                <Laptop className="w-3.5 h-3.5 text-red-500 shrink-0 filter drop-shadow-[0_0_2px_#ef4444]" />
                <span className="uppercase text-neutral-100">Atendimento e Suporte Premium 24/7</span>
              </li>
            </ul>
          </div>

          {/* Action button in elegant sharp neon border */}
          <button
            onClick={() => onSelectPlan('elite')}
            className="w-full py-3.5 bg-black hover:bg-white/5 text-gray-300 hover:text-white font-mono text-[10px] tracking-[0.2em] uppercase font-black rounded-xl border border-red-900 hover:border-red-500 transition-all duration-300 cursor-pointer select-none active:scale-95 shadow-[0_3px_12px_rgba(0,0,0,0.6)] hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            ENTRAR PARA O ELITE
          </button>
        </motion.div>

      </div>

      {/* Decorative center icon divider */}
      <div className="w-full flex justify-center items-center my-1 select-none z-10 relative">
        <div className="w-10 h-10 rounded-full border border-red-600/30 bg-[#030101] flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.2)]">
          <svg className="w-5 h-5 text-red-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M25 40 L50 65 L75 40" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Aesthetic layout bottom matching Visual exactly */}
      <div className="w-full text-center mt-auto border-t border-red-950/40 pt-4 pb-2 z-10 relative select-none">
        <span className="text-[10px] text-neutral-200 font-mono tracking-[0.25em] font-black uppercase block leading-relaxed">
          INTELIGÊNCIA ARTIFICIAL.
        </span>
        <span className="text-[9px] text-red-500 font-mono tracking-[0.3em] font-black uppercase block mt-1">
          CONEXÕES REAIS.
        </span>
      </div>

      {/* Extreme bottom subtle red wireframe radar horizon */}
      <div className="absolute bottom-0 inset-x-0 h-10 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute left-1/2 top-2 -translate-x-1/2 w-[140%] h-24 rounded-t-full bg-red-600/5 border-t border-red-500/15"></div>
      </div>

    </div>
  );
}
