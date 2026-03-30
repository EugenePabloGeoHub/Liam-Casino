export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type AnimationType = 'pulse' | 'float' | 'spin' | 'glow' | 'shake' | 'rainbow';

export interface Avatar {
  id: string;
  name: string;
  rarity: Rarity;
  image: string; // Emoji or simple icon
  packId: string;
  animationType: AnimationType;
  ability?: {
    type: 'slots_luck' | 'blackjack_payout' | 'roulette_payout' | 'dice_luck' | 'poker_luck' | 'all_around' | 'loss_protection';
    value: number; // percentage increase
  };
  description: string;
}

export interface Pack {
  id: string;
  name: string;
  price: number;
  description: string;
  color: string;
  probabilities: Record<Rarity, number>;
}
