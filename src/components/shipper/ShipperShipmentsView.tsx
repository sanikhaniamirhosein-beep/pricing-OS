import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Search,
  Filter,
  FileText,
  Download,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  Radio,
  Eye,
  ChevronLeft,
  Calendar,
  Layers,
  ArrowUpDown,
  FileCheck,
  Shield,
} from 'lucide-react';
import { INITIAL_ACTIVE_LOADS, ShipperActiveLoad } from '../../data/mockShipperData';

interface ShipperShipmentsViewProps {
  initialSelectedShipment?: ShipperActiveLoad | null;
}

export const ShipperShipmentsView: React.FC<ShipperShipmentsViewProps> = ({
  initialSelectedShipment,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'live_map' | 'history' | 'edocs'>('active');
  const [selectedLoad, setSelectedLoad] = useState<ShipperActiveLoad>(
    initialSelectedShipment || INITIAL_ACTIVE_LOADS[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter loads
  const filteredLoads = INITIAL_ACTIVE_LOADS.filter((load) => {
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch =
      !q ||
      (load.billOfLadingNo || '').toLowerCase().includes(q) ||
      (load.trackingCode || '').toLowerCase().includes(q) ||
      (load.originCity || '').toLowerCase().includes(q) ||
      (load.destCity || '').toLowerCase().includes(q) ||
      (load.driverName || '').toLowerCase().includes(q);

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && load.status === statusFilter;
  });

  const getStatusBadge = (status: ShipperActiveLoad['status']) => {
    switch (status) {
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            در مسیر به سمت مقصد
          </span>
        );
      case 'loading':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            در حال بارگیری در مبدأ
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            تحویل داده شد (POD تایید شد)
          </span>
        );
      case 'pending_driver':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
            در انتظار اعزام ناوگان
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Sub Header Navigation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'active', label: 'بارهای فعال جاری', icon: Truck, count: INITIAL_ACTIVE_LOADS.filter(l => l.status !== 'delivered').length },
            { id: 'live_map', label: 'نقشه رهگیری زنده GPS', icon: Navigation },
            { id: 'history', label: 'تاریخچه سفارش‌ها', icon: Calendar },
            { id: 'edocs', label: 'اسناد الکترونیکی و POD', icon: FileCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Search inside shipments */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="جستجوی شماره بارنامه، راننده یا شهر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* VIEW 1: Active Loads Table */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">لیست محموله‌های فعال:</span>
                <span className="text-xs font-mono text-slate-400">({filteredLoads.length} مورد)</span>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">فیلتر وضعیت:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs p-1.5 text-slate-700 font-medium"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="in_transit">در حال حرکت</option>
                  <option value="loading">در حال بارگیری</option>
                  <option value="pending_driver">در انتظار ناوگان</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold">
                    <th className="p-3.5">شماره بارنامه / رهگیری</th>
                    <th className="p-3.5">مسیر (مبدأ ➔ مقصد)</th>
                    <th className="p-3.5">شرح کالا و وزن</th>
                    <th className="p-3.5">راننده و پلاک ناوگان</th>
                    <th className="p-3.5">وضعیت حمل</th>
                    <th className="p-3.5">پیشرفت مسیر</th>
                    <th className="p-3.5 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLoads.map((load) => (
                    <tr
                      key={load.id}
                      className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedLoad(load);
                        setActiveTab('live_map');
                      }}
                    >
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900">{load.billOfLadingNo}</div>
                        <div className="font-mono text-[11px] text-slate-400">{load.trackingCode}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">{load.originCity} ➔ {load.destCity}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{load.destHub}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-slate-800">{load.cargoType}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{load.weightTons} تن • {load.truckType}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">{load.driverName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{load.truckPlate}</div>
                      </td>
                      <td className="p-3.5">
                        {getStatusBadge(load.status)}
                      </td>
                      <td className="p-3.5">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>{load.progressPercent}%</span>
                            <span>{load.estimatedArrival.split(' - ')[1]}</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full transition-all"
                              style={{ width: `${load.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLoad(load);
                            setActiveTab('live_map');
                          }}
                          className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>رهگیری زنده</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Live Tracking GPS & Interactive Map Simulation */}
      {activeTab === 'live_map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Map Simulation Canvas (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden border border-slate-800 min-h-[420px] flex flex-col justify-between">
              {/* Top Map HUD */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-300 font-medium">گیرنده GPS ماهواره‌ای AVL</div>
                    <div className="text-sm font-bold text-white font-mono">{selectedLoad.billOfLadingNo} ({selectedLoad.driverName})</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    سیگنال برخط ماهواره‌ای
                  </span>
                </div>
              </div>

              {/* Graphical Route Simulation Vector Canvas */}
              <div className="my-8 px-6 relative">
                {/* Route Line */}
                <div className="relative h-3 bg-slate-700/80 rounded-full w-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 via-amber-400 to-amber-500 transition-all duration-700"
                    style={{ width: `${selectedLoad.progressPercent}%` }}
                  />
                </div>

                {/* Truck Marker */}
                <div
                  className="absolute -top-4 transition-all duration-700"
                  style={{ left: `calc(${selectedLoad.progressPercent}% - 20px)` }}
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-amber-500/30 animate-bounce">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>

                {/* Milestones / Checkpoints */}
                <div className="flex justify-between items-center text-xs pt-4 text-slate-300">
                  <div className="text-right">
                    <span className="block font-bold text-amber-400">{selectedLoad.originCity}</span>
                    <span className="text-[10px] text-slate-400 font-mono">خروج: {selectedLoad.departureTime.split(' - ')[1]}</span>
                  </div>

                  <div className="text-center bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-300 block">موقعیت فعلی:</span>
                    <span className="font-bold text-white text-xs">{selectedLoad.currentLocation}</span>
                  </div>

                  <div className="text-left">
                    <span className="block font-bold text-emerald-400">{selectedLoad.destCity}</span>
                    <span className="text-[10px] text-slate-400 font-mono">تخمین رسیدن: {selectedLoad.estimatedArrival.split(' - ')[1]}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Metrics HUD */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/90 p-3.5 rounded-xl border border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">سرعت لحظه‌ای:</span>
                  <strong className="font-bold font-mono text-amber-300">۷۸ کیلومتر بر ساعت</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">درصد پیمایش:</span>
                  <strong className="font-bold font-mono text-emerald-400">{selectedLoad.progressPercent}٪ تکمیل شده</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">پلاک کامیون:</span>
                  <strong className="font-bold font-mono text-white">{selectedLoad.truckPlate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">زمان تخمینی تحویل (ETA):</span>
                  <strong className="font-bold font-mono text-amber-300">{selectedLoad.estimatedArrival}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Driver Card & Shipment Deep Details (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Driver Profile */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">مشخصات ناوگان و راننده:</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  احراز هویت شده
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-lg">
                  {selectedLoad.driverName.substring(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm">{selectedLoad.driverName}</div>
                  <div className="text-slate-500 text-xs font-mono">{selectedLoad.truckPlate}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">نوع ناوگان:</span>
                  <span className="font-bold font-mono text-slate-800">{selectedLoad.truckType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">شماره تماس راننده:</span>
                  <span className="font-bold font-mono text-slate-800">{selectedLoad.driverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">بیمه باربری:</span>
                  <span className="font-bold text-emerald-700">بیمه دانا (سقف ۲.۸ میلیارد)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${selectedLoad.driverPhone}`}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>تماس مستقیم با راننده</span>
                </a>
              </div>
            </div>

            {/* Quick Switch Shipment */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-700 block">انتخاب سایر بارهای در حال تردد:</span>
              <div className="space-y-1.5">
                {INITIAL_ACTIVE_LOADS.map((load) => (
                  <button
                    key={load.id}
                    type="button"
                    onClick={() => setSelectedLoad(load)}
                    className={`w-full text-right p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                      selectedLoad.id === load.id
                        ? 'bg-amber-50 text-amber-950 border border-amber-300 font-bold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    <div>
                      <span className="block font-mono">{load.billOfLadingNo}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{load.originCity} ➔ {load.destCity}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {load.statusLabelFa}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Order History */}
      {activeTab === 'history' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">آرشیو و تاریخچه تمامی بارنامه‌ها</h3>
              <p className="text-xs text-slate-400">جستجو و فیلتر بارهای تحویل‌شده در ماه‌های گذشته</p>
            </div>
            <button
              type="button"
              onClick={() => alert('خروجی اکسل کامل گزارش بارنامه‌ها با موفقیت دانلود شد.')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>خروجی اکسل کامل (XLSX)</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {INITIAL_ACTIVE_LOADS.map((load) => (
              <div key={load.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-slate-900">{load.billOfLadingNo}</span>
                    <span className="text-slate-400">|</span>
                    <span className="font-bold text-slate-700">{load.originCity} به {load.destCity}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    کالا: {load.cargoType} ({load.weightTons} تن) • راننده: {load.driverName}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left font-mono">
                    <div className="font-bold text-slate-900">{(load.totalCostRials / 10).toLocaleString('fa-IR')} تومان</div>
                    <div className="text-[10px] text-slate-400">{load.departureTime.split(' - ')[0]}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`دانلود نسخه دیجیتال بارنامه ${load.billOfLadingNo}`)}
                    className="p-2 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-900 rounded-lg border border-slate-200 cursor-pointer"
                    title="دانلود بارنامه"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: e-Documents & Digital POD */}
      {activeTab === 'edocs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'بارنامه رسمی تمبردار الکترونیک',
              code: 'BL-1403-9941',
              cargo: 'شمش فولادی ۲۲.۵ تن',
              status: 'دارای بارکد QR معتبر راهداری',
              date: '۱۴۰۳/۰۶/۰۱',
            },
            {
              title: 'اثبات تحویل دیجیتال (POD امضاشده)',
              code: 'POD-882180',
              cargo: 'یراق‌آلات ساختمانی ۴.۸ تن',
              status: 'امضا و مهر دیجیتال انباردار مقصد ثبت شد',
              date: '۱۴۰۳/۰۵/۳۱',
            },
            {
              title: 'حواله خروج و توزین باسکول مبدأ',
              code: 'SCALE-55912',
              cargo: 'پلی‌اتیلن پتروشیمی ۱۶ تن',
              status: 'برگه رسمی باسکول ۶۰ تنی مبارکه',
              date: '۱۴۰۳/۰۶/۰۱',
            },
          ].map((doc, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">{doc.date}</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs">{doc.title}</h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{doc.code} • {doc.cargo}</p>
              </div>

              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-[10px] text-emerald-900 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{doc.status}</span>
              </div>

              <button
                type="button"
                onClick={() => alert(`دانلود سند دیجیتال ${doc.code}`)}
                className="w-full py-2 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود نسخه الکترونیکی PDF</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
