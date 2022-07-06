import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

export function exportGltf(scene) {
  const exporter = new GLTFExporter()
  exporter.parse(scene, (gltf) => {
    console.log(gltf)
    downloadObjectAsJson(gltf, "scene.gltf")
  })
}

export function importGltf(path, scene, ready) {
  const loader = new GLTFLoader()
  loader.load(
    path,
    (gltf) => {
      scene.add(gltf.scene)
      if (ready !== null) {
        ready()
      }
    },
    (xhr) => console.log(xhr.loaded + " bytes loaded"),
    (error) => console.log(error)
  )
}

export function downloadObjectAsJson(exportObj, exportName) {
  const downloadAnchorNode = document.createElement("a")
  downloadAnchorNode.setAttribute(
    "href",
    "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportObj))
  )
  downloadAnchorNode.setAttribute("download", exportName)
  document.body.appendChild(downloadAnchorNode)
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}
