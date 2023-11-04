import {
  AudioListener,
  Audio,
  AudioLoader,
  MathUtils,
  AudioContext,
} from "three"

export class Sound {
  listener: AudioListener
  audioLoader: AudioLoader

  ballcollision
  cue
  cushion
  pot
  success

  lastOutcomeTime = 0
  loadAssets

  constructor(loadAssets) {
    this.loadAssets = loadAssets
    if (!loadAssets) {
      return
    }
    this.listener = new AudioListener()
    this.audioLoader = new AudioLoader()

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

  addCameraToListener(camera) {
    camera.add(this.listener)
  }

  load(path, audio) {
    this.audioLoader.load(
      path,
      (buffer) => {
        audio.setBuffer(buffer)
        audio.setLoop(false)
      },
      (_) => {},
      (_) => {}
    )
  }

  play(audio: Audio, volume, detune = 0) {
    if (this.loadAssets) {
      const context = AudioContext.getContext()
      if (context?.state === "suspended") {
        if (navigator?.userActivation?.hasBeenActive) {
          context.resume()
        }
        return
      }
      audio.setVolume(volume)
      if (audio.isPlaying) {
        audio.stop()
      }
      audio.play(MathUtils.randFloat(0, 0.01))
      audio.setDetune(detune)
    }
  }

  outcomeToSound(outcome) {
    if (outcome.type === "Collision") {
      this.play(
        this.ballcollision,
        outcome.incidentSpeed / 80,
        outcome.incidentSpeed * 5
      )
    }
    if (outcome.type === "Pot") {
      this.play(
        this.pot,
        outcome.incidentSpeed / 10,
        -1000 + outcome.incidentSpeed * 10
      )
    }
    if (outcome.type === "Cushion") {
      this.play(this.cushion, outcome.incidentSpeed / 70)
    }
    if (outcome.type === "Hit") {
      this.play(this.cue, outcome.incidentSpeed / 30)
    }
  }

  processOutcomes(outcomes) {
    outcomes.every((outcome) => {
      if (outcome.timestamp > this.lastOutcomeTime) {
        this.lastOutcomeTime = outcome.timestamp
        this.outcomeToSound(outcome)
        return false
      }
      return true
    })
  }

  playNotify() {
    this.play(this.pot, 1)
  }

  playSuccess(pitch) {
    this.play(this.success, 0.1, pitch * 100 - 2200)
  }
}
