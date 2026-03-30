import { Color, MeshPhongMaterial, MeshStandardMaterial } from "three"
import { R } from "../model/physics/constants"
import { BallTextureFactory } from "./balltexturefactory"

export class BallMaterialFactory {
  private static readonly materialCache: Map<
    string,
    MeshStandardMaterial | MeshPhongMaterial
  > = new Map()

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
    /*
     * for hard textures
     *    numberTexture.magFilter = THREE.NearestFilter
     *    numberTexture.minFilter = THREE.NearestFilter
     */
    const material = new MeshStandardMaterial({
      color: color,
      roughness: 0.5,
      metalness: 0,
      flatShading: true,
      transparent: false,
      depthWrite: true,
    })

    material.onBeforeCompile = (shader: any) => {
      shader.uniforms.numberTex = { value: numberTexture }
      shader.uniforms.invScale = { value: 1 / (R * 2) }

      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `#include <common>
         varying vec3 vLocalPosition;`
      )
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         vLocalPosition = position;`
      )

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `#include <common>
        uniform sampler2D numberTex;
        uniform float invScale;
        varying vec3 vLocalPosition;`
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
     
        diffuseColor.rgb = texColor.rgb;`
      )
    }
    this.materialCache.set(key, material)
    return material
  }
}
