import React, { useEffect, useRef } from 'react';

const PALETTE = ['#fff7ed', '#fbcfe8', '#f9a8d4', '#fcd34d', '#c4b5fd', '#ffffff'];
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOut = (value) => 1 - (1 - value) ** 3;

function createTextParticles(text, width, height) {
  const mask = document.createElement('canvas');
  const maskContext = mask.getContext('2d', { willReadFrequently: true });
  if (!maskContext) return [];

  mask.width = Math.max(1, Math.floor(width * 0.9));
  mask.height = 180;
  let fontSize = Math.min(76, Math.max(27, width * 0.095));
  maskContext.textAlign = 'center';
  maskContext.textBaseline = 'middle';
  maskContext.font = `600 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
  const measuredWidth = maskContext.measureText(text).width;
  const maxTextWidth = mask.width * 0.94;
  if (measuredWidth > maxTextWidth) {
    fontSize *= maxTextWidth / measuredWidth;
    maskContext.font = `600 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
  }

  maskContext.fillStyle = '#fff';
  maskContext.fillText(text, mask.width / 2, mask.height / 2, maxTextWidth);
  const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
  const step = width < 520 ? 3 : 4;
  const textCenterY = Math.min(120, Math.max(76, height * 0.115));
  const points = [];

  for (let y = 0; y < mask.height; y += step) {
    for (let x = 0; x < mask.width; x += step) {
      if (pixels[(y * mask.width + x) * 4 + 3] > 110) {
        points.push({
          x: (width - mask.width) / 2 + x,
          y: textCenterY - mask.height / 2 + y,
        });
      }
    }
  }

  return points;
}

export default function SectionFireworks({ transition }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !transition?.text) return undefined;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    canvas.style.opacity = '1';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const textCenterY = Math.min(120, Math.max(76, height * 0.115));
    const startTime = performance.now();
    const lifetime = reducedMotion ? 3600 : 5300;
    const particles = createTextParticles(transition.text, width, height).map((point) => {
      const relativeX = clamp(point.x / width);
      const burstIndex = Math.min(2, Math.floor(relativeX * 3));
      const originX = width * (0.25 + burstIndex * 0.25);
      const originY = height * 0.3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 65 + Math.random() * Math.min(125, width * 0.2);

      return {
        ...point,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        size: 0.8 + Math.random() * 1.5,
        scatterX: originX + Math.cos(angle) * radius,
        scatterY: originY + Math.sin(angle) * radius,
        twinkle: Math.random() * Math.PI * 2,
      };
    });

    const shootingStars = Array.from({ length: 4 }, (_, index) => {
      const startX = width * (0.06 + Math.random() * 0.55);
      const startY = height * (0.08 + Math.random() * 0.28);
      const distance = width * (0.22 + Math.random() * 0.24);
      return {
        delay: index * 180,
        duration: 620 + Math.random() * 240,
        startX,
        startY,
        endX: startX + distance,
        endY: startY + distance * (0.35 + Math.random() * 0.3),
        length: 90 + Math.random() * 80,
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
        gradient.addColorStop(0.45, `rgba(251,207,232,${opacity * 0.65})`);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        context.save();
        context.strokeStyle = gradient;
        context.lineWidth = 2;
        context.shadowBlur = 12;
        context.shadowColor = '#fbcfe8';
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(tailX, tailY);
        context.stroke();
        context.restore();
      });

      if (elapsed > 850) {
        const fireworkElapsed = elapsed - 850;
        const explosionProgress = easeOut(clamp(fireworkElapsed / 520));
        const formProgress = easeOut(clamp((fireworkElapsed - 480) / 900));
        const fade = 1 - easeOut(clamp((elapsed - lifetime + 850) / 850));

        for (let burstIndex = 0; burstIndex < 3; burstIndex += 1) {
          const burstX = width * (0.25 + burstIndex * 0.25);
          const burstY = textCenterY;
          const bloomRadius = 12 + explosionProgress * (42 + burstIndex * 7);
          const bloom = context.createRadialGradient(burstX, burstY, 0, burstX, burstY, bloomRadius);
          bloom.addColorStop(0, `rgba(255,255,255,${(1 - explosionProgress) * 0.62 * fade})`);
          bloom.addColorStop(0.18, `rgba(249,168,212,${(1 - explosionProgress) * 0.24 * fade})`);
          bloom.addColorStop(1, 'rgba(249,168,212,0)');
          context.fillStyle = bloom;
          context.beginPath();
          context.arc(burstX, burstY, bloomRadius, 0, Math.PI * 2);
          context.fill();
        }

        particles.forEach((particle) => {
          const x = particle.scatterX + (particle.x - particle.scatterX) * formProgress;
          const y = particle.scatterY + (particle.y - particle.scatterY) * formProgress;
          const twinkle = 0.68 + Math.sin(elapsed * 0.009 + particle.twinkle) * 0.24;
          const alpha = clamp((fireworkElapsed + 80) / 260) * fade * twinkle;

          context.save();
          context.globalAlpha = alpha;
          context.fillStyle = particle.color;
          context.shadowBlur = formProgress > 0.72 ? 10 : 7;
          context.shadowColor = particle.color;
          context.beginPath();
          context.arc(x, y, particle.size, 0, Math.PI * 2);
          context.fill();
          context.restore();
        });
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
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.opacity = '0';
    };
  }, [transition?.id, transition?.text]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none opacity-0 transition-opacity duration-500"
    />
  );
}
