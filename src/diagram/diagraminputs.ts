export class DiagramInputs {
  state: { balls: any[] }
  control: HTMLElement

  constructor(state, control, onRestart) {
    this.state = state
    this.control = control
    this.addControls(control, onRestart)
  }

  readValue(id: string) {
    const input = this.control.querySelector<HTMLInputElement>(id)
    return input ? input.valueAsNumber : 0
  }

  readControls() {
    const b = this.state.balls[0]
    b.pos.x = this.readValue("#x")
    b.pos.y = this.readValue("#y")
    b.vel.x = this.readValue("#vx")
    b.vel.y = this.readValue("#vy")
    b.rvel.x = this.readValue("#wx")
    b.rvel.y = this.readValue("#wy")
    b.rvel.z = this.readValue("#wz")
  }

  addControls(elt: HTMLElement, onRestart) {
    const b = this.state.balls[0]
    const attr = 'type="number" step="0.1"'
    elt.innerHTML = `
        x <input id="x" ${attr} value="${b.pos.x}">
		  <input id="y" ${attr} value="${b.pos.y}">
        ẋ <input id="vx" ${attr} value="${b.vel.x}">
		  <input id="vy" ${attr} value="${b.vel.y}">
        ω <input id="wx" ${attr} value="${b.rvel.x}">
		  <input id="wy" ${attr} value="${b.rvel.y}">
          <input id="wz" ${attr} value="${b.rvel.z}"><div id="restart">↻</div>`

    elt.getElementsByTagName("div")[0].onclick = onRestart
  }
}
