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
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';

export const IntegrationsHubView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testApiEndpoint, setTestApiEndpoint] = useState('/api/v2/pricing/quote');
  const [testApiResponse, setTestApiResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const connectorsList = [
    {
      id: 'conn-rahdari',
      nameFa: 'سامانه برخط صدور بارنامه دولتی (سازمان راهداری)',
      nameEn: 'RMTO Government Waybill Connector',
      protocol: 'SOAP / REST WebService',
      status: 'online',
      latency: '38ms',
      lastSync: '۲ ثانیه پیش',
      uptime: '99.98%',
    },
    {
      id: 'conn-map',
      nameFa: 'ماتریس فاصله، زمان سیر و ترافیک معابر',
      nameEn: 'Routing & Map Matrix Engine',
      protocol: 'gRPC / HTTP2',
      status: 'online',
      latency: '14ms',
      lastSync: 'لحظه‌ای',
      uptime: '100.0%',
    },
    {
      id: 'conn-fuel',
      nameFa: 'شاخص گازوئیل و فرآورده‌های نفتی کشور',
      nameEn: 'NIOPDC Fuel Index Feed',
      protocol: 'REST Webhook',
      status: 'online',
      latency: '52ms',
      lastSync: '۱۰ دقیقه پیش',
      uptime: '99.95%',
    },
    {
      id: 'conn-weather',
      nameFa: 'هواشناسی و پایش گردنه‌های برف‌گیر',
      nameEn: 'National Meteorological Hazard Feed',
      protocol: 'JSON Polling (15 min)',
      status: 'online',
      latency: '45ms',
      lastSync: '۵ دقیقه پیش',
      uptime: '99.90%',
    },
  ];

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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunApiTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
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

  return (
    <div className="space-y-6">
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
        </div>
      </div>

      {/* External Connectors Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 font-title">
            کانکتورهای زیرساختی و سامانه‌های دولتی
          </h2>
          <span className="text-xs font-mono text-emerald-700 font-bold">Latency Average: 27ms</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectorsList.map((conn) => (
            <div
              key={conn.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{conn.nameFa}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{conn.nameEn}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    آنلاین
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-100 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 block">پروتکل:</span>
                    <span className="font-mono font-bold text-slate-700">{conn.protocol}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">تأخیر (Latency):</span>
                    <span className="font-mono font-bold text-emerald-700">{conn.latency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">پایداری (SLA):</span>
                    <span className="font-mono font-bold text-slate-800">{conn.uptime}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">همگام‌سازی: {conn.lastSync}</span>
                <button className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  تست سلامت اتصال
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
            disabled={isTesting}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {isTesting ? 'در حال ارسال درخواست...' : 'ارسال درخواست استعلام نمونه (POST)'}
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
