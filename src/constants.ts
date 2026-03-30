import { Avatar, Pack } from './types';

export const AVATARS: Avatar[] = [
  // STARTER PACK (id: starter)
  { id: 's1', name: 'Blue Blob', rarity: 'Common', image: '🔵', packId: 'starter', animationType: 'pulse', description: 'Just a regular blue blob.' },
  { id: 's2', name: 'Green Blob', rarity: 'Common', image: '🟢', packId: 'starter', animationType: 'float', description: 'Just a regular green blob.' },
  { id: 's3', name: 'Red Blob', rarity: 'Common', image: '🔴', packId: 'starter', animationType: 'shake', description: 'Just a regular red blob.' },
  { id: 's4', name: 'Yellow Blob', rarity: 'Common', image: '🟡', packId: 'starter', animationType: 'spin', description: 'Just a regular yellow blob.' },
  { id: 's5', name: 'Purple Blob', rarity: 'Common', image: '🟣', packId: 'starter', animationType: 'pulse', description: 'Just a regular purple blob.' },
  { id: 's6', name: 'Lucky Clover', rarity: 'Rare', image: '🍀', packId: 'starter', animationType: 'float', ability: { type: 'slots_luck', value: 5 }, description: '+5% Slot Luck.' },
  { id: 's7', name: 'Silver Coin', rarity: 'Rare', image: '🪙', packId: 'starter', animationType: 'spin', ability: { type: 'all_around', value: 3 }, description: '+3% All Earnings.' },
  { id: 's8', name: 'Small Star', rarity: 'Rare', image: '⭐', packId: 'starter', animationType: 'glow', ability: { type: 'dice_luck', value: 5 }, description: '+5% Dice Luck.' },
  { id: 's9', name: 'Tiny Sparkle', rarity: 'Epic', image: '✨', packId: 'starter', animationType: 'rainbow', ability: { type: 'all_around', value: 8 }, description: '+8% All Earnings.' },
  { id: 's10', name: 'Lucky Horseshoe', rarity: 'Epic', image: '🧲', packId: 'starter', animationType: 'shake', ability: { type: 'slots_luck', value: 12 }, description: '+12% Slot Luck.' },

  // ELITE PACK (id: elite)
  { id: 'e1', name: 'Neon Fox', rarity: 'Common', image: '🦊', packId: 'elite', animationType: 'pulse', description: 'A sleek neon fox.' },
  { id: 'e2', name: 'Cyber Wolf', rarity: 'Common', image: '🐺', packId: 'elite', animationType: 'float', description: 'A digital cyber wolf.' },
  { id: 'e3', name: 'Tech Owl', rarity: 'Rare', image: '🦉', packId: 'elite', animationType: 'glow', ability: { type: 'poker_luck', value: 10 }, description: '+10% Poker Luck.' },
  { id: 'e4', name: 'Digital Tiger', rarity: 'Rare', image: '🐯', packId: 'elite', animationType: 'shake', ability: { type: 'blackjack_payout', value: 10 }, description: '+10% Blackjack Payout.' },
  { id: 'e5', name: 'Glitch Cat', rarity: 'Rare', image: '🐱', packId: 'elite', animationType: 'spin', ability: { type: 'roulette_payout', value: 10 }, description: '+10% Roulette Payout.' },
  { id: 'e6', name: 'Electric Dragon', rarity: 'Epic', image: '🐲', packId: 'elite', animationType: 'rainbow', ability: { type: 'all_around', value: 12 }, description: '+12% All Earnings.' },
  { id: 'e7', name: 'Laser Phoenix', rarity: 'Epic', image: '🐦', packId: 'elite', animationType: 'glow', ability: { type: 'loss_protection', value: 15 }, description: '15% Loss Protection.' },
  { id: 'e8', name: 'Plasma Shark', rarity: 'Epic', image: '🦈', packId: 'elite', animationType: 'shake', ability: { type: 'blackjack_payout', value: 20 }, description: '+20% Blackjack Payout.' },
  { id: 'e9', name: 'Master Gambler', rarity: 'Legendary', image: '🎩', packId: 'elite', animationType: 'rainbow', ability: { type: 'all_around', value: 20 }, description: '+20% All Earnings.' },
  { id: 'e10', name: 'The Dealer', rarity: 'Legendary', image: '🃏', packId: 'elite', animationType: 'spin', ability: { type: 'blackjack_payout', value: 40 }, description: '+40% Blackjack Payout.' },

  // LEGENDARY PACK (id: legendary)
  { id: 'l1', name: 'Gold Bar', rarity: 'Rare', image: '🧈', packId: 'legendary', animationType: 'glow', ability: { type: 'all_around', value: 10 }, description: '+10% All Earnings.' },
  { id: 'l2', name: 'Diamond Ring', rarity: 'Rare', image: '💍', packId: 'legendary', animationType: 'rainbow', ability: { type: 'roulette_payout', value: 20 }, description: '+20% Roulette Payout.' },
  { id: 'l3', name: 'Crown of Luck', rarity: 'Epic', image: '👑', packId: 'legendary', animationType: 'float', ability: { type: 'all_around', value: 15 }, description: '+15% All Earnings.' },
  { id: 'l4', name: 'Crystal Ball', rarity: 'Epic', image: '🔮', packId: 'legendary', animationType: 'glow', ability: { type: 'dice_luck', value: 25 }, description: '+25% Dice Luck.' },
  { id: 'l5', name: 'Magic Lamp', rarity: 'Epic', image: '🪔', packId: 'legendary', animationType: 'spin', ability: { type: 'slots_luck', value: 30 }, description: '+30% Slot Luck.' },
  { id: 'l6', name: 'Golden Dragon', rarity: 'Legendary', image: '🐉', packId: 'legendary', animationType: 'rainbow', ability: { type: 'all_around', value: 25 }, description: '+25% All Earnings.' },
  { id: 'l7', name: 'Phoenix Rising', rarity: 'Legendary', image: '🔥', packId: 'legendary', animationType: 'pulse', ability: { type: 'loss_protection', value: 30 }, description: '30% Loss Protection.' },
  { id: 'l8', name: 'The King', rarity: 'Legendary', image: '🤴', packId: 'legendary', animationType: 'float', ability: { type: 'all_around', value: 35 }, description: '+35% All Earnings.' },
  { id: 'l9', name: 'The Queen', rarity: 'Legendary', image: '👸', packId: 'legendary', animationType: 'glow', ability: { type: 'all_around', value: 35 }, description: '+35% All Earnings.' },
  { id: 'l10', name: 'Casino God', rarity: 'Legendary', image: '🌌', packId: 'legendary', animationType: 'rainbow', ability: { type: 'all_around', value: 50 }, description: '+50% All Earnings & Luck.' },
];

export const PACKS: Pack[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    price: 500,
    description: 'Basic avatar pack.',
    color: 'bg-blue-500',
    probabilities: { Common: 80, Rare: 15, Epic: 4, Legendary: 1 }
  },
  {
    id: 'elite',
    name: 'Elite Pack',
    price: 2500,
    description: 'High rare chance.',
    color: 'bg-purple-500',
    probabilities: { Common: 40, Rare: 40, Epic: 15, Legendary: 5 }
  },
  {
    id: 'legendary',
    name: 'Legendary Pack',
    price: 10000,
    description: 'Guaranteed Rare+.',
    color: 'bg-amber-500',
    probabilities: { Common: 0, Rare: 50, Epic: 35, Legendary: 15 }
  }
];
