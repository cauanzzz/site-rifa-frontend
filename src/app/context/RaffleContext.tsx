import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Raffle, Purchase } from '../types/raffle';

interface RaffleContextType {
  raffles: Raffle[];
  purchases: Purchase[];
  addRaffle: (raffle: Omit<Raffle, 'id' | 'createdAt' | 'soldNumbers'>) => void;
  updateRaffle: (id: string, updates: Partial<Raffle>) => void;
  purchaseNumbers: (purchase: Omit<Purchase, 'id' | 'purchaseDate'>) => void;
  getRaffleById: (id: string) => Raffle | undefined;
  getPurchasesByRaffle: (raffleId: string) => Purchase[];
}

const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export function RaffleProvider({ children }: { children: ReactNode }) {
  const [raffles, setRaffles] = useState<Raffle[]>([
    {
      id: '1',
      title: 'iPhone 15 Pro Max',
      description: 'iPhone 15 Pro Max 256GB na cor Titânio Natural. Produto lacrado com nota fiscal.',
      prize: 'iPhone 15 Pro Max 256GB',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
      price: 10,
      totalNumbers: 100,
      soldNumbers: [1, 5, 12, 23, 34, 45, 56, 67, 78, 89],
      status: 'active',
      drawDate: '2026-03-15T20:00:00',
      createdAt: '2026-03-01T10:00:00'
    },
    {
      id: '2',
      title: 'Notebook Dell Inspiron',
      description: 'Notebook Dell Inspiron 15, Intel Core i7, 16GB RAM, SSD 512GB. Perfeito para trabalho e estudos.',
      prize: 'Notebook Dell Inspiron i7',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      price: 5,
      totalNumbers: 200,
      soldNumbers: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
      status: 'active',
      drawDate: '2026-03-20T20:00:00',
      createdAt: '2026-03-02T10:00:00'
    },
    {
      id: '3',
      title: 'Smart TV 55" 4K',
      description: 'Smart TV LED 55" 4K Samsung, com HDR e sistema operacional Tizen. Entretenimento em alta qualidade.',
      prize: 'Smart TV Samsung 55"',
      imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
      price: 8,
      totalNumbers: 150,
      soldNumbers: [15, 25, 35, 45, 55, 65],
      status: 'active',
      drawDate: '2026-03-25T20:00:00',
      createdAt: '2026-03-03T10:00:00'
    }
  ]);

  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const addRaffle = (raffleData: Omit<Raffle, 'id' | 'createdAt' | 'soldNumbers'>) => {
    const newRaffle: Raffle = {
      ...raffleData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      soldNumbers: []
    };
    setRaffles(prev => [newRaffle, ...prev]);
  };

  const updateRaffle = (id: string, updates: Partial<Raffle>) => {
    setRaffles(prev => prev.map(raffle => 
      raffle.id === id ? { ...raffle, ...updates } : raffle
    ));
  };

  const purchaseNumbers = (purchaseData: Omit<Purchase, 'id' | 'purchaseDate'>) => {
    const newPurchase: Purchase = {
      ...purchaseData,
      id: Date.now().toString(),
      purchaseDate: new Date().toISOString()
    };
    
    setPurchases(prev => [...prev, newPurchase]);
    
    // Update the raffle with sold numbers
    setRaffles(prev => prev.map(raffle => {
      if (raffle.id === purchaseData.raffleId) {
        return {
          ...raffle,
          soldNumbers: [...raffle.soldNumbers, ...purchaseData.numbers].sort((a, b) => a - b)
        };
      }
      return raffle;
    }));
  };

  const getRaffleById = (id: string) => {
    return raffles.find(raffle => raffle.id === id);
  };

  const getPurchasesByRaffle = (raffleId: string) => {
    return purchases.filter(purchase => purchase.raffleId === raffleId);
  };

  return (
    <RaffleContext.Provider value={{
      raffles,
      purchases,
      addRaffle,
      updateRaffle,
      purchaseNumbers,
      getRaffleById,
      getPurchasesByRaffle
    }}>
      {children}
    </RaffleContext.Provider>
  );
}

export function useRaffles() {
  const context = useContext(RaffleContext);
  if (context === undefined) {
    throw new Error('useRaffles must be used within a RaffleProvider');
  }
  return context;
}
