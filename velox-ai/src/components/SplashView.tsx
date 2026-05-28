/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Cpu } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export default function SplashView({ onComplete }: SplashProps) {
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    // 7 seconds delay before going to login account chooser (exact match to user request)
    const timeout = setTimeout(() => {
      onComplete();
    }, 7000);

    // Stagger cycle for secondary background activity indicators
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
    }, 1200);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#030101] text-white flex flex-col justify-between items-center relative overflow-hidden font-sans p-6 select-none">
      
      {/* Background cyber grid overlay for full immersive aesthetic */}
      <div className="absolute inset-0 bg-[#020000] opacity-95"></div>
      <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

      {/* Cybernetic side rails exactly like visual console rails */}
      <div className="hidden md:flex absolute top-16 bottom-16 left-5 w-[1px] bg-red-950/30 flex-col items-center justify-between text-[7.5px] font-mono text-neutral-600 tracking-[0.35em] py-8 z-20">
        <span className="origin-center -rotate-90 uppercase text-red-750 font-black whitespace-nowrap -translate-y-6">
          ● DATA STREAM
        </span>
        <span className="text-[6px] text-red-950/60 font-black">01010011</span>
      </div>

      <div className="hidden md:flex absolute top-16 bottom-16 right-5 w-[1px] bg-red-950/30 flex-col items-center justify-between text-[7.5px] font-mono text-neutral-600 tracking-[0.35em] py-8 z-20">
        <span className="origin-center rotate-90 uppercase text-red-750 font-black whitespace-nowrap translate-y-6">
          ● PROCESSING
        </span>
        <span className="text-[6px] text-red-950/60 font-black">ACTIVE // ONLINE</span>
      </div>

      {/* Top dashboard panels - exact representation from screenshot */}
      <div className="w-full flex justify-between items-start z-10 relative">
        {/* Left header box */}
        <div className="border border-red-950/45 bg-black/60 p-3 rounded-lg flex flex-col font-mono text-[9px] tracking-wide text-gray-400 select-none min-w-[130px] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <span className="text-red-500 font-extrabold tracking-widest text-[10px]">VELOX AI</span>
          <span className="opacity-60 text-[7.5px] tracking-wider mt-0.5 uppercase">SYSTEM STATUS</span>
          <div className="flex items-center gap-2 mt-1.5 justify-between">
            <span className="text-emerald-500 font-black flex items-center gap-1">
              ONLINE
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]"></span>
            </span>
            <svg className="w-12 h-3 text-red-500" viewBox="0 0 50 15" fill="none">
              <path 
                d="M0 7.5 H12 L15 1 L18 14 L21 5 L23 10 L25 7.5 H50" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
        </div>

        {/* Right header box */}
        <div className="border border-red-950/45 bg-black/60 p-3 rounded-lg flex flex-col font-mono text-[9px] tracking-wide text-gray-400 select-none text-right min-w-[130px] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <span className="text-red-500 font-extrabold tracking-widest text-[10px]">NEURAL NETWORK</span>
          <span className="opacity-60 text-[7.5px] tracking-wider mt-0.5 uppercase">ACTIVE</span>
          <div className="flex justify-end mt-1.5">
            <svg className="w-12 h-5 text-red-600/70" viewBox="0 0 60 25" fill="none">
              <circle cx="8" cy="12" r="1.5" fill="currentColor" />
              <circle cx="28" cy="4" r="1.5" fill="currentColor" />
              <circle cx="28" cy="20" r="1.5" fill="currentColor" />
              <circle cx="48" cy="12" r="1.5" fill="currentColor" />
              <line x1="8" y1="12" x2="28" y2="4" stroke="currentColor" strokeWidth="0.55" strokeOpacity="0.4" />
              <line x1="8" y1="12" x2="28" y2="20" stroke="currentColor" strokeWidth="0.55" strokeOpacity="0.4" />
              <line x1="28" y1="4" x2="48" y2="12" stroke="currentColor" strokeWidth="0.55" strokeOpacity="0.4" />
              <line x1="28" y1="20" x2="48" y2="12" stroke="currentColor" strokeWidth="0.55" strokeOpacity="0.4" />
              <line x1="28" y1="4" x2="28" y2="20" stroke="currentColor" strokeWidth="0.55" strokeOpacity="0.3" id="centralLink" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main core loader: Great psychological hooded hacker figure */}
      <div className="flex-1 w-full max-w-sm flex flex-col justify-center items-center gap-5 relative z-10 py-6">
        
        {/* Mysterious Hooded Cyber/Psychology Hacker with high-contrast glowing red eyes */}
        <div className="relative w-64 h-64 md:w-68 md:h-68 flex items-center justify-center shrink-0">
          
          {/* Back intense glowing cosmic red backdrop */}
          <div className="absolute inset-4 bg-radial from-red-600/30 via-transparent to-transparent blur-3xl rounded-full scale-125"></div>

          {/* Glowing orbital border decoration - minimalist outer highlight */}
          <div className="absolute inset-2 border-2 border-red-500/20 rounded-full animate-pulse"></div>

          {/* Highly defined psychological mask and hood vector */}
          <svg className="w-60 h-60 md:w-64 md:h-64 filter drop-shadow-[0_0_25px_rgba(239,68,68,0.65)] z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3d0808" />
                <stop offset="40%" stopColor="#1c0303" />
                <stop offset="100%" stopColor="#050000" />
              </linearGradient>
              <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#991b1b" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="maskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="35%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#1f2937" />
              </linearGradient>
              <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff1a1a" />
                <stop offset="100%" stopColor="#990000" />
              </linearGradient>
              <filter id="superGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Hood Outer Fold Boundary (The Shadow Cape & Folds) */}
            <path
              d="M 100 10 C 35 38 30 100 30 160 C 55 172 85 178 100 178 C 115 178 145 172 170 160 C 170 100 165 38 100 10 Z"
              fill="url(#hoodGrad)"
              stroke="url(#strokeGrad)"
              strokeWidth="3"
            />

            {/* Inner Hood Dark Void (Creates depth for the face / mask to sit inside) */}
            <path
              d="M 100 22 C 48 46 45 98 45 148 C 62 158 82 162 100 162 C 118 162 138 158 155 148 C 155 98 152 46 100 22 Z"
              fill="#080000"
              stroke="#581c1c"
              strokeWidth="1.5"
            />

            {/* Psychological Silver Hacker Mask Plate - High visibility & sharp structures */}
            <path
              d="M 100 55 C 65 72 62 102 62 138 C 76 148 90 152 100 152 C 110 152 124 148 138 138 C 138 102 135 72 100 55 Z"
              fill="url(#maskGrad)"
              stroke="#ffffff"
              strokeWidth="1"
              opacity="0.95"
            />

            {/* Psychological details / cheek bones / nose ridge lines */}
            <path d="M 100 55 L 100 115 L 100 152" stroke="#4b5563" strokeWidth="2" opacity="0.6" />
            
            {/* Hard angled eye brow lines for sinister psychological focus */}
            <path d="M 68 85 L 94 92" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
            <path d="M 132 85 L 106 92" stroke="#111827" strokeWidth="3" strokeLinecap="round" />

            {/* Sleek metallic lower jaw shield lines */}
            <path d="M 72 125 L 100 144 L 128 125" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <path d="M 82 135 L 100 148 L 118 135" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

            {/* Intensely sharp glowing cyberpunk red eyes flashing psychological control */}
            <g filter="url(#superGlow)">
              {/* Left Eye Slit */}
              <motion.path
                animate={{ opacity: [0.9, 1, 0.9], scale: [0.97, 1.05, 0.97] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                d="M 70 94 C 77 94 84 90 88 88 C 84 98 77 99 70 94 Z"
                fill="url(#eyeGrad)"
                stroke="#ff4d4d"
                strokeWidth="1"
              />
              {/* Right Eye Slit */}
              <motion.path
                animate={{ opacity: [0.9, 1, 0.9], scale: [0.97, 1.05, 0.97] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                d="M 130 94 C 123 94 116 90 112 88 C 116 98 123 99 130 94 Z"
                fill="url(#eyeGrad)"
                stroke="#ff4d4d"
                strokeWidth="1"
              />

              {/* Extremely bright white reflection points in iris */}
              <circle cx="78" cy="91" r="1.5" fill="#ffffff" />
              <circle cx="122" cy="91" r="1.5" fill="#ffffff" />
            </g>

            {/* Darker Hood Shadow overlay on the sides of the mask to merge it back into the hood depth */}
            <path d="M 62 80 C 60 100 62 130 75 145 C 65 130 60 100 62 80 Z" fill="#000000" opacity="0.45" />
            <path d="M 138 80 C 140 100 138 130 125 145 C 135 130 140 100 138 80 Z" fill="#000000" opacity="0.45" />

            {/* Outer red neon highlight reflecting off the hoodie lip */}
            <path d="M 100 12 C 50 35 44 90 44 140" stroke="#ff3333" strokeWidth="0.8" opacity="0.6" />
            <path d="M 100 12 C 150 35 156 90 156 140" stroke="#ff3333" strokeWidth="0.8" opacity="0.6" />
          </svg>

        </div>

        {/* 3 Active Se-mexendo (Animated Pulsing) Glowing Red indicator buttons */}
        <div className="flex items-center justify-center gap-6.5 mt-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.8, 1, 0.8],
                boxShadow: [
                  '0 0 8px rgba(239,68,68,0.5)',
                  '0 0 22px rgba(255,80,80,1)',
                  '0 0 8px rgba(239,68,68,0.5)'
                ]
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.35
              }}
              className="w-5.5 h-5.5 rounded-full bg-red-600 border-2 border-white flex items-center justify-center relative shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse"
            >
              {/* Vibrant active core */}
              <div className="w-2.5 h-2.5 rounded-full bg-white filter drop-shadow-[0_0_3px_#ffffff]"></div>
            </motion.div>
          ))}
        </div>

        {/* Loading separators exactly styled matching the visual - texts are robust, bright, high-contrast, bold */}
        <div className="w-full flex flex-col gap-3 font-mono text-center max-w-xs mt-3 select-none text-xs">
          
          <div className="flex flex-col items-center w-full">
            <span className="text-white font-extrabold tracking-wider font-serif text-sm">
              Inicializando <span className="text-red-500 filter drop-shadow-[0_0_6px_rgba(239,68,68,0.95)] font-black uppercase">VELOX AI...</span>
            </span>
            <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent mt-1.5"></div>
          </div>

          <div className="flex flex-col items-center w-full">
            <span className="text-neutral-100 font-extrabold tracking-wider text-xs">
              Preparando para fazer login...
            </span>
            <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent mt-1.5"></div>
          </div>

          <div className="flex flex-col items-center w-full">
            <span className="text-white font-black tracking-normal text-xs uppercase filter drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
              Aguarde, por favor...
            </span>
            <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent mt-1.5"></div>
          </div>

        </div>

      </div>

      {/* Futuristic red digital mountains grid terrain precisely at bottom */}
      <div className="absolute inset-x-0 bottom-14 h-32 overflow-hidden pointer-events-none z-0 select-none opacity-45">
        <svg className="w-full h-full text-red-650/70" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <motion.path
            animate={{ d: [
              "M0,200 Q360,300 720,200 T1440,200 L1440,320 L0,320 Z",
              "M0,160 Q360,110 720,240 T1440,160 L1440,320 L0,320 Z",
              "M0,200 Q360,300 720,200 T1440,200 L1440,320 L0,320 Z"
            ]}}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            fill="none"
            stroke="url(#screenWireGrad)"
            strokeWidth="2.2"
          />

          <motion.path
            animate={{ d: [
              "M0,170 Q360,250 720,130 T1440,170 L1440,320 L0,320 Z",
              "M0,210 Q360,190 720,270 T1440,210 L1440,320 L0,320 Z",
              "M0,170 Q360,250 720,130 T1440,170 L1440,320 L0,320 Z"
            ]}}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            fill="url(#terrainBackdrop)"
            stroke="#ef4444"
            strokeWidth="1.8"
            strokeDasharray="5 4"
          />

          <defs>
            <linearGradient id="screenWireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#2c0000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="terrainBackdrop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#450101" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Cybernetic telemetry footer exact match to visual */}
      <div className="w-full border-t border-red-950/40 pt-4 flex justify-between items-center text-[10px] text-gray-300 font-mono tracking-widest relative z-10 bg-[#030101]/60 font-bold">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-red-500 filter drop-shadow-[0_0_2px_#ef4444]" />
          <div>
            ENCRYPTION: <span className="text-white font-black">128-BIT</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-red-500 filter drop-shadow-[0_0_2px_#ef4444]" />
          <div>
            VERSION: <span className="text-white font-black">2.5.7</span>
          </div>
        </div>
      </div>

    </div>
  );
}
