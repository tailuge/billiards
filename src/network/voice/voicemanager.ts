import SimplePeer from "simple-peer"

export class VoiceManager {
  private peer: SimplePeer.Instance | null = null
  private localStream: MediaStream | null = null
  private audio: HTMLAudioElement | null = null
  private pendingSignals: any[] = []

  onSignal: (data: any) => void = () => {}
  onConnect: () => void = () => {}
  onError: (err: Error) => void = () => {}
  onClose: () => void = () => {}

  async start(isInitiator: boolean, stream: MediaStream) {
    this.destroy()
    this.localStream = stream

    try {
      if (!(SimplePeer as any).WEBRTC_SUPPORT) {
        throw new Error("WebRTC not supported in this browser.")
      }

      this.peer = new SimplePeer({
        initiator: isInitiator,
        stream: this.localStream,
        trickle: true,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
          ],
        },
      })

      // Setup listeners BEFORE signaling or flushing
      this.peer.on("signal", (data) => {
        this.onSignal(data)
      })

      this.peer.on("connect", () => {
        this.onConnect()
      })

      this.peer.on("stream", (remoteStream) => {
        this.playStream(remoteStream)
      })

      this.peer.on("error", (err) => {
        this.onError(err)
      })

      this.peer.on("close", () => {
        this.onClose()
        this.destroy()
      })

      // Flush pending signals after listeners are attached
      while (this.pendingSignals.length > 0) {
        const sig = this.pendingSignals.shift()
        this.peer.signal(sig)
      }
    } catch (err) {
      this.onError(err as Error)
    }
  }

  private playStream(stream: MediaStream) {
    if (this.audio) {
      this.audio.pause()
      this.audio.srcObject = null
    }
    this.audio = new Audio()
    this.audio.srcObject = stream
    this.audio.play().catch((e) => console.warn("Playback blocked:", e))
  }

  signal(data: any) {
    if (!this.peer) {
      this.pendingSignals.push(data)
      return
    }

    try {
      this.peer.signal(data)
    } catch (err) {
      console.warn("Signal error:", err)
    }
  }

  destroy() {
    if (this.audio) {
      this.audio.pause()
      this.audio.srcObject = null
      this.audio = null
    }

    if (this.peer) {
      this.peer.destroy()
      this.peer = null
    }

    // Stop tracks to release hardware (mic/camera)
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }

  }
}
