import { ShipperActiveLoad } from '../data/mockShipperData';
import { ShipperOrgProfile } from '../types/shipperLegal';
import {
  FullShipmentDocumentPackage,
  GeneratedProformaInvoice,
  GeneratedOfficialInvoice,
  GeneratedLoadingOrder,
  GeneratedBillOfLading,
  TransportCarrierCompany,
  TransportDocumentParty,
  TransportDriverFleetInfo,
  TransportDocumentCosts,
} from '../types/shipmentDocuments';

// Default Carrier Info (شرکت حمل و نقل سراسری همراه بار هوشمند)
export const DEFAULT_CARRIER_COMPANY: TransportCarrierCompany = {
  companyName: 'شرکت حمل‌ونقل بین‌شهری سراسری هوشمند پیشگامان بار',
  registrationNumber: '۴۸۹۳۲۰',
  nationalId: '۱۰۳۲۰۸۹۴۱۲۳',
  economicCode: '۴۱۱۵۶۸۹۷۲۳۴۱',
  postalCode: '۱۹۸۷۶۵۴۳۲۱',
  phone: '۰۲۱-۸۸۹۹۰۰۱۱',
  address: 'تهران، خیابان ولیعصر، نرسیده به میدان ونک، برج لجستیک هوشمند، طبقه ۸',
  terminalName: 'پایانه حمل بار عمومی تهران و شعب سراسری کشور',
  licenseNumber: 'مجوز راهداری: ۹۹/۷۴۵۳/ص',
  stampImageText: 'مهر و امضای دیجیتال سازمان راهداری و حمل‌ونقل جاده‌ای کشور',
};

