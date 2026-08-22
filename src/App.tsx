import React, { useState } from 'react';
import { PricingProvider, usePricing } from './store/PricingContext';
import { Header } from './components/layout/Header';
import { AppSidebar } from './components/layout/AppSidebar';
import { LoginPage } from './components/login/LoginPage';
import { ShipperPortalLayout } from './components/shipper/ShipperPortalLayout';

// 7 Pillars Workspace Views
// 1. Commercial & Pricing Studio
import { SchemaBuilderView } from './components/workspaces/design/SchemaBuilderView';
import { GeoZoneMatrixView } from './components/workspaces/design/GeoZoneMatrixView';
import { PricingRulesEngineView } from './components/workspaces/design/PricingRulesEngineView';

// 2. Discounts & Contract Studio
import { EnterprisePriceBooksView } from './components/workspaces/contracts/EnterprisePriceBooksView';
import { DiscountStrategiesView } from './components/workspaces/contracts/DiscountStrategiesView';

// 3. Validation Lab & Simulation
import { HistoricalReplayView } from './components/workspaces/validation/HistoricalReplayView';
import { ImpactRiskAnalysisView } from './components/workspaces/validation/ImpactRiskAnalysisView';

// 4. Control Tower & Deployment
import { MakerCheckerWorkflowView } from './components/workspaces/governance/MakerCheckerWorkflowView';
import { StrategyPackagesDeploymentView } from './components/workspaces/governance/StrategyPackagesDeploymentView';

// 5. Live Operations & Observability
import { LiveOpsControlPanelView } from './components/workspaces/operations/LiveOpsControlPanelView';
import { PriceTraceDebuggerView } from './components/workspaces/operations/PriceTraceDebuggerView';

// 6. Financials & Settlement
import { CommissionSplitsView } from './components/workspaces/financials/CommissionSplitsView';
import { CreditSettlementView } from './components/workspaces/financials/CreditSettlementView';

// 7. System Settings & Integrations
import { RBACUsersView } from './components/workspaces/system/RBACUsersView';
import { IntegrationsHubView } from './components/workspaces/system/IntegrationsHubView';

import { UserRole } from './types/pricing';

// Modals
import { DecisionTraceModal } from './components/common/DecisionTraceModal';
import { StepUpMFAModal } from './components/common/StepUpMFAModal';
import { QuickQuoteSandboxModal } from './components/common/QuickQuoteSandboxModal';
import { PublicQuickQuoteModal } from './components/login/PublicQuickQuoteModal';
import { AICoPilotDrawer } from './components/common/AICoPilotDrawer';

