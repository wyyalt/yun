
import React, { useState, useRef } from 'react';
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
    const extraSpins = 10 + Math.floor(Math.random() * 5);
    const randomDegree = Math.floor(Math.random() * 360);
    const totalNewRotation = rotation + (extraSpins * 360) + randomDegree;
    
    setRotation(totalNewRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const segmentAngle = 360 / prizes.length;
      const normalizedRotation = totalNewRotation % 360;
      // Pointer is at 270 degrees
      const winningAngle = (270 - normalizedRotation + 360) % 360;
      const index = Math.floor(winningAngle / segmentAngle);
      const winningPrize = prizes[index % prizes.length];
      onSpinEnd(winningPrize);
    }, 4000);
  };

  const renderSegments = () => {
    if (prizes.length === 0) return null;
    const totalAngle = 360 / prizes.length;
    const gap = prizes.length > 8 ? 0.8 : 1.2; 
    const drawAngle = totalAngle - gap; 
    
    return prizes.map((prize, i) => {
      const startAngle = i * totalAngle + gap / 2;
      const endAngle = startAngle + drawAngle;
      
      const innerRadius = 8;
      const outerRadius = 54; // Balanced size
      
      const x1 = 50 + outerRadius * Math.cos((Math.PI * startAngle) / 180);
      const y1 = 50 + outerRadius * Math.sin((Math.PI * startAngle) / 180);
      const x2 = 50 + outerRadius * Math.cos((Math.PI * endAngle) / 180);
      const y2 = 50 + outerRadius * Math.sin((Math.PI * endAngle) / 180);

      const ix1 = 50 + innerRadius * Math.cos((Math.PI * startAngle) / 180);
      const iy1 = 50 + innerRadius * Math.sin((Math.PI * startAngle) / 180);
      const ix2 = 50 + innerRadius * Math.cos((Math.PI * endAngle) / 180);
      const iy2 = 50 + innerRadius * Math.sin((Math.PI * endAngle) / 180);

      const largeArcFlag = drawAngle > 180 ? 1 : 0;
      
      const midAngle = startAngle + drawAngle / 2;
      const textRadius = 36;

      return (
        <g key={prize.id}>
          <path
            d={`
              M ${ix1} ${iy1} 
              L ${x1} ${y1} 
              A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} 
              L ${ix2} ${iy2} 
              A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1} 
              Z
            `}
            fill={prize.color}
            stroke={prize.color}
            strokeWidth="2"
            strokeLinejoin="round"
            className="drop-shadow-lg"
          />
          <text
            fill="white"
            fontSize="4.2"
            fontWeight="bold"
            transform={`translate(50, 50) rotate(${midAngle}) translate(${textRadius}, 0) rotate(90)`}
            className="select-none pointer-events-none drop-shadow-md"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {prize.name}
          </text>
        </g>
      );
    });
  };

  const renderLights = () => {
    const lightCount = 20;
    const radius = 62; // Lights outside the wheel
    return Array.from({ length: lightCount }).map((_, i) => {
      const angle = (i * 360) / lightCount;
      const x = 50 + radius * Math.cos((Math.PI * angle) / 180);
      const y = 50 + radius * Math.sin((Math.PI * angle) / 180);
      
      return (
        <g key={i} className={isSpinning ? 'animate-rapid-flash' : ''} style={{ animationDelay: `${i * 0.1}s` }}>
          {/* Outer glow layer - explicitly no stroke */}
          <circle cx={x} cy={y} r="4" fill="rgba(255, 255, 255, 0.15)" stroke="none" />
          {/* Inner bright point - explicitly no stroke, pure white */}
          <circle
            cx={x}
            cy={y}
            r="1.5"
            fill="#ffffff"
            stroke="none"
          />
        </g>
      );
    });
  };

  return (
    <div className="relative w-full max-w-[320px] sm:max-w-lg aspect-square mx-auto flex items-center justify-center">
      
      {/* Pointer - Positioned to slightly overlap the wheel top */}
      <div className="absolute top-[-10px] sm:top-[-20px] left-1/2 -translate-x-1/2 z-40 scale-[0.8] sm:scale-110 pointer-events-none">
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-12 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
             <StarIcon size={24} className="text-yellow-900 fill-yellow-900/20" />
          </div>
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-white -mt-1 drop-shadow-xl"></div>
        </div>
      </div>

      {/* Wheel SVG */}
      <div className="w-full h-full">
        <svg viewBox="-20 -20 140 140" className="w-full h-full overflow-visible" ref={wheelRef}>
          <g>{renderLights()}</g>
          
          <g 
            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50px 50px' }} 
            className="transition-transform duration-[4000ms] cubic-bezier(0.1, 0, 0, 1)"
          >
            {renderSegments()}
          </g>
        </svg>
      </div>

      {/* Circular Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning || prizes.length === 0}
        className={`absolute z-30 w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-red-800 to-red-500 border-[6px] border-yellow-400 text-white font-black transition-all transform active:scale-90 flex flex-col items-center justify-center shadow-[0_15px_50px_rgba(220,38,38,0.5),inset_0_-4px_8px_rgba(0,0,0,0.3)]
          ${isSpinning ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105'}`}
      >
        <span className="text-[10px] sm:text-xs tracking-[0.2em] text-yellow-200 uppercase mb-1 opacity-80">Merry</span>
        <span className="text-2xl sm:text-4xl drop-shadow-lg">抽奖</span>
      </button>

      {/* Background glow */}
      <div className="absolute inset-0 rounded-full bg-yellow-400/5 blur-[60px] -z-10 pointer-events-none"></div>

    </div>
  );
};

const StarIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="3" strokeLinecap="round" 
    strokeLinejoin="round" className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default LuckyWheel;
