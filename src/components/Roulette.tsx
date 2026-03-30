import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCasino } from '../context/CasinoContext';
import confetti from 'canvas-confetti';
import { RotateCcw, Coins, Trash2, Zap } from 'lucide-react';
import { AVATARS } from '../constants';
import { BetSelector } from './BetSelector';

const NUMBERS = Array.from({ length: 37 }, (_, i) => i);
const COLORS: Record<number, 'red' | 'black' | 'green'> = {
  0: 'green',
  1: 'red', 2: 'black', 3: 'red', 4: 'black', 5: 'red', 6: 'black', 7: 'red', 8: 'black', 9: 'red', 10: 'black',
  11: 'black', 12: 'red', 13: 'black', 14: 'red', 15: 'black', 16: 'red', 17: 'black', 18: 'red', 19: 'red', 20: 'black',
  21: 'red', 22: 'black', 23: 'red', 24: 'black', 25: 'red', 26: 'black', 27: 'red', 28: 'black', 29: 'black', 30: 'red',
  31: 'black', 32: 'red', 33: 'black', 34: 'red', 35: 'black', 36: 'red'
};

export const Roulette: React.FC = () => {
  const { balance, addWin, placeBet, selectedAvatarId } = useCasino();
  const [selectedBets, setSelectedBets] = useState<Record<string, number>>({});
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(10);

  const activeAvatar = AVATARS.find(a => a.id === selectedAvatarId);
  const earningsBonus = activeAvatar?.ability?.type === 'all_around' ? activeAvatar.ability.value : 0;

  const placeChip = (type: string) => {
    if (spinning) return;
    setSelectedBets(prev => ({
      ...prev,
      [type]: (prev[type] || 0) + betAmount
    }));
  };

  const clearBets = () => {
    if (spinning) return;
    setSelectedBets({});
  };

  const spin = () => {
    const totalBet = Object.values(selectedBets).reduce((a: number, b: number) => a + b, 0);
    if (spinning || totalBet === 0 || !placeBet(totalBet)) return;

    setSpinning(true);
    setResult(null);

    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37);
      setResult(winningNumber);
      setSpinning(false);
      calculateWinnings(winningNumber);
    }, 3000);
  };

  const calculateWinnings = (winNum: number) => {
    let totalWon = 0;
    const winColor = COLORS[winNum];

    Object.entries(selectedBets).forEach(([betType, amount]) => {
      const betAmountNum = amount as number;
      if (betType === winNum.toString()) {
        totalWon += betAmountNum * 36;
      } else if (betType === 'red' && winColor === 'red') {
        totalWon += betAmountNum * 2;
      } else if (betType === 'black' && winColor === 'black') {
        totalWon += betAmountNum * 2;
      } else if (betType === 'even' && winNum !== 0 && winNum % 2 === 0) {
        totalWon += betAmountNum * 2;
      } else if (betType === 'odd' && winNum % 2 !== 0) {
        totalWon += betAmountNum * 2;
      }
    });

    if (totalWon > 0) {
      const bonusAmount = Math.floor(totalWon * (earningsBonus / 100));
      const finalWin = totalWon + bonusAmount;
      
      addWin(finalWin);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f2ff', '#ff00ff', '#ffffff']
      });
    }
  };

  const totalWager = Object.values(selectedBets).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-10 space-y-8 casino-card max-w-6xl mx-auto mt-4 md:mt-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          ROULETTE
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-magenta-500 mx-auto mt-2" />
      </div>

      {earningsBonus > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-400 text-xs font-bold animate-pulse">
          <Zap size={14} fill="currentColor" />
          <span>+{Math.round(earningsBonus * 100)}% EARNINGS ACTIVE</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center w-full">
        {/* Wheel Visualization */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-[8px] border-white/10 flex items-center justify-center shadow-[0_0_60px_rgba(0,242,255,0.2)] bg-black/40 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
          <motion.div
            animate={spinning ? { rotate: 360 * 8 } : { rotate: result ? (result * (360/37)) : 0 }}
            transition={spinning ? { duration: 3, ease: "circOut" } : { duration: 0.8 }}
            className="absolute inset-0"
          >
            {NUMBERS.map(n => (
              <div
                key={n}
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full origin-bottom text-[8px] md:text-[10px] font-black"
                style={{ transform: `rotate(${n * (360/37)}deg)` }}
              >
                <div className={`w-4 md:w-6 h-6 md:h-8 flex items-center justify-center rounded-t-sm border-x border-white/5 ${
                  COLORS[n] === 'red' ? 'bg-magenta-600' : COLORS[n] === 'black' ? 'bg-zinc-900' : 'bg-cyan-600'
                }`}>
                  {n}
                </div>
              </div>
            ))}
          </motion.div>
          <div className="z-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-900 border-2 border-cyan-500/50 flex items-center justify-center shadow-2xl">
            <div className={`text-3xl md:text-4xl font-black ${result !== null ? (COLORS[result] === 'red' ? 'text-magenta-400' : result === 0 ? 'text-cyan-400' : 'text-white') : 'text-zinc-500'}`}>
              {spinning ? '?' : result !== null ? result : '-'}
            </div>
          </div>
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-6 bg-cyan-500 z-20 rounded-b-full shadow-[0_0_10px_rgba(0,242,255,0.8)]" />
        </div>

        {/* Betting Felt */}
        <div className="flex-1 bg-black/40 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white/10 shadow-2xl w-full overflow-x-auto">
          <div className="min-w-[400px]">
            <div className="grid grid-cols-13 gap-1 mb-4 h-32 md:h-40">
              <button
                onClick={() => placeChip('0')}
                className="col-span-1 h-full bg-cyan-600/20 text-cyan-400 text-sm font-black border border-cyan-500/30 relative flex items-center justify-center hover:bg-cyan-600/40 transition-colors rounded-l-lg"
              >
                0
                {selectedBets['0'] && <Chip amount={selectedBets['0']} />}
              </button>
              <div className="col-span-12 grid grid-cols-12 grid-rows-3 grid-flow-col gap-1">
                {NUMBERS.slice(1).map(n => (
                  <button
                    key={n}
                    onClick={() => placeChip(n.toString())}
                    className={`relative h-full flex items-center justify-center text-xs md:text-sm font-black border border-white/5 transition-all hover:brightness-125 ${
                      COLORS[n] === 'red' ? 'bg-magenta-600/20 text-magenta-400' : 'bg-zinc-900/40 text-zinc-400'
                    }`}
                  >
                    {n}
                    {selectedBets[n] && <Chip amount={selectedBets[n]} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {['red', 'black', 'even', 'odd'].map(type => (
                <button
                  key={type}
                  onClick={() => placeChip(type)}
                  className={`relative h-12 md:h-14 rounded-lg border border-white/10 uppercase text-[10px] md:text-xs font-black tracking-widest transition-all hover:bg-white/5 ${
                    type === 'red' ? 'text-magenta-400 border-magenta-500/30' : type === 'black' ? 'text-zinc-300 border-zinc-500/30' : 'text-cyan-400 border-cyan-500/30'
                  }`}
                >
                  {type}
                  {selectedBets[type] && <Chip amount={selectedBets[type]} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-between border-t border-white/10 pt-8">
        <div className="flex flex-col sm:flex-row gap-8 items-end w-full md:w-auto">
          <BetSelector 
            bet={betAmount} 
            setBet={setBetAmount} 
            balance={balance} 
            presets={[10, 50, 100, 500]} 
            label="Chip Value"
            className="w-full sm:w-64"
          />
          <button 
            onClick={clearBets} 
            className="h-14 px-6 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Trash2 size={14} /> Clear Board
          </button>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Wager</span>
          <span className="text-4xl md:text-5xl font-black text-white italic">
            ${totalWager.toLocaleString()}
          </span>
        </div>

        <button
          onClick={spin}
          disabled={spinning || totalWager === 0 || balance < totalWager}
          className={`w-full md:w-auto px-16 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all uppercase italic tracking-tighter ${
            spinning || totalWager === 0 || balance < totalWager
              ? 'bg-white/5 text-white/10 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,242,255,0.3)]'
          }`}
        >
          {spinning ? 'Spinning...' : 'Spin Wheel'}
        </button>
      </div>
    </div>
  );
};

const Chip: React.FC<{ amount: number }> = ({ amount }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="w-5 h-5 md:w-6 md:h-6 bg-cyan-500 text-black rounded-full flex items-center justify-center text-[8px] font-black border-2 border-white shadow-lg">
      {amount >= 1000 ? `${(amount/1000).toFixed(1)}k` : amount}
    </div>
  </div>
);
