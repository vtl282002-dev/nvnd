import React from 'react';

// Character & Object SVG Graphics tailored for 3rd grade Brazilian STEM theme

export const PauloIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head & Skin */}
    <circle cx="50" cy="42" r="24" fill="#f6c89f" />
    {/* Cap (Brazilian yellow & green) */}
    <path d="M26 38 C28 20, 72 20, 74 38 Z" fill="#ffdf00" />
    <path d="M42 38 C55 38, 85 36, 88 43 C88 46, 68 45, 46 43 Z" fill="#009c3b" />
    <circle cx="50" cy="20" r="3" fill="#002776" />
    {/* Hair strands */}
    <path d="M26 36 Q30 46 32 48" stroke="#4a2e18" strokeWidth="4" strokeLinecap="round" />
    <path d="M72 36 Q68 45 66 48" stroke="#4a2e18" strokeWidth="4" strokeLinecap="round" />
    {/* Eyes */}
    <circle cx="42" cy="42" r="3.5" fill="#2d1d11" />
    <circle cx="43.5" cy="40.5" r="1.2" fill="#ffffff" />
    <circle cx="58" cy="42" r="3.5" fill="#2d1d11" />
    <circle cx="59.5" cy="40.5" r="1.2" fill="#ffffff" />
    {/* Cheeks */}
    <circle cx="36" cy="47" r="4" fill="#ff9999" opacity="0.6" />
    <circle cx="64" cy="47" r="4" fill="#ff9999" opacity="0.6" />
    {/* Smile */}
    <path d="M43 51 Q50 58 57 51" stroke="#a03020" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Shirt */}
    <path d="M28 72 C30 62, 70 62, 72 72 L76 96 C76 98, 24 98, 24 96 Z" fill="#ffcc00" />
    <path d="M44 65 L50 74 L56 65" stroke="#009c3b" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Backpack straps */}
    <path d="M34 66 L30 88" stroke="#002776" strokeWidth="4" strokeLinecap="round" />
    <path d="M66 66 L70 88" stroke="#002776" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const LucasIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head & Skin */}
    <circle cx="50" cy="42" r="23" fill="#ebaa7e" />
    {/* Wavy curly brown hair */}
    <circle cx="32" cy="28" r="9" fill="#2c1809" />
    <circle cx="45" cy="22" r="10" fill="#2c1809" />
    <circle cx="58" cy="22" r="10" fill="#2c1809" />
    <circle cx="68" cy="28" r="9" fill="#2c1809" />
    <circle cx="28" cy="38" r="7" fill="#2c1809" />
    <circle cx="72" cy="38" r="7" fill="#2c1809" />
    {/* Eyes */}
    <circle cx="42" cy="42" r="3.2" fill="#1b120c" />
    <circle cx="43" cy="41" r="1" fill="#fff" />
    <circle cx="58" cy="42" r="3.2" fill="#1b120c" />
    <circle cx="59" cy="41" r="1" fill="#fff" />
    {/* Cheeks */}
    <circle cx="36" cy="47" r="3.5" fill="#f87171" opacity="0.5" />
    <circle cx="64" cy="47" r="3.5" fill="#f87171" opacity="0.5" />
    {/* Big cheerful smile */}
    <path d="M42 50 Q50 59 58 50" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" fill="#fff" />
    {/* Blue Explorer T-Shirt */}
    <path d="M26 72 C30 60, 70 60, 74 72 L78 96 C78 98, 22 98, 22 96 Z" fill="#0284c7" />
    <circle cx="50" cy="78" r="7" fill="#38bdf8" />
    <path d="M50 74 L50 82 M46 78 L54 78" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ParentsIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Dad (Left) */}
    <g transform="translate(-10, 0)">
      <circle cx="42" cy="40" r="18" fill="#f6c89f" />
      {/* Short neat hair */}
      <path d="M26 36 C28 24, 56 24, 58 36 Z" fill="#332211" />
      {/* Glasses */}
      <circle cx="37" cy="40" r="4.5" stroke="#002776" strokeWidth="1.8" fill="none" />
      <circle cx="48" cy="40" r="4.5" stroke="#002776" strokeWidth="1.8" fill="none" />
      <line x1="41.5" y1="40" x2="43.5" y2="40" stroke="#002776" strokeWidth="1.8" />
      <path d="M38 48 Q42 52 46 48" stroke="#882211" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Engineer Shirt */}
      <path d="M22 66 C26 56, 58 56, 62 66 L64 96 L20 96 Z" fill="#009c3b" />
      {/* Alcântara badge */}
      <rect x="28" y="70" width="8" height="12" rx="1.5" fill="#ffffff" />
      <circle cx="32" cy="74" r="2" fill="#002776" />
    </g>
    {/* Mom (Right) */}
    <g transform="translate(18, 2)">
      <circle cx="45" cy="42" r="17" fill="#ebaa7e" />
      {/* Long dark hair */}
      <path d="M30 40 C30 24, 60 24, 60 40 L62 58 C62 58, 56 50, 45 50 C34 50, 28 58, 28 58 Z" fill="#241508" />
      {/* Eyes & Smile */}
      <circle cx="40" cy="42" r="2.5" fill="#1b120c" />
      <circle cx="50" cy="42" r="2.5" fill="#1b120c" />
      <path d="M41 49 Q45 54 49 49" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Aerospace Lab Coat */}
      <path d="M28 66 C32 58, 58 58, 62 66 L64 96 L26 96 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="46" y="72" width="7" height="10" rx="1" fill="#0284c7" />
    </g>
  </svg>
);

