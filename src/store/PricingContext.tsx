/**
 * Pricing OS Global Context & State Management
 * Implements Golden Path workflows, Maker-Checker rules, Environment Isolation, and Simulation/Rollback mechanics
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Environment,
  UserRole,
  RiskClass,
  StrategyPackage,
  PricingPolicy,
  RuleBlock,
  RouteMatrixCell,
  LogisticsContract,
  LogisticsProduct,
  LogisticsService,
  DiscountPolicy,
  LogisticsOffer,
  SimulationScenario,
  PricingAnomaly,
  AuditLogEvent,
  ExternalConnector,
  DecisionTrace,
  SchemaDefinition,
  SchemaAttribute,
  CommodityCategory,
  FleetCategory,
  GeoZone,
  CorporateCreditAccount,
  StakeholderSplitConfig,
  RBACRoleDefinition,
  ApprovalRequest,
} from '../types/pricing';
import {
  INITIAL_SCHEMA,
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_ROUTE_MATRIX,
  INITIAL_PRICING_POLICY,
  INITIAL_DISCOUNT_POLICIES,
  INITIAL_OFFERS,
  INITIAL_CONTRACTS,
  INITIAL_STRATEGY_PACKAGES,
  INITIAL_SIMULATIONS,
  INITIAL_ANOMALIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_CONNECTORS,
  INITIAL_COMMODITY_TYPES,
  INITIAL_FLEET_CATEGORIES,
  INITIAL_GEO_ZONES,
  INITIAL_STAKEHOLDER_SPLIT_CONFIG,
  INITIAL_CORPORATE_CREDIT_ACCOUNTS,
  INITIAL_RBAC_ROLES,
  INITIAL_APPROVAL_REQUESTS,
} from '../data/mockLogisticsData';
import {
  CARRIER_ORGANIZATIONS,
  SHIPPER_ORGANIZATIONS,
  CarrierOrgProfile,
  ShipperOrgProfile,
} from '../data/mockOrganizationProfiles';
import { calculateShipmentPrice, ShipmentPricingContext, EngineExecutionResult } from '../engine/pricingEngine';

interface PricingContextType {
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userName: string;
  setUserName: (name: string) => void;
  userOrgName: string;
  setUserOrgName: (org: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userPortalType: 'carrier' | 'shipper' | 'retail';
  setUserPortalType: (type: 'carrier' | 'shipper' | 'retail') => void;
  lang: 'fa' | 'en';
  setLang: (lang: 'fa' | 'en') => void;
  isSovereignMode: boolean;
  setIsSovereignMode: (val: boolean) => void;
  fuelIndexMultiplier: number;
  setFuelIndexMultiplier: (val: number) => void;

  // Multi-Tenancy & Isolation
  carrierOrganizations: CarrierOrgProfile[];
  shipperOrganizations: ShipperOrgProfile[];
  currentCarrierOrgId: string;
  currentShipperOrgId: string;
  currentCarrierOrg: CarrierOrgProfile;
  currentShipperOrg: ShipperOrgProfile;
  switchCarrierOrg: (orgId: string) => void;
  switchShipperOrg: (orgId: string) => void;
  isOrgSwitcherOpen: boolean;
  setIsOrgSwitcherOpen: (open: boolean) => void;

  // Domain Collections
  schema: SchemaDefinition;
  setSchema: (schema: SchemaDefinition) => void;
  addSchemaAttribute: (attr: SchemaAttribute) => void;
  updateSchemaAttribute: (attrName: string, updated: Partial<SchemaAttribute>) => void;
  deleteSchemaAttribute: (attrName: string) => void;
  commodities: CommodityCategory[];
  updateCommodity: (commodity: CommodityCategory) => void;
  addCommodity: (commodity: CommodityCategory) => void;
  fleetCategories: FleetCategory[];
  updateFleetCategory: (fleet: FleetCategory) => void;
  addFleetCategory: (fleet: FleetCategory) => void;
  geoZones: GeoZone[];
  updateGeoZone: (zone: GeoZone) => void;
  addGeoZone: (zone: GeoZone) => void;
  stakeholderSplits: StakeholderSplitConfig;
  updateStakeholderSplits: (splits: Partial<StakeholderSplitConfig>) => void;
  creditAccounts: CorporateCreditAccount[];
  updateCreditAccount: (account: CorporateCreditAccount) => void;
  toggleBlacklistAccount: (accountId: string, reason?: string) => void;
  rbacRoles: RBACRoleDefinition[];

  services: LogisticsService[];
  products: LogisticsProduct[];
  routeMatrix: RouteMatrixCell[];
  pricingPolicy: PricingPolicy;
  setPricingPolicy: React.Dispatch<React.SetStateAction<PricingPolicy>>;
  updatePricingPolicy: (updated: Partial<PricingPolicy>) => void;
  updateRuleBlock: (blockId: string, updated: Partial<RuleBlock>) => void;
  addRuleBlock: (block: RuleBlock) => void;
  deleteRuleBlock: (blockId: string) => void;
  toggleRuleBlock: (blockId: string) => void;
  addRouteMatrixCell: (cell: RouteMatrixCell) => void;
  deleteRouteMatrixCell: (originCity: string, destinationCity: string, vehicleType: string) => void;
  discountPolicies: DiscountPolicy[];
  offers: LogisticsOffer[];
  contracts: LogisticsContract[];
  setContracts: React.Dispatch<React.SetStateAction<LogisticsContract[]>>;
  addContract: (contract: LogisticsContract) => void;
  updateContract: (contract: LogisticsContract) => void;
  deleteContract: (contractId: string) => void;
  strategyPackages: StrategyPackage[];
  approvalQueue: ApprovalRequest[];
  simulations: SimulationScenario[];
  anomalies: PricingAnomaly[];
  auditLogs: AuditLogEvent[];
  connectors: ExternalConnector[];

  // Active Production & Staging Package
  activeProductionPackage: StrategyPackage;
  activeStagingPackage: StrategyPackage | undefined;

  // Interactive Operations
  calculatePrice: (ctx: ShipmentPricingContext) => EngineExecutionResult;
  updateRouteMatrixCell: (updatedCell: RouteMatrixCell) => void;
  updatePricingPolicyGuardrails: (minMargin: number, maxDiscountCap: number, mode: 'clamp' | 'reject') => void;
  createStrategyPackage: (pkg: Partial<StrategyPackage>) => StrategyPackage;
  submitPackageForReview: (packageId: string) => { success: boolean; error?: string };
  approvePackage: (packageId: string, approverName: string) => { success: boolean; error?: string };
  publishPackage: (packageId: string, canaryPercent: number) => { success: boolean; error?: string };
  deployPackage: (packageId: string) => { success: boolean; error?: string };
  rollbackPackage: (targetPackageId: string, reason: string) => { success: boolean; error?: string };
  approveRequest: (requestId: string, comment?: string) => { success: boolean; error?: string };
  rejectRequest: (requestId: string, reason: string) => { success: boolean; error?: string };
  submitForApproval: (request: Partial<ApprovalRequest>) => ApprovalRequest;
  triggerStepUpMFA: (description: string, onConfirm: () => void) => void;
  runSimulation: (scenario: Partial<SimulationScenario>) => SimulationScenario;
  resolveAnomaly: (anomalyId: string) => void;
  addAuditLog: (event: Partial<AuditLogEvent>) => void;

  // UI State for Traces & Modals
  selectedTrace: DecisionTrace | null;
  setSelectedTrace: (trace: DecisionTrace | null) => void;
  isQuickQuoteOpen: boolean;
  setIsQuickQuoteOpen: (open: boolean) => void;
  isMfaModalOpen: boolean;
  setIsMfaModalOpen: (open: boolean) => void;
  pendingMfaAction: (() => void) | null;
  setPendingMfaAction: (action: (() => void) | null) => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [environment, setEnvironment] = useState<Environment>('production');
  const [userRole, setUserRole] = useState<UserRole>('Pricing Strategist');
  const [userName, setUserName] = useState<string>('سارا رضایی (مدیر ارشد قیمت‌گذاری)');
  const [userOrgName, setUserOrgName] = useState<string>('شرکت حمل و نقل سراسری خلیج فارس');
  const [userEmail, setUserEmail] = useState<string>('sara.rezaei@pg-logistics.ir');
  const [userPortalType, setUserPortalType] = useState<'carrier' | 'shipper' | 'retail'>('carrier');
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [isSovereignMode, setIsSovereignMode] = useState<boolean>(true); // Default to in-boundary / sovereign
  const [fuelIndexMultiplier, setFuelIndexMultiplier] = useState<number>(1.04);

  // Multi-Tenancy & Isolation State
  const [carrierOrganizations] = useState<CarrierOrgProfile[]>(CARRIER_ORGANIZATIONS);
  const [shipperOrganizations] = useState<ShipperOrgProfile[]>(SHIPPER_ORGANIZATIONS);
  const [currentCarrierOrgId, setCurrentCarrierOrgId] = useState<string>('CARRIER-PG-01');
  const [currentShipperOrgId, setCurrentShipperOrgId] = useState<string>('SHP-MSC-01');
  const [isOrgSwitcherOpen, setIsOrgSwitcherOpen] = useState<boolean>(false);

  const currentCarrierOrg = carrierOrganizations.find((c) => c.id === currentCarrierOrgId) || carrierOrganizations[0];
  const currentShipperOrg = shipperOrganizations.find((s) => s.id === currentShipperOrgId) || shipperOrganizations[0];

  // Domain Collections
  const [schema, setSchema] = useState<SchemaDefinition>(INITIAL_SCHEMA);
  const [commodities, setCommodities] = useState<CommodityCategory[]>(INITIAL_COMMODITY_TYPES);
  const [fleetCategories, setFleetCategories] = useState<FleetCategory[]>(INITIAL_FLEET_CATEGORIES);
  const [geoZones, setGeoZones] = useState<GeoZone[]>(INITIAL_GEO_ZONES);
  const [stakeholderSplits, setStakeholderSplits] = useState<StakeholderSplitConfig>(INITIAL_STAKEHOLDER_SPLIT_CONFIG);
  const [creditAccounts, setCreditAccounts] = useState<CorporateCreditAccount[]>(INITIAL_CORPORATE_CREDIT_ACCOUNTS);
  const [rbacRoles] = useState<RBACRoleDefinition[]>(INITIAL_RBAC_ROLES);

  const [services, setServices] = useState<LogisticsService[]>(INITIAL_SERVICES);
  const [products, setProducts] = useState<LogisticsProduct[]>(INITIAL_PRODUCTS);
  const [routeMatrix, setRouteMatrix] = useState<RouteMatrixCell[]>(INITIAL_ROUTE_MATRIX);
  const [pricingPolicy, setPricingPolicy] = useState<PricingPolicy>(INITIAL_PRICING_POLICY);
  const [discountPolicies, setDiscountPolicies] = useState<DiscountPolicy[]>(INITIAL_DISCOUNT_POLICIES);
  const [offers, setOffers] = useState<LogisticsOffer[]>(INITIAL_OFFERS);
  const [contracts, setContracts] = useState<LogisticsContract[]>(INITIAL_CONTRACTS);
  const [strategyPackages, setStrategyPackages] = useState<StrategyPackage[]>(INITIAL_STRATEGY_PACKAGES);
  const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>(INITIAL_APPROVAL_REQUESTS);
  const [simulations, setSimulations] = useState<SimulationScenario[]>(INITIAL_SIMULATIONS);
  const [anomalies, setAnomalies] = useState<PricingAnomaly[]>(INITIAL_ANOMALIES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEvent[]>(INITIAL_AUDIT_LOGS);
  const [connectors, setConnectors] = useState<ExternalConnector[]>(INITIAL_CONNECTORS);

  // Switch Carrier Org with isolated domain state update
  const switchCarrierOrg = (orgId: string) => {
    const targetOrg = carrierOrganizations.find((c) => c.id === orgId);
    if (!targetOrg) return;
    setCurrentCarrierOrgId(orgId);
    setUserOrgName(targetOrg.nameFa);
    if (targetOrg.contracts) setContracts(targetOrg.contracts);
    if (targetOrg.creditAccounts) setCreditAccounts(targetOrg.creditAccounts);
    if (targetOrg.strategyPackages) setStrategyPackages(targetOrg.strategyPackages);
    if (targetOrg.anomalies) setAnomalies(targetOrg.anomalies);
    if (targetOrg.auditLogs) setAuditLogs(targetOrg.auditLogs);
    if (targetOrg.services) setServices(targetOrg.services);
    if (targetOrg.products) setProducts(targetOrg.products);
    if (targetOrg.routeMatrix) setRouteMatrix(targetOrg.routeMatrix);
    if (targetOrg.fuelIndexMultiplier) setFuelIndexMultiplier(targetOrg.fuelIndexMultiplier);
  };

  // Switch Shipper Org
  const switchShipperOrg = (orgId: string) => {
    const targetOrg = shipperOrganizations.find((s) => s.id === orgId);
    if (!targetOrg) return;
    setCurrentShipperOrgId(orgId);
    if (userPortalType === 'shipper') {
      setUserOrgName(targetOrg.nameFa);
      if (targetOrg.teamMembers?.[0]) {
        setUserName(targetOrg.teamMembers[0].fullName);
        setUserEmail(targetOrg.teamMembers[0].email);
      }
    }
  };

  // Helper functions for new collections
  const addSchemaAttribute = (attr: SchemaAttribute) => {
    setSchema((prev) => ({
      ...prev,
      attributes: [...prev.attributes, attr],
    }));
  };

  const updateSchemaAttribute = (attrName: string, updated: Partial<SchemaAttribute>) => {
    setSchema((prev) => ({
      ...prev,
      attributes: (prev?.attributes || []).map((a) => (a.name === attrName ? { ...a, ...updated } : a)),
    }));
  };

  const deleteSchemaAttribute = (attrName: string) => {
    setSchema((prev) => ({
      ...prev,
      attributes: (prev?.attributes || []).filter((a) => a.name !== attrName),
    }));
  };

  const updateCommodity = (commodity: CommodityCategory) => {
    setCommodities((prev) => prev.map((c) => (c.id === commodity.id ? commodity : c)));
  };

  const addCommodity = (commodity: CommodityCategory) => {
    setCommodities((prev) => [commodity, ...prev]);
  };

  const updateFleetCategory = (fleet: FleetCategory) => {
    setFleetCategories((prev) => prev.map((f) => (f.id === fleet.id ? fleet : f)));
  };

  const addFleetCategory = (fleet: FleetCategory) => {
    setFleetCategories((prev) => [fleet, ...prev]);
  };

  const updateGeoZone = (zone: GeoZone) => {
    setGeoZones((prev) => prev.map((z) => (z.id === zone.id ? zone : z)));
  };

  const addGeoZone = (zone: GeoZone) => {
    setGeoZones((prev) => [zone, ...prev]);
  };

  const updateStakeholderSplits = (splits: Partial<StakeholderSplitConfig>) => {
    setStakeholderSplits((prev) => {
      const updated = { ...prev, ...splits };
      if (splits.carrierCommissionPercent !== undefined || splits.rahdariTaxPercent !== undefined || splits.mandatoryInsurancePercent !== undefined) {
        updated.driverSharePercent = Math.max(0, 100 - (updated.carrierCommissionPercent + updated.rahdariTaxPercent + updated.mandatoryInsurancePercent));
      }
      return updated;
    });
  };

  const updateCreditAccount = (account: CorporateCreditAccount) => {
    setCreditAccounts((prev) => prev.map((a) => (a.id === account.id ? account : a)));
  };

  const toggleBlacklistAccount = (accountId: string, reason?: string) => {
    setCreditAccounts((prev) =>
      prev.map((a) => {
        if (a.id === accountId) {
          const isCurrentlyBlacklisted = a.status === 'blacklisted';
          return {
            ...a,
            status: isCurrentlyBlacklisted ? 'active' : 'blacklisted',
            autoBlacklistReason: isCurrentlyBlacklisted ? undefined : (reason || 'قرارگیری دستی در لیست سیاه به دستور مدیر مالی'),
          };
        }
        return a;
      })
    );
  };

  const addContract = (contract: LogisticsContract) => {
    setContracts((prev) => [contract, ...prev]);
    addAuditLog({
      eventType: 'contract.created',
      objectRef: `${contract.displayId} (${contract.customerNameFa})`,
      actorName: userName,
      actorRole: userRole,
      details: {
        customerCode: contract.customerCode,
        tier: contract.tier,
        minimumCommitmentTons: contract.minimumCommitmentTons,
      },
    });
  };

  const updateContract = (contract: LogisticsContract) => {
    setContracts((prev) => prev.map((c) => (c.contractId === contract.contractId ? contract : c)));
    addAuditLog({
      eventType: 'contract.updated',
      objectRef: `${contract.displayId} (${contract.customerNameFa})`,
      actorName: userName,
      actorRole: userRole,
      details: {
        customerCode: contract.customerCode,
        tier: contract.tier,
      },
    });
  };

  const deleteContract = (contractId: string) => {
    setContracts((prev) => prev.filter((c) => c.contractId !== contractId));
  };

  // Modals & UI Traces
  const [selectedTrace, setSelectedTrace] = useState<DecisionTrace | null>(null);
  const [isQuickQuoteOpen, setIsQuickQuoteOpen] = useState<boolean>(false);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState<boolean>(false);
  const [pendingMfaAction, setPendingMfaAction] = useState<(() => void) | null>(null);

  // Sync user name on role change
  useEffect(() => {
    switch (userRole) {
      case 'Pricing Strategist':
        setUserName('سارا رضایی (مدیر ارشد تعرفه)');
        break;
      case 'Finance Controller':
        setUserName('دکتر علی بهرامی (معاونت مالی و کنترل سود)');
        break;
      case 'Governance Approver':
        setUserName('دکتر علی بهرامی (کمیته حاکمیت و ریسک)');
        break;
      case 'Commercial Manager':
        setUserName('مهندس کامران رستمی (مدیر تجاری و قراردادها)');
        break;
      case 'Key Account Manager':
        setUserName('مریم عباسی (مدیر حساب مشتریان عمده)');
        break;
      case 'Contract Manager':
        setUserName('امیرحسین ثانی‌خانی (مدیر امور قراردادها)');
        break;
      case 'System Admin':
        setUserName('ادمین ارشد زیرساخت (SysAdmin)');
        break;
    }
  }, [userRole]);

  // Derive Active Packages
  const activeProductionPackage =
    strategyPackages.find((p) => p.environment === 'production' && p.status === 'Active') || strategyPackages?.[0];
  const activeStagingPackage = strategyPackages.find((p) => p.environment === 'staging' && (p.status === 'In Review' || p.status === 'Active'));

  const calculatePrice = (ctx: ShipmentPricingContext): EngineExecutionResult => {
    const pkgToUse = environment === 'staging' && activeStagingPackage ? activeStagingPackage : activeProductionPackage;
    return calculateShipmentPrice(ctx, pkgToUse, pricingPolicy, routeMatrix, contracts, fuelIndexMultiplier);
  };

  const updateRouteMatrixCell = (updatedCell: RouteMatrixCell) => {
    setRouteMatrix((prev) =>
      prev.map((cell) => {
        if (
          cell.originCity === updatedCell.originCity &&
          cell.destinationCity === updatedCell.destinationCity &&
          cell.vehicleType === updatedCell.vehicleType
        ) {
          return {
            ...updatedCell,
            oldRateToman: cell.baseRateToman,
            updatedAt: new Date().toISOString().slice(0, 10),
            lastChangedBy: userName,
          };
        }
        return cell;
      })
    );

    addAuditLog({
      eventType: 'policy.changed',
      objectRef: `MatrixCell[${updatedCell.originCity}->${updatedCell.destinationCity}]`,
      actorName: userName,
      actorRole: userRole,
      details: {
        newRateToman: updatedCell.baseRateToman,
        vehicleType: updatedCell.vehicleType,
      },
    });
  };

  const updatePricingPolicyGuardrails = (minMargin: number, maxDiscountCap: number, mode: 'clamp' | 'reject') => {
    setPricingPolicy((prev) => ({
      ...prev,
      guardrails: {
        ...prev.guardrails,
        minMarginPercent: minMargin,
        maxDiscountCapPercent: maxDiscountCap,
        mode,
      },
      updatedAt: new Date().toISOString().slice(0, 10),
    }));

    addAuditLog({
      eventType: 'margin.floor_changed',
      objectRef: `${pricingPolicy.displayId}@v${pricingPolicy.version}`,
      actorName: userName,
      actorRole: userRole,
      details: {
        newMinMarginPercent: minMargin,
        maxDiscountCapPercent: maxDiscountCap,
        mode,
      },
      mfaVerified: true,
    });
  };

  const updatePricingPolicy = (updated: Partial<PricingPolicy>) => {
    setPricingPolicy((prev) => ({
      ...prev,
      ...updated,
      updatedAt: new Date().toISOString().slice(0, 10),
    }));
    addAuditLog({
      eventType: 'policy.changed',
      objectRef: `${pricingPolicy.displayId}@v${pricingPolicy.version}`,
      actorName: userName,
      actorRole: userRole,
      details: { change: 'به‌روزرسانی تنظیمات سیاست تعرفه' },
    });
  };

  const updateRuleBlock = (blockId: string, updated: Partial<RuleBlock>) => {
    setPricingPolicy((prev) => ({
      ...prev,
      ruleBlocks: (prev?.ruleBlocks || []).map((b) => (b.id === blockId ? { ...b, ...updated } : b)),
      updatedAt: new Date().toISOString().slice(0, 10),
    }));
    addAuditLog({
      eventType: 'policy.changed',
      objectRef: `RuleBlock[${blockId}]`,
      actorName: userName,
      actorRole: userRole,
      details: { blockId, updated },
    });
  };

  const addRuleBlock = (block: RuleBlock) => {
    setPricingPolicy((prev) => ({
      ...prev,
      ruleBlocks: [...(prev?.ruleBlocks || []), block],
      updatedAt: new Date().toISOString().slice(0, 10),
    }));
    addAuditLog({
      eventType: 'policy.changed',
      objectRef: `RuleBlock[${block.id}]`,
      actorName: userName,
      actorRole: userRole,
      details: { action: 'ایجاد بلوک قاعده جدید', nameFa: block.nameFa },
    });
  };

  const deleteRuleBlock = (blockId: string) => {
    setPricingPolicy((prev) => ({
      ...prev,
      ruleBlocks: (prev?.ruleBlocks || []).filter((b) => b.id !== blockId),
      updatedAt: new Date().toISOString().slice(0, 10),
    }));
    addAuditLog({
      eventType: 'policy.changed',
      objectRef: `RuleBlock[${blockId}]`,
      actorName: userName,
      actorRole: userRole,
      details: { action: 'حذف بلوک قاعده', blockId },
    });
  };

  const toggleRuleBlock = (blockId: string) => {
    setPricingPolicy((prev) => ({
      ...prev,
      ruleBlocks: (prev?.ruleBlocks || []).map((b) => (b.id === blockId ? { ...b, enabled: !b.enabled } : b)),
      updatedAt: new Date().toISOString().slice(0, 10),
    }));
  };

  const addRouteMatrixCell = (cell: RouteMatrixCell) => {
    setRouteMatrix((prev) => [
      {
        ...cell,
        updatedAt: new Date().toISOString().slice(0, 10),
        lastChangedBy: userName,
      },
      ...prev.filter(
        (c) =>
          !(
            c.originCity === cell.originCity &&
            c.destinationCity === cell.destinationCity &&
            c.vehicleType === cell.vehicleType
          )
      ),
    ]);
    addAuditLog({
      eventType: 'policy.changed',
      objectRef: `MatrixCell[${cell.originCity}->${cell.destinationCity}]`,
      actorName: userName,
      actorRole: userRole,
      details: { action: 'افزودن سلول ماتریس', baseRateToman: cell.baseRateToman },
    });
  };

  const deleteRouteMatrixCell = (originCity: string, destinationCity: string, vehicleType: string) => {
    setRouteMatrix((prev) =>
      prev.filter(
        (c) =>
          !(
            c.originCity === originCity &&
            c.destinationCity === destinationCity &&
            c.vehicleType === vehicleType
          )
      )
    );
  };

  const createStrategyPackage = (pkg: Partial<StrategyPackage>): StrategyPackage => {
    const newDisplayId = `SP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPkg: StrategyPackage = {
      packageId: `pkg-${Date.now()}`,
      displayId: newDisplayId,
      titleFa: pkg.titleFa || 'بسته تعرفه جدید ناوگان جاده‌ای',
      titleEn: pkg.titleEn || 'New Freight Strategy Package',
      version: 1,
      schemaVersionRef: 'sch-road-freight-v2@v2',
      productVersionRefs: ['PRD-FTL-STD@v4', 'PRD-COLD-EXP@v3'],
      pricingPolicyVersionRefs: [`${pricingPolicy.displayId}@v${pricingPolicy.version}`],
      eligibilityPolicyVersionRefs: ['ELG-01@v2'],
      discountPolicyVersionRefs: ['DP-19@v4', 'DP-22@v3'],
      offerVersionRefs: ['OF-88@v3'],
      contractOverlayVersionRefs: ['CT-330@v2'],
      simulationPassed: false,
      effectiveFrom: new Date().toISOString(),
      effectiveTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      rollbackTargetRef: activeProductionPackage.displayId,
      riskClass: (pkg.riskClass as RiskClass) || 'medium',
      status: 'Draft',
      snapshotHash: Math.random().toString(16).substring(2, 26),
      authorName: userName,
      createdAt: new Date().toISOString().slice(0, 10),
      changeSummaryFa: pkg.changeSummaryFa || 'تعریف اولیه بسته استراتژی تعرفه',
      environment: 'draft',
    };

    setStrategyPackages((prev) => [newPkg, ...prev]);

    addAuditLog({
      eventType: 'package.created',
      objectRef: `${newPkg.displayId}@v1`,
      actorName: userName,
      actorRole: userRole,
      details: { title: newPkg.titleFa, riskClass: newPkg.riskClass },
    });

    return newPkg;
  };

  const submitPackageForReview = (packageId: string): { success: boolean; error?: string } => {
    const pkg = strategyPackages.find((p) => p.packageId === packageId);
    if (!pkg) return { success: false, error: 'پکیج یافت نشد.' };

    // BR-033: High or Medium Risk packages require a passing simulation before review
    if (pkg.riskClass !== 'low' && !pkg.simulationPassed) {
      return {
        success: false,
        error: 'گیت اعتبارسنجی (BR-033): پکیج‌های با ریسک متوسط یا بالا، قبل از ارسال به کارتابل تصویب باید حتما شبیه‌سازی موفق (Pass) داشته باشند.',
      };
    }

    setStrategyPackages((prev) =>
      prev.map((p) => (p.packageId === packageId ? { ...p, status: 'In Review', environment: 'staging' } : p))
    );

    addAuditLog({
      eventType: 'strategy.published',
      objectRef: `${pkg.displayId}@v${pkg.version}`,
      actorName: userName,
      actorRole: userRole,
      details: { status: 'In Review', environment: 'staging' },
    });

    return { success: true };
  };

  const approvePackage = (packageId: string, approver: string): { success: boolean; error?: string } => {
    const pkg = strategyPackages.find((p) => p.packageId === packageId);
    if (!pkg) return { success: false, error: 'پکیج یافت نشد.' };

    // BR-012: Maker != Checker (Author cannot approve their own package)
    if (pkg.authorName === approver) {
      return {
        success: false,
        error: 'گیت حاکمیتی (BR-012 - قانون سازنده/تصویب‌کننده): ایجادکننده پکیج نمی‌تواند خودش اقدام به تصویب پکیج در محیط عملیاتی نماید.',
      };
    }

    setStrategyPackages((prev) =>
      prev.map((p) =>
        p.packageId === packageId
          ? {
              ...p,
              status: 'Approved',
              approverName: approver,
              approvalRecordRef: `appr-rec-${Date.now()}`,
            }
          : p
      )
    );

    addAuditLog({
      eventType: 'approval.granted',
      objectRef: `${pkg.displayId}@v${pkg.version}`,
      actorName: approver,
      actorRole: userRole,
      details: { author: pkg.authorName, approver },
      mfaVerified: true,
    });

    return { success: true };
  };

  const publishPackage = (packageId: string, canaryPercent: number): { success: boolean; error?: string } => {
    const pkg = strategyPackages.find((p) => p.packageId === packageId);
    if (!pkg) return { success: false, error: 'پکیج یافت نشد.' };

    if (pkg.status !== 'Approved') {
      return {
        success: false,
        error: 'گیت انتشار: تنها پکیج‌های تصویب‌شده (Approved) مجاز به انتشار در پروداکشن هستند.',
      };
    }

    // Set existing active packages to Archived/Deprecated
    setStrategyPackages((prev) =>
      prev.map((p) => {
        if (p.packageId === packageId) {
          return {
            ...p,
            status: 'Active',
            environment: 'production',
            publishedAt: new Date().toISOString(),
            rollbackTargetRef: activeProductionPackage.displayId,
          };
        }
        if (p.environment === 'production' && p.status === 'Active') {
          return { ...p, status: 'Archived' };
        }
        return p;
      })
    );

    addAuditLog({
      eventType: 'strategy.published',
      objectRef: `${pkg.displayId}@v${pkg.version}`,
      actorName: userName,
      actorRole: userRole,
      details: {
        environment: 'production',
        canaryPercent: `${canaryPercent}%`,
        invalidationNodes: 12,
        snapshotHash: pkg.snapshotHash,
      },
      mfaVerified: true,
    });

    return { success: true };
  };

  const rollbackPackage = (targetDisplayId: string, reason: string): { success: boolean; error?: string } => {
    const targetPkg = strategyPackages.find((p) => p.displayId === targetDisplayId);
    if (!targetPkg) return { success: false, error: 'پکیج هدف برای بازگشت اضطراری یافت نشد.' };

    setStrategyPackages((prev) =>
      prev.map((p) => {
        if (p.displayId === targetDisplayId) {
          return {
            ...p,
            status: 'Active',
            environment: 'production',
            publishedAt: new Date().toISOString(),
          };
        }
        if (p.packageId === activeProductionPackage.packageId) {
          return { ...p, status: 'Paused' };
        }
        return p;
      })
    );

    addAuditLog({
      eventType: 'strategy.rolled_back',
      objectRef: `${targetPkg.displayId}@v${targetPkg.version}`,
      actorName: userName,
      actorRole: userRole,
      details: {
        reason,
        previousPackage: activeProductionPackage.displayId,
        activeNow: targetPkg.displayId,
      },
      mfaVerified: true,
    });

    return { success: true };
  };

  const deployPackage = (packageId: string): { success: boolean; error?: string } => {
    return publishPackage(packageId, 100);
  };

  const triggerStepUpMFA = (_description: string, onConfirm: () => void) => {
    setPendingMfaAction(() => onConfirm);
    setIsMfaModalOpen(true);
  };

  const approveRequest = (requestId: string, comment?: string): { success: boolean; error?: string } => {
    const req = approvalQueue.find((q) => q.id === requestId);
    if (!req) return { success: false, error: 'درخواست در صف تایید یافت نشد.' };

    const approvedTime = new Date().toISOString();
    const certNumber = `CERT-GOV-${Math.floor(1000 + Math.random() * 9000)}-IR`;

    setApprovalQueue((prev) =>
      prev.map((q) =>
        q.id === requestId
          ? {
              ...q,
              status: 'approved',
              checkerName: userName,
              checkerComment: comment || 'تایید شد با احراز هویت دوعاملی (MFA OTP). کلیه پارامترهای گاردریل و حاشیه سود احراز گردید.',
              approvedAt: approvedTime,
              certificateNumber: certNumber,
            }
          : q
      )
    );

    if (req.targetPackageId) {
      setStrategyPackages((prev) =>
        prev.map((p) =>
          p.packageId === req.targetPackageId
            ? {
                ...p,
                status: 'Approved',
                approverName: userName,
                approvalRecordRef: certNumber,
              }
            : p
        )
      );
    }

    addAuditLog({
      eventType: 'approval.granted',
      objectRef: req.displayId,
      actorName: userName,
      actorRole: userRole,
      details: {
        packageVersion: req.packageVersion,
        maker: req.makerName,
        comment: comment || 'تایید دوطرفه مدیر حاکمیت',
        certificateNumber: certNumber,
      },
      mfaVerified: true,
    });

    return { success: true };
  };

  const rejectRequest = (requestId: string, reason: string): { success: boolean; error?: string } => {
    const req = approvalQueue.find((q) => q.id === requestId);
    if (!req) return { success: false, error: 'درخواست یافت نشد.' };

    const rejectedTime = new Date().toISOString();

    setApprovalQueue((prev) =>
      prev.map((q) =>
        q.id === requestId
          ? {
              ...q,
              status: 'rejected',
              checkerName: userName,
              rejectionReason: reason,
              rejectedAt: rejectedTime,
            }
          : q
      )
    );

    if (req.targetPackageId) {
      setStrategyPackages((prev) =>
        prev.map((p) =>
          p.packageId === req.targetPackageId
            ? {
                ...p,
                status: 'Draft',
              }
            : p
        )
      );
    }

    addAuditLog({
      eventType: 'approval.rejected',
      objectRef: req.displayId,
      actorName: userName,
      actorRole: userRole,
      details: {
        packageVersion: req.packageVersion,
        maker: req.makerName,
        reason,
      },
      mfaVerified: true,
    });

    return { success: true };
  };

  const submitForApproval = (request: Partial<ApprovalRequest>): ApprovalRequest => {
    const newReq: ApprovalRequest = {
      id: `req-gov-${Date.now()}`,
      displayId: `REQ-GOV-2026-${Math.floor(10 + Math.random() * 90)}`,
      titleFa: request.titleFa || 'درخواست تصویب بسته تعرفه',
      descriptionFa: request.descriptionFa || '',
      makerName: userName,
      makerRole: userRole,
      packageVersion: request.packageVersion || 'v1.0 (Staging)',
      targetPackageId: request.targetPackageId,
      createdAt: new Date().toISOString(),
      status: 'pending_approval',
      riskClass: request.riskClass || 'medium',
      guardrailCompliance: request.guardrailCompliance ?? true,
      simulationPassed: request.simulationPassed ?? true,
      diffSummary: request.diffSummary || [
        {
          fieldPath: 'policies.guardrails.minimumGrossMarginPercent',
          fieldNameFa: 'کف حاشیه سود ناخالص شرکت',
          oldValue: '۱۵.۰٪',
          newValue: '۱۵.۵٪',
        },
      ],
    };

    setApprovalQueue((prev) => [newReq, ...prev]);

    if (newReq.targetPackageId) {
      setStrategyPackages((prev) =>
        prev.map((p) =>
          p.packageId === newReq.targetPackageId ? { ...p, status: 'In Review', environment: 'staging' } : p
        )
      );
    }

    addAuditLog({
      eventType: 'strategy.published',
      objectRef: newReq.displayId,
      actorName: userName,
      actorRole: userRole,
      details: { title: newReq.titleFa, version: newReq.packageVersion },
    });

    return newReq;
  };

  const runSimulation = (scenario: Partial<SimulationScenario>): SimulationScenario => {
    const newSim: SimulationScenario = {
      simulationId: `sim-${Date.now()}`,
      displayId: `SIM-2026-${Math.floor(100 + Math.random() * 900)}`,
      targetPackageRef: scenario.targetPackageRef || activeProductionPackage.displayId,
      targetPackageVersion: scenario.targetPackageVersion || activeProductionPackage.version,
      datasetName: scenario.datasetName || 'داده‌های واقعی ۱۰,۰۰۰ بارنامه سال گذشته (پاییز ۱۴۰۴)',
      sampleCount: scenario.sampleCount || 10000,
      scenarioType: scenario.scenarioType || 'historical_replay',
      revenueDeltaPercent: scenario.revenueDeltaPercent || +7.2,
      marginDeltaPercent: scenario.marginDeltaPercent || +1.5,
      avgFreightRateDeltaPercent: scenario.avgFreightRateDeltaPercent || +5.8,
      outlierCount: scenario.outlierCount || 3,
      guardrailBreachCount: scenario.guardrailBreachCount || 0,
      explainabilityScorePercent: 99.8,
      result: (scenario.result as 'pass' | 'fail') || 'pass',
      riskClass: (scenario.riskClass as RiskClass) || 'medium',
      executedAt: new Date().toISOString(),
      executedBy: userName,
      recommendationFa:
        scenario.recommendationFa ||
        'نتایج شبیه‌سازی حاکی از پایداری حاشیه سود بالای ۱۵٪ و عدم ایجاد نقض گاردریل در کریدورهای اصلی است.',
      details: scenario.details || {
        segmentImpact: [
          { segment: 'پتروشیمی و شیمیایی', marginChange: +1.8, volumeChange: +3.9 },
          { segment: 'زنجیره سرد و پروتئینی', marginChange: +1.2, volumeChange: +2.8 },
        ],
        topRoutes: [
          { route: 'تهران ➔ بندرعباس', originalRate: 38500000, newRate: 38500000, margin: 18.2 },
          { route: 'اصفهان ➔ بوشهر', originalRate: 24500000, newRate: 24500000, margin: 16.8 },
        ],
      },
    };

    setSimulations((prev) => [newSim, ...prev]);

    // Mark the target package as simulation passed
    setStrategyPackages((prev) =>
      prev.map((p) =>
        p.displayId === newSim.targetPackageRef
          ? { ...p, simulationPassed: newSim.result === 'pass', simulationResultRef: newSim.simulationId }
          : p
      )
    );

    addAuditLog({
      eventType: 'simulation.executed',
      objectRef: newSim.displayId,
      actorName: userName,
      actorRole: userRole,
      details: {
        targetPackage: newSim.targetPackageRef,
        result: newSim.result,
        revenueDelta: `${newSim.revenueDeltaPercent}%`,
      },
    });

    return newSim;
  };

  const resolveAnomaly = (anomalyId: string) => {
    setAnomalies((prev) => prev.map((a) => (a.anomalyId === anomalyId ? { ...a, status: 'resolved' } : a)));
  };

  const addAuditLog = (event: Partial<AuditLogEvent>) => {
    const newLog: AuditLogEvent = {
      eventId: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventType: event.eventType || 'pricing.calculated',
      actorName: event.actorName || userName,
      actorRole: event.actorRole || userRole,
      objectRef: event.objectRef || 'SYSTEM',
      environment: event.environment || environment,
      timestamp: new Date().toISOString(),
      details: event.details || {},
      mfaVerified: !!event.mfaVerified,
      immutableHash: Math.random().toString(16).substring(2, 34),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <PricingContext.Provider
      value={{
        environment,
        setEnvironment,
        userRole,
        setUserRole,
        userName,
        setUserName,
        userOrgName,
        setUserOrgName,
        userEmail,
        setUserEmail,
        userPortalType,
        setUserPortalType,
        lang,
        setLang,
        isSovereignMode,
        setIsSovereignMode,
        fuelIndexMultiplier,
        setFuelIndexMultiplier,
        carrierOrganizations,
        shipperOrganizations,
        currentCarrierOrgId,
        currentShipperOrgId,
        currentCarrierOrg,
        currentShipperOrg,
        switchCarrierOrg,
        switchShipperOrg,
        isOrgSwitcherOpen,
        setIsOrgSwitcherOpen,
        schema,
        setSchema,
        addSchemaAttribute,
        updateSchemaAttribute,
        deleteSchemaAttribute,
        commodities,
        updateCommodity,
        addCommodity,
        fleetCategories,
        updateFleetCategory,
        addFleetCategory,
        geoZones,
        updateGeoZone,
        addGeoZone,
        stakeholderSplits,
        updateStakeholderSplits,
        creditAccounts,
        updateCreditAccount,
        toggleBlacklistAccount,
        rbacRoles,
        services,
        products,
        routeMatrix,
        pricingPolicy,
        setPricingPolicy,
        updatePricingPolicy,
        updateRuleBlock,
        addRuleBlock,
        deleteRuleBlock,
        toggleRuleBlock,
        addRouteMatrixCell,
        deleteRouteMatrixCell,
        discountPolicies,
        offers,
        contracts,
        setContracts,
        addContract,
        updateContract,
        deleteContract,
        strategyPackages,
        approvalQueue,
        simulations,
        anomalies,
        auditLogs,
        connectors,
        activeProductionPackage,
        activeStagingPackage,
        calculatePrice,
        updateRouteMatrixCell,
        updatePricingPolicyGuardrails,
        createStrategyPackage,
        submitPackageForReview,
        approvePackage,
        publishPackage,
        deployPackage,
        rollbackPackage,
        approveRequest,
        rejectRequest,
        submitForApproval,
        triggerStepUpMFA,
        runSimulation,
        resolveAnomaly,
        addAuditLog,
        selectedTrace,
        setSelectedTrace,
        isQuickQuoteOpen,
        setIsQuickQuoteOpen,
        isMfaModalOpen,
        setIsMfaModalOpen,
        pendingMfaAction,
        setPendingMfaAction,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};
