import { motion, AnimatePresence } from "motion/react";
import React, { useState, useMemo } from "react";
import { Heart, Share2, Check } from "lucide-react";

// Luxury Easing
const luxuryEase = [0.23, 1, 0.32, 1];

const messages = [
  "I'm sorry.",
  "I know you only ever mean the best, and I never want you to think I don't see that.",
  "I really care about you, and I love you.",
  "You deserve patience, understanding, and kindness from me, and I'm sorry if I made you feel otherwise.",
  "I hope you always know how important you are to me. ❤️"
];

const noSteps = [
  { question: "Are you sure?", nextText: "Yes", forgiveText: "I'll forgive you" },
  { question: "Really sure? 🥺", nextText: "Still yes", forgiveText: "I'll forgive you" },
  { question: "Even if I promise I'll keep trying?", nextText: "Still no", forgiveText: "I forgive you" }
];

interface ParticleProps {
  delay: number;
  type?: 'dot' | 'heart';
  key?: React.Key;
}

function EtherealParticle({ delay, type = 'dot' }: ParticleProps) {
  const x = useMemo(() => Math.random() * 100, []);
  const y = useMemo(() => 100 + Math.random() * 20, []);
  const duration = useMemo(() => 14 + Math.random() * 11, []);
  const size = useMemo(() => type === 'heart' ? 14 + Math.random() * 10 : 2, [type]);
  
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      initial={{ x: `${x}vw`, y: `${y}vh`, opacity: 0 }}
      animate={{
        y: [`${y}vh`, `-10vh`],
        x: [`${x}vw`, `${x + (Math.random() * 10 - 5)}vw`],
        opacity: [0, 0.15, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay,
      }}
    >
      {type === 'heart' ? (
        <Heart size={size} className="text-pink-200/40 fill-pink-100/20" strokeWidth={1} />
      ) : (
        <div className="w-1 h-1 bg-white/40 rounded-full blur-[2px]" />
      )}
    </motion.div>
  );
}

