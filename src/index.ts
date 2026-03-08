import { BrowserContainer } from "./container/browsercontainer"
import { logusage } from "./utils/usage"
import { getCanvas } from "./utils/dom"
import { VERSION } from "./utils/version"
import { ClientErrorReporter } from "./network/client/clienterrorreporter"

initialise()

function initialise() {
  console.log("Version:", VERSION)
  const canvas3d = getCanvas("viewP1")!
  const params = new URLSearchParams(location.search)
  const browserContainer = new BrowserContainer(canvas3d, params)
  browserContainer.start()
  logusage()

  // Start error reporter only in browser (not Node.js) and not in test environment
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
    const errorReporter = new ClientErrorReporter(
      "https://scoreboard-tailuge.vercel.app/api/client-error"
    )
    errorReporter.start()
  }
}
