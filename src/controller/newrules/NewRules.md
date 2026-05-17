# New Rules Engine Architecture

This document outlines the architecture for the stateless, parallel rule engine located in `/src/newrules`.

## Design Philosophy
- **Purely Functional:** The engine acts as a deterministic decision function: `(Table, TransientState, Outcome) => { result, nextTransientState }`.
- **Testable:** By separating state from logic, we can easily test transitions by providing snapshots of table/outcome data.
- **Stateless:** The engine does not hold internal state; it relies entirely on the `TransientState` "blob" passed by the orchestrator.
- **Separation of Concerns:** Logic transitions are clearly separated from side-effect execution (Orchestrator Commands).

## Key Design Choices
1. **Orchestrator Role:** The orchestrator (Controller/Bot) manages the `TransientState` and applies commands.
2. **Explicit Result Types:** We use `Flow` and `Action` instead of generic enums for better semantic clarity.
3. **Atomic Scoring:** `potPoints` and `foulPoints` are explicitly separated to avoid ambiguity during score updates.
4. **Game-Specific State:** Fixed state (like Three-Cushion cue ball assignment) is stored in the `TransientState.data` record.
5. **Absolute Actor References:** Engine uses `'PLAYER'` and `'OPPONENT'` to refer to outcomes relative to the participant, decoupling it from player IDs.
6. **TransientState Initialization:** The logic for initializing the `TransientState` (e.g., initial group assignment, starting cue ball) is a responsibility of the `NewRules` implementation. The mechanism for this (e.g., a constructor or an `initialize` method) remains flexible.

## Nomenclature
- **Stateless Rules:** Pure functions that take the current game state and an action, and return a transition result and the next state.
- **TransientState:** A minimal blob of data (e.g., phase, group assignment) that the engine needs to remember between shots.
- **RuleResult:** The output of a transition, containing the logic result and side-effect commands.
- **Orchestrator:** The calling code that maintains the `TransientState` and applies `RuleResult` commands.
