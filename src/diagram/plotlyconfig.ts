export const config = {
  responsive: true,
  showLink: true,
  plotlyServerURL: "https://chart-studio.plotly.com",
}

export const layout = {
  legend: {
    font: { color: "#4D5663" },
    bgcolor: "#e5e6F9",
  },
  title: {
    text: "",
    font: {
      size: 11,
    },
  },
  xaxis: {
    title: "impulse",
    tickfont: { color: "#4D5663" },
    gridcolor: "#E1E5ED",
    titlefont: { color: "#4D5663" },
    zerolinecolor: "#E1E5ED",
  },
  yaxis: {
    title: "value",
    tickfont: { color: "#4D5663" },
    zeroline: false,
    gridcolor: "#E1E5ED",
    titlefont: { color: "#4D5663" },
    zerolinecolor: "#E1E5ED",
  },
  plot_bgcolor: "#F5F6F9",
  paper_bgcolor: "#F2F6F9",
}

export function color(index: number): string {
  const hue = (index * 137.5) % 360
  const saturation = 70
  const lightness = 50
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function createTrace(
  x: number[],
  y: number[],
  name: string,
  color: string
) {
  return {
    x,
    y,
    name,
    line: {
      color,
      width: 1.3,
    },
    mode: "lines",
    type: "scatter",
  }
}
