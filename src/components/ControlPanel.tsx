'use client';

import React, { useState } from 'react';
import { ObserverLocation, MYANMAR_CITIES } from '@/lib/astronomy';
import { BURMESE_NAKSHATRAS } from '@/data/nakshatras';
import { SelectedTarget } from './SkyCanvas';

interface ControlPanelProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  observer: ObserverLocation;
  setObserver: (obs: ObserverLocation) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speedMultiplier: number;
  setSpeedMultiplier: (spd: number) => void;
  showConstellationLines: boolean;
  setShowConstellationLines: (v: boolean) => void;
  showNakshatraNames: boolean;
  setShowNakshatraNames: (v: boolean) => void;
  showStarNames: boolean;
  setShowStarNames: (v: boolean) => void;
  showPlanets: boolean;
  setShowPlanets: (v: boolean) => void;
  showAltGrid: boolean;
  setShowAltGrid: (v: boolean) => void;
  showBelowHorizon: boolean;
  setShowBelowHorizon: (v: boolean) => void;
  onSelectTarget: (target: SelectedTarget | null) => void;
  onOpenApod: () => void;
  onOpenSoundToggle: () => void;
  isAudioPlaying: boolean;
  onOpenBirthSky: () => void;
  birthSkyActive?: boolean;
  onResetBirthSky?: () => void;
}

