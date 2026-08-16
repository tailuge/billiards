import { R } from "../model/physics/constants"
import { up } from "../utils/three-utils"
import {
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  RepeatWrapping,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
} from "three"

/**
 * Per-player cue appearance, mirroring dist/cue.html's DEFAULT_STATE.
 * Missing fields fall back to DEFAULT_CUE_PARAMS; values are used as
 * supplied (no clamping or validation).
 */
export type CueParams = {
  shaftColour?: string
  buttColour?: string
  jointColour?: string
  jointLength?: number
  ferruleColour?: string
  ferruleLength?: number
  buttRatio?: number
  grain?: boolean
}

/** dist/cue.html's default cue look. */
export const DEFAULT_CUE_PARAMS: Required<CueParams> = {
  shaftColour: "#d2b48c",
  buttColour: "#0d0d0d",
  jointColour: "#2b2f36",
  jointLength: 0.004, // 4 mm collar
  ferruleColour: "#e5e5e5",
  ferruleLength: 0.015, // 1.5 cm ferrule
  buttRatio: 0.4,
  grain: true,
}

export type CueMeshes = {
  mesh: Group
  tiltMesh: Group
  cueBody: Group
}

type MaterialStyle = {
  shininess: number
  specular: number
}

export class CueMesh {
  static mesh: Mesh
  static readonly baseTilt = 0.12
  /** Multiplier on the cue butt radius for the invisible fat hit zone used by
   * CueHit's pointerdown raycast (a wider tap target on touch, not longer). */
  static readonly fatHitRadiusFactor = 3

  static readonly placermaterial = new MeshPhongMaterial({
    color: 0xffffff,
    wireframe: false,
    flatShading: false,
    transparent: false,
  })

  static indicateValid(valid) {
    CueMesh.placermaterial.color.setHex(valid ? 0xccffcc : 0xff0000)
  }

