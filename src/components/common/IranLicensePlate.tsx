import React from 'react';

export interface IranLicensePlateProps {
  /** Raw plate string e.g. "۶۲ ع ۸۹۱ - ایران ۱۳" or "68 ع 941 ایران 43" */
  plateString?: string;
  /** Explicit segments if available */
  part1?: string;
  letter?: string;
  part2?: string;
  iranCode?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Color theme: commercial (yellow), transit/gov (red/blue), standard (white) */
  theme?: 'commercial' | 'standard' | 'minimal';
  /** Extra class names */
  className?: string;
  /** Show subtle interactive shadow/hover */
  interactive?: boolean;
}

// Convert English numbers to Persian digits for authentic visual appearance
const toPersianDigits = (str: string | number = ''): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, (d) => persianDigits[parseInt(d, 10)]);
};

// Clean and extract plate parts from various string formats
export function parseIranPlate(plateStr: string = ''): {
  part1: string;
  letter: string;
  part2: string;
  iranCode: string;
  isCustomText?: boolean;
} {
  if (!plateStr || typeof plateStr !== 'string') {
    return { part1: '۱۲', letter: 'ع', part2: '۳۴۵', iranCode: '۱۱' };
  }

  const clean = plateStr.trim();

  // If text is not a real plate (e.g. "ناوگان سراسری معتبر" or "در حال صدور")
  if (
    clean.includes('تخصیص') ||
    clean.includes('درحال') ||
    clean.includes('در حال') ||
    clean.includes('سراسری') ||
    clean.includes('پس از') ||
    clean.length > 28
  ) {
    return {
      part1: '',
      letter: '',
      part2: '',
      iranCode: '',
      isCustomText: true,
    };
  }

  // Regex for formats like: "۶۲ ع ۸۹۱ - ایران ۱۳" or "68 ع 941 ایران 43" or "21 ب 456 - 11"
  // Group 1: 2 digits, Group 2: letter, Group 3: 3 digits, Group 4: 2 digits
  const regex = /([0-9۰-۹]{2})\s*([الف-یA-Za-z]|[^\s0-9۰-۹\-_])\s*([0-9۰-۹]{3})\s*(?:-|ایران|\s)*\s*(?:ایران)?\s*([0-9۰-۹]{2})/;
  const match = clean.match(regex);

  if (match) {
    return {
      part1: toPersianDigits(match[1]),
      letter: match[2],
      part2: toPersianDigits(match[3]),
      iranCode: toPersianDigits(match[4]),
    };
  }

  // Alternative fallback regex for numbers split by spaces
  const tokens = clean.split(/[\s\-_\/]+/).filter(Boolean);
  if (tokens.length >= 3) {
    const p1 = tokens.find((t) => /^[0-9۰-۹]{2}$/.test(t)) || tokens[0] || '۱۲';
    const pl = tokens.find((t) => !/^[0-9۰-۹]+$/.test(t) && t !== 'ایران') || 'ع';
    const p2 = tokens.find((t) => /^[0-9۰-۹]{3}$/.test(t)) || '۳۴۵';
    const ic = tokens.find((t) => /^[0-9۰-۹]{2}$/.test(t) && t !== p1) || '۱۱';

    return {
      part1: toPersianDigits(p1),
      letter: pl,
      part2: toPersianDigits(p2),
      iranCode: toPersianDigits(ic),
    };
  }

  return {
    part1: '۶۲',
    letter: 'ع',
    part2: '۸۹۱',
    iranCode: '۱۳',
  };
}

