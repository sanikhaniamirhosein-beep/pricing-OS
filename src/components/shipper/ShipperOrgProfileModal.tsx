import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  X,
  Lock,
  Unlock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  CreditCard,
  MapPin,
  Package,
  Plus,
  Trash2,
  UploadCloud,
  FileCheck,
  Clock,
  Phone,
  Mail,
  User,
  Sparkles,
  Layers,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Camera,
  ScanLine,
  Eye,
  Copy,
  Calendar,
  Smartphone,
  Landmark,
  UserCheck,
  BadgeCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePricing } from '../../store/PricingContext';
import {
  ShipperLegalDossier,
  ShipperIndividualProfile,
  ShipperEntityType,
  ShipperHubLocation,
  UploadedDocFile,
  checkShipperProfileCompleteness,
  checkCorporateProfileCompleteness,
  checkIndividualProfileCompleteness,
} from '../../types/shipperLegal';
import { getShipperRoleDetail } from '../../data/shipperRolesConfig';

interface ShipperOrgProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'basic' | 'financial' | 'operations';
}

export const ShipperOrgProfileModal: React.FC<ShipperOrgProfileModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'basic',
}) => {
  const {
    currentShipperOrg,
    updateShipperOrgProfile,
    userOrgName,
    userName,
    userEmail,
    shipperUserRole,
  } = usePricing();

  const currentRoleDetail = getShipperRoleDetail(shipperUserRole);
  const isSeniorAdmin = shipperUserRole === 'Supply Chain Manager / Admin';

  const isRetailUser =
    currentShipperOrg?.entityType === 'individual' ||
    userOrgName?.includes('شخصی') ||
    userOrgName?.includes('خرد') ||
    currentShipperOrg?.nameFa?.includes('شخصی') ||
    currentShipperOrg?.nameFa?.includes('خرد');

  // Entity Type: Corporate (شخص حقوقی / شرکت) | Individual (شخص حقیقی / بار شخصی)
  const [entityType, setEntityType] = useState<ShipperEntityType>(
    isRetailUser ? 'individual' : 'corporate'
  );

  const [activeTab, setActiveTab] = useState<'basic' | 'financial' | 'operations'>(initialTab);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopiedShaba, setIsCopiedShaba] = useState<boolean>(false);

  // States for Real-time Verification Simulations
  const [isVerifyingShahkar, setIsVerifyingShahkar] = useState<boolean>(false);
  const [isVerifyingSabtAhval, setIsVerifyingSabtAhval] = useState<boolean>(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);

  // Corporate Form Data
  const [corpFormData, setCorpFormData] = useState<Partial<ShipperLegalDossier>>({
    companyLegalName: currentShipperOrg?.legalDossier?.companyLegalName || (currentShipperOrg?.nameFa !== 'شرکت فولاد مبارکه اصفهان' ? currentShipperOrg?.nameFa : 'شرکت فولاد مبارکه اصفهان') || '',
    nationalId: currentShipperOrg?.legalDossier?.nationalId || currentShipperOrg?.nationalId || '',
    economicCode: currentShipperOrg?.legalDossier?.economicCode || currentShipperOrg?.economicCode || '',
    registrationNumber: currentShipperOrg?.legalDossier?.registrationNumber || '',
    registrationPlace: currentShipperOrg?.legalDossier?.registrationPlace || '',
    establishmentDate: currentShipperOrg?.legalDossier?.establishmentDate || '',

    representativeName: currentShipperOrg?.legalDossier?.representativeName || currentShipperOrg?.contactPerson || userName || '',
    representativeRole: currentShipperOrg?.legalDossier?.representativeRole || 'مدیر ارشد زنجیره تأمین و لجستیک',
    representativeMobile: currentShipperOrg?.legalDossier?.representativeMobile || '',
    representativeEmail: currentShipperOrg?.legalDossier?.representativeEmail || currentShipperOrg?.email || userEmail || '',
    nationalCodeRepresentative: currentShipperOrg?.legalDossier?.nationalCodeRepresentative || '',

    // Financial & Invoicing
    vatTaxCertificateNumber: currentShipperOrg?.legalDossier?.vatTaxCertificateNumber || '',
    vatTaxExpiryDate: currentShipperOrg?.legalDossier?.vatTaxExpiryDate || '',
    hasVatCertificate: currentShipperOrg?.legalDossier?.hasVatCertificate ?? false,
    headquartersAddress: currentShipperOrg?.legalDossier?.headquartersAddress || currentShipperOrg?.address || '',
    postalCode: currentShipperOrg?.legalDossier?.postalCode || '',
    phoneLandline: currentShipperOrg?.legalDossier?.phoneLandline || currentShipperOrg?.phone || '',
    bankShaba: currentShipperOrg?.legalDossier?.bankShaba || '',
    bankName: currentShipperOrg?.legalDossier?.bankName || '',
    bankAccountNumber: currentShipperOrg?.legalDossier?.bankAccountNumber || '',

    // Uploaded Documents
    officialGazetteDoc: currentShipperOrg?.legalDossier?.officialGazetteDoc,
    ceoNationalCardDoc: currentShipperOrg?.legalDossier?.ceoNationalCardDoc,
    vatDoc: currentShipperOrg?.legalDossier?.vatDoc,

    // Hubs
    hubs: currentShipperOrg?.legalDossier?.hubs || [],
    commonProductTypes: currentShipperOrg?.legalDossier?.commonProductTypes || [],
    standardPackagingTypes: currentShipperOrg?.legalDossier?.standardPackagingTypes || [],
  });

  // Individual Form Data (Personal cargo / Person)
  const [indivFormData, setIndivFormData] = useState<Partial<ShipperIndividualProfile>>({
    fullName: currentShipperOrg?.individualProfile?.fullName || (userName ? userName.replace(/\(.*?\)/g, '').trim() : ''),
    nationalCode: currentShipperOrg?.individualProfile?.nationalCode || '',
    mobileNumber: currentShipperOrg?.individualProfile?.mobileNumber || '',
    birthDate: currentShipperOrg?.individualProfile?.birthDate || '',
    nationalCardDoc: currentShipperOrg?.individualProfile?.nationalCardDoc,
    selfieVerificationDoc: currentShipperOrg?.individualProfile?.selfieVerificationDoc,
    bankCardNumber: currentShipperOrg?.individualProfile?.bankCardNumber || '',
    bankShaba: currentShipperOrg?.individualProfile?.bankShaba || '',
    bankName: currentShipperOrg?.individualProfile?.bankName || '',
    residentialAddress: currentShipperOrg?.individualProfile?.residentialAddress || '',
    postalCode: currentShipperOrg?.individualProfile?.postalCode || '',
    shahkarVerified: currentShipperOrg?.individualProfile?.shahkarVerified ?? false,
    sabtAhvalVerified: currentShipperOrg?.individualProfile?.sabtAhvalVerified ?? false,
    livenessVerified: currentShipperOrg?.individualProfile?.livenessVerified ?? false,
  });

  // Individual Hubs & Warehouses State (مراکز لجستیکی و انبارهای بارگیری شخصی)
  const [indivHubs, setIndivHubs] = useState<ShipperHubLocation[]>(() => {
    if (currentShipperOrg?.savedLocations && currentShipperOrg.savedLocations.length > 0) {
      return currentShipperOrg.savedLocations.map((l) => ({
        id: l.id,
        name: l.title,
        city: l.city,
        province: l.province,
        address: l.address,
        postalCode: l.postalCode,
        contactName: l.contactPerson,
        contactPhone: l.contactPhone,
        isDefaultOrigin: l.category === 'origin' || l.category === 'both',
        isDefaultDest: l.category === 'destination' || l.category === 'both',
      }));
    }
    return [
      {
        id: 'ind-hub-1',
        name: 'انبار / محل بارگیری اصلی غرب تهران',
        city: 'تهران',
        province: 'تهران',
        address: 'بزرگراه فتح، خیابان ۱۷ شهریور، پلاک ۲۴',
        postalCode: '1388145612',
        contactName: userName ? userName.replace(/\(.*?\)/g, '').trim() : 'علی مرادی',
        contactPhone: '09123456789',
        isDefaultOrigin: true,
      },
    ];
  });

  // Sync state when org changes
  useEffect(() => {
    if (currentShipperOrg) {
      const isRet =
        currentShipperOrg.entityType === 'individual' ||
        userOrgName?.includes('شخصی') ||
        userOrgName?.includes('خرد') ||
        currentShipperOrg.nameFa?.includes('شخصی') ||
        currentShipperOrg.nameFa?.includes('خرد');

      setEntityType(isRet ? 'individual' : 'corporate');

      if (currentShipperOrg.legalDossier) {
        setCorpFormData({ ...currentShipperOrg.legalDossier });
      } else if (currentShipperOrg.id !== 'org-shipper-mobarakeh') {
        // For new organizations, keep fields blank so they enter real information
        setCorpFormData({
          companyLegalName: currentShipperOrg.nameFa || userOrgName || '',
          nationalId: currentShipperOrg.nationalId || '',
          economicCode: currentShipperOrg.economicCode || '',
          registrationNumber: '',
          registrationPlace: '',
          establishmentDate: '',
          representativeName: currentShipperOrg.contactPerson || userName || '',
          representativeRole: 'مدیر ارشد لجستیک / زنجیره تأمین',
          representativeMobile: '',
          representativeEmail: currentShipperOrg.email || userEmail || '',
          nationalCodeRepresentative: '',
          vatTaxCertificateNumber: '',
          vatTaxExpiryDate: '',
          hasVatCertificate: false,
          headquartersAddress: currentShipperOrg.address || '',
          postalCode: '',
          phoneLandline: currentShipperOrg.phone || '',
          bankShaba: '',
          bankName: '',
          bankAccountNumber: '',
          officialGazetteDoc: undefined,
          ceoNationalCardDoc: undefined,
          vatDoc: undefined,
          hubs: [],
          commonProductTypes: [],
          standardPackagingTypes: [],
        });
      }

      if (currentShipperOrg.individualProfile) {
        setIndivFormData({ ...currentShipperOrg.individualProfile });
        if (currentShipperOrg.individualProfile.hubs && currentShipperOrg.individualProfile.hubs.length > 0) {
          setIndivHubs([...currentShipperOrg.individualProfile.hubs]);
        } else if (currentShipperOrg.savedLocations && currentShipperOrg.savedLocations.length > 0) {
          setIndivHubs(
            currentShipperOrg.savedLocations.map((l) => ({
              id: l.id,
              name: l.title,
              city: l.city,
              province: l.province,
              address: l.address,
              postalCode: l.postalCode,
              contactName: l.contactPerson,
              contactPhone: l.contactPhone,
              isDefaultOrigin: l.category === 'origin' || l.category === 'both',
              isDefaultDest: l.category === 'destination' || l.category === 'both',
            }))
          );
        }
      } else if (currentShipperOrg.savedLocations && currentShipperOrg.savedLocations.length > 0) {
        setIndivHubs(
          currentShipperOrg.savedLocations.map((l) => ({
            id: l.id,
            name: l.title,
            city: l.city,
            province: l.province,
            address: l.address,
            postalCode: l.postalCode,
            contactName: l.contactPerson,
            contactPhone: l.contactPhone,
            isDefaultOrigin: l.category === 'origin' || l.category === 'both',
            isDefaultDest: l.category === 'destination' || l.category === 'both',
          }))
        );
      }
    }
  }, [currentShipperOrg, userOrgName, userName, userEmail]);

  // Automatically revoke edit mode if active user is not Senior Admin for corporate
  useEffect(() => {
    if (entityType === 'corporate' && !isSeniorAdmin && isEditing) {
      setIsEditing(false);
    }
  }, [entityType, isSeniorAdmin, isEditing]);

  if (!isOpen) return null;

  // Completeness check based on entity type
  const corpCompleteness = checkCorporateProfileCompleteness(corpFormData);
  const indivCompleteness = checkIndividualProfileCompleteness(indivFormData);

  const activeCompleteness = entityType === 'corporate' ? corpCompleteness : indivCompleteness;

  // Handle Hubs for Corporate
  const handleAddHub = () => {
    const newHub: ShipperHubLocation = {
      id: `hub-${Date.now()}`,
      name: 'انبار / مرکز جدید شرکت',
      city: 'تهران',
      province: 'تهران',
      address: '',
      contactName: '',
      contactPhone: '',
    };
    setCorpFormData((prev) => ({
      ...prev,
      hubs: [...(prev.hubs || []), newHub],
    }));
  };

  const handleRemoveHub = (id: string) => {
    setCorpFormData((prev) => ({
      ...prev,
      hubs: (prev.hubs || []).filter((h) => h.id !== id),
    }));
  };

  const handleUpdateHub = (id: string, updated: Partial<ShipperHubLocation>) => {
    setCorpFormData((prev) => ({
      ...prev,
      hubs: (prev.hubs || []).map((h) => (h.id === id ? { ...h, ...updated } : h)),
    }));
  };

  // Handle Hubs for Individual (بار شخصی)
  const handleAddIndivHub = () => {
    const newHub: ShipperHubLocation = {
      id: `ind-hub-${Date.now()}`,
      name: 'انبار / کارگاه شخصی جدید',
      city: 'تهران',
      province: 'تهران',
      address: '',
      contactName: indivFormData.fullName || userName || '',
      contactPhone: indivFormData.mobileNumber || '',
    };
    setIndivHubs((prev) => [...prev, newHub]);
  };

  const handleRemoveIndivHub = (id: string) => {
    setIndivHubs((prev) => prev.filter((h) => h.id !== id));
  };

  const handleUpdateIndivHub = (id: string, updated: Partial<ShipperHubLocation>) => {
    setIndivHubs((prev) => prev.map((h) => (h.id === id ? { ...h, ...updated } : h)));
  };

  // Upload handler simulation with genuine file metadata
  const handleSimulateFileUpload = (
    docKey: 'officialGazetteDoc' | 'ceoNationalCardDoc' | 'vatDoc' | 'nationalCardDoc' | 'selfieVerificationDoc',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} مگابایت` : `${sizeKb} کیلوبایت`;
    const nowJalali = '۱۴۰۴/۰۶/۰۲';

    const uploadedDoc: UploadedDocFile = {
      fileName: file.name,
      fileSize: sizeStr,
      uploadedAt: nowJalali,
      status: 'uploaded',
      previewUrl: URL.createObjectURL(file),
    };

    if (docKey === 'nationalCardDoc' || docKey === 'selfieVerificationDoc') {
      setIndivFormData((prev) => ({
        ...prev,
        [docKey]: uploadedDoc,
      }));
    } else {
      setCorpFormData((prev) => ({
        ...prev,
        [docKey]: uploadedDoc,
      }));
    }
  };

  // Simulate OCR extraction on national card
  const handleRunOcrExtraction = () => {
    setIsOcrProcessing(true);
    setTimeout(() => {
      setIsOcrProcessing(false);
      setIndivFormData((prev) => ({
        ...prev,
        nationalCode: prev.nationalCode || '0019482711',
        birthDate: prev.birthDate || '1369/05/22',
        fullName: prev.fullName || 'علی مرادی',
        sabtAhvalVerified: true,
      }));
    }, 1200);
  };

  // Simulate Shahkar Mobile matching
  const handleVerifyShahkar = () => {
    if (!indivFormData.mobileNumber || !indivFormData.nationalCode) {
      setErrorMessage('لطفاً ابتدا کد ملی و شماره موبایل را وارد نمایید.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    setErrorMessage(null);
    setIsVerifyingShahkar(true);
    setTimeout(() => {
      setIsVerifyingShahkar(false);
      setIndivFormData((prev) => ({
        ...prev,
        shahkarVerified: true,
      }));
    }, 1000);
  };

  // Simulate Sabt Ahval verification
  const handleVerifySabtAhval = () => {
    if (!indivFormData.nationalCode || !indivFormData.birthDate) {
      setErrorMessage('لطفاً کد ملی و تاریخ تولد را وارد فرمایید.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    setErrorMessage(null);
    setIsVerifyingSabtAhval(true);
    setTimeout(() => {
      setIsVerifyingSabtAhval(false);
      setIndivFormData((prev) => ({
        ...prev,
        sabtAhvalVerified: true,
      }));
    }, 1000);
  };

  // Save Changes
  const handleSaveAll = () => {
    if (entityType === 'corporate') {
      if (!isSeniorAdmin) {
        setErrorMessage('خطای دسترسی: ویرایش اطلاعات و پرونده ثبتی شرکت فقط در اختیار مدیر ارشد سازمان می‌باشد.');
        setTimeout(() => setErrorMessage(null), 4000);
        setIsEditing(false);
        return;
      }
      const fullDossier: ShipperLegalDossier = {
        companyLegalName: corpFormData.companyLegalName || currentShipperOrg?.nameFa || userOrgName,
        nationalId: corpFormData.nationalId || '',
        economicCode: corpFormData.economicCode || '',
        registrationNumber: corpFormData.registrationNumber || '',
        registrationPlace: corpFormData.registrationPlace || '',
        establishmentDate: corpFormData.establishmentDate || '',
        representativeName: corpFormData.representativeName || '',
        representativeRole: corpFormData.representativeRole || '',
        representativeMobile: corpFormData.representativeMobile || '',
        representativeEmail: corpFormData.representativeEmail || '',
        nationalCodeRepresentative: corpFormData.nationalCodeRepresentative || '',
        vatTaxCertificateNumber: corpFormData.vatTaxCertificateNumber || '',
        vatTaxExpiryDate: corpFormData.vatTaxExpiryDate || '',
        hasVatCertificate: Boolean(corpFormData.hasVatCertificate),
        headquartersAddress: corpFormData.headquartersAddress || '',
        postalCode: corpFormData.postalCode || '',
        phoneLandline: corpFormData.phoneLandline || '',
        bankShaba: corpFormData.bankShaba || '',
        bankName: corpFormData.bankName || '',
        bankAccountNumber: corpFormData.bankAccountNumber || '',
        officialGazetteDoc: corpFormData.officialGazetteDoc,
        ceoNationalCardDoc: corpFormData.ceoNationalCardDoc,
        vatDoc: corpFormData.vatDoc,
        hubs: corpFormData.hubs || [],
        commonProductTypes: corpFormData.commonProductTypes || [],
        standardPackagingTypes: corpFormData.standardPackagingTypes || [],
        creditTermsRequest: corpFormData.creditTermsRequest,
        isProfileComplete: corpCompleteness.isComplete,
        lastUpdatedAt: 'امروز',
        updatedBy: userName,
      };

      const hubLocations: any[] = (fullDossier.hubs || []).map((h) => ({
        id: h.id,
        title: h.name,
        category: h.isDefaultOrigin ? 'origin' : h.isDefaultDest ? 'destination' : 'both',
        city: h.city,
        province: h.province,
        address: h.address,
        postalCode: h.postalCode || '',
        contactPerson: h.contactName || fullDossier.representativeName,
        contactPhone: h.contactPhone || fullDossier.representativeMobile,
      }));

      updateShipperOrgProfile({
        nameFa: fullDossier.companyLegalName,
        nationalId: fullDossier.nationalId,
        economicCode: fullDossier.economicCode,
        contactPerson: fullDossier.representativeName,
        email: fullDossier.representativeEmail,
        phone: fullDossier.phoneLandline,
        address: fullDossier.headquartersAddress,
        entityType: 'corporate',
        legalDossier: fullDossier,
        savedLocations: hubLocations.length > 0 ? hubLocations : currentShipperOrg.savedLocations,
      });
    } else {
      // Individual
      const fullIndiv: ShipperIndividualProfile = {
        fullName: indivFormData.fullName || userName,
        nationalCode: indivFormData.nationalCode || '',
        mobileNumber: indivFormData.mobileNumber || '',
        birthDate: indivFormData.birthDate || '',
        nationalCardDoc: indivFormData.nationalCardDoc,
        selfieVerificationDoc: indivFormData.selfieVerificationDoc,
        bankCardNumber: indivFormData.bankCardNumber || '',
        bankShaba: indivFormData.bankShaba || '',
        bankName: indivFormData.bankName || '',
        residentialAddress: indivFormData.residentialAddress || '',
        postalCode: indivFormData.postalCode || '',
        hubs: indivHubs,
        shahkarVerified: indivFormData.shahkarVerified ?? false,
        sabtAhvalVerified: indivFormData.sabtAhvalVerified ?? false,
        livenessVerified: indivFormData.livenessVerified ?? false,
        isComplete: indivCompleteness.isComplete,
        lastUpdatedAt: 'امروز',
      };

      const indHubLocations: any[] = indivHubs.map((h) => ({
        id: h.id,
        title: h.name,
        category: h.isDefaultOrigin ? 'origin' : h.isDefaultDest ? 'destination' : 'both',
        city: h.city,
        province: h.province,
        address: h.address,
        postalCode: h.postalCode || '',
        contactPerson: h.contactName || fullIndiv.fullName,
        contactPhone: h.contactPhone || fullIndiv.mobileNumber,
      }));

      updateShipperOrgProfile({
        nameFa: fullIndiv.fullName ? `${fullIndiv.fullName} (صاحب بار شخصی)` : userOrgName,
        contactPerson: fullIndiv.fullName,
        email: userEmail,
        phone: fullIndiv.mobileNumber,
        address: fullIndiv.residentialAddress,
        nationalId: fullIndiv.nationalCode,
        entityType: 'individual',
        individualProfile: fullIndiv,
        savedLocations: indHubLocations.length > 0 ? indHubLocations : currentShipperOrg.savedLocations,
      });
    }

    setIsEditing(false);
    setSaveSuccessMessage('اطلاعات هویتی، پرونده و مراکز لجستیکی صاحب بار با موفقیت در سامانه ثبت و به‌روزرسانی شد.');
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleCopyShaba = (shabaText: string) => {
    if (!shabaText) return;
    navigator.clipboard?.writeText(shabaText);
    setIsCopiedShaba(true);
    setTimeout(() => setIsCopiedShaba(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
              {entityType === 'corporate' ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-display">
                  {entityType === 'corporate' ? 'شناسنامه حقوقی و پرونده رسمی شرکت' : 'پرونده احراز هویت صاحب بار حقیقی (بار شخصی)'}
                </h2>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    activeCompleteness.isComplete
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                      : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                  }`}
                >
                  {activeCompleteness.isComplete ? 'تکمیل شده (مجاز به صدور بارنامه)' : `نقص پرونده (${activeCompleteness.completionPercentage}٪ تکمیل)`}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {entityType === 'corporate'
                  ? 'ثبت و مدیریت اطلاعات ثبتی، شناسه ملی، فاکتور رسمی، کد اقتصادی، شماره شبا و انبارهای سازمانی'
                  : 'احراز هویت فردی، استعلام سامانه شاهکار، ثبت احوال، آپلود کارت ملی، شماره شبا و مراکز بارگیری شخصی'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Entity Type Label / Badge - Strictly shows Corporate for Company, Individual for Retail */}
            {isRetailUser ? (
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-sm">
                <User className="w-4 h-4" />
                <span>شخص حقیقی (بار شخصی)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-sm">
                <Building2 className="w-4 h-4" />
                <span>شخص حقوقی (شرکت)</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        <AnimatePresence>
          {saveSuccessMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-inner"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveSuccessMessage}</span>
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-rose-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between gap-2 shadow-inner"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-white/80 hover:text-white text-xs px-2"
              >
                بستن
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warning Banner if Profile is Incomplete */}
        {!activeCompleteness.isComplete && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-950">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>توجه:</strong> پرونده شما هنوز ناقص است ({activeCompleteness.completionPercentage}٪ تکمیل شده). موارد الزامی باقی‌مانده: {activeCompleteness.missingFields.join('، ')}
              </span>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 mr-3"
              >
                تکمیل سریع اطلاعات
              </button>
            )}
          </div>
        )}

        {/* Navigation Tabs (For Corporate and Individual) */}
        <div className="flex items-center justify-between px-6 border-b border-slate-200 bg-slate-50/80">
          <div className="flex gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'basic'
                  ? 'border-amber-600 text-amber-900 bg-white shadow-sm'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-600" />
              <span>
                {entityType === 'corporate'
                  ? '۱. اطلاعات پایه و احراز هویت شرکت'
                  : '۱. مشخصات و مدارک احراز هویت فردی'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('financial')}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'financial'
                  ? 'border-amber-600 text-amber-900 bg-white shadow-sm'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>
                {entityType === 'corporate'
                  ? '۲. اطلاعات مالی، شبا و فاکتور رسمی'
                  : '۲. شماره شبا، حساب و آدرس پستی'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('operations')}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'operations'
                  ? 'border-amber-600 text-amber-900 bg-white shadow-sm'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>
                {entityType === 'corporate'
                  ? '۳. مراکز لجستیکی و انبارهای شرکت'
                  : '۳. مراکز لجستیکی و انبارهای بارگیری'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{entityType === 'corporate' ? 'ذخیره مشخصات شرکت' : 'ذخیره اطلاعات و انبارها'}</span>
                </button>
              </div>
            ) : (entityType === 'corporate' && !isSeniorAdmin) ? (
              <div
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 border border-slate-300 text-slate-500 rounded-xl text-xs font-bold shadow-xs cursor-not-allowed select-none"
                title="ویرایش مشخصات و پرونده شرکت فقط برای مدیر ارشد زنجیره تأمین / مدیر سازمان مجاز است."
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>ویرایش مشخصات (مختص مدیر ارشد)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span>{entityType === 'corporate' ? 'ویرایش مشخصات' : 'ویرایش اطلاعات و انبارها'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
          {/* ======================================================== */}
          {/* A. CORPORATE VIEW (شخص حقوقی / شرکت)                      */}
          {/* ======================================================== */}
          {entityType === 'corporate' && (
            <>
              {/* Tab 1: Basic & Authentication */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  {/* Notice if newly created company */}
                  {!corpFormData.registrationNumber && !corpFormData.nationalId && (
                    <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-sky-950 text-xs flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
                      <div>
                        <p className="font-bold">ثبت شرکت جدید در سامانه</p>
                        <p className="text-sky-800 text-[11px] mt-0.5">
                          مشخصات حقوقی این شرکت هنوز ثبت نشده است. لطفاً فرم زیر را با اطلاعات مندرج در روزنامه رسمی و شناسه ملی معتبر شرکت تکمیل فرمایید.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Section 1: Official Corporate Registration */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <h3 className="text-xs font-extrabold text-slate-900">
                        مشخصات ثبتی و قانونی شرکت (مطابق روزنامه رسمی)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-600 font-bold mb-1">
                          نام کامل و رسمی شرکت <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={corpFormData.companyLegalName || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, companyLegalName: e.target.value })}
                          placeholder="مثال: شرکت فولاد آلیاژی پارس"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">
                          شناسه ملی شرکت (۱۱ رقم) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={11}
                          disabled={!isEditing}
                          value={corpFormData.nationalId || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, nationalId: e.target.value })}
                          placeholder="مثال: 10100445588"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">
                          کد اقتصادی شرکت (۱۲ رقم) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          disabled={!isEditing}
                          value={corpFormData.economicCode || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, economicCode: e.target.value })}
                          placeholder="مثال: 411195648812"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">
                          شماره ثبت شرکت <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={corpFormData.registrationNumber || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, registrationNumber: e.target.value })}
                          placeholder="مثال: 14820"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">محل ثبت شرکت</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={corpFormData.registrationPlace || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, registrationPlace: e.target.value })}
                          placeholder="مثال: اصفهان"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">تاریخ تاسیس</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={corpFormData.establishmentDate || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, establishmentDate: e.target.value })}
                          placeholder="مثال: ۱۳۷۵/۰۴/۱۰"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Authorized Representative */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <User className="w-4 h-4 text-sky-600" />
                      <h3 className="text-xs font-extrabold text-slate-900">
                        اطلاعات نماینده اصلی / مدیر لجستیک و زنجیره تأمین
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-600 font-bold mb-1">
                          نام و نام خانوادگی نماینده <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={corpFormData.representativeName || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, representativeName: e.target.value })}
                          placeholder="مثال: مهندس جواد اکبری"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">سمت سازمانی</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={corpFormData.representativeRole || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, representativeRole: e.target.value })}
                          placeholder="مثال: مدیر تدارکات و لجستیک"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">کد ملی نماینده</label>
                        <input
                          type="text"
                          maxLength={10}
                          disabled={!isEditing}
                          value={corpFormData.nationalCodeRepresentative || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, nationalCodeRepresentative: e.target.value })}
                          placeholder="مثال: 1289456123"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">
                          شماره موبایل نماینده (پیامک بارنامه) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={11}
                          disabled={!isEditing}
                          value={corpFormData.representativeMobile || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, representativeMobile: e.target.value })}
                          placeholder="مثال: 09123456789"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">
                          ایمیل رسمی سازمانی <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          disabled={!isEditing}
                          value={corpFormData.representativeEmail || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, representativeEmail: e.target.value })}
                          placeholder="مثال: logistics@company.ir"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Headquarters Address & Contact */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <h3 className="text-xs font-extrabold text-slate-900">
                        آدرس و اطلاعات تماس دفتر مرکزی شرکت
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-600 font-bold mb-1">
                          آدرس کامل دفتر مرکزی <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={corpFormData.headquartersAddress || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, headquartersAddress: e.target.value })}
                          placeholder="مثال: تهران، خیابان ولیعصر، برج تجارت، طبقه ۸"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">
                          کد پستی ۱۰ رقمی <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          disabled={!isEditing}
                          value={corpFormData.postalCode || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, postalCode: e.target.value })}
                          placeholder="مثال: 1987654321"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">
                          تلفن ثابت دفتر مرکزی (همراه پیش‌شماره) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={corpFormData.phoneLandline || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, phoneLandline: e.target.value })}
                          placeholder="مثال: ۰۲۱-۸۸۸۸۴۴۴۴"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Corporate Uploaded Documents */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs font-extrabold text-slate-900">
                          مدارک و اسناد رسمی بارگذاری شده شرکت
                        </h3>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold">فرمت‌های مجاز: PDF, JPG, PNG (حداکثر ۱۰ مگابایت)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Doc 1: Official Gazette */}
                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-800">روزنامه رسمی (تاسیس / تغییرات)</span>
                            {corpFormData.officialGazetteDoc ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">تایید شده</span>
                            ) : (
                              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold">بارگذاری نشده</span>
                            )}
                          </div>
                          {corpFormData.officialGazetteDoc ? (
                            <div className="text-[11px] text-slate-600 space-y-1">
                              <p className="font-mono truncate">{corpFormData.officialGazetteDoc.fileName}</p>
                              <p className="text-[10px] text-slate-400">حجم: {corpFormData.officialGazetteDoc.fileSize} • تاریخ: {corpFormData.officialGazetteDoc.uploadedAt}</p>
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400">تصویر آخرین روزنامه رسمی حاوی اعضای هیئت مدیره و صاحبان امضا</p>
                          )}
                        </div>

                        {isEditing && (
                          <label className="cursor-pointer w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-center font-bold text-[11px] text-slate-700 flex items-center justify-center gap-1.5">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>{corpFormData.officialGazetteDoc ? 'تعویض فایل' : 'بارگذاری روزنامه رسمی'}</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleSimulateFileUpload('officialGazetteDoc', e)}
                            />
                          </label>
                        )}
                      </div>

                      {/* Doc 2: CEO National Card */}
                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-800">کارت ملی مدیرعامل / نماینده</span>
                            {corpFormData.ceoNationalCardDoc ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">تایید شده</span>
                            ) : (
                              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold">بارگذاری نشده</span>
                            )}
                          </div>
                          {corpFormData.ceoNationalCardDoc ? (
                            <div className="text-[11px] text-slate-600 space-y-1">
                              <p className="font-mono truncate">{corpFormData.ceoNationalCardDoc.fileName}</p>
                              <p className="text-[10px] text-slate-400">حجم: {corpFormData.ceoNationalCardDoc.fileSize} • تاریخ: {corpFormData.ceoNationalCardDoc.uploadedAt}</p>
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400">تصویر رو و پشت کارت ملی هوشمند نماینده تام‌الاختیار</p>
                          )}
                        </div>

                        {isEditing && (
                          <label className="cursor-pointer w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-center font-bold text-[11px] text-slate-700 flex items-center justify-center gap-1.5">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>{corpFormData.ceoNationalCardDoc ? 'تعویض فایل' : 'بارگذاری کارت ملی'}</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleSimulateFileUpload('ceoNationalCardDoc', e)}
                            />
                          </label>
                        )}
                      </div>

                      {/* Doc 3: VAT Certificate */}
                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-800">گواهی مالیات بر ارزش افزوده</span>
                            {corpFormData.vatDoc ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">تایید شده</span>
                            ) : (
                              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold">اختیاری / بارگذاری نشده</span>
                            )}
                          </div>
                          {corpFormData.vatDoc ? (
                            <div className="text-[11px] text-slate-600 space-y-1">
                              <p className="font-mono truncate">{corpFormData.vatDoc.fileName}</p>
                              <p className="text-[10px] text-slate-400">حجم: {corpFormData.vatDoc.fileSize} • تاریخ: {corpFormData.vatDoc.uploadedAt}</p>
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400">گواهی ثبت‌نام در نظام مالیات بر ارزش افزوده برای اعمال معافیت یا محاسبه دقیق</p>
                          )}
                        </div>

                        {isEditing && (
                          <label className="cursor-pointer w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-center font-bold text-[11px] text-slate-700 flex items-center justify-center gap-1.5">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>{corpFormData.vatDoc ? 'تعویض فایل' : 'بارگذاری گواهی ارزش افزوده'}</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleSimulateFileUpload('vatDoc', e)}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Financial, Shaba & Official Billing */}
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  {/* Financial Setup Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-extrabold text-slate-900">
                        شماره شبای حقوقی و حساب بانکی رسمی شرکت
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-600 font-bold mb-1">
                          شماره شبای بانکی حقوقی (IR) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={26}
                            disabled={!isEditing}
                            value={corpFormData.bankShaba || ''}
                            onChange={(e) => setCorpFormData({ ...corpFormData, bankShaba: e.target.value.toUpperCase() })}
                            placeholder="IR120120000000001234567890"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left tracking-wider text-xs focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700 pl-10"
                          />
                          {corpFormData.bankShaba && (
                            <button
                              type="button"
                              onClick={() => handleCopyShaba(corpFormData.bankShaba || '')}
                              className="absolute left-2 top-2 p-1 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer transition-colors"
                              title="کپی شماره شبا"
                            >
                              {isCopiedShaba ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">جهت بازگشت اضافه پرداخت‌ها، تسویه‌حساب بارنامه‌ها و تبادلات رسمی</p>
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">نام بانک عامل</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={corpFormData.bankName || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, bankName: e.target.value })}
                          placeholder="مثال: بانک تجارت - شعبه مرکزی"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">شماره حساب بانکی</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={corpFormData.bankAccountNumber || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, bankAccountNumber: e.target.value })}
                          placeholder="مثال: 4421890234"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">شماره گواهی ارزش افزوده</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={corpFormData.vatTaxCertificateNumber || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, vatTaxCertificateNumber: e.target.value })}
                          placeholder="مثال: VAT-991204821"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold mb-1">تاریخ اعتبار گواهی ارزش افزوده</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={corpFormData.vatTaxExpiryDate || ''}
                          onChange={(e) => setCorpFormData({ ...corpFormData, vatTaxExpiryDate: e.target.value })}
                          placeholder="مثال: ۱۴۰۵/۱۲/۲۹"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Hubs & Logistics Operations */}
              {activeTab === 'operations' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <h3 className="text-xs font-extrabold text-slate-900">
                          انبارهای بارگیری / تخلیه و کارخانجات شرکت ({corpFormData.hubs?.length || 0} انبار)
                        </h3>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={handleAddHub}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>افزودن انبار جدید</span>
                        </button>
                      )}
                    </div>

                    {corpFormData.hubs && corpFormData.hubs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {corpFormData.hubs.map((hub) => (
                          <div key={hub.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              {isEditing ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                                  <input
                                    type="text"
                                    value={hub.name}
                                    onChange={(e) => handleUpdateHub(hub.id, { name: e.target.value })}
                                    placeholder="نام کامل انبار یا کارخانه"
                                    className="w-full font-bold text-xs sm:text-sm text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1" />
                                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug break-words flex-1">
                                    {hub.name}
                                  </h4>
                                </div>
                              )}
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveHub(hub.id)}
                                  className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer shrink-0 transition-colors"
                                  title="حذف انبار"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                              <div>
                                <label className="text-slate-500 font-bold block mb-1">شهر / استان:</label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={hub.city}
                                    onChange={(e) => handleUpdateHub(hub.id, { city: e.target.value })}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                  />
                                ) : (
                                  <div className="p-2 bg-white rounded-xl border border-slate-200/60 font-bold text-slate-800 break-words">
                                    {hub.city || 'ثبت نشده'}
                                  </div>
                                )}
                              </div>
                              <div>
                                <label className="text-slate-500 font-bold block mb-1">مسئول انبار / باسکول:</label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={hub.contactName}
                                    onChange={(e) => handleUpdateHub(hub.id, { contactName: e.target.value })}
                                    placeholder="نام مسئول"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                  />
                                ) : (
                                  <div className="p-2 bg-white rounded-xl border border-slate-200/60 font-bold text-slate-800 break-words">
                                    {hub.contactName || 'ثبت نشده'}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-slate-500 font-bold text-[11px] block mb-1">آدرس دقیق انبار و بارگیری:</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={hub.address}
                                  onChange={(e) => handleUpdateHub(hub.id, { address: e.target.value })}
                                  placeholder="آدرس پستی باسکول و بارگیری"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                                />
                              ) : (
                                <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 text-xs text-slate-700 leading-relaxed break-words font-medium">
                                  {hub.address || 'آدرس ثبت نشده است'}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
                        <p>هیچ انبار یا کارخانه‌ای ثبت نشده است.</p>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={handleAddHub}
                            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg font-bold text-xs cursor-pointer"
                          >
                            افزودن اولین انبار
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* B. INDIVIDUAL VIEW (شخص حقیقی / بار شخصی)                 */}
          {/* ======================================================== */}
          {entityType === 'individual' && (
            <>
              {/* TAB 1: BASIC INFO & AUTHENTICATION */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  {/* Mandatory Info Section (قسمت اول: مدارک و اطلاعات ضروری احراز هویت) */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                          ۱
                        </div>
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900">
                            مدارک و اطلاعات ضروری احراز هویت (حداقلی طبق قوانین تجارت الکترونیک)
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            جهت تطبیق هویت، استعلام سامانه شاهکار، ثبت احوال و صدور قانونی بارنامه رسمی
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        الزامی برای ثبت بار
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      {/* Full Name */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          نام و نام خانوادگی کامل (صاحب بار) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={indivFormData.fullName || ''}
                          onChange={(e) => setIndivFormData({ ...indivFormData, fullName: e.target.value })}
                          placeholder="مثال: علی مرادی"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      {/* National ID */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-slate-700 font-bold">
                            کد ملی (۱۰ رقم) <span className="text-red-500">*</span>
                          </label>
                          {indivFormData.sabtAhvalVerified ? (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> ثبت احوال تایید شده
                            </span>
                          ) : null}
                        </div>
                        <input
                          type="text"
                          maxLength={10}
                          disabled={!isEditing}
                          value={indivFormData.nationalCode || ''}
                          onChange={(e) => setIndivFormData({ ...indivFormData, nationalCode: e.target.value })}
                          placeholder="مثال: 0019482711"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      {/* Mobile (Shahkar Match) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-slate-700 font-bold">
                            شماره موبایل به نام شخص (تطبیق شاهکار) <span className="text-red-500">*</span>
                          </label>
                          {indivFormData.shahkarVerified ? (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                              <BadgeCheck className="w-3 h-3" /> شاهکار منطبق
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-bold">نیاز به تطبیق</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={11}
                            disabled={!isEditing}
                            value={indivFormData.mobileNumber || ''}
                            onChange={(e) => setIndivFormData({ ...indivFormData, mobileNumber: e.target.value, shahkarVerified: false })}
                            placeholder="مثال: 09123456789"
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                          />
                          {isEditing && !indivFormData.shahkarVerified && (
                            <button
                              type="button"
                              onClick={handleVerifyShahkar}
                              disabled={isVerifyingShahkar}
                              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                            >
                              {isVerifyingShahkar ? (
                                <span className="animate-spin text-xs">⏳</span>
                              ) : (
                                <Smartphone className="w-3.5 h-3.5" />
                              )}
                              <span>استعلام شاهکار</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Birth Date */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-slate-700 font-bold">
                            تاریخ تولد (جهت استعلام ثبت احوال) <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={indivFormData.birthDate || ''}
                            onChange={(e) => setIndivFormData({ ...indivFormData, birthDate: e.target.value, sabtAhvalVerified: false })}
                            placeholder="مثال: 1369/05/22"
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                          />
                          {isEditing && !indivFormData.sabtAhvalVerified && (
                            <button
                              type="button"
                              onClick={handleVerifySabtAhval}
                              disabled={isVerifyingSabtAhval}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                            >
                              {isVerifyingSabtAhval ? (
                                <span className="animate-spin text-xs">⏳</span>
                              ) : (
                                <Calendar className="w-3.5 h-3.5" />
                              )}
                              <span>استعلام هویت</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Upload National Card Section */}
                    <div className="pt-3 border-t border-slate-100">
                      <label className="block text-slate-700 font-bold text-xs mb-2">
                        تصویر روی کارت ملی هوشمند (یا شناسنامه جدید) <span className="text-red-500">*</span>
                      </label>

                      <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            {indivFormData.nationalCardDoc ? (
                              <div className="space-y-0.5">
                                <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                  <span>{indivFormData.nationalCardDoc.fileName}</span>
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                                    آپلود شد
                                  </span>
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  حجم فایل: {indivFormData.nationalCardDoc.fileSize} • وضعیت: آماده بررسی چشمی یا OCR
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <p className="font-bold text-slate-800 text-xs">
                                  تصویر کارت ملی را بارگذاری نمایید
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  جهت بررسی چشمدید (Manual Check) و استعلام آنی سامانه ثبت احوال
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {indivFormData.nationalCardDoc && (
                            <button
                              type="button"
                              onClick={handleRunOcrExtraction}
                              disabled={isOcrProcessing}
                              className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <ScanLine className="w-4 h-4" />
                              <span>{isOcrProcessing ? 'در حال خوانش هوشمند...' : 'استخراج هوشمند OCR'}</span>
                            </button>
                          )}

                          {isEditing && (
                            <label className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm">
                              <UploadCloud className="w-4 h-4 text-amber-400" />
                              <span>{indivFormData.nationalCardDoc ? 'تغییر تصویر کارت' : 'انتخاب و آپلود کارت ملی'}</span>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => handleSimulateFileUpload('nationalCardDoc', e)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liveness Selfie Section */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                          ۲
                        </div>
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900">
                            تصویر سلفی همراه با کارت ملی (تایید زنده بودن - Liveness Detection)
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            در صورتی که ارزش بار بالا باشد یا پرداخت اعتباری درخواست شود، سلفی همراه با کارت ملی تطبیق داده می‌شود.
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        تکمیلی / اختیاری
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900 text-xs">
                              {indivFormData.selfieVerificationDoc ? indivFormData.selfieVerificationDoc.fileName : 'تصویر سلفی احراز هویت'}
                            </p>
                            {indivFormData.selfieVerificationDoc ? (
                              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
                                بارگذاری شد
                              </span>
                            ) : (
                              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">
                                ویژه بارهای گران‌قیمت
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            سلفی باید واضح و چهره کاملاً رو به دوربین همراه با کارت ملی باشد.
                          </p>
                        </div>
                      </div>

                      {isEditing && (
                        <label className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{indivFormData.selfieVerificationDoc ? 'تعویض سلفی' : 'بارگذاری تصویر سلفی'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleSimulateFileUpload('selfieVerificationDoc', e)}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FINANCIAL & ADDRESS */}
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900">
                            اطلاعات بانکی، شماره شبا و حساب شخص حقیقی
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            جهت بازگشت وجه ضمانت، استرداد کیف پول و ثبت در حواله‌های مالی باربری
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        تطبیق با کد ملی
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      {/* Bank Card Number */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          شماره کارت بانکی (۱۶ رقم) به نام شخص
                        </label>
                        <input
                          type="text"
                          maxLength={19}
                          disabled={!isEditing}
                          value={indivFormData.bankCardNumber || ''}
                          onChange={(e) => setIndivFormData({ ...indivFormData, bankCardNumber: e.target.value })}
                          placeholder="۶۰۳۷-۹۹۷۵-...."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">تطبیق حساب با کد ملی جهت استرداد وجه یا کیف پول</p>
                      </div>

                      {/* Bank Shaba */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          شماره شبای بانکی (IR)
                        </label>
                        <input
                          type="text"
                          maxLength={26}
                          disabled={!isEditing}
                          value={indivFormData.bankShaba || ''}
                          onChange={(e) => setIndivFormData({ ...indivFormData, bankShaba: e.target.value.toUpperCase() })}
                          placeholder="IR120120000000001234567890"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      {/* Bank Name */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          نام بانک عامل
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={indivFormData.bankName || ''}
                          onChange={(e) => setIndivFormData({ ...indivFormData, bankName: e.target.value })}
                          placeholder="مثال: بانک ملت / صادرات"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900">
                            آدرس پستی و اقامتگاه قانونی
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            جهت درج در بارنامه و فاکتورهای رسمی سامانه راهداری
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      {/* Postal Code */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          کد پستی ۱۰ رقمی محل سکونت / دفتر
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          disabled={!isEditing}
                          value={indivFormData.postalCode || ''}
                          onChange={(e) => setIndivFormData({ ...indivFormData, postalCode: e.target.value })}
                          placeholder="مثال: 1488111111"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-bold mb-1">
                          آدرس کامل محل سکونت یا کارگاه
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={indivFormData.residentialAddress || ''}
                          onChange={(e) => setIndivFormData({ ...indivFormData, residentialAddress: e.target.value })}
                          placeholder="مثال: تهران، خیابان آزادی، کوچه مروارید، پلاک ۱۲"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-none disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: OPERATIONS & LOGISTICS HUBS (مراکز لجستیکی و انبارهای بارگیری شخصی) */}
              {activeTab === 'operations' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900">
                            مراکز لجستیکی، کارگاه‌ها و انبارهای بارگیری شخصی
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            تعریف انبارها و مقاصد پیش‌فرض جهت انتخاب سریع در فرم ثبت بار و استعلام هوشمند کرایه
                          </p>
                        </div>
                      </div>

                      {isEditing && (
                        <button
                          type="button"
                          onClick={handleAddIndivHub}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>افزودن مرکز / انبار جدید</span>
                        </button>
                      )}
                    </div>

                    {indivHubs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {indivHubs.map((hub, index) => (
                          <div
                            key={hub.id}
                            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-amber-300 transition-all space-y-3 relative group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                  {index + 1}
                                </span>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={hub.name}
                                    onChange={(e) => handleUpdateIndivHub(hub.id, { name: e.target.value })}
                                    placeholder="نام مرکز / انبار"
                                    className="w-full flex-1 font-bold text-xs sm:text-sm text-slate-900 bg-white border border-slate-300 px-2.5 py-1.5 rounded-xl outline-none focus:border-amber-500"
                                  />
                                ) : (
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug break-words">
                                      {hub.name}
                                    </h4>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {hub.isDefaultOrigin && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md shrink-0">
                                    مبدأ پیش‌فرض
                                  </span>
                                )}
                                {hub.isDefaultDest && (
                                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-md shrink-0">
                                    مقصد پیش‌فرض
                                  </span>
                                )}
                                {isEditing && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveIndivHub(hub.id)}
                                    className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                                    title="حذف مرکز"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="block text-[10px] text-slate-500 font-medium mb-0.5">استان / شهر</label>
                                {isEditing ? (
                                  <div className="flex gap-1">
                                    <input
                                      type="text"
                                      value={hub.province}
                                      onChange={(e) => handleUpdateIndivHub(hub.id, { province: e.target.value })}
                                      placeholder="استان"
                                      className="w-1/2 p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                                    />
                                    <input
                                      type="text"
                                      value={hub.city}
                                      onChange={(e) => handleUpdateIndivHub(hub.id, { city: e.target.value })}
                                      placeholder="شهر"
                                      className="w-1/2 p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                                    />
                                  </div>
                                ) : (
                                  <p className="font-bold text-slate-700">
                                    {hub.province} - {hub.city}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-[10px] text-slate-500 font-medium mb-0.5">مسئول / تحویل‌دهنده</label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={hub.contactName || ''}
                                    onChange={(e) => handleUpdateIndivHub(hub.id, { contactName: e.target.value })}
                                    placeholder="نام مسئول"
                                    className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                                  />
                                ) : (
                                  <p className="font-bold text-slate-700">{hub.contactName || 'ثبت نشده'}</p>
                                )}
                              </div>
                            </div>

                            <div className="text-xs">
                              <label className="block text-[10px] text-slate-500 font-medium mb-0.5">آدرس دقیق انبار / محل بارگیری</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={hub.address}
                                  onChange={(e) => handleUpdateIndivHub(hub.id, { address: e.target.value })}
                                  placeholder="آدرس خیابان، کوچه، پلاک..."
                                  className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                                />
                              ) : (
                                <p className="text-slate-600 text-[11px] leading-relaxed">{hub.address || 'آدرس ثبت نشده است'}</p>
                              )}
                            </div>

                            {isEditing && (
                              <div className="flex items-center gap-4 pt-1 border-t border-slate-200 text-[11px]">
                                <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(hub.isDefaultOrigin)}
                                    onChange={(e) => handleUpdateIndivHub(hub.id, { isDefaultOrigin: e.target.checked })}
                                    className="rounded text-amber-600 focus:ring-amber-500"
                                  />
                                  <span>مبدأ پیش‌فرض بارگیری</span>
                                </label>
                                <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(hub.isDefaultDest)}
                                    onChange={(e) => handleUpdateIndivHub(hub.id, { isDefaultDest: e.target.checked })}
                                    className="rounded text-amber-600 focus:ring-amber-500"
                                  />
                                  <span>مقصد پیش‌فرض تخلیه</span>
                                </label>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700">هیچ انبار یا مرکز بارگیری ثبت نشده است</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          با افزودن انبارها، می‌توانید در هر بار ثبت بارنامه به سادگی آدرس و مشخصات تحویل‌دهنده را فراخوانی کنید.
                        </p>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={handleAddIndivHub}
                            className="mt-3 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-sm"
                          >
                            افزودن اولین انبار شخصی
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              اطلاعات و مدارک در بستر امن حاکمیتی ذخیره شده و با سامانه‌های ثبت احوال و شاهکار تطبیق داده می‌شوند.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700 cursor-pointer transition-colors"
            >
              بستن پنجره
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>ذخیره تغییرات</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
