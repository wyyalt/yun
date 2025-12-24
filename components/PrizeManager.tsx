
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
      alert("最少需要保留两个奖品。");
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
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-white shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-400">
          <Sparkles className="text-yellow-400" size={20} />
          奖品列表
        </h2>
        <button
          onClick={handleAiSuggest}
          disabled={isLoading || isSpinning}
          className="flex items-center gap-2 text-[10px] bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-200 px-3 py-1.5 rounded-full transition-all border border-yellow-500/20 disabled:opacity-50"
        >
          <Wand2 size={12} />
          {isLoading ? '生成中...' : 'AI 建议'}
        </button>
      </div>

      <div className="space-y-2.5 mb-6 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
        {prizes.map((prize) => (
          <div key={prize.id} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5 group hover:border-white/20 transition-all">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
              style={{ backgroundColor: prize.color }}
            />
            <span className="flex-1 truncate text-sm font-medium text-white/90">{prize.name}</span>
            <button
              onClick={() => removePrize(prize.id)}
              disabled={isSpinning}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            >
              <Trash2 size={14} />
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
          placeholder="添加奖品..."
          disabled={isSpinning}
          className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 placeholder:text-white/20 text-white"
        />
        <button
          onClick={addPrize}
          disabled={isSpinning || !newName.trim()}
          className="bg-yellow-600 hover:bg-yellow-500 text-black p-2.5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-yellow-900/20"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

export default PrizeManager;
