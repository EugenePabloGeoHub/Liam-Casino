import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCasino } from '../context/CasinoContext';
import { BetSelector } from './BetSelector';
import { 
  Coins, 
  TrendingUp, 
  Grid3X3, 
  Zap, 
  Target, 
  RotateCcw, 
  ArrowUpCircle, 
  Bomb,
  Dices,
  Trophy
} from 'lucide-react';

// 1. COIN FLIP
export const CoinFlip: React.FC = () => {
  const { balance, addWin, placeBet } = useCasino();
  const [bet, setBet] = useState(10);
  const [side, setSide] = useState<'heads' | 'tails'>('heads');
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);

  const flip = () => {
    if (!placeBet(bet)) return;
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const win = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(win);
      setFlipping(false);
      if (win === side) addWin(bet * 2);
    }, 1000);
  };

  return (
    <div className="casino-card p-8 rounded-[2.5rem] max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Coin Flip</h2>
      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={() => setSide('heads')}
          className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${side === 'heads' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/40'}`}
        >Heads</button>
        <button 
          onClick={() => setSide('tails')}
          className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${side === 'tails' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/40'}`}
        >Tails</button>
      </div>
      <div className="relative w-32 h-32 mx-auto mb-8">
        <motion.div
          animate={flipping ? { rotateY: 1800 } : { rotateY: result === 'heads' ? 0 : 180 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full h-full bg-amber-500 rounded-full flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        >
          {result === 'heads' ? '🪙' : '🦅'}
        </motion.div>
      </div>
      <BetSelector balance={balance} bet={bet} setBet={setBet} />
      <button 
        onClick={flip} 
        disabled={flipping}
        className="w-full mt-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all shadow-xl"
      >
        {flipping ? 'Flipping...' : 'Flip Coin'}
      </button>
    </div>
  );
};

// 2. CRASH
export const Crash: React.FC = () => {
  const { balance, addWin, placeBet } = useCasino();
  const [bet, setBet] = useState(10);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState<'idle' | 'running' | 'crashed'>('idle');
  const [crashPoint, setCrashPoint] = useState(0);

  const startGame = () => {
    if (!placeBet(bet)) return;
    setGameState('running');
    setMultiplier(1.0);
    const point = 1 + Math.random() * 5; // Simple crash point
    setCrashPoint(point);
  };

  useEffect(() => {
    let interval: any;
    if (gameState === 'running') {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const next = prev + 0.05;
          if (next >= crashPoint) {
            setGameState('crashed');
            clearInterval(interval);
            return prev;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameState, crashPoint]);

  const cashOut = () => {
    if (gameState === 'running') {
      addWin(Math.floor(bet * multiplier));
      setGameState('idle');
    }
  };

  return (
    <div className="casino-card p-8 rounded-[2.5rem] max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Crash</h2>
      <div className="h-48 flex items-center justify-center mb-8 bg-black/40 rounded-3xl border border-white/5 overflow-hidden relative">
        <div className={`text-6xl font-black ${gameState === 'crashed' ? 'text-red-500' : 'text-cyan-400'}`}>
          {multiplier.toFixed(2)}x
        </div>
        {gameState === 'crashed' && <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center font-black uppercase tracking-widest text-red-500">Crashed!</div>}
      </div>
      <BetSelector balance={balance} bet={bet} setBet={setBet} />
      {gameState === 'running' ? (
        <button onClick={cashOut} className="w-full mt-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all shadow-xl">
          Cash Out (${Math.floor(bet * multiplier)})
        </button>
      ) : (
        <button onClick={startGame} disabled={gameState === 'running'} className="w-full mt-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all shadow-xl">
          Start Game
        </button>
      )}
    </div>
  );
};

// 3. MINES
export const Mines: React.FC = () => {
  const { balance, addWin, placeBet } = useCasino();
  const [bet, setBet] = useState(10);
  const [grid, setGrid] = useState<boolean[]>(new Array(25).fill(false));
  const [revealed, setRevealed] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);

  const startMines = () => {
    if (!placeBet(bet)) return;
    const newGrid = new Array(25).fill(false);
    let mines = 0;
    while (mines < 3) {
      const idx = Math.floor(Math.random() * 25);
      if (!newGrid[idx]) {
        newGrid[idx] = true;
        mines++;
      }
    }
    setGrid(newGrid);
    setRevealed([]);
    setGameOver(false);
    setPlaying(true);
  };

  const reveal = (idx: number) => {
    if (!playing || revealed.includes(idx) || gameOver) return;
    if (grid[idx]) {
      setGameOver(true);
      setPlaying(false);
    } else {
      setRevealed(prev => [...prev, idx]);
    }
  };

  const cashOut = () => {
    const multiplier = 1 + (revealed.length * 0.2);
    addWin(Math.floor(bet * multiplier));
    setPlaying(false);
    setGameOver(true);
  };

  return (
    <div className="casino-card p-8 rounded-[2.5rem] max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Mines</h2>
      <div className="grid grid-cols-5 gap-2 mb-8 max-w-xs mx-auto">
        {grid.map((isMine, i) => (
          <button
            key={i}
            onClick={() => reveal(i)}
            className={`aspect-square rounded-xl border transition-all flex items-center justify-center text-xl ${
              revealed.includes(i) ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' :
              gameOver && isMine ? 'bg-red-500/20 border-red-500 text-red-500' :
              'bg-white/5 border-white/10 hover:border-cyan-500/50'
            }`}
          >
            {revealed.includes(i) ? '💎' : gameOver && isMine ? '💣' : ''}
          </button>
        ))}
      </div>
      <BetSelector balance={balance} bet={bet} setBet={setBet} />
      {!playing ? (
        <button onClick={startMines} className="w-full mt-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all shadow-xl">
          Start Game
        </button>
      ) : (
        <button onClick={cashOut} className="w-full mt-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all shadow-xl">
          Cash Out (${Math.floor(bet * (1 + revealed.length * 0.2))})
        </button>
      )}
    </div>
  );
};

// 4. WHEEL OF FORTUNE
export const WheelOfFortune: React.FC = () => {
  const { balance, addWin, placeBet } = useCasino();
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const multipliers = [0, 2, 0, 5, 0, 1.5, 0, 10, 0, 2, 0, 3];

  const spin = () => {
    if (!placeBet(bet)) return;
    setSpinning(true);
    const extra = 1800 + Math.random() * 360;
    const newRotation = rotation + extra;
    setRotation(newRotation);
    
    setTimeout(() => {
      setSpinning(false);
      const normalized = (newRotation % 360);
      const index = Math.floor(((360 - normalized + 15) % 360) / 30);
      const mult = multipliers[index];
      addWin(Math.floor(bet * mult));
    }, 3000);
  };

  return (
    <div className="casino-card p-8 rounded-[2.5rem] max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Wheel</h2>
      <div className="relative w-64 h-64 mx-auto mb-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 text-cyan-400">▼</div>
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: "circOut" }}
          className="w-full h-full rounded-full border-8 border-white/10 relative overflow-hidden"
          style={{ background: 'conic-gradient(#06b6d4 0deg 30deg, #18181b 30deg 60deg, #06b6d4 60deg 90deg, #18181b 90deg 120deg, #06b6d4 120deg 150deg, #18181b 150deg 180deg, #06b6d4 180deg 210deg, #18181b 210deg 240deg, #06b6d4 240deg 270deg, #18181b 270deg 300deg, #06b6d4 300deg 330deg, #18181b 330deg 360deg)' }}
        >
          {multipliers.map((m, i) => (
            <div key={i} className="absolute inset-0 flex items-start justify-center pt-4 font-black text-xs" style={{ transform: `rotate(${i * 30 + 15}deg)` }}>
              {m}x
            </div>
          ))}
        </motion.div>
      </div>
      <BetSelector balance={balance} bet={bet} setBet={setBet} />
      <button onClick={spin} disabled={spinning} className="w-full mt-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all shadow-xl">
        {spinning ? 'Spinning...' : 'Spin Wheel'}
      </button>
    </div>
  );
};

// 5. HIGHER OR LOWER
export const HigherLower: React.FC = () => {
  const { balance, addWin, placeBet } = useCasino();
  const [bet, setBet] = useState(10);
  const [currentCard, setCurrentCard] = useState(Math.floor(Math.random() * 13) + 1);
  const [nextCard, setNextCard] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = (guess: 'higher' | 'lower') => {
    if (!playing) {
      if (!placeBet(bet)) return;
      setPlaying(true);
    }
    const next = Math.floor(Math.random() * 13) + 1;
    setNextCard(next);
    
    setTimeout(() => {
      const win = (guess === 'higher' && next > currentCard) || (guess === 'lower' && next < currentCard);
      if (win) {
        addWin(Math.floor(bet * 0.8)); // Small win for each correct guess
        setCurrentCard(next);
        setNextCard(null);
      } else {
        setPlaying(false);
        setCurrentCard(next);
        setNextCard(null);
      }
    }, 500);
  };

  return (
    <div className="casino-card p-8 rounded-[2.5rem] max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Higher Lower</h2>
      <div className="flex justify-center gap-8 mb-8">
        <div className="w-24 h-36 bg-white rounded-xl flex items-center justify-center text-4xl text-black font-black shadow-xl">
          {currentCard}
        </div>
        {nextCard && (
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-24 h-36 bg-cyan-500 rounded-xl flex items-center justify-center text-4xl text-black font-black shadow-xl">
            {nextCard}
          </motion.div>
        )}
      </div>
      <div className="flex gap-4 mb-8">
        <button onClick={() => play('higher')} className="flex-1 py-4 bg-emerald-500 text-black font-black rounded-2xl uppercase tracking-widest">Higher</button>
        <button onClick={() => play('lower')} className="flex-1 py-4 bg-red-500 text-black font-black rounded-2xl uppercase tracking-widest">Lower</button>
      </div>
      <BetSelector balance={balance} bet={bet} setBet={setBet} />
    </div>
  );
};

// 6. PLINKO
export const Plinko: React.FC = () => {
  const { balance, addWin, placeBet } = useCasino();
  const [bet, setBet] = useState(10);
  const [dropping, setDropping] = useState(false);
  const [ballPos, setBallPos] = useState({ x: 50, y: 0 });
  const multipliers = [5, 2, 0.5, 0.2, 0.5, 2, 5];

  const drop = () => {
    if (!placeBet(bet)) return;
    setDropping(true);
    let currentX = 50;
    let step = 0;
    const interval = setInterval(() => {
      currentX += (Math.random() > 0.5 ? 7 : -7);
      currentX = Math.max(10, Math.min(90, currentX));
      setBallPos({ x: currentX, y: step * 20 });
      step++;
      if (step > 5) {
        clearInterval(interval);
        setDropping(false);
        const bucket = Math.floor((currentX / 100) * multipliers.length);
        addWin(Math.floor(bet * multipliers[bucket]));
        setTimeout(() => setBallPos({ x: 50, y: 0 }), 1000);
      }
    }, 300);
  };

  return (
    <div className="casino-card p-8 rounded-[2.5rem] max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Plinko</h2>
      <div className="h-64 bg-black/40 rounded-3xl mb-8 relative overflow-hidden border border-white/5">
        <motion.div 
          animate={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
          className="absolute w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        />
        <div className="absolute bottom-0 left-0 right-0 h-8 flex">
          {multipliers.map((m, i) => (
            <div key={i} className="flex-1 border-t border-x border-white/10 flex items-center justify-center text-[8px] font-black">
              {m}x
            </div>
          ))}
        </div>
      </div>
      <BetSelector balance={balance} bet={bet} setBet={setBet} />
      <button onClick={drop} disabled={dropping} className="w-full mt-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl">
        Drop Ball
      </button>
    </div>
  );
};

// 7. KENO
export const Keno: React.FC = () => {
  const { balance, addWin, placeBet } = useCasino();
  const [bet, setBet] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);

  const toggle = (n: number) => {
    if (playing) return;
    setSelected(prev => prev.includes(n) ? prev.filter(x => x !== n) : prev.length < 5 ? [...prev, n] : prev);
  };

  const draw = () => {
    if (selected.length === 0 || !placeBet(bet)) return;
    setPlaying(true);
    const newDrawn: number[] = [];
    const interval = setInterval(() => {
      let n = Math.floor(Math.random() * 40) + 1;
      while (newDrawn.includes(n)) n = Math.floor(Math.random() * 40) + 1;
      newDrawn.push(n);
      setDrawn([...newDrawn]);
      if (newDrawn.length >= 10) {
        clearInterval(interval);
        const matches = selected.filter(x => newDrawn.includes(x)).length;
        const payouts = [0, 0, 2, 5, 15, 50];
        addWin(bet * payouts[matches]);
        setTimeout(() => {
          setPlaying(false);
          setDrawn([]);
        }, 2000);
      }
    }, 200);
  };

  return (
    <div className="casino-card p-8 rounded-[2.5rem] max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Keno</h2>
      <div className="grid grid-cols-8 gap-1 mb-8">
        {Array.from({ length: 40 }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            onClick={() => toggle(n)}
            className={`aspect-square rounded-lg text-[10px] font-black transition-all ${
              drawn.includes(n) ? 'bg-amber-500 text-black' :
              selected.includes(n) ? 'bg-cyan-500 text-black' :
              'bg-white/5 text-white/40 hover:bg-white/10'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <BetSelector balance={balance} bet={bet} setBet={setBet} />
      <button onClick={draw} disabled={playing || selected.length === 0} className="w-full mt-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl">
        {playing ? 'Drawing...' : 'Draw Numbers'}
      </button>
    </div>
  );
};

// 8. BACCARAT
export const Baccarat: React.FC = () => {
  const { balance, addWin, placeBet } = useCasino();
  const [bet, setBet] = useState(10);
  const [side, setSide] = useState<'player' | 'banker' | 'tie'>('player');
  const [result, setResult] = useState<string>('');

  const play = () => {
    if (!placeBet(bet)) return;
    const p = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    let win: 'player' | 'banker' | 'tie';
    if (p > b) win = 'player';
    else if (b > p) win = 'banker';
    else win = 'tie';
    
    setResult(`Player: ${p} | Banker: ${b}`);
    if (win === side) {
      const mult = win === 'tie' ? 8 : 2;
      addWin(bet * mult);
    }
  };

  return (
    <div className="casino-card p-8 rounded-[2.5rem] max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Baccarat</h2>
      <div className="text-4xl font-black mb-8 text-cyan-400">{result || 'VS'}</div>
      <div className="flex gap-2 mb-8">
        {['player', 'banker', 'tie'].map(s => (
          <button key={s} onClick={() => setSide(s as any)} className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest ${side === s ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/40'}`}>
            {s}
          </button>
        ))}
      </div>
      <BetSelector balance={balance} bet={bet} setBet={setBet} />
      <button onClick={play} className="w-full mt-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl">Deal</button>
    </div>
  );
};

// 9. SCRATCH CARDS
export const ScratchCards: React.FC = () => {
  const { balance, addWin, placeBet } = useCasino();
  const [bet, setBet] = useState(50);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);

  const buy = () => {
    if (!placeBet(bet)) return;
    setValues(Array.from({ length: 9 }, () => Math.random() > 0.8 ? 100 : 10));
    setRevealed([]);
    setPlaying(true);
  };

  const scratch = (i: number) => {
    if (!playing || revealed.includes(i)) return;
    setRevealed(prev => [...prev, i]);
    if (revealed.length === 8) {
      const counts: any = {};
      [...revealed, i].forEach(idx => counts[values[idx]] = (counts[values[idx]] || 0) + 1);
      Object.entries(counts).forEach(([val, count]: any) => {
        if (count >= 3) addWin(parseInt(val) * 5);
      });
      setPlaying(false);
    }
  };

  return (
    <div className="casino-card p-8 rounded-[2.5rem] max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Scratch</h2>
      <div className="grid grid-cols-3 gap-2 mb-8 max-w-xs mx-auto">
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            onClick={() => scratch(i)}
            className={`aspect-square rounded-xl border flex items-center justify-center font-black ${
              revealed.includes(i) ? 'bg-white/10 border-white/20 text-cyan-400' : 'bg-zinc-800 border-white/5 text-white/10'
            }`}
          >
            {revealed.includes(i) ? `$${values[i]}` : '?'}
          </button>
        ))}
      </div>
      <button onClick={buy} disabled={playing} className="w-full py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl">Buy Card ($50)</button>
    </div>
  );
};

