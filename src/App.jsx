import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Flower2, MousePointer2, Sparkles } from 'lucide-react';
import BackgroundStars from './components/BackgroundStars';
import AudioPlayer from './components/AudioPlayer';
import HeroSection from './components/HeroSection';
import MemorySection from './components/MemorySection';
import WishCakeSection from './components/WishCakeSection';
import FinaleSection from './components/FinaleSection';
import NavigationDots from './components/NavigationDots';
import CursorEffects from './components/CursorEffects';
import { memoriesData } from './data/memories';

export default function App() {
  const [activeMemoryId, setActiveMemoryId] = useState('hero');
  const [isFinaleActive, setIsFinaleActive] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [likedMemoryIds, setLikedMemoryIds] = useState(() => new Set());
  const gateButtonRef = useRef(null);
  const bgmRef = useRef(null);
  const hasStartedRef = useRef(false);
  const hasLikedAllMemories = memoriesData.every((memory) => likedMemoryIds.has(memory.id));

  const handleMemoryLikeChange = useCallback((memoryId, isLiked) => {
    setLikedMemoryIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (isLiked) nextIds.add(memoryId);
      else nextIds.delete(memoryId);
      return nextIds;
    });
  }, []);

  // Intercept the first downward gesture so the welcome note appears before the story scrolls.
  useEffect(() => {
    let gateWasTriggered = false;
    let touchStartY = 0;

    const triggerGate = (event) => {
      if (gateWasTriggered || hasStartedRef.current) return;
      gateWasTriggered = true;
      event?.preventDefault?.();
      setIsGateOpen(true);
    };

    const onWheel = (event) => {
      if (event.deltaY > 0) triggerGate(event);
    };
    const onTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event) => {
      const currentY = event.touches[0]?.clientY ?? touchStartY;
      if (currentY < touchStartY) triggerGate(event);
    };
    const onKeyDown = (event) => {
      if (['ArrowDown', 'PageDown', ' '].includes(event.key)) triggerGate(event);
    };
    const onScroll = () => {
      if (hasStartedRef.current) return;
      if (window.scrollY > 0) {
        window.scrollTo(0, 0);
        triggerGate();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!isGateOpen) return undefined;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    gateButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isGateOpen]);

  // Update the active section when the page is back at the top.
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < window.innerHeight * 0.4) setActiveMemoryId('hero');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startStory = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setIsGateOpen(false);
    setHasUserInteracted(true);

    const playRequest = bgmRef.current?.play();
    playRequest?.catch(() => {
      // The audio controller remains available if the browser blocks playback.
    });

    window.setTimeout(() => {
      document.getElementById('memory-1')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  const handleStartClick = () => {
    if (hasStartedRef.current) {
      document.getElementById('memory-1')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setIsGateOpen(true);
  };

  const handleSelectMemory = (id) => {
    if (!hasStartedRef.current) {
      setIsGateOpen(true);
      return;
    }
    document.getElementById(`memory-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToFinale = () => {
    document.getElementById('finale')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0812] text-neutral-100 selection:bg-pink-500 selection:text-white">
      <BackgroundStars isFinaleMode={isFinaleActive} />
      <CursorEffects active={hasUserInteracted} />

      <AudioPlayer
        audioRef={bgmRef}
        isFinaleActive={isFinaleActive}
        hasUserInteracted={hasUserInteracted}
        setHasUserInteracted={setHasUserInteracted}
      />

      <NavigationDots
        activeId={isFinaleActive ? 'finale' : activeMemoryId}
        memories={memoriesData}
        onSelectMemory={handleSelectMemory}
      />

      <HeroSection onStartClick={handleStartClick} />

      <div className="relative z-10">
        {memoriesData.map((memory, index) => (
          <MemorySection
            key={memory.id}
            memory={memory}
            index={index}
            total={memoriesData.length}
            onActiveChange={setActiveMemoryId}
            onLikeChange={handleMemoryLikeChange}
          />
        ))}
      </div>

      <div id="wish-cake" className="relative z-10">
        <WishCakeSection onScrollToFinale={handleScrollToFinale} />
      </div>

      <FinaleSection
        onFinaleVisible={setIsFinaleActive}
        onRestart={handleRestart}
        hasLikedAllMemories={hasLikedAllMemories}
        onVideoPlay={() => {
          bgmRef.current?.pause();
        }}
      />

      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs font-light text-neutral-600">
        <p>Crafted with love & heartfelt wishes • Made forever memorable ♡</p>
      </footer>

      {isGateOpen && (
        <div className="welcome-gate fixed inset-0 z-[120] flex items-center justify-center overflow-hidden px-5 py-8" role="presentation">
          <div className="absolute inset-0 bg-[#07040d]/90 backdrop-blur-xl" aria-hidden="true" />
          <div
            className="welcome-card relative z-10 w-full max-w-xl rounded-[2rem] border border-pink-200/20 bg-[#15101e]/95 px-6 py-9 text-center shadow-[0_30px_120px_rgba(236,72,153,0.18)] sm:px-10 sm:py-11"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-pink-300/20 bg-pink-400/10 text-pink-200">
              <Flower2 className="h-7 w-7" />
            </div>
            <h2 id="welcome-title" className="mb-4 font-serif-romantic text-2xl text-white sm:text-3xl">
              Sebelum ceritanya dimulai…
            </h2>
            <p className="text-sm leading-7 text-neutral-200 sm:text-base sm:leading-8">
              Udah pake TWS/earphone nya belum? Dipake dulu dong kalo belum biar maksimal experience nya.
              Dan kalo bisa buka ini di laptop nya aja, jangan di HP, biar lebih berkesan hehe.
            </p>
            <p className="mt-4 text-sm leading-7 text-pink-200 sm:text-base">
              Udahh??? Kalo udah silahkan di klik tombol nya ✨
            </p>
            <button
              ref={gateButtonRef}
              type="button"
              onClick={startStory}
              className="welcome-start-button group relative mt-8 inline-flex items-center gap-2 rounded-full border border-pink-200/30 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-900/40 transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-200 sm:text-base"
            >
              <span>Buka Cerita Kenangan</span>
              <Sparkles className="h-4 w-4 transition group-hover:rotate-12" />
            </button>
            <div className="cursor-guide" aria-hidden="true">
              <MousePointer2 className="h-7 w-7 fill-white text-pink-400 drop-shadow-lg" />
            </div>
            <p className="mt-5 text-[11px] tracking-wide text-neutral-500">Pakai suara pelan-pelan, ya ♡</p>
          </div>
        </div>
      )}
    </div>
  );
}
