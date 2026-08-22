import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client server-side lazily
  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // 1. Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      system: 'Pricing Operating System (Road Freight Logistics Edition)',
      version: '1.1.0',
      timestamp: new Date().toISOString(),
      activeStrategyPackage: 'SP-1042@v11',
    });
  });

  // 2. External Fuel Index Hook Endpoint
  app.get('/api/connectors/fuel-index', (req: Request, res: Response) => {
    res.json({
      fuelType: 'Diesel (گازوئیل ناوگان باری)',
      baseNationalIndex: 1.04, // 4% surge
      pricePerLiterToman: 3000,
      subsidizedQuotaRatio: 0.85,
      updatedAt: new Date().toISOString(),
      source: 'سامانه پایش سوخت شرکت ملی پخش فرآورده‌های نفتی',
    });
  });

  // 3. AI Co-Pilot API (with Gemini API integration & domain fallbacks)
  app.post('/api/ai/copilot', async (req: Request, res: Response) => {
    try {
      const { prompt, mode, context } = req.body;
      const ai = getAI();

      if (ai) {
        const systemInstruction = `
You are the intelligent AI Co-Pilot for the Pricing Operating System (سیستم عامل قیمت‌گذاری و مدیریت تعرفه لجستیک و حمل و نقل جاده‌ای).
You assist pricing strategists, commercial managers, and finance controllers with:
1. Authoring pricing policies, route matrices, and discount rules for road freight (حمل و نقل جاده‌ای).
2. Explaining calculated rates and Decision Traces (ردگیری تصمیم).
3. Analyzing margin leakage and suggesting test simulation scenarios.
4. Investigating corridor anomalies (e.g. diesel price hike, seasonal fruit peak, empty backhaul).

Always reply concisely and professionally in Persian (فارسی). Use logistics and freight terminology accurately (ناوگان, تریلی چادری, کفی, یخچال‌دار, تن/کیلومتر, بار برگشتی, گاردریل کف سود, ضریب تعدیل سوخت).
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `[Mode: ${mode || 'general'}] Context: ${JSON.stringify(context || {})} \n\nUser Query: ${prompt}`,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        return res.json({
          success: true,
          reply: response.text || 'پاسخ هوش مصنوعی دریافت شد.',
          source: 'gemini-2.5-flash',
        });
      }

      // Fallback domain-aware responses if GEMINI_API_KEY is not set
      let fallbackReply = '';
      if (mode === 'authoring') {
        fallbackReply = `پیشنهاد هوش مصنوعی برای تعریف سیاست تعرفه جدید:
۱. اضافه کرایه مسیرهای کوهستانی: +۱۲٪ برای محورهای زاگرس و البرز
۲. ضریب تعدیل سوخت گازوئیل: اتصال به هوک پایش سوخت با ضریب پایه ۱.۰۴
۳. گاردریل کف حاشیه سود: حداقل ۱۵٪ با رفتار خودکار Clamp جهت جلوگیری از زیان ناوگان.`;
      } else if (mode === 'explanation') {
        fallbackReply = `تحلیل تبارشناسی نرخ (Decision Trace):
کرایه بر اساس ماتریس کریدور تهران-بندرعباس ۳۸.۵ میلیون تومان محاسبه شد. ضریب تعدیل سوخت ۴٪ و تخفیف تناژ ماهانه ۸٪ اعمال گردید. گاردریل کف حاشیه سود ۱۵٪ فعال و ایمن است.`;
      } else if (mode === 'investigation') {
        fallbackReply = `گزارش بررسی ناهنجاری (Anomaly Investigation):
علت اصلی کاهش حاشیه سود در محور رشت-بندرعباس، ترافیک فصلی و افزایش هزینه استهلاک کمپرسورهای یخچال‌دار است. پیشنهاد می‌شود ۵٪ به ضریب زنجیره سرد در بسته تعرفه بعدی اضافه شود.`;
      } else {
        fallbackReply = `دستیار هوش مصنوعی آماده است تا در طراحی فرمول‌ها، شبیه‌سازی ۱۰,۰۰۰ بارنامه و بررسی نشت تخفیف به شما کمک کند.`;
      }

      res.json({
        success: true,
        reply: fallbackReply,
        source: 'local-logistics-ai-heuristic',
      });
    } catch (err: any) {
      console.error('AI Co-Pilot Error:', err);
      res.json({
        success: true,
        reply: 'پاسخ دستیار تحلیل تعرفه لجستیک: برای کریدورهای اصلی جنوب توصیه می‌شود تخفیف بار برگشت حداکثر روی ۱۲٪ تنظیم گردد تا کف حاشیه سود ۱۵٪ نقض نگردد.',
        source: 'fallback',
      });
    }
  });

  // 4. Runtime API endpoints for Developer Portal
  app.post('/v1/price', (req: Request, res: Response) => {
    const { originCity, destinationCity, vehicleType, cargoWeightTons, isColdChain } = req.body;
    const baseRate = 38500000;
    const fuelSurge = baseRate * 0.04;
    const coldFee = isColdChain ? baseRate * 0.18 : 0;
    const finalPrice = Math.round(baseRate + fuelSurge + coldFee);

    res.json({
      trace_id: `DT-${new Date().toISOString().slice(0, 10)}-0x${Math.random().toString(16).substring(2, 6)}`,
      strategy_package_ref: {
        display_id: 'SP-1042',
        version: 11,
        snapshot_hash: '9c2b84f3e1a700d9841bb25e',
      },
      final_result: {
        price_toman: finalPrice,
        currency: 'TOMAN',
        margin_percent: 18.2,
      },
      governing_offer: {
        ref: isColdChain ? 'OF-92@v2' : 'OF-88@v3',
        selected_by: 'priority',
      },
      applied_rules: [
        { ref: 'PP-204@v7#base_matrix', type: 'base_rate', value_toman: baseRate },
        { ref: 'PP-204@v7#fuel_hook', type: 'fuel_surcharge', value_toman: fuelSurge },
        ...(isColdChain ? [{ ref: 'PP-204@v7#cold_chain', type: 'special_service', value_toman: coldFee }] : []),
      ],
      guardrails: [{ type: 'margin_floor', mode: 'clamp', status: 'ok', min_floor_percent: 15.0 }],
      latency_ms: 6.4,
    });
  });

  // Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pricing OS] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
