import React, { useState } from 'react';
import {
  X,
  User,
  Users,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  Lock,
  Building2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { CarrierTeamMember } from '../../../types/pricing';

interface AddOrgUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: CarrierTeamMember) => void;
  currentOrgId?: string;
}

export const AddOrgUserModal: React.FC<AddOrgUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentOrgId,
}) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    roleTitle: 'کارشناس صدور بارنامه و اسناد حمل',
    department: 'عملیات و دیسپاچینگ',
    email: '',
    phone: '',
    roleCategory: 'operations' as 'admin' | 'pricing' | 'operations',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setFormError('لطفاً نام و ایمیل کاربر را وارد کنید.');
      return;
    }
    setFormError(null);

    const newUser: CarrierTeamMember = {
      id: `usr-carrier-${Date.now()}`,
      orgId: currentOrgId || 'org-carrier-pg-freight',
      fullName: formData.fullName,
      nationalId: '۰۰' + Math.floor(10000000 + Math.random() * 90000000),
      email: formData.email,
      phone: formData.phone || '۰۹۱۲۰۰۰۰۰۰۰',
      roleTitle: formData.roleTitle,
      department: formData.department,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      lastActive: 'لحظاتی پیش',
      accessLevel:
        formData.roleCategory === 'admin'
          ? 'full_admin'
          : formData.roleCategory === 'pricing'
          ? 'pricing_only'
          : 'operational',
    };

    onSave(newUser);
    onClose();
    setFormData({
      fullName: '',
      roleTitle: 'کارشناس صدور بارنامه و اسناد حمل',
      department: 'عملیات و دیسپاچینگ',
      email: '',
      phone: '',
      roleCategory: 'operations',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto text-xs"
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-sky-50 via-slate-50 to-white text-slate-900 flex items-center justify-between shrink-0 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-sky-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-950 font-title">
                افزودن همکار / کاربر جدید به سازمان
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                تعریف سطح دسترسی، نقش سازمانی و ارسال دعوت‌نامه فعال‌سازی
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center justify-between">
              <span>{formError}</span>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-rose-500 hover:text-rose-700 px-1"
              >
                ×
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">نام و نام خانوادگی کاربر: <span className="text-red-500">*</span></label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="مثال: مهندس سارا کریمی"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">ایمیل سازمانی: <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="sara.karimi@carrier.ir"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 text-slate-900 font-mono outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">شماره موبایل سازمانی:</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="0912xxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 text-slate-900 font-mono outline-none"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Role selector cards */}
          <div className="space-y-2 pt-1">
            <label className="font-bold text-slate-700 block">سطح دسترسی و مسئولیت سازمانی:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, roleCategory: 'operations', roleTitle: 'کارشناس صدور بارنامه و اسناد حمل', department: 'عملیات و دیسپاچینگ' })}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  formData.roleCategory === 'operations'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block font-bold text-xs">عملیات و دیسپاچینگ</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">صدور بارنامه و پایش ناوگان</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, roleCategory: 'pricing', roleTitle: 'تحلیل‌گر ارشد قیمت‌گذاری و کریدورها', department: 'واحد مالی و قیمت‌گذاری' })}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  formData.roleCategory === 'pricing'
                    ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block font-bold text-xs">مالی و نرخ‌گذاری</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">تنظیم کریدورها و نرخ پایه</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, roleCategory: 'admin', roleTitle: 'مدیر ارشد عملیات ناوگان و زنجیره حمل', department: 'مدیریت ارشد' })}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  formData.roleCategory === 'admin'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block font-bold text-xs">مدیر ارشد سیستم</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">دسترسی کامل و تغییر مشخصات</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">عنوان شغلی رسمی:</label>
              <input
                type="text"
                value={formData.roleTitle}
                onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">دپارتمان / واحد:</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ایجاد کاربر و ارسال دعوت‌نامه</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
