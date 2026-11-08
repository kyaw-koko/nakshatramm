'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Compass,
  Eye,
  EyeOff,
  Play,
  Pause,
  X
} from 'lucide-react';
import {
  ObserverLocation,
  calculateAllPlanets,
  equatorialToHorizontal,
  stereographicProject,
  PlanetData,
  calculateSunPosition,
  LagnaData
} from '@/lib/astronomy';
import { BURMESE_NAKSHATRAS, MAJOR_NAVIGATIONAL_STARS, Nakshatra, CelestialStar } from '@/data/nakshatras';

export interface SelectedTarget {
  type: 'nakshatra' | 'planet' | 'star' | 'lagna';
  data: Nakshatra | PlanetData | CelestialStar | LagnaData;
  alt: number;
  az: number;
  distanceAu?: number;
}

export interface SkyCanvasProps {
  currentDate: Date;
  setCurrentDate?: React.Dispatch<React.SetStateAction<Date>>;
  observer: ObserverLocation;
  setObserver?: (obs: ObserverLocation) => void;
  isPlaying?: boolean;
  setIsPlaying?: (playing: boolean) => void;
  speedMultiplier?: number;
  setSpeedMultiplier?: (speed: number) => void;
  showConstellationLines: boolean;
  setShowConstellationLines?: (show: boolean) => void;
  showNakshatraNames: boolean;
  setShowNakshatraNames?: (show: boolean) => void;
  showStarNames: boolean;
  setShowStarNames?: (show: boolean) => void;
  showPlanets: boolean;
  setShowPlanets?: (show: boolean) => void;
  showAltGrid: boolean;
  setShowAltGrid?: (show: boolean) => void;
  showBelowHorizon: boolean;
  setShowBelowHorizon?: (show: boolean) => void;
  onSelectTarget: (target: SelectedTarget | null) => void;
  selectedTarget: SelectedTarget | null;
  birthSkyActive?: boolean;
  birthLagna?: LagnaData | null;
  birthJanmaNakshatraId?: number | null;
}

interface ClickableItem {
  type: 'nakshatra' | 'planet' | 'star' | 'lagna';
  data: Nakshatra | PlanetData | CelestialStar | LagnaData;
  x: number;
  y: number;
  radius: number;
  alt: number;
  az: number;
}

