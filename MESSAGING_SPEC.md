# Multi-User Messaging Library Specification

## Overview
This document outlines the requirements and contract for a unified messaging library designed to handle presence and real-time synchronization. The library abstracts the underlying transport (e.g., Nchan, WebSockets) and provides a semantic, stateful API for turn-based multi-user applications.

## Goals
- **Zero WebSocket Dependencies**: The consumer project should not interact with WebSockets directly.
- **Unified Client**: A single entry point for both global presence (lobby) and specific session messaging.
- **Stateful Presence**: Internal management of online users, including heartbeats and stale user pruning.
- **Semantic API**: Interaction through high-level methods rather than raw channel/URL manipulation.
- **Platform Agnostic**: Compatible with both Browser and Node.js environments.

---

## Core API Contract

### `MessagingClient`

The main class exposed by the library.

```typescript
interface MessagingClient {
  /**
   * Initialize and start the client.
   * Handles initial connection and automatic reconnection logic.
   */
  start(): Promise<void>;

  /**
   * Stop all connections, timers (heartbeats), and clean up resources.
   */
  stop(): void;

  /**
   * Joins the global lobby to broadcast presence and see other online users.
   */
  joinLobby(user: UserProfile): Promise<Lobby>;

  /**
   * Joins a specific synchronized session (e.g., a game room).
   */
  joinSession(sessionId: string): Promise<Session>;
}
```

### `Lobby`

Represents the global presence state.

```typescript
interface Lobby {
  /**
   * Stream of the current online users.
   * Emits the full list or patches whenever users join, leave, or time out.
   */
  onUsersChange(callback: (users: UserProfile[]) => void): void;

  /**
   * Broadcast a metadata update for the current user.
   */
  updateProfile(metadata: Record<string, any>): void;

  /**
   * Leave the lobby.
   */
  leave(): void;
}
```

### `Session`

Represents a specific communication channel for a 2-player/spectator scenario.

```typescript
interface Session {
  /**
   * Broadcast an event to all participants in the session.
   */
  publish(event: MessagePayload): void;

  /**
   * Subscribe to events published by other participants.
   */
  onMessage(callback: (event: MessagePayload) => void): void;

  /**
   * Leave the session.
   */
  leave(): void;
}
```

---

## Data Models

### `UserProfile`
Information about a user in the lobby.
```typescript
interface UserProfile {
  id: string;
  name: string;
  metadata: Record<string, any>; // e.g., { locale: "en-US", status: "playing", ruletype: "standard" }
  lastSeen: number; // Managed internally for pruning
}
```

### `MessagePayload`
A generic structure for game events.
```typescript
interface MessagePayload {
  type: string;
  senderId: string;
  timestamp: number;
  payload: any; // Generic data specific to the application logic
}
```

---

## Internal Requirements

### 1. Presence Management
- **Heartbeat**: The library must automatically send periodic "heartbeat" messages (e.g., every 60 seconds) to the lobby while active.
- **Pruning**: The library must maintain an internal map of users and automatically remove users who haven't sent a heartbeat within a specific TTL (e.g., 90 seconds).
- **Unload Handling**: In browser environments, the library should attempt to send a "leave" message on `beforeunload` or `pagehide`.

### 2. Transport & Reconnection
- **Abstraction**: The use of Nchan (WebSockets for subscribe, POST for publish) should be an implementation detail.
- **Resilience**:
  - Automatic exponential backoff for reconnection on WebSocket failure.
  - Transparently handle transition between online/offline states.
- **Concurrency**: Ensure multiple `Session` instances can coexist if needed (though typically one game at a time).

### 3. State Synchronization
- The library should ensure that when a user joins a lobby, they receive the current "state of the world" or quickly populate it via incoming heartbeats.
- For sessions, it should provide a reliable pipe for sequence-sensitive events (optionally implementing sequence numbering if required by the transport).

## Usage Example (Conceptual)

```typescript
const client = new MessagingClient({
  baseUrl: "messaging.example.com",
  user: { id: "user-123", name: "Alice" }
});

await client.start();

// Lobby interaction
const lobby = await client.joinLobby({
  id: "user-123",
  name: "Alice",
  metadata: { locale: "en" }
});

lobby.onUsersChange((users) => {
  console.log("Online users:", users.length);
});

// Session interaction
const gameSession = await client.joinSession("table-xyz");

gameSession.onMessage((msg) => {
  if (msg.type === "MOVE") {
    applyMove(msg.payload);
  }
});

gameSession.publish({
  type: "MOVE",
  payload: { x: 10, y: 20 }
});
```
