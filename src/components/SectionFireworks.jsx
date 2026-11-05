import React, { useEffect, useRef } from 'react';

const COLORS = ['#fff7ed', '#fbcfe8', '#f9a8d4', '#fcd34d', '#c4b5fd'];
const TEXT_BAND_HEIGHT = 176;
const clamp = (value) => Math.min(1, Math.max(0, value));
const easeOut = (value) => 1 - (1 - value) ** 3;

function sampleText(text, width) {
  const mask = document.createElement('canvas');
  const maskContext = mask.getContext('2d', { willReadFrequently: true });
  if (!maskContext) return { mask: null, points: [] };

  mask.width = Math.max(1, Math.floor(width * 0.94));
  mask.height = TEXT_BAND_HEIGHT;
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

  maskContext.fillStyle = '#fbcfe8';
  maskContext.fillText(text, mask.width / 2, mask.height / 2, maxTextWidth);
  const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
  const step = width < 600 ? 4 : 6;
  const points = [];

  for (let y = 0; y < mask.height; y += step) {
    for (let x = 0; x < mask.width; x += step) {
      if (pixels[(y * mask.width + x) * 4 + 3] > 100) {
        points.push({
          x: (width - mask.width) / 2 + x,
          y,
          color: Math.floor(Math.random() * COLORS.length),
          radius: 2 + Math.random() * 1.1,
        });
      }
    }
  }

  return { mask, points };
}

export default function SectionFireworks({ text, triggerId, isActive }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !text || triggerId === 0 || !isActive) return undefined;

    const sectionHeight = canvas.parentElement?.clientHeight || window.innerHeight;
    const height = Math.min(sectionHeight, window.innerHeight);
    canvas.style.height = `${height}px`;
    const width = canvas.clientWidth;
    if (!width || !height) return undefined;

    const pixelBudgetRatio = Math.sqrt(800_000 / (width * height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25, pixelBudgetRatio);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    canvas.style.opacity = '1';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const starCount = reducedMotion ? 3 : 5;
    const fireworkStart = reducedMotion ? 520 : 1080;
    const explosionDuration = reducedMotion ? 280 : 400;
    const formationDelay = reducedMotion ? 210 : 280;
    const formationDuration = reducedMotion ? 500 : 800;
    const lifetime = reducedMotion ? 2200 : 3350;
    const frameInterval = reducedMotion ? 1000 / 30 : 1000 / 40;
    const textCenterY = TEXT_BAND_HEIGHT / 2;
    const startTime = performance.now();
    const { mask, points } = sampleText(text, width);
    const particles = points.map((point) => {
      const burstIndex = Math.min(2, Math.floor((point.x / width) * 3));
      const originX = width * (0.25 + burstIndex * 0.25);
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * Math.min(72, width * 0.14);

      return {
        ...point,
        scatterX: originX + Math.cos(angle) * distance,
        scatterY: textCenterY + Math.sin(angle) * distance,
      };
    });
    const particleGroups = COLORS.map((_, colorIndex) => particles.filter((particle) => particle.color === colorIndex));

    const shootingStars = Array.from({ length: starCount }, (_, index) => {
      const startX = width * (0.04 + Math.random() * 0.57);
      const startY = height * (0.06 + Math.random() * 0.84);
      const distance = width * (0.2 + Math.random() * 0.2);
      return {
        delay: index * (reducedMotion ? 110 : 135),
        duration: reducedMotion ? 360 : 520,
        startX,
        startY,
        endX: startX + distance,
        endY: Math.min(height - 4, startY + distance * 0.28),
        length: Math.min(180, width * 0.3),
      };
    });

    const bursts = Array.from({ length: 3 }, (_, burstIndex) => ({
      x: width * (0.25 + burstIndex * 0.25),
      y: textCenterY,
      color: COLORS[(burstIndex + 1) % COLORS.length],
      rays: Array.from({ length: 14 }, () => ({
        angle: Math.random() * Math.PI * 2,
        length: 38 + Math.random() * 48,
      })),
    }));

    let frameId;
    let previousRenderTime = 0;
    const releaseCanvas = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      canvas.width = 1;
      canvas.height = 1;
      canvas.style.height = '100%';
      canvas.style.opacity = '0';
    };

    const render = (now) => {
      if (now - previousRenderTime < frameInterval && elapsedNotOver(now)) {
        frameId = requestAnimationFrame(render);
        return;
      }
      previousRenderTime = now;
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
        gradient.addColorStop(0.42, `rgba(251,207,232,${opacity * 0.78})`);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.strokeStyle = gradient;
        context.lineWidth = 2.2;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(tailX, tailY);
        context.stroke();

        context.fillStyle = `rgba(255,255,255,${opacity})`;
        context.beginPath();
        context.arc(x, y, 2.4, 0, Math.PI * 2);
        context.fill();
      });

      if (elapsed >= fireworkStart) {
        const fireworkElapsed = elapsed - fireworkStart;
        const explosion = easeOut(clamp(fireworkElapsed / explosionDuration));
        const form = easeOut(clamp((fireworkElapsed - formationDelay) / formationDuration));
        const fade = 1 - easeOut(clamp((elapsed - lifetime + 450) / 450));

        if (fireworkElapsed < explosionDuration) {
          bursts.forEach((burst) => {
            const radius = 16 + explosion * 46;
            const glow = context.createRadialGradient(burst.x, burst.y, 0, burst.x, burst.y, radius);
            glow.addColorStop(0, `rgba(255,255,255,${(1 - explosion * 0.5) * 0.72 * fade})`);
            glow.addColorStop(0.24, `${burst.color}${Math.round((1 - explosion * 0.35) * 115).toString(16).padStart(2, '0')}`);
            glow.addColorStop(1, `${burst.color}00`);
            context.fillStyle = glow;
            context.beginPath();
            context.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
            context.fill();

            context.strokeStyle = burst.color;
            context.lineWidth = 1.8;
            context.globalAlpha = (1 - explosion * 0.55) * fade;
            burst.rays.forEach((ray) => {
              const rayLength = ray.length * explosion;
              context.beginPath();
              context.moveTo(burst.x, burst.y);
              context.lineTo(
                burst.x + Math.cos(ray.angle) * rayLength,
                burst.y + Math.sin(ray.angle) * rayLength
              );
              context.stroke();
            });
            context.globalAlpha = 1;
          });
        }

        if (form > 0.42 && mask) {
          context.globalAlpha = ((form - 0.42) / 0.58) * 0.3 * fade;
          context.drawImage(mask, (width - mask.width) / 2, 0);
          context.globalAlpha = 1;
        }

        for (let colorIndex = 0; colorIndex < COLORS.length; colorIndex += 1) {
          context.globalAlpha = (0.92 + Math.sin(elapsed * 0.006 + colorIndex) * 0.07) * fade;
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
        releaseCanvas();
      }
    };

    const elapsedNotOver = (now) => now - startTime < lifetime;
    frameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frameId);
      releaseCanvas();
    };
  }, [text, triggerId, isActive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full opacity-0 transition-opacity duration-300"
    />
  );
}
