import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Heart, Flame, ArrowDown } from 'lucide-react';
import confetti from 'canvas-confetti';

const RIBBON_COLORS = ['#f9a8d4', '#fcd34d', '#c4b5fd', '#fb7185', '#67e8f9'];

export default function WishCakeSection({ onScrollToFinale }) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [ribbonsActive, setRibbonsActive] = useState(false);
  const ribbonsTimerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(ribbonsTimerRef.current), []);

  const handleBlowCandles = () => {
    setCandlesBlown(true);
    setRibbonsActive(true);
    window.clearTimeout(ribbonsTimerRef.current);
    ribbonsTimerRef.current = window.setTimeout(() => setRibbonsActive(false), 4000);

    // Celebration fireworks
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.2, 0.8), y: Math.random() - 0.2 },
        colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#38bdf8']
      });
    }, 250);
  };

  return (
    <section className="relative min-h-[90svh] w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-radial from-pink-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        {/* Section title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/20 text-pink-300 text-xs tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>A Special Birthday Wish</span>
          </div>

          <h2 className="font-serif-romantic text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Make A Wish & Tiup Lilinnya
          </h2>

          <p className="text-neutral-300 text-sm sm:text-base font-light">
            Tutup matamu sejenak, bayangkan impian kamu di tahun ini, lalu ketuk lilinnya.
          </p>
        </div>

        {/* Interactive Virtual Cake */}
        <div className="relative flex flex-col items-center justify-center py-6">
          {/* Candle Flames */}
          <div className="flex items-center justify-center gap-6 mb-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center">
                {/* Flame or Smoke */}
                <div className="h-8 flex items-center justify-center">
                  {!candlesBlown ? (
                    <div className="relative animate-bounce [animation-duration:1.5s]">
                      <div className="w-4 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-pulse" />
                      <div className="absolute top-1 left-1 w-2 h-3 rounded-full bg-white opacity-80" />
                    </div>
                  ) : (
                    <div className="text-neutral-500 text-xs font-mono animate-fade-out">
                      💨
                    </div>
                  )}
                </div>
                {/* Candle stick */}
                <div className="w-2.5 h-10 rounded-t-sm bg-gradient-to-b from-pink-200 to-pink-400 border border-pink-300 shadow-md" />
              </div>
            ))}
          </div>

          {/* Birthday Cake Tiers */}
          <div className="flex flex-col items-center">
            {/* Top Tier */}
            <div className="w-36 sm:w-44 h-12 rounded-t-2xl bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 border-t-2 border-pink-200 shadow-inner flex items-center justify-center relative overflow-hidden">
              <div className="flex gap-2">
                <span className="text-xs">🍓</span>
                <span className="text-xs">✨</span>
                <span className="text-xs">🍓</span>
              </div>
            </div>
            {/* Bottom Tier */}
            <div className="w-52 sm:w-64 h-16 rounded-b-2xl bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500 border-t-2 border-pink-300/50 shadow-2xl flex items-center justify-center relative">
              <span className="font-script text-lg sm:text-xl text-white font-semibold drop-shadow">
                Happy Birthday ♡
              </span>
            </div>
            {/* Cake Plate */}
            <div className="w-64 sm:w-76 h-3 rounded-full bg-neutral-800/80 border border-white/20 shadow-xl mt-1" />
          </div>
        </div>

        {/* Action Button */}
        <div>
          {!candlesBlown ? (
            <button
              onClick={handleBlowCandles}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 text-white font-medium text-sm sm:text-base tracking-wide shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>Tiup Lilin & Kirim Doa</span>
            </button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="p-5 rounded-2xl bg-pink-500/10 border border-pink-400/30 backdrop-blur-md max-w-lg mx-auto">
                <p className="font-script text-xl sm:text-2xl text-pink-200">
                  "Semoga segala doa yang kamu bisikkan diam-diam, dijawab dengan cara terindah di tahun ini. Aamiin. ✨"
                </p>
              </div>

              <button
                onClick={onScrollToFinale}
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-pink-300 text-xs sm:text-sm font-medium tracking-wide transition-colors py-2 cursor-pointer group"
              >
                <span>Ada satu pesan terakhir yang ingin ane sampaikan...</span>
                <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      {ribbonsActive && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 24 }, (_, index) => (
            <span
              key={index}
              className="wish-ribbon"
              style={{
                left: `${(index * 41) % 100}%`,
                '--ribbon-color': RIBBON_COLORS[index % RIBBON_COLORS.length],
                '--ribbon-height': `${92 + ((index * 23) % 78)}px`,
                '--ribbon-duration': `${2.2 + (index % 5) * 0.22}s`,
                '--ribbon-delay': `${(index % 8) * 55}ms`,
                '--ribbon-sway': `${index % 2 ? '' : '-'}${24 + ((index * 17) % 62)}px`,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
