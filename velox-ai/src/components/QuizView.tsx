/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Ghost, Users, RefreshCw, Heart, 
  Smile, Frown, Sparkles, MapPin, Search, Compass,
  Phone, Instagram, Facebook, Send, Flame, MessageCircle,
  User, Eye, HelpCircle
} from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizProps {
  step: number;
  onAnswer: (questionId: number, answerText: string) => void;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    questionText: '1. Qual sua maior dificuldade?',
    options: [
      { text: 'Fico sem assunto', icon: 'MessageSquare' },
      { text: 'Levo muito vácuo', icon: 'Ghost' },
      { text: 'Não sei puxar assunto', icon: 'Users' },
      { text: 'Não sei manter conversa', icon: 'RefreshCw' },
      { text: 'Não sei flertar', icon: 'Heart' },
    ]
  },
  {
    id: 2,
    questionText: '2. O que mais te irrita?',
    options: [
      { text: 'Ser ignorado', icon: 'MessageSquare' },
      { text: 'Conversa morrer rápido', icon: 'Ghost' },
      { text: 'Não saber responder', icon: 'Users' },
      { text: 'Perder oportunidades', icon: 'RefreshCw' },
    ]
  },
  {
    id: 3,
    questionText: '3. O que normalmente faz você perder uma conversa?',
    options: [
      { text: 'Pensar demais antes de responder', icon: 'MessageSquare' },
      { text: 'Não saber continuar o assunto', icon: 'Ghost' },
      { text: 'Responder seco demais', icon: 'Users' },
      { text: 'Demorar para responder', icon: 'RefreshCw' },
      { text: 'Não conseguir criar interesse', icon: 'Heart' },
    ]
  },
  {
    id: 4,
    questionText: '4. Onde você mais quer usar o VELOX?',
    options: [
      { text: 'WhatsApp', icon: 'Phone' },
      { text: 'Instagram', icon: 'Instagram' },
      { text: 'Facebook', icon: 'Facebook' },
      { text: 'Telegram', icon: 'Send' },
      { text: 'Tinder', icon: 'Flame' },
      { text: 'Outros aplicativos de conversa', icon: 'MessageCircle' },
    ]
  },
  {
    id: 5,
    questionText: '5. O que você quer melhorar?',
    options: [
      { text: 'Mais confiança', icon: 'User' },
      { text: 'Conversas melhores', icon: 'MessageSquare' },
      { text: 'Conseguir encontros', icon: 'Users' },
      { text: 'Mais atenção', icon: 'Eye' },
      { text: 'Mais lábia', icon: 'Sparkles' },
    ]
  },
  {
    id: 6,
    questionText: '6. Como você se sente quando conversa com alguém que você gosta?',
    options: [
      { text: 'Nervoso', icon: 'MessageSquare' },
      { text: 'Sem confiança', icon: 'Ghost' },
      { text: 'Sem saber o que responder', icon: 'Users' },
      { text: 'Com medo de estragar tudo', icon: 'RefreshCw' },
      { text: 'Travado na conversa', icon: 'Heart' },
    ]
  }
];