export const CapuacuFruit: React.FC<{ className?: string; broken?: boolean }> = ({
  className = 'w-16 h-16',
  broken = false,
}) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {broken ? (
      // Broken Capuaçu with white creamy pulp spilling
      <g>
        {/* Left shell half */}
        <path d="M22 62 C16 42, 28 28, 44 26 C40 38, 38 52, 40 68 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
        {/* Right shell half */}
        <path d="M78 62 C84 42, 72 28, 56 26 C60 38, 62 52, 60 68 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
        {/* Inner white pulp & seeds spilling out */}
        <ellipse cx="50" cy="56" rx="20" ry="16" fill="#fefce8" stroke="#fef08a" strokeWidth="2" />
        <ellipse cx="45" cy="52" rx="4" ry="5" fill="#451a03" />
        <ellipse cx="54" cy="58" rx="4" ry="5" fill="#451a03" />
        <ellipse cx="48" cy="62" rx="3.5" ry="4" fill="#451a03" />
        {/* Splat marks */}
        <path d="M30 76 Q50 86 70 76 Q62 90 50 86 Q38 90 30 76 Z" fill="#fefce8" opacity="0.9" />
        <text x="50" y="20" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="bold">
          BỊ VỠ!
        </text>
      </g>
    ) : (
      // Whole healthy ripe Capuaçu fruit
      <g>
        {/* Leaf & small branch */}
        <path d="M50 20 Q48 10 40 8 Q46 16 48 22" fill="#16a34a" />
        <path d="M48 20 Q54 12 62 14 Q56 20 50 22" fill="#22c55e" />
        {/* Oval pod body with velvety brown shell */}
        <ellipse cx="50" cy="54" rx="26" ry="32" fill="#854d0e" stroke="#713f12" strokeWidth="3" />
        {/* Shading & velvety texture highlights */}
        <path d="M35 34 C30 45, 30 65, 36 74" stroke="#a16207" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <ellipse cx="42" cy="46" rx="14" ry="20" fill="#a16207" opacity="0.3" />
        {/* Natural texture spots */}
        <circle cx="56" cy="44" r="1.5" fill="#451a03" opacity="0.6" />
        <circle cx="48" cy="62" r="1.8" fill="#451a03" opacity="0.6" />
        <circle cx="62" cy="58" r="1.5" fill="#451a03" opacity="0.6" />
      </g>
    )}
  </svg>
);

