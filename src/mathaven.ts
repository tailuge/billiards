import { NumericCalculation } from "./model/physics/claude/geminipro"

console.log("Calling");

declare global {
  interface Window {
      plotlyDiv: (id: string, data:any) => void;
  }
}

const R = 0.02625
const numericCalculation = new NumericCalculation(2.0, Math.PI / 4, 1.5*2/R, 2*2/R)

window.plotlyDiv("a",numericCalculation)