export default function App() {
  const [stage, setStage] = useState<'landing' | 'cinematic' | 'messages' | 'dissolve' | 'question' | 'forgiven' | 'rejected'>('landing');
  const [currentNoStep, setCurrentNoStep] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const dots = useMemo(() => Array.from({ length: 8 }).map((_, i) => (
    <EtherealParticle key={`dot-${i}`} delay={i * 2} type="dot" />
  )), []);

  const hearts = useMemo(() => Array.from({ length: 12 }).map((_, i) => (
    <EtherealParticle key={`heart-${i}`} delay={i * 0.8} type="heart" />
  )), []);

  const handleOpen = () => {
    setStage('cinematic');
    setTimeout(() => {
      setStage('messages');
      // Calculate total duration: (5 messages * 4.2s delay/reveal) + 2s end pause
      const totalMessageTime = (messages.length * 4200) + 2000;
      setTimeout(() => {
        setStage('dissolve');
        setTimeout(() => setStage('question'), 1800);
      }, totalMessageTime);
    }, 2100);
  };

  const handleForgive = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }

    setTimeout(() => {
      setStage('forgiven');
      setIsProcessing(false);
    }, 560);
  };

  const handleNo = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      if (currentNoStep < noSteps.length - 1) {
        setCurrentNoStep(prev => prev + 1);
      } else {
        setStage('rejected');
      }
      setIsProcessing(false);
    }, 560);
  };

  const handleShare = async () => {
    const text = 'I forgave you ❤️';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'For You', text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(text);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 3000);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center selection:bg-pink-50 selection:text-pink-900">
      {/* Texture: Grain Overlay */}
      <div className="noise-overlay" />

      {/* Background: Luxury Gradient */}
      <div className="absolute inset-0 z-0 animate-luxury-gradient" />
      
      {/* Blobs: Deep Ethereal Texture */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[80vw] h-[80vw] bg-pink-100/30 top-[-20%] left-[-20%] rounded-full blur-[100px] animate-luxury-blob" />
        <div className="absolute w-[90vw] h-[90vw] bg-purple-50/40 bottom-[-30%] right-[-20%] rounded-full blur-[120px] animate-luxury-blob [animation-delay:-7s]" />
      </div>

      {/* Cinematic Flash Overlay */}
      <motion.div 
        className="absolute inset-0 bg-white pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'cinematic' ? 0.8 : 0 }}
        transition={{ duration: 1.4, ease: luxuryEase }}
      />

      {/* Forgiveness Glow */}
      <motion.div 
        className="absolute inset-0 bg-white pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'forgiven' ? 0.4 : 0 }}
        transition={{ duration: 2.1, ease: luxuryEase }}
      />

      {/* Particle System */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {dots}
        {stage === 'forgiven' && hearts}
      </div>

      {/* Main Content Stage */}
      <div className="relative z-30 w-full max-w-2xl px-10 text-center">
        <AnimatePresence mode="wait">
          {stage === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
              transition={{ duration: 2, ease: luxuryEase }}
              className="flex flex-col items-center gap-8"
            >
              <button
                onClick={handleOpen}
                className="group relative px-14 py-5 rounded-full glass text-slate-400 text-xs font-light uppercase tracking-[0.25em] transition-all duration-1000 hover:text-slate-600 hover:bg-white/60 active:scale-95"
              >
                Open
              </button>
            </motion.div>
          )}

          {stage === 'messages' && (
            <div className="space-y-12 md:space-y-16">
              {messages.map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 2.1,
                    delay: 0.7 + (i * 4.2), 
                    ease: "easeInOut"
                  }}
                  className={`leading-relaxed tracking-wide px-4 ${
                    i === 0 
                      ? "font-serif italic text-4xl md:text-5xl text-slate-800" 
                      : "text-lg md:text-xl text-slate-500/90 font-light"
                  }`}
                >
                  {text}
                </motion.p>
              ))}
            </div>
          )}

          {stage === 'dissolve' && (
            <motion.div
              key="dissolve"
              exit={{ opacity: 0, filter: "blur(20px)" }}
              className="space-y-16"
            >
              {messages.map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0, filter: "blur(12px)" }}
                  transition={{
                    duration: 1.8,
                    delay: i * 0.15,
                    ease: luxuryEase
                  }}
                  className={`leading-relaxed tracking-wide ${
                    i === 0 
                      ? "font-serif italic text-4xl md:text-5xl text-slate-800" 
                      : "text-lg md:text-xl text-slate-500/80 font-light"
                  }`}
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>
          )}

          {stage === 'question' && (
            <motion.div
              key={`question-${currentNoStep}`}
              initial={{ opacity: 0, scale: 1.02, filter: "blur(15px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              transition={{ duration: 1.4, ease: luxuryEase }}
              className="space-y-16"
            >
              <p className="font-serif italic text-4xl md:text-5xl text-slate-800 tracking-tight px-4 leading-tight">
                {currentNoStep === -1 ? "Do you forgive me?" : noSteps[currentNoStep].question}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
                <button
                  disabled={isProcessing}
                  onClick={handleForgive}
                  className="w-full sm:w-auto px-14 py-5 rounded-full bg-white/40 border border-pink-100 text-pink-400 font-light tracking-[0.2em] uppercase text-[10px] hover:bg-white/60 transition-all duration-700 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30 shadow-sm"
                >
                  <Heart size={14} className="fill-pink-400/20" />
                  {currentNoStep === -1 ? "Yes" : noSteps[currentNoStep].forgiveText}
                </button>
                <button
                  disabled={isProcessing}
                  onClick={handleNo}
                  className="w-full sm:w-auto px-14 py-5 rounded-full bg-slate-50/10 border border-slate-200/40 text-slate-400 font-extralight tracking-[0.2em] uppercase text-[10px] hover:bg-white/20 transition-all duration-700 active:scale-95 disabled:opacity-30"
                >
                  {currentNoStep === -1 ? "No" : noSteps[currentNoStep].nextText}
                </button>
              </div>
            </motion.div>
          )}

          {stage === 'forgiven' && (
            <motion.div
              key="forgiven"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3, ease: luxuryEase }}
              className="space-y-12 flex flex-col items-center"
            >
              <div className="space-y-10 flex flex-col items-center">
                <motion.p
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 2.5, delay: 0.5, ease: luxuryEase }}
                  className="font-serif italic text-4xl md:text-5xl text-slate-800 tracking-tight"
                >
                  Thank you.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 2.5, delay: 2.5, ease: luxuryEase }}
                  className="text-xl md:text-2xl text-slate-500 font-light tracking-wide"
                >
                  That means more than you know.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, filter: "blur(12px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 3.5, delay: 5, ease: luxuryEase }}
                  className="font-serif italic text-4xl md:text-5xl text-pink-400 pt-6"
                >
                  Love, Ducky. ❤️
                </motion.p>
              </div>

              {/* Share button retained but delayed even further to allow the signature to breathe */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 10, duration: 2.5 }}
                onClick={handleShare}
                className="group inline-flex items-center gap-4 px-12 py-5 rounded-full glass text-pink-400/60 text-[10px] font-light tracking-[0.2em] uppercase hover:bg-white/60 hover:text-pink-400 transition-all duration-1000 active:scale-95 shadow-sm mt-12"
              >
                {shareStatus === 'copied' ? (
                  <><Check size={16} className="text-green-400" /> Copied</>
                ) : (
                  <><Share2 size={16} /> Share with him</>
                )}
              </motion.button>
            </motion.div>
          )}

          {stage === 'rejected' && (
            <motion.div
              key="rejected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.1 }}
              className="flex flex-col items-center gap-16"
            >
              <div className="space-y-6">
                <p className="font-serif italic text-3xl md:text-4xl text-slate-800 leading-relaxed">
                  I understand.
                </p>
                <p className="font-serif italic text-2xl text-slate-400">
                  I'll still keep trying to be better.
                </p>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 2 }}
                onClick={handleForgive}
                className="px-12 py-5 rounded-full glass text-pink-400 font-light tracking-widest hover:bg-white/60 transition-all duration-1000 active:scale-95 flex items-center gap-3"
              >
                <Heart size={16} className="fill-pink-400/20" />
                Actually... I forgive you
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Bottom Accent */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'landing' ? 0.1 : 0 }}
        className="absolute bottom-16 text-[9px] uppercase tracking-[0.4em] text-slate-900 pointer-events-none"
      >
        A Private Note
      </motion.div>
    </div>
  );
}
