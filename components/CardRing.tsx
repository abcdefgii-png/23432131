import React, { useRef, useState, useEffect, useCallback } from 'react';
import CardBack from './CardBack';

interface CardRingProps {
  onSelect: (index: number) => void;
}

const TOTAL_CARDS = 12; // Visual cards in the ring
const RADIUS = 320; // Radius of the ring
const RADIUS_MOBILE = 160;

const CardRing: React.FC<CardRingProps> = ({ onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startRotation, setStartRotation] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef(0);
  const autoRotateSpeed = 0.05;

  // Handle Dragging
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setStartRotation(rotation);
    velocityRef.current = 0;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const delta = clientX - startX;
    // Adjust sensitivity
    const newRot = startRotation + delta * 0.5;
    setRotation(newRot);
    
    // Calculate velocity
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = delta / dt; // Simple velocity
    }
    lastTimeRef.current = now;
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Animation Loop (Inertia + Auto Rotate)
  const animate = useCallback(() => {
    if (!isDragging && selectedIndex === null) {
      // Decay velocity
      velocityRef.current *= 0.95;

      // Auto rotate if stopped
      if (Math.abs(velocityRef.current) < 0.01) {
        setRotation(r => r + autoRotateSpeed);
      } else {
        setRotation(r => r + velocityRef.current * 5);
      }
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isDragging, selectedIndex]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [animate]);

  // Touch Events
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  
  // Mouse Events
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);

  const handleCardClick = (index: number) => {
    if (isDragging || Math.abs(velocityRef.current) > 0.1) return; // Prevent click during drag
    setSelectedIndex(index);
    setTimeout(() => {
       onSelect(index);
    }, 800);
  };

  return (
    <div 
      className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={handleEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
        {/* The 3D Scene Container */}
        <div className="scene-3d w-full h-full flex items-center justify-center">
            {/* The Ring: Tilted backward */}
            <div 
                className="relative w-0 h-0"
                style={{
                    transform: `rotateX(65deg) rotateZ(${rotation}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: isDragging ? 'none' : 'transform 0.1s linear'
                }}
            >
                {/* Center Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#8a7f6b]/20 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-[#8a7f6b]/10 border-dashed pointer-events-none"></div>

                {Array.from({ length: TOTAL_CARDS }).map((_, i) => {
                    const angleStep = 360 / TOTAL_CARDS;
                    const angle = i * angleStep;
                    // We need to fix the card orientation so they stand up.
                    // If the ring is rotated X 60deg, the cards need rotate X -90deg relative to ring?
                    // "Void Deck" style usually means they radiate out flat or stand up facing center.
                    // Let's make them stand up facing outward.
                    
                    const isHovered = hoverIndex === i;
                    const isSelected = selectedIndex === i;
                    const isOthersFade = selectedIndex !== null && !isSelected;

                    return (
                        <div
                            key={i}
                            className={`absolute top-0 left-0 w-[140px] h-[220px] md:w-[160px] md:h-[260px] origin-center transition-all duration-500 ease-out`}
                            style={{
                                transform: `
                                    rotateZ(${angle}deg) 
                                    translateY(-${typeof window !== 'undefined' && window.innerWidth < 768 ? RADIUS_MOBILE : RADIUS}px) 
                                    rotateX(-90deg)
                                    ${isHovered && !selectedIndex ? 'translateZ(30px) scale(1.05)' : ''}
                                    ${isSelected ? 'translateZ(200px) scale(1.2)' : ''}
                                `,
                                transformStyle: 'preserve-3d',
                                opacity: isOthersFade ? 0 : 1,
                                zIndex: isSelected ? 50 : 1
                            }}
                            onMouseEnter={() => setHoverIndex(i)}
                            onMouseLeave={() => setHoverIndex(null)}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(i);
                            }}
                        >
                            <div className={`w-full h-full shadow-2xl transition-all duration-500 ${isHovered ? 'shadow-yellow-900/40 border-yellow-900/50' : ''}`}>
                                <CardBack className={isHovered ? 'border-yellow-700/60' : ''} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
        
        {/* Center Instructions */}
        <div className={`absolute pointer-events-none transition-opacity duration-1000 ${selectedIndex !== null ? 'opacity-0' : 'opacity-60'}`}>
             <div className="w-32 h-32 rounded-full border border-[#8a7f6b]/30 flex items-center justify-center animate-pulse">
                <span className="text-[10px] tracking-[0.2em] text-[#8a7f6b]">请选择</span>
             </div>
        </div>
    </div>
  );
};

export default CardRing;