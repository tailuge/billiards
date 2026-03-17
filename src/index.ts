import { BrowserContainer } from "./container/browsercontainer"
import { logusage } from "./utils/usage"
import { getCanvas } from "./utils/dom"
import { VERSION } from "./utils/version"
import { ClientErrorReporter } from "./network/client/clienterrorreporter"

initialise()

function initialise() {
  const errorReporter = new ClientErrorReporter(
    "https://scoreboard-tailuge.vercel.app/api/client-error"
  )
  errorReporter.start()

  console.log("Version:", VERSION)
  const canvas3d = getCanvas("viewP1")!
  const params = new URLSearchParams(location.search)
  const browserContainer = new BrowserContainer(canvas3d, params)
  ;(globalThis as any).browserContainer = browserContainer
  browserContainer.start()
  logusage()
}
