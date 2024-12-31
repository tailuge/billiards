import { BrowserContainer } from "./container/browsercontainer"
import { logusage } from "./utils/usage"

initialise()

function initialise() {
  const canvas3d = document.getElementById("viewP1") as HTMLCanvasElement
  const params = new URLSearchParams(location.search)
  const browserContainer = new BrowserContainer(canvas3d, params)
  browserContainer.start()
  logusage()
}
