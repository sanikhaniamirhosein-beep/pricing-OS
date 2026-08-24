import React, { useState, useEffect } from 'react';
import {
  Bell,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle2,
  ShieldAlert,
  Moon,
  Volume2,
  Send,
  Sparkles,
  Info,
  Check,
  Save,
  Truck,
  Receipt,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { usePricing } from '../../store/PricingContext';

export const ShipperRetailNotificationsView: React.FC = () => {
  const { currentShipperOrg, userName, userEmail } = usePricing();

  // Contact Info states
  const initialPhone = currentShipperOrg?.individualProfile?.mobileNumber || '09121948271';
  const [primaryPhone, setPrimaryPhone] = useState(initialPhone);
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [notificationEmail, setNotificationEmail] = useState(userEmail || 'ali.moradi@gmail.com');
  const [webPushEnabled, setWebPushEnabled] = useState(true);

  // Notification Toggles - Transport Lifecycle
  const [smsDriverAssigned, setSmsDriverAssigned] = useState(true);
  const [smsDriverArrived, setSmsDriverArrived] = useState(true);
  const [smsLiveTrackingLink, setSmsLiveTrackingLink] = useState(true);
  const [smsDeliveryOtp, setSmsDeliveryOtp] = useState(true);
  const [smsDelivered, setSmsDelivered] = useState(true);

  // Notification Toggles - Financial
  const [smsWalletActivity, setSmsWalletActivity] = useState(true);
  const [emailInvoices, setEmailInvoices] = useState(true);
  const [smsPaymentReminders, setSmsPaymentReminders] = useState(false);

  // Notification Toggles - Marketing & Road info
  const [smsPromoCodes, setSmsPromoCodes] = useState(true);
  const [smsWeatherRoadAlerts, setSmsWeatherRoadAlerts] = useState(true);

  // Sound & Quiet Hours
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Test SMS State & Save Feedback
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Load saved preferences from localStorage if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`shipper_notifications_${currentShipperOrg?.id || 'retail'}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.primaryPhone) setPrimaryPhone(parsed.primaryPhone);
        if (parsed.secondaryPhone !== undefined) setSecondaryPhone(parsed.secondaryPhone);
        if (parsed.notificationEmail) setNotificationEmail(parsed.notificationEmail);
        if (parsed.webPushEnabled !== undefined) setWebPushEnabled(parsed.webPushEnabled);
        if (parsed.smsDriverAssigned !== undefined) setSmsDriverAssigned(parsed.smsDriverAssigned);
        if (parsed.smsDriverArrived !== undefined) setSmsDriverArrived(parsed.smsDriverArrived);
        if (parsed.smsLiveTrackingLink !== undefined) setSmsLiveTrackingLink(parsed.smsLiveTrackingLink);
        if (parsed.smsDeliveryOtp !== undefined) setSmsDeliveryOtp(parsed.smsDeliveryOtp);
        if (parsed.smsDelivered !== undefined) setSmsDelivered(parsed.smsDelivered);
        if (parsed.smsWalletActivity !== undefined) setSmsWalletActivity(parsed.smsWalletActivity);
        if (parsed.emailInvoices !== undefined) setEmailInvoices(parsed.emailInvoices);
        if (parsed.smsPaymentReminders !== undefined) setSmsPaymentReminders(parsed.smsPaymentReminders);
        if (parsed.smsPromoCodes !== undefined) setSmsPromoCodes(parsed.smsPromoCodes);
        if (parsed.smsWeatherRoadAlerts !== undefined) setSmsWeatherRoadAlerts(parsed.smsWeatherRoadAlerts);
        if (parsed.quietHoursEnabled !== undefined) setQuietHoursEnabled(parsed.quietHoursEnabled);
        if (parsed.soundEnabled !== undefined) setSoundEnabled(parsed.soundEnabled);
      }
    } catch {
      // ignore
    }
  }, [currentShipperOrg?.id]);

  const handleSaveSettings = () => {
    const prefs = {
      primaryPhone,
      secondaryPhone,
      notificationEmail,
      webPushEnabled,
      smsDriverAssigned,
      smsDriverArrived,
      smsLiveTrackingLink,
      smsDeliveryOtp,
      smsDelivered,
      smsWalletActivity,
      emailInvoices,
      smsPaymentReminders,
      smsPromoCodes,
      smsWeatherRoadAlerts,
      quietHoursEnabled,
      soundEnabled,
    };
    try {
      localStorage.setItem(`shipper_notifications_${currentShipperOrg?.id || 'retail'}`, JSON.stringify(prefs));
    } catch {
      // ignore
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSendTestSms = () => {
    setIsSendingTest(true);
    setTestSentMessage(null);
    setTimeout(() => {
      setIsSendingTest(false);
      setTestSentMessage(`یک پیامک تستی به شماره ${primaryPhone} با موفقیت ارسال شد.`);
      setTimeout(() => setTestSentMessage(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-sm shrink-0">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold font-title">تنظیمات اطلاع‌رسانی پیامک و ایمیل</h1>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold text-[10px] border border-white/30 font-mono">
                  بار خرد و شخصی
                </span>
              </div>
              <p className="text-xs text-sky-100 mt-1 max-w-2xl leading-relaxed">
                مدیریت ارسال پیامک‌های تخصیص راننده، لینک رهگیری زنده، کدهای رمز تحویل بار (OTP)، فاکتورهای رسمی و هشدارهای لحظه‌ای حمل بار
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-save-retail-notifications"
              onClick={handleSaveSettings}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-sky-50 text-sky-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4 text-sky-600" />}
              <span>{isSaved ? 'ذخیره شد' : 'ذخیره تنظیمات'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {isSaved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>تنظیمات اطلاع‌رسانی پیامک و ایمیل شما با موفقیت در سامانه ذخیره گردید.</span>
        </div>
      )}

      {/* Grid: 2 Columns (Settings vs Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Notification Preferences */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. Contact & Delivery Channels */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-sky-600" />
                کانال‌ها و اطلاعات تماس جهت ارسال پیامک و اعلان
              </h2>
              <span className="text-[10px] text-slate-400">اطلاعات مقصد ارسال</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1">
                  شماره همراه اصلی (جهت دریافت پیامک‌های بار):
                </label>
                <input
                  type="text"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-sky-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">شماره پیش‌فرض ثبت‌شده در شاهکار</span>
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1">
                  شماره همراه دوم / گیرنده بار (اختیاری):
                </label>
                <input
                  type="text"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  placeholder="مثال: شماره موبایل تحویل‌گیرنده در مقصد"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-sky-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">ارسال پیامک همزمان به تحویل‌گیرنده کالا</span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 text-xs font-bold mb-1">
                  آدرس ایمیل دریافت فاکتورها و اسناد رسمی:
                </label>
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold text-slate-800">فعال‌سازی اعلان‌های وب (Web Push Notifications)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={webPushEnabled}
                  onChange={(e) => setWebPushEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>
          </div>

          {/* 2. Transport Lifecycle SMS Alerts */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-600" />
                پیامک‌های چرخه حمل بار و اعزام ناوگان (SMS Alerts)
              </h2>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                تحویل لحظه‌ای
              </span>
            </div>

            <div className="space-y-3.5 divide-y divide-slate-100">
              {/* Toggle: Driver Assigned */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    پیامک تخصیص راننده و ناوگان باربری
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ارسال نام راننده، شماره تماس مستقیم و شماره پلاک کامیون پس از پذیرش بارنامه
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsDriverAssigned}
                  onChange={(e) => setSmsDriverAssigned(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer accent-sky-600"
                />
              </div>

              {/* Toggle: Driver Arrived */}
              <div className="flex items-center justify-between pt-3.5">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    پیامک اعلام رسیدن راننده به محل بارگیری / تخلیه
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ارسال هشدار پیامکی به محض ورود ناوگان به شعاع ۵۰۰ متری آدرس مبدأ یا مقصد
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsDriverArrived}
                  onChange={(e) => setSmsDriverArrived(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer accent-sky-600"
                />
              </div>

              {/* Toggle: Live Tracking Link */}
              <div className="flex items-center justify-between pt-3.5">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    ارسال لینک اختصاصی رهگیری زنده روی نقشه (GPS Tracking Link)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    امکان رصد موقعیت زنده بار بدون نیاز به لاگین برای شما و تحویل‌گیرنده
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsLiveTrackingLink}
                  onChange={(e) => setSmsLiveTrackingLink(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer accent-sky-600"
                />
              </div>

              {/* Toggle: Delivery OTP */}
              <div className="flex items-center justify-between pt-3.5">
                <div>
                  <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                    <span>کد رمز تحویل بار (Delivery Security OTP)</span>
                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded text-[9px] font-bold">
                      پیشنهادی
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ارسال کد امنیتی یک‌بارمصرف به تحویل‌گیرنده که بدون ارائه آن راننده مجاز به تخلیه نیست
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsDeliveryOtp}
                  onChange={(e) => setSmsDeliveryOtp(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer accent-sky-600"
                />
              </div>

              {/* Toggle: Final Delivery & POD */}
              <div className="flex items-center justify-between pt-3.5">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    پیامک تحویل نهایی و بارگذاری رسید امضاشده (POD)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    اطلاع‌رسانی اتمام ماموریت، ثبت امضای الکترونیک و دریافت تصویر قبض تخلیه
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsDelivered}
                  onChange={(e) => setSmsDelivered(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer accent-sky-600"
                />
              </div>
            </div>
          </div>

          {/* 3. Financial & Promotional Notifications */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                اطلاع‌رسانی مالی، فاکتورها، تخفیف‌ها و رویدادها
              </h2>
            </div>

            <div className="space-y-3.5 divide-y divide-slate-100">
              {/* Wallet activity */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    پیامک تراکنش‌های کیف پول و پرداخت آنلاین کرایه
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ارسال شناسه پرداخت و تاییدیه شارژ کیف پول یا تسویه مستقیم حساب باربری
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsWalletActivity}
                  onChange={(e) => setSmsWalletActivity(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer accent-sky-600"
                />
              </div>

              {/* Email Invoices */}
              <div className="flex items-center justify-between pt-3.5">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    ارسال فایل الکترونیک فاکتور رسمی و بارنامه به ایمیل
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ارسال PDF فاکتور با مهر و تمبر دیجیتال سازمان راهداری به ایمیل شما
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailInvoices}
                  onChange={(e) => setEmailInvoices(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer accent-sky-600"
                />
              </div>

              {/* Promo codes */}
              <div className="flex items-center justify-between pt-3.5">
                <div>
                  <span className="text-xs font-bold text-slate-800 block flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-600" />
                    <span>کدهای تخفیف و جشنواره‌های باربری خرد</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ارسال کوپن‌های تخفیف مناسبتی کرایه و بسته‌های ویژه صاحبان بارهای خرد
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsPromoCodes}
                  onChange={(e) => setSmsPromoCodes(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer accent-sky-600"
                />
              </div>

              {/* Weather & Road Alerts */}
              <div className="flex items-center justify-between pt-3.5">
                <div>
                  <span className="text-xs font-bold text-slate-800 block flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-sky-600" />
                    <span>هشدارهای انسداد مسیر، وضعیت هوا و راهداری</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    اطلاع‌رسانی در خصوص شرایط اضطراری جوی، بارش برف یا ترافیک سنگین در محورهای بار شما
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsWeatherRoadAlerts}
                  onChange={(e) => setSmsWeatherRoadAlerts(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer accent-sky-600"
                />
              </div>
            </div>
          </div>

          {/* 4. Quiet Hours & Sound */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-600" />
                حالت عدم مزاحمت و زمان‌بندی پیامک‌ها (Quiet Hours)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">عدم مزاحمت شبانه (۲۳:۰۰ تا ۰۷:۰۰)</span>
                  <span className="text-[10px] text-slate-500">
                    انتقال پیامک‌های غیرفوری به ساعت ۸ صبح روز بعد
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={quietHoursEnabled}
                  onChange={(e) => setQuietHoursEnabled(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer accent-sky-600"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">پخش صدای زنگ اعلان در پرتال</span>
                  <span className="text-[10px] text-slate-500">
                    پخش هشدار صوتی ملایم هنگام تغییر وضعیت بار
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer accent-sky-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Interactive SMS Simulation & Test Trigger */}
        <div className="space-y-5">
          {/* Phone SMS Preview Container */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-3xl text-white shadow-lg space-y-4 border border-slate-800 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>پیش‌نمایش زنده پیامک ارسالی</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono text-[10px] border border-sky-500/30">
                سرشماره ۹۸۲۰۰۰+
              </span>
            </div>

            {/* Simulated Phone Screen Bubble */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700 space-y-3 font-sans">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-b border-slate-700/60 pb-2">
                <span>پیامک از سامانه لجستیک بار</span>
                <span>هم‌اکنون</span>
              </div>

              {/* Dynamic SMS text based on settings */}
              <div className="text-xs text-slate-100 leading-relaxed space-y-2">
                <p className="font-bold text-sky-300">
                  صاحب بار گرامی، {userName || 'علی مرادی'}؛
                </p>
                <p className="text-[11px] text-slate-200">
                  ناوگان حمل بار شما (خاور مسقف) تخصیص یافت.
                </p>
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 text-[11px] font-mono space-y-1 text-slate-300">
                  <div>👤 راننده: بهرام رضایی</div>
                  <div>📞 تماس: ۰۹۱۲۳۴۵۶۷۸۹</div>
                  <div>🚚 پلاک: ۵۴ ع ۷۸۹ ایران ۴۵</div>
                  {smsDeliveryOtp && <div className="text-amber-300 font-bold">🔑 کد رمز تحویل (OTP): ۷۹۴۲</div>}
                </div>
                {smsLiveTrackingLink && (
                  <p className="text-[10px] text-sky-400 font-mono underline">
                    📍 لینک رهگیری زنده: trk.pricing-os.ir/l/9041
                  </p>
                )}
              </div>
            </div>

            {/* Test Trigger Button */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                id="btn-send-test-sms"
                onClick={handleSendTestSms}
                disabled={isSendingTest}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Send className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-bounce' : ''}`} />
                <span>{isSendingTest ? 'در حال ارسال پیامک آزمایشی...' : 'ارسال پیامک تستی به شماره من'}</span>
              </button>

              {testSentMessage && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-600/60 rounded-xl text-[11px] text-emerald-300 font-medium flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{testSentMessage}</span>
                </div>
              )}
            </div>

            {/* Security Guarantee Note */}
            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>
                پیامک‌های اطلاع‌رسانی با خطوط خدماتی بدون تأخیر ارسال شده و حتی در صورت مسدودی پیامک‌های تبلیغاتی به دست شما خواهد رسید.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
