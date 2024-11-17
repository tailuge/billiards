import { R } from "./model/physics/claude/constants";
import { Mathaven } from "./model/physics/claude/qwen";

declare global {
  interface Window {
    Plotly: any;
  }
}

//const calc = new NumericCalculation(2.0, Math.PI / 4, 1.5 * 2 / R, 2 * 2 / R)
const calc = new Mathaven(2.0, Math.PI / 4, 1.5 * 2 / R, 2 * 2 / R)

try {
  calc.solve()
} catch (error) {
  console.error(error)
}

const config = {
  responsive: true,
  showLink: true,
  plotlyServerURL: "https://chart-studio.plotly.com"
};

const layout = {
  legend: {
    font: { color: '#4D5663' },
    bgcolor: '#e5e6F9'
  },
  xaxis: {
    title: 'impulse',
    tickfont: { color: '#4D5663' },
    gridcolor: '#E1E5ED',
    titlefont: { color: '#4D5663' },
    zerolinecolor: '#E1E5ED'
  },
  yaxis: {
    title: 'value',
    tickfont: { color: '#4D5663' },
    zeroline: false,
    gridcolor: '#E1E5ED',
    titlefont: { color: '#4D5663' },
    zerolinecolor: '#E1E5ED'
  },
  plot_bgcolor: '#F5F6F9',
  paper_bgcolor: '#F2F6F9'
};

function color(index: number): string {
  const hue = (index * 137.5) % 360
  const saturation = 70
  const lightness = 50
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
function extractValues<T>(history, selector: (s: Mathaven) => T): T[] {
  return history.map(selector)
}

function createTrace(x: number[], y: number[], name: string, color: string) {
  return {
    x,
    y,
    name,
    line: {
      color,
      width: 1.3
    },
    mode: 'lines',
    type: 'scatter'
  }
}

const vals = (selector: (s: Mathaven) => number): number[] => extractValues(calc.history, selector)

const impulse = vals(h => h.P)

window.Plotly.newPlot("mathaven-impulse", [
    createTrace(impulse, vals(h => h.s), 's', color(0)),
    createTrace(impulse, vals(h => h.φ), 'φ', color(1)),
    createTrace(impulse, vals(h => h.sʹ), "s'", color(2)),
    createTrace(impulse, vals(h => h.φʹ), "φʹ", color(3)),
  ], layout, config)

const index = vals(h => h.P).map((_,i)=>i)

window.Plotly.newPlot("mathaven-vel", [
  createTrace(index, vals(h => h.vx), 'vx', color(0)),
  createTrace(index, vals(h => h.vy), 'vy', color(1)),
  createTrace(index, vals(h => h.ωx), "ωx", color(2)),
  createTrace(index, vals(h => h.ωy), "ωy", color(3)),
], layout, config)



