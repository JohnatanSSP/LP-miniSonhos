'use client';
import React, { useEffect, useRef, useState } from 'react';

interface FairyDustCursorProps {
  colors?: string[];
  element?: HTMLElement;
  characterSet?: string[];
  particleSize?: number;
  particleCount?: number;
  gravity?: number;
  fadeSpeed?: number;
  initialVelocity?: { min: number; max: number };
}

interface Particle {
  x: number;
  y: number;
  character: string;
  color: string;
  velocity: { x: number; y: number };
  lifeSpan: number;
  initialLifeSpan: number;
  scale: number;
}

// Detecta se é dispositivo touch (mobile/tablet)
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

export const FairyDustCursor: React.FC<FairyDustCursorProps> = ({
  colors = ['#D61C59', '#E7D84B', '#1B8798'],
  element,
  characterSet = ['💜', '🩷'],
  particleSize = 21,
  particleCount = 1,
  gravity = 0.1,
  fadeSpeed = 0.98,
  initialVelocity = { min: 0.5, max: 2 },
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const cursorRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isTouch, setIsTouch] = useState(true); // começa como true para evitar flash no SSR

  useEffect(() => {
    // Desativa completamente em dispositivos touch (mobile/tablet)
    setIsTouch(isTouchDevice());

    const update = () => {
      setCanvasSize({
        width: element ? element.clientWidth : window.innerWidth,
        height: element ? element.clientHeight : window.innerHeight,
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [element]);

  useEffect(() => {
    if (isTouch || canvasSize.width === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const targetElement = element || document.body;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    let animationFrameId: number;

    const createParticle = (x: number, y: number): Particle => ({
      x,
      y,
      character: characterSet[Math.floor(Math.random() * characterSet.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: (Math.random() < 0.5 ? -1 : 1) *
          (Math.random() * (initialVelocity.max - initialVelocity.min) + initialVelocity.min),
        y: -(Math.random() * initialVelocity.max),
      },
      lifeSpan: 60,
      initialLifeSpan: 60,
      scale: 1,
    });

    const animate = () => {
      context.clearRect(0, 0, canvasSize.width, canvasSize.height);
      particlesRef.current.forEach((p) => {
        p.x += p.velocity.x;
        p.y += p.velocity.y;
        p.velocity.y += gravity;
        p.lifeSpan *= fadeSpeed;
        p.scale = Math.max(p.lifeSpan / p.initialLifeSpan, 0);
        context.save();
        context.font = `${particleSize * p.scale}px serif`;
        context.globalAlpha = p.scale;
        context.fillText(p.character, p.x, p.y);
        context.restore();
      });
      particlesRef.current = particlesRef.current.filter((p) => p.lifeSpan > 0.1);
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element ? targetElement.getBoundingClientRect() : undefined;
      const x = element ? e.clientX - rect!.left : e.clientX;
      const y = element ? e.clientY - rect!.top : e.clientY;
      cursorRef.current = { x, y };
      if (Math.hypot(x - lastPosRef.current.x, y - lastPosRef.current.y) > 2) {
        for (let i = 0; i < particleCount; i++) {
          particlesRef.current.push(createParticle(x, y));
        }
        lastPosRef.current = { x, y };
      }
    };

    // touchmove REMOVIDO — causava e.preventDefault() que bloqueava o scroll no mobile

    targetElement.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      targetElement.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors, element, characterSet, particleSize, particleCount, gravity, fadeSpeed, initialVelocity, canvasSize, isTouch]);

  // Não renderiza nada em dispositivos touch
  if (isTouch || canvasSize.width === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      style={{
        position: element ? 'absolute' : 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default FairyDustCursor;
