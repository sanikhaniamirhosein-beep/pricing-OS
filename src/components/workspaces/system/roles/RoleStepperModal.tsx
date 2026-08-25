import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Layers,
  Sparkles,
  Check,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Eye,
  Edit,
  Download,
  FileText,
  Sliders,
  TrendingUp,
  Truck,
  CreditCard,
  Users,
  Calculator,
  Warehouse,
  Receipt,
  FileCheck,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ManagedRole,
  SystemModuleDefinition,
  OperationType,
  ModulePermissionConfig,
} from '../../../../types/roles';

interface RoleStepperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: ManagedRole) => void;
  initialRole?: ManagedRole | null;
  modules: SystemModuleDefinition[];
  portalType: 'carrier' | 'shipper';
  mode: 'create' | 'edit' | 'duplicate';
}

const AVAILABLE_ICONS = [
  { name: 'ShieldCheck', icon: ShieldCheck, label: 'سپر امنیت' },
  { name: 'TrendingUp', icon: TrendingUp, label: 'نمودار رشد' },
  { name: 'Truck', icon: Truck, label: 'ناوگان حمل' },
  { name: 'CreditCard', icon: CreditCard, label: 'امور مالی' },
  { name: 'Users', icon: Users, label: 'کاربران و پرسنل' },
  { name: 'Calculator', icon: Calculator, label: 'محاسبات کرایه' },
  { name: 'Warehouse', icon: Warehouse, label: 'انبارداری' },
  { name: 'Receipt', icon: Receipt, label: 'فاکتور و صورتحساب' },
  { name: 'FileCheck', icon: FileCheck, label: 'اسناد و بازرسی' },
  { name: 'FileSpreadsheet', icon: FileSpreadsheet, label: 'قراردادها' },
  { name: 'Sliders', icon: Sliders, label: 'تنظیمات و قوانین' },
  { name: 'Layers', icon: Layers, label: 'لایه‌ها و استراتژی' },
];

const COLOR_PALETTE = [
  { hex: '#085041', name: 'سبز کله‌غازی (سازمانی)' },
  { hex: '#1D4ED8', name: 'آبی تیره (قیمت‌گذاری)' },
  { hex: '#059669', name: 'زمردی (عملیاتی)' },
  { hex: '#D97706', name: 'کهربایی (مالی)' },
  { hex: '#7C3AED', name: 'بنفش (بازرگانی)' },
  { hex: '#DC2626', name: 'زرشکی (حاکمیت)' },
  { hex: '#0284C7', name: 'آبی آسمانی (قراردادها)' },
  { hex: '#475569', name: 'طوسی متالیک (نظارتی)' },
];

