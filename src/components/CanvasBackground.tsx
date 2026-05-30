"use client";

import { useEffect, useRef } from "react";

interface CanvasBackgroundProps {
  isNight: boolean;
  treeLevel: number;
  loveEnergy: number;
}

export default function CanvasBackground({ isNight, treeLevel, loveEnergy }: CanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic density factor based on love energy and tree level
    const densityMultiplier = Math.min(1.5, 1 + loveEnergy / 500);

    // Particle classes
    class SakuraPetal {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      angle: number;
      angleSpeed: number;
      opacity: number;
      swing: number;
      swingSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height - 20;
        this.size = Math.random() * 8 + 6;
        this.speedX = Math.random() * 1.5 + 0.5; // Drift right
        this.speedY = Math.random() * 1.5 + 1.0; // Fall speed
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = Math.random() * 0.4 + 0.5;
        this.swing = Math.random() * Math.PI;
        this.swingSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.y += this.speedY;
        this.swing += this.swingSpeed;
        this.x += this.speedX + Math.sin(this.swing) * 0.6;
        this.angle += this.angleSpeed;

        // Reset if offscreen
        if (this.y > height || this.x > width + 20 || this.x < -20) {
          this.x = Math.random() * width;
          this.y = -20;
          this.speedX = Math.random() * 1.5 + 0.5;
          this.speedY = Math.random() * 1.5 + 1.0;
          this.opacity = Math.random() * 0.4 + 0.5;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        c.beginPath();

        // Draw a beautiful organic petal path
        c.moveTo(0, 0);
        c.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
        c.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);

        // Soft pastel pink gradient for blossom petals
        const grad = c.createRadialGradient(0, 0, 0, 0, 0, this.size);
        grad.addColorStop(0, `rgba(255, 182, 193, ${this.opacity})`); // LightPink
        grad.addColorStop(1, `rgba(255, 105, 180, ${this.opacity * 0.6})`); // HotPink
        c.fillStyle = grad;
        c.fill();
        c.restore();
      }
    }

    class Firefly {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      opacitySpeed: number;
      angle: number;
      angleSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1.5;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.opacitySpeed = (Math.random() - 0.5) * 0.02;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.03;
      }

      update() {
        this.x += this.speedX + Math.sin(this.angle) * 0.15;
        this.y += this.speedY + Math.cos(this.angle) * 0.15;
        this.angle += this.angleSpeed;

        this.opacity += this.opacitySpeed;
        if (this.opacity > 1 || this.opacity < 0.2) {
          this.opacitySpeed = -this.opacitySpeed;
        }

        // Keep inside screen boundaries
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        // Neon bioluminescent glowing yellow-green
        const glow = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
        glow.addColorStop(0, `rgba(173, 255, 47, ${this.opacity})`); // GreenYellow
        glow.addColorStop(0.3, `rgba(240, 230, 140, ${this.opacity * 0.4})`); // Khaki glow
        glow.addColorStop(1, "rgba(240, 230, 140, 0)");
        
        c.fillStyle = glow;
        c.fill();
        c.restore();
      }
    }

    class ShootingStar {
      x: number;
      y: number;
      length: number;
      speedX: number;
      speedY: number;
      opacity: number;
      active: boolean;

      constructor() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.length = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.opacity = 0;
      }

      trigger() {
        this.active = true;
        this.x = Math.random() * (width * 0.6); // Start on left side
        this.y = Math.random() * (height * 0.4); // Start in top half
        this.length = Math.random() * 80 + 50;
        this.speedX = Math.random() * 6 + 8; // Swift movement
        this.speedY = Math.random() * 4 + 5;
        this.opacity = 1;
      }

      update() {
        if (!this.active) return;

        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.02;

        if (this.opacity <= 0 || this.x > width || this.y > height) {
          this.active = false;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        if (!this.active) return;

        c.save();
        c.beginPath();
        c.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        c.lineWidth = 2;
        
        // Draw the shooting line with fading tail
        c.moveTo(this.x, this.y);
        c.lineTo(this.x - this.length * (this.speedX / 12), this.y - this.length * (this.speedY / 12));
        c.stroke();
        c.restore();
      }
    }

    // Populate particles
    const sakuraCount = Math.floor(40 * densityMultiplier);
    const fireflyCount = Math.floor(30 * densityMultiplier);

    const petals: SakuraPetal[] = [];
    const fireflies: Firefly[] = [];
    const shootingStars: ShootingStar[] = Array.from({ length: 3 }, () => new ShootingStar());

    for (let i = 0; i < sakuraCount; i++) {
      petals.push(new SakuraPetal());
    }
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push(new Firefly());
    }

    // Handle viewport resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (isNight) {
        // Night mode render
        // 1. Draw slow fireflies
        for (const f of fireflies) {
          f.update();
          f.draw(ctx);
        }

        // 2. Manage and draw shooting stars (trigger randomly)
        for (const s of shootingStars) {
          if (!s.active && Math.random() < 0.003) {
            s.trigger();
          }
          s.update();
          s.draw(ctx);
        }
      } else {
        // Day mode render
        // Draw falling sakura petals
        for (const p of petals) {
          p.update();
          p.draw(ctx);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isNight, treeLevel, loveEnergy]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-1000"
    />
  );
}
