# Ball Mesh Painting Plan

The goal is to allow custom "painting" of balls by specifying the color of individual triangles (faces) in the ball geometry. This will be used to display numbers on balls for Nine-ball mode.

## 1. JSON Configuration Format

Each numbered ball will have a corresponding JSON configuration file.
The format will be:

```json
[
  { "index": 0, "color": "#ffffff" },
  { "index": 1, "color": "#ffff00" },
  ...
]
```
Where `index` is the face index in the `IcosahedronGeometry(R, 1)`.

## 2. Updated `BallMesh`

- Modify `BallMesh` to accept an optional `faceColors` configuration.
- If `faceColors` is provided, `addDots` (or a new method) will use it to set vertex colors.
- Vertex colors will be applied per face (all 3 vertices of a face will have the same color).

## 3. Storage of Patterns

- Create a directory `src/view/patterns/` to store the JSON files for balls 1-15.
- These will be imported statically (as they are not to be loaded dynamically at runtime via fetch, but bundled).

## 4. Integration with Rules

- Update `Ball` and `BallMesh` constructors to handle the pattern.
- Update `Rack.diamond()` to specify which pattern to use for each ball.

## 5. Implementation Steps

1.  Create `src/view/patterns/` directory.
2.  (User will provide/generate the JSON files).
3.  Modify `src/view/ballmesh.ts` to support face-based coloring from JSON.
4.  Modify `src/model/ball.ts` to optionally take a pattern name/data.
5.  Update `src/utils/rack.ts` to assign patterns to Nine-ball balls.
