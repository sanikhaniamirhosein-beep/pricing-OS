import React, { useState } from 'react';
import {
  Grid,
  Search,
  Sliders,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Save,
  Download,
  Filter,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { RouteMatrixCell } from '../../../types/pricing';

export const MatrixEditorView: React.FC = () => {
  const { routeMatrix, updateRouteMatrixCell, userName } = usePricing();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [editingCellKey, setEditingCellKey] = useState<string | null>(null);
  const [tempRate, setTempRate] = useState<number>(0);
  const [showOnlyChanged, setShowOnlyChanged] = useState(false);

  const vehicleOptions = ['all', 'تریلی چادری', 'تریلر کفی', 'کشنده یخچال‌دار'];

  const filteredCells = routeMatrix.filter((cell) => {
    const s = (searchTerm || '').trim();
    const matchesSearch =
      !s ||
      (cell.originCity || '').includes(s) ||
      (cell.destinationCity || '').includes(s) ||
      (cell.vehicleType || '').includes(s);
    const matchesVehicle = selectedVehicle === 'all' || cell.vehicleType === selectedVehicle;
    const matchesChanged = !showOnlyChanged || (cell.oldRateToman && cell.oldRateToman !== cell.baseRateToman);
    return matchesSearch && matchesVehicle && matchesChanged;
  });

  const handleStartEdit = (cell: RouteMatrixCell) => {
    const key = `${cell.originCity}-${cell.destinationCity}:${cell.vehicleType}`;
    setEditingCellKey(key);
    setTempRate(cell.baseRateToman);
  };

  const handleSaveEdit = (cell: RouteMatrixCell) => {
    updateRouteMatrixCell({
      ...cell,
      baseRateToman: Number(tempRate),
    });
    setEditingCellKey(null);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
        <div>
          <h2 className="font-bold text-slate-900 text-base font-display flex items-center gap-2">
            <Grid className="w-5 h-5 text-amber-600" />
            ویرایشگر ماتریس چندبعدی کرایه و کریدورهای حمل (N-D Matrix Editor)
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            پوشش کامل مبادی و مقاصد، ردیابی تغییرات سلولی و کشف سلول‌های ناموجود (BR-025)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowOnlyChanged(!showOnlyChanged)}
            className={`px-4 py-2.5 rounded-xl border transition-all cursor-pointer font-semibold ${
              showOnlyChanged
                ? 'bg-amber-500 border-amber-500 text-white font-bold shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            فقط سلول‌های تغییریافته (Cell Diff)
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="جستجوی شهر مبدا، مقصد یا کریدور..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 font-medium">نوع ناوگان:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {vehicleOptions.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVehicle(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedVehicle === v
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {v === 'all' ? 'همه ناوگان' : v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold">
                <th className="p-4">کریدور مبدأ ➔ مقصد</th>
                <th className="p-4">نوع ناوگان</th>
                <th className="p-4">مسافت (کیلومتر)</th>
                <th className="p-4">زمان تخمینی سیر</th>
                <th className="p-4">نرخ پایه کرایه (تومان)</th>
                <th className="p-4">تغییر نسبت به نسخه قبل</th>
                <th className="p-4">آخرین ویرایشگر</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCells.map((cell) => {
                const key = `${cell.originCity}-${cell.destinationCity}:${cell.vehicleType}`;
                const isEditing = editingCellKey === key;
                const hasChanged = cell.oldRateToman && cell.oldRateToman !== cell.baseRateToman;
                const deltaPercent = hasChanged
                  ? (((cell.baseRateToman - cell.oldRateToman!) / cell.oldRateToman!) * 100).toFixed(1)
                  : '0';

                return (
                  <tr
                    key={key}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      hasChanged ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <span>{cell.originCity}</span>
                      <span className="text-slate-400 font-normal">➔</span>
                      <span>{cell.destinationCity}</span>
                    </td>
                    <td className="p-4 text-slate-700">
                      <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                        {cell.vehicleType}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-700">{cell.distanceKm.toLocaleString('fa-IR')} km</td>
                    <td className="p-4 text-slate-600">{cell.leadTimeHours} ساعت</td>
                    <td className="p-4 font-mono">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={tempRate}
                            onChange={(e) => setTempRate(Number(e.target.value))}
                            className="w-36 bg-white border border-amber-500 rounded-xl px-2.5 py-1.5 text-slate-900 text-xs font-mono focus:outline-none ring-2 ring-amber-500/20"
                          />
                          <span className="text-slate-500 text-xs">تومان</span>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-900 text-xs font-mono">
                          {cell.baseRateToman.toLocaleString('fa-IR')}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {hasChanged ? (
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <span className="text-slate-400 line-through">
                            {(cell.oldRateToman! / 1000000).toFixed(1)}م
                          </span>
                          <span className="text-slate-400">➔</span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            +{(Number(deltaPercent)).toLocaleString('fa-IR')}٪
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600 text-xs truncate max-w-[140px]">
                      {cell.lastChangedBy || 'مدیر تعرفه'}
                    </td>
                    <td className="p-4 text-center">
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(cell)}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs shadow-xs"
                        >
                          <Save className="w-4 h-4" />
                          ذخیره
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cell)}
                          className="p-2 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                          title="ویرایش نرخ سلول"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
