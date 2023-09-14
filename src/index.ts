import { BrowserContainer } from "./container/browsercontainer"

initialise()

function initialise() {
  const canvas3d = document.getElementById("viewP1") as HTMLCanvasElement
  const params = new URLSearchParams(location.search)
  const wss = params.get("websocketserver")
  const tableId = params.get("tableId") ?? "default"
  const clientId = params.get("clientId") ?? "default"
  const name = params.get("name") ?? ""
  const replay = params.get("state")
  const ruletype = params.get("ruletype") ?? "nineball"
  const browserContainer = new BrowserContainer(
    ruletype,
    name,
    tableId,
    clientId,
    replay,
    wss,
    canvas3d
  )
  browserContainer.start()
}
