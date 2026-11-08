'use client';

import React, { useState, useEffect, useRef } from 'react';
import SkyCanvas, { SelectedTarget } from '@/components/SkyCanvas';
import ControlPanel from '@/components/ControlPanel';
import MoonTransitBanner from '@/components/MoonTransitBanner';
import NakshatraDetailModal from '@/components/NakshatraDetailModal';
import ApodModal from '@/components/ApodModal';
import BirthSkyModal from '@/components/BirthSkyModal';
import { MYANMAR_CITIES, ObserverLocation, BirthSkyData } from '@/lib/astronomy';
import { cosmicAudio } from '@/lib/audio';

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date('2026-11-08T00:00:00Z'));
  const [observer, setObserver] = useState<ObserverLocation>(MYANMAR_CITIES[0]); // Default Yangon

  // Birth Sky State
  const [isBirthSkyOpen, setIsBirthSkyOpen] = useState<boolean>(false);
  const [birthSkyActive, setBirthSkyActive] = useState<boolean>(false);
  const [birthData, setBirthData] = useState<BirthSkyData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentDate(new Date());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Layer Visibility
  const [showConstellationLines, setShowConstellationLines] = useState<boolean>(true);
  const [showNakshatraNames, setShowNakshatraNames] = useState<boolean>(true);
  const [showStarNames, setShowStarNames] = useState<boolean>(true);
  const [showPlanets, setShowPlanets] = useState<boolean>(true);
  const [showAltGrid, setShowAltGrid] = useState<boolean>(true);
  const [showBelowHorizon, setShowBelowHorizon] = useState<boolean>(false);

  // Time-Travel Animation
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(60); // 60x default (1 min / sec)

  // Selection & Modals
  const [selectedTarget, setSelectedTarget] = useState<SelectedTarget | null>(null);
  const [isApodOpen, setIsApodOpen] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const lastAnimTimeRef = useRef<number | null>(null);

  // Apply Birth Sky Moment
  const handleApplyBirthSky = (data: BirthSkyData) => {
    setBirthData(data);
    setBirthSkyActive(true);
    setCurrentDate(data.birthDate);
    setObserver(data.observer);
    setIsPlaying(false); // Pause animation so user can inspect birth moment

    // Focus on Eastern Horizon Lagna
    setSelectedTarget({
      type: 'lagna',
      data: data.lagna,
      alt: data.lagna.horizontal.altitude,
      az: data.lagna.horizontal.azimuth
    });
  };

  const handleResetBirthSky = () => {
    setBirthSkyActive(false);
    setBirthData(null);
    setCurrentDate(new Date());
    setSelectedTarget(null);
  };

  // Animation Loop for Time Travel
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      if (lastAnimTimeRef.current !== null && isPlaying) {
        const deltaMs = now - lastAnimTimeRef.current;
        const advanceMs = deltaMs * speedMultiplier;
        setCurrentDate((prev) => new Date(prev.getTime() + advanceMs));
      }
      lastAnimTimeRef.current = now;
      if (isPlaying) {
        animId = requestAnimationFrame(tick);
      }
    };

    if (isPlaying) {
      lastAnimTimeRef.current = performance.now();
      animId = requestAnimationFrame(tick);
    } else {
      lastAnimTimeRef.current = null;
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, speedMultiplier]);

  // Audio Toggle
  const handleToggleAudio = () => {
    const running = cosmicAudio.toggle();
    setIsAudioPlaying(running);
  };

  // Screenshot Export
  const handleExportSkyChart = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `NakshatraMM-SkyChart-${observer.nameEn}-${currentDate.toISOString().replace(/[:.]/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <main className="flex-1 flex flex-col h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#050816]">
      {/* 1. TOP HEADER & TELEMETRY BAR */}
      <header className="h-16 border-b border-cyan-500/20 bg-[#070d1e]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-amber-400 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#070d1e] rounded-2xl flex items-center justify-center text-xl">
              ✨
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-amber-300 bg-clip-text text-transparent">
                NakshatraMM
              </h1>
              <span className="font-myanmar font-semibold text-xs sm:text-sm text-cyan-200/90">
                (နက္ခတ်မြန်မာ)
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-myanmar hidden sm:block">
              မြန်မာ့ရိုးရာ နက္ခတ် ၂၇ လုံး နှင့် NASA အာကာသ ကောင်းကင်ပြက္ခဒိန်
            </p>
          </div>
        </div>

        {/* Center / Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Observer Location Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-[#0b132b] border border-cyan-500/20 px-3 py-1 rounded-xl text-xs">
            <span className="text-cyan-400">📍</span>
            <span className="font-myanmar font-semibold text-white">{observer.nameMm}</span>
            <span className="font-mono text-[11px] text-slate-400">
              ({observer.latitude.toFixed(2)}°N, {observer.longitude.toFixed(2)}°E)
            </span>
          </div>

          {/* Active Birth Sky Indicator Pill */}
          {birthSkyActive && birthData ? (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/90 to-purple-950/90 border border-amber-500/50 text-amber-200 px-3 py-1 rounded-xl text-xs font-myanmar shadow-lg shadow-amber-500/20">
              <span>✨</span>
              <span className="font-bold">{birthData.lagna.zodiac.nameMm} လဂ်</span>
              <span className="text-slate-400">·</span>
              <span>{birthData.janmaNakshatra.nakshatra.nameMm}</span>
              <button
                onClick={handleResetBirthSky}
                title="ယနေ့အချိန်သို့ ပြန်လည်ထားမည် (Reset)"
                className="ml-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          ) : (
            /* Launch Birth Sky Modal Button */
            <button
              onClick={() => setIsBirthSkyOpen(true)}
              className="bg-gradient-to-r from-amber-500/90 via-orange-500/90 to-cyan-500/90 hover:from-amber-400 hover:to-cyan-400 text-black font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 font-myanmar"
            >
              <span>☸️</span>
              <span className="hidden sm:inline">မွေးနက္ခတ် &amp; လဂ်</span>
            </button>
          )}

          {/* Screenshot / Export Sky Chart */}
          <button
            onClick={handleExportSkyChart}
            title="Export High-Resolution Sky Chart PNG"
            className="bg-[#0b132b] hover:bg-[#162238] border border-slate-700 hover:border-cyan-500/40 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <span>📸</span>
            <span className="hidden md:inline font-myanmar">ပုံထုတ်ယူမည်</span>
          </button>

          {/* Sidebar Toggle for Mobile / Tablets */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden bg-[#0b132b] border border-cyan-500/30 text-cyan-300 p-2 rounded-xl text-sm"
          >
            {isSidebarOpen ? '✕' : '⚙️'}
          </button>
        </div>
      </header>

      {/* 2. SUB-HEADER: MOON TRANSIT BANNER (စန်းယှဉ်နက္ခတ်) */}
      <div className="px-3 sm:px-6 py-2 shrink-0 z-10 bg-[#050816]">
        <MoonTransitBanner currentDate={currentDate} onSelectNakshatra={setSelectedTarget} />
      </div>

      {/* 3. MAIN WORKSPACE: SKY DOME & CONTROLS */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden min-h-0">
        {/* Interactive Sky Canvas */}
        <div className="flex-1 relative h-full w-full min-h-[65vh] sm:min-h-[75vh] flex items-center justify-center">
          <SkyCanvas
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            observer={observer}
            setObserver={setObserver}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            speedMultiplier={speedMultiplier}
            setSpeedMultiplier={setSpeedMultiplier}
            showConstellationLines={showConstellationLines}
            setShowConstellationLines={setShowConstellationLines}
            showNakshatraNames={showNakshatraNames}
            setShowNakshatraNames={setShowNakshatraNames}
            showStarNames={showStarNames}
            setShowStarNames={setShowStarNames}
            showPlanets={showPlanets}
            setShowPlanets={setShowPlanets}
            showAltGrid={showAltGrid}
            setShowAltGrid={setShowAltGrid}
            showBelowHorizon={showBelowHorizon}
            setShowBelowHorizon={setShowBelowHorizon}
            onSelectTarget={setSelectedTarget}
            selectedTarget={selectedTarget}
            birthSkyActive={birthSkyActive}
            birthLagna={birthData?.lagna}
            birthJanmaNakshatraId={birthData?.janmaNakshatra.nakshatra.id}
          />
        </div>

        {/* Collapsible Controls Sidebar */}
        <div
          className={`fixed lg:relative top-0 right-0 h-full w-80 sm:w-96 bg-[#070d1e]/95 lg:bg-[#070d1e]/85 backdrop-blur-xl border-l border-cyan-500/20 p-4 overflow-y-auto transition-transform duration-300 z-30 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          <ControlPanel
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            observer={observer}
            setObserver={setObserver}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            speedMultiplier={speedMultiplier}
            setSpeedMultiplier={setSpeedMultiplier}
            showConstellationLines={showConstellationLines}
            setShowConstellationLines={setShowConstellationLines}
            showNakshatraNames={showNakshatraNames}
            setShowNakshatraNames={setShowNakshatraNames}
            showStarNames={showStarNames}
            setShowStarNames={setShowStarNames}
            showPlanets={showPlanets}
            setShowPlanets={setShowPlanets}
            showAltGrid={showAltGrid}
            setShowAltGrid={setShowAltGrid}
            showBelowHorizon={showBelowHorizon}
            setShowBelowHorizon={setShowBelowHorizon}
            onSelectTarget={setSelectedTarget}
            onOpenApod={() => setIsApodOpen(true)}
            onOpenSoundToggle={handleToggleAudio}
            isAudioPlaying={isAudioPlaying}
            onOpenBirthSky={() => setIsBirthSkyOpen(true)}
            birthSkyActive={birthSkyActive}
            onResetBirthSky={handleResetBirthSky}
          />
        </div>
      </div>

      {/* 4. MODALS */}
      <NakshatraDetailModal target={selectedTarget} onClose={() => setSelectedTarget(null)} />
      <ApodModal isOpen={isApodOpen} onClose={() => setIsApodOpen(false)} />
      <BirthSkyModal
        isOpen={isBirthSkyOpen}
        onClose={() => setIsBirthSkyOpen(false)}
        onApplyBirthSky={handleApplyBirthSky}
        currentObserver={observer}
      />
    </main>
  );
}
