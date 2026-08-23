import React, { useState } from 'react';
import {
  Layers,
  Database,
  SlidersHorizontal,
  Compass,
  ShieldCheck,
  Percent,
  FileText,
  Truck,
  Sparkles,
} from 'lucide-react';
import { CatalogStudioView } from './CatalogStudioView';
import { PricingStudioView } from './PricingStudioView';
import { GeoZoneMatrixView } from './GeoZoneMatrixView';
import { EligibilityDiscountView } from './EligibilityDiscountView';
import { ContractStudioView } from './ContractStudioView';

interface CommercialDesignStudioViewProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
  onNavigateToValidation?: () => void;
}

export const CommercialDesignStudioView: React.FC<CommercialDesignStudioViewProps> = ({
  activeSubTab = 'catalog',
  onSubTabChange,
  onNavigateToValidation,
}) => {
  const [localTab, setLocalTab] = useState<string>('catalog');
  const currentTab = activeSubTab || localTab;

  const handleTabSelect = (tab: string) => {
    setLocalTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  const tabs = [
    { id: 'catalog', labelFa: 'کاتالوگ خدمات و محصولات', labelEn: 'Catalog Studio', icon: Database },
    { id: 'pricing', labelFa: 'استودیوی قیمت‌گذاری و بوم قانون', labelEn: 'Pricing Studio & Rules', icon: SlidersHorizontal },
    { id: 'matrix', labelFa: 'ماتریس چندبعدی و زون‌ها', labelEn: 'Multi-D Matrix & Zones', icon: Compass },
    { id: 'eligibility', labelFa: 'واجدشرایطی و محدودیت ناوگان', labelEn: 'Eligibility Studio', icon: ShieldCheck },
    { id: 'discounts', labelFa: 'استراتژی تخفیفات و بودجه', labelEn: 'Discount Studio', icon: Percent },
    { id: 'contracts', labelFa: 'قراردادهای سازمانی و مذاکره', labelEn: 'Contract Studio', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E1F5EE] border border-[#9FE1CB] flex items-center justify-center text-[#085041]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-[#2C2C2A] text-lg font-display">
                  استودیوی طراحی تجاری (Commercial Design Studio)
                </h1>
                <span className="bg-[#E1F5EE] text-[#04342C] border border-[#9FE1CB] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                  Workspace 1
                </span>
              </div>
              <p className="text-[#5F5E5A] mt-0.5 text-xs">
                مدیریت کاتالوگ خدمات، بوم قوانین تعرفه، ماتریس وزنی/فاصله‌ای، قواعد واجدشرایطی ناوگان، تخفیفات و قراردادهای سازمانی
              </p>
            </div>
          </div>
        </div>

        {/* Global Action */}
        <div className="flex items-center gap-2">
          {onNavigateToValidation && (
            <button
              type="button"
              onClick={onNavigateToValidation}
              className="px-4 py-2 bg-[#085041] hover:bg-[#04342C] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#9FE1CB]" />
              <span>ارسال به آزمایشگاه اعتبارسنجی</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Studio Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#D3D1C7] pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabSelect(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#085041] text-white shadow-xs font-bold'
                  : 'text-[#5F5E5A] bg-[#FAFAF8] hover:bg-[#F1EFE8] hover:text-[#2C2C2A] border border-[#D3D1C7]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#9FE1CB]' : 'text-[#888780]'}`} />
              <span>{tab.labelFa}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div>
        {currentTab === 'catalog' && <CatalogStudioView />}
        {currentTab === 'pricing' && <PricingStudioView onNavigateToValidation={onNavigateToValidation} />}
        {currentTab === 'matrix' && <GeoZoneMatrixView />}
        {currentTab === 'eligibility' && <EligibilityDiscountView />}
        {currentTab === 'discounts' && <EligibilityDiscountView />}
        {currentTab === 'contracts' && <ContractStudioView />}
      </div>
    </div>
  );
};
