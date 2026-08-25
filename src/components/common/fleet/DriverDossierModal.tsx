import React, { useState } from 'react';
import {
  X,
  User,
  Truck,
  CreditCard,
  FileCheck2,
  Award,
  ShieldCheck,
  FileText,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Sparkles,
  Phone,
  Shield,
  Download,
} from 'lucide-react';
import { motion } from 'motion/react';
import { CarrierDriver } from '../../../types/pricing';
import { IranLicensePlate } from '../IranLicensePlate';

interface DriverDossierModalProps {
  driver: CarrierDriver | null;
  onClose: () => void;
}

export const DriverDossierModal: React.FC<DriverDossierModalProps> = ({ driver, onClose }) => {
  const [activeDossierTab, setActiveDossierTab] = useState<'all' | 'driver' | 'vehicle'>('all');

  if (!driver) return null;

  const { identityDocs, vehicleDocs } = driver;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md ring-4 ring-amber-500/20">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg font-title text-white">
                  پرونده جامع الکترونیکی راننده و ناوگان
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                  سازمان راهداری RMTO
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                شناسه یکتا: <span className="font-mono text-amber-300 font-bold">{driver.id}</span> | کد ملی: <span className="font-mono text-white">{identityDocs.nationalIdNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer"
              title="چاپ پرونده جامع"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation & Summary Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveDossierTab('all')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeDossierTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              مشاهده کل پرونده (۱۱ مدرک)
            </button>
            <button
              type="button"
              onClick={() => setActiveDossierTab('driver')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeDossierTab === 'driver'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              مدارک هویتی و سلامت راننده
            </button>
            <button
              type="button"
              onClick={() => setActiveDossierTab('vehicle')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeDossierTab === 'vehicle'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              مدارک فنی و بیمه‌ای ناوگان
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              مجوز حمل بار برون‌شهری فعال
            </span>
          </div>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Driver & Vehicle Quick Hero Card */}
          <div className="p-5 bg-gradient-to-br from-amber-50/70 via-white to-slate-50 rounded-2xl border border-amber-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={driver.avatar}
                  alt={driver.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-black text-slate-950">{driver.fullName}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {driver.status === 'active' ? 'آماده اعزام' : 'در حال سفر'}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium mt-0.5">
                    شماره همراه: <span className="font-mono text-slate-900 font-bold">{identityDocs.mobilePhone || 'ثبت نشده'}</span>
                  </p>
                  <p className="text-slate-600 text-[11px] mt-1">
                    عضویت از تاریخ: <span className="font-mono">{driver.joinedDate}</span> | سفرهای تکمیل شده: <span className="font-bold text-slate-900">{driver.totalTrips} سفر</span>
                  </p>
                </div>
              </div>

              {/* Iranian Plate Display */}
              <div className="flex flex-col items-start sm:items-end gap-1 self-start sm:self-center">
                <span className="text-[10px] text-slate-500 font-bold">پلاک انتظامی ناوگان:</span>
                <IranLicensePlate plateString={vehicleDocs.plateNumber} size="lg" interactive />
              </div>
            </div>
          </div>

          {/* SECTION A: DRIVER QUALIFICATIONS */}
          {(activeDossierTab === 'all' || activeDossierTab === 'driver') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <User className="w-4 h-4 text-amber-600" />
                <h4 className="font-black text-slate-900">بخش اول: مدارک احراز هویت، گواهینامه و سلامت راننده</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* 1. Identity */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      کد ملی و شناسنامه
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">شاهکار Verified</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>کد ملی:</span>
                      <span className="font-mono font-bold text-slate-900">{identityDocs.nationalIdNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>شماره شناسنامه:</span>
                      <span className="font-mono text-slate-900">{identityDocs.birthCertificateNo || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>تاریخ تولد:</span>
                      <span className="font-mono text-slate-900">{identityDocs.birthDate || '---'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Smart Card */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                      کارت هوشمند راهداری
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">RMTO Active</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>شماره کارت هوشمند:</span>
                      <span className="font-mono font-bold text-emerald-800">{identityDocs.smartCardNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>تاریخ صدور:</span>
                      <span className="font-mono text-slate-900">{identityDocs.smartCardIssueDate || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>تاریخ پایان اعتبار:</span>
                      <span className="font-mono font-bold text-emerald-700">{identityDocs.smartCardExpiryDate}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Driver License */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-sky-600" />
                      گواهینامه رانندگی
                    </span>
                    <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-bold">پایه یک مجاز</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>نوع گواهینامه:</span>
                      <span className="font-bold text-slate-900">
                        {identityDocs.licenseType === 'grade1' ? 'پایه یک ترانزیت' : identityDocs.licenseType === 'grade2' ? 'پایه دو' : 'ویژه'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>شماره سریال:</span>
                      <span className="font-mono font-bold text-slate-900">{identityDocs.licenseNumber || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>انقضای اعتبار:</span>
                      <span className="font-mono text-slate-900">{identityDocs.licenseExpiryDate || '---'}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Health Card */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      کارت سلامت طب کار
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">تأییدیه سلامت</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>شماره پرونده سلامت:</span>
                      <span className="font-mono font-bold text-slate-900">{identityDocs.healthCardNumber || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>تاریخ پایان اعتبار:</span>
                      <span className="font-mono font-bold text-slate-900">{identityDocs.healthCardExpiryDate || '---'}</span>
                    </div>
                  </div>
                </div>

                {/* 5. Criminal record & Drug test */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-700" />
                      عدم سوءپیشینه و اعتیاد
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">منفی و معتبر</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>شماره گواهی:</span>
                      <span className="font-mono text-slate-900">{identityDocs.noCriminalRecordNumber || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>نتیجه آزمایش عدم اعتیاد:</span>
                      <span className="font-bold text-emerald-700">منفی (مورد تأیید)</span>
                    </div>
                  </div>
                </div>

                {/* 6. Police Logbook */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      دفترچه ثبت ساعت پلیس‌راه
                    </span>
                    <span className="text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                      {identityDocs.hasLogbook ? 'مشمول ثبت ساعت' : 'غیر مشمول'}
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>شماره سریال دفترچه:</span>
                      <span className="font-mono text-slate-900">{identityDocs.logbookNumber || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>آخرین مهر کنترل پلیس‌راه:</span>
                      <span className="font-mono text-slate-900">{identityDocs.logbookLastCheckDate || '---'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION B: VEHICLE FLEET SPECIFICATIONS */}
          {(activeDossierTab === 'all' || activeDossierTab === 'vehicle') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <h4 className="font-black text-slate-900">بخش دوم: اسناد فنی، معاینه مکانیزه، هوشمند و بیمه‌نامه‌های ناوگان</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* 1. Vehicle specs */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      مشخصات و کلاس بارگیر
                    </span>
                    <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                      {vehicleDocs.ownershipType === 'self' ? 'خودمالک' : vehicleDocs.ownershipType === 'company' ? 'ملکی شرکت' : 'استیجاری'}
                    </span>
                  </div>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>پلاک انتظامی:</span>
                      <IranLicensePlate plateString={vehicleDocs.plateNumber} size="xs" />
                    </div>
                    <div className="flex justify-between">
                      <span>نوع خودرو:</span>
                      <span className="font-bold text-slate-900">{vehicleDocs.vehicleType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ظرفیت مجاز ناخالص:</span>
                      <span className="font-mono font-bold text-slate-900">{vehicleDocs.maxAllowedCapacityTons} تن</span>
                    </div>
                    <div className="flex justify-between">
                      <span>شماره شاسی VIN:</span>
                      <span className="font-mono text-slate-900">{vehicleDocs.vinCode || '---'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Fleet Smart Card */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                      کارت هوشمند ناوگان
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">معتبر راهداری</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>شماره هوشمند ناوگان:</span>
                      <span className="font-mono font-bold text-slate-900">{vehicleDocs.fleetSmartCardNumber || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>تاریخ پایان اعتبار:</span>
                      <span className="font-mono font-bold text-emerald-700">{vehicleDocs.fleetSmartCardExpiryDate || '---'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Technical Inspection */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                      معاینه فنی مکانیزه
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">مکانیزه تایید شد</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>شماره گواهی آزمون:</span>
                      <span className="font-mono font-bold text-slate-900">{vehicleDocs.technicalInspectionDocNo || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>نام مرکز آزمون:</span>
                      <span className="text-slate-900 truncate max-w-[150px]">{vehicleDocs.technicalInspectionCenterName || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>تاریخ اعتبار:</span>
                      <span className="font-mono text-slate-900">{vehicleDocs.technicalInspectionExpiryDate || '---'}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Insurance Policy */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      بیمه‌نامه شخص ثالث
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">{vehicleDocs.thirdPartyInsuranceProvider}</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>شماره بیمه‌نامه:</span>
                      <span className="font-mono text-slate-900">{vehicleDocs.thirdPartyPolicyNumber || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>تاریخ پایان بیمه:</span>
                      <span className="font-mono font-bold text-slate-900">{vehicleDocs.thirdPartyExpiryDate || '---'}</span>
                    </div>
                  </div>
                </div>

                {/* 5. Tank inspection / ADR */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      مجوز معاینه مخزن / ADR
                    </span>
                    <span className="text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                      {vehicleDocs.hasTankInspectionPermit ? 'مشمول مجوز' : 'غیرمشمول'}
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>نوع کاربری مخزن:</span>
                      <span className="font-bold text-slate-900">{vehicleDocs.tankType === 'cng' ? 'گازسوز CNG' : vehicleDocs.tankType === 'hazardous_adr' ? 'شیمیایی ADR' : 'عادی'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>شماره تاییدیه هیدروستاتیک:</span>
                      <span className="font-mono text-slate-900">{vehicleDocs.tankInspectionPermitNo || '---'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>پرونده دارای اصالت دیجیتال و مهر استعلام راهداری است.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            بستن پرونده
          </button>
        </div>
      </motion.div>
    </div>
  );
};
