import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCasino } from '../context/CasinoContext';
import { AVATARS } from '../constants';
import { PlayingCard, Deck } from '../lib/cards';
import { BetSelector } from './BetSelector';
import { RotateCcw, Hand, Plus, Play, Info, Sparkles } from 'lucide-react';

export const Blackjack: React.FC = () => {
  const { balance, addWin, placeBet, selectedAvatarId } = useCasino();
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [playerHand, setPlayerHand] = useState<PlayingCard[]>([]);
  const [dealerHand, setDealerHand] = useState<PlayingCard[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'gameOver'>('betting');
  const [bet, setBet] = useState(50);
  const [message, setMessage] = useState('');

  const avatar = AVATARS.find(a => a.id === selectedAvatarId);
  const totalBonus = (avatar?.ability?.type === 'blackjack_payout' || avatar?.ability?.type === 'all_around') 
    ? avatar.ability.value 
    : 0;

  const startNewGame = () => {
    if (!placeBet(bet)) return;

    const newDeck = new Deck().shuffle();
    const pHand = [newDeck.pop()!, newDeck.pop()!];
    const dHand = [newDeck.pop()!, newDeck.pop()!];

    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setGameState('playing');
    setMessage('');

    if (calculateScore(pHand) === 21) {
      endGame('Blackjack!', 'player');
    }
  };

  const calculateScore = (hand: PlayingCard[]) => {
    let score = 0;
    let aces = 0;
    for (const card of hand) {
      if (card.rank === 'A') {
        aces += 1;
        score += 11;
      } else if (['K', 'Q', 'J'].includes(card.rank)) {
        score += 10;
      } else {
        score += parseInt(card.rank);
      }
    }
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return score;
  };

  const hit = () => {
    const newHand = [...playerHand, deck.pop()!];
    setPlayerHand(newHand);
    if (calculateScore(newHand) > 21) {
      endGame('Bust!', 'dealer');
    }
  };

  const stand = () => {
    setGameState('dealerTurn');
    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];

    const playDealer = () => {
      if (calculateScore(currentDealerHand) < 17) {
        currentDealerHand.push(currentDeck.pop()!);
        setDealerHand([...currentDealerHand]);
        setDeck([...currentDeck]);
        setTimeout(playDealer, 600);
      } else {
        const pScore = calculateScore(playerHand);
        const dScore = calculateScore(currentDealerHand);

        if (dScore > 21) endGame('Dealer Busts!', 'player');
        else if (dScore > pScore) endGame('Dealer Wins', 'dealer');
        else if (dScore < pScore) endGame('You Win!', 'player');
        else endGame('Push', 'push');
      }
    };

    setTimeout(playDealer, 600);
  };

  const endGame = (msg: string, winner: 'player' | 'dealer' | 'push') => {
    setMessage(msg);
    setGameState('gameOver');
    if (winner === 'player') {
      const baseWin = bet * 2;
      const bonusAmount = Math.floor(baseWin * (totalBonus / 100));
      const finalWin = baseWin + bonusAmount;
      addWin(finalWin);
    } else if (winner === 'push') {
      addWin(bet);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8 casino-card max-w-4xl mx-auto border border-white/10 min-h-[500px]">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
          Blackjack
        </h2>
        {totalBonus > 0 && (
          <div className="flex items-center justify-center gap-2 text-magenta-400 text-[10px] font-black uppercase tracking-widest mt-1">
            <Sparkles size={12} />
            Payout Bonus Active: +{totalBonus}%
          </div>
        )}
      </div>

      {gameState === 'betting' ? (
        <div className="flex flex-col items-center gap-8 py-8 w-full max-w-md">
          <BetSelector 
            bet={bet} 
            setBet={setBet} 
            balance={balance} 
            presets={[25, 50, 100, 500, 1000]} 
            className="w-full"
          />
          
          <button
            onClick={startNewGame}
            disabled={balance < bet || bet <= 0}
            className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-2xl uppercase tracking-widest ${
              balance < bet || bet <= 0
                ? 'bg-white/5 text-white/10 cursor-not-allowed'
                : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/20'
            }`}
          >
            Deal Cards
          </button>
        </div>
      ) : (
        <div className="w-full bg-black/20 p-8 rounded-3xl border border-white/10 shadow-inner space-y-12 relative overflow-hidden">
          {/* Dealer Area */}
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className="px-3 py-1 bg-black/40 rounded-full text-[8px] uppercase font-black tracking-widest text-magenta-400 border border-magenta-500/20">
              Dealer: {gameState === 'playing' ? '?' : calculateScore(dealerHand)}
            </div>
            <div className="flex gap-3 h-32">
              {dealerHand.map((card, i) => (
                <CardView key={i} card={card} hidden={gameState === 'playing' && i === 1} />
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div className="h-10 flex items-center justify-center relative z-10">
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-6 py-2 bg-white text-black text-xl font-black uppercase tracking-widest rounded-xl shadow-2xl"
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Player Area */}
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className="flex gap-3 h-32">
              {playerHand.map((card, i) => (
                <CardView key={i} card={card} />
              ))}
            </div>
            <div className="px-3 py-1 bg-black/40 rounded-full text-[8px] uppercase font-black tracking-widest text-cyan-400 border border-cyan-500/20">
              You: {calculateScore(playerHand)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 relative z-10">
            {gameState === 'playing' ? (
              <>
                <button 
                  onClick={hit} 
                  className="px-8 py-3 bg-white text-black font-black rounded-xl flex items-center gap-2 shadow-xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
                >
                  <Plus size={16} /> Hit
                </button>
                <button 
                  onClick={stand} 
                  className="px-8 py-3 bg-cyan-500 text-black font-black rounded-xl flex items-center gap-2 shadow-xl hover:bg-cyan-400 transition-all uppercase tracking-widest text-xs"
                >
                  <Hand size={16} /> Stand
                </button>
              </>
            ) : gameState === 'gameOver' ? (
              <button 
                onClick={() => setGameState('betting')} 
                className="px-12 py-4 bg-cyan-500 text-black rounded-xl font-black text-lg shadow-2xl hover:bg-cyan-400 transition-all uppercase tracking-widest"
              >
                Next Round
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

const CardView: React.FC<{ card: PlayingCard; hidden?: boolean }> = ({ card, hidden }) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0, rotate: -5 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      className={`w-24 h-32 rounded-xl border flex flex-col p-2 relative shadow-xl transition-all ${
        hidden ? 'bg-magenta-600 border-white/20' : 'bg-white border-gray-200 text-black'
      }`}
    >
      {!hidden ? (
        <>
          <div className={`text-lg font-black leading-none ${['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-black'}`}>
            {card.rank}
            <div className="text-xs">{card.suit}</div>
          </div>
          <div className={`text-4xl absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none ${['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-black'}`}>
            {card.suit}
          </div>
          <div className={`text-lg font-black leading-none absolute bottom-2 right-2 rotate-180 ${['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-black'}`}>
            {card.rank}
            <div className="text-xs">{card.suit}</div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center border-2 border-white/10 rounded-xl m-1">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white/5" />
          </div>
        </div>
      )}
    </motion.div>
  );
};
