import {
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  LatheGeometry,
  LinearFilter,
  Material,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  Texture,
  TorusGeometry,
  Vector2,
} from "three"

export class Trophy {
  group = new Group()
  private seed: number
  private readonly geometries: BufferGeometry[] = []
  private readonly materials: Material[] = []
  private texture?: Texture

  constructor(seed: number, flags: string[]) {
    this.seed = seed
    this.createTrophy(flags)
  }

  public dispose(): void {
    this.geometries.forEach((g) => g.dispose())
    this.materials.forEach((m) => m.dispose())
    this.texture?.dispose()
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

  private createTrophy(flags: string[]) {
    const segments = Math.floor(this.random(10, 13))
    const layers = 50
    const maxHeight = this.random(3.5, 5)
    const baseRadius = this.random(0.6, 0.9)
    const freq = this.random(1.5, 3.5)
    const amp = this.random(0.1, 0.3)

    const points: Vector2[] = []
    for (let i = 0; i <= layers; i++) {
      const t = i / layers
      let r = baseRadius * (1 + Math.sin(t * Math.PI * freq) * amp)
      if (t > 0.1 && t < 0.7)
        r *= 0.5 + Math.pow(Math.sin(t * Math.PI), 1.5) * 0.5
      if (t > 0.92) r += ((t - 0.92) / 0.08) * 0.6
      points.push(new Vector2(Math.max(0.1, r), t * maxHeight))
    }

    const geometry = new LatheGeometry(points, segments)
    this.geometries.push(geometry)
    const material = new MeshStandardMaterial({
      color: this.getMetallicColor(),
      flatShading: true,
      metalness: 0.5,
      roughness: 0.15,
      side: DoubleSide,
    })
    this.materials.push(material)

    const mesh = new Mesh(geometry, material)
    mesh.position.y = 0.9
    mesh.castShadow = false
    this.group.add(mesh)

    if (this.random(0, 1) > 0.3) {
      const yPos = maxHeight * this.random(0.4, 0.7) + 0.9
      const xOffset = baseRadius * this.random(0.8, 1.2)
      let sideMesh: Mesh
      if (this.random(0, 1) > 0.5) {
        const sideGeo = new ConeGeometry(baseRadius * 0.4, maxHeight * 0.4, 3)
        this.geometries.push(sideGeo)
        sideMesh = new Mesh(sideGeo, material)
        sideMesh.rotation.z = -Math.PI / 4
      } else {
        const sideGeo = new TorusGeometry(baseRadius * 0.6, 0.1, 4, 8)
        this.geometries.push(sideGeo)
        sideMesh = new Mesh(sideGeo, material)
      }
      sideMesh.position.set(xOffset, yPos, 0)
      sideMesh.castShadow = true
      this.group.add(sideMesh)
    }

    const woodMat = new MeshStandardMaterial({
      color: new Color(0x5c3a21),
      roughness: 0.9,
      flatShading: true,
    })
    this.materials.push(woodMat)

    this.texture = this.createFlagTexture(flags)
    const flagMat = new MeshStandardMaterial({
      map: this.texture,
      roughness: 0.8,
    })
    this.materials.push(flagMat)

    const plinthBaseGeo = new CylinderGeometry(
      baseRadius * 1.5,
      baseRadius * 1.6,
      0.3,
      segments
    )
    this.geometries.push(plinthBaseGeo)
    const plinthBase = new Mesh(plinthBaseGeo, woodMat)
    plinthBase.position.y = 0.15
    plinthBase.castShadow = true
    plinthBase.receiveShadow = true
    this.group.add(plinthBase)

    const plinthTopHeight = 0.6
    const plinthTopGeo = new CylinderGeometry(
      baseRadius * 1.2,
      baseRadius * 1.3,
      plinthTopHeight,
      segments
    )
    this.geometries.push(plinthTopGeo)
    const plinthTop = new Mesh(plinthTopGeo, flagMat)
    plinthTop.position.y = 0.3 + plinthTopHeight / 2
    plinthTop.castShadow = true
    plinthTop.receiveShadow = true
    this.group.add(plinthTop)
    this.group.scale.setScalar(0.075)
    this.group.rotation.x = Math.PI / 2
  }

  private getMetallicColor(): Color {
    return this.random(0, 1) > 0.5 ? new Color(0xffd700) : new Color(0xf0f0f0)
  }
}
