import { Pze, Pzs, c0, s0, muCushion } from "./model/physics/physics"
import { Vector3 } from "three"
import { CushionPlot } from "./diagram/cushionplot"
import { Graph } from "./diagram/graph"
import { RollDiagram } from "./diagram/rolldiagram"
import { Sliders } from "./view/sliders"
import { DiagramContainer } from "./diagram/diagramcontainer"
import { R } from "./model/physics/constants"

let p1, p2, p3, p4, p5
let linegraph1, linegraph2, linegraph3, linegraph4
let s = 3 * R

const rollcanvas = id("rollcanvas")
if (rollcanvas) {
  const rolldiagram = new RollDiagram(rollcanvas)
  rolldiagram.draw(5)
} else {
  const replaydiagrams = document.getElementsByClassName("replaydiagram")
  for (let i = 0; i < replaydiagrams.length; i++) {
    const diagram = replaydiagrams.item(i)
    const diagramcontainer = DiagramContainer.fromDiamgramElement(diagram)
    diagramcontainer.start()
  }

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
    return (_) => svec(0, 0, w)
  }
  const sin = (a) => Math.sin((a * Math.PI) / 180)
  const cos = (a) => Math.cos((a * Math.PI) / 180)
  const aimAtAngle = (a) => svec(cos(a), sin(a), 0)

  p1.plot(10, 80, 10, aimAtAngle, (_) => svec(0, 0, 0))
  p2.plot(10, 80, 10, aimAtAngle, spin(-40))
  p3.plot(10, 80, 10, aimAtAngle, spin(40))
  p4.plot(
    -6,
    6,
    1,
    (_) => svec(0.7, 0.7, 0),
    (z) => svec(0, 0, z * 6)
  )
  p5.plot(
    -6,
    6,
    1,
    (_) => svec(2, 2, 0),
    (z) => svec(0, 0, z * 6)
  )
}
function svec(x, y, z) {
  return new Vector3(x * R, y * R, z * R)
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
    const v = new Vector3(1.0 * R, 0.0, 0)
    const w = new Vector3(0.0, 0.0, i * R)
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
    const v = new Vector3(1.0 * R, 0, 0)
    const w = new Vector3(0.0, i * R, 0)
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
    const v = new Vector3(Math.cos(rad) * R, Math.sin(rad) * R, 0)
    v.multiplyScalar(s)
    const w = new Vector3(0.0, 0, -10 * R)
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
    const v = new Vector3(Math.cos(rad) * R, Math.sin(rad) * R, 0)
    const mu = muCushion(v)
    y.push(mu)
  }
  linegraph4.plot(x, y, y)
}

function id(id: string): HTMLElement {
  return document.getElementById(id)!
}
