import { Diagram } from "./diagram/diagram"
import { Chart } from "chart.js/auto"
import { Pze, Pzs, c0, s0 } from "./model/physics/physics"
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

function plot1() {
  let x: number[] = []
  let y1: number[] = []
  let y2: number[] = []

  const yDataset = [
    {
      label: "Pze",
      data: y1,
    },
    {
      label: "Pzs",
      data: y2,
    },
  ]

  for (let i = -20; i <= 20; i += 1) {
    x.push(i)
    let v = new Vector3(1.0, 0.0, 0)
    let w = new Vector3(0.0, 0.0, i)
    y1.push(Pze(c0(v)))
    y2.push(Pzs(s0(v, w)))
  }

  plotOnCanvas("plot1", x, yDataset, "Side spin w.z")
}

function plotOnCanvas(elementId, x, yDataset, yAxis) {
  new Chart(document.getElementById(elementId) as HTMLCanvasElement, {
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
  })
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
