/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  SlidersHorizontal,
  Compass,
  Maximize2,
  Check,
  Menu,
  X,
  Rotate3d,
  Eye,
  Calendar,
  MapPin,
} from 'lucide-react';
import {
  PROPERTIES,
  SERVICES,
  CURRENCIES,
  PropertyCategory,
  PropertyListing,
  CurrencyCode,
  HeroTypologyId,
  formatPrice,
} from './data/properties';
import {
  HeroHotle3DStage,
  CabinModularCutout,
  ArchitecturalSceneCard,
  InteractiveFloorPlan,
} from './components/ArchitecturalVisuals';

const CATEGORIES: PropertyCategory[] = [
  'All',
  'Studio',
  'Loft',
  'Townhouse',
  'Pavilion',
  'Villa',
];

const CURRENCY_LIST: CurrencyCode[] = ['USD', 'NGN', 'GBP'];

export default function App() {
  // Navigation & mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Currency State (USD $, NGN ₦, GBP £)
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // Hero 3D Scroll-Hijack Stage State
  const heroTrackRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [manualTiltOverride, setManualTiltOverride] = useState<number | null>(null);
  const [activeTypology, setActiveTypology] = useState<HeroTypologyId>('eco-villa');

  // Area Search Drawer State (triggered by "Search my area" in Cabin Modular section)
  const [areaSearchOpen, setAreaSearchOpen] = useState(false);
  const [areaSearchQuery, setAreaSearchQuery] = useState('');

  // Properties filtering, sorting & accordion disclosure states
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'area-desc'>('featured');
  const [expandedPropertyId, setExpandedPropertyId] = useState<string | null>(null);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  // Interactive House Plan state (defaults to 01: The 92 m² Studio)
  const [selectedPlanPropertyId, setSelectedPlanPropertyId] = useState<string>('atrium-studio');
  const [activeRoomId, setActiveRoomId] = useState<string | null>('living-room');
  const [unitSystem, setUnitSystem] = useState<'m2' | 'sqft'>('m2');

  // Modal / Quick Viewing Drawer state
  const [inspectingProperty, setInspectingProperty] = useState<PropertyListing | null>(null);

  // Contact / Viewing Form state & validation
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryPropertyId, setInquiryPropertyId] = useState('newhaven-flagship-villa');
  const [inquiryVisitType, setInquiryVisitType] = useState<'private' | 'virtual' | 'dossier'>('private');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Sticky Hero 3D Scroll Listener
  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!heroTrackRef.current) return;
        const rect = heroTrackRef.current.getBoundingClientRect();
        const scrollableDistance = rect.height - window.innerHeight;
        if (scrollableDistance <= 0) {
          setScrollProgress(0);
          return;
        }
        const rawProgress = -rect.top / scrollableDistance;
        const clamped = Math.max(0, Math.min(1, rawProgress));
        setScrollProgress(clamped);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const effectiveTiltProgress =
    manualTiltOverride !== null ? manualTiltOverride : scrollProgress;

  // Filtered and sorted listings
  const filteredProperties = useMemo(() => {
    let list =
      selectedCategory === 'All'
        ? [...PROPERTIES]
        : PROPERTIES.filter((item) => item.category === selectedCategory);

    if (areaSearchQuery.trim()) {
      const q = areaSearchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.location.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'area-desc') {
      list.sort((a, b) => b.totalArea - a.totalArea);
    }
    return list;
  }, [selectedCategory, sortBy, areaSearchQuery]);

  // Currently active property in the House Plan section
  const activePlanProperty = useMemo(
    () =>
      PROPERTIES.find((p) => p.id === selectedPlanPropertyId) || PROPERTIES[0],
    [selectedPlanPropertyId]
  );

  // Helper to format area in m² or sq ft with tabular alignment
  const formatArea = (sqm: number) => {
    if (unitSystem === 'm2') {
      return `${sqm} m²`;
    }
    const sqft = Math.round(sqm * 10.7639);
    return `${sqft.toLocaleString()} sq ft`;
  };

  // Load a specific property's floor plan and scroll smoothly to #house-plan
  const handleInspectFloorPlan = (propertyId: string) => {
    setSelectedPlanPropertyId(propertyId);
    setActiveRoomId('living-room');
    const el = document.getElementById('house-plan');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Prefill booking form for a specific residence and scroll to #contact
  const handleSelectForViewing = (propertyId: string) => {
    setInquiryPropertyId(propertyId);
    setInquirySubmitted(false);
    setInspectingProperty(null);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryError(null);

    if (!inquiryName.trim()) {
      setInquiryError('Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inquiryEmail.trim())) {
      setInquiryError('Please provide a valid email address.');
      return;
    }

    setInquirySubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#CFDAD9] text-[#141718]">
      {/* Outer Editorial Sheet Frame matching the Hotle presentation canvas */}
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-8">
        <div className="bg-[#F6F5F1] rounded-[28px] shadow-[0_32px_80px_rgba(15,23,26,0.14)] border border-black/5 px-4 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-12 sm:space-y-16 lg:space-y-20">
          {/* =====================================================================
              TOP BAR CONTRACT: 3 Zones (Brand Wordmark — 5 Single-Line Nav Links — 1 Primary Action)
             ===================================================================== */}
          <header className="flex items-center justify-between gap-8 pb-4 border-b border-black/10">
            {/* Zone 1: Single text element wordmark */}
            <a
              href="#"
              className="font-display text-lg sm:text-xl font-extrabold tracking-[-0.03em] text-[#141718] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141718] rounded-lg"
            >
              Newhaven
            </a>

            {/* Zone 2: 5 concise single-line navigation links */}
            <nav
              aria-label="Primary Navigation"
              className="hidden md:flex items-center gap-7 text-xs font-medium text-[#4A5052]"
            >
              <a
                href="#home"
                className="text-[#141718] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
              >
                Home
              </a>
              <a
                href="#backyard"
                className="hover:text-[#141718] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
              >
                Backyard
              </a>
              <a
                href="#works"
                className="hover:text-[#141718] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
              >
                Works
              </a>
              <a
                href="#house-plan"
                className="hover:text-[#141718] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
              >
                House Plan
              </a>
              <a
                href="#contact"
                className="hover:text-[#141718] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
              >
                Contact
              </a>
            </nav>

            {/* Zone 3: 1 Primary Action Button (+ Mobile Menu Toggle on small viewports) */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="#contact"
                className="hidden sm:inline-flex items-center px-5 py-2.5 text-xs font-medium text-[#141718] border border-black/25 hover:bg-[#141718] hover:text-[#FAF9F6] rounded-[20px] transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                Join the Waitlist
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-[20px] bg-[#EAE8E1] text-[#141718] hover:bg-[#DFDDD4] transition-colors duration-150"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* Responsive Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <nav
              aria-label="Mobile Navigation"
              className="md:hidden p-6 rounded-[24px] bg-[#ECEAE3] border border-black/10 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3 text-xs font-medium text-[#141718]">
                <a
                  href="#home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-[20px] bg-[#FAF9F6] whitespace-nowrap"
                >
                  Home
                </a>
                <a
                  href="#backyard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-[20px] bg-[#FAF9F6] whitespace-nowrap"
                >
                  Backyard
                </a>
                <a
                  href="#works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-[20px] bg-[#FAF9F6] whitespace-nowrap"
                >
                  Works
                </a>
                <a
                  href="#house-plan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-[20px] bg-[#FAF9F6] whitespace-nowrap"
                >
                  House Plan
                </a>
              </div>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full py-3.5 text-xs font-semibold text-[#FAF9F6] bg-[#141718] rounded-[20px] whitespace-nowrap"
              >
                Join the Waitlist
              </a>
            </nav>
          )}

          {/* =====================================================================
              GLOBAL WORKSPACE BAR: LIVE CURRENCY SWITCHER ($ / ₦ / £) & 3D TILT CONTROL
             ===================================================================== */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 rounded-[22px] bg-[#ECEAE3] border border-black/5 -mt-6">
            {/* Currency Switcher: USD ($), Naira (₦), Pounds (£) */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-[#4A5052]">
                Display Currency
              </span>
              <div
                role="group"
                aria-label="Switch property currency between USD, Naira, and Pounds"
                className="inline-flex items-center p-1 rounded-[18px] bg-[#FAF9F6] border border-black/10"
              >
                {CURRENCY_LIST.map((code) => {
                  const active = currency === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-[14px] transition-colors duration-150 whitespace-nowrap shrink-0 font-mono-tabular ${
                        active
                          ? 'bg-[#141718] text-[#FAF9F6] shadow-sm'
                          : 'text-[#4A5052] hover:text-[#141718]'
                      }`}
                    >
                      {CURRENCIES[code].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive 3D Scroll Tilt Indicator & Manual Scrubber */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#4A5052]">
              <div className="flex items-center gap-2">
                <Rotate3d className="w-4 h-4 text-[#141718]" />
                <span>
                  3D Scroll Tilt:{' '}
                  <strong className="font-mono-tabular text-[#141718]">
                    {Math.round(
                      (1 -
                        Math.pow(
                          1 - Math.min(1, Math.max(0, effectiveTiltProgress)),
                          1.8
                        )) *
                        26
                    )}
                    °
                  </strong>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                aria-label="Adjust 3D house tilt angle"
                value={effectiveTiltProgress}
                onChange={(e) => setManualTiltOverride(parseFloat(e.target.value))}
                className="w-24 accent-[#141718] cursor-pointer"
              />
              {manualTiltOverride !== null && (
                <button
                  type="button"
                  onClick={() => setManualTiltOverride(null)}
                  className="text-xs underline text-[#141718] whitespace-nowrap"
                >
                  Sync to Scroll
                </button>
              )}
            </div>
          </div>

          {/* =====================================================================
              SECTION 1: STICKY 3D SCROLL-TILT HERO STAGE (Hotle Reference Match)
              As the user scrolls down through this 215vh track, the house tilts sideways
              in 3D perspective before unlocking the rest of the website.
             ===================================================================== */}
          <section
            id="home"
            ref={heroTrackRef}
            className="relative h-[205vh] sm:h-[215vh]"
          >
            <div className="sticky top-4 z-20">
              <HeroHotle3DStage
                scrollProgress={effectiveTiltProgress}
                activeTypology={activeTypology}
                onSelectTypology={setActiveTypology}
                currency={currency}
                onInspectProperty={handleInspectFloorPlan}
              />

              {/* Subtle Scroll Progress Bar below the sticky 3D stage */}
              <div className="mt-3 flex items-center justify-between gap-4 px-2 text-xs text-[#5A6265]">
                <span>
                  Scroll down to tilt residence in 3D before entering portfolio
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-28 h-1.5 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className="h-full bg-[#141718] transition-all duration-75"
                      style={{ width: `${Math.round(effectiveTiltProgress * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono-tabular text-[#141718] font-medium">
                    {Math.round(effectiveTiltProgress * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              SECTION 2: EDITORIAL MANIFESTO & CABIN MODULAR SPOTLIGHT
              Exact match to the middle section of the Hotle inspiration picture:
              - "Stunning architecture for spaces where people live, work, and chill."
              - "* CABIN MODULAR" + "Search my area" button on left
              - Dark corrugated-roof modular house cutout on right
              - "120+ | 15+ | 5+" quantitative proof strip below
             ===================================================================== */}
          <section id="backyard" className="pt-4 space-y-12 sm:space-y-16">
            {/* Editorial Headline Row + "About Us" label */}
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              <h2
                className="font-display font-medium tracking-[-0.03em] text-[#141718] leading-[1.08] max-w-3xl text-balance"
                style={{ fontSize: 'clamp(2.25rem, 5vw, 4.25rem)' }}
              >
                Stunning{' '}
                <span className="font-serif-editorial italic font-normal">
                  architecture
                </span>{' '}
                for spaces where people{' '}
                <span className="font-serif-editorial italic font-normal">
                  live, work,
                </span>{' '}
                and{' '}
                <span className="font-serif-editorial italic font-normal">
                  chill.
                </span>
              </h2>

              <span className="text-xs font-semibold tracking-wide text-[#2B2F30] whitespace-nowrap shrink-0 lg:pt-3">
                About Us
              </span>
            </div>

            {/* Split Row: Left "* CABIN MODULAR" + "Search my area" | Right Cabin Modular Cutout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
              {/* Left Column: Cabin Modular Copy & Interactive Area Search Trigger */}
              <div className="lg:col-span-4 space-y-6 pb-4">
                <div className="text-xs font-bold tracking-[0.08em] uppercase text-[#141718]">
                  * CABIN MODULAR
                </div>

                <p className="text-xs sm:text-sm text-[#4A5052] leading-relaxed max-w-xs">
                  Our signature model has the basics covered. Compact yet generous, efficient yet flexible, it maximizes its space for your comfort.
                </p>

                <div className="text-xs font-mono-tabular text-[#141718] font-medium">
                  Starting at {formatPrice(890000, currency)} · 138 m²
                </div>

                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAreaSearchOpen(!areaSearchOpen)}
                    className="px-6 py-2.5 text-xs font-medium text-[#141718] border border-black/30 hover:bg-[#141718] hover:text-[#FAF9F6] rounded-[20px] transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    Search my area
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInspectFloorPlan('cantilever-loft')}
                    className="px-4 py-2.5 text-xs font-medium text-[#4A5052] hover:text-[#141718] underline underline-offset-4 whitespace-nowrap shrink-0"
                  >
                    View 138 m² Blueprint
                  </button>
                </div>

                {/* Expandable Area Search Filter Box */}
                {areaSearchOpen && (
                  <div className="p-4 rounded-[20px] bg-[#ECEAE3] border border-black/10 space-y-3">
                    <label
                      htmlFor="area-search-input"
                      className="block text-xs font-medium text-[#141718]"
                    >
                      Filter listings by city or region
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <MapPin className="w-3.5 h-3.5 text-[#5A6265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="area-search-input"
                          type="text"
                          value={areaSearchQuery}
                          onChange={(e) => setAreaSearchQuery(e.target.value)}
                          placeholder="e.g. Quebec, Bali, Sutton..."
                          className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F6] text-[#141718] rounded-[16px] border border-black/15 focus:outline-none focus:border-[#141718]"
                        />
                      </div>
                      <a
                        href="#works"
                        className="px-4 py-2 text-xs font-medium bg-[#141718] text-[#FAF9F6] rounded-[16px] whitespace-nowrap"
                      >
                        Show ({filteredProperties.length})
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Dark Corrugated-Roof Cabin Modular Elevation Cutout */}
              <div className="lg:col-span-8">
                <CabinModularCutout />
              </div>
            </div>

            {/* 3-Column Quantitative Proof Strip (120+ | 15+ | 5+) matching Reference Image */}
            <div className="pt-8 pb-4 border-b border-black/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x divide-black/10">
                <div className="sm:pr-10 space-y-1">
                  <div
                    className="font-display font-semibold tracking-tight text-[#141718] tabular-nums"
                    style={{ fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)' }}
                  >
                    120+
                  </div>
                  <p className="text-xs sm:text-sm text-[#6E7577]">
                    Experienced people
                  </p>
                </div>

                <div className="sm:px-12 space-y-1">
                  <div
                    className="font-display font-semibold tracking-tight text-[#141718] tabular-nums"
                    style={{ fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)' }}
                  >
                    15+
                  </div>
                  <p className="text-xs sm:text-sm text-[#6E7577]">
                    Architectural awards & patents
                  </p>
                </div>

                <div className="sm:pl-12 space-y-1">
                  <div
                    className="font-display font-semibold tracking-tight text-[#141718] tabular-nums"
                    style={{ fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)' }}
                  >
                    5+
                  </div>
                  <p className="text-xs sm:text-sm text-[#6E7577]">
                    Climatic zones engineered
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              SECTION 3: "COMFORT x NATURE" — CURATED LISTINGS FROM STUDIO TO VILLA
              Matches bottom of Hotle reference pic + full interactive Studio-to-Villa grid
              with switchable USD ($), Naira (₦), and Pounds (£) pricing
             ===================================================================== */}
          <section id="works" className="space-y-12">
            {/* "Comfort x Nature" Editorial Header */}
            <div className="space-y-8">
              <h2
                className="font-display font-semibold tracking-[-0.03em] text-[#141718] leading-none"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                Comfort{' '}
                <span className="font-serif-editorial italic font-normal">
                  x
                </span>{' '}
                Nature
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
                <div className="md:col-span-5 text-xs font-medium text-[#2B2F30] md:text-center">
                  Choose space to rest
                </div>
                <p className="md:col-span-7 text-xs sm:text-sm text-[#4A5052] leading-relaxed max-w-xl">
                  Every thriving architectural residence is based on the symbiosis of a refined spatial strategy and remarkable visual aesthetic. Explore our complete collection from 92 m² studios to 460 m² villas.
                </p>
              </div>
            </div>

            {/* Filter Tabs, Currency Switcher Pills & Sort Selector */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4 pb-6 border-b border-black/10">
              {/* Category Filter Buttons (Studio -> Villa) */}
              <div
                role="tablist"
                aria-label="Filter residences from Studio to Villa"
                className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-[20px] bg-[#ECEAE3]"
              >
                {CATEGORIES.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 text-xs font-medium rounded-[16px] transition-colors duration-150 whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#141718] text-[#FAF9F6] shadow-sm'
                          : 'text-[#4A5052] hover:text-[#141718]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Right Controls: Quick Currency Switcher + Sort Dropdown */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Inline Currency Switcher */}
                <div
                  role="group"
                  aria-label="Currency selector"
                  className="inline-flex items-center p-1 rounded-[20px] bg-[#ECEAE3]"
                >
                  {CURRENCY_LIST.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      className={`px-3 py-1.5 text-xs font-mono-tabular font-medium rounded-[16px] transition-colors whitespace-nowrap shrink-0 ${
                        currency === code
                          ? 'bg-[#FAF9F6] text-[#141718] shadow-sm'
                          : 'text-[#4A5052] hover:text-[#141718]'
                      }`}
                    >
                      {CURRENCIES[code].symbol} {code}
                    </button>
                  ))}
                </div>

                {/* Sort Selector */}
                <div className="relative flex items-center">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#4A5052] absolute left-4 pointer-events-none" />
                  <select
                    aria-label="Sort properties"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | 'featured'
                          | 'price-asc'
                          | 'price-desc'
                          | 'area-desc'
                      )
                    }
                    className="pl-10 pr-8 py-2.5 text-xs bg-[#ECEAE3] text-[#141718] rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#141718] transition-colors cursor-pointer"
                  >
                    <option value="featured">Studio → Villa Order</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="area-desc">Area: Largest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Residences Grid (Real House Photos + Switchable Currency Costs + Accordion Disclosures) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => {
                const isExpanded = expandedPropertyId === property.id;
                const isCurrentPlan = selectedPlanPropertyId === property.id;
                const convertedPrice = formatPrice(property.price, currency);
                const pricePerSqm = formatPrice(
                  Math.round(property.price / property.totalArea),
                  currency,
                  true
                );

                return (
                  <article
                    key={property.id}
                    className="flex flex-col justify-between p-6 rounded-[24px] bg-[#EFECE6] border border-black/8 hover:border-black/25 transition-colors duration-200 space-y-6"
                  >
                    <div className="space-y-5">
                      {/* Real Architectural House Photo with Modal Expand Trigger */}
                      <div className="relative">
                        <ArchitecturalSceneCard
                          realPhotoUrl={property.realPhotoUrl}
                          alt={`${property.title} in ${property.location}`}
                          className="aspect-[4/3]"
                        />
                        <button
                          type="button"
                          onClick={() => setInspectingProperty(property)}
                          title="Inspect residence photography & specs"
                          className="absolute top-3 right-3 z-30 inline-flex items-center justify-center w-10 h-10 rounded-[16px] bg-[#FAF9F6]/90 backdrop-blur-md text-[#141718] hover:bg-[#141718] hover:text-[#FAF9F6] transition-colors duration-150 shadow-sm"
                          aria-label={`Inspect ${property.title}`}
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Editorial Index, Title & Live Multi-Currency Price */}
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-display text-2xl font-bold text-[#141718] tabular-nums">
                            {property.index}
                          </span>
                          <div className="text-right">
                            <div className="font-mono-tabular text-base sm:text-lg font-semibold text-[#141718]">
                              {convertedPrice}
                            </div>
                            <div className="font-mono-tabular text-[11px] text-[#5A6265]">
                              {pricePerSqm} / m²
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold tracking-tight text-[#141718]">
                          {property.title}
                        </h3>

                        {/* Zero-Pill Metadata: Clean unboxed inline text with typographic separators */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#4A5052] font-mono-tabular pt-0.5">
                          <span className="font-semibold text-[#141718]">
                            {property.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{formatArea(property.totalArea)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{property.bedrooms} Bed</span>
                          <span aria-hidden="true">·</span>
                          <span>{property.bathrooms} Bath</span>
                        </div>

                        <p className="text-xs text-[#5A6265]">
                          {property.location}
                        </p>
                      </div>

                      <p className="text-xs text-[#3C4143] leading-relaxed">
                        {property.shortSummary}
                      </p>

                      {/* Accordion Disclosure for Full Architectural Dossier */}
                      <div className="pt-2 border-t border-black/10">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedPropertyId(isExpanded ? null : property.id)
                          }
                          aria-expanded={isExpanded}
                          className="w-full flex items-center justify-between py-2 text-xs font-medium text-[#4A5052] hover:text-[#141718] transition-colors whitespace-nowrap"
                        >
                          <span>Architectural Specifications</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="mt-2 p-4 rounded-[20px] bg-[#FAF9F6] max-h-48 overflow-y-auto space-y-3 text-xs text-[#4A5052] leading-relaxed border border-black/5">
                            <p>{property.architecturalNotes}</p>
                            <div className="pt-2 border-t border-black/10 space-y-1 text-[#141718]">
                              {property.highlights.map((highlight) => (
                                <div key={highlight} className="flex items-center gap-2">
                                  <span aria-hidden="true">—</span>
                                  <span>{highlight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleInspectFloorPlan(property.id)}
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-[20px] transition-colors duration-150 whitespace-nowrap shrink-0 ${
                          isCurrentPlan
                            ? 'bg-[#141718] text-[#FAF9F6]'
                            : 'bg-[#FAF9F6] text-[#141718] border border-black/15 hover:bg-[#141718] hover:text-[#FAF9F6]'
                        }`}
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>{isCurrentPlan ? 'Active Blueprint' : 'Floor Plan'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectForViewing(property.id)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-[#141718] border border-black/20 hover:bg-[#141718] hover:text-[#FAF9F6] rounded-[20px] transition-colors duration-150 whitespace-nowrap shrink-0"
                      >
                        <span>Inquire</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* =====================================================================
              SECTION 4: INTERACTIVE HOUSE PLAN STUDIO (92 m² Studio to 460 m² Villa)
             ===================================================================== */}
          <section
            id="house-plan"
            className="p-6 sm:p-10 lg:p-12 rounded-[24px] bg-[#EFECE6] border border-black/10 space-y-10"
          >
            {/* Top Bar of House Plan Section: Residence Selector & Metric/Imperial Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-black/10">
              <div className="flex flex-wrap items-center gap-2">
                {PROPERTIES.map((prop) => {
                  const isSelected = prop.id === activePlanProperty.id;
                  return (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => {
                        setSelectedPlanPropertyId(prop.id);
                        setActiveRoomId('living-room');
                      }}
                      className={`px-4 py-2 text-xs rounded-[20px] transition-colors duration-150 whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-[#141718] text-[#FAF9F6] font-semibold'
                          : 'bg-[#FAF9F6] text-[#4A5052] hover:text-[#141718] border border-black/10'
                      }`}
                    >
                      {prop.index}. {prop.category} ({prop.totalArea} m²)
                    </button>
                  );
                })}
              </div>

              {/* Unit System Toggle (m² / sq ft) */}
              <div className="inline-flex items-center gap-1 p-1 rounded-[20px] bg-[#FAF9F6] border border-black/10 self-start lg:self-auto">
                <button
                  type="button"
                  onClick={() => setUnitSystem('m2')}
                  className={`px-3.5 py-1.5 text-xs rounded-[16px] transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    unitSystem === 'm2'
                      ? 'bg-[#141718] text-[#FAF9F6] font-medium'
                      : 'text-[#4A5052] hover:text-[#141718]'
                  }`}
                >
                  Metric (m²)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('sqft')}
                  className={`px-3.5 py-1.5 text-xs rounded-[16px] transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    unitSystem === 'sqft'
                      ? 'bg-[#141718] text-[#FAF9F6] font-medium'
                      : 'text-[#4A5052] hover:text-[#141718]'
                  }`}
                >
                  Imperial (sq ft)
                </button>
              </div>
            </div>

            {/* 2-Column Split: Room Breakdown Table on Left | Top-Down 3D Floor Plan on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-8">
                <div className="space-y-2">
                  <h2
                    className="font-display font-bold uppercase tracking-[-0.02em] text-[#141718]"
                    style={{ fontSize: 'clamp(1.85rem, 3.8vw, 3rem)' }}
                  >
                    HOUSE PLAN
                  </h2>
                  <p className="text-base sm:text-lg tracking-[0.06em] uppercase text-[#141718] font-semibold tabular-nums">
                    THE AREA IS {formatArea(activePlanProperty.totalArea).toUpperCase()}
                  </p>
                  <p className="text-xs font-mono-tabular text-[#4A5052]">
                    {activePlanProperty.title} · {activePlanProperty.location} ·{' '}
                    <strong className="text-[#141718]">
                      {formatPrice(activePlanProperty.price, currency)}
                    </strong>
                  </p>
                </div>

                {/* Tabular Room Breakdown */}
                <div className="divide-y divide-black/15 border-b border-black/15">
                  {activePlanProperty.rooms.map((room) => {
                    const isActive = activeRoomId === room.id;
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() =>
                          setActiveRoomId(isActive ? null : room.id)
                        }
                        onMouseEnter={() => setActiveRoomId(room.id)}
                        className={`w-full flex items-center justify-between py-3.5 px-3 text-left transition-colors duration-150 rounded-[12px] ${
                          isActive
                            ? 'bg-[#141718] text-[#FAF9F6]'
                            : 'text-[#2B2F30] hover:bg-black/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{room.name}</span>
                          {isActive && (
                            <span className="text-xs text-[#D5D8D6] hidden sm:inline">
                              · {room.finish}
                            </span>
                          )}
                        </div>
                        <span className="font-mono-tabular text-sm font-semibold w-28 text-right shrink-0">
                          {formatArea(room.area)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectForViewing(activePlanProperty.id)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-[0.06em] uppercase text-[#FAF9F6] bg-[#141718] hover:bg-[#2B3033] rounded-[20px] transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Reserve {activePlanProperty.category}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectingProperty(activePlanProperty)}
                    className="inline-flex items-center gap-2 px-5 py-3 text-xs font-medium text-[#141718] bg-[#FAF9F6] border border-black/15 hover:border-[#141718] rounded-[20px] transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Full Specifications</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-3">
                <InteractiveFloorPlan
                  rooms={activePlanProperty.rooms}
                  activeRoomId={activeRoomId}
                  onSelectRoom={setActiveRoomId}
                  totalArea={activePlanProperty.totalArea}
                  exteriorPhotoUrl={activePlanProperty.realPhotoUrl}
                />
                <div className="flex items-center justify-between px-2 text-xs text-[#5A6265]">
                  <span>Orthographic Architectural Scale · Interactive Blueprint</span>
                  <span>@newhaven</span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              SECTION 5: OUR SERVICES (01 — 04 Architectural Advisory)
             ===================================================================== */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-black/10">
              <h2
                className="font-display font-bold uppercase tracking-[-0.02em] text-[#141718]"
                style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)' }}
              >
                OUR SERVICES
              </h2>
              <p className="text-xs uppercase tracking-[0.12em] text-[#5A6265]">
                Turnkey Modular & Custom Architecture
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {SERVICES.map((service) => {
                const isExpanded = expandedServiceId === service.id;
                return (
                  <div
                    key={service.id}
                    className="flex flex-col justify-between p-5 rounded-[24px] bg-[#EFECE6] border border-black/8 space-y-5"
                  >
                    <div className="space-y-5">
                      <ArchitecturalSceneCard
                        realPhotoUrl={service.realPhotoUrl}
                        alt={service.title}
                        className="aspect-[4/5]"
                      />
                      <div className="space-y-2">
                        <div className="font-display text-3xl font-bold text-[#141718] tabular-nums">
                          {service.number}
                        </div>
                        <h3 className="text-xs font-bold tracking-[0.08em] uppercase text-[#141718]">
                          {service.title}
                        </h3>
                        <p className="text-xs text-[#4A5052] leading-relaxed">
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-black/10">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedServiceId(isExpanded ? null : service.id)
                        }
                        aria-expanded={isExpanded}
                        className="w-full flex items-center justify-between py-1 text-xs font-medium text-[#141718] whitespace-nowrap"
                      >
                        <span>Deliverables</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="mt-2 p-3.5 rounded-[18px] bg-[#FAF9F6] space-y-2 text-xs text-[#4A5052]">
                          <p>{service.extendedDetails}</p>
                          <div className="pt-2 border-t border-black/10 space-y-1 text-[#141718]">
                            {service.deliverables.map((item) => (
                              <div key={item}>· {item}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* =====================================================================
              SECTION 6: JOIN THE WAITLIST / PRIVATE VIEWINGS (CONTACT)
             ===================================================================== */}
          <section
            id="contact"
            className="p-6 sm:p-10 lg:p-14 rounded-[24px] bg-[#141718] text-[#FAF9F6]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5 space-y-6">
                <h2
                  className="font-display font-semibold tracking-[-0.03em] leading-tight text-balance"
                  style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)' }}
                >
                  Reserve your{' '}
                  <span className="font-serif-editorial italic font-normal">
                    Newhaven
                  </span>{' '}
                  residence.
                </h2>
                <p className="text-xs sm:text-sm text-[#B8C0C2] leading-relaxed">
                  Schedule a private architectural walkthrough or request a turnkey modular delivery quote in{' '}
                  <strong className="text-[#FAF9F6]">{CURRENCIES[currency].label}</strong>.
                </p>

                <blockquote className="p-5 rounded-[20px] bg-white/5 border border-white/10 space-y-2">
                  <p className="text-xs text-[#E2E6E7] leading-relaxed">
                    “From site topography mapping to crane installation of our Cabin Modular in Charlevoix, the entire commissioning process took under 14 weeks.”
                  </p>
                  <footer className="text-xs text-[#9AA4A7]">
                    Dr. Éric & Hélène Moreau · Cabin Modular & Pavilion Owners
                  </footer>
                </blockquote>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 rounded-[24px] bg-[#1E2325] border border-white/10">
                {inquirySubmitted ? (
                  <div className="py-10 px-4 text-center space-y-5">
                    <div className="w-12 h-12 rounded-[20px] bg-[#FAF9F6] text-[#141718] flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold">
                      Waitlist & Viewing Confirmed
                    </h3>
                    <p className="text-xs text-[#B8C0C2] max-w-md mx-auto leading-relaxed">
                      Thank you, {inquiryName}. We have prepared the architectural dossier for{' '}
                      <span className="text-[#FAF9F6] font-medium">
                        {PROPERTIES.find((p) => p.id === inquiryPropertyId)?.title}
                      </span>{' '}
                      priced in {CURRENCIES[currency].label}.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setInquirySubmitted(false);
                        setInquiryName('');
                        setInquiryEmail('');
                        setInquiryPhone('');
                        setInquiryNotes('');
                      }}
                      className="px-6 py-2.5 text-xs font-medium text-[#141718] bg-[#FAF9F6] rounded-[20px] whitespace-nowrap"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label
                          htmlFor="inquiry-name"
                          className="block text-xs uppercase tracking-wider text-[#B8C0C2]"
                        >
                          Full Name *
                        </label>
                        <input
                          id="inquiry-name"
                          type="text"
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="Camille Laurent"
                          className="w-full px-4 py-3 text-sm bg-[#141718] text-[#FAF9F6] placeholder-[#6C7578] border border-white/15 rounded-[20px] focus:outline-none focus:border-[#FAF9F6]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="inquiry-email"
                          className="block text-xs uppercase tracking-wider text-[#B8C0C2]"
                        >
                          Email Address *
                        </label>
                        <input
                          id="inquiry-email"
                          type="email"
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="camille@laurent.com"
                          className="w-full px-4 py-3 text-sm bg-[#141718] text-[#FAF9F6] placeholder-[#6C7578] border border-white/15 rounded-[20px] focus:outline-none focus:border-[#FAF9F6]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label
                          htmlFor="inquiry-property"
                          className="block text-xs uppercase tracking-wider text-[#B8C0C2]"
                        >
                          Residence Model ({currency})
                        </label>
                        <select
                          id="inquiry-property"
                          value={inquiryPropertyId}
                          onChange={(e) => setInquiryPropertyId(e.target.value)}
                          className="w-full px-4 py-3 text-sm bg-[#141718] text-[#FAF9F6] border border-white/15 rounded-[20px] focus:outline-none focus:border-[#FAF9F6]"
                        >
                          {PROPERTIES.map((prop) => (
                            <option key={prop.id} value={prop.id}>
                              {prop.index}. {prop.title} ({prop.totalArea} m² —{' '}
                              {formatPrice(prop.price, currency)})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="inquiry-phone"
                          className="block text-xs uppercase tracking-wider text-[#B8C0C2]"
                        >
                          Telephone (Optional)
                        </label>
                        <input
                          id="inquiry-phone"
                          type="tel"
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="+1 (418) 555-0148"
                          className="w-full px-4 py-3 text-sm bg-[#141718] text-[#FAF9F6] placeholder-[#6C7578] border border-white/15 rounded-[20px] focus:outline-none focus:border-[#FAF9F6]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'private', label: 'Private On-Site Viewing' },
                        { id: 'virtual', label: '3D Architect Walkthrough' },
                        { id: 'dossier', label: 'Request Full Dossier' },
                      ].map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setInquiryVisitType(
                              option.id as 'private' | 'virtual' | 'dossier'
                            )
                          }
                          className={`py-2.5 px-4 text-xs font-medium rounded-[20px] border transition-colors whitespace-nowrap ${
                            inquiryVisitType === option.id
                              ? 'bg-[#FAF9F6] text-[#141718] border-[#FAF9F6]'
                              : 'bg-[#141718] text-[#B8C0C2] border-white/15 hover:text-[#FAF9F6]'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={2}
                      value={inquiryNotes}
                      onChange={(e) => setInquiryNotes(e.target.value)}
                      placeholder="Preferred location, custom plot dimensions, or timeline..."
                      className="w-full px-4 py-3 text-sm bg-[#141718] text-[#FAF9F6] placeholder-[#6C7578] border border-white/15 rounded-[20px] focus:outline-none focus:border-[#FAF9F6] resize-none"
                    />

                    {inquiryError && (
                      <p role="alert" className="text-xs text-[#F59E8B]">
                        {inquiryError}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                      <span className="text-xs text-[#9AA4A7]">
                        Prices shown in {CURRENCIES[currency].label}
                      </span>
                      <button
                        type="submit"
                        className="px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#141718] bg-[#FAF9F6] hover:bg-[#E2E0D8] rounded-[20px] transition-colors whitespace-nowrap shrink-0"
                      >
                        Join Waitlist & Book Viewing
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>

          {/* Quiet Footer */}
          <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-black/10 text-xs text-[#5A6265]">
            <div className="flex items-center gap-3">
              <span className="font-display font-extrabold text-[#141718]">
                Newhaven
              </span>
              <span aria-hidden="true">·</span>
              <span>Masterpiece of Architecture</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <a href="#home" className="hover:text-[#141718]">
                Home
              </a>
              <a href="#backyard" className="hover:text-[#141718]">
                Backyard
              </a>
              <a href="#works" className="hover:text-[#141718]">
                Works
              </a>
              <a href="#house-plan" className="hover:text-[#141718]">
                House Plan
              </a>
              <a href="#contact" className="hover:text-[#141718]">
                Contact
              </a>
            </div>

            <div className="font-mono-tabular">
              © {new Date().getFullYear()} Newhaven Architecture
            </div>
          </footer>
        </div>
      </div>

      {/* =====================================================================
          RESIDENCE SPATIAL INSPECTION MODAL
         ===================================================================== */}
      {inspectingProperty && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-property-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm"
          onClick={() => setInspectingProperty(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-10 rounded-[24px] bg-[#FAF9F6] text-[#141718] border border-black/15 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#5A6265] font-mono-tabular">
                  <span>Commission {inspectingProperty.index}</span>
                  <span aria-hidden="true">·</span>
                  <span>{inspectingProperty.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{inspectingProperty.location}</span>
                </div>
                <h3
                  id="modal-property-title"
                  className="font-display text-2xl sm:text-3xl font-bold text-[#141718]"
                >
                  {inspectingProperty.title}
                </h3>
                <p className="font-mono-tabular text-base font-semibold text-[#141718]">
                  {formatPrice(inspectingProperty.price, currency)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectingProperty(null)}
                aria-label="Close modal"
                className="w-10 h-10 rounded-[16px] bg-[#ECEAE3] text-[#141718] hover:bg-[#141718] hover:text-[#FAF9F6] flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ArchitecturalSceneCard
              realPhotoUrl={inspectingProperty.realPhotoUrl}
              alt={inspectingProperty.title}
              className="aspect-[16/9]"
            />

            <div className="grid grid-cols-3 gap-4 p-4 rounded-[20px] bg-[#EFECE6] text-center font-mono-tabular">
              <div>
                <div className="text-xs text-[#5A6265]">Living Area</div>
                <div className="text-sm sm:text-base font-semibold text-[#141718] mt-0.5">
                  {formatArea(inspectingProperty.totalArea)}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#5A6265]">Bedrooms</div>
                <div className="text-sm sm:text-base font-semibold text-[#141718] mt-0.5">
                  {inspectingProperty.bedrooms} Beds
                </div>
              </div>
              <div>
                <div className="text-xs text-[#5A6265]">Bathrooms</div>
                <div className="text-sm sm:text-base font-semibold text-[#141718] mt-0.5">
                  {inspectingProperty.bathrooms} Baths
                </div>
              </div>
            </div>

            <p className="text-sm text-[#3C4143] leading-relaxed">
              {inspectingProperty.architecturalNotes}
            </p>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-black/10">
              <button
                type="button"
                onClick={() => {
                  const id = inspectingProperty.id;
                  setInspectingProperty(null);
                  handleInspectFloorPlan(id);
                }}
                className="px-5 py-3 text-xs font-medium text-[#141718] bg-[#ECEAE3] hover:bg-[#DFDDD4] rounded-[20px] transition-colors whitespace-nowrap"
              >
                Load in House Plan Studio
              </button>
              <button
                type="button"
                onClick={() => handleSelectForViewing(inspectingProperty.id)}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF9F6] bg-[#141718] hover:bg-[#2B3033] rounded-[20px] transition-colors whitespace-nowrap"
              >
                Reserve Residence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
