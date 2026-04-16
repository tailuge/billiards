# Voice Chat Integration Plan (Robust Edition)

This document outlines the focused, state-driven plan for adding 1v1 voice chat using `simple-peer`.

## 1. Principles
*   **One Class, One Job:** 
    *   `VoiceManager`: Low-level WebRTC (SimplePeer) wrapper.
    *   `VoiceController`: High-level state machine, UI coordination, and network policy.
*   **State-Driven:** All logic flows through a minimal state machine to handle race conditions.
*   **Low-Key UI:** Use the existing `#voice` button to reflect states via Unicode symbols.
*   **No Polyfills:** Avoid `Buffer` or `process` polyfills. If `simple-peer` fails due to environment limitations, fail quietly with a console warning.

## 2. The State Machine & UI

| State | UI Symbol | Meaning |
| :--- | :--- | :--- |
| `idle` | ☎️ | Ready to call |
| `requesting` | 📡 | I am calling/requesting |
| `ringing` | 🔔 | Incoming call pending |
| `connecting` | 📡 | Signaling in progress |
| `connected` | 🎙️ | Audio stream active |
| `failed` | ⚠️ | Error or permission denied |

## 3. Component Architecture

### A. `VoiceManager` (`src/network/voice/voicemanager.ts`)
Handles browser-level WebRTC and media streams.

*   `start(isInitiator: boolean, stream: MediaStream)`: Initializes `SimplePeer`.
*   `signal(data: any)`: Passes incoming signaling data to the peer.
*   `destroy()`: Cleanup streams and peer connection.
*   **Events:** `onSignal`, `onConnect`, `onStream`, `onError`.

### B. `VoiceController` (`src/controller/voicecontroller.ts`)
The brains of the operation.

*   `requestCall()`: Sends `VOICE_REQUEST` and moves to `requesting`.
*   `onIncomingRequest()`: Shows "Join" notification and moves to `ringing`.
*   `acceptCall()`: Acquires microphone, starts `VoiceManager`, and moves to `connecting`.
*   `onSignal(data)`: Handles incoming signaling; can "lazy-start" if in `requesting` state.
*   `onStateChange`: Callback to update the `#voice` button symbol.

### C. `ChatEvent` Extension (`src/events/chatevent.ts`)
*   Add `voiceType?: 'VOICE_REQUEST' | 'VOICE_SIGNAL'`
*   Add `voiceData?: any`

## 4. Implementation Steps

### 1. Dependencies
Add `simple-peer`.
```bash
yarn add simple-peer
```

### 2. `VoiceManager` Implementation
Robustly wrap `simple-peer`. Check if `SimplePeer.WEBRTC_SUPPORT` is available.

### 3. `VoiceController` Implementation
Implement state machine and UI update logic.

### 4. `Container` Wiring
*   Instantiate `VoiceController` and `VoiceManager`.
*   Handle voice-related `ChatEvent`s.

### 5. `Comment` View Wiring
*   Handle `#voice` button click.
*   Provide a way for `VoiceController` to update the button's text content.

## 5. Sequence Diagram

1.  **User A** clicks ☎️ -> `VC.requestCall()` -> Button becomes 📡 -> Send `VOICE_REQUEST`.
2.  **User B** receives `VOICE_REQUEST` -> `VC.onIncomingRequest()` -> Button becomes 🔔 -> Notification "Join".
3.  **User B** clicks "Join" -> `VC.acceptCall()` -> Button becomes 📡 -> `VM.start(false)`.
4.  **User A** receives `signal` -> `VC.onSignal(data)` -> `VC.acceptCall()` -> Button becomes 📡 -> `VM.start(true)`.
5.  **Peers** exchange signals until `connected` -> Button becomes 🎙️.
