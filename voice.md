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
| **2. Signaling** | User A/B emit `signal` | `{ type: 'VOICE_SIGNAL', data: [SDP/ICE Object] }` |
| **3. Stream** | Peer emits `stream` | (Internal to `simple-peer`) |

## 3. Implementation Outline

### UI Change (`dist/index.html`)
Add a simple toggle button in the `#commentMenu`:
```html
<button id="voiceToggle" class="comment-emoji">☎️</button>
```

### The `VoiceManager` (`src/network/voice/voicemanager.ts`)
Encapsulate all WebRTC logic here to keep `container.ts` clean.

```typescript
// Note: simple-peer might require polyfills for 'process' or 'Buffer' in some environments.
import SimplePeer from 'simple-peer';

export class VoiceManager {
  private peer: any = null;

  async start(isInitiator: boolean, onSignal: (data: any) => void) {
    // Ensure we don't start multiple sessions
    if (this.peer) this.peer.destroy();

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
      audio.play();
    });
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
Handle the events without bloating the chat UI. The `VoiceManager` should be a persistent member of the `Container`.

```typescript
// Inside Container class initialization
this.voiceManager = new VoiceManager();

// Inside message handling logic (e.g., handleChat)
function handleChat(event: ChatEvent) {
  if (event.type === 'VOICE_REQUEST') {
      // Opponent wants to chat; start as receiver
      this.voiceManager.start(false, (data) => this.sendChatEvent('VOICE_SIGNAL', data));
      return;
  }

  if (event.type === 'VOICE_SIGNAL') {
      this.voiceManager.signal(event.data);
      return;
  }

  // Standard chat message (no type specified)
  if (!event.type) {
      this.chat.showMessage(event.message);
  }
}

// Button Click Handler (in Comment or Container)
document.getElementById('voiceToggle').onclick = () => {
  this.voiceManager.start(true, (data) => this.sendChatEvent('VOICE_SIGNAL', data));
  this.sendChatEvent('VOICE_REQUEST', {});
};
```

## 4. Required Code Changes

- **`src/events/chatevent.ts`**: Add optional `voiceType` and `data` fields to the `ChatEvent` class to carry signaling information.
- **`src/view/comment.ts`**: Update to handle the `#voiceToggle` button click separately from standard emoji clicks.
- **`src/container/container.ts`**: Instantiate `VoiceManager` as a member and update `handleChat` to route signaling messages correctly, bypassing the `Chat` view.
- **`src/network/voice/voicemanager.ts`**: Create this new class as outlined above.
- **`package.json`**: Add `simple-peer` dependency.
