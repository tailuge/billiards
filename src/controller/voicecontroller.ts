import { Container } from "../container/container"
import { VoiceManager } from "../network/voice/voicemanager"
import { ChatEvent } from "../events/chatevent"
import { Session } from "../network/client/session"

export type VoiceState =
  | "idle"
  | "requesting"
  | "ringing"
  | "connecting"
  | "connected"
  | "failed"

const SYMBOLS: Record<VoiceState, string> = {
  idle: "☎️",
  requesting: "📡",
  ringing: "🔔",
  connecting: "📡",
  connected: "🎙️",
  failed: "⚠️",
}

export class VoiceController {
  private state: VoiceState = "idle"
  private voice: VoiceManager
  private container: Container

  onStateChange: (symbol: string) => void = () => {}

  constructor(container: Container, voice: VoiceManager) {
    this.container = container
    this.voice = voice

    this.voice.onSignal = (data) => {
      this.container.sendEvent(
        new ChatEvent(this.container.id, "", "VOICE_SIGNAL", data)
      )
    }

    this.voice.onConnect = () => {
      this.setState("connected")
    }

    this.voice.onError = (err) => {
      console.warn("VoiceController: VoiceManager error", err)
      this.setState("failed")
      this.voice.destroy()
    }
  }

  setState(next: VoiceState) {
    if (this.state === next) return
    console.log(`Voice state: ${this.state} → ${next}`)
    this.state = next
    this.onStateChange(SYMBOLS[next])
  }

  requestCall() {
    if (this.state !== "idle" && this.state !== "failed") {
      if (this.state === "connected" || this.state === "connecting") {
        this.endCall()
      }
      return
    }

    this.setState("requesting")
    this.container.sendEvent(
      new ChatEvent(this.container.id, "", "VOICE_REQUEST")
    )
  }

  onIncomingRequest() {
    if (this.state !== "idle") return

    this.setState("ringing")

    this.container.notifyLocal(
      {
        type: "Info",
        title: "Voice Chat Request",
        subtext: "Your opponent wants to start a voice chat.",
        extra: `<button class="notification-action" data-notification-action="join">Join</button>`,
      },
      15000,
      {
        join: () => this.acceptCall(),
      }
    )
  }

  async acceptCall() {
    if (this.state !== "ringing" && this.state !== "requesting") return

    try {
      this.setState("connecting")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const isInitiator = Session.getInstance().playerIndex === 0
      this.voice.start(isInitiator, stream)
    } catch (err) {
      console.warn("VoiceController: Could not get microphone access:", err)
      this.setState("failed")
    }
  }

  onSignal(data: any) {
    if (this.state === "requesting") {
      this.acceptCall()
    }
    this.voice.signal(data)
  }

  endCall() {
    this.voice.destroy()
    this.setState("idle")
  }
}
