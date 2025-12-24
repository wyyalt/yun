
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
      // Calculate which prize the pointer is at (pointer is at the top, 0 degrees or 270 degrees depending on offset)
      // The SVG is drawn starting from 0 (right). Pointer is at 270 (top).
      // Normalized degree relative to the start of segments
      const actualDegree = (totalNewRotation % 360);
      const segmentAngle = 360 / prizes.length;
      
      // The wheel rotates clockwise. The pointer is at 270deg (relative to 0 at 3 o'clock).
      // Prize index = floor((360 - (actualDegree + 90) % 360) / segmentAngle)
      const index = Math.floor(((360 - (actualDegree - 90)) % 360) / segmentAngle);
      const winningPrize = prizes[index % prizes.length];
      onSpinEnd(winningPrize);
    }, 4000); // 4s transition match
  };

  const renderSegments = () => {
    const angle = 360 / prizes.length;
    return prizes.map((prize, i) => {
      const startAngle = i * angle;
      const endAngle = (i + 1) * angle;
      
      // Calculate SVG path for the segment
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
            strokeWidth="0.5"
          />
          <text
            x="75"
            y="50"
            fill="white"
            fontSize="4"
            fontWeight="bold"
            transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
            className="select-none pointer-events-none"
            style={{ textAnchor: 'middle' }}
          >
            {prize.name.length > 15 ? prize.name.substring(0, 12) + '...' : prize.name}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="relative w-full max-w-md aspect-square mx-auto flex items-center justify-center group">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
           <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-yellow-600 absolute bottom-[-10px]"></div>
        </div>
      </div>

      {/* Outer Border */}
      <div className="absolute inset-0 rounded-full border-[12px] border-yellow-600 shadow-2xl z-10 pointer-events-none bg-transparent flex items-center justify-center">
        {/* Lights */}
        {Array.from({ length: 12 }).map((_, i) => (
           <div 
            key={i} 
            className={`absolute w-3 h-3 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse`}
            style={{
              transform: `rotate(${i * 30}deg) translateY(-210px)`,
              animationDelay: `${i * 0.1}s`
            }}
           />
        ))}
      </div>

      {/* Main Wheel */}
      <div 
        className="w-full h-full relative transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" ref={wheelRef}>
          {renderSegments()}
          {/* Inner Circle */}
          <circle cx="50" cy="50" r="4" fill="white" />
        </svg>
      </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning || prizes.length === 0}
        className={`absolute z-30 w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 border-4 border-yellow-400 text-white font-bold text-xl shadow-2xl transition-all transform active:scale-95 flex items-center justify-center
          ${isSpinning ? 'opacity-80 cursor-not-allowed' : 'hover:scale-110'}`}
      >
        {isSpinning ? '...' : 'SPIN'}
      </button>
    </div>
  );
};

export default LuckyWheel;