const AppContent: React.FC = () => {
  const { userPortalType, setUserRole, setUserName, setUserOrgName, setUserEmail, setUserPortalType } = usePricing();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isPublicQuickQuoteOpen, setIsPublicQuickQuoteOpen] = useState<boolean>(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('design');

  // Sub-tabs for each of the 7 pillars
  const [designSubTab, setDesignSubTab] = useState<'schema' | 'geomapping' | 'rules_dsl'>('schema');
  const [contractsSubTab, setContractsSubTab] = useState<'price_books' | 'discount_strategies'>('price_books');
  const [validationSubTab, setValidationSubTab] = useState<'historical_replay' | 'sensitivity'>('historical_replay');
  const [governanceSubTab, setGovernanceSubTab] = useState<'maker_checker' | 'packages_release'>('maker_checker');
  const [operationsSubTab, setOperationsSubTab] = useState<'live_dashboard' | 'price_debugger'>('live_dashboard');
  const [financialsSubTab, setFinancialsSubTab] = useState<'commission_splits' | 'credit_settlement'>('commission_splits');
  const [systemSubTab, setSystemSubTab] = useState<'rbac_access' | 'integrations_hub'>('rbac_access');

  const [isAiCoPilotOpen, setIsAiCoPilotOpen] = useState(false);

  const getCurrentSubTab = () => {
    switch (activeWorkspaceId) {
      case 'design':
        return designSubTab;
      case 'contracts':
        return contractsSubTab;
      case 'validation':
        return validationSubTab;
      case 'governance':
        return governanceSubTab;
      case 'operations':
        return operationsSubTab;
      case 'financials':
        return financialsSubTab;
      case 'system':
        return systemSubTab;
      default:
        return undefined;
    }
  };

  const handleSelectSubTab = (workspaceId: string, subTabId: string) => {
    setActiveWorkspaceId(workspaceId);
    if (workspaceId === 'design') {
      setDesignSubTab(subTabId as any);
    } else if (workspaceId === 'contracts') {
      setContractsSubTab(subTabId as any);
    } else if (workspaceId === 'validation') {
      setValidationSubTab(subTabId as any);
    } else if (workspaceId === 'governance') {
      setGovernanceSubTab(subTabId as any);
    } else if (workspaceId === 'operations') {
      setOperationsSubTab(subTabId as any);
    } else if (workspaceId === 'financials') {
      setFinancialsSubTab(subTabId as any);
    } else if (workspaceId === 'system') {
      setSystemSubTab(subTabId as any);
    }
  };

  const handleLogin = (
    portalType: 'carrier' | 'shipper',
    role?: UserRole,
    details?: { orgName?: string; userName?: string; userEmail?: string }
  ) => {
    if (role) {
      setUserRole(role);
    } else if (portalType === 'carrier') {
      setUserRole('Pricing Strategist');
    } else {
      setUserRole('Key Account Manager');
    }

    if (details?.userName) {
      setUserName(details.userName);
    }
    if (details?.orgName) {
      setUserOrgName(details.orgName);
    }
    if (details?.userEmail) {
      setUserEmail(details.userEmail);
    }
    setUserPortalType(portalType);

    if (portalType === 'shipper') {
      setActiveWorkspaceId('contracts');
      setContractsSubTab('price_books');
    } else {
      setActiveWorkspaceId('design');
      setDesignSubTab('schema');
    }

    setIsAuthenticated(true);
  };

  // If not authenticated, render the rich Landing & Login Page first
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          onOpenQuickQuote={() => setIsPublicQuickQuoteOpen(true)}
        />
        <PublicQuickQuoteModal
          isOpen={isPublicQuickQuoteOpen}
          onClose={() => setIsPublicQuickQuoteOpen(false)}
        />
      </>
    );
  }

  // If user authenticated as Shipper, render the comprehensive Shipper Portal Layout
  if (userPortalType === 'shipper') {
    return (
      <>
        <ShipperPortalLayout
          onLogout={() => setIsAuthenticated(false)}
          onSwitchToCarrierPortal={() => setUserPortalType('carrier')}
        />
        <QuickQuoteSandboxModal />
      </>
    );
  }

  // Carrier / Logistics Organization Portal Layout
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased selection:bg-amber-500/20 selection:text-amber-900">
      {/* Header with Environment Status and Controls */}
      <Header
        onToggleAiCoPilot={() => setIsAiCoPilotOpen(!isAiCoPilotOpen)}
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={setActiveWorkspaceId}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Container: Wide container with right sidebar pushed to the side to give maximum space to central views */}
      <div className="w-full max-w-[98%] 2xl:max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-6 py-6 flex flex-col lg:flex-row gap-5 flex-1 items-start">
        {/* Right Sidebar: 7 Main Workspaces with Top-to-Bottom Sub-sections */}
        <AppSidebar
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={setActiveWorkspaceId}
          activeSubTab={getCurrentSubTab()}
          onSelectSubTab={handleSelectSubTab}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          {/* Workspace 1: Commercial & Pricing Studio */}
          {activeWorkspaceId === 'design' && (
            <div>
              {designSubTab === 'schema' && <SchemaBuilderView />}
              {designSubTab === 'geomapping' && <GeoZoneMatrixView />}
              {designSubTab === 'rules_dsl' && <PricingRulesEngineView />}
            </div>
          )}

          {/* Workspace 2: Discounts & Contract Studio */}
          {activeWorkspaceId === 'contracts' && (
            <div>
              {contractsSubTab === 'price_books' && <EnterprisePriceBooksView />}
              {contractsSubTab === 'discount_strategies' && <DiscountStrategiesView />}
            </div>
          )}

          {/* Workspace 3: Validation Lab & Simulation */}
          {activeWorkspaceId === 'validation' && (
            <div>
              {validationSubTab === 'historical_replay' && <HistoricalReplayView />}
              {validationSubTab === 'sensitivity' && <ImpactRiskAnalysisView />}
            </div>
          )}

          {/* Workspace 4: Control Tower & Deployment */}
          {activeWorkspaceId === 'governance' && (
            <div>
              {governanceSubTab === 'maker_checker' && <MakerCheckerWorkflowView />}
              {governanceSubTab === 'packages_release' && <StrategyPackagesDeploymentView />}
            </div>
          )}

          {/* Workspace 5: Live Operations & Observability */}
          {activeWorkspaceId === 'operations' && (
            <div>
              {operationsSubTab === 'live_dashboard' && <LiveOpsControlPanelView />}
              {operationsSubTab === 'price_debugger' && <PriceTraceDebuggerView />}
            </div>
          )}

          {/* Workspace 6: Financials & Settlement */}
          {activeWorkspaceId === 'financials' && (
            <div>
              {financialsSubTab === 'commission_splits' && <CommissionSplitsView />}
              {financialsSubTab === 'credit_settlement' && <CreditSettlementView />}
            </div>
          )}

          {/* Workspace 7: System Settings & Integrations */}
          {activeWorkspaceId === 'system' && (
            <div>
              {systemSubTab === 'rbac_access' && <RBACUsersView />}
              {systemSubTab === 'integrations_hub' && <IntegrationsHubView />}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-6 mt-12">
        <div className="w-full max-w-[98%] 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-title">سیستم عامل قیمت‌گذاری لجستیک جاده‌ای</span>
            <span>•</span>
            <span className="text-slate-500">Road Freight Pricing Operating System</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-slate-600 text-xs">
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">موتور محاسباتی قطعی (Deterministic Engine)</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">تضمین گاردریل کف حاشیه سود ۱۵٪</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">تایید دوطرفه سازمانی (Maker-Checker & MFA)</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <DecisionTraceModal />
      <StepUpMFAModal />
      <QuickQuoteSandboxModal />
      <AICoPilotDrawer isOpen={isAiCoPilotOpen} onClose={() => setIsAiCoPilotOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <PricingProvider>
      <AppContent />
    </PricingProvider>
  );
}
