import React, { useState, useEffect } from 'react';
import BackgroundStars from './components/BackgroundStars';
import AudioPlayer from './components/AudioPlayer';
import HeroSection from './components/HeroSection';
import MemorySection from './components/MemorySection';
import WishCakeSection from './components/WishCakeSection';
import FinaleSection from './components/FinaleSection';
import NavigationDots from './components/NavigationDots';
import { memoriesData } from './data/memories';

export default function App() {
  const [activeMemoryId, setActiveMemoryId] = useState('hero');
  const [isFinaleActive, setIsFinaleActive] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Scroll listener to update active section if at the top
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight * 0.4) {
        setActiveMemoryId('hero');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartClick = () => {
    setHasUserInteracted(true);
    const firstSection = document.getElementById('memory-1');
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectMemory = (id) => {
    const target = document.getElementById(`memory-${id}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToFinale = () => {
    const finale = document.getElementById('finale');
    if (finale) {
      finale.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#0a0812] text-neutral-100 overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Dynamic Starlight & Particle Background */}
      <BackgroundStars isFinaleMode={isFinaleActive} />

      {/* Floating Audio Controller */}
      <AudioPlayer
        isFinaleActive={isFinaleActive}
        hasUserInteracted={hasUserInteracted}
        setHasUserInteracted={setHasUserInteracted}
      />

      {/* Side Navigation Dots */}
      <NavigationDots
        activeId={isFinaleActive ? 'finale' : activeMemoryId}
        memories={memoriesData}
        onSelectMemory={handleSelectMemory}
      />

      {/* Hero Welcome Section */}
      <HeroSection onStartClick={handleStartClick} />

      {/* 8 Memorable Photo Sections */}
      <div className="relative z-10">
        {memoriesData.map((memory, index) => (
          <MemorySection
            key={memory.id}
            memory={memory}
            index={index}
            total={memoriesData.length}
            onActiveChange={(id) => {
              setActiveMemoryId(id);
            }}
          />
        ))}
      </div>

      {/* Interactive Birthday Cake & Wish Section */}
      <div id="wish-cake" className="relative z-10">
        <WishCakeSection onScrollToFinale={handleScrollToFinale} />
      </div>

      {/* The Romantic & Intimate Finale ("And One More Thing...") */}
      <FinaleSection
        onFinaleVisible={(active) => {
          setIsFinaleActive(active);
        }}
        onRestart={handleRestart}
      />

      {/* Discreet footer credit */}
      <footer className="relative z-10 py-8 text-center text-xs text-neutral-600 font-light border-t border-white/5">
        <p>Crafted with love & heartfelt wishes • Made forever memorable ♡</p>
      </footer>
    </div>
  );
}
