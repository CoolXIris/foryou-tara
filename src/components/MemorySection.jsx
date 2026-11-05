import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, Quote, Award, Calendar, Compass, Feather } from 'lucide-react';
import confetti from 'canvas-confetti';
import SectionFireworks from './SectionFireworks';

export default function MemorySection({ memory, index, total, onActiveChange, onLikeChange }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [fireworkRunId, setFireworkRunId] = useState(0);
  const hasCelebratedGraduationRef = useRef(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (onActiveChange) onActiveChange(memory.id);
          setFireworkRunId((runId) => runId + 1);

          // If this is the graduation section (#7), trigger small golden celebratory confetti once!
          if (memory.id === 7 && !hasCelebratedGraduationRef.current) {
            hasCelebratedGraduationRef.current = true;
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a']
            });
          }
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.25,
        rootMargin: '-5% 0px -5% 0px',
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [memory.id, onActiveChange]);

  const handleLikeClick = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    onLikeChange?.(memory.id, nextLiked);
    if (nextLiked) {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.65 },
        colors: ['#f43f5e', '#ec4899', '#f472b6']
      });
    }
  };

  // Determine alternate layout for visual rhythm
  const isEven = index % 2 === 1;

  return (
    <section
      ref={sectionRef}
      id={`memory-${memory.id}`}
      className="relative min-h-[100svh] w-full flex items-center justify-center pt-52 pb-20 px-4 sm:pt-48 sm:px-8 md:px-12 overflow-hidden transition-all duration-1000"
    >
      <SectionFireworks text={memory.fireworkText} triggerId={fireworkRunId} isActive={isVisible} />

      {/* Dynamic ambient color glow for this specific memory */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${memory.themeColor} pointer-events-none transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-20'
        }`}
      />

      <div
        className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-1000"
        style={{
          backgroundColor: memory.glowColor,
          top: isEven ? '20%' : '60%',
          right: isEven ? '10%' : '65%',
          opacity: isVisible ? 0.7 : 0.1,
          transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        }}
      />

      {/* Main Content Container with Smooth Scroll-in and Scroll-out transition */}
      <div
        className={`relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center transition-all duration-1000 ease-out transform ${
          isVisible
            ? 'opacity-100 translate-y-0 scale-100 filter-none'
            : 'opacity-0 translate-y-12 scale-95 blur-xs'
        }`}
      >
        {/* Photo Card Column */}
        <div
          className={`lg:col-span-6 flex justify-center ${
            isEven ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <div
            className={`group relative p-3 sm:p-4 rounded-3xl bg-neutral-900/60 border ${memory.accentBorder} backdrop-blur-xl shadow-2xl transition-all duration-700 hover:shadow-pink-500/20 transform ${
              isVisible
                ? isEven
                  ? 'translate-x-0 rotate-1'
                  : 'translate-x-0 -rotate-1'
                : isEven
                ? 'translate-x-12 rotate-6'
                : '-translate-x-12 -rotate-6'
            }`}
          >
            {/* Top decorative pin or washi tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[10px] uppercase tracking-widest text-neutral-300 flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{memory.date}</span>
            </div>

            {/* Photo Image Frame */}
            <div className="relative overflow-hidden rounded-2xl max-w-md w-full aspect-[4/5] bg-neutral-950 flex items-center justify-center">
              <img
                src={memory.photo}
                alt={memory.title}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gentle gradient vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/20 pointer-events-none" />

              {/* Floating like button over image */}
              <button
                onClick={handleLikeClick}
                type="button"
                aria-label={liked ? 'Remove like from this memory' : 'Like this memory'}
                aria-pressed={liked}
                className={`absolute bottom-4 right-4 p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${
                  liked
                    ? 'bg-rose-500 text-white border-rose-400 scale-110 shadow-lg shadow-rose-500/50'
                    : 'bg-neutral-900/70 text-neutral-300 border-white/20 hover:text-rose-400 hover:scale-105'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
              </button>

              {/* Bottom image caption pill */}
              <div className="absolute bottom-4 left-4 right-16">
                <p className="font-script text-base sm:text-lg text-neutral-200 drop-shadow-md truncate">
                  {memory.subtitle}
                </p>
              </div>
            </div>

            {/* Polaroid lower caption area */}
            <div className="pt-3 px-2 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-mono tracking-wider">{memory.tag}</span>
              <span className="text-neutral-400 flex items-center gap-1">
                <Feather className="w-3 h-3 text-pink-400" /> {index + 1} / {total}
              </span>
            </div>
          </div>
        </div>

        {/* Narrative / Doa / Harapan Column */}
        <div
          className={`lg:col-span-6 space-y-6 text-left ${
            isEven ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          {/* Tag & Section Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-pink-300 font-medium tracking-wide">
            <Sparkles className="w-3 h-3 text-pink-400" />
            <span>{memory.tag}</span>
          </div>

          {/* Section Title */}
          <h2 className="font-serif-romantic text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
            {memory.title}
          </h2>

          {/* Primary Prayer (Doa & Harapan) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/50 border border-white/10 backdrop-blur-md shadow-lg space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-pink-500 to-amber-400" />
            
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Doa & Harapan</span>
            </div>
            
            <p className="text-neutral-200 text-sm sm:text-base leading-relaxed font-normal">
              {memory.doa}
            </p>
          </div>

          {/* Reflection & Motivation (Penyemangat & Motivasi) */}
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
            {memory.pesan}
          </p>

          {/* Quote Card */}
          <div className="pt-2 flex items-start gap-3 text-neutral-300 italic text-xs sm:text-sm">
            <Quote className="w-5 h-5 text-pink-400 shrink-0 mt-0.5 opacity-80" />
            <p className="font-serif-romantic tracking-wide">{memory.quote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
