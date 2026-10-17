# Newhaven — Light Editorial Architectural Redesign & 3D Scroll Stage

Redesign the **Newhaven** real estate experience to match the clean, industrial-editorial aesthetic of the *Hotle* reference design—featuring real architectural house photography layered over giant neo-grotesque typography, a sticky 3D scroll-tilt hero stage, live multi-currency switching (`USD $`, `NGN ₦`, `GBP £`), the signature *Cabin Modular* & *Comfort × Nature* editorial sections, and the interactive Studio-to-Villa listings and floor plan studio.

## User Review & Critical Decisions

> [!IMPORTANT]
> All three core product and interaction decisions have been confirmed and incorporated into this architectural blueprint:

- **Confirmed Decision 1 — Sticky 3D Scroll-Hijack Hero Stage**: The hero section uses a tall scroll container (`~240vh`) with a sticky viewport stage (`100vh`). As the user scrolls down through the initial scroll distance, the architectural house card and foreground house layer smoothly tilt sideways in 3D perspective (`rotateY`, `rotateX`, `scale`, and subtle depth parallax with dynamic lighting shadow shift) before releasing cleanly into the rest of the page.
- **Confirmed Decision 2 — Real-Time Multi-Currency Switcher (`USD $`, `NGN ₦`, `GBP £`)**: A global currency selector in the top bar and listings header dynamically converts all property prices and price-per-square-meter metrics from base USD (`$`) into Nigerian Naira (`₦` at realistic market rates) and British Pounds (`£`) with locale-accurate tabular formatting.
- **Confirmed Decision 3 — Unified Light Editorial Layout + Interactive Floor Plan Studio**: Combines every signature section from the new inspiration image (*Hero Cutout Stage*, *"Stunning architecture for spaces where people live, work, and chill"*, *Cabin Modular Feature*, *120+ / 15+ / 5+ Proof Strip*, and *"Comfort × Nature"*) with the restyled *Curated Listings (Studio to Villa)*, *Our Services*, and *Interactive House Plan* in the warm alabaster, charcoal, and muted sage palette.

---

## 1. Overview & Core Concept

- **What It Does**: Presents an architectural real estate showcase for **Newhaven** where visitors can experience a 3D perspective scroll-tilt hero showcase, explore modular and custom residences ranging from a **92 m² Studio/Capsule** to a **460 m² Eco-Villa**, switch pricing instantaneously between **USD ($)**, **Naira (₦)**, and **Pounds (£)**, inspect room-by-room orthographic floor plans, and schedule private viewings.
- **Target Audience / Persona**: Design-conscious home buyers, international property investors, and architectural collectors comparing modern residences across global currencies.
- **Key Value**: Bridges high-fashion editorial presentation (layered typography, 3D scroll choreography, and uncluttered whitespace) with practical real estate tools (instant currency conversion, interactive room blueprints, and typology filtering).

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **3D Hero Scroll Choreography**: On arrival, the user sees the top micro-captions (*"Dream big. Live simple."*, *"Masterpiece of Architecture"*, *"Space to Recharge life's batteries"*), the giant black display title **Newhaven**, and a real modern black-steel and warm-glass cantilevered house layered in front of the typography. As the user scrolls down, the sticky viewport holds while the house smoothly tilts sideways in 3D space (`perspective(1200px) rotateY(-18deg) rotateX(6deg) translateZ(30px)`) with a progress indicator and typology switcher (*Studio Capsule*, *Cabin Modular*, *Eco-Villa*) at the bottom of the hero frame.
  2. **Editorial Architecture Statement & Cabin Modular Spotlight**: Once the 3D hero tilt completes its arc, the page scrolls into the mixed sans/italic-serif manifesto (*"Stunning architecture for spaces where people live, work, and chill."*) paired with the **Cabin Modular** architectural elevation, interactive area search drawer, and the **120+ / 15+ / 5+** quantitative proof strip.
  3. **Multi-Currency Studio-to-Villa Listings & Comfort × Nature**: Users toggle between **USD ($)**, **NGN (₦)**, and **GBP (£)** at any time. Every listing from Studio to Villa updates its price immediately. Users filter by typology (*All*, *Studio*, *Loft*, *Cabin Modular*, *Pavilion*, *Eco-Villa*), expand concise accordion dossiers for deep specs, or load a residence into the interactive **House Plan**.
  4. **Interactive House Plan & Private Viewing Booking**: Users click or hover rooms in the **92 m² – 460 m²** floor plan table to highlight zones on the top-down architectural blueprint, then reserve an on-site or virtual walkthrough.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Clean Industrial & Airy Architectural Editorial (inspired by the *Hotle* reference layout) with generous `24px–32px+` structural padding, `20px–24px` soft border radii, and zero static pill clutter.
  - *Color Palette & Mood*:
    - Dominant Canvas (`60%`): Warm Alabaster & Stone Mist (`#F3F2EE` outer mist frame, `#FAF9F6` primary editorial paper surface).
    - Structural Surfaces (`30%`): Soft Birch Card Surfaces (`#EFECE6`), Deep Architectural Charcoal (`#141718`), and Muted Slate Copy (`#5A6265`).
    - Accent Budget (`10%`): Warm Amber Architectural Glow (`#D98A3C`) and Muted Sage-Teal (`#6E8578`) for interactive states and blueprint highlights.
  - *Typography & Hierarchy*:
    - **Display / Brand (`Plus Jakarta Sans` / `Syne` 800)**: Giant tight-tracked hero wordmark (`Newhaven`) and bold section headers (`Comfort x Nature`, `120+`).
    - **Editorial Serif Accent (`Playfair Display` / `Cormorant Garamond` Italic)**: Used selectively for italicised words in headlines (*"architecture"*, *"live, work"*, *"chill"*, and *"Comfort x Nature"*) to match the reference image.
    - **Tabular Data (`JetBrains Mono` `tabular-nums`)**: Used for currency figures (`$`, `₦`, `£`), square-meter measurements, and floor plan dimensions.

