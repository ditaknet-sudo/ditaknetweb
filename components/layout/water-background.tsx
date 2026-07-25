"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_dark;

float wave(vec2 point, vec2 direction, float frequency, float speed) {
  return sin(dot(point, direction) * frequency + u_time * speed);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 point = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

  float first = wave(point, normalize(vec2(1.0, 0.55)), 3.0, 0.34);
  float second = wave(point, normalize(vec2(-0.35, 1.0)), 4.8, -0.24);
  float third = wave(point, normalize(vec2(0.7, -1.0)), 7.2, 0.18);
  float ripple = wave(point + vec2(first, second) * 0.08, vec2(0.8, 0.6), 10.0, 0.15);
  float surface = first * 0.42 + second * 0.28 + third * 0.18 + ripple * 0.12;

  float causticA = abs(sin((point.x + surface * 0.16) * 8.0 + u_time * 0.25));
  float causticB = abs(sin((point.y - surface * 0.13) * 9.0 - u_time * 0.2));
  float caustics = pow(max(0.0, 1.0 - abs(causticA - causticB) * 2.8), 5.0);

  vec3 lightTop = vec3(0.90, 0.97, 0.98);
  vec3 lightBottom = vec3(0.73, 0.90, 0.94);
  vec3 darkTop = vec3(0.035, 0.075, 0.105);
  vec3 darkBottom = vec3(0.025, 0.12, 0.16);
  vec3 base = mix(mix(lightBottom, lightTop, uv.y), mix(darkBottom, darkTop, uv.y), u_dark);

  vec3 blue = mix(vec3(0.05, 0.38, 0.58), vec3(0.20, 0.64, 0.88), u_dark);
  vec3 green = mix(vec3(0.04, 0.57, 0.39), vec3(0.22, 0.84, 0.58), u_dark);
  float colorFlow = smoothstep(-0.7, 0.8, surface + sin(uv.x * 4.0 - u_time * 0.1) * 0.25);
  vec3 water = mix(blue, green, colorFlow);

  float edgeFade = smoothstep(1.45, 0.15, length(point * vec2(0.68, 0.9)));
  float waterStrength = mix(0.11, 0.18, u_dark) * (0.55 + edgeFade * 0.45);
  base = mix(base, water, waterStrength + surface * 0.025);
  base += mix(vec3(0.08, 0.32, 0.35), vec3(0.16, 0.58, 0.68), u_dark) * caustics * mix(0.055, 0.095, u_dark);

  float horizon = smoothstep(0.0, 0.75, uv.y);
  base += vec3(0.02, 0.08, 0.11) * horizon * mix(0.2, 0.42, u_dark);
  gl_FragColor = vec4(base, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function WaterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "low-power"
    });
    if (!gl) return;

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const dark = gl.getUniformLocation(program, "u_dark");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 979px)").matches;
    const targetFrameTime = mobile ? 1000 / 30 : 1000 / 60;
    let animationFrame = 0;
    let previousFrame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
      width = Math.max(1, Math.floor(window.innerWidth * pixelRatio));
      height = Math.max(1, Math.floor(window.innerHeight * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const draw = (now: number) => {
      animationFrame = window.requestAnimationFrame(draw);
      if (document.hidden || now - previousFrame < targetFrameTime) return;
      previousFrame = now;
      resize();
      gl.uniform2f(resolution, width, height);
      gl.uniform1f(time, reducedMotion ? 2.5 : now * 0.001);
      gl.uniform1f(dark, document.documentElement.dataset.theme === "dark" ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    animationFrame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <div className="water-background" aria-hidden="true">
      <div className="water-background__fallback" />
      <canvas ref={canvasRef} className="water-background__canvas" />
      <div className="water-background__glass" />
    </div>
  );
}
