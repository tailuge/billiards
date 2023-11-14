import { Container } from "../container/container"

export class Hud {
  element: HTMLCanvasElement
  current_break: HTMLStyleElement

  disabled = true

  constructor(element) {
    this.element = element

    //this.current_break = this.getElement("replay")

    var width=100;
    var height=100;

    //var hudBitmap = element.getContext("2d");
	//hudBitmap.font = "Normal 40px Arial";
    //hudBitmap.textAlign = 'center';
    //hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
    //hudBitmap.filslText('Initializing...', width / 2, height / 2);
  }

  

  getElement(id): HTMLButtonElement {
    return document.getElementById(id)! as HTMLButtonElement
  }
}