- **Interactive Feedback & Motion**:
  - Hardware-accelerated 3D CSS perspective transforms driven by scroll progress (`transform: perspective(1400px) rotateY(...) rotateX(...) scale(...)`) with a manual 3D angle slider / reset toggle for accessibility and `prefers-reduced-motion` support.
  - Smooth `150ms–200ms` transitions on typology switches, currency conversions, and accordion disclosures.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Layered Real House Photography + Cutout Sky Masking for the Hero**
  - *Chosen Approach*: Use verified high-resolution real architectural photography of modern dark-timber/steel glass residences and modular cabins, composited with precision CSS/SVG sky-layer masking so the giant **Newhaven** typography sits visibly *behind* the roofline while the warm illuminated glass house sits in the foreground, matching the *Hotle* reference layout.
  - *Why*: Delivers authentic photorealistic architecture while preserving the signature editorial depth effect where the building overlaps the giant brand headline.

- **Decision 2: Sticky Scroll-Hijack 3D Tilt Stage with Interactive Typology Switcher**
  - *Chosen Approach*: Wrap the hero in a `230vh` scroll track containing a `sticky top-0 h-screen` 3D stage. Scroll progress (`0.0` → `1.0`) maps smoothly to a 3D sideways tilt (`rotateY` up to `-22deg`, `rotateX` up to `7deg`, dynamic shadow offset, and subtle foreground/background layer parallax) before scrolling naturally into the *"Stunning architecture..."* section.
  - *Why*: Fulfils the exact scroll experience requested—tilting the house sideways as the user scrolls down a bit before revealing the rest of the website—without breaking native browser scrollbars or back-scrolling.

- **Decision 3: Global Currency State (`USD`, `NGN`, `GBP`) with Tabular Formatting**
  - *Chosen Approach*: Maintain base prices in USD and apply live conversion multipliers (`USD: 1`, `NGN: 1600`, `GBP: 0.78`) with compact/full formatting options so Naira values (e.g., `₦864,000,000` or `₦864M`) and Pound/Dollar values remain crisp, single-line, and readable across all cards and modals.
  - *Why*: Ensures 100% consistency across every price tag, floor plan header, and inquiry dropdown when switching currencies.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        App Root (Light Editorial Canvas)                    │
│  State: currency ('USD'|'NGN'|'GBP'), heroTypology, selectedCategory,       │
│         selectedPlanId, activeRoomId, areaSearchQuery, inquiryFormState     │
└───────────────┬─────────────────────────────────────────────┬───────────────┘
                │                                             │
                ▼                                             ▼
┌───────────────────────────────────────┐     ┌───────────────────────────────┐
│   Top Bar Contract (3-Zone Header)    │     │ Sticky 3D Scroll Hero Stage   │
│  • Zone 1: NEWHAVEN Wordmark          │     │  • 230vh Scroll Track         │
│  • Zone 2: Single-Line Nav Links      │     │  • 3-Col Micro Captions       │
│  • Zone 3: Currency Switcher + CTA    │     │  • Giant "Newhaven" Backdrop  │
└───────────────────────────────────────┘     │  • 3D Tilting Real Glass Home │
                                              │  • Capsule/Cabin/Villa Tabs   │
                                              └───────────────┬───────────────┘
                                                              │
       ┌──────────────────────────────────────────────────────┘
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             Editorial Manifesto & Cabin Modular Spotlight                   │
│  • Mixed Sans + Italic Serif Headline ("Stunning architecture... live...")  │
│  • Cabin Modular Elevation Cutout + Interactive Area Search Modal/Filter    │
│  • 3-Column Quantitative Proof Strip (120+ | 15+ | 5+)                      │
└───────────────┬─────────────────────────────────────────────┬───────────────┘
                │                                             │
                ▼                                             ▼
┌───────────────────────────────────────┐     ┌───────────────────────────────┐
│   "Comfort x Nature" Curated Listings │     │ Interactive House Plan Studio │
│  • Studio (92m²) to Villa (460m²)     │     │  • Metric (m²) / Imperial     │
│  • Live USD / NGN / GBP Price Display │     │  • 8-Room Tabular Breakdown   │
│  • Accordion Dossier Disclosures      │     │  • Top-Down 3D Blueprint SVG  │
└───────────────────────────────────────┘     └───────────────────────────────┘
```

### Interactive Component & State Mapping

- **3D Scroll Listener (`useScrollTilt`)**: Computes normalized progress $p \in [0, 1]$ within the hero scroll container using `requestAnimationFrame`. Applies `rotateY(${p * -20}deg) rotateX(${p * 6}deg) scale(${1 - p * 0.04})` to the 3D house stage and shifts the giant `Newhaven` title in counter-parallax (`translateX(${p * 36}px)`), plus allows clicking *Capsule*, *Cabin Modular*, or *Eco-Villa* at the bottom left of the hero to switch the featured hero house photo.
- **Currency Engine (`formatCurrency(usdAmount, currency)`)**: Converts base USD prices into `USD ($)`, `NGN (₦)`, or `GBP (£)` across the Hero, Residence Cards, Floor Plan summary, and Private Viewing form.
- **Area Search & Typology Filtering**: Clicking `"Search my area"` in the Cabin Modular section or selecting a typology filter dynamically filters the residences and scrolls smoothly to the matching properties.
