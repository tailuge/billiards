import { AmbientLight, DirectionalLight, PCFSoftShadowMap, Scene, WebGLRenderer } from "three";
import { Camera } from "./camera";
import { TableGeometry } from "./tablegeometry";
import { AimEvent } from "../events/aimevent";

export class View {

    private scene = new Scene()
    private renderer = new WebGLRenderer()
    camera: Camera

    // will also take model table ref to add geometry only
    constructor(element) {
        this.initialiseScene(element)
        this.addLights()
        this.addTable()
        this.addCamera(element)
    }

    update(t, aim: AimEvent) {
        this.camera.update(t, aim)
    }

    render() {
        this.renderer.render(this.scene, this.camera.camera)
    }

    private initialiseScene(element) {
        this.renderer.setSize(element.offsetWidth, element.offsetHeight)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFSoftShadowMap
        element.appendChild(this.renderer.domElement)
    }

    private addCamera(element) {
        this.camera = new Camera(element.offsetWidth / element.offsetHeight)
    }

    private addLights() {
        let s = 1.3
        let light = new DirectionalLight(0xffffff, 1.0)
        light.position.set(0.1, -0.01, 10)
        light.shadow.camera.near = 4
        light.shadow.camera.far = 12
        light.shadow.camera.right = TableGeometry.X * s
        light.shadow.camera.left = -TableGeometry.X * s
        light.shadow.camera.top = TableGeometry.Y * s
        light.shadow.camera.bottom = -TableGeometry.Y * s
        light.shadow.mapSize.width = 1024
        light.shadow.mapSize.height = 1024
        light.castShadow = true
        this.scene.add(light)
        this.scene.add(new AmbientLight(0x505050, 1.0))
    }

    private addTable() {
        TableGeometry.addToScene(this.scene)
    }

    addMesh(mesh) {
        this.scene.add(mesh)
    }
}
