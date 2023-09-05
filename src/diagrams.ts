import { Diagram } from "./diagram/diagram"
import { Pze, Pzs, c0, s0, muCushion } from "./model/physics/physics"
import { Vector3 } from "three"
import { CushionPlot } from "./diagram/cushionplot"
import { Graph } from "./diagram/graph"
import { RollDiagram } from "./diagram/rolldiagram"
import { Sliders } from "./view/sliders"

let p1, p2, p3, p4, p5
let linegraph1, linegraph2, linegraph3, linegraph4
let s = 1

const maxSpeed = 20

const rollcanvas = id("rollcanvas")
if (rollcanvas) {
  const rolldiagram = new RollDiagram(rollcanvas)
  rolldiagram.draw(5)
} else {
  makeDiagram("diagram1", [
    makeBall(0, 0, -maxSpeed, 0, 0, 0, 0),
    makeBall(2, 2, -maxSpeed, 0, 0, 0, maxSpeed),
    makeBall(-2, -2, -maxSpeed, 0, 0, 0, -maxSpeed),
  ])

  makeDiagram("diagram2", [
    makeBall(-17, 2, 0, -maxSpeed * 2, -85, 0, -35),
    makeBall(-17.38, -2, 0, 0, 0, 0, 0),
  ])

  p1 = new CushionPlot(id("cushion1"), "stun shot")
  p2 = new CushionPlot(id("cushion2"), "running side")
  p3 = new CushionPlot(id("cushion3"), "check side")
  p4 = new CushionPlot(id("cushion4"), "varying side")
  p5 = new CushionPlot(id("cushion5"), "varying side high vel")

  linegraph1 = new Graph(
    "plot1",
    "Spinning ball played slowly directly into cushion",
    "top/back spin w.y"
  )

  linegraph2 = new Graph(
    "plot2",
    "Spinning ball played hard directly into cushion",
    "top/back spin w.y"
  )

  linegraph3 = new Graph(
    "plot3",
    "Right hand spinning ball with varying incident angle",
    "Incident angle (degrees) of ball to cushion with right side"
  )

  linegraph4 = new Graph(
    "plot4",
    "Cushion friction (mu) varies with incident angle",
    "Incident angle (degrees) of ball to cushion"
  )

  plotAll()

  const sliders = new Sliders(plotAll)
  sliders.initialiseSider("s", s, sets)
}

function sets(v) {
  s = v
}

function plotAll() {
  plotCushionDiagrams()
  plotLineGraphs()
}

function plotCushionDiagrams() {
  function spin(w) {
    return (_) => new Vector3(0, 0, w)
  }
  const sin = (a) => Math.sin((a * Math.PI) / 180)
  const cos = (a) => Math.cos((a * Math.PI) / 180)
  const aimAtAngle = (a) => new Vector3(cos(a), sin(a), 0)

  p1.plot(10, 80, 10, aimAtAngle, (_) => new Vector3(0, 0, 0))
  p2.plot(10, 80, 10, aimAtAngle, spin(-3))
  p3.plot(10, 80, 10, aimAtAngle, spin(3))
  p4.plot(
    -6,
    6,
    1,
    (_) => new Vector3(0.7, 0.7, 0),
    (z) => new Vector3(0, 0, z)
  )
  p5.plot(
    -6,
    6,
    1,
    (_) => new Vector3(2, 2, 0),
    (z) => new Vector3(0, 0, z)
  )
}

function plotLineGraphs() {
  plot1()
  plot2()
  plot3()
  plot4()
}

function plot1() {
  const x: number[] = []
  const y1: number[] = []
  const y2: number[] = []

  for (let i = -20; i <= 20; i += 1) {
    x.push(i)
    const v = new Vector3(1.0, 0.0, 0)
    const w = new Vector3(0.0, 0.0, i)
    y1.push(Pze(c0(v)))
    y2.push(Pzs(s0(v, w)))
  }
  linegraph1.plot(x, y1, y2)
}

function plot2() {
  const x: number[] = []
  const y1: number[] = []
  const y2: number[] = []

  for (let i = -20; i <= 20; i += 1) {
    x.push(i)
    const v = new Vector3(1.0, 0, 0)
    const w = new Vector3(0.0, i, 0)
    y1.push(Pze(c0(v)))
    y2.push(Pzs(s0(v, w)))
  }
  linegraph2.plot(x, y1, y2)
}

function plot3() {
  const x: number[] = []
  const y1: number[] = []
  const y2: number[] = []

  for (let i = -80; i <= 80; i += 10) {
    x.push(i)
    const rad = (i * Math.PI) / 180
    const v = new Vector3(Math.cos(rad), Math.sin(rad), 0)
    v.multiplyScalar(s)
    const w = new Vector3(0.0, 0, -10)
    y1.push(Pze(c0(v)))
    y2.push(Pzs(s0(v, w)))
  }
  linegraph3.plot(x, y1, y2)
}

function plot4() {
  const x: number[] = []
  const y: number[] = []
  for (let i = -80; i <= 80; i += 10) {
    x.push(i)
    const rad = (i * Math.PI) / 180
    const v = new Vector3(Math.cos(rad), Math.sin(rad), 0)
    const mu = muCushion(v)
    y.push(mu)
  }
  linegraph4.plot(x, y, y)
}

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

function id(id: string): HTMLElement {
  return document.getElementById(id)!
}

function elt(diagram, id) {
  const selector = "#" + diagram + " #" + id
  const e = document.querySelector(selector)
  if (e == null) {
    throw new Error("Element not found " + selector)
  }
  return e
}
