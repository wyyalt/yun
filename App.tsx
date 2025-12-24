
import React, { useState, useEffect } from 'react';
import Snowfall from './components/Snowfall';
import LuckyWheel from './components/LuckyWheel';
import PrizeManager from './components/PrizeManager';
import { INITIAL_PRIZES } from './constants';
import { Prize, Winner } from './types';
import { Gift, History, Trophy, X, Star, Palette } from 'lucide-react';

const ChristmasTree: React.FC<{ opacity?: string }> = ({ opacity = "opacity-40" }) => (
  <svg viewBox="0 0 100 120" className={`w-full h-full drop-shadow-[0_0_20px_rgba(34,197,94,0.3)] ${opacity}`}>
    <polygon points="50,10 20,50 80,50" fill="#065f46" />
    <polygon points="50,30 15,75 85,75" fill="#064e3b" />
    <polygon points="50,55 10,100 90,100" fill="#022c22" />
    <rect x="45" y="100" width="10" height="15" fill="#451a03" />
    <circle cx="50" cy="10" r="4" fill="#fbbf24" className="animate-pulse" />
    <circle cx="35" cy="45" r="2" fill="#ef4444" />
    <circle cx="65" cy="45" r="2" fill="#3b82f6" />
    <circle cx="30" cy="70" r="2" fill="#fbbf24" />
    <circle cx="70" cy="70" r="2" fill="#ef4444" />
    <circle cx="50" cy="80" r="2" fill="#3b82f6" />
  </svg>
);

const THEME_PRESETS = [
  { name: '森林绿', color: '#052e16', gradient: 'radial-gradient(circle at center, #064e3b 0%, #022c22 100%)' },
  { name: '经典红', color: '#450a0a', gradient: 'radial-gradient(circle at center, #7f1d1d 0%, #450a0a 100%)' },
  { name: '星空蓝', color: '#1e1b4b', gradient: 'radial-gradient(circle at center, #312e81 0%, #1e1b4b 100%)' },
  { name: '暗夜黑', color: '#0f172a', gradient: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)' },
];

