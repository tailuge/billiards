import { BrowserContainer } from "./container/browsercontainer"
import { logusage } from "./utils/usage"

initialise()
logusage()

function initialise() {
  const canvas3d = document.getElementById("viewP1") as HTMLCanvasElement
  //var context2d = canvas3d.getContext("2d")
  const params = new URLSearchParams(location.search)
  const browserContainer = new BrowserContainer(canvas3d, params)
  browserContainer.start()
}
