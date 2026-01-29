# Objectives

I want to bind a live online user count to html component in index.html id=lobby

  <a href="https://scoreboard-tailuge.vercel.app/game"
            target="_blank"
            class="pill"
            title="Lobby"
            id="lobby"
            >(add live count here)👥</a
          >

Instructions on how to get the live count is outlined below. But first we must rationalise the suggestion with the existing class for in game messaging of shot in nchanmessagingrelay.ts

Note that that component is only instantiated when it is in 2 player mode - so any changes must respoect that. It is important that when tests run that do not use this then it must not attempt connections. 

Plan out how the suggested code below can be combined or abtracted from the existing class for in game messaging of shot in nchanmessagingrelay.ts. Obviously the onilne player count must be visible in 1-player mode so there will be some change to instantiation.

The code that connects the network to the component should be in view/lobbyindicator.ts and that will be likely created from container.ts. It should be created in 1 player mode and probably all modes.

# Nchan Usage: Live Online User Count

This document describes how to integrate a real-time online user count into an external application using the Nchan server.

## Overview

The online count is derived from the Nchan server's active connections. The count is initially fetched via a status endpoint and then updated live via a WebSocket subscription to the `lobby` channel.

## Endpoints

- **Status URL:** `https://billiards-network.onrender.com/basic_status`
- **WebSocket URL:** `wss://billiards-network.onrender.com/subscribe/lobby/lobby`

## Implementation Guide

The following TypeScript code can be used in a plain HTML/TS environment. It updates an element with the current number of active connections.

### 1. Fetching the Count

The count is retrieved by parsing the `basic_status` response. Note that we subtract `1` to account for the internal system connection.

```typescript
async function getOnlineCount(): Promise<number | null> {
  try {
    const response = await fetch("https://billiards-network.onrender.com/basic_status");
    const text = await response.text();
    const match = text.match(/Active connections:\s+(\d+)/);
    return match ? parseInt(match[1], 10) - 1 : null;
  } catch (err) {
    // Fail silently to avoid console noise in production
    return null;
  }
}
```

### 2. Live Updates

To receive live updates, subscribe to the `lobby` channel. Whenever a user connects to the lobby, a `{ "action": "connected" }` message is broadcast, which should trigger a refresh of the count.

```typescript
function connectLobbyCount(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const refresh = async () => {
    const count = await getOnlineCount();
    if (count !== null) {
      element.textContent = count.toString();
    }
  };

  // Initial update
  refresh();

  // WebSocket Subscription
  const wsUrl = "wss://billiards-network.onrender.com/subscribe/lobby/lobby";
  let socket: WebSocket | null = null;

  const connect = () => {
    socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.action === "connected") {
          refresh();
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    socket.onclose = () => {
      // Reconnect after 30 seconds if connection is lost
      setTimeout(connect, 30000);
    };

    socket.onerror = () => {
      socket?.close();
    };
  };

  connect();
}
```

### 3. Usage in HTML

Ensure your element exists in the DOM:

```html
<a href="https://scoreboard-tailuge.vercel.app/lobby" id="lobbycount">0</a>

<script>
  // Assuming the TS is compiled or included
  connectLobbyCount("lobbycount");
</script>
```

## Considerations

- **Quiet Failures:** The implementation handles connection errors silently and attempts to reconnect every 30 seconds.
- **Latency:** The `basic_status` endpoint reflects real-time connections, but there might be a slight delay in the WebSocket broadcast.
- **CORS:** The Nchan server is configured to allow CORS requests from all origins.

# Proposed Refactoring Plan

To integrate the live online user count while maintaining code quality and testability, the following changes are proposed:

## 1. Generalize `MessageRelay` Interface
Update `src/network/client/messagerelay.ts` to support different channel prefixes and the status check:
- Add an optional `prefix` parameter to `subscribe` and `publish` (defaulting to `"table"`).
- Add `getOnlineCount(): Promise<number | null>`.

## 2. Enhance `NchanMessageRelay`
Update `src/network/client/nchanmessagerelay.ts`:
- Implement `getOnlineCount()` using the `basic_status` endpoint and `fetch`.
- Refactor `subscribe` and `publish` to use the provided `prefix` in URL construction.

## 3. Implement `LobbyIndicator`
Update `src/view/lobbyindicator.ts`:
- The constructor should accept a `MessageRelay`.
- It will perform the initial `getOnlineCount()` call and subscribe to the `lobby` channel (using `prefix="lobby"`) to trigger refreshes when users connect.
- It will safely update the DOM element with `id="lobby"`.

## 4. Container Integration
- Modify `Container` constructor in `src/container/container.ts` to accept an optional `MessageRelay`.
- Pass this relay to the `LobbyIndicator`.
- This ensures `LobbyIndicator` is always present but only active if a relay is provided.

## 5. Browser Integration
- Update `BrowserContainer` in `src/container/browsercontainer.ts` to always instantiate `NchanMessageRelay`.
- Pass the relay to the `Container` regardless of whether it is in single-player or multi-player mode.
- This allows the lobby count to function globally while game-specific logic remains conditional on the `wss` parameter.

## 6. Test Compatibility
- Update `InMemoryMessageRelay` in `test/mocks/inmemorymessagerelay.ts` to match the new interface.
- Ensure that existing tests passing `null` or no relay to `Container` still function correctly (LobbyIndicator will simply remain idle).