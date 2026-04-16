# Voice Chat Integration Plan (Revised)

This document outlines the simplified and robust plan for adding a simple-peer voice chat feature to the Billiards game.

## 1. Architectural Simplification

*   **Implicit Peer Identity:** In a 1v1 game, peer identity is implicit. Any signaling message received via the game session is from the opponent. No `clientId` exchange is required.
*   **Structured Events:** Use structured events with a `type` field rather than parsing strings.
*   **Signaling Isolation:** Ensure signaling messages are handled by the `VoiceManager` and do not appear in the chat history UI.

## 2. Updated Signaling Flow

| Step | Action | Event Payload |
| :--- | :--- | :--- |
| **1. Request** | User A clicks ☎️ | `{ type: 'VOICE_REQUEST' }` |
| **2. Acceptance**| User B clicks "Join" Notification | (Local Action) |
| **3. Signaling** | User A/B emit `signal` | `{ type: 'VOICE_SIGNAL', data: [SDP/ICE Object] }` |
| **4. Stream** | Peer emits `stream` | (Internal to `simple-peer`) |

## 3. Implementation Outline

### UI Change (`dist/index.html`)
Add a simple toggle button in the `#commentMenu`:
```html
<button id="voiceToggle" class="comment-emoji">☎️</button>
```

### The `VoiceManager` (`src/network/voice/voicemanager.ts`)
Encapsulate all WebRTC logic here. Includes robust error handling for user permissions.

```typescript
// Note: simple-peer might require polyfills for 'process' or 'Buffer' in some environments.
import SimplePeer from 'simple-peer';

export class VoiceManager {
  private peer: any = null;

  async start(isInitiator: boolean, onSignal: (data: any) => void) {
    if (this.peer) this.peer.destroy();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.peer = new SimplePeer({
        initiator: isInitiator,
        stream: stream,
        trickle: true
      });

      this.peer.on('signal', (data: any) => onSignal(data));

      this.peer.on('stream', (remoteStream: MediaStream) => {
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play().catch(e => console.error("Audio play blocked", e));
      });
    } catch (err) {
      console.error("Failed to get local stream", err);
      // Notify the user via the UI that voice initialization failed
    }
  }

  signal(data: any) {
    if (this.peer) this.peer.signal(data);
  }

  destroy() {
    if (this.peer) {
        this.peer.destroy();
        this.peer = null;
    }
  }
}
```

### Network Integration (`src/container/container.ts`)
Handle events with mandatory user activation for the receiver to satisfy browser security policies.

```typescript
// Inside Container class initialization
this.voiceManager = new VoiceManager();

// Inside message handling logic (e.g., handleChat)
function handleChat(event: ChatEvent) {
  if (event.type === 'VOICE_REQUEST') {
      // User Activation Requirement: Show a notification instead of starting automatically
      this.notifyLocal({
          title: "Voice Chat Request",
          message: `${event.sender} wants to start a voice chat.`,
          actions: [{
              label: "Join",
              callback: () => {
                  this.voiceManager.start(false, (data) => this.sendChatEvent('VOICE_SIGNAL', data));
              }
          }]
      });
      return;
  }

  if (event.type === 'VOICE_SIGNAL') {
      this.voiceManager.signal(event.data);
      return;
  }

  // Standard chat message
  if (!event.type) {
      this.chat.showMessage(event.message);
  }
}

// Button Click Handler (Initiator)
document.getElementById('voiceToggle').onclick = () => {
  this.voiceManager.start(true, (data) => this.sendChatEvent('VOICE_SIGNAL', data));
  this.sendChatEvent('VOICE_REQUEST', {});
};
```

## 4. Key Improvements & Browser Compatibility
1.  **User Activation:** By using `this.notifyLocal` and requiring a button click to "Join", we ensure `getUserMedia` and `audio.play()` are called within a user-initiated event stack, preventing browser blocks.
2.  **Error Handling:** `VoiceManager.start` uses `try-catch` to handle cases where the user denies microphone access or no device is available.
3.  **Signaling Isolation:** Signaling events are processed silently by the `Container` and do not clutter the chat output.

## 5. Required Code Changes

- **`src/events/chatevent.ts`**: Add optional `voiceType` and `data` fields.
- **`src/view/comment.ts`**: Add `#voiceToggle` handler.
- **`src/container/container.ts`**: Integrate `VoiceManager`, handle `VOICE_REQUEST` with local notifications, and route signaling data.
- **`src/network/voice/voicemanager.ts`**: New class implementation.
- **`package.json`**: Add `simple-peer`.
