import React, { useState } from 'react';
import {
  Package,
  Truck,
  Plus,
  Trash2,
  AlertTriangle,
  Layers,
  ShieldAlert,
  CheckCircle2,
  Link as LinkIcon,
  Snowflake,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { LogisticsProduct, LogisticsService } from '../../../types/pricing';

export const CatalogStudioView: React.FC = () => {
  const { services, products } = usePricing();
  const [selectedProductId, setSelectedProductId] = useState<string>(products?.[0]?.productId || '');
  const [deprecateModalService, setDeprecateModalService] = useState<LogisticsService | null>(null);

  const activeProduct = products?.find((p) => p.productId === selectedProductId) || products?.[0];

  // BR-022: Deprecation guard check (find active products depending on service)
  const handleAttemptDeprecate = (service: LogisticsService) => {
    setDeprecateModalService(service);
  };

  const dependentProducts = deprecateModalService
    ? (products || []).filter(
        (p) =>
          p?.status === 'Active' &&
          ((p?.serviceComponents && p.serviceComponents.includes(deprecateModalService.serviceId)) ||
            (p?.mandatoryComponents && p.mandatoryComponents.includes(deprecateModalService.serviceId)))
      )
    : [];

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-slate-900 text-base font-display">کاتالوگ استودیو: خدمات و محصولات ترابری (Catalog Studio)</h2>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg font-mono text-xs font-bold">
              Services & Composition Graph
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-xs">
            تعریف خدمات پایه (حمل خطی، بارگیری، زنجیره سرد، بیمه)، ترکیب در محصولات حمل دربست (FTL) و گارد محافظ حذف (BR-022)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Products List & Service Composition */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base font-display flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-600" />
              محصولات تجاری حمل بار (Logistics Products):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((prod) => {
                const isSelected = selectedProductId === prod.productId;
                return (
                  <div
                    key={prod.productId}
                    onClick={() => setSelectedProductId(prod.productId)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-amber-50/40 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 font-bold">
                        {prod.displayId}@v{prod.version}
                      </span>
                      <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {prod.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{prod.nameFa}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed mb-3">{prod.descriptionFa}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                      <span>ناوگان: <strong className="text-slate-800 font-medium">{prod.vehicleType}</strong></span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">{prod.serviceComponents.length} جزو خدماتی</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Product Composition Graph View (BR-021) */}
            <div className="pt-5 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2 font-display">
                <LinkIcon className="w-4 h-4 text-sky-600" />
                نمودار ترکیب خدمات تشکیل‌دهنده محصول انتخابی ({activeProduct?.nameFa || 'محصول'}):
              </h4>

              <div className="space-y-3">
                {(activeProduct?.serviceComponents || []).map((srvId) => {
                  const srv = services?.find((s) => s.serviceId === srvId);
                  if (!srv) return null;
                  const isMandatory = (activeProduct?.mandatoryComponents || []).includes(srvId);

                  return (
                    <div
                      key={srvId}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`p-2.5 rounded-xl ${
                            isMandatory
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{srv.nameFa}</span>
                            <span className="text-xs font-mono bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">{srv.displayId}</span>
                          </div>
                          <span className="text-xs text-slate-500 mt-0.5 block">{srv.descriptionFa}</span>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                          isMandatory
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {isMandatory ? 'جزو اجباری (Mandatory)' : 'جزو اختیاری (Optional)'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Base Services List & Deprecation Guard */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base font-display flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600" />
              خدمات پایه ناوگان (Base Services):
            </h3>

            <div className="space-y-3">
              {services.map((srv) => (
                <div
                  key={srv.serviceId}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{srv.nameFa}</span>
                    <button
                      type="button"
                      onClick={() => handleAttemptDeprecate(srv)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="آزمون گارد محافظ حذف خدمت (BR-022)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{srv.descriptionFa}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                    <span className="font-mono text-slate-600">{srv.displayId}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{srv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deprecation Guard Modal (BR-022) */}
      {deprecateModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-2.5 text-rose-700 font-bold text-sm font-display">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>گارد محافظ وابستگی‌های خدمت (BR-022 Block Rule)</span>
            </div>

            <p className="text-slate-700 leading-relaxed">
              شما در حال بررسی از رده خارج کردن خدمت{' '}
              <strong className="text-slate-900">{deprecateModalService.nameFa}</strong> هستید.
            </p>

            {dependentProducts.length > 0 ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2.5 text-rose-900">
                <span className="font-bold block">
                  عملیات حذف مسدود گردید! ({dependentProducts.length} محصول فعال وابسته وجود دارد):
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-rose-800">
                  {dependentProducts.map((p) => (
                    <li key={p.productId}>
                      {p.nameFa} ({p.displayId})
                    </li>
                  ))}
                </ul>
                <span className="text-xs text-slate-600 block pt-1">
                  طبق قانون BR-022، ابتدا باید خدمت فوق از ترکیب محصولات فعال خارج یا جایگزین گردد.
                </span>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 font-semibold">
                هیچ محصول فعال مستقیمی به این خدمت وابسته نیست و امکان بازنشستگی آن وجود دارد.
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setDeprecateModalService(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
