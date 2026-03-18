import {
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  LatheGeometry,
  LinearFilter,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  TorusGeometry,
  Vector2,
} from "three"

export class Trophy {
  group = new Group()
  private seed: number

  constructor(seed: number, flags: string[]) {
    this.seed = seed
    this.createTrophy(flags)
  }

  private random(min: number, max: number): number {
    this.seed = (this.seed * 16807) % 2147483647
    return min + (this.seed / 2147483647) * (max - min)
  }

  private createFlagTexture(flags: string[]): CanvasTexture {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 64
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      throw new Error("Could not get 2d context")
    }

    // Wood background
    ctx.fillStyle = "#5c3a21"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const step = canvas.width / flags.length
    flags.forEach((flag, i) => {
      ctx.save()
      // Center in segment
      ctx.translate(step * (i + 0.5), canvas.height / 2)
      // scale(widthFactor, heightFactor)
      // Height is 1.8x, width is now 1.2x (20% increase)
      ctx.scale(1.2, 1.8)
      ctx.font = "36px serif"
      ctx.fillText(flag, 0, 0)
      ctx.restore()
    })

    const texture = new CanvasTexture(canvas)
    texture.wrapS = RepeatWrapping
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter
    return texture
  }

  private getMetallicColor(): Color {
    return this.random(0, 1) > 0.5 ? new Color(0xffd700) : new Color(0xf0f0f0)
  }

  private createTrophy(flags: string[]) {
    const segments = Math.floor(this.random(16, 32))
    const layers = 50
    const maxHeight = this.random(0.35, 0.5) // Scaled down for table
    const baseRadius = this.random(0.06, 0.09)
    const freq = this.random(1.5, 3.5)
    const amp = this.random(0.1, 0.3)

    const points: Vector2[] = []
    for (let i = 0; i <= layers; i++) {
      const t = i / layers
      let r = baseRadius * (1 + Math.sin(t * Math.PI * freq) * amp)
      if (t > 0.1 && t < 0.7) {
        r *= 0.5 + Math.pow(Math.sin(t * Math.PI), 1.5) * 0.5
      }
      if (t > 0.92) {
        r += ((t - 0.92) / 0.08) * 0.06
      }
      points.push(new Vector2(Math.max(0.01, r), t * maxHeight))
    }

    const geometry = new LatheGeometry(points, segments)
    const material = new MeshStandardMaterial({
      color: this.getMetallicColor(),
      flatShading: true,
      metalness: 0.5,
      roughness: 0.15,
      side: DoubleSide,
    })

    const mesh = new Mesh(geometry)
    mesh.material = material
    // mesh.castShadow = true; // Shadows not enabled in main renderer
    // In our system Z is up, so we rotate it to stand on the table
    mesh.rotation.x = Math.PI / 2
    mesh.position.z = 0.09 // Offset from plinth
    this.group.add(mesh)

    // Side Item
    if (this.random(0, 1) > 0.3) {
      const hPos = maxHeight * this.random(0.4, 0.7) + 0.09
      const offset = baseRadius * this.random(0.8, 1.2)
      let sideMesh: Mesh
      if (this.random(0, 1) > 0.5) {
        sideMesh = new Mesh(
          new ConeGeometry(baseRadius * 0.4, maxHeight * 0.4, 3),
          material
        )
        sideMesh.rotation.x = Math.PI / 2
        sideMesh.rotation.z = -Math.PI / 4
      } else {
        sideMesh = new Mesh(
          new TorusGeometry(baseRadius * 0.6, 0.01, 4, 8),
          material
        )
      }
      sideMesh.position.set(offset, 0, hPos)
      this.group.add(sideMesh)
    }

    const woodMat = new MeshStandardMaterial({
      color: 0x5c3a21,
      roughness: 0.9,
      flatShading: true,
    })

    const flagTex = this.createFlagTexture(flags)
    const flagMat = new MeshStandardMaterial({
      map: flagTex,
      roughness: 0.8,
      transparent: false,
    })

    const plinthBase = new Mesh(
      new CylinderGeometry(baseRadius * 1.5, baseRadius * 1.6, 0.03, segments),
      woodMat
    )
    plinthBase.rotation.x = Math.PI / 2
    plinthBase.position.z = 0.015
    this.group.add(plinthBase)

    const plinthTopHeight = 0.06
    const plinthTop = new Mesh(
      new CylinderGeometry(baseRadius * 1.2, baseRadius * 1.3, plinthTopHeight, segments),
      flagMat
    )
    plinthTop.rotation.x = Math.PI / 2
    plinthTop.position.z = 0.03 + plinthTopHeight / 2
    this.group.add(plinthTop)
  }
}
