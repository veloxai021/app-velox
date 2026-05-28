/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Smile, Heart, Eye, Sparkles, MessageCircle, 
  Copy, RefreshCw, Send, HelpCircle, Check, Compass, TrendingUp, AlertTriangle, Lock
} from 'lucide-react';
import { StyleType, GeneratedResponseAnalysis } from '../types';

interface RespostasProps {
  credits: number;
  selectedPlan: 'free' | 'pro' | 'elite';
  onUseCredit: (amount: number) => void;
  onIncrementResponses: () => void;
  onSelectStyleStore: (style: string) => void;
  onAddLog: (log: any) => void;
  onRequestUpgrade: () => void;
}

export default function RespostasTab({ 
  credits, 
  selectedPlan,
  onUseCredit, 
  onIncrementResponses,
  onSelectStyleStore,
  onAddLog,
  onRequestUpgrade
}: RespostasProps) {
  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StyleType>('Ousado');
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(1);
  const [analysis, setAnalysis] = useState<GeneratedResponseAnalysis | null>(null);
  const [copied, setCopied] = useState(false);

  const styleOptions: { name: StyleType; icon: any }[] = [
    { name: 'Ousado', icon: Flame },
    { name: 'Engraçado', icon: Smile },
    { name: 'Romântico', icon: Heart },
    { name: 'Sedutor', icon: Sparkles },
  ];

  const handleStyleSelect = (style: StyleType) => {
    if (selectedPlan === 'free' && style !== 'Ousado') {
      alert(`O estilo "${style}" está disponível apenas nos planos PRO e ELITE!`);
      onRequestUpgrade();
      return;
    }
    if (selectedPlan === 'pro' && style === 'Sedutor') {
      alert(`O estilo "${style}" é exclusivo do plano ELITE!`);
      onRequestUpgrade();
      return;
    }
    setSelectedStyle(style);
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    if (credits < 2) {
      alert('Você não possui créditos suficientes. São necessários 2 créditos para gerar uma resposta. Clique em + CRÉDITOS para recarregar!');
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setLoadProgress(1);

    const progressInterval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 98) return 98;
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 100);

    // Call credit hook
    onUseCredit(2);
    onIncrementResponses();
    onSelectStyleStore(selectedStyle);

    try {
      const response = await fetch('/api/velox/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputText,
          style: selectedStyle
        })
      });
      const data = await response.json();

      // Simulated tiny delay to make cyber scanner look premium
      setTimeout(() => {
        clearInterval(progressInterval);
        setLoadProgress(100);
        const result: GeneratedResponseAnalysis = {
          context: data.context || 'Conversa aberta',
          style: data.style || selectedStyle,
          recommendation: data.recommendation || 'Continue respondendo carismaticamente.',
          levelText: data.levelText || 'Médio progresso',
          percentage: data.percentage || 75,
          content: data.content || 'Resposta gerada'
        };
        setAnalysis(result);
        onAddLog(result);
        setLoading(false);
      }, 1800);

    } catch (e) {
      clearInterval(progressInterval);
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 font-sans select-none scrollbar-none">
      
      {/* Title heading exact layout matching visual 008 */}
      <div className="text-center relative">
        <h2 className="text-lg md:text-xl font-black font-serif tracking-[0.14em] text-white uppercase select-none font-display">
          GERADOR DE <span className="text-red-500 font-black">RESPOSTAS</span>
        </h2>
        
        {/* Three small red diamond dividers matching visual 008 */}
        <div className="flex gap-1 justify-center mt-1.5">
          <span className="w-1 h-1 rotate-45 bg-red-600 shadow-[0_0_6px_#ef4444]"></span>
          <span className="w-1 h-1 rotate-45 bg-red-600 shadow-[0_0_6px_#ef4444]"></span>
          <span className="w-1 h-1 rotate-45 bg-red-600 shadow-[0_0_6px_#ef4444]"></span>
        </div>
      </div>

      {/* Input section: RECEIVED MESSAGE exactly match visual 008 / 007 */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-[9px] text-red-500 font-mono tracking-[0.18em] uppercase mb-0.5">
          <div className="flex items-center gap-1.5">
            <span>→ MENSAGEM RECEBIDA</span>
            <span className="text-[#39ff14] animate-pulse">✓ · ·</span>
          </div>
        </div>

        {/* Input box matching layout */}
        <div className="relative rounded-xl bg-[#030101] border border-red-950/55 p-3 focus-within:border-red-500/50 focus-within:shadow-[0_0_15px_rgba(239,68,68,0.15)] transition-all">
          {/* Faint HUD corner brackets inside input */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-red-500/20"></div>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-red-500/20"></div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-red-500/20"></div>
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-red-500/20"></div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
            placeholder="Cole aqui a mensagem que ela te mandou..."
            className="w-full h-16 bg-transparent outline-none border-none resize-none text-neutral-100 placeholder-neutral-500 text-sm font-sans leading-relaxed text-left pr-8 animate-none font-bold"
          />
          
          <div className="flex justify-between items-center mt-1.5 text-[9.5px] text-neutral-300 font-mono font-bold">
            <span>{inputText.length}/1000</span>
            {inputText && (
              <button 
                onClick={() => handleCopy(inputText)} 
                className="hover:text-red-500 transition-colors p-1 cursor-pointer"
                title="Copiar texto inserido"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Style selector matching design */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] text-red-500 font-mono tracking-[0.18em] uppercase mb-0.5 flex items-center gap-1.5">
          <span>→ ESCOLHA O ESTILO</span>
          <span className="text-[#39ff14] animate-pulse">✓ · ·</span>
        </label>

        {/* Style selection buttons with strong all-side glowing outlines */}
        <div className="grid grid-cols-4 gap-1.5 w-full font-sans">
          {styleOptions.map((styleOpt) => {
            const isSelected = selectedStyle === styleOpt.name;
            const isLocked = 
              (selectedPlan === 'free' && styleOpt.name !== 'Ousado') ||
              (selectedPlan === 'pro' && styleOpt.name === 'Sedutor');
            
            return (
              <button
                key={styleOpt.name}
                onClick={() => handleStyleSelect(styleOpt.name)}
                className={`relative py-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all text-center cursor-pointer select-none ${
                  isSelected 
                    ? 'border-red-500 bg-red-950/20 text-white shadow-[0_0_15px_rgba(239,68,68,0.5),inset_0_0_10px_rgba(239,68,68,0.25)]' 
                    : 'border-red-950/40 bg-[#050505] hover:border-red-900/40 text-gray-500 hover:text-white'
                } ${isLocked ? 'opacity-80' : ''}`}
              >
                {/* Lock badge */}
                {isLocked && (
                  <div className="absolute top-1 right-1 bg-red-600 rounded-full p-0.5 text-[8px] text-white">
                    <Lock className="w-2 h-2" />
                  </div>
                )}

                {/* Custom inner active ring effect */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-lg border border-dashed border-red-500/30"></div>
                )}

                {/* Cyberpunk corner lights on active item */}
                {isSelected && (
                  <>
                    <span className="absolute -top-[1px] -left-[1px] w-1 h-1 bg-red-500 rounded-full shadow-[0_0_6px_#ef4444]"></span>
                    <span className="absolute -top-[1px] -right-[1px] w-1 h-1 bg-red-500 rounded-full shadow-[0_0_6px_#ef4444]"></span>
                    <span className="absolute -bottom-[1px] -left-[1px] w-1 h-1 bg-red-500 rounded-full shadow-[0_0_6px_#ef4444]"></span>
                    <span className="absolute -bottom-[1px] -right-[1px] w-1 h-1 bg-red-500 rounded-full shadow-[0_0_6px_#ef4444]"></span>
                  </>
                )}

                {/* Custom Icon Rendering */}
                {styleOpt.name === 'Sedutor' ? (
                  /* Elegant outline Lips vector matching screenshot exactly */
                  <svg 
                    className={`w-4.5 h-4.5 transition-colors ${isSelected ? 'text-red-500 filter drop-shadow-[0_0_5px_rgba(239,68,68,0.85)]' : 'text-gray-500'}`} 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.1" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M4 14C4 14 6.5 11 12 11C17.5 11 20 14 20 14M4 14C4 14 6 17 12 17C18 17 20 14 20 14M4 14C4 14 7.5 13.5 12 13.5C16.5 13.5 20 14 20 14" />
                    <path d="M8 11.5C8 11.5 10 9 12 9.5C14 9 16 11.5 16 11.5" />
                  </svg>
                ) : (
                  <styleOpt.icon className={`w-4.5 h-4.5 transition-colors ${isSelected ? 'text-red-500 filter drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : isLocked ? 'text-gray-700' : 'text-gray-500'}`} />
                )}

                <span className={`text-[9.5px] font-sans tracking-wide font-black transition-colors ${isSelected ? 'text-white' : 'text-gray-200 font-bold'}`}>
                  {styleOpt.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cyberpunk Action Button (GERAR RESPOSTA >>) matching visual exactly */}
      <motion.button
        onClick={handleGenerate}
        disabled={loading || !inputText.trim()}
        whileHover={{ scale: !inputText.trim() ? 1 : 1.01 }}
        whileTap={{ scale: !inputText.trim() ? 1 : 0.99 }}
        className={`w-full py-3 rounded-xl font-black tracking-[0.25em] text-center uppercase cursor-pointer relative overflow-hidden transition-all text-xs select-none border-2 ${
          inputText.trim() 
            ? 'border-red-500/90 bg-gradient-to-r from-red-950/90 via-[#400505] to-red-950/90 hover:shadow-[0_0_20px_rgba(239,68,68,0.45)] text-white' 
            : 'bg-[#020202] border-red-950/30 text-gray-600 cursor-not-allowed opacity-40'
        }`}
      >
        {/* Holographic scanner wave effect */}
        {inputText.trim() && (
          <div className="absolute top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent skew-x-12 animate-scan pointer-events-none" style={{ left: '30%', animationDuration: '2s' }}></div>
        )}
        
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
            <span className="animate-pulse">PROCESSANDO RESPOSTA EM TEMPO REAL...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1">
            GERAR RESPOSTA <span className="text-red-500 font-extrabold ml-1.5 text-base leading-none">»</span>
          </span>
        )}
      </motion.button>

      <p className="text-[9px] text-[#ef4444]/80 font-mono tracking-widest text-center mt-[-3px] uppercase font-black">
        • CONSOME <span className="text-red-500 font-extrabold pb-0.5 border-b border-red-950">2 CRÉDITOS</span> POR PESQUISA/RESPOSTA DE INTERAÇÃO
      </p>

      {/* Results details view */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8 bg-[#050101] rounded-2xl border border-red-500/30 gap-5 relative overflow-hidden"
          >
            {/* Cyberpunk ambient radar sweep behind */}
            <div className="absolute inset-0 bg-radial from-red-650/5 via-transparent to-transparent opacity-60"></div>
            
            <div className="relative w-28 h-28 flex items-center justify-center select-none">
              {/* Outer Ring 1: Glowing orbit dashes spinning clockwise */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-red-500/20 rounded-full"
              />

              {/* Outer Ring 2: Core scanning border spinning counter-clockwise */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-2 border-dashed border-red-500/40 rounded-full"
              />

              {/* Loader SVG progress ring, matching the stats circle exact style we have */}
              <svg className="w-24 h-24 absolute transform -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="#100303" strokeWidth="4.5" fill="transparent" />
                <motion.circle 
                  cx="48" 
                  cy="48" 
                  r="38" 
                  stroke="#ef4444" 
                  strokeWidth="4.5" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38}
                  initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - (loadProgress ?? 0) / 100) }}
                  transition={{ duration: 0.15, ease: "linear" }}
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 6px rgb(239,68,68))' }}
                />
              </svg>

              <div className="absolute text-center flex flex-col items-center justify-center">
                <Flame className="w-5 h-5 text-red-500 animate-pulse filter drop-shadow-[0_0_4px_#ef4444]" />
                <span className="text-xs font-black font-mono text-white mt-1.5 tracking-tight">{loadProgress}%</span>
              </div>
            </div>

            <div className="text-center relative z-10 flex flex-col items-center gap-1">
              <p className="text-[10px] text-red-500 font-mono tracking-[0.25em] uppercase font-black">
                Mapeamento Cognitivo Ativo
              </p>
              <p className="text-[8.5px] text-neutral-400 font-mono tracking-wider max-w-xs uppercase">
                VELOX COGNITIVE AI EM EXPANSÃO...
              </p>
            </div>
          </motion.div>
        )}

        {analysis && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
            {/* Answer Display Card */}
            <div className="flex flex-col gap-2">
              <div className="text-[10px] text-red-500 font-mono tracking-[0.18em] uppercase flex items-center gap-1.5 mb-1">
                <span>→ RESPOSTA GERADA</span>
                <span className="text-[#39ff14] animate-pulse">✓ · ·</span>
              </div>

              <div className="relative p-5 rounded-2xl bg-[#040101] border border-red-500/50 shadow-[0_0_18px_rgba(239,68,68,0.18)] flex flex-col gap-4 text-center group">
                {/* Subtitle cyber header inside result block */}
                <div className="absolute top-2 left-3 text-[6px] text-red-500/30 font-mono tracking-widest block select-none">OUTPUT.DEC_LNK // SECURE</div>
                
                <p className="text-base font-serif italic text-white leading-relaxed px-2 mt-2 font-black">
                  "{analysis.content}"
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleCopy(analysis.content)}
                    className="p-1.5 px-3 rounded-lg bg-red-950/10 border border-red-950 hover:border-red-500/50 text-gray-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs text-mono"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#39ff14]" />
                        <span className="text-[9px] text-[#39ff14] font-mono tracking-wider uppercase">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-[9px] font-mono tracking-wider uppercase">Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Psychological Analysis Card */}
            <div className="flex flex-col gap-2">
              <div className="text-[10px] text-red-500 font-mono tracking-[0.18em] uppercase flex items-center gap-1.5 mb-1">
                <span>→ ANÁLISE DA IA</span>
                <span className="text-[#39ff14] animate-pulse">✓ · ·</span>
              </div>

              {/* Grid with features on left and circular progression gauge on right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 rounded-2xl bg-[#040101] border border-red-950/50 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full pointer-events-none"></div>

                {/* Left side metrics */}
                <div className="md:col-span-7 flex flex-col gap-4.5 text-left text-xs relative z-10">
                  <div className="flex gap-3">
                    <div className="w-7.5 h-7.5 rounded-lg bg-red-950/20 border border-red-900/40 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.1)]">
                      <MessageCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <span className="text-[8px] text-red-500 font-mono tracking-widest block uppercase">CONTEXTO DETECTADO:</span>
                      <span className="text-[#f3f4f6] font-black pl-0.5 mt-0.5 block text-xs">{analysis.context}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-7.5 h-7.5 rounded-lg bg-red-950/20 border border-red-900/40 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.1)]">
                      <Flame className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <span className="text-[8px] text-red-500 font-mono tracking-widest block uppercase">ESTILO DE RESPOSTA</span>
                      <span className="text-[#f3f4f6] font-black pl-0.5 mt-0.5 block text-xs">{analysis.style}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-7.5 h-7.5 rounded-lg bg-red-950/20 border border-red-900/40 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.1)]">
                      <Compass className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <span className="text-[8px] text-red-500 font-mono tracking-widest block uppercase">MÉTODO DE ENVIO</span>
                      <span className="text-[#f3f4f6] font-black pl-0.5 mt-0.5 block text-xs leading-relaxed">{analysis.recommendation}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-7.5 h-7.5 rounded-lg bg-red-950/20 border border-red-900/40 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.1)]">
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <span className="text-[8px] text-red-500 font-mono tracking-widest block uppercase">NÍVEL DE AVANÇO:</span>
                      <span className="text-[#f3f4f6] font-black pl-0.5 mt-0.5 block text-xs">{analysis.levelText}</span>
                    </div>
                  </div>
                </div>

                {/* Right side circular percentage meter & soundwave (Visual exactly matching 008 screenshot but in neon green) */}
                <div className="md:col-span-5 flex flex-col justify-center items-center text-center border-t md:border-t-0 md:border-l border-red-950/40 pt-5 md:pt-0 md:pl-5 relative z-10">
                  
                  {/* Pure futuristic CSS bar spectrum graphics chart - styled green */}
                  <div className="flex items-end gap-1.5 h-10 mb-4 select-none">
                    <div className="w-1.5 h-[20%] bg-gradient-to-t from-green-950 to-green-500 rounded-full animate-pulse shadow-[0_0_6px_#22c55e] [animation-delay:0.1s]"></div>
                    <div className="w-1.5 h-[40%] bg-gradient-to-t from-green-950 to-green-500 rounded-full animate-pulse shadow-[0_0_6px_#22c55e] [animation-delay:0.3s]"></div>
                    <div className="w-1.5 h-[55%] bg-gradient-to-t from-green-950 to-green-500 rounded-full animate-pulse shadow-[0_0_6px_#22c55e] [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-[70%] bg-gradient-to-t from-green-950 to-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e] [animation-delay:0.4s]"></div>
                    <div className="w-1.5 h-[85%] bg-gradient-to-t from-green-950 to-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e] [animation-delay:0.15s]"></div>
                    <div className="w-1.5 h-[100%] bg-gradient-to-t from-green-950 to-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e] [animation-delay:0.5s]"></div>
                  </div>

                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* SVG circular dial gauge representation but in DEEP NEON GREEN */}
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="38" stroke="#051005" strokeWidth="5.5" fill="transparent" />
                      <motion.circle 
                        cx="48" 
                        cy="48" 
                        r="38" 
                        stroke="#22c55e" 
                        strokeWidth="5.5" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 38}
                        strokeDashoffset={2 * Math.PI * 38}
                        initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - (analysis?.percentage ?? 75) / 100) }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 7px rgb(34,197,94))' }}
                      />
                    </svg>

                    <div className="absolute text-center flex flex-col items-center">
                      <span className="text-2xl font-black font-mono text-white tracking-tighter drop-shadow-[0_0_6px_#22c55e]">{analysis.percentage}%</span>
                      <span className="text-[7px] text-green-500 font-mono tracking-widest uppercase mt-0.5">NÍVEL DE <br />AVANÇO</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-green-500/80 font-mono tracking-wider mt-3 leading-relaxed">
                    Excelente progresso na conversa!
                  </p>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
