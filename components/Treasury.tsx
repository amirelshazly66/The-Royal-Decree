import React from 'react';
import { Coins, Gift } from 'lucide-react';
import { Reward } from '../types';

interface TreasuryProps {
  coins: number;
  onSpend: (amount: number) => void;
}

const REWARDS: Reward[] = [
  { id: '1', title: 'Order Royal Takeout', cost: 50, icon: '🍕' },
  { id: '2', title: 'Cinema Night', cost: 100, icon: '🎬' },
  { id: '3', title: 'Back Massage (20m)', cost: 75, icon: '💆' },
  { id: '4', title: 'Weekend Getaway', cost: 500, icon: '🏰' },
  { id: '5', title: 'Breakfast in Bed', cost: 150, icon: '🥐' },
];

export const Treasury: React.FC<TreasuryProps> = ({ coins, onSpend }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-900 to-charcoal rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2 text-gold">The Royal Treasury</h2>
          <p className="text-gray-300">Spend your hard-earned coins on luxuries fit for royalty.</p>
        </div>
        <div className="mt-6 md:mt-0 flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full border border-gold/30">
          <Coins className="w-8 h-8 text-gold animate-pulse" />
          <span className="text-4xl font-bold text-gold font-serif">{coins}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {REWARDS.map(reward => {
          const canAfford = coins >= reward.cost;
          return (
            <div key={reward.id} className={`bg-white rounded-xl p-6 shadow-md border-2 transition-all ${canAfford ? 'border-gray-100 hover:border-gold hover:shadow-lg' : 'border-gray-100 opacity-60 grayscale'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl">{reward.icon}</span>
                <div className="flex items-center gap-1 font-bold text-goldDark">
                  <Coins className="w-4 h-4" />
                  <span>{reward.cost}</span>
                </div>
              </div>
              <h3 className="font-bold text-charcoal text-lg mb-4">{reward.title}</h3>
              <button 
                disabled={!canAfford}
                onClick={() => {
                    if(window.confirm(`Purchase ${reward.title} for ${reward.cost} coins?`)) {
                        onSpend(reward.cost);
                    }
                }}
                className={`w-full py-2 rounded-lg font-serif font-bold text-sm transition-colors ${
                  canAfford 
                    ? 'bg-parchment text-charcoal border border-gold hover:bg-gold hover:text-white' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {canAfford ? 'Purchase' : 'Need More Gold'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};