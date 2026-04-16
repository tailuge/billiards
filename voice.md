# Voice Chat Integration Plan (Robust Edition)

This document outlines the focused, state-driven plan for adding 1v1 voice chat using `simple-peer`.

## 1. Principles
*   **One Class, One Job:** 
    *   `VoiceManager`: Low-level WebRTC (SimplePeer) wrapper.
    *   `VoiceController`: High-level state machine, UI coordination, and network policy.
*   **State-Driven:** All logic flows through a minimal state machine to handle race conditions (e.g., signaling arriving before the user clicks "Join").
*   **Implicit Signaling:** No need for extra handshakes; in a 1v1 game, the opponent is always the target.

## 2. The State Machine

```typescript
type VoiceState =
  | 'idle'
  | 'requesting'   // I clicked ☎️
  | 'ringing'      // Opponent clicked ☎️
  | 'connecting'   // Both accepted, signaling happening
  | 'connected'    // Audio streaming
  | 'failed';      // Error or permission denied
```

## 3. Component Architecture

### A. `VoiceManager` (`src/network/voice/voicemanager.ts`)
Handles the browser-level WebRTC logic and media streams.

*   `start(isInitiator: boolean, stream: MediaStream)`: Initializes `SimplePeer`.
*   `signal(data: any)`: Passes incoming signaling data to the peer.
*   `destroy()`: Cleanup streams and peer connection.
*   **Events:** `onSignal`, `onConnect`, `onStream`, `onError`.

### B. `VoiceController` (`src/controller/voicecontroller.ts`)
The brains of the operation. Coordinates between the `VoiceManager`, `Container` (Network), and UI.

*   `requestCall()`: Sends `VOICE_REQUEST` and moves to `requesting`.
*   `onIncomingRequest()`: Shows "Join" notification via `container.notifyLocal`.
*   `acceptCall()`: Acquires microphone, starts `VoiceManager`, and moves to `connecting`.
*   `onSignal(data)`: Handles incoming signaling; can "lazy-start" if we are in `requesting` state.
*   **Helper:** `isInitiator()` derived from `Session.playerIndex === 0`.

### C. `ChatEvent` Extension (`src/events/chatevent.ts`)
Reuse existing chat infrastructure for signaling to avoid new message types.

*   Add `voiceType?: 'VOICE_REQUEST' | 'VOICE_SIGNAL'`
*   Add `voiceData?: any`

## 4. Implementation Steps

### 1. Dependencies
Add `simple-peer` and its types.
```bash
yarn add simple-peer
yarn add -D @types/simple-peer
```

### 2. `VoiceManager` Implementation
Robustly wrap `simple-peer`, ensuring `MediaStream` is handled correctly and `destroy()` is thorough.

### 3. `VoiceController` Implementation
Implement the state machine logic.
*   **Permissions:** Wrap `getUserMedia` in a try/catch to transition to `failed` gracefully.
*   **UI:** Use `container.notifyLocal` with an action button for "Join".

### 4. `Container` Wiring
*   Instantiate `VoiceController` and `VoiceManager`.
*   In `handleChat`: Route events with `voiceType` to `VoiceController.onSignal` or `onIncomingRequest`.

### 5. `Comment` View Wiring
*   Identify the `☎️` button click in `src/view/comment.ts`.
*   Call `voiceController.requestCall()`.

## 5. Sequence Diagram

1.  **User A** clicks ☎️ -> `VC.requestCall()` -> Send `VOICE_REQUEST`.
2.  **User B** receives `VOICE_REQUEST` -> `VC.onIncomingRequest()` -> `container.notifyLocal("Join")`.
3.  **User B** clicks "Join" -> `VC.acceptCall()` -> `VM.start(false)` -> `VM` emits `signal`.
4.  **User A** receives `signal` -> `VC.onSignal(data)` -> `VC` sees state is `requesting` -> `VC.acceptCall()` -> `VM.start(true)` -> `VM.signal(data)`.
5.  **Peers** exchange signals until `connected`.
6.  **Audio** streams automatically via `VM.onStream`.
