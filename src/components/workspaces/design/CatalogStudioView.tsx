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
  X,
  FileCheck,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { LogisticsProduct, LogisticsService } from '../../../types/pricing';

export const CatalogStudioView: React.FC = () => {
  const { services, products, addService, addProduct } = usePricing();
  const [selectedProductId, setSelectedProductId] = useState<string>(products?.[0]?.productId || '');
  const [deprecateModalService, setDeprecateModalService] = useState<LogisticsService | null>(null);

  // Modals for creating new Service or Product
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

  // New Service Form State
  const [serviceForm, setServiceForm] = useState({
    displayId: '',
    nameFa: '',
    nameEn: '',
    category: 'core_transport' as LogisticsService['category'],
    descriptionFa: '',
  });

  // New Product Form State
  const [productForm, setProductForm] = useState({
    displayId: '',
    nameFa: '',
    nameEn: '',
    descriptionFa: '',
    vehicleType: 'تریلی چادری',
    serviceComponents: [] as string[],
    mandatoryComponents: [] as string[],
    optionalComponents: [] as string[],
    channelAvailability: ['Web Portal', 'TMS API'],
  });

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

  const handleCreateServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.nameFa.trim()) return;
    const generatedDisplayId = serviceForm.displayId.trim() || `SRV-${Math.floor(100 + Math.random() * 900)}`;
    const newService: LogisticsService = {
      serviceId: `srv-${Date.now()}`,
      displayId: generatedDisplayId,
      nameFa: serviceForm.nameFa,
      nameEn: serviceForm.nameEn || generatedDisplayId,
      category: serviceForm.category,
      descriptionFa: serviceForm.descriptionFa || 'خدمت حمل‌ونقل جاده‌ای و ناوگان کشوری',
      version: 1,
      status: 'Active',
    };
    addService(newService);
    setIsCreateServiceOpen(false);
    setServiceForm({
      displayId: '',
      nameFa: '',
      nameEn: '',
      category: 'core_transport',
      descriptionFa: '',
    });
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.nameFa.trim()) return;
    const generatedDisplayId = productForm.displayId.trim() || `PRD-${Math.floor(100 + Math.random() * 900)}`;
    const newProd: LogisticsProduct = {
      productId: `prd-${Date.now()}`,
      displayId: generatedDisplayId,
      nameFa: productForm.nameFa,
      nameEn: productForm.nameEn || generatedDisplayId,
      descriptionFa: productForm.descriptionFa || 'محصول حمل بار جاده‌ای با ناوگان استاندارد',
      vehicleType: productForm.vehicleType,
      serviceComponents: productForm.serviceComponents.length > 0 ? productForm.serviceComponents : ['srv-linehaul'],
      mandatoryComponents: productForm.mandatoryComponents.length > 0 ? productForm.mandatoryComponents : ['srv-linehaul'],
      optionalComponents: productForm.optionalComponents,
      channelAvailability: productForm.channelAvailability,
      version: 1,
      status: 'Active',
    };
    addProduct(newProd);
    setSelectedProductId(newProd.productId);
    setIsCreateProductOpen(false);
    setProductForm({
      displayId: '',
      nameFa: '',
      nameEn: '',
      descriptionFa: '',
      vehicleType: 'تریلی چادری',
      serviceComponents: [],
      mandatoryComponents: [],
      optionalComponents: [],
      channelAvailability: ['Web Portal', 'TMS API'],
    });
  };

  const toggleServiceInProduct = (srvId: string, isMandatory: boolean) => {
    setProductForm((prev) => {
      const existsInComponents = prev.serviceComponents.includes(srvId);
      if (existsInComponents) {
        return {
          ...prev,
          serviceComponents: prev.serviceComponents.filter((id) => id !== srvId),
          mandatoryComponents: prev.mandatoryComponents.filter((id) => id !== srvId),
          optionalComponents: prev.optionalComponents.filter((id) => id !== srvId),
        };
      } else {
        return {
          ...prev,
          serviceComponents: [...prev.serviceComponents, srvId],
          mandatoryComponents: isMandatory ? [...prev.mandatoryComponents, srvId] : prev.mandatoryComponents,
          optionalComponents: !isMandatory ? [...prev.optionalComponents, srvId] : prev.optionalComponents,
        };
      }
    });
  };

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

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateServiceOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>ایجاد خدمت پایه جدید</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setProductForm((prev) => ({
                ...prev,
                serviceComponents: services.slice(0, 2).map((s) => s.serviceId),
                mandatoryComponents: services.slice(0, 1).map((s) => s.serviceId),
              }));
              setIsCreateProductOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ایجاد محصول تجاری حمل (FTL)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Products List & Service Composition */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base font-display flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600" />
                محصولات تجاری حمل بار (Logistics Products - {products.length} مورد):
              </h3>
              <button
                type="button"
                onClick={() => {
                  setProductForm((prev) => ({
                    ...prev,
                    serviceComponents: services.slice(0, 2).map((s) => s.serviceId),
                    mandatoryComponents: services.slice(0, 1).map((s) => s.serviceId),
                  }));
                  setIsCreateProductOpen(true);
                }}
                className="flex items-center gap-1 text-xs text-amber-900 hover:text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>افزودن محصول</span>
              </button>
            </div>

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
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base font-display flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-600" />
                خدمات پایه ناوگان ({services.length} خدمت):
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateServiceOpen(true)}
                className="flex items-center gap-1 text-xs text-slate-900 hover:text-slate-800 font-bold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>خدمت جدید</span>
              </button>
            </div>

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

      {/* ======================================================= */}
      {/* MODAL 1: CREATE NEW SERVICE */}
      {/* ======================================================= */}
      {isCreateServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-display">
                <Truck className="w-5 h-5 text-amber-600" />
                <span>تعریف و ایجاد خدمت پایه جدید ترابری (Create Service)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateServiceOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateServiceSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-700">عنوان خدمت (فارسی) *:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: خدمت تخلیه بار و کارگری در انبار مقصد"
                    value={serviceForm.nameFa}
                    onChange={(e) => setServiceForm({ ...serviceForm, nameFa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">کد شناسه خدمت (شناسه یکتا):</label>
                  <input
                    type="text"
                    placeholder="مثال: SRV-UNLOAD-DEST"
                    value={serviceForm.displayId}
                    onChange={(e) => setServiceForm({ ...serviceForm, displayId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">دسته‌بندی خدمت:</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        category: e.target.value as LogisticsService['category'],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-bold"
                  >
                    <option value="core_transport">حمل خطی اصلی (Core Transport)</option>
                    <option value="handling">بارگیری و تخلیه (Handling)</option>
                    <option value="special_care">پایش ویژه / زنجیره سرد (Special Care)</option>
                    <option value="insurance">بیمه و پوشش خسارت (Insurance)</option>
                    <option value="compliance">انطباق قانونی و بارنامه (Compliance)</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-700">نام لاتین خدمت (English):</label>
                  <input
                    type="text"
                    placeholder="e.g. Destination Unloading & Stacking Service"
                    value={serviceForm.nameEn}
                    onChange={(e) => setServiceForm({ ...serviceForm, nameEn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-700">توضیحات و دامنه شمول خدمت:</label>
                  <textarea
                    rows={2}
                    placeholder="شرح کامل مسوولیت، زمانبندی و نحوه محاسبه حق‌الزحمه خدمت..."
                    value={serviceForm.descriptionFa}
                    onChange={(e) => setServiceForm({ ...serviceForm, descriptionFa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateServiceOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                >
                  ایجاد و ثبت خدمت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 2: CREATE NEW LOGISTICS PRODUCT (FTL) */}
      {/* ======================================================= */}
      {isCreateProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-display">
                <Package className="w-5 h-5 text-amber-600" />
                <span>تعریف و ترکیب محصول تجاری حمل بار (Create Logistics Product)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateProductOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-700">عنوان تجاری محصول باربری *:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: حمل تخصصی کانتینری و محموله گمرکی (FTL Customs Port)"
                    value={productForm.nameFa}
                    onChange={(e) => setProductForm({ ...productForm, nameFa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">کد شناسه محصول:</label>
                  <input
                    type="text"
                    placeholder="مثال: PRD-PORT-CONTAINER"
                    value={productForm.displayId}
                    onChange={(e) => setProductForm({ ...productForm, displayId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">نوع ناوگان اختصاصی:</label>
                  <select
                    value={productForm.vehicleType}
                    onChange={(e) => setProductForm({ ...productForm, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-bold"
                  >
                    <option value="تریلی چادری">تریلی چادری (Curtain-side 24T)</option>
                    <option value="تریلر کفی">تریلر کفی و کانتینربَر (Flatbed 25T)</option>
                    <option value="کشنده یخچال‌دار">کشنده یخچال‌دار هوشمند (Cold-chain)</option>
                    <option value="کمرشکن بوژی">کمرشکن و بوژی سنگین (Heavy Lowboy)</option>
                    <option value="کامیون جفت ۱۵ تن">کامیون جفت (15 Ton 6x4)</option>
                    <option value="کامیون تک ۱۰ تن">کامیون تک (10 Ton 4x2)</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-700">نام لاتین محصول (English):</label>
                  <input
                    type="text"
                    placeholder="e.g. Customs Port Bonded Container Transport"
                    value={productForm.nameEn}
                    onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-700">شرح کاربرد و مشخصات بار مجاز:</label>
                  <textarea
                    rows={2}
                    placeholder="توضیح نوع بار، سقف تناژ و مزایای عملیاتی این محصول تجاری..."
                    value={productForm.descriptionFa}
                    onChange={(e) => setProductForm({ ...productForm, descriptionFa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* Service Composition Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-800 block">
                  ترکیب خدمات پایه در این محصول (انتخاب اجزا):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {services.map((s) => {
                    const isIncluded = productForm.serviceComponents.includes(s.serviceId);
                    const isMandatory = productForm.mandatoryComponents.includes(s.serviceId);
                    return (
                      <div
                        key={s.serviceId}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                          isIncluded
                            ? 'bg-amber-50/70 border-amber-300'
                            : 'bg-white border-slate-200 opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isIncluded}
                            onChange={() => toggleServiceInProduct(s.serviceId, true)}
                            className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{s.nameFa}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{s.displayId}</span>
                          </div>
                        </div>

                        {isIncluded && (
                          <button
                            type="button"
                            onClick={() => {
                              if (isMandatory) {
                                setProductForm((prev) => ({
                                  ...prev,
                                  mandatoryComponents: prev.mandatoryComponents.filter((id) => id !== s.serviceId),
                                  optionalComponents: [...prev.optionalComponents, s.serviceId],
                                }));
                              } else {
                                setProductForm((prev) => ({
                                  ...prev,
                                  mandatoryComponents: [...prev.mandatoryComponents, s.serviceId],
                                  optionalComponents: prev.optionalComponents.filter((id) => id !== s.serviceId),
                                }));
                              }
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                              isMandatory
                                ? 'bg-amber-500 text-slate-950 border-amber-600'
                                : 'bg-slate-200 text-slate-700 border-slate-300'
                            }`}
                          >
                            {isMandatory ? 'اجباری' : 'اختیاری'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateProductOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                >
                  ایجاد و انتشار محصول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
