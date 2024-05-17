import { CustomShader } from './custom-shader'
import { EffectComposer } from 'three-stdlib'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ReactThreeFiber, useThree, extend, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
ShaderPass

extend({
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
  AfterimagePass,
  ShaderPass,
})

declare module '@react-three/fiber' {
  interface ThreeElements {
    unrealBloomPass: ReactThreeFiber.Node<UnrealBloomPass, typeof UnrealBloomPass>
  }
}

export const Effects = () => {
  const { gl, scene, camera, size } = useThree()
  const { width, height } = size
  const [aspect] = useState(() => new THREE.Vector2(width, height))

  const composer = useRef<EffectComposer | null>(null)
  const bloomPass = useRef<UnrealBloomPass | undefined>()

  useEffect(() => {
    if (composer.current) {
      void composer.current.setSize(size.width, size.height)
    }

    if (bloomPass.current) {
      bloomPass.current.resolution.set(width, height)
    }
  }, [size])

  useFrame(() => {
    if (composer.current) {
      composer.current.render()
    }
  }, 1)

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attach="passes-0" scene={scene} camera={camera} />
      <unrealBloomPass attach="passes-1" args={[aspect, 0.8, 0.2, 0.11]} />
      <shaderPass attach="passes-2" args={[CustomShader]} />
    </effectComposer>
  )
}
