import { CustomEffect } from './custom-effect'
import React from 'react'
import { EffectComposer as PostprocessingEffectComposer, Noise, Bloom } from '@react-three/postprocessing'

export const Effects = () => {
  const customEffectRef = React.useRef<CustomEffect>(null)
  return (
    <PostprocessingEffectComposer>
      <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      <Noise opacity={0.02} />
      <CustomEffect ref={customEffectRef} frequency={1} amplitude={0.1} />
    </PostprocessingEffectComposer>
  )
}
