# Three-Cushion Practice Support Plan (Simplified)

This document outlines how to enable ball positioning for Three-Cushion billiards by leveraging the existing "Set and Play" infrastructure used by Nine-Ball.

## 1. How Nine-Ball Initialises Positions
Nine-Ball (and Eight-Ball) supports a "Practice" mode where ball positions are defined via URL query parameters. This is handled by a utility method in `src/utils/rack.ts`:

```typescript
static fromInitParam(balls: Ball[]): Ball[] {
  const params = new URLSearchParams(globalThis.location?.search)
  if (!params.has("practice") || !params.has("init")) {
    return balls
  }
  const data: number[] = JSON.parse(params.get("init")!)
  balls.forEach((b, i) => {
    b.pos.x = data[i * 2]
    b.pos.y = data[i * 2 + 1]
    b.pos.z = 0
  })
  return balls
}
```

In `src/controller/rules/nineball.ts`, the `rack()` method simply wraps the default rack with this helper:
```typescript
rack(): Ball[] {
  return Rack.fromInitParam(Rack.diamond())
}
```

## 2. Using the Same Idea for Three-Cushion
To support the same feature in Three-Cushion, we do not need new racking code. We only need to update the `ThreeCushion` rule class to use the existing `fromInitParam` helper.

### Changes needed in Main Game (`src/controller/rules/threecushion.ts`):
Update the `rack()` method:
```typescript
rack(): Ball[] {
  return Rack.fromInitParam(Rack.three())
}
```

## 3. Simplified Practice Tool (`dist/diagrams/three.html`)
Instead of creating a new `practice3c.html`, we can use `dist/diagrams/three.html` as the practice tool. It already has:
- Correct **UMB table graphics**.
- **3-ball setup** (White, Yellow, Red) matching the engine's IDs.
- **Draggable balls**, **spin selection**, and **aiming**.

### Changes needed in Practice Tool:
Add a "Play" button to the UI that redirects the user to the main game. The logic would be:

```javascript
document.getElementById("playBtn").onclick = () => {
  // 1. Flatten current positions (0: white, 1: yellow, 2: red)
  // 2. Negate X to match the 3D engine's coordinate system
  const coords = tableBalls.flatMap(b => [round6(-b.x), round6(b.y)]);

  const url = new URL("../index.html", window.location.href);
  url.searchParams.set("ruletype", "threecushion");
  url.searchParams.set("practice", "true");
  url.searchParams.set("init", JSON.stringify(coords));

  window.location.href = url.toString();
};
```

## 4. Integration Summary
With these two minimal changes:
1. A user goes to `three.html`, sets up a shot (including spin and aim).
2. They click "Play", which sends the positions to `index.html`.
3. The `ThreeCushion` controller receives the positions via `Rack.fromInitParam` and starts the game with that exact layout.
