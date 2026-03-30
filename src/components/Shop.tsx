import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCasino } from '../context/CasinoContext';
import { PACKS, AVATARS } from '../constants';
import { Pack, Avatar, Rarity, AnimationType } from '../types';
import { Sparkles, Package, X, Eye, Info } from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';

const PackPreview: React.FC<{ pack: Pack; onClose: () => void }> = ({ pack, onClose }) => {
  const packAvatars = AVATARS.filter(a => a.packId === pack.id);
  
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${pack.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <Package size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">{pack.name} Contents</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Exclusive Profiles & Abilities</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {packAvatars.map(avatar => (
            <div key={avatar.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center group hover:bg-white/10 transition-all">
              <AvatarDisplay avatar={avatar} size="sm" />
              <h4 className="mt-3 text-[10px] font-black uppercase tracking-widest text-white truncate w-full">{avatar.name}</h4>
              <span className={`mt-1 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                avatar.rarity === 'Legendary' ? 'bg-amber-500 text-black' :
                avatar.rarity === 'Epic' ? 'bg-purple-500 text-white' :
                avatar.rarity === 'Rare' ? 'bg-cyan-500 text-black' : 'bg-gray-500 text-white'
              }`}>
                {avatar.rarity}
              </span>
              {avatar.ability && (
                <div className="mt-2 flex items-center gap-1 text-cyan-400">
                  <Sparkles size={10} />
                  <span className="text-[8px] font-bold uppercase">{avatar.ability.type.replace('_', ' ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 bg-white/5 border-t border-white/5 flex justify-center gap-8">
          {Object.entries(pack.probabilities).map(([rarity, prob]) => (
            <div key={rarity} className="flex flex-col items-center">
              <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">{rarity}</span>
              <span className="text-sm font-black text-cyan-400">{prob}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const Shop: React.FC = () => {
  const { balance, setBalance, addToInventory } = useCasino();
  const [pulling, setPulling] = useState<Pack | null>(null);
  const [result, setResult] = useState<Avatar | null>(null);
  const [previewingPack, setPreviewingPack] = useState<Pack | null>(null);

  const pullPack = (pack: Pack) => {
    if (balance < pack.price) return;
    setBalance(prev => prev - pack.price);
    setPulling(pack);

    setTimeout(() => {
      const rand = Math.random() * 100;
      let rarity: Rarity = 'Common';
      let cumulative = 0;

      const rarities: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary'];
      for (const r of rarities) {
        cumulative += pack.probabilities[r];
        if (rand <= cumulative) {
          rarity = r;
          break;
        }
      }

      const possibleAvatars = AVATARS.filter(a => a.rarity === rarity && a.packId === pack.id);
      const finalPool = possibleAvatars.length > 0 ? possibleAvatars : AVATARS.filter(a => a.packId === pack.id);
      const pulled = finalPool[Math.floor(Math.random() * finalPool.length)];
      
      setResult(pulled);
      addToInventory(pulled.id);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      <AnimatePresence>
        {previewingPack && (
          <PackPreview pack={previewingPack} onClose={() => setPreviewingPack(null)} />
        )}

        {pulling && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
            >
              {!result ? (
                <div className="space-y-8">
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className={`w-48 h-48 ${pulling.color} rounded-[2.5rem] mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3)]`}
                  >
                    <Package size={96} className="text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter animate-pulse">Opening Pack...</h3>
                </div>
              ) : (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-8 max-w-sm"
                >
                  <div className="relative">
                    <AvatarDisplay avatar={result} size="lg" />
                    <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs shadow-xl ${
                      result.rarity === 'Legendary' ? 'bg-amber-500 text-black' :
                      result.rarity === 'Epic' ? 'bg-purple-500 text-white' :
                      result.rarity === 'Rare' ? 'bg-cyan-500 text-black' : 'bg-gray-500 text-white'
                    }`}>
                      {result.rarity}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-4xl font-black uppercase mb-2 tracking-tighter">{result.name}</h3>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-4">{result.description}</p>
                    {result.ability && (
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-2 text-cyan-400 font-black text-[10px] uppercase mb-1">
                          <Sparkles size={14} />
                          Ability Unlocked
                        </div>
                        <p className="text-xs text-white/80 font-medium">{result.description}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setPulling(null);
                      setResult(null);
                    }}
                    className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-colors shadow-2xl"
                  >
                    Collect
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-8">
        <Package className="text-cyan-400" size={32} />
        <h2 className="text-4xl font-black uppercase tracking-tighter">Avatar Shop</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PACKS.map((pack) => (
          <motion.div
            key={pack.id}
            whileHover={{ y: -10 }}
            className={`p-8 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className={`w-32 h-32 ${pack.color} rounded-3xl mb-6 shadow-2xl flex items-center justify-center relative`}>
              <Package size={64} className="text-white" />
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-3xl" />
            </div>

            <h3 className="text-2xl font-black uppercase mb-2 tracking-tight">{pack.name}</h3>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-6">{pack.description}</p>
            
            <button
              onClick={() => setPreviewingPack(pack)}
              className="mb-8 flex items-center gap-2 text-cyan-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              <Eye size={14} />
              Preview Pack
            </button>

            <button
              onClick={() => pullPack(pack)}
              disabled={balance < pack.price}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
                balance >= pack.price 
                ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20' 
                : 'bg-white/10 text-white/20 cursor-not-allowed'
              }`}
            >
              Buy for ${pack.price.toLocaleString()}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
