import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  isActive: boolean;
  particleCount?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ isActive, particleCount = 100 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // App theme colors
    const colors = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    // Create particles
    interface Particle {
      x: number;
      y: number;
      color: string;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        // Update position
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        // Fade out as particles fall
        if (p.y > canvas.height * 0.7) {
          p.opacity = Math.max(0, p.opacity - 0.02);
        }

        // Draw particle
        if (p.opacity > 0) {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }

        // Remove particles that are off screen
        if (p.y > canvas.height || p.opacity <= 0) {
          particles.splice(index, 1);
        }
      });

      // Continue animation if there are particles
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, particleCount]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default Confetti;