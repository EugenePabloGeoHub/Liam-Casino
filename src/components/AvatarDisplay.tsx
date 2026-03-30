import React from 'react';
import { motion } from 'motion/react';
import { Avatar, AnimationType } from '../types';

interface AvatarDisplayProps {
  avatar: Avatar;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatar, size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-8 h-8 text-lg',
    sm: 'w-12 h-12 text-2xl',
    md: 'w-24 h-24 text-5xl',
    lg: 'w-48 h-48 text-8xl',
    xl: 'w-64 h-64 text-[10rem]'
  };

  const getAnimation = (type: AnimationType) => {
    switch (type) {
      case 'pulse': return { scale: [1, 1.1, 1] };
      case 'float': return { y: [0, -10, 0] };
      case 'spin': return { rotate: [0, 360] };
      case 'glow': return { filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] };
      case 'shake': return { x: [0, -2, 2, -2, 2, 0] };
      case 'rainbow': return { filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'] };
      default: return {};
    }
  };

  const getTransition = (type: AnimationType) => {
    if (type === 'spin' || type === 'rainbow') return { repeat: Infinity, duration: 3, ease: "linear" };
    return { repeat: Infinity, duration: 2, ease: "easeInOut" };
  };

  return (
    <motion.div
      animate={getAnimation(avatar.animationType)}
      transition={getTransition(avatar.animationType)}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-zinc-900 border border-white/10 shadow-2xl relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <span className="select-none">{avatar.image}</span>
      
      {/* Rarity Glow */}
      <div className={`absolute inset-0 opacity-20 pointer-events-none ${
        avatar.rarity === 'Legendary' ? 'bg-amber-500 shadow-[inset_0_0_40px_rgba(245,158,11,0.5)]' :
        avatar.rarity === 'Epic' ? 'bg-purple-500 shadow-[inset_0_0_40px_rgba(168,85,247,0.5)]' :
        avatar.rarity === 'Rare' ? 'bg-cyan-500 shadow-[inset_0_0_40px_rgba(6,182,212,0.5)]' : ''
      }`} />
    </motion.div>
  );
};
