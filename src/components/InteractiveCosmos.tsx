/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Volume2,
  VolumeX,
  X,
  Play,
  Pause,
  Compass,
  Zap,
  Globe,
  Loader,
  Sparkles
} from "lucide-react";

// Shared ambient space/cosmic tracks
const COSMIC_MUSIC_URL = "https://cdn.pixabay.com/audio/2021/11/25/audio_92bc49aa8a.mp3"; // Beautiful safe ambient space track

interface InteractiveCosmosProps {
  mode: "preview" | "fullscreen";
  onClose?: () => void;
  onOpenFullscreen?: () => void;
}

export default function InteractiveCosmos({
  mode,
  onClose,
  onOpenFullscreen
}: InteractiveCosmosProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [altitude, setAltitude] = useState(12800);
  const [activeRipple, setActiveRipple] = useState(false);

  // ALTITUDE TELEMETRY
  useEffect(() => {
    if (mode === "preview") return;
    const interval = setInterval(() => {
      setAltitude((prev) => prev + Math.floor(Math.random() * 8) - 3);
    }, 1000);
    return () => clearInterval(interval);
  }, [mode]);

  // HANDLE AUDIO ACTIONS
  useEffect(() => {
    if (mode === "preview") return;

    const audio = new Audio(COSMIC_MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.55;
    audioRef.current = audio;

    // Auto play when clicked on first interaction
    const playAudio = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio autoplay was prevented. Safe to proceed:", e));
      document.removeEventListener("click", playAudio);
    };
    document.addEventListener("click", playAudio);

    return () => {
      audio.pause();
      document.removeEventListener("click", playAudio);
    };
  }, [mode]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.warn(err));
    }
  };

  // WEBGL THREE.js ANIMATION CORE
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setLoading(true);

    const W = container.clientWidth || 300;
    const H = container.clientHeight || 300;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030b1a, mode === "preview" ? 0.015 : 0.0035);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      W / H,
      0.1,
      1000
    );

    if (mode === "preview") {
      camera.position.set(0, 3, 20);
    } else {
      camera.position.set(0, 8, 32);
    }
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x4fb3f6, 2.5, 100);
    pointLight.position.set(10, 20, 15);
    scene.add(pointLight);

    const pinkLight = new THREE.PointLight(0xa78bfa, 2, 50);
    pinkLight.position.set(-15, -10, -10);
    scene.add(pinkLight);

    // Create Cosmic Gradient Planet Texture
    const createPlanetTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // Fill a beautiful solid deep navy cosmic background space color first 
      // preventing any transparent corner holes wrapping on the sphere poles
      ctx.fillStyle = "#0c0a24";
      ctx.fillRect(0, 0, 512, 512);

      const gradient = ctx.createRadialGradient(256, 256, 64, 256, 256, 256);
      gradient.addColorStop(0.0, "#FFF0F5");  // Tâm phát sáng hồng tinh tế
      gradient.addColorStop(0.25, "#FFB6C1"); // Hồng pastel ngọt ngào
      gradient.addColorStop(0.35, "#FF99CC"); // Hồng baby nổi bật
      gradient.addColorStop(0.55, "#DDA0DD"); // Tím nhạt kẹo bông
      gradient.addColorStop(0.65, "#E1AAFF"); // Tím mộng mơ
      gradient.addColorStop(0.75, "#40e0d0"); // Xanh mòng két mướt mắt
      gradient.addColorStop(0.85, "#0099CC"); // Xanh đại dương thẳm thẳm
      gradient.addColorStop(1.0, "rgba(7, 22, 40, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      // Add astronomical storm clouds
      const cloudColors = [
        "#ffffff", 
        "#ffffff", 
        "#f06292", 
        "#f06292", 
        "#e0b3ff", 
        "#e1aaff", 
        "#87CEFA", 
        "#0099CC" 
      ];
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 30 + Math.random() * 120;
        const col = cloudColors[Math.floor(Math.random() * cloudColors.length)];
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, col + "cc");
        grad.addColorStop(1, col + "00");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);
      }

      // Draw gas stripes / curves on the planet surface
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        ctx.bezierCurveTo(
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512
        );
        ctx.strokeStyle = `rgba(180, 120, 200, ${0.12 + Math.random() * 0.18})`;
        ctx.lineWidth = 8 + Math.random() * 18;
        ctx.stroke();
      }

      const canvasTexture = new THREE.CanvasTexture(canvas);
      canvasTexture.wrapS = THREE.RepeatWrapping;
      canvasTexture.wrapT = THREE.RepeatWrapping;
      return canvasTexture;
    };

    const planetTexture = createPlanetTexture();

    // Living Gas planet mesh with custom twisty atmosphere distortion shader
    const planetGeometry = new THREE.SphereGeometry(mode === "preview" ? 4.5 : 8.5, 48, 48);
    const planetMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        baseTexture: { value: planetTexture }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform sampler2D baseTexture;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vec2 uv = vUv;
          // Apply twist planetary coordinate warp to simulate rotating storms
          float angle = length(uv - vec2(0.5)) * 3.0;
          float twist = sin(angle * 2.5 + time * 0.8) * 0.06;
          uv.x += twist * sin(time * 0.3);
          uv.y += twist * cos(time * 0.3);
          
          vec4 texColor = texture2D(baseTexture, uv);
          
          // Realistic custom volumetric lighting
          float dotNL = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0)));
          float light = max(dotNL * 0.6 + 0.4, 0.0);
          
          // Planet edge glow aura (with max(..., 0.0) guard avoiding GLSL pow negative NaN core blackouts!)
          float intensity = pow(max(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
          vec3 atmosphericGlow = vec3(0.88, 0.70, 1.0) * intensity * 0.85;
          
          gl_FragColor = vec4(texColor.rgb * light + atmosphericGlow, 1.0);
        }
      `
    });

    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);

    // Glowing core glow
    const glowGeo = new THREE.SphereGeometry(mode === "preview" ? 5.2 : 9.8, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          // Guarded power to prevent negative NaN issues in GLSL pow
          float intensity = pow(max(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
          gl_FragColor = vec4(0.88, 0.70, 1.0, 1.0) * intensity * 0.65;
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const planetOuterGlow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(planetOuterGlow);

    // Starfield particles background on fullscreen
    let starField: THREE.Points | null = null;
    if (mode === "fullscreen") {
      const starCount = 3500;
      const starGeo = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i++) {
        // Spherical distribution
        const r = 100 + Math.random() * 250;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPositions[i * 3 + 2] = r * Math.cos(phi);

        // Mix white, blue and warm golden stars
        const rand = Math.random();
        if (rand > 0.75) {
          starColors[i * 3] = 0.31; // #4fb3f6-ish
          starColors[i * 3 + 1] = 0.70;
          starColors[i * 3 + 2] = 0.96;
        } else if (rand > 0.5) {
          starColors[i * 3] = 0.96; // #fbbf24-ish
          starColors[i * 3 + 1] = 0.75;
          starColors[i * 3 + 2] = 0.15;
        } else {
          starColors[i * 3] = 1.0;
          starColors[i * 3 + 1] = 1.0;
          starColors[i * 3 + 2] = 1.0;
        }
      }

      starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
      starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

      const starMat = new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      starField = new THREE.Points(starGeo, starMat);
      scene.add(starField);
    }

    // Interactive Spinning Cylinder Text Rings
    const ringTexts = mode === "preview" 
      ? ["ACUET · RC · UET · VNU", "AEROSPACE CLB"]
      : ["CLB HÀNG KHÔNG VŨ TRỤ", "ACUET · GEN 7 · 2026", "TRƯỜNG ĐH CÔNG NGHỆ · VNU", "EXPLORE THE COSMOS"];

    const textRings: THREE.Group[] = [];

    const createTextRing = (text: string, radius: number, idx: number) => {
      const ringCanvas = document.createElement("canvas");
      ringCanvas.width = 1024;
      ringCanvas.height = 120;
      const ringCtx = ringCanvas.getContext("2d");
      if (!ringCtx) return;

      ringCtx.clearRect(0, 0, 1024, 120);
      ringCtx.font = "bold 44px 'Syne', sans-serif";
      ringCtx.textAlign = "center";
      ringCtx.textBaseline = "middle";

      // Neon glowing custom colors
      const neonColors = ["#4fb3f6", "#fbbf24", "#a78bfa", "#daeeff"];
      const col = neonColors[idx % neonColors.length];

      ringCtx.shadowColor = col;
      ringCtx.shadowBlur = 12;
      ringCtx.fillStyle = "#ffffff";
      ringCtx.strokeStyle = col;
      ringCtx.lineWidth = 3;

      // Duplicate text along ring circumference
      const repeatedText = `${text}  ✦  ${text}  ✦  `;
      ringCtx.fillText(repeatedText, 512, 60);
      ringCtx.strokeText(repeatedText, 512, 60);

      const texture = new THREE.CanvasTexture(ringCanvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = 2;

      const ringGeo = new THREE.CylinderGeometry(radius, radius, 1.4, 48, 1, true);
      const ringMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const mesh = new THREE.Mesh(ringGeo, ringMat);
      
      const group = new THREE.Group();
      group.add(mesh);
      
      // Random initial tilt
      group.rotation.x = Math.PI / 2.5 + (idx * 0.35);
      group.rotation.z = idx * 0.5;
      
      scene.add(group);
      textRings.push(group);
    };

    const initialRadius = mode === "preview" ? 6.8 : 12.5;
    const offsetLength = mode === "preview" ? 1.6 : 3.5;
    ringTexts.forEach((text, i) => {
      createTextRing(text, initialRadius + i * offsetLength, i);
    });

    // Fullscreen dust / nebula cloud particles
    let galaxyDust: THREE.Points | null = null;
    if (mode === "fullscreen") {
      const dustCount = 8000;
      const dustGeo = new THREE.BufferGeometry();
      const dustPos = new Float32Array(dustCount * 3);
      const dustColors = new Float32Array(dustCount * 3);

      for (let i = 0; i < dustCount; i++) {
        // Create 4 spiral arms
        const distance = 10 + Math.random() * 80;
        const armIndex = i % 4;
        const angle = (armIndex * Math.PI / 2) + distance * 0.08 + (Math.random() - 0.5) * 0.45;

        dustPos[i * 3] = Math.cos(angle) * distance;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
        dustPos[i * 3 + 2] = Math.sin(angle) * distance;

        // Custom pink/cyan space nebula tone
        const isPink = Math.random() > 0.54;
        if (isPink) {
          dustColors[i * 3] = 0.65; // pinkish purple
          dustColors[i * 3 + 1] = 0.54;
          dustColors[i * 3 + 2] = 0.98;
        } else {
          dustColors[i * 3] = 0.31; // cyber cyan blue
          dustColors[i * 3 + 1] = 0.70;
          dustColors[i * 3 + 2] = 0.96;
        }
      }

      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
      dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

      const dustMat = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });

      galaxyDust = new THREE.Points(dustGeo, dustMat);
      scene.add(galaxyDust);
    }

    // Shooting stars
    const shootingStars: { mesh: THREE.Line; age: number; maxAge: number; vx: number; vy: number; vz: number }[] = [];
    const spawnShootingStar = () => {
      if (mode === "preview" && Math.random() > 0.1) return;

      const starPoints = [];
      const origin = new THREE.Vector3(
        (Math.random() - 0.5) * 120,
        30 + Math.random() * 20,
        (Math.random() - 0.5) * 120
      );

      starPoints.push(origin);
      starPoints.push(origin.clone().add(new THREE.Vector3(-12, -8, -12)));

      const starLineGeo = new THREE.BufferGeometry().setFromPoints(starPoints);
      const starLineMat = new THREE.LineBasicMaterial({
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });

      const mesh = new THREE.Line(starLineGeo, starLineMat);
      scene.add(mesh);

      shootingStars.push({
        mesh,
        age: 0,
        maxAge: 40 + Math.random() * 40,
        vx: -0.4 - Math.random() * 0.4,
        vy: -0.3 - Math.random() * 0.3,
        vz: -0.4 - Math.random() * 0.4
      });
    };

    setLoading(false);

    // ANIMATION LOOP
    let timerID: number;
    const clock = new THREE.Clock();

    const animate = () => {
      timerID = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Rotate planet
      planet.rotation.y = elapsed * 0.12;
      planetMaterial.uniforms.time.value = elapsed * 0.4;

      // Spin text rings
      textRings.forEach((ring, idx) => {
        // Alternate rotational directions
        const spinSign = idx % 2 === 0 ? 1 : -1;
        ring.rotation.y = elapsed * (0.07 + idx * 0.02) * spinSign;
        // Subtle floating wave
        ring.position.y = Math.sin(elapsed * 1.5 + idx * 0.8) * (mode === "preview" ? 0.25 : 0.65);
      });

      // Ambient celestial rotations
      if (starField) {
        starField.rotation.y = elapsed * 0.005;
      }
      if (galaxyDust) {
        galaxyDust.rotation.y = elapsed * 0.015;
      }

      // Animate shooting stars
      if (Math.random() < 0.015) {
        spawnShootingStar();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.age++;
        star.mesh.position.x += star.vx;
        star.mesh.position.y += star.vy;
        star.mesh.position.z += star.vz;

        // fade out
        if (star.mesh.material instanceof THREE.LineBasicMaterial) {
          star.mesh.material.opacity = (1 - star.age / star.maxAge) * 0.9;
        }

        if (star.age >= star.maxAge) {
          scene.remove(star.mesh);
          shootingStars.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(timerID);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [mode]);

  return (
    <div className="relative w-full h-full group" id="threejs-cosmos">
      {/* Target Canvas Container */}
      <div
        ref={mountRef}
        onClick={() => {
          if (mode === "preview" && onOpenFullscreen) {
            onOpenFullscreen();
          }
        }}
        className={`w-full h-full overflow-hidden ${
          mode === "preview" 
            ? "cursor-pointer active:scale-95 transition-transform duration-200" 
            : "cursor-default"
        }`}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#030b1a]/40 z-10">
          <Loader className="w-8 h-8 text-[#4fb3f6] animate-spin" />
        </div>
      )}

      {/* FULLSCREEN EXCLUSIVE CONTROLS */}
      {mode === "fullscreen" && (
        <>
          {/* Header Back Button */}
          <div className="absolute top-6 left-6 z-50 flex items-center gap-3">
            <button
              onClick={onClose}
              className="group/btn cursor-pointer inline-flex items-center justify-center p-3 rounded-xl bg-slate-950/80 border border-[#4fb3f6]/15 hover:border-[#4fb3f6]/50 hover:bg-[#05111f] text-[#7fa8c9] hover:text-white shadow-xl transition-all font-syne font-semibold text-xs tracking-wider uppercase gap-1.5"
            >
              <X className="w-4 h-4 transition-transform group-hover/btn:rotate-90" />
              <span>Quay về trang chủ</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] text-[#3a6080] bg-slate-950/45 px-3 py-1.5 rounded-lg border border-[#4fb3f6]/5 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>COSMOS NAV LIVE</span>
            </div>
          </div>

          {/* Audio controller */}
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={togglePlayback}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-slate-950/85 hover:bg-[#05111f] border border-[#4fb3f6]/15 hover:border-[#4fb3f6]/40 text-[#daeeff] hover:text-white rounded-xl shadow-xl transition-all"
              title="Phát/Mute nhạc nền vũ trụ"
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#4fb3f6] animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase hidden md:inline">SOUND: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#3a6080]" />
                  <span className="text-xs font-mono font-medium tracking-wider uppercase text-[#7fa8c9] hidden md:inline">SOUND: MUTED</span>
                </>
              )}
            </button>
          </div>

          {/* Left Corner Floating Status Widget */}
          <div className="absolute bottom-6 left-6 z-40 hidden md:block max-w-xs font-syne space-y-4">
            <div className="bg-[#060f1e]/85 backdrop-blur-md border border-[#4fb3f6]/15 rounded-xl p-4 shadow-2xl pointer-events-none transition-all hover:border-[#4fb3f6]/40 space-y-2">
              <div className="flex items-center justify-between pointer-events-none">
                <span className="font-mono text-[9px] text-[#3a6080] tracking-widest block uppercase font-bold">TELESCOPE ALTITUDE</span>
                <span className="bg-[#4fb3f6]/10 text-[#4fb3f6] text-[8px] font-mono px-1.5 py-0.5 rounded border border-[#4fb3f6]/15 uppercase">SYNCED</span>
              </div>
              <p className="font-exo font-bold text-lg text-white leading-none tracking-tight">
                {altitude.toLocaleString()} KM <span className="text-[11px] text-[#fbbf24] font-normal font-mono">L.O.E.</span>
              </p>
              <p className="text-[10px] text-[#7fa8c9] leading-relaxed">
                Tọa kính thiên văn phản xạ ACUET nhịp nhàng quan sát dải Ngân Hà rực rỡ và tinh vân Cosmic Slate.
              </p>
            </div>
          </div>

          {/* Right Corner Interactive wordle short launcher */}
          <div className="absolute bottom-6 right-6 z-40 max-w-sm pointer-events-auto">
            <div className="bg-[#060f1e]/85 backdrop-blur-md border border-[#f5a623]/22 rounded-xl p-4 shadow-2xl space-y-2.5">
              <div className="flex items-center gap-1.5 justify-between">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#fbbf24] animate-spin" />
                  <span className="font-mono text-[8px] text-[#3a6080] tracking-widest block uppercase font-bold">AEROSPACE TRIVIA</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5 font-syne">Khám phá Mini-Game giải mã</h4>
                <p className="text-[10px] text-[#7fa8c9] leading-relaxed">
                  Thiết kế để thử thách trí thông minh thiên văn của bạn ngay ngoài không gian vũ trụ này!
                </p>
              </div>
            </div>
          </div>

          {/* Cosmic Center Heading Title Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-6 z-10">
            <h1 className="font-exo font-black text-4xl sm:text-6xl text-white tracking-widest uppercase mb-1 drop-shadow-2xl select-none opacity-85 select-none animate-pulse">
              CUTENIVERSE
            </h1>
            <p className="font-mono text-[9px] sm:text-xs text-[#4fb3f6] tracking-[4px] uppercase select-none opacity-75">
              Tinh Cầu Không Gian ACUET · RC · UET · VNU
            </p>
          </div>
        </>
      )}

      {/* Preview click instruction banner overlay */}
      {mode === "preview" && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-[#030b1a]/40 backdrop-blur-[2px] transition-all duration-300 pointer-events-none rounded-2xl border border-[#4fb3f6]/20">
          <div className="text-center p-4 space-y-1.5 pointer-events-none">
            <span className="bg-[#fbbf24] text-slate-950 font-bold px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider">CLICK TO LAUNCH</span>
            <p className="font-exo font-bold text-xs text-white uppercase tracking-wider">Chạm vào tinh cầu</p>
            <p className="text-[9px] text-[#7fa8c9] font-mono">Quan sát 3D Cuteniverse toàn màn hình</p>
          </div>
        </div>
      )}
    </div>
  );
}
