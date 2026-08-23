/**
 * Pricing Operating System (Pricing OS) - Domain & Engineering Types
 * Tailored for Road Freight Logistics & Transportation
 * Based on Canonical PRD v1.0 & Engineering Handoff Pack v1.1
 */

export type Environment = 'draft' | 'staging' | 'production';

export type ShipperUserRole =
  | 'Supply Chain Manager / Admin'
  | 'Logistics Specialist / Coordinator'
  | 'Warehouse / Dispatch Operator'
  | 'Finance Manager / Billing Specialist';

export type UserRole =
  // نقش‌های اصلی سازمان حمل‌ونقل (Carrier Primary Roles)
  | 'System Admin / Fleet Director'
  | 'Pricing & Yield Manager'
  | 'Dispatcher / Operations Specialist'
  | 'Sales & Customer Support'
  | 'Finance & Billing Specialist'
  // نقش‌های سازمان صاحب بار (Shipper Roles)
  | 'Supply Chain Manager / Admin'
  | 'Logistics Specialist / Coordinator'
  | 'Warehouse / Dispatch Operator'
  | 'Finance Manager / Billing Specialist'
  // نقش‌های خاص یا ثانویه - اختیاری بر اساس اندازه شرکت (Secondary Roles)
  | 'Fleet & Safety Manager'
  | 'Auditor / Read-Only'
  // نام‌های قبلی جهت سازگاری سیستم (Legacy Aliases)
  | 'Pricing Strategist'
  | 'Commercial Manager'
  | 'Contract Manager'
  | 'Finance Controller'
  | 'Governance Approver'
  | 'Key Account Manager'
  | 'System Admin';

export type RiskClass = 'low' | 'medium' | 'high';

export type LifecycleStatus =
  | 'Draft'
  | 'Validated'
  | 'Simulated'
  | 'In Review'
  | 'Approved'
  | 'Scheduled'
  | 'Active'
  | 'Paused'
  | 'Deprecated'
  | 'Archived';

// Schema & Entity Types
export interface SchemaAttribute {
  name: string;
  labelFa: string;
  labelEn: string;
  dataType: 'string' | 'number' | 'boolean' | 'enum' | 'geo_location' | 'date';
  required: boolean;
  unit?: string;
  enumValues?: string[];
  description?: string;
}

export interface CommodityCategory {
  id: string;
  code: string;
  nameFa: string;
  nameEn: string;
  riskClass?: RiskClass;
  riskMultiplier?: number;
  riskFactor?: number;
  insuranceRiskPercent?: number;
  hazmatAdrCode?: string;
  isColdChainRequired?: boolean;
  coldChainRequired?: boolean;
  isFragile?: boolean;
  isLiquidBulk?: boolean;
  hazardousADR?: boolean;
  sealRequired?: boolean;
  densityFactor?: number;
  descriptionFa?: string;
}

export interface FleetCategory {
  id: string;
  code: string;
  nameFa: string;
  nameEn: string;
  categoryType?: 'light' | 'medium' | 'heavy' | 'super_heavy' | 'specialized';
  minWeightTons?: number;
  maxWeightTons?: number;
  capacityTons?: number;
  volumeCbm?: number;
  volumeM3?: number;
  dimensionsMeters?: string;
  axleCount: number;
  fuelConsumptionLitersPer100Km?: number;
  baseKmRateToman?: number;
  baseCostPerKmToman?: number;
  descriptionFa?: string;
}

export interface GeoZone {
  id: string;
  code?: string;
  zoneCode?: string;
  nameFa?: string;
  nameEn?: string;
  zoneType?: 'urban' | 'intercity' | 'border_customs' | 'port_terminal' | 'industrial_hub' | 'rural_mining';
  provinceFa: string;
  cityFa?: string;
  latitude?: number;
  longitude?: number;
  difficultyMultiplier?: number;
  mountainousSurchargePercent?: number;
  terminalEntryFeeToman?: number;
  trafficSchemeRestricted?: boolean;
  centerCoordinates?: [number, number];
  isOriginHub?: boolean;
  isDestinationHub?: boolean;
  congestionMultiplier?: number;
  descriptionFa?: string;
}