  private static readonly helpermaterial = new ShaderMaterial({
    uniforms: {
      lightDirection: { value: new Vector3(0, 0, 1) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vNormal = normal;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform vec3 lightDirection;
      void main() {
        float intensity = dot(vNormal, lightDirection);
        vec3 color = vec3(1.0, 1.0, 1.0);
        vec3 finalColor = color * intensity;
        gl_FragColor = vec4(finalColor, 0.075 * (1.0-vUv.y));
      }
    `,
    wireframe: false,
    transparent: true,
  })

  // cue.html's JOINT_STYLES / FERRULE_STYLES specular maps.
  private static readonly jointStyles: Record<string, MaterialStyle> = {
    "#2b2f36": { shininess: 25, specular: 0x333333 },
    "#e5e5e5": { shininess: 100, specular: 0x111111 },
    "#d9a62e": { shininess: 150, specular: 0xfff2c8 },
    "#c7ccd6": { shininess: 160, specular: 0xffffff },
  }
  private static readonly ferruleStyles: Record<string, MaterialStyle> = {
    "#e5e5e5": { shininess: 100, specular: 0x111111 },
    "#d9a62e": { shininess: 150, specular: 0xfff2c8 },
  }

  static createHelper() {
    const geometry = new CylinderGeometry(R, R, (R * 30) / 0.5, 12, 1, true)
    const mesh = new Mesh(geometry, this.helpermaterial)
    mesh.geometry
      .applyMatrix4(new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2))
      .applyMatrix4(
        new Matrix4()
          .identity()
          .makeTranslation((R * 15) / 0.5, 0, (-R * 0.01) / 0.5)
      )
    mesh.visible = false
    mesh.renderOrder = -1
    mesh.material.depthTest = false
    return mesh
  }

  static createPlacer() {
    const group = new Group()
    const pyramidGeo = new ConeGeometry(0.75 * R, 1.6 * R, 4)
    const n = 4
    for (let i = 0; i < n; i++) {
      const pyramid = new Mesh(pyramidGeo, CueMesh.placermaterial)
      const angle = (i * 2 * Math.PI) / n

      // Distribute around the ball
      pyramid.position.x = Math.cos(angle) * 2 * R
      pyramid.position.y = Math.sin(angle) * 2 * R
      pyramid.position.z = 1 * R // Hover height

      // Point toward the center
      pyramid.lookAt(0, 0, R)
      // Adjust rotation because ConeGeometry points up its Y axis
      pyramid.rotateX(Math.PI / 2)

      group.add(pyramid)
    }
    group.visible = false
    return group
  }

  static createShadow(length: number) {
    const geometry = new PlaneGeometry(length, R * 0.4)
    geometry.applyMatrix4(
      new Matrix4().identity().makeTranslation(-length / 2 - R, 0, 0)
    )
    const material = new MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.25,
      transparent: true,
      depthWrite: false,
    })
    const mesh = new Mesh(geometry, material)
    mesh.visible = true
    return mesh
  }

  static createCue(
    tip: number,
    but: number,
    length: number,
    opts?: CueParams
  ): CueMeshes {
    const cueBody = this.cueGeometry(tip, but, length, 11, opts)
    const tiltGroup = new Group()
    const mesh = new Group()

    cueBody.applyMatrix4(
      new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2)
    )
    cueBody.position.set(-length / 2 - R, 0, R * 0.12)
    tiltGroup.rotation.y = this.baseTilt
    tiltGroup.add(cueBody)
    tiltGroup.add(
      CueMesh.createFatHit(length, but * CueMesh.fatHitRadiusFactor)
    )
    mesh.add(tiltGroup)
    return { mesh, tiltMesh: tiltGroup, cueBody }
  }

  /**
   * Invisible, fat cylinder aligned with the cue (same length, wider radius).
   * Used only for CueHit's pointerdown hit test, so it never follows the
   * dragT retraction or hit-animation stroke. `visible=false` still raycasts
   * (three's Raycaster tests layers, not visibility).
   */
  static createFatHit(length: number, radius: number): Mesh {
    const geometry = new CylinderGeometry(radius, radius, length, 8, 1, false)
    geometry.applyMatrix4(
      new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2)
    )
    const material = new MeshBasicMaterial()
    const mesh = new Mesh(geometry, material)
    mesh.position.set(-length / 2 - R, 0, R * 0.12)
    mesh.visible = false
    mesh.name = "cueHitZone"
    return mesh
  }

  /**
   * Port of dist/cue.html's cueGeometry: butt / collar / shaft / ferrule / tip
   * built along +Y. The butt is a 4-point full splice and a collar band sits
   * at the shaft/butt joint. Materials are created per call so each player's
   * cue has independent materials — no shared-state mutation.
   */
  static cueGeometry(
    tipRadius: number,
    buttRadius: number,
    length: number,
    segments = 11,
    opts: CueParams = {}
  ): Group {
    const p = { ...DEFAULT_CUE_PARAMS, ...opts }
    const group = new Group()

    const { jointLength, ferruleLength, buttRatio } = p

    const shaftMat = new MeshPhongMaterial({
      color: p.shaftColour,
      shininess: 50,
    })
    const buttMat = new MeshPhongMaterial({
      color: p.buttColour,
      shininess: 80,
    })
    const jointMat = new MeshPhongMaterial({
      color: p.jointColour,
      shininess: 25,
    })
    // cue.html applies a JOINT_STYLES entry only when the colour matches; a
    // custom colour keeps the material's defaults.
    const jointStyle = CueMesh.jointStyles[p.jointColour]
    if (jointStyle) {
      jointMat.shininess = jointStyle.shininess
      jointMat.specular.set(jointStyle.specular)
    }
    const ferruleStyle =
      CueMesh.ferruleStyles[p.ferruleColour] || CueMesh.ferruleStyles["#e5e5e5"]
    const ferruleMat = new MeshPhongMaterial({
      color: p.ferruleColour,
      shininess: ferruleStyle.shininess,
      specular: ferruleStyle.specular,
    })
    const tipMat = new MeshPhongMaterial({ color: 0x4a7c9a, shininess: 5 })

    if (p.grain) {
      shaftMat.map = CueMesh.woodGrainTexture(p.shaftColour)
      buttMat.map = CueMesh.woodGrainTexture(p.buttColour, 11)
    }
    // Butt length is a ratio of the total so the cue stays the same size;
    // the collar and ferrule eat into the shaft.
    const buttLength = length * buttRatio
    const shaftLength = length * (1 - buttRatio) - jointLength - ferruleLength

    const buttBottomY = -length / 2
    const spliceTopY = buttBottomY + buttLength
    const spliceLength = buttLength * 0.38

    const radiusAtY = (y: number) => {
      const t = (y - buttBottomY) / buttLength
      return buttRadius * (1 - 0.1 * t)
    }
    const vAtY = (y: number) => (y - buttBottomY) / buttLength

    const splice = CueMesh.createSpliceGeometries(
      spliceTopY,
      buttBottomY,
      spliceLength,
      radiusAtY,
      vAtY
    )
    group.add(new Mesh(splice.upper, shaftMat))
    group.add(new Mesh(splice.lower, buttMat))

    const cap = new Mesh(new CircleGeometry(buttRadius, 24), buttMat)
    cap.rotation.x = Math.PI / 2
    cap.position.y = buttBottomY
    group.add(cap)

    const jointRadius = buttRadius * 0.9
    const joint = new Mesh(
      new CylinderGeometry(jointRadius, jointRadius, jointLength, segments),
      jointMat
    )
    joint.position.y = spliceTopY + jointLength / 2
    group.add(joint)

    const shaft = new Mesh(
      new CylinderGeometry(tipRadius, jointRadius, shaftLength, segments),
      shaftMat
    )
    shaft.position.y = spliceTopY + jointLength + shaftLength / 2
    group.add(shaft)

    const ferrule = new Mesh(
      new CylinderGeometry(tipRadius, tipRadius, ferruleLength, segments),
      ferruleMat
    )
    ferrule.position.y = shaft.position.y + shaftLength / 2 + ferruleLength / 2
    group.add(ferrule)

    const tipHeight = 0.0055
    const tip = new Mesh(
      new CylinderGeometry(tipRadius * 0.93, tipRadius, tipHeight, segments),
      tipMat
    )
    tip.position.y = ferrule.position.y + ferruleLength / 2 + tipHeight / 2
    tip.name = "cueTip"
    group.add(tip)

    return group
  }

  /**
   * The seam between the two woods follows a triangular wave around the
   * circumference (one period per splice point), so the forearm wood ends in 4
   * prongs slotting into matching sockets in the butt wood.
   */
  private static createSpliceGeometries(
    startY: number,
    endY: number,
    spliceLength: number,
    radiusAtY: (y: number) => number,
    vAtY: (y: number) => number
  ): { upper: BufferGeometry; lower: BufferGeometry } {
    const N = 24
    const P = 4

    const upperPos: number[] = []
    const upperNorm: number[] = []
    const upperUV: number[] = []
    const lowerPos: number[] = []
    const lowerNorm: number[] = []
    const lowerUV: number[] = []

    for (let i = 0; i < N; i++) {
      const next = (i + 1) % N

      const u1 = i / N
      const u2 = (i + 1) / N

      const a1 = u1 * Math.PI * 2
      const a2 = u2 * Math.PI * 2

      // 1 at each point tip, 0 between the points
      const wave1 = 1 - Math.abs(2 * (((i * P) / N) % 1) - 1)
      const wave2 = 1 - Math.abs(2 * (((next * P) / N) % 1) - 1)

      const seamY1 = startY - wave1 * spliceLength
      const seamY2 = startY - wave2 * spliceLength

      const rTop = radiusAtY(startY)
      const rSeam1 = radiusAtY(seamY1)
      const rSeam2 = radiusAtY(seamY2)
      const rBottom = radiusAtY(endY)

      const pTop1 = new Vector3(
        Math.cos(a1) * rTop,
        startY,
        Math.sin(a1) * rTop
      )
      const pTop2 = new Vector3(
        Math.cos(a2) * rTop,
        startY,
        Math.sin(a2) * rTop
      )
      const pSeam1 = new Vector3(
        Math.cos(a1) * rSeam1,
        seamY1,
        Math.sin(a1) * rSeam1
      )
      const pSeam2 = new Vector3(
        Math.cos(a2) * rSeam2,
        seamY2,
        Math.sin(a2) * rSeam2
      )
      const pBot1 = new Vector3(
        Math.cos(a1) * rBottom,
        endY,
        Math.sin(a1) * rBottom
      )
      const pBot2 = new Vector3(
        Math.cos(a2) * rBottom,
        endY,
        Math.sin(a2) * rBottom
      )

      CueMesh.addSpliceQuad(
        upperPos,
        upperNorm,
        upperUV,
        pTop1,
        pSeam1,
        pTop2,
        pSeam2,
        u1,
        vAtY(startY),
        u1,
        vAtY(seamY1),
        u2,
        vAtY(startY),
        u2,
        vAtY(seamY2)
      )

      CueMesh.addSpliceQuad(
        lowerPos,
        lowerNorm,
        lowerUV,
        pSeam1,
        pBot1,
        pSeam2,
        pBot2,
        u1,
        vAtY(seamY1),
        u1,
        vAtY(endY),
        u2,
        vAtY(seamY2),
        u2,
        vAtY(endY)
      )
    }

    const upperGeo = new BufferGeometry()
    upperGeo.setAttribute("position", new Float32BufferAttribute(upperPos, 3))
    upperGeo.setAttribute("normal", new Float32BufferAttribute(upperNorm, 3))
    upperGeo.setAttribute("uv", new Float32BufferAttribute(upperUV, 2))

    const lowerGeo = new BufferGeometry()
    lowerGeo.setAttribute("position", new Float32BufferAttribute(lowerPos, 3))
    lowerGeo.setAttribute("normal", new Float32BufferAttribute(lowerNorm, 3))
    lowerGeo.setAttribute("uv", new Float32BufferAttribute(lowerUV, 2))

    return { upper: upperGeo, lower: lowerGeo }
  }

  private static addSpliceQuad(
    pos: number[],
    norm: number[],
    uv: number[],
    v1: Vector3,
    v2: Vector3,
    v3: Vector3,
    v4: Vector3,
    u1: number,
    uv1: number,
    u2: number,
    uv2: number,
    u3: number,
    uv3: number,
    u4: number,
    uv4: number
  ) {
    pos.push(v1.x, v1.y, v1.z, v3.x, v3.y, v3.z, v2.x, v2.y, v2.z)
    pos.push(v3.x, v3.y, v3.z, v4.x, v4.y, v4.z, v2.x, v2.y, v2.z)

    const n1 = new Vector3(v1.x, 0, v1.z).normalize()
    const n2 = new Vector3(v2.x, 0, v2.z).normalize()
    const n3 = new Vector3(v3.x, 0, v3.z).normalize()
    const n4 = new Vector3(v4.x, 0, v4.z).normalize()

    norm.push(n1.x, n1.y, n1.z, n3.x, n3.y, n3.z, n2.x, n2.y, n2.z)
    norm.push(n3.x, n3.y, n3.z, n4.x, n4.y, n4.z, n2.x, n2.y, n2.z)

    uv.push(u1, uv1, u3, uv3, u2, uv2)
    uv.push(u3, uv3, u4, uv4, u2, uv2)
  }

  /**
   * Procedural seeded wood-grain canvas texture (shaft seed 7, butt seed 11),
   * matching dist/cue.html. Returns a blank texture when no 2D context is
   * available (e.g. headless tests).
   */
  private static woodGrainTexture(hex: string, seed = 7): CanvasTexture | null {
    if (typeof document === "undefined") {
      return null
    }
    const w = 64
    const h = 512
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return new CanvasTexture(canvas)
    }

    ctx.fillStyle = hex
    ctx.fillRect(0, 0, w, h)

    const rng = CueMesh.mulberry32(seed)
    for (let i = 0; i < 140; i++) {
      const x = rng() * w
      const y = rng() * h
      const len = h * (0.4 + rng() * 0.6)
      ctx.strokeStyle =
        rng() > 0.45 ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.07)"
      ctx.lineWidth = 0.5 + rng() * 1.6
      ctx.beginPath()
      const amp = 0.4 + rng() * 1.6
      ctx.moveTo(x, y)
      for (let yy = 0; yy < len; yy += 6) {
        ctx.lineTo(x + Math.sin(yy * (0.05 + rng() * 0.06)) * amp, y + yy)
      }
      ctx.stroke()
    }

    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, "rgba(255,255,255,0.06)")
    grad.addColorStop(0.5, "rgba(0,0,0,0.05)")
    grad.addColorStop(1, "rgba(255,255,255,0.04)")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    const tex = new CanvasTexture(canvas)
    tex.wrapS = RepeatWrapping
    tex.repeat.set(4, 1)
    tex.colorSpace = SRGBColorSpace
    return tex
  }

  private static mulberry32(a: number) {
    return function () {
      a |= 0
      a = (a + 0x6d2b79f5) | 0
      let t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }
}
