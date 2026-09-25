import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  flicker: boolean;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  exploded: boolean;
}

const PALETTE = [
  '#FFDF00', // Brazil Gold
  '#009C3B', // Brazil Emerald
  '#00D26A', // Bright Green
  '#2563EB', // Royal Blue
  '#38BDF8', // Sky Blue
  '#F59E0B', // Warm Amber
  '#EC4899', // Pink Spark
  '#F43F5E', // Rose
  '#A855F7', // Purple
  '#FFFFFF', // White Spark
];

export const FireworksCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const rockets: Rocket[] = [];
    const particles: Particle[] = [];

    // Helper: spawn explosion particles
    const explode = (x: number, y: number, color: string) => {
      const particleCount = 65 + Math.floor(Math.random() * 40);
      const baseColor = color;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
        const speed = 2 + Math.random() * 6;
        const pColor = Math.random() > 0.25 ? baseColor : PALETTE[Math.floor(Math.random() * PALETTE.length)];

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.018,
          color: pColor,
          size: 2 + Math.random() * 2.5,
          flicker: Math.random() > 0.5,
        });
      }
    };

    // Helper: launch a rocket
    const launchRocket = (startX?: number, targetX?: number, targetY?: number) => {
      const sx = startX !== undefined ? startX : width * 0.15 + Math.random() * (width * 0.7);
      const ty = targetY !== undefined ? targetY : height * 0.15 + Math.random() * (height * 0.35);
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];

      rockets.push({
        x: sx,
        y: height,
        targetY: ty,
        vy: -7 - Math.random() * 4,
        color,
        exploded: false,
      });
    };

    // Initial burst immediately
    explode(width * 0.5, height * 0.3, '#FFDF00');
    explode(width * 0.3, height * 0.38, '#009C3B');
    explode(width * 0.7, height * 0.38, '#38BDF8');

    // Interval to spawn rockets
    let lastSpawn = 0;
    const spawnInterval = 450; // ms

    // Click on screen to trigger immediate firework
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      explode(clientX, clientY, PALETTE[Math.floor(Math.random() * PALETTE.length)]);
    };
    window.addEventListener('mousedown', handlePointerDown);

    // Animation Loop
    const render = (time: number) => {
      // Clear with subtle fade trail for smooth light sparks
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';

      // Launch rockets periodically
      if (time - lastSpawn > spawnInterval) {
        lastSpawn = time;
        launchRocket();
        if (Math.random() > 0.5) {
          launchRocket();
        }
      }

      // Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;

        // Sparkle tail
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        if (r.y <= r.targetY) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= 0.96; // friction
        p.vy *= 0.96;
        p.vy += 0.06; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.flicker && Math.random() > 0.4 ? p.alpha * 0.6 : p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="victory-fireworks-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};
