import React, { useState } from 'react';
import { PricingProvider, usePricing } from './store/PricingContext';
import { Header } from './components/layout/Header';
import { AppSidebar } from './components/layout/AppSidebar';
import { LoginPage } from './components/login/LoginPage';
import { ShipperPortalLayout } from './components/shipper/ShipperPortalLayout';

// 5 Standard Workspaces
import { CommercialDesignStudioView } from './components/workspaces/design/CommercialDesignStudioView';
import { ValidationLabView } from './components/workspaces/validation/ValidationLabView';
import { ControlTowerView } from './components/workspaces/governance/ControlTowerView';
import { IntelligenceHubView } from './components/workspaces/intelligence/IntelligenceHubView';
import { SystemConsoleView } from './components/workspaces/system/SystemConsoleView';

import { UserRole } from './types/pricing';

// Modals & Drawers
import { DecisionTraceModal } from './components/common/DecisionTraceModal';
import { StepUpMFAModal } from './components/common/StepUpMFAModal';
import { QuickQuoteSandboxModal } from './components/common/QuickQuoteSandboxModal';
import { PublicQuickQuoteModal } from './components/login/PublicQuickQuoteModal';
import { AICoPilotDrawer } from './components/common/AICoPilotDrawer';

const AppContent: React.FC = () => {
  const { userPortalType, setUserRole, setUserName, setUserOrgName, setUserEmail, setUserPortalType } = usePricing();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isPublicQuickQuoteOpen, setIsPublicQuickQuoteOpen] = useState<boolean>(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('design');

  // Sub-tabs for each of the 5 standard workspaces
  const [designSubTab, setDesignSubTab] = useState<string>('catalog');
  const [validationSubTab, setValidationSubTab] = useState<string>('single_quote');
  const [governanceSubTab, setGovernanceSubTab] = useState<string>('approval_inbox');
  const [intelligenceSubTab, setIntelligenceSubTab] = useState<string>('executive_kpis');
  const [systemSubTab, setSystemSubTab] = useState<string>('fleet_master');

  const [isAiCoPilotOpen, setIsAiCoPilotOpen] = useState(false);

  const getCurrentSubTab = () => {
    switch (activeWorkspaceId) {
      case 'design':
        return designSubTab;
      case 'validation':
        return validationSubTab;
      case 'governance':
        return governanceSubTab;
      case 'intelligence':
        return intelligenceSubTab;
      case 'system':
        return systemSubTab;
      default:
        return undefined;
    }
  };

  const handleSelectSubTab = (workspaceId: string, subTabId: string) => {
    setActiveWorkspaceId(workspaceId);
    if (workspaceId === 'design') {
      setDesignSubTab(subTabId);
    } else if (workspaceId === 'validation') {
      setValidationSubTab(subTabId);
    } else if (workspaceId === 'governance') {
      setGovernanceSubTab(subTabId);
    } else if (workspaceId === 'intelligence') {
      setIntelligenceSubTab(subTabId);
    } else if (workspaceId === 'system') {
      setSystemSubTab(subTabId);
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
      setActiveWorkspaceId('design');
      setDesignSubTab('contracts');
    } else {
      setActiveWorkspaceId('design');
      setDesignSubTab('catalog');
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

  // If user authenticated as Shipper, render the Shipper Portal Layout
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
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col antialiased selection:bg-slate-900 selection:text-amber-400">
      {/* Header with Environment Status and Controls */}
      <Header
        onToggleAiCoPilot={() => setIsAiCoPilotOpen(!isAiCoPilotOpen)}
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={setActiveWorkspaceId}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Container */}
      <div className="w-full max-w-[98%] 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 flex-1 items-start">
        {/* Right Sidebar: 5 Main Workspaces */}
        <AppSidebar
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={setActiveWorkspaceId}
          activeSubTab={getCurrentSubTab()}
          onSelectSubTab={handleSelectSubTab}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          {/* Workspace 1: Commercial Design Studio */}
          {activeWorkspaceId === 'design' && (
            <CommercialDesignStudioView
              activeSubTab={designSubTab}
              onSubTabChange={(tab) => setDesignSubTab(tab)}
              onNavigateToValidation={() => {
                setActiveWorkspaceId('validation');
                setValidationSubTab('single_quote');
              }}
            />
          )}

          {/* Workspace 2: Validation Lab */}
          {activeWorkspaceId === 'validation' && (
            <ValidationLabView
              activeSubTab={validationSubTab}
              onSubTabChange={(tab) => setValidationSubTab(tab)}
            />
          )}

          {/* Workspace 3: Control Tower */}
          {activeWorkspaceId === 'governance' && (
            <ControlTowerView
              activeSubTab={governanceSubTab}
              onSubTabChange={(tab) => setGovernanceSubTab(tab)}
            />
          )}

          {/* Workspace 4: Intelligence Hub */}
          {activeWorkspaceId === 'intelligence' && (
            <IntelligenceHubView
              activeSubTab={intelligenceSubTab}
              onSubTabChange={(tab) => setIntelligenceSubTab(tab)}
            />
          )}

          {/* Workspace 5: System Console */}
          {activeWorkspaceId === 'system' && (
            <SystemConsoleView
              activeSubTab={systemSubTab}
              onSubTabChange={(tab) => setSystemSubTab(tab)}
            />
          )}
        </main>
      </div>

      {/* Minimalistic Clean Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-5 mt-12">
        <div className="w-full max-w-[98%] 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">سامانه مدیریت و قیمت‌گذاری سازمان‌های حمل‌ونقل جاده‌ای</span>
            <span>•</span>
            <span className="text-slate-400 font-mono">Road Freight Pricing & Governance Platform</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-slate-50 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
              موتور محاسباتی قطعی (Deterministic Engine)
            </span>
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg border border-emerald-300 font-semibold">
              گاردریل کف سود ۱۵٪ فعال
            </span>
            <span className="bg-slate-50 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
              تفکیک وظایف Maker-Checker (BR-012)
            </span>
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
