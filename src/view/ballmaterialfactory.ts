import {
  CanvasTexture,
  Color,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Shader,
  Vector3,
} from "three"
import { R } from "../model/physics/constants"

export class BallMaterialFactory {
  private static textureCache: Map<string, CanvasTexture> = new Map()
  private static materialCache: Map<string, MeshStandardMaterial | MeshPhongMaterial> = new Map()

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

  static createProjectedMaterial(label: number, color: Color): MeshStandardMaterial {
    const key = `projected_${label}_${color.getHex()}`
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as MeshStandardMaterial
    }

    const numberTexture = this.getOrCreateTexture(label, color)
    const material = new MeshStandardMaterial({
      color: color,
      roughness: 0.5,
      metalness: 0,
      flatShading: true,
    })

    material.onBeforeCompile = (shader: Shader) => {
      shader.uniforms.numberTex = { value: numberTexture }
      shader.uniforms.projSize = { value: 2.00 }

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

  private static getOrCreateTexture(label: number, color: Color): CanvasTexture {
    const key = `${label}_${color.getHex()}`
    if (this.textureCache.has(key)) {
      return this.textureCache.get(key)!
    }

    const texture = this.createNumberTexture(label, color)
    this.textureCache.set(key, texture)
    return texture
  }

  private static createNumberTexture(label: number, color: Color): CanvasTexture {
    const size = 256
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return new CanvasTexture(canvas)
    }

    // Background
    ctx.fillStyle = `#${color.getHexString()}`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Noise
    const rand = () => Math.random() * size
    const noiseAlpha = 0.01
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${noiseAlpha})` : `rgba(0,0,0,${noiseAlpha})`
      ctx.fillRect(rand(), rand(), 10, 10)
    }

    // Stripes for Nineball (9-15)
    if (label >= 9) {
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, size, size / 4)
      ctx.fillRect(0, (size * 3) / 4, size, size / 4)
    }

    if (label > 0) {
      const centerX = size / 2
      const centerY = size / 2
      const radius = 53

      // Black circle (border)
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2)
      ctx.fillStyle = "black"
      ctx.fill()

      // White circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()

      // Number
      ctx.fillStyle = "black"
      ctx.font = "bold 80px Arial, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label.toString(), centerX, centerY + 5)
    }

    const texture = new CanvasTexture(canvas)
    texture.flipY = false
    return texture
  }
}
