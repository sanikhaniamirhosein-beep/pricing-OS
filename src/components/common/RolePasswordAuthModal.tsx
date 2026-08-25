import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  UserCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export interface RoleAuthTarget {
  roleKey: string;
  titleFa: string;
  titleEn?: string;
  levelBadge?: string;
  departmentFa?: string;
  defaultUserName?: string;
  defaultUserEmail?: string;
  defaultPassword?: string;
}

interface RolePasswordAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: RoleAuthTarget | null;
  onConfirm: () => void;
  portalType?: 'carrier' | 'shipper';
}

export const RolePasswordAuthModal: React.FC<RolePasswordAuthModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  onConfirm,
  portalType = 'carrier',
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(null);
      setIsSuccess(false);
      setShowPassword(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, targetRole]);

  if (!isOpen || !targetRole) return null;

  const expectedPassword = targetRole.defaultPassword || 'admin@pass123';

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('لطفاً رمز عبور اختصاصی این نقش را وارد فرمایید.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (password.trim() !== expectedPassword.trim()) {
      setError('رمز عبور وارد شده برای این نقش نامعتبر است. لطفاً رمز صحیح را وارد کنید.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    // Success
    setIsSuccess(true);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 450);
  };

  const handleQuickFill = () => {
    setPassword(expectedPassword);
    setError(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const isShipper = portalType === 'shipper';
  const themeColor = isShipper ? 'sky' : 'amber';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: shake ? [-6, 6, -5, 5, -2, 2, 0] : 0,
          }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 font-sans text-slate-800 text-right"
          dir="rtl"
        >
          {/* Header */}
          <div className={`p-5 bg-gradient-to-l ${isShipper ? 'from-sky-50 via-teal-50/50 to-white' : 'from-amber-50 via-slate-50 to-white'} border-b border-slate-100 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isShipper ? 'bg-sky-600 text-white shadow-sky-600/20' : 'bg-amber-600 text-white shadow-amber-600/20'
              } shadow-lg shrink-0`}>
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 font-title">
                  <span>احراز هویت و تغییر نقش کاربری</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  جهت دسترسی به این بخش، ورود رمز عبور الزامی است.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Target Role Overview Card */}
          <div className="p-5 space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">نقش انتخابی هدف:</span>
                {targetRole.levelBadge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                    isShipper ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {targetRole.levelBadge}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isShipper ? 'bg-sky-100 text-sky-900' : 'bg-amber-100 text-amber-900'
                }`}>
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {targetRole.titleFa}
                  </div>
                  {targetRole.titleEn && (
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {targetRole.titleEn}
                    </div>
                  )}
                </div>
              </div>

              {(targetRole.defaultUserName || targetRole.defaultUserEmail) && (
                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 flex items-center justify-between">
                  <span className="truncate">
                    کاربر پیش‌فرض: <strong className="text-slate-800">{targetRole.defaultUserName}</strong>
                  </span>
                  {targetRole.defaultUserEmail && (
                    <span className="text-[10px] text-slate-400 font-mono truncate">
                      {targetRole.defaultUserEmail}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Password Form */}
            <form onSubmit={handleVerify} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                    <span>رمز عبور نقش (Security Password)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">الزامی</span>
                </label>

                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="رمز عبور نقش را وارد کنید..."
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-2xl text-xs text-slate-800 font-mono placeholder:text-slate-400 placeholder:font-sans transition-all focus:outline-none ${
                      error
                        ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400/20'
                        : isSuccess
                        ? 'border-emerald-500 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-500/20'
                        : isShipper
                        ? 'border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
                        : 'border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Success feedback */}
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600 font-bold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>احراز هویت موفق! در حال انتقال به نقش جدید...</span>
                  </motion.div>
                )}
              </div>

              {/* Developer / Tester Quick Hint Chip */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>رمز عبور آزمایشی این نقش:</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer shadow-2xs hover:text-slate-900"
                  title="کلیک برای درج خودکار رمز آزمایشی"
                >
                  {expectedPassword}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  disabled={isSuccess}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSuccess
                      ? 'bg-emerald-600 shadow-emerald-600/20'
                      : isShipper
                      ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20'
                      : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تأیید شد</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>تأیید و ورود به نقش</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
