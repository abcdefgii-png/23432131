import React from 'react';

const CardBack: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full bg-[#111] relative overflow-hidden border border-[#554e3d] ${className}`}>
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#050505]" />
        
        {/* Geometric Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-[#3d362a] rounded-full opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-[#3d362a] rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] border border-[#3d362a] rounded-full opacity-20"></div>

        {/* Dashed Cross */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-gradient-to-b from-transparent via-[#554e3d] to-transparent opacity-30"></div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#554e3d] to-transparent opacity-30"></div>

        {/* Diagonal Lines */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-[#3d362a] rotate-45 opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-[#3d362a] -rotate-45 opacity-20"></div>

        {/* Dots */}
        <div className="absolute top-4 left-4 w-1 h-1 bg-[#554e3d] rounded-full opacity-60"></div>
        <div className="absolute top-4 right-4 w-1 h-1 bg-[#554e3d] rounded-full opacity-60"></div>
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#554e3d] rounded-full opacity-60"></div>
        <div className="absolute bottom-4 right-4 w-1 h-1 bg-[#554e3d] rounded-full opacity-60"></div>
    </div>
  );
};

export default CardBack;