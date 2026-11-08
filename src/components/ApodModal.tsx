'use client';

import React, { useEffect, useState } from 'react';

interface ApodData {
  title: string;
  date: string;
  explanation: string;
  explanationMm?: string;
  url: string;
  hdurl?: string;
  media_type: string;
  copyright: string;
}

interface ApodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApodModal({ isOpen, onClose }: ApodModalProps) {
  const [apod, setApod] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;
    let isSubscribed = true;
    
    fetch('/api/apod')
      .then((res) => res.json())
      .then((json) => {
        if (isSubscribed && json.success && json.data) {
          setApod(json.data);
        }
      })
      .catch((err) => console.error('Failed to load APOD', err))
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0b132b]/95 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col gap-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              NASA Astronomy Picture of the Day (နေ့စဉ် အာကာသ ဓာတ်ပုံ)
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">{apod?.title || 'Loading Daily Highlight...'}</h2>
            <span className="text-xs text-slate-400 font-mono">{apod?.date} · {apod?.copyright}</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-cyan-300 font-myanmar">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>NASA အချက်အလက်များ ဆွဲတင်နေပါသည်...</span>
          </div>
        ) : apod ? (
          <div className="flex flex-col gap-4">
            {/* Image / Video */}
            <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-black/50 border border-slate-800 relative">
              {apod.media_type === 'video' ? (
                <iframe src={apod.url} title={apod.title} className="w-full h-full border-0" allowFullScreen />
              ) : (
                <img
                  src={apod.url}
                  alt={apod.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>

            {/* Burmese Explanation */}
            {apod.explanationMm && (
              <div className="bg-[#070d1e] p-4 rounded-2xl border border-cyan-500/20 font-myanmar text-xs leading-relaxed text-cyan-100">
                <span className="text-amber-400 font-bold block mb-1">မြန်မာဘာသာ ရှင်းလင်းချက်</span>
                {apod.explanationMm}
              </div>
            )}

            {/* English Explanation */}
            <div className="text-xs text-slate-300 leading-relaxed font-sans">
              <span className="text-slate-400 block mb-1 text-[11px] font-mono">NASA Official Description:</span>
              {apod.explanation}
            </div>

            {apod.hdurl && (
              <a
                href={apod.hdurl}
                target="_blank"
                rel="noreferrer"
                className="self-end text-xs text-cyan-400 hover:text-cyan-200 underline font-mono"
              >
                View Full HD Resolution ↗
              </a>
            )}
          </div>
        ) : (
          <div className="py-10 text-center text-red-400 text-xs">အချက်အလက် ရယူ၍ မရနိုင်ပါ။</div>
        )}
      </div>
    </div>
  );
}
