import { AudioListener, Audio, AudioLoader, MathUtils } from "three"

const SAGU_VOICE = [
  "start",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "foul",
  "cushion",
  "three_cushion",
  "win",
]

export class Sound {
  listener: AudioListener
  audioLoader: AudioLoader

  ballcollision
  cue
  cushion
  pot
  success

  lastOutcomeTime = 0
  lastOutcomeIndex = 0
  lastOutcomesRef: any[] | null = null
  loadAssets
  voice?: Map<string, Audio>
  private voiceQueue: string[] = []
  private voicePlaying = false
  private voiceWaiting = false

  constructor(loadAssets, ruletype = "") {
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

    if (ruletype === "sagu") {
      this.voice = new Map()
      for (const id of SAGU_VOICE) {
        const audio = new Audio(this.listener)
        // Set before any play(): three binds source.onended from this property
        // when play() runs, so a handler assigned afterwards never fires.
        audio.onEnded = () => {
          Audio.prototype.onEnded.call(audio)
          this.voicePlaying = false
          this.playNextVoice()
        }
        this.voice.set(id, audio)
        this.load(`tts/${id}.ogg`, audio, () => this.playNextVoice())
      }
    }
  }

  addCameraToListener(camera) {
    camera.add(this.listener)
  }

  load(path, audio, onLoaded?: () => void) {
    this.audioLoader.load(
      path,
      (buffer) => {
        audio.setBuffer(buffer)
        audio.setLoop(false)
        onLoaded?.()
      },
      (_) => {},
      (_) => {}
    )
  }

  play(audio: Audio, volume, detune = 0) {
    if (!this.loadAssets) {
      return false
    }
    const context = this.listener.context
    if (context?.state === "suspended") {
      if (navigator?.userActivation?.hasBeenActive) {
        context.resume()
      }
      return false
    }
    audio.setVolume(volume)
    if (audio.isPlaying) {
      audio.stop()
    }
    audio.play(MathUtils.randFloat(0, 0.01))
    audio.setDetune(detune)
    return true
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
    if (outcome.type === "Proximity") {
      // tbd
    }
  }

  processOutcomes(outcomes) {
    // Optimize processOutcomes to avoid scanning from index 0 every frame.
    // We cache the last checked outcomes array reference and track the next outcome index.
    if (
      this.lastOutcomeTime === -1 ||
      outcomes !== this.lastOutcomesRef ||
      this.lastOutcomeIndex > outcomes.length
    ) {
      this.lastOutcomeIndex = 0
      this.lastOutcomesRef = outcomes
    }
    for (let i = this.lastOutcomeIndex; i < outcomes.length; i++) {
      const outcome = outcomes[i]
      if (outcome.timestamp > this.lastOutcomeTime) {
        this.lastOutcomeTime = outcome.timestamp
        this.lastOutcomeIndex = i + 1
        this.outcomeToSound(outcome)
        break
      }
    }
  }

  playNotify() {
    this.play(this.pot, 1)
  }

  playSuccess(pitch) {
    this.play(this.success, 0.1, pitch * 100 - 2200)
  }

  playVoice(id) {
    this.speak([id])
  }

  /**
   * Queues sagu voice lines so a break number and the three-cushion warning
   * for the same shot are spoken in order instead of talking over each other.
   * Ids are kept until their sample has loaded and the audio context is
   * running, so the first line of a game is not lost to either.
   */
  speak(ids: string[]) {
    if (!this.loadAssets || !this.voice) {
      return
    }
    this.voiceQueue.push(...ids)
    this.playNextVoice()
  }

  private playNextVoice() {
    if (this.voicePlaying) {
      return
    }
    while (this.voiceQueue.length > 0) {
      const audio = this.voice?.get(this.voiceQueue[0])
      if (!audio) {
        // No tts sample for this id (e.g. a break above 25).
        this.voiceQueue.shift()
        continue
      }
      if (!audio.buffer) {
        // Still downloading; load() calls back here once it is ready.
        return
      }
      const context = this.listener.context
      if (context?.state === "suspended") {
        if (navigator?.userActivation?.hasBeenActive) {
          void context.resume()
        }
        this.waitForContext()
        return
      }
      this.voicePlaying = true
      if (!this.play(audio, 0.3)) {
        this.voicePlaying = false
        this.waitForContext()
        return
      }
      this.voiceQueue.shift()
      return
    }
  }

  private waitForContext() {
    if (this.voiceWaiting) {
      return
    }
    this.voiceWaiting = true
    const context = this.listener.context
    // The browser only allows the audio context to start inside a user
    // gesture, and a sagu game begins before the player clicks anything.
    const resumeOnGesture = () => {
      void context.resume()
    }
    const stopListeningForGesture = () => {
      globalThis.removeEventListener("pointerdown", resumeOnGesture, true)
      globalThis.removeEventListener("keydown", resumeOnGesture, true)
    }
    context.addEventListener(
      "statechange",
      () => {
        this.voiceWaiting = false
        stopListeningForGesture()
        this.playNextVoice()
      },
      { once: true }
    )
    globalThis.addEventListener("pointerdown", resumeOnGesture, {
      once: true,
      capture: true,
    })
    globalThis.addEventListener("keydown", resumeOnGesture, {
      once: true,
      capture: true,
    })
  }
}
