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
  X,
  Cpu,
  Trash2,
  Download,
  Percent,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { GeoZone, RouteMatrixCell } from '../../../types/pricing';
import { ModernSelect } from '../../common/menus/ModernSelect';
import { VehiclePickerDropdown } from '../../common/menus/VehiclePickerDropdown';
import { CityPickerDropdown } from '../../common/menus/CityPickerDropdown';
import { SurfaceModeToggle, AdvancedConfigSummaryCard } from '../../common/SurfaceModeToggle';
import { useSurfaceMode } from '../../../hooks/useSurfaceMode';

export const GeoZoneMatrixView: React.FC = () => {
  const {
    geoZones,
    updateGeoZone,
    addGeoZone,
    routeMatrix,
    updateRouteMatrixCell,
    addRouteMatrixCell,
    deleteRouteMatrixCell,
    userName,
  } = usePricing();

  const surfaceMode = useSurfaceMode('geo_zone_matrix', 'simple');

  const [activeTab, setActiveTab] = useState<'matrix' | 'zones' | 'difficulty'>('matrix');
  const [matrixResolution, setMatrixResolution] = useState<'city' | 'zone' | 'postal'>('city');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [editingCell, setEditingCell] = useState<RouteMatrixCell | null>(null);
  const [editingGeoZone, setEditingGeoZone] = useState<GeoZone | null>(null);
  const [isAddCellOpen, setIsAddCellOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Cell State
  const [newOrigin, setNewOrigin] = useState('تهران');
  const [newDestination, setNewDestination] = useState('بندرعباس');
  const [newVehicle, setNewVehicle] = useState('تریلی چادری');
  const [newDistance, setNewDistance] = useState(1280);
  const [newHours, setNewHours] = useState(24);
  const [newBaseRate, setNewBaseRate] = useState(38500000);

  // Advanced Mode Batch Adjustment State
  const [batchPercent, setBatchPercent] = useState(5);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Matrix Cells
  const filteredCells = (routeMatrix || []).filter((cell) => {
    const matchSearch =
      cell?.originCity?.includes(searchQuery) ||
      cell?.destinationCity?.includes(searchQuery) ||
      cell?.vehicleType?.includes(searchQuery);
    const matchVehicle = selectedVehicle === 'all' || cell?.vehicleType === selectedVehicle;
    return matchSearch && matchVehicle;
  });

  const vehiclesList = Array.from(
    new Set((routeMatrix || []).map((c) => c?.vehicleType).filter(Boolean))
  );

  const handleSaveCell = () => {
    if (!editingCell) return;
    updateRouteMatrixCell({
      ...editingCell,
      updatedAt: new Date().toISOString().split('T')[0],
      lastChangedBy: userName || 'مدیر قیمت‌گذاری',
    });
    setEditingCell(null);
    showToast(`نرخ کریدور ${editingCell.originCity} به ${editingCell.destinationCity} به‌روزرسانی شد.`);
  };

  const handleCreateCell = () => {
    const cell: RouteMatrixCell = {
      originCity: newOrigin,
      destinationCity: newDestination,
      vehicleType: newVehicle,
      distanceKm: newDistance,
      leadTimeHours: newHours,
      baseRateToman: newBaseRate,
      updatedAt: new Date().toISOString().split('T')[0],
      lastChangedBy: userName || 'مدیر قیمت‌گذاری',
    };
    addRouteMatrixCell(cell);
    setIsAddCellOpen(false);
    showToast(`کریدور جدید ${newOrigin} به ${newDestination} با موفقیت ثبت شد.`);
  };

  const handleSaveGeoZone = () => {
    if (!editingGeoZone) return;
    updateGeoZone(editingGeoZone);
    setEditingGeoZone(null);
    showToast(`عوارض و مشخصات زون ${editingGeoZone.nameFa} ذخیره شد.`);
  };

  const handleBatchAdjust = (pct: number) => {
    filteredCells.forEach((c) => {
      const newRate = Math.round(c.baseRateToman * (1 + pct / 100));
      updateRouteMatrixCell({
        ...c,
        oldRateToman: c.baseRateToman,
        baseRateToman: newRate,
        updatedAt: new Date().toISOString().split('T')[0],
        lastChangedBy: userName || 'تعدیل دسته‌ای',
      });
    });
    showToast(`نرخ ${filteredCells.length} کریدور به میزان ${pct > 0 ? '+' : ''}${pct}٪ تعدیل گردید.`);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-amber-500/40 flex items-center gap-3 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium text-slate-100">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 font-display">
                  ماتریس جغرافیایی و تعرفه کریدورها (Geo & Tariff Matrix)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                  {routeMatrix.length} کریدور فعال
                </span>
              </div>
              <p className="text-slate-500 mt-1 text-xs">
                ماتریس چندبعدی مبدأ-مقصد، نرخ پایه هر کیلومتر و عوارض ورود به بنادر و پایانه‌ها
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Per-Surface Mode Toggle */}
            <SurfaceModeToggle
              surfaceId="geo_zone_matrix"
              surfaceTitleFa="ماتریس کریدورها"
              mode={surfaceMode.mode}
              onToggle={surfaceMode.toggleMode}
              onSetMode={surfaceMode.setMode}
            />

            {/* Sub Tab Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                ماتریس مبدأ-مقصد ({routeMatrix.length})
              </button>
              <button
                onClick={() => setActiveTab('zones')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'zones' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-4 h-4" />
                زون‌های بنادر ({geoZones.length})
              </button>
              <button
                onClick={() => setActiveTab('difficulty')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'difficulty' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mountain className="w-4 h-4" />
                ضرایب صعوبت و گردنه‌ها
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Add Button */}
        {activeTab === 'matrix' && (
          <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی شهر، مقصد یا ناوگان..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              {/* Vehicle Filter */}
              <div className="min-w-[170px]">
                <ModernSelect
                  id="geozone-vehicle-filter"
                  value={selectedVehicle}
                  onChange={setSelectedVehicle}
                  options={[
                    { value: 'all', label: 'همه انواع ناوگان', badge: 'همه' },
                    ...vehiclesList.map((v) => ({ value: v, label: v })),
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddCellOpen(true)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن کریدور جدید</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* READ-ONLY SUMMARY IF IN SIMPLE MODE */}
      {!surfaceMode.isAdvanced && activeTab === 'matrix' && (
        <AdvancedConfigSummaryCard
          surfaceTitleFa="ماتریس تعرفه پایه ناوگان"
          onSwitchToAdvanced={() => surfaceMode.setMode('advanced')}
          summaryItems={[
            { label: 'روش محاسبه مسافت', value: 'شبکه ماتریس خطوط جاده‌ای راهداری (GIS Distance)' },
            { label: 'تعداد کل کریدورها', value: `${routeMatrix.length} کریدور فعال جاده‌ای` },
            { label: 'اعمال شاخص فصلی و بار برگشت', value: 'پیکربندی تانسور در حالت پیشرفته' },
          ]}
        />
      )}

      {/* ADVANCED MODE BATCH ACTIONS PANEL */}
      {surfaceMode.isAdvanced && activeTab === 'matrix' && (
        <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-700 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
              <Cpu className="w-4 h-4" />
              <span>ابزار مهندسی ماتریس: تعدیل دسته‌ای کریدورها (Batch Rate Adjustment)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{filteredCells.length} ردیف در فیلتر جاری</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-300 text-xs">تعدیل نرخ پایه کریدورهای فیلترشده:</span>
            <div className="flex gap-1.5">
              {[+3, +5, +8, +10, -5].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleBatchAdjust(pct)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-mono font-bold border border-slate-700 cursor-pointer"
                >
                  {pct > 0 ? `+${pct}٪` : `${pct}٪`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
                  const perKmRate = Math.round(cell.baseRateToman / (cell.distanceKm || 1));

                  return (
                    <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        {cell.originCity}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{cell.destinationCity}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                          {cell.vehicleType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {cell.distanceKm.toLocaleString('fa-IR')} km
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{cell.leadTimeHours} ساعت</td>
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
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingCell(cell)}
                            className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            ویرایش نرخ
                          </button>
                          {surfaceMode.isAdvanced && (
                            <button
                              type="button"
                              onClick={() => {
                                deleteRouteMatrixCell(cell.originCity, cell.destinationCity, cell.vehicleType);
                                showToast(`کریدور ${cell.originCity} به ${cell.destinationCity} حذف شد.`);
                              }}
                              className="p-1 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer"
                              title="حذف کریدور"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
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
                    <h3 className="text-sm font-bold text-slate-900 font-display mt-1.5">{zone.nameFa}</h3>
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

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">{zone.descriptionFa}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-400">[{zone.provinceFa}]</span>
                <button
                  type="button"
                  onClick={() => setEditingGeoZone(zone)}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-700" />
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
            <h2 className="text-base font-bold text-slate-900 font-display">
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

      {/* Modal: Add New Corridor Cell */}
      {isAddCellOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-display">ثبت کریدور حمل جدید</h3>
              <button
                type="button"
                onClick={() => setIsAddCellOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-medium">شهر مبدأ:</label>
                <CityPickerDropdown value={newOrigin} onChange={setNewOrigin} label="مبدأ" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-medium">شهر مقصد:</label>
                <CityPickerDropdown value={newDestination} onChange={setNewDestination} label="مقصد" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-medium">نوع ناوگان:</label>
                <VehiclePickerDropdown value={newVehicle} onChange={setNewVehicle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-600 font-medium">مسافت (کیلومتر):</label>
                  <input
                    type="number"
                    value={newDistance}
                    onChange={(e) => setNewDistance(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-600 font-medium">زمان سیر (ساعت):</label>
                  <input
                    type="number"
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-medium">کرایه پایه مصوب (تومان):</label>
                <input
                  type="number"
                  step="500000"
                  value={newBaseRate}
                  onChange={(e) => setNewBaseRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-black text-amber-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddCellOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleCreateCell}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                افزودن به ماتریس
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Matrix Cell */}
      {editingCell && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-display">ویرایش نرخ کریدور حمل</h3>
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">زمان سیر (ساعت)</label>
                  <input
                    type="number"
                    value={editingCell.leadTimeHours}
                    onChange={(e) => setEditingCell({ ...editingCell, leadTimeHours: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500 font-mono font-bold"
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
                type="button"
                onClick={() => setEditingCell(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSaveCell}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                بروزرسانی کریدور
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Geo Zone */}
      {editingGeoZone && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-display text-sm">
                    ویرایش عوارض پایانه و تنظیمات زون لجستیکی
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {editingGeoZone.code} • {editingGeoZone.nameFa}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingGeoZone(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200">
                <label className="block font-bold text-amber-950 mb-1">
                  عوارض ورودی پایانه / بندر / اسکله (تومان)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="50000"
                    min="0"
                    value={editingGeoZone.terminalEntryFeeToman}
                    onChange={(e) =>
                      setEditingGeoZone({ ...editingGeoZone, terminalEntryFeeToman: Number(e.target.value) })
                    }
                    className="w-full bg-white border border-amber-400 rounded-xl p-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-xs text-amber-900 font-bold whitespace-nowrap">تومان</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">نام زون / پایانه</label>
                  <input
                    type="text"
                    value={editingGeoZone.nameFa}
                    onChange={(e) => setEditingGeoZone({ ...editingGeoZone, nameFa: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">استان مربوطه</label>
                  <input
                    type="text"
                    value={editingGeoZone.provinceFa}
                    onChange={(e) => setEditingGeoZone({ ...editingGeoZone, provinceFa: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <ModernSelect
                    id="geozone-edit-type"
                    value={editingGeoZone.zoneType}
                    onChange={(val) => setEditingGeoZone({ ...editingGeoZone, zoneType: val as any })}
                    label="نوع زون لجستیکی"
                    options={[
                      { value: 'metropolitan', label: 'کلان‌شهر / شهری', badge: 'شهری' },
                      { value: 'industrial_hub', label: 'شهرک و قطب صنعتی', badge: 'صنعتی' },
                      { value: 'port_terminal', label: 'بندر تجاری و اسکله', badge: 'بندری' },
                      { value: 'border_customs', label: 'گمرک و پایانه مرزی', badge: 'مرزی' },
                      { value: 'free_trade_zone', label: 'منطقه آزاد تجاری', badge: 'آزاد' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ضریب سختی دسترسی زون</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="3.0"
                    value={editingGeoZone.difficultyMultiplier}
                    onChange={(e) =>
                      setEditingGeoZone({ ...editingGeoZone, difficultyMultiplier: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">سورشارژ کوهستانی/اقلیمی (%)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="50"
                    value={editingGeoZone.mountainousSurchargePercent}
                    onChange={(e) =>
                      setEditingGeoZone({
                        ...editingGeoZone,
                        mountainousSurchargePercent: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={!!editingGeoZone.trafficSchemeRestricted}
                      onChange={(e) =>
                        setEditingGeoZone({ ...editingGeoZone, trafficSchemeRestricted: e.target.checked })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-[11px] font-medium text-slate-800">محدودیت طرح ترافیک / شبانه</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingGeoZone(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSaveGeoZone}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                ذخیره عوارض و ضرایب زون
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
