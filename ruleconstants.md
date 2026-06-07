# Rule-Specific Physics and Cushion Model Selection

## Overview
Currently, the physics engine uses a global set of constants in `src/model/physics/constants.ts` and defaults to the `bounceHanBlend` cushion model in `Table.ts`. Different billiard games (Pool, Snooker, Three-Cushion) require different physical behaviors (e.g., cloth friction, cushion restitution, and different contact models) to be realistic.

This plan outlines how to decouple these settings and apply them per rule type.

## 1. Update `Rules` Interface
Add optional properties/methods to the `Rules` interface in `src/controller/rules/rules.ts` to define the physics environment:

```typescript
export interface Rules {
  // ... existing methods
  readonly cushionModel?: (v: Vector3, w: Vector3) => { v: Vector3; w: Vector3 };
  configurePhysics?(): void;
}
```

## 2. Rule-Specific Implementations

### Three-Cushion Billiards
Three-Cushion uses heated slate and specific rubber, often modeled using the Mathavan approach.
- **Model**: `mathavanAdapter` from `src/model/physics/physics.ts`.
- **Constants**:
  - `ee` (Restitution): ~0.85
  - `μs` (Table Friction): ~0.2
  - `μw` (Cushion Friction): ~0.2
- **Implementation**:
  ```typescript
  // src/controller/rules/threecushion.ts
  readonly cushionModel = mathavanAdapter;
  configurePhysics() {
    setee(0.85);
    setμs(0.2);
    setμw(0.2);
  }
  ```

### Nine-Ball / Eight-Ball (Pool)
Standard pool uses the Han model with moderate friction.
- **Model**: `bounceHanBlend` (Current default).
- **Constants**:
  - `muS` (Sliding Friction): 0.126
  - `mu` (Rolling Friction): 0.0055
- **Implementation**:
  ```typescript
  // src/controller/rules/nineball.ts
  readonly cushionModel = bounceHanBlend;
  configurePhysics() {
    setmuS(0.126);
    setmu(0.0055);
  }
  ```

### Snooker
Snooker uses different cloth and smaller, lighter balls.
- **Model**: `bounceHanBlend` or `strongeAdapter`.
- **Implementation**:
  ```typescript
  // src/controller/rules/snooker.ts
  configurePhysics() {
    // Apply Snooker-specific friction/restitution constants
  }
  ```

## 3. Integration in `RuleFactory`
The `RuleFactory` should trigger the physics configuration when a rule instance is created.

```typescript
// src/controller/rules/rulefactory.ts
static create(ruletype, container): Rules {
  let rules: Rules;
  switch (ruletype) {
    case "threecushion": rules = new ThreeCushion(container); break;
    // ...
  }
  if (rules.configurePhysics) {
    rules.configurePhysics();
  }
  return rules;
}
```

## 4. Dynamic Model Selection in `Table`
Update `Table.ts` to adopt the model specified by the rules rather than defaulting to `bounceHanBlend`.

```typescript
// src/model/table.ts
constructor(balls: Ball[], rules?: Rules) {
  this.cushionModel = rules?.cushionModel ?? bounceHanBlend;
  // ...
}
```

## 5. Global Constant Management
Since `src/model/physics/constants.ts` uses exported `let` variables, the `configurePhysics()` methods in rules implementations will use the existing `set*` functions (e.g., `setee`, `setmuS`) to update the simulation parameters. This ensures that the physics worker and the main thread stay synchronized when a new game type is initialized.
