import { Character } from './character'
import { PerspectiveCamera } from '@react-three/drei'
import React from 'react'
import { RigidBody, Physics, Debug } from '@react-three/rapier'

export const PhysicsScene = ({ debug = true }: { debug?: boolean }) => {
  return (
    <Physics timeStep={'vary'} gravity={[0, -15, 0]}>
      {debug && <Debug />}
      <PerspectiveCamera makeDefault position={[0, 5, 20]} />
      <color attach="background" args={['lightblue']} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, 10, 10]} />
      <Character />
      <RigidBody type="fixed">
        <mesh>
          <boxGeometry attach="geometry" args={[100, 0.5, 100]} />
          <meshStandardMaterial attach="material" color="green" />
        </mesh>
      </RigidBody>
    </Physics>
  )
}
