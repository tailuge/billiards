import { BrowserContainer } from "./container/browsercontainer"
import { logusage } from "./utils/usage"
import { AngleInput } from "./view/dom/angleinput"
import { getCanvas } from "./utils/dom"
import { VERSION } from "./utils/version"
import { NetworkLogger } from "./utils/network-logger"

customElements.define("angle-input", AngleInput)

NetworkLogger.init()
initialise()

function initialise() {
  console.log("Version:", VERSION)
  console.log(globalThis.location.href)
  const canvas3d = getCanvas("viewP1")!
  const params = new URLSearchParams(location.search)
  const browserContainer = new BrowserContainer(canvas3d, params)
  browserContainer.start()
  logusage()
  document.querySelectorAll(".seo-description").forEach((el) => el.remove())
}
