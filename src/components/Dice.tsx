import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCasino } from '../context/CasinoContext';
import { Dices, RotateCcw, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AVATARS } from '../constants';
import { BetSelector } from './BetSelector';

export const Dice: React.FC = () => {
  const { balance, addWin, placeBet, selectedAvatarId } = useCasino();
  const [dice, setDice] = useState([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [bet, setBet] = useState(10);
  const [prediction, setPrediction] = useState<'over' | 'under'>('over');
  const [target, setTarget] = useState(7);
  const [lastResult, setLastResult] = useState<{ win: boolean, amount: number } | null>(null);

  const activeAvatar = AVATARS.find(a => a.id === selectedAvatarId);
  const earningsBonus = activeAvatar?.ability?.type === 'all_around' ? activeAvatar.ability.value : 0;

  const roll = () => {
    if (rolling || !placeBet(bet)) return;

    setRolling(true);
    setLastResult(null);

    const rollDuration = 1000;
    const interval = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      const finalDice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ];
      setDice(finalDice);
      setRolling(false);
      checkWin(finalDice);
    }, rollDuration);
  };

  const checkWin = (results: number[]) => {
    const sum = results[0] + results[1];
    const isWin = prediction === 'over' ? sum > target : sum < target;
    
    if (isWin) {
      // Payout multiplier based on probability
      // Over 7 (8,9,10,11,12) -> 15/36 chance -> ~2.4x
      // Under 7 (2,3,4,5,6) -> 15/36 chance -> ~2.4x
      // We'll use a fixed 2x for simplicity or scale it
      const multiplier = 2;
      const winAmount = bet * multiplier;
      const bonusAmount = Math.floor(winAmount * (earningsBonus / 100));
      const finalWin = winAmount + bonusAmount;
      
      addWin(finalWin);
      setLastResult({ win: true, amount: finalWin });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2ff', '#ff00ff', '#ffffff']
      });
    } else {
      setLastResult({ win: false, amount: 0 });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-10 space-y-8 casino-card max-w-2xl mx-auto mt-4 md:mt-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          DICE
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-magenta-500 mx-auto mt-2" />
      </div>

      {earningsBonus > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-400 text-xs font-bold animate-pulse">
          <Zap size={14} fill="currentColor" />
          <span>+{Math.round(earningsBonus * 100)}% EARNINGS ACTIVE</span>
        </div>
      )}

      <div className="flex gap-6 justify-center py-8">
        {dice.map((value, i) => (
          <motion.div
            key={i}
            animate={rolling ? { 
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1],
              y: [0, -20, 0]
            } : {}}
            transition={{ repeat: rolling ? Infinity : 0, duration: 0.2 }}
            className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent" />
            <div className="grid grid-cols-3 grid-rows-3 gap-2 p-4 w-full h-full">
              {/* Dice dots logic */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(dot => {
                const show = 
                  (value === 1 && dot === 5) ||
                  (value === 2 && (dot === 1 || dot === 9)) ||
                  (value === 3 && (dot === 1 || dot === 5 || dot === 9)) ||
                  (value === 4 && (dot === 1 || dot === 3 || dot === 7 || dot === 9)) ||
                  (value === 5 && (dot === 1 || dot === 3 || dot === 5 || dot === 7 || dot === 9)) ||
                  (value === 6 && (dot === 1 || dot === 3 || dot === 4 || dot === 6 || dot === 7 || dot === 9));
                return (
                  <div key={dot} className={`rounded-full ${show ? 'bg-black' : 'bg-transparent'} w-full h-full`} />
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="w-full space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Prediction</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPrediction('over')}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border ${
                  prediction === 'over' ? 'bg-cyan-500 text-black border-white shadow-lg shadow-cyan-500/20' : 'bg-zinc-900 text-zinc-400 border-white/10'
                }`}
              >
                Over {target}
              </button>
              <button
                onClick={() => setPrediction('under')}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border ${
                  prediction === 'under' ? 'bg-magenta-500 text-white border-white shadow-lg shadow-magenta-500/20' : 'bg-zinc-900 text-zinc-400 border-white/10'
                }`}
              >
                Under {target}
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Target</span>
            <div className="flex items-center gap-4 bg-zinc-900 p-2 rounded-xl border border-white/10">
              <input 
                type="range" 
                min="3" 
                max="11" 
                value={target} 
                onChange={(e) => setTarget(parseInt(e.target.value))}
                className="flex-1 accent-cyan-500"
              />
              <span className="text-xl font-black text-white w-8 text-center italic">{target}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-between border-t border-white/10 pt-8">
          <BetSelector 
            bet={bet} 
            setBet={setBet} 
            balance={balance} 
            presets={[10, 50, 100, 500]} 
            className="w-full md:w-64"
          />

          <div className="h-10 flex items-center justify-center">
            <AnimatePresence>
              {lastResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-2xl font-black uppercase tracking-tighter italic ${lastResult.win ? 'text-cyan-400' : 'text-magenta-400'}`}
                >
                  {lastResult.win ? `Win +$${lastResult.amount.toLocaleString()}` : 'No Luck'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={roll}
            disabled={rolling || balance < bet || bet <= 0}
            className={`w-full md:w-auto px-16 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all uppercase italic tracking-tighter ${
              rolling || balance < bet || bet <= 0
                ? 'bg-white/5 text-white/10 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,242,255,0.3)]'
            }`}
          >
            {rolling ? 'Rolling...' : 'Roll Dice'}
          </button>
        </div>
      </div>
    </div>
  );
};
