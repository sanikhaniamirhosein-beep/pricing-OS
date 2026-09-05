import React from 'react';
import { Shader, SolidColor, Blob, Form3D, GaborNoise, Glow, CursorRipples } from 'shaders/react';

const reveal = 'translate-y-5 opacity-0 animate-[heroReveal_700ms_cubic-bezier(.22,1,.36,1)_forwards]';

export const PricingHero: React.FC = () => (
  <main className="pricing-hero">
    <div className="pricing-hero__shader" aria-hidden="true">
      <Shader toneMapping="aces">
        <SolidColor color="#ffffff" />
        <Blob center={{ x: 0.78, y: 0.68 }} deformation={0.2} highlightIntensity={0} size={1.15} softness={2}
          stops={[{ color: '#ff6b35', position: 0 }, { color: '#e91e63', position: 1 }]} />
        <Form3D center={{ x: 0.72, y: 0.5 }} glossiness={30} lighting={60}
          shape3d={{ type: 'ribbon', angle: 109, twist: 30, width: 100, thickness: 166, seed: 0 }}
          shape3dType="ribbon" speed={2} zoom={78}>
          <GaborNoise colorSpace="oklab" frequency={5}
            stops={[{ color: '#ff9659', position: 0 }, { color: '#ff007b', position: 1 }]} />
        </Form3D>
        <Glow intensity={2.5} size={5} threshold={0.28} />
        <CursorRipples decay={7.3} radius={0.6} />
      </Shader>
    </div>
    <header className={`pricing-hero__header ${reveal}`} style={{ animationDelay: '50ms' }}>
      <div className="pricing-hero__brand"><span className="pricing-hero__logo">Pricing OS</span><span className="pricing-hero__badge">Road Freight Pricing</span></div>
      <nav aria-label="Primary" className="pricing-hero__nav"><a href="#design">Design</a><a href="#validation">Validation</a><a href="#governance">Governance</a></nav>
      <a href="#platform" className="pricing-hero__stockist">Explore platform</a>
    </header>
    <section className="pricing-hero__copy">
      <span className={`pricing-hero__eyebrow ${reveal}`} style={{ animationDelay: '100ms' }}>Deterministic pricing, built for control</span>
      <h1 className={`pricing-hero__title ${reveal}`} style={{ animationDelay: '150ms' }}>قیمت‌گذاری هوشمند، <em>شفاف و قابل کنترل.</em></h1>
      <p className={`pricing-hero__body ${reveal}`} style={{ animationDelay: '300ms' }}>Pricing OS فرایند طراحی تعرفه، اعتبارسنجی، حاکمیت و پایش نرخ‌های حمل‌ونقل جاده‌ای را در یک سیستم یکپارچه جمع می‌کند.</p>
      <div className={`pricing-hero__actions ${reveal}`} style={{ animationDelay: '450ms' }}><a className="pricing-hero__primary" href="#design">ورود به سیستم قیمت‌گذاری</a><a className="pricing-hero__secondary" href="#platform">مشاهده قابلیت‌ها <span aria-hidden="true">→</span></a></div>
      <p className={`pricing-hero__meta ${reveal}`} style={{ animationDelay: '550ms' }}>موتور قطعی · حاکمیت Maker-Checker · گاردریل کف سود ۱۵٪</p>
    </section>
  </main>
);