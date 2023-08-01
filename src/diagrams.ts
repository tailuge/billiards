import { Diagram } from "./diagram/diagram"

console.log("Diagrams")

const maxSpeed = 20

makeDiagram("diagram1", [
  makeBall(0, 0, -maxSpeed, 0, 0, 0, 0),
  makeBall(2, 2, -maxSpeed, 0, 0, 0, maxSpeed),
  makeBall(-2, -2, -maxSpeed, 0, 0, 0, -maxSpeed),
])

makeDiagram("diagram2", [
  makeBall(-17, 2, 0, -maxSpeed * 2, -85, 0, -5),
  makeBall(-17.38, -2, 0, 0, 0, 0, 0),
])

function makeDiagram(id, balls) {
  return new Diagram(
    { balls: balls },
    (<HTMLCanvasElement>elt(id, "canvas")).getContext("2d"),
    elt(id, "control")
  )
}

function makeBall(x, y, vx, vy, wx, wy, wz) {
  return {
    pos: { x: x, y: y, z: 0 },
    vel: { x: vx, y: vy, z: 0 },
    rvel: { x: wx, y: wy, z: wz },
    state: "Sliding",
  }
}

function elt(diagram, id) {
  const selector = "#" + diagram + " #" + id
  const e = document.querySelector(selector)
  if (e == null) {
    throw new Error("Element not found " + selector)
  }
  return e
}
