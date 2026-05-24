/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  da: number;
  vx: number;
  vy: number;
  col: string;
  maxA: number;
}

export default function StarfieldBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = container.offsetWidth);
    let H = (canvas.height = container.offsetHeight || 2000);
    let stars: Star[] = [];
    let animationFrameId: number;

    const initStars = () => {
      stars = [];
      const layers = [
        { n: 120, minR: 0.3, maxR: 0.8, speed: 0.08, col: "rgba(180,215,255," },
        { n: 60, minR: 0.6, maxR: 1.2, speed: 0.15, col: "rgba(210,235,255," },
        { n: 30, minR: 0.8, maxR: 1.8, speed: 0.25, col: "rgba(240,248,255," },
      ];

      layers.forEach((l) => {
        for (let i = 0; i < l.n; i++) {
          stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: l.minR + Math.random() * (l.maxR - l.minR),
            a: Math.random(),
            da: (Math.random() - 0.5) * 0.004,
            vx: (Math.random() - 0.5) * l.speed,
            vy: Math.random() * l.speed * 0.5,
            col: l.col,
            maxA: 0.6 + Math.random() * 0.4,
          });
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.a += s.da;

        if (s.a > s.maxA || s.a < 0) {
          s.da *= -1;
        }

        // wrap coordinates
        if (s.x < 0) s.x = W;
        if (s.x > W) s.x = 0;
        if (s.y > H) s.y = 0;
        if (s.y < 0) s.y = H;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.col + Math.max(0, s.a) + ")";
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    initStars();
    draw();

    // Use ResizeObserver to reliably handle canvas dimensions without page flickering
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        W = canvas.width = width;
        H = canvas.height = height || 2000;
        initStars();
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1] overflow-hidden"
      id="starfield-container"
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-[150%]" />
    </div>
  );
}
