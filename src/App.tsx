import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CasinoProvider, useCasino } from './context/CasinoContext';
import { LiamsSlots } from './components/LiamsSlots';
import { Blackjack } from './components/Blackjack';
import { Roulette } from './components/Roulette';
import { VideoPoker } from './components/VideoPoker';
import { Dice } from './components/Dice';
import { Shop } from './components/Shop';
import { Inventory } from './components/Inventory';
import { AvatarDisplay } from './components/AvatarDisplay';
import { AVATARS } from './constants';
import { 
  CoinFlip, 
  Crash, 
  Mines, 
  WheelOfFortune, 
  HigherLower, 
  Plinko, 
  Keno, 
  Baccarat, 
  ScratchCards, 
  HorseRacing 
} from './components/ExtraGames';
import { 
  Coins, 
  LayoutGrid, 
  Sparkles, 
  Trophy, 
  Wallet, 
  Info, 
  ChevronLeft, 
  Package, 
  User,
  Settings,
  Dices,
  CircleDollarSign,
  TrendingUp,
  Grid3X3,
  Zap,
  Target,
  RotateCcw,
  ArrowUpCircle,
  Bomb,
  History,
  Gamepad2
} from 'lucide-react';

const GameSelector: React.FC<{ onSelect: (game: string) => void }> = ({ onSelect }) => {
  const games = [
    { id: 'slots', name: "Slots", icon: <Sparkles className="text-cyan-400" />, desc: 'High stakes 3-reel action.' },
    { id: 'blackjack', name: "Blackjack", icon: <Trophy className="text-purple-400" />, desc: 'Classic 21. Dealer stands on 17.' },
    { id: 'roulette', name: "Roulette", icon: <Coins className="text-amber-400" />, desc: 'European wheel. Single zero.' },
    { id: 'poker', name: "Video Poker", icon: <LayoutGrid className="text-emerald-400" />, desc: 'Jacks or Better.' },
    { id: 'dice', name: "Dice", icon: <Dices className="text-blue-400" />, desc: 'Over or Under.' },
    { id: 'coinflip', name: "Coin Flip", icon: <CircleDollarSign className="text-yellow-400" />, desc: '50/50 Double or Nothing.' },
    { id: 'crash', name: "Crash", icon: <TrendingUp className="text-red-400" />, desc: 'Cash out before it crashes.' },
    { id: 'mines', name: "Mines", icon: <Bomb className="text-orange-400" />, desc: 'Avoid the hidden mines.' },
    { id: 'wheel', name: "Wheel", icon: <RotateCcw className="text-pink-400" />, desc: 'Spin for big multipliers.' },
    { id: 'higherlower', name: "Hi-Lo", icon: <ArrowUpCircle className="text-indigo-400" />, desc: 'Predict the next card.' },
    { id: 'plinko', name: "Plinko", icon: <Target className="text-lime-400" />, desc: 'Drop the ball for prizes.' },
    { id: 'keno', name: "Keno", icon: <Grid3X3 className="text-teal-400" />, desc: 'Pick your lucky numbers.' },
    { id: 'baccarat', name: "Baccarat", icon: <History className="text-rose-400" />, desc: 'Player, Banker, or Tie.' },
    { id: 'scratch', name: "Scratch", icon: <Zap className="text-cyan-400" />, desc: 'Reveal 3 matching symbols.' },
    { id: 'horse', name: "Racing", icon: <Gamepad2 className="text-amber-600" />, desc: 'Bet on the fastest horse.' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto p-6">
      {games.map((game, i) => (
        <motion.button
          key={game.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(game.id)}
          className="group relative flex flex-col items-center p-8 casino-card hover:bg-white/5 transition-all border border-white/10 hover:border-cyan-500/50 shadow-2xl overflow-hidden"
        >
          <div className="mb-6 p-5 rounded-3xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:border-cyan-500/50 transition-all duration-500">
            {React.cloneElement(game.icon as React.ReactElement, { size: 40 })}
          </div>
          
          <h3 className="text-xl font-black mb-2 tracking-tight uppercase text-white">{game.name}</h3>
          <p className="text-[10px] text-white/40 text-center leading-relaxed uppercase tracking-widest">{game.desc}</p>
          
          <div className="mt-6 px-6 py-2 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg group-hover:bg-white transition-colors">
            Play Now
          </div>
        </motion.button>
      ))}
    </div>
  );
};

const ProfileHeader: React.FC = () => {
  const { balance, username, setUsername, selectedAvatarId } = useCasino();
  const [isEditing, setIsEditing] = useState(false);
  const avatar = AVATARS.find(a => a.id === selectedAvatarId);

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-2 border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-500/20 bg-black/40 overflow-hidden">
          {avatar ? (
            <AvatarDisplay avatar={avatar} size="sm" />
          ) : (
            <div className="text-2xl">👤</div>
          )}
        </div>
        {avatar?.ability && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-casino-dark shadow-lg">
            <Sparkles size={10} className="text-black" />
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {isEditing ? (
          <input
            autoFocus
            className="bg-white/10 border-b border-cyan-500 text-sm font-black uppercase tracking-widest outline-none px-2 py-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
          />
        ) : (
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditing(true)}>
            <span className="text-sm font-black uppercase tracking-widest text-white">{username}</span>
            <Settings size={12} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
          </div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400">
              ${balance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CasinoApp: React.FC = () => {
  const { balance, setBalance } = useCasino();
  const [activeTab, setActiveTab] = useState<'lobby' | 'shop' | 'inventory'>('lobby');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showFaucet, setShowFaucet] = useState(false);

  const getDailyBonus = () => {
    setBalance(prev => prev + 1000);
    setShowFaucet(false);
  };

  return (
    <div className="min-h-screen bg-casino-dark text-white selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-casino-dark/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            setActiveGame(null);
            setActiveTab('lobby');
          }}
        >
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:rotate-12 transition-transform">
            <Trophy className="text-black" size={20} />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
            Liam's<span className="text-cyan-400 ml-1">Casino</span>
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          {[
            { id: 'lobby', label: 'Lobby', icon: <LayoutGrid size={16} /> },
            { id: 'shop', label: 'Shop', icon: <Package size={16} /> },
            { id: 'inventory', label: 'Inventory', icon: <User size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setActiveGame(null);
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id && !activeGame
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {balance < 50 && (
            <button 
              onClick={() => setShowFaucet(true)}
              className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black rounded-xl hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-widest"
            >
              Get Chips
            </button>
          )}
          <ProfileHeader />
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50 bg-casino-dark/90 backdrop-blur-2xl border border-white/10 p-2 rounded-3xl flex items-center justify-around shadow-2xl">
        {[
          { id: 'lobby', label: 'Lobby', icon: <LayoutGrid size={20} /> },
          { id: 'shop', label: 'Shop', icon: <Package size={20} /> },
          { id: 'inventory', label: 'Inventory', icon: <User size={20} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setActiveGame(null);
            }}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
              activeTab === tab.id && !activeGame
              ? 'text-cyan-400'
              : 'text-white/20'
            }`}
          >
            {tab.icon}
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="relative py-12 px-6 pb-32 md:pb-12">
        <AnimatePresence mode="wait">
          {activeGame ? (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <button
                onClick={() => setActiveGame(null)}
                className="mb-8 text-cyan-400/60 hover:text-cyan-400 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Lobby
              </button>
              {activeGame === 'slots' && <LiamsSlots />}
              {activeGame === 'blackjack' && <Blackjack />}
              {activeGame === 'roulette' && <Roulette />}
              {activeGame === 'poker' && <VideoPoker />}
              {activeGame === 'dice' && <Dice />}
              {activeGame === 'coinflip' && <CoinFlip />}
              {activeGame === 'crash' && <Crash />}
              {activeGame === 'mines' && <Mines />}
              {activeGame === 'wheel' && <WheelOfFortune />}
              {activeGame === 'higherlower' && <HigherLower />}
              {activeGame === 'plinko' && <Plinko />}
              {activeGame === 'keno' && <Keno />}
              {activeGame === 'baccarat' && <Baccarat />}
              {activeGame === 'scratch' && <ScratchCards />}
              {activeGame === 'horse' && <HorseRacing />}
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {activeTab === 'lobby' && (
                <>
                  <div className="text-center mb-12 space-y-2">
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                      The <span className="text-cyan-400">Playground</span>
                    </h2>
                    <p className="text-white/20 text-xs uppercase tracking-[0.3em] font-bold">
                      Select a table and start winning.
                    </p>
                  </div>
                  <GameSelector onSelect={setActiveGame} />
                </>
              )}
              {activeTab === 'shop' && <Shop />}
              {activeTab === 'inventory' && <Inventory />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Faucet Modal */}
      <AnimatePresence>
        {showFaucet && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setShowFaucet(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative casino-card p-10 rounded-[2.5rem] max-w-sm w-full text-center border border-white/10"
            >
              <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                <Coins className="text-cyan-400" size={40} />
              </div>
              <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">Need Chips?</h3>
              <p className="text-white/40 mb-8 text-[10px] leading-relaxed uppercase tracking-widest">
                The house is happy to provide a small bonus to keep the fun going.
              </p>
              <button
                onClick={getDailyBonus}
                className="w-full py-4 bg-cyan-500 text-black font-black rounded-2xl shadow-xl hover:bg-cyan-400 transition-all uppercase tracking-widest text-xs"
              >
                Claim $1,000
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 text-white/10 text-[8px] font-black uppercase tracking-[0.4em] mb-4">
          <Info size={12} />
          Virtual Currency Only • No Real Money Gambling
        </div>
        <p className="text-white/5 text-[8px] font-black uppercase tracking-[0.6em]">
          © 2026 Liam's Digital Entertainment
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CasinoProvider>
      <CasinoApp />
    </CasinoProvider>
  );
}
