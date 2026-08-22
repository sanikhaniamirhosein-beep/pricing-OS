import React, { useState } from 'react';
import {
  Users,
  Bell,
  Key,
  Plus,
  Shield,
  Trash2,
  Copy,
  Check,
  Code,
  Smartphone,
  Mail,
  RefreshCw,
  Send,
  Building,
  UserCheck,
} from 'lucide-react';
import { INITIAL_SHIPPER_TEAM, ShipperTeamMember } from '../../data/mockShipperData';
import { usePricing } from '../../store/PricingContext';

export const ShipperSettingsView: React.FC = () => {
  const { userOrgName, userName, userEmail } = usePricing();
  const [activeTab, setActiveTab] = useState<'team' | 'notifications' | 'api_hub'>('team');
  const [teamMembers, setTeamMembers] = useState<ShipperTeamMember[]>(INITIAL_SHIPPER_TEAM);

  // New Team Member Form
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<ShipperTeamMember['role']>('مسئول انبار');
  const [newMemberAccess, setNewMemberAccess] = useState<ShipperTeamMember['accessLevel']>('ثبت و رهگیری');

  // Notification Preferences
  const [notifySmsOnDispatch, setNotifySmsOnDispatch] = useState(true);
  const [notifySmsOnArrival, setNotifySmsOnArrival] = useState(true);
  const [notifyEmailOnInvoice, setNotifyEmailOnInvoice] = useState(true);
  const [notifyEmailOnPod, setNotifyEmailOnPod] = useState(true);
  const [notifyPushLiveEta, setNotifyPushLiveEta] = useState(false);

  // API Token State
  const [apiKey, setApiKey] = useState('shp_live_9941a0b3c882194f7e2d');
  const [isCopied, setIsCopied] = useState(false);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberPhone) return;
    const newMember: ShipperTeamMember = {
      id: `USR-${Date.now()}`,
      fullName: newMemberName,
      email: newMemberEmail || `${newMemberName}@msc.ir`,
      phone: newMemberPhone,
      role: newMemberRole,
      accessLevel: newMemberAccess,
      lastActive: 'دعوت‌نامه ارسال شد',
      status: 'active',
    };
    setTeamMembers([...teamMembers, newMember]);
    setIsAddingMember(false);
    setNewMemberName('');
    setNewMemberPhone('');
    setNewMemberEmail('');
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    if (window.confirm('آیا از بازتولید توکن API اطمینان دارید؟ سیستم‌های متصل قبلی تا زمان به‌روزرسانی توکن جدید با خطای احراز هویت مواجه خواهند شد.')) {
      setApiKey(`shp_live_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 10)}`);
      alert('کلید API جدید با موفقیت صادر شد.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Settings Navigation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'team', label: 'مدیریت کاربران و تیم لجستیک', icon: Users, count: teamMembers.length },
            { id: 'notifications', label: 'تنظیمات اطلاع‌رسانی (پیامک و ایمیل)', icon: Bell },
            { id: 'api_hub', label: 'یکپارچه‌سازی و کلیدهای API (Developer Hub)', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'team' && (
          <button
            type="button"
            onClick={() => setIsAddingMember(!isAddingMember)}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>دعوت از همکار جدید</span>
          </button>
        )}
      </div>

      {/* 1. TEAM MANAGEMENT */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          {/* Add Team Member Modal/Inline */}
          {isAddingMember && (
            <form onSubmit={handleAddMember} className="bg-amber-50/50 p-5 rounded-2xl border border-amber-300 shadow-xs space-y-4 animate-in slide-in-from-top-2">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                افزودن عضو جدید به پنل لجستیک سازمانی
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="مثلاً: علی صادقی"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">شماره تلفن همراه:</label>
                  <input
                    type="text"
                    required
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    placeholder="۰۹۱۲..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">ایمیل سازمانی:</label>
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="a.sadeghi@msc.ir"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">نقش سازمانی:</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  >
                    <option value="مدیر ارشد تدارکات">مدیر ارشد تدارکات</option>
                    <option value="کارشناس بارنامه">کارشناس بارنامه و حمل</option>
                    <option value="مسئول انبار">مسئول انبار و تحویل</option>
                    <option value="مدیر مالی و حسابداری">مدیر مالی و حسابداری</option>
                    <option value="مدیر بازرگانی">مدیر بازرگانی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">سطح دسترسی در پرتال:</label>
                  <select
                    value={newMemberAccess}
                    onChange={(e) => setNewMemberAccess(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  >
                    <option value="مدیر کل">مدیر کل (دسترسی کامل به تمام بخش‌ها)</option>
                    <option value="ثبت و رهگیری">ثبت سفارش و رهگیری محموله‌ها</option>
                    <option value="امور مالی">دسترسی به فاکتورها و کیف پول</option>
                    <option value="صرفاً مشاهده و گزارش">صرفاً مشاهده و گزارش‌گیری</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  ارسال دعوت‌نامه و ایجاد دسترسی
                </button>
              </div>
            </form>
          )}

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs">اعضای مجاز سازمان صاحب بار ({userOrgName})</h3>
              <span className="text-[11px] text-slate-400">کنترل دسترسی مبتنی بر نقش (RBAC)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
                    <th className="p-3.5">نام و مشخصات</th>
                    <th className="p-3.5">نقش سازمانی</th>
                    <th className="p-3.5">سطح دسترسی پرتال</th>
                    <th className="p-3.5">وضعیت و آخرین فعالیت</th>
                    <th className="p-3.5 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{member.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{member.phone} • {member.email}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-slate-800">{member.role}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {member.accessLevel}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>{member.lastActive}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => setTeamMembers((prev) => (prev || []).filter((m) => m?.id !== member?.id))}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. NOTIFICATIONS PREFERENCES */}
      {activeTab === 'notifications' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              تنظیم کانال‌های اطلاع‌رسانی و رویدادهای محموله
            </h3>
            <p className="text-xs text-slate-400 mt-1">تعیین پیامک‌ها و ایمیل‌های خودکار برای تیم عملیات و تحویل‌گیرندگان</p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-xl cursor-pointer hover:bg-slate-100">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 text-xs block">پیامک اعزام ناوگان و حرکت از مبدأ</span>
                <span className="text-[11px] text-slate-500">ارسال نام راننده، شماره تماس و پلاک خودرو برای انباردار مبدأ</span>
              </div>
              <input
                type="checkbox"
                checked={notifySmsOnDispatch}
                onChange={(e) => setNotifySmsOnDispatch(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-xl cursor-pointer hover:bg-slate-100">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 text-xs block">پیامک رسیدن محموله به مقصد و تخلیه بار</span>
                <span className="text-[11px] text-slate-500">ارسال اعلان فوری به محض تحویل قطعی محموله به خریدار</span>
              </div>
              <input
                type="checkbox"
                checked={notifySmsOnArrival}
                onChange={(e) => setNotifySmsOnArrival(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-xl cursor-pointer hover:bg-slate-100">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 text-xs block">ارسال ایمیل فاکتور رسمی و صورتحساب‌های دوره‌ای</span>
                <span className="text-[11px] text-slate-500">ارسال فایل PDF صورتحساب و فایل اکسل ریز بارنامه‌ها به واحد حسابداری</span>
              </div>
              <input
                type="checkbox"
                checked={notifyEmailOnInvoice}
                onChange={(e) => setNotifyEmailOnInvoice(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-xl cursor-pointer hover:bg-slate-100">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 text-xs block">ارسال ایمیل تاییدیه تحویل بار (Digital POD)</span>
                <span className="text-[11px] text-slate-500">ارسال نسخه اسکن‌شده یا امضای دیجیتال گیرنده بلافاصله پس از ثبت در سیستم</span>
              </div>
              <input
                type="checkbox"
                checked={notifyEmailOnPod}
                onChange={(e) => setNotifyEmailOnPod(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => alert('تنظیمات اطلاع‌رسانی با موفقیت ذخیره گردید.')}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              ذخیره تغییرات اطلاع‌رسانی
            </button>
          </div>
        </div>
      )}

      {/* 3. DEVELOPER HUB & API KEYS */}
      {activeTab === 'api_hub' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-800 text-xs">اتصال نرم‌افزارهای سازمانی (ERP / SAP / سپیدار / راهکاران)</h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                REST API v2.4 فعال
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              با استفاده از کلید اختصاصی زیر، می‌توانید نرم‌افزار انبارداری یا فروش خود را مستقیماً به موتور استعلام قیمت و صدور خودکار بارنامه متصل کنید.
            </p>

            {/* API Key Box */}
            <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>کلید احراز هویت اختصاصی شرکت (Live API Key):</span>
                <button
                  type="button"
                  onClick={handleRegenerateKey}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-[11px] cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>تولید مجدد کلید (Regenerate)</span>
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700">
                <code className="font-mono text-sm font-bold text-amber-300 tracking-wider">
                  {apiKey}
                </code>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'کپی شد' : 'کپی کلید'}</span>
                </button>
              </div>
            </div>

            {/* Sample cURL Code Snippet */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-700 block">نمونه کد فراخوانی وب‌سرویس استعلام نرخ (cURL):</span>
              <pre className="bg-slate-900 text-amber-200 p-3 rounded-xl text-[11px] font-mono overflow-x-auto text-left dir-ltr">
{`curl -X POST https://api.pricing-os.ir/v2/quotes \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "origin": "Isfahan",
    "destination": "Tehran",
    "weight_tons": 22.0,
    "truck_type": "flatbed_18w"
  }'`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
