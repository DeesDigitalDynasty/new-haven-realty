export type PropertyCategory = 'All' | 'Studio' | 'Loft' | 'Townhouse' | 'Pavilion' | 'Villa';
export type CurrencyCode = 'USD' | 'NGN' | 'GBP';
export type HeroTypologyId = 'capsule' | 'cabin-modular' | 'eco-villa';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateFromUSD: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'USD ($)',
    rateFromUSD: 1,
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    label: 'NGN (₦)',
    rateFromUSD: 1600,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    label: 'GBP (£)',
    rateFromUSD: 0.78,
  },
};

export function formatPrice(usdAmount: number, currency: CurrencyCode, compact = false): string {
  const config = CURRENCIES[currency];
  const converted = Math.round(usdAmount * config.rateFromUSD);

  if (compact && currency === 'NGN' && converted >= 1_000_000) {
    const millions = converted / 1_000_000;
    const formattedM = Number.isInteger(millions) ? millions.toFixed(0) : millions.toFixed(1);
    return `${config.symbol}${formattedM}M`;
  }

  return `${config.symbol}${converted.toLocaleString('en-US')}`;
}

export interface HeroTypologyOption {
  id: HeroTypologyId;
  label: string;
  location: string;
  tagline: string;
  areaSqm: number;
  basePriceUSD: number;
  linkedPropertyId: string;
  heroImageUrl: string;
}

export const HERO_TYPOLOGIES: HeroTypologyOption[] = [
  {
    id: 'capsule',
    label: 'Capsule',
    location: 'Old Port, Quebec',
    tagline: 'Minimalist 92 m² glass studio capsule engineered for serene urban and forest living.',
    areaSqm: 92,
    basePriceUSD: 540000,
    linkedPropertyId: 'atrium-studio',
    heroImageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
  },
  {
    id: 'cabin-modular',
    label: 'Cabin Modular',
    location: 'Charlevoix, Canada',
    tagline: 'Compact yet generous charred-timber modular cabin with standing-seam zinc roof.',
    areaSqm: 138,
    basePriceUSD: 890000,
    linkedPropertyId: 'cantilever-loft',
    heroImageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85',
  },
  {
    id: 'eco-villa',
    label: 'Eco-villa',
    location: 'Ubud, Bali · Quebec',
    tagline: 'Two-story cantilevered charred-wood and warm architectural glass residence.',
    areaSqm: 460,
    basePriceUSD: 3890000,
    linkedPropertyId: 'newhaven-flagship-villa',
    heroImageUrl:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
  },
];

export interface RoomAllocation {
  id: string;
  name: string;
  area: number; // in m²
  exposure: string;
  finish: string;
  photoUrl: string;
  rect: { x: number; y: number; w: number; h: number };
}

