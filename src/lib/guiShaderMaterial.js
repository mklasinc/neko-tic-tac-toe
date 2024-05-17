import { shaderMaterial, useTexture } from '@react-three/drei'
import { colord } from 'colord'
import { folder, useControls } from 'leva'
import { useCallback, useState } from 'react'
import { Color, RepeatWrapping, Texture, Vector2, Vector3 } from 'three'

import JSON5 from 'json5'

function getLevaSchemaFromShaders(vertexShader, fragmentShader) {
  const myData = `
  ${vertexShader}
  ${fragmentShader}
`
    .split('\n')
    .filter((x) => x.indexOf('uniform') > -1)
    .map((x) => x.match(/uniform (.+?) (.+?); (\/\/?(.*))/m))
    .filter((x) => x)
    .map((match) => {
      const controls = JSON5.parse(match[3].replace('// ', ''))

      const data = {
        type: match[1],
        name: match[2],
        default: controls.value,
        controls,
      }

      if (colord(controls.value).isValid()) {
        data.type = 'color'
      }

      return data
    })

  return myData.reduce((controls, control) => {
    controls[control.name] = control.controls
    return controls
  }, {})
}

function getUniformsFromShader(passedUniforms, vertexShader, fragmentShader) {
  const myData = `
  ${vertexShader}
  ${fragmentShader}
`
    .split('\n')
    .filter((x) => x.indexOf('uniform') > -1)
    .map((x) => x.match(/uniform (.+?) (.+?); (\/\/?(.*))/m))
    .filter((x) => x)
    .map((match) => {
      const controls = JSON5.parse(match[3].replace('// ', ''))

      const data = {
        type: match[1],
        name: match[2],
        default: controls.value,
        controls,
      }

      if (colord(controls.value).isValid()) {
        data.type = 'color'
      }

      return data
    })

  return myData.reduce((uniforms, control) => {
    uniforms[control.name] = defaults[control.type](control.default)
    return uniforms
  }, passedUniforms)
}

const defaults = {
  vec2: (x) => new Vector2(x),
  vec3: (x) => new Vector3(x),
  float: (x) => x,
  color: (x) => new Color(x),
  sampler2D: (x) => new Texture(),
}

export default function guiShaderMaterial(passedUniforms = {}, vertexShader, fragmentShader) {
  // @TODO this double thing is stupid, fix it
  const controls = getLevaSchemaFromShaders(vertexShader, fragmentShader)
  const uniforms = getUniformsFromShader(passedUniforms, vertexShader, fragmentShader)
  const material = shaderMaterial(uniforms, vertexShader, fragmentShader)

  function useCustomHook(key) {
    const levaData = useControls({
      [key]: folder(controls),
    })

    const images = getImagesFromControls(controls, levaData)
    const textures = useTexture(images)

    for (const [_, texture] of Object.entries(textures)) {
      texture.wrapS = texture.wrapT = RepeatWrapping
    }

    return {
      ...levaData,
      ...textures,
      key: (() => `${Math.random() * performance.now()}`)(),
    }
  }

  return [useCustomHook, material]
}

function getShadersFromMaterialRef(materialRef) {
  if (materialRef) {
    const { vertexShader, fragmentShader } = materialRef
    return [vertexShader, fragmentShader]
  }

  return null
}

function getImagesFromControls(controls, levaData) {
  const images = {}

  for (const [key, control] of Object.entries(controls)) {
    if (control.image) {
      if (levaData[key]) {
        images[key] = levaData[key]
      }
    }
  }

  return images
}

/**
 *
 * @param {*} name
 *
 * @returns []
 */
export function useMaterialGUI(name) {
  const [controls, setControls] = useState({})

  const onRef = useCallback((node) => {
    if (node) {
      const [vertexShader, fragmentShader] = getShadersFromMaterialRef(node)
      setControls(() => getLevaSchemaFromShaders(vertexShader, fragmentShader) ?? {})
    }
  }, [])

  const levaData = useControls({ [name]: folder(controls) }, [controls])

  return [onRef, levaData]
}
