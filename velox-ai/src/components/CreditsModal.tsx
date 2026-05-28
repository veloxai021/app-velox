/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  Zap, ShoppingCart, Play, Star, MessageSquareCode, 
  Target, Rocket, Crown, Gem, Infinity as InfinityIcon, X 
} from 'lucide-react';

interface CreditsModalProps {
  onClose: () => void;
  onBuyCredits: (amount: number) => void;
}

export default function CreditsModal({ onClose, onBuyCredits }: CreditsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-start items-center overflow-y-auto p-4 md:p-6 font-sans select-none scrollbar-none">
      
      {/* Absolute Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2.5 rounded-full border border-red-950/60 bg-red-950/20 text-gray-400 hover:text-white cursor-pointer transition-all z-50"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Cyberpunk Glow Backgrounds */}
      <div className="absolute top-0 w-full max-w-lg h-96 bg-red-600/5 blur-3xl rounded-full pointer-events-none"></div>

      {/* Elegant Header exactly matching visual and styling */}
      <div className="text-center mt-10 mb-8 relative z-10 max-w-lg">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase mb-2">
          <span>VELOX</span>
          <span className="text-[9px] font-sans text-red-500 font-extrabold bg-red-950/40 border border-red-900/40 px-1 py-0.2 rounded">AI</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black font-serif tracking-widest text-white uppercase leading-tight font-display">
          COMPRAR MAIS<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-red-500 to-red-600 font-serif font-black">CRÉDITOS</span>
        </h2>
        <p className="mt-2 text-xs text-neutral-200 font-sans font-bold tracking-wide max-w-xs mx-auto">
          Nunca fique sem respostas no meio da conversa.
        </p>
      </div>

      {/* Grid columns of 3 packages - Sleek, tall, high-tech card visual designs */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch relative z-10 pb-10">
                {/* +10 Credits option */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-[#050505] rounded-3xl border border-red-950/45 p-6 flex flex-col justify-between items-center text-center shadow-2xl relative min-h-[460px] max-w-xs w-full mx-auto overflow-hidden group"
        >
          {/* Subtle sci-fi laser glow background */}
          <div className="absolute inset-0 bg-radial-gradient from-red-500/5 to-transparent pointer-events-none opacity-40"></div>
          
          {/* Cyberpunk Tech Corners */}
          <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-red-500/30 rounded-tl-sm pointer-events-none"></div>
          <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-red-500/30 rounded-tr-sm pointer-events-none"></div>
          <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-red-500/30 rounded-bl-sm pointer-events-none"></div>
          <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-red-500/30 rounded-br-sm pointer-events-none"></div>

          {/* Faint HUD sidebar lines */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-red-950/40 to-transparent"></div>
          <div className="absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-red-950/40 to-transparent"></div>

          <div className="w-full relative z-10">
            {/* Round Icon Frame & Circle with inner outline */}
            <div className="w-16 h-16 rounded-full border border-red-950/60 flex items-center justify-center bg-black mb-4 mx-auto relative shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-all">
              {/* Inner accent circle */}
              <div className="absolute inset-1 rounded-full border border-dashed border-red-900/30"></div>
              <Zap className="w-6 h-6 text-red-500 relative z-10" />
            </div>

            <h3 className="text-3 shadow-sm text-3xl font-black font-sans tracking-tight text-white">+10</h3>
            <p className="text-[9px] text-[#f3f4f6] font-mono tracking-widest uppercase mt-0.5 font-black">CRÉDITOS</p>
            <div className="text-[6.5px] text-red-500/30 font-mono tracking-[0.2em] uppercase mt-1">SYS.LNK.EST // 10_CRD</div>

            {/* Price section in styling */}
            <div className="my-5 flex items-baseline justify-center gap-1">
              <span className="text-sm text-gray-400 font-serif italic">R$</span>
              <span className="text-3xl font-extrabold font-serif text-white tracking-tight">7,90</span>
            </div>

            {/* High Tech Divider with Diamond Center */}
            <div className="relative my-4 w-5/6 mx-auto flex items-center justify-center">
              <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-900/40 to-transparent"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-red-500/40 border border-red-900/50 z-10"></div>
            </div>

            {/* Feature List */}
            <ul className="flex flex-col gap-3.5 text-left px-3 mb-6 text-[11px] text-neutral-100 font-sans font-black">
              <li className="flex items-center gap-3 hover:translate-x-0.5 transition-transform">
                <Zap className="w-4 h-4 text-red-500 shrink-0" />
                <span className="leading-tight">Liberação instantânea</span>
              </li>
              <li className="flex items-center gap-3 hover:translate-x-0.5 transition-transform">
                <ShoppingCart className="w-4 h-4 text-red-500 shrink-0" />
                <span className="leading-tight">Compra rápida</span>
              </li>
              <li className="flex items-center gap-3 hover:translate-x-0.5 transition-transform">
                <Play className="w-4 h-4 text-red-500 shrink-0" />
                <span className="leading-tight">Continue usando imediatamente</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onBuyCredits(10)}
            className="w-full py-3.5 bg-transparent hover:bg-red-950/20 border border-red-950/60 hover:border-red-500/50 text-red-500 hover:text-red-400 font-bold text-xs tracking-widest uppercase rounded-xl transition-all cursor-pointer relative z-10 shadow-sm"
          >
            Comprar Agora
          </button>
        </motion.div>

        {/* +20 Credits (Featured Option) */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-[#030101] rounded-3xl border-2 border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.2)] p-6 flex flex-col justify-between items-center text-center relative min-h-[480px] max-w-xs w-full mx-auto overflow-hidden group"
        >
          {/* Cyberpunk scanning grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 via-transparent to-transparent pointer-events-none"></div>

          {/* Glowing cyberpunk bold corners */}
          <div className="absolute top-3.5 left-3.5 w-3 h-3 border-t-2 border-l-2 border-red-500 pointer-events-none"></div>
          <div className="absolute top-3.5 right-3.5 w-3 h-3 border-t-2 border-r-2 border-red-500 pointer-events-none"></div>
          <div className="absolute bottom-3.5 left-3.5 w-3 h-3 border-b-2 border-l-2 border-red-500 pointer-events-none"></div>
          <div className="absolute bottom-3.5 right-3.5 w-3 h-3 border-b-2 border-r-2 border-red-500 pointer-events-none"></div>

          {/* Red cyber glowing borders along sides */}
          <div className="absolute right-0 top-1/6 bottom-1/6 w-[1.5px] bg-gradient-to-b from-transparent via-red-500/55 to-transparent shadow-[0_0_8px_#ef4444]"></div>
          <div className="absolute left-0 top-1/6 bottom-1/6 w-[1.5px] bg-gradient-to-b from-transparent via-red-500/55 to-transparent shadow-[0_0_8px_#ef4444]"></div>

          {/* Tag layout */}
          <div className="absolute top-0 left-0 w-full bg-red-600 py-1 text-[8px] text-white font-mono font-black tracking-[0.25em] uppercase text-center shadow-[0_2px_12px_rgba(239,68,68,0.2)] z-10">
            MAIS ESCOLHIDO
          </div>

          <div className="w-full mt-4 relative z-10">
            {/* Round Icon Frame & Glowing Circle */}
            <div className="w-16 h-16 rounded-full border border-red-500 flex items-center justify-center bg-red-950/30 shadow-[0_0_18px_rgba(239,68,68,0.45)] mb-4 mx-auto relative group-hover:scale-105 transition-all">
              <div className="absolute inset-1 rounded-full border border-dashed border-red-500/45 animate-spin [animation-duration:12s]"></div>
              <div className="absolute inset-0 rounded-full bg-red-500/5 animate-ping [animation-duration:3s]"></div>
              <Gem className="w-6 h-6 text-red-500 relative z-10" />
            </div>

            <h3 className="text-3xl font-black font-sans tracking-tight text-white">+20</h3>
            <p className="text-[9px] text-[#f3f4f6] font-mono tracking-widest uppercase mt-0.5 font-black">CRÉDITOS</p>
            <div className="text-[6.5px] text-red-500 font-mono tracking-[0.2em] uppercase mt-1 animate-pulse">SYS.LNK.EST // 20_CRD</div>

            {/* Price section in styling */}
            <div className="my-5 flex items-baseline justify-center gap-1">
              <span className="text-sm text-gray-400 font-serif italic">R$</span>
              <span className="text-3xl font-extrabold font-serif text-white tracking-tight drop-shadow-[0_0_10px_rgba(239,68,68,0.35)]">12,90</span>
            </div>

            {/* Glowing red digital center diamond divider */}
            <div className="relative my-4 w-5/6 mx-auto flex items-center justify-center">
              <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent"></div>
              <div className="w-2 h-2 rotate-45 bg-red-500 border border-red-400 z-10 shadow-[0_0_10px_rgba(239,68,68,0.85)]"></div>
            </div>

            {/* Feature List */}
            <ul className="flex flex-col gap-3.5 text-left px-3 mb-6 text-[11px] text-gray-200 font-sans font-medium">
              <li className="flex items-center gap-3 hover:translate-x-0.5 transition-transform text-white">
                <Star className="w-4 h-4 text-red-500 shrink-0" />
                <span className="leading-tight">Melhor custo benefício</span>
              </li>
              <li className="flex items-center gap-3 hover:translate-x-0.5 transition-transform text-white">
                <MessageSquareCode className="w-4 h-4 text-red-500 shrink-0" />
                <span className="leading-tight">Mais respostas liberadas</span>
              </li>
              <li className="flex items-center gap-3 hover:translate-x-0.5 transition-transform text-white">
                <Target className="w-4 h-4 text-red-500 shrink-0" />
                <span className="leading-tight">Ideal para uso diário</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onBuyCredits(20)}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs tracking-widest uppercase rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_rgba(239,68,68,0.7)] relative z-10"
          >
            Liberar 20 Créditos
          </button>
        </motion.div>

        {/* +40 Credits Option */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-[#050505] rounded-3xl border border-red-950/45 p-6 flex flex-col justify-between items-center text-center shadow-2xl relative min-h-[460px] max-w-xs w-full mx-auto overflow-hidden group"
        >
          {/* Subtle sci-fi laser glow background */}
          <div className="absolute inset-0 bg-radial-gradient from-red-500/5 to-transparent pointer-events-none opacity-40"></div>

          {/* Cyberpunk Tech Corners */}
          <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-red-500/30 rounded-tl-sm pointer-events-none"></div>
          <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-red-500/30 rounded-tr-sm pointer-events-none"></div>
          <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-red-500/30 rounded-bl-sm pointer-events-none"></div>
          <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-red-500/30 rounded-br-sm pointer-events-none"></div>

          {/* Faint HUD sidebar lines */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-red-950/40 to-transparent"></div>
          <div className="absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-red-950/40 to-transparent"></div>

          <div className="w-full relative z-10">
            {/* Round Icon Frame & Circle with inner outline */}
            <div className="w-16 h-16 rounded-full border border-red-950/60 flex items-center justify-center bg-black mb-4 mx-auto relative shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-all">
              {/* Inner accent circle */}
              <div className="absolute inset-1 rounded-full border border-dashed border-red-900/30"></div>
              <Rocket className="w-6 h-6 text-red-500 relative z-10" />
            </div>

            <h3 className="text-3xl font-black font-sans tracking-tight text-white">+40</h3>
            <p className="text-[9px] text-[#f3f4f6] font-mono tracking-widest uppercase mt-0.5 font-black">CRÉDITOS</p>
            <div className="text-[6.5px] text-red-500/30 font-mono tracking-[0.2em] uppercase mt-1">SYS.LNK.EST // 40_CRD</div>

            {/* Price section in styling */}
            <div className="my-5 flex items-baseline justify-center gap-1">
              <span className="text-sm text-gray-400 font-serif italic">R$</span>
              <span className="text-3xl font-extrabold font-serif text-white tracking-tight">19,90</span>
            </div>

            {/* High Tech Divider with Diamond Center */}
            <div className="relative my-4 w-5/6 mx-auto flex items-center justify-center">
              <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-900/40 to-transparent"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-red-500/40 border border-red-900/50 z-10"></div>
            </div>

            {/* Feature List */}
            <ul className="flex flex-col gap-3.5 text-left px-3 mb-6 text-[11px] text-neutral-100 font-sans font-black">
              <li className="flex items-center gap-3 hover:translate-x-0.5 transition-transform">
                <Rocket className="w-4 h-4 text-red-500 shrink-0" />
                <span className="leading-tight">Uso intenso</span>
              </li>
              <li className="flex items-center gap-3 hover:translate-x-0.5 transition-transform">
                <Crown className="w-4 h-4 text-red-500 shrink-0" />
                <span className="leading-tight">Máxima liberdade</span>
              </li>
              <li className="flex items-center gap-3 hover:translate-x-0.5 transition-transform">
                <InfinityIcon className="w-4 h-4 text-red-500 shrink-0" />
                <span className="leading-tight">Sem esperar recarga diária</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onBuyCredits(40)}
            className="w-full py-3.5 bg-transparent hover:bg-red-950/20 border border-red-950/60 hover:border-red-500/50 text-red-500 hover:text-red-400 font-bold text-xs tracking-widest uppercase rounded-xl transition-all cursor-pointer relative z-10 shadow-sm"
          >
            Desbloquear Agora
          </button>
        </motion.div>

      </div>

      <div className="w-full text-center mt-auto border-t border-red-950/30 pt-4 pb-4">
        <span className="text-[9.5px] text-gray-500 font-mono tracking-[0.25em] uppercase leading-relaxed block">
          RESPOSTAS ILIMITADAS <span className="text-red-500 font-extrabold">COMEÇAM COM MAIS CRÉDITOS.</span>
        </span>
      </div>
    </div>
  );
}
