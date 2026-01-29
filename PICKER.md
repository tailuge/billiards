# PICKER.md - Icosahedron Color Picker Documentation

## Overview

This document provides key information for AI agents working with the `dist/picker.html` file, which is an interactive 3D icosahedron coloring application.

## File Location

- **Primary File**: `./dist/picker.html`
- **External Dependency**: Three.js r128 (loaded from CDN)

## Application Architecture

### Core Components

1. **Three.js Scene Setup**
   - Uses `THREE.Scene`, `THREE.PerspectiveCamera`, `THREE.WebGLRenderer`
   - Spherical camera positioning using `cameraDistance`, `cameraTheta`, `cameraPhi`
   - Default camera distance: 5 units

2. **Icosahedron Mesh**
   - Created with `THREE.IcosahedronGeometry(radius=2, detailLevel)`
   - Detail levels: 0-3 (controlled by slider)
   - Uses vertex colors for face coloring
   - Material: `THREE.MeshPhongMaterial` with `flatShading: true`

3. **State Management**
   ```javascript
   state = {
       mode: 'rotate' | 'paint',
       selectedColor: string (hex),
       detailLevel: number (0-3),
       triangleColors: { [faceIndex]: colorHex },
       hoveredFace: number | null,
       originalColor: null
   }
   ```

### User Interactions

#### Rotate Mode
- **Mouse/Touch Drag**: Rotates the icosahedron
  - Horizontal drag: Rotates around Y-axis (theta)
  - Vertical drag: Rotates around X-axis (phi)
  - Rotation direction follows drag direction (natural feel)
- **Mouse Wheel**: Zoom in/out
  - Range: 3 to 15 units
  - Scroll up: Zoom in (decrease distance)
  - Scroll down: Zoom out (increase distance)

#### Paint Mode
- **Click/Tap**: Paints the clicked face with selected color
- **Hover**: Highlights face with brighter version of current color
- Color picker allows any hex color selection

### Camera System

The camera uses spherical coordinates:
```javascript
camera.position.x = cameraDistance * Math.sin(cameraPhi) * Math.cos(cameraTheta);
camera.position.y = cameraDistance * Math.cos(cameraPhi);
camera.position.z = cameraDistance * Math.sin(cameraPhi) * Math.sin(cameraTheta);
```

**Important**: When modifying rotation, note that:
- `cameraTheta += deltaX * 0.01` (drag right = rotate right)
- `cameraPhi -= deltaY * 0.01` (drag up = rotate up)
- Phi is clamped between 0.1 and π-0.1 to prevent gimbal lock

### Face Coloring System

The icosahedron uses non-indexed geometry where each face has 3 vertices:
- Face index = `intersect.faceIndex` from raycaster
- Each face's color is stored in `state.triangleColors[faceIndex]`
- Colors are applied to all 3 vertices of a face
- Default color: `#888888` (gray)

### URL State Persistence

State is encoded in URL as base64 JSON:
- Parameter: `?s=<base64>`
- Format: `{ d: detailLevel, c: triangleColors }`
- Allows sharing colored configurations via URL

### UI Controls

1. **Mode Toggle**: Switch between Rotate and Paint modes
2. **Color Picker**: Select paint color
3. **Detail Slider**: Change subdivision level (0-3)
   - Warning: Changing detail clears all colors (face count changes)
4. **Clear/Fill Button**: Fills all faces with selected color
5. **Dev Panel**: Shows triangle list and JSON state (toggleable)

### Styling Guidelines

The UI uses a dark theme:
- Background: Gradient from `#0f0f1a` to `#16213e`
- Accent color: `#e94560` (coral/pink)
- Secondary: `#0f3460` (dark blue)
- Control groups have semi-transparent backgrounds with blur
- Buttons use gradient backgrounds and hover lift effects

### Event Handlers

Key event functions:
- `onMouseDown/Move/Up`: Mouse rotation
- `onTouchStart/Move/End`: Touch rotation and paint
- `onClick`: Paint on click
- `onWheel`: Zoom control
- `onWindowResize`: Responsive canvas

### Performance Considerations

- Detail level 3 creates many faces - may impact performance on mobile
- Vertex colors are stored in Float32Array
- Only modified geometry attributes are marked `needsUpdate = true`
- Animation loop uses `requestAnimationFrame`

### Common Modifications

#### Adding New Features
1. Add UI controls to `#controls` div
2. Add state properties to `state` object
3. Add event listeners in `setupEventListeners()`
4. Update `updateDevPanel()` if state should be visible

#### Modifying Camera Behavior
- Adjust `cameraDistance` range in `onWheel()`
- Modify rotation sensitivity by changing the `0.01` multiplier
- Change phi clamping for different vertical rotation limits

#### Adding Export/Import
- State can be serialized from `state.triangleColors`
- Use `updateURL()` pattern for encoding
- Use `loadFromURL()` pattern for decoding

### Testing Checklist

When making changes, verify:
- [ ] Rotation feels natural (drag direction matches rotation)
- [ ] Zoom works with mouse wheel
- [ ] Paint mode correctly colors faces
- [ ] Detail slider updates mesh without errors
- [ ] URL updates when painting
- [ ] State loads correctly from URL
- [ ] Mobile touch interactions work
- [ ] Responsive layout works at various screen sizes

### Dependencies

- Three.js r128 (CDN): `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
- No build step required - pure HTML/JS/CSS
- No external CSS frameworks

### Browser Compatibility

- Modern browsers with WebGL support
- Touch events for mobile
- ES6+ JavaScript features used
