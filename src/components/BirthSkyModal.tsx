'use client';

import React, { useState, useMemo } from 'react';
import { MYANMAR_CITIES, ObserverLocation, calculateBirthSky, BirthSkyData } from '@/lib/astronomy';

interface BirthSkyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBirthSky: (birthData: BirthSkyData) => void;
  currentObserver: ObserverLocation;
}

export default function BirthSkyModal({
  isOpen,
  onClose,
  onApplyBirthSky,
  currentObserver
}: BirthSkyModalProps) {
  const [personName, setPersonName] = useState<string>('');
  const [birthDateStr, setBirthDateStr] = useState<string>('2000-01-01');
  const [birthTimeStr, setBirthTimeStr] = useState<string>('06:00');
  const [selectedCityName, setSelectedCityName] = useState<string>(currentObserver.nameEn);
  const [customLat, setCustomLat] = useState<string>(currentObserver.latitude.toString());
  const [customLon, setCustomLon] = useState<string>(currentObserver.longitude.toString());
  const [isCustomCity, setIsCustomCity] = useState<boolean>(false);

  // Derive observer location
  const observer = useMemo<ObserverLocation>(() => {
    if (isCustomCity) {
      const lat = parseFloat(customLat) || 16.8661;
      const lon = parseFloat(customLon) || 96.1951;
      return {
        nameMm: 'စိတ်ကြိုက်တည်နေရာ',
        nameEn: 'Custom Location',
        latitude: lat,
        longitude: lon,
        elevation: 10
      };
    }
    const found = MYANMAR_CITIES.find((c) => c.nameEn === selectedCityName);
    return found || MYANMAR_CITIES[0];
  }, [isCustomCity, selectedCityName, customLat, customLon]);

  // Derive birth Date object
  const birthDateObj = useMemo<Date>(() => {
    try {
      const [year, month, day] = birthDateStr.split('-').map(Number);
      const [hours, minutes] = birthTimeStr.split(':').map(Number);
      // Myanmar is UTC+6:30
      const d = new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0, 0);
      return isNaN(d.getTime()) ? new Date() : d;
    } catch {
      return new Date();
    }
  }, [birthDateStr, birthTimeStr]);

  // Live calculation of Birth Sky data
  const birthData = useMemo<BirthSkyData>(() => {
    return calculateBirthSky(birthDateObj, observer);
  }, [birthDateObj, observer]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyBirthSky(birthData);
    onClose();
  };

  const handleGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsCustomCity(true);
          setCustomLat(pos.coords.latitude.toFixed(4));
          setCustomLon(pos.coords.longitude.toFixed(4));
        },
        (err) => alert(`GPS ရယူ၍မရပါ: ${err.message}`)
      );
    }
  };

  const handleExportChart = () => {
    // Generate text or canvas summary
    const summary = `
========================================
✨ NakshatraMM — မြန်မာ့မွေးဖွားချိန် ကောင်းကင်နှင့် ဇာတာခွင် ✨
========================================
အမည်: ${personName || 'ဇာတာရှင်'}
မွေးသက္ကရာဇ်: ${birthDateStr} ${birthTimeStr}
မွေးဖွားရာဒေသ: ${observer.nameMm} (${observer.nameEn})
မြန်မာသက္ကရာဇ်: ${birthData.burmeseYear} ခုနှစ်
မွေးနေ့နံ: ${birthData.dayOfWeekMm} (${birthData.animalMm})
မဟာဘုတ်: ${birthData.mahaboteHouseMm} (${birthData.mahaboteMeaningMm})
----------------------------------------
🌟 မွေးနက္ခတ် (Janma Nakshatra):
  - ${birthData.janmaNakshatra.nakshatra.nameMm} (${birthData.janmaNakshatra.nakshatra.nameEn})
  - ပါဒ် ${birthData.janmaNakshatra.pada} (ခရီးစဉ် ${birthData.janmaNakshatra.progressPercent}%)
  - ပုံသဏ္ဌာန်: ${birthData.janmaNakshatra.nakshatra.shapeMm}
  - စိုးမိုးသောနတ်: ${birthData.janmaNakshatra.nakshatra.deityMm}
  - စိုးမိုးဂြိုဟ်: ${birthData.janmaNakshatra.nakshatra.planetRulerMm}
  - လအဆင့် / ရက်စွဲ: ${birthData.janmaNakshatra.tithiNameMm}

🌅 လဂ် (Lagna / Ascendant - အရှေ့မိုးကုတ်စက်ဝိုင်း):
  - ${birthData.lagna.zodiac.nameMm} (${birthData.lagna.zodiac.nameEn}) လဂ်
  - ဒီဂရီ: ${birthData.lagna.degreeInZodiac.toFixed(2)}°
  - အရှေ့မိုးကုတ်စက်ဝိုင်းထွက် နက္ခတ်: ${birthData.lagna.nakshatra.nameMm} (ပါဒ် ${birthData.lagna.pada})

🔤 အမည်ပေးရန် မင်္ဂလာအက္ခရာများ:
  - ${birthData.namingSyllablesMm}

🪐 မွေးဖွားချိန် ရာသီခွင် ဂြိုဟ်အထိုင်:
  - နေမင်း: ${birthData.sunSign.nameMm} (${birthData.sunSign.nameEn})
  - စန်းလမင်း: ${birthData.moonSign.nameMm} (${birthData.moonSign.nameEn})
========================================
    `.trim();

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BirthSky-${personName || 'Chart'}-${birthDateStr}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0b132b]/95 border border-cyan-400/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 overflow-hidden my-auto max-h-[92vh]">
        {/* Glow Accent */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-cyan-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-gradient-to-tr from-amber-500/20 via-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-cyan-500/20 pb-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-cyan-400 p-[1px] shadow-lg shadow-amber-500/20 flex-shrink-0">
              <div className="w-full h-full bg-[#070d1e] rounded-2xl flex items-center justify-center text-xl">
                ☸️
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold block">
                Burmese Birth Sky & Nakshatra Finder
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-myanmar text-white mt-0.5">
                မွေးဖွားချိန် ကောင်းကင် နှင့် မွေးနက္ခတ် ရှာဖွေစက်
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#070d1e]/80 p-3.5 rounded-2xl border border-cyan-500/20 relative z-10">
          {/* Optional Name */}
          <div className="sm:col-span-1 flex flex-col gap-1">
            <label className="text-[11px] text-slate-400 font-myanmar">အမည် (Name)</label>
            <input
              type="text"
              placeholder="ဇာတာရှင်အမည်"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="bg-[#0b132b] border border-cyan-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-myanmar"
            />
          </div>

          {/* Birth Date */}
          <div className="sm:col-span-1 flex flex-col gap-1">
            <label className="text-[11px] text-slate-400 font-myanmar">မွေးနေ့ (Birth Date)</label>
            <input
              type="date"
              value={birthDateStr}
              onChange={(e) => setBirthDateStr(e.target.value)}
              className="bg-[#0b132b] border border-cyan-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Birth Time */}
          <div className="sm:col-span-1 flex flex-col gap-1">
            <label className="text-[11px] text-slate-400 font-myanmar">မွေးဖွားချိန် (Time)</label>
            <input
              type="time"
              value={birthTimeStr}
              onChange={(e) => setBirthTimeStr(e.target.value)}
              className="bg-[#0b132b] border border-cyan-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* City Selection */}
          <div className="sm:col-span-1 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] text-slate-400 font-myanmar">မွေးရပ်ဒေသ</label>
              <button
                onClick={handleGps}
                title="Use Current GPS Location"
                className="text-[10px] text-cyan-300 hover:text-white"
              >
                📡 GPS
              </button>
            </div>
            <select
              value={isCustomCity ? 'custom' : selectedCityName}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setIsCustomCity(true);
                } else {
                  setIsCustomCity(false);
                  setSelectedCityName(e.target.value);
                }
              }}
              className="bg-[#0b132b] border border-cyan-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-myanmar"
            >
              {MYANMAR_CITIES.map((c) => (
                <option key={c.nameEn} value={c.nameEn}>
                  {c.nameMm} ({c.nameEn})
                </option>
              ))}
              <option value="custom">အခြား / GPS...</option>
            </select>
          </div>
        </div>

        {/* Live Calculation Results */}
        <div className="flex flex-col gap-3.5 overflow-y-auto pr-1 relative z-10">
          {/* Top 2 Primary Cards: Janma Nakshatra + Lagna */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Janma Nakshatra Card */}
            <div className="bg-gradient-to-br from-[#0c1836] to-[#070e24] p-4 rounded-2xl border border-cyan-500/40 shadow-xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
                  <span>🌟</span> မွေးနက္ခတ် (Janma Nakshatra)
                </span>
                <span className="text-[10px] bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
                  ပါဒ် {birthData.janmaNakshatra.pada} / Pada {birthData.janmaNakshatra.pada}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                <h3 className="text-xl font-bold font-myanmar text-white">
                  {birthData.janmaNakshatra.nakshatra.nameMm}
                </h3>
                <span className="text-xs text-slate-400">
                  ({birthData.janmaNakshatra.nakshatra.nameEn})
                </span>
              </div>

              {/* Progress bar inside Nakshatra */}
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>စန်းယှဉ်ခရီးစဉ်</span>
                  <span className="text-cyan-300">{birthData.janmaNakshatra.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#050816] rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-amber-300 rounded-full"
                    style={{ width: `${birthData.janmaNakshatra.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-400 block text-[10px]">ပုံသဏ္ဌာန်:</span>
                  <span className="font-myanmar font-semibold text-amber-300">
                    {birthData.janmaNakshatra.nakshatra.shapeMm}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">စိုးမိုးဂြိုဟ်:</span>
                  <span className="font-myanmar font-semibold text-purple-300">
                    {birthData.janmaNakshatra.nakshatra.planetRulerMm}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">စိုးမိုးသောနတ်:</span>
                  <span className="font-myanmar font-semibold text-emerald-300">
                    {birthData.janmaNakshatra.nakshatra.deityMm}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">စန်းရာသီ (Moon Sign):</span>
                  <span className="font-myanmar font-semibold text-cyan-200">
                    {birthData.moonSign.nameMm} ({birthData.moonSign.symbol})
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Lagna (Ascendant on Eastern Horizon) Card */}
            <div className="bg-gradient-to-br from-[#1a1236] to-[#0d0a22] p-4 rounded-2xl border border-purple-500/40 shadow-xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1">
                  <span>🌅</span> လဂ် (Lagna / Ascendant)
                </span>
                <span className="text-[10px] bg-purple-950 border border-purple-500/40 text-purple-300 px-2 py-0.5 rounded-full font-mono">
                  {birthData.lagna.degreeInZodiac.toFixed(1)}° in Sign
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                <h3 className="text-xl font-bold font-myanmar text-white">
                  {birthData.lagna.zodiac.nameMm} လဂ်
                </h3>
                <span className="text-xs text-slate-400">
                  ({birthData.lagna.zodiac.nameEn} · {birthData.lagna.zodiac.symbol})
                </span>
              </div>

              <p className="text-[11px] text-slate-300 font-myanmar leading-relaxed">
                မွေးဖွားချိန်၌ အရှေ့မိုးကုတ်စက်ဝိုင်းတွင် ထွက်ပေါ်နေသော ရာသီခွင်ဖြစ်ပြီး ဇာတာရှင်၏ စရိုက်လက္ခဏာနှင့် ကံကြမ္မာ အရင်းအမြစ်ကို ညွှန်ပြသည်။
              </p>

              <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-400 block text-[10px]">အရှေ့ထွက်နက္ခတ်:</span>
                  <span className="font-myanmar font-semibold text-purple-200">
                    {birthData.lagna.nakshatra.nameMm} (ပါဒ် {birthData.lagna.pada})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">နိရယန လောင်ဂျီတွဒ်:</span>
                  <span className="font-mono font-semibold text-slate-300">
                    {birthData.lagna.siderealLonDeg.toFixed(2)}°
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">မိုးကုတ်အမြင့် (Alt):</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {birthData.lagna.horizontal.altitude.toFixed(2)}° (Horizon)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">အရပ်မျက်နှာထောင့် (Az):</span>
                  <span className="font-mono font-semibold text-cyan-300">
                    {birthData.lagna.horizontal.azimuth.toFixed(1)}° (East)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Details: Day of week, Mahabote, Naming Syllables */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Day of Week & Animal */}
            <div className="bg-[#070d1e] p-3 rounded-2xl border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-myanmar">မွေးနေ့နံ နှင့် တိရစ္ဆာန်</span>
              <span className="font-myanmar font-bold text-amber-300 text-sm">
                {birthData.dayOfWeekMm}
              </span>
              <span className="text-[11px] text-slate-300 font-myanmar">
                အထိမ်းအမှတ်: {birthData.animalMm}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                မြန်မာသက္ကရာဇ် {birthData.burmeseYear} ခု
              </span>
            </div>

            {/* Mahabote House */}
            <div className="bg-[#070d1e] p-3 rounded-2xl border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-myanmar">မြန်မာ့မဟာဘုတ် ဌာန</span>
              <span className="font-myanmar font-bold text-cyan-300 text-sm">
                {birthData.mahaboteHouseMm}
              </span>
              <span className="text-[11px] text-slate-300 font-myanmar leading-tight">
                {birthData.mahaboteMeaningMm}
              </span>
            </div>

            {/* Auspicious Naming Syllables */}
            <div className="bg-[#070d1e] p-3 rounded-2xl border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-myanmar">အမည်ပေးရန် မင်္ဂလာအက္ခရာများ</span>
              <span className="font-myanmar font-bold text-emerald-300 text-sm">
                {birthData.namingSyllablesMm}
              </span>
              <span className="text-[10px] text-slate-400 font-myanmar">
                ရှေးမြန်မာ့ထုံးတမ်း အမည်ပေး ကင်ပွန်းတပ်နည်း
              </span>
            </div>
          </div>

          {/* Planetary Alignments at Birth Moment */}
          <div className="bg-[#070d1e] p-3 rounded-2xl border border-slate-800 flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
              <span>မွေးဖွားချိန် ကောင်းကင်ယံ ဂြိုဟ်အထိုင်များ (Planetary Positions at Birth)</span>
              <span className="text-cyan-400 font-myanmar text-[11px]">နေရပ်: {birthData.sunSign.nameMm} · စန်းရပ်: {birthData.moonSign.nameMm}</span>
            </span>

            <div className="flex flex-wrap gap-2 text-xs">
              {birthData.planets.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#0b132b] px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5"
                >
                  <span className="text-sm font-bold" style={{ color: p.color }}>
                    {p.symbol}
                  </span>
                  <span className="font-myanmar text-white font-medium">
                    {p.nameMm.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-cyan-300 font-myanmar">
                    ({p.currentZodiac.nameMm})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {p.horizontal.altitude >= 0 ? `+${p.horizontal.altitude.toFixed(0)}°` : `${p.horizontal.altitude.toFixed(0)}°`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-cyan-500/20 relative z-10">
          <button
            onClick={handleExportChart}
            className="w-full sm:w-auto bg-[#070d1e] hover:bg-[#162238] border border-slate-700 hover:border-cyan-500/40 text-slate-200 hover:text-white px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all font-myanmar"
          >
            <span>📜</span>
            <span>ဇာတာမှတ်တမ်း ထုတ်ယူမည် (Export)</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs transition-colors font-myanmar"
            >
              ပိတ်မည်
            </button>
            <button
              onClick={handleApply}
              className="w-1/2 sm:w-auto bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-5 py-2 rounded-xl text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-all font-myanmar"
            >
              <span>🚀</span>
              <span>ကောင်းကင်ယံသို့ ကူးပြောင်းမည်</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
