import React, { useState } from 'react';
import {
  MapPin,
  Package,
  Plus,
  Edit2,
  Trash2,
  Building,
  Phone,
  User,
  Layers,
  Sparkles,
  Check,
  CheckCircle2,
} from 'lucide-react';
import {
  INITIAL_SAVED_LOCATIONS,
  INITIAL_SAVED_COMMODITIES,
  SavedLocation,
  SavedCommodity,
} from '../../data/mockShipperData';

export const ShipperMasterDataView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'locations' | 'commodities'>('locations');
  const [locations, setLocations] = useState<SavedLocation[]>(INITIAL_SAVED_LOCATIONS);
  const [commodities, setCommodities] = useState<SavedCommodity[]>(INITIAL_SAVED_COMMODITIES);

  // New Location Form State
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocTitle, setNewLocTitle] = useState('');
  const [newLocCategory, setNewLocCategory] = useState<'origin' | 'destination' | 'both'>('destination');
  const [newLocCity, setNewLocCity] = useState('');
  const [newLocProvince, setNewLocProvince] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocPostalCode, setNewLocPostalCode] = useState('');
  const [newLocContactPerson, setNewLocContactPerson] = useState('');
  const [newLocContactPhone, setNewLocContactPhone] = useState('');

  // New Commodity Form State
  const [isAddingCommodity, setIsAddingCommodity] = useState(false);
  const [newComTitle, setNewComTitle] = useState('');
  const [newComCategory, setNewComCategory] = useState<'عادی' | 'صنعتی' | 'خطرناک' | 'یخچالی' | 'فله'>('صنعتی');
  const [newComWeightKg, setNewComWeightKg] = useState(15000);
  const [newComLength, setNewComLength] = useState(12);
  const [newComWidth, setNewComWidth] = useState(2.4);
  const [newComHeight, setNewComHeight] = useState(1.5);
  const [newComTruckType, setNewComTruckType] = useState('تریلی کفی ۱۸ چرخ');
  const [newComPackaging, setNewComPackaging] = useState('پالت شرینک‌شده');
  const [newComValueToman, setNewComValueToman] = useState(250000000);

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocTitle || !newLocCity) return;
    const newLoc: SavedLocation = {
      id: `LOC-${Date.now()}`,
      title: newLocTitle,
      category: newLocCategory,
      city: newLocCity,
      province: newLocProvince || 'تهران',
      address: newLocAddress,
      postalCode: newLocPostalCode,
      contactPerson: newLocContactPerson,
      contactPhone: newLocContactPhone,
    };
    setLocations([...locations, newLoc]);
    setIsAddingLocation(false);
    // Reset
    setNewLocTitle('');
    setNewLocCity('');
    setNewLocAddress('');
  };

  const handleSaveCommodity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComTitle) return;
    const newCom: SavedCommodity = {
      id: `COM-${Date.now()}`,
      title: newComTitle,
      category: newComCategory,
      unitWeightKg: newComWeightKg,
      standardDimensions: { lengthM: newComLength, widthM: newComWidth, heightM: newComHeight },
      defaultTruckType: newComTruckType,
      packagingType: newComPackaging,
      declaredValueRials: newComValueToman * 10,
    };
    setCommodities([...commodities, newCom]);
    setIsAddingCommodity(false);
    setNewComTitle('');
  };

  const handleDeleteLocation = (id: string) => {
    setLocations((prev) => (prev || []).filter((l) => l?.id !== id));
  };

  const handleDeleteCommodity = (id: string) => {
    setCommodities((prev) => (prev || []).filter((c) => c?.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Toggle Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('locations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'locations'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>دفترچه آدرس‌ها و انبارها ({locations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('commodities')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'commodities'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>کالاهای منتخب و مشخصات باربری ({commodities.length})</span>
          </button>
        </div>

        {activeTab === 'locations' ? (
          <button
            type="button"
            onClick={() => setIsAddingLocation(!isAddingLocation)}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن آدرس / انبار جدید</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingCommodity(!isAddingCommodity)}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>تعریف کالای منتخب جدید</span>
          </button>
        )}
      </div>

      {/* 1. LOCATIONS TAB */}
      {activeTab === 'locations' && (
        <div className="space-y-4">
          {/* Add Location Form */}
          {isAddingLocation && (
            <form onSubmit={handleSaveLocation} className="bg-amber-50/50 p-5 rounded-2xl border border-amber-300 shadow-xs space-y-4 animate-in slide-in-from-top-2">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                ثبت آدرس، کارخانه یا انبار جدید
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">عنوان انبار / کارخانه:</label>
                  <input
                    type="text"
                    required
                    value={newLocTitle}
                    onChange={(e) => setNewLocTitle(e.target.value)}
                    placeholder="مثلاً: انبار شماره ۲ غرب"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">نوع موقعیت:</label>
                  <select
                    value={newLocCategory}
                    onChange={(e) => setNewLocCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  >
                    <option value="origin">مبدأ بارگیری</option>
                    <option value="destination">مقصد تخلیه</option>
                    <option value="both">هر دو (مبدأ و مقصد)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">شهر و استان:</label>
                  <input
                    type="text"
                    required
                    value={newLocCity}
                    onChange={(e) => setNewLocCity(e.target.value)}
                    placeholder="مثلاً: اصفهان"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 text-xs font-bold mb-1">آدرس پستی دقیق:</label>
                  <input
                    type="text"
                    value={newLocAddress}
                    onChange={(e) => setNewLocAddress(e.target.value)}
                    placeholder="کیلومتر جاده، شهرک صنعتی، خیابان، پلاک"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">کد پستی ۱۰ رقمی:</label>
                  <input
                    type="text"
                    value={newLocPostalCode}
                    onChange={(e) => setNewLocPostalCode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">نام شخص تحویل‌گیرنده / انباردار:</label>
                  <input
                    type="text"
                    value={newLocContactPerson}
                    onChange={(e) => setNewLocContactPerson(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">شماره تماس ثابت / همراه هماهنگی:</label>
                  <input
                    type="text"
                    value={newLocContactPhone}
                    onChange={(e) => setNewLocContactPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingLocation(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  ذخیره آدرس در دفترچه
                </button>
              </div>
            </form>
          )}

          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((loc) => (
              <div key={loc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{loc.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{loc.city} ({loc.province})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {loc.isDefault && (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        پیش‌فرض
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteLocation(loc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <div className="leading-relaxed">{loc.address}</div>
                  <div className="text-[10px] text-slate-400 font-mono">کد پستی: {loc.postalCode}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    تحویل‌گیرنده: <strong>{loc.contactPerson}</strong>
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {loc.contactPhone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. COMMODITIES TAB */}
      {activeTab === 'commodities' && (
        <div className="space-y-4">
          {/* Add Commodity Form */}
          {isAddingCommodity && (
            <form onSubmit={handleSaveCommodity} className="bg-amber-50/50 p-5 rounded-2xl border border-amber-300 shadow-xs space-y-4 animate-in slide-in-from-top-2">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                تعریف کالای پرتکرار سازمانی
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">نام و شرح کالا:</label>
                  <input
                    type="text"
                    required
                    value={newComTitle}
                    onChange={(e) => setNewComTitle(e.target.value)}
                    placeholder="مثلاً: پالت کاشی پرسلانی"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">ماهیت باربری:</label>
                  <select
                    value={newComCategory}
                    onChange={(e) => setNewComCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  >
                    <option value="صنعتی">صنعتی سنگین</option>
                    <option value="عادی">عادی استاندارد</option>
                    <option value="خطرناک">خطرناک (شیمیایی/ADR)</option>
                    <option value="یخچالی">فاسدشدنی (یخچالی)</option>
                    <option value="فله">فله و معدنی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">وزن کل هر سرویس (کیلوگرم):</label>
                  <input
                    type="number"
                    value={newComWeightKg}
                    onChange={(e) => setNewComWeightKg(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">نوع ناوگان پیش‌فرض:</label>
                  <input
                    type="text"
                    value={newComTruckType}
                    onChange={(e) => setNewComTruckType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">نوع بسته‌بندی:</label>
                  <input
                    type="text"
                    value={newComPackaging}
                    onChange={(e) => setNewComPackaging(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1">ارزش ریالی اظهارشده (تومان):</label>
                  <input
                    type="number"
                    value={newComValueToman}
                    onChange={(e) => setNewComValueToman(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCommodity(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  ذخیره کالا در الگوها
                </button>
              </div>
            </form>
          )}

          {/* Commodities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commodities.map((com) => (
              <div key={com.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{com.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">دسته‌بندی: {com.category}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCommodity(com.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] block">وزن استاندارد:</span>
                    <strong className="font-mono text-slate-800 font-bold">{(com.unitWeightKg / 1000)} تن</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">ناوگان بهینه:</span>
                    <strong className="font-mono text-slate-800 text-[11px]">{com.defaultTruckType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">بسته‌بندی:</span>
                    <span className="text-slate-700 text-[11px]">{com.packagingType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">ارزش بیمه‌ای:</span>
                    <span className="font-mono text-slate-800 font-bold">{(com.declaredValueRials / 10).toLocaleString('fa-IR')} تومان</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
