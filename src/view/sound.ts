import { AudioListener, Audio, AudioLoader, MathUtils } from "three"

export class Sound {
  listener = new AudioListener()
  audioLoader = new AudioLoader()

  ballcollision
  cue
  cushion
  pot
  success

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

    this.success = new Audio(this.listener)
    this.load("sounds/success.ogg", this.success)
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
    if (outcome.type === "Collision") {
      this.play(this.ballcollision, outcome.incidentSpeed / 60)
      this.ballcollision.setDetune(outcome.incidentSpeed * 10)
    }
    if (outcome.type === "Pot") {
      this.play(this.pot, outcome.incidentSpeed / 20)
      this.pot.setDetune(-1000 + outcome.incidentSpeed * 10)
    }
    if (outcome.type === "Cushion") {
      this.play(this.cushion, outcome.incidentSpeed / 60)
    }
    if (outcome.type === "Hit") {
      this.play(this.cue, outcome.incidentSpeed / 30)
    }
  }

  processEventsAfter(outcomeCount, outcomes) {
    for (let i = outcomeCount; i < outcomes.length; i++) {
      this.eventToSounds(outcomes[i])
    }
  }

  playNotify() {
    this.play(this.pot, 1)
  }

  playSuccess(pitch) {
    this.play(this.success, 0.02)
    this.success.setDetune(pitch * 100 - 2500)
  }
}
