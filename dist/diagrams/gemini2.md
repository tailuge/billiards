Okay, let's break this Python code down and convert it into a more modular and readable TypeScript implementation. We'll focus on creating classes for better organization.

```typescript
// Import necessary math functions from a math library
import {
    Vector3,
    angle,
    coordinateRotation,
    surfaceVelocity,
    norm3d,
    unitVector,
    cross,
  } from "./ptmath"; // Assuming you have a ptmath.ts with these

//Constants.ts
export const EPS = 1e-6;

// datatypes.ts
export interface BallParams {
    R: number;
    u_b: number;
    e_b: number;
  }
  
export interface BallState {
    rvw: [Vector3, Vector3, Vector3]; // Position, velocity, angular velocity
    motionType: string
  }
  
export interface Ball {
    params: BallParams;
    state: BallState;
  }

//CollisionResolver.ts
export class CollisionResolver {
    protected unitX: Vector3 = [1.0, 0.0, 0.0];

    /**
     * Resolves the collision between two balls.
     * @param {Ball} ball1 - The first ball.
     * @param {Ball} ball2 - The second ball.
     * @returns {[Ball, Ball]} - The updated balls after the collision.
     */
    public solve(ball1: Ball, ball2: Ball): [Ball, Ball] {
        const rvw1 = [...ball1.state.rvw] as [Vector3,Vector3,Vector3];
        const rvw2 = [...ball2.state.rvw] as [Vector3,Vector3,Vector3];
        const radius = ball1.params.R;
        const frictionCoefficient = (ball1.params.u_b + ball2.params.u_b) / 2;
        const restitutionCoefficient = (ball1.params.e_b + ball2.params.e_b) / 2;

        const [rvw1_f, rvw2_f] = this.resolveBallBall(
            rvw1,
            rvw2,
            radius,
            frictionCoefficient,
            restitutionCoefficient
        );
         ball1.state = {rvw: rvw1_f, motionType: "sliding"};
         ball2.state = {rvw: rvw2_f, motionType: "sliding"};

        return [ball1, ball2];
    }
    /**
     * Core logic to resolve ball-ball collision
     * @param rvw1 - rvw of the first ball
     * @param rvw2 - rvw of the second ball
     * @param R - radius of the ball
     * @param u_b - friction coefficient
     * @param e_b - restitution coefficient
     * @returns A tuple of the final rvws of the balls
     */
    protected resolveBallBall(
        rvw1: [Vector3, Vector3, Vector3],
        rvw2: [Vector3, Vector3, Vector3],
        R: number,
        u_b: number,
        e_b: number
    ): [ [Vector3, Vector3, Vector3], [Vector3, Vector3, Vector3]] {
        // Rotate the x-axis to be in line with the line of centers
        const deltaCenters: Vector3 = [
            rvw2[0][0] - rvw1[0][0],
            rvw2[0][1] - rvw1[0][1],
            rvw2[0][2] - rvw1[0][2],
        ];
        const theta = angle(deltaCenters, this.unitX);

        rvw1[1] = coordinateRotation(rvw1[1], -theta);
        rvw1[2] = coordinateRotation(rvw1[2], -theta);
        rvw2[1] = coordinateRotation(rvw2[1], -theta);
        rvw2[2] = coordinateRotation(rvw2[2], -theta);

        const rvw1_f = [...rvw1] as [Vector3, Vector3, Vector3];
        const rvw2_f = [...rvw2] as [Vector3, Vector3, Vector3];

        // Velocity normal component, same for both slip and no-slip after collison cases
        const v1_n_f = 0.5 * ((1.0 - e_b) * rvw1[1][0] + (1.0 + e_b) * rvw2[1][0]);
        const v2_n_f = 0.5 * ((1.0 + e_b) * rvw1[1][0] + (1.0 - e_b) * rvw2[1][0]);
        const D_v_n_magnitude = Math.abs(v2_n_f - v1_n_f);

        // Angular velocity normal component, unchanged
        const w1_n_f = rvw1[2][0];
        const w2_n_f = rvw2[2][0];

        // Discard normal components for now so that surface velocities are tangent
        rvw1[1][0] = 0.0;
        rvw1[2][0] = 0.0;
        rvw2[1][0] = 0.0;
        rvw2[2][0] = 0.0;
        rvw1_f[1][0] = 0.0;
        rvw1_f[2][0] = 0.0;
        rvw2_f[1][0] = 0.0;
        rvw2_f[2][0] = 0.0;

        const v1_c = surfaceVelocity(rvw1, this.unitX, R);
        const v2_c = surfaceVelocity(rvw2, [-this.unitX[0], -this.unitX[1], -this.unitX[2]], R);
        const v12_c = [v1_c[0] - v2_c[0], v1_c[1] - v2_c[1], v1_c[2]-v2_c[2]] as Vector3;
        const hasRelativeVelocity = norm3d(v12_c) > EPS;

        let v12_c_slip : Vector3 = [0,0,0];
        // If there is no relative surface velocity to begin with,
        // don't bother calculating slip condition
        if (hasRelativeVelocity) {
            // tangent components for slip condition
            const v12_c_hat = unitVector(v12_c);
            const D_v1_t = [
              u_b * D_v_n_magnitude * -v12_c_hat[0],
              u_b * D_v_n_magnitude * -v12_c_hat[1],
              u_b * D_v_n_magnitude * -v12_c_hat[2],
            ] as Vector3;
            const D_w1 = cross(this.unitX, D_v1_t).map(x=>2.5/R*x) as Vector3;
            rvw1_f[1] = [rvw1[1][0] + D_v1_t[0], rvw1[1][1] + D_v1_t[1], rvw1[1][2] + D_v1_t[2]];
            rvw1_f[2] = [rvw1[2][0] + D_w1[0], rvw1[2][1] + D_w1[1], rvw1[2][2] + D_w1[2]];
            rvw2_f[1] = [rvw2[1][0] - D_v1_t[0], rvw2[1][1] - D_v1_t[1], rvw2[1][2] - D_v1_t[2]];
            rvw2_f[2] = [rvw2[2][0] + D_w1[0], rvw2[2][1] - D_w1[1], rvw2[2][2] + D_w1[2]];

           // Calculate new relative contact velocity
            const v1_c_slip = surfaceVelocity(rvw1_f, this.unitX, R);
            const v2_c_slip = surfaceVelocity(rvw2_f, [-this.unitX[0], -this.unitX[1], -this.unitX[2]], R);
             v12_c_slip = [
              v1_c_slip[0] - v2_c_slip[0],
              v1_c_slip[1] - v2_c_slip[1],
               v1_c_slip[2] - v2_c_slip[2]
              ] as Vector3;

          
        }
        // If there was no relative velocity to begin with, or if slip changed directions,
        // then slip condition is invalid so we need to calculate no-slip condition
        if (!hasRelativeVelocity || (v12_c[0]* v12_c_slip[0] + v12_c[1]*v12_c_slip[1]+v12_c[2]*v12_c_slip[2] <= 0) ){
            // Velocity tangent component for no-slip condition
           const D_v1_t_x = (-(1.0 / 9.0) * (
                2.0 * (rvw1[1][0] - rvw2[1][0])
                + R * (2.0 * rvw1[2][1] + 7.0 * rvw2[2][1])
            ))
             const D_v1_t_y = (-(1.0 / 9.0) * (
              2.0 * (rvw1[1][1] - rvw2[1][1])
              + R * (-2.0 * rvw1[2][0] - 7.0 * rvw2[2][0])
              ))
            const D_v1_t:Vector3 = [D_v1_t_x,D_v1_t_y, 0];


            const D_w1_x = (5.0 / 9.0) * (
                rvw2[2][0] - rvw1[2][0] + (rvw2[1][1] - rvw1[1][1]) / R
              )
            const D_w1_y = (5.0 / 9.0) * (
                rvw2[2][1] - rvw1[2][1] - (rvw2[1][0] - rvw1[1][0]) / R
            )
              
            const D_w1 : Vector3 = [D_w1_x,D_w1_y,0]

            rvw1_f[1] = [rvw1[1][0] + D_v1_t[0], rvw1[1][1] + D_v1_t[1], rvw1[1][2] + D_v1_t[2]];
            rvw1_f[2] = [rvw1[2][0] + D_w1[0], rvw1[2][1] + D_w1[1], rvw1[2][2] + D_w1[2]];
            rvw2_f[1] = [rvw2[1][0] - D_v1_t[0], rvw2[1][1] - D_v1_t[1], rvw2[1][2] - D_v1_t[2]];
            rvw2_f[2] = [rvw2[2][0] + D_w1[0], rvw2[2][1] - D_w1[1], rvw2[2][2] + D_w1[2]];
        }
        // Reintroduce the final normal components
        rvw1_f[1][0] = v1_n_f;
        rvw2_f[1][0] = v2_n_f;
        rvw1_f[2][0] = w1_n_f;
        rvw2_f[2][0] = w2_n_f;
        
        // Rotate everything back to the original frame
        rvw1_f[1] = coordinateRotation(rvw1_f[1], theta);
        rvw1_f[2] = coordinateRotation(rvw1_f[2], theta);
        rvw2_f[1] = coordinateRotation(rvw2_f[1], theta);
        rvw2_f[2] = coordinateRotation(rvw2_f[2], theta);
       

        // remove any z velocity components from spin-induced throw
        rvw1_f[1][2] = 0.0;
        rvw2_f[1][2] = 0.0;

        return [rvw1_f, rvw2_f];
    }
}

```

