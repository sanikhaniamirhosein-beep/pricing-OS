import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Search,
  ShieldCheck,
  Truck,
  Package,
  Layers,
  ArrowRight,
  ChevronLeft,
  X,
  CreditCard,
  MapPin,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePricing } from '../../store/PricingContext';
import { CARRIER_ORGANIZATIONS, SHIPPER_ORGANIZATIONS } from '../../data/mockOrganizationProfiles';

interface OrganizationSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPortal?: 'carrier' | 'shipper' | 'both';
}

export const OrganizationSwitcherModal: React.FC<OrganizationSwitcherModalProps> = ({
  isOpen,
  onClose,
  targetPortal = 'both',
}) => {
  const {
    currentCarrierOrgId,
    switchCarrierOrg,
    currentCarrierOrg,
    currentShipperOrgId,
    switchShipperOrg,
    currentShipperOrg,
    userPortalType,
  } = usePricing();

  const [activeTab, setActiveTab] = useState<'carrier' | 'shipper'>(
    targetPortal === 'shipper' || userPortalType === 'shipper' ? 'shipper' : 'carrier'
  );
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCarriers = (CARRIER_ORGANIZATIONS || []).filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.nameFa.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  const filteredShippers = (SHIPPER_ORGANIZATIONS || []).filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      s.nameFa.toLowerCase().includes(q) ||
      s.nameEn.toLowerCase().includes(q) ||
      s.industry.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
    );
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#085041] text-white flex items-center justify-center shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base font-title">
                  تفکیک و انتخاب سازمان سازمانی (Multi-Tenancy Isolation)
                </h3>
                <p className="text-xs text-slate-500">
                  ایزولاسیون کامل داده‌ها و شخصی‌سازی اطلاعات بر اساس سازمان فعال
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector & Search */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            {targetPortal === 'both' && (
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('carrier')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'carrier'
                      ? 'bg-white text-[#085041] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>سازمان‌های حمل‌ونقل و باربری ({CARRIER_ORGANIZATIONS.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('shipper')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'shipper'
                      ? 'bg-white text-amber-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>شرکت‌های صاحب بار و کارخانجات ({SHIPPER_ORGANIZATIONS.length})</span>
                </button>
              </div>
            )}

            <div className="relative">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'carrier'
                    ? 'جستجو در شرکت‌های حمل‌ونقل (نام، شهر، کد)...'
                    : 'جستجو در شرکت‌های صاحب بار (فولاد، پتروشیمی، میهن، کد)...'
                }
                className="w-full pr-10 pl-4 py-2.5 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-[#085041] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* List of Organizations */}
          <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
            {activeTab === 'carrier' ? (
              filteredCarriers.map((org) => {
                const isSelected = currentCarrierOrgId === org.id;
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => {
                      switchCarrierOrg(org.id);
                      onClose();
                    }}
                    className={`w-full text-right p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#E1F5EE] border-[#085041] shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {org.nameFa}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {org.code}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-[#085041] text-white px-2 py-0.5 rounded-full font-bold">
                            سازمان فعال
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {org.province} - {org.city}
                        </span>
                        <span>•</span>
                        <span>ناوگان: {org.fleetCount.toLocaleString('fa-IR')} کشنده</span>
                        <span>•</span>
                        <span>گردش ماهانه: {(org.financialSummary.monthlyTurnoverToman / 1000000000).toFixed(1)} میلیارد تومان</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isSelected ? (
                        <div className="w-8 h-8 rounded-full bg-[#085041] text-white flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="text-xs text-[#085041] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100">
                          <span>انتخاب</span>
                          <ChevronLeft className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              filteredShippers.map((org) => {
                const isSelected = currentShipperOrgId === org.id;
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => {
                      switchShipperOrg(org.id);
                      onClose();
                    }}
                    className={`w-full text-right p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {org.nameFa}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                          {org.code}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          سطح {org.tier}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-amber-700 text-white px-2 py-0.5 rounded-full font-bold">
                            سازمان فعال
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span>صنعت: {org.industry}</span>
                        <span>•</span>
                        <span>اعتبار: {(org.tierInfo.creditLimitRials / 10000000000).toFixed(1)} میلیارد تومان</span>
                        <span>•</span>
                        <span>تخفیف جاری: {org.tierInfo.currentDiscountPercent}٪</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isSelected ? (
                        <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="text-xs text-amber-700 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100">
                          <span>انتخاب</span>
                          <ChevronLeft className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Note */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>تمام بارنامه‌ها، اعتبارات و فاکتورها کاملاً بر اساس سازمان انتخابی ایزوله هستند.</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition-colors"
            >
              بستن
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
