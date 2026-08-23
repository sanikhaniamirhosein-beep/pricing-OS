import React, { useState } from 'react';
import {
  PlugZap,
  Code2,
  Key,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Globe,
  ExternalLink,
  Shield,
  Layers,
  Send,
  Activity,
  Server,
  Terminal,
  X,
  Zap,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';

interface ConnectorItem {
  id: string;
  nameFa: string;
  nameEn: string;
  endpointUrl: string;
  protocol: string;
  status: 'online' | 'warning' | 'offline';
  latencyMs: number;
  lastSync: string;
  uptime: string;
  packetLoss: string;
  tlsVersion: string;
  lastTestLog?: {
    timestamp: string;
    httpStatus: number;
    responseTimeMs: number;
    serverCluster: string;
    payloadPreview: string;
  };
}

export const IntegrationsHubView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testApiEndpoint, setTestApiEndpoint] = useState('/api/v2/pricing/quote');
  const [testApiResponse, setTestApiResponse] = useState<string | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  // Connectors State
  const [testingConnectorId, setTestingConnectorId] = useState<string | null>(null);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<ConnectorItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const [connectors, setConnectors] = useState<ConnectorItem[]>([
    {
      id: 'conn-rahdari',
      nameFa: 'سامانه برخط صدور بارنامه دولتی (سازمان راهداری)',
      nameEn: 'RMTO Government Waybill Connector',
      endpointUrl: 'https://smartwaybill.rmto.ir/ws/v3/health',
      protocol: 'SOAP / REST WebService',
      status: 'online',
      latencyMs: 38,
      lastSync: '۲ ثانیه پیش',
      uptime: '99.98%',
      packetLoss: '0%',
      tlsVersion: 'TLS 1.3 / ECC-256',
      lastTestLog: {
        timestamp: '۱۴۰۳/۱۲/۰۲ - ۱۲:۳۰:۱۴',
        httpStatus: 200,
        responseTimeMs: 38,
        serverCluster: 'rmto-tehran-cluster-02',
        payloadPreview: '{"status": "UP", "version": "3.4.1", "db_sync": "synced", "queue_backlog": 0}',
      },
    },
    {
      id: 'conn-map',
      nameFa: 'ماتریس فاصله، زمان سیر و ترافیک معابر',
      nameEn: 'Routing & Map Matrix Engine',
      endpointUrl: 'grpc://matrix.pricing-os.ir:50051/HealthCheck',
      protocol: 'gRPC / HTTP2',
      status: 'online',
      latencyMs: 14,
      lastSync: 'لحظه‌ای',
      uptime: '100.0%',
      packetLoss: '0%',
      tlsVersion: 'mTLS / HTTP2',
      lastTestLog: {
        timestamp: '۱۴۰۳/۱۲/۰۲ - ۱۲:۳۰:۲۲',
        httpStatus: 200,
        responseTimeMs: 14,
        serverCluster: 'edge-iran-cdn-node-01',
        payloadPreview: '{"grpc_status": "SERVING", "active_nodes": 6, "routing_cache_hit_rate": "98.4%"}',
      },
    },
    {
      id: 'conn-fuel',
      nameFa: 'شاخص گازوئیل و فرآورده‌های نفتی کشور',
      nameEn: 'NIOPDC Fuel Index Feed',
      endpointUrl: 'https://fuel-index.niopdc.ir/api/v2/rates/current',
      protocol: 'REST Webhook',
      status: 'online',
      latencyMs: 52,
      lastSync: '۱۰ دقیقه پیش',
      uptime: '99.95%',
      packetLoss: '0%',
      tlsVersion: 'TLS 1.3 / RSA-2048',
      lastTestLog: {
        timestamp: '۱۴۰۳/۱۲/۰۲ - ۱۲:۲۰:۰۰',
        httpStatus: 200,
        responseTimeMs: 52,
        serverCluster: 'niopdc-primary-gw',
        payloadPreview: '{"fuel_base_irr": 3000, "transport_subsidized_ratio": 1.04, "feed_valid_until": "2026-08-30"}',
      },
    },
    {
      id: 'conn-weather',
      nameFa: 'هواشناسی و پایش گردنه‌های برف‌گیر',
      nameEn: 'National Meteorological Hazard Feed',
      endpointUrl: 'https://services.irimo.ir/road-hazards/v1/live',
      protocol: 'JSON Polling (15 min)',
      status: 'online',
      latencyMs: 45,
      lastSync: '۵ دقیقه پیش',
      uptime: '99.90%',
      packetLoss: '0%',
      tlsVersion: 'TLS 1.2 / RSA-2048',
      lastTestLog: {
        timestamp: '۱۴۰۳/۱۲/۰۲ - ۱۲:۲۵:۰۰',
        httpStatus: 200,
        responseTimeMs: 45,
        serverCluster: 'irimo-meteo-grid-04',
        payloadPreview: '{"active_mountain_passes": 42, "snow_surcharge_active": ["asadabad", "heiran"], "alert_level": "YELLOW"}',
      },
    },
  ]);

  const apiKeysList = [
    {
      id: 'key-1',
      name: 'کلید وب‌سرویس پتروشیمی خلیج فارس (ERP SAP Connector)',
      prefix: 'sk_live_pgpic_99281...',
      environment: 'Production',
      created: '۱۴۰۳/۰۵/۱۰',
      rateLimit: '۵,۰۰۰ ریکوئست/دقیقه',
    },
    {
      id: 'key-2',
      name: 'کلید اتصال TMS همکاران سیستم',
      prefix: 'sk_live_sg_tms_44012...',
      environment: 'Production',
      created: '۱۴۰۳/۰۸/۲۲',
      rateLimit: '۲,۵۰۰ ریکوئست/دقیقه',
    },
    {
      id: 'key-3',
      name: 'محیط آزمایشی و تست استعلام (Staging Sandbox)',
      prefix: 'sk_test_sandbox_00192...',
      environment: 'Sandbox',
      created: '۱۴۰۳/۱۱/۰۱',
      rateLimit: '۵۰۰ ریکوئست/دقیقه',
    },
  ];

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Perform Connection Health Test on a Single Connector
  const handleTestConnectorHealth = (connectorId: string) => {
    setTestingConnectorId(connectorId);
    
    // Simulate real ping & SSL handshake
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      setConnectors((prev) =>
        prev.map((c) => {
          if (c.id === connectorId) {
            // Generate jittered latency around actual baseline
            const newLatency = Math.floor(Math.random() * 25) + (c.id === 'conn-map' ? 10 : 25);
            const updatedItem: ConnectorItem = {
              ...c,
              status: 'online',
              latencyMs: newLatency,
              lastSync: 'هم‌اکنون',
              lastTestLog: {
                timestamp: `۱۴۰۳/۱۲/۰۲ - ${timeStr}`,
                httpStatus: 200,
                responseTimeMs: newLatency,
                serverCluster: c.lastTestLog?.serverCluster || 'prod-edge-dc',
                payloadPreview: c.lastTestLog?.payloadPreview || '{"status": "UP", "healthy": true}',
              },
            };
            setSelectedDiagnostic(updatedItem);
            return updatedItem;
          }
          return c;
        })
      );

      setTestingConnectorId(null);
      const targetConn = connectors.find((c) => c.id === connectorId);
      showToast(`تست سلامت اتصال «${targetConn?.nameFa || 'کانکتور'}» با موفقیت انجام شد (پاسخ: 200 OK)`);
    }, 750);
  };

  // Test All Connectors in Batch
  const handleTestAllConnectors = () => {
    setIsTestingAll(true);
    let completedCount = 0;

    connectors.forEach((conn, index) => {
      setTimeout(() => {
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const newLatency = Math.floor(Math.random() * 20) + (conn.id === 'conn-map' ? 9 : 22);

        setConnectors((prev) =>
          prev.map((c) =>
            c.id === conn.id
              ? {
                  ...c,
                  status: 'online',
                  latencyMs: newLatency,
                  lastSync: 'هم‌اکنون',
                  lastTestLog: {
                    timestamp: `۱۴۰۳/۱۲/۰۲ - ${timeStr}`,
                    httpStatus: 200,
                    responseTimeMs: newLatency,
                    serverCluster: c.lastTestLog?.serverCluster || 'edge-cluster',
                    payloadPreview: c.lastTestLog?.payloadPreview || '{"status": "UP"}',
                  },
                }
              : c
          )
        );

        completedCount++;
        if (completedCount === connectors.length) {
          setIsTestingAll(false);
          showToast('کلیه ۴ کانکتور خارجی با موفقیت پایش و بازآزمایی شدند (وضعیت ۱۰۰٪ پایدار)');
        }
      }, (index + 1) * 350);
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunApiTest = () => {
    setIsTestingApi(true);
    setTimeout(() => {
      setIsTestingApi(false);
      setTestApiResponse(
        JSON.stringify(
          {
            status: 200,
            success: true,
            executionTimeMs: 11.8,
            quoteId: 'Q-2026-99410',
            currency: 'IRR',
            pricing: {
              baseFreightToman: 38500000,
              fuelSurchargeToman: 3080000,
              difficultySurchargeToman: 3080000,
              discountsToman: 1925000,
              rahdariTaxToman: 1540000,
              insuranceToman: 850000,
              finalTotalToman: 45045000,
            },
            guardrailValidation: 'PASSED_MIN_MARGIN_15%',
          },
          null,
          2
        )
      );
    }, 600);
  };

  const avgLatency = Math.round(
    connectors.reduce((acc, c) => acc + c.latencyMs, 0) / connectors.length
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <PlugZap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۷.۲ هاب اتصال، کانکتورها و وب‌سرویس‌ها (Integrations & APIs Hub)
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                  ۴ کانکتور عملیاتی
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                اتصال مستقیم به سامانه راهداری دولتی، سرویس‌های نقشه، فید قیمت سوخت و مدیریت کلیدهای API جهت یکپارچه‌سازی با ERP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestAllConnectors}
              disabled={isTestingAll || !!testingConnectorId}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingAll ? 'animate-spin' : ''}`} />
              <span>{isTestingAll ? 'در حال تست همگانی...' : 'تست سلامت کلیه کانکتورها'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* External Connectors Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-title">
              کانکتورهای زیرساختی و سامانه‌های دولتی
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              پایش بلادرنگ اتصالات وب‌سرویس به سامانه‌های حاکمیتی و زیرساختی
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
              میانگین تأخیر (Latency): {avgLatency}ms
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectors.map((conn) => {
            const isCurrentlyTesting = testingConnectorId === conn.id || isTestingAll;

            return (
              <div
                key={conn.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between transition-all hover:border-slate-300 hover:shadow-xs relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{conn.nameFa}</h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{conn.nameEn}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      آنلاین و فعال
                    </span>
                  </div>

                  <div className="mt-2 text-[10px] font-mono text-slate-400 truncate bg-slate-100/80 px-2 py-1 rounded-md">
                    {conn.endpointUrl}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-100 text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-400 block">پروتکل:</span>
                      <span className="font-mono font-bold text-slate-700 text-[10px]">{conn.protocol}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">تأخیر (Latency):</span>
                      <span className="font-mono font-bold text-emerald-700">{conn.latencyMs}ms</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">پایداری (SLA):</span>
                      <span className="font-mono font-bold text-slate-800">{conn.uptime}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs gap-2">
                  <span className="text-[11px] text-slate-400">آخرین تست: {conn.lastSync}</span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDiagnostic(conn)}
                      className="text-slate-500 hover:text-slate-800 font-bold text-[11px] px-2 py-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                    >
                      لاگ تله‌متری
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTestConnectorHealth(conn.id)}
                      disabled={isCurrentlyTesting}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 disabled:bg-slate-100 text-amber-900 border border-amber-300/80 rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-2xs transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCurrentlyTesting ? 'animate-spin text-amber-600' : 'text-amber-800'}`} />
                      <span>{isCurrentlyTesting ? 'در حال پایش...' : 'تست سلامت اتصال'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Health Check Diagnostic Modal */}
      {selectedDiagnostic && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-title">
                    کارنامه سلامت اتصال و پاسخ وب‌سرویس
                  </h3>
                  <p className="text-xs text-slate-500">{selectedDiagnostic.nameFa}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDiagnostic(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">وضعیت پاسخ:</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    HTTP {selectedDiagnostic.lastTestLog?.httpStatus || 200} OK
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">زمان پاسخ (RTT):</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {selectedDiagnostic.latencyMs} ms
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">پکت لاس (Packet Loss):</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {selectedDiagnostic.packetLoss}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">امنیت رمزنگاری:</span>
                  <span className="font-bold text-slate-800 text-[10px] truncate block">
                    {selectedDiagnostic.tlsVersion}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">آدرس نقطه انتهایی (Pinged URL):</span>
                <div className="p-2 bg-slate-100 text-slate-800 font-mono text-[11px] rounded-xl border border-slate-200 break-all select-all">
                  {selectedDiagnostic.endpointUrl}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">پاسخ دریافتی تله‌متری سرور (Payload Preview):</span>
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 overflow-x-auto max-h-40">
                  <pre>{selectedDiagnostic.lastTestLog?.payloadPreview}</pre>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>کلاستر پاسخ‌دهنده: {selectedDiagnostic.lastTestLog?.serverCluster}</span>
                <span>زمان ثبت: {selectedDiagnostic.lastTestLog?.timestamp}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleTestConnectorHealth(selectedDiagnostic.id)}
                disabled={testingConnectorId === selectedDiagnostic.id}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingConnectorId === selectedDiagnostic.id ? 'animate-spin' : ''}`} />
                <span>تست مجدد</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDiagnostic(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys & Webhooks Management */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900 font-title">
              کلیدهای احراز هویت وب‌سرویس (API Keys)
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          {apiKeysList.map((key) => (
            <div
              key={key.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{key.name}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      key.environment === 'Production'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {key.environment}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span>{key.prefix}</span>
                  <span>•</span>
                  <span>محدودیت نرخ: {key.rateLimit}</span>
                </div>
              </div>

              <button
                onClick={() => handleCopy(key.prefix, key.id)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                {copiedKey === key.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    کپی شد
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    کپی کلید API
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live API Console Tester */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900 font-title">
              کنسول تست زنده وب‌سرویس استعلام قیمت (Live API Sandbox)
            </h2>
          </div>
          <button
            onClick={handleRunApiTest}
            disabled={isTestingApi}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {isTestingApi ? 'در حال ارسال درخواست...' : 'ارسال درخواست استعلام نمونه (POST)'}
          </button>
        </div>

        <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-2">
          <div className="text-slate-400">
            POST https://api.pricing-os.ir/v2/pricing/quote
          </div>
          <pre className="text-emerald-400">
            {testApiResponse ||
              '// کلیک روی دکمه "ارسال درخواست استعلام نمونه" جهت مشاهده پاسخ زنده JSON موتور محاسباتی...'}
          </pre>
        </div>
      </div>
    </div>
  );
};