**Explanation of Changes and Improvements:**

1.  **Modularity:**
    *   We've created a `CollisionResolver` class, encapsulating the collision logic. This makes it easier to manage and reuse this specific physics simulation.
2.  **Readability:**
    *   **Meaningful Names:** Variable names like `frictionCoefficient`, `restitutionCoefficient`, `deltaCenters`, and `hasRelativeVelocity` make the code much more self-documenting.
    *   **Constants:** EPS is now a constant.

3.  **Maintainability:**
    *   **Class Structure:** The `CollisionResolver` class structure isolates collision logic, allowing for easier modifications or extensions in the future (e.g., adding different collision models).
    *   **Clear Type Definitions:** Interface `BallParams`, `BallState`, `Ball` help enforce type safety
4.  **TypeScript Conversion:**
    *   **Types:** All variables now have explicit types, making the code more robust.
    *   **Vector3:** We've used `Vector3` from our assumed `ptmath.ts` for clear representation of 3D vectors.
    *   **Tuple Return:** We keep the tuple return type for clarity.

**Assumptions and Considerations:**

*   **`ptmath.ts`:**  I've assumed you have a `ptmath.ts` file (or similar) that provides the vector math functions (`angle`, `coordinateRotation`, `surfaceVelocity`, `norm3d`, `unitVector`, `cross`). You will need to implement these functions in TypeScript based on your original Python implementation.  You can add the following to a file called `ptmath.ts` if you wish:
    ```typescript
    export type Vector3 = [number, number, number];
    
    export function angle(vec1: Vector3, vec2: Vector3): number {
    const dotProduct = vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
    const magnitude1 = Math.sqrt(vec1[0] * vec1[0] + vec1[1] * vec1[1] + vec1[2] * vec1[2]);
    const magnitude2 = Math.sqrt(vec2[0] * vec2[0] + vec2[1] * vec2[1] + vec2[2] * vec2[2]);
        if (magnitude1 === 0 || magnitude2 === 0) {
        return 0; // Or throw an error if that's more appropriate
        }
        return Math.acos(dotProduct / (magnitude1 * magnitude2));
    }

     export function coordinateRotation(vec: Vector3, theta: number): Vector3 {
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        return [
            vec[0] * cosTheta - vec[1] * sinTheta,
            vec[0] * sinTheta + vec[1] * cosTheta,
            vec[2]
        ];
      }
      
    export function surfaceVelocity(rvw: [Vector3, Vector3, Vector3], normal: Vector3, R: number): Vector3 {
      return [
        rvw[1][0] + R * (rvw[2][1] * normal[2] - rvw[2][2] * normal[1]),
        rvw[1][1] + R * (rvw[2][2] * normal[0] - rvw[2][0] * normal[2]),
        rvw[1][2] + R * (rvw[2][0] * normal[1] - rvw[2][1] * normal[0])
      ];
    }
      
    export function norm3d(vec: Vector3): number {
      return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    }

    export function unitVector(vec: Vector3): Vector3 {
        const magnitude = norm3d(vec);
        if (magnitude === 0) {
          return [0, 0, 0];
        }
        return [vec[0] / magnitude, vec[1] / magnitude, vec[2] / magnitude];
      }
    
    export function cross(vec1: Vector3, vec2: Vector3): Vector3 {
        return [
          vec1[1] * vec2[2] - vec1[2] * vec2[1],
          vec1[2] * vec2[0] - vec1[0] * vec2[2],
          vec1[0] * vec2[1] - vec1[1] * vec2[0],
        ];
      }

    ```