export const CapuacuTreeIcon: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Trunk */}
    <path d="M52 115 C52 85, 48 65, 54 50 C58 65, 64 85, 68 115 Z" fill="#78350f" />
    <path d="M54 58 Q40 46 32 48" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
    <path d="M62 55 Q76 42 88 46" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
    {/* Lush tropical foliage */}
    <circle cx="60" cy="38" r="28" fill="#15803d" />
    <circle cx="40" cy="44" r="22" fill="#16a34a" />
    <circle cx="80" cy="44" r="22" fill="#16a34a" />
    <circle cx="60" cy="26" r="22" fill="#22c55e" />
    {/* Hanging Capuaçu fruits */}
    <ellipse cx="44" cy="58" rx="6" ry="8" fill="#854d0e" stroke="#582d09" strokeWidth="1.2" />
    <line x1="44" y1="50" x2="44" y2="52" stroke="#582d09" strokeWidth="2" />
    <ellipse cx="76" cy="56" rx="6" ry="8" fill="#854d0e" stroke="#582d09" strokeWidth="1.2" />
    <line x1="76" y1="48" x2="76" y2="50" stroke="#582d09" strokeWidth="2" />
    <ellipse cx="60" cy="62" rx="7" ry="9" fill="#854d0e" stroke="#582d09" strokeWidth="1.2" />
  </svg>
);

export const AirplaneIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sleek airliner */}
    <g transform="rotate(-15 50 50)">
      {/* Main Fuselage */}
      <path d="M20 50 C20 45, 75 45, 85 49 C90 50, 90 52, 85 53 C75 57, 20 57, 20 50 Z" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" />
      {/* Cockpit window */}
      <path d="M80 47 Q84 49 80 51 Z" fill="#0284c7" />
      {/* Wings */}
      <path d="M46 50 L30 20 L40 20 L58 50 Z" fill="#0284c7" />
      <path d="M46 52 L30 82 L40 82 L58 52 Z" fill="#0369a1" />
      {/* Tail Fin */}
      <path d="M22 49 L12 28 L20 28 L28 49 Z" fill="#ffcc00" />
      {/* Cabin windows */}
      <circle cx="48" cy="49" r="1.5" fill="#0369a1" />
      <circle cx="54" cy="49" r="1.5" fill="#0369a1" />
      <circle cx="60" cy="49" r="1.5" fill="#0369a1" />
      <circle cx="66" cy="49" r="1.5" fill="#0369a1" />
      <circle cx="72" cy="49" r="1.5" fill="#0369a1" />
    </g>
  </svg>
);

export const RocketIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(-25 50 50)">
      {/* Exhaust Flame */}
      <path d="M45 74 Q50 96 55 74 Z" fill="#ef4444" />
      <path d="M47 74 Q50 88 53 74 Z" fill="#fbbf24" />
      {/* Fins */}
      <path d="M36 68 L24 76 L34 54 Z" fill="#dc2626" />
      <path d="M64 68 L76 76 L66 54 Z" fill="#dc2626" />
      {/* Rocket Body */}
      <path d="M36 50 C36 30, 48 10, 50 8 C52 10, 64 30, 64 50 L64 74 L36 74 Z" fill="#f8fafc" stroke="#002776" strokeWidth="2.5" />
      {/* Nose cone tip */}
      <path d="M42 24 C46 16, 50 8, 50 8 C50 8, 54 16, 58 24 Z" fill="#dc2626" />
      {/* Porthole */}
      <circle cx="50" cy="38" r="7" fill="#38bdf8" stroke="#002776" strokeWidth="2" />
      <circle cx="52" cy="36" r="2" fill="#ffffff" />
      {/* Brazil flag stripe accent */}
      <rect x="36" y="58" width="28" height="6" fill="#009c3b" />
      <polygon points="50,59 58,61 50,63 42,61" fill="#ffdf00" />
    </g>
  </svg>
);

