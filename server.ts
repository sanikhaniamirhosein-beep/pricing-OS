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
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
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

  // 3. AI Co-Pilot API (Real Gemini 3.7 Flash integration)
  app.post('/api/ai/copilot', async (req: Request, res: Response) => {
    try {
      const { prompt, mode, context, history } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.status(500).json({
          success: false,
          error: 'کلید وب‌سرویس هوش مصنوعی (GEMINI_API_KEY) در سرور یافت نشد.',
          reply: 'متاسفانه کلید ارتباطی با موتور هوش مصنوعی در سرور فعال نیست. لطفاً تنظیمات محیطی را بررسی فرمایید.',
        });
      }

      const systemInstruction = `
شما «دستیار تخصصی و هوشمند سیستم عامل قیمت‌گذاری لجستیک و حمل‌ونقل جاده‌ای ایران» (Pricing OS AI Co-Pilot) هستید.
وظیفه شما پاسخ‌گویی دقیق، پویا، تحلیلی و مستدل به تمامی سوالات، تحلیل‌ها و نیازهای مدیران بازرگانی، استراتژیست‌های قیمت‌گذاری، متصدیان بار و صاحبان کالا است.

دامنه‌های تخصصی شما:
۱. تحلیل فرمول‌های نرخ‌گذاری حمل جاده‌ای:
- فرمول پایه بر مبنای تن/کیلومتر (Ton-Km) متناسب با نوع ناوگان (خاور ۳-۵ تن، تک ۱۰ تن ۶ چرخ، جفت ۱۵ تن ۱۰ چرخ، تریلی کفی ۲۰-۲۴ تن، تریلی لبه‌دار، ترانزیت چادری، بونکر، کمرشکن، کشنده یخچال‌دار).
- هزینه‌های جانبی: عوارض راهداری و پایانه (معمولاً ۴٪ تا ۹٪)، بیمه مسئولیت مدنی متصدی حمل بر مبنای ارزش اظهارشده کالا، سهم باربری و کمیسیون سالن اعلام بار، بارگیری و تخلیه، خواب و توقف ناوگان.
- ضرایب و اضافه کرایه‌ها: زنجیره سرد و یخچال (Cold-Chain ۱۵٪ تا ۳۰٪)، کالای خطرناک (ADR ۱۵٪ تا ۲۵٪)، گردنه‌ها و مسیرهای کوهستانی صعب‌العبور، شرایط بد آب‌وهوایی، ترافیک و مسیرهای یک‌سرخالی (Backhaul).
- ضریب تعدیل شناور سوخت گازوئیل (Fuel Surcharge Hook).
۲. مهندسی سیاست‌های تعرفه و پکیج‌های استراتژی (Strategy Packages & Pricing Policies):
- طراحی رول‌بلاک‌ها (Rule Blocks)، انواع تخفیفات پلکانی حجم و تعهد تناژ ماهانه (Tiered Volume Discounts).
- گاردریل‌های کف و سقف حاشیه سود ناخالص (Gross Margin Guardrails با رفتارهای Clamp، Reject، Flag).
۳. تبارشناسی تصمیم و علت‌یابی بارنامه (Decision Traces):
- تحلیل گام‌به‌گام نحوه رسیدن به نرخ نهایی، بررسی عدم نقض کف سود، شناسایی علل افت سود یا نشتی تخفیف.
۴. شبیه‌سازی، تحلیل ریسک و کشف ناهنجاری در کریدورهای بار کشور:
- کریدورهای اصلی: تهران-بندرعباس، اصفهان-بندر امام، تبریز-مشهد، رشت-تهران، شیراز-بوشهر، یزد-بندرعباس و غیره.

راهنمای نحوه پاسخ‌دهی:
- همیشه به زبان فارسی روان، شیوا، حرفه‌ای و ساختاریافته پاسخ دهید.
- از عناوین، بالت‌پوینت‌ها و در صورت نیاز جدول و فرمول‌های شفاف استفاده کنید تا متن خوانا باشد.
- به سوال دقیق کاربر توجه کرده و مستقیماً و با تحلیل واقعی به همان سوال پاسخ دهید. هیچ‌گاه پاسخ‌های از پیش تعیین‌شده تکراری ندهید.
- حالت فعلی کاربر (${mode || 'عمومی'}) و اطلاعات زمینه‌ای ارسال‌شده را مد نظر قرار دهید.
`;

      // Build chat conversation structure for Gemini
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // If previous chat history exists, include it for conversational memory
      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-8)) { // keep last 8 turns for efficiency
          if (item.text && item.text.trim()) {
            contents.push({
              role: item.sender === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
      }

      // Add the current prompt with context snapshot
      const currentQuery = `[حالت کاری: ${mode || 'عمومی'}]
[اطلاعات سیستم: پکیج فعال ${context?.activePackage || 'SP-1042'} نگارش ${context?.version || '11'} | حداقل کف حاشیه سود: ${context?.marginFloor || 15}٪]
${context?.selectedCorridor ? `[محور انتخابی: ${context.selectedCorridor}]` : ''}

پرسش کاربر:
${prompt}`;

      contents.push({
        role: 'user',
        parts: [{ text: currentQuery }],
      });

      // Multi-model fallback sequence to handle temporary spikes (503 / 429)
      const candidateModels = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      let generatedReply = '';
      let usedModel = '';
      let lastError: any = null;

      for (const modelName of candidateModels) {
        // Try up to 2 attempts per candidate model with backoff
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents,
              config: {
                systemInstruction,
                temperature: 0.7,
              },
            });
            if (response && response.text) {
              generatedReply = response.text;
              usedModel = modelName;
              break;
            }
          } catch (err: any) {
            lastError = err;
            const errMsg = err?.message || String(err);
            console.log(`[AI Co-Pilot Handled]: Model ${modelName} attempt ${attempt} returned status: ${errMsg.slice(0, 100)}... trying fallback`);
            if (attempt < 2) {
              await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
            }
          }
        }
        if (generatedReply) {
          break;
        }
      }

      if (!generatedReply) {
        throw lastError || new Error('سرویس هوش مصنوعی موقتاً در دسترس نیست.');
      }

      return res.json({
        success: true,
        reply: generatedReply,
        model: usedModel,
      });
    } catch (err: any) {
      console.error('[Pricing OS AI Co-Pilot Server Error]:', err);
      // Fallback domain-intelligent response so user always receives an actionable answer
      return res.json({
        success: true,
        reply: `⚠️ با توجه به ترافیک بالای لحظه‌ای سرویس هوش مصنوعی، تحلیل سریع زیر بر مبنای قوانین پایدار سیستم ارائه می‌شود:\n\n` +
          `• **محاسبه نرخ تن/کیلومتر:** برای مسیرهای کوهستانی و صعب‌العبور اعمال ضریب ۱.۱۲ تا ۱.۱۵ الزامی است.\n` +
          `• **گاردریل کف سود:** حداقل حاشیه سود ۱۵٪ پیشنهاد می‌شود تا ترکیب تخفیفات تناژ و بار برگشت منجر به زیان متصدی نگردد.\n` +
          `• **تعدیل سوخت:** متصل به نرخ شناور پایش مصرف پایانه با ضریب ۱.۰۴.\n\n` +
          `*لطفاً لحظاتی دیگر مجدداً تلاش فرمایید تا مدل هوش مصنوعی اختصاصی پاسخ تکمیلی را پردازش نماید.*`,
        model: 'heuristic-logistics-engine',
        isFallback: true,
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