export interface CorporateCreditAccount {
  id: string;
  companyNameFa?: string;
  customerNameFa?: string;
  companyCode?: string;
  customerCode?: string;
  customerNameEn?: string;
  nationalId?: string;
  industry?: string;
  tier?: 'Diamond' | 'Platinum' | 'Gold' | 'Silver';
  creditLimitToman: number;
  usedCreditToman?: number;
  currentOutstandingToman?: number;
  paymentTermDays?: number;
  paymentTermsDays?: number;
  overdueInvoicesCount?: number;
  bouncedChecksCount?: number;
  overdueAmountToman?: number;
  overdueDays?: number;
  status?: 'active' | 'warning' | 'blacklisted';
  isBlacklisted?: boolean;
  autoBlacklistReason?: string;
  blacklistReasonFa?: string;
  lastPaymentDate?: string;
  hasGuaranteedPromissoryNote?: boolean;
  promissoryNoteAmountToman?: number;
}

export interface StakeholderSplitConfig {
  carrierCommissionPercent: number; // e.g. 10.0%
  rahdariTaxPercent: number; // e.g. 4.0%
  mandatoryInsurancePercent: number; // e.g. 1.5%
  driverSharePercent?: number; // Calculated (100 - carrier - rahdari - insurance)
  driverDetentionSharePercent?: number;
  carrierDetentionSharePercent?: number;
  detentionHourlyRateToman?: number; // e.g. 350,000 Toman/hr
  loadingHandlingBaseToman?: number; // e.g. 800,000 Toman
  supplementaryInsuranceMultiplier?: number; // e.g. 0.001 (0.1% of declared value)
}

export interface RBACRoleDefinition {
  id: string;
  role?: UserRole;
  roleNameFa?: string;
  roleNameEn?: string;
  titleFa?: string;
  titleEn?: string;
  departmentFa?: string;
  levelBadge?: string;
  descriptionFa: string;
  category?: 'primary' | 'secondary';
  isMandatory?: boolean;
  accessScopeFa?: string;
  dutiesFa?: string[];
  userCount?: number;
  allowedModules?: string[];
  canApproveDeployment?: boolean;
  permissions?: {
    module: string;
    moduleNameFa: string;
    canRead: boolean;
    canWrite: boolean;
    canApprove: boolean;
    canPublish: boolean;
    canRollback: boolean;
  }[];
}

export interface SchemaDefinition {
  schemaId: string;
  name: string;
  version: number;
  entityType: 'RoadFreightShipment' | 'FleetVehicle' | 'LogisticsContract';
  attributes: SchemaAttribute[];
  status: LifecycleStatus;
}

// Catalog: Service & Product
export interface LogisticsService {
  serviceId: string;
  displayId: string; // e.g. SRV-LINEHAUL
  nameFa: string;
  nameEn: string;
  category: 'core_transport' | 'handling' | 'special_care' | 'insurance' | 'compliance';
  descriptionFa: string;
  dependencies?: string[]; // other serviceIds
  version: number;
  status: LifecycleStatus;
}

export interface LogisticsProduct {
  productId: string;
  displayId: string; // e.g. PRD-FTL-STD
  nameFa: string;
  nameEn: string;
  descriptionFa: string;
  vehicleType: string;
  serviceComponents: string[]; // serviceIds
  mandatoryComponents: string[];
  optionalComponents: string[];
  channelAvailability: string[];
  version: number;
  status: LifecycleStatus;
}

// Pricing Rules & AST
export type RuleBlockType =
  | 'base_matrix'
  | 'distance_rate'
  | 'weight_tier'
  | 'fuel_surcharge_hook'
  | 'mountainous_surcharge'
  | 'cold_chain_addon'
  | 'hazardous_adr_addon'
  | 'peak_season_multiplier'
  | 'margin_floor_guardrail'
  | 'custom_formula';

