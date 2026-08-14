import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Scene,
  SRGBColorSpace,
  Vector3,
} from "three"

const GRID_SIZE = 24
const TOTAL_INSTANCES = GRID_SIZE * GRID_SIZE // 576

// Grid spacing: SPACING_Y across the wall (local Y), SPACING_Z up it (local Z).
const SPACING_Y = 0.0475
const SPACING_Z = 0.042

export interface PortraitOrientation {
  normal: Vector3
  up: Vector3
}

export interface PortraitOptions {
  emoji: string
  name?: string
  position?: Vector3
  orientation: PortraitOrientation
  scale?: number
}

interface InstanceData {
  posY: number
  posZ: number
  rotX: number
  rotY: number
  lift: number
  scale: number
  r: number
  g: number
  b: number
}

/**
 * A static emoji portrait: border frame, instanced emoji triangles, fake
 * shadows, and an optional name plaque. Faithful TS port of `dist/wall.html`'s
 * `createEmojiWall`. Geometry is authored in local YZ space with +X as the
 * facing normal and +Z as up; `orientation` maps that local frame onto any
 * wall in the scene, `position` places it, and `scale` sizes it. The overlay
 * is baked once on construction (and again on `setState`), so it can be added
 * to a scene like any static asset — no per-frame updates.
 *
 * All polygons are single-sided and face +X in local space, so the wall's
 * normal must point toward the viewer for the portrait to be visible.
 */
export class Portrait {
  readonly group = new Group()

  private readonly totalInstances = TOTAL_INSTANCES

  private readonly state = { emoji: "📺", name: "" }

  private readonly samplerCanvas: HTMLCanvasElement
  private readonly samplerCtx: CanvasRenderingContext2D | null

  private readonly instancedMesh: InstancedMesh
  private readonly shadowMesh: InstancedMesh

  private readonly plate: Mesh
  private readonly plateCanvas: HTMLCanvasElement
  private readonly plateCtx: CanvasRenderingContext2D | null
  private readonly plateTexture: CanvasTexture

  private readonly dummy = new Object3D()
  private readonly color = new Color()
  private readonly instancesData: InstanceData[] = []

