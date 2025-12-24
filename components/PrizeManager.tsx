
import React, { useState } from 'react';
import { Prize } from '../types';
import { FESTIVE_COLORS } from '../constants';
import { Plus, Trash2, Wand2, Sparkles } from 'lucide-react';
import { generateFestivePrizes } from '../services/geminiService';

interface PrizeManagerProps {
  prizes: Prize[];
  setPrizes: (prizes: Prize[]) => void;
  isSpinning: boolean;
}

const PrizeManager: React.FC<PrizeManagerProps> = ({ prizes, setPrizes, isSpinning }) => {
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addPrize = () => {
    if (!newName.trim()) return;
    const newPrize: Prize = {
      id: Date.now().toString(),
      name: newName.trim(),
      color: FESTIVE_COLORS[prizes.length % FESTIVE_COLORS.length],
      weight: 1,
    };
    setPrizes([...prizes, newPrize]);
    setNewName('');
  };

  const removePrize = (id: string) => {
    if (prizes.length <= 2) {
      alert("Minimum 2 prizes required for the wheel.");
      return;
    }
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const handleAiSuggest = async () => {
    setIsLoading(true);
    const suggestedNames = await generateFestivePrizes();
    if (suggestedNames && suggestedNames.length > 0) {
      const newPrizes = suggestedNames.map((name, i) => ({
        id: `ai-${Date.now()}-${i}`,
        name,
        color: FESTIVE_COLORS[i % FESTIVE_COLORS.length],
        weight: 1,
      }));
      setPrizes(newPrizes);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="text-yellow-400" />
          Prize List
        </h2>
        <button
          onClick={handleAiSuggest}
          disabled={isLoading || isSpinning}
          className="flex items-center gap-2 text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
        >
          <Wand2 size={14} />
          {isLoading ? 'Generating...' : 'AI Suggest'}
        </button>
      </div>

      <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {prizes.map((prize) => (
          <div key={prize.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10 group">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0" 
              style={{ backgroundColor: prize.color }}
            />
            <span className="flex-1 truncate text-sm font-medium">{prize.name}</span>
            <button
              onClick={() => removePrize(prize.id)}
              disabled={isSpinning}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-400/10 rounded-md transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPrize()}
          placeholder="New prize name..."
          disabled={isSpinning}
          className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-white/40"
        />
        <button
          onClick={addPrize}
          disabled={isSpinning || !newName.trim()}
          className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

export default PrizeManager;