export default function QuizView({ step, onAnswer }: QuizProps) {
  const currentQuestion = quizQuestions[step - 1] || quizQuestions[0];

  // Helper to map string to actual Lucide component inside a glowing high tech white style
  const renderIcon = (iconName: string) => {
    const iconClass = "w-3.5 h-3.5 text-white filter drop-shadow-[0_0_2px_rgba(255,255,255,0.8)] transition-transform group-hover:scale-110";
    switch (iconName) {
      case 'MessageSquare': return <MessageSquare className={iconClass} />;
      case 'Ghost': return <Ghost className={iconClass} />;
      case 'Users': return <Users className={iconClass} />;
      case 'RefreshCw': return <RefreshCw className={`${iconClass} animate-spin-slow`} />;
      case 'Heart': return <Heart className={iconClass} />;
      case 'Phone': return <Phone className={iconClass} />;
      case 'Instagram': return <Instagram className={iconClass} />;
      case 'Facebook': return <Facebook className={iconClass} />;
      case 'Send': return <Send className={iconClass} />;
      case 'Flame': return <Flame className={iconClass} />;
      case 'MessageCircle': return <MessageCircle className={iconClass} />;
      case 'User': return <User className={iconClass} />;
      case 'Eye': return <Eye className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      default: return <HelpCircle className={iconClass} />;
    }
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#030101] text-white flex flex-col items-center justify-between p-3 relative overflow-hidden font-sans">
      
      {/* Sci-fi top layout */}
      <div className="w-full max-w-sm flex justify-between items-center text-[9px] text-gray-300 font-mono tracking-widest uppercase mb-1 select-none font-bold">
        <div className="flex items-center gap-1">
          <span className="text-red-500 font-black tracking-widest text-xs">VELOX</span>
          <span className="bg-red-950/40 text-red-500 px-1 py-0.5 rounded border border-red-900/45 text-[8px] font-black">AI</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>SYS_01</span>
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-red-600 animate-pulse"></div>
            <div className="w-1 h-1 bg-[#4a0404]"></div>
          </div>
        </div>
      </div>

      {/* Main Container - optimized tight vertical spacing to avoid scroll */}
      <div className="flex-1 w-full max-w-sm flex flex-col justify-start items-stretch gap-2 mt-0.5 relative z-10">
        
        {/* Hooded Hacker/AI Figure Representation (matching the user's psychological screenshot exactly with adjusted height) */}
        <div className="relative w-full h-36 md:h-40 flex justify-center items-center overflow-hidden rounded-xl border border-red-950/35 bg-black/90 shadow-[0_2px_15px_rgba(239,68,68,0.12)] select-none">
          {/* Cyber lines background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:12px_12px]"></div>
          
          {/* Real AI image from public assets with absolute overlays */}
          <img 
            src="/hooded_figure.png" 
            alt="Velox AI Hooded" 
            className="w-full h-full object-cover scale-[1.0]" 
            style={{ filter: 'brightness(1.0) contrast(1.15)' }}
          />

          {/* Crimson ambient aura overlays to blend it */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030101] via-transparent to-[#030101]/30"></div>
          <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#030101] to-transparent"></div>

          {/* Matrix network indicators - smaller text */}
          <div className="absolute left-2 top-2 text-[6px] text-red-600/90 font-mono tracking-wide leading-tight">
            <div>SYS_01_NET</div>
            <div>ONLINE ▰▰▰▰ 99%</div>
          </div>
          <div className="absolute right-2 top-2 text-[6px] text-red-600/90 font-mono tracking-wide text-right leading-tight">
            <div>VELOX_COGNITIVE</div>
            <div>V10.82_PRO_ACTIVE</div>
          </div>
        </div>

        {/* Battery progress indicators match to physical quiz interface */}
        <div className="w-full px-1">
          <div className="flex justify-between items-center text-[9px] text-neutral-200 font-mono tracking-wider font-black mb-1 select-none">
            <span className="tracking-wider">PASSO DE SELEÇÃO</span>
            <span className="text-red-500 font-black">{step} / 6</span>
          </div>
          
          {/* Compact battery styled chunks */}
          <div className="grid grid-cols-6 gap-1 w-full bg-red-950/5 p-0.5 rounded-lg border border-red-950/30">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded transition-all duration-300 transform -skew-x-12 ${
                  i < step 
                    ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)] border-r border-red-400/30' 
                    : 'bg-[#150505]/20 border border-red-950/40 opacity-20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Elegant subtle audio line divider without bulky circle to save vertical height */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-red-950/40 to-transparent my-1 select-none"></div>

        {/* Animated Question & Options Block */}
        <div className="w-full flex-1 flex flex-col justify-start gap-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col gap-1 text-center"
            >
              <h2 className="text-base md:text-lg font-serif text-white font-black tracking-normal leading-normal px-1 select-none">
                {currentQuestion.questionText}
              </h2>
              <p className="text-[9.5px] text-red-400 tracking-widest font-mono font-black leading-none uppercase select-none">
                Análise de Perfil Personalizada
              </p>

              {/* Questionnaire list elements formatted EXACTLY like high-contrast visual HUD frame but tighter */}
              <div className="flex flex-col gap-1.5 mt-2.5 text-left">
                {currentQuestion.options.map((opt, oIdx) => (
                  <motion.button
                    key={opt.text}
                    onClick={() => {
                      onAnswer(currentQuestion.id, opt.text);
                    }}
                    whileHover={{ scale: 1.015, x: 1 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full text-left p-1.5 bg-[#050101] rounded-xl border border-red-600/85 hover:border-red-500 hover:bg-[#0c0202] transition-all duration-300 cursor-pointer flex items-center group overflow-hidden relative"
                  >
                    {/* Corner high-tech accent light */}
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 border-t border-l border-red-400 opacity-25"></div>
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 border-t border-r border-red-400 opacity-25"></div>
                    <div className="absolute bottom-0.5 left-0.5 w-1 h-1 border-b border-l border-red-400 opacity-25"></div>
                    <div className="absolute bottom-0.5 right-0.5 w-1 h-1 border-b border-r border-red-400 opacity-25"></div>

                    {/* Glowing highlight strip */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Compact Circle icon frame */}
                    <div className="w-7 h-7 rounded-full border border-red-600/60 m-0.5 flex items-center justify-center bg-black/90 group-hover:bg-red-950/40 group-hover:border-red-400 transition-all duration-300 shrink-0">
                      {renderIcon(opt.icon)}
                    </div>
                    
                    {/* Text Label styling */}
                    <span className="text-xs md:text-sm font-sans font-bold text-white group-hover:text-red-100 pl-2.5 tracking-wide">
                      {opt.text}
                    </span>

                    {/* Cybernetic bullet tracker layout */}
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-950 border border-red-900/65 group-hover:bg-red-500 group-hover:border-red-400 transition-all duration-300"></div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Static visual cyber-footer matching bottom style of general layouts */}
      <div className="w-full text-center mt-5 py-2 border-t border-red-950/40 select-none">
        <span className="text-[10px] text-gray-200 font-mono tracking-[0.25em] font-black uppercase">
          VELOX AI // TECNOLOGIA DE CONEXÃO
        </span>
      </div>
    </div>
  );
}
