import React, { useState, useEffect } from 'react';
import { Coins, Plus, Minus } from 'lucide-react';

interface BetSelectorProps {
  bet: number;
  setBet: (value: number) => void;
  balance: number;
  presets?: number[];
  label?: string;
  className?: string;
}

export const BetSelector: React.FC<BetSelectorProps> = ({ 
  bet, 
  setBet, 
  balance, 
  presets = [10, 50, 100, 500, 1000],
  label = "Select Bet",
  className = ""
}) => {
  const [inputValue, setInputValue] = useState(bet.toString());

  useEffect(() => {
    setInputValue(bet.toString());
  }, [bet]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      setInputValue(val);
      const num = parseInt(val);
      if (!isNaN(num)) {
        setBet(Math.min(balance, Math.max(1, num)));
      }
    }
  };

  const adjustBet = (amount: number) => {
    setBet(Math.min(balance, Math.max(1, bet + amount)));
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">{label}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/60 font-black">Max: ${balance.toLocaleString()}</span>
      </div>
      
      <div className="flex flex-col gap-4">
        {/* Custom Input & Adjusters */}
        <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10 shadow-inner group focus-within:border-cyan-500/50 transition-all">
          <button 
            onClick={() => adjustBet(-10)}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <Minus size={16} />
          </button>
          
          <div className="flex-1 relative flex items-center">
            <span className="absolute left-3 text-cyan-400 font-black text-lg">$</span>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full bg-transparent pl-8 pr-4 py-2 text-xl font-black text-white outline-none placeholder:text-white/10"
              placeholder="0"
            />
          </div>

          <button 
            onClick={() => adjustBet(10)}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {presets.map(val => (
            <button
              key={val}
              onClick={() => setBet(val)}
              disabled={balance < val}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all border ${
                bet === val 
                  ? 'bg-cyan-500 border-cyan-400 text-black shadow-lg shadow-cyan-500/20' 
                  : balance < val
                    ? 'bg-white/5 border-white/5 text-white/10 cursor-not-allowed'
                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              ${val >= 1000 ? `${val/1000}K` : val}
            </button>
          ))}
          <button
            onClick={() => setBet(balance)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all border bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/30`}
          >
            MAX
          </button>
        </div>
      </div>
    </div>
  );
};
