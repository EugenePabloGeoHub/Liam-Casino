import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCasino } from '../context/CasinoContext';
import { AVATARS } from '../constants';
import { BetSelector } from './BetSelector';
import confetti from 'canvas-confetti';
import { Coins, RotateCcw, Trophy, Sparkles } from 'lucide-react';

const SYMBOLS = ['🍒', '🍋', '🍇', '🔔', '💎', '7️⃣'];
const PAYOUTS: Record<string, number> = {
  '🍒': 2,
  '🍋': 3,
  '🍇': 5,
  '🔔': 10,
  '💎': 25,
  '7️⃣': 100,
};

export const LiamsSlots: React.FC = () => {
  const { balance, addWin, placeBet, selectedAvatarId } = useCasino();
  const [reels, setReels] = useState(['7️⃣', '7️⃣', '7️⃣']);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  const [lastWin, setLastWin] = useState(0);

  const avatar = AVATARS.find(a => a.id === selectedAvatarId);
  const luckBonus = avatar?.ability?.type === 'slots_luck' ? avatar.ability.value : 
                   avatar?.ability?.type === 'all_around' ? avatar.ability.value : 0;
  
  const earningsBonus = avatar?.ability?.type === 'all_around' ? avatar.ability.value : 0;

  const spin = () => {
    if (spinning || !placeBet(bet)) return;

    setSpinning(true);
    setLastWin(0);

    const spinDuration = 2000;
    const interval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      
      // Luck logic: if luckBonus exists, we have a chance to force a win
      let finalReels: string[];
      const isLucky = Math.random() * 100 < luckBonus;
      
      if (isLucky) {
        const luckySymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        finalReels = [luckySymbol, luckySymbol, luckySymbol];
      } else {
        finalReels = [
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        ];
      }

      setReels(finalReels);
      setSpinning(false);
      checkWin(finalReels);
    }, spinDuration);
  };

  const checkWin = (results: string[]) => {
    let winAmount = 0;
    if (results[0] === results[1] && results[1] === results[2]) {
      const multiplier = PAYOUTS[results[0]];
      winAmount = bet * multiplier;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#d946ef', '#ffffff']
      });
    } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
      winAmount = Math.floor(bet * 1.5);
    }

    if (winAmount > 0) {
      const finalWin = Math.floor(winAmount * (1 + earningsBonus / 100));
      addWin(finalWin);
      setLastWin(finalWin);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8 casino-card max-w-2xl mx-auto border border-white/10">
      <div className="text-center space-y-1">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
          Slots
        </h2>
        {luckBonus > 0 && (
          <div className="flex items-center justify-center gap-2 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} />
            Luck Bonus Active: +{luckBonus}%
          </div>
        )}
      </div>

      <div className="relative p-6 bg-black/40 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
          {reels.map((symbol, i) => (
            <motion.div
              key={i}
              animate={spinning ? { y: [0, -20, 0] } : {}}
              transition={{ repeat: spinning ? Infinity : 0, duration: 0.1, ease: "linear" }}
              className="w-24 h-32 flex items-center justify-center text-5xl bg-white/5 rounded-xl border border-white/10 shadow-inner"
            >
              {symbol}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4">
          <BetSelector 
            bet={bet} 
            setBet={setBet} 
            balance={balance} 
            presets={[10, 50, 100, 500]} 
          />
          
          <div className="flex flex-col items-center justify-center gap-2 bg-black/20 p-6 rounded-3xl border border-white/5 shadow-inner">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Last Win</span>
            <div className="flex items-center gap-3 text-4xl font-black text-cyan-400 italic">
              {lastWin > 0 ? `+$${lastWin.toLocaleString()}` : '$0'}
            </div>
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning || balance < bet}
          className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-2xl ${
            spinning || balance < bet 
              ? 'bg-white/5 text-white/10 cursor-not-allowed' 
              : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/20'
          }`}
        >
          <span className="flex items-center justify-center gap-3 uppercase tracking-widest">
            {spinning ? <RotateCcw className="animate-spin" size={20} /> : <Coins size={20} />}
            {spinning ? 'Spinning' : 'Spin Reels'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-[8px] uppercase tracking-widest text-white/20 w-full border-t border-white/5 pt-6">
        {Object.entries(PAYOUTS).map(([sym, mult]) => (
          <div key={sym} className="flex justify-between px-2">
            <span>3x {sym}</span>
            <span className="text-cyan-400 font-black">x{mult}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
