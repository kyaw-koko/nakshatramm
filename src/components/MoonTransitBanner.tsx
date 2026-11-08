'use client';

import React from 'react';
import { calculateBurmeseMoonTransit } from '@/lib/astronomy';
import { SelectedTarget } from './SkyCanvas';

interface MoonTransitBannerProps {
  currentDate: Date;
  onSelectNakshatra: (target: SelectedTarget) => void;
}

export default function MoonTransitBanner({ currentDate, onSelectNakshatra }: MoonTransitBannerProps) {
  const transit = calculateBurmeseMoonTransit(currentDate);

  const handleClickNakshatra = () => {
    onSelectNakshatra({
      type: 'nakshatra',
      data: transit.nakshatra,
      alt: 0,
      az: 0
    });
  };

  return (
    <div className="w-full bg-[#0b132b]/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-slate-200">
      {/* Left: Moon Icon & Active Transit Info */}
      <div className="flex items-center gap-3">
        <div className="relative w-11 h-11 rounded-2xl bg-[#070d1e] border border-cyan-500/40 flex items-center justify-center text-2xl shadow-inner shadow-cyan-500/20">
          <span>🌙</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">
              စန်းယှဉ်နက္ခတ် (Moon Transit)
            </span>
            <span className="text-[10px] bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 px-2 py-0.2 rounded-full font-mono">
              ပါဒ် {transit.pada} / Pada {transit.pada}
            </span>
          </div>

          <button
            onClick={handleClickNakshatra}
            className="text-left font-myanmar text-lg font-bold text-white hover:text-cyan-300 transition-colors flex items-center gap-1.5"
          >
            <span>{transit.nakshatra.nameMm}</span>
            <span className="text-xs text-slate-400 font-sans font-normal">
              ({transit.nakshatra.nameEn} · {transit.nakshatra.shapeMm})
            </span>
            <span className="text-cyan-400 text-xs">ⓘ</span>
          </button>
        </div>
      </div>

      {/* Middle: Progress Bar within Nakshatra */}
      <div className="flex-1 min-w-[180px] max-w-xs flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>နက္ခတ်ခရီးစဉ် (Transit Progress)</span>
          <span className="text-cyan-300 font-bold">{transit.progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[#070d1e] rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${transit.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Right: Burmese Lunar Day & Ayanamsa Telemetry */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-slate-400 font-myanmar">မြန်မာ့ရက်စွဲ / လအဆင့်</span>
          <span className="text-amber-300 font-bold font-myanmar">{transit.tithiNameMm}</span>
        </div>

        <div className="w-[1px] h-7 bg-slate-800 hidden sm:block" />

        <div className="flex flex-col text-right hidden sm:flex">
          <span className="text-[10px] text-slate-400">လအလင်းရောင် (Illum.)</span>
          <span className="text-white font-bold">{transit.illuminationPercent}%</span>
        </div>

        <div className="w-[1px] h-7 bg-slate-800 hidden md:block" />

        <div className="flex flex-col text-right hidden md:flex">
          <span className="text-[10px] text-slate-400">လာဟီရီ အာယနမ်ရှ</span>
          <span className="text-purple-300 font-bold">{transit.ayanamsaDeg}°</span>
        </div>
      </div>
    </div>
  );
}
