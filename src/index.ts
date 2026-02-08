import { BrowserContainer } from "./container/browsercontainer"
import { logusage } from "./utils/usage"
import { getCanvas } from "./utils/dom"

initialise()

function initialise() {
  const canvas3d = getCanvas("viewP1")!
  const params = new URLSearchParams(location.search)
  const browserContainer = new BrowserContainer(canvas3d, params)
  browserContainer.start()
  logusage()
}