export interface PropertyListing {
  id: string;
  index: string;
  title: string;
  category: Exclude<PropertyCategory, 'All'>;
  location: string;
  price: number; // Base price in USD
  priceFormatted: string;
  totalArea: number;
  bedrooms: number;
  bathrooms: number;
  realPhotoUrl: string;
  interiorPhotoUrl: string;
  shortSummary: string;
  architecturalNotes: string;
  highlights: string[];
  yearCompleted: number;
  rooms: RoomAllocation[];
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  extendedDetails: string;
  deliverables: string[];
  realPhotoUrl: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'property-showcase',
    number: '01',
    title: 'PROPERTY SHOWCASE',
    shortDescription: 'Elegant, high-impact visuals that elevate each property’s unique essence.',
    extendedDetails:
      'Bespoke twilight architectural cinematography, spatial staging, and private collector viewings curated for serene glass and timber residences.',
    deliverables: ['Twilight Architectural Monograph', 'Private Collector Dossier', 'Acoustic & Light Study'],
    realPhotoUrl:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'site-planning',
    number: '02',
    title: 'SITE PLANNING',
    shortDescription: 'Smart, refined layouts that seamlessly harmonize with the natural landscape.',
    extendedDetails:
      'Topographical integration across boreal forest ridges, granite outcrops, and alpine lakefronts with minimal ecological footprint and passive solar orientation.',
    deliverables: ['Topographic & Solar Mapping', 'Boreal Landscape Preservation', 'Geothermal Readiness'],
    realPhotoUrl:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'building-design',
    number: '03',
    title: 'BUILDING DESIGN',
    shortDescription: 'Timeless architecture blending form, function, and sophistication.',
    extendedDetails:
      'Structural steel cantilevers paired with triple-glazed low-iron curtain walls, raw board-formed concrete, and kiln-charred Canadian cedar.',
    deliverables: ['Cantilever Structural Engineering', 'Triple-Glazed Thermal Envelope', 'Custom Millwork Blueprints'],
    realPhotoUrl:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'space-planning',
    number: '04',
    title: 'SPACE PLANNING',
    shortDescription: 'Purposeful interiors designed for flow, balance, and quiet luxury.',
    extendedDetails:
      'Acoustically calm, open-volume living zones with concealed storage walls, integrated walnut cabinetry, and circadian warm-dimming illumination.',
    deliverables: ['Acoustic Zone Calibration', 'Circadian Lighting Architecture', 'Concealed Wardrobe Systems'],
    realPhotoUrl:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
  },
];

const DEFAULT_ROOM_PHOTOS: Record<string, string> = {
  'living-room':
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
  'dining-room':
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=900&q=80',
  'studio-kitchen':
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80',
  'tv-lounge':
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80',
  'master-bedroom':
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80',
  'guest-bedroom':
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80',
  bathroom:
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=80',
  'hallways-wardrobe':
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
};

