
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
    // 旋转圈数：基础 8 圈 + 随机偏移
    const extraSpins = 8 + Math.floor(Math.random() * 5);
    const randomDegree = Math.floor(Math.random() * 360);
    const totalNewRotation = rotation + (extraSpins * 360) + randomDegree;
    
    setRotation(totalNewRotation);

    setTimeout(() => {
      setIsSpinning(false);
      
      const segmentAngle = 360 / prizes.length;
      // 核心修正逻辑：
      // 1. 指针固定在 SVG 的 270 度位置（正上方）。
      // 2. 轮盘顺时针旋转 rotation 度。
      // 3. 旋转后，处于 270 度位置的原始角度是 (270 - (rotation % 360) + 360) % 360。
      const normalizedRotation = totalNewRotation % 360;
      const winningAngle = (270 - normalizedRotation + 360) % 360;
      
      // 找到该角度对应的奖品索引
      const index = Math.floor(winningAngle / segmentAngle);
      // 确保索引在有效范围内（处理精度导致的 360 度边界情况）
      const winningPrize = prizes[index % prizes.length];
      
      onSpinEnd(winningPrize);
    }, 4000);
  };

  const renderSegments = () => {
    if (prizes.length === 0) return null;
    const angle = 360 / prizes.length;
    return prizes.map((prize, i) => {
      const startAngle = i * angle;
      const endAngle = (i + 1) * angle;
      
      // 扇形路径：0度在右侧 (3点钟方向)，顺时针增加
      const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
      const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
      const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
      const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const midAngle = startAngle + angle / 2;
      const textRadius = 35; 

      return (
        <g key={prize.id}>
          <path
            d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
            fill={prize.color}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
          />
          <text
            fill="white"
            fontSize="3.8"
            fontWeight="bold"
            // 文字切向排列：旋转到中央角，外移，再自旋90度
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

  return (
    <div className="relative w-full max-w-md aspect-square mx-auto flex items-center justify-center">
      
      {/* 视觉指针 - 绝对定位在正上方 */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-40">
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
             <StarIcon size={24} className="text-yellow-800 fill-yellow-800" />
          </div>
          {/* 指针箭头尖端 */}
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-white -mt-1 drop-shadow-lg"></div>
        </div>
      </div>

      {/* 外部装饰灯光 */}
      <div className="absolute inset-0 rounded-full border-[12px] border-yellow-800/90 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
           <div 
            key={i} 
            className={`absolute w-2.5 h-2.5 rounded-full bg-yellow-100 shadow-[0_0_10px_#fff] transition-all duration-100 ${isSpinning ? 'animate-rapid-flash' : ''}`}
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${i * 30}deg) translateY(-205px) translateX(-50%)`,
              animationDelay: isSpinning ? `${i * 0.05}s` : '0s'
            }}
           />
        ))}
      </div>

      {/* 旋转容器 */}
      <div 
        className="w-full h-full relative transition-transform duration-[4000ms] cubic-bezier(0.2, 0, 0.25, 1)"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" ref={wheelRef}>
          {renderSegments()}
          {/* 轴心装饰 */}
          <circle cx="50" cy="50" r="6" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1" />
        </svg>
      </div>

      {/* 中心交互按钮 */}
      <button
        onClick={spin}
        disabled={isSpinning || prizes.length === 0}
        className={`absolute z-30 w-24 h-24 rounded-full bg-red-600 hover:bg-red-500 border-4 border-yellow-400 text-white font-bold transition-all transform active:scale-90 flex flex-col items-center justify-center shadow-2xl
          ${isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
      >
        <span className="text-[10px] tracking-widest text-yellow-200 uppercase font-light">Go!</span>
        <span className="text-xl">抽奖</span>
      </button>

    </div>
  );
};

const StarIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
    strokeLinejoin="round" className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default LuckyWheel;
