import { Trophy } from "../../src/view/trophy"

describe("Trophy", () => {
  it("should create a trophy group", () => {
    const trophy = new Trophy(123, ["🇬🇧"])
    expect(trophy.group).toBeDefined()
    expect(trophy.group.children.length).toBeGreaterThan(0)
  })

  it("should have metallic material", () => {
    const trophy = new Trophy(456, ["🇺🇸"])
    const cupMesh = trophy.group.children.find(c => c.type === "Mesh") as any
    expect(cupMesh.material.metalness).toBeDefined()
    expect(cupMesh.material.roughness).toBeDefined()
  })

  it("should produce consistent results for same seed", () => {
    const trophy1 = new Trophy(789, ["🇯🇵"])
    const trophy2 = new Trophy(789, ["🇯🇵"])

    // We can't easily check all properties, but let's check one position
    const mesh1 = trophy1.group.children[0]
    const mesh2 = trophy2.group.children[0]
    expect(mesh1.position.z).toBe(mesh2.position.z)
  })
})