export const IranLicensePlate: React.FC<IranLicensePlateProps> = ({
  plateString,
  part1: propPart1,
  letter: propLetter,
  part2: propPart2,
  iranCode: propIranCode,
  size = 'md',
  theme = 'commercial',
  className = '',
  interactive = false,
}) => {
  // Determine parts
  const parsed = parseIranPlate(plateString);
  const part1 = toPersianDigits(propPart1 ?? parsed.part1);
  const letter = propLetter ?? parsed.letter;
  const part2 = toPersianDigits(propPart2 ?? parsed.part2);
  const iranCode = toPersianDigits(propIranCode ?? parsed.iranCode);

  if (parsed.isCustomText && plateString) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs font-bold ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span>{plateString}</span>
      </div>
    );
  }

  // Size styling maps
  const sizeStyles = {
    xs: {
      container: 'h-6 px-1 text-[11px] gap-1 rounded-md border',
      blueStrip: 'w-3.5 h-full px-0.5 text-[5px]',
      flag: 'h-1.5 w-2.5',
      letterBox: 'text-[11px] min-w-3',
      digits: 'text-[11px] tracking-tight font-black',
      iranBox: 'pl-1 pr-0.5 text-[9px]',
      iranLabel: 'text-[6px]',
    },
    sm: {
      container: 'h-7.5 px-1.5 text-xs gap-1.5 rounded-lg border-[1.5px]',
      blueStrip: 'w-4.5 h-full px-0.5 text-[6px]',
      flag: 'h-2 w-3',
      letterBox: 'text-xs min-w-4 px-0.5',
      digits: 'text-xs tracking-tight font-black',
      iranBox: 'pl-1.5 pr-1 text-[10px]',
      iranLabel: 'text-[7px]',
    },
    md: {
      container: 'h-9 px-2 text-sm gap-2 rounded-xl border-2',
      blueStrip: 'w-6 h-full px-1 text-[7px]',
      flag: 'h-2.5 w-4',
      letterBox: 'text-sm min-w-5 px-1',
      digits: 'text-sm tracking-normal font-black',
      iranBox: 'pl-2 pr-1.5 text-xs',
      iranLabel: 'text-[8px]',
    },
    lg: {
      container: 'h-12 px-3 text-base sm:text-lg gap-2.5 sm:gap-3 rounded-2xl border-2',
      blueStrip: 'w-8 h-full px-1.5 text-[8px]',
      flag: 'h-3 w-5',
      letterBox: 'text-base sm:text-lg min-w-6 px-1.5',
      digits: 'text-base sm:text-lg tracking-wide font-black',
      iranBox: 'pl-2.5 sm:pl-3 pr-2 text-sm sm:text-base',
      iranLabel: 'text-[9px] sm:text-[10px]',
    },
  }[size];

  // Theme styling maps
  const themeStyles = {
    commercial: {
      bg: 'bg-amber-400',
      border: 'border-slate-950',
      text: 'text-slate-950',
      divider: 'border-slate-950/70',
      letterBg: 'bg-amber-500/80 text-slate-950 border border-slate-950/20',
      shadow: 'shadow-xs shadow-amber-500/20',
    },
    standard: {
      bg: 'bg-white',
      border: 'border-slate-800',
      text: 'text-slate-900',
      divider: 'border-slate-400',
      letterBg: 'bg-slate-100 text-slate-900 border border-slate-300',
      shadow: 'shadow-xs',
    },
    minimal: {
      bg: 'bg-amber-50',
      border: 'border-amber-400',
      text: 'text-amber-950',
      divider: 'border-amber-300',
      letterBg: 'bg-amber-200/70 text-amber-950 border border-amber-300',
      shadow: 'shadow-2xs',
    },
  }[theme];

  return (
    <div
      dir="ltr"
      className={`inline-flex items-center select-none shrink-0 font-mono transition-all duration-150 ${themeStyles.bg} ${themeStyles.border} ${themeStyles.text} ${themeStyles.shadow} ${sizeStyles.container} ${interactive ? 'hover:scale-[1.02] hover:shadow-md cursor-default' : ''} ${className}`}
      title={`پلاک انتظامی: ${part1} ${letter} ${part2} - ایران ${iranCode}`}
    >
      {/* 1. Left Authentic Blue Flag Strip */}
      <div
        className={`bg-[#003399] text-white flex flex-col items-center justify-between py-0.5 rounded-xs shrink-0 font-sans font-bold select-none ${sizeStyles.blueStrip}`}
      >
        {/* Iranian Mini Flag representation */}
        <div className={`flex flex-col overflow-hidden rounded-[1px] border border-white/30 ${sizeStyles.flag}`}>
          <div className="bg-[#228844] flex-1" />
          <div className="bg-white flex-1 flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-red-600" />
          </div>
          <div className="bg-[#da0000] flex-1" />
        </div>

        <div className="flex flex-col items-center leading-none tracking-tighter uppercase font-mono">
          <span className="scale-[0.85]">I.R.</span>
          <span>IRAN</span>
        </div>
      </div>

      {/* 2. Main Middle Plate Content: [Part1] [Letter] [Part2] */}
      <div className="flex items-center gap-1 sm:gap-1.5 font-bold font-mono">
        {/* First 2 digits */}
        <span className={`font-mono text-center ${sizeStyles.digits}`}>{part1}</span>

        {/* Letter Glyph (like 'ع' with neat rounded pill) */}
        <span
          className={`font-sans font-black flex items-center justify-center rounded-md ${themeStyles.letterBg} ${sizeStyles.letterBox}`}
        >
          {letter}
        </span>

        {/* Next 3 digits */}
        <span className={`font-mono text-center ${sizeStyles.digits}`}>{part2}</span>
      </div>

      {/* 3. Right City Code Box: [ایران] + [Code] */}
      <div
        className={`border-l flex flex-col items-center justify-center leading-tight font-mono shrink-0 ${themeStyles.divider} ${sizeStyles.iranBox}`}
      >
        <span className={`font-sans font-bold leading-none ${sizeStyles.iranLabel}`}>ایران</span>
        <span className={`font-mono font-black ${sizeStyles.digits}`}>{iranCode}</span>
      </div>
    </div>
  );
};

export default IranLicensePlate;
