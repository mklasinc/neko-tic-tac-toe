import CharacterModel from './CharacterModel'
import { useCharacterController, useCharacterState } from './use-character'
import { Capsule, Cylinder, Environment, OrbitControls, TorusKnot, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree, Vector3 } from '@react-three/fiber'
import { CapsuleCollider, Debug, RapierRigidBody, RigidBody, useAfterPhysicsStep, vec3 } from '@react-three/rapier'
import { MutableRefObject, RefObject, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { CapsuleGeometry, DirectionalLight, Group, Mesh, Object3D } from 'three'

export const Character = () => {
  const body = useRef<RapierRigidBody>(null)
  const state = useCharacterController(body, {
    maxSpeed: 0.1,
  })

  const capsule = useRef<Mesh>()
  const { camera } = useThree()
  const cameraTarget = useRef<Object3D>(null)

  const resetCharacter = () => {
    body.current?.setLinvel(vec3())
    body.current.setTranslation(map.nodes.x_player_spawn.position)
  }

  //   useEffect(() => {
  //     camera.far = 100000

  //     const handleGoal = (evt) => {
  //       if (evt.detail.rigidBody.userData.character) {
  //         resetCharacter()
  //       }
  //     }
  //     window.addEventListener('game:goal-entered', handleGoal)

  //     return () => {
  //       window.removeEventListener('game:goal-entered', handleGoal)
  //     }
  //   }, [])

  useAfterPhysicsStep(() => {
    try {
      const pos = vec3(capsule.current!.getWorldPosition(vec3()))

      camera.position.lerp(vec3(pos).add({ x: 0, y: 4, z: 10 }), 0.03)
      cameraTarget.current!.position.lerp(pos, 0.1)
      camera.lookAt(cameraTarget.current!.position)

      //   if (body.current.translation().y < -5) {
      //     resetCharacter()
      //   }
    } catch (err) {}
  })

  return (
    <>
      <object3D ref={cameraTarget} />
      <RigidBody
        enabledRotations={[false, false, false]}
        colliders={false}
        ref={body}
        position={[0, 3, 0]}
        userData={{
          character: true,
        }}
      >
        <CharacterModel state={state} />
        <Capsule ref={capsule} visible={false} args={[0.5, 2]} />
        <CapsuleCollider args={[0.5, 0.5]} position={[0, 1, 0]} />
      </RigidBody>
    </>
  )
}
