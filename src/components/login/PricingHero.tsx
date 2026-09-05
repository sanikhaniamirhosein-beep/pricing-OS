import React, { useEffect, useState } from 'react';
import {
  Shader,
  SolidColor,
  Blob,
  Form3D,
  GaborNoise,
  Glow,
  CursorRipples,
} from 'shaders/react';

interface PricingHeroProps {
  onOpenCarrier: () => void;
  onOpenShipper: () => void;
}

export const PricingHero: React.FC<PricingHeroProps> = ({
  onOpenCarrier,
  onOpenShipper,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative isolate min-h-[min(760px,100dvh)] overflow-hidden bg-white text-[#211311]">
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
      >
        {mounted && (
          <Shader
            toneMapping="aces"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <SolidColor color="#ffffff" />
            <Blob
              center={{ x: 0.78, y: 0.68 }}
              deformation={0.2}
              highlightIntensity={0}
              size={1.15}
              softness={2}
              stops={[
                { color: '#ff6b35', position: 0 },
                { color: '#e91e63', position: 1 },
              ]}
            />
            <Form3D
              center={{ x: 0.72, y: 0.5 }}
              glossiness={30}
              lighting={60}
              shape3d={{
                type: 'ribbon',
                angle: 109,
                twist: 30,
                width: 100,
                thickness: 166,
                seed: 0,
              }}
              shape3dType="ribbon"
              speed={2}
              zoom={78}
            >
              <GaborNoise
                colorSpace="oklab"
                frequency={5}
                stops={[
                  { color: '#ff9659', position: 0 },
                  { color: '#ff007b', position: 1 },
                ]}
              />
            </Form3D>
            <Glow intensity={2.5} size={5} threshold={0.28} />
            <CursorRipples decay={7.3} radius={0.6} />
          </Shader>
        )}
      </div>

      <div className="relative z-10 flex min-h-[min(760px,100dvh)] flex-col">
        <header
          className="flex items-center justify-between px-6 py-7 lg:px-12"
          style={{ animation: 'pricingHeroReveal 700ms ease-out 50ms both' }}
        >
          <div>
            <div className="font-display text-xl font-normal uppercase tracking-[0.18em] text-[#211311]">
              Pricing OS
            </div>
            <div className="mt-1 text-[10px] font-medium tracking-[0.08em] text-black/45">
              ROAD FREIGHT PRICING OPERATING SYSTEM
            </div>
          </div>

          <div className="flex items-center gap-5 lg:gap-8">
            <nav
              aria-label="Primary"
              className="hidden items-center gap-8 text-sm text-black/55 md:flex"
            >
              <a className="transition-colors hover:text-[#211311]" href="#services">
                خدمات
              </a>
              <a className="transition-colors hover:text-[#211311]" href="#governance">
                حاکمیت
              </a>
              <a className="transition-colors hover:text-[#211311]" href="#intelligence">
                هوشمندی
              </a>
            </nav>
            <a
              href="#portals"
              className="text-sm font-medium underline decoration-[#e91e63]/40 underline-offset-4 transition hover:decoration-[#e91e63]"
            >
              ورود به سامانه
            </a>
          </div>
        </header>

        <div className="flex flex-1 items-center px-6 pb-16 pt-4 lg:px-12">
          <div className="max-w-xl">
            <div
              className="mb-5 inline-flex rounded-full border border-[#e91e63]/20 bg-white/70 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
              style={{ animation: 'pricingHeroReveal 700ms ease-out 100ms both' }}
            >
              سیستم عامل هوشمند قیمت‌گذاری حمل‌ونقل جاده‌ای
            </div>

            <h1
              className="font-display text-[clamp(2.75rem,5.5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.025em] text-balance"
              style={{ animation: 'pricingHeroReveal 700ms ease-out 150ms both' }}
            >
              قیمت‌گذاری، <em>با منطق روشن.</em>
            </h1>

            <p
              className="mt-6 max-w-[44ch] text-lg leading-[1.625] text-black/70 text-pretty"
              style={{ animation: 'pricingHeroReveal 700ms ease-out 300ms both' }}
            >
              Pricing OS فرمول‌های تعرفه، اعتبارسنجی، حاکمیت و پایش سودآوری را
              در یک جریان قطعی و قابل‌ردیابی به هم متصل می‌کند.
            </p>

            <div
              id="portals"
              className="mt-9 flex flex-wrap items-center gap-3"
              style={{ animation: 'pricingHeroReveal 700ms ease-out 450ms both' }}
            >
              <button
                type="button"
                onClick={onOpenCarrier}
                className="rounded-full bg-[#211311] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3c221d]"
              >
                ورود سازمان‌های حمل‌ونقل
              </button>
              <button
                type="button"
                onClick={onOpenShipper}
                className="px-2 py-3 text-sm font-medium text-black/70 transition-colors hover:text-[#211311]"
              >
                ورود صاحبان بار
                <span
                  aria-hidden="true"
                  className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </button>
            </div>

            <p
              className="mt-7 text-sm text-black/45"
              style={{ animation: 'pricingHeroReveal 700ms ease-out 550ms both' }}
            >
              Deterministic Engine · Maker-Checker · 15% Profit Guardrail
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pricingHeroReveal {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*="pricingHeroReveal"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};
