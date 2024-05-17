import { useMyMaterialGUI } from './materials/Material'
import * as Effects from './effects'
import { Character } from './physics/character/Character'
import { PhysicsScene } from './physics'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useRef } from 'react'

export const CustomShaderPlane = () => {
  const ref = useRef<any>()
  // @ts-ignore
  const myProps = useMyMaterialGUI('my material')

  useFrame(({ clock }) => {
    if (ref.current?.uniforms?.uTime) {
      ref.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })
  return (
    <mesh>
      <planeGeometry attach="geometry" args={[10, 10, 64, 64]} />
      <myMaterial ref={ref} {...myProps} />
    </mesh>
  )
}

export const NonPhysicsScene = () => {}

export default function App() {
  return (
    <Canvas>
      <PhysicsScene />
    </Canvas>
  )
}
