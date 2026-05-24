import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let planet, particles, stardust;
let textRings = [];

function init() {
  const container = document.getElementById('container');
  if (!container) return;

  // Scene setup
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050518, 0.005);

  // Camera setup
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 15, 35);

  // Renderer space
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // Orbit controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 150;
  controls.minDistance = 10;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.15;

  // Ambient lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  // Dir lights for highlights
  const cyanLight = new THREE.DirectionalLight(0x4fb3f6, 1.8);
  cyanLight.position.set(15, 25, 10);
  scene.add(cyanLight);

  const purpleLight = new THREE.DirectionalLight(0xa78bfa, 1.5);
  purpleLight.position.set(-15, -15, -10);
  scene.add(purpleLight);

  const warmPulse = new THREE.PointLight(0xf5a623, 2, 80);
  warmPulse.position.set(0, 0, 0);
  scene.add(warmPulse);

  // Core Celestial Body (The Planet)
  const planetGeo = new THREE.SphereGeometry(6, 64, 64);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0, '#0d1e3d');
    grad.addColorStop(0.3, '#102e5c');
    grad.addColorStop(0.75, '#4fb3f6');
    grad.addColorStop(0.95, '#a78bfa');
    grad.addColorStop(1, '#050c1e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Add noise patterns for realistic planet mapping
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const rSize = 2 + Math.random() * 20;
      ctx.beginPath();
      ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const planetTex = new THREE.CanvasTexture(canvas);
  const planetMat = new THREE.MeshStandardMaterial({
    map: planetTex,
    roughness: 0.35,
    metalness: 0.15,
    bumpScale: 0.05,
    emissive: 0x031330,
    emissiveIntensity: 0.45
  });

  planet = new THREE.Mesh(planetGeo, planetMat);
  scene.add(planet);

  // Glowing Atmosphere Aura Shell
  const atmosphereGeo = new THREE.SphereGeometry(6.4, 32, 32);
  const atmosphereMat = new THREE.MeshBasicMaterial({
    color: 0x4fb3f6,
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  planet.add(atmosphere);

  // GORGEOUS SPIRAL GALAXY SPACE DUST
  const dustParticles = 2800;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustParticles * 3);
  const dustColors = new Float32Array(dustParticles * 3);

  for (let i = 0; i < dustParticles; i++) {
    const radius = 9 + Math.random() * 45;
    const armIndex = i % 3;
    const angle = (armIndex * Math.PI * 2 / 3) + (radius * 0.09) + (Math.random() - 0.5) * 0.5;

    dustPos[i * 3] = Math.cos(angle) * radius;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
    dustPos[i * 3 + 2] = Math.sin(angle) * radius;

    // Rich dual nebular styling
    const isPink = Math.random() > 0.45;
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

  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

  const dustMat = new THREE.PointsMaterial({
    size: 0.65,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  stardust = new THREE.Points(dustGeo, dustMat);
  scene.add(stardust);

  // DEEP COMBUSTIBLE STARFIELD FIELD
  const starCount = 1500;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    starPos[i] = (Math.random() - 0.5) * 400;
    starPos[i + 1] = (Math.random() - 0.5) * 400;
    starPos[i + 2] = (Math.random() - 0.5) * 400;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.35,
    color: 0xffffff,
    transparent: true,
    opacity: 0.85
  });
  particles = new THREE.Points(starGeo, starMat);
  scene.add(particles);

  // TEXT RING MOCK LOOPS (Beautiful visual structures orbiting planet)
  const createFlatRing = (radius, color, rotationSpeed) => {
    const ringGroup = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(radius, radius + 0.15, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringGroup.add(ringMesh);

    // Core node accents for detailed satellite orbits
    const nodeCount = 4;
    for (let i = 0; i < nodeCount; i++) {
      const nodeGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: color });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / nodeCount) * Math.PI * 2;
      node.position.set(Math.cos(angle) * (radius + 0.075), 0, Math.sin(angle) * (radius + 0.075));
      ringGroup.add(node);
    }

    scene.add(ringGroup);
    textRings.push({ group: ringGroup, speed: rotationSpeed });
  };

  createFlatRing(11, 0x4fb3f6, 0.015);
  createFlatRing(15, 0xa78bfa, -0.01);
  createFlatRing(20, 0xf5a623, 0.007);

  // Resize Listener
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  // Rotate astronomical components
  if (planet) {
    planet.rotation.y = time * 0.08;
    planet.position.y = Math.sin(time * 0.5) * 0.35;
  }

  if (stardust) {
    stardust.rotation.y = time * 0.025;
  }

  if (particles) {
    particles.rotation.y = time * 0.002;
    particles.rotation.x = time * 0.001;
  }

  textRings.forEach((ring) => {
    ring.group.rotation.y += ring.speed;
  });

  controls.update();
  renderer.render(scene, camera);
}

const clock = new THREE.Clock();
init();
animate();
