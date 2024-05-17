declare module 'canvas-sketch-util/math' {
  function mod(a: number, b: number): number
  function fract(v: number): number
  function sign(v: number): number
  function clamp(v: number, min: number, max: number): number
  function lerp(min: number, max: number, t: number): number
  function inverseLerp(min: number, max: number, v: number): number
  function lerpArray(a: number[], b: number[], t: number): number[]
  function lerpFrames(a: number[], b: number[], t: number): number
  function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number): number
  function pingPong(v: number, length: number): number
  function smoothstep(edge0: number, edge1: number, v: number): number
  function damp(v: number, target: number, rate: number, dt: number): number
  function dampArray(v: number[], target: number[], rate: number, dt: number): number[]
  function degToRad(degrees: number): number
  function radToDeg(radians: number): number

  export {
    mod,
    fract,
    sign,
    clamp,
    lerp,
    inverseLerp,
    lerpArray,
    lerpFrames,
    mapRange,
    pingPong,
    smoothstep,
    damp,
    dampArray,
    degToRad,
    radToDeg,
  }
}
