# Physics Constants Comparison

This document highlights the differences between the physics constants provided in the URL and the default values used in the three-cushion billiards simulation.

| Parameter | URL Value | Default Value | Difference |
| :--- | :--- | :--- | :--- |
| `mu` (Rolling Friction) | **0.00555** | 0.0055 | +0.00005 (Higher friction) |
| `muS` (Sliding Friction) | **0.1256** | 0.126 | -0.0004 (Lower friction) |
| `μs` (Table Friction - Mathavan) | 0.2 | 0.2 | None |
| `μw` (Cushion Friction - Mathavan) | 0.2 | 0.2 | None |
| `ee` (Restitution - Mathavan) | 0.85 | 0.85 | None |
| `stronge_omega_ratio` | 1.76 | 1.76 | None |
| `stronge_e_n` | 0.77 | 0.77 | None |
| `stronge_μ` | 0.25 | 0.25 | None |

## Summary of Changes

The provided URL mostly uses the standard default constants for the three-cushion game. However, there are two minor adjustments:
- **Rolling Friction (`mu`)**: Increased from `0.0055` to `0.00555`. This will cause balls to slow down slightly faster when rolling.
- **Sliding Friction (`muS`)**: Decreased from `0.126` to `0.1256`. This will cause balls to slide slightly longer before they start rolling.
