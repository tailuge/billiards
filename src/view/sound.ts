import { AudioListener, Audio, AudioLoader, MathUtils } from "three"

export class Sound {
  listener = new AudioListener()
  audioLoader = new AudioLoader()

  ballcollision
  cue
  cushion
  pot

  constructor(camera) {
    camera.add(this.listener)

    this.ballcollision = new Audio(this.listener)
    this.load("sounds/ballcollision.ogg", this.ballcollision)

    this.cue = new Audio(this.listener)
    this.load("sounds/cue.ogg", this.cue)

    this.cushion = new Audio(this.listener)
    this.load("sounds/cushion.ogg", this.cushion)

    this.pot = new Audio(this.listener)
    this.load("sounds/pot.ogg", this.pot)
  }

  load(path, audio) {
    this.audioLoader.load(path, (buffer) => {
      audio.setBuffer(buffer)
      audio.setLoop(false)
    })
  }

  play(audio, volume) {
    audio.setVolume(volume)
    audio.isPlaying && audio.stop()
    audio.play(MathUtils.randFloat(0, 0.01))
  }

  eventToSounds(outcome) {
    if (outcome.type === "collision") {
      this.play(this.ballcollision, outcome.incidentSpeed / 60)
      this.ballcollision.setDetune(outcome.incidentSpeed * 10)
    }
    if (outcome.type === "pot") {
      this.play(this.pot, outcome.incidentSpeed / 60)
      this.pot.setDetune(-1000 + outcome.incidentSpeed * 10)
    }
    if (outcome.type === "cushion") {
      this.play(this.cushion, outcome.incidentSpeed / 120)
    }
    if (outcome.type === "hit") {
      this.play(this.cue, outcome.incidentSpeed / 60)
    }
  }
}
