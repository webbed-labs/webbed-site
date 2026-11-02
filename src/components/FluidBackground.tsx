"use client";

import React, { useEffect, useRef } from "react";

// Set to true to exaggerate fluid distortion for verification. Set to false for subtle production levels.
const DEBUG_INTERACTION = false;

interface FluidBackgroundProps {
  className?: string;
}

export default function FluidBackground({ className = "" }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip the heavy WebGL shader on small/touch screens — it's a major
    // main-thread/GPU cost and the hero already has a CSS fallback for mobile.
    // This sharply cuts Total Blocking Time on mobile (e.g. the /about page).
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      return;
    }


    let teardown: (() => void) | null = null;
    let idleHandle: number | undefined;
    let cancelled = false;

    // Defer WebGL init until the main thread is idle so it doesn't block the
    // initial render or inflate Total Blocking Time on page load.
    const initFluid = () => {
      if (cancelled) return;

      // Force animation and interactions to be active even if OS reduced motion is checked,
      // since this interactive canvas is a key visual artwork requested for the hero section.
      const prefersReducedMotion = false;

      const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
      if (!gl) {
        console.warn("WebGL context not found.");
        return;
      }

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 position;
      varying vec2 v_uv;
      void main() {
        v_uv = position * 0.5 + 0.5;
        v_uv.y = 1.0 - v_uv.y;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader Source
    const fsSource = `
      precision mediump float;
      varying vec2 v_uv;

      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_velocity;
      uniform vec2 u_resolution;
      uniform bool u_debug;

      #define MAX_TRAIL_POINTS 10
      uniform vec2 u_trailPos[MAX_TRAIL_POINTS];
      uniform vec2 u_trailVel[MAX_TRAIL_POINTS];
      uniform float u_trailAge[MAX_TRAIL_POINTS];
      uniform float u_strength;

      // PRNG generator
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // 2D Value Noise
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      // Fractional Brownian Motion (4 octaves)
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(0.87758, 0.47942, -0.47942, 0.87758);
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 aspectCorrectedUv = uv;
        aspectCorrectedUv.x *= (u_resolution.x / max(u_resolution.y, 1.0));

        // Use a wider radius in debug mode (0.45) for easy verification, and a tighter, more precise radius (0.22) for production.
        float radius = u_strength > 1.5 ? 0.45 : 0.22;
        vec2 accumOffset = vec2(0.0);
        float totalWeight = 0.0;
        
        // Unrolled point loop: WebGL 1.0 doesn't allow indexing uniforms with variable indices in fragment shaders.
        // Copy-paste unrolling for 10 trail points.
        
        // Point 0
        {
          float age = u_trailAge[0];
          if (age > 0.0) {
            vec2 tPos = u_trailPos[0]; tPos.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 tVel = u_trailVel[0]; tVel.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 toPt = aspectCorrectedUv - tPos;
            float d = length(toPt);
            if (d < radius) {
              float influence = smoothstep(radius, 0.0, d);
              float weight = influence * age;
              accumOffset -= tVel * weight * u_strength * 12.0;
              float curl = (tVel.x * toPt.y - tVel.y * toPt.x);
              float twistAngle = curl * weight * u_strength * 35.0;
              float s = sin(twistAngle); float c = cos(twistAngle);
              vec2 rotated = vec2(toPt.x * c - toPt.y * s, toPt.x * s + toPt.y * c);
              accumOffset += (rotated - toPt);
              totalWeight += weight;
            }
          }
        }
        // Point 1
        {
          float age = u_trailAge[1];
          if (age > 0.0) {
            vec2 tPos = u_trailPos[1]; tPos.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 tVel = u_trailVel[1]; tVel.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 toPt = aspectCorrectedUv - tPos;
            float d = length(toPt);
            if (d < radius) {
              float influence = smoothstep(radius, 0.0, d);
              float weight = influence * age;
              accumOffset -= tVel * weight * u_strength * 12.0;
              float curl = (tVel.x * toPt.y - tVel.y * toPt.x);
              float twistAngle = curl * weight * u_strength * 35.0;
              float s = sin(twistAngle); float c = cos(twistAngle);
              vec2 rotated = vec2(toPt.x * c - toPt.y * s, toPt.x * s + toPt.y * c);
              accumOffset += (rotated - toPt);
              totalWeight += weight;
            }
          }
        }
        // Point 2
        {
          float age = u_trailAge[2];
          if (age > 0.0) {
            vec2 tPos = u_trailPos[2]; tPos.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 tVel = u_trailVel[2]; tVel.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 toPt = aspectCorrectedUv - tPos;
            float d = length(toPt);
            if (d < radius) {
              float influence = smoothstep(radius, 0.0, d);
              float weight = influence * age;
              accumOffset -= tVel * weight * u_strength * 12.0;
              float curl = (tVel.x * toPt.y - tVel.y * toPt.x);
              float twistAngle = curl * weight * u_strength * 35.0;
              float s = sin(twistAngle); float c = cos(twistAngle);
              vec2 rotated = vec2(toPt.x * c - toPt.y * s, toPt.x * s + toPt.y * c);
              accumOffset += (rotated - toPt);
              totalWeight += weight;
            }
          }
        }
        // Point 3
        {
          float age = u_trailAge[3];
          if (age > 0.0) {
            vec2 tPos = u_trailPos[3]; tPos.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 tVel = u_trailVel[3]; tVel.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 toPt = aspectCorrectedUv - tPos;
            float d = length(toPt);
            if (d < radius) {
              float influence = smoothstep(radius, 0.0, d);
              float weight = influence * age;
              accumOffset -= tVel * weight * u_strength * 12.0;
              float curl = (tVel.x * toPt.y - tVel.y * toPt.x);
              float twistAngle = curl * weight * u_strength * 35.0;
              float s = sin(twistAngle); float c = cos(twistAngle);
              vec2 rotated = vec2(toPt.x * c - toPt.y * s, toPt.x * s + toPt.y * c);
              accumOffset += (rotated - toPt);
              totalWeight += weight;
            }
          }
        }
        // Point 4
        {
          float age = u_trailAge[4];
          if (age > 0.0) {
            vec2 tPos = u_trailPos[4]; tPos.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 tVel = u_trailVel[4]; tVel.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 toPt = aspectCorrectedUv - tPos;
            float d = length(toPt);
            if (d < radius) {
              float influence = smoothstep(radius, 0.0, d);
              float weight = influence * age;
              accumOffset -= tVel * weight * u_strength * 12.0;
              float curl = (tVel.x * toPt.y - tVel.y * toPt.x);
              float twistAngle = curl * weight * u_strength * 35.0;
              float s = sin(twistAngle); float c = cos(twistAngle);
              vec2 rotated = vec2(toPt.x * c - toPt.y * s, toPt.x * s + toPt.y * c);
              accumOffset += (rotated - toPt);
              totalWeight += weight;
            }
          }
        }
        // Point 5
        {
          float age = u_trailAge[5];
          if (age > 0.0) {
            vec2 tPos = u_trailPos[5]; tPos.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 tVel = u_trailVel[5]; tVel.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 toPt = aspectCorrectedUv - tPos;
            float d = length(toPt);
            if (d < radius) {
              float influence = smoothstep(radius, 0.0, d);
              float weight = influence * age;
              accumOffset -= tVel * weight * u_strength * 12.0;
              float curl = (tVel.x * toPt.y - tVel.y * toPt.x);
              float twistAngle = curl * weight * u_strength * 35.0;
              float s = sin(twistAngle); float c = cos(twistAngle);
              vec2 rotated = vec2(toPt.x * c - toPt.y * s, toPt.x * s + toPt.y * c);
              accumOffset += (rotated - toPt);
              totalWeight += weight;
            }
          }
        }
        // Point 6
        {
          float age = u_trailAge[6];
          if (age > 0.0) {
            vec2 tPos = u_trailPos[6]; tPos.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 tVel = u_trailVel[6]; tVel.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 toPt = aspectCorrectedUv - tPos;
            float d = length(toPt);
            if (d < radius) {
              float influence = smoothstep(radius, 0.0, d);
              float weight = influence * age;
              accumOffset -= tVel * weight * u_strength * 12.0;
              float curl = (tVel.x * toPt.y - tVel.y * toPt.x);
              float twistAngle = curl * weight * u_strength * 35.0;
              float s = sin(twistAngle); float c = cos(twistAngle);
              vec2 rotated = vec2(toPt.x * c - toPt.y * s, toPt.x * s + toPt.y * c);
              accumOffset += (rotated - toPt);
              totalWeight += weight;
            }
          }
        }
        // Point 7
        {
          float age = u_trailAge[7];
          if (age > 0.0) {
            vec2 tPos = u_trailPos[7]; tPos.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 tVel = u_trailVel[7]; tVel.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 toPt = aspectCorrectedUv - tPos;
            float d = length(toPt);
            if (d < radius) {
              float influence = smoothstep(radius, 0.0, d);
              float weight = influence * age;
              accumOffset -= tVel * weight * u_strength * 12.0;
              float curl = (tVel.x * toPt.y - tVel.y * toPt.x);
              float twistAngle = curl * weight * u_strength * 35.0;
              float s = sin(twistAngle); float c = cos(twistAngle);
              vec2 rotated = vec2(toPt.x * c - toPt.y * s, toPt.x * s + toPt.y * c);
              accumOffset += (rotated - toPt);
              totalWeight += weight;
            }
          }
        }
        // Point 8
        {
          float age = u_trailAge[8];
          if (age > 0.0) {
            vec2 tPos = u_trailPos[8]; tPos.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 tVel = u_trailVel[8]; tVel.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 toPt = aspectCorrectedUv - tPos;
            float d = length(toPt);
            if (d < radius) {
              float influence = smoothstep(radius, 0.0, d);
              float weight = influence * age;
              accumOffset -= tVel * weight * u_strength * 12.0;
              float curl = (tVel.x * toPt.y - tVel.y * toPt.x);
              float twistAngle = curl * weight * u_strength * 35.0;
              float s = sin(twistAngle); float c = cos(twistAngle);
              vec2 rotated = vec2(toPt.x * c - toPt.y * s, toPt.x * s + toPt.y * c);
              accumOffset += (rotated - toPt);
              totalWeight += weight;
            }
          }
        }
        // Point 9
        {
          float age = u_trailAge[9];
          if (age > 0.0) {
            vec2 tPos = u_trailPos[9]; tPos.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 tVel = u_trailVel[9]; tVel.x *= (u_resolution.x / max(u_resolution.y, 1.0));
            vec2 toPt = aspectCorrectedUv - tPos;
            float d = length(toPt);
            if (d < radius) {
              float influence = smoothstep(radius, 0.0, d);
              float weight = influence * age;
              accumOffset -= tVel * weight * u_strength * 12.0;
              float curl = (tVel.x * toPt.y - tVel.y * toPt.x);
              float twistAngle = curl * weight * u_strength * 35.0;
              float s = sin(twistAngle); float c = cos(twistAngle);
              vec2 rotated = vec2(toPt.x * c - toPt.y * s, toPt.x * s + toPt.y * c);
              accumOffset += (rotated - toPt);
              totalWeight += weight;
            }
          }
        }
        
        vec2 distortedUv = aspectCorrectedUv + accumOffset;

        // 2. High-contrast multi-layered FBM & Domain Warping
        float timeScale = u_time * 0.18;

        // Warping layer 1
        vec2 q = vec2(
          fbm(distortedUv * 1.3 + vec2(0.0, 0.0) + timeScale * 0.08),
          fbm(distortedUv * 1.3 + vec2(5.2, 1.3) + timeScale * 0.12)
        );

        // Warping layer 2
        vec2 r = vec2(
          fbm(distortedUv * 1.6 + 4.0 * q + vec2(1.7, 9.2) + timeScale * 0.1),
          fbm(distortedUv * 1.6 + 4.0 * q + vec2(8.3, 2.8) + timeScale * 0.07)
        );

        // Flow structures intensity map
        float f = fbm(distortedUv * 1.1 + 4.0 * r);

        // 3. Premium Brand Colors (purely generative, no direct cursor glow/lights)
        vec3 colorBlack = vec3(0.03, 0.03, 0.03); // Slightly lighter black for higher opacity
        vec3 colorBlue = vec3(0.12, 0.38, 0.94);
        vec3 colorViolet = vec3(0.44, 0.16, 0.88);
        vec3 colorCrimson = vec3(0.88, 0.14, 0.32);

        // Mix fluid colors dynamically
        vec3 fluidColor = mix(colorBlue, colorViolet, r.x);
        fluidColor = mix(fluidColor, colorCrimson, r.y);
        
        // Boost contrast and depth highlights
        fluidColor *= pow(f * 1.65, 1.45);

        // Map colors on dark background
        vec3 finalColor = mix(colorBlack, fluidColor, smoothstep(0.08, 0.92, f * 0.92));

        // Hover reveal mask: keep base background pitch black (0.0) when idle, and reveal vibrant neon liquid along cursor trails.
        float hoverMask = clamp(totalWeight * 4.0, 0.0, 1.0);
        finalColor *= hoverMask;

        // 4.// Content Safe Zone removed to allow full width fluid
        float contentSafeMask = 1.0;
        finalColor *= contentSafeMask;

        // Vignette
        float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
        vignette = clamp(pow(16.0 * vignette, 0.36), 0.0, 1.0);
        finalColor *= vignette;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(glContext: WebGLRenderingContext, type: number, source: string) {
      const shader = glContext.createShader(type);
      if (!shader) {
        console.error("FluidBackground: Failed to create shader instance.");
        return null;
      }
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error("FluidBackground: Shader compilation failed:", glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) {
      console.error("FluidBackground: Failed to create WebGL program.");
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("FluidBackground: WebGL program link failed:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const velocityLoc = gl.getUniformLocation(program, "u_velocity");
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const debugLoc = gl.getUniformLocation(program, "u_debug");
    
    // Get locations for trail and strength uniforms (with fallback lookups for driver safety)
    const trailPosLoc = gl.getUniformLocation(program, "u_trailPos[0]") || gl.getUniformLocation(program, "u_trailPos");
    const trailVelLoc = gl.getUniformLocation(program, "u_trailVel[0]") || gl.getUniformLocation(program, "u_trailVel");
    const trailAgeLoc = gl.getUniformLocation(program, "u_trailAge[0]") || gl.getUniformLocation(program, "u_trailAge");
    const strengthLoc = gl.getUniformLocation(program, "u_strength");

    let targetX = 0.75;
    let targetY = 0.55;
    let currentX = 0.75;
    let currentY = 0.55;
    let lastX = 0.75;
    let lastY = 0.55;

    let smoothVelX = 0.0;
    let smoothVelY = 0.0;

    // Trail state tracking
    interface TrailPoint {
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number; // ranges from 1.0 (new) to 0.0 (expired)
    }
    let trail: TrailPoint[] = [];
    let lastTime = Date.now();
    let frameCounter = 0;
    let isMouseActive = false;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = 1.0 - (e.clientY / window.innerHeight); // Flip Y to match WebGL coords!
      isMouseActive = true;
      // Resume the render loop only when there's actual pointer activity.
      if (!running) {
        running = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const onMouseLeave = () => {
      isMouseActive = false;
    };

    if (!prefersReducedMotion) {
      window.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseleave", onMouseLeave);
    }

    const resize = () => {
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      }
    };
    window.addEventListener("resize", resize);
    resize();

    let animationFrameId: number;
    let running = false;
    const startTime = Date.now();

    const render = () => {
      const now = Date.now();
      const dt = prefersReducedMotion ? 0.0 : (now - lastTime) / 1000.0;
      lastTime = now;

      const elapsedSeconds = prefersReducedMotion ? 0.0 : (now - startTime) / 1000.0;

      if (!prefersReducedMotion) {
        // Inertia tracking
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        currentX += dx * 0.12;
        currentY += dy * 0.12;

        // Velocity tracking (units-per-frame at ~60fps)
        const instantVelX = currentX - lastX;
        const instantVelY = currentY - lastY;

        lastX = currentX;
        lastY = currentY;

        // Smooth velocity vector with decay
        smoothVelX += (instantVelX - smoothVelX) * 0.15;
        smoothVelY += (instantVelY - smoothVelY) * 0.15;

        // frameScale adjusts the drift movement relative to a standard 60fps tick
        const frameScale = Math.min(dt / 0.01667, 5.0);

        // Update existing trail points
        for (let i = 0; i < trail.length; i++) {
          trail[i].age -= dt; // decay by time
          
          // Drift the trail points along their velocities
          trail[i].x += trail[i].vx * frameScale * 0.8;
          trail[i].y += trail[i].vy * frameScale * 0.8;
        }
        // Filter out expired trail points
        trail = trail.filter(p => p.age > 0.0);

        // Periodically add new trail points during movement (every 3 frames, ~50ms)
        frameCounter++;
        const speed = Math.sqrt(smoothVelX * smoothVelX + smoothVelY * smoothVelY);
        // Slightly lower speed threshold to capture slow dragging
        if (isMouseActive && frameCounter % 3 === 0 && speed > 0.0001) {
          trail.push({
            x: currentX,
            y: currentY,
            vx: smoothVelX,
            vy: smoothVelY,
            age: 0.5, // Full lifespan of 0.5 seconds
          });
          
          // Cap trail point array size to maximum shader capacity (10)
          if (trail.length > 10) {
            trail.shift();
          }
        }
      } else {
        currentX = 0.75;
        currentY = 0.55;
        smoothVelX = 0.0;
        smoothVelY = 0.0;
        trail = [];
      }

      // Populate flat array buffers to pass to shader uniforms
      const maxTrailPoints = 10;
      const trailPosArray = new Float32Array(maxTrailPoints * 2);
      const trailVelArray = new Float32Array(maxTrailPoints * 2);
      const trailAgeArray = new Float32Array(maxTrailPoints);

      for (let i = 0; i < maxTrailPoints; i++) {
        if (i < trail.length) {
          trailPosArray[i * 2] = trail[i].x;
          trailPosArray[i * 2 + 1] = trail[i].y;
          trailVelArray[i * 2] = trail[i].vx;
          trailVelArray[i * 2 + 1] = trail[i].vy;
          trailAgeArray[i] = trail[i].age;
        } else {
          trailPosArray[i * 2] = 0.0;
          trailPosArray[i * 2 + 1] = 0.0;
          trailVelArray[i * 2] = 0.0;
          trailVelArray[i * 2 + 1] = 0.0;
          trailAgeArray[i] = 0.0;
        }
      }

      gl.useProgram(program);
      // Freeze time-based animation to keep the background stable when the mouse is still.
      gl.uniform1f(timeLoc, 22.0);
      gl.uniform2f(mouseLoc, currentX, currentY);
      gl.uniform2f(velocityLoc, smoothVelX, smoothVelY);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1i(debugLoc, 1);
      
      // Upload trail uniforms
      if (trailPosLoc) gl.uniform2fv(trailPosLoc, trailPosArray);
      if (trailVelLoc) gl.uniform2fv(trailVelLoc, trailVelArray);
      if (trailAgeLoc) gl.uniform1fv(trailAgeLoc, trailAgeArray);
      
      // Pass u_strength (elevated for verification/debug mode, lower for production)
      if (strengthLoc) gl.uniform1f(strengthLoc, DEBUG_INTERACTION ? 4.0 : 0.85);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // When the pointer is idle the shader output is pure black, so keep the
      // loop running only while there are live trail points. This stops the
      // per-frame main-thread work once interaction ends (cuts TBT).
      if (!prefersReducedMotion && trail.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        running = false;
      }
    };

    render();

      teardown = () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseleave", onMouseLeave);
        window.removeEventListener("resize", resize);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(positionBuffer);
      };
    };

    const ric = (
      window as Window & typeof globalThis & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback;
    if (ric) idleHandle = ric(initFluid, { timeout: 600 });
    else if (typeof window !== "undefined")
      idleHandle = window.setTimeout(initFluid, 200) as unknown as number;
    else initFluid();

    return () => {
      cancelled = true;
      if (idleHandle !== undefined && typeof window !== "undefined") {
        const cic = (
          window as Window & typeof globalThis & {
            cancelIdleCallback?: (h: number) => void;
          }
        ).cancelIdleCallback;
        if (cic) cic(idleHandle);
        else clearTimeout(idleHandle);
      }
      teardown?.();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full bg-black ${className}`}
      />
      {DEBUG_INTERACTION && (
        <div className="absolute bottom-4 right-4 z-20 rounded bg-black/85 border border-red-500/30 px-3 py-1.5 font-mono text-[10px] tracking-wider text-red-400 select-none pointer-events-none">
          FLUID DEBUG MODE (EXAGGERATED)
        </div>
      )}
    </div>
  );
}