export const SatelliteIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Central body */}
    <rect x="40" y="40" width="20" height="20" rx="3" fill="#cbd5e1" stroke="#334155" strokeWidth="2.5" />
    {/* Dish antenna */}
    <path d="M50 40 L50 24 M40 24 Q50 16 60 24 Z" stroke="#334155" strokeWidth="2.5" fill="#f1f5f9" />
    <circle cx="50" cy="18" r="2" fill="#ef4444" />
    {/* Solar panel left */}
    <rect x="8" y="44" width="28" height="12" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
    <line x1="17" y1="44" x2="17" y2="56" stroke="#e0f2fe" strokeWidth="1.5" />
    <line x1="26" y1="44" x2="26" y2="56" stroke="#e0f2fe" strokeWidth="1.5" />
    <line x1="8" y1="50" x2="36" y2="50" stroke="#e0f2fe" strokeWidth="1.5" />
    <line x1="36" y1="50" x2="40" y2="50" stroke="#334155" strokeWidth="3" />
    {/* Solar panel right */}
    <rect x="64" y="44" width="28" height="12" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
    <line x1="73" y1="44" x2="73" y2="56" stroke="#e0f2fe" strokeWidth="1.5" />
    <line x1="82" y1="44" x2="82" y2="56" stroke="#e0f2fe" strokeWidth="1.5" />
    <line x1="64" y1="50" x2="92" y2="50" stroke="#e0f2fe" strokeWidth="1.5" />
    <line x1="60" y1="50" x2="64" y2="50" stroke="#334155" strokeWidth="3" />
    {/* Signal waves */}
    <path d="M44 68 Q50 72 56 68" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M40 74 Q50 80 60 74" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const DroneIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Drone arms */}
    <line x1="24" y1="36" x2="76" y2="64" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
    <line x1="24" y1="64" x2="76" y2="36" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
    {/* Rotors */}
    <ellipse cx="24" cy="36" rx="14" ry="4" fill="#94a3b8" opacity="0.7" />
    <ellipse cx="76" cy="36" rx="14" ry="4" fill="#94a3b8" opacity="0.7" />
    <ellipse cx="24" cy="64" rx="14" ry="4" fill="#94a3b8" opacity="0.7" />
    <ellipse cx="76" cy="64" rx="14" ry="4" fill="#94a3b8" opacity="0.7" />
    {/* Rotor Hubs */}
    <circle cx="24" cy="36" r="3" fill="#0f172a" />
    <circle cx="76" cy="36" r="3" fill="#0f172a" />
    <circle cx="24" cy="64" r="3" fill="#0f172a" />
    <circle cx="76" cy="64" r="3" fill="#0f172a" />
    {/* Center Body & Camera */}
    <circle cx="50" cy="50" r="14" fill="#f8fafc" stroke="#009c3b" strokeWidth="3" />
    <circle cx="50" cy="50" r="6" fill="#0284c7" />
    <circle cx="52" cy="48" r="2" fill="#ffffff" />
  </svg>
);

export const ParachuteCanopyIcon: React.FC<{ className?: string; isBroken?: boolean }> = ({
  className = 'w-16 h-16',
  isBroken = false,
}) => (
  <svg viewBox="0 0 120 70" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {isBroken ? (
      // Broken ripped canopy
      <g>
        <path d="M15 55 C15 15, 105 15, 105 55 Q90 50 75 55 Q60 50 45 55 Q30 50 15 55 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2.5" />
        {/* Big holes and tears */}
        <path d="M40 30 Q50 38 45 46 Q35 40 40 30 Z" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
        <path d="M75 25 Q82 35 78 42 Q70 34 75 25 Z" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
        <text x="60" y="65" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="bold">
          BỊ RÁCH!
        </text>
      </g>
    ) : (
      // Full wide aerodynamic canopy (Brazil colors)
      <g>
        {/* Main curved dome */}
        <path d="M10 58 C10 10, 110 10, 110 58 C95 50, 85 54, 75 58 C65 50, 55 50, 45 58 C35 54, 25 50, 10 58 Z" fill="#009c3b" stroke="#065f46" strokeWidth="2.5" />
        {/* Brazilian yellow central lobe */}
        <path d="M38 56 C38 18, 82 18, 82 56 C74 52, 66 50, 60 56 C54 50, 46 52, 38 56 Z" fill="#ffdf00" />
        {/* Blue central peak stripe */}
        <path d="M50 54 C50 16, 70 16, 70 54 C65 51, 55 51, 50 54 Z" fill="#002776" />
        {/* Ventilation vent at top */}
        <ellipse cx="60" cy="18" rx="8" ry="3.5" fill="#f8fafc" stroke="#002776" strokeWidth="1.5" />
      </g>
    )}
  </svg>
);

