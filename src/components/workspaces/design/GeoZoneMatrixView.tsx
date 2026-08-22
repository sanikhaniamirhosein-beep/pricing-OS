import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  Globe,
  Sliders,
  Plus,
  Edit3,
  Search,
  Check,
  AlertCircle,
  Mountain,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Layers,
  Building,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { GeoZone, RouteMatrixCell } from '../../../types/pricing';

export const GeoZoneMatrixView: React.FC = () => {
  const { geoZones, updateGeoZone, addGeoZone, routeMatrix, updateRouteMatrixCell } = usePricing();

  const [activeTab, setActiveTab] = useState<'matrix' | 'zones' | 'difficulty'>('matrix');
  const [matrixResolution, setMatrixResolution] = useState<'city' | 'zone' | 'postal'>('city');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [editingCell, setEditingCell] = useState<RouteMatrixCell | null>(null);

  // Filtered Matrix Cells
  const filteredCells = routeMatrix.filter((cell) => {
    const matchSearch =
      cell.originCity.includes(searchQuery) ||
      cell.destinationCity.includes(searchQuery) ||
      cell.vehicleType.includes(searchQuery);
    const matchVehicle = selectedVehicle === 'all' || cell.vehicleType === selectedVehicle;
    return matchSearch && matchVehicle;
  });

  const vehiclesList = Array.from(new Set(routeMatrix.map((c) => c.vehicleType)));

  const handleSaveCell = () => {
    if (!editingCell) return;
    updateRouteMatrixCell({
      ...editingCell,
      updatedAt: new Date().toISOString().split('T')[0],
      lastChangedBy: 'سارا رضایی (مدیر ارشد قیمت‌گذاری)',
    });
    setEditingCell(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۱.۲ مدیریت ماتریس جغرافیایی و زون‌بندی (Geo & Zone Matrix)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {routeMatrix.length} کریدور فعال
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {geoZones.length} زون لجستیکی
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                تعریف زون‌های بارگیری/تخلیه بنادر و گمرکات، ماتریس مبدأ-مقصد و اعمال ضرایب سختی مسیر و عوارض پایانه
              </p>
            </div>
          </div>

          {/* Sub Tab Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'matrix'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              ماتریس مبدأ-مقصد (OD Matrix)
            </button>
            <button
              onClick={() => setActiveTab('zones')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'zones'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              زون‌های جغرافیایی و بنادر ({geoZones.length})
            </button>
            <button
              onClick={() => setActiveTab('difficulty')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'difficulty'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mountain className="w-4 h-4" />
              ضرایب سختی و کوهستانی
            </button>
          </div>
        </div>

        {/* Filters and Resolution selector */}
        {activeTab === 'matrix' && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی شهر یا ناوگان..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>

              {/* Vehicle Filter */}
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">همه انواع ناوگان</option>
                {vehiclesList.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              {/* Resolution Switcher */}
              <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setMatrixResolution('city')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    matrixResolution === 'city'
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  شهر به شهر
                </button>
                <button
                  onClick={() => setMatrixResolution('zone')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    matrixResolution === 'zone'
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  زون به زون
                </button>
                <button
                  onClick={() => setMatrixResolution('postal')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    matrixResolution === 'postal'
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  کد پستی (۳ رقمی)
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              تعداد ردیف‌های منطبق: {filteredCells.length}
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: Origin-Destination Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">مبدأ بارگیری</th>
                  <th className="py-3.5 px-4">مقصد تخلیه</th>
                  <th className="py-3.5 px-4">نوع ناوگان</th>
                  <th className="py-3.5 px-4">مسافت جاده‌ای</th>
                  <th className="py-3.5 px-4">زمان سیر استاندارد</th>
                  <th className="py-3.5 px-4">کرایه پایه (تومان)</th>
                  <th className="py-3.5 px-4">نرخ به ازای هر کیلومتر</th>
                  <th className="py-3.5 px-4">آخرین بازنگری</th>
                  <th className="py-3.5 px-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredCells.map((cell, idx) => {
                  const perKmRate = Math.round(cell.baseRateToman / cell.distanceKm);
                  const isDiscounted = cell.oldRateToman && cell.oldRateToman > cell.baseRateToman;

                  return (
                    <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        {cell.originCity}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {cell.destinationCity}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                          {cell.vehicleType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {cell.distanceKm.toLocaleString('fa-IR')} km
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {cell.leadTimeHours} ساعت
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">
                            {cell.baseRateToman.toLocaleString('fa-IR')}
                          </span>
                          {cell.oldRateToman && (
                            <span className="font-mono text-[10px] text-slate-400 line-through">
                              {cell.oldRateToman.toLocaleString('fa-IR')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {perKmRate.toLocaleString('fa-IR')} ت/km
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500">
                        <div>{cell.updatedAt}</div>
                        <div className="text-[10px] text-slate-400">{cell.lastChangedBy}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setEditingCell(cell)}
                          className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition-colors"
                        >
                          ویرایش نرخ
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Geographical Zones & Ports */}
      {activeTab === 'zones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {geoZones.map((zone) => (
            <div
              key={zone.id}
              className="bg-white border border-slate-200 rounded-3xl p-5 hover:border-amber-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {zone.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-title mt-1.5">{zone.nameFa}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{zone.nameEn}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      zone.zoneType === 'port_terminal'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : zone.zoneType === 'border_customs'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : zone.zoneType === 'industrial_hub'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {zone.zoneType === 'port_terminal'
                      ? 'بندر و پایانه'
                      : zone.zoneType === 'border_customs'
                      ? 'مرز و گمرک'
                      : zone.zoneType === 'industrial_hub'
                      ? 'قطب صنعتی'
                      : 'محدوده شهری'}
                  </span>
                </div>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">استان / منطقه:</span>
                    <span className="font-bold text-slate-800">{zone.provinceFa}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">عوارض ورود پایانه:</span>
                    <span className="font-bold font-mono text-slate-800">
                      {zone.terminalEntryFeeToman.toLocaleString('fa-IR')} ت
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ضریب سختی زون:</span>
                    <span className="font-bold font-mono text-amber-800">
                      ×{zone.difficultyMultiplier.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">سورشارژ کوهستانی:</span>
                    <span className="font-bold font-mono text-slate-800">
                      +{zone.mountainousSurchargePercent}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">محدودیت طرح ترافیک:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      zone.trafficSchemeRestricted
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {zone.trafficSchemeRestricted ? 'دارد (تردد شبانه)' : 'ندارد (۲۴ ساعته)'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {zone.descriptionFa}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-400">
                  [{zone.centerCoordinates ? `${zone.centerCoordinates[0]}, ${zone.centerCoordinates[1]}` : zone.latitude ? `${zone.latitude}, ${zone.longitude}` : '۳۵.۶۸۹۲, ۵۱.۳۸۹۰'}]
                </span>
                <button
                  onClick={() => {
                    const newEntryFee = Number(
                      prompt('عوارض ورودی جدید پایانه را وارد کنید (تومان):', String(zone.terminalEntryFeeToman))
                    );
                    if (newEntryFee && !isNaN(newEntryFee)) {
                      updateGeoZone({ ...zone, terminalEntryFeeToman: newEntryFee });
                    }
                  }}
                  className="text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  ویرایش عوارض
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Route Difficulty & Mountainous Surcharges */}
      {activeTab === 'difficulty' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-title">
              تنظیمات ضرایب سختی مسیر، شرایط جوی و گردنه‌های کوهستانی
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              این ضرایب به عنوان سورشارژهای افزایشی روی کرایه پایه کریدورها جهت جبران استهلاک موتور، مصرف سوخت در سربالایی و ریسک یخ‌زدگی جاده اعمال می‌شوند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Mountain className="w-4 h-4 text-amber-600" />
                گردنه‌های کوهستانی برف‌گیر (+۱۲٪)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                مسیرهای شامل گردنه حیران، کوهین قزوین، کندوان، اسدآباد همدان و آواجیق بازرگان
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">ضریب افزایشی:</span>
                <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  +12.0%
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <MapPin className="w-4 h-4 text-emerald-600" />
                جاده‌های فرعی و مسیرهای خاکی (+۱۸٪)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                بارگیری از معادن دوردست، شهرک‌های صنعتی غیرهمجوار با بزرگراه و جاده‌های روستایی
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">ضریب افزایشی:</span>
                <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  +18.0%
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Clock className="w-4 h-4 text-blue-600" />
                ترافیک ورودی کلانشهرها و بنادر (+۸٪)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ترافیک باراندازهای تهران بزرگ، مبادی ورودی بندر امام خمینی و گمرک مرزی آستارا
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">ضریب افزایشی:</span>
                <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  +8.0%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Matrix Cell */}
      {editingCell && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-title">ویرایش نرخ کریدور حمل</h3>
              <span className="text-xs font-mono text-slate-400">
                {editingCell.originCity} ➔ {editingCell.destinationCity}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">نوع ناوگان</label>
                <input
                  type="text"
                  disabled
                  value={editingCell.vehicleType}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">مسافت (کیلومتر)</label>
                  <input
                    type="number"
                    value={editingCell.distanceKm}
                    onChange={(e) => setEditingCell({ ...editingCell, distanceKm: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">زمان سیر (ساعت)</label>
                  <input
                    type="number"
                    value={editingCell.leadTimeHours}
                    onChange={(e) => setEditingCell({ ...editingCell, leadTimeHours: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">کرایه پایه جدید (تومان)</label>
                <input
                  type="number"
                  step="500000"
                  value={editingCell.baseRateToman}
                  onChange={(e) =>
                    setEditingCell({
                      ...editingCell,
                      oldRateToman: editingCell.baseRateToman,
                      baseRateToman: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-bold font-mono focus:bg-white focus:outline-none focus:border-amber-500 text-amber-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setEditingCell(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveCell}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                بروزرسانی کریدور
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