// Helper to hash string to numeric deterministic seeds
function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateFullShipmentDocumentPackage(
  load: ShipperActiveLoad,
  org?: ShipperOrgProfile
): FullShipmentDocumentPackage {
  const seed = hashSeed(load.id || load.billOfLadingNo || 'load');

  // Shipper / Buyer Details
  const isIndividual = org?.entityType === 'individual' || !org?.legalDossier;
  const companyName = org?.legalDossier?.companyLegalName || org?.nameFa || 'شرکت بازرگانی و صنعتی فولاد مبارکه اصفهان';
  const nationalId = org?.legalDossier?.nationalId || (org?.individualProfile?.nationalCode ?? '10260289411');
  const economicCode = org?.legalDossier?.economicCode || '411498321455';
  const postalCode = org?.legalDossier?.postalCode || (org?.individualProfile?.postalCode ?? '8488111111');
  const address = org?.legalDossier?.registeredAddress || (org?.individualProfile?.address ?? `${load.originCity}، ${load.originHub}`);
  const contactPhone = org?.legalDossier?.companyPhone || (org?.individualProfile?.mobileNumber ?? '02188990000');
  const contactPerson = org?.legalDossier?.ceoName || (org?.individualProfile?.fullName ?? 'مهندس جواد اکبری');

  const senderParty: TransportDocumentParty = {
    name: isIndividual ? (org?.individualProfile?.fullName || 'علی مرادی (صاحب بار حقیقی)') : companyName,
    nationalId: nationalId,
    economicCode: isIndividual ? undefined : economicCode,
    postalCode: postalCode,
    phone: contactPhone,
    address: address,
    contactPerson: contactPerson,
  };

  // Consignee Party
  const consigneeParty: TransportDocumentParty = {
    name: `انبار مقصد و تحویل‌گیرنده مجاز (${load.destCity})`,
    nationalId: `${10100000000 + (seed % 90000000)}`,
    economicCode: `${411000000000 + (seed % 9000000000)}`,
    postalCode: `${1834100000 + (seed % 899999)}`,
    phone: `۰۲۱-${55000000 + (seed % 999999)}`,
    address: `${load.destCity}، ${load.destHub}`,
    contactPerson: 'مسئول تحویل‌گیری انبار مقصد',
  };

  // Financial Cost Breakdown
  const totalCost = load.totalCostRials || 148500000;
  const baseFreight = Math.round(totalCost * 0.78);
  const commission = Math.round(totalCost * 0.07);
  const loadingUnloading = Math.round(totalCost * 0.04);
  const insuranceCost = Math.round(totalCost * 0.03);
  const roadTax = Math.round(totalCost * 0.03);
  const fuelAdjustment = Math.round(totalCost * 0.02);
  const discount = Math.round(totalCost * 0.05);
  const taxableBase = baseFreight + commission + loadingUnloading + insuranceCost + roadTax + fuelAdjustment - discount;
  const vat = Math.round(taxableBase * 0.10); // 10% VAT
  const totalNet = taxableBase + vat;
  const prepayment = Math.round(totalNet * 0.60); // 60% prepayment to driver/terminal
  const remaining = totalNet - prepayment;

  const costs: TransportDocumentCosts = {
    baseFreightRials: baseFreight,
    commissionRials: commission,
    loadingUnloadingRials: loadingUnloading,
    insuranceCostRials: insuranceCost,
    roadTaxWeighbridgeRials: roadTax,
    fuelAdjustmentRials: fuelAdjustment,
    discountRials: discount,
    vatAmountRials: vat,
    totalNetPayableRials: totalNet,
    prepaymentAdvanceRials: prepayment,
    remainingDestinationPayableRials: remaining,
  };

  // Pricing Items for Invoices
  const items = [
    {
      rowNo: 1,
      description: `خدمات حمل‌ونقل جاده‌ای بین‌شهری ${load.cargoType} با ${load.truckType} از مبدأ ${load.originCity} به مقصد ${load.destCity}`,
      quantity: load.weightTons || 20,
      unit: 'تن',
      unitPriceRials: Math.round(baseFreight / (load.weightTons || 20)),
      totalPriceRials: baseFreight,
      discountRials: discount,
      vatRatePercent: 10,
      vatAmountRials: Math.round((baseFreight - discount) * 0.10),
      netPayableRials: Math.round((baseFreight - discount) * 1.10),
    },
    {
      rowNo: 2,
      description: `بیمه‌نامه رسمی پوشش کلوز کامل حوادث جاده‌ای و سرقت بار (ارزش اظهاری ${((load.insuranceValuationRials || 2500000000) / 10000000).toLocaleString('fa-IR')} میلیون تومان)`,
      quantity: 1,
      unit: 'فقره',
      unitPriceRials: insuranceCost,
      totalPriceRials: insuranceCost,
      discountRials: 0,
      vatRatePercent: 10,
      vatAmountRials: Math.round(insuranceCost * 0.10),
      netPayableRials: Math.round(insuranceCost * 1.10),
    },
    {
      rowNo: 3,
      description: `عوارض جاده‌ای راهداری، بارگیری و صدور برخط بارنامه تمبردار`,
      quantity: 1,
      unit: 'مورد',
      unitPriceRials: commission + loadingUnloading + roadTax + fuelAdjustment,
      totalPriceRials: commission + loadingUnloading + roadTax + fuelAdjustment,
      discountRials: 0,
      vatRatePercent: 10,
      vatAmountRials: Math.round((commission + loadingUnloading + roadTax + fuelAdjustment) * 0.10),
      netPayableRials: Math.round((commission + loadingUnloading + roadTax + fuelAdjustment) * 1.10),
    },
  ];

  // Driver & Fleet Specs
  const driverNationalCode = `${3870000000 + (seed % 9999999)}`;
  const driverSmartCardNo = `${2980000 + (seed % 899999)}`;
  const driverLicenseNo = `${99100000 + (seed % 899999)}`;
  const fleetSmartCardNo = `${4450000 + (seed % 899999)}`;
  const thirdPartyInsuranceNo = `INS-RAZI-${1403000 + (seed % 9999)}`;

  const driverFleet: TransportDriverFleetInfo = {
    driverFullName: load.driverName || 'رسول اکبریان',
    driverNationalCode: driverNationalCode,
    driverSmartCardNo: driverSmartCardNo,
    driverLicenseNo: driverLicenseNo,
    driverPhone: load.driverPhone || '۰۹۱۲۴۴۵۸۹۱۲',
    coDriverFullName: seed % 2 === 0 ? 'مرتضی کاظمی (راننده کمکی)' : undefined,
    coDriverNationalCode: seed % 2 === 0 ? `${1280000000 + (seed % 9999999)}` : undefined,
    coDriverSmartCardNo: seed % 2 === 0 ? `${2750000 + (seed % 899999)}` : undefined,
    truckPlate: load.truckPlate || '۶۸ ع ۹۴۱ ایران ۴۳',
    truckType: load.truckType || 'تریلی کفی ۱۸ چرخ',
    fleetSmartCardNo: fleetSmartCardNo,
    thirdPartyInsuranceNo: thirdPartyInsuranceNo,
    insuranceExpiryDate: '۱۴۰۴/۰۵/۱۵',
  };

  // 1. PROFORMA INVOICE
  const proformaInvoice: GeneratedProformaInvoice = {
    docType: 'proforma',
    documentNumber: `PRF-${load.billOfLadingNo?.replace('BL-', '') || load.id}`,
    issueDate: load.departureTime ? load.departureTime.split(' - ')[0] : '۱۴۰۳/۰۶/۰۱',
    validityDate: '۱۴۰۳/۰۶/۱۰ (۱۰ روز کاری)',
    paymentTerms: 'پرداخت ۶۰٪ پیش‌پرداخت قبل از بارگیری و ۴۰٪ باقیمانده پس از تحویل در مقصد',
    shipperParty: senderParty,
    consigneeParty: consigneeParty,
    carrierCompany: DEFAULT_CARRIER_COMPANY,
    cargoDetails: {
      cargoName: load.cargoType,
      cargoCategory: load.cargoType.includes('شیمیایی') || load.cargoType.includes('پلی') ? 'صنعتی و پتروشیمی' : 'محصولات صنعتی و ساختمانی',
      weightTons: load.weightTons || 22.5,
      weightKg: Math.round((load.weightTons || 22.5) * 1000),
      volumeM3: Math.round((load.weightTons || 20) * 1.8),
      packagingType: load.cargoType.includes('بشکه') ? 'بشکه‌های فلزی پلمپ‌شده' : 'پالت / بندیل صنعتی',
      declaredValueRials: load.insuranceValuationRials || 2800000000,
    },
    routeDetails: {
      originCity: load.originCity,
      originHub: load.originHub,
      destCity: load.destCity,
      destHub: load.destHub,
      approxDistanceKm: 485 + (seed % 550),
      estimatedTransitHours: 12 + (seed % 14),
    },
    pricingBreakdown: costs,
    items: items,
  };

  // 2. OFFICIAL TAX INVOICE
  const officialInvoice: GeneratedOfficialInvoice = {
    docType: 'official_invoice',
    invoiceNumber: `INV-TAX-${14030000 + (seed % 99999)}`,
    proformaReferenceNo: proformaInvoice.documentNumber,
    relatedBillOfLadingNo: load.billOfLadingNo,
    issueDate: load.departureTime ? load.departureTime.split(' - ')[0] : '۱۴۰۳/۰۶/۰۱',
    dueDate: '۱۴۰۳/۰۶/۳۰',
    seller: DEFAULT_CARRIER_COMPANY,
    buyer: senderParty,
    paymentInfo: {
      paymentMethod: 'اعتباری ۳۰ روزه',
      transactionId: `TXN-${100000000 + (seed % 900000000)}`,
      ibanNumber: 'IR890170000000109988776655',
      bankName: 'بانک ملت - شعبه مرکزی ونک',
      paymentStatus: load.status === 'delivered' ? 'paid' : 'credit_approved',
      paymentStatusFa: load.status === 'delivered' ? 'تسویه‌شده کامل' : 'تایید اعتبار قرارداد طلایی',
    },
    items: items,
    pricingBreakdown: costs,
    fiscalBarcode: `TAX-GOV-${seed}-1403-E99A`,
  };

  // 3. LOADING ORDER / DISPATCH SLIP
  const loadingOrder: GeneratedLoadingOrder = {
    docType: 'loading_order',
    dispatchSlipNo: `DSP-${load.id}-${1403}`,
    loadingOrderCode: `LOAD-ORD-${88000 + (seed % 9999)}`,
    issueDate: load.departureTime || '۱۴۰۳/۰۶/۰۱ - ۰۷:۰۰',
    scheduledLoadingSlot: `${load.departureTime ? load.departureTime.split(' - ')[0] : '۱۴۰۳/۰۶/۰۱'} ساعت ۰۸:۰۰ الی ۱۱:۰۰`,
    expirySlot: `${load.departureTime ? load.departureTime.split(' - ')[0] : '۱۴۰۳/۰۶/۰۱'} ساعت ۱۸:۰۰`,
    originWarehouse: {
      hubName: load.originHub,
      city: load.originCity,
      address: `${load.originCity}، ${load.originHub}`,
      gpsCoordinates: '32.6546° N, 51.6680° E',
      warehouseManagerName: 'مهندس اکبری (سرپرست خروج)',
      warehousePhone: '۰۳۱-۳۷۶۵۴۳۲۱',
    },
    driverFleet: driverFleet,
    cargoSpecs: {
      cargoType: load.cargoType,
      weightTons: load.weightTons || 22.5,
      packageCount: `${Math.round((load.weightTons || 20) * 1.5)} بسته / پالت استاندارد`,
      declaredValueRials: load.insuranceValuationRials || 2800000000,
      specialInstructions: [
        'راننده موظف است قبل از بارگیری، کف تریلر را کاملاً تمیز و از عدم وجود رطوبت اطمینان حاصل کند.',
        'استفاده از حداقل ۸ عدد سیم بکسل یا تسمه مهار جغجغه‌دار استاندارد الزامی است.',
        'توزین دقیق باسکول ۶۰ تنی در مبدأ و درج قبض باسکول روی برگ حواله اجباری می‌باشد.',
        load.cargoType.includes('یخچال') ? 'دمای محفظه در تمام طول مسیر باید روی ۴- درجه سانتی‌گراد حفظ شود.' : 'پوشش چادر ضدآب و پلمپ سربی شرکت حمل الزامی است.',
      ],
    },
    securityClearanceCode: `SEC-GATE-${1000 + (seed % 9000)}`,
    weighbridgeRequired: true,
  };

  // 4. OFFICIAL RMTO BILL OF LADING
  const grossKg = Math.round((load.weightTons || 22.5) * 1000);
  const tareKg = 14500; // truck tare
  const weighbridgeTotal = grossKg + tareKg;

  const billOfLading: GeneratedBillOfLading = {
    docType: 'bill_of_lading',
    billOfLadingNo: load.billOfLadingNo,
    rmtoTrackingCode: load.trackingCode,
    serialNumber: `BL-SER-${seed}-RMTO`,
    issueDateTime: load.departureTime || '۱۴۰۳/۰۶/۰۱ - ۰۷:۳۰',
    departureDateTime: load.departureTime || '۱۴۰۳/۰۶/۰۱ - ۰۸:۰۰',
    carrierCompany: DEFAULT_CARRIER_COMPANY,
    sender: senderParty,
    consignee: consigneeParty,
    driverFleet: driverFleet,
    cargoTechnical: {
      commodityName: load.cargoType,
      grossWeightKg: grossKg,
      netWeightKg: Math.round(grossKg * 0.98),
      weighbridgeGrossKg: weighbridgeTotal,
      packageCount: `${Math.round((load.weightTons || 20) * 1.5)} واحد بارگیری`,
      packagingType: load.cargoType.includes('بشکه') ? 'بشکه استاندارد فلزی' : 'پالت و بندیل صنعتی',
      goodsValueRials: load.insuranceValuationRials || 2800000000,
      trafficCargoCode: load.weightTons > 25 ? 'TRF-OVERWEIGHT-994' : undefined,
      safetyMsdsCode: load.cargoType.includes('پلی') || load.cargoType.includes('شیمیایی') ? 'MSDS-UN1866-CL3' : undefined,
      healthTrackingCode: 'HLTH-99482-VET',
    },
    financials: costs,
    rmtoQrValidationUrl: `https://rmto.gov.ir/verify/bl/${load.billOfLadingNo}`,
    insurancePolicyNumber: `POL-DANA-1403-${seed % 99999}`,
    insuranceCompany: 'بیمه دانا - شعبه تخصصی حمل بار سراسری',
  };

  return {
    shipmentId: load.id,
    billOfLadingNo: load.billOfLadingNo,
    trackingCode: load.trackingCode,
    proformaInvoice,
    officialInvoice,
    loadingOrder,
    billOfLading,
  };
}
