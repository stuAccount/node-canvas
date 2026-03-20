# Repository Architecture

## Principles

- Keep frontend and backend in one repository until release cadence or ownership diverges.
- Treat the visualization protocol as the stable contract.
- Keep product code in `apps`, shared code in `packages`, and implementation-specific services in `services`.

## Current Packages

### `apps/web`

- Hosts the React workbench UI.
- Owns routing, theme mode, locale switching, and renderer composition.
- Depends on `@node-canvas/visualization-contract`.

### `packages/visualization-contract`

- Owns the `Visualization` types.
- Owns `zod` validation.
- Owns bundled demo definitions used by the frontend and tests.

## Reserved Areas

### `services/api-cpp`

- Future C++ API implementation.
- Should read or emit payloads compatible with `packages/visualization-contract`.

### `services/api-java`

- Future Java API implementation.
- Same contract requirement as the C++ service.

### `fixtures/visualizations`

- Cross-language sample payloads.
- Golden test cases for contract compatibility.