export interface RuleBlock {
  id: string;
  type: RuleBlockType;
  nameFa: string;
  nameEn: string;
  enabled: boolean;
  config: Record<string, any>;
  priority: number;
}

export interface RouteMatrixCell {
  originCity: string;
  destinationCity: string;
  vehicleType: string;
  baseRateToman: number;
  distanceKm: number;
  leadTimeHours: number;
  updatedAt?: string;
  lastChangedBy?: string;
  oldRateToman?: number; // for diffing
}

export interface MarginGuardrail {
  mode: 'clamp' | 'reject';
  minMarginPercent: number; // e.g. 15%
  maxDiscountCapPercent: number; // e.g. 25%
  minAbsolutePriceToman: number;
}

export interface PricingPolicy {
  policyId: string;
  displayId: string; // e.g. PP-204
  nameFa: string;
  nameEn: string;
  version: number;
  productRefs: string[];
  ruleBlocks: RuleBlock[];
  guardrails: MarginGuardrail;
  status: LifecycleStatus;
  ownerName: string;
  updatedAt: string;
}

// Eligibility & Discounts
export interface EligibilityPolicy {
  eligibilityId: string;
  displayId: string;
  nameFa: string;
  nameEn: string;
  version: number;
  conditions: {
    minTonnage?: number;
    allowedVehicles?: string[];
    allowedShipperTiers?: string[];
    hazardousCertifiedOnly?: boolean;
    coldChainCertifiedOnly?: boolean;
    activeContractRequired?: boolean;
  };
  status: LifecycleStatus;
}

export type DiscountType =
  | 'volume_tonnage'
  | 'backhaul_match'
  | 'multi_trip_monthly'
  | 'contract_negotiated'
  | 'partner_loyalty'
  | 'seasonal_early_booking';

export interface DiscountPolicy {
  discountId: string;
  displayId: string; // e.g. DP-19
  nameFa: string;
  nameEn: string;
  type: DiscountType;
  valuePercent?: number;
  valueAmountToman?: number;
  stackable: boolean;
  stackingGroup?: string;
  mutualExclusivityGroup?: string;
  priority: number;
  capPercentage?: number;
  capAmountToman?: number;
  monthlyBudgetCapToman?: number;
  budgetUsedToman?: number;
  status: LifecycleStatus;
  version: number;
}

// Offers & Contracts
export interface LogisticsOffer {
  offerId: string;
  displayId: string; // e.g. OF-88
  nameFa: string;
  nameEn: string;
  productId: string;
  pricingPolicyId: string;
  eligibilityPolicyIds: string[];
  discountPolicyIds: string[];
  channelScope: string[]; // e.g. ['Web Portal', 'TMS API', 'Broker Network', 'EDI']
  segmentScope: string[]; // e.g. ['Enterprise Shippers', 'SME Shippers', 'Export Shippers']
  effectiveFrom: string;
  effectiveTo: string;
  priority: number;
  status: LifecycleStatus;
  riskClass: RiskClass;
  version: number;
}

export interface VolumeBand {
  minTonsPerMonth: number;
  maxTonsPerMonth: number;
  discountPercent: number;
  unitRateDiscountTomanPerTonKm: number;
}

export interface LogisticsContract {
  contractId: string;
  displayId: string; // e.g. CT-330
  customerNameFa: string;
  customerNameEn: string;
  customerCode: string;
  industry: string; // e.g. 'پتروشیمی', 'صنایع غذایی', 'فولاد و معدن'
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver';
  volumeBands: VolumeBand[];
  minimumCommitmentTons: number;
  penaltyClausePerTonShortfallToman: number;
  negotiatedBaseOverrides: Record<string, number>; // routeKey -> custom rate
  fuelIndexAbsorptionPercent: number; // e.g. 50% absorbed by shipper
  effectiveFrom: string;
  effectiveTo: string;
  status: LifecycleStatus;
  version: number;
}

