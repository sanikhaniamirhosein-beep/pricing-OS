import React from 'react';
import {
  Palette,
  FlaskConical,
  ShieldCheck,
  LineChart,
  Sliders,
} from 'lucide-react';

export interface WorkspaceTab {
  id: string;
  nameFa: string;
  nameEn: string;
  icon: React.ElementType;
  badge?: string;
  descriptionFa: string;
}

interface NavigationTabsProps {
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
}

export const WORKSPACES: WorkspaceTab[] = [
  {
    id: 'design',
    nameFa: '۱. استودیو طراحی تجاری',
    nameEn: 'Commercial Design Studio',
    icon: Palette,
    descriptionFa: 'تعریف خدمات، ماتریس کریدورها، قواعد اضافه کرایه، تخفیفات و قراردادها',
  },
  {
    id: 'validation',
    nameFa: '۲. آزمایشگاه اعتبارسنجی',
    nameEn: 'Validation Lab',
    icon: FlaskConical,
    badge: '۱۰,۰۰۰ بارنامه',
    descriptionFa: 'شبیه‌سازی اثر تغییرات تعرفه، بازپخش تاریخی و سنجش گاردریل سود',
  },
  {
    id: 'governance',
    nameFa: '۳. برج مراقبت و حاکمیت',
    nameEn: 'Control Tower',
    icon: ShieldCheck,
    badge: 'BR-012',
    descriptionFa: 'بسته‌های استراتژی (Strategy Packages)، تاییدات دوطرفه، انتشار و بازگشت آنی',
  },
  {
    id: 'intelligence',
    nameFa: '۴. مرکز هوشمندی و پایش',
    nameEn: 'Intelligence Hub',
    icon: LineChart,
    descriptionFa: 'داشبورد مدیریتی، ردگیری نشت تخفیف و هشدار پیش از تسویه مالی ناهنجاری‌ها',
  },
  {
    id: 'system',
    nameFa: '۵. کنسول سیستم و API',
    nameEn: 'System Console',
    icon: Sliders,
    descriptionFa: 'حاکمیت داده درون‌مرزی، کانکتورهای سوخت/عوارض، رجیستری مدل‌ها و سند API',
  },
];

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeWorkspaceId,
  onSelectWorkspace,
}) => {
  return (
    <nav className="bg-white border-b border-[#D3D1C7] sticky top-0 z-30 shadow-xs">
      <div className="max-w-[98%] 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {WORKSPACES.map((ws) => {
            const Icon = ws.icon;
            const isActive = activeWorkspaceId === ws.id;

            return (
              <button
                key={ws.id}
                type="button"
                onClick={() => onSelectWorkspace(ws.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#085041] text-white shadow-xs font-bold'
                    : 'text-[#5F5E5A] hover:text-[#2C2C2A] hover:bg-[#F1EFE8] border border-transparent'
                }`}
                title={ws.descriptionFa}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#0F6E56]'}`} />
                <span className="font-display tracking-tight">{ws.nameFa}</span>
                {ws.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                      isActive ? 'bg-[#04342C] text-white' : 'bg-[#E1F5EE] text-[#04342C] border border-[#9FE1CB]'
                    }`}
                  >
                    {ws.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