const App: React.FC = () => {
  const [prizes, setPrizes] = useState<Prize[]>(INITIAL_PRIZES);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [currentWinner, setCurrentWinner] = useState<Winner | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTheme, setActiveTheme] = useState(THEME_PRESETS[0]);

  const handleSpinEnd = (prize: Prize) => {
    const winner: Winner = { prize, timestamp: Date.now() };
    setCurrentWinner(winner);
    setWinners(prev => [winner, ...prev]);
  };

  return (
    <div 
      className="min-h-screen relative text-[#fef3c7] selection:bg-yellow-500/30 transition-colors duration-1000 ease-in-out"
      style={{ background: activeTheme.gradient }}
    >
      <Snowfall />

      {/* Background Decor */}
      <div className="fixed top-20 -left-20 w-80 h-96 z-0 pointer-events-none transform -rotate-12">
        <ChristmasTree opacity="opacity-10" />
      </div>
      <div className="fixed bottom-0 right-0 w-96 h-[500px] z-0 pointer-events-none translate-x-1/4 translate-y-1/4">
        <ChristmasTree opacity="opacity-20" />
      </div>

      <header className="py-12 px-4 text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Star className="text-yellow-400 animate-pulse" size={24} />
          <p className="text-yellow-500/80 font-bold tracking-[0.3em] text-xs uppercase">Premium Christmas Draw</p>
          <Star className="text-yellow-400 animate-pulse" size={24} />
        </div>
        <h1 className="festive-font text-7xl md:text-9xl text-yellow-400 gold-glow mb-2">
          圣诞幸运礼
        </h1>
        <p className="text-white/40 text-sm font-light">Celebrating Joyful Moments • 2025 Edition</p>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Prize Manager & Theme Settings */}
        <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col gap-6">
          <PrizeManager prizes={prizes} setPrizes={setPrizes} isSpinning={isSpinning} />
          
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-white shadow-2xl">
            <h2 className="text-sm font-bold flex items-center gap-2 text-yellow-400/80 mb-4 uppercase tracking-wider">
              <Palette size={16} /> 背景设置
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {THEME_PRESETS.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setActiveTheme(t)}
                  title={t.name}
                  className={`w-full aspect-square rounded-xl border-2 transition-all transform hover:scale-110 active:scale-95 ${activeTheme.name === t.name ? 'border-yellow-400 ring-4 ring-yellow-400/20' : 'border-white/10'}`}
                  style={{ background: t.color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center: The Wheel */}
        <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center">
          <div className="w-full bg-black/20 backdrop-blur-xl rounded-[4rem] p-10 border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            <LuckyWheel 
              prizes={prizes} 
              onSpinEnd={handleSpinEnd} 
              isSpinning={isSpinning} 
              setIsSpinning={setIsSpinning} 
            />
          </div>
          
          <div className="mt-14 text-center w-full max-w-sm">
             <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                <p className="text-white/50 text-xs mb-5 italic font-light tracking-wide">“岁岁常欢愉，万事皆胜意。”</p>
                <div className="flex justify-center gap-4">
                  <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2.5 rounded-2xl text-[10px] text-yellow-200 border border-yellow-500/10">
                    <Gift size={14} className="text-yellow-500" /> {prizes.length} 礼品就绪
                  </div>
                  <button 
                    onClick={() => setShowHistory(true)}
                    className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-2xl text-[10px] text-white/70 hover:bg-white/10 transition-all border border-white/5"
                  >
                    <History size={14} /> 中奖记录 ({winners.length})
                  </button>
                </div>
             </div>
          </div>
        </div>

        {/* Right: History */}
        <div className="lg:col-span-3 order-3 hidden lg:block">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/5 text-white shadow-2xl h-full min-h-[450px]">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-8 text-yellow-400/80">
              <Trophy className="text-yellow-400" size={20} />
              幸运儿名单
            </h2>
            <div className="space-y-4">
              {winners.slice(0, 6).map((w, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 animate-in fade-in slide-in-from-right-4">
                  <p className="text-[9px] text-white/30 mb-1.5 uppercase tracking-tighter">{new Date(w.timestamp).toLocaleTimeString()}</p>
                  <p className="font-medium text-sm">抽中：<span className="text-yellow-400 font-bold ml-1">{w.prize.name}</span></p>
                </div>
              ))}
              {winners.length === 0 && (
                <div className="text-center py-28 opacity-10 flex flex-col items-center">
                  <Gift size={56} className="mb-4" />
                  <p className="text-xs tracking-widest uppercase">Waiting for luck...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Winner Modal */}
      {currentWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in">
          <div 
            className="border-2 border-yellow-500/30 rounded-[3.5rem] p-12 max-w-lg w-full text-center relative overflow-hidden shadow-[0_0_100px_rgba(251,191,36,0.15)]"
            style={{ backgroundColor: activeTheme.color }}
          >
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
               <div className="absolute top-10 left-10 text-4xl animate-bounce">🍎</div>
               <div className="absolute bottom-10 right-10 text-4xl animate-bounce" style={{ animationDelay: '0.5s'}}>🍭</div>
            </div>

            <h2 className="festive-font text-6xl text-yellow-400 mb-10 gold-glow">圣诞大惊喜!</h2>
            <div className="relative w-36 h-36 mx-auto mb-10">
               <div className="absolute inset-0 bg-yellow-400/10 rounded-full animate-ping"></div>
               <div className="relative z-10 w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
                  <Trophy size={64} className="text-black/80" />
               </div>
            </div>
            
            <p className="text-white/40 text-[10px] mb-2 uppercase tracking-[0.3em] font-bold">Excellent Choice</p>
            <p className="text-5xl font-black text-white mb-14 drop-shadow-2xl">{currentWinner.prize.name}</p>
            
            <button
              onClick={() => setCurrentWinner(null)}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-5 rounded-3xl shadow-[0_15px_30px_rgba(185,28,28,0.3)] transition-all transform hover:scale-105 active:scale-95 text-xl border-b-4 border-red-900"
            >
              领取我的好礼
            </button>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div 
            className="border border-white/10 rounded-[3rem] p-8 max-w-md w-full shadow-2xl"
            style={{ backgroundColor: activeTheme.color }}
          >
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-bold flex items-center gap-3 text-yellow-400">
                 <History className="text-yellow-400" /> 
                 幸运足迹
               </h3>
               <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <X size={24} />
               </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar">
               {winners.map((w, i) => (
                 <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-colors">
                   <span className="font-bold text-base text-white/90 group-hover:text-yellow-400 transition-colors">{w.prize.name}</span>
                   <span className="text-[10px] text-white/20 font-mono">{new Date(w.timestamp).toLocaleString()}</span>
                 </div>
               ))}
               {winners.length === 0 && (
                 <div className="text-center py-20 text-white/10 italic text-sm">
                   幸运还在路上，去转动转盘吧...
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      <footer className="py-16 text-center text-white/20 text-[10px] relative z-10 tracking-[0.2em] uppercase">
        <div className="w-16 h-px bg-white/5 mx-auto mb-6"></div>
        <p>© 2025 CHRISTMAS LUCKY WHEEL • 平安喜乐 万事胜意</p>
      </footer>
    </div>
  );
};

export default App;