// Strategy Package (The ONLY deployable unit)
export interface StrategyPackage {
  packageId: string;
  displayId: string; // e.g. SP-1042
  titleFa: string;
  titleEn: string;
  version: number;
  schemaVersionRef: string;
  productVersionRefs: string[];
  pricingPolicyVersionRefs: string[];
  eligibilityPolicyVersionRefs: string[];
  discountPolicyVersionRefs: string[];
  offerVersionRefs: string[];
  contractOverlayVersionRefs: string[];
  simulationResultRef?: string;
  simulationPassed: boolean;
  approvalRecordRef?: string;
  effectiveFrom: string;
  effectiveTo: string;
  rollbackTargetRef?: string; // e.g. SP-1041@v8
  riskClass: RiskClass;
  status: LifecycleStatus;
  snapshotHash: string;
  authorName: string;
  approverName?: string;
  createdAt: string;
  publishedAt?: string;
  changeSummaryFa: string;
  environment: Environment;
}

// Simulation & Validation
export interface SimulationScenario {
  simulationId: string;
  displayId: string; // e.g. SIM-2026-08
  targetPackageRef: string; // e.g. SP-1042@v11
  targetPackageVersion: number;
  datasetName: string;
  sampleCount: number;
  scenarioType: 'historical_replay' | 'synthetic_fuel_shock' | 'winter_blizzard_peak' | 'competitor_discount_war';
  revenueDeltaPercent: number;
  marginDeltaPercent: number;
  avgFreightRateDeltaPercent: number;
  outlierCount: number;
  guardrailBreachCount: number;
  explainabilityScorePercent: number;
  result: 'pass' | 'fail' | 'pending';
  riskClass: RiskClass;
  executedAt: string;
  executedBy: string;
  recommendationFa: string;
  details: {
    segmentImpact: { segment: string; marginChange: number; volumeChange: number }[];
    topRoutes: { route: string; originalRate: number; newRate: number; margin: number }[];
  };
}

// Decision Trace (Exact Schema from Document 3 §8)
export interface AppliedRuleItem {
  ref: string;
  type: string;
  nameFa: string;
  valueToman: number;
  note?: string;
}

export interface SkippedRuleItem {
  ref: string;
  nameFa: string;
  reason: string;
}

export interface AppliedDiscountItem {
  ref: string;
  type: string;
  nameFa: string;
  discountToman: number;
  percent?: number;
}

export interface SkippedDiscountItem {
  ref: string;
  nameFa: string;
  reason: string;
}

export interface GuardrailOutcome {
  type: string;
  mode: 'clamp' | 'reject';
  status: 'ok' | 'clamped' | 'rejected';
  preValueToman?: number;
  clampedValueToman?: number;
  marginPercentCalculated: number;
  marginFloorRequired: number;
}

export interface ExternalHookUsed {
  hook: string;
  value: any;
  fallbackUsed: boolean;
  latencyMs: number;
}

export interface DecisionTrace {
  traceId: string; // e.g. DT-2026-08-21-0x74a
  tenantId: string;
  environment: Environment;
  requestId: string;
  correlationId: string;
  strategyPackageRef: {
    displayId: string;
    version: number;
    snapshotHash: string;
  };
  contextSnapshot: {
    originCity: string;
    destinationCity: string;
    vehicleType: string;
    cargoType: string;
    cargoWeightTons: number;
    isHazardous: boolean;
    isColdChain: boolean;
    isPeakSeason: boolean;
    customerContractId?: string;
    channel: string;
  };
  governingOffer: {
    ref: string;
    selectedBy: 'priority' | 'specificity' | 'effective_from' | 'id';
  };
  costBasisToman: number;
  appliedRules: AppliedRuleItem[];
  skippedRules: SkippedRuleItem[];
  appliedDiscounts: AppliedDiscountItem[];
  skippedDiscounts: SkippedDiscountItem[];
  guardrails: GuardrailOutcome[];
  externalDataUsed: ExternalHookUsed[];
  modelOutputs: { model: string; output: number; fallbackUsed: boolean }[];
  finalPriceToman: number;
  finalMarginPercent: number;
  currency: 'TOMAN' | 'IRR';
  explanationFa: string;
  explanationEn: string;
  createdAt: string;
  latencyMs: number;
}

