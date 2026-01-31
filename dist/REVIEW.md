Change summary: Refactoring of Container class's relay
  property, explicit typing for Ball label, and a type
  assertion workaround in ballmaterialfactory.
  tsconfig.json now skips library type checks.

  File: src/container/container.ts
  L11: [LOW] Explicit nullable type for relay is a good
  practice.
  Changing relay?: MessageRelay to relay: MessageRelay |
  null = null improves type clarity by explicitly
  stating that relay can be null and initializes it as
  such, which is often preferred over undefined for
  optional properties.

  L16: [LOW] Explicit nullable type for relay in
  constructor improves clarity.
  Aligning the constructor parameter type relay:
  MessageRelay | null = null with the class property
  type enhances type consistency and readability.

  L20: [LOW] Consistent use of this.relay for
  initialization.
  Using this.relay instead of the local parameter relay
  ensures that the LobbyIndicator is always initialized
  with the Container's relay instance, maintaining
  consistency within the class.

  File: src/model/ball.ts
  L29: [LOW] Explicit nullable type for label.
  Changing readonly label?: number to readonly label:
  number | undefined explicitly indicates that the label
  property can be undefined, which is a minor type
  clarification that improves readability and
  maintainability.

  File: src/utils/rack.ts
  L48: [LOW] Explicit optional parameter for cueBall
  method.
  Adding label?: number to the cueBall method signature
  clarifies that the label parameter is optional,
  aligning with the Ball constructor's updated type
  definition.

  File: src/view/ballmaterialfactory.ts
  L1: [MEDIUM] Removed Shader import due to type issues.
  The removal of Shader from the import list suggests a
  potential issue with its type definition in three.js.

  L43: [MEDIUM] Type assertion to any for shader
  parameter reduces type safety.
  Changing shader: Shader to shader: any is a workaround
  that bypasses TypeScript's type checking. While it
  might resolve immediate compilation issues, it
  sacrifices type safety, making it harder to catch
  potential errors during development. A more robust
  solution would involve accurately typing the shader
  parameter or creating a proper interface if three.js's
  Shader type is insufficient.

  File: tsconfig.json
  L25: [MEDIUM] skipLibCheck can hide type errors in
  third-party libraries.
  Setting "skipLibCheck": true can suppress
  type-checking errors in declaration files (.d.ts) of
  installed libraries. While it can speed up compilation
  and resolve conflicts with third-party types, it means
  that legitimate type inconsistencies or bugs in those
  libraries will go unnoticed by the TypeScript
  compiler, potentially leading to runtime issues. It's
  generally advisable to keep this option false unless
  specific library conflicts cannot be resolved
  otherwise, or if the risk is understood and accepted.

  
✦ Change summary: Refactoring of Container class's relay
  property, explicit typing for Ball label, and a type
  assertion workaround in ballmaterialfactory.
  tsconfig.json now skips library type checks.

  File: src/container/container.ts
  L11: [LOW] Explicit nullable type for relay is a good
  practice.
  Changing relay?: MessageRelay to relay: MessageRelay |
  null = null improves type clarity by explicitly
  stating that relay can be null and initializes it as
  such, which is often preferred over undefined for
  optional properties.

  L16: [LOW] Explicit nullable type for relay in
  constructor improves clarity.
  Aligning the constructor parameter type relay:
  MessageRelay | null = null with the class property
  type enhances type consistency and readability.

  L20: [LOW] Consistent use of this.relay for
  initialization.
  Using this.relay instead of the local parameter relay
  ensures that the LobbyIndicator is always initialized
  with the Container's relay instance, maintaining
  consistency within the class.
