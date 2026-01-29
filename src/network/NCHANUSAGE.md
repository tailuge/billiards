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
