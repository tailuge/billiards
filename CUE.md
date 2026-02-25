# Plan: Switch from Primitive Cue to GLTF Model

## Summary

Replace the primitive cylinder-based cue mesh with the loaded `cue.gltf` model while preserving aiming behavior.

## Current Implementation Analysis

### Primitive Cue (`src/view/cuemesh.ts:93-113`)

The current cue is built from a `CylinderGeometry` with these transforms applied:

```javascript
const geometry = new CylinderGeometry(tip, but, length, 11);
mesh.geometry
  .applyMatrix4(new Matrix4().makeRotationAxis(new Vector3(1, 0, 0), -tilt)) // tilt = 0.17 rad
  .applyMatrix4(new Matrix4().makeRotationAxis(up, -Math.PI / 2)) // up = (0,0,1)
  .applyMatrix4(
    new Matrix4().makeTranslation(
      -length / 2 - R,
      0,
      (length / 2) * sin(tilt) + R * 0.25,
    ),
  );
```

**Resulting orientation:**

- Points in **+X direction** (along the aim direction when angle=0)
- Tip is positioned at `(-R, 0, tipHeight)` relative to mesh origin
- Has a ~10° downward tilt toward the ball (butt higher than tip)

### GLTF Model (`dist/models/cue.gltf`)

The model has:

- Base: Cylinder along Z axis
- Node rotation: quaternion `[0, 0.707, 0, 0.707]` = 90° around Y
- Scale: `[0.2, 0.2, 12]`
- Loaded with scale multiplier `R/0.5`

**Resulting orientation after load:**

- Points in **+X direction** (same as primitive)
- Pivot at center of model
- No tilt applied
- Uniform thickness (no taper like primitive)

### Aiming Rotation (`src/view/cue.ts:39-44`)

```javascript
this.mesh.rotation.z = this.aim.angle;
```

Rotation is around Z axis (up vector). The cue rotates in the XY plane to aim.

## Key Differences to Address

| Aspect    | Primitive         | GLTF Model |
| --------- | ----------------- | ---------- |
| Direction | +X                | +X (same)  |
| Tilt      | ~10° downward     | None       |
| Pivot     | Near tip          | At center  |
| Taper     | Yes (tip thinner) | Uniform    |

## Toggle Flag

Add a boolean flag to easily switch between old and new implementations during development:

```typescript
// In CueMesh or a config file
static USE_GLTF_CUE = false  // Toggle to switch between primitive and GLTF cue
```

This allows easy comparison and rollback during development.

## Phased Implementation

### Phase 1: Display GLTF Cue As-Is

**Goal:** Show the loaded GLTF cue without any modifications, just to verify it loads and displays.

**Changes:**

1. Add `USE_GLTF_CUE` flag to `CueMesh`
2. In `createCue()`, return `CueMesh.mesh.clone()` when flag is true
3. Keep all existing positioning/rotation logic unchanged

**Verification:**

- Cue appears in scene (likely wrong position/orientation)
- Model materials render correctly
- No errors in console

### Phase 2: Fix Rotation for Aiming

**Goal:** Make the cue rotate correctly when aiming.

**Analysis needed:**

- GLTF model after load: points in +X direction (same as primitive)
- Primitive applies aim rotation via `mesh.rotation.z = this.aim.angle`
- Need to verify GLTF model responds the same way

**Changes:**

1. If needed, adjust initial model rotation so it responds correctly to `rotation.z` aiming
2. May need to apply baked-in rotation to the mesh's geometry

**Verification:**

- Cue rotates around Z axis when aiming
- Cue points toward target angle

### Phase 3: Apply Tilt

**Goal:** Apply the ~10° tilt (butt higher than tip) to match primitive behavior.

**Changes:**

1. Apply rotation around Y axis after aiming rotation
2. Need to determine correct sign (+tilt or -tilt)

**Verification:**

- Cue butt is higher than tip
- Tilt is preserved during aiming rotation

## Implementation Steps (Detailed)

### Step 1: Add Toggle Flag

```typescript
// src/view/cuemesh.ts
export class CueMesh {
  static USE_GLTF_CUE = false; // Set to true to test GLTF model
  static mesh: Mesh;
  // ...
}
```

### Step 2: Modify `createCue()` with Conditional Logic

```typescript
static createCue(tip, but, length): Mesh {
  if (this.USE_GLTF_CUE && this.mesh) {
    const mesh = this.mesh.clone()
    mesh.castShadow = false
    return mesh
  }
  // Existing primitive implementation...
}
```

### Step 3: Phase 1 Testing

Run `yarn serve`, set `USE_GLTF_CUE = true`, verify cue loads and displays.

### Step 4: Phase 2 - Fix Aiming Rotation

After confirming the model loads, test if `rotation.z` works for aiming. If the cue rotates incorrectly:

```typescript
// Option A: Bake rotation into geometry
mesh.geometry.rotateY(Math.PI / 2); // or whatever adjustment needed

// Option B: Use a parent group for aiming
const group = new THREE.Group();
group.add(mesh);
// Apply rotation.z to group, not mesh
```

### Step 5: Phase 3 - Apply Tilt

```typescript
// After Phase 2 is working
mesh.rotation.y = 0.17; // or -0.17, test both
```

## Loading Order Consideration

The cue mesh is created in `Table.cue = new Cue()` which happens in `container.ts:92`:

```typescript
this.table = this.rules.table();
```

The assets load asynchronously in `Assets.loadFromWeb()` and set `CueMesh.mesh` after load.

**Solution:** Use the fallback pattern - if `CueMesh.mesh` is null (not loaded yet), use primitive. When `USE_GLTF_CUE = true` and mesh is available, use GLTF.

## Files to Modify

1. **`src/view/cuemesh.ts`** - Add toggle flag and modify `createCue()` to conditionally use GLTF model
2. **`src/view/cue.ts`** - May need to adjust position calculations in `moveTo()` after Phase 3

## Testing

1. Run `yarn test` to verify existing tests pass after each phase
2. Visual verification in browser:
   - Phase 1: Cue appears in scene
   - Phase 2: Cue rotates correctly when aiming
   - Phase 3: Cue has correct tilt angle
