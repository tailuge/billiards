import { ImpulsePlot } from "./diagram/impulseplot";
import { Figure9 } from "./diagram/figure9";

declare global {
  interface Window {
    Plotly: any;
  }
}

new ImpulsePlot().plot()
new Figure9().plot()
//new ImpulsePlot().plot(1,Math.PI/4,0,0)
