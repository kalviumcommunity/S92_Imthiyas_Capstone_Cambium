# Cambium Logo Mathematical & Optical Calibration Toolset
## `scripts/development/logo-calibration/`

This directory houses the one-off mathematical, geometric, and visual calibration utilities used to align, scale, and center the Cambium botanical spiral mark inside its circular viewBox and container.

### Inventory

| Script | Purpose |
| :--- | :--- |
| `calculate-optical-center.mjs` | Calculates bounding box and weighted centroid of SVG path segments. |
| `chebychev-center.mjs` | Computes Chebyshev center (center of largest inscribed sphere/circle) for the spiral curves. |
| `diagnose-logo.mjs` | Inspects viewBox dimensions, path coordinates, and whitespace padding. |
| `generate-logo-variants.mjs` | Generates calibrated candidate SVG marks for light and dark themes. |
| `test-centering.mjs` | Verifies optical center against geometric centroid. |
| `tune-optical.mjs` | Fine-tunes micro-offsets (`dx`, `dy`) for visual equilibrium. |
| `apply-logo-corrections.mjs` | Injects validated viewBox and path geometry into SVG files. |
| `verify-scale.mjs` | Verifies consistent rendering across 16px, 24px, 32px, 64px, and 128px displays. |

These scripts are retained for auditability and future brand asset generation. They are not part of routine CI/CD pipelines.