// Anomaly Center
export interface PricingAnomaly {
  anomalyId: string;
  severity: 'critical' | 'high' | 'medium';
  titleFa: string;
  descriptionFa: string;
  impactedCorridor: string;
  impactedPackageRef: string;
  detectedMargin: number;
  expectedMargin: number;
  suspectedCauseFa: string;
  suggestedActionFa: string;
  detectedAt: string;
  status: 'active' | 'investigating' | 'resolved';
}

// Audit & Governance
export interface AuditLogEvent {
  eventId: string;
  eventType:
    | 'strategy.published'
    | 'strategy.rolled_back'
    | 'pricing.calculated'
    | 'margin.floor_changed'
    | 'policy.changed'
    | 'approval.granted'
    | 'approval.rejected'
    | 'simulation.executed'
    | 'package.created'
    | 'canary.stepped'
    | 'contract.created'
    | 'contract.updated'
    | 'rule.modified';
  actorName: string;
  actorRole: UserRole;
  objectRef: string;
  environment: Environment;
  timestamp: string;
  details: Record<string, any>;
  mfaVerified: boolean;
  immutableHash: string;
}

export type AnomalyItem = PricingAnomaly;

export interface ExternalConnector {
  connectorId: string;
  nameFa: string;
  nameEn: string;
  category: 'fuel_index' | 'toll_gateway' | 'weather_road' | 'tms_sync';
  endpointUrl: string;
  status: 'healthy' | 'degraded' | 'offline';
  avgLatencyMs: number;
  fallbackValue: any;
  circuitBreakerOpen: boolean;
  lastSyncAt: string;
}

// Additional Pricing OS Domain Entities
export interface DiscountRule {
  id: string;
  code: string;
  nameFa: string;
  descriptionFa: string;
  discountType: 'percentage' | 'fixed_per_ton' | 'backhaul_fixed';
  discountValue: number;
  isStackable: boolean;
  priority: number;
  monthlyBudgetCapToman: number;
  currentBudgetUsedToman: number;
  status: 'active' | 'paused' | 'expired';
}

export interface PricingRuleBlock {
  id: string;
  nameFa: string;
  nameEn: string;
  category: 'base' | 'surcharge' | 'seasonal' | 'guardrail';
  ruleDSL: string;
  priority: number;
  isEnabled: boolean;
  isMandatoryGuardrail?: boolean;
}

export interface DiffItem {
  fieldPath: string;
  fieldNameFa: string;
  oldValue: string;
  newValue: string;
}

export interface ApprovalRequest {
  id: string;
  displayId: string;
  titleFa: string;
  descriptionFa: string;
  makerName: string;
  makerRole: string;
  packageVersion: string;
  targetPackageId?: string;
  createdAt: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  checkerName?: string;
  checkerComment?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  riskClass?: 'low' | 'medium' | 'high';
  guardrailCompliance?: boolean;
  simulationPassed?: boolean;
  certificateNumber?: string;
  diffSummary: DiffItem[];
}

export interface HistoricalSimulationRecord {
  id: string;
  waybillId: string;
  date: string;
  originFa: string;
  destinationFa: string;
  fleetFa: string;
  weightTons: number;
  actualPaidToman: number;
  simulatedQuoteToman: number;
  variancePercent: number;
  status: 'profit_gain' | 'neutral' | 'risk_detected';
}


