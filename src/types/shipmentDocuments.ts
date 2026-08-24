import { ShipperActiveLoad } from '../data/mockShipperData';
import { ShipperOrgProfile } from '../data/mockOrganizationProfiles';

export interface TransportDocumentParty {
  name: string;
  nationalId: string;
  economicCode?: string;
  postalCode: string;
  phone: string;
  address: string;
  contactPerson?: string;
}

export interface TransportCarrierCompany {
  companyName: string;
  registrationNumber: string;
  nationalId: string;
  economicCode: string;
  postalCode: string;
  phone: string;
  address: string;
  terminalName: string;
  licenseNumber: string;
  stampImageText?: string;
}

export interface TransportDriverFleetInfo {
  driverFullName: string;
  driverNationalCode: string;
  driverSmartCardNo: string;
  driverLicenseNo: string;
  driverPhone: string;
  // Co-driver (optional)
  coDriverFullName?: string;
  coDriverNationalCode?: string;
  coDriverSmartCardNo?: string;
  // Fleet
  truckPlate: string;
  truckType: string;
  fleetSmartCardNo: string;
  thirdPartyInsuranceNo: string;
  insuranceExpiryDate: string;
}

export interface TransportPricingItem {
  rowNo: number;
  description: string;
  quantity: number;
  unit: string;
  unitPriceRials: number;
  totalPriceRials: number;
  discountRials: number;
  vatRatePercent: number;
  vatAmountRials: number;
  netPayableRials: number;
}

export interface TransportDocumentCosts {
  baseFreightRials: number;
  commissionRials: number;
  loadingUnloadingRials: number;
  insuranceCostRials: number;
  roadTaxWeighbridgeRials: number;
  fuelAdjustmentRials: number;
  discountRials: number;
  vatAmountRials: number;
  totalNetPayableRials: number;
  prepaymentAdvanceRials: number;
  remainingDestinationPayableRials: number;
}

// 1. Proforma Invoice (پیش‌فاکتور)
export interface GeneratedProformaInvoice {
  docType: 'proforma';
  documentNumber: string;
  issueDate: string;
  validityDate: string;
  paymentTerms: string;
  shipperParty: TransportDocumentParty;
  consigneeParty: TransportDocumentParty;
  carrierCompany: TransportCarrierCompany;
  cargoDetails: {
    cargoName: string;
    cargoCategory: string;
    weightTons: number;
    weightKg: number;
    volumeM3: number;
    packagingType: string;
    declaredValueRials: number;
    hazardClass?: string;
  };
  routeDetails: {
    originCity: string;
    originHub: string;
    destCity: string;
    destHub: string;
    approxDistanceKm: number;
    estimatedTransitHours: number;
  };
  pricingBreakdown: TransportDocumentCosts;
  items: TransportPricingItem[];
}

// 2. Tax / Official Invoice (فاکتور رسمی مالیاتی)
export interface GeneratedOfficialInvoice {
  docType: 'official_invoice';
  invoiceNumber: string;
  proformaReferenceNo: string;
  relatedBillOfLadingNo: string;
  issueDate: string;
  dueDate: string;
  seller: TransportCarrierCompany;
  buyer: TransportDocumentParty;
  paymentInfo: {
    paymentMethod: 'اعتباری ۳۰ روزه' | 'نقدی آنلاین' | 'پس‌کرایه در مقصد';
    transactionId: string;
    ibanNumber: string;
    bankName: string;
    paymentStatus: 'paid' | 'credit_approved' | 'pending';
    paymentStatusFa: string;
  };
  items: TransportPricingItem[];
  pricingBreakdown: TransportDocumentCosts;
  fiscalBarcode: string;
}

// 3. Loading Order / Dispatch Slip (حواله بارگیری و مجوز ورود)
export interface GeneratedLoadingOrder {
  docType: 'loading_order';
  dispatchSlipNo: string;
  loadingOrderCode: string;
  issueDate: string;
  scheduledLoadingSlot: string;
  expirySlot: string;
  originWarehouse: {
    hubName: string;
    city: string;
    address: string;
    gpsCoordinates: string;
    warehouseManagerName: string;
    warehousePhone: string;
  };
  driverFleet: TransportDriverFleetInfo;
  cargoSpecs: {
    cargoType: string;
    weightTons: number;
    packageCount: string;
    declaredValueRials: number;
    specialInstructions: string[];
    temperatureRange?: string;
  };
  securityClearanceCode: string;
  weighbridgeRequired: boolean;
}

// 4. Official Bill of Lading (بارنامه رسمی تمبردار راهداری)
export interface GeneratedBillOfLading {
  docType: 'bill_of_lading';
  billOfLadingNo: string;
  rmtoTrackingCode: string;
  serialNumber: string;
  issueDateTime: string;
  departureDateTime: string;
  carrierCompany: TransportCarrierCompany;
  sender: TransportDocumentParty;
  consignee: TransportDocumentParty;
  driverFleet: TransportDriverFleetInfo;
  cargoTechnical: {
    commodityName: string;
    grossWeightKg: number;
    netWeightKg: number;
    weighbridgeGrossKg: number;
    packageCount: string;
    packagingType: string;
    goodsValueRials: number;
    trafficCargoCode?: string;
    safetyMsdsCode?: string;
    healthTrackingCode?: string;
  };
  financials: TransportDocumentCosts;
  rmtoQrValidationUrl: string;
  insurancePolicyNumber: string;
  insuranceCompany: string;
}

export interface FullShipmentDocumentPackage {
  shipmentId: string;
  billOfLadingNo: string;
  trackingCode: string;
  proformaInvoice: GeneratedProformaInvoice;
  officialInvoice: GeneratedOfficialInvoice;
  loadingOrder: GeneratedLoadingOrder;
  billOfLading: GeneratedBillOfLading;
}
