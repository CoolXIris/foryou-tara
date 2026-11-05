import React, { useEffect, useRef } from 'react';

export default function BackgroundStars({ isFinaleMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars collection
    const numStars = 140;
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.3 ? '#ffffff' : Math.random() > 0.5 ? '#fbcfe8' : '#fed7aa',
    }));

    // Soft floating glowing dust/particles
    const numDust = 25;
    const dustParticles = Array.from({ length: numDust }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    // Let occasional shooting stars travel at a consistent speed across displays.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let shootingStar = null;
    let previousFrameTime = 0;
    let nextShootingStarTime = performance.now() + 2800 + Math.random() * 4200;

    const render = (now) => {
      const frameScale = previousFrameTime ? Math.min((now - previousFrameTime) / (1000 / 60), 2) : 1;
      previousFrameTime = now;
      ctx.clearRect(0, 0, width, height);

      // Render stars
      stars.forEach((star) => {
        star.alpha += star.speed * star.direction;
        if (star.alpha > 0.95 || star.alpha < 0.15) {
          star.direction *= -1;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha * (isFinaleMode ? 0.9 : 0.6);
        ctx.shadowBlur = star.radius > 1 ? 6 : 2;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.restore();
      });

      // Render floating ambient dust
      dustParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isFinaleMode ? '#e9d5ff' : '#f472b6';
        ctx.globalAlpha = p.opacity * (isFinaleMode ? 0.4 : 0.3);
        ctx.shadowBlur = 10;
        ctx.shadowColor = isFinaleMode ? '#a855f7' : '#ec4899';
        ctx.fill();
        ctx.restore();
      });

      // Handle shooting star
      if (!prefersReducedMotion && !shootingStar && now > nextShootingStarTime) {
        shootingStar = {
          x: Math.random() * width * 0.65,
          y: Math.random() * (height * 0.55),
          len: Math.random() * 90 + 100,
          speed: Math.random() * 4 + 7,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          opacity: 1,
        };
      }

      if (shootingStar) {
        const dx = Math.cos(shootingStar.angle) * shootingStar.speed * frameScale;
        const dy = Math.sin(shootingStar.angle) * shootingStar.speed * frameScale;
        shootingStar.x += dx;
        shootingStar.y += dy;
        shootingStar.opacity -= 0.012 * frameScale;

        ctx.save();
        const grad = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.len,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.len
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, ' + shootingStar.opacity + ')');
        grad.addColorStop(0.5, 'rgba(251, 207, 232, ' + shootingStar.opacity * 0.6 + ')');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.len,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.len
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(shootingStar.x, shootingStar.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#fbcfe8';
        ctx.fill();
        ctx.restore();

        if (shootingStar.opacity <= 0) {
          shootingStar = null;
          nextShootingStarTime = now + 4200 + Math.random() * 5200;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isFinaleMode]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${
        isFinaleMode ? 'opacity-90' : 'opacity-60'
      }`}
    />
  );
}
