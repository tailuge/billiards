import { Diagram } from "./diagram/diagram"
import { Chart } from "chart.js/auto"
import {
  Pze,
  Pzs,
  c0,
  s0,
  muCushion,
  rotateApplyUnrotate,
  isGripCushion,
} from "./model/physics/physics"
import { Vector3 } from "three"

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

plot1()
plot2()
plot3()
plot4()

vectorPlot("vectorPlot1", 20, 80, 20, new Vector3(0, 0, 0))
vectorPlot("vectorPlot2", 20, 80, 20, new Vector3(0, 0, -3))
vectorPlot("vectorPlot3", 20, 80, 20, new Vector3(0, 0, 3))

function plot1() {
  const x: number[] = []
  const yDataset = dataset()
  for (let i = -20; i <= 20; i += 1) {
    x.push(i)
    const v = new Vector3(1.0, 0.0, 0)
    const w = new Vector3(0.0, 0.0, i)
    yDataset[0].data.push(Pze(c0(v)))
    yDataset[1].data.push(Pzs(s0(v, w)))
  }
  plotOnCanvas("plot1", x, yDataset, "Side spin w.z")
}

function plot2() {
  const x: number[] = []
  const yDataset = dataset()
  for (let i = -20; i <= 20; i += 1) {
    x.push(i)
    const v = new Vector3(1.0, 0, 0)
    const w = new Vector3(0.0, i, 0)
    yDataset[0].data.push(Pze(c0(v)))
    yDataset[1].data.push(Pzs(s0(v, w)))
  }
  plotOnCanvas("plot2", x, yDataset, "Top/back spin w.y")
}

function plot3() {
  const x: number[] = []
  const yDataset = dataset()
  for (let i = -80; i <= 80; i += 10) {
    x.push(i)
    const rad = (i * Math.PI) / 180
    const v = new Vector3(Math.cos(rad), Math.sin(rad), 0)
    const w = new Vector3(0.0, 0, -10)
    yDataset[0].data.push(Pze(c0(v)))
    yDataset[1].data.push(Pzs(s0(v, w)))
  }
  plotOnCanvas(
    "plot3",
    x,
    yDataset,
    "Incident angle (degrees) of ball to cushion with right side"
  )
}

function plot4() {
  const x: number[] = []
  const yDataset = dataset().slice(1)
  yDataset[0].label = "mu"
  for (let i = -80; i <= 80; i += 10) {
    x.push(i)
    const rad = (i * Math.PI) / 180
    const v = new Vector3(Math.cos(rad), Math.sin(rad), 0)
    const mu = muCushion(v)
    yDataset[0].data.push(mu)
  }
  plotOnCanvas(
    "plot4",
    x,
    yDataset,
    "Incident angle (degrees) of ball to cushion "
  )
}

function dataset() {
  const y1: number[] = []
  const y2: number[] = []

  return [
    {
      label: "Pze",
      data: y1,
    },
    {
      label: "Pzs",
      data: y2,
    },
  ]
}

function plotOnCanvas(elementId, x, yDataset, yAxis) {
  const chart = new Chart(
    document.getElementById(elementId) as HTMLCanvasElement,
    {
      type: "line",
      data: {
        labels: x,
        datasets: yDataset,
      },
      options: {
        responsive: false,
        maintainAspectRatio: true,
        scales: { x: { title: { text: yAxis, display: true } } },
      },
    }
  )
  console.log("Chart done", chart)
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

function elt(diagram, id) {
  const selector = "#" + diagram + " #" + id
  const e = document.querySelector(selector)
  if (e == null) {
    throw new Error("Element not found " + selector)
  }
  return e
}

function vectorPlot(id, angleStart, angleEnd, angleStep, w) {
  const canvas = document.getElementById(id) as HTMLCanvasElement
  const context = canvas.getContext("2d")!
  const endx = 100
  const endy = 100
  const dv = new Vector3()
  const dw = new Vector3()
  const s = 75
  for (let i = angleStart; i <= angleEnd; i += angleStep) {
    const rad = (i * Math.PI) / 180
    const v = new Vector3(Math.cos(rad), Math.sin(rad), 0)
    const lineDash = isGripCushion(v, w) ? [] : [2, 2]
    context.setLineDash(lineDash)
    context.strokeStyle = "blue"
    drawArrow(context, endx - v.x * s, endy - v.y * s, endx, endy)
    rotateApplyUnrotate(0, v, w, dv, dw)
    v.add(dv)
    context.strokeStyle = "red"
    drawArrow(context, endx, endy, endx + v.x * s, endy + v.y * s)
  }
}

function drawArrow(context, x1, y1, x2, y2, t = 0.9) {
  const arrow = {
    dx: x2 - x1,
    dy: y2 - y1,
  }
  const middle = {
    x: arrow.dx * t + x1,
    y: arrow.dy * t + y1,
  }
  const tip = {
    dx: x2 - middle.x,
    dy: y2 - middle.y,
  }
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(middle.x, middle.y)
  context.moveTo(middle.x + 0.5 * tip.dy, middle.y - 0.5 * tip.dx)
  context.lineTo(middle.x - 0.5 * tip.dy, middle.y + 0.5 * tip.dx)
  context.lineTo(x2, y2)
  context.closePath()
  context.stroke()
}