// 10. HORSE RACING
export const HorseRacing: React.FC = () => {
  const { balance, addWin, placeBet } = useCasino();
  const [bet, setBet] = useState(10);
  const [selected, setSelected] = useState(0);
  const [racing, setRacing] = useState(false);
  const [positions, setPositions] = useState([0, 0, 0, 0]);

  const race = () => {
    if (!placeBet(bet)) return;
    setRacing(true);
    setPositions([0, 0, 0, 0]);
    const interval = setInterval(() => {
      setPositions(prev => {
        const next = prev.map(p => p + Math.random() * 10);
        if (next.some(p => p >= 100)) {
          clearInterval(interval);
          const winner = next.indexOf(Math.max(...next));
          if (winner === selected) addWin(bet * 4);
          setRacing(false);
          return next;
        }
        return next;
      });
    }, 100);
  };

  return (
    <div className="casino-card p-8 rounded-[2.5rem] max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Horse Race</h2>
      <div className="space-y-4 mb-8">
        {positions.map((p, i) => (
          <div key={i} className={`h-8 bg-black/40 rounded-full relative overflow-hidden border ${selected === i ? 'border-cyan-500/50' : 'border-white/5'}`}>
            <motion.div animate={{ left: `${p}%` }} className="absolute top-1/2 -translate-y-1/2 text-xl">🐎</motion.div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-8">
        {[0, 1, 2, 3].map(i => (
          <button key={i} onClick={() => setSelected(i)} className={`flex-1 py-2 rounded-xl font-black ${selected === i ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/40'}`}>
            #{i+1}
          </button>
        ))}
      </div>
      <BetSelector balance={balance} bet={bet} setBet={setBet} />
      <button onClick={race} disabled={racing} className="w-full mt-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl">Race!</button>
    </div>
  );
};
