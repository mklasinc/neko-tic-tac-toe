import guiShaderMaterial from '../lib/guiShaderMaterial'
import glsl from 'babel-plugin-glsl/macro'
import { extend } from '@react-three/fiber'

export const [useMyMaterialGUI, MyMaterial] = guiShaderMaterial(
  {
    uColor: 'red',
    uTime: 0,
  },
  glsl/* glsl */ `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uTimeScale; // { value: 1, step: 0.1, min: 0, max: 10 }

    float rand(vec2 co){
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
    void main() {
      vUv = uv;

      vec3 transformed = position;

      float x = 1. - uv.x;
      x *= 10.;

      transformed.z += cos((uTime * uTimeScale * 5.) + sqrt(x * 10.)) * .4;

      transformed = mix(transformed, position, 1. - uv.x);

      gl_Position = projectionMatrix * 
        viewMatrix * 
        modelMatrix * 
        vec4(transformed, 1.);
    }
  `,
  glsl/* glsl */ `
  varying vec2 vUv;
  uniform float uUvScale; // { value: 1, min: 0, max: 1, step: 0.01 }
  uniform sampler2D uImage; // { image: "./test-image.jpg" }
  uniform vec3 uColor; // { value: "#ff0000" }

  void main() {

    vec2 uv = vUv;
    uv *= uUvScale;

    vec3 imageColors = texture2D(uImage, uv).rgb;

    gl_FragColor = vec4( mix(vec3(uv, 0.), imageColors, 1.) + uColor * .4, 1.);
  }
`
)

extend({ MyMaterial })

// Add types to ThreeElements elements so primitives pick up on it
declare module '@react-three/fiber' {
  interface ThreeElements {
    myMaterial: typeof MyMaterial
  }
}