export const ParachuteLinesIcon: React.FC<{ className?: string; isTangled?: boolean }> = ({
  className = 'w-16 h-16',
  isTangled = false,
}) => (
  <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {isTangled ? (
      // Tangled/Broken ropes
      <g stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
        <path d="M15 10 Q35 40 25 50 Q15 60 40 70" />
        <path d="M85 10 Q65 30 75 45 Q85 60 60 70" />
        <line x1="38" y1="10" x2="42" y2="35" strokeDasharray="3 3" />
        <text x="50" y="45" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="bold">
          DÂY ĐỨT!
        </text>
      </g>
    ) : (
      // Strong even cords meeting at cargo basket ring
      <g stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round">
        <line x1="12" y1="8" x2="46" y2="72" />
        <line x1="35" y1="10" x2="48" y2="72" />
        <line x1="65" y1="10" x2="52" y2="72" />
        <line x1="88" y1="8" x2="54" y2="72" />
        {/* Center connector ring */}
        <circle cx="50" cy="72" r="4" fill="#ffdf00" stroke="#0284c7" strokeWidth="2" />
      </g>
    )}
  </svg>
);

export const CargoBasketIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 70" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sturdy webbed holder basket for fruit */}
    <ellipse cx="50" cy="20" rx="30" ry="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="2.5" />
    <path d="M20 20 C20 55, 80 55, 80 20 Z" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2.5" />
    {/* Webbing straps */}
    <path d="M35 24 C35 48, 65 48, 65 24" stroke="#ca8a04" strokeWidth="2" fill="none" />
    <line x1="50" y1="10" x2="50" y2="52" stroke="#ca8a04" strokeWidth="2" />
    <line x1="28" y1="28" x2="72" y2="28" stroke="#ca8a04" strokeWidth="1.5" />
    <line x1="32" y1="40" x2="68" y2="40" stroke="#ca8a04" strokeWidth="1.5" />
    {/* Attachment clips */}
    <circle cx="28" cy="18" r="3" fill="#0284c7" />
    <circle cx="72" cy="18" r="3" fill="#0284c7" />
  </svg>
);

export const DistractorRock: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 52 L26 26 L54 20 L68 42 L58 64 L28 62 Z" fill="#64748b" stroke="#334155" strokeWidth="2.5" />
    <line x1="26" y1="26" x2="48" y2="46" stroke="#475569" strokeWidth="2" />
    <line x1="54" y1="20" x2="48" y2="46" stroke="#475569" strokeWidth="2" />
    <line x1="48" y1="46" x2="58" y2="64" stroke="#475569" strokeWidth="2" />
  </svg>
);

export const DistractorPinwheel: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="40" x2="40" y2="76" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
    <polygon points="40,40 40,16 54,28" fill="#ef4444" />
    <polygon points="40,40 64,40 52,54" fill="#3b82f6" />
    <polygon points="40,40 40,64 26,52" fill="#10b981" />
    <polygon points="40,40 16,40 28,26" fill="#f59e0b" />
    <circle cx="40" cy="40" r="4" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
  </svg>
);
