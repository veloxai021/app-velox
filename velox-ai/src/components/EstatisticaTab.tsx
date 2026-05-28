/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageCircle, Heart, RefreshCw, Flame, Hexagon, Sparkles, HelpCircle, Laptop
} from 'lucide-react';

interface EstatisticaProps {
  totalResponses: number;
  totalPickups: number;
  creditsUsed: number;
  mostUsedStyle: string;
  logs: any[];
  credits: number;
  maxCredits: number;
}

export default function EstatisticaTab({
  totalResponses,
  totalPickups,
  creditsUsed,
  mostUsedStyle,
  logs,
  credits,
  maxCredits
}: EstatisticaProps) {

  // Helper to determine if a log is a pickup
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

  // Filter logs for Cantadas and Respostas separately
  const pickupLogs = logs.filter(isPickupLog);
  const responseLogs = logs.filter(l => !isPickupLog(l));

  // --- CANTADAS STATS ---
  const oCountPickups = pickupLogs.filter(l => l.style === 'Ousado').length;
  const rCountPickups = pickupLogs.filter(l => l.style === 'Romântico').length;
  const sCountPickups = pickupLogs.filter(l => l.style === 'Sedutor').length;
  const bCountPickups = pickupLogs.filter(l => l.style === 'Brincalhão').length;
  const totalPickupStyleCount = oCountPickups + rCountPickups + sCountPickups + bCountPickups;

  const oPctPickups = totalPickupStyleCount > 0 ? Math.round((oCountPickups / totalPickupStyleCount) * 100) : 0;
  const rPctPickups = totalPickupStyleCount > 0 ? Math.round((rCountPickups / totalPickupStyleCount) * 100) : 0;
  const sPctPickups = totalPickupStyleCount > 0 ? Math.round((sCountPickups / totalPickupStyleCount) * 100) : 0;
  const bPctPickups = totalPickupStyleCount > 0 ? Math.round((bCountPickups / totalPickupStyleCount) * 100) : 0;

  let displayMostUsedPickup = "Nenhum";
  let displayMostUsedPickupPct = 0;
  if (totalPickupStyleCount > 0) {
    const maxVal = Math.max(oCountPickups, rCountPickups, sCountPickups, bCountPickups);
    if (maxVal === oCountPickups) { displayMostUsedPickup = "Ousado"; displayMostUsedPickupPct = oPctPickups; }
    else if (maxVal === rCountPickups) { displayMostUsedPickup = "Romântico"; displayMostUsedPickupPct = rPctPickups; }
    else if (maxVal === sCountPickups) { displayMostUsedPickup = "Sedutor"; displayMostUsedPickupPct = sPctPickups; }
    else { displayMostUsedPickup = "Brincalhão"; displayMostUsedPickupPct = bPctPickups; }
  } else if (totalPickups > 0) {
    displayMostUsedPickup = mostUsedStyle || "Romântico";
    displayMostUsedPickupPct = 100;
  }

  // --- RESPOSTAS STATS ---
  const oCountResponses = responseLogs.filter(l => l.style === 'Ousado').length;
  const rCountResponses = responseLogs.filter(l => l.style === 'Romântico').length;
  const sCountResponses = responseLogs.filter(l => l.style === 'Sedutor').length;
  const bCountResponses = responseLogs.filter(l => l.style === 'Brincalhão').length;
  const totalResponseStyleCount = oCountResponses + rCountResponses + sCountResponses + bCountResponses;

  const oPctResponses = totalResponseStyleCount > 0 ? Math.round((oCountResponses / totalResponseStyleCount) * 100) : 0;
  const rPctResponses = totalResponseStyleCount > 0 ? Math.round((rCountResponses / totalResponseStyleCount) * 100) : 0;
  const sPctResponses = totalResponseStyleCount > 0 ? Math.round((sCountResponses / totalResponseStyleCount) * 100) : 0;
  const bPctResponses = totalResponseStyleCount > 0 ? Math.round((bCountResponses / totalResponseStyleCount) * 100) : 0;

  let displayMostUsedResponse = "Nenhum";
  let displayMostUsedResponsePct = 0;
  if (totalResponseStyleCount > 0) {
    const maxVal = Math.max(oCountResponses, rCountResponses, sCountResponses, bCountResponses);
    if (maxVal === oCountResponses) { displayMostUsedResponse = "Ousado"; displayMostUsedResponsePct = oPctResponses; }
    else if (maxVal === rCountResponses) { displayMostUsedResponse = "Romântico"; displayMostUsedResponsePct = rPctResponses; }
    else if (maxVal === sCountResponses) { displayMostUsedResponse = "Sedutor"; displayMostUsedResponsePct = sPctResponses; }
    else { displayMostUsedResponse = "Brincalhão"; displayMostUsedResponsePct = bPctResponses; }
  } else if (totalResponses > 0) {
    displayMostUsedResponse = mostUsedStyle || "Ousado";
    displayMostUsedResponsePct = 100;
  }

  // Total calculated usage
  const calculatedTotalInteractions = totalResponses + totalPickups;

  // Dynamic daily sequence values that rise automatically based on actual user generations
  const dayValues = [
    Math.min(40, calculatedTotalInteractions > 0 ? Math.max(8, (totalResponses * 6) + 4) : 0),
    Math.min(40, calculatedTotalInteractions > 0 ? Math.max(6, (totalPickups * 8) + 2) : 0),
    Math.min(40, calculatedTotalInteractions > 0 ? Math.max(10, (logs.length * 5) + 6) : 0),
    Math.min(40, calculatedTotalInteractions > 0 ? Math.max(12, (calculatedTotalInteractions * 4) + 10) : 0),
    Math.min(40, calculatedTotalInteractions > 0 ? Math.max(5, (creditsUsed * 5) + 3) : 0),
    Math.min(40, calculatedTotalInteractions > 0 ? Math.max(9, (totalResponses * 4 + totalPickups * 3)) : 0),
    Math.min(40, calculatedTotalInteractions > 0 ? Math.max(11, (calculatedTotalInteractions * 7) + 5) : 0),
  ];

  // Render SVG points based on dayValues (y ranges from 90 for value 0 to 10 for value 40)
  const getCoordinates = () => {
    const xCoordinates = [15, 60, 105, 150, 195, 240, 285];
    return xCoordinates.map((x, i) => {
      const val = dayValues[i];
      // Formula: constant height level from 90 (at value 0) to 10 (at value 40)
      const y = 90 - (val / 40) * 80;
      return { x, y };
    });
  };

  const coords = getCoordinates();
  
  // Build SVG Path query d
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath = calculatedTotalInteractions > 0
    ? `${linePath} L 285 90 L 15 90 Z`
    : `M 15 90 L 285 90 Z`; // Flat bottom initially

  return (
    <div className="w-full flex flex-col gap-4 font-sans select-none pb-4">
      
      {/* Title block exactly matching the screenshot */}
      <div className="text-center my-1">
        <h2 className="text-2xl font-black font-serif tracking-[0.25em] text-white uppercase select-none flex items-center justify-center gap-1">
          ESTAT<span className="text-red-600 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">Í</span>STICAS
        </h2>
        
        {/* Decorative thin technical lines under title */}
        <div className="flex items-center justify-center gap-2 mt-2 select-none">
          <div className="w-8 h-[1px] bg-red-900/30"></div>
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-red-600 rotate-45"></span>
            <span className="w-1 h-1 bg-red-600/60 rotate-45"></span>
            <span className="w-1 h-1 bg-red-600/30 rotate-45"></span>
          </div>
          <div className="w-8 h-[1px] bg-red-900/30"></div>
        </div>
      </div>

      {/* 4 STATS BLOCKS (2 columns, styled exactly as screenshot but starting completely from actual clean values) */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        
        {/* Card 1: Total de Respostas Geradas (Starts at actual generated responses) */}
        <div className="bg-[#050101] rounded-xl border border-red-950/40 hover:border-red-900/40 p-3 flex items-center justify-start gap-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-300">
          <div className="w-10 h-10 rounded-lg bg-red-950/10 border border-red-900/30 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-red-500/90 filter drop-shadow-[0_0_3px_#ef4444]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[8px] text-[#f3f4f6] font-black tracking-wider leading-none uppercase">
              TOTAL DE RESPOSTAS
            </span>
            <span className="text-[8px] text-[#f3f4f6] font-black tracking-wider leading-none uppercase mt-0.5">
              GERADAS
            </span>
            <span className="text-xl font-black font-mono text-white tracking-tight mt-1">
              {totalResponses.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Card 2: Total de Cantadas Criadas */}
        <div className="bg-[#050101] rounded-xl border border-red-950/40 hover:border-red-900/40 p-3 flex items-center justify-start gap-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-300">
          <div className="w-10 h-10 rounded-lg bg-red-950/10 border border-red-900/30 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-red-500/90 filter drop-shadow-[0_0_3px_#ef4444]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[8px] text-[#f3f4f6] font-black tracking-wider leading-none uppercase">
              TOTAL DE CANTADAS
            </span>
            <span className="text-[8px] text-[#f3f4f6] font-black tracking-wider leading-none uppercase mt-0.5">
              CRIADAS
            </span>
            <span className="text-xl font-black font-mono text-white tracking-tight mt-1">
              {totalPickups.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Card 3: Créditos Usados */}
        <div className="bg-[#050101] rounded-xl border border-red-950/40 hover:border-red-900/40 p-3 flex items-center justify-start gap-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-300">
          <div className="w-10 h-10 rounded-lg bg-red-950/10 border border-red-900/30 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4.5 h-4.5 text-red-500/90 filter drop-shadow-[0_0_3px_#ef4444]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[8px] text-[#f3f4f6] font-black tracking-wider leading-none uppercase">
              CRÉDITOS USADOS
            </span>
            <span className="text-[8px] text-[#f3f4f6] font-black tracking-wider leading-none uppercase mt-0.5">
              REAIS / EXPANSÃO
            </span>
            <span className="text-xl font-black font-mono text-white tracking-tight mt-2 leading-none">
              {creditsUsed}
            </span>
          </div>
        </div>

        {/* Card 4: Créditos Restantes (Real live session values mapped perfectly!) */}
        <div className="bg-[#050101] rounded-xl border border-red-950/40 hover:border-red-900/40 p-3 flex items-center justify-start gap-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-300">
          <div className="w-10 h-10 rounded-lg bg-red-950/10 border border-red-900/30 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-500/90 filter drop-shadow-[0_0_3px_#ef4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="5" y="5" width="14" height="14" rx="1" transform="rotate(45 12 12)" className="fill-red-500/10" />
              <line x1="12" y1="3" x2="12" y2="21" />
              <line x1="3" y1="12" x2="21" y2="12" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[8px] text-[#f3f4f6] font-black tracking-wider leading-none uppercase">
              CRÉDITOS RESTANTES
            </span>
            <span className="text-xl font-mono text-white tracking-tight mt-2 leading-none font-bold">
              {credits} <span className="text-gray-600 text-xs font-normal">/ {maxCredits}</span>
            </span>
          </div>
        </div>

      </div>

      {/* ESTILO DE CANTADAS MAIS USADO SECTION */}
      <div className="bg-[#050101] rounded-xl border border-red-950/40 p-3 shadow-[inset_0_1px_5px_rgba(0,0,0,0.8)] text-left flex flex-col gap-3 relative overflow-hidden">
        
        <h3 className="text-[10px] text-red-500 font-mono tracking-[0.18em] font-black uppercase">
          ESTILO DE CANTADAS MAIS USADO
        </h3>

        <div className="flex items-center justify-between gap-2 mt-1">
          {/* Left panel metrics */}
          <div className="flex items-center gap-2">
            {/* Hexagon icon frame with Heart */}
            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
              <Hexagon className="absolute inset-0 w-11 h-11 text-red-900/30 fill-red-950/15" strokeWidth="2" />
              <div className="absolute inset-1 flex items-center justify-center border border-red-650/30 rounded-full bg-black/40">
                <Heart className="w-4 h-4 text-red-500 filter drop-shadow-[0_0_2px_#ef4444]" />
              </div>
            </div>

            <div className="flex flex-col text-left justify-center min-w-0">
              <span className="text-[11px] text-white font-sans font-black tracking-wide uppercase truncate leading-none">
                {displayMostUsedPickup}
              </span>
              <span className="text-xl font-black font-mono text-red-500 filter drop-shadow-[0_0_3px_rgba(239,68,68,0.4)] leading-none mt-1">
                {displayMostUsedPickupPct}%
              </span>
              <span className="text-[8px] text-[#f3f4f6] font-[#f3f4f6] tracking-wide mt-1 uppercase whitespace-nowrap font-black">
                do total de cantadas
              </span>
            </div>
          </div>

          {/* Right Panel: Donut Pie chart or empty state */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* SVG Donut Chart with elegant details */}
            <div className="relative select-none flex items-center gap-1.5">
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                  {/* Empty circle slot placeholder */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#100303" strokeWidth="3.2" />

                  {totalPickupStyleCount > 0 ? (
                    <>
                      {/* Brincalhão segment */}
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#3f0e0e"
                        strokeWidth="3.2"
                        initial={{ strokeDasharray: "0 100" }}
                        animate={{ strokeDasharray: `${bPctPickups} ${100 - bPctPickups}` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeDashoffset="100"
                      />
                      {/* Sedutor segment */}
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#b91c1c"
                        strokeWidth="3.2"
                        initial={{ strokeDasharray: "0 100" }}
                        animate={{ strokeDasharray: `${sPctPickups} ${100 - sPctPickups}` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeDashoffset={`${100 - bPctPickups}`}
                      />
                      {/* Romântico segment */}
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#ef4444"
                        strokeWidth="3.2"
                        initial={{ strokeDasharray: "0 100" }}
                        animate={{ strokeDasharray: `${rPctPickups} ${100 - rPctPickups}` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeDashoffset={`${100 - bPctPickups - sPctPickups}`}
                      />
                      {/* Ousado segment */}
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#f87171"
                        strokeWidth="3.5"
                        initial={{ strokeDasharray: "0 100" }}
                        animate={{ strokeDasharray: `${oPctPickups} ${100 - oPctPickups}` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeDashoffset={`${100 - bPctPickups - sPctPickups - rPctPickups}`}
                        className="filter drop-shadow-[0_0_2px_#f87171]"
                      />
                    </>
                  ) : (
                    /* Elegant pulsing indicator circle if no data */
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15.9154"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeDasharray="4 8"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="origin-center"
                      style={{ transformOrigin: 'center' }}
                    />
                  )}
                </svg>
                {/* Center target circle inside the donut */}
                <div className="absolute inset-3 rounded-full bg-black border border-red-950/60 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-red-650"></div>
                </div>
              </div>

              {/* Labels dynamically showing */}
              <div className="flex flex-col text-left gap-0.5 shrink-0 ml-1">
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-[8px] font-mono text-red-300 font-extrabold w-5 text-right shrink-0">{totalPickupStyleCount > 0 ? oPctPickups : 0}%</span>
                  <span className="text-[8px] text-neutral-100 uppercase font-sans font-black leading-none">Ousado</span>
                </div>
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-[8px] font-mono text-red-500 font-extrabold w-5 text-right shrink-0">{totalPickupStyleCount > 0 ? rPctPickups : 0}%</span>
                  <span className="text-[8px] text-neutral-200 uppercase font-sans font-black leading-none font-bold">Romântico</span>
                </div>
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-[8px] font-mono text-red-700 font-extrabold w-5 text-right shrink-0">{totalPickupStyleCount > 0 ? sPctPickups : 0}%</span>
                  <span className="text-[8px] text-neutral-300 uppercase font-sans font-black leading-none">Sedutor</span>
                </div>
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-[8px] font-mono text-red-950 font-extrabold w-5 text-right shrink-0">{totalPickupStyleCount > 0 ? bPctPickups : 0}%</span>
                  <span className="text-[8px] text-neutral-400 uppercase font-sans font-black leading-none">Brincalhão</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ESTILO DE RESPOSTAS MAIS USADO SECTION */}
      <div className="bg-[#050101] rounded-xl border border-red-950/40 p-3 shadow-[inset_0_1px_5px_rgba(0,0,0,0.8)] text-left flex flex-col gap-3 relative overflow-hidden">
        
        <h3 className="text-[10px] text-red-500 font-mono tracking-[0.18em] font-black uppercase">
          ESTILO DE RESPOSTAS MAIS USADO
        </h3>

        <div className="flex items-center justify-between gap-2 mt-1">
          {/* Left panel metrics */}
          <div className="flex items-center gap-2">
            {/* Hexagon icon frame with MessageCircle */}
            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
              <Hexagon className="absolute inset-0 w-11 h-11 text-red-900/30 fill-red-950/15" strokeWidth="2" />
              <div className="absolute inset-1 flex items-center justify-center border border-red-650/30 rounded-full bg-black/40">
                <MessageCircle className="w-4 h-4 text-red-500 filter drop-shadow-[0_0_2px_#ef4444]" />
              </div>
            </div>

            <div className="flex flex-col text-left justify-center min-w-0">
              <span className="text-[11px] text-white font-sans font-black tracking-wide uppercase truncate leading-none">
                {displayMostUsedResponse}
              </span>
              <span className="text-xl font-black font-mono text-red-500 filter drop-shadow-[0_0_3px_rgba(239,68,68,0.4)] leading-none mt-1">
                {displayMostUsedResponsePct}%
              </span>
              <span className="text-[8px] text-[#f3f4f6] font-[#f3f4f6] tracking-wide mt-1 uppercase whitespace-nowrap font-black">
                do total de respostas
              </span>
            </div>
          </div>

          {/* Right Panel: Donut Pie chart or empty state */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* SVG Donut Chart with elegant details */}
            <div className="relative select-none flex items-center gap-1.5">
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                  {/* Empty circle slot placeholder */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#100303" strokeWidth="3.2" />

                  {totalResponseStyleCount > 0 ? (
                    <>
                      {/* Brincalhão segment */}
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#3f0e0e"
                        strokeWidth="3.2"
                        initial={{ strokeDasharray: "0 100" }}
                        animate={{ strokeDasharray: `${bPctResponses} ${100 - bPctResponses}` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeDashoffset="100"
                      />
                      {/* Sedutor segment */}
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#b91c1c"
                        strokeWidth="3.2"
                        initial={{ strokeDasharray: "0 100" }}
                        animate={{ strokeDasharray: `${sPctResponses} ${100 - sPctResponses}` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeDashoffset={`${100 - bPctResponses}`}
                      />
                      {/* Romântico segment */}
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#ef4444"
                        strokeWidth="3.2"
                        initial={{ strokeDasharray: "0 100" }}
                        animate={{ strokeDasharray: `${rPctResponses} ${100 - rPctResponses}` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeDashoffset={`${100 - bPctResponses - sPctResponses}`}
                      />
                      {/* Ousado segment */}
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#f87171"
                        strokeWidth="3.5"
                        initial={{ strokeDasharray: "0 100" }}
                        animate={{ strokeDasharray: `${oPctResponses} ${100 - oPctResponses}` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeDashoffset={`${100 - bPctResponses - sPctResponses - rPctResponses}`}
                        className="filter drop-shadow-[0_0_2px_#f87171]"
                      />
                    </>
                  ) : (
                    /* Elegant pulsing indicator circle if no data */
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15.9154"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeDasharray="4 8"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="origin-center"
                      style={{ transformOrigin: 'center' }}
                    />
                  )}
                </svg>
                {/* Center target circle inside the donut */}
                <div className="absolute inset-3 rounded-full bg-black border border-red-950/60 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-red-650"></div>
                </div>
              </div>

              {/* Labels dynamically showing */}
              <div className="flex flex-col text-left gap-0.5 shrink-0 ml-1">
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-[8px] font-mono text-red-300 font-extrabold w-5 text-right shrink-0">{totalResponseStyleCount > 0 ? oPctResponses : 0}%</span>
                  <span className="text-[8px] text-neutral-100 uppercase font-sans font-black leading-none">Ousado</span>
                </div>
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-[8px] font-mono text-red-500 font-extrabold w-5 text-right shrink-0">{totalResponseStyleCount > 0 ? rPctResponses : 0}%</span>
                  <span className="text-[8px] text-neutral-200 uppercase font-sans font-black leading-none font-bold">Romântico</span>
                </div>
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-[8px] font-mono text-red-700 font-extrabold w-5 text-right shrink-0">{totalResponseStyleCount > 0 ? sPctResponses : 0}%</span>
                  <span className="text-[8px] text-neutral-300 uppercase font-sans font-black leading-none">Sedutor</span>
                </div>
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-[8px] font-mono text-red-950 font-extrabold w-5 text-right shrink-0">{totalResponseStyleCount > 0 ? bPctResponses : 0}%</span>
                  <span className="text-[8px] text-neutral-400 uppercase font-sans font-black leading-none">Brincalhão</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

       {/* SEQUÊNCIA DIÁRIA SECTION */}
      <div className="bg-[#050101] rounded-xl border border-red-950/45 p-4 shadow-[inset_0_1px_5px_rgba(0,0,0,0.8)] text-left flex flex-col gap-3 relative overflow-hidden group">
        
        {/* Real-time status indicator */}
        <div className="absolute top-1.5 right-3 text-[7px] text-red-500/80 font-mono tracking-widest uppercase select-none flex items-center gap-1 animate-pulse">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span> LIVE // ATUALIZANDO
        </div>

        <h3 className="text-[10px] text-red-500 font-mono tracking-[0.18em] font-black uppercase">
          SEQUÊNCIA DIÁRIA
        </h3>

        {/* Dynamic real-time chart. Grows autonomously with user generations */}
        <div 
          className="w-full h-28 relative mt-2 select-none bg-black/20 rounded border border-red-950/20 p-1"
        >
          <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartLineGradInteractive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal guideline levels */}
            <line x1="0" y1="10" x2="300" y2="10" stroke="#ef4444" strokeOpacity="0.06" strokeDasharray="3 3" />
            <line x1="0" y1="35" x2="300" y2="35" stroke="#ef4444" strokeOpacity="0.06" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2="300" y2="60" stroke="#ef4444" strokeOpacity="0.06" strokeDasharray="3 3" />
            <line x1="0" y1="85" x2="300" y2="85" stroke="#ef4444" strokeOpacity="0.06" strokeDasharray="3 3" />

            {/* Area under curve */}
            <motion.path
              key={`area-${calculatedTotalInteractions}`}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              d={areaPath}
              fill="url(#chartLineGradInteractive)"
            />

            {/* Red accent line representing values */}
            <motion.path
              key={`line-${calculatedTotalInteractions}`}
              initial={{ pathLength: 0.8 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35 }}
              d={linePath}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="filter drop-shadow-[0_0_4px_rgba(239,68,68,0.7)]"
            />

            {/* Day nodes plotted autonomously */}
            {coords.map((c, idx) => (
              <g key={idx}>
                {/* Node dot */}
                <circle 
                  cx={c.x} 
                  cy={c.y} 
                  r="4" 
                  fill={dayValues[idx] > 0 ? "#ffffff" : "#1a0505"} 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                  className={dayValues[idx] > 0 ? "animate-pulse" : ""}
                />
              </g>
            ))}
          </svg>

          {/* Grid point labels from 0 to 40 on left side */}
          <div className="absolute left-1.5 inset-y-1.5 flex flex-col justify-between text-[7px] text-gray-600 font-mono select-none pr-1 pointer-events-none">
            <span>40</span>
            <span>30</span>
            <span>20</span>
            <span>10</span>
            <span>0</span>
          </div>

          {/* Empty state overlay if user has 0 generations */}
          {calculatedTotalInteractions === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[0.5px] pointer-events-none rounded select-none">
              <div className="text-center px-4">
                <p className="text-[9px] text-red-500 font-mono tracking-widest uppercase font-black">
                  Sequência Inativa
                </p>
                <p className="text-[7.5px] text-gray-500 font-sans tracking-wide mt-1">
                  Gere cantadas ou respostas para ativar o gráfico de sequência!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic bottom progress bar indicator, completely replacing weekdays */}
        <div className="flex justify-between items-center text-[8.5px] text-gray-500 font-mono tracking-widest px-2 uppercase my-1">
          <span>POTÊNCIA DA SEQUÊNCIA</span>
          <span className="text-red-500 font-black">
            {calculatedTotalInteractions > 0 ? `${Math.min(100, Math.round((calculatedTotalInteractions / 12) * 100))}%` : "0%"} ATIVA
          </span>
        </div>

      </div>

      {/* TOTAL DE USO SECTION */}
      <div className="bg-[#050101] rounded-xl border border-red-950/40 p-4 shadow-[inset_0_1px_5px_rgba(0,0,0,0.8)] text-left flex flex-col gap-3 relative overflow-hidden">
        
        <h3 className="text-[10px] text-red-500 font-mono tracking-[0.18em] font-black uppercase">
          TOTAL DE USO
        </h3>

        <div className="flex items-center justify-between gap-4 mt-1">
          {/* Left panel: Hexagon with dynamic value */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <Hexagon className="absolute inset-0 w-14 h-14 text-red-900/30 fill-red-950/15" strokeWidth="2" />
              <div className="absolute inset-1.5 flex flex-col gap-0.5 items-center justify-center border border-red-650 rounded-full bg-black/40">
                <div className="flex items-end gap-[1.5px] h-3">
                  <span className={`w-1 h-1.5 ${calculatedTotalInteractions > 0 ? "bg-red-500" : "bg-red-950/40"}`}></span>
                  <span className={`w-1 h-2.5 ${calculatedTotalInteractions > 2 ? "bg-red-500" : "bg-red-950/40"}`}></span>
                  <span className={`w-1 h-3.5 ${calculatedTotalInteractions > 5 ? "bg-red-400" : "bg-red-950/40"}`}></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col text-left justify-center">
              <span className="text-2xl font-black font-mono text-white tracking-tight leading-none animate-pulse">
                {calculatedTotalInteractions.toLocaleString('pt-BR')}
              </span>
              <span className="text-[8px] text-gray-500 font-mono tracking-wide mt-1 uppercase">
                Interações totais
              </span>
            </div>
          </div>

          {/* Right Panel: Growing curved bar chart with arrow pointing up-right exactly as shown in image */}
          <div className="relative w-36 h-12 select-none flex items-end justify-between shrink-0 mb-1 pr-1.5">
            {/* Glowing red curving line starting from bottom-left to top-right */}
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 144 48">
              <path
                d="M 5 45 Q 60 42, 137 10"
                fill="none"
                stroke={calculatedTotalInteractions > 0 ? "#ef4444" : "#2a0202"}
                strokeWidth="2.5"
                className="filter drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]"
              />
              <polygon 
                points="135,13 141,6 140,14" 
                fill={calculatedTotalInteractions > 0 ? "#ef4444" : "#2a0202"} 
                className="filter drop-shadow-[0_0_2px_#ef4444]" 
              />
            </svg>

            {/* 6 vertical rounded-t bars growing larger based on state */}
            <div className={`w-3.5 h-[10%] rounded-t border transition-colors duration-500 ${calculatedTotalInteractions > 0 ? "bg-red-950/60 border-red-900/20" : "bg-red-950/10 border-red-950/20"}`}></div>
            <div className={`w-3.5 h-[22%] rounded-t border transition-colors duration-500 ${calculatedTotalInteractions > 1 ? "bg-red-950/70 border-red-900/20" : "bg-red-950/10 border-red-950/20"}`}></div>
            <div className={`w-3.5 h-[38%] rounded-t border transition-colors duration-500 ${calculatedTotalInteractions > 3 ? "bg-red-900/40 border-red-900/20" : "bg-red-950/10 border-red-950/20"}`}></div>
            <div className={`w-3.5 h-[56%] rounded-t border transition-colors duration-500 ${calculatedTotalInteractions > 5 ? "bg-red-900/50 border-red-900/25" : "bg-red-950/10 border-red-950/20"}`}></div>
            <div className={`w-3.5 h-[72%] rounded-t border transition-colors duration-500 ${calculatedTotalInteractions > 7 ? "bg-red-700/60 border-red-650/30" : "bg-red-950/10 border-red-950/20"}`}></div>
            <div className={`w-3.5 h-[90%] rounded-t border transition-colors duration-500 ${calculatedTotalInteractions > 9 ? "bg-red-600/80 border-red-500/30 filter drop-shadow-[0_0_3px_rgba(239,68,68,0.2)]" : "bg-red-950/10 border-red-950/20"}`}></div>
          </div>
        </div>

      </div>

    </div>
  );
}
