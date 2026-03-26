import fs from "node:fs"
import path from "node:path"
import { Session } from "../../src/network/client/session"
jest.dontMock("fs")

const html = fs.readFileSync(
  path.resolve(__dirname, "../../dist/index.html"),
  "utf8"
)

export function initDom() {
  document.body.innerHTML = html
  Session.init("test-client", "TestPlayer", "test-table", false)
}

export const canvas3d = document.getElementById("viewP1") as HTMLCanvasElement
