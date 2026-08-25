import {
  Color,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from "three"
import { R } from "../model/physics/constants"
import { BallTextureFactory } from "./balltexturefactory"
import { BallCubeTextureFactory } from "./ballcubetexturefactory"
import { Session } from "../network/client/session"

// Brightness multiplier at full pocket depth (1 = no fade, 0 = black)
const POCKET_SHADE = 0.4

export class BallMaterialFactory {
  private static readonly materialCache: Map<
    string,
    MeshStandardMaterial | MeshPhongMaterial | MeshPhysicalMaterial
  > = new Map()

  static createTexturedDotsMaterial(color: Color): MeshPhysicalMaterial {
    const key = `texturedDots_${color.getHex()}`
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as MeshPhysicalMaterial
    }

    const cubeTexture = BallCubeTextureFactory.getOrCreateTexture(color)
    const material = new MeshPhysicalMaterial({
      color: color,
      roughness: 0.1,
      metalness: 0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.25,
    })

    material.onBeforeCompile = (shader: any) => {
      shader.uniforms.uCubeMap = { value: cubeTexture }

      shader.vertexShader = `
        varying vec3 vLocalPos;
        varying float vShade;
        ${shader.vertexShader}
      `.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vLocalPos = position;
        vShade = clamp(-modelMatrix[3].z * ${(1 / (4 * R)).toFixed(2)}, 0.0, 1.0);`
      )

      shader.fragmentShader = `
        uniform samplerCube uCubeMap;
        varying vec3 vLocalPos;
        varying float vShade;
        ${shader.fragmentShader}
      `.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        diffuseColor.rgb = textureCube(uCubeMap, normalize(vLocalPos)).rgb * mix(1.0, ${POCKET_SHADE}, vShade);`
      )
    }

    this.materialCache.set(key, material)
    return material
  }

  static createDottedMaterial(color: Color): MeshPhongMaterial {
    const key = `dotted_${color.getHex()}`
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as MeshPhongMaterial
    }

    const material = new MeshPhongMaterial({
      emissive: 0,
      flatShading: true,
      vertexColors: true,
      forceSinglePass: true,
      shininess: 25,
      specular: 0x555533,
      transparent: false,
      depthWrite: true,
    })
    material.onBeforeCompile = (shader: any) => {
      shader.vertexShader = `
        varying float vShade;
        ${shader.vertexShader}
      `.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vShade = clamp(-modelMatrix[3].z * ${(1 / (4 * R)).toFixed(2)}, 0.0, 1.0);`
      )
      shader.fragmentShader = `
        varying float vShade;
        ${shader.fragmentShader}
      `.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        diffuseColor.rgb *= mix(1.0, ${POCKET_SHADE}, vShade);`
      )
    }
    this.materialCache.set(key, material)
    return material
  }

  static createProjectedMaterial(
    label: number,
    color: Color,
    size = 256
  ): MeshStandardMaterial {
    const key = `projected_${label}_${color.getHex()}_${size}`
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as MeshStandardMaterial
    }

    const numberTexture = BallTextureFactory.getOrCreateTexture(
      label,
      color,
      size
    )

    const material =
      Session.getLod() <= 1
        ? new MeshStandardMaterial({
            color: color,
            roughness: 0.5,
            metalness: 0,
            flatShading: true,
            transparent: false,
            depthWrite: true,
          })
        : new MeshPhysicalMaterial({
            color: color,
            roughness: 0.1,
            metalness: 0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.02,
            reflectivity: 0.25,
          })

    material.onBeforeCompile = (shader: any) => {
      shader.uniforms.numberTex = { value: numberTexture }
      shader.uniforms.invScale = { value: 1 / (R * 2) }

      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `#include <common>
         varying vec3 vLocalPosition;
         varying float vShade;`
      )
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         vLocalPosition = position;
         vShade = clamp(-modelMatrix[3].z * ${(1 / (4 * R)).toFixed(2)}, 0.0, 1.0);`
      )

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `#include <common>
        uniform sampler2D numberTex;
        uniform float invScale;
        varying vec3 vLocalPosition;
        varying float vShade;`
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        // Calculate the base UV mapping
        vec2 projUv = vLocalPosition.xz * invScale + 0.5;

        // Capture derivatives BEFORE the flip. 
        // This prevents the GPU from seeing the 'teleport' at the equator.
        vec2 dx = dFdx(projUv);
        vec2 dy = dFdy(projUv);

        // Flip logic for the bottom hemisphere
        if (vLocalPosition.y < 0.0) {
          projUv.x = 1.0 - projUv.x;
          // Mirror the derivatives so mipmapping stays consistent
          dx.x = -dx.x;
          dy.x = -dy.x;
        }

        projUv = clamp(projUv, 0.0, 1.0);

        // Add a negative bias to force a higher-resolution mipmap level
        // -0.5 to -1.0 usually restores the "crisp" look.
        vec4 texColor = textureGrad(numberTex, projUv, dx * 0.5, dy * 0.5);
     
        diffuseColor.rgb = texColor.rgb * mix(1.0, ${POCKET_SHADE}, vShade);`
      )
    }
    this.materialCache.set(key, material)
    return material
  }
}
