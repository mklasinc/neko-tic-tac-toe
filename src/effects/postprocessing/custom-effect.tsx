import React from 'react'
import { Uniform } from 'three'
import { Effect } from 'postprocessing'

const fragmentShader = /* glsl */ `
uniform float frequency;
uniform float amplitude;
uniform float offset;

void mainUv(inout vec2 uv) {
    uv.y += sin(uv.x + offset * frequency) * amplitude;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 color = inputColor;
    color.r += -0.5;
    outputColor = color;
}
`

export class CustomEffectImpl extends Effect {
  constructor({ frequency = 1, amplitude = 1 }) {
    super('CustomEffect', fragmentShader, {
      uniforms: new Map([
        ['frequency', new Uniform(frequency)],
        ['amplitude', new Uniform(amplitude)],
        ['offset', new Uniform(0)],
      ]),
    })
  }
  update(renderer: any, inputBuffer: any, deltaTime: any) {
    // @ts-ignore
    this.uniforms.get('offset').value += deltaTime
  }
}

export const CustomEffect = React.forwardRef((props, ref) => {
  const [effect] = React.useState(new CustomEffectImpl(props))

  return <primitive ref={ref} object={effect} />
})
