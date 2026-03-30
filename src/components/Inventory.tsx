import React from 'react';
import { motion } from 'motion/react';
import { useCasino } from '../context/CasinoContext';
import { AVATARS } from '../constants';
import { Avatar } from '../types';
import { LayoutGrid, Check, Sparkles } from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';

export const Inventory: React.FC = () => {
  const { inventory, selectedAvatarId, setSelectedAvatarId } = useCasino();

  const inventoryAvatars = AVATARS.filter(a => inventory.includes(a.id));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <LayoutGrid className="text-cyan-400" size={32} />
        <h2 className="text-4xl font-black uppercase tracking-tighter">My Inventory</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {inventoryAvatars.map((avatar) => (
          <motion.button
            key={avatar.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedAvatarId(avatar.id)}
            className={`relative p-4 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center ${
              selectedAvatarId === avatar.id 
              ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20' 
              : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            <AvatarDisplay avatar={avatar} size="sm" className="mb-4" />
            
            <h3 className="text-[10px] font-black uppercase mb-1 truncate w-full tracking-widest">{avatar.name}</h3>
            <div className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
              avatar.rarity === 'Legendary' ? 'bg-amber-500 text-black' :
              avatar.rarity === 'Epic' ? 'bg-purple-500 text-white' :
              avatar.rarity === 'Rare' ? 'bg-cyan-500 text-black' : 'bg-gray-500 text-white'
            }`}>
              {avatar.rarity}
            </div>

            {selectedAvatarId === avatar.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <Check size={14} className="text-black" />
              </div>
            )}

            {avatar.ability && (
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-black border border-cyan-500/30 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles size={14} className="text-cyan-400" />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {selectedAvatarId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-10 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col md:flex-row items-center gap-10"
        >
          {(() => {
            const selected = AVATARS.find(a => a.id === selectedAvatarId);
            if (!selected) return null;
            return (
              <>
                <AvatarDisplay avatar={selected} size="lg" className="flex-shrink-0" />
                <div className="flex-grow space-y-6 text-center md:text-left">
                  <div>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
                      <h3 className="text-5xl font-black uppercase tracking-tighter">{selected.name}</h3>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        selected.rarity === 'Legendary' ? 'bg-amber-500 text-black' :
                        selected.rarity === 'Epic' ? 'bg-purple-500 text-white' :
                        selected.rarity === 'Rare' ? 'bg-cyan-500 text-black' : 'bg-gray-500 text-white'
                      }`}>
                        {selected.rarity}
                      </span>
                    </div>
                    <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-bold">{selected.description}</p>
                  </div>

                  {selected.ability && (
                    <div className="bg-cyan-500/10 p-6 rounded-3xl border border-cyan-500/20 max-w-md">
                      <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-400 font-black text-xs uppercase mb-2 tracking-widest">
                        <Sparkles size={16} />
                        Active Ability
                      </div>
                      <p className="text-white/80 text-sm font-medium leading-relaxed">{selected.description}</p>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};
