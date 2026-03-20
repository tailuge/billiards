import { ParticleSystem } from "../../src/view/particle-system"
import { Scene, InstancedMesh, Color } from "three"

describe("ParticleSystem", () => {
  let scene: Scene

  beforeEach(() => {
    scene = new Scene()
    // Mock the scene.add method
    scene.add = jest.fn()
    scene.remove = jest.fn()
  })

  it("should initialize with the correct number of particles based on background filtering", () => {
    const system = new ParticleSystem({
      tableWidth: 10,
      tableLength: 10,
      backgroundColor: "#000000",
    })

    const canvas = document.createElement("canvas")
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext("2d")!

    // Fill background with black
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, 10, 10)

    // Draw 3 white pixels
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, 3, 1)

    system.initialise(scene, canvas)

    // Expected 3 particles because only 3 pixels are white (non-black)
    // The count property is private, but we can check the instancedMesh count
    const instancedMesh = (system as any).instancedMesh as InstancedMesh
    expect(instancedMesh.count).toBe(3)
    expect(scene.add).toHaveBeenCalledWith(instancedMesh)
  })

  it("should dispose of old particles when re-initialized", () => {
    const system = new ParticleSystem({
      tableWidth: 10,
      tableLength: 10,
      backgroundColor: "#000000",
    })

    const canvas = document.createElement("canvas")
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, 10, 10)

    system.initialise(scene, canvas)
    const firstMesh = (system as any).instancedMesh

    system.initialise(scene, canvas)
    const secondMesh = (system as any).instancedMesh

    expect(scene.remove).toHaveBeenCalledWith(firstMesh)
    expect(firstMesh).not.toBe(secondMesh)
  })

  it("should dispose properly", () => {
    const system = new ParticleSystem()
    const canvas = document.createElement("canvas")
    canvas.width = 88
    canvas.height = 44
    system.initialise(scene, canvas)

    const mesh = (system as any).instancedMesh
    system.dispose()

    expect(scene.remove).toHaveBeenCalledWith(mesh)
    expect((system as any).instancedMesh).toBeNull()
  })
})
