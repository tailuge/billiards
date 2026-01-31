import { Color, MeshPhongMaterial, MeshStandardMaterial } from "three"
import { R } from "../model/physics/constants"
import { BallTextureFactory } from "./balltexturefactory"

export class BallMaterialFactory {
  private static materialCache: Map<
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
    })
    this.materialCache.set(key, material)
    return material
  }

  static createProjectedMaterial(
    label: number,
    color: Color
  ): MeshStandardMaterial {
    const key = `projected_${label}_${color.getHex()}`
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as MeshStandardMaterial
    }

    const numberTexture = BallTextureFactory.getOrCreateTexture(label, color)
    const material = new MeshStandardMaterial({
      color: color,
      roughness: 0.5,
      metalness: 0,
      flatShading: true,
    })

    material.onBeforeCompile = (shader: any) => {
      shader.uniforms.numberTex = { value: numberTexture }
      shader.uniforms.projSize = { value: 2.0 }

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
        uniform float projSize;
        varying vec3 vLocalPosition;`
      )

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
         float r = ${R.toFixed(3)};
         vec3 locPos = vLocalPosition;

         // planar projection
         vec2 projUv = locPos.xz / (r * projSize) + 0.5;
         projUv = clamp(projUv, 0.0, 1.0);

         // sample & blend
         vec4 texColor = texture2D(numberTex, projUv);
         diffuseColor.rgb = texColor.rgb;
        `
      )
    }
    this.materialCache.set(key, material)
    return material
  }
}
