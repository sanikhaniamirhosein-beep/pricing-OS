import React, { useState, useEffect } from 'react';
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
  Briefcase,
  Warehouse,
  DollarSign,
  CheckCircle2,
  Lock,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { ShipperTeamMember } from '../../data/mockShipperData';
import { usePricing } from '../../store/PricingContext';
import {
  SHIPPER_ROLE_DETAILS,
  SHIPPER_AVAILABLE_LOCATIONS,
  ShipperUserRole,
  getShipperRoleDetail,
} from '../../data/shipperRolesConfig';
import { ModernSelect } from '../common/menus/ModernSelect';
import { ShipperRetailNotificationsView } from './ShipperRetailNotificationsView';

export const ShipperSettingsView: React.FC = () => {
  const {
    currentShipperOrg,
    userOrgName,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    shipperUserRole,
    setShipperUserRole,
    shipperLocationScope,
    setShipperLocationScope,
    shipperApprovalLimitToman,
    setShipperApprovalLimitToman,
  } = usePricing();

  const isRetail =
    currentShipperOrg?.entityType === 'individual' ||
    userOrgName?.includes('شخصی') ||
    userOrgName?.includes('خرد') ||
    shipperUserRole === 'Individual Shipper / Personal';

  if (isRetail) {
    return <ShipperRetailNotificationsView />;
  }

  const [activeTab, setActiveTab] = useState<'team' | 'roles_matrix' | 'notifications' | 'api_hub'>('team');
  const [teamMembers, setTeamMembers] = useState<ShipperTeamMember[]>(currentShipperOrg?.teamMembers || []);

  useEffect(() => {
    if (currentShipperOrg) {
      setTeamMembers(currentShipperOrg.teamMembers || []);
    }
  }, [currentShipperOrg]);

  // New Team Member Form
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<ShipperUserRole>('Logistics Specialist / Coordinator');
  const [newMemberLocation, setNewMemberLocation] = useState<string>('انبار مرکزی - اصفهان');
  const [newMemberApprovalLimitMillion, setNewMemberApprovalLimitMillion] = useState<number>(100);

  // Notification Preferences
  const [notifySmsOnDispatch, setNotifySmsOnDispatch] = useState(true);
  const [notifySmsOnArrival, setNotifySmsOnArrival] = useState(true);
  const [notifyEmailOnInvoice, setNotifyEmailOnInvoice] = useState(true);
  const [notifyEmailOnPod, setNotifyEmailOnPod] = useState(true);
  const [notifyPushLiveEta, setNotifyPushLiveEta] = useState(false);

  // API Token State
  const [apiKey, setApiKey] = useState('shp_live_9941a0b3c882194f7e2d');
  const [isCopied, setIsCopied] = useState(false);

  const currentRoleDetail = getShipperRoleDetail(shipperUserRole);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberPhone) return;

    const roleConfig = getShipperRoleDetail(newMemberRole);
    const newMember: ShipperTeamMember = {
      id: `USR-${Date.now()}`,
      fullName: newMemberName,
      email: newMemberEmail || `${newMemberName.toLowerCase().replace(/\s+/g, '.')}@msc.ir`,
      phone: newMemberPhone,
      role: roleConfig.titleFa as any,
      accessLevel: roleConfig.levelBadge as any,
      lastActive: 'دعوت‌نامه پیامکی ارسال شد',
      status: 'active',
      locationScope: roleConfig.locationScoped ? newMemberLocation : undefined,
      approvalLimitToman: roleConfig.hasApprovalLimit ? newMemberApprovalLimitMillion * 1000000 : undefined,
    };

    setTeamMembers([...teamMembers, newMember]);
    setIsAddingMember(false);
    setNewMemberName('');
    setNewMemberPhone('');
    setNewMemberEmail('');
  };

  const handleSwitchActiveRole = (role: ShipperUserRole, location?: string, limit?: number) => {
    const detail = getShipperRoleDetail(role);
    setShipperUserRole(role);
    setUserName(detail.defaultUserName);
    setUserEmail(detail.defaultUserEmail);
    if (location) {
      setShipperLocationScope(location);
    } else if (detail.locationScoped) {
      setShipperLocationScope(detail.defaultLocation);
    } else {
      setShipperLocationScope('همه انبارها و کارخانجات');
    }

    if (limit !== undefined) {
      setShipperApprovalLimitToman(limit);
    } else if (detail.hasApprovalLimit) {
      setShipperApprovalLimitToman(detail.defaultApprovalLimitToman);
    } else {
      setShipperApprovalLimitToman(0);
    }

    alert(`نقش جاری پرتال به «${detail.titleFa}» تغییر یافت. دسترسی‌ها و فیلترهای سامانه بلافاصله اعمال شدند.`);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    if (
      window.confirm(
        'آیا از بازتولید توکن API اطمینان دارید؟ سیستم‌های متصل قبلی تا زمان به‌روزرسانی توکن جدید با خطای احراز هویت مواجه خواهند شد.'
      )
    ) {
      setApiKey(`shp_live_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 10)}`);
      alert('کلید API جدید با موفقیت صادر شد.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Settings Navigation */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'team', label: 'مدیریت پرسنل و نقش‌های سازمان', icon: Users, count: (teamMembers || []).length },
            { id: 'roles_matrix', label: 'ماتریس وظایف و دسترسی‌ها (RBAC)', icon: Shield },
            { id: 'notifications', label: 'تنظیمات اطلاع‌رسانی پیامک/ایمیل', icon: Bell },
            { id: 'api_hub', label: 'یکپارچه‌سازی و کلیدهای API (ERP Hub)', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-xs'
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
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>تعریف کاربر جدید با نقش و محدوده</span>
          </button>
        )}
      </div>

      {/* 1. TEAM MANAGEMENT */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          {/* Current Active Persona Banner */}
          <div className="bg-gradient-to-r from-sky-50 to-teal-50 p-4 rounded-3xl border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">نقش فعال جلسه شما:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white font-bold text-[11px]">
                    {currentRoleDetail.titleFa}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {currentRoleDetail.accessScopeFa} • کاربر: <strong>{userName}</strong>
                </p>
              </div>
            </div>

            {currentRoleDetail.locationScoped && (
              <div className="text-amber-900 bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200 font-bold text-[11px]">
                موقعیت فعال: {shipperLocationScope}
              </div>
            )}

            {currentRoleDetail.hasApprovalLimit && (
              <div className="text-emerald-900 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold text-[11px]">
                سقف تایید: {(shipperApprovalLimitToman / 1000000).toLocaleString('fa-IR')} میلیون تومان
              </div>
            )}
          </div>

          {/* Add Team Member Modal/Inline */}
          {isAddingMember && (
            <form
              onSubmit={handleAddMember}
              className="bg-white p-5 rounded-3xl border border-sky-300 shadow-sm space-y-4 animate-in slide-in-from-top-2"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-600" />
                  تعریف و انتصاب نقش پرسنل سازمان در پرتال صاحب بار
                </h3>
                <span className="text-[11px] text-slate-400">انطباق ۱۰۰٪ با ساختار دسترسی لجستیک شرکتی</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="مثلاً: علی رضایی"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">شماره تماس همراه:</label>
                  <input
                    type="text"
                    required
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">ایمیل سازمانی:</label>
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="a.rezaei@msc.ir"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:bg-white"
                  />
                </div>
              </div>

              {/* Role Picker */}
              <div className="space-y-2 pt-2">
                <label className="block text-slate-800 text-xs font-bold">انتخاب نقش و حدود اختیارات:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {SHIPPER_ROLE_DETAILS.map((r) => {
                    const isSelected = newMemberRole === r.role;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setNewMemberRole(r.role)}
                        className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50 border-sky-500 text-sky-950 ring-1 ring-sky-400'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs">{r.titleFa}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{r.titleEn}</div>
                        <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {r.accessScopeFa}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location Scope for Warehouse Operator */}
              {newMemberRole === 'Warehouse / Dispatch Operator' && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                  <label className="block text-amber-950 text-xs font-bold flex items-center gap-1.5">
                    <Warehouse className="w-4 h-4 text-amber-600" />
                    محدوده مکانی و انبار تحت نظارت (Location Scope):
                  </label>
                  <ModernSelect
                    id="new-member-location-scope"
                    value={newMemberLocation}
                    onChange={(val) => setNewMemberLocation(val)}
                    label="انبار یا کارخانه مجاز:"
                    options={SHIPPER_AVAILABLE_LOCATIONS.map((loc) => ({
                      value: loc,
                      label: loc,
                    }))}
                  />
                  <p className="text-[10px] text-amber-800">
                    این کاربر تنها بارهای ورودی/خروجی این انبار را مشاهده و امکان تایید بارگیری و آپلود رسید (POD) خواهد داشت.
                  </p>
                </div>
              )}

              {/* Approval Limit for Logistics Coordinator */}
              {newMemberRole === 'Logistics Specialist / Coordinator' && (
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                  <label className="block text-emerald-950 text-xs font-bold flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    سقف تایید مالی مستقیم سفارش (Approval Threshold):
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={10}
                      max={500}
                      step={10}
                      value={newMemberApprovalLimitMillion}
                      onChange={(e) => setNewMemberApprovalLimitMillion(Number(e.target.value))}
                      className="w-32 bg-white border border-emerald-300 rounded-xl p-2 text-xs font-mono font-bold text-center"
                    />
                    <span className="text-xs font-bold text-emerald-900">میلیون تومان</span>
                  </div>
                  <p className="text-[10px] text-emerald-800">
                    سفارش‌های با ارزش بیش از این مبلغ پس از ثبت، در وضعیت «نیازمند تایید مدیر ارشد» قرار خواهند گرفت.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  تأیید و صدور دسترسی
                </button>
              </div>
            </form>
          )}

          {/* Members Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs">
                اعضای مجاز و ساختار سازمانی صاحب بار ({userOrgName})
              </h3>
              <span className="text-[11px] text-slate-400">کنترل دسترسی مبتنی بر نقش (RBAC) و ماتریس وظایف</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
                    <th className="p-3.5">نام و هویت پرسنل</th>
                    <th className="p-3.5">نقش سازمانی</th>
                    <th className="p-3.5">محدوده مکانی (Location Scope)</th>
                    <th className="p-3.5">سقف تایید مالی</th>
                    <th className="p-3.5">وضعیت</th>
                    <th className="p-3.5 text-center">شبیه‌سازی و فعال‌سازی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {/* Standard predefined personas + user created */}
                  {SHIPPER_ROLE_DETAILS.map((r) => {
                    const isCurrent = shipperUserRole === r.role;
                    return (
                      <tr key={r.id} className={isCurrent ? 'bg-sky-50/60 font-semibold' : 'hover:bg-slate-50/70'}>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-sky-600/10 text-sky-700 font-bold flex items-center justify-center text-xs">
                              {r.defaultUserName.substring(0, 1)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{r.defaultUserName}</span>
                                {isCurrent && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-600 text-white font-normal">
                                    نقش فعال شما
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">{r.defaultUserEmail}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-slate-800">{r.titleFa}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{r.titleEn}</div>
                        </td>

                        <td className="p-3.5">
                          {r.locationScoped ? (
                            <span className="px-2 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold">
                              {r.defaultLocation}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">سراسری (همه انبارها)</span>
                          )}
                        </td>

                        <td className="p-3.5 font-mono">
                          {r.hasApprovalLimit ? (
                            <span className="text-emerald-700 font-bold">
                              {(r.defaultApprovalLimitToman / 1000000).toLocaleString('fa-IR')} م تومان
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">
                            فعال
                          </span>
                        </td>

                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleSwitchActiveRole(r.role)}
                            disabled={isCurrent}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-sky-600 text-white opacity-80 cursor-default'
                                : 'bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200'
                            }`}
                          >
                            {isCurrent ? 'نقش فعال' : 'فعال‌سازی این نقش'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ROLES & PERMISSIONS MATRIX (RBAC) */}
      {activeTab === 'roles_matrix' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-600" />
              ماتریس جامع وظایف و سطوح دسترسی پرسنل صاحب بار (Shipper RBAC Matrix)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              این ماتریس تفکیک وظایف (Segregation of Duties)، سقف‌های اعتباری و محدوده‌های نظارت مکانی هر عنوان شغلی در پورتال شرکتی را مشخص می‌نماید.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SHIPPER_ROLE_DETAILS.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{r.titleFa}</h4>
                    <p className="text-xs text-slate-400 font-mono">{r.titleEn}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold">
                    {r.levelBadge}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">شرح دسترسی‌ها و اختیارات:</span>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                    {r.accessScopeFa}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">وظایف و کارکردهای کلیدی:</span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {r.dutiesFa.map((duty, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{duty}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {r.locationScoped && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-[10px] font-bold">
                        فیلتر مکانی انبار
                      </span>
                    )}
                    {r.hasApprovalLimit && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md text-[10px] font-bold">
                        سقف تایید ۱۰۰ م تومان
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSwitchActiveRole(r.role)}
                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold rounded-xl border border-sky-200 text-xs cursor-pointer"
                  >
                    شبیه‌سازی دسترسی
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-xs">تنظیمات ارسال هشدارهای پیامکی و ایمیل لجستیک</h3>
          <div className="space-y-3 divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-bold text-slate-800 block">پیامک تخصیص راننده و حرکت ناوگان</span>
                <span className="text-[11px] text-slate-400">ارسال نام راننده، شماره تماس و پلاک کامیون پس از بارگیری</span>
              </div>
              <input
                type="checkbox"
                checked={notifySmsOnDispatch}
                onChange={(e) => setNotifySmsOnDispatch(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">پیامک تحویل نهایی و تخلیه در مقصد</span>
                <span className="text-[11px] text-slate-400">اطلاع‌رسانی فوری هنگام تحویل بار و ثبت امضای گیرنده</span>
              </div>
              <input
                type="checkbox"
                checked={notifySmsOnArrival}
                onChange={(e) => setNotifySmsOnArrival(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">ایمیل صدور صورتحساب دوره‌ای و فاکتور رسمی</span>
                <span className="text-[11px] text-slate-400">ارسال خودکار فایل PDF فاکتور معتبر سامانه مودیان مالیاتی</span>
              </div>
              <input
                type="checkbox"
                checked={notifyEmailOnInvoice}
                onChange={(e) => setNotifyEmailOnInvoice(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">ارسال تصویر قبض انبار و رسید دیجیتال (POD)</span>
                <span className="text-[11px] text-slate-400">فایل رسید تحویل امضا شده بلافاصله پس از ثبت به کارتابل ارسال می‌شود</span>
              </div>
              <input
                type="checkbox"
                checked={notifyEmailOnPod}
                onChange={(e) => setNotifyEmailOnPod(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. API HUB */}
      {activeTab === 'api_hub' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">کلید اتصال API و وب‌سرویس‌های سازمانی (ERP Integration)</h3>
              <p className="text-xs text-slate-400">اتصال مستقیم به سیستم‌های SAP, همکاران سیستم, راهکاران و سپیدار</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
              محیط عملیاتی (Production)
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">کلید دسترسی سازمانی (Live API Token):</span>
            <div className="flex items-center gap-2">
              <input
                type="password"
                readOnly
                value={apiKey}
                className="flex-1 bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-800"
              />
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-3 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'کپی شد' : 'کپی'}</span>
              </button>
              <button
                type="button"
                onClick={handleRegenerateKey}
                className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>بازتولید</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
