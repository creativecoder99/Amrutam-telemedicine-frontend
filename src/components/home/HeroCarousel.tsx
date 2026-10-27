'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  tag: string;
  highlight: string;
}

const slides: CarouselSlide[] = [
  {
    id: 'box-kit',
    image: '/images/hero/n3.jpg',
    title: 'Health is Beauty — Classical Collection',
    subtitle: '10 Authentic Ayurvedic formulations curated for holistic bodily balance',
    tag: 'Authentic Formulations',
    highlight: '10 Classical Remedies',
  },
  {
    id: 'ayurvedic-sharbat',
    image: '/images/hero/n1.webp',
    title: 'Amrutam Ayurvedic Sharbat',
    subtitle: 'Herbal refreshment with real pomegranate & classical botanical extracts',
    tag: 'Daily Vitality',
    highlight: '100% Pure Botanicals',
  },
  {
    id: 'orthokey-malt',
    image: '/images/hero/n2.webp',
    title: 'Amrutam Orthokey Gold Malt',
    subtitle: 'Ayurvedic malt therapy for knee, back & chronic joint pain support',
    tag: 'Joint Vitality',
    highlight: 'Orthopedic Care',
  },
  {
    id: 'face-clean-up',
    image: '/images/hero/benefits-face-clean-up.webp',
    title: 'Amrutam Face Clean-Up',
    subtitle: 'Detoxifies skin, fights acne naturally, and imparts youthful radiance',
    tag: 'Skin Therapeutics',
    highlight: 'Kesar & Chandan',
  },
  {
    id: 'amla-rasayana',
    image: '/images/hero/amla-rasayana.jpeg',
    title: 'Amrutam Amla Ayurvedic Rasayana',
    subtitle: 'Promotes healthy immunity, boosts haemoglobin & revitalizes the body',
    tag: 'Immunity & Rasayana',
    highlight: 'Pure Amalaki',
  },
  {
    id: 'body-wash',
    image: '/images/hero/body-wash-kesar.jpeg',
    title: 'Amrutam Herbal Body Wash',
    subtitle: 'Therapeutic herbal shower infusion with Chandan, Kesar & active botanicals',
    tag: 'Cellular Care',
    highlight: 'Deep Hydration',
  },
  {
    id: 'divine-amrutam',
    image: '/images/hero/divine-amrutam.jpeg',
    title: 'Divine Amrutam Botanical Blend',
    subtitle: 'Synergized Ayurvedic formulation for cellular rejuvenation and balance',
    tag: 'Traditional Alchemy',
    highlight: 'Holistic Harmony',
  },
];

export const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance slides every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
      }}
    >
      {/* Main Showcase Container */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#fffdf3',
          border: '2px solid rgba(58, 100, 59, 0.25)',
          boxShadow: '0 20px 48px rgba(33, 61, 49, 0.18)',
        }}
      >
        {/* Image Stage with Soft Gradient Backdrop */}
        <div
          style={{
            position: 'relative',
            height: '420px',
            width: '100%',
            backgroundColor: '#f7fbf5',
            background: 'radial-gradient(circle at center, #ffffff 0%, #f4faf2 60%, #eaf4e8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            overflow: 'hidden',
          }}
        >
          <img
            key={currentSlide.id}
            src={currentSlide.image}
            alt={currentSlide.title}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '12px',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              filter: 'drop-shadow(0 10px 24px rgba(33, 61, 49, 0.15))',
            }}
          />

          {/* Top Pill: Category Tag */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              backgroundColor: 'rgba(33, 61, 49, 0.88)',
              color: '#fffdf3',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
              }}
            />
            {currentSlide.tag}
          </div>

          {/* Top Right: Highlight Badge */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: '#fffdf3',
              color: '#213d31',
              border: '1.5px solid #3a643b',
              padding: '5px 12px',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: 700,
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
            }}
          >
            ✨ {currentSlide.highlight}
          </div>

          {/* Previous Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 253, 243, 0.92)',
              border: '1.5px solid #3a643b',
              color: '#213d31',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease',
              zIndex: 10,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#213d31';
              e.currentTarget.style.color = '#fffdf3';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 253, 243, 0.92)';
              e.currentTarget.style.color = '#213d31';
            }}
          >
            ‹
          </button>

          {/* Next Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 253, 243, 0.92)',
              border: '1.5px solid #3a643b',
              color: '#213d31',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease',
              zIndex: 10,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#213d31';
              e.currentTarget.style.color = '#fffdf3';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 253, 243, 0.92)';
              e.currentTarget.style.color = '#213d31';
            }}
          >
            ›
          </button>
        </div>

        {/* Lower Caption Card */}
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: '#fffdf3',
            borderTop: '1px solid rgba(58, 100, 59, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h4
              style={{
                margin: '0 0 4px 0',
                fontSize: '16px',
                fontWeight: 700,
                color: '#213d31',
              }}
            >
              {currentSlide.title}
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: '#4a604a',
                lineHeight: 1.4,
              }}
            >
              {currentSlide.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#3a643b' }}>
              {currentIndex + 1} / {slides.length}
            </span>
          </div>
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
        }}
      >
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                border: 'none',
                height: '8px',
                width: isActive ? '28px' : '8px',
                borderRadius: '4px',
                backgroundColor: isActive ? '#213d31' : 'rgba(58, 100, 59, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
