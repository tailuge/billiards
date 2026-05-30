const fs = require("node:fs")
const path = require("node:path")
const { fileURLToPath, pathToFileURL } = require("node:url")

const DEFAULT_GAME_ORIGIN = "https://billiards.tailuge.workers.dev"

function createNavigation({
  distRoot,
  gameOrigin = DEFAULT_GAME_ORIGIN,
  fileExists = fs.existsSync,
}) {
  const resolvedDistRoot = path.resolve(distRoot)
  const indexHtml = path.join(resolvedDistRoot, "index.html")
  const lobbyHtml = path.join(resolvedDistRoot, "lobby.html")

  function isInsideDist(filePath) {
    const relativePath = path.relative(resolvedDistRoot, path.resolve(filePath))
    return (
      relativePath === "" ||
      (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
    )
  }

  function isSafeFileUrl(url) {
    try {
      return isInsideDist(fileURLToPath(url))
    } catch {
      return false
    }
  }

  function toLocalHtml(pathname) {
    const relativePath = pathname.replace(/^\/+/, "")
    const htmlPath = relativePath === "" ? "index.html" : relativePath
    const filePath = path.join(
      resolvedDistRoot,
      path.extname(htmlPath) ? htmlPath : `${htmlPath}.html`
    )

    if (!isInsideDist(filePath)) return indexHtml
    return fileExists(filePath) ? filePath : indexHtml
  }

  function toLocalGameUrl(url) {
    try {
      const parsedUrl = new URL(url)
      if (parsedUrl.origin !== gameOrigin) return null

      const filePath = toLocalHtml(parsedUrl.pathname)
      return pathToFileURL(filePath).href + parsedUrl.search + parsedUrl.hash
    } catch {
      return null
    }
  }

  function isExternalUrl(url) {
    try {
      const parsedUrl = new URL(url)
      return ["https:", "http:", "mailto:"].includes(parsedUrl.protocol)
    } catch {
      return false
    }
  }

  return {
    distRoot: resolvedDistRoot,
    indexHtml,
    lobbyHtml,
    isExternalUrl,
    isInsideDist,
    isSafeFileUrl,
    toLocalGameUrl,
    toLocalHtml,
  }
}

module.exports = {
  DEFAULT_GAME_ORIGIN,
  createNavigation,
}
