import { Figure12 } from "./diagram/figure12";
import { Figure9 } from "./diagram/figure9";

declare global {
  interface Window {
    Plotly: any;
  }
}

new Figure9().plot()
new Figure12().plot()
