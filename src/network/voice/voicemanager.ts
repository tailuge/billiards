import SimplePeer from "simple-peer"

export class VoiceManager {
  private peer: any = null
  private localStream: MediaStream | null = null
  private audio: HTMLAudioElement | null = null
  private pendingSignals: any[] = []

  onSignal: (data: any) => void = () => {}
  onConnect: () => void = () => {}
  onError: (err: Error) => void = () => {}

  async start(isInitiator: boolean, stream: MediaStream) {
    this.destroy()
    this.localStream = stream

    try {
      // Check for WebRTC support gracefully
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
      // flush
      for (const s of this.pendingSignals) {
        this.peer.signal(s)
      }
      this.pendingSignals = []
      
      this.peer.on("iceStateChange", (state: any) => {
        console.log("ICE state:", state)
      })

      this.peer.on("connect", () => {
        console.log("PEER CONNECTED")
      })
      this.peer.on("signal", (data: any) => {
        console.log("SIGNAL OUT:", data.type || "candidate")
        this.onSignal(data)
      })
      this.peer.on("connect", () => this.onConnect())
      this.peer.on("stream", (remoteStream: MediaStream) => {
        this.playStream(remoteStream)
      })
      this.peer.on("error", (err: Error) => {
        console.warn("SimplePeer error:", err)
        this.onError(err)
      })
    } catch (err) {
      console.warn("Failed to initialize SimplePeer:", err)
      this.onError(err as Error)
    }
  }

  private playStream(stream: MediaStream) {
    this.audio = new Audio()
    this.audio.srcObject = stream
    this.audio.play().catch((e) => console.warn("Audio play blocked:", e))
  }

  signal(data: any) {
    console.log("SIGNAL IN:", data.type || "candidate")
    if (!this.peer) {
      this.pendingSignals.push(data)
      return
    }

    try {
      this.peer.signal(data)
    } catch (err) {
      console.warn("Error signaling Peer:", err)
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
    this.localStream = null
  }
}
