const { app, BrowserWindow, Menu, shell } = require("electron")
const path = require("node:path")
const { pathToFileURL } = require("node:url")
const { createNavigation } = require("./navigation.cjs")

const navigation = createNavigation({
  distRoot: path.resolve(__dirname, "..", "dist"),
})
const isDebug = process.env.ELECTRON_OPEN_DEVTOOLS === "1"

function openExternalUrl(url) {
  if (navigation.isExternalUrl(url)) {
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
          click: () => loadInActiveWindow(navigation.indexHtml),
        },
        {
          label: "Lobby",
          accelerator: "CmdOrCtrl+L",
          click: () => loadInActiveWindow(navigation.lobbyHtml),
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

function createWindow(startUrl = pathToFileURL(navigation.indexHtml).href) {
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
    const appUrl = navigation.isSafeFileUrl(url)
      ? url
      : navigation.toLocalGameUrl(url)
    if (appUrl) {
      createWindow(appUrl)
      return { action: "deny" }
    }

    openExternalUrl(url)
    return { action: "deny" }
  })

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (navigation.isSafeFileUrl(url)) {
      return
    }

    const localUrl = navigation.toLocalGameUrl(url)
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
