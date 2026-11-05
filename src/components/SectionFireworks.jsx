import React, { useEffect, useRef } from 'react';

const COLORS = ['#fff7ed', '#fbcfe8', '#f9a8d4', '#fcd34d', '#c4b5fd'];
const clamp = (value) => Math.min(1, Math.max(0, value));
const easeOut = (value) => 1 - (1 - value) ** 3;

function sampleText(text, width, height) {
  const mask = document.createElement('canvas');
  const maskContext = mask.getContext('2d', { willReadFrequently: true });
  if (!maskContext) return [];

  mask.width = Math.max(1, Math.floor(width * 0.94));
  mask.height = height;
  let fontSize = Math.min(74, Math.max(24, width * 0.095));
  const maxTextWidth = mask.width * 0.96;
  maskContext.textAlign = 'center';
  maskContext.textBaseline = 'middle';
  maskContext.font = `600 ${fontSize}px "Cormorant Garamond", Georgia, serif`;

  const measuredWidth = maskContext.measureText(text).width;
  if (measuredWidth > maxTextWidth) {
    fontSize *= maxTextWidth / measuredWidth;
    maskContext.font = `600 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
  }

  maskContext.fillStyle = '#fff';
  maskContext.fillText(text, mask.width / 2, mask.height / 2, maxTextWidth);
  const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
  const step = width < 600 ? 6 : 11;
  const points = [];

  for (let y = 0; y < mask.height; y += step) {
    for (let x = 0; x < mask.width; x += step) {
      if (pixels[(y * mask.width + x) * 4 + 3] > 110) {
        points.push({
          x: (width - mask.width) / 2 + x,
          y,
          color: Math.floor(Math.random() * COLORS.length),
          radius: 1.15 + Math.random() * 0.75,
        });
      }
    }
  }

  return points;
}

export default function SectionFireworks({ text, triggerId }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !text || triggerId === 0) return undefined;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return undefined;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    canvas.style.opacity = '1';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fireworkStart = reducedMotion ? 340 : 580;
    const explosionDuration = reducedMotion ? 220 : 340;
    const formationDelay = reducedMotion ? 180 : 260;
    const formationDuration = reducedMotion ? 440 : 760;
    const lifetime = reducedMotion ? 1600 : 2700;
    const startTime = performance.now();
    const particles = sampleText(text, width, height).map((point) => {
      const burstIndex = Math.min(2, Math.floor((point.x / width) * 3));
      const originX = width * (0.25 + burstIndex * 0.25);
      const originY = height * 0.52;
      const angle = Math.random() * Math.PI * 2;
      const distance = 24 + Math.random() * Math.min(64, width * 0.12);

      return {
        ...point,
        x: point.x,
        y: point.y,
        scatterX: originX + Math.cos(angle) * distance,
        scatterY: originY + Math.sin(angle) * distance,
      };
    });
    const particleGroups = COLORS.map((_, colorIndex) => particles.filter((particle) => particle.color === colorIndex));

    const shootingStars = Array.from({ length: 3 }, (_, index) => {
      const startX = width * (0.08 + Math.random() * 0.5);
      const startY = height * (0.12 + Math.random() * 0.3);
      const distance = width * (0.18 + Math.random() * 0.2);
      return {
        delay: index * 130,
        duration: reducedMotion ? 290 : 470,
        startX,
        startY,
        endX: startX + distance,
        endY: Math.min(height - 4, startY + distance * 0.24),
        length: Math.min(85, width * 0.22),
      };
    });

    let frameId;
    const render = (now) => {
      const elapsed = now - startTime;
      context.clearRect(0, 0, width, height);

      shootingStars.forEach((star) => {
        const progress = clamp((elapsed - star.delay) / star.duration);
        if (progress <= 0 || progress >= 1) return;

        const x = star.startX + (star.endX - star.startX) * progress;
        const y = star.startY + (star.endY - star.startY) * progress;
        const opacity = Math.sin(progress * Math.PI);
        const angle = Math.atan2(star.endY - star.startY, star.endX - star.startX);
        const tailX = x - Math.cos(angle) * star.length;
        const tailY = y - Math.sin(angle) * star.length;
        const gradient = context.createLinearGradient(x, y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255,255,255,${opacity})`);
        gradient.addColorStop(0.5, `rgba(251,207,232,${opacity * 0.55})`);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.strokeStyle = gradient;
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(tailX, tailY);
        context.stroke();
      });

      if (elapsed >= fireworkStart) {
        const fireworkElapsed = elapsed - fireworkStart;
        const explosion = easeOut(clamp(fireworkElapsed / explosionDuration));
        const form = easeOut(clamp((fireworkElapsed - formationDelay) / formationDuration));
        const fade = 1 - easeOut(clamp((elapsed - lifetime + 430) / 430));

        if (fireworkElapsed < explosionDuration) {
          for (let burstIndex = 0; burstIndex < 3; burstIndex += 1) {
            const burstX = width * (0.25 + burstIndex * 0.25);
            const burstY = height * 0.52;
            const radius = 10 + explosion * 32;
            const glow = context.createRadialGradient(burstX, burstY, 0, burstX, burstY, radius);
            glow.addColorStop(0, `rgba(255,255,255,${(1 - explosion) * 0.45 * fade})`);
            glow.addColorStop(0.3, `rgba(249,168,212,${(1 - explosion) * 0.2 * fade})`);
            glow.addColorStop(1, 'rgba(249,168,212,0)');
            context.fillStyle = glow;
            context.beginPath();
            context.arc(burstX, burstY, radius, 0, Math.PI * 2);
            context.fill();
          }
        }

        for (let colorIndex = 0; colorIndex < COLORS.length; colorIndex += 1) {
          const groupOpacity = (0.78 + Math.sin(elapsed * 0.008 + colorIndex) * 0.12) * fade;
          context.globalAlpha = groupOpacity;
          context.fillStyle = COLORS[colorIndex];
          context.beginPath();

          particleGroups[colorIndex].forEach((particle) => {
            const x = particle.scatterX + (particle.x - particle.scatterX) * form;
            const y = particle.scatterY + (particle.y - particle.scatterY) * form;
            context.moveTo(x + particle.radius, y);
            context.arc(x, y, particle.radius, 0, Math.PI * 2);
          });

          context.fill();
        }
        context.globalAlpha = 1;
      }

      if (elapsed < lifetime) {
        frameId = requestAnimationFrame(render);
      } else {
        context.clearRect(0, 0, width, height);
        canvas.style.opacity = '0';
      }
    };

    frameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frameId);
      context.clearRect(0, 0, width, height);
      canvas.style.opacity = '0';
    };
  }, [text, triggerId]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-[5] h-[176px] w-full opacity-0 transition-opacity duration-300"
    />
  );
}
