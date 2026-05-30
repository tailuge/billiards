const { app, BrowserWindow, Menu, shell } = require("electron")
const fs = require("node:fs")
const path = require("node:path")
const { fileURLToPath, pathToFileURL } = require("node:url")

const distRoot = path.resolve(__dirname, "..", "dist")
const indexHtml = path.join(distRoot, "index.html")
const lobbyHtml = path.join(distRoot, "lobby.html")
const isDebug = process.env.ELECTRON_OPEN_DEVTOOLS === "1"
const gameOrigin = "https://billiards.tailuge.workers.dev"

function isInsideDist(filePath) {
  const relativePath = path.relative(distRoot, path.resolve(filePath))
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
    distRoot,
    path.extname(htmlPath) ? htmlPath : `${htmlPath}.html`
  )

  if (!isInsideDist(filePath)) return indexHtml
  return fs.existsSync(filePath) ? filePath : indexHtml
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

function openExternalUrl(url) {
  if (isExternalUrl(url)) {
    shell.openExternal(url)
    return true
  }
  return false
}

function getActiveWindow() {
  return BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
}

function loadInActiveWindow(filePath) {
  const activeWindow = getActiveWindow()
  if (activeWindow) {
    activeWindow.loadFile(filePath)
  }
}

function buildMenu() {
  const template = [
    {
      label: "Game",
      submenu: [
        {
          label: "New Game",
          accelerator: "CmdOrCtrl+N",
          click: () => loadInActiveWindow(indexHtml),
        },
        {
          label: "Lobby",
          accelerator: "CmdOrCtrl+L",
          click: () => loadInActiveWindow(lobbyHtml),
        },
        { type: "separator" },
        { role: "reload" },
        { role: "togglefullscreen" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "toggleDevTools" },
      ],
    },
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function createWindow(startUrl = pathToFileURL(indexHtml).href) {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#0b2014",
    title: "Billiards",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  mainWindow.loadURL(startUrl)

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const appUrl = isSafeFileUrl(url) ? url : toLocalGameUrl(url)
    if (appUrl) {
      createWindow(appUrl)
      return { action: "deny" }
    }

    openExternalUrl(url)
    return { action: "deny" }
  })

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (isSafeFileUrl(url)) {
      return
    }

    const localUrl = toLocalGameUrl(url)
    if (localUrl) {
      event.preventDefault()
      mainWindow.loadURL(localUrl)
      return
    }

    event.preventDefault()
    openExternalUrl(url)
  })

  if (isDebug) {
    mainWindow.webContents.openDevTools({ mode: "detach" })
  }
}

app.whenReady().then(() => {
  buildMenu()
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
