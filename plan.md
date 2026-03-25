# Plan: Independent Bot in Web Worker

## Analysis of Current Implementation

### Network Player (`NchanMessageRelay`)
- **Communication**: Asynchronous via `Nchan` (server-side events/websockets).
- **Serialization**: Uses `EventUtil.serialise` and `EventUtil.fromSerialised` to exchange `GameEvent` objects.
- **Integration**: The `BrowserContainer` receives network events and pushes them into the `Container`'s `eventQueue`. It is highly decoupled from the game's internal physics and state.
- **State Management**: Relies on `Session` to store opponent information (ID, name, scores).

### Current Bot Player (`BotRelay` & `BotEventHandler`)
- **Execution**: Runs on the **main thread** within the same JavaScript context as the UI and physics engine.
- **Coupling**:
    - `BotEventHandler` is initialized with a reference to the `Container`.
    - It directly reads `container.table.outcome` to determine the results of shots.
    - It uses `container.rules` to evaluate foul conditions and game-end states.
    - It directly calls `container.scoreReporter` to submit match results.
- **Physics Dependency**: The bot does not run its own simulation. It waits for the main thread to process the physics and then inspects the resulting `outcome` array.
- **View Dependency**: The `Table` and `Ball` classes (used by the bot via `Container`) are tightly coupled with Three.js meshes (`BallMesh`, `Cue`). This prevents them from being instantiated in a Web Worker where the DOM and WebGL context are unavailable.

---

## Roadmap for Web Worker Implementation

To make the bot an independent player running in a Web Worker, we must decouple the game logic and physics from the rendering/UI components.

### 1. Model/View Separation
- **Headless Model**: Refactor `src/model/ball.ts` and `src/model/table.ts` to make Three.js mesh initialization optional.
- **Resource Decoupling**: Ensure that physics constants (in `src/model/physics/constants.ts`) and math utilities do not depend on browser-only APIs.
- **Headless Rules**: Ensure `Rules` implementations (e.g., `NineBall`) can operate without a full `Container` reference.

### 2. Headless Bot Environment
- **BotContext**: Define an interface that provides `BotEventHandler` with necessary dependencies (Table, Rules, Score reporting) without bringing in the whole `Container`.
- **Internal Simulation**: The bot should maintain its own internal `Table` state. When it receives a `HitEvent`, it should run a "headless" simulation to generate the `outcome` itself, mimicking an independent remote player.

### 3. Worker Communication Protocol
- **Entry Point**: Create `src/network/bot/bot.worker.ts`.
- **Message Handling**:
    - The worker listens for `message` events containing serialized `GameEvent` strings.
    - It updates its internal `Table` and `Rules` based on these events.
    - When it is the bot's turn (e.g., receiving `StartAimEvent`), it calculates the shot and posts a `HitEvent` back to the main thread.
- **Lifecycle**: The worker should handle its own initialization (e.g., setting up the specific rule set).

### 4. Implementation of `WorkerBotRelay`
- **Class**: Create `src/network/bot/workerbotrelay.ts` implementing `MessageRelay`.
- **Worker Management**: This class will instantiate the `Worker` and handle the `postMessage` / `onmessage` bridge.
- **Compatibility**: It will be a drop-in replacement for `BotRelay` in `BrowserContainer.initBotMode`.

### 5. Build Pipeline Updates
- **Webpack Configuration**: Update `webpack.config.js` to support Web Workers. Since the project uses Webpack 5, the `new Worker(new URL('./bot.worker.ts', import.meta.url))` syntax is preferred.
- **Transpilation**: Ensure `swc-loader` correctly handles the worker entry point.

### 6. Verification & Testing
- **Unit Tests**: Add tests for the "headless" mode of `Table` and `Ball`.
- **Integration Tests**: Verify the serialization/deserialization of events between the main thread and the worker.
- **Bot Behavior**: Ensure the bot's decision-making remains consistent with the current implementation.
