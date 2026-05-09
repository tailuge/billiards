import { Sliders } from "./view/sliders"
import { DiagramContainer } from "./diagram/diagramcontainer"
import { mathavanAdapter } from "./model/physics/physics"

document.addEventListener("DOMContentLoaded", () => {
  const replaydiagrams = document.getElementsByClassName("replaydiagram")
  for (let i = 0; i < replaydiagrams.length; i++) {
    const diagram = replaydiagrams.item(i)
    const diagramcontainer = DiagramContainer.fromDiamgramElement(diagram)
    diagramcontainer.cushionModel = mathavanAdapter
    diagramcontainer.start()
  }

  new Sliders()
})
