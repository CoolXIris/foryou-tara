import React from 'react';
import { Heart, Sparkles, ChevronDown, Calendar, Star } from 'lucide-react';

export default function HeroSection({ onStartClick }) {
  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-gradient-to-tr from-pink-600/20 via-purple-600/15 to-amber-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Floating subtle badges */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/15 to-purple-500/15 border border-pink-400/30 text-pink-200 text-xs sm:text-sm font-medium tracking-wider backdrop-blur-md mb-8 animate-float shadow-lg shadow-pink-500/10">
        <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin [animation-duration:8s]" />
        <span>A Special Birthday Dedication</span>
        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
      </div>

      {/* Main Emotional Headline */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="font-script text-2xl sm:text-3xl md:text-4xl text-pink-300 font-normal tracking-wide">
          Untuk seseorang yang begitu berharga...
        </h2>

        <h1 className="font-serif-romantic text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.15]">
          Selamat Bertambah Usia, <br className="hidden sm:inline" />
          <span className="shimmer-text">Semoga Bahagia Selalu</span>
        </h1>

        <p className="max-w-2xl mx-auto text-neutral-300 text-base sm:text-lg md:text-xl font-light leading-relaxed px-2">
          Hari ini adalah perayaan tentangmu. Tentang senyumanmu yang menghangatkan suasana, 
          setiap mimpi yang sedang kamu perjuangkan, dan kebaikan hatimu yang selalu membuat hari-hari terasa lebih berwarna.
        </p>

        {/* Decorative Quote Pill */}
        <div className="pt-2 pb-4">
          <div className="inline-block p-[1px] rounded-2xl bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-amber-500/30">
            <div className="px-5 py-3 rounded-2xl bg-neutral-950/70 backdrop-blur-md text-xs sm:text-sm text-neutral-300 italic flex items-center justify-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
              <span>"Semoga setiap langkah dan impianmu di tahun ini selalu dipermudah."</span>
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
            </div>
          </div>
        </div>

        {/* Call To Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartClick}
            className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-medium text-sm sm:text-base tracking-wide shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <span>Buka Cerita Kenangan</span>
            <Sparkles className="w-4 h-4 text-pink-200 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <div 
        onClick={onStartClick}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-400 hover:text-pink-300 transition-colors cursor-pointer group"
      >
        <span className="text-xs uppercase tracking-widest text-neutral-400 group-hover:text-pink-300 transition-colors">
          Scroll ke bawah
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-neutral-600 group-hover:border-pink-400 flex items-start justify-center p-1.5 transition-colors">
          <div className="w-1.5 h-2 bg-pink-400 rounded-full animate-bounce" />
        </div>
        <ChevronDown className="w-4 h-4 text-pink-400 animate-pulse -mt-1" />
      </div>
    </section>
  );
}
