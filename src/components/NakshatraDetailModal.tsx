'use client';

import React from 'react';
import { SelectedTarget } from './SkyCanvas';
import { Nakshatra, CelestialStar } from '@/data/nakshatras';
import { PlanetData, LagnaData } from '@/lib/astronomy';

interface NakshatraDetailModalProps {
  target: SelectedTarget | null;
  onClose: () => void;
}

export default function NakshatraDetailModal({ target, onClose }: NakshatraDetailModalProps) {
  if (!target) return null;

  const isNakshatra = target.type === 'nakshatra';
  const isPlanet = target.type === 'planet';
  const isStar = target.type === 'star';
  const isLagna = target.type === 'lagna';

  const nakshatra = isNakshatra ? (target.data as Nakshatra) : null;
  const planet = isPlanet ? (target.data as PlanetData) : null;
  const star = isStar ? (target.data as CelestialStar) : null;
  const lagna = isLagna ? (target.data as LagnaData) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0b132b]/95 border border-cyan-400/40 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col gap-4 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
              {isNakshatra ? `မြန်မာ့နက္ခတ် ၂၇ လုံး (အမှတ် ${nakshatra?.id})` : isPlanet ? 'ဂြိုဟ်မင်း (Celestial Planet)' : isLagna ? '🌅 လဂ် (Lagna / Ascendant - အရှေ့မိုးကုတ်)' : 'အထင်ရှားဆုံးကြယ် (Navigational Star)'}
            </span>
            <h2 className="text-2xl font-bold font-myanmar text-white mt-1 flex items-center gap-2">
              {isNakshatra && nakshatra?.nameMm}
              {isPlanet && planet?.nameMm}
              {isStar && star?.burmeseName}
              {isLagna && `${lagna?.zodiac.nameMm} လဂ်`}
              <span className="text-sm font-normal text-slate-400 font-sans">
                {isNakshatra && `(${nakshatra?.nameEn} / ${nakshatra?.nameSa})`}
                {isPlanet && `(${planet?.nameEn})`}
                {isStar && `(${star?.name})`}
                {isLagna && `(${lagna?.zodiac.nameEn} · ${lagna?.zodiac.symbol})`}
              </span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Main Content Body */}
        <div className="flex flex-col gap-4 text-xs font-sans">
          {/* Key Attribute Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {isLagna && (
              <>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ရာသီခွင် သင်္ကေတ</span>
                  <span className="text-xl font-bold text-amber-300">{lagna?.zodiac.symbol}</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ရာသီအတွင်း ဒီဂရီ</span>
                  <span className="font-mono font-semibold text-cyan-300">{lagna?.degreeInZodiac.toFixed(2)}°</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">အရှေ့ထွက်နက္ခတ်</span>
                  <span className="font-myanmar font-semibold text-purple-300">{lagna?.nakshatra.nameMm} (ပါဒ် {lagna?.pada})</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">စိုးမိုးဂြိုဟ်</span>
                  <span className="font-myanmar font-semibold text-emerald-300">{lagna?.zodiac.rulingPlanetMm}</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800 col-span-2">
                  <span className="text-slate-400 block text-[10px]">နိရယန လောင်ဂျီတွဒ် (Sidereal Lon)</span>
                  <span className="font-mono font-semibold text-slate-200">{lagna?.siderealLonDeg.toFixed(2)}° (ဆာယန: {lagna?.tropicalLonDeg.toFixed(2)}°)</span>
                </div>
              </>
            )}

            {isNakshatra && (
              <>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ပုံသဏ္ဌာန် (Shape)</span>
                  <span className="font-myanmar font-semibold text-amber-300">{nakshatra?.shapeMm}</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ရာသီခွင် (Zodiac)</span>
                  <span className="font-myanmar font-semibold text-cyan-300">{nakshatra?.zodiacMm} ({nakshatra?.zodiacEn})</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">စိုးမိုးဂြိုဟ် (Ruler)</span>
                  <span className="font-myanmar font-semibold text-purple-300">{nakshatra?.planetRulerMm}</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">စိုးမိုးသောနတ် (Deity)</span>
                  <span className="font-myanmar font-semibold text-emerald-300">{nakshatra?.deityMm}</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ကြယ်အရေအတွက်</span>
                  <span className="font-mono font-semibold text-white">{nakshatra?.starCount} လုံး</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ဒီဂရီအပိုင်းအခြား</span>
                  <span className="font-mono font-semibold text-slate-300">{nakshatra?.spanStartDeg.toFixed(1)}° - {nakshatra?.spanEndDeg.toFixed(1)}°</span>
                </div>
              </>
            )}

            {isPlanet && (
              <>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ဂြိုဟ်သင်္ကေတ</span>
                  <span className="text-xl font-bold" style={{ color: planet?.color }}>{planet?.symbol}</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ဖြတ်သန်းဆဲ နက္ခတ်</span>
                  <span className="font-myanmar font-semibold text-cyan-300">{planet?.currentNakshatra.nameMm}</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ရာသီ (Zodiac Sign)</span>
                  <span className="font-myanmar font-semibold text-amber-300">{planet?.currentZodiac.nameMm}</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">အမြင်ပြင်းအား (Mag)</span>
                  <span className="font-mono font-semibold text-white">{planet?.magnitude.toFixed(1)}</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800 col-span-2">
                  <span className="text-slate-400 block text-[10px]">နိရယန လောင်ဂျီတွဒ် (Sidereal)</span>
                  <span className="font-mono font-semibold text-slate-300">{planet?.siderealLongitudeDeg.toFixed(2)}°</span>
                </div>
              </>
            )}

            {isStar && (
              <>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">အလင်းပြင်းအား (Mag)</span>
                  <span className="font-mono font-semibold text-white">{star?.mag.toFixed(2)}</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ရောင်စဉ်အမျိုးအစား</span>
                  <span className="font-mono font-semibold text-cyan-300">{star?.spectralType || 'N/A'}</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ညာဘက်ကြွမှု (RA)</span>
                  <span className="font-mono font-semibold text-amber-300">{star?.raHours.toFixed(4)}h</span>
                </div>
                <div className="bg-[#070d1e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">တိမ်းစောင်းမှု (Dec)</span>
                  <span className="font-mono font-semibold text-purple-300">{star?.decDeg.toFixed(4)}°</span>
                </div>
              </>
            )}
          </div>

          {/* Real-Time Horizon Coordinates Telemetry */}
          <div className="bg-[#070d1e]/90 p-3 rounded-2xl border border-cyan-500/20 font-mono flex items-center justify-around text-center">
            <div>
              <span className="text-slate-400 text-[10px] block">အမြင့်ထောင့် (Altitude)</span>
              <span className={`text-sm font-bold ${target.alt >= 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {target.alt.toFixed(2)}° {target.alt >= 0 ? '(ကောင်းကင်ယံ)' : '(မိုးကုတ်အောက်)'}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-slate-800" />
            <div>
              <span className="text-slate-400 text-[10px] block">အရပ်မျက်နှာထောင့် (Azimuth)</span>
              <span className="text-sm font-bold text-cyan-400">
                {target.az.toFixed(2)}°
              </span>
            </div>
          </div>

          {/* Description & Lore */}
          <div className="bg-[#050816]/70 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-1.5 leading-relaxed font-myanmar text-slate-300">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider font-sans">
              နက္ခတ်ဆိုင်ရာ အဓိပ္ပာယ်နှင့် ရာဇဝင် (Lore & Significance)
            </span>
            <p>{isNakshatra && nakshatra?.descriptionMm}</p>
            <p className="text-[11px] text-slate-400 font-sans">{isNakshatra && nakshatra?.descriptionEn}</p>
            <p>{isPlanet && planet?.infoMm}</p>
            {isLagna && (
              <div>
                <p>
                  လဂ် (Ascendant) သည် မွေးဖွားချိန်၌ အရှေ့ဘက် မိုးကုတ်စက်ဝိုင်းတွင် အတိအကျ ထွက်ပေါ်နေသော ရာသီခွင်၏ ဒီဂရီအမှတ် ဖြစ်သည်။ မြန်မာ့ရိုးရာ နက္ခတ်ဗေဒင်နှင့် ဇာတာဖွဲ့ရာတွင် ဇာတာရှင်၏ စရိုက်လက္ခဏာ၊ ခန္ဓာကိုယ်ရုပ်သွင်နှင့် ကံကြမ္မာဗဟိုချက် (တနုဘာဝ) ကို သတ်မှတ်ရာ၌ အဓိက အကျဆုံး အခြေခံ ဖြစ်သည်။
                </p>
                <p className="text-[11px] text-slate-400 font-sans mt-1">
                  The Lagna (Ascendant) is the exact degree of the sidereal zodiac rising over the eastern horizon at the moment and location of birth. It defines the First House of life, personality, vitality, and physical constitution in traditional Burmese astrology.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
