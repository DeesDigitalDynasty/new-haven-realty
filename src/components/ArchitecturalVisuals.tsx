import React, { useState } from 'react';
import {
  CurrencyCode,
  HERO_TYPOLOGIES,
  HeroTypologyId,
  RoomAllocation,
  formatPrice,
} from '../data/properties';

const BACKUP_HOUSE_PHOTOS = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
];

interface HeroHotle3DStageProps {
  scrollProgress: number; // 0.0 to 1.0 as user scrolls through sticky hero track
  activeTypology: HeroTypologyId;
  onSelectTypology: (id: HeroTypologyId) => void;
  currency: CurrencyCode;
  onInspectProperty: (propertyId: string) => void;
}

/**
 * Sticky 3D Scroll-Tilt Hero Stage using REAL Unsplash luxury modern house photography:
 * - Top 3-column micro-captions ("Dream big. Live simple.", "Masterpiece of Architecture", "Space to Recharge life's batteries.")
 * - Giant bold black neo-grotesque display title ("Newhaven") that is ALWAYS 100% visible at rest and during scroll
 * - Real twilight glass house photograph sculpted with an architectural roofline silhouette that overlaps just the bottom baseline of "Newhaven" (like the Hotle reference) and tilts sideways in 3D perspective as the user scrolls down
 * - Bottom-left typology selector (Capsule, Cabin Modular, Eco-villa) & bottom-right location + live currency price
 */
