import {
  Pze,
  Pzs,
  c0,
  s0,
  bounceHan,
  cueToSpin,
  bounceHanBlend,
} from "./model/physics/physics"
import { Vector3 } from "three"
import { CushionPlot } from "./diagram/cushionplot"
import { Graph } from "./diagram/graph"
import { RollDiagram } from "./diagram/rolldiagram"
import { Sliders } from "./view/sliders"
import { DiagramContainer } from "./diagram/diagramcontainer"
import { I, Mxy, Mz, R } from "./model/physics/constants"
import { Cue } from "./view/cue"

let p1, p2, p3, p4, p5
let linegraph1, linegraph2, linegraph3, linegraph4
let s = 3 * R

document.addEventListener("DOMContentLoaded", () => {
  const replaydiagrams = document.getElementsByClassName("replaydiagram")
  for (let i = 0; i < replaydiagrams.length; i++) {
    const diagram = replaydiagrams.item(i)
    const diagramcontainer = DiagramContainer.fromDiamgramElement(diagram)
    diagramcontainer.start()
  }

  const rollcanvas = id("rollcanvas")
  if (rollcanvas) {
    const rolldiagram = new RollDiagram(rollcanvas)
    rolldiagram.draw(5)
  } else {
    if (id("cushion1")) {
      initialisePlots()
    }

    const sliders = new Sliders(plotAll)
    sliders.initialiseSlider("s", s, sets, 4)

    if (id("derived")) {
      reportConstants()
    }
  }
})

function reportConstants() {
  const elt = id("derived")
  const v = new Vector3(new Cue().maxPower, 0, 0)
  const w = cueToSpin(new Vector3(0.5), v)
  elt.innerHTML += `Mx,My    = ${Mxy.toFixed(6)}\n`
  elt.innerHTML += `Mz       = ${Mz.toFixed(6)}\n`
  elt.innerHTML += `I        = ${I.toFixed(6)}\n`
  elt.innerHTML += `Max vel  = ${v.length().toFixed(6)}\n`
  elt.innerHTML += `Max rvel = ${w.length().toFixed(4)}\n`
}

function sets(v) {
  s = v
}

function initialisePlots() {
  p1 = new CushionPlot(id("cushion1"), "stun shot")
  p2 = new CushionPlot(id("cushion2"), "running side")
  p3 = new CushionPlot(id("cushion3"), "check side")
  p4 = new CushionPlot(id("cushion4"), "varying side")
  p5 = new CushionPlot(id("cushion5"), "varying side high vel")

  linegraph1 = new Graph(
    "plot1",
    "Top spin ball played slow directly into cushion",
    "top/back spin w.y"
  )

  linegraph2 = new Graph(
    "plot2",
    "Top spin ball played hard directly into cushion",
    "top/back spin w.y"
  )

  linegraph3 = new Graph(
    "plot3",
    "Right hand spinning ball with varying incident angleand speed s",
    "Incident angle (degrees) of ball to cushion with right side"
  )

  linegraph4 = new Graph(
    "plot4",
    "Bounce angle of ball with check side (y-axis outward angle)",
    "Incident angle (degrees) of ball to cushion, 0=perpendicular, 90=parallel. Blue=Han2005 Red=Blend"
  )

  plotAll()
}

function plotAll() {
  if (p1) {
    plotCushionDiagrams()
    plotLineGraphs()
  }
}

function plotLineGraphs() {
  lineGraph1()
  lineGraph2()
  lineGraph3()
  lineGraph4()
}

function lineGraph1() {
  const x: number[] = []
  const y1: number[] = []
  const y2: number[] = []

  for (let i = -180; i <= 180; i += 30) {
    x.push(i)
    const v = new Vector3(0.2 * R, 0.0, 0)
    const w = new Vector3(0.0, 0.0, i * R)
    y1.push(Pze(c0(v)))
    y2.push(Pzs(s0(v, w)))
  }
  linegraph1.plot(x, y1, y2)
}

function lineGraph2() {
  const x: number[] = []
  const y1: number[] = []
  const y2: number[] = []

  for (let i = -180; i <= 180; i += 30) {
    x.push(i)
    const v = new Vector3(150 * R, 0, 0)
    const w = new Vector3(0.0, i * R, 0)
    y1.push(Pze(c0(v)))
    y2.push(Pzs(s0(v, w)))
  }
  linegraph2.plot(x, y1, y2)
}

function lineGraph3() {
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

function lineGraph4() {
  // input vs output angle on cushion
  const x: number[] = []
  const y1: number[] = []
  const y2: number[] = []
  for (let i = 0; i <= 88; i += 2) {
    x.push(i)
    const rad = (i * Math.PI) / 180
    const v = new Vector3(Math.cos(rad) * R, Math.sin(rad) * R, 0)
    const w = new Vector3(0, 0, 50 * R)
    const deltaHan = bounceHan(v, w)
    const outHan = v.clone().add(deltaHan.v)
    const outAngleHan = (-Math.atan2(-outHan.y, -outHan.x) * 180) / Math.PI
    y1.push(outAngleHan)
    const deltaBlend = bounceHanBlend(v, w)
    const outBlend = v.clone().add(deltaBlend.v)
    const outAngleBlend =
      (-Math.atan2(-outBlend.y, -outBlend.x) * 180) / Math.PI
    y2.push(outAngleBlend)
  }
  linegraph4.plot(x, y1, y2)
}

function id(id: string): HTMLElement {
  return document.getElementById(id)!
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