export const PROPERTIES: PropertyListing[] = [
  {
    id: 'atrium-studio',
    index: '01',
    title: 'The Atrium Glass Studio',
    category: 'Studio',
    location: 'Old Port, Quebec City',
    price: 540000,
    priceFormatted: '$540,000',
    totalArea: 92,
    bedrooms: 2,
    bathrooms: 1,
    realPhotoUrl:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    interiorPhotoUrl:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    shortSummary: 'Open-volume architectural studio capsule with warm oak planes and private courtyard garden.',
    architecturalNotes:
      'Designed around a 92 m² orthographic footprint, The Atrium Glass Studio pairs warm white-oak plank flooring in the primary living and dining zones with honed limestone tiles across the lounge and sleeping quarters. Full-height acoustic glass partitions allow seamless transitions between solitude and entertaining.',
    highlights: ['3.4m Ceiling Height', 'Radiant Limestone Floors', 'Private Moss Courtyard'],
    yearCompleted: 2026,
    rooms: [
      {
        id: 'living-room',
        name: 'Living Room',
        area: 21,
        exposure: 'South-West Garden',
        finish: 'Wide-Plank White Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['living-room'],
        rect: { x: 48, y: 120, w: 185, h: 145 },
      },
      {
        id: 'dining-room',
        name: 'Dining Room',
        area: 9.3,
        exposure: 'West Courtyard',
        finish: 'Wide-Plank White Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['dining-room'],
        rect: { x: 155, y: 120, w: 78, h: 145 },
      },
      {
        id: 'studio-kitchen',
        name: 'Studio - Kitchen',
        area: 9.6,
        exposure: 'North Atrium',
        finish: 'Brushed Steel & Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['studio-kitchen'],
        rect: { x: 48, y: 42, w: 185, h: 78 },
      },
      {
        id: 'tv-lounge',
        name: 'TV Lounge',
        area: 9,
        exposure: 'South Terrace',
        finish: 'Honed Alabaster Stone',
        photoUrl: DEFAULT_ROOM_PHOTOS['tv-lounge'],
        rect: { x: 48, y: 265, w: 185, h: 125 },
      },
      {
        id: 'master-bedroom',
        name: 'Master bedroom',
        area: 15.6,
        exposure: 'East Forest View',
        finish: 'Smoked Oak & Wool',
        photoUrl: DEFAULT_ROOM_PHOTOS['master-bedroom'],
        rect: { x: 300, y: 42, w: 152, h: 125 },
      },
      {
        id: 'guest-bedroom',
        name: 'Guest bedroom',
        area: 11.1,
        exposure: 'South-East Grove',
        finish: 'Honed Alabaster Stone',
        photoUrl: DEFAULT_ROOM_PHOTOS['guest-bedroom'],
        rect: { x: 300, y: 265, w: 152, h: 125 },
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        area: 8.9,
        exposure: 'Internal Skylight',
        finish: 'Tadelakt Plaster & Slate',
        photoUrl: DEFAULT_ROOM_PHOTOS['bathroom'],
        rect: { x: 233, y: 155, w: 115, h: 110 },
      },
      {
        id: 'hallways-wardrobe',
        name: 'Hallways & wardrobe',
        area: 7.4,
        exposure: 'Central Spine',
        finish: 'Fluted Walnut Millwork',
        photoUrl: DEFAULT_ROOM_PHOTOS['hallways-wardrobe'],
        rect: { x: 233, y: 42, w: 67, h: 113 },
      },
    ],
  },
  {
    id: 'cantilever-loft',
    index: '02',
    title: 'The Cabin Modular Loft',
    category: 'Loft',
    location: 'Lac-Beauport, Quebec',
    price: 890000,
    priceFormatted: '$890,000',
    totalArea: 138,
    bedrooms: 2,
    bathrooms: 2,
    realPhotoUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    interiorPhotoUrl:
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
    shortSummary: 'Signature dark-timber modular cabin with standing-seam metal roof and warm cedar glazing.',
    architecturalNotes:
      'Our signature Cabin Modular model has the basics covered. Compact yet generous, efficient yet flexible, it maximizes its 138 m² space for your comfort with vertical charred-wood siding, natural oak window frames, and an integrated wood-burning stove.',
    highlights: ['Standing-Seam Zinc Roof', 'Natural Oak Picture Windows', 'Integrated Wood-Burning Hearth'],
    yearCompleted: 2026,
    rooms: [
      {
        id: 'living-room',
        name: 'Living Room',
        area: 34.5,
        exposure: 'South Canopy Panorama',
        finish: 'Kiln-Dried White Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['living-room'],
        rect: { x: 48, y: 120, w: 185, h: 145 },
      },
      {
        id: 'dining-room',
        name: 'Dining Room',
        area: 14.2,
        exposure: 'West Ridge View',
        finish: 'Kiln-Dried White Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['dining-room'],
        rect: { x: 155, y: 120, w: 78, h: 145 },
      },
      {
        id: 'studio-kitchen',
        name: 'Studio - Kitchen',
        area: 15.8,
        exposure: 'North Granite Face',
        finish: 'Blackened Steel & Soapstone',
        photoUrl: DEFAULT_ROOM_PHOTOS['studio-kitchen'],
        rect: { x: 48, y: 42, w: 185, h: 78 },
      },
      {
        id: 'tv-lounge',
        name: 'TV Lounge',
        area: 14.0,
        exposure: 'Acoustic Mezzanine',
        finish: 'Felted Wool & Slate',
        photoUrl: DEFAULT_ROOM_PHOTOS['tv-lounge'],
        rect: { x: 48, y: 265, w: 185, h: 125 },
      },
      {
        id: 'master-bedroom',
        name: 'Master bedroom',
        area: 23.4,
        exposure: 'East Pine Sanctuary',
        finish: 'Brushed Larch Timber',
        photoUrl: DEFAULT_ROOM_PHOTOS['master-bedroom'],
        rect: { x: 300, y: 42, w: 152, h: 125 },
      },
      {
        id: 'guest-bedroom',
        name: 'Guest bedroom',
        area: 16.5,
        exposure: 'South-East Terrace',
        finish: 'Honed Limestone',
        photoUrl: DEFAULT_ROOM_PHOTOS['guest-bedroom'],
        rect: { x: 300, y: 265, w: 152, h: 125 },
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        area: 11.2,
        exposure: 'Forest Soaking View',
        finish: 'Basalt Stone & Cedar',
        photoUrl: DEFAULT_ROOM_PHOTOS['bathroom'],
        rect: { x: 233, y: 155, w: 115, h: 110 },
      },
      {
        id: 'hallways-wardrobe',
        name: 'Hallways & wardrobe',
        area: 8.4,
        exposure: 'Gallery Spine',
        finish: 'Smoked Walnut Joinery',
        photoUrl: DEFAULT_ROOM_PHOTOS['hallways-wardrobe'],
        rect: { x: 233, y: 42, w: 67, h: 113 },
      },
    ],
  },
  {
    id: 'cedar-townhouse',
    index: '03',
    title: 'The Charlevoix Townhouse',
    category: 'Townhouse',
    location: 'Baie-Saint-Paul, Quebec',
    price: 1280000,
    priceFormatted: '$1,280,000',
    totalArea: 184,
    bedrooms: 3,
    bathrooms: 2,
    realPhotoUrl:
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    interiorPhotoUrl:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    shortSummary: 'Three-level architectural townhouse with private reflection courtyard and coastal views.',
    architecturalNotes:
      'Clad in Shou Sugi Ban charred cedar and low-iron structural glass, this 184 m² residence frames uninterrupted views toward the St. Lawrence estuary while shielding interior courtyards from coastal winds.',
    highlights: ['Charred Cedar Facade', 'Geothermal Radiant Heating', 'Private Wine & Art Vault'],
    yearCompleted: 2025,
    rooms: [
      {
        id: 'living-room',
        name: 'Living Room',
        area: 44.0,
        exposure: 'Estuary Horizon',
        finish: 'Dinesen Douglas Fir',
        photoUrl: DEFAULT_ROOM_PHOTOS['living-room'],
        rect: { x: 48, y: 120, w: 185, h: 145 },
      },
      {
        id: 'dining-room',
        name: 'Dining Room',
        area: 19.5,
        exposure: 'Courtyard Reflection Pool',
        finish: 'Dinesen Douglas Fir',
        photoUrl: DEFAULT_ROOM_PHOTOS['dining-room'],
        rect: { x: 155, y: 120, w: 78, h: 145 },
      },
      {
        id: 'studio-kitchen',
        name: 'Studio - Kitchen',
        area: 21.0,
        exposure: 'Herb Garden Terrace',
        finish: 'Honed Quartzite & Brass',
        photoUrl: DEFAULT_ROOM_PHOTOS['studio-kitchen'],
        rect: { x: 48, y: 42, w: 185, h: 78 },
      },
      {
        id: 'tv-lounge',
        name: 'TV Lounge',
        area: 18.5,
        exposure: 'Garden Level Sanctuary',
        finish: 'Travertine Slab',
        photoUrl: DEFAULT_ROOM_PHOTOS['tv-lounge'],
        rect: { x: 48, y: 265, w: 185, h: 125 },
      },
      {
        id: 'master-bedroom',
        name: 'Master bedroom',
        area: 31.0,
        exposure: 'Upper River Panorama',
        finish: 'Natural Oak & Linen',
        photoUrl: DEFAULT_ROOM_PHOTOS['master-bedroom'],
        rect: { x: 300, y: 42, w: 152, h: 125 },
      },
      {
        id: 'guest-bedroom',
        name: 'Guest bedroom',
        area: 22.0,
        exposure: 'Birch Grove View',
        finish: 'Travertine Slab',
        photoUrl: DEFAULT_ROOM_PHOTOS['guest-bedroom'],
        rect: { x: 300, y: 265, w: 152, h: 125 },
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        area: 15.5,
        exposure: 'Zen Atrium Lightwell',
        finish: 'Carved River Stone',
        photoUrl: DEFAULT_ROOM_PHOTOS['bathroom'],
        rect: { x: 233, y: 155, w: 115, h: 110 },
      },
      {
        id: 'hallways-wardrobe',
        name: 'Hallways & wardrobe',
        area: 12.5,
        exposure: 'Skylit Staircase',
        finish: 'Custom Ash Cabinetry',
        photoUrl: DEFAULT_ROOM_PHOTOS['hallways-wardrobe'],
        rect: { x: 233, y: 42, w: 67, h: 113 },
      },
    ],
  },
  {
    id: 'horizon-pavilion',
    index: '04',
    title: 'The Horizon Glass Pavilion',
    category: 'Pavilion',
    location: 'Sutton, Eastern Townships',
    price: 1950000,
    priceFormatted: '$1,950,000',
    totalArea: 245,
    bedrooms: 3,
    bathrooms: 3,
    realPhotoUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    interiorPhotoUrl:
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
    shortSummary: 'Single-level structural glass pavilion cantilevered over a heated mirror pool.',
    architecturalNotes:
      'Engineered with a 9-meter steel roof overhang, The Horizon Glass Pavilion dissolves the boundary between interior sanctuary and alpine meadow. Motorized floor-to-ceiling glass walls retract onto a zero-edge slate reflection basin.',
    highlights: ['9m Cantilevered Roofline', 'Zero-Edge Heated Reflection Pool', 'Motorized Glass Curtain Wall'],
    yearCompleted: 2026,
    rooms: [
      {
        id: 'living-room',
        name: 'Living Room',
        area: 58.0,
        exposure: '270° Alpine Meadow',
        finish: 'Rift-Sawn White Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['living-room'],
        rect: { x: 48, y: 120, w: 185, h: 145 },
      },
      {
        id: 'dining-room',
        name: 'Dining Room',
        area: 26.0,
        exposure: 'Mirror Pool Deck',
        finish: 'Rift-Sawn White Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['dining-room'],
        rect: { x: 155, y: 120, w: 78, h: 145 },
      },
      {
        id: 'studio-kitchen',
        name: 'Studio - Kitchen',
        area: 28.5,
        exposure: 'North Mountain View',
        finish: 'Anodized Aluminum & Stone',
        photoUrl: DEFAULT_ROOM_PHOTOS['studio-kitchen'],
        rect: { x: 48, y: 42, w: 185, h: 78 },
      },
      {
        id: 'tv-lounge',
        name: 'TV Lounge',
        area: 24.0,
        exposure: 'West Sunset Terrace',
        finish: 'Pietra Grey Limestone',
        photoUrl: DEFAULT_ROOM_PHOTOS['tv-lounge'],
        rect: { x: 48, y: 265, w: 185, h: 125 },
      },
      {
        id: 'master-bedroom',
        name: 'Master bedroom',
        area: 42.0,
        exposure: 'East Reflection Basin',
        finish: 'Warm Walnut & Silk Wool',
        photoUrl: DEFAULT_ROOM_PHOTOS['master-bedroom'],
        rect: { x: 300, y: 42, w: 152, h: 125 },
      },
      {
        id: 'guest-bedroom',
        name: 'Guest bedroom',
        area: 29.5,
        exposure: 'South Pine Glade',
        finish: 'Pietra Grey Limestone',
        photoUrl: DEFAULT_ROOM_PHOTOS['guest-bedroom'],
        rect: { x: 300, y: 265, w: 152, h: 125 },
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        area: 21.0,
        exposure: 'Private Hammam Court',
        finish: 'Monolithic Slate & Teak',
        photoUrl: DEFAULT_ROOM_PHOTOS['bathroom'],
        rect: { x: 233, y: 155, w: 115, h: 110 },
      },
      {
        id: 'hallways-wardrobe',
        name: 'Hallways & wardrobe',
        area: 16.0,
        exposure: 'Art Gallery Axis',
        finish: 'Backlit Bronze & Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['hallways-wardrobe'],
        rect: { x: 233, y: 42, w: 67, h: 113 },
      },
    ],
  },
  {
    id: 'mirror-lake-villa',
    index: '05',
    title: 'The Mirror Lake Villa',
    category: 'Villa',
    location: 'Mont-Tremblant, Quebec',
    price: 2780000,
    priceFormatted: '$2,780,000',
    totalArea: 320,
    bedrooms: 4,
    bathrooms: 4,
    realPhotoUrl:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    interiorPhotoUrl:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    shortSummary: 'Waterfront architectural villa with private boathouse, Nordic spa wing, and cantilevered deck.',
    architecturalNotes:
      'Set on 4.2 private acres of shoreline in Mont-Tremblant, The Mirror Lake Villa comprises two intersecting glass pavilions linked by a translucent bridge over a natural creek.',
    highlights: ['110m Private Lakefront', 'Integrated Finnish Sauna & Cold Plunge', 'Glass Bridge Gallery'],
    yearCompleted: 2026,
    rooms: [
      {
        id: 'living-room',
        name: 'Living Room',
        area: 76.0,
        exposure: 'Full Lakefront Panorama',
        finish: 'Wide-Plank Danish Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['living-room'],
        rect: { x: 48, y: 120, w: 185, h: 145 },
      },
      {
        id: 'dining-room',
        name: 'Dining Room',
        area: 34.0,
        exposure: 'Cantilevered Water Deck',
        finish: 'Wide-Plank Danish Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['dining-room'],
        rect: { x: 155, y: 120, w: 78, h: 145 },
      },
      {
        id: 'studio-kitchen',
        name: 'Studio - Kitchen',
        area: 36.0,
        exposure: 'Chef’s Scullery & Terrace',
        finish: 'Smoked Oak & Black Granite',
        photoUrl: DEFAULT_ROOM_PHOTOS['studio-kitchen'],
        rect: { x: 48, y: 42, w: 185, h: 78 },
      },
      {
        id: 'tv-lounge',
        name: 'TV Lounge',
        area: 31.0,
        exposure: 'Fireside Media Sanctuary',
        finish: 'Honed Ceppo di Gré Stone',
        photoUrl: DEFAULT_ROOM_PHOTOS['tv-lounge'],
        rect: { x: 48, y: 265, w: 185, h: 125 },
      },
      {
        id: 'master-bedroom',
        name: 'Master bedroom',
        area: 54.0,
        exposure: 'Private Shoreline Wing',
        finish: 'Oiled Walnut & Cashmere',
        photoUrl: DEFAULT_ROOM_PHOTOS['master-bedroom'],
        rect: { x: 300, y: 42, w: 152, h: 125 },
      },
      {
        id: 'guest-bedroom',
        name: 'Guest bedroom',
        area: 38.0,
        exposure: 'Forest Creek View',
        finish: 'Honed Ceppo di Gré Stone',
        photoUrl: DEFAULT_ROOM_PHOTOS['guest-bedroom'],
        rect: { x: 300, y: 265, w: 152, h: 125 },
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        area: 29.0,
        exposure: 'Nordic Thermal Court',
        finish: 'Laurentian Black Slate',
        photoUrl: DEFAULT_ROOM_PHOTOS['bathroom'],
        rect: { x: 233, y: 155, w: 115, h: 110 },
      },
      {
        id: 'hallways-wardrobe',
        name: 'Hallways & wardrobe',
        area: 22.0,
        exposure: 'Glass Bridge Spine',
        finish: 'Architectural Bronze & Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['hallways-wardrobe'],
        rect: { x: 233, y: 42, w: 67, h: 113 },
      },
    ],
  },
  {
    id: 'newhaven-flagship-villa',
    index: '06',
    title: 'The Newhaven Eco-Villa',
    category: 'Villa',
    location: 'Ubud, Bali · Stoneham, QC',
    price: 3890000,
    priceFormatted: '$3,890,000',
    totalArea: 460,
    bedrooms: 5,
    bathrooms: 5,
    realPhotoUrl:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    interiorPhotoUrl:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    shortSummary: 'The signature Newhaven two-story cantilevered dark-timber and warm-glass Eco-Villa.',
    architecturalNotes:
      'Our flagship architectural commission shown in the hero stage. Featuring a cantilevered upper-level charred-timber bedroom box with frameless glass balustrade suspended above a warm amber double-aspect ground living gallery and manicured lawn.',
    highlights: ['Signature Cantilevered Upper Wing', 'Frameless Glass Balustrade', 'Net-Zero Solar & Geothermal'],
    yearCompleted: 2026,
    rooms: [
      {
        id: 'living-room',
        name: 'Living Room',
        area: 112.0,
        exposure: 'Double-Aspect Lawn & Grove',
        finish: 'Bespoke Heartwood Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['living-room'],
        rect: { x: 48, y: 120, w: 185, h: 145 },
      },
      {
        id: 'dining-room',
        name: 'Dining Room',
        area: 48.0,
        exposure: 'Reflection Basin View',
        finish: 'Bespoke Heartwood Oak',
        photoUrl: DEFAULT_ROOM_PHOTOS['dining-room'],
        rect: { x: 155, y: 120, w: 78, h: 145 },
      },
      {
        id: 'studio-kitchen',
        name: 'Studio - Kitchen',
        area: 52.0,
        exposure: 'North Pine Sanctuary',
        finish: 'Patina Brass & Taj Quartzite',
        photoUrl: DEFAULT_ROOM_PHOTOS['studio-kitchen'],
        rect: { x: 48, y: 42, w: 185, h: 78 },
      },
      {
        id: 'tv-lounge',
        name: 'TV Lounge',
        area: 44.0,
        exposure: 'Acoustic Screening Wing',
        finish: 'Honed Belgian Bluestone',
        photoUrl: DEFAULT_ROOM_PHOTOS['tv-lounge'],
        rect: { x: 48, y: 265, w: 185, h: 125 },
      },
      {
        id: 'master-bedroom',
        name: 'Master bedroom',
        area: 78.0,
        exposure: 'Upper Cantilever Panorama',
        finish: 'Smoked Larch & Alpaca Wool',
        photoUrl: DEFAULT_ROOM_PHOTOS['master-bedroom'],
        rect: { x: 300, y: 42, w: 152, h: 125 },
      },
      {
        id: 'guest-bedroom',
        name: 'Guest bedroom',
        area: 54.0,
        exposure: 'East Courtyard Suite',
        finish: 'Honed Belgian Bluestone',
        photoUrl: DEFAULT_ROOM_PHOTOS['guest-bedroom'],
        rect: { x: 300, y: 265, w: 152, h: 125 },
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        area: 40.0,
        exposure: 'Private Hydrotherapy Wing',
        finish: 'Monolithic Basalt & Hinoki',
        photoUrl: DEFAULT_ROOM_PHOTOS['bathroom'],
        rect: { x: 233, y: 155, w: 115, h: 110 },
      },
      {
        id: 'hallways-wardrobe',
        name: 'Hallways & wardrobe',
        area: 32.0,
        exposure: 'Sculptural Stair Atrium',
        finish: 'Fluted Walnut & Leather',
        photoUrl: DEFAULT_ROOM_PHOTOS['hallways-wardrobe'],
        rect: { x: 233, y: 42, w: 67, h: 113 },
      },
    ],
  },
];
