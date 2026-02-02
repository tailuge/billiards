# Test Rack for 9-Ball Playtesting

## Purpose

The primary goal of this test rack is to facilitate rapid, two-player playtesting of the 9-ball game logic, specifically the end-of-game winning condition.

## Trigger

This special rack setup will be automatically applied when a specific username is detected during the game's initialization. This allows for easy access to the test scenario without modifying the standard game flow for regular users.

## Setup

The table will be set up in a minimal configuration:

*   **Cue Ball:** Placed in a standard starting position.
*   **9-Ball:** Positioned near a pocket to allow for an easy and immediate winning shot.
*   **Other Balls:** Only a minimal number of other balls (e.g., the 1-ball) will be placed on the table to ensure legal shots can be performed.

This setup enables quick verification of the win condition logic and the subsequent end-of-game sequence.

## Implementation Plan

The special test rack will be implemented by modifying the `rack()` method in `src/controller/rules/nineball.ts`.

1.  **Check for Test User:**
    - The `rack()` method will first retrieve the current `Session` instance using `Session.getInstance()`.
    - It will then check if `session.playername` matches a specific test username (e.g., `"playtest"`).

2.  **Conditional Rack Generation:**
    - If the `playername` matches the test username, the method will call a new private helper method, e.g., `createTestRack()`, to generate the special ball layout.
    - Otherwise, it will proceed with the standard `Rack.diamond()` call to create the normal nine-ball rack.



3.  **New `createTestRack()` Method:**

    - A new private method, `private createTestRack(): Ball[]`, will be added to `nineball.ts`.

    - This method will be responsible for creating and returning an array of `Ball` objects with custom positions for the minimal test setup (cue ball, 1-ball, and 9-ball near a pocket).



This approach isolates the testing logic, making it available on-demand without affecting the standard gameplay experience for other users.



## Decision Record: Trigger Mechanism



**Decision:** Use `Session.playername` detection.



**Alternatives Considered:**

*   **URL Query Parameter (e.g., `?testrack=true`):** Rejected because it would require threading configuration through `index.ts` -> `Container` -> `Rules`, modifying multiple files.

*   **Username Detection:** Selected because `Session` is already globally accessible in `NineBall.ts`, allowing for a single-file implementation.



**Safety:** To prevent regular users from accidentally triggering this mode, we will use a distinct username pattern, such as `playtest_9ball`.