export default function ControlPanel({
  currentDate,
  setCurrentDate,
  observer,
  setObserver,
  isPlaying,
  setIsPlaying,
  speedMultiplier,
  setSpeedMultiplier,
  showConstellationLines,
  setShowConstellationLines,
  showNakshatraNames,
  setShowNakshatraNames,
  showStarNames,
  setShowStarNames,
  showPlanets,
  setShowPlanets,
  showAltGrid,
  setShowAltGrid,
  showBelowHorizon,
  setShowBelowHorizon,
  onSelectTarget,
  onOpenApod,
  onOpenSoundToggle,
  isAudioPlaying,
  onOpenBirthSky,
  birthSkyActive = false,
  onResetBirthSky
}: ControlPanelProps) {
  const [isCustomLoc, setIsCustomLoc] = useState(false);
  const [customLat, setCustomLat] = useState(observer.latitude.toString());
  const [customLon, setCustomLon] = useState(observer.longitude.toString());
  const [searchQuery, setSearchQuery] = useState('');

  // Handle GPS location
  const handleUseGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setObserver({
            nameMm: 'ငါ့တည်နေရာ (GPS)',
            nameEn: 'My GPS Location',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            elevation: pos.coords.altitude || 10
          });
          setIsCustomLoc(false);
        },
        (err) => {
          alert(`GPS ရယူ၍မရပါ: ${err.message}`);
        }
      );
    } else {
      alert('သင်၏ Browser တွင် GPS မထောက်ပံ့ပါ');
    }
  };

  const handleApplyCustomLoc = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (!isNaN(lat) && !isNaN(lon)) {
      setObserver({
        nameMm: `စိတ်ကြိုက် (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
        nameEn: `Custom Location`,
        latitude: lat,
        longitude: lon,
        elevation: 10
      });
    }
  };

  // Convert Date to Local String (YYYY-MM-DDTHH:mm)
  const formatDateTimeLocal = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // 24-hour scrubber: seconds from start of local day
  const secondsInDay =
    currentDate.getHours() * 3600 +
    currentDate.getMinutes() * 60 +
    currentDate.getSeconds();

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const totalSec = parseInt(e.target.value, 10);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    const newDate = new Date(currentDate);
    newDate.setHours(hours, minutes, seconds);
    setCurrentDate(newDate);
  };

  // Filtered search results for Nakshatras & Zodiac
  const filteredNakshatras = searchQuery.trim()
    ? BURMESE_NAKSHATRAS.filter(
        (n) =>
          n.nameMm.includes(searchQuery) ||
          n.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.shapeMm.includes(searchQuery)
      )
    : [];

  return (
    <div className="flex flex-col gap-4 text-slate-200">
      {/* 0. BIRTH SKY & JANMA NAKSHATRA FINDER CARD */}
      <div className={`p-4 rounded-2xl border transition-all shadow-xl ${
        birthSkyActive
          ? 'bg-gradient-to-r from-amber-950/80 via-purple-950/70 to-blue-950/80 border-amber-500/50'
          : 'bg-gradient-to-r from-[#131b38] to-[#0c1228] border-cyan-500/30'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">☸️</span>
            <div>
              <span className="text-xs font-bold text-amber-300 font-myanmar block">
                {birthSkyActive ? 'မွေးဖွားချိန် ကောင်းကင်ယံ ဖွင့်ထားသည်' : 'မွေးနက္ခတ် & လဂ် ရှာဖွေစက်'}
              </span>
              <span className="text-[10px] text-slate-400 font-sans">
                {birthSkyActive ? 'Birth Sky Active' : 'Birth Sky & Lagna Finder'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 font-myanmar leading-relaxed mb-3">
          {birthSkyActive
            ? 'မွေးဖွားချိန် မွေးနက္ခတ် (ရွှေရောင်) နှင့် အရှေ့မိုးကုတ်စက်ဝိုင်းရှိ လဂ် (ပန်းနီရောင်) ကို ကောင်းကင်ယံတွင် အထူးပြုပြသထားပါသည်။'
            : 'မိမိ မွေးနေ့၊ မွေးချိန် နှင့် မွေးဖွားရာ မြို့ကို ထည့်သွင်းကာ မွေးနက္ခတ် နှင့် အရှေ့ထွက် လဂ် ကို ချက်ချင်း ကြည့်ရှုပါ။'}
        </p>

        <div className="flex gap-2">
          <button
            onClick={onOpenBirthSky}
            className="flex-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs py-2 px-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all font-myanmar flex items-center justify-center gap-1.5"
          >
            <span>✨</span>
            <span>{birthSkyActive ? 'မွေးဖွားချိန် ပြင်ဆင်မည်' : 'မွေးနက္ခတ် တွက်ချက်မည်'}</span>
          </button>

          {birthSkyActive && onResetBirthSky && (
            <button
              onClick={onResetBirthSky}
              title="Reset to current live time"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 font-myanmar"
            >
              ယနေ့သို့
            </button>
          )}
        </div>
      </div>

      {/* 1. LOCATION CONTROLS */}
      <div className="bg-[#0b132b]/80 backdrop-blur-md p-4 rounded-2xl border border-cyan-500/20 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            တည်နေရာ (Observer Location)
          </span>
          <button
            onClick={handleUseGps}
            className="text-[11px] text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-700/50 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
          >
            <span>📡</span> GPS အသုံးပြုမည်
          </button>
        </div>

        {/* City Select Dropdown */}
        <div className="grid grid-cols-1 gap-2">
          <select
            value={isCustomLoc ? 'custom' : observer.nameEn}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'custom') {
                setIsCustomLoc(true);
              } else {
                setIsCustomLoc(false);
                const city = MYANMAR_CITIES.find((c) => c.nameEn === val);
                if (city) setObserver(city);
              }
            }}
            className="bg-[#070d1e] text-slate-200 border border-cyan-500/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-400 font-myanmar"
          >
            {MYANMAR_CITIES.map((c) => (
              <option key={c.nameEn} value={c.nameEn}>
                {c.nameMm} ({c.nameEn}) — {c.latitude}°N, {c.longitude}°E
              </option>
            ))}
            <option value="custom">✍️ အခြား (စိတ်ကြိုက် လတ္တီတွဒ်/လောင်ဂျီတွဒ်)...</option>
          </select>

          {/* Custom Lat/Lon Drawer */}
          {isCustomLoc && (
            <form onSubmit={handleApplyCustomLoc} className="flex gap-2 items-center mt-1">
              <input
                type="number"
                step="0.0001"
                placeholder="Latitude"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                className="w-1/2 bg-[#070d1e] border border-cyan-500/30 rounded-lg px-2.5 py-1 text-xs text-white"
              />
              <input
                type="number"
                step="0.0001"
                placeholder="Longitude"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                className="w-1/2 bg-[#070d1e] border border-cyan-500/30 rounded-lg px-2.5 py-1 text-xs text-white"
              />
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 py-1 rounded-lg"
              >
                Apply
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 2. TIME-TRAVEL ENGINE & TIME-SCRUBBER */}
      <div className="bg-[#0b132b]/80 backdrop-blur-md p-4 rounded-2xl border border-cyan-500/20 shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            အချိန်ခရီးသွား (Time-Travel Engine)
          </span>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-[11px] text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-900 border border-amber-700/50 px-2 py-0.5 rounded-lg transition-all font-myanmar"
          >
            ယခုအချိန် (Now)
          </button>
        </div>

        {/* Date-Time Picker */}
        <input
          type="datetime-local"
          value={formatDateTimeLocal(currentDate)}
          onChange={(e) => {
            const d = new Date(e.target.value);
            if (!isNaN(d.getTime())) setCurrentDate(d);
          }}
          className="bg-[#070d1e] border border-amber-500/30 text-amber-100 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-amber-400"
        />

        {/* 24-Hour Scrubber Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>00:00</span>
            <span className="text-amber-300 font-bold">
              {currentDate.toLocaleTimeString('my-MM', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span>23:59</span>
          </div>
          <input
            type="range"
            min={0}
            max={86399}
            value={secondsInDay}
            onChange={handleScrubberChange}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Animation Play/Pause & Speed Multiplier Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'bg-[#162238] hover:bg-[#1f304f] text-slate-200 border border-slate-700'
            }`}
          >
            <span>{isPlaying ? '⏸' : '▶'}</span>
            <span className="font-myanmar">{isPlaying ? 'ရပ်မည် (Pause)' : 'လည်ပတ်မည် (Play)'}</span>
          </button>

          {/* Speed Buttons */}
          <div className="flex gap-1 bg-[#070d1e] p-1 rounded-xl border border-slate-800">
            {[
              { label: '1x', val: 1 },
              { label: '60x', val: 60 },
              { label: '1h/s', val: 3600 },
              { label: '1d/s', val: 86400 }
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => setSpeedMultiplier(s.val)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-colors ${
                  speedMultiplier === s.val
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. DISPLAY TOGGLES */}
      <div className="bg-[#0b132b]/80 backdrop-blur-md p-4 rounded-2xl border border-cyan-500/20 shadow-xl flex flex-col gap-2.5">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
          ပြသမှု ချိန်ညှိချက်များ (Layers)
        </span>

        <label className="flex items-center justify-between text-xs cursor-pointer hover:text-white transition-colors">
          <span className="font-myanmar">နက္ခတ်ဆက်ကြောင်းများ (Constellation Lines)</span>
          <input
            type="checkbox"
            checked={showConstellationLines}
            onChange={(e) => setShowConstellationLines(e.target.checked)}
            className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-xs cursor-pointer hover:text-white transition-colors">
          <span className="font-myanmar">နက္ခတ်အမည်များ (Burmese Nakshatras)</span>
          <input
            type="checkbox"
            checked={showNakshatraNames}
            onChange={(e) => setShowNakshatraNames(e.target.checked)}
            className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-xs cursor-pointer hover:text-white transition-colors">
          <span className="font-myanmar">ပင်မကြယ်ကြီးများ (Major Stars)</span>
          <input
            type="checkbox"
            checked={showStarNames}
            onChange={(e) => setShowStarNames(e.target.checked)}
            className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-xs cursor-pointer hover:text-white transition-colors">
          <span className="font-myanmar">ဂြိုဟ်မင်းများ (Planets & Moon)</span>
          <input
            type="checkbox"
            checked={showPlanets}
            onChange={(e) => setShowPlanets(e.target.checked)}
            className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-xs cursor-pointer hover:text-white transition-colors">
          <span className="font-myanmar">ကောင်းကင်စက်ဝိုင်းကွန်ရက် (Altitude Grid)</span>
          <input
            type="checkbox"
            checked={showAltGrid}
            onChange={(e) => setShowAltGrid(e.target.checked)}
            className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-xs cursor-pointer text-amber-300 hover:text-amber-100 transition-colors">
          <span className="font-myanmar">ကမ္ဘာမြေအောက် အမြင် (X-Ray Earth)</span>
          <input
            type="checkbox"
            checked={showBelowHorizon}
            onChange={(e) => setShowBelowHorizon(e.target.checked)}
            className="accent-amber-400 w-4 h-4 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* 4. NAKSHATRA QUICK FINDER / SEARCH */}
      <div className="bg-[#0b132b]/80 backdrop-blur-md p-4 rounded-2xl border border-cyan-500/20 shadow-xl flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
          နက္ခတ်ရှာဖွေရန် (Finder)
        </span>
        <input
          type="text"
          placeholder="နက္ခတ်အမည် ရိုက်ထည့်ပါ (ဥပမာ- ရောဟဏီ, Krittika)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#070d1e] border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-myanmar"
        />

        {searchQuery.trim() && (
          <div className="max-h-36 overflow-y-auto flex flex-col gap-1 mt-1">
            {filteredNakshatras.length === 0 ? (
              <div className="text-[11px] text-slate-500 p-2">ရှာမတွေ့ပါ</div>
            ) : (
              filteredNakshatras.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    onSelectTarget({
                      type: 'nakshatra',
                      data: n,
                      alt: 0,
                      az: 0
                    });
                    setSearchQuery('');
                  }}
                  className="text-left text-xs p-2 rounded-lg bg-[#070d1e] hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex justify-between items-center"
                >
                  <span className="font-myanmar font-semibold text-cyan-300">
                    {n.id}. {n.nameMm}
                  </span>
                  <span className="text-[10px] text-slate-400">{n.shapeMm}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* 5. NASA APOD & COSMIC AMBIANCE BUTTONS */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenApod}
          className="bg-gradient-to-r from-blue-900/60 to-indigo-950/80 hover:from-blue-800 hover:to-indigo-900 border border-blue-500/40 p-2.5 rounded-2xl text-xs text-blue-200 flex flex-col items-center justify-center gap-1 transition-all shadow-lg font-myanmar"
        >
          <span className="text-lg">🌌</span>
          <span className="font-semibold">NASA နေ့စဉ်ဓာတ်ပုံ</span>
        </button>

        <button
          onClick={onOpenSoundToggle}
          className={`border p-2.5 rounded-2xl text-xs flex flex-col items-center justify-center gap-1 transition-all shadow-lg font-myanmar ${
            isAudioPlaying
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
              : 'bg-[#0b132b]/80 border-slate-700 text-slate-300 hover:bg-[#162238]'
          }`}
        >
          <span className="text-lg">{isAudioPlaying ? '🎵' : '🔇'}</span>
          <span className="font-semibold">{isAudioPlaying ? 'တေးသံ ပိတ်မည်' : 'ကောင်းကင် တေးသံ'}</span>
        </button>
      </div>
    </div>
  );
}