export const RoleStepperModal: React.FC<RoleStepperModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRole,
  modules,
  portalType,
  mode,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [stepError, setStepError] = useState<string | null>(null);

  // Form State
  const [titleFa, setTitleFa] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionFa, setDescriptionFa] = useState('');
  const [iconName, setIconName] = useState('ShieldCheck');
  const [colorCode, setColorCode] = useState('#085041');
  const [departmentFa, setDepartmentFa] = useState('');
  const [levelBadge, setLevelBadge] = useState('سطح ۲ - تخصصی');
  const [duties, setDuties] = useState<string[]>([]);
  const [newDutyInput, setNewDutyInput] = useState('');
  const [permissions, setPermissions] = useState<Record<string, ModulePermissionConfig>>({});

  // Reset or Populate on Open
  useEffect(() => {
    if (!isOpen) return;

    if (initialRole) {
      if (mode === 'duplicate') {
        setTitleFa(`کپی از ${initialRole.titleFa}`);
        setTitleEn(`Copy of ${initialRole.titleEn}`);
      } else {
        setTitleFa(initialRole.titleFa);
        setTitleEn(initialRole.titleEn);
      }
      setDescriptionFa(initialRole.descriptionFa);
      setIconName(initialRole.iconName || 'ShieldCheck');
      setColorCode(initialRole.colorCode || '#085041');
      setDepartmentFa(initialRole.departmentFa);
      setLevelBadge(initialRole.levelBadge);
      setDuties([...(initialRole.dutiesFa || [])]);

      // Copy existing permissions with fallback
      const initialPerms: Record<string, ModulePermissionConfig> = {};
      modules.forEach((mod) => {
        if (initialRole.permissions && initialRole.permissions[mod.id]) {
          initialPerms[mod.id] = { ...initialRole.permissions[mod.id] };
        } else {
          initialPerms[mod.id] = { view: false, create: false, edit: false, delete: false, export: false };
        }
      });
      setPermissions(initialPerms);
    } else {
      // New Role Defaults
      setTitleFa('');
      setTitleEn('');
      setDescriptionFa('');
      setIconName('ShieldCheck');
      setColorCode('#085041');
      setDepartmentFa(portalType === 'carrier' ? 'معاونت بازرگانی و قیمت‌گذاری' : 'مدیریت زنجیره تأمین و لجستیک');
      setLevelBadge('نقش سفارشی');
      setDuties([
        'اجرای وظایف محوله طبق دستورالعمل‌های مصوب سازمان',
        'ثبت و بازبینی دقیق اطلاعات در ماژول‌های مجاز',
      ]);

      const initialPerms: Record<string, ModulePermissionConfig> = {};
      modules.forEach((mod) => {
        initialPerms[mod.id] = {
          view: true,
          create: false,
          edit: false,
          delete: false,
          export: false,
        };
      });
      setPermissions(initialPerms);
    }

    setCurrentStep(1);
    setNewDutyInput('');
  }, [isOpen, initialRole, mode, modules, portalType]);

  if (!isOpen) return null;

  // Step 2 Permission Toggles
  const handleTogglePermission = (moduleId: string, operation: OperationType) => {
    setPermissions((prev) => {
      const current = prev[moduleId] || { view: false, create: false, edit: false, delete: false, export: false };
      const nextVal = !current[operation];

      const updated = { ...current, [operation]: nextVal };
      // If creating/editing/deleting/exporting, view MUST be true
      if (operation !== 'view' && nextVal) {
        updated.view = true;
      }
      // If view is turned off, turn off all actions
      if (operation === 'view' && !nextVal) {
        updated.create = false;
        updated.edit = false;
        updated.delete = false;
        updated.export = false;
      }

      return {
        ...prev,
        [moduleId]: updated,
      };
    });
  };

  const handleToggleRowAll = (moduleId: string) => {
    setPermissions((prev) => {
      const current = prev[moduleId] || { view: false, create: false, edit: false, delete: false, export: false };
      const allActive = current.view && current.create && current.edit && current.delete && current.export;
      return {
        ...prev,
        [moduleId]: {
          view: !allActive,
          create: !allActive,
          edit: !allActive,
          delete: !allActive,
          export: !allActive,
        },
      };
    });
  };

  const handleToggleColumnAll = (operation: OperationType) => {
    setPermissions((prev) => {
      const allEnabled = modules.every((mod) => prev[mod.id]?.[operation]);
      const nextVal = !allEnabled;
      const updated = { ...prev };
      modules.forEach((mod) => {
        const cur = updated[mod.id] || { view: false, create: false, edit: false, delete: false, export: false };
        const newMod = { ...cur, [operation]: nextVal };
        if (operation !== 'view' && nextVal) {
          newMod.view = true;
        }
        if (operation === 'view' && !nextVal) {
          newMod.create = false;
          newMod.edit = false;
          newMod.delete = false;
          newMod.export = false;
        }
        updated[mod.id] = newMod;
      });
      return updated;
    });
  };

  const handleSelectAllMatrix = (enable: boolean) => {
    const updated: Record<string, ModulePermissionConfig> = {};
    modules.forEach((mod) => {
      updated[mod.id] = {
        view: enable,
        create: enable,
        edit: enable,
        delete: enable,
        export: enable,
      };
    });
    setPermissions(updated);
  };

  // Step 3 Duties Handlers
  const handleAddDuty = () => {
    if (!newDutyInput.trim()) return;
    setDuties([...duties, newDutyInput.trim()]);
    setNewDutyInput('');
  };

  const handleRemoveDuty = (index: number) => {
    setDuties(duties.filter((_, i) => i !== index));
  };

  // Step 4 Final Submit
  const handleFinalSubmit = () => {
    if (!titleFa.trim()) {
      setCurrentStep(1);
      return;
    }

    const savedRole: ManagedRole = {
      id: mode === 'edit' && initialRole ? initialRole.id : `role-custom-${Date.now()}`,
      titleFa: titleFa.trim(),
      titleEn: titleEn.trim() || titleFa.trim(),
      descriptionFa: descriptionFa.trim() || 'نقش کاربری با سطوح دسترسی سفارشی سازمانی',
      iconName,
      colorCode,
      isSystemRole: mode === 'edit' && initialRole ? initialRole.isSystemRole : false,
      portalType,
      departmentFa: departmentFa.trim() || 'مدیریت سازمانی',
      levelBadge: levelBadge.trim() || 'نقش سفارشی',
      userCount: mode === 'edit' && initialRole ? initialRole.userCount : 0,
      createdAt: mode === 'edit' && initialRole ? initialRole.createdAt : '۱۴۰۴/۰۵/۲۵',
      updatedAt: '۱۴۰۴/۰۵/۲۵',
      lastEditedBy: 'مدیر ارشد سازمان',
      dutiesFa: duties.length > 0 ? duties : ['اجرای کلیه مسئولیت‌های محوله سازمانی'],
      permissions,
    };

    onSave(savedRole);
  };

  // Icon preview
  const SelectedIconComp = AVAILABLE_ICONS.find((ic) => ic.name === iconName)?.icon || ShieldCheck;

  // Total active permissions count
  const totalActiveOps = Object.values(permissions).reduce((acc, curr) => {
    return acc + (curr.view ? 1 : 0) + (curr.create ? 1 : 0) + (curr.edit ? 1 : 0) + (curr.delete ? 1 : 0) + (curr.export ? 1 : 0);
  }, 0);

  const totalPossibleOps = modules.length * 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: colorCode }}
            >
              <SelectedIconComp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-title">
                  {mode === 'create' && 'تعریف نقش و سطح دسترسی جدید'}
                  {mode === 'edit' && `ویرایش نقش: ${initialRole?.titleFa || titleFa}`}
                  {mode === 'duplicate' && `کپی‌سازی و ایجاد نقش از روی: ${initialRole?.titleFa}`}
                </h2>
                <span className="bg-amber-100 text-amber-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                  فرم ۴ مرحله‌ای (Stepper)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                تعیین هویت بصری، ماتریس دانه‌درشت مجوزها، چک‌لیست وظایف و پیش‌نمایش نهایی نقش
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 py-4 bg-slate-100/60 border-b border-slate-200">
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, title: '۱. اطلاعات پایه', desc: 'نام، رنگ و آیکون' },
              { num: 2, title: '۲. ماتریس دسترسی‌ها', desc: 'مجوز ۵ گانه ماژول‌ها' },
              { num: 3, title: '۳. وظایف و مسئولیت‌ها', desc: 'چک‌لیست تعهدات' },
              { num: 4, title: '۴. پیش‌نمایش و تایید', desc: 'خلاصه و ثبت نهایی' },
            ].map((step) => {
              const isPassed = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    // Only allow clicking if title is set for subsequent steps
                    if (step.num > 1 && !titleFa.trim()) return;
                    setCurrentStep(step.num as any);
                  }}
                  className={`flex flex-col text-right p-2.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-white border-teal-600 shadow-xs ring-2 ring-teal-500/20'
                      : isPassed
                      ? 'bg-teal-50/80 border-teal-200 text-teal-900'
                      : 'bg-slate-50 border-slate-200 opacity-60 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-title">
                      {step.title}
                    </span>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    ) : (
                      <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${isCurrent ? 'bg-teal-600 text-white font-bold' : 'bg-slate-200 text-slate-600'}`}>
                        {step.num}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 truncate">{step.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stepper Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {stepError && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between text-xs text-rose-800 font-bold animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{stepError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStepError(null)}
                    className="text-rose-500 hover:text-rose-700 text-xs px-2 py-1"
                  >
                    بستن
                  </button>
                </div>
              )}

              <div className="bg-teal-50/50 border border-teal-200 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="text-xs text-teal-900 leading-relaxed">
                  <strong>مرحله اول:</strong> نام‌گذاری دقیق نقش، دپارتمان سازمانی مربوطه و انتخاب هویت بصری (آیکون و رنگ سازمانی) به شناسایی سریع دسترسی‌ها توسط مدیران و پرسنل کمک می‌کند.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    عنوان نقش (فارسی) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={titleFa}
                    onChange={(e) => setTitleFa(e.target.value)}
                    placeholder="مثال: کارشناس ارشد نظارت بر بارنامه‌های خاص"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    عنوان نقش (انگلیسی)
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Senior Freight Billing Controller"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  توضیح کوتاه و هدف از ایجاد این نقش
                </label>
                <textarea
                  rows={2}
                  value={descriptionFa}
                  onChange={(e) => setDescriptionFa(e.target.value)}
                  placeholder="شرح مختصری از محدوده اختیارات، ماژول‌های هدف و مسئولیت‌های این نقش در سازمان..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    واحد سازمانی / دپارتمان
                  </label>
                  <input
                    type="text"
                    value={departmentFa}
                    onChange={(e) => setDepartmentFa(e.target.value)}
                    placeholder="مثال: معاونت بازرگانی، امور مالی، انبار مرکزی"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    برچسب سطح دسترسی (Badge)
                  </label>
                  <input
                    type="text"
                    value={levelBadge}
                    onChange={(e) => setLevelBadge(e.target.value)}
                    placeholder="مثال: سطح ۲ - تخصصی / نظارتی / میدانی"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Icon & Color Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    انتخاب آیکون شناساگر
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {AVAILABLE_ICONS.map((ic) => {
                      const Icon = ic.icon;
                      const isSelected = iconName === ic.name;
                      return (
                        <button
                          key={ic.name}
                          type="button"
                          onClick={() => setIconName(ic.name)}
                          className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[10px] text-center truncate w-full">{ic.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    انتخاب تم رنگی نقش
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_PALETTE.map((c) => {
                      const isSelected = colorCode === c.hex;
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setColorCode(c.hex)}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-right transition-all ${
                            isSelected
                              ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 font-bold'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div
                            className="w-5 h-5 rounded-lg shrink-0 flex items-center justify-center text-white"
                            style={{ backgroundColor: c.hex }}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-[11px] truncate">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Live Mini Preview */}
                  <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: colorCode }}
                    >
                      <SelectedIconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {titleFa || 'عنوان نقش پیش‌نمایش'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white border border-slate-200 text-slate-600">
                          {levelBadge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{departmentFa}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Access Matrix */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header Info & Global Actions */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-700" />
                    <h3 className="text-xs font-bold text-slate-900">
                      ماتریس تفکیک دسترسی‌ها بر اساس ماژول‌های سامانه
                    </h3>
                    <span className="bg-teal-100 text-teal-800 text-[11px] px-2 py-0.5 rounded-full font-bold">
                      {totalActiveOps} از {totalPossibleOps} دسترسی فعال
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ۵ سطح عملیات: مشاهده (View)، ایجاد (Create)، ویرایش (Edit)، حذف (Delete) و خروجی اکسل/PDF (Export)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectAllMatrix(true)}
                    className="px-3 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs"
                  >
                    انتخاب تمام دسترسی‌ها
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAllMatrix(false)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-200"
                  >
                    پاکسازی همه
                  </button>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-700">
                        <th className="py-3.5 px-4 w-5/12">ماژول سامانه و توضیحات</th>
                        <th className="py-3.5 px-2 text-center w-[11%]">
                          <button
                            type="button"
                            onClick={() => handleToggleColumnAll('view')}
                            className="hover:text-teal-700 inline-flex items-center gap-1 font-bold"
                            title="تغییر وضعیت ستون مشاهده"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>مشاهده</span>
                          </button>
                        </th>
                        <th className="py-3.5 px-2 text-center w-[11%]">
                          <button
                            type="button"
                            onClick={() => handleToggleColumnAll('create')}
                            className="hover:text-teal-700 inline-flex items-center gap-1 font-bold"
                            title="تغییر وضعیت ستون ایجاد"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ایجاد</span>
                          </button>
                        </th>
                        <th className="py-3.5 px-2 text-center w-[11%]">
                          <button
                            type="button"
                            onClick={() => handleToggleColumnAll('edit')}
                            className="hover:text-teal-700 inline-flex items-center gap-1 font-bold"
                            title="تغییر وضعیت ستون ویرایش"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>ویرایش</span>
                          </button>
                        </th>
                        <th className="py-3.5 px-2 text-center w-[11%]">
                          <button
                            type="button"
                            onClick={() => handleToggleColumnAll('delete')}
                            className="hover:text-rose-700 text-rose-700 inline-flex items-center gap-1 font-bold"
                            title="تغییر وضعیت ستون حذف (حساس)"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>حذف</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          </button>
                        </th>
                        <th className="py-3.5 px-2 text-center w-[11%]">
                          <button
                            type="button"
                            onClick={() => handleToggleColumnAll('export')}
                            className="hover:text-amber-700 text-amber-800 inline-flex items-center gap-1 font-bold"
                            title="تغییر وضعیت ستون خروجی گرفتن"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-600" />
                            <span>خروجی</span>
                          </button>
                        </th>
                        <th className="py-3.5 px-3 text-center w-[5%]">انتخاب</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {modules.map((mod) => {
                        const perm = permissions[mod.id] || {
                          view: false,
                          create: false,
                          edit: false,
                          delete: false,
                          export: false,
                        };
                        const allSelected = perm.view && perm.create && perm.edit && perm.delete && perm.export;

                        return (
                          <tr
                            key={mod.id}
                            className={`hover:bg-slate-50/70 transition-colors ${
                              mod.isSensitive ? 'bg-amber-50/20' : ''
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-start gap-2.5">
                                <div className="mt-0.5">
                                  {mod.isSensitive ? (
                                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900">{mod.nameFa}</span>
                                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                      {mod.categoryFa}
                                    </span>
                                    {mod.isSensitive && (
                                      <span className="text-[9px] bg-rose-100 text-rose-800 border border-rose-200 px-1.5 py-0.2 rounded font-bold">
                                        ماژول حساس
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                                    {mod.descriptionFa}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* View Checkbox */}
                            <td className="py-3 px-2 text-center">
                              <label className="inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={perm.view}
                                  onChange={() => handleTogglePermission(mod.id, 'view')}
                                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                                />
                              </label>
                            </td>

                            {/* Create Checkbox */}
                            <td className="py-3 px-2 text-center">
                              <label className="inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={perm.create}
                                  onChange={() => handleTogglePermission(mod.id, 'create')}
                                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                                />
                              </label>
                            </td>

                            {/* Edit Checkbox */}
                            <td className="py-3 px-2 text-center">
                              <label className="inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={perm.edit}
                                  onChange={() => handleTogglePermission(mod.id, 'edit')}
                                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                                />
                              </label>
                            </td>

                            {/* Delete Checkbox (Sensitive - red accent) */}
                            <td className="py-3 px-2 text-center bg-rose-50/30">
                              <label
                                className="inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-rose-100/50 cursor-pointer"
                                title="عملیات حساس: حذف دائمی رکوردها"
                              >
                                <input
                                  type="checkbox"
                                  checked={perm.delete}
                                  onChange={() => handleTogglePermission(mod.id, 'delete')}
                                  className="w-4 h-4 text-rose-600 rounded border-rose-300 focus:ring-rose-500 cursor-pointer"
                                />
                              </label>
                            </td>

                            {/* Export Checkbox */}
                            <td className="py-3 px-2 text-center bg-amber-50/20">
                              <label
                                className="inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-amber-100/50 cursor-pointer"
                                title="خروجی داده‌ها به صورت فایل اکسل یا PDF"
                              >
                                <input
                                  type="checkbox"
                                  checked={perm.export}
                                  onChange={() => handleTogglePermission(mod.id, 'export')}
                                  className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500 cursor-pointer"
                                />
                              </label>
                            </td>

                            {/* Row Select All Toggle */}
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleRowAll(mod.id)}
                                className={`text-[10px] px-2 py-1 rounded-lg border font-bold transition-all ${
                                  allSelected
                                    ? 'bg-teal-600 text-white border-teal-700'
                                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {allSelected ? 'کامل' : 'همه'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Warning box for sensitive permissions */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 leading-relaxed">
                  <strong className="block font-bold mb-0.5">هشدار امنیتی و کنترل ریسک:</strong>
                  دسترسی <strong>«حذف (Delete)»</strong> و <strong>«خروجی داده‌ها (Export)»</strong> در ماژول‌های حاکمیتی و پایگاه داده از دسترسی‌های حساس بوده و کلیه اقدامات کاربران دارای این نقش در سامانه ثبت ممیزی (Audit Log) غیرقابل تغییر ذخیره می‌گردد.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Responsibilities & Duties Checklist */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <div className="text-xs text-sky-900 leading-relaxed">
                  <strong>مرحله سوم:</strong> تدوین شرح وظایف و الزامات مستندسازی این نقش. این چک‌لیست در پروفایل شغلی کاربر و همچنین در ممیزی‌های فرآیندی سازمان به عنوان راهنمای استاندارد عملیاتی (SOP) نمایش داده می‌شود.
                </div>
              </div>

              {/* Add New Duty Item */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  افزودن بند جدید به شرح وظایف و مسئولیت‌ها
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newDutyInput}
                    onChange={(e) => setNewDutyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDuty();
                      }
                    }}
                    placeholder="مثال: بازبینی روزانه گزارش استعلام‌های تاییدنشده و اعلام به مدیر قیمت‌گذاری..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 outline-hidden font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddDuty}
                    className="px-4 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن بند</span>
                  </button>
                </div>
              </div>

              {/* Duties Checklist List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-600 font-mono uppercase px-1">
                  چک‌لیست وظایف ثبت‌شده برای «{titleFa || 'نقش جدید'}» ({duties.length} بند)
                </h4>

                {duties.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 text-xs">
                    هنوز هیچ شرح وظیفه‌ای ثبت نشده است. از کادر بالا وظایف این نقش را اضافه کنید.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {duties.map((duty, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-start justify-between gap-3 shadow-xs hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <span className="text-xs text-slate-800 font-medium leading-relaxed">
                            {duty}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDuty(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                          title="حذف این بند"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Preview & Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <strong>مرحله نهایی:</strong> پیش‌نمایش کامل شناسنامه نقش و ماتریس دسترسی‌ها. پس از اطمینان، با فشردن دکمه «ثبت و ذخیره نهایی»، این نقش فعال و آماده انتساب به کاربران خواهد شد.
                </div>
              </div>

              {/* Role Summary Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md text-xl"
                      style={{ backgroundColor: colorCode }}
                    >
                      <SelectedIconComp className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 font-title">
                          {titleFa || 'نقش بدون عنوان'}
                        </h3>
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                          {levelBadge}
                        </span>
                        <span className="text-xs font-bold bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-full">
                          {portalType === 'carrier' ? 'سازمان حمل‌ونقل' : 'سازمان صاحب کالا'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5" dir="ltr">
                        {titleEn || 'Custom Defined Role'}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        دپارتمان: <span className="font-bold text-slate-800">{departmentFa}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-left bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium">پوشش دسترسی ماژول‌ها</div>
                    <div className="text-base font-bold text-teal-800 font-mono mt-0.5">
                      {totalActiveOps} / {totalPossibleOps} دسترسی
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-1">شرح هدف و ماموریت نقش:</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {descriptionFa || 'توضیحی ثبت نشده است.'}
                  </p>
                </div>
              </div>

              {/* Permissions Breakdown Preview */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>خلاصه دسترسی ماژول‌ها بر اساس ۵ عملیات</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    (تیک‌های سبز = مجاز | خط تیره = عدم دسترسی)
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {modules.map((mod) => {
                    const perm = permissions[mod.id] || {
                      view: false,
                      create: false,
                      edit: false,
                      delete: false,
                      export: false,
                    };
                    const hasAny = perm.view || perm.create || perm.edit || perm.delete || perm.export;

                    return (
                      <div
                        key={mod.id}
                        className={`p-3 rounded-2xl border ${
                          hasAny
                            ? 'bg-slate-50/80 border-slate-200'
                            : 'bg-slate-50/30 border-dashed border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {mod.nameFa}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {mod.categoryFa}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className={`px-2 py-0.5 rounded-md font-bold ${perm.view ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-400'}`}>
                            مشاهده {perm.view ? '✓' : '✗'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md font-bold ${perm.create ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-400'}`}>
                            ایجاد {perm.create ? '✓' : '✗'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md font-bold ${perm.edit ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-400'}`}>
                            ویرایش {perm.edit ? '✓' : '✗'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md font-bold ${perm.delete ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-400'}`}>
                            حذف {perm.delete ? '✓' : '✗'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md font-bold ${perm.export ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'}`}>
                            خروجی {perm.export ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Duties Checklist Summary */}
              {duties.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">
                    شرح وظایف و مسئولیت‌های مصوب ({duties.length} بند)
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 pr-4 list-disc">
                    {duties.map((d, i) => (
                      <li key={i} className="leading-relaxed">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
                <span>مرحله قبل</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all"
            >
              انصراف
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !titleFa.trim()) {
                    setStepError('لطفاً عنوان نقش را وارد نمایید.');
                    return;
                  }
                  setStepError(null);
                  setCurrentStep((prev) => (prev + 1) as any);
                }}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>ادامه به مرحله بعد</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>ثبت و ذخیره نهایی نقش</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
