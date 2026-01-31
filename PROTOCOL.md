# Plan: Enhancing Game Event Protocol with Optional Player Names

This document outlines the steps to modify the game event protocol to include an optional player name (`playername`) alongside the client ID (`clientId`) in `GameEvent` objects. This will address the current limitation in player identification within game events.

## 1. Objective

The goal is to enable the transmission of an optional `playername` with each `GameEvent` to facilitate better player identification in multiplayer scenarios, and to ensure this is correctly handled during serialization and deserialization, with comprehensive testing.

## 2. Proposed Implementation Steps

- [ ] **Step 1: Modify `GameEvent` Interface/Class**
  Add an optional `playername?: string;` property to the `GameEvent` abstract class or interface (`src/events/gameevent.ts`). This will ensure all game events can carry player name information.

- [ ] **Step 2: Update `EventUtil` for Serialization/Deserialization**
  Modify `src/events/eventutil.ts` to correctly handle the new `playername` property:
  - Ensure `EventUtil.serialise(event: GameEvent)` includes the `playername` when converting a `GameEvent` to a JSON string.
  - Ensure `EventUtil.fromSerialised(data: string)` extracts the `playername` when reconstructing a `GameEvent` from a JSON string.

- [ ] **Step 3: Populate `playername` in Event Broadcasting**
  Update `BrowserContainer` (`src/container/browsercontainer.ts`) in the `broadcast` method to set the `playername` on the `GameEvent` before serializing and publishing it. The `playername` can be obtained from `Session.getInstance().playername`.

- [ ] **Step 4: Update `Session` for Opponent Name Mapping (Optional but Recommended)**
  Consider enhancing the `Session` class (`src/network/client/session.ts`) to maintain a mapping of `clientId` to `playername` for all connected players on a table. This would allow `clientId`s received via `GameEvent`s to be resolved to their corresponding `playername`s. This step is a refinement that would make player identification easier throughout the application.

- [ ] **Step 5: Create/Update Unit Tests for `EventUtil`**
  Add new unit tests or update existing ones in `test/events/eventutil.spec.ts` to specifically verify:
  - That `GameEvent`s with an optional `playername` are correctly serialized and deserialized.
  - That `GameEvent`s without a `playername` are also handled correctly (i.e., `playername` is `undefined` or `null` after deserialization).

- [ ] **Step 6: Create Integration Tests (Optional but Recommended)**
  If feasible, create or update integration tests to simulate a multiplayer scenario where `playername`s are transmitted and received correctly between two clients. This might involve mocking the `MessageRelay` or setting up a minimal test environment. This step aims to verify end-to-end functionality.
