const path = require("node:path")
const { pathToFileURL } = require("node:url")
const { createNavigation } = require("../../desktop/navigation.cjs")

describe("desktop navigation", () => {
  const distRoot = path.resolve(__dirname, "..", "fixtures", "desktop-dist")
  const existingFiles = new Set([
    path.join(distRoot, "index.html"),
    path.join(distRoot, "lobby.html"),
    path.join(distRoot, "practice.html"),
    path.join(distRoot, "diagrams", "three.html"),
  ])
  const navigation = createNavigation({
    distRoot,
    fileExists: (filePath) => existingFiles.has(path.resolve(filePath)),
  })

  it("allows file URLs inside dist", () => {
    expect(
      navigation.isSafeFileUrl(
        pathToFileURL(path.join(distRoot, "index.html")).href
      )
    ).toBe(true)
    expect(
      navigation.isSafeFileUrl(
        pathToFileURL(path.join(distRoot, "diagrams", "three.html")).href
      )
    ).toBe(true)
  })

  it("blocks file URLs outside dist", () => {
    expect(
      navigation.isSafeFileUrl(
        pathToFileURL(path.join(distRoot, "..", "secret.html")).href
      )
    ).toBe(false)
    expect(
      navigation.isSafeFileUrl("https://billiards.tailuge.workers.dev/")
    ).toBe(false)
  })

  it("maps billiards web routes to local desktop files", () => {
    expect(
      navigation.toLocalGameUrl(
        "https://billiards.tailuge.workers.dev/?ruletype=snooker#rack"
      )
    ).toBe(
      `${pathToFileURL(path.join(distRoot, "index.html")).href}?ruletype=snooker#rack`
    )
    expect(
      navigation.toLocalGameUrl(
        "https://billiards.tailuge.workers.dev/lobby.html?userName=P1"
      )
    ).toBe(
      `${pathToFileURL(path.join(distRoot, "lobby.html")).href}?userName=P1`
    )
    expect(
      navigation.toLocalGameUrl(
        "https://billiards.tailuge.workers.dev/practice?state=abc"
      )
    ).toBe(
      `${pathToFileURL(path.join(distRoot, "practice.html")).href}?state=abc`
    )
    expect(
      navigation.toLocalGameUrl(
        "https://billiards.tailuge.workers.dev/diagrams/three"
      )
    ).toBe(pathToFileURL(path.join(distRoot, "diagrams", "three.html")).href)
  })

  it("falls back to the game page for unknown billiards web routes", () => {
    expect(
      navigation.toLocalGameUrl(
        "https://billiards.tailuge.workers.dev/no-such-page?x=1"
      )
    ).toBe(`${pathToFileURL(path.join(distRoot, "index.html")).href}?x=1`)
  })

  it("does not map unrelated origins", () => {
    expect(
      navigation.toLocalGameUrl("https://github.com/tailuge/billiards")
    ).toBeNull()
  })

  it("classifies external browser URLs", () => {
    expect(
      navigation.isExternalUrl("https://github.com/tailuge/billiards")
    ).toBe(true)
    expect(navigation.isExternalUrl("mailto:test@example.com")).toBe(true)
    expect(navigation.isExternalUrl("javascript:alert(1)")).toBe(false)
    expect(
      navigation.isExternalUrl(
        pathToFileURL(path.join(distRoot, "index.html")).href
      )
    ).toBe(false)
  })
})
