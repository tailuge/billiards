import { BrowserContainer } from "./container/browsercontainer"
import { logusage } from "./utils/usage"
import { getCanvas } from "./utils/dom"
import { VERSION } from "./utils/version"

initialise()

function initialise() {
  console.log("Version:", VERSION)
  const canvas3d = getCanvas("viewP1")!
  const params = new URLSearchParams(location.search)
  const browserContainer = new BrowserContainer(canvas3d, params)
  browserContainer.start()
  logusage()
}