export default function SkyCanvas({
  currentDate,
  setCurrentDate,
  observer,
  isPlaying = false,
  setIsPlaying,
  speedMultiplier = 60,
  setSpeedMultiplier,
  showConstellationLines,
  setShowConstellationLines,
  showNakshatraNames,
  setShowNakshatraNames,
  showStarNames,
  showPlanets,
  showAltGrid,
  showBelowHorizon,
  setShowBelowHorizon,
  onSelectTarget,
  selectedTarget,
  birthSkyActive = false,
  birthLagna = null,
  birthJanmaNakshatraId = null
}: SkyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pan, Zoom, Rotation & Fullscreen State
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // Dragging & Interaction State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragDistanceRef = useRef<number>(0);
  const [hoveredItem, setHoveredItem] = useState<ClickableItem | null>(null);

  // Touch tracking
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1.0);
  const touchStartAngleRef = useRef<number | null>(null);
  const touchMoveTotalRef = useRef<number>(0);

  const clickableItemsRef = useRef<ClickableItem[]>([]);

  // -------------------------------------------------------------
  // RENDER SKY DOME ON CANVAS
  // -------------------------------------------------------------
  const renderSky = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width === 0 || height === 0) return;

    // Adjust canvas resolution for Retina/Hi-DPI displays
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Dynamic Center point shifted by panOffset
    const cx = width / 2 + panOffset.x;
    const cy = height / 2 + panOffset.y;

    // Horizon radius R with safe margin ensuring 0 clipping of South/North/East/West horizon
    const maxR = Math.max(90, Math.min(width, height) / 2 - 42);
    const baseRadius = maxR * zoomLevel;

    // Reset hit detection registry
    const items: ClickableItem[] = [];

    // 1. COSMIC BACKGROUND & DOME SHIELD
    const spaceGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 1.5);
    spaceGrad.addColorStop(0, '#0D1B2A');
    spaceGrad.addColorStop(0.5, '#0B132B');
    spaceGrad.addColorStop(0.85, '#070D1E');
    spaceGrad.addColorStop(1, '#030712');

    ctx.fillStyle = spaceGrad;
    ctx.fillRect(0, 0, width, height);

    // Visible Sky Dome Fill (inside horizon radius R)
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
    ctx.fill();

    // Subtle atmospheric daylight scattering if Sun is above horizon
    const sunPos = calculateSunPosition(currentDate);
    const sunHoriz = equatorialToHorizontal(sunPos.raHours, sunPos.decDeg, currentDate, observer);
    if (sunHoriz.altitude > -18) {
      const sunProj = stereographicProject(sunHoriz.altitude, sunHoriz.azimuth, baseRadius, cx, cy, rotationDeg);
      const daylightFactor = Math.max(0, Math.min(1, (sunHoriz.altitude + 18) / 30));
      const atmosGrad = ctx.createRadialGradient(sunProj.x, sunProj.y, 10, cx, cy, baseRadius * 1.2);
      atmosGrad.addColorStop(0, `rgba(56, 189, 248, ${0.45 * daylightFactor})`);
      atmosGrad.addColorStop(0.6, `rgba(14, 116, 144, ${0.2 * daylightFactor})`);
      atmosGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = atmosGrad;
      ctx.fill();
      ctx.restore();
    }

    // 2. CONCENTRIC ALTITUDE RINGS (30°, 60°) & ZENITH CROSSHAIR
    if (showAltGrid) {
      ctx.save();
      // 30° Altitude Ring
      const r30 = (baseRadius * Math.cos((30 * Math.PI) / 180)) / (1 + Math.sin((30 * Math.PI) / 180));
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, r30, 0, Math.PI * 2);
      ctx.stroke();

      // 60° Altitude Ring
      const r60 = (baseRadius * Math.cos((60 * Math.PI) / 180)) / (1 + Math.sin((60 * Math.PI) / 180));
      ctx.beginPath();
      ctx.arc(cx, cy, r60, 0, Math.PI * 2);
      ctx.stroke();

      // Zenith crosshair at (cx, cy)
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.35)';
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx, cy + 8);
      ctx.stroke();

      // Altitude labels
      ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
      ctx.fillStyle = 'rgba(74, 222, 128, 0.45)';
      ctx.fillText('+60°', cx + 6, cy - r60 - 4);
      ctx.fillText('+30°', cx + 6, cy - r30 - 4);
      ctx.fillText('Zenith (မိုးတည့်တည့်)', cx + 10, cy + 14);
      ctx.restore();
    }

    // 3. HORIZON LINE & COMPASS POINTS
    ctx.save();
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.7)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Subterranean boundary warning if Below Horizon mode is OFF
    if (!showBelowHorizon) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(width, height) * 2, 0, Math.PI * 2);
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2, true);
      ctx.fillStyle = 'rgba(5, 8, 22, 0.88)';
      ctx.fill();
      ctx.restore();
    }

    // Compass Cardinal Directions (N, E, S, W)
    const compassPoints = [
      { az: 0, labelMm: 'မြောက်', labelEn: 'N', color: '#38BDF8' },
      { az: 90, labelMm: 'အရှေ့', labelEn: 'E', color: '#FCD34D' },
      { az: 180, labelMm: 'တောင်', labelEn: 'S', color: '#4ADE80' },
      { az: 270, labelMm: 'အနောက်', labelEn: 'W', color: '#F87171' }
    ];

    compassPoints.forEach((pt) => {
      const p = stereographicProject(0, pt.az, baseRadius, cx, cy, rotationDeg);
      ctx.save();
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();

      const labelDist = baseRadius + 18;
      const lp = stereographicProject(0, pt.az, labelDist, cx, cy, rotationDeg);
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = pt.color;
      ctx.fillText(`${pt.labelMm} (${pt.labelEn})`, lp.x, lp.y);
      ctx.restore();
    });

    // 4. DRAW 27 BURMESE NAKSHATRAS (Lines, Stars, Labels)
    BURMESE_NAKSHATRAS.forEach((nak) => {
      const isSelected = selectedTarget?.type === 'nakshatra' && (selectedTarget.data as Nakshatra).id === nak.id;
      const isJanma = birthSkyActive && birthJanmaNakshatraId === nak.id;

      // Project each star in the Nakshatra
      const projectedStars = nak.stars.map((s) => {
        const horiz = equatorialToHorizontal(s.raHours, s.decDeg, currentDate, observer);
        const proj = stereographicProject(horiz.altitude, horiz.azimuth, baseRadius, cx, cy, rotationDeg);
        return { ...s, horiz, proj };
      });

      // Filter visible stars
      const visibleStars = projectedStars.filter((s) => showBelowHorizon || s.horiz.altitude > -2);

      // Draw Constellation Connection Lines
      if (showConstellationLines && nak.lines.length > 0) {
        ctx.save();
        ctx.beginPath();
        nak.lines.forEach(([i1, i2]) => {
          const s1 = projectedStars[i1];
          const s2 = projectedStars[i2];
          if (!s1 || !s2) return;
          if (!showBelowHorizon && (s1.horiz.altitude < -2 || s2.horiz.altitude < -2)) return;

          ctx.moveTo(s1.proj.x, s1.proj.y);
          ctx.lineTo(s2.proj.x, s2.proj.y);
        });

        if (isJanma) {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.9)'; // Radiant Gold for Janma Nakshatra
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#FBBF24';
          ctx.shadowBlur = 10;
        } else if (isSelected) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
          ctx.lineWidth = 2.0;
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
          ctx.lineWidth = 1.0;
          ctx.setLineDash([2, 3]);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Draw Individual Stars of the Nakshatra
      projectedStars.forEach((s) => {
        if (!showBelowHorizon && s.horiz.altitude < -2) return;

        const starRadius = Math.max(1.8, (4.5 - s.mag * 0.5) * Math.sqrt(Math.max(1, zoomLevel * 0.75)));
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.proj.x, s.proj.y, starRadius, 0, Math.PI * 2);

        if (isJanma) {
          ctx.fillStyle = '#FEF08A';
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 12;
        } else if (isSelected) {
          ctx.fillStyle = '#38BDF8';
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = s.color || '#E2E8F0';
          ctx.shadowColor = '#94A3B8';
          ctx.shadowBlur = 4;
        }
        ctx.fill();
        ctx.restore();

        // Hit detection registration
        items.push({
          type: 'nakshatra',
          data: nak,
          x: s.proj.x,
          y: s.proj.y,
          radius: Math.max(14, starRadius + 10),
          alt: s.horiz.altitude,
          az: s.horiz.azimuth
        });
      });

      // Nakshatra Label & Traditional Shape Badge
      if (showNakshatraNames && visibleStars.length > 0) {
        const primary = projectedStars[0];
        if (primary && (showBelowHorizon || primary.horiz.altitude > 0)) {
          ctx.save();
          // Responsive font clamp scaling
          const isSmallScreen = width < 600;
          const baseFontSize = isSmallScreen ? 9 : 10.5;
          const fontPx = Math.max(8, Math.min(14, baseFontSize * Math.sqrt(zoomLevel)));

          ctx.font = isJanma
            ? `bold ${Math.max(10, fontPx + 1.5)}px system-ui, sans-serif`
            : `${fontPx}px system-ui, sans-serif`;
          ctx.textAlign = 'center';

          if (isJanma) {
            ctx.fillStyle = '#FBBF24';
            ctx.shadowColor = '#B45309';
            ctx.shadowBlur = 6;
            ctx.fillText(`✨ ${nak.nameMm} (မွေးနက္ခတ်)`, primary.proj.x, primary.proj.y - (fontPx + 3));
          } else {
            ctx.fillStyle = isSelected ? '#38BDF8' : 'rgba(203, 213, 225, 0.85)';
            if (isSelected) {
              ctx.shadowColor = '#38BDF8';
              ctx.shadowBlur = 8;
            }
            ctx.fillText(nak.nameMm, primary.proj.x, primary.proj.y - (fontPx * 0.9));
          }

          // Progressive disclosure: shape reveals when zoomed in (>= 1.25x) or active
          if (zoomLevel >= 1.25 || isSelected || isJanma) {
            const subFontPx = Math.max(7.5, Math.min(11, fontPx * 0.8));
            ctx.font = `${subFontPx}px system-ui, sans-serif`;
            ctx.fillStyle = isJanma ? 'rgba(253, 224, 71, 0.85)' : 'rgba(148, 163, 184, 0.75)';
            ctx.fillText(nak.shapeMm, primary.proj.x, primary.proj.y + (fontPx * 1.1));
          }
          ctx.restore();
        }
      }
    });

    // 5. DRAW MAJOR NAVIGATIONAL STARS
    if (showStarNames) {
      MAJOR_NAVIGATIONAL_STARS.forEach((star) => {
        const horiz = equatorialToHorizontal(star.raHours, star.decDeg, currentDate, observer);
        if (!showBelowHorizon && horiz.altitude < 0) return;

        const proj = stereographicProject(horiz.altitude, horiz.azimuth, baseRadius, cx, cy, rotationDeg);
        const radius = Math.max(2.2, (5.0 - star.mag * 0.8) * Math.sqrt(Math.max(1, zoomLevel * 0.75)));

        ctx.save();
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.font = '9px system-ui, sans-serif';
        ctx.fillStyle = 'rgba(226, 232, 240, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(star.burmeseName, proj.x, proj.y + 11);
        ctx.restore();

        items.push({
          type: 'star',
          data: star,
          x: proj.x,
          y: proj.y,
          radius: Math.max(14, radius + 8),
          alt: horiz.altitude,
          az: horiz.azimuth
        });
      });
    }

    // 6. DRAW PLANETS, SUN, & MOON
    if (showPlanets) {
      const planets = calculateAllPlanets(currentDate, observer);
      planets.forEach((planet) => {
        if (!showBelowHorizon && planet.horizontal.altitude < -2) return;

        const proj = stereographicProject(
          planet.horizontal.altitude,
          planet.horizontal.azimuth,
          baseRadius,
          cx,
          cy,
          rotationDeg
        );
        const isSelected = selectedTarget?.type === 'planet' && (selectedTarget.data as PlanetData).nameEn === planet.nameEn;
        const radius = Math.max(4.0, (planet.nameEn === 'Sun' || planet.nameEn === 'Moon' ? 8.0 : 5.0) * Math.sqrt(Math.max(1, zoomLevel * 0.75)));

        ctx.save();
        const haloGrad = ctx.createRadialGradient(proj.x, proj.y, radius * 0.5, proj.x, proj.y, radius * 2.5);
        haloGrad.addColorStop(0, planet.color);
        haloGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.shadowColor = planet.color;
        ctx.shadowBlur = isSelected ? 16 : 8;
        ctx.fill();

        ctx.font = 'bold 10px system-ui, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(planet.nameMm, proj.x, proj.y - radius - 4);
        ctx.restore();

        items.push({
          type: 'planet',
          data: planet,
          x: proj.x,
          y: proj.y,
          radius: Math.max(16, radius + 10),
          alt: planet.horizontal.altitude,
          az: planet.horizontal.azimuth
        });
      });
    }

    // 7. DRAW LAGNA (ASCENDANT) MARKER ON EASTERN HORIZON
    if (birthSkyActive && birthLagna) {
      const lagnaHoriz = birthLagna.horizontal;
      const lagnaProj = stereographicProject(0, lagnaHoriz.azimuth, baseRadius, cx, cy, rotationDeg);

      ctx.save();
      ctx.beginPath();
      ctx.arc(lagnaProj.x, lagnaProj.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 16;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(lagnaProj.x, lagnaProj.y, 14, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      const badgeText = `🌅 လဂ် (Lagna) · ${birthLagna.zodiac.nameMm} ${birthLagna.degreeInZodiac.toFixed(1)}°`;
      ctx.font = 'bold 11px system-ui, sans-serif';
      const badgeWidth = ctx.measureText(badgeText).width + 16;
      const badgeHeight = 22;
      const badgeX = lagnaProj.x - badgeWidth / 2;
      const badgeY = lagnaProj.y - 28;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FEF08A';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, lagnaProj.x, badgeY + badgeHeight / 2);
      ctx.restore();

      items.push({
        type: 'lagna',
        data: birthLagna,
        x: lagnaProj.x,
        y: lagnaProj.y,
        radius: 22,
        alt: lagnaHoriz.altitude,
        az: lagnaHoriz.azimuth
      });
    }

    clickableItemsRef.current = items;
    ctx.restore();
  }, [
    currentDate,
    observer,
    showConstellationLines,
    showNakshatraNames,
    showStarNames,
    showPlanets,
    showAltGrid,
    showBelowHorizon,
    selectedTarget,
    rotationDeg,
    zoomLevel,
    panOffset,
    birthSkyActive,
    birthLagna,
    birthJanmaNakshatraId
  ]);

  // -------------------------------------------------------------
  // RESIZE OBSERVER (Dynamic High-DPI Resizing)
  // -------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      renderSky();
    });

    resizeObserver.observe(container);
    renderSky();

    return () => resizeObserver.disconnect();
  }, [renderSky]);

  // -------------------------------------------------------------
  // FULLSCREEN API INTEGRATION & KEYBOARD SHORTCUTS
  // -------------------------------------------------------------
  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
          await (container as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
          await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );
      setIsFullscreen(isFs);
      if (!isFs) {
        setIsZenMode(false);
      }
      setTimeout(renderSky, 60);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [renderSky]);

  // -------------------------------------------------------------
  // PAN, ZOOM & INTERACTION HANDLERS
  // -------------------------------------------------------------
  const handleResetView = useCallback(() => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
    setRotationDeg(0);
  }, []);

  // Keyboard Shortcuts (F = Fullscreen, Z = Zen, R = Reset, + / - = Zoom)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'z' || e.key === 'Z') {
        if (isFullscreen) {
          setIsZenMode((prev) => !prev);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        handleResetView();
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel((z) => Math.min(4.0, Number((z + 0.25).toFixed(2))));
      } else if (e.key === '-' || e.key === '_') {
        setZoomLevel((z) => Math.max(1.0, Number((z - 0.25).toFixed(2))));
      } else if (e.key === '[' || e.key === '{') {
        setRotationDeg((r) => (r - 15 + 360) % 360);
      } else if (e.key === ']' || e.key === '}') {
        setRotationDeg((r) => (r + 15) % 360);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen, isFullscreen, handleResetView]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      dragDistanceRef.current += Math.hypot(deltaX, deltaY);

      const width = rect.width;
      const height = rect.height;
      const cx = width / 2 + panOffset.x;
      const cy = height / 2 + panOffset.y;

      if (zoomLevel <= 1.05 || e.shiftKey) {
        // Dragging rotates the sky dome 360° around the center
        const prevAngle = Math.atan2(dragStart.y - cy, dragStart.x - cx);
        const currAngle = Math.atan2(mouseY - cy, mouseX - cx);
        let angleDiff = ((currAngle - prevAngle) * 180) / Math.PI;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;

        const maxR = Math.max(90, Math.min(width, height) / 2 - 42);
        const distFromCenter = Math.hypot(mouseX - cx, mouseY - cy);
        const linearRot = deltaX * 0.35;
        const effectiveRot = distFromCenter < maxR * 0.35 ? linearRot : angleDiff;

        setRotationDeg((prev) => ((prev + effectiveRot) % 360 + 360) % 360);
      } else {
        // Zoomed in: pan the canvas
        setPanOffset((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }));
      }
      setDragStart({ x: mouseX, y: mouseY });
      return;
    }

    // Hit test detection for hover tooltip
    let found: ClickableItem | null = null;
    for (const item of clickableItemsRef.current) {
      const dist = Math.hypot(mouseX - item.x, mouseY - item.y);
      if (dist <= item.radius) {
        found = item;
        break;
      }
    }

    setHoveredItem(found);
    canvas.style.cursor = found ? 'pointer' : isDragging ? 'grabbing' : 'grab';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setIsDragging(true);
    dragDistanceRef.current = 0;
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    // Suppress click if it was an active drag pan
    if (dragDistanceRef.current > 6) return;

    if (hoveredItem) {
      onSelectTarget({
        type: hoveredItem.type,
        data: hoveredItem.data,
        alt: hoveredItem.alt,
        az: hoveredItem.az
      });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    setZoomLevel((prev) => Math.max(1.0, Math.min(4.0, Number((prev * zoomFactor).toFixed(2)))));
  };

  // Touch Screen Gestures (1-finger Pan/Rotate, 2-finger Pinch-to-Zoom & Twist-to-Rotate)
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    touchMoveTotalRef.current = 0;

    if (e.touches.length === 1) {
      setIsDragging(true);
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      setDragStart({ x, y });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const x1 = e.touches[0].clientX;
      const y1 = e.touches[0].clientY;
      const x2 = e.touches[1].clientX;
      const y2 = e.touches[1].clientY;
      touchStartDistRef.current = Math.hypot(x2 - x1, y2 - y1);
      touchStartZoomRef.current = zoomLevel;
      touchStartAngleRef.current = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (e.touches.length === 1 && isDragging) {
      const mouseX = e.touches[0].clientX - rect.left;
      const mouseY = e.touches[0].clientY - rect.top;
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      touchMoveTotalRef.current += Math.hypot(deltaX, deltaY);

      const width = rect.width;
      const height = rect.height;
      const cx = width / 2 + panOffset.x;
      const cy = height / 2 + panOffset.y;

      if (zoomLevel <= 1.05) {
        // 1-finger swipe rotates at default 1x zoom
        const prevAngle = Math.atan2(dragStart.y - cy, dragStart.x - cx);
        const currAngle = Math.atan2(mouseY - cy, mouseX - cx);
        let angleDiff = ((currAngle - prevAngle) * 180) / Math.PI;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;

        const maxR = Math.max(90, Math.min(width, height) / 2 - 42);
        const distFromCenter = Math.hypot(mouseX - cx, mouseY - cy);
        const linearRot = deltaX * 0.4;
        const effectiveRot = distFromCenter < maxR * 0.35 ? linearRot : angleDiff;

        setRotationDeg((prev) => ((prev + effectiveRot) % 360 + 360) % 360);
      } else {
        // 1-finger drag pans when zoomed in
        setPanOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      }

      setDragStart({ x: mouseX, y: mouseY });
    } else if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      // 2-finger gesture: simultaneous Pinch-to-Zoom AND Twist-to-Rotate!
      const x1 = e.touches[0].clientX;
      const y1 = e.touches[0].clientY;
      const x2 = e.touches[1].clientX;
      const y2 = e.touches[1].clientY;

      // Pinch zoom
      const currentDist = Math.hypot(x2 - x1, y2 - y1);
      const scale = currentDist / touchStartDistRef.current;
      const newZoom = Math.max(1.0, Math.min(4.0, Number((touchStartZoomRef.current * scale).toFixed(2))));
      setZoomLevel(newZoom);

      // Twist rotate
      if (touchStartAngleRef.current !== null) {
        const currentAngle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
        let angleDelta = currentAngle - touchStartAngleRef.current;
        if (angleDelta > 180) angleDelta -= 360;
        if (angleDelta < -180) angleDelta += 360;
        setRotationDeg((prev) => ((prev + angleDelta) % 360 + 360) % 360);
        touchStartAngleRef.current = currentAngle;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) {
      if (touchMoveTotalRef.current < 6 && e.changedTouches.length === 1) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const tapX = e.changedTouches[0].clientX - rect.left;
          const tapY = e.changedTouches[0].clientY - rect.top;
          for (const item of clickableItemsRef.current) {
            const dist = Math.hypot(tapX - item.x, tapY - item.y);
            if (dist <= item.radius + 6) {
              onSelectTarget({
                type: item.type,
                data: item.data,
                alt: item.alt,
                az: item.az
              });
              break;
            }
          }
        }
      }
      setIsDragging(false);
      touchStartDistRef.current = null;
    }
  };

  // Fullscreen HUD Time Slider Change Handler
  const handleTimeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setCurrentDate) return;
    const totalMins = parseInt(e.target.value, 10);
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const newDate = new Date(currentDate);
    newDate.setHours(hours, mins, 0, 0);
    setCurrentDate(newDate);
  };

  const handleCycleSpeed = () => {
    if (!setSpeedMultiplier) return;
    if (speedMultiplier === 1) setSpeedMultiplier(60);
    else if (speedMultiplier === 60) setSpeedMultiplier(3600);
    else if (speedMultiplier === 3600) setSpeedMultiplier(86400);
    else setSpeedMultiplier(1);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[65vh] sm:min-h-[75vh] flex flex-col items-center justify-center select-none overflow-hidden bg-[#050816] ${
        isFullscreen ? 'fixed inset-0 z-50 w-screen h-[100dvh]' : ''
      }`}
    >
      {/* 1. INTERACTIVE HIGH-DPI CANVAS */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setHoveredItem(null);
        }}
        onClick={handleClick}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full block touch-none"
      />

      {/* 2. TOP-RIGHT FLOATING CONTROLS: ZOOM, ROTATION & FULLSCREEN */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 z-30">
        {/* Zoom & Compass Rotation Toolbar */}
        <div className="flex items-center gap-1 bg-[#0b132b]/90 backdrop-blur-md border border-cyan-500/25 px-2 py-1 rounded-xl shadow-lg">
          {/* Zoom Buttons */}
          <button
            onClick={() => setZoomLevel((z) => Math.min(4.0, Number((z + 0.25).toFixed(2))))}
            title="Zoom In (+)"
            className="text-cyan-300 hover:text-white p-1 rounded hover:bg-cyan-500/15 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-cyan-200/80 w-9 text-center font-semibold">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.max(1.0, Number((z - 0.25).toFixed(2))))}
            title="Zoom Out (-)"
            className="text-cyan-300 hover:text-white p-1 rounded hover:bg-cyan-500/15 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-cyan-500/20 mx-0.5" />

          {/* 360° Compass Rotation Controls */}
          <button
            onClick={() => setRotationDeg((r) => (r - 45 + 360) % 360)}
            title="လှည့်မည် (Rotate Left -45°)"
            className="text-sky-300 hover:text-white p-1 rounded hover:bg-cyan-500/15 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setRotationDeg(0)}
            title="North Up (0°) ပြန်ထားမည် (Click to reset North)"
            className="flex items-center gap-1 font-mono text-[11px] text-cyan-300 hover:text-white px-1.5 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 transition-colors"
          >
            <Compass
              className="w-3.5 h-3.5 text-cyan-400 transition-transform duration-200"
              style={{ transform: `rotate(${-rotationDeg}deg)` }}
            />
            <span className="font-semibold">{Math.round(rotationDeg)}°</span>
          </button>

          <button
            onClick={() => setRotationDeg((r) => (r + 45) % 360)}
            title="လှည့်မည် (Rotate Right +45°)"
            className="text-sky-300 hover:text-white p-1 rounded hover:bg-cyan-500/15 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-cyan-500/20 mx-0.5" />

          {/* Reset View Button */}
          <button
            onClick={handleResetView}
            title="Reset Pan, Zoom & Rotation (R)"
            className="text-xs text-amber-300 hover:text-amber-100 p-1 rounded hover:bg-amber-500/15 transition-colors flex items-center gap-1 font-myanmar"
          >
            <span className="text-xs">↺</span>
            <span className="hidden sm:inline text-[11px]">မူလ</span>
          </button>
        </div>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen (Esc or F)" : "Explore Fullscreen (F)"}
          className="bg-gradient-to-r from-cyan-600/90 to-indigo-600/90 hover:from-cyan-500 hover:to-indigo-500 text-white p-2 sm:px-3 sm:py-2 rounded-xl border border-cyan-400/40 shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all text-xs font-semibold"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span className="hidden sm:inline font-myanmar">
            {isFullscreen ? "ထွက်မည်" : "မျက်နှာပြင်ပြည့် (F)"}
          </span>
        </button>
      </div>

      {/* 3. MINIMALIST FLOATING HUD IN FULLSCREEN MODE */}
      {isFullscreen && (
        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-auto max-w-[96vw] ${
            isZenMode
              ? 'opacity-0 pointer-events-none translate-y-6'
              : 'opacity-100 pointer-events-auto translate-y-0'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-5 bg-[#070d1e]/90 backdrop-blur-xl border border-cyan-500/30 px-4 py-2.5 rounded-2xl shadow-2xl text-slate-200">
            {/* Play/Pause & Location Readout */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsPlaying?.(!isPlaying)}
                title={isPlaying ? "ခေတ္တရပ်တန့်မည် (Pause)" : "အချိန်ရွေ့လျားမည် (Play)"}
                className="w-8 h-8 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 flex items-center justify-center transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={handleCycleSpeed}
                title="Change speed multiplier"
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold hover:bg-cyan-900 transition-colors"
              >
                {speedMultiplier === 1 ? '1x' : speedMultiplier === 60 ? '60x' : speedMultiplier === 3600 ? '1h/s' : '1d/s'}
              </button>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-xs font-myanmar font-semibold text-white">
                  <span className="text-cyan-400">📍</span>
                  <span>{observer.nameMm}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ({observer.latitude.toFixed(1)}°N)
                  </span>
                </div>
                <div className="text-[10px] font-mono text-cyan-300/80">
                  {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Compact 24h Time Scrubber Slider */}
            <div className="flex items-center gap-2 min-w-[140px] sm:min-w-[200px]">
              <input
                type="range"
                min="0"
                max="1439"
                value={currentDate.getHours() * 60 + currentDate.getMinutes()}
                onChange={handleTimeSliderChange}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                title="၂၄ နာရီ ကောင်းကင်ယံ အချိန်ရွေ့လျားရန် ဆွဲယူပါ"
              />
            </div>

            {/* Quick Layer Toggles */}
            <div className="flex items-center gap-1.5 text-xs font-myanmar">
              <button
                onClick={() => setShowConstellationLines?.(!showConstellationLines)}
                className={`px-2 py-1 rounded-lg border text-[11px] transition-colors ${
                  showConstellationLines
                    ? 'bg-cyan-950/80 border-cyan-400/50 text-cyan-200'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400'
                }`}
                title="နက္ခတ်ဆက်ကြောင်းများ ဖွင့်/ပိတ်"
              >
                ဆက်ကြောင်း
              </button>

              <button
                onClick={() => setShowNakshatraNames?.(!showNakshatraNames)}
                className={`px-2 py-1 rounded-lg border text-[11px] transition-colors ${
                  showNakshatraNames
                    ? 'bg-cyan-950/80 border-cyan-400/50 text-cyan-200'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400'
                }`}
                title="နက္ခတ်အမည်များ ဖွင့်/ပိတ်"
              >
                နက္ခတ်
              </button>

              <button
                onClick={() => setShowBelowHorizon?.(!showBelowHorizon)}
                className={`px-2 py-1 rounded-lg border text-[11px] transition-colors ${
                  showBelowHorizon
                    ? 'bg-amber-950/80 border-amber-400/50 text-amber-200'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400'
                }`}
                title="မိုးကုတ်စက်ဝိုင်းအောက် X-Ray ဖွင့်/ပိတ်"
              >
                X-Ray
              </button>
            </div>

            {/* Compass Rotation Controls in Fullscreen HUD */}
            <div className="flex items-center gap-1 border-l border-cyan-500/20 pl-2">
              <button
                onClick={() => setRotationDeg((r) => (r - 45 + 360) % 360)}
                title="လှည့်မည် (Rotate Left -45°)"
                className="text-sky-300 hover:text-white p-1 rounded hover:bg-cyan-500/15 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setRotationDeg(0)}
                title="North Up (0°) ပြန်ထားမည် (Click to reset North)"
                className="flex items-center gap-1 font-mono text-[11px] text-cyan-300 hover:text-white px-1.5 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 transition-colors"
              >
                <Compass
                  className="w-3.5 h-3.5 text-cyan-400 transition-transform duration-200"
                  style={{ transform: `rotate(${-rotationDeg}deg)` }}
                />
                <span className="font-semibold">{Math.round(rotationDeg)}°</span>
              </button>
              <button
                onClick={() => setRotationDeg((r) => (r + 45) % 360)}
                title="လှည့်မည် (Rotate Right +45°)"
                className="text-sky-300 hover:text-white p-1 rounded hover:bg-cyan-500/15 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Zen Mode Toggle & Exit Button */}
            <div className="flex items-center gap-1.5 border-l border-cyan-500/20 pl-2">
              <button
                onClick={() => setIsZenMode(true)}
                title="Zen Mode (Hide HUD) [Z]"
                className="px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-400/30 text-indigo-200 text-xs flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden md:inline font-myanmar text-[11px]">Zen Mode</span>
              </button>

              <button
                onClick={toggleFullscreen}
                title="Exit Fullscreen (Esc or F)"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ZEN MODE RESTORE PILL */}
      {isFullscreen && isZenMode && (
        <button
          onClick={() => setIsZenMode(false)}
          title="Show HUD (Press Z)"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#070d1e]/80 hover:bg-[#070d1e]/95 backdrop-blur-md border border-cyan-500/30 text-cyan-200 px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-xl transition-all hover:scale-105 font-myanmar"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>HUD ပြန်ဖွင့်မည် (Z)</span>
        </button>
      )}

      {/* 5. FULLSCREEN SLEEK GLASSMORPHISM SIDE DRAWER */}
      {isFullscreen && selectedTarget && (
        <div className="absolute top-16 right-4 bottom-24 w-80 sm:w-96 max-w-[calc(100vw-32px)] bg-[#0b132b]/95 backdrop-blur-2xl border border-cyan-400/40 rounded-3xl p-5 shadow-2xl text-slate-100 flex flex-col gap-3.5 z-40 overflow-y-auto animate-fade-in">
          {/* Drawer Header */}
          <div className="flex items-start justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                {selectedTarget.type === 'nakshatra'
                  ? `မြန်မာ့နက္ခတ် ၂၇ လုံး (အမှတ် ${(selectedTarget.data as Nakshatra).id})`
                  : selectedTarget.type === 'planet'
                  ? 'ဂြိုဟ်မင်း (Celestial Planet)'
                  : selectedTarget.type === 'lagna'
                  ? '🌅 လဂ် (Lagna / Ascendant)'
                  : 'အထင်ရှားဆုံးကြယ် (Navigational Star)'}
              </span>
              <h2 className="text-xl font-bold font-myanmar text-white mt-0.5 flex items-center gap-1.5">
                {selectedTarget.type === 'nakshatra' && (selectedTarget.data as Nakshatra).nameMm}
                {selectedTarget.type === 'planet' && (selectedTarget.data as PlanetData).nameMm}
                {selectedTarget.type === 'star' && (selectedTarget.data as CelestialStar).burmeseName}
                {selectedTarget.type === 'lagna' && `${(selectedTarget.data as LagnaData).zodiac.nameMm} လဂ်`}
                <span className="text-xs font-normal text-slate-400 font-sans">
                  {selectedTarget.type === 'nakshatra' && `(${(selectedTarget.data as Nakshatra).nameEn})`}
                  {selectedTarget.type === 'planet' && `(${(selectedTarget.data as PlanetData).nameEn})`}
                  {selectedTarget.type === 'star' && `(${(selectedTarget.data as CelestialStar).name})`}
                  {selectedTarget.type === 'lagna' && `(${(selectedTarget.data as LagnaData).zodiac.nameEn})`}
                </span>
              </h2>
            </div>
            <button
              onClick={() => onSelectTarget(null)}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              title="Close (ပိတ်မည်)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Coordinate Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">အမြင့်ထောင့် (Altitude)</span>
              <span className="font-mono font-semibold text-cyan-300">{selectedTarget.alt.toFixed(2)}°</span>
            </div>
            <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">ဆုံမှတ်ထောင့် (Azimuth)</span>
              <span className="font-mono font-semibold text-sky-300">{selectedTarget.az.toFixed(2)}°</span>
            </div>

            {selectedTarget.type === 'nakshatra' && (
              <>
                <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ပုံသဏ္ဌာန်</span>
                  <span className="font-myanmar font-semibold text-amber-300">{(selectedTarget.data as Nakshatra).shapeMm}</span>
                </div>
                <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ရာသီခွင်</span>
                  <span className="font-myanmar font-semibold text-purple-300">{(selectedTarget.data as Nakshatra).zodiacMm}</span>
                </div>
                <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">စိုးမိုးဂြိုဟ်</span>
                  <span className="font-myanmar font-semibold text-emerald-300">{(selectedTarget.data as Nakshatra).planetRulerMm}</span>
                </div>
                <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ကြယ်လုံးရေ</span>
                  <span className="font-mono font-semibold text-slate-200">{(selectedTarget.data as Nakshatra).starCount} လုံး</span>
                </div>
              </>
            )}

            {selectedTarget.type === 'planet' && (
              <>
                <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">အလင်းပမာဏ (Mag)</span>
                  <span className="font-mono font-semibold text-amber-300">{(selectedTarget.data as PlanetData).magnitude.toFixed(2)}</span>
                </div>
                <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">အကွာအဝေး</span>
                  <span className="font-mono font-semibold text-cyan-300">{((selectedTarget.data as PlanetData).equatorial.distanceAu ?? 1.0).toFixed(3)} AU</span>
                </div>
                <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800 col-span-2">
                  <span className="text-slate-400 block text-[10px]">ဖြတ်သန်းရာ ရာသီခွင် &amp; နက္ခတ်</span>
                  <span className="font-myanmar font-semibold text-purple-300">
                    {(selectedTarget.data as PlanetData).currentZodiac.nameMm} · {(selectedTarget.data as PlanetData).currentNakshatra.nameMm}
                  </span>
                </div>
              </>
            )}

            {selectedTarget.type === 'lagna' && (
              <>
                <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ရာသီအတွင်း ဒီဂရီ</span>
                  <span className="font-mono font-semibold text-amber-300">{(selectedTarget.data as LagnaData).degreeInZodiac.toFixed(2)}°</span>
                </div>
                <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">အရှေ့ထွက်နက္ခတ်</span>
                  <span className="font-myanmar font-semibold text-purple-300">{(selectedTarget.data as LagnaData).nakshatra.nameMm} (ပါဒ် {(selectedTarget.data as LagnaData).pada})</span>
                </div>
              </>
            )}

            {selectedTarget.type === 'star' && (
              <>
                <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">အလင်းပမာဏ (Mag)</span>
                  <span className="font-mono font-semibold text-amber-300">{(selectedTarget.data as CelestialStar).mag.toFixed(2)}</span>
                </div>
                <div className="bg-[#070d1e] p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ရောင်စဉ်အမျိုးအစား</span>
                  <span className="font-mono font-semibold text-cyan-300">{(selectedTarget.data as CelestialStar).spectralType || 'Star'}</span>
                </div>
              </>
            )}
          </div>

          {/* Cultural Lore & Astrological Text */}
          {selectedTarget.type === 'nakshatra' && (
            <div className="bg-[#070d1e]/90 p-3 rounded-2xl border border-cyan-500/20 text-xs leading-relaxed text-slate-300 font-myanmar">
              {(selectedTarget.data as Nakshatra).descriptionMm}
            </div>
          )}

          {selectedTarget.type === 'planet' && (
            <div className="bg-[#070d1e]/90 p-3 rounded-2xl border border-cyan-500/20 text-xs leading-relaxed text-slate-300 font-myanmar">
              {(selectedTarget.data as PlanetData).infoMm}
            </div>
          )}

          {selectedTarget.type === 'lagna' && (
            <div className="bg-[#070d1e]/90 p-3 rounded-2xl border border-cyan-500/20 text-xs leading-relaxed text-slate-300 font-myanmar">
              မွေးဖွားချိန်၌ အရှေ့မိုးကုတ်စက်ဝိုင်းပေါ်မှ တက်ဆန်းလာသော ကောင်းကင်ရာသီ ဖြစ်သည်။ ဇာတာရှင်၏ စရိုက်လက္ခဏာနှင့် ရုပ်ပိုင်းဆိုင်ရာ ဦးဆောင်မှုကို ဖော်ပြသည်။
            </div>
          )}

          <button
            onClick={() => onSelectTarget(null)}
            className="w-full mt-1 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/30 py-2 rounded-xl text-xs font-myanmar text-cyan-200 transition-colors"
          >
            အသေးစိတ် ပိတ်မည်
          </button>
        </div>
      )}

      {/* 6. HOVER TOOLTIP CARD (When not in dragging mode) */}
      {hoveredItem && !isDragging && (
        <div
          className="pointer-events-none absolute z-30 px-3 py-2 rounded-xl bg-[#0b132b]/95 border border-cyan-400/40 backdrop-blur-md shadow-2xl text-xs"
          style={{
            left: Math.min(window.innerWidth - 180, Math.max(10, hoveredItem.x + 15)),
            top: Math.min(window.innerHeight - 100, Math.max(10, hoveredItem.y - 45))
          }}
        >
          <div className="font-bold text-cyan-300 font-myanmar">
            {hoveredItem.type === 'lagna'
              ? `🌅 ${(hoveredItem.data as LagnaData).zodiac.nameMm} လဂ် (Lagna / Ascendant)`
              : hoveredItem.type === 'nakshatra'
              ? `${(hoveredItem.data as Nakshatra).nameMm} (${(hoveredItem.data as Nakshatra).nameEn})`
              : hoveredItem.type === 'planet'
              ? (hoveredItem.data as PlanetData).nameMm
              : (hoveredItem.data as CelestialStar).burmeseName}
          </div>
          <div className="text-[11px] text-gray-300 font-mono flex gap-2 mt-0.5">
            <span>Alt: {hoveredItem.alt.toFixed(1)}°</span>
            <span>Az: {hoveredItem.az.toFixed(1)}°</span>
          </div>
          <div className="text-[10px] text-amber-300/80 mt-0.5 font-myanmar">
            {hoveredItem.type === 'lagna'
              ? `အရှေ့ထွက်: ${(hoveredItem.data as LagnaData).nakshatra.nameMm} (ပါဒ် ${(hoveredItem.data as LagnaData).pada})`
              : hoveredItem.type === 'nakshatra'
              ? (hoveredItem.data as Nakshatra).shapeMm
              : hoveredItem.type === 'planet'
              ? `Mag: ${(hoveredItem.data as PlanetData).magnitude.toFixed(1)}`
              : `Mag: ${(hoveredItem.data as CelestialStar).mag.toFixed(2)}`}
          </div>
        </div>
      )}
    </div>
  );
}
