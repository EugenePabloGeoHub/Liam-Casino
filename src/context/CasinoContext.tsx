import React, { createContext, useContext, useState, useEffect } from 'react';

interface CasinoContextType {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  addWin: (amount: number) => void;
  placeBet: (amount: number) => boolean;
  username: string;
  setUsername: (name: string) => void;
  selectedAvatarId: string;
  setSelectedAvatarId: (id: string) => void;
  inventory: string[];
  addToInventory: (id: string) => void;
}

const CasinoContext = createContext<CasinoContextType | undefined>(undefined);

export const CasinoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('casino_balance');
    return saved ? parseInt(saved, 10) : 1000;
  });

  const [username, setUsernameState] = useState<string>(() => {
    return localStorage.getItem('casino_username') || 'Guest';
  });

  const [selectedAvatarId, setSelectedAvatarIdState] = useState<string>(() => {
    return localStorage.getItem('casino_avatar_id') || 'c1';
  });

  const [inventory, setInventoryState] = useState<string[]>(() => {
    const saved = localStorage.getItem('casino_inventory');
    return saved ? JSON.parse(saved) : ['c1'];
  });

  useEffect(() => {
    localStorage.setItem('casino_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('casino_username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('casino_avatar_id', selectedAvatarId);
  }, [selectedAvatarId]);

  useEffect(() => {
    localStorage.setItem('casino_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const setUsername = (name: string) => setUsernameState(name);
  const setSelectedAvatarId = (id: string) => setSelectedAvatarIdState(id);
  const addToInventory = (id: string) => {
    setInventoryState(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const addWin = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const placeBet = (amount: number) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  return (
    <CasinoContext.Provider value={{ 
      balance, setBalance, addWin, placeBet, 
      username, setUsername, 
      selectedAvatarId, setSelectedAvatarId, 
      inventory, addToInventory 
    }}>
      {children}
    </CasinoContext.Provider>
  );
};

export const useCasino = () => {
  const context = useContext(CasinoContext);
  if (!context) throw new Error('useCasino must be used within a CasinoProvider');
  return context;
};
