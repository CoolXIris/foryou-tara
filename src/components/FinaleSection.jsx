import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, RotateCcw, Stars } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FinaleSection({ onFinaleVisible, onRestart }) {
  const sectionRef = useRef(null);
  const [stage, setStage] = useState(0); // 0: unrevealed, 1: "Before you leave...", 2: Full letter
  const [loveCount, setLoveCount] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onFinaleVisible(true);
          // Automatically transition to stage 1
          if (stage === 0) {
            setStage(1);
            // After 3 seconds, transition to stage 2 (full emotional letter)
            setTimeout(() => {
              setStage(2);
            }, 3200);
          }
        } else {
          onFinaleVisible(false);
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [stage, onFinaleVisible]);

  const handleHeartClick = () => {
    setLoveCount((prev) => prev + 1);

    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#cbd5e1'],
      shapes: ['circle']
    });
  };

  return (
    <section
      ref={sectionRef}
      id="finale"
      className="relative min-h-[110svh] w-full flex flex-col items-center justify-center px-5 sm:px-8 py-28 bg-[#050308] text-white overflow-hidden transition-colors duration-1000"
    >
      {/* Deep velvet night backdrop with subtle cosmic nebula */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0714]/80 to-[#050308] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-950/20 blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full mx-auto flex flex-col items-center text-center">
        {/* Stage 1: The subtle teaser sentence */}
        <div
          className={`transition-all duration-1000 ${
            stage >= 1
              ? 'opacity-100 translate-y-0 filter-none'
              : 'opacity-0 translate-y-6 blur-xs'
          } mb-12`}
        >
          <p className="font-serif-romantic italic text-sm sm:text-base md:text-lg text-neutral-400 tracking-wide">
            Before you leave, there's one more thing I want you to know...
          </p>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-neutral-600 to-transparent mx-auto mt-4" />
        </div>

        {/* Stage 2: The Heartfelt Letter */}
        <div
          className={`space-y-7 transition-all duration-1000 delay-300 max-w-2xl text-left ${
            stage >= 2
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        >
          {/* Paragraph 1 */}
          <p className="font-elegant text-lg sm:text-xl md:text-2xl text-neutral-200 leading-relaxed font-light">
            Di antara banyak hal baik yang aku harapkan datang ke hidupmu, ada satu hal yang mungkin belum pernah aku sampaikan.
          </p>

          {/* Paragraph 2 */}
          <p className="font-elegant text-lg sm:text-xl md:text-2xl text-neutral-300 leading-relaxed font-light">
            Aku nggak tahu akan sejauh apa perjalananmu setelah hari ini, berapa banyak mimpi yang nantinya berhasil kamu wujudkan, atau berapa banyak hal baru yang akan kamu temui.
          </p>

          {/* Paragraph 3 */}
          <p className="font-elegant text-lg sm:text-xl md:text-2xl text-neutral-200 leading-relaxed font-light">
            Tapi kalau boleh jujur, aku berharap bisa melihat lebih banyak cerita tentangmu. Melihatmu tumbuh, merayakan pencapaian kecil maupun besarmu, dan menyaksikan bagaimana kamu perlahan menjadi seseorang yang selama ini kamu usahakan.
          </p>

          {/* Paragraph 4 */}
          <p className="font-elegant text-lg sm:text-xl md:text-2xl text-pink-200/95 leading-relaxed font-normal">
            Dan mungkin, tanpa kamu sadari, mengenalmu sudah menjadi salah satu hal sederhana yang membuat hari-hariku terasa lebih berwarna.
          </p>

          {/* Paragraph 5 */}
          <p className="font-elegant text-lg sm:text-xl md:text-2xl text-neutral-300 leading-relaxed font-light italic">
            So, here's to another chapter of your life. I hope it will be as beautiful as the person who's living it.
          </p>

          {/* Final Emotional Signature */}
          <div className="pt-8 text-center space-y-3">
            <h3 className="font-script text-3xl sm:text-4xl md:text-5xl text-rose-300 tracking-wide">
              Happy birthday, you. ♡
            </h3>
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono">
              Always wishing you the very best
            </p>
          </div>

          {/* Interactive Closing Actions */}
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            {/* Love tap button */}
            <button
              onClick={handleHeartClick}
              className="px-6 py-3 rounded-full bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-200 text-sm font-medium tracking-wide flex items-center gap-2 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-rose-950/50"
            >
              <Heart className="w-4 h-4 fill-rose-400 text-rose-400 animate-pulse" />
              <span>Kirimkan Doa Tulus</span>
              {loveCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-xs">
                  +{loveCount}
                </span>
              )}
            </button>

            {/* Replay button */}
            <button
              onClick={onRestart}
              className="px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 text-sm font-medium tracking-wide flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-neutral-400" />
              <span>Putar Kembali Cerita ↺</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
