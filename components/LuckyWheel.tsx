
import React, { useState, useEffect, useRef } from 'react';
import { Prize } from '../types';

interface LuckyWheelProps {
  prizes: Prize[];
  onSpinEnd: (prize: Prize) => void;
  isSpinning: boolean;
  setIsSpinning: (state: boolean) => void;
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({ prizes, onSpinEnd, isSpinning, setIsSpinning }) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);

  const spin = () => {
    if (isSpinning || prizes.length === 0) return;

    setIsSpinning(true);
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const randomDegree = Math.floor(Math.random() * 360);
    const totalNewRotation = rotation + (extraSpins * 360) + randomDegree;
    
    setRotation(totalNewRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDegree = (totalNewRotation % 360);
      const segmentAngle = 360 / prizes.length;
      const index = Math.floor(((360 - (actualDegree - 90)) % 360) / segmentAngle);
      const winningPrize = prizes[index % prizes.length];
      onSpinEnd(winningPrize);
    }, 4000);
  };

  const renderSegments = () => {
    const angle = 360 / prizes.length;
    return prizes.map((prize, i) => {
      const startAngle = i * angle;
      const endAngle = (i + 1) * angle;
      const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
      const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
      const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
      const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      return (
        <g key={prize.id}>
          <path
            d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
            fill={prize.color}
            stroke="white"
            strokeWidth="0.3"
            opacity="0.9"
          />
          <text
            x="75"
            y="50"
            fill="white"
            fontSize="3.8"
            fontWeight="bold"
            transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
            className="select-none pointer-events-none drop-shadow-md"
            style={{ textAnchor: 'middle' }}
          >
            {prize.name.length > 10 ? prize.name.substring(0, 8) + '..' : prize.name}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="relative w-full max-w-md aspect-square mx-auto flex items-center justify-center group">
      {/* Indicator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white shadow-[0_5px_15px_rgba(251,191,36,0.4)]">
           <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-yellow-600 absolute bottom-[-14px]"></div>
        </div>
      </div>

      {/* Outer Glow Ring */}
      <div className="absolute inset-[-10px] rounded-full border-[1px] border-yellow-500/20 z-0 animate-pulse pointer-events-none"></div>

      {/* Decorative Outer Border */}
      <div className="absolute inset-0 rounded-full border-[15px] border-yellow-700/80 shadow-2xl z-10 pointer-events-none bg-transparent flex items-center justify-center">
        {/* Decorative Lights */}
        {Array.from({ length: 24 }).map((_, i) => (
           <div 
            key={i} 
            className={`absolute w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse`}
            style={{
              transform: `rotate(${i * 15}deg) translateY(-210px)`,
              animationDelay: `${i * 0.05}s`,
              opacity: i % 2 === 0 ? 1 : 0.4
            }}
           />
        ))}
      </div>

      {/* Main Wheel */}
      <div 
        className="w-full h-full relative transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl" ref={wheelRef}>
          {renderSegments()}
          <circle cx="50" cy="50" r="5" fill="#022c22" stroke="#facc15" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Spin Button - Red but smaller and balanced */}
      <button
        onClick={spin}
        disabled={isSpinning || prizes.length === 0}
        className={`absolute z-30 w-28 h-28 rounded-full bg-red-700 hover:bg-red-600 border-[6px] border-yellow-500 text-white font-black text-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all transform active:scale-95 flex items-center justify-center text-center leading-none flex-col gap-1
          ${isSpinning ? 'opacity-80 cursor-not-allowed' : 'hover:scale-110 active:shadow-inner'}`}
      >
        <span className="text-[10px] tracking-[0.2em] font-light text-yellow-300">SPIN</span>
        <span className="drop-shadow-lg">抽奖</span>
      </button>
    </div>
  );
};

export default LuckyWheel;
