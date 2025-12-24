
import React, { useState, useEffect } from 'react';
import Snowfall from './components/Snowfall';
import LuckyWheel from './components/LuckyWheel';
import PrizeManager from './components/PrizeManager';
import { INITIAL_PRIZES } from './constants';
import { Prize, Winner } from './types';
import { Gift, History, Trophy, X } from 'lucide-react';

const App: React.FC = () => {
  const [prizes, setPrizes] = useState<Prize[]>(INITIAL_PRIZES);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [currentWinner, setCurrentWinner] = useState<Winner | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleSpinEnd = (prize: Prize) => {
    const winner: Winner = { prize, timestamp: Date.now() };
    setCurrentWinner(winner);
    setWinners(prev => [winner, ...prev]);
  };

  return (
    <div className="min-h-screen relative text-white selection:bg-red-500/30">
      <Snowfall />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 p-4 z-10 opacity-30 pointer-events-none">
        <img src="https://picsum.photos/200/200?random=1" className="w-32 h-32 rounded-full border-4 border-white/20 rotate-12" alt="Christmas Decor" />
      </div>
      <div className="absolute bottom-0 right-0 p-4 z-10 opacity-30 pointer-events-none">
        <img src="https://picsum.photos/200/200?random=2" className="w-32 h-32 rounded-full border-4 border-white/20 -rotate-12" alt="Christmas Decor" />
      </div>

      <header className="py-8 px-4 text-center relative z-10">
        <h1 className="festive-font text-6xl md:text-8xl text-red-500 drop-shadow-[0_5px_15px_rgba(239,68,68,0.5)] mb-2">
          Merry Raffle
        </h1>
        <p className="text-yellow-400 font-medium tracking-widest text-sm uppercase">Christmas Lucky Draw 2024</p>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Prize Management */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <PrizeManager prizes={prizes} setPrizes={setPrizes} isSpinning={isSpinning} />
        </div>

        {/* Center: The Wheel */}
        <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center">
          <div className="w-full bg-emerald-800/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-inner">
            <LuckyWheel 
              prizes={prizes} 
              onSpinEnd={handleSpinEnd} 
              isSpinning={isSpinning} 
              setIsSpinning={setIsSpinning} 
            />
          </div>
          
          <div className="mt-12 text-center">
             <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md">
                <p className="text-white/60 text-sm mb-4 italic">"Wishing you a season of blessings and a lifetime of happiness."</p>
                <div className="flex justify-center gap-4">
                  <div className="flex items-center gap-2 bg-red-600/20 px-4 py-2 rounded-full text-xs text-red-300">
                    <Gift size={14} /> {prizes.length} Prizes Added
                  </div>
                  <button 
                    onClick={() => setShowHistory(true)}
                    className="flex items-center gap-2 bg-yellow-600/20 px-4 py-2 rounded-full text-xs text-yellow-300 hover:bg-yellow-600/30 transition-colors"
                  >
                    <History size={14} /> History ({winners.length})
                  </button>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Last Winner (Desktop) */}
        <div className="lg:col-span-3 order-3 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white shadow-xl h-full min-h-[400px]">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <Trophy className="text-yellow-400" />
              Recent Winners
            </h2>
            <div className="space-y-4">
              {winners.slice(0, 5).map((w, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 animate-in fade-in slide-in-from-right-4">
                  <p className="text-xs text-white/40 mb-1">{new Date(w.timestamp).toLocaleTimeString()}</p>
                  <p className="font-bold text-red-400">Winning: {w.prize.name}</p>
                </div>
              ))}
              {winners.length === 0 && (
                <div className="text-center py-20 opacity-30">
                  <Gift size={48} className="mx-auto mb-4" />
                  <p>No winners yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Winner Modal */}
      {currentWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-in fade-in">
          <div className="bg-emerald-900 border-4 border-yellow-400 rounded-[2.5rem] p-12 max-w-lg w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.3)]">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
               <div className="absolute top-10 left-10 text-4xl animate-bounce">🎁</div>
               <div className="absolute bottom-10 right-10 text-4xl animate-bounce" style={{ animationDelay: '0.5s'}}>🎄</div>
            </div>

            <h2 className="festive-font text-5xl text-yellow-400 mb-6">Congratulations!</h2>
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-white/20 shadow-xl">
               <Trophy size={48} className="text-yellow-400" />
            </div>
            
            <p className="text-white/80 text-lg mb-2 uppercase tracking-widest font-bold">You Won</p>
            <p className="text-4xl font-extrabold text-white mb-10 drop-shadow-lg">{currentWinner.prize.name}</p>
            
            <button
              onClick={() => setCurrentWinner(null)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 text-xl"
            >
              HO HO HO! GREAT!
            </button>
          </div>
        </div>
      )}

      {/* History Modal (Mobile/Tablet and Desktop toggle) */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-emerald-900 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-2xl font-bold flex items-center gap-2">
                 <History className="text-yellow-400" /> 
                 Winning History
               </h3>
               <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <X />
               </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
               {winners.map((w, i) => (
                 <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10">
                   <div className="flex justify-between items-center">
                     <span className="font-bold text-red-400">{w.prize.name}</span>
                     <span className="text-[10px] text-white/40">{new Date(w.timestamp).toLocaleString()}</span>
                   </div>
                 </div>
               ))}
               {winners.length === 0 && <p className="text-center py-10 text-white/40 italic">History is empty</p>}
            </div>
          </div>
        </div>
      )}

      <footer className="py-10 text-center text-white/30 text-xs">
        <p>© 2024 Christmas Lucky Draw. All rights reserved.</p>
        <p className="mt-2">Spread the joy of giving.</p>
      </footer>
    </div>
  );
};

export default App;
