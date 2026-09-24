import React from 'react';

interface HospitalLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightMode?: boolean;
}

export const HospitalLogo: React.FC<HospitalLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  lightMode = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${sizeMap[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-700 p-2 shadow-sm text-white shrink-0`}
      >
        {/* Medical Cross & Healing Hands Icon */}
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-sm">
          {/* Subtle shield background outline */}
          <path
            d="M24 4L10 9V21C10 31.5 16 40.5 24 44C32 40.5 38 31.5 38 21V9L24 4Z"
            fill="currentColor"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Medical Cross */}
          <path
            d="M21 15H27V21H33V27H27V33H21V27H15V21H21V15Z"
            fill="#FFFFFF"
          />
          {/* Small Heart/Care icon center */}
          <circle cx="24" cy="24" r="2.5" fill="#059669" />
          {/* Rehabilitation Leaf/Sprout overlay */}
          <path
            d="M31 16C31 16 35 18 35 22C35 25 32 27 30 27"
            stroke="#A7F3D0"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={`font-bold tracking-tight leading-tight ${
              lightMode ? 'text-white' : 'text-slate-800'
            } text-base sm:text-lg`}
          >
            โรงพยาบาลกรงปินัง
          </span>
          <span
            className={`text-xs ${
              lightMode ? 'text-teal-100' : 'text-slate-500'
            } font-normal`}
          >
            กลุ่มงานจิตเวชและยาเสพติด
          </span>
        </div>
      )}
    </div>
  );
};
