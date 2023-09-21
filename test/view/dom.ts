import fs from "fs"
import path from "path"
jest.dontMock("fs")

const html = fs.readFileSync(
  path.resolve(__dirname, "../../dist/index.html"),
  "utf8"
)

export function initDom() {
  document.body.innerHTML = html
}
