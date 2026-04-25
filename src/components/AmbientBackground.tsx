import { useEffect, useRef } from 'react';

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number, particles: any[];

    function init() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];

      const particleCount = Math.min(window.innerWidth / 10, 150);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.5 + 0.1,
        });
      }
    }

    let animationFrameId: number;

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx!.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Noise Texture */}
      <div className="fixed inset-0 z-[-3] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
      
      {/* Base Gradient */}
      <div className="fixed inset-0 z-[-4] bg-[#050505]"></div>

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        id="particle-canvas"
        className="fixed inset-0 pointer-events-none z-[-2] opacity-40"
      ></canvas>

      {/* Animated Orbs/Beams */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        {/* Large slow pulsing orbs */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-white/5 blur-[120px] animate-pulse"
          style={{ animationDuration: '10s' }}
        ></div>
        <div
          className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-white/[0.03] blur-[100px] animate-pulse"
          style={{ animationDuration: '15s', animationDelay: '2s' }}
        ></div>

        {/* Dynamic sweeping rays */}
        <div className="absolute -top-[10%] -left-[10%] w-[100vw] h-[30vh] bg-gradient-to-r from-white/10 via-white/5 to-transparent blur-[80px] origin-top-left animate-ray-sweep"></div>
        <div
          className="absolute -top-[5%] -left-[5%] w-[80vw] h-[15vh] bg-gradient-to-r from-white/15 via-white/5 to-transparent blur-[40px] origin-top-left animate-ray-sweep-2"
          style={{ animationDelay: '1.5s' }}
        ></div>
        
        {/* Core center beam */}
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[50vw] h-[80vh] bg-gradient-to-b from-white/5 via-white/[0.02] to-transparent blur-[100px] origin-top animate-center-beam"></div>
      </div>
    </>
  );
}
