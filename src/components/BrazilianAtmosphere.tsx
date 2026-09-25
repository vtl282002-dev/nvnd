import React, { memo } from 'react';

export const BrazilianAtmosphere: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#002776] via-[#0284c7] to-[#009c3b] flex flex-col items-center justify-between text-slate-800 select-none">
      {/* Background Graphic Elements - Hardware accelerated & static */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden will-change-transform transform-gpu">
        {/* Soft sky stars & space particles */}
        <div className="absolute top-2 left-10 w-2 h-2 rounded-full bg-white opacity-80 animate-pulse" />
        <div className="absolute top-8 right-32 w-1.5 h-1.5 rounded-full bg-yellow-200 opacity-90" />
        <div className="absolute top-16 left-1/4 w-1 h-1 rounded-full bg-white opacity-70" />
        <div className="absolute top-6 right-1/4 w-2 h-2 rounded-full bg-amber-200 opacity-60" />

        {/* Orbiting Satellite Trail in sky */}
        <svg className="absolute -top-10 left-10 w-[900px] h-[300px] opacity-25" viewBox="0 0 900 300">
          <path d="M 0 150 Q 450 -50 900 200" stroke="#ffdf00" strokeWidth="2" strokeDasharray="6 8" fill="none" />
        </svg>

        {/* Alcântara Space Center Launch Tower Silhouette in far background */}
        <svg
          className="absolute bottom-16 right-12 w-64 h-72 opacity-25"
          viewBox="0 0 200 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Launch Pad Lattice Gantry */}
          <line x1="80" y1="250" x2="80" y2="40" stroke="#f8fafc" strokeWidth="4" />
          <line x1="120" y1="250" x2="120" y2="40" stroke="#f8fafc" strokeWidth="4" />
          <line x1="80" y1="40" x2="120" y2="40" stroke="#f8fafc" strokeWidth="4" />
          <line x1="80" y1="80" x2="120" y2="80" stroke="#f8fafc" strokeWidth="3" />
          <line x1="80" y1="120" x2="120" y2="120" stroke="#f8fafc" strokeWidth="3" />
          <line x1="80" y1="160" x2="120" y2="160" stroke="#f8fafc" strokeWidth="3" />
          <line x1="80" y1="200" x2="120" y2="200" stroke="#f8fafc" strokeWidth="3" />
          {/* Diagonal lattice */}
          <line x1="80" y1="40" x2="120" y2="80" stroke="#f8fafc" strokeWidth="2" />
          <line x1="120" y1="40" x2="80" y2="80" stroke="#f8fafc" strokeWidth="2" />
          <line x1="80" y1="80" x2="120" y2="120" stroke="#f8fafc" strokeWidth="2" />
          <line x1="120" y1="80" x2="80" y2="120" stroke="#f8fafc" strokeWidth="2" />
          <line x1="80" y1="120" x2="120" y2="160" stroke="#f8fafc" strokeWidth="2" />
          <line x1="120" y1="120" x2="80" y2="160" stroke="#f8fafc" strokeWidth="2" />
          {/* Space Rocket on pad */}
          <path d="M96 230 L96 70 Q100 45 104 70 L104 230 Z" fill="#ffffff" />
          <polygon points="94,70 100,50 106,70" fill="#ef4444" />
          <circle cx="100" cy="90" r="2.5" fill="#002776" />
        </svg>

        {/* Tropical Hills & Rainforest Ground Layer */}
        <div className="absolute -bottom-6 -left-12 -right-12 h-36 bg-[#009c3b] rounded-t-[100%] opacity-90 shadow-2xl" />
        <div className="absolute -bottom-10 left-1/4 right-0 h-44 bg-[#065f46] rounded-t-[100%] opacity-70" />

        {/* Capuaçu Tree on left side */}
        <div className="absolute -bottom-4 left-6 pointer-events-none opacity-80 scale-110 origin-bottom-left hidden md:block">
          <svg viewBox="0 0 160 200" className="w-56 h-72" fill="none">
            {/* Trunk */}
            <path d="M70 200 C70 130, 60 100, 75 70 C80 100, 90 130, 95 200 Z" fill="#78350f" />
            <path d="M70 110 Q50 90 35 95" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
            <path d="M85 105 Q115 85 130 90" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
            {/* Foliage */}
            <circle cx="80" cy="55" r="42" fill="#15803d" />
            <circle cx="45" cy="65" r="34" fill="#16a34a" />
            <circle cx="115" cy="65" r="34" fill="#16a34a" />
            <circle cx="80" cy="35" r="32" fill="#22c55e" />
            {/* Hanging Capuaçu */}
            <ellipse cx="50" cy="95" rx="8" ry="12" fill="#854d0e" stroke="#582d09" strokeWidth="1.5" />
            <ellipse cx="110" cy="90" rx="8" ry="12" fill="#854d0e" stroke="#582d09" strokeWidth="1.5" />
            <ellipse cx="80" cy="100" rx="9" ry="13" fill="#854d0e" stroke="#582d09" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Primary Application Shell (16:9 responsive frame) */}
      <div className="relative z-10 w-full h-full max-w-[1600px] flex flex-col justify-between p-3 md:p-5">
        {children}
      </div>
    </div>
  );
});
