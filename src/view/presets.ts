import {
  CanvasTexture,
  LinearFilter,
  Scene,
  Sprite,
  SpriteMaterial,
} from "three"
import { R } from "../model/physics/constants"
import { TableGeometry } from "./tablegeometry"

export type Rail = "L" | "l" | "S" | "s"

/** `[rail, diamondIndex, text]`, e.g. `["L", 0, "cue ball here"]` is `L0`. */
export type Annotation = [rail: Rail, index: number, text: string]

export interface Preset {
  name: string
  annotations: Annotation[]
}

export const PRESETS: Preset[] = [
  {
    name: "short rails",
    annotations: [
      ["s", 0, "0"],
      ["s", 1, "10"],
      ["s", 2, "20"],
      ["s", 3, "30"],
      ["s", 4, "40"],
      ["S", 0, "0"],
      ["S", 1, "5"],
      ["S", 2, "10"],
      ["S", 3, "15"],
      ["S", 4, "20"],
    ],
  },
  {
    name: "short rails (opposite)",
    annotations: [
      ["s", 0, "20"],
      ["s", 1, "15"],
      ["s", 2, "10"],
      ["s", 3, "5"],
      ["s", 4, "0"],
      ["S", 0, "40"],
      ["S", 1, "30"],
      ["S", 2, "20"],
      ["S", 3, "10"],
      ["S", 4, "0"],
    ],
  },
  {
    name: "long rail",
    annotations: [
      ["L", 0, "0"],
      ["L", 1, "10"],
    ],
  },
]

/** Rail positions divide the playing extent into eight (long) or four (short) parts. */
export function diamondPosition(rail: Rail, index: number) {
  const isLong = rail === "L" || rail === "l"
  if (!Number.isInteger(index) || index < 0 || index > (isLong ? 8 : 4)) {
    return null
  }
  if (isLong) {
    return {
      x: (index - 4) * (TableGeometry.tableX / 4),
      y: (rail === "L" ? -1 : 1) * (TableGeometry.Y + 2 * R),
    }
  }
  return {
    x: (rail === "S" ? -1 : 1) * (TableGeometry.X + 2 * R),
    y: (index - 2) * ((TableGeometry.tableY + R) / 2),
  }
}

const textures = new Map<string, CanvasTexture>()

function textTexture(text: string): CanvasTexture {
  const cached = textures.get(text)
  if (cached) return cached

  const size = 64
  const fontSize = 40
  const font = `500 ${fontSize}px sans-serif`
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!
  ctx.font = font
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, 20)
  ctx.fillStyle = "rgba(0,0,0,0.6)"
  ctx.fill()
  ctx.fillStyle = "white"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, size / 2, size / 2 + 2)

  const texture = new CanvasTexture(canvas)
  texture.minFilter = LinearFilter
  textures.set(text, texture)
  return texture
}

export class PresetOverlay {
  private readonly sprites: Sprite[] = []
  private index = -1

  constructor(private readonly scene: Scene) {}

  cycle() {
    this.index = this.index + 1 >= PRESETS.length ? -1 : this.index + 1
    if (this.index < 0) {
      this.hide()
    } else {
      this.show(PRESETS[this.index])
    }
  }

  show(preset: Preset) {
    this.hide()
    preset.annotations.forEach(([rail, index, text]) => {
      const pos = diamondPosition(rail, index)
      if (!pos) return
      const texture = textTexture(text)
      const size = 2 * R
      const sprite = new Sprite(
        new SpriteMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
        })
      )
      sprite.position.set(pos.x, pos.y, 0.02 + R)
      sprite.scale.set(size, size, 1)
      sprite.renderOrder = 1
      this.scene.add(sprite)
      this.sprites.push(sprite)
    })
  }

  hide() {
    this.sprites.forEach((sprite) => {
      this.scene.remove(sprite)
      sprite.material.dispose()
    })
    this.sprites.length = 0
  }
}
