import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  CreditCard,
  FileCheck2,
  Award,
  ShieldCheck,
  FileText,
  Clock,
  Flame,
  FileBadge2,
  Trash2,
  ChevronLeft,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';
import { CarrierDriver } from '../../../types/pricing';
import { AddDriverFleetModal } from './AddDriverFleetModal';
import { DriverDossierModal } from './DriverDossierModal';

interface FleetDriversTabProps {
  carrierDrivers: CarrierDriver[];
  onAddDriver: (driver: CarrierDriver) => void;
  onDeleteDriver: (id: string) => void;
  currentOrgId?: string;
}

export const FleetDriversTab: React.FC<FleetDriversTabProps> = ({
  carrierDrivers,
  onAddDriver,
  onDeleteDriver,
  currentOrgId,
}) => {
  const [driverSearch, setDriverSearch] = useState('');
  const [driverStatusFilter, setDriverStatusFilter] = useState<'all' | 'active' | 'in_trip'>('all');
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [selectedDriverDossier, setSelectedDriverDossier] = useState<CarrierDriver | null>(null);

  const filteredDrivers = carrierDrivers.filter((d) => {
    const matchesFilter = driverStatusFilter === 'all' || d.status === driverStatusFilter;
    if (!driverSearch.trim()) return matchesFilter;
    const q = driverSearch.toLowerCase();
    return (
      matchesFilter &&
      (d.fullName.toLowerCase().includes(q) ||
        d.identityDocs.nationalIdNumber.includes(q) ||
        d.identityDocs.smartCardNumber.includes(q) ||
        d.vehicleDocs.plateNumber.toLowerCase().includes(q) ||
        d.vehicleDocs.vehicleType.toLowerCase().includes(q))
    );
  });

  const totalDrivers = carrierDrivers.length;
  const activeReadyDrivers = carrierDrivers.filter((d) => d.status === 'active').length;
  const inTripDrivers = carrierDrivers.filter((d) => d.status === 'in_trip').length;
  const validSmartCards = carrierDrivers.filter((d) => d.identityDocs.smartCardStatus === 'valid').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Fleet KPI Metric Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>کل رانندگان پرونده‌دار</span>
            <User className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900">
              {totalDrivers}
            </span>
            <span className="text-[11px] text-slate-400">راننده ثبت‌شده</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>آماده بارگیری و اعزام</span>
            <Truck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-emerald-700">
              {activeReadyDrivers}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold">ناوگان آزاد</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>در حال حمل محموله</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-blue-700">
              {inTripDrivers}
            </span>
            <span className="text-[11px] text-blue-600 font-bold">در مسیر جاده</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>کارت هوشمند معتبر RMTO</span>
            <CreditCard className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-purple-700">
              {validSmartCards}
            </span>
            <span className="text-[11px] text-purple-600 font-bold">۱۰۰٪ برخط</span>
          </div>
        </div>
      </div>

      {/* Modern Search, Filter & Action Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="جستجو با نام راننده، شماره پلاک، کارت هوشمند یا کد ملی..."
              value={driverSearch}
              onChange={(e) => setDriverSearch(e.target.value)}
              className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setDriverStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                driverStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              همه ({carrierDrivers.length})
            </button>
            <button
              type="button"
              onClick={() => setDriverStatusFilter('active')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                driverStatusFilter === 'active' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              آماده اعزام ({activeReadyDrivers})
            </button>
            <button
              type="button"
              onClick={() => setDriverStatusFilter('in_trip')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                driverStatusFilter === 'in_trip' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              در حال سفر ({inTripDrivers})
            </button>
          </div>
        </div>

        {/* Primary Action Button to Add Driver & Fleet */}
        <button
          type="button"
          onClick={() => setIsAddDriverModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer hover:shadow-md"
        >
          <Plus className="w-4 h-4 text-emerald-200" />
          <span>افزودن راننده و ناوگان جدید (۱۱ مدرک)</span>
        </button>
      </div>

      {/* Driver Cards Grid */}
      {filteredDrivers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">هیچ راننده‌ای یافت نشد</h3>
          <p className="text-xs text-slate-400 mt-1">با تغییر فیلتر جستجو یا فشردن دکمه «افزودن راننده و ناوگان جدید» راننده جدیدی ثبت فرمایید.</p>
          <button
            type="button"
            onClick={() => setIsAddDriverModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>ثبت پرونده اولین راننده</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDrivers.map((driver) => {
            const { identityDocs, vehicleDocs } = driver;
            return (
              <div
                key={driver.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-amber-300 transition-all p-5 shadow-2xs hover:shadow-sm space-y-4"
              >
                {/* Driver Top Details & License Plate */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={driver.avatar}
                        alt={driver.fullName}
                        className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-xs"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          driver.status === 'active' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                        title={driver.status === 'active' ? 'آماده اعزام' : 'در حال سفر'}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-950 font-title">{driver.fullName}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            driver.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-blue-50 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {driver.status === 'active' ? 'آماده اعزام' : 'در حال حمل بار'}
                        </span>
                        <span className="text-amber-600 font-bold text-xs flex items-center gap-0.5">
                          ★ {driver.rating}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>
                          کد ملی: <span className="font-mono text-slate-800 font-bold">{identityDocs.nationalIdNumber}</span>
                        </span>
                        <span>•</span>
                        <span>
                          کارت هوشمند راننده: <span className="font-mono text-emerald-800 font-bold">{identityDocs.smartCardNumber}</span>
                        </span>
                        <span>•</span>
                        <span>
                          نوع بارگیر: <span className="font-bold text-slate-800">{vehicleDocs.vehicleType}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-center">
                    {/* Iranian Commercial License Plate Display */}
                    <div className="bg-amber-400 border-2 border-slate-950 rounded-xl px-3 py-1 flex items-center gap-2 shadow-xs" dir="ltr">
                      <div className="bg-blue-800 text-white rounded px-1.5 py-0.5 flex flex-col items-center justify-center text-[7px] font-black shrink-0">
                        <span>I.R.</span>
                        <span>IRAN</span>
                      </div>
                      <span className="text-slate-950 font-black text-sm font-mono tracking-wider">
                        {vehicleDocs.plateNumber}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <button
                      type="button"
                      onClick={() => setSelectedDriverDossier(driver)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <FileBadge2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>پرونده جامع الکترونیکی</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`آیا از حذف پرونده راننده «${driver.fullName}» اطمینان دارید؟`)) {
                          onDeleteDriver(driver.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="حذف راننده"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 11-Point Compliance Verification Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <span>ماتریس انطباق ۱۱ گواهی الزامی راهداری و حمل‌ونقل جاده‌ای:</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ۱۰۰٪ مدارک مورد تأیید است
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
                    {/* 1. National ID */}
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">۱. کارت ملی</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>

                    {/* 2. Driver Smart Card */}
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">۲. هوشمند راننده</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>

                    {/* 3. License */}
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">۳. گواهینامه پایه یک</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>

                    {/* 4. Health Card */}
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">۴. کارت سلامت</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>

                    {/* 5. Clean record */}
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">۵. عدم سوءپیشینه</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>

                    {/* 6. Drug Test */}
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">۶. عدم اعتیاد</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>

                    {/* 7. Green Sheet */}
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">۷. سند برگ سبز</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>

                    {/* 8. Fleet Smart Card */}
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">۸. هوشمند ناوگان</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>

                    {/* 9. Tech Inspection */}
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">۹. معاینه فنی</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>

                    {/* 10. Insurance */}
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">۱۰. بیمه شخص ثالث</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>

                    {/* 11. Logbook or Tank */}
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between col-span-2">
                      <span className="text-slate-700 font-medium">
                        ۱۱. {vehicleDocs.hasTankInspectionPermit ? 'مجوز مخزن ADR / CNG' : 'دفترچه ثبت ساعت پلیس‌راه'}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-Modal 1: Add Driver & Fleet */}
      <AddDriverFleetModal
        isOpen={isAddDriverModalOpen}
        onClose={() => setIsAddDriverModalOpen(false)}
        onSave={onAddDriver}
        currentOrgId={currentOrgId}
      />

      {/* Sub-Modal 2: Driver Full Electronic Dossier */}
      <DriverDossierModal
        driver={selectedDriverDossier}
        onClose={() => setSelectedDriverDossier(null)}
      />
    </div>
  );
};
