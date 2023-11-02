import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { R } from "../model/physics/constants"

const onError = console.error

/* istanbul ignore next */
export function exportGltf(scene) {
  const exporter = new GLTFExporter()
  exporter.parse(
    scene,
    (gltf) => {
      console.log(gltf)
      downloadObjectAsJson(gltf, "scene.gltf")
    },
    onError
  )
}

/* istanbul ignore next */
export function importGltf(path, scene, visible, ready = (_) => {}) {
  const loader = new GLTFLoader()
  loader.load(
    path,
    (gltf) => {
      gltf.scene.scale.set(R / 0.5, R / 0.5, R / 0.5)
      gltf.scene.matrixAutoUpdate = false
      gltf.scene.visible = visible
      gltf.scene.updateMatrix()
      gltf.scene.updateMatrixWorld()
      gltf.scene.name = path
      scene.add(gltf.scene)
      ready(gltf.scene.children[0])
    },
    (xhr) => console.log(path + " " + xhr.loaded + " bytes loaded"),
    onError
  )
}

/* istanbul ignore next */
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
