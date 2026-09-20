import { execSync } from "child_process"
import * as fs from "fs"
import * as path from "path"
import * as os from "os"

describe("sitemap:cf script", () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sitemap-test-"))
    fs.mkdirSync(path.join(tmpDir, "dist"), { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it("transforms sitemap.xml to strip .html, update domains, remove xhtml links and update lastmod", () => {
    const originalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://tailuge.github.io/billiards/dist/lobby.html</loc>
    <xhtml:link rel="alternate" href="https://billiards.tailuge.workers.dev/lobby.html" />
    <lastmod>2020-01-01</lastmod>
  </url>
  <url>
    <loc>https://tailuge.github.io/billiards/index.html</loc>
    <xhtml:link rel="alternate" href="https://billiards.tailuge.workers.dev/index.html" />
    <lastmod>2020-01-01</lastmod>
  </url>
</urlset>`

    const originalRobots = `User-agent: *
Allow: /
Sitemap: https://tailuge.github.io/billiards/dist/sitemap.xml`

    const sitemapPath = path.join(tmpDir, "dist", "sitemap.xml")
    const robotsPath = path.join(tmpDir, "dist", "robots.txt")

    fs.writeFileSync(sitemapPath, originalSitemap)
    fs.writeFileSync(robotsPath, originalRobots)

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
    )
    const sitemapCfCmd = packageJson.scripts["sitemap:cf"]

    // Run command inside tmpDir context
    execSync(sitemapCfCmd, { cwd: tmpDir, stdio: "pipe" })

    const updatedSitemap = fs.readFileSync(sitemapPath, "utf8")
    const updatedRobots = fs.readFileSync(robotsPath, "utf8")

    // 1. .html removed from <loc>
    expect(updatedSitemap).toContain(
      "<loc>https://billiards.tailuge.workers.dev/lobby</loc>"
    )
    expect(updatedSitemap).toContain(
      "<loc>https://billiards.tailuge.workers.dev/index</loc>"
    )
    expect(updatedSitemap).not.toContain(".html</loc>")

    // 2. xhtml:link removed
    expect(updatedSitemap).not.toContain("xhtml:link")

    // 3. Domain replaced in robots.txt
    expect(updatedRobots).toContain(
      "Sitemap: https://billiards.tailuge.workers.dev/sitemap.xml"
    )

    // 4. lastmod updated
    const today = new Date().toISOString().slice(0, 10)
    expect(updatedSitemap).toContain(`<lastmod>${today}</lastmod>`)
  })
})
