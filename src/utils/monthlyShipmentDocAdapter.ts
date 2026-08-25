import { MonthlyShipmentRecord } from '../data/mockMonthlyShipmentsData';
import { ShipperActiveLoad } from '../data/mockShipperData';
import { ShipperOrgProfile } from '../data/mockOrganizationProfiles';
import { FullShipmentDocumentPackage } from '../types/shipmentDocuments';
import { generateFullShipmentDocumentPackage } from './shipmentDocumentGenerator';

/**
 * Converts a MonthlyShipmentRecord to a ShipperActiveLoad object compatible with document generation.
 */
export function convertMonthlyRecordToActiveLoad(record: MonthlyShipmentRecord): ShipperActiveLoad {
  let mappedStatus: 'loading' | 'in_transit' | 'delivered' | 'pending_driver' = 'in_transit';
  if (record.status === 'delivered') {
    mappedStatus = 'delivered';
  } else if (record.status === 'pending') {
    mappedStatus = 'loading';
  } else if (record.status === 'issue') {
    mappedStatus = 'in_transit';
  } else {
    mappedStatus = 'in_transit';
  }

  return {
    id: record.id,
    trackingCode: `TRK-${record.shipmentCode.replace(/\D/g, '') || record.id}`,
    billOfLadingNo: record.billOfLadingNo,
    originCity: record.originCity,
    originHub: record.originHub,
    destCity: record.destCity,
    destHub: record.destHub,
    cargoType: record.cargoType,
    weightTons: record.weightTons,
    truckType: record.truckType,
    driverName: record.driverName,
    driverPhone: record.driverPhone,
    truckPlate: record.truckPlate,
    status: mappedStatus,
    statusLabelFa: record.statusLabelFa,
    departureTime: record.dispatchDateActual || record.dispatchDatePlanned,
    estimatedArrival: record.deliveryDateActual || record.deliveryDatePlanned,
    progressPercent: record.progressPercent,
    currentLocation: record.currentLocation || `${record.destCity} - در مسیر تحویل`,
    totalCostRials: record.totalCostRials,
    insuranceValuationRials: record.declaredValueRials,
    podSigned: record.status === 'delivered',
    carrierName: record.carrierName,
    carrierPhone: record.carrierPhone,
  };
}

/**
 * Generates full shipment document package from a MonthlyShipmentRecord.
 */
export function generateDocumentPackageForMonthlyShipment(
  record: MonthlyShipmentRecord,
  org?: ShipperOrgProfile
): FullShipmentDocumentPackage {
  const load = convertMonthlyRecordToActiveLoad(record);
  return generateFullShipmentDocumentPackage(load, org);
}