  constructor(scene: Scene, options: PortraitOptions) {
    this.state.emoji = options.emoji
    this.state.name = options.name ?? ""
    const scale = options.scale ?? 1

    // Emoji sampler: 24x24 offscreen canvas, read back to drive the instances.
    this.samplerCanvas = document.createElement("canvas")
    this.samplerCanvas.width = GRID_SIZE
    this.samplerCanvas.height = GRID_SIZE
    this.samplerCtx = this.samplerCanvas.getContext("2d", {
      willReadFrequently: true,
    })

    // Single-sided materials: every mesh faces +X in local space, so the
    // wall's normal must point toward the viewer.
    const borderMat = new MeshStandardMaterial({
      color: 0x1f1f1f,
      roughness: 0.4,
      metalness: 0.1,
    })
    const borderShadowMat = new MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
    })

    // Flat planar border, floating just off the wall surface.
    const borderGeometry = Portrait.createBorderGeometry(1.225, 1.09, 0.015)
    const borderMesh = new Mesh(borderGeometry, borderMat)
    borderMesh.position.x = -0.065
    // TEMP: hide the portrait border frame.
    borderMesh.visible = false
    this.group.add(borderMesh)

    // Fake drop shadow of the border, flush against the wall.
    const borderShadowMesh = new Mesh(borderGeometry, borderShadowMat)
    borderShadowMesh.position.set(-0.069, 0.008, -0.008)
    borderShadowMesh.visible = false
    this.group.add(borderShadowMesh)

    // Instanced planar triangles (1 GPU draw call), lying in the wall plane
    // and facing +X.
    const planarTriGeom = new CircleGeometry(0.029, 3)
    planarTriGeom.rotateZ(Math.PI / 6)
    planarTriGeom.rotateY(Math.PI / 2)

    const material = new MeshStandardMaterial({
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    })
    this.instancedMesh = new InstancedMesh(
      planarTriGeom,
      material,
      this.totalInstances
    )
    this.group.add(this.instancedMesh)

    // Dark grey instance shadow material (no transparency).
    const shadowMaterial = new MeshBasicMaterial({ color: 0x404040 })
    this.shadowMesh = new InstancedMesh(
      planarTriGeom,
      shadowMaterial,
      this.totalInstances
    )
    this.group.add(this.shadowMesh)

    // YXZ order makes rotation.set(spin, tilt, 0) compose as RY(tilt)-RX(spin).
    this.dummy.rotation.order = "YXZ"

    const HALF_GRID = (GRID_SIZE - 1) / 2
    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const posY = (gx - HALF_GRID) * SPACING_Y
        const posZ = (HALF_GRID - gy) * SPACING_Z

        // Static concentric wave orientation: rotX spins the triangle in the
        // wall plane, rotY tilts it about the wall's horizontal axis.
        const dist = Math.hypot(gx - HALF_GRID, gy - HALF_GRID)
        const rotX = dist * 0.4
        const rotY = Math.sin(dist * 0.5) * 0.3

        this.instancesData.push({
          posY,
          posZ,
          rotX,
          rotY,
          lift: 0,
          scale: 0.01,
          r: 0.1,
          g: 0.1,
          b: 0.15,
        })
      }
    }

    // Name plaque: a thin textured quad mounted below the border.
    this.plateCanvas = document.createElement("canvas")
    this.plateCanvas.width = 512
    this.plateCanvas.height = 96
    this.plateCtx = this.plateCanvas.getContext("2d")
    this.plateTexture = new CanvasTexture(this.plateCanvas)
    this.plateTexture.colorSpace = SRGBColorSpace
    // Canvas 2D draws premultiplied, so tell three to match or the text will
    // pick up a dark fringe against the now-transparent background.
    this.plateTexture.premultiplyAlpha = true
    const plateMat = new MeshBasicMaterial({
      map: this.plateTexture,
      transparent: true,
      depthWrite: false,
    })
    // 512/96 = 0.9/0.16875, so the texture keeps its aspect ratio on the plane.
    this.plate = new Mesh(
      Portrait.createWallQuadGeometry(0.9, 0.16875),
      plateMat
    )
    // The border's inner hole spans z in [-0.545, 0.545]; mount below it.
    this.plate.position.set(-0.055, 0, -0.55)
    this.group.add(this.plate)

    // Orient + position + scale the whole overlay, then add it to the scene.
    const orientation = options.orientation
    const normal = orientation.normal.clone().normalize()
    const requestedUp = orientation.up.clone().normalize()
    const right = new Vector3().crossVectors(requestedUp, normal)
    if (right.lengthSq() === 0) {
      throw new Error("Portrait orientation vectors must not be parallel")
    }
    right.normalize()
    const up = new Vector3().crossVectors(normal, right).normalize()
    this.group.quaternion.setFromRotationMatrix(
      new Matrix4().makeBasis(normal, right, up)
    )
    if (options.position) this.group.position.copy(options.position)
    this.group.scale.setScalar(scale)
    scene.add(this.group)

    this.updateWall()
    this.bake()
    this.drawPlate()
  }

  setState(patch: { emoji?: string; name?: string }): void {
    if (patch.emoji !== undefined) this.state.emoji = patch.emoji
    if (patch.name !== undefined) this.state.name = patch.name
    this.updateWall()
    this.bake()
    this.drawPlate()
  }

  dispose(): void {
    this.plateTexture.dispose()
    this.group.traverse((child) => {
      const mesh = child as Mesh
      if (!mesh.isMesh) return
      mesh.geometry?.dispose()
      const material = mesh.material
      if (Array.isArray(material)) material.forEach((m) => m.dispose())
      else material.dispose()
    })
    this.group.removeFromParent()
  }

  private getEmojiPixelData(emoji: string): Uint8ClampedArray {
    const ctx = this.samplerCtx
    if (!ctx) return new Uint8ClampedArray(GRID_SIZE * GRID_SIZE * 4)
    ctx.clearRect(0, 0, GRID_SIZE, GRID_SIZE)
    ctx.font = "19px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(emoji, GRID_SIZE / 2, GRID_SIZE / 2 + 1)
    return ctx.getImageData(0, 0, GRID_SIZE, GRID_SIZE).data
  }

  private updateWall(): void {
    const pixelData = this.getEmojiPixelData(this.state.emoji)

    for (let i = 0; i < this.totalInstances; i++) {
      const item = this.instancesData[i]
      const pixelIndex = i * 4

      const alpha = pixelData[pixelIndex + 3] / 255

      if (alpha > 0.1) {
        const r = pixelData[pixelIndex] / 255
        const g = pixelData[pixelIndex + 1] / 255
        const b = pixelData[pixelIndex + 2] / 255
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b
        item.r = r
        item.g = g
        item.b = b
        item.scale = 1.0
        // Float the glyphs off the wall toward the camera (+X) and lift them
        // by pixel luminance.
        item.lift = luminance * 0.05 - 0.03
      } else {
        // Empty cells are hidden entirely (no background triangles)
        item.scale = 0
        item.lift = 0
      }
    }
  }

  // Writes the static instance matrices/colours a single time. The portrait
  // never changes after this, so there is no per-frame tick: the transforms
  // are baked on creation and again on each setState.
  private bake(): void {
    for (let i = 0; i < this.totalInstances; i++) {
      const item = this.instancesData[i]

      // Main triangles
      this.dummy.position.set(item.lift, item.posY, item.posZ)
      this.dummy.rotation.set(item.rotX, item.rotY, 0)
      this.dummy.scale.set(item.scale, item.scale, item.scale)
      this.dummy.updateMatrix()
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix)

      this.color.setRGB(item.r, item.g, item.b)
      this.instancedMesh.setColorAt(i, this.color)

      // Fake shadow flat against the wall (in-plane spin only)
      this.dummy.position.set(-0.069, item.posY, item.posZ)
      this.dummy.rotation.set(item.rotX, 0, 0)
      this.dummy.scale.set(item.scale, item.scale, item.scale)
      this.dummy.updateMatrix()
      this.shadowMesh.setMatrixAt(i, this.dummy.matrix)
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true
    if (this.instancedMesh.instanceColor) {
      this.instancedMesh.instanceColor.needsUpdate = true
    }
    this.shadowMesh.instanceMatrix.needsUpdate = true
  }

  private drawPlate(): void {
    this.plate.visible = this.state.name.length > 0
    if (!this.plate.visible) return
    const ctx = this.plateCtx
    if (!ctx) return

    ctx.clearRect(0, 0, this.plateCanvas.width, this.plateCanvas.height)

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Prefer 60px Exo but shrink to fit long names on the plaque.
    let fontPx = 60
    ctx.font = `700 ${fontPx}px 'Exo', sans-serif`
    while (
      ctx.measureText(this.state.name).width > this.plateCanvas.width - 24 &&
      fontPx > 32
    ) {
      fontPx -= 4
      ctx.font = `700 ${fontPx}px 'Exo', sans-serif`
    }

    // Transparent plaque: no background fill, just the text and a soft drop
    // shadow. The canvas alpha channel carries both, so the quad stays
    // see-through everywhere else (the material is already transparent).
    ctx.shadowColor = "rgba(0, 0, 0, 0.95)"
    ctx.shadowBlur = 5
    ctx.shadowOffsetY = 4
    ctx.fillStyle = "#e6edf3"
    ctx.fillText(
      this.state.name,
      this.plateCanvas.width / 2,
      this.plateCanvas.height / 2
    )
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0

    this.plateTexture.needsUpdate = true
  }

  /**
   * Minimal 2D planar rectangular border (hollow rectangle) in the YZ plane,
   * facing +X. 8 vertices, 8 triangles (16 indices).
   */
  private static createBorderGeometry(
    width: number,
    height: number,
    thickness: number
  ): BufferGeometry {
    const halfW = width / 2
    const halfH = height / 2
    const halfOuterW = halfW + thickness
    const halfOuterH = halfH + thickness

    const vertices = new Float32Array([
      0,
      -halfOuterW,
      halfOuterH,
      0,
      halfOuterW,
      halfOuterH,
      0,
      halfOuterW,
      -halfOuterH,
      0,
      -halfOuterW,
      -halfOuterH,
      0,
      -halfW,
      halfH,
      0,
      halfW,
      halfH,
      0,
      halfW,
      -halfH,
      0,
      -halfW,
      -halfH,
    ])

    const normals = new Float32Array([
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    ])

    const uvs = new Float32Array([
      0, 1, 1, 1, 1, 0, 0, 0, 0.2, 0.8, 0.8, 0.8, 0.8, 0.2, 0.2, 0.2,
    ])

    const indices = [
      0, 4, 5, 0, 5, 1, 1, 5, 6, 1, 6, 2, 2, 6, 7, 2, 7, 3, 3, 7, 4, 3, 4, 0,
    ]

    const geometry = new BufferGeometry()
    geometry.setAttribute("position", new BufferAttribute(vertices, 3))
    geometry.setAttribute("normal", new BufferAttribute(normals, 3))
    geometry.setAttribute("uv", new BufferAttribute(uvs, 2))
    geometry.setIndex(indices)
    return geometry
  }

  /**
   * Minimal quad in the wall plane (YZ), facing +X, with upright UVs: u runs
   * along +Y (horizontal), v along +Z (vertical).
   */
  private static createWallQuadGeometry(
    width: number,
    height: number
  ): BufferGeometry {
    const halfW = width / 2
    const halfH = height / 2

    const positions = new Float32Array([
      0,
      -halfW,
      halfH, // 0 top-left
      0,
      halfW,
      halfH, // 1 top-right
      0,
      halfW,
      -halfH, // 2 bottom-right
      0,
      -halfW,
      -halfH, // 3 bottom-left
    ])
    const normals = new Float32Array([1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0])
    const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0])
    const indices = [0, 2, 1, 0, 3, 2]

    const geometry = new BufferGeometry()
    geometry.setAttribute("position", new BufferAttribute(positions, 3))
    geometry.setAttribute("normal", new BufferAttribute(normals, 3))
    geometry.setAttribute("uv", new BufferAttribute(uvs, 2))
    geometry.setIndex(indices)
    return geometry
  }
}
