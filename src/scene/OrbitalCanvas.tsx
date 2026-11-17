import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import type { PhaseId } from "../content";

const COLORS: Record<PhaseId, number> = { arrive: 0xa9f0d1, connect: 0xb9a8ff, create: 0xffa88d };

/**
 * A small procedural scene: no model download, tracking script, or GPU-only content.
 * React owns the mount point; Three owns the canvas and releases everything on unmount.
 */
export default function OrbitalCanvas({ phase }: { phase: PhaseId }) {
  const mount = useRef<HTMLDivElement>(null);
  const activePhase = useRef(phase);
  const [available, setAvailable] = useState(true);

  useEffect(() => { activePhase.current = phase; }, [phase]);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      setAvailable(false);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.65;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.touchAction = "none";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 12.8);
    scene.add(new THREE.AmbientLight(0xb4d1ff, 1.6));
    const key = new THREE.PointLight(0xbaf8db, 38, 30);
    key.position.set(-4, 4, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x9a82ff, 40, 30);
    rim.position.set(4, -2, 1);
    scene.add(rim);

    const orbit = new THREE.Group();
    scene.add(orbit);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.1, 3),
      new THREE.MeshPhysicalMaterial({ color: 0x49698a, metalness: 0.72, roughness: 0.15, transmission: 0.18, thickness: 1.8, transparent: true, opacity: 0.72, flatShading: true, side: THREE.DoubleSide }),
    );
    orbit.add(shell);

    const coreMaterial = new THREE.MeshStandardMaterial({ color: COLORS.arrive, emissive: COLORS.arrive, emissiveIntensity: 2.1, metalness: 0.2, roughness: 0.35 });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.14, 2), coreMaterial);
    orbit.add(core);

    const cage = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.11, 2)),
      new THREE.LineBasicMaterial({ color: 0xc9e7ff, transparent: true, opacity: 0.34 }),
    );
    orbit.add(cage);

    const ringMaterials = [0x93f5d5, 0xbbb0ff, 0xffb39d].map((color) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 }));
    const rings = [
      new THREE.Mesh(new THREE.TorusGeometry(3.12, 0.022, 10, 160), ringMaterials[0]),
      new THREE.Mesh(new THREE.TorusGeometry(3.58, 0.014, 8, 160), ringMaterials[1]),
      new THREE.Mesh(new THREE.TorusGeometry(2.73, 0.012, 8, 160), ringMaterials[2]),
    ];
    rings[0].rotation.set(0.4, 0.5, 0.35);
    rings[1].rotation.set(-0.55, 0.2, -0.4);
    rings[2].rotation.set(0.15, -0.75, 0.82);
    rings.forEach((ring) => orbit.add(ring));

    const satellites = [
      [3.02, 0.7, 0.3, 0.16, 0xb1f5d8],
      [-2.8, -1.9, 1, 0.105, 0xc2b7ff],
      [1.1, -3.1, 0.2, 0.085, 0xffb299],
    ].map(([x, y, z, radius, color]) => {
      const orb = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 16), new THREE.MeshBasicMaterial({ color }));
      orb.position.set(x, y, z);
      orbit.add(orb);
      return orb;
    });

    // Fixed-seed constellation keeps every reload visually stable.
    let seed = 43821;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const positions = new Float32Array(180 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (random() - 0.5) * 14;
      positions[i + 1] = (random() - 0.5) * 11;
      positions[i + 2] = -2 - random() * 7;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xd3e0ff, size: 0.024, sizeAttenuation: true, transparent: true, opacity: 0.78 }));
    scene.add(stars);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.8, 0.55, 0.75);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      camera.aspect = width / height;
      camera.position.z = width < 520 ? 15.7 : 12.8;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      composer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;
    const motionChange = () => { reduced = media.matches; };
    media.addEventListener("change", motionChange);
    let visible = true;
    const visibility = new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? true; }, { threshold: 0.01 });
    visibility.observe(host);

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let spinX = 0.08;
    let spinY = 0;
    const down = (event: PointerEvent) => { dragging = true; lastX = event.clientX; lastY = event.clientY; renderer.domElement.setPointerCapture(event.pointerId); };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      spinY += (event.clientX - lastX) * 0.006;
      spinX += (event.clientY - lastY) * 0.004;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const up = () => { dragging = false; };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", up);

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      if (!visible || document.hidden) return;
      const time = clock.getElapsedTime();
      if (!reduced && !dragging) spinY += 0.0017;
      orbit.rotation.y += (spinY - orbit.rotation.y) * 0.075;
      orbit.rotation.x += (spinX - orbit.rotation.x) * 0.075;
      if (!reduced) {
        core.rotation.y = time * 0.12;
        shell.rotation.y = -time * 0.04;
        satellites.forEach((satellite, index) => { satellite.scale.setScalar(1 + Math.sin(time * 1.8 + index) * 0.09); });
      }
      const target = new THREE.Color(COLORS[activePhase.current]);
      coreMaterial.color.lerp(target, 0.035);
      coreMaterial.emissive.lerp(target, 0.035);
      key.color.lerp(target, 0.035);
      composer.render();
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("pointercancel", up);
      observer.disconnect();
      visibility.disconnect();
      media.removeEventListener("change", motionChange);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="orbital-stage" ref={mount} aria-label="Interactive 3D orbit sculpture">
    {!available && <div className="orbital-fallback" aria-hidden="true"><span /><span /><span /><i /></div>}
    <div className="orbit-caption orbit-caption-top" aria-hidden="true"><span className="pulse-dot" /> YOUR JOURNEY IS LIVE</div>
    <div className="orbit-caption orbit-caption-bottom" aria-hidden="true">DRAG TO EXPLORE <span>↗</span></div>
  </div>;
}
