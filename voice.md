# Voice Chat Integration Plan

This document outlines the plan for adding a simple-peer voice chat feature to the Billiards game.

## Overview

The voice chat will be initiated by a new button in the chat emoji grid. Clicking this button will send a special chat message that triggers both the sender and the receiver to establish a peer-to-peer audio connection using `simple-peer`.

## UI Changes

### `dist/index.html`
- Add a new emoji button to the `#commentMenu` div:
  ```html
  <button class="comment-emoji">☎️</button>
  ```

## Identity and Peer Identification

- **Identity:** Use the `clientId` from the `Session` singleton (`Session.getInstance().clientId`). This ID is unique for each participant in a game session.
- **Passing Identity:** When the ☎️ emoji is clicked, the chat message should include the sender's `clientId`. For example: `☎️:{clientId}`.

## Signaling Flow

WebRTC requires an exchange of signaling data (SDP and ICE candidates) to establish a connection. We will use the existing `ChatEvent` mechanism as the signaling channel.

1.  **Initiation:**
    - User A (Initiator) clicks the ☎️ button.
    - User A's client sends a `ChatEvent` with message `☎️:INIT:{clientId}`.
    - User A's client initializes `SimplePeer` with `{ initiator: true }`.
2.  **Reception:**
    - User B (Receiver) receives the `ChatEvent`.
    - User B's client recognizes the ☎️ icon and the `clientId`.
    - User B's client initializes `SimplePeer` with `{ initiator: false }`.
3.  **Signal Exchange:**
    - When User A's peer object emits a `signal` event, User A sends a `ChatEvent` with `☎️:SIGNAL:{clientId}:{data}`.
    - User B receives the signal message and calls `peer.signal(data)`.
    - User B's peer object will also emit `signal` events, which are sent back to User A in the same manner.
4.  **Connection:**
    - Once the peers are connected, the audio stream will be exchanged.

## `simple-peer` Interface for Voice

- **Installation:** Add `simple-peer` to `package.json` or include it via a CDN in `index.html`.
- **Media Access:**
  ```javascript
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const peer = new SimplePeer({
        initiator: isInitiator,
        stream: stream,
        trickle: true
      });

      peer.on('signal', data => {
        // Send signal data via ChatEvent
      });

      peer.on('stream', remoteStream => {
        // Play remote audio stream
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play();
      });
    });
  ```

## Required Code Changes (Outline)

- **`src/view/comment.ts`**: Update to ensure the ☎️ button triggers the initiation logic.
- **`src/container/container.ts`**: Handle incoming `ChatEvent`s to filter for voice signaling messages and route them to a `VoiceManager`.
- **`src/network/voice/voicemanager.ts` (New)**: Create a class to manage the `SimplePeer` instance, media streams, and signaling state.