*   **Error Handling:** The code does not include any error handling for brevity. You may want to add checks to avoid potential runtime errors.
*   **Performance:**  The Python code used `numba` for potential speed enhancements. In this TypeScript conversion, we are using JavaScript math functions that are expected to be fast enough for most use cases.
*   **3D:** This implementation keeps the 2D logic of the original Python code.  If the original code had 3D functionality you would need to implement the correct cross product, coordinate rotation, and other vector math to support full 3D.

**How to use:**

```typescript
//Example Usage
import { Ball, BallParams, BallState } from "./datatypes";
import { CollisionResolver } from "./CollisionResolver";
const ball1Params : BallParams = {R: 1, u_b: 0.1, e_b: 0.9};
const ball2Params : BallParams = {R: 1, u_b: 0.1, e_b: 0.9};

const ball1State : BallState = {rvw: [[0,0,0],[1,0,0],[0,0,0]], motionType: "sliding"};
const ball2State : BallState = {rvw: [[2,0,0],[-1,0,0],[0,0,0]], motionType: "sliding"};


let ball1 : Ball = {params: ball1Params, state: ball1State};
let ball2 : Ball = {params: ball2Params, state: ball2State};


const resolver = new CollisionResolver();
[ball1, ball2] = resolver.solve(ball1, ball2);

console.log(ball1.state); // Now with the post-collision state.
console.log(ball2.state);
```

This refactored TypeScript code should be more robust, easier to understand, and simpler to modify in the future. Remember to adapt the `ptmath.ts` file to your project as necessary.
