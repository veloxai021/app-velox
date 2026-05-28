/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User, Brain, MessageSquare, CheckCircle } from 'lucide-react';

interface AnalysisProps {
  onComplete: () => void;
}

export interface ScanningItem {
  id: number;
  label: string;
  progress: number;
  completed: boolean;
  icon: any;
}

export default function AnalysisView({ onComplete }: AnalysisProps) {
  const [items, setItems] = useState<ScanningItem[]>([
    { id: 1, label: 'Analisando seu perfil...', progress: 0, completed: false, icon: User },
    { id: 2, label: 'Adaptando sua experiência...', progress: 0, completed: false, icon: Brain },
    { id: 3, label: 'Preparando os modos de resposta...', progress: 0, completed: false, icon: MessageSquare },
  ]);

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // We want the total duration to be around 8.5 seconds (8500ms)
    // We can simulate progress on each item sequentially:
    // Item 1: 0ms to 3000ms
    // Item 2: 2500ms to 5500ms
    // Item 3: 5000ms to 8000ms
    // Complete at 8500s

    const rate = 100; // ms per update step
    const totalSteps = 85; 
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setCounter(currentStep);

      setItems((prevItems) => {
        return prevItems.map((item) => {
          let progress = 0;
          let completed = false;

          if (item.id === 1) {
            // First item: completes by step 30 (3 seconds)
            progress = Math.min(100, Math.floor((currentStep / 30) * 100));
            completed = progress >= 100;
          } else if (item.id === 2) {
            // Second item: starts at step 20, completes by step 55 (5.5 seconds)
            if (currentStep >= 20) {
              progress = Math.min(100, Math.floor(((currentStep - 20) / 35) * 100));
            }
            completed = progress >= 100;
          } else if (item.id === 3) {
            // Third item: starts at step 50, completes by step 80 (8 seconds)
            if (currentStep >= 50) {
              progress = Math.min(100, Math.floor(((currentStep - 50) / 30) * 100));
            }
            completed = progress >= 100;
          }

          return { ...item, progress, completed };
        });
      });

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    }, rate);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#030101] text-white flex flex-col justify-between items-center p-4 relative overflow-hidden font-sans select-none">
      
      {/* Sci-fi headers */}
      <div className="w-full max-w-sm flex justify-between items-start text-[9px] text-gray-300 font-mono tracking-widest uppercase mb-4 z-10 font-bold">
        {/* Left Neural Status */}
        <div className="flex flex-col text-left">
          <span className="text-[7.5px] text-gray-300 font-mono tracking-[0.15em] leading-none font-bold">NEURAL NETWORK</span>
          <span className="text-[10px] text-red-500 font-mono font-black tracking-widest mt-0.5 animate-pulse">ACTIVE</span>
          <span className="text-[6px] text-red-800/60 font-mono tracking-widest mt-1">■ • + - — —</span>
        </div>

        {/* Center branding */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-red-500 font-black tracking-[0.2em] text-sm">VELOX</span>
          <span className="bg-red-950/40 text-red-500 px-1.5 py-0.5 rounded border border-red-900/40 text-[9px] font-black">AI</span>
        </div>

        {/* Right Cognitive Engine Status */}
        <div className="flex flex-col text-right">
          <span className="text-[7.5px] text-gray-300 font-mono tracking-[0.15em] leading-none font-bold">COGNITIVE ENGINE</span>
          <span className="text-[10px] text-red-500 font-mono font-black tracking-widest mt-0.5">V8.1.7</span>
          <span className="text-[6px] text-red-800/60 font-mono tracking-widest mt-1">• — +</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-sm flex flex-col justify-center items-center gap-6 relative z-10">
        
        {/* Elegant compounds concentric HUD radar matching screenshot exactly! */}
        <div className="relative w-64 h-64 md:w-68 md:h-68 flex items-center justify-center shrink-0 select-none mt-2">
          {/* Back ambient red diffuse glow */}
          <div className="absolute inset-8 bg-gradient-to-tr from-red-650/15 via-transparent to-red-500/10 rounded-full filter blur-2xl animate-pulse"></div>

          {/* Ring 1: Outer delicate pulsing dashed line */}
          <div className="absolute inset-0 border border-red-500/15 rounded-full border-dashed"></div>

          {/* Ring 2: Core pristine white glowing crescent arc (Highlight on the right side) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 border-[2.5px] border-transparent border-t-white/95 border-r-white/95 border-b-white/50 rounded-full filter drop-shadow-[0_0_8px_rgba(255,255,255,0.85)] z-20"
          />

          {/* Ring 3: Concentric thin red outline with tick dashes */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 border-2 border-dashed border-red-600/40 rounded-full"
          />

          {/* Ring 4: Highly detailed tactical tick lines circle system using SVG */}
          <svg className="absolute inset-6 w-[80%] h-[80%] text-red-650/60 origin-center" viewBox="0 0 100 100">
            {/* 36 ticks around the inner ring */}
            {[...Array(36)].map((_, i) => {
              const angle = (i * 360) / 36;
              const rad = (angle * Math.PI) / 180;
              const x1 = 50 + 44 * Math.cos(rad);
              const y1 = 50 + 44 * Math.sin(rad);
              const x2 = 50 + 41 * Math.cos(rad);
              const y2 = 50 + 41 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeOpacity="0.45"
                />
              );
            })}
          </svg>

          {/* Ring 5: Secondary red circular indicator */}
          <motion.div
            animate={{ rotate: 180 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-10 border border-transparent border-l-red-500/70 border-b-red-500/70 rounded-full"
          />

          {/* Center Black Plate with the white double wings logo */}
          <div className="absolute inset-12 bg-[#040101] rounded-full border border-red-950 flex flex-col items-center justify-center shadow-[inset_0_2px_12px_rgba(0,0,0,0.95),0_0_20px_rgba(239,68,68,0.2)] z-10 select-none">
            
            {/* Outer premium accent circle inside black plate */}
            <div className="absolute inset-1.5 rounded-full border border-red-950/40 border-dashed"></div>

            {/* Double sharp white wing logo */}
            <svg className="w-16 h-16 text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.95)] translate-y-1" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Left sharp slanted wing */}
              <path d="M18 32 L40 32 L50 54 L39 54 Z" fill="#ffffff" />
              {/* Right sharp slanted wing */}
              <path d="M82 32 L60 32 L50 54 L61 54 Z" fill="#ffffff" />
              
              {/* Little sharp dot details at bottom center */}
              <polygon points="46,59 54,59 50,65" fill="#ffffff" />
            </svg>

            {/* VELOX Text */}
            <span className="text-xl font-sans font-black tracking-[0.22em] text-white mt-1 translate-y-0.5">VELOX</span>
            
            {/* — AI — Text */}
            <span className="text-[8.5px] font-mono font-black tracking-[0.25em] text-red-500 uppercase -mt-0.5 leading-none">
              — AI —
            </span>
            
          </div>
        </div>

        {/* List of 3 Connected Loading Items (Matching screenshot layout) */}
        <div className="w-full flex-1 flex flex-col justify-center items-stretch my-2 relative max-w-sm">
          
          {/* Linked logical dashed red thread behind list icons */}
          <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-red-600/80 via-red-500 to-red-950/20 border-l border-dashed border-red-500/40 pointer-events-none z-0"></div>

          <div className="flex flex-col gap-6 relative z-10">
            {items.map((it) => {
              const Icon = it.icon;
              const isActive = it.progress > 0;
              return (
                <div key={it.id} className="flex gap-4 items-center relative">
                  
                  {/* Glowing Status badge representing tactical checkpoint */}
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-full border-2 bg-[#050101] flex items-center justify-center transition-all duration-300 relative ${
                      isActive 
                        ? 'border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.55),inset_0_0_6px_rgba(239,68,68,0.25)]' 
                        : 'border-red-950/40 shadow-none'
                    }`}>
                      <Icon className={`w-5 h-5 transition-transform duration-300 ${
                        isActive 
                          ? 'text-white filter drop-shadow-[0_0_3px_rgba(255,255,255,0.85)] scale-110' 
                          : 'text-gray-600'
                      }`} />
                    </div>
                  </div>

                  {/* Content line with high contrast typography and real-time cursor dot progress bar */}
                  <div className="flex-1 flex flex-col justify-center text-left">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className={`text-[13px] font-sans font-black tracking-wide transition-colors duration-300 select-none ${
                        isActive ? 'text-white' : 'text-zinc-500 font-bold'
                      }`}>
                        {it.label}
                      </span>
                      {it.completed ? (
                        <span className="text-[9px] font-mono font-bold text-emerald-400 filter drop-shadow-[0_0_3px_rgba(16,185,129,0.4)]">✓ CONCLUÍDO</span>
                      ) : (
                        isActive && <span className="text-[9px] font-mono font-bold text-red-500">{it.progress}%</span>
                      )}
                    </div>

                    {/* Progress tracking line containing the moving glowing beacon laser dot */}
                    <div className="w-full h-[3px] bg-[#1a0505]/40 rounded-full relative overflow-visible border border-red-950/20">
                      <motion.div
                        className="h-full bg-red-500 rounded-full relative"
                        style={{ width: `${it.progress}%` }}
                        transition={{ ease: 'easeOut' }}
                      >
                        {/* Interactive red and white laser point */}
                        {it.progress > 0 && it.progress < 100 && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ef4444,0_0_4px_#ef4444] transform translate-x-1/2" />
                        )}
                        {it.progress === 100 && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transform translate-x-1/2" />
                        )}
                      </motion.div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Cybernetic Oscillating Telemetry visual graph (Histogram exactly matching screenshot) */}
      <div className="w-full flex justify-between items-end px-1 mb-3 relative z-10 max-w-sm select-none">
        
        {/* Left oscillated stream */}
        <div className="flex flex-col items-start gap-1">
          <span className="text-[7.5px] text-gray-300 font-mono tracking-widest leading-none font-black">DATA STREAM</span>
          <div className="flex items-end gap-0.5 h-6">
            {[...Array(14)].map((_, i) => {
              const heightPercent = [35, 60, 45, 80, 50, 95, 40, 75, 55, 30, 85, 40, 65, 45][i % 14];
              return (
                <motion.div
                  key={i}
                  animate={{ height: [`${heightPercent - 15}%`, `${heightPercent + 5}%`, `${heightPercent}%`] }}
                  transition={{ duration: 1.1 + (i % 3) * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-[1.5px] bg-red-600/70 rounded-t-xs"
                />
              );
            })}
          </div>
        </div>

        {/* Right oscillated realtime process data */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-[7.5px] text-gray-300 font-mono tracking-widest leading-none text-right font-black">PROCESSING REALTIME</span>
          <div className="flex items-end gap-0.5 h-6">
            {[...Array(14)].map((_, i) => {
              const heightPercent = [80, 45, 65, 30, 90, 50, 75, 40, 60, 85, 35, 70, 50, 80][i % 14];
              return (
                <motion.div
                  key={i}
                  animate={{ height: [`${heightPercent + 10}%`, `${heightPercent - 15}%`, `${heightPercent}%`] }}
                  transition={{ duration: 0.9 + (i % 2) * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-[1.5px] bg-red-600/70 rounded-t-xs"
                />
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom system credentials and futuristic indicators footer */}
      <div className="w-full border-t border-red-950/45 pt-3 mb-1 flex justify-between items-center text-[7.5px] text-gray-300 font-mono tracking-[0.12em] uppercase relative z-10 max-w-sm select-none font-bold">
        <div className="flex flex-col text-left">
          <span className="text-neutral-100 font-black">ENCRYPTED</span>
          <span className="text-red-500 font-black mt-0.5 tracking-widest">SECURE CONNECTION</span>
          <div className="flex gap-0.5 mt-1">
            <div className="w-1 h-1 bg-red-600"></div>
            <div className="w-1 h-1 bg-red-600 animate-pulse"></div>
            <div className="w-1 h-1 bg-red-600"></div>
          </div>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-neutral-100 font-black">CONFIDENTIAL</span>
          <span className="text-red-500 font-black mt-0.5 tracking-widest">AI TECHNOLOGY</span>
          <div className="flex gap-0.5 mt-1 justify-end">
            <div className="w-1 h-1 bg-red-600"></div>
            <div className="w-1 h-1 bg-red-600"></div>
            <div className="w-1 h-1 bg-red-600 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Wireframe-style planet horizon with glare overlay at absolute bottom */}
      <div className="absolute bottom-0 inset-x-0 h-14 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute left-1/2 top-4 -translate-x-1/2 w-[160%] h-36 rounded-t-full bg-gradient-to-t from-red-600/10 to-transparent border-t border-red-500/25 filter blur-xs"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#fff,0_0_5px_#ef4444]" />
      </div>

    </div>
  );
}
