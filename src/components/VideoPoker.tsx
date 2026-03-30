import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCasino } from '../context/CasinoContext';
import { PlayingCard, Deck } from '../lib/cards';
import { RotateCcw, Coins, Play, Info, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AVATARS } from '../constants';
import { BetSelector } from './BetSelector';

type HandRank = 'Royal Flush' | 'Straight Flush' | 'Four of a Kind' | 'Full House' | 'Flush' | 'Straight' | 'Three of a Kind' | 'Two Pair' | 'Jacks or Better' | 'High Card';

const PAYOUTS: Record<HandRank, number> = {
  'Royal Flush': 800,
  'Straight Flush': 50,
  'Four of a Kind': 25,
  'Full House': 9,
  'Flush': 6,
  'Straight': 4,
  'Three of a Kind': 3,
  'Two Pair': 2,
  'Jacks or Better': 1,
  'High Card': 0,
};

export const VideoPoker: React.FC = () => {
  const { balance, addWin, placeBet, selectedAvatarId } = useCasino();
  const [hand, setHand] = useState<PlayingCard[]>([]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'deal' | 'draw' | 'gameOver'>('betting');
  const [bet, setBet] = useState(10);
  const [message, setMessage] = useState('');
  const [winAmount, setWinAmount] = useState(0);

  const activeAvatar = AVATARS.find(a => a.id === selectedAvatarId);
  const earningsBonus = activeAvatar?.ability?.type === 'all_around' ? activeAvatar.ability.value : 0;

  const deal = () => {
    if (!placeBet(bet)) return;
    const newDeck = new Deck().shuffle();
    const newHand = [newDeck.pop()!, newDeck.pop()!, newDeck.pop()!, newDeck.pop()!, newDeck.pop()!];
    setDeck(newDeck);
    setHand(newHand);
    setHeld([false, false, false, false, false]);
    setGameState('draw');
    setMessage('');
    setWinAmount(0);
  };

  const draw = () => {
    const newHand = [...hand];
    const currentDeck = [...deck];
    for (let i = 0; i < 5; i++) {
      if (!held[i]) {
        newHand[i] = currentDeck.pop()!;
      }
    }
    setHand(newHand);
    setDeck(currentDeck);
    setGameState('gameOver');
    evaluateHand(newHand);
  };

  const evaluateHand = (finalHand: PlayingCard[]) => {
    const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const sortedRanks = finalHand.map(c => rankOrder.indexOf(c.rank)).sort((a, b) => a - b);
    const suits = finalHand.map(c => c.suit);
    
    const counts: Record<string, number> = {};
    finalHand.forEach(c => counts[c.rank] = (counts[c.rank] || 0) + 1);
    const countValues = Object.values(counts).sort((a, b) => b - a);
    
    const isFlush = new Set(suits).size === 1;
    let isStraight = true;
    for (let i = 0; i < 4; i++) {
      if (sortedRanks[i+1] !== sortedRanks[i] + 1) {
        if (i === 3 && sortedRanks[4] === 12 && sortedRanks[0] === 0 && sortedRanks[1] === 1 && sortedRanks[2] === 2 && sortedRanks[3] === 3) {
          isStraight = true;
        } else {
          isStraight = false;
          break;
        }
      }
    }

    let rank: HandRank = 'High Card';
    if (isFlush && isStraight && sortedRanks[0] === 8) rank = 'Royal Flush';
    else if (isFlush && isStraight) rank = 'Straight Flush';
    else if (countValues[0] === 4) rank = 'Four of a Kind';
    else if (countValues[0] === 3 && countValues[1] === 2) rank = 'Full House';
    else if (isFlush) rank = 'Flush';
    else if (isStraight) rank = 'Straight';
    else if (countValues[0] === 3) rank = 'Three of a Kind';
    else if (countValues[0] === 2 && countValues[1] === 2) rank = 'Two Pair';
    else if (countValues[0] === 2) {
      const pairRank = Object.keys(counts).find(r => counts[r] === 2);
      if (['J', 'Q', 'K', 'A'].includes(pairRank!)) rank = 'Jacks or Better';
    }

    const payout = PAYOUTS[rank];
    const win = bet * payout;
    if (win > 0) {
      const bonusAmount = Math.floor(win * (earningsBonus / 100));
      const finalWin = win + bonusAmount;
      
      addWin(finalWin);
      setWinAmount(finalWin);
      setMessage(rank);
      if (payout >= 25) {
        confetti({ 
          particleCount: 150, 
          spread: 70, 
          origin: { y: 0.6 },
          colors: ['#00f2ff', '#ff00ff', '#ffffff']
        });
      }
    } else {
      setMessage('No Win');
    }
  };

  const toggleHold = (index: number) => {
    if (gameState !== 'draw') return;
    const newHeld = [...held];
    newHeld[index] = !newHeld[index];
    setHeld(newHeld);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-10 space-y-8 casino-card max-w-5xl mx-auto mt-4 md:mt-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          VIDEO POKER
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-magenta-500 mx-auto mt-2" />
      </div>

      {earningsBonus > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-400 text-xs font-bold animate-pulse">
          <Zap size={14} fill="currentColor" />
          <span>+{Math.round(earningsBonus * 100)}% EARNINGS ACTIVE</span>
        </div>
      )}

      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 min-h-[200px] md:min-h-[260px]">
        {gameState === 'betting' ? (
          <div className="col-span-full flex items-center justify-center bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <div className="text-center space-y-8 w-full max-w-md">
              <BetSelector 
                bet={bet} 
                setBet={setBet} 
                balance={balance} 
                presets={[5, 10, 25, 50, 100]} 
                className="w-full"
              />
              
              <button
                onClick={deal}
                disabled={balance < bet || bet <= 0}
                className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl transition-all uppercase italic tracking-tighter ${
                  balance < bet || bet <= 0
                    ? 'bg-white/5 text-white/10 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,242,255,0.3)]'
                }`}
              >
                Deal Hand
              </button>
            </div>
          </div>
        ) : (
          hand.map((card, i) => (
            <div key={i} className="relative group cursor-pointer" onClick={() => toggleHold(i)}>
              <CardView card={card} />
              {held[i] && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase rounded-full shadow-[0_0_10px_rgba(0,242,255,0.5)] z-20">
                  HELD
                </div>
              )}
              {gameState === 'draw' && (
                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors rounded-xl" />
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col items-center gap-6 w-full">
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-black text-cyan-400 uppercase tracking-tighter italic"
              >
                {message} {winAmount > 0 && <span className="text-white ml-4">+${winAmount.toLocaleString()}</span>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-6 w-full">
          {gameState === 'draw' && (
            <button
              onClick={draw}
              className="w-full sm:w-auto px-20 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-black text-2xl shadow-[0_0_30px_rgba(0,242,255,0.3)] hover:scale-105 active:scale-95 transition-all uppercase italic tracking-tighter"
            >
              Draw Cards
            </button>
          )}
          {gameState === 'gameOver' && (
            <button
              onClick={() => setGameState('betting')}
              className="w-full sm:w-auto px-20 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-black text-2xl shadow-2xl transition-all uppercase italic tracking-tighter"
            >
              New Game
            </button>
          )}
        </div>
      </div>

      <div className="w-full bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-3 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
          {Object.entries(PAYOUTS).map(([rank, mult]) => (
            <div key={rank} className={`flex justify-between px-4 ${message === rank ? 'text-cyan-400' : 'text-zinc-500'}`}>
              <span>{rank}</span>
              <span className={message === rank ? 'text-white' : 'text-zinc-400'}>x{mult}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CardView: React.FC<{ card: PlayingCard }> = ({ card }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="w-full h-full bg-zinc-900 rounded-xl border border-white/10 shadow-2xl flex flex-col p-3 md:p-4 relative text-white overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    <div className={`text-2xl md:text-3xl font-black leading-none ${['♥', '♦'].includes(card.suit) ? 'text-magenta-500' : 'text-cyan-500'}`}>
      {card.rank}
      <div className="text-lg md:text-xl">{card.suit}</div>
    </div>
    <div className={`text-6xl md:text-8xl absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none ${['♥', '♦'].includes(card.suit) ? 'text-magenta-500' : 'text-cyan-500'}`}>
      {card.suit}
    </div>
    <div className={`text-2xl md:text-3xl font-black leading-none absolute bottom-3 md:bottom-4 right-3 md:right-4 rotate-180 ${['♥', '♦'].includes(card.suit) ? 'text-magenta-500' : 'text-cyan-500'}`}>
      {card.rank}
      <div className="text-lg md:text-xl">{card.suit}</div>
    </div>
  </motion.div>
);
