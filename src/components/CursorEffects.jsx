import React, { useEffect, useRef, useState } from 'react';
import { Flower2, Sparkles } from 'lucide-react';

export default function CursorEffects({ active }) {
  const followerRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return undefined;

    let nextId = 0;
    let lastTrailAt = 0;
    let lastScrollAt = 0;
    const removeParticle = (id) => {
      setParticles((current) => current.filter((particle) => particle.id !== id));
    };

    const addBurst = (x, y, count = 5) => {
      const now = Date.now();
      const batch = Array.from({ length: count }, (_, index) => {
        const id = nextId++;
        const particle = {
          id,
          x: x + (Math.random() - 0.5) * 48,
          y: y + (Math.random() - 0.5) * 42,
          symbol: index % 3 === 0 ? '✿' : '✧',
          rotation: Math.random() * 50 - 25,
        };
        window.setTimeout(() => removeParticle(id), 950);
        return particle;
      });
      setParticles((current) => [...current.slice(-22), ...batch]);
      return now;
    };

    const onPointerMove = (event) => {
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        followerRef.current.style.opacity = '1';
      }
      const now = Date.now();
      if (now - lastTrailAt > 115) {
        lastTrailAt = addBurst(event.clientX, event.clientY, 2);
      }
    };

    const onClick = (event) => addBurst(event.clientX, event.clientY, 9);
    const onScroll = () => {
      const now = Date.now();
      if (now - lastScrollAt < 260) return;
      lastScrollAt = now;
      addBurst(window.innerWidth / 2, Math.min(window.innerHeight - 35, window.innerHeight * 0.72), 7);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      <div ref={followerRef} className="cursor-flower-follower">
        <Flower2 className="h-5 w-5 fill-pink-300/30 text-pink-200 drop-shadow-[0_0_10px_rgba(249,168,212,0.95)]" />
        <Sparkles className="absolute -right-2 -top-2 h-3 w-3 text-amber-200" />
      </div>
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="cursor-trail-particle"
          style={{ left: particle.x, top: particle.y, '--particle-rotation': `${particle.rotation}deg` }}
        >
          {particle.symbol}
        </span>
      ))}
    </div>
  );
}