export const HeroHotle3DStage: React.FC<HeroHotle3DStageProps> = ({
  scrollProgress,
  activeTypology,
  onSelectTypology,
  currency,
  onInspectProperty,
}) => {
  const [heroImgFallbackIdx, setHeroImgFallbackIdx] = useState<number | null>(null);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentTypology =
    HERO_TYPOLOGIES.find((t) => t.id === activeTypology) || HERO_TYPOLOGIES[2];

  // Smoothly ramp 3D sideways tilt from 0 -> 1 as user scrolls down
  // Using an ease-out curve so even a small scroll immediately produces a noticeable 3D sideways tilt
  const easedProgress = 1 - Math.pow(1 - Math.min(1, Math.max(0, scrollProgress)), 1.8);

  // Sideways 3D rotation (tilts sideways up to -26deg on Y axis, +8deg on X axis, -2deg Z roll)
  const rotateY = -(easedProgress * 26) + mouseOffset.x * 5;
  const rotateX = easedProgress * 8 - mouseOffset.y * 3;
  const rotateZ = -(easedProgress * 1.8);
  const translateX = -(easedProgress * 22);
  const translateY = easedProgress * 6;
  const scale = 1 - easedProgress * 0.05;

  // Dynamic 3D shadow shift as the house tilts sideways
  const shadowOffsetX = Math.round(easedProgress * 38);
  const shadowOffsetY = Math.round(24 + easedProgress * 18);

  // Counter-parallax for the giant "Newhaven" typography
  const titleTranslateX = easedProgress * 18;
  const titleTranslateY = -(easedProgress * 8);

  const activeHeroSrc =
    heroImgFallbackIdx !== null
      ? BACKUP_HOUSE_PHOTOS[heroImgFallbackIdx % BACKUP_HOUSE_PHOTOS.length]
      : currentTypology.heroImageUrl;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMouseOffset({ x: nx, y: ny });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden rounded-[24px] bg-[#EAE8E2] border border-black/10 shadow-xl select-none"
    >
      {/* Subtle Top-to-Bottom Editorial Sky Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, #EFECE6 0%, #EAE8E1 52%, #DCE0DC 100%)',
        }}
      />

      {/* Top 3-Column Editorial Micro-Captions (Exact match to Hotle reference pic) */}
      <div className="relative z-20 grid grid-cols-3 items-start px-6 sm:px-10 lg:px-14 pt-5 sm:pt-7 text-[11px] sm:text-xs leading-[1.35] text-[#222627] font-medium">
        <div>
          Dream big.
          <br />
          Live simple.
        </div>
        <div className="text-center">
          Masterpiece
          <br />
          of Architecture
        </div>
        <div className="text-right">
          Space to Recharge
          <br />
          life’s batteries.
        </div>
      </div>

      {/* Main Hero Stage */}
      <div className="relative pt-2 sm:pt-4 px-3 sm:px-6 lg:px-10 pb-5 sm:pb-7">
        {/* Layer 1: Giant Black Neo-Grotesque Display Title ("Newhaven")
            Kept in its own crisp 2D plane above the house with only the angled roof peak overlapping its bottom baseline */}
        <div
          className="relative z-10 pointer-events-none transition-transform duration-150 ease-out will-change-transform"
          style={{
            transform: `translate3d(${titleTranslateX}px, ${titleTranslateY}px, 0px)`,
          }}
        >
          <h1
            className="font-display font-extrabold tracking-[-0.055em] text-[#0E1011] leading-[0.86] text-center select-none"
            style={{ fontSize: 'clamp(3.25rem, 14.2vw, 12.4rem)' }}
          >
            Newhaven
          </h1>
        </div>

        {/* Layer 2: 3D Tilting Real House Stage
            Notice how we use perspective() directly on this container and an angled roofline clip-path on the top edge
            so "Newhaven" is 100% readable at rest AND the real house tilts dramatically in 3D when scrolling! */}
        <div className="relative z-20 -mt-3 sm:-mt-6 lg:-mt-10">
          <div
            className="relative w-full transition-transform duration-100 ease-out will-change-transform"
            style={{
              transform: `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) translate3d(${translateX}px, ${translateY}px, 0px) scale(${scale})`,
              transformOrigin: 'center center',
              filter: `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px 32px rgba(14, 16, 17, 0.34))`,
            }}
          >
            {/* 3D Architectural Side Extrusion Edge (Visible when house tilts sideways on scroll) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[22px] bg-[#1D2326] pointer-events-none transition-transform duration-100"
              style={{
                transform: `translate3d(${easedProgress * 16}px, ${easedProgress * 8}px, 0px)`,
                clipPath:
                  'polygon(0% 14%, 66% 0%, 100% 11%, 100% 100%, 0% 100%)',
              }}
            />

            {/* Main Real House Photograph Sculpted with the Hotle Cantilevered Roof Peak Silhouette */}
            <div
              className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-[22px] overflow-hidden bg-[#182022]"
              style={{
                clipPath:
                  'polygon(0% 14%, 66% 0%, 100% 11%, 100% 100%, 0% 100%)',
              }}
            >
              <img
                key={currentTypology.id}
                src={activeHeroSrc}
                alt={`${currentTypology.label} modern luxury house in ${currentTypology.location}`}
                referrerPolicy="no-referrer"
                onError={() =>
                  setHeroImgFallbackIdx((prev) => (prev === null ? 0 : prev + 1))
                }
                className="w-full h-full object-cover object-center transition-transform duration-500"
              />

              {/* Subtle roofline border highlight along the top angled edge */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0.68) 100%)',
                }}
              />

              {/* Dynamic 3D Specular Light Glint as the user scrolls & tilts the house */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                style={{
                  background: `linear-gradient(${
                    115 + rotateY * 1.8
                  }deg, rgba(255,255,255,0) 22%, rgba(255,242,214,${
                    0.22 * easedProgress
                  }) 50%, rgba(255,255,255,0) 78%)`,
                }}
              />

              {/* Bottom Overlay Controls inside Real House Frame:
                  Left: Capsule / Cabin Modular / Eco-villa switcher (Exact match to Hotle reference)
                  Right: Live Converted Price + Location ("Ubud, Bali · Quebec") */}
              <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-7">
                {/* Typology Switcher Buttons */}
                <div
                  role="tablist"
                  aria-label="Hero Architectural Typology"
                  className="flex flex-wrap items-center gap-2 sm:gap-3"
                >
                  {HERO_TYPOLOGIES.map((item) => {
                    const active = item.id === activeTypology;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                          setHeroImgFallbackIdx(null);
                          onSelectTypology(item.id);
                        }}
                        className={`px-4 py-2 text-xs font-medium rounded-[20px] transition-all duration-150 whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-[#FAF9F6] text-[#141718] shadow-md'
                            : 'bg-black/50 hover:bg-black/70 text-[#F4F5F0] backdrop-blur-md border border-white/15'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* Right Side: Live Price in Selected Currency + Location */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#FAF9F6] drop-shadow">
                  <button
                    type="button"
                    onClick={() =>
                      onInspectProperty(currentTypology.linkedPropertyId)
                    }
                    className="font-mono-tabular text-xs sm:text-sm font-semibold text-[#FFE2B3] hover:underline underline-offset-4 whitespace-nowrap"
                  >
                    {formatPrice(currentTypology.basePriceUSD, currency)} ·{' '}
                    {currentTypology.areaSqm} m²
                  </button>
                  <span aria-hidden="true" className="opacity-60">
                    ·
                  </span>
                  <span className="font-medium tracking-wide whitespace-nowrap">
                    {currentTypology.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Real Unsplash Photograph of the Dark Modern "CABIN MODULAR" Residence
 * for the second section ("Stunning architecture for spaces where people live, work, and chill.")
 */
export const CabinModularCutout: React.FC = () => {
  const [viewMode, setViewMode] = useState<'exterior' | 'interior'>('exterior');
  const [fallbackUsed, setFallbackUsed] = useState(false);

  const exteriorUrl =
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85';
  const interiorUrl =
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85';

  const currentSrc = fallbackUsed
    ? BACKUP_HOUSE_PHOTOS[0]
    : viewMode === 'exterior'
    ? exteriorUrl
    : interiorUrl;

  return (
    <div className="relative w-full rounded-[24px] overflow-hidden bg-[#1A2023] border border-black/10 shadow-xl group">
      <div className="aspect-[16/10] w-full overflow-hidden">
        <img
          src={currentSrc}
          alt="Cabin Modular dark timber and glass architectural home"
          referrerPolicy="no-referrer"
          onError={() => setFallbackUsed(true)}
          className="w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
        />
      </div>

      {/* Subtle Bottom Scrim + Exterior/Interior Toggle */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-[#FAF9F6] drop-shadow">
          Signature Cabin Modular · Standing-Seam & Charred Timber
        </span>

        <div className="inline-flex items-center p-1 rounded-[18px] bg-black/55 backdrop-blur-md border border-white/15">
          <button
            type="button"
            onClick={() => {
              setFallbackUsed(false);
              setViewMode('exterior');
            }}
            className={`px-3 py-1 text-xs rounded-[14px] transition-colors whitespace-nowrap ${
              viewMode === 'exterior'
                ? 'bg-[#FAF9F6] text-[#141718] font-medium'
                : 'text-[#E2E6E1] hover:text-white'
            }`}
          >
            Exterior
          </button>
          <button
            type="button"
            onClick={() => {
              setFallbackUsed(false);
              setViewMode('interior');
            }}
            className={`px-3 py-1 text-xs rounded-[14px] transition-colors whitespace-nowrap ${
              viewMode === 'interior'
                ? 'bg-[#FAF9F6] text-[#141718] font-medium'
                : 'text-[#E2E6E1] hover:text-white'
            }`}
          >
            Interior
          </button>
        </div>
      </div>
    </div>
  );
};

interface ArchitecturalSceneCardProps {
  realPhotoUrl: string;
  alt?: string;
  className?: string;
}

/**
 * Displays a real Unsplash architectural house photograph with automatic backup photo fallback
 * so every listing and service card always shows a real photograph.
 */
export const ArchitecturalSceneCard: React.FC<ArchitecturalSceneCardProps> = ({
  realPhotoUrl,
  alt = 'Modern architectural residence',
  className = 'aspect-[4/3]',
}) => {
  const [fallbackIdx, setFallbackIdx] = useState<number | null>(null);

  const srcToRender =
    fallbackIdx !== null
      ? BACKUP_HOUSE_PHOTOS[fallbackIdx % BACKUP_HOUSE_PHOTOS.length]
      : realPhotoUrl;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[20px] bg-[#1A2023] border border-black/10 group ${className}`}
    >
      <img
        src={srcToRender}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() =>
          setFallbackIdx((prev) => (prev === null ? 0 : prev + 1))
        }
        className="w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
      />

      {/* Subtle Bottom Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

interface InteractiveFloorPlanProps {
  rooms: RoomAllocation[];
  activeRoomId: string | null;
  onSelectRoom: (roomId: string | null) => void;
  totalArea: number;
  exteriorPhotoUrl: string;
}

/**
 * Real Room & Interior Photography Viewer + Interactive Spatial Grid for the House Plan Section
 */
export const InteractiveFloorPlan: React.FC<InteractiveFloorPlanProps> = ({
  rooms,
  activeRoomId,
  onSelectRoom,
  exteriorPhotoUrl,
}) => {
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  const currentPhotoUrl = fallbackUsed
    ? exteriorPhotoUrl
    : activeRoom?.photoUrl || exteriorPhotoUrl;

  return (
    <div className="relative w-full rounded-[24px] overflow-hidden bg-[#181E20] border border-black/15 shadow-xl select-none">
      {/* Main Real Photograph of the Selected Room */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          key={activeRoom?.id || 'default'}
          src={currentPhotoUrl}
          alt={`${activeRoom?.name || 'Residence'} architectural interior`}
          referrerPolicy="no-referrer"
          onError={() => setFallbackUsed(true)}
          className="w-full h-full object-cover object-center transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Room Title & Finish Overlay on Photo */}
        <div className="absolute bottom-4 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-[#FAF9F6]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-[#D8E0DC]">
              Active Room View · {activeRoom?.exposure}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              {activeRoom?.name}
            </h3>
          </div>
          <div className="font-mono-tabular text-xs sm:text-sm font-medium text-[#FFE2B3]">
            {activeRoom?.area} m² · {activeRoom?.finish}
          </div>
        </div>
      </div>

      {/* Interactive Room Thumbnail Strip Below Photo */}
      <div className="p-4 bg-[#141718] border-t border-white/10">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {rooms.map((room) => {
            const isSelected = activeRoom?.id === room.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => {
                  setFallbackUsed(false);
                  onSelectRoom(room.id);
                }}
                className={`group relative rounded-[12px] overflow-hidden aspect-square border transition-all ${
                  isSelected
                    ? 'border-[#FAF9F6] ring-2 ring-[#FAF9F6]/40 scale-[1.02]'
                    : 'border-white/15 opacity-70 hover:opacity-100'
                }`}
                title={`${room.name} (${room.area} m²)`}
              >
                <img
                  src={room.photoUrl}
                  alt={room.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45 flex items-end p-1">
                  <span className="text-[9px] leading-tight text-white font-medium truncate w-full text-left">
                    {room.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
