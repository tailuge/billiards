import { Container } from "../../container/container"
import { VoiceManager } from "./voicemanager"
import { ChatEvent } from "../../events/chatevent"

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
  private ringingTimeout: any

  onStateChange: (symbol: string) => void = () => {}

  constructor(container: Container, voice: VoiceManager) {
    this.container = container
    this.voice = voice
    if (!this.voice) return

    this.voice.onSignal = (data) => {
      this.container.sendEvent(
        new ChatEvent(this.container.id, "", "VOICE_SIGNAL", data)
      )
    }

    this.voice.onConnect = () => {
      this.setState("connected")
    }

    // Handle remote hangup/disconnect
    this.voice.onClose = () => {
      this.setState("idle")
    }

    this.voice.onError = (err) => {
      console.warn("VoiceController: VoiceManager error", err)
      this.setState("failed")
      this.voice.destroy()
    }
  }

  setState(next: VoiceState) {
    if (this.state === next) return
    if (this.state === "ringing") {
      clearTimeout(this.ringingTimeout)
    }
    console.log(`Voice state: ${this.state} → ${next}`)
    this.state = next
    this.onStateChange(SYMBOLS[next])
  }

  async requestCall() {
    // Single-button toggle logic
    if (this.state === "ringing") {
      return this.acceptCall()
    }

    if (
      this.state === "connected" ||
      this.state === "connecting" ||
      this.state === "requesting"
    ) {
      return this.endCall()
    }

    this.setState("requesting")

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Caller initiates the WebRTC offer
      this.voice.start(true, stream)
      this.container.sendEvent(
        new ChatEvent(this.container.id, "☎️", "VOICE_REQUEST")
      )
    } catch (err) {
      console.warn("Mic error:", err)
      this.setState("failed")
    }
  }

  onIncomingRequest() {
    if (this.state !== "idle") return

    this.setState("ringing")

    this.ringingTimeout = setTimeout(() => {
      if (this.state === "ringing") {
        this.setState("idle")
      }
    }, 15000)
  }

  async acceptCall() {
    // Prevent redundant calls to getUserMedia during signaling
    if (this.state !== "ringing" && this.state !== "requesting") return

    this.setState("connecting")

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Receiver waits for the offer/signals
      this.voice.start(false, stream)
    } catch (err) {
      console.warn("VoiceController: Mic access failed:", err)
      this.setState("failed")
    }
  }

  onSignal(data: any) {
    // Only auto-accept if we haven't started the process yet
    if (this.state === "ringing") {
      this.acceptCall()
    }
    this.voice.signal(data)
  }

  endCall() {
    this.container.sendEvent(new ChatEvent(this.container.id, "", "VOICE_END"))
    this.voice.destroy()
    this.setState("idle")
  }

  // Call this when receiving a VOICE_END event from the remote peer
  onRemoteEnd() {
    this.voice.destroy()
    this.setState("idle")
  }
}
