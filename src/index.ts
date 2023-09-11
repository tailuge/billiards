import { BrowserContainer } from "./container/browsercontainer"

initialise()

function initialise() {
  const canvas3d = document.getElementById("viewP1") as HTMLCanvasElement
  const params = new URLSearchParams(location.search)
  const wss = params.get("websocketserver")
  const tablename = params.get("table") ?? "default"
  const playername = params.get("name") ?? ""
  const replay = params.get("state")
  const browserContainer = new BrowserContainer(
    playername,
    tablename,
    replay,
    wss,
    canvas3d
  )
  browserContainer.start()
}
