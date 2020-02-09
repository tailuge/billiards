export class DiagramInputs {
  state: { balls: any[] }
  control: HTMLElement

  constructor(state, control, onRestart) {
    this.state = state
    this.control = control
    this.addControls(control, onRestart)
  }

  readValue(id: string) {
    var input = this.control.querySelector<HTMLInputElement>(id)
    return input ? input.valueAsNumber : 0
  }

  readControls() {
    var b = this.state.balls[0]
    b.pos.x = this.readValue("#x")
    b.pos.y = this.readValue("#y")
    b.vel.x = this.readValue("#vx")
    b.vel.y = this.readValue("#vy")
    b.rvel.x = this.readValue("#wx")
    b.rvel.y = this.readValue("#wy")
    b.rvel.z = this.readValue("#wz")
  }

  addControls(elt: HTMLElement, onRestart) {
    var b = this.state.balls[0]
    elt.innerHTML = `
        x <input id="x" type="number" step="0.1" value="${b.pos.x}">
		  <input id="y" type="number" step="0.1" value="${b.pos.y}">
        ẋ <input id="vx" type="number" step="0.1" value="${b.vel.x}">
		  <input id="vy" type="number" step="0.1" value="${b.vel.y}">
        ω <input id="wx" type="number" step="0.1" value="${b.rvel.x}">
		  <input id="wy" type="number" step="0.1" value="${b.rvel.y}">
          <input id="wz" type="number" step="0.1" value="${b.rvel.z}">
        <button id="restart">↻</button>`

    var button = elt.getElementsByTagName("button")
    button[0].onclick = onRestart
  }
}
