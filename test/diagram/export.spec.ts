import fs from "node:fs"
import path from "node:path"

// The exporter is a page, not a module: its config building is inline, so the
// only thing a test can hold it to is that it takes the constants decision from
// the one tested place rather than growing a copy of the defaults again.
const page = fs.readFileSync(
  path.resolve(__dirname, "../../dist/diagrams/export.html"),
  "utf8"
)

describe("diagram exporter", () => {
  it("leaves default physics constants out of data-json-shots", () => {
    expect(page).toContain(
      'import { changedConstants } from "./editor-state.js"'
    )
    expect(page).toContain("const constantParams = changedConstants(params)")

    // The list of keys and their defaults lives in editor-state.js; a second
    // copy here is how the defaults would drift back into every diagram.
    expect(page).not.toContain("CONSTANT_KEYS")
    expect(page).not.toContain("PHYSICS_DEFAULTS")
  })
})
