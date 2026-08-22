import React, { useState } from 'react';
import { ShieldCheck, KeyRound, AlertTriangle, X, Lock } from 'lucide-react';
import { usePricing } from '../../store/PricingContext';

export const StepUpMFAModal: React.FC = () => {
  const { isMfaModalOpen, setIsMfaModalOpen, pendingMfaAction, setPendingMfaAction, userName, userRole } = usePricing();
  const [pinCode, setPinCode] = useState(['7', '4', '2', '9', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isMfaModalOpen) return null;

  const handleConfirm = () => {
    setIsVerifying(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsVerifying(false);
      setIsMfaModalOpen(false);
      if (pendingMfaAction) {
        pendingMfaAction();
        setPendingMfaAction(null);
      }
    }, 600);
  };

  const handleClose = () => {
    setIsMfaModalOpen(false);
    setPendingMfaAction(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">احراز هویت دومرحله‌ای (Step-Up MFA)</h3>
              <p className="text-xs text-slate-400">گیت امنیتی حاکمیتی بر اساس قانون BR-013</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200/90 leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              این اقدام مستقیماً محیط عملیاتی (Production) و تعرفه‌های فعال را تحت تاثیر قرار می‌دهد. جهت ثبت در دفترکل
              تغییرات (Audit Trail)، تایید هویت الزامی است.
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>کاربر مجری:</span>
              <span className="text-slate-200 font-medium">{userName}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>نقش سازمانی:</span>
              <span className="text-slate-200 font-medium">{userRole}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>توکن سخت‌افزاری / OTP:</span>
              <span className="text-emerald-400 font-mono">FIDO2 / YubiKey متصل</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-medium">کد امنیتی تاییدیه ۶ رقمی (OTP):</label>
            <div className="flex gap-2 justify-center dir-ltr">
              {['7', '4', '2', '9', '8', '1'].map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  readOnly
                  value={digit}
                  className="w-10 h-11 text-center font-mono font-bold text-base bg-slate-950 border border-slate-700 rounded-lg text-amber-300 focus:outline-none focus:border-amber-400 shadow-inner"
                />
              ))}
            </div>
          </div>

          {errorMsg && <p className="text-rose-400 text-center">{errorMsg}</p>}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isVerifying}
            className="px-5 py-2 text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-lg shadow-amber-500/20 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isVerifying ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                در حال اعتبارسنجی توکن...
              </span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                تایید نهایی و ثبت در لاگ
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
